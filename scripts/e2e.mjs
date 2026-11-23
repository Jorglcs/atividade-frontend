import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Permite usar uma instalação existente sem alterar as dependências do projeto.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core')
const pasta = await mkdtemp(join(tmpdir(), 'estante-e2e-'))
const banco = join(pasta, 'db.json')
await writeFile(banco, '{"livros":[]}')
const processos = []
const iniciar = (arquivo, args, env = {}) => {
  const processo = spawn(process.execPath, [arquivo, ...args], { env: { ...process.env, ...env }, windowsHide: true, stdio: 'pipe' })
  processos.push(processo)
  processo.stderr.on('data', chunk => process.stderr.write(chunk))
  return processo
}
const api = () => iniciar('node_modules/json-server/lib/bin.js', [banco, '--port', '3107', '--host', '127.0.0.1'])
async function pronto(url) {
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(url)).ok) return } catch {}
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error(`Servidor indisponível: ${url}`)
}
async function encerrar(processo) {
  if (processo.exitCode !== null || processo.signalCode !== null) return
  await new Promise(resolve => { processo.once('exit', resolve); processo.kill() })
}
let navegador
let passou = 0
async function caso(nome, executar) {
  await executar()
  console.log(`OK ${++passou}: ${nome}`)
}
try {
  let servidorApi = api()
  iniciar('node_modules/vite/bin/vite.js', ['--host', '127.0.0.1', '--port', '5187', '--strictPort'], { VITE_API_URL: 'http://127.0.0.1:3107' })
  await Promise.all([pronto('http://127.0.0.1:3107/livros'), pronto('http://127.0.0.1:5187')])
  navegador = await chromium.launch({ channel: process.env.E2E_BROWSER || 'chrome', headless: true })
  const pagina = await navegador.newPage()
  const erros = []
  pagina.on('pageerror', erro => { erros.push(erro.message); console.error(erro.message) })
  const campo = nome => pagina.locator(`#${nome}`)
  const enviar = () => pagina.getByRole('button', { name: 'Cadastrar livro', exact: true }).click()
  const visivel = texto => pagina.getByText(texto, { exact: true }).waitFor({ state: 'visible' })
  const preencher = async (ano = '') => {
    await campo('titulo').fill('  Mesmo título  ')
    await campo('autor').fill('  Autor  ')
    await campo('categoria').selectOption('Literatura')
    await campo('ano').fill(ano)
  }
  let posts = []
  let gets = 0
  pagina.on('request', req => {
    if (!req.url().endsWith('/livros')) return
    if (req.method() === 'POST') posts.push(req.postDataJSON())
    else gets++
  })
  await caso('Consulta pendente e acervo vazio', async () => {
    await pagina.route('**/livros', async rota => {
      await new Promise(resolve => setTimeout(resolve, 500))
      await rota.continue().catch(() => {})
    })
    await pagina.goto('http://127.0.0.1:5187')
    await visivel('Carregando livros...')
    assert.equal(await campo('titulo').isDisabled(), true)
    await visivel('Nenhum livro cadastrado.')
    assert.equal(await campo('titulo').isEnabled(), true)
    await pagina.unroute('**/livros')
  })
  await caso('Dados inválidos, limites, erros associados e foco', async () => {
    for (const dados of [ ['', '', '', 'titulo'], [' '.repeat(3), 'Autor', 'Literatura', 'titulo'], ['x'.repeat(121), 'Autor', 'Literatura', 'titulo'], ['Título', 'x'.repeat(101), 'Literatura', 'autor'], ['Título', 'Autor', '', 'categoria'] ]) {
      await campo('titulo').fill(dados[0]); await campo('autor').fill(dados[1]); await campo('categoria').selectOption(dados[2])
      await enviar()
      assert.equal(await pagina.evaluate(() => document.activeElement.id), dados[3])
      assert.equal(await campo(dados[3]).getAttribute('aria-invalid'), 'true')
      assert.ok(await campo(dados[3]).getAttribute('aria-describedby'))
    }
    assert.equal(posts.length, 0)
  })
  await caso('Ano inválido bloqueia envio e preserva valores', async () => {
    await preencher()
    for (const ano of ['0', '-1', '1.5', 'abc', String(new Date().getFullYear() + 1)]) {
      await campo('ano').fill(ano)
      await enviar()
      assert.equal(await campo('ano').getAttribute('aria-invalid'), 'true')
      assert.equal(await pagina.evaluate(() => document.activeElement.id), 'ano')
      assert.equal(await campo('ano').inputValue(), ano)
    }
    assert.equal(posts.length, 0)
  })
  await caso('Cadastro sem ano, normalização e sucesso sem novo GET', async () => {
    await preencher()
    const antes = gets
    await enviar(); await visivel('Livro cadastrado com sucesso.')
    assert.deepEqual(posts.at(-1), { titulo: 'Mesmo título', autor: 'Autor', categoria: 'Literatura' })
    assert.equal(gets, antes)
    assert.equal(await campo('titulo').inputValue(), '')
    await visivel('Ano não informado')
  })
  await caso('Envio pendente, guarda dupla, ano válido e título repetido', async () => {
    await pagina.route('**/livros', async rota => {
      await new Promise(resolve => setTimeout(resolve, 600)); await rota.continue()
    })
    await preencher('1')
    const antes = posts.length
    await pagina.locator('form').evaluate(form => { form.requestSubmit(); form.requestSubmit() })
    await visivel('Cadastrando...')
    assert.equal(await pagina.locator('form input:disabled, form select:disabled, form button:disabled').count(), 5)
    await visivel('Livro cadastrado com sucesso.')
    assert.equal(posts.length, antes + 1)
    assert.equal(posts.at(-1).ano, 1)
    assert.equal(await pagina.locator('.lista-livros__item').count(), 2)
    await pagina.unroute('**/livros')
  })
  await caso('Persistência após reinício real da API e recarga, ordem e ids string', async () => {
    await encerrar(servidorApi); servidorApi = api(); await pronto('http://127.0.0.1:3107/livros')
    await pagina.reload(); await pagina.locator('.lista-livros__item').nth(1).waitFor()
    const livros = JSON.parse(await readFile(banco, 'utf8')).livros
    assert.equal(livros.length, 2)
    assert.ok(livros.every(livro => typeof livro.id === 'string'))
    assert.equal(Object.hasOwn(livros[0], 'ano'), false)
    assert.equal(livros[1].ano, 1)
  })
  for (const modo of ['rede', 'http', 'json', 'contrato']) {
    await caso(`Falha GET ${modo} e nova tentativa sem concorrência`, async () => {
      await pagina.route('**/livros', rota => modo === 'rede' ? rota.abort('failed') : rota.fulfill({ status: modo === 'http' ? 503 : 200, contentType: 'application/json', body: modo === 'json' ? '{' : '{"invalido":true}' }))
      await pagina.reload(); await visivel('Não foi possível carregar os livros.')
      assert.equal(await campo('titulo').isDisabled(), true)
      await pagina.unroute('**/livros')
      await pagina.getByRole('button', { name: 'Tentar novamente' }).click()
      await pagina.locator('.lista-livros__item').nth(1).waitFor()
      assert.equal(await campo('titulo').isEnabled(), true)
    })
    await caso(`Falha POST ${modo}, preservação e ausência de repetição`, async () => {
      await preencher('2000')
      await pagina.route('**/livros', rota => modo === 'rede' ? rota.abort('failed') : rota.fulfill({ status: modo === 'http' ? 503 : 201, contentType: 'application/json', body: modo === 'json' ? '{' : '{"id":123}' }))
      const antes = posts.length
      await enviar(); await visivel('Não foi possível cadastrar o livro. Tente novamente.')
      assert.equal(await campo('titulo').inputValue(), '  Mesmo título  ')
      assert.equal(await campo('autor').inputValue(), '  Autor  ')
      assert.equal(await campo('categoria').inputValue(), 'Literatura')
      assert.equal(await campo('ano').inputValue(), '2000')
      assert.equal(await campo('titulo').isEnabled(), true)
      assert.equal(await pagina.locator('.lista-livros__item').count(), 2)
      assert.equal(posts.length, antes + 1)
      await pagina.unroute('**/livros')
    })
  }
  await caso('POST persistido com resposta perdida, sem repetição e recuperado por GET', async () => {
    await pagina.route('**/livros', async rota => { await rota.fetch(); await rota.abort('failed') })
    const antes = posts.length
    await preencher(String(new Date().getFullYear())); await enviar()
    await visivel('Não foi possível cadastrar o livro. Tente novamente.')
    assert.equal(await pagina.locator('.lista-livros__item').count(), 2)
    assert.equal(JSON.parse(await readFile(banco, 'utf8')).livros.length, 3)
    await pagina.unroute('**/livros'); await pagina.reload()
    await pagina.locator('.lista-livros__item').nth(2).waitFor()
    assert.equal(posts.length, antes + 1)
  })
  await caso('360px e desktop, título longo, teclado, labels e regiões anunciáveis', async () => {
    await campo('titulo').fill('x'.repeat(120)); await campo('autor').fill('Autor'); await campo('categoria').selectOption('Ciências'); await enviar()
    await visivel('Livro cadastrado com sucesso.')
    for (const width of [360, 1280]) {
      await pagina.setViewportSize({ width, height: 900 })
      assert.equal(await pagina.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    }
    await campo('titulo').focus()
    for (const id of ['autor', 'categoria', 'ano']) { await pagina.keyboard.press('Tab'); assert.equal(await pagina.evaluate(() => document.activeElement.id), id) }
    await pagina.keyboard.press('Tab')
    assert.equal(await pagina.evaluate(() => document.activeElement.tagName), 'BUTTON')
    assert.notEqual(await pagina.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), 'none')
    for (const id of ['titulo', 'autor', 'categoria', 'ano']) assert.ok(await campo(id).evaluate(el => el.labels.length > 0))
    assert.ok(await pagina.locator('[role="status"]').count())
    assert.ok(await pagina.locator('[role="alert"]').count())
    const sessao = await pagina.context().newCDPSession(pagina)
    const arvore = await sessao.send('Accessibility.getFullAXTree')
    assert.ok(arvore.nodes.some(no => no.role?.value === 'textbox' && no.name?.value.includes('Título')))
    assert.deepEqual(erros, [])
  })
  await caso('Formulário isolado: indisponível, callback normalizado, Promise controlada, sucesso e rejeição', async () => {
    await pagina.route('**/formulario-isolado', rota => rota.fulfill({ contentType: 'text/html', body: `<div id="isolado"></div><script type="module">
      import React from '/node_modules/.vite/deps/react.js';
      import ReactDOM from '/node_modules/.vite/deps/react-dom_client.js';
      const {createRoot}=ReactDOM;
      import RefreshRuntime from '/@react-refresh';
      RefreshRuntime.injectIntoGlobalHook(window); window.$RefreshReg$=()=>{}; window.$RefreshSig$=()=>type=>type; window.__vite_plugin_react_preamble_installed__=true;
      const {FormularioLivro}=await import('/src/components/FormularioLivro.jsx');
      window.chamadas=[];
      const root=createRoot(document.getElementById('isolado'));
      window.montar=(indisponivel)=>root.render(React.createElement(FormularioLivro,{indisponivel,onCadastrar:dados=>{window.chamadas.push(dados);return new Promise((resolve,reject)=>{window.resolver=resolve;window.rejeitar=reject})}}));
      window.montar(true);
      </script>` }))
    await pagina.goto('http://127.0.0.1:5187/formulario-isolado')
    await campo('titulo').waitFor()
    assert.equal(await campo('titulo').isDisabled(), true)
    await pagina.evaluate(() => window.montar(false))
    await preencher()
    await pagina.locator('form').evaluate(form => { form.requestSubmit(); form.requestSubmit() })
    await visivel('Cadastrando...')
    assert.deepEqual(await pagina.evaluate(() => window.chamadas), [{titulo:'Mesmo título',autor:'Autor',categoria:'Literatura'}])
    await pagina.evaluate(() => window.rejeitar(new Error('Teste')))
    await visivel('Não foi possível cadastrar o livro. Tente novamente.')
    assert.equal(await campo('titulo').inputValue(), '  Mesmo título  ')
    assert.equal(await campo('titulo').isEnabled(), true)
    await enviar(); await visivel('Cadastrando...'); await pagina.evaluate(() => window.resolver())
    await visivel('Livro cadastrado com sucesso.')
    assert.equal(await campo('titulo').inputValue(), '')
    assert.equal(await pagina.evaluate(() => window.chamadas.length), 2)
  })
  console.log(`Concluído: ${passou} verificações E2E; Chrome ${navegador.version()}; acervo original preservado.`)
} finally {
  await navegador?.close()
  for (const processo of processos) await encerrar(processo)
  await rm(pasta, { recursive: true, force: true })
}
