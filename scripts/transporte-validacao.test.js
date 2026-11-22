import test from 'node:test'
import assert from 'node:assert/strict'
import { criarTransporteValidacao } from './transporte-validacao.js'
import { cadastrarLivro, listarLivros } from '../src/api/livros.js'

const campos = { titulo: ' Livro de teste ', autor: ' Autora ', categoria: 'Literatura' }
const criarStorage = () => {
  const dados = new Map()
  return { getItem: chave => dados.get(chave) ?? null, setItem: (chave, valor) => dados.set(chave, valor) }
}

test('resposta perdida rejeita cadastro, persiste uma vez e permite conferir por nova consulta', async t => {
  const storage = criarStorage()
  const transporte = criarTransporteValidacao({ storage, modoInicial: 'post-perdido' })
  t.mock.method(globalThis, 'fetch', transporte.fetch)
  await assert.rejects(cadastrarLivro(campos), /Resposta perdida/)
  const estado = JSON.parse(transporte.snapshot())
  assert.equal(estado.cadastros, 1)
  assert.equal(estado.livros.length, 1)
  assert.equal(estado.livros[0].titulo, 'Livro de teste')
  assert.equal(Object.hasOwn(estado.livros[0], 'ano'), false)

  const recarregado = criarTransporteValidacao({ storage })
  t.mock.method(globalThis, 'fetch', recarregado.fetch)
  const livros = await listarLivros()
  assert.equal(livros.length, 1)
  assert.equal(typeof livros[0].id, 'string')
  assert.equal(JSON.parse(recarregado.snapshot()).cadastros, 1)
})

test('GET inválido, JSON inválido, HTTP 503 e falha de rede são rejeitados pelo cliente real', async t => {
  for (const modoInicial of ['get-invalido', 'get-json-invalido', 'get-erro', 'get-rede']) {
    const transporte = criarTransporteValidacao({ storage: criarStorage(), modoInicial })
    t.mock.method(globalThis, 'fetch', transporte.fetch)
    await assert.rejects(listarLivros())
    transporte.definirModo('normal')
    assert.deepEqual(await listarLivros(), [])
    assert.equal(JSON.parse(transporte.snapshot()).cadastros, 0)
  }
})

test('POST inválido, JSON inválido, HTTP 503 e falha de rede não persistem registros', async t => {
  for (const modoInicial of ['post-invalido', 'post-json-invalido', 'post-erro', 'post-rede']) {
    const transporte = criarTransporteValidacao({ storage: criarStorage(), modoInicial })
    t.mock.method(globalThis, 'fetch', transporte.fetch)
    await assert.rejects(cadastrarLivro(campos))
    const estado = JSON.parse(transporte.snapshot())
    assert.equal(estado.cadastros, 1)
    assert.deepEqual(estado.livros, [])
  }
})

test('GET lento respeita cancelamento sem apresentar registros', async t => {
  const transporte = criarTransporteValidacao({ storage: criarStorage(), modoInicial: 'get-lento', atrasoMs: 1000 })
  t.mock.method(globalThis, 'fetch', transporte.fetch)
  const controlador = new AbortController()
  const consulta = listarLivros({ signal: controlador.signal })
  controlador.abort()
  await assert.rejects(consulta, { name: 'AbortError' })
  assert.deepEqual(JSON.parse(transporte.snapshot()).livros, [])
})

test('trocar modo durante POST lento não altera a resposta da requisição já iniciada', async t => {
  const transporte = criarTransporteValidacao({ storage: criarStorage(), modoInicial: 'post-lento', atrasoMs: 5 })
  t.mock.method(globalThis, 'fetch', transporte.fetch)
  const envio = cadastrarLivro({ ...campos, ano: '2008' })
  assert.equal(JSON.parse(transporte.snapshot()).livros.length, 0)
  transporte.definirModo('post-erro')
  const livro = await envio
  assert.equal(livro.ano, 2008)
  assert.equal(JSON.parse(transporte.snapshot()).livros.length, 1)
  transporte.limpar()
  assert.deepEqual(await listarLivros(), [])
})
