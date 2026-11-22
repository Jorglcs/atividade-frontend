// Entrada exclusiva da página de validação; não faz parte do build da aplicação.
import { StrictMode, useSyncExternalStore } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { criarTransporteValidacao, MODOS_VALIDACAO } from '../scripts/transporte-validacao.js'
import './styles.css'
import './validacao.css'

const transporte = criarTransporteValidacao({
  storage: localStorage,
  modoInicial: new URLSearchParams(location.search).get('modo') || 'normal',
})
const fetchOriginal = window.fetch.bind(window)
window.fetch = (input, init) => {
  const url = new URL(typeof input === 'string' ? input : input.url, location.href)
  return url.pathname.endsWith('/livros') ? transporte.fetch(url.href, init) : fetchOriginal(input, init)
}

function Validacao() {
  const evidencia = useSyncExternalStore(transporte.subscribe, transporte.snapshot)
  const { modo } = JSON.parse(evidencia)
  return (
    <>
      <aside className="validacao" aria-label="Controle da validação">
        <h2>Validação isolada</h2>
        <p>Use esta página para testar falhas. Os livros simulados ficam neste navegador; o acervo do grupo não é alterado.</p>
        <div className="validacao__controles">
          <label htmlFor="modo-validacao">Cenário</label>
          <select id="modo-validacao" value={modo} onChange={event => {
            history.replaceState(null, '', `?modo=${event.target.value}`)
            transporte.definirModo(event.target.value)
          }}>
            {Object.entries(MODOS_VALIDACAO).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
          </select>
          <button onClick={() => location.reload()}>Recarregar catálogo</button>
          <button onClick={() => { transporte.limpar(); location.search = '?modo=normal' }}>Limpar dados simulados</button>
        </div>
        <p>Após trocar o cenário, use “Tentar novamente”, envie o formulário ou recarregue a página, conforme o teste. O formulário não é apagado pela troca de cenário.</p>
        <details>
          <summary>Evidência do transporte simulado</summary>
          <pre>{evidencia}</pre>
        </details>
      </aside>
      <App />
    </>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><Validacao /></StrictMode>)
