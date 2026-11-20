import test from 'node:test'
import assert from 'node:assert/strict'
import { listarLivros, cadastrarLivro } from './livros.js'

const URL_PADRAO = 'http://localhost:3001/livros'
const livroValido = { id: 'abc123', titulo: 'Livro', autor: 'Autora', categoria: 'Literatura', ano: 2000 }
const camposValidos = { titulo: ' Livro ', autor: ' Autora ', categoria: 'Literatura' }

const respostaJson = (corpo, status = 200) => new Response(JSON.stringify(corpo), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

async function comFetchSimulado(implementacao, executar) {
  const original = globalThis.fetch
  const chamadas = []
  globalThis.fetch = async (url, opcoes) => {
    chamadas.push({ url, opcoes })
    return implementacao(url, opcoes)
  }
  try {
    return await executar(chamadas)
  } finally {
    globalThis.fetch = original
  }
}

test('GET retorna o array validado e usa a base padrão', async () => {
  const { ano, ...semAno } = livroValido
  const livros = [livroValido, { ...semAno, id: 'def456' }]

  await comFetchSimulado(async () => respostaJson(livros), async (chamadas) => {
    const resultado = await listarLivros()
    assert.deepEqual(resultado, livros)
    assert.equal(chamadas.length, 1)
    assert.equal(chamadas[0].url, URL_PADRAO)
    assert.equal(chamadas[0].opcoes.signal, undefined)
  })
})

test('GET aceita acervo vazio', async () => {
  await comFetchSimulado(async () => respostaJson([]), async () => {
    assert.deepEqual(await listarLivros(), [])
  })
})

test('GET propaga o sinal de cancelamento sem convertê-lo em falha da consulta', async () => {
  const controller = new AbortController()
  controller.abort()

  await comFetchSimulado(async (url, opcoes) => {
    assert.equal(opcoes.signal, controller.signal)
    throw controller.signal.reason
  }, async () => {
    await assert.rejects(listarLivros({ signal: controller.signal }), (erro) => erro === controller.signal.reason)
  })
})

test('GET rejeita status HTTP diferente de 200', async () => {
  for (const status of [201, 204, 400, 500]) {
    await comFetchSimulado(async () => respostaJson([livroValido], status), async () => {
      await assert.rejects(listarLivros())
    })
  }
})

test('GET rejeita JSON inválido e estrutura fora do contrato', async () => {
  for (const corpo of ['{', 'null', '{"livros":[]}', JSON.stringify(livroValido)]) {
    await comFetchSimulado(async () => new Response(corpo, { status: 200 }), async () => {
      await assert.rejects(listarLivros())
    })
  }
})

test('GET rejeita o array inteiro quando um elemento é inválido', async () => {
  const invalidos = [
    { ...livroValido, id: 1 },
    { ...livroValido, titulo: ' ' },
    { ...livroValido, categoria: 'Inválida' },
    { ...livroValido, ano: '2000' },
    null,
  ]
  for (const invalido of invalidos) {
    await comFetchSimulado(async () => respostaJson([livroValido, invalido]), async () => {
      await assert.rejects(listarLivros())
    })
  }
})

test('GET propaga falha de rede', async () => {
  await comFetchSimulado(async () => { throw new TypeError('Failed to fetch') }, async () => {
    await assert.rejects(listarLivros(), TypeError)
  })
})

test('POST envia somente o contrato, sem id e sem ano vazio, e retorna o livro criado', async () => {
  await comFetchSimulado(async () => respostaJson(livroValido, 201), async (chamadas) => {
    const resultado = await cadastrarLivro({ ...camposValidos, id: 'externo', ano: '   ' })

    assert.deepEqual(resultado, livroValido)
    assert.equal(chamadas.length, 1)
    assert.equal(chamadas[0].url, URL_PADRAO)
    assert.equal(chamadas[0].opcoes.method, 'POST')
    assert.deepEqual(chamadas[0].opcoes.headers, { 'Content-Type': 'application/json' })
    assert.deepEqual(JSON.parse(chamadas[0].opcoes.body), {
      titulo: 'Livro',
      autor: 'Autora',
      categoria: 'Literatura',
    })
  })
})

test('POST inclui ano numérico quando preenchido e válido', async () => {
  const resposta = { ...livroValido, ano: 1999 }
  await comFetchSimulado(async () => respostaJson(resposta, 201), async (chamadas) => {
    assert.deepEqual(await cadastrarLivro({ ...camposValidos, ano: '1999' }), resposta)
    assert.deepEqual(JSON.parse(chamadas[0].opcoes.body), {
      titulo: 'Livro',
      autor: 'Autora',
      categoria: 'Literatura',
      ano: 1999,
    })
    assert.equal(typeof JSON.parse(chamadas[0].opcoes.body).ano, 'number')
  })
})

test('POST rejeita entrada inválida sem chamar fetch', async () => {
  const invalidos = [
    { ...camposValidos, titulo: ' ' },
    { ...camposValidos, autor: 'x'.repeat(101) },
    { ...camposValidos, categoria: 'Inválida' },
    { ...camposValidos, ano: '2000.5' },
    { ...camposValidos, ano: 'abc' },
    null,
  ]

  await comFetchSimulado(async () => respostaJson(livroValido, 201), async (chamadas) => {
    for (const invalido of invalidos) {
      await assert.rejects(cadastrarLivro(invalido))
    }
    assert.equal(chamadas.length, 0)
  })
})

test('POST rejeita status HTTP diferente de 201', async () => {
  for (const status of [200, 202, 400, 500]) {
    await comFetchSimulado(async () => respostaJson(livroValido, status), async () => {
      await assert.rejects(cadastrarLivro(camposValidos))
    })
  }
})

test('POST rejeita JSON inválido e livro fora do contrato', async () => {
  const respostas = [
    new Response('{', { status: 201 }),
    respostaJson({ ...livroValido, id: 1 }, 201),
    respostaJson({ ...livroValido, categoria: 'Inválida' }, 201),
    respostaJson({ ...livroValido, ano: '2000' }, 201),
    respostaJson({ titulo: 'Livro', autor: 'Autora', categoria: 'Literatura' }, 201),
  ]

  for (const resposta of respostas) {
    await comFetchSimulado(async () => resposta, async () => {
      await assert.rejects(cadastrarLivro(camposValidos))
    })
  }
})

test('POST propaga falha de rede', async () => {
  await comFetchSimulado(async () => { throw new TypeError('Failed to fetch') }, async () => {
    await assert.rejects(cadastrarLivro(camposValidos), TypeError)
  })
})
