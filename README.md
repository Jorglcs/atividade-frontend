# Estante do Grupo

## Projeto e integrantes

O **Estante do Grupo** é um catálogo compartilhado de livros desenvolvido com React e Vite, com persistência pelo JSON Server. Resolve a necessidade de consultar o acervo do grupo e cadastrar novos títulos, com validação de dados e tratamento de falhas de comunicação.

| Integrante | GitHub |
| --- | --- |
| Jorge Luiz | [Jorglcs](https://github.com/Jorglcs) |
| Davi Pereira | [DaviSPTECH](https://github.com/DaviSPTECH) |
| Nicholas Paiva | [Npaivas](https://github.com/Npaivas) |
| Vitor Lima | [Vitorlbs-dev](https://github.com/Vitorlbs-dev) |
| Gustavo Alves Mota | [gustavomot4](https://github.com/gustavomot4) |
| Gabriel Fontes de Sousa | [gabrielfontesdesousa](https://github.com/gabrielfontesdesousa) |

As 25 tarefas estão concluídas, com fechamento final informado por Jorge. As verificações técnicas e os limites da execução estão em [docs/checagem-final.md](docs/checagem-final.md).

## Framework utilizado

O grupo utilizou o **OpenSpec** para organizar o desenvolvimento orientado por especificação. Ele foi escolhido por separar a proposta, os comportamentos esperados, o design técnico e as tarefas, permitindo dividir o trabalho sem perder o contrato comum entre os componentes e a API.

A aplicação utiliza React com Vite; o JSON Server fornece a API HTTP local.

## Como rodar

Instale as dependências na raiz do projeto:

```powershell
npm ci
```

Em um terminal, inicie a API:

```powershell
npm run api
```

Em outro terminal, inicie o front:

```powershell
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`. A API atende em `http://localhost:3001/livros` e persiste em `db.json`. Mantenha os dois terminais ativos.

Para usar outra API, copie `.env.example` para `.env.local`, configure `VITE_API_URL` com a URL base sem `/livros` e reinicie o front.

Título, autor e categoria são obrigatórios. Ano é opcional; quando preenchido, deve ser inteiro entre 1 e o ano corrente. Títulos repetidos são permitidos. Se a resposta de um cadastro se perder, recarregue e confira o acervo antes de reenviar: o mock não garante idempotência nem valida chamadas externas. Consulte [docs/api.md](docs/api.md).

Verificações:

```powershell
node --test src/domain/livro.test.js src/api/livros.test.js scripts/transporte-validacao.test.js
npm run build
npm run validar:preparar
npx --no-install openspec validate catalogo-de-livros --strict
```

A checagem final passou em 25 testes e 17 verificações E2E que cobrem os 19 cenários da spec. Os builds e a validação OpenSpec também passaram. A reprodução do E2E está em [docs/checagem-final.md](docs/checagem-final.md); o roteiro de simulações está em [docs/testes-bloco6.md](docs/testes-bloco6.md).

## Onde estão os artefatos

| Artefato | Caminho |
| --- | --- |
| Proposta | [proposal.md](openspec/changes/catalogo-de-livros/proposal.md) |
| Especificação | [spec.md](openspec/changes/catalogo-de-livros/specs/catalogo-livros/spec.md) |
| Plano técnico | [design.md](openspec/changes/catalogo-de-livros/design.md) |
| Tarefas e responsáveis | [tasks.md](openspec/changes/catalogo-de-livros/tasks.md) |
| Evidências de validação | [docs/validacao.md](docs/validacao.md) |
| Revisão e reflexão | [docs/revisao-do-grupo.md](docs/revisao-do-grupo.md) |

| Responsável | Tarefas concluídas | Entrega |
| --- | --- | --- |
| Jorge Luiz | 1.1–1.4 | Preparação, regras de domínio e testes |
| Davi Pereira | 2.1–2.4 | Mock, cliente HTTP, testes e documentação da API |
| Nicholas Paiva | 3.1–3.3 | Listagem e estados de consulta |
| Vitor Lima | 4.1–4.4 | Formulário e ciclo de envio |
| Gustavo Alves Mota | 5.1–5.4 | Página e integração funcional |
| Gabriel Fontes de Sousa | 6.1–6.6 | Interface, acessibilidade, documentação e validação integrada |

As entregas tiveram assistência de agentes. A checagem final automatizada foi executada pelo Codex a pedido de Jorge; as aprovações do grupo foram registradas por relato dele.

## Reflexão

**Que decisão o agente teria tomado sozinho e a spec evitou?**

Sem a spec, o agente poderia ter enviado o ano vazio como string ou atualizado a lista antes da confirmação da API. A especificação definiu que o ano vazio deve ser omitido e que somente o livro confirmado pelo servidor entra na lista.

**Que inconsistência a validação encontrou? Estava na spec ou no código?**

A validação encontrou divergências no código: o primeiro campo inválido não recebia foco, a categoria não estava associada ao erro por ARIA e a validação nativa do campo numérico podia impedir o tratamento do ano pelo formulário. Os ajustes foram retestados. A spec já descrevia o comportamento esperado.

**Como o framework ajudou (ou atrapalhou) a coordenação do grupo?**

O OpenSpec ajudou a dividir o trabalho com contratos comuns entre domínio, API e interface. A tabela de tarefas e as evidências permitiram distinguir código implementado de comportamento verificado. A dificuldade foi manter os registros atualizados enquanto os blocos avançavam em momentos diferentes.

**O que fariam diferente com outro framework?**

Prepararíamos a matriz de cenários e a automação de navegador mais cedo. Mesmo com outro framework, manteríamos critérios claros de aceitação, responsáveis definidos e evidências reais, porque a ferramenta não substitui testes nem comunicação.
