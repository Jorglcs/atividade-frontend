import { useRef, useState } from 'react'
import { CATEGORIAS, validarCadastro, normalizarCadastro } from '../domain/livro.js'

const CAMPOS_INICIAIS = { titulo: '', autor: '', categoria: '', ano: '' }
const MSG_TITULO_INVALIDO = 'Informe um título entre 1 e 120 caracteres.'
const MSG_AUTOR_INVALIDO = 'Informe um autor entre 1 e 100 caracteres.'
const MSG_CATEGORIA_INVALIDA = 'Selecione uma categoria válida.'
const MSG_ANO_INVALIDO = 'Informe um ano inteiro entre 1 e o ano atual.'
const MSG_CADASTRO_SUCESSO = 'Livro cadastrado com sucesso.'
const MSG_CADASTRO_ERRO = 'Não foi possível cadastrar o livro. Tente novamente.'

export function FormularioLivro({ onCadastrar, indisponivel }) {
  const [campos, setCampos] = useState(CAMPOS_INICIAIS)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const envioEmAndamento = useRef(false)
  const bloqueado = indisponivel || enviando

  const handleChange = (e) => {
    const { name, value } = e.target
    setCampos({ ...campos, [name]: value })
    // Limpa erro deste campo quando o usuário digita
    if (erros[name]) {
      const novosErros = { ...erros }
      delete novosErros[name]
      setErros(novosErros)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (bloqueado || envioEmAndamento.current) return

    const errosValidacao = validarCadastro(campos)
    setErros(errosValidacao)
    setResultado(null)
    if (Object.keys(errosValidacao).length) return

    envioEmAndamento.current = true
    setEnviando(true)

    try {
      await onCadastrar(normalizarCadastro(campos))
      setCampos(CAMPOS_INICIAIS)
      setResultado('sucesso')
    } catch {
      setResultado('erro')
    } finally {
      envioEmAndamento.current = false
      setEnviando(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="formulario-livro"
      role="form"
    >
      <div className="formulario-livro__grupo">
        <label htmlFor="titulo" className="formulario-livro__label">
          Título
          <span className="formulario-livro__span-estrela">*</span>
        </label>
        <input
          type="text"
          name="titulo"
          id="titulo"
          value={campos.titulo}
          onChange={handleChange}
          disabled={bloqueado}
          className="formulario-livro__input"
          aria-invalid={!!erros.titulo}
          aria-describedby={erros.titulo ? 'titulo-erro' : undefined}
        />
        {erros.titulo && (
          <span id="titulo-erro" className="formulario-livro__erro">
            {MSG_TITULO_INVALIDO}
          </span>
        )}
      </div>

      <div className="formulario-livro__grupo">
        <label htmlFor="autor" className="formulario-livro__label">
          Autor
          <span className="formulario-livro__span-estrela">*</span>
        </label>
        <input
          type="text"
          name="autor"
          id="autor"
          value={campos.autor}
          onChange={handleChange}
          disabled={bloqueado}
          className="formulario-livro__input"
          aria-invalid={!!erros.autor}
          aria-describedby={erros.autor ? 'autor-erro' : undefined}
        />
        {erros.autor && (
          <span id="autor-erro" className="formulario-livro__erro">
            {MSG_AUTOR_INVALIDO}
          </span>
        )}
      </div>

      <div className="formulario-livro__grupo">
        <label htmlFor="categoria" className="formulario-livro__label">
          Categoria
        </label>
        <select
          name="categoria"
          id="categoria"
          value={campos.categoria}
          onChange={handleChange}
          disabled={bloqueado}
          className="formulario-livro__select"
        >
          <option value="">{'Selecione'}</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {erros.categoria && (
          <span className="formulario-livro__erro">
            {MSG_CATEGORIA_INVALIDA}
          </span>
        )}
      </div>

      <div className="formulario-livro__grupo">
        <label htmlFor="ano" className="formulario-livro__label">
          Ano
        </label>
        <input
          type="number"
          name="ano"
          id="ano"
          value={campos.ano}
          onChange={handleChange}
          disabled={bloqueado}
          className="formulario-livro__input"
          placeholder="Opcional"
          aria-invalid={!!erros.ano}
          aria-describedby={erros.ano ? 'ano-erro' : undefined}
        />
        {erros.ano && (
          <span id="ano-erro" className="formulario-livro__erro">
            {MSG_ANO_INVALIDO}
          </span>
        )}
      </div>

      <div className="formulario-livro__acao">
        <button
          type="submit"
          disabled={bloqueado}
          className="formulario-livro__botao"
        >
          {enviando ? 'Cadastrando...' : 'Cadastrar livro'}
        </button>
      </div>
      <div role="status">
        {resultado === 'sucesso' && <p>{MSG_CADASTRO_SUCESSO}</p>}
      </div>
      <div role="alert">
        {resultado === 'erro' && <p>{MSG_CADASTRO_ERRO}</p>}
      </div>
    </form>
  )
}
