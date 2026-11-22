import { build, preview } from 'vite'
import react from '@vitejs/plugin-react'

await build({
  configFile: false,
  plugins: [react()],
  build: {
    outDir: 'dist-validacao',
    copyPublicDir: false,
    rolldownOptions: { input: 'validacao.html' },
  },
})
if (process.argv.includes('--servir')) {
  const servidor = await preview({ configFile: false, build: { outDir: 'dist-validacao' }, preview: { host: '127.0.0.1', port: 5174, strictPort: true } })
  console.log('Validação isolada: http://localhost:5174/validacao.html')
  for (const sinal of ['SIGINT', 'SIGTERM']) process.on(sinal, () => servidor.httpServer.close(() => process.exit(0)))
} else {
  console.log('Página gerada em dist-validacao. Para abrir o servidor de teste: npm run validar')
}
