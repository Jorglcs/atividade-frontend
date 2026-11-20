export const CATEGORIAS = Object.freeze(['Literatura', 'Tecnologia', 'Ciências', 'Outros'])

const texto = (valor) => typeof valor === 'string' ? valor.trim() : ''
const anoAusente = (valor) => valor === undefined || (typeof valor === 'string' && valor.trim() === '')
const anoValido = (valor, anoAtual) => Number.isInteger(valor) && valor >= 1 && valor <= anoAtual

export function validarCadastro(campos = {}, anoAtual = new Date().getFullYear()) {
  const erros = {}
  const titulo = texto(campos.titulo)
  const autor = texto(campos.autor)

  if (!titulo || titulo.length > 120) erros.titulo = 'Informe um título entre 1 e 120 caracteres.'
  if (!autor || autor.length > 100) erros.autor = 'Informe um autor entre 1 e 100 caracteres.'
  if (!CATEGORIAS.includes(campos.categoria)) erros.categoria = 'Selecione uma categoria válida.'

  if (!anoAusente(campos.ano)) {
    const tipoAceito = typeof campos.ano === 'string' || typeof campos.ano === 'number'
    if (!tipoAceito || !anoValido(Number(campos.ano), anoAtual)) {
      erros.ano = `Informe um ano inteiro entre 1 e ${anoAtual}.`
    }
  }
  return erros
}

// Usar somente após validarCadastro retornar um mapa sem erros.
export function normalizarCadastro(campos) {
  const dados = {
    titulo: texto(campos.titulo),
    autor: texto(campos.autor),
    categoria: campos.categoria,
  }
  if (!anoAusente(campos.ano)) dados.ano = Number(campos.ano)
  return dados
}

export function ehLivroValido(valor, anoAtual = new Date().getFullYear()) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return false
  if (typeof valor.id !== 'string' || !valor.id.trim()) return false
  if (Object.keys(validarCadastro(valor, anoAtual)).length) return false
  if (Object.hasOwn(valor, 'ano') && !anoValido(valor.ano, anoAtual)) return false
  return true
}
