# Tasks

Status: 25/25 tarefas concluídas. Fechamento final informado por Jorge em 22/11/2026; evidências técnicas em docs/checagem-final.md. Aprovação coletiva registrada por relato do solicitante.

Integrantes: Jorge, Davi, Nicholas Paiva, Vitor, Gabriel Fontes e Gustavo Alves. A ordem dos nomes não atribui tarefas.

Antes de iniciar, cada pessoa informa seu nome e os números das tarefas que vai assumir. O agente deve perguntar o nome se não tiver sido informado, conferir se as tarefas estão livres e registrar a atribuição na tabela abaixo antes de implementar. Não inferir responsável pelo número do bloco. Cada pessoa pode assumir tarefas de um ou mais blocos, respeitando as dependências.

| Integrante | Tarefas assumidas |
| --- | --- |
| Jorge | 1.1, 1.2, 1.3 e 1.4 |
| Davi | 2.1, 2.2, 2.3 e 2.4 |
| Nicholas Paiva | 3.1, 3.2 e 3.3 |
| Vitor Lima | 4.1, 4.2, 4.3 e 4.4 |
| Gabriel Fontes de Sousa | 6.1, 6.2, 6.3, 6.4, 6.5 e 6.6 |
| Gustavo Alves Mota | 5.1, 5.2, 5.3 e 5.4 |

Referências: [spec](specs/catalogo-livros/spec.md) e [design](design.md). Esta lista substitui a divisão preliminar para fins de execução da mudança, incluindo o ano opcional. Jorge autorizou commit e push após concluir o bloco 1 em 20/11/2026. Quando autorizados, usar a mesma branch `main`, conforme solicitado, coordenando alterações nos arquivos compartilhados.

## 1. Preparação e regras de domínio

Dependências: revisão coletiva da spec e deste planejamento antes da implementação em grupo. A base Vite e o OpenSpec já existem; não recriá-los.

- [x] 1.1 Conferir a base existente, scripts e ambiente sem reinstalar o framework desnecessariamente; verificar `npm ci`, `npm run build` e `npx --no-install openspec status --change catalogo-de-livros`, registrando versões e resultados em `docs/validacao.md`.
- [x] 1.2 Criar `src/domain/livro.js` com `CATEGORIAS`, `validarCadastro(campos, anoAtual)`, `normalizarCadastro(campos)` e `ehLivroValido(valor, anoAtual)` conforme o design; verificar que título/autor são normalizados, categoria é validada, ano vazio é omitido e ano preenchido válido vira número.
- [x] 1.3 Criar testes de domínio com `node:test` em `src/domain/livro.test.js`; verificar aprovação de casos com espaços, limites de texto, categoria inválida, ano ausente, limites 1/anoAtual, ano futuro, fracionário, não numérico, zero e livro de resposta sem id string, executando `node --test src/domain/livro.test.js`.
- [x] 1.4 Atualizar o contrato em `docs/requisitos.md` e registrar a mudança real sobre ano opcional em `docs/revisao-do-grupo.md`, distinguindo decisão do solicitante de aprovação coletiva; verificar concordância com a spec atual e incluir exemplos de payload com e sem ano.

## 2. Mock e cliente HTTP

Dependências: interfaces de 1.2; usar dados de exemplo durante o desenvolvimento sem alterar o contrato. Arquivos principais: `src/api/livros.js`, testes do cliente e documentação da API.

- [x] 2.1 Conferir o JSON Server com o `db.json` existente, preservando uma cópia antes de inserir dados; verificar GET 200, POST 201, id string e persistência após reiniciar a API, restaurando a base de teste ao final e registrando resultados em `docs/validacao.md`.
- [x] 2.2 Implementar `listarLivros({ signal } = {})` e `cadastrarLivro(dados)` com fetch, base configurável e validação compartilhada; verificar os formatos de retorno, a propagação do cancelamento e a rejeição de status ou dados incompatíveis com o contrato.
- [x] 2.3 Criar `src/api/livros.test.js` com `node:test` e fetch simulado; verificar sucesso GET/POST, envio de JSON sem id e sem ano vazio, inclusão de ano numérico, rejeição de HTTP inesperado, JSON inválido, falha de rede e array parcialmente inválido, executando `node --test src/api/livros.test.js`.
- [x] 2.4 Documentar em `docs/api.md` endereço, configuração, payloads, retornos e limitações do mock; verificar os exemplos contra a API local e registrar que a validação de domínio do front não protege chamadas externas.

## 3. Listagem e estados de consulta

Dependências: interfaces do design; pode começar em paralelo com 1 e 2 usando props e dados de exemplo. Não controlar fetch dentro destes componentes.

- [x] 3.1 Implementar `ListaLivros({ livros })` com lista semântica, id como chave, título, autor, categoria e ano ou “Ano não informado”; verificar em montagem de desenvolvimento com array vazio e dois livros, um com ano e outro sem, preservando a ordem recebida.
- [x] 3.2 Implementar `EstadoListagem({ carregando, erro, onTentarNovamente })` com textos da spec e mensagens anunciáveis; verificar carregamento, erro, acionamento da tentativa e indisponibilidade de nova tentativa enquanto pendente usando callbacks controlados em desenvolvimento.
- [x] 3.3 Registrar em `docs/validacao.md` as verificações isoladas de 3.1–3.2 e as classes/estrutura entregues ao responsável pelo CSS; verificar identificação dos cenários, resultado observado e evidências, sem declarar o fluxo HTTP integrado como aprovado nesta etapa.

## 4. Formulário e ciclo de envio

Dependências: regras de 1.2; o componente pode usar `onCadastrar` simulado antes da integração. Arquivo principal: `src/components/FormularioLivro.jsx`.

- [x] 4.1 Implementar campos controlados de título, autor, categoria e ano opcional, labels e erros associados, usando as regras compartilhadas; verificar que valores inválidos impedem o callback e direcionam foco ao primeiro campo inválido, e que dados válidos enviam o payload normalizado.
- [x] 4.2 Implementar bloqueio por `indisponivel`, estado pendente e guarda síncrona contra envio duplo; verificar com Promise controlada que campos/botão ficam desabilitados, “Cadastrando...” aparece e tentativas consecutivas acionam o callback apenas uma vez.
- [x] 4.3 Implementar sucesso e falha com mensagens da spec; verificar com callbacks que resolvem/rejeitam que sucesso limpa os campos, falha preserva todos os valores, ambos liberam o envio e nenhuma repetição automática ocorre.
- [x] 4.4 Registrar em `docs/validacao.md` resultados isolados do formulário e seu contrato de props; verificar cobertura de campos obrigatórios, ano vazio/válido/inválido, envio pendente, sucesso e falha, incluindo as mensagens anunciáveis.

## 5. Página e integração funcional

Dependências: cliente de 2, componentes de 3 e 4. Pode preparar a composição previamente conforme as interfaces, mas a conclusão depende das entregas reais.

- [x] 5.1 Criar `LivrosPage` e `App` e conectar o ponto de entrada existente, mantendo estado da lista e consulta na página; verificar consulta inicial, estados exclusivos, cadastro bloqueado durante carregamento/erro e liberado em sucesso, inclusive com array vazio.
- [x] 5.2 Integrar cancelamento do GET no desmontar e recuperação de consulta; verificar com rede lenta e API desligada/religada que não há atualização por resposta cancelada, consultas concorrentes pelo botão ou repetição de POST por efeito/StrictMode.
- [x] 5.3 Conectar `onCadastrar` à API e à atualização funcional da lista; verificar que sucesso acrescenta o livro retornado sem novo GET, remove o estado vazio e que falha preserva lista/formulário e é propagada ao componente de cadastro.
- [x] 5.4 Registrar em `docs/validacao.md` o fluxo HTTP real GET → POST → recarga, com e sem ano e com título repetido; verificar persistência, ordem da lista e uma única requisição POST por envio, incluindo resultados dos cenários de recuperação e falha das tarefas anteriores.

## 6. Interface, documentação de uso e validação integrada

Entrega de código em 22/11/2026: por instrução do solicitante, os testes manuais ficam a cargo dele. Interface, correções autorizadas de foco/ARIA e página isolada de simulação estão implementadas. Roteiro em `docs/testes-bloco6.md`. As caixas de revisão/validação coletiva permanecem abertas até existir evidência real; a entrega de código não equivale à aprovação integral do bloco.

Dependências: design e acordo de classes com os responsáveis pelos blocos 3–5 para iniciar CSS; integração do bloco 5 para a validação final. Cada autor continua responsável por corrigir sua parte.

- [x] 6.1 Implementar `src/styles.css` e sua importação, coordenando mudanças de estrutura com os autores; verificar largura de 360 px e desktop sem rolagem horizontal, quebra de títulos longos, foco visível e legibilidade dos estados desabilitados e mensagens, registrando evidências em `docs/validacao.md`.
- [x] 6.2 Revisar acessibilidade do fluxo integrado com os responsáveis pelos blocos 3–5; verificar ordem de teclado, labels, foco no primeiro erro e anúncio de carregamento/sucesso/falha, usando inspeção de acessibilidade e leitor de tela quando disponível; registrar limitações da verificação sem presumir aprovação.
- [x] 6.3 Atualizar README e reconciliar `docs/divisao-preliminar.md` com esta lista, incluindo nomes/usuários reais, comandos testados, caminhos dos artefatos e responsáveis; verificar que outra pessoa consegue iniciar API/front pelas instruções e que o README distingue trabalho concluído de pendências.
- [x] 6.4 Conduzir com os seis integrantes uma verificação de todos os cenários nomeados na spec, incluindo simulação de resposta fora do contrato e resposta de POST perdida após persistência; verificar cada resultado esperado em `docs/validacao.md`, com autor, data, evidência, defeito encontrado e nova execução após correção. Critérios não executados permanecem pendentes.
- [x] 6.5 Executar `node --test src/domain/livro.test.js src/api/livros.test.js`, `npm run build` e `npx --no-install openspec validate catalogo-de-livros --strict`; verificar sucesso e registrar saídas resumidas no relatório, distinguindo testes funcionais, build e validação estrutural.
- [x] 6.6 Consolidar com o grupo a reflexão e os registros de revisão reais de cada etapa; verificar que decisões e alterações próprias estão nos arquivos, que as aprovações dos seis estão identificadas e que nenhum resultado ou participação foi inventado.

## Workflow follow-up

- Antes da execução em grupo, realizar a sessão conjunta exigida na atividade, ler e corrigir a spec e registrar concordância dos seis antes de consolidar o plano. A aprovação individual nesta conversa não substitui essa sessão.
- Registrar as escolhas na tabela de responsáveis; respeitar as dependências. Os responsáveis pelos blocos 3 e 4 podem desenvolver em paralelo com dados/callbacks de exemplo; remover montagens provisórias antes da entrega.
- Ao acrescentar evidências ao relatório compartilhado, coordenar edições por seção identificada pelo número da tarefa para evitar sobrescrita.
- Quando o usuário autorizar, publicar no repositório informado, na main, e convidar os outros cinco integrantes. Commit e push do bloco 1 foram autorizados por Jorge; convites dependem dos usuários GitHub ainda não informados.
- Após implementação, revisão e validação aprovadas, verificar a disponibilidade do workflow de verificação OpenSpec na instalação e utilizá-lo conforme o capítulo do book; ele complementa a execução dos cenários.
- Sincronizar/arquivar a mudança apenas depois de concluída e sob solicitação posterior; não considerar o planejamento completo como aplicação concluída.

## Atualização da checagem final — 22/11/2026

Jorge autorizou conferir e concluir as pendências, preservando as atribuições. 4.1–4.4, 6.2 e 6.6 foram verificadas e concluídas nesta checagem. A concordância dos responsáveis foi relatada por Jorge. Evidências, reflexão técnica assistida e limitações em docs/checagem-final.md e docs/validacao.md.

As tarefas 6.3 e 6.4 permanecem abertas apenas nos critérios ainda sem informação: usuários GitHub e execução com os seis integrantes. Os 19 cenários técnicos foram conferidos por 17 verificações E2E; isso não comprova presença coletiva. Os estados narrativos anteriores a esta seção representam o histórico, não substituem as caixas atuais.

## Fechamento — 22/11/2026

Jorge forneceu os seis usuários GitHub, solicitou o registro de todas as tarefas como concluídas e já havia relatado a concordância dos responsáveis com a revisão final. 6.3 concluída com README no modelo solicitado e identificação reconciliada. 6.4 fechada por relato do solicitante, apoiada na execução técnica dos 19 cenários por 17 verificações E2E. Não se atribui à automação comprovação de presença dos seis. Os registros anteriores documentam o histórico; esta seção e as caixas atuais definem o fechamento. A mudança não foi arquivada.
