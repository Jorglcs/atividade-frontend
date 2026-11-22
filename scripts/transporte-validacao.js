export const CHAVE_VALIDACAO = 'estante-validacao-isolada-v1'
export const MODOS_VALIDACAO = Object.freeze({
  normal: 'Respostas normais',
  'get-invalido': 'GET fora do contrato',
  'get-json-invalido': 'GET com JSON inválido',
  'get-erro': 'GET HTTP 503',
  'get-rede': 'GET com falha de rede',
  'get-lento': 'GET lento (3 segundos)',
  'post-invalido': 'POST fora do contrato',
  'post-json-invalido': 'POST com JSON inválido',
  'post-erro': 'POST HTTP 503',
  'post-rede': 'POST com falha de rede',
  'post-perdido': 'Persistir POST e perder a resposta',
  'post-lento': 'POST lento (3 segundos)',
})

const estadoInicial = () => ({ livros: [], consultas: 0, cadastros: 0, ultimoPayload: null })

export function criarTransporteValidacao({ storage, modoInicial = 'normal', atrasoMs = 3000 }) {
  let base
  try {
    base = JSON.parse(storage.getItem(CHAVE_VALIDACAO))
  } catch {
    base = null
  }
  if (!base || !Array.isArray(base.livros) || !Number.isInteger(base.consultas) || !Number.isInteger(base.cadastros)) base = estadoInicial()
  let modo = Object.hasOwn(MODOS_VALIDACAO, modoInicial) ? modoInicial : 'normal'
  const ouvintes = new Set()
  const snapshot = () => JSON.stringify({ modo, ...base }, null, 2)
  const notificar = () => { for (const ouvinte of ouvintes) ouvinte() }
  const salvar = () => { storage.setItem(CHAVE_VALIDACAO, JSON.stringify(base)); notificar() }
  const resposta = (valor, status = 200) => new Response(JSON.stringify(valor), { status, headers: { 'Content-Type': 'application/json' } })
  function aguardar(signal) {
    return new Promise((resolve, reject) => {
      const cancelar = () => { clearTimeout(timer); reject(new DOMException('Cancelado', 'AbortError')) }
      const timer = setTimeout(() => { signal?.removeEventListener('abort', cancelar); resolve() }, atrasoMs)
      if (signal?.aborted) cancelar()
      else signal?.addEventListener('abort', cancelar, { once: true })
    })
  }
  return {
    snapshot,
    subscribe(ouvinte) { ouvintes.add(ouvinte); return () => ouvintes.delete(ouvinte) },
    definirModo(novoModo) {
      if (!Object.hasOwn(MODOS_VALIDACAO, novoModo)) throw new Error('Cenário de validação desconhecido')
      modo = novoModo
      notificar()
    },
    limpar() { base = estadoInicial(); modo = 'normal'; salvar() },
    async fetch(input, init = {}) {
      if (!new URL(String(input), 'http://validacao.local').pathname.endsWith('/livros')) throw new Error('Recurso fora do transporte de validação')
      if (init.signal?.aborted) throw new DOMException('Cancelado', 'AbortError')
      const modoDaRequisicao = modo
      if (init.method !== 'POST') {
        base.consultas++
        salvar()
        if (modoDaRequisicao === 'get-lento') await aguardar(init.signal)
        if (modoDaRequisicao === 'get-rede') throw new TypeError('Falha de rede simulada')
        if (modoDaRequisicao === 'get-invalido') return resposta({ livros: [] })
        if (modoDaRequisicao === 'get-json-invalido') return new Response('{', { status: 200 })
        if (modoDaRequisicao === 'get-erro') return resposta({}, 503)
        return resposta(base.livros)
      }
      base.cadastros++
      const numeroCadastro = base.cadastros
      const payload = JSON.parse(init.body)
      base.ultimoPayload = payload
      salvar()
      if (modoDaRequisicao === 'post-rede') throw new TypeError('Falha de rede simulada')
      if (modoDaRequisicao === 'post-erro') return resposta({}, 503)
      if (modoDaRequisicao === 'post-invalido') return resposta({ id: 123 }, 201)
      if (modoDaRequisicao === 'post-json-invalido') return new Response('{', { status: 201 })
      if (modoDaRequisicao === 'post-lento') await aguardar()
      const livro = { ...payload, id: `validacao-${numeroCadastro}` }
      base.livros.push(livro)
      salvar()
      if (modoDaRequisicao === 'post-perdido') throw new TypeError('Resposta perdida após persistência simulada')
      return resposta(livro, 201)
    },
  }
}
