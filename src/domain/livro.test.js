import test from 'node:test'
import assert from 'node:assert/strict'
import { CATEGORIAS, validarCadastro, normalizarCadastro, ehLivroValido } from './livro.js'

const anoAtual = 2030
const campos = { titulo: ' Livro ', autor: ' Autora ', categoria: 'Literatura', ano: '' }

test('normaliza espaços, omite ano vazio e campos externos sem alterar a entrada', () => {
  const entrada = { ...campos, id: 'externo', ano: '   ' }
  assert.deepEqual(validarCadastro(entrada, anoAtual), {})
  assert.deepEqual(normalizarCadastro(entrada), { titulo: 'Livro', autor: 'Autora', categoria: 'Literatura' })
  assert.equal(entrada.titulo, ' Livro ')
  assert.equal(Object.hasOwn(normalizarCadastro({ ...campos, ano: undefined }), 'ano'), false)
})

test('aceita limites de título e autor após trim', () => {
  for (const [titulo, autor] of [['x', 'x'], ['x'.repeat(120), 'x'.repeat(100)]]) {
    assert.deepEqual(validarCadastro({ ...campos, titulo: ` ${titulo} `, autor: ` ${autor} ` }, anoAtual), {})
  }
})

test('rejeita campos ausentes, vazios, tipos inválidos e limites excedidos', () => {
  for (const [campo, limite] of [['titulo', 120], ['autor', 100]]) {
    for (const valor of [undefined, null, 42, '', '   ', 'x'.repeat(limite + 1)]) {
      assert.ok(validarCadastro({ ...campos, [campo]: valor }, anoAtual)[campo])
    }
  }
  assert.deepEqual(Object.keys(validarCadastro({}, anoAtual)).sort(), ['autor', 'categoria', 'titulo'])
})

test('aceita somente as quatro categorias do contrato', () => {
  assert.deepEqual(CATEGORIAS, ['Literatura', 'Tecnologia', 'Ciências', 'Outros'])
  for (const categoria of CATEGORIAS) assert.deepEqual(validarCadastro({ ...campos, categoria }, anoAtual), {})
  for (const categoria of ['', 'Selecione', 'literatura', null]) assert.ok(validarCadastro({ ...campos, categoria }, anoAtual).categoria)
})

test('aceita ano opcional e limites dinâmicos, normalizando para número', () => {
  for (const ano of ['1', String(anoAtual), 1, anoAtual]) {
    assert.deepEqual(validarCadastro({ ...campos, ano }, anoAtual), {})
    assert.equal(normalizarCadastro({ ...campos, ano }).ano, Number(ano))
  }
  assert.ok(validarCadastro({ ...campos, ano: 2031 }, 2030).ano)
  assert.deepEqual(validarCadastro({ ...campos, ano: 2031 }, 2031), {})
})

test('rejeita ano futuro, fracionário, não numérico, zero, negativo e tipos indevidos', () => {
  for (const ano of [anoAtual + 1, '2000.5', 1.5, 'abc', 0, '0', -1, null, true, [], {}, Infinity, NaN]) {
    assert.ok(validarCadastro({ ...campos, ano }, anoAtual).ano, `ano inválido: ${String(ano)}`)
  }
})

test('valida livros de resposta com id string e ano numérico opcional', () => {
  const livro = { id: '1', ...normalizarCadastro(campos) }
  assert.equal(ehLivroValido(livro, anoAtual), true)
  assert.equal(ehLivroValido({ ...livro, ano: anoAtual }, anoAtual), true)
  assert.equal(ehLivroValido({ ...livro, extra: 'ignorado' }, anoAtual), true)
  for (const id of [undefined, null, 1, '', '   ']) assert.equal(ehLivroValido({ ...livro, id }, anoAtual), false)
  for (const ano of [undefined, null, '', '2000', 0, anoAtual + 1]) assert.equal(ehLivroValido({ ...livro, ano }, anoAtual), false)
  for (const valor of [null, undefined, [], 'livro', { ...livro, titulo: ' ' }, { ...livro, categoria: 'inválida' }]) {
    assert.equal(ehLivroValido(valor, anoAtual), false)
  }
})
