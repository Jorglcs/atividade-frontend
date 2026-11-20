import { ehLivroValido, normalizarCadastro, validarCadastro } from '../domain/livro.js'

const BASE_PADRAO = 'http://localhost:3001'
const MENSAGEM_CONSULTA = 'Não foi possível carregar os livros.'
const MENSAGEM_CADASTRO = 'Não foi possível cadastrar o livro. Tente novamente.'

function urlLivros() {
  const configurada = import.meta.env?.VITE_API_URL
  const base = typeof configurada === 'string' && configurada.trim() ? configurada.trim() : BASE_PADRAO
  return `${base.replace(/\/+$/, '')}/livros`
}

export async function listarLivros({ signal } = {}) {
  const resposta = await fetch(urlLivros(), { signal })
  if (resposta.status !== 200) throw new Error(MENSAGEM_CONSULTA)

  const dados = await resposta.json()
  if (!Array.isArray(dados) || !dados.every((livro) => ehLivroValido(livro))) {
    throw new Error(MENSAGEM_CONSULTA)
  }
  return dados
}

export async function cadastrarLivro(dados) {
  const campos = dados && typeof dados === 'object' ? dados : {}
  if (Object.keys(validarCadastro(campos)).length) throw new Error(MENSAGEM_CADASTRO)

  const resposta = await fetch(urlLivros(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizarCadastro(campos)),
  })
  if (resposta.status !== 201) throw new Error(MENSAGEM_CADASTRO)

  const livro = await resposta.json()
  if (!ehLivroValido(livro)) throw new Error(MENSAGEM_CADASTRO)
  return livro
}
