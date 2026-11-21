export function ListaLivros({ livros }) {
  if (livros.length === 0) {
    return <p className="lista-livros-vazia" role="status">Nenhum livro cadastrado.</p>
  }

  return (
    <ul className="lista-livros">
      {livros.map(({ id, titulo, autor, categoria, ano }) => (
        <li key={id} className="lista-livros__item">
          <strong className="lista-livros__titulo">{titulo}</strong>
          <p>Autor: {autor}</p>
          <p>Categoria: {categoria}</p>
          <p>{ano == null ? 'Ano não informado' : `Ano: ${ano}`}</p>
        </li>
      ))}
    </ul>
  )
}
