# Estante do Grupo

Catálogo acadêmico em React/Vite com listagem e cadastro persistidos pelo JSON Server. O planejamento e os critérios de aceitação usam OpenSpec.

## Executar localmente

Na raiz do projeto, instale as dependências do lockfile:

```powershell
npm ci
```

Em um terminal, inicie a API:

```powershell
npm run api
```

Em outro terminal, na mesma pasta, inicie o front:

```powershell
npm run dev
```

Abra o endereço mostrado pelo Vite (normalmente http://localhost:5173). A API atende em http://localhost:3001/livros e persiste em `db.json`. Mantenha ambos os processos ativos; encerre com Ctrl+C. Para outra API, copie `.env.example` para `.env.local`, ajuste `VITE_API_URL` com a URL base sem `/livros` e reinicie o Vite.

A instalação foi executada nas etapas anteriores. A revisão de 22/11/2026 usou Node 24.14.1 e npm 11.11.0; comandos efetivamente executados e limitações estão em [docs/validacao.md](docs/validacao.md).

## Uso e limitações

A consulta ocorre ao abrir a página. Após sucesso, inclusive com acervo vazio, o cadastro é liberado. Título, autor e categoria são obrigatórios. Ano é opcional: vazio é omitido; preenchido deve ser inteiro de 1 ao ano corrente. Títulos repetidos são permitidos. Falhas preservam os dados e permitem recuperação manual.

Se a resposta do cadastro se perder, confira o acervo por recarga antes de reenviar: o mock não garante idempotência. O JSON Server não impõe as regras de domínio a chamadas externas. Payloads e limitações em [docs/api.md](docs/api.md).

## Integrantes e andamento

| Integrante | Atribuição registrada | Situação |
| --- | --- | --- |
| Jorge | 1.1–1.4 | Concluídas |
| Davi | 2.1–2.4 | Concluídas |
| Nicholas Paiva | 3.1–3.3 | Concluídas |
| Vitor | A definir na tabela oficial | Formulário presente; 4.1–4.4 abertas |
| Gustavo Alves Mota | 5.1–5.4 | Concluídas |
| Gabriel Fontes de Sousa | 6.1–6.6 | Interface e revisão em andamento |

Usuários GitHub individuais não informados. Repositório: [Jorglcs/atividade-frontend](https://github.com/Jorglcs/atividade-frontend), branch `main`. Esse endereço não identifica os usuários dos demais integrantes. O relatório do bloco 4 identifica Vitor Lima, mas a atribuição ainda precisa ser conciliada pelo responsável em `tasks.md`.

O front está integrado. No bloco 6, estilos/responsividade e verificações básicas estão concluídos; foco no primeiro erro e associação do erro da categoria foram corrigidos com autorização e retestados no navegador. Ainda faltam revisão de acessibilidade com os responsáveis, registros de usuários GitHub, cenários integrados específicos e validação/reflexão coletivas. A [lista de tarefas](openspec/changes/catalogo-de-livros/tasks.md) é a fonte de verdade para atribuições e conclusão; a matriz dos 19 cenários está em `docs/validacao.md`.

## Verificações

Para testar os cenários de falha do bloco 6 sem modificar o acervo, execute `npm run validar` e abra `http://localhost:5174/validacao.html`. O [roteiro de testes do bloco 6](docs/testes-bloco6.md) explica a aplicação com API real e as simulações de lentidão, resposta inválida e resposta perdida após persistência. A execução manual foi assumida pelo solicitante e continua pendente de registro; não há aprovação automática.

```powershell
node --test src/domain/livro.test.js src/api/livros.test.js scripts/transporte-validacao.test.js
npm run build
npm run validar:preparar
npx --no-install openspec validate catalogo-de-livros --strict
```

Em 22/11/2026: 25 testes passaram (20 de domínio/cliente e 5 dos cenários simulados), os builds da aplicação e da página de teste passaram e a mudança passou na validação estrutural. Isso não substitui seus testes manuais no navegador. Resultados, defeitos e limitações em [docs/validacao.md](docs/validacao.md).

## Artefatos e coordenação

- [Proposta](openspec/changes/catalogo-de-livros/proposal.md), [spec](openspec/changes/catalogo-de-livros/specs/catalogo-livros/spec.md), [design](openspec/changes/catalogo-de-livros/design.md) e [tarefas](openspec/changes/catalogo-de-livros/tasks.md).
- [Requisitos](docs/requisitos.md), [organização](docs/divisao-preliminar.md) e [revisão coletiva](docs/revisao-do-grupo.md).
- Código em `src/domain`, `src/api`, `src/components` e `src/pages`; estilos em `src/styles.css`.

Cada integrante informa nome e tarefas antes de assumir trabalho. A aprovação coletiva da spec foi relatada por Jorge em 20/11/2026; não comprova participação coletiva na validação final. Reflexão e registros individuais dessa etapa continuam pendentes em `docs/revisao-do-grupo.md`.
