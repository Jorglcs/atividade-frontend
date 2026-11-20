# Estante do Grupo

## Projeto e integrantes

Proposta de catálogo compartilhado de livros, com listagem e cadastro por API HTTP. Resolve a necessidade de consultar os livros do grupo e incluir novos títulos em um acervo persistente.

Integrantes: Jorge, Davi, Nicolas, Vitor, Gabriel Fontes e Gustavo Alves. Usuários GitHub pendentes. Cada pessoa informa seu nome e as tarefas que vai assumir; a atribuição será registrada no [tasks.md](openspec/changes/catalogo-de-livros/tasks.md), sem associação pela ordem dos nomes.

Estado atual: base React/Vite, OpenSpec e planejamento preparados; bloco 1 de Jorge concluído com regras de domínio e testes. Aprovação coletiva informada por Jorge em 20/11/2026. Os blocos 2–6 continuam disponíveis e a interface ainda é provisória. Evidências em [docs/validacao.md](docs/validacao.md).

## Framework utilizado

Proposta: **OpenSpec**, por permitir organizar uma funcionalidade pequena em proposta, especificação, design e tarefas. A escolha ainda deve ser confirmada pelo grupo.

Documentação oficial: [OpenSpec](https://github.com/Fission-AI/OpenSpec). Consultar também o capítulo correspondente do book da disciplina; esse material não foi fornecido nesta preparação.

Instalação indicada no enunciado, a executar dentro do projeto na etapa de preparação:

```powershell
npm install -g @fission-ai/openspec@latest
openspec init --tools opencode
```

Conferir os requisitos de Node e a sintaxe na versão instalada. Usar no chat do opencode os comandos apresentados pela instalação, seguindo explorar/propor, revisar e aplicar. Os nomes podem variar entre versões. Esta preparação manual não substitui a geração dos artefatos pelo framework na sessão conjunta.

## Como rodar

Instale as dependências com `npm ci`. Execute em terminais separados:

```powershell
npm run api
```

```powershell
npm run dev
```

API em `http://localhost:3001/livros`. O Vite apresenta o endereço do front no terminal (porta padrão 5173). `.env.example` documenta `VITE_API_URL`, a ser usada pelo cliente HTTP quando implementado. O front atual mostra apenas a identificação do projeto.

Build: `npm run build` (executado com sucesso nesta preparação). CLI local do framework: `npm run openspec -- --help`. Não é necessária instalação global: `npm ci` também instala o OpenSpec fixado pelo lockfile.

## Onde estão os artefatos

Insumos preliminares, ainda sem aprovação coletiva:

- [Requisitos e critérios de aceitação](docs/requisitos.md).
- [Divisão de tarefas sugerida para seis integrantes](docs/divisao-preliminar.md).
- [Registro de revisão e aprovação do grupo](docs/revisao-do-grupo.md).

Artefatos atuais do OpenSpec:

- [Proposta](openspec/changes/catalogo-de-livros/proposal.md).
- [Spec](openspec/changes/catalogo-de-livros/specs/catalogo-livros/spec.md).
- [Design técnico](openspec/changes/catalogo-de-livros/design.md).
- [Tarefas e responsáveis](openspec/changes/catalogo-de-livros/tasks.md).

Jorge assumiu e concluiu 1.1–1.4. Os demais integrantes devem informar seus nomes e tarefas antes de executar, registrando as escolhas no tasks.md. `npx openspec validate catalogo-de-livros --strict` passou; isso verifica os artefatos, não comprova o funcionamento da futura aplicação.

## Reflexão

Responder depois do trabalho, com exemplos reais:

- Que decisão o agente teria tomado sozinho e a spec evitou? Pendente.
- Que inconsistência a validação encontrou? Estava na spec ou no código? Pendente.
- Como o framework ajudou ou atrapalhou a coordenação do grupo? Pendente.
- O que fariam diferente com outro framework? Pendente.

## Próxima etapa

Os demais integrantes escolhem tarefas disponíveis dos blocos 2–6 e registram seu nome e os números no tasks.md antes de implementar. Respeitar dependências e validar cada entrega. Regras de domínio de Jorge já estão disponíveis. Testes do bloco 1: `node --test src/domain/livro.test.js`.

O repositório do grupo é [atividade-frontend](https://github.com/Jorglcs/atividade-frontend). Usuários GitHub e convites aos outros cinco integrantes ainda precisam ser conferidos; não foram informados nesta conversa.
