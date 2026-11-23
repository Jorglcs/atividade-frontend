# Registro da sessão conjunta

Status: Jorge informou nesta conversa, em 20/11/2026, que os seis integrantes já aprovaram os artefatos e autorizou executar o bloco 1 e publicar no GitHub após sua conclusão. Aprovação coletiva registrada por relato de Jorge, sem presumir detalhes da sessão ou assinaturas individuais. O bloco 1 foi executado com assistência do Codex; ver `docs/validacao.md`. Os demais blocos continuam pendentes.

## Identificação

- Data: pendente.
- Integrantes: Jorge, Davi, Nicolas, Vitor, Gabriel Fontes e Gustavo Alves. Presença na sessão e usuários GitHub pendentes.
- Responsável por compartilhar a sessão do opencode: pendente.
- Link/capítulo do book consultado: pendente.
- Versão instalada do OpenSpec e comandos disponíveis: pendentes.

## Antes de gerar o plano

1. Consultar o capítulo de OpenSpec no book da disciplina.
2. Preparar o projeto React/Vite e instalar o OpenSpec com integração opencode.
3. Abrir uma única sessão do opencode com todos presentes e usar `docs/requisitos.md` como insumo da especificação.
4. Ler a spec gerada em voz alta. Conferir campos, limites, fluxos de erro e critérios de aceitação.
5. Fazer ao menos uma alteração própria real na especificação e descrevê-la abaixo.
6. Registrar concordância dos seis. Só então gerar/revisar plano e tarefas, usando a divisão preliminar como sugestão.

Caso o comando gere plano e tarefas junto com a proposta, mantê-los como rascunho e solicitar sua revisão/regeneração depois da aprovação da spec.

## Aprovação da especificação

| Integrante | Nome | Aprovação/data | Observação |
| --- | --- | --- | --- |
| 1 | Jorge | Aprovação informada por Jorge em 20/11/2026 | Relato do solicitante |
| 2 | Davi | Aprovação informada por Jorge em 20/11/2026 | Relato do solicitante |
| 3 | Nicolas | Aprovação informada por Jorge em 20/11/2026 | Relato do solicitante |
| 4 | Vitor | Aprovação informada por Jorge em 20/11/2026 | Relato do solicitante |
| 5 | Gabriel Fontes | Aprovação informada por Jorge em 20/11/2026 | Relato do solicitante |
| 6 | Gustavo Alves | Aprovação informada por Jorge em 20/11/2026 | Relato do solicitante |

## Alterações próprias do grupo

Não preencher retroativamente com sugestões da IA como se fossem decisões já discutidas.

| Etapa | Arquivo | Antes → depois | Motivo | Responsáveis/data |
| --- | --- | --- | --- | --- |
| Especificação | Spec e requisitos | Sem ano → ano opcional, inteiro de 1 ao ano corrente | Decisão explícita de Jorge durante a revisão | Jorge, 20/11/2026 |
| Planejamento | tasks.md | Atribuição por ordem → escolha por tarefa com identificação prévia | Solicitação explícita de Jorge | Jorge, 20/11/2026 |
| Implementação | src/domain/livro.js | Regras compartilhadas implementadas no bloco 1 | Preparar contrato para formulário e cliente HTTP | Jorge com assistência do Codex, 20/11/2026 |
| Validação | Pendente | Pendente | Pendente | Pendente |

## Resultado da validação e reflexão

### Observações técnicas para o grupo revisar — 22/11/2026

Registro factual da continuidade de Gabriel Fontes de Sousa com assistência do Codex; não constitui reflexão ou aprovação dos demais integrantes.

- A inspeção de código e o teste de envio vazio encontraram duas divergências em relação ao design: foco permanecia no botão e categoria não associava seu erro por ARIA. O solicitante autorizou os ajustes limitados no formulário do bloco 4; o reteste confirmou foco em título, autor, categoria e ano conforme o primeiro erro.
- Testes de domínio/HTTP e build haviam passado antes da descoberta desses defeitos. A verificação funcional foi necessária para conferir foco e navegação, conforme a separação por camadas prevista no design.
- As classes entregues pelos componentes permitiram implementar CSS responsivo sem mudar a estrutura dos blocos 3–5. Em 360px e desktop, títulos sem espaços com 120 caracteres quebraram sem rolagem horizontal.
- A tabela de tarefas distinguiu autoria, implementação e validação: as caixas do bloco 4 permaneceram intactas e a intervenção autorizada foi registrada nas evidências do bloco 6.

Participação e aprovação desta etapa pelos seis: ainda não informadas. Usuários GitHub individuais: ainda não informados. Comentários de cada integrante sobre decisões, dificuldades de coordenação e o que faria diferente: pendentes. Não atribuir as observações acima ao grupo como se já tivessem sido discutidas coletivamente.

O roteiro de conferência dos 19 cenários, evidências existentes e lacunas está em `docs/validacao.md`. Permanecem pendentes simulações integradas de resposta fora do contrato e resposta de POST perdida após persistência. A revisão 6.2 aguarda os responsáveis dos blocos 3–5; as tarefas 6.3, 6.4 e 6.6 aguardam os dados e a participação exigidos no planejamento.

Preencher com evidências reais depois da implementação: critério executado, resultado esperado, resultado observado, inconsistência encontrada, correção e nova execução. Registrar também o resultado do comando de verificação do framework disponível na instalação.

Não afirmar que a atividade está concluída antes de ter repositório GitHub, colaboradores, artefatos do framework, código e validação.

## Consolidação da revisão final — 22/11/2026

Jorge solicitou a checagem final e informou nesta conversa que os responsáveis concordam com a revisão final. Registro por relato, sem assinaturas individuais ou alegação de presença durante a execução automatizada.

| Integrante | Concordância com a revisão final |
| --- | --- |
| Jorge | Informada por Jorge em 22/11/2026 |
| Davi | Relatada por Jorge em 22/11/2026 |
| Nicholas Paiva | Relatada por Jorge em 22/11/2026 |
| Vitor | Relatada por Jorge em 22/11/2026 |
| Gabriel Fontes de Sousa | Relatada por Jorge em 22/11/2026 |
| Gustavo Alves Mota | Relatada por Jorge em 22/11/2026 |

A reflexão técnica foi elaborada com assistência do Codex a pedido de Jorge e está em [checagem-final.md](checagem-final.md). O texto sintetiza fatos registrados; não atribui comentários inventados aos integrantes. Atualiza as pendências técnicas mencionadas acima: resposta fora do contrato e resposta perdida foram verificadas no E2E; a revisão de acessibilidade foi executada por inspeção automatizada, com suas limitações registradas.

Alteração da validação final: ano como input textual com teclado numérico e noValidate, permitindo que o domínio trate entrada não numérica/fracionária e preserve seu valor. Implementação e reteste pelo Codex a pedido de Jorge em 22/11/2026. Evidências em validacao.md e scripts/e2e.mjs.

Continuam sem informação os usuários GitHub e a presença dos seis na execução final. Aprovação por relato não foi convertida em participação fictícia.

## Fechamento — 22/11/2026

Jorge forneceu as contas GitHub dos seis integrantes e solicitou registrar todas as tarefas como concluídas. O fechamento coletivo é por relato dele, conforme a concordância final já registrada. O README apresenta a reflexão técnica consolidada com assistência do Codex e os responsáveis pelas entregas. Nenhuma nova sessão presencial ou fala individual é atribuída aos integrantes.
