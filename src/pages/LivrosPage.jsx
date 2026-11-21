import React, { useState, useEffect } from 'react'
import { listarLivros, cadastrarLivro } from '../api/livros.js'
import { ListaLivros } from '../components/ListaLivros.jsx'
import { EstadoListagem } from '../components/EstadoListagem.jsx'
import { FormularioLivro } from '../components/FormularioLivro.jsx'

export function LivrosPage() {
  const [livros, setLivros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [indisponivel, setIndisponivel] = useState(true)
  const [enviandoCadastro, setEnviandoCadastro] = useState(false)

  // Função para tentar carregar livros
  const tentarCarregar = async () => {
    setCarregando(true)
    setIndisponivel(true)
    setErro(false)
    try {
      const resultado = await listarLivros()
      setLivros(resultado)
      setCarregando(false)
      setIndisponivel(false)
    } catch (erro) {
      setErro(true)
      setCarregando(false)
      setIndisponivel(true)
    }
  }

  // Efeito inicial: consultar ao montar
  useEffect(() => {
    tentarCarregar()
  }, [])

  return (
    <section>
      <h2>Acervo de Livros</h2>

      {/* Estado de consulta */}
      <EstadoListagem
        carregando={carregando}
        erro={erro}
        onTentarNovamente={tentarCarregar}
      />

      {/* Lista de livros */}
      <ListaLivros livros={livros} />

      {/* Formulário de cadastro */}
      <FormularioLivro
        onCadastrar={async (dados) => {
          setEnviandoCadastro(true)
          try {
            const livro = await cadastrarLivro(dados)
            setLivros((antigos) => [...antigos, livro])
          } catch (erro) {
            // Falha: campos preservados no formulário
          } finally {
            setEnviandoCadastro(false)
          }
        }}
        indisponivel={indisponivel || carregando || erro}
      />
    </section>
  )
}