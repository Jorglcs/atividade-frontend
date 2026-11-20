# Instruções do projeto para agentes

## Contexto e fonte de verdade

Este é o projeto acadêmico Estante do Grupo: React com Vite, JSON Server e OpenSpec. Responda em português brasileiro. Integram o grupo Jorge, Davi, Nicolas, Vitor, Gabriel Fontes e Gustavo Alves; a ordem dos nomes não determina responsabilidades.

Ao receber um pedido para implementar tarefa ou bloco, carregue o contexto pelos arquivos abaixo antes de alterar código:

- `README.md` e `package.json`.
- `openspec/config.yaml`.
- `openspec/changes/catalogo-de-livros/proposal.md`.
- `openspec/changes/catalogo-de-livros/specs/catalogo-livros/spec.md`.
- `openspec/changes/catalogo-de-livros/design.md`.
- `openspec/changes/catalogo-de-livros/tasks.md`.
- `docs/validacao.md` e os arquivos existentes relacionados à tarefa.

A spec define comportamento; o design define a solução técnica; tasks define escopo, dependências, responsáveis e critérios de conclusão. Não use apenas esta descrição resumida para implementar. Os arquivos são a fonte atual do andamento; consulte-os mesmo que uma conversa anterior tenha outro estado.

## Como receber e assumir trabalho

Um pedido suficiente é: “Sou Davi. Implemente o bloco 2.” Também é possível informar tarefas individuais, como 3.1 e 3.2.

1. Se faltar nome ou tarefa/bloco, pergunte somente o que falta antes de implementar. Não associe números dos blocos aos nomes na lista do grupo.
2. Confira a tabela de responsáveis e as caixas do tasks.md. Não refaça tarefas concluídas nem assuma silenciosamente tarefas atribuídas a outra pessoa.
3. Confira as dependências: não implemente outros blocos para completar o solicitado. Se faltar uma entrega indispensável, explique a dependência. Use exemplos/callbacks de desenvolvimento somente onde o planejamento já permite.
4. Registre o nome e os números assumidos na tabela do tasks.md antes de começar. Isso registra a escolha localmente; não representa reserva remota automática. O grupo precisa coordenar trabalho simultâneo na main.

## Executar pelo OpenSpec

Use a skill local `.agents/skills/openspec-apply-change/SKILL.md` para implementação. Não recrie os artefatos existentes com propose nem arquive a mudança ao concluir apenas um bloco.

Comandos locais de contexto e execução:

```powershell
npx --no-install openspec status --change catalogo-de-livros --json
npx --no-install openspec instructions apply --change catalogo-de-livros --json
```

Se as dependências não estiverem instaladas, execute `npm ci` primeiro. Não reinstale globalmente o framework. Leia os arquivos retornados em contextFiles e siga as instruções do workflow, limitando a execução às tarefas pedidas pelo integrante.

Reutilize as regras existentes de `src/domain/livro.js`. Ano é opcional e deve ser omitido quando vazio; quando preenchido, deve ser inteiro entre 1 e o ano corrente. As interfaces completas e o contrato estão na spec/design.

## Verificação e registro

Execute a verificação exigida em cada tarefa e os testes existentes relevantes. Comandos básicos:

```powershell
node --test src/domain/livro.test.js
npm run build
npx --no-install openspec validate catalogo-de-livros --strict
```

Execute os testes do cliente HTTP quando eles existirem e forem relevantes. Registre autor, tarefa, comando/cenário, resultado real e eventuais limitações em `docs/validacao.md`. Não invente teste manual, aprovação ou evidência. Validação OpenSpec e build não substituem os cenários funcionais. Marque somente tarefas integralmente concluídas. Corrija falhas relacionadas antes de publicar; se não puder concluir, relate a pendência e mantenha a caixa aberta.

## Git e entrega

O grupo trabalha na branch `main` do repositório `https://github.com/Jorglcs/atividade-frontend.git`. O responsável pelo projeto autorizou que pedidos de implementação de tarefa incluam commit e push ao final, após validação. Instruções explícitas da conversa, como “sem commit” ou “não dê push”, prevalecem.

- Antes de editar, confira branch, remoto e `git status`. Com árvore limpa, atualize usando `git pull --ff-only origin main`. Preserve alterações existentes de outras pessoas; não descarte nem inclua arquivos alheios no commit.
- Implemente somente o escopo solicitado, com commits pequenos e mensagens claras. Inclua código, testes, atribuição e evidências relacionadas. Não altere a identidade Git para se passar pelo integrante.
- Antes de enviar, confira diff e arquivos preparados. Não versione dependências instaladas, build, segredos ou dados temporários de testes.
- Faça commit e `git push origin main` após as verificações. Se o remoto avançar, não force push. Busque as atualizações, integre preservando os trabalhos e repita verificações afetadas; peça ajuda se houver conflito de intenção ou alterações alheias que não possa resolver com segurança.
- Ao terminar, informe tarefas concluídas, verificações, commit/push e dependências liberadas. Se autenticação ou permissão impedir publicar, preserve o trabalho local e explique o impedimento.

Não crie convites a colaboradores sem os usuários GitHub informados. Não marque o projeto inteiro como concluído ao entregar uma parte.
