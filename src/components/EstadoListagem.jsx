export function EstadoListagem({ carregando, erro, onTentarNovamente }) {
  if (carregando) {
    return <p className="estado-listagem" role="status">Carregando livros...</p>
  }

  if (!erro) {
    return null
  }

  return (
    <div className="estado-listagem estado-listagem--erro">
      <p role="alert">Não foi possível carregar os livros.</p>
      <button type="button" onClick={onTentarNovamente}>Tentar novamente</button>
    </div>
  )
}
