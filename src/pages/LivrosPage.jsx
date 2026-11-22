import { useCallback, useEffect, useRef, useState } from 'react'
import { listarLivros, cadastrarLivro } from '../api/livros.js'
import { ListaLivros } from '../components/ListaLivros.jsx'
import { EstadoListagem } from '../components/EstadoListagem.jsx'
import { FormularioLivro } from '../components/FormularioLivro.jsx'

export function LivrosPage() {
  const [livros, setLivros] = useState([])
  const [estadoConsulta, setEstadoConsulta] = useState('carregando')
  const consultaAtiva = useRef(null)

  const consultarLivros = useCallback(async () => {
    if (consultaAtiva.current) return

    const controlador = new AbortController()
    consultaAtiva.current = controlador
    setEstadoConsulta('carregando')

    try {
      const resultado = await listarLivros({ signal: controlador.signal })
      if (controlador.signal.aborted) return

      setLivros(resultado)
      setEstadoConsulta('sucesso')
    } catch {
      if (!controlador.signal.aborted) setEstadoConsulta('erro')
    } finally {
      if (consultaAtiva.current === controlador) consultaAtiva.current = null
    }
  }, [])

  useEffect(() => {
    consultarLivros()
    return () => {
      consultaAtiva.current?.abort()
      consultaAtiva.current = null
    }
  }, [consultarLivros])

  async function enviarCadastro(dados) {
    const livro = await cadastrarLivro(dados)
    setLivros((livrosAtuais) => [...livrosAtuais, livro])
  }

  const consultaConcluida = estadoConsulta === 'sucesso'

  return (
    <div className="livros-page">
      <section aria-labelledby="acervo-titulo">
        <h2 id="acervo-titulo">Acervo de livros</h2>
        <EstadoListagem
          carregando={estadoConsulta === 'carregando'}
          erro={estadoConsulta === 'erro'}
          onTentarNovamente={consultarLivros}
        />
        <div aria-live="polite">
          {consultaConcluida && <ListaLivros livros={livros} />}
        </div>
      </section>

      <section aria-labelledby="cadastro-titulo">
        <h2 id="cadastro-titulo">Cadastro de livros</h2>
        <FormularioLivro onCadastrar={enviarCadastro} indisponivel={!consultaConcluida} />
      </section>
    </div>
  )
}
