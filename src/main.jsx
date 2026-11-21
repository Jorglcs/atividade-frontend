import React from 'react'
import { createRoot } from 'react-dom/client'
import { LivrosPage } from './pages/LivrosPage.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main>
      <LivrosPage />
    </main>
  </React.StrictMode>,
)
