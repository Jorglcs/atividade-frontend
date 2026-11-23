# Evidências de validação

## Bloco 6 — Gabriel Fontes de Sousa — revisão de 22/11/2026

### Tarefa 6.5 — reexecução solicitada em 22/11/2026

Autor: Gabriel Fontes de Sousa, com assistência do Codex. Executados novamente os três comandos exatos exigidos em 6.5, sem alterar código ou marcar outros itens como concluídos.

| Camada | Comando | Resultado real |
| --- | --- | --- |
| Domínio e cliente HTTP | `node --test src/domain/livro.test.js src/api/livros.test.js` | Código de saída 0; 20 testes aprovados, 0 falhas, 0 ignorados. Duração total 372,1763 ms. Fetch simulado no cliente; não é teste funcional de tela |
| Empacotamento | `npm run build` | Código de saída 0; Vite 8.3.8, 22 módulos, build em 262 ms. HTML 0,41 kB, CSS 3,77 kB, JS 226,76 kB. Não comprova os cenários manuais |
| Estrutura OpenSpec | `npx --no-install openspec validate catalogo-de-livros --strict` | Código de saída 0; `Change 'catalogo-de-livros' is valid`. Não representa aprovação coletiva ou funcional |

A caixa 6.5 já estava marcada e permanece concluída, agora com evidência renovada. Os 5 testes adicionais da ferramenta de simulação não fazem parte deste comando específico; seu resultado anterior está registrado na entrega de código abaixo. Nenhum cenário manual foi declarado executado nesta revalidação.

### Entrega do código para testes do solicitante — 22/11/2026

O solicitante definiu: desenvolver o código e deixar os testes manuais a cargo dele, mantendo o escopo no bloco 6. A página `validacao.html` monta `App` com transporte simulado exclusivo; `npm run validar` compila em `dist-validacao` e abre um servidor de preview na porta 5174. O código de teste não é importado por `src/main.jsx` nem incluído no build normal. Dados simulados persistem em uma chave exclusiva do localStorage, sem tocar em db.json. Roteiro completo: `docs/testes-bloco6.md`.

Os cenários disponíveis são respostas normais, GET/POST fora do contrato, JSON inválido, HTTP 503, falha de rede, lentidão e POST persistido com resposta perdida. A seleção é preservada na URL para recarga; a troca de cenário não remonta o formulário. O painel apresenta contadores, payload e livros simulados. A simulação é do transporte e persistência no navegador; não representa um teste real de queda de servidor.

| Verificação efetivamente executada | Resultado |
| --- | --- |
| `node --test src/domain/livro.test.js src/api/livros.test.js scripts/transporte-validacao.test.js` | 25 testes passaram, zero falhas. Os 5 novos testes usam o cliente HTTP real sobre transporte simulado: resposta perdida após persistência e conferência por nova consulta, erros GET/POST, cancelamento de consulta lenta e troca de modo durante envio pendente |
| `npm run build` | Sucesso; 22 módulos, CSS 3,77 kB e JS 226,76 kB |
| `npm run validar:preparar` | Sucesso; 24 módulos e página independente em dist-validacao, com HTML/CSS/JS compilados |
| `npm run validar` | Compilação e inicialização bem-sucedidas; terminal apresentou `Validação isolada: http://localhost:5174/validacao.html`. Não houve nova inspeção de tela nesta entrega; encerrado o servidor após conferir a inicialização |
| `npx --no-install openspec validate catalogo-de-livros --strict` | Sucesso: `Change 'catalogo-de-livros' is valid` |
| `git diff --check` e status | Sem erro de whitespace; db.json não aparece nas alterações. .codex preservado fora do escopo |

Código entregue para teste; nenhuma nova aprovação manual foi inventada. 6.1 e 6.5 seguem concluídas. 6.2–6.4 e 6.6 mantêm suas caixas abertas pelos critérios de revisão, identificação e validação humana ainda não comprovados. A responsabilidade por executar testes manuais foi explicitamente assumida pelo solicitante; esta pendência não representa código faltante para a ferramenta de simulação.

### Correção autorizada do formulário e nova execução — 22/11/2026

O solicitante autorizou expressamente corrigir foco e associação do erro da categoria no formulário do bloco 4 durante a continuidade do bloco 6. A atribuição e as caixas do bloco 4 foram preservadas; esta intervenção limitada não assume as demais tarefas de Vitor.

Em `FormularioLivro`, o primeiro erro é identificado no envio e recebe foco após o React atualizar as mensagens no DOM. Categoria agora usa `aria-invalid`, `aria-describedby="categoria-erro"` e id correspondente na mensagem. O CSS mantém as regiões vazias de status/alerta no DOM sem `display:none`, ocultando-as visualmente até conterem mensagens.

| Verificação executada no navegador integrado | Resultado real |
| --- | --- |
| Envio vazio | Foco no título; descrição `titulo-erro`; categoria com `aria-invalid=true` e descrição `categoria-erro` existente |
| Preencher somente título e reenviar | Foco no autor e descrição `autor-erro` |
| Preencher título/autor e reenviar sem categoria | Foco na categoria e descrição `categoria-erro` |
| Selecionar categoria e enviar ano zero | Foco no ano; erro associado; valores de título, autor, categoria e ano preservados |
| Enviar ano fracionário 1.5 e futuro 9999 | Erro de ano exibido; foco no ano; nenhum item acrescentado |
| Autor com 101 caracteres | Erro associado; foco no autor; valor de 101 caracteres preservado |
| Título com apenas espaços e com 121 caracteres, antes da correção | Erro de título exibido e valor preservado; nenhum item acrescentado |
| Regiões vazias de resultado | Status e alert com display block e position absolute, sem remoção por display:none. Não foi executado leitor de tela; anúncio audível não comprovado |
| Limpeza | Recarga ao final removeu os valores temporários e exibiu acervo vazio. Nenhum cadastro válido foi enviado nesta rodada; db.json conservou SHA256 `92D67A68BD51A0B958650BDBF0DEC1625EE4E13768194FE5A081F4835F70ED40` |

Após os ajustes: `node --test src/domain/livro.test.js src/api/livros.test.js` passou com 20 testes e zero falhas; `npm run build` passou com 22 módulos, CSS 3,77 kB e JS 226,76 kB; `npx --no-install openspec validate catalogo-de-livros --strict` passou. A tarefa 6.2 mantém a caixa aberta para revisão com os responsáveis dos blocos 3–5; os dois defeitos técnicos reproduzidos foram corrigidos e retestados. Não confundir coordenação pendente com defeito ainda presente.

### Matriz dos 19 cenários nomeados — apoio à revisão coletiva de 6.4

Consolidação documental por Gabriel Fontes de Sousa com assistência do Codex em 22/11/2026. “Evidência existente” significa registro anterior neste relatório, não nova execução de todos os cenários nesta sessão. Nenhuma linha comprova participação conjunta dos seis; a aprovação coletiva final continua pendente.

| Cenário da spec | Evidência e resultado disponível | Pendência específica |
| --- | --- | --- |
| Consulta pendente | Bloco 5/5.1 e primeira inspeção do bloco 6: carregamento e cadastro bloqueado | Revisão coletiva |
| Consulta com registros | Bloco 5/5.1 e bloco 6: lista com dois registros na ordem recebida | Revisão coletiva |
| Acervo vazio | Blocos 5 e 6: mensagem de vazio, sem erro, cadastro habilitado | Revisão coletiva |
| Falha na consulta | Blocos 5 e 6: erro de rede, nova tentativa, cadastro bloqueado | Revisão coletiva |
| Nova tentativa | Bloco 5/5.2: clique duplo com um GET; bloco 6: recuperação real após API disponível | Revisão coletiva |
| Dados inválidos | Bloco 6: vazios, espaços, título 121 e autor 101; erros e preservação; foco corrigido | Revisão coletiva |
| Dados válidos | Bloco 5/5.3 e testes HTTP: envio e normalização; bloco 6: cadastros reais | Revisão coletiva |
| Ano não preenchido | Blocos 5/5.4 e 6: ano omitido no arquivo e “Ano não informado” na lista | Revisão coletiva |
| Ano válido | Blocos 5/5.4 e 6: 2008 numérico e exibido | Revisão coletiva |
| Ano inválido | Testes de domínio: tipos/limites; bloco 6: zero, 1.5 e 9999 rejeitados na tela | Reproduzir entrada não numérica na interface e revisão coletiva |
| Título repetido | Blocos 5 e 6: dois registros de mesmo título e ids distintos aceitos | Revisão coletiva |
| Envio pendente | Bloco 5/5.3: dois envios imediatos, um POST, controles bloqueados | Revisão coletiva |
| Cadastro bem-sucedido | Bloco 5/5.3: adição sem novo GET; bloco 6: campos limpos, sucesso e item exibido | Revisão coletiva |
| Persistência após recarga | Bloco 5/5.4: reinício da API e recarga; bloco 6: recarga e arquivo conferidos | Revisão coletiva |
| Erro de envio | Bloco 5/5.3: falha de rede, valores/lista preservados e nenhuma repetição automática | Revisão coletiva; respostas HTTP/JSON inesperadas só cobertas no cliente isolado |
| Resposta perdida após persistência | Sem execução integrada registrada | Simular persistência seguida de perda de resposta, conferir preservação, ausência de repetição e livro após recarga |
| Resposta fora do contrato | Bloco 2 e testes HTTP: rejeição de JSON/status/estrutura inválidos | Simular respostas inválidas de GET e POST no fluxo de tela |
| Uso em tela pequena e por teclado | Bloco 6: 360px/1440px, títulos longos, Tab, foco e labels; correções retestadas | Revisão coletiva |
| Anunciar resultado | Regiões status/alert verificadas no DOM, CSS ajustado para não ocultar regiões vazias | Revisão com responsáveis; leitor de tela não executado |

As simulações ainda pendentes não foram substituídas por build ou testes isolados. Para cada nova execução coletiva, registrar data, participantes reais, cenário, resultado observado, defeito e reteste; manter 6.4 aberta até concluir todos os critérios.

### Resultado atualizado: API disponível e testes de tela em 22/11/2026

Autor: Gabriel Fontes de Sousa, com assistência do Codex na continuidade do bloco 6. Após o usuário iniciar a API, o botão de recuperação apresentou acervo vazio e liberou os quatro campos e o botão. Não houve mudança de estrutura dos componentes de outros autores: o CSS utiliza as classes entregues nos blocos 3–5.

| Tarefa/cenário | Resultado real |
| --- | --- |
| 6.1 — título longo, mobile | Cadastro real de título com 120 letras L e autor com 100 letras A, sem espaços internos. Em 360 × 800, título com altura 91px, largura e scrollWidth ambos 258px. Documento com scrollWidth 345px (barra vertical), menor que viewport 360px. Título e autor quebraram linhas sem rolagem horizontal |
| 6.1 — título longo, desktop | Em 1440 × 900, grid com colunas de 667px e 493px; scrollWidth do documento 1440px. Título com largura e scrollWidth 580px. Sem rolagem horizontal |
| 6.1/6.2 — teclado habilitado | Tab de título para autor, categoria, ano e botão de cadastro, nessa ordem. Contorno sólido de 3px rgb(245,158,11) confirmado em autor, categoria, ano e botão. Os estados desabilitados e mensagem de falha foram inspecionados na rodada anterior; sucesso presente em role=status |
| 6.2 — envio vazio | Mensagens de título, autor e categoria apareceram. Defeito reproduzido: foco permaneceu no botão, em vez de ir ao título. Categoria com aria-invalid e aria-describedby ausentes; mensagem sem id. Tarefa 6.2 permanece aberta; correção compete ao formulário do bloco 4 |
| 6.4 — cadastro sem ano | Primeiro registro persistido com id string `cG0xYzlMSgA`; propriedade ano ausente no arquivo; tela mostrou “Ano não informado”. Mensagem “Livro cadastrado com sucesso.” em região de status; todos os campos limpos e habilitados |
| 6.4 — ano, duplicata e recarga | Segundo registro com mesmo título, id string `A4o9M_aoGNc` e ano numérico 2008; duplicata aceita. Após recarregar, ambos permaneceram na ordem de cadastro, com ano ausente/2008. Persistência conferida também em db.json; não houve reinício da API nesta rodada |
| Restauração | Os dois registros de teste foram removidos restaurando os bytes originais de db.json. SHA256 antes/depois: `92D67A68BD51A0B958650BDBF0DEC1625EE4E13768194FE5A081F4835F70ED40`. A cópia temporária deixou de estar acessível entre execuções; a restauração utilizou o conteúdo versionado com CRLF, somente após conferir o hash original e que a base continha exclusivamente os dois registros esperados. Nova recarga mostrou acervo vazio e formulário habilitado |

6.1 está concluída junto com as evidências anteriores de erro/desabilitado e o build já executado. O viewport foi restaurado. 6.2 segue aberta pelos defeitos reproduzidos e ausência de verificação com leitor de tela; 6.3 ainda carece dos usuários GitHub reais; 6.4 e 6.6 seguem abertas, sem simulação de resposta perdida/fora do contrato nesta rodada ou participação coletiva comprovada. Os registros abaixo preservam o histórico das limitações anteriores; a disponibilidade da API foi resolvida nesta última retomada.

### Primeira inspeção real no navegador em 22/11/2026

Após o usuário informar `http://localhost:5173`, foi possível abrir a aplicação no navegador integrado. A tentativa anterior de controlar o Opera foi interrompida por não identificar a URL com segurança; o Chrome não estava disponível no controlador. Os resultados abaixo complementam as limitações da primeira revisão, sem substituí-las por uma aprovação integral.

| Tarefa/cenário | Resultado observado |
| --- | --- |
| 6.1 — estado de erro em 360 × 800 | Uma coluna; largura de conteúdo 345px (barra vertical), viewport 360px e grid 329px; sem rolagem horizontal. Campos, mensagem e botão couberam na largura; página com rolagem vertical normal |
| 6.1 — estado de erro em 1440 × 900 | Duas colunas de 667px e 493px; `scrollWidth` 1440px para viewport 1440px; sem rolagem horizontal. Formulário e mensagem de falha legíveis na inspeção visual |
| 6.2 — teclado | Botão de recuperação acionado por Space; exibiu carregamento e depois voltou ao erro. Foco de teclado no botão confirmado por `document.activeElement`, `:focus-visible` e contorno sólido de 3px na cor rgb(245,158,11) |
| 6.2 — consulta indisponível | Árvore de acessibilidade exibiu labels dos quatro campos e todos os campos/botão de cadastro desabilitados. Mensagem de consulta e botão de recuperação presentes. Durante a nova tentativa, carregamento substituiu o erro e o botão |
| Limitação de integração | API permaneceu inacessível à página. Foi iniciado JSON Server em 3001 com arquivo temporário separado de `db.json`; mesmo assim a consulta no navegador falhou. Processo temporário encerrado ao final. Não determinar causa da conexão apenas por esse resultado; foi solicitado ao usuário iniciar `npm run api` no terminal local |

Não houve POST nem alteração em `db.json`. Lista com títulos longos, teclado nos campos habilitados, validação de erros, sucesso/falha do cadastro e leitor de tela ainda não foram exercitados nesta retomada. As tarefas 6.1 e 6.2 continuam abertas por esses critérios. O viewport temporário foi restaurado após os testes.

Revisão com assistência do Codex, retomando a atribuição já registrada e as alterações locais em `src/main.jsx` e `src/styles.css`. Ambiente: Node v24.14.1, npm 11.11.0, Vite 8.3.8. Esta revisão não representa sessão com os seis integrantes nem aprovação coletiva final.

| Tarefa | Comando/cenário executado | Resultado real e pendência |
| --- | --- | --- |
| 6.1 | Inspeção de `src/styles.css`, importação em `src/main.jsx` e build | CSS importado; grid com coluna única e duas colunas a partir de 52rem; títulos usam `overflow-wrap: anywhere`; há estilos de foco, erros e controles desabilitados. Navegador automatizado não ficou disponível: a primeira tentativa falhou ao criar perfil temporário por EPERM; com o diretório temporário do ambiente, o endpoint de depuração do Chrome não ficou acessível. Não foram medidos 360px/desktop, contraste ou rolagem; tarefa aberta |
| 6.2 | Inspeção de `FormularioLivro`, `EstadoListagem`, `ListaLivros` e `LivrosPage` | Labels associados por id; consulta/sucesso usam status e falhas usam alert. Defeitos: envio inválido retorna sem focar o primeiro campo; categoria não recebe `aria-invalid` nem `aria-describedby` e seu erro não tem id. São pendências do formulário do bloco 4, não alterado nesta revisão. CSS oculta regiões vazias com `display: none`; o anúncio após atualização precisa ser conferido com tecnologia assistiva. Teclado, árvore de acessibilidade e leitor de tela não executados; tarefa aberta |
| 6.3 | Atualizar README e organização, comparando scripts, paths e tabela oficial | README agora descreve o front integrado, comandos locais, ano opcional, responsáveis e pendências. Divisão reconciliada com a atribuição atual. `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` iniciou Vite em 748ms. Inicialização por outra pessoa, usuários GitHub e teste atualizado da API permanecem pendentes; tarefa aberta |
| 6.4 | Revisar cobertura anterior e cenários da spec | Evidências dos blocos anteriores preservadas. Nesta revisão não houve execução coletiva de todos os cenários, simulação integrada de resposta fora do contrato ou resposta perdida após persistência. Não declarar esses critérios aprovados; tarefa aberta |
| 6.5 | `node --test src/domain/livro.test.js src/api/livros.test.js` | 20 testes passaram; 0 falhas. Testes de domínio e cliente HTTP com fetch simulado; não são testes de tela |
| 6.5 | `npm run build` | Sucesso: 22 módulos; CSS 3,71 kB e JS 226,47 kB. Comprova empacotamento, não acessibilidade ou fluxo funcional |
| 6.5 | `npx --no-install openspec validate catalogo-de-livros --strict` | Sucesso: `Change 'catalogo-de-livros' is valid`. Validação estrutural dos artefatos |
| 6.6 | Ler `docs/revisao-do-grupo.md` e reflexão existente | Aprovação da spec registrada por relato de Jorge; faltam reflexão coletiva, detalhes e participação identificada na validação final. Nenhum relato novo foi inventado; tarefa aberta |

Somente 6.5 foi integralmente verificada nesta execução. A correção e nova execução dos defeitos do formulário dependem do responsável pelo bloco 4. A revisão não marca tarefas desse bloco. O bloco 6 não libera aprovação final do projeto.

Git: branch `main`, remoto `https://github.com/Jorglcs/atividade-frontend.git`; árvore já tinha alterações do bloco 6 ao iniciar. `git fetch origin main` falhou com `cannot open '.git/FETCH_HEAD': Permission denied`; não foi possível confirmar a situação remota atual. Commit/publicação dependem de permissão de escrita em `.git`; não descartar as mudanças locais.

## Bloco 1 — Jorge — 20/11/2026

Execução com assistência do Codex. Esta seção comprova apenas preparação e domínio; os fluxos completos de interface/API ainda não foram implementados nem aprovados por testes.

| Tarefa | Verificação executada | Resultado |
| --- | --- | --- |
| 1.1 | `npm ci` | 125 pacotes instalados; auditoria sem vulnerabilidades. A primeira tentativa restrita falhou no npm; repetição com acesso à rede terminou com sucesso |
| 1.1 | `node --version`, `npm --version` | Node v24.14.1; npm 11.11.0 |
| 1.1 | `npm run build` | Vite 8.3.8; build concluído, 14 módulos transformados |
| 1.1 | `npx --no-install openspec status --change catalogo-de-livros` | Quatro artefatos de planejamento presentes; isso não significa implementação completa |
| 1.2 | Validação/normalização exercitadas pelos testes de domínio | Trim dos textos, categorias, ano opcional omitido, conversão para número e validação de resposta conferidos |
| 1.3 | `node --test src/domain/livro.test.js` | 7 testes passaram, 0 falhas; espaços, limites, tipos, ano dinâmico e id string cobertos |
| 1.4 | Revisão do contrato e exemplos com/sem ano | Insumo atualizado conforme a spec; decisão do ano e aprovação por relato registradas separadamente |

Interfaces entregues em `src/domain/livro.js`: `CATEGORIAS`, `validarCadastro`, `normalizarCadastro` e `ehLivroValido`. `normalizarCadastro` pressupõe dados previamente aprovados por `validarCadastro`. Para ausência de ano, enviar campo vazio ou omitir a propriedade; null não pertence ao contrato.

Os responsáveis pelos blocos 2–6 devem acrescentar suas próprias evidências por número de tarefa. Consulta HTTP, formulário, persistência integrada, responsividade e acessibilidade permanecem pendentes.

## Bloco 2 — Davi — 20/11/2026

Execução com assistência do agente. Esta seção comprova o mock, o cliente HTTP e seus testes isolados. A integração com a interface (blocos 3–5) ainda não foi executada; portanto, os cenários completos de tela e o fluxo HTTP pelo navegador permanecem pendentes.

Ambiente: `npm ci` reinstalou 125 pacotes porque `node_modules` estava vazio; Node v24.19.0; npm 12.0.2; JSON Server 1.0.0-beta.15.

| Tarefa | Verificação executada | Resultado |
| --- | --- | --- |
| 2.1 | Cópia de `db.json` antes dos testes, `npm run api` (JSON Server na porta 3001), GET, POST e reinício da API | GET inicial HTTP 200 com `[]`; POST HTTP 201 com id string `zOAnVr6YpBo`; registro persistido em `db.json` e presente no GET após reiniciar a API (total 1); `db.json` restaurado ao final, com GET HTTP 200 e total 0 |
| 2.2 | `node --test src/api/livros.test.js` e servidor Vite com `VITE_API_URL` customizada | Formatos de retorno, cancelamento por `signal`, status inesperado e dados fora do contrato cobertos pelos testes; com `VITE_API_URL=http://exemplo.test:9999/`, o módulo servido pelo Vite recebeu esse valor. A base padrão `http://localhost:3001/livros` foi conferida nos testes |
| 2.3 | `node --test src/api/livros.test.js` | 13 testes passaram, 0 falhas: GET/POST com sucesso, envio sem id e sem ano vazio, ano como número, status inesperado, JSON inválido, falha de rede, cancelamento e array parcialmente inválido |
| 2.4 | Exemplos contra a API local, com e sem ano, e POST fora do domínio; restauração de `db.json` | POST sem ano e POST com ano retornaram HTTP 201 com id string; GET retornou HTTP 200 com os dois registros na ordem de criação; POST com título só de espaços, categoria inexistente e ano futuro também retornou HTTP 201, comprovando que o mock não valida o domínio e que chamadas externas não são protegidas pelo front. `db.json` restaurado ao final |

Limitações observadas: o cancelamento foi verificado com `fetch` simulado, não com rede real; a base configurável foi conferida no servidor de desenvolvimento, mas o build atual ainda não inclui o cliente porque a página do bloco 5 não o importa. A validação de domínio do front não protege chamadas diretas à API. O mock aceita duplicatas, não é idempotente e persiste em arquivo local. Detalhes em [api.md](api.md).

## Bloco 3 — Nicholas Paiva — 21/11/2026

Implementação com assistência do Codex. A montagem temporária no Vite usou dados de exemplo e um callback com Promise controlada. Os oito cenários passaram no Chrome em modo headless.

| Tarefa | Verificação executada | Resultado |
| --- | --- | --- |
| 3.1 | Montar a lista com array vazio e depois com dois livros em ordem diferente da ordem alfabética dos ids | Array vazio exibiu “Nenhum livro cadastrado.” em uma região de status. Os dois registros apareceram em `ul > li` na ordem recebida, com título, autor e categoria, além do ano numérico ou “Ano não informado” |
| 3.2 | Montar carregamento e erro, focar o botão e acionar a nova tentativa com a Promise pendente | Carregamento em região de status, falha em região de alerta e botão nativo focável. Um clique acionou o callback uma vez. Enquanto pendente, apareceu apenas o carregamento. Com a resolução, a mensagem de consulta saiu da tela |
| 3.3 | Conferir contratos de props, estrutura e classes abaixo | Componentes disponíveis para composição da página e para o CSS. Montagem temporária removida após a verificação |
| 3.1–3.3 | `node --test src/domain/livro.test.js src/api/livros.test.js` e `npm run build` | 20 testes passaram. Build da entrada existente concluído. A renderização dos componentes foi verificada separadamente na montagem temporária |

Os componentes em `src/components` usam exports nomeados. As classes abaixo podem ser usadas no CSS.

- `ListaLivros({ livros })` usa `ul.lista-livros`, `li.lista-livros__item`, `strong.lista-livros__titulo` e parágrafos para autor, categoria e ano. Com acervo vazio, usa `p.lista-livros-vazia[role="status"]`.
- `EstadoListagem({ carregando, erro, onTentarNovamente })` usa `p.estado-listagem[role="status"]` no carregamento. Na falha, usa `div.estado-listagem.estado-listagem--erro` com um parágrafo de alerta e o botão de nova tentativa. Em sucesso, a página pode renderizar a lista.

A verificação inspecionou o DOM, o foco e os papéis ARIA no navegador. A integração HTTP pela página, a responsividade e os anúncios em leitor de tela ficam para a validação dos blocos 5 e 6.

---

## Bloco 4 — Vitor Lima — 21/11/2026

Implementação do formulário de cadastro com campos controlados, validação de domínio, bloqueio contra envio duplo, e tratamento de sucesso/falha.

| Tarefa | Verificação executada | Resultado |
| --- | --- | --- |
| 4.1 | Criar `src/components/FormularioLivro.jsx` com campos controlados de título, autor, categoria e ano opcional, labels, mensagens de erro e foco ao primeiro campo inválido | Componente criado com inputs text/número e select. Validação usando `validarCadastro` do domínio. Campos inválidos impedem o envio e recebem mensagem de erro. Dados válidos enviam payload normalizado via `normalizarCadastro`. |
| 4.2 | Implementar bloqueio por `indisponivel`, estado pendente e guarda síncrona contra envio duplo | Campo `indisponivel` desabilita o formulário quando a consulta não está em sucesso. Estado `enviando` desabilita campos e botão, exibe "Cadastrando...". Guarda por referência (`guard.current`) impede chamadas repetidas antes da próxima renderização. |
| 4.3 | Implementar sucesso e falha com mensagens da spec; sucesso limpa campos, falha preserva valores | Sucesso: campos limpos, formulário reabilitado, mensagem "Livro cadastrado com sucesso." Falha: campos preservados, formulário reabilitado, mensagem "Não foi possível cadastrar o livro. Tente novamente." Nenhuma repetição automática ocorre. |
| 4.4 | Registrar em `docs/validacao.md` resultados isolados do formulário e seu contrato de props | Registro acima. Cobertura de campos obrigatórios, ano vazio/válido/inválido, envio pendente, sucesso e falha, incluindo as mensagens anunciáveis. |

Componentes entregues em `src/components/FormularioLivro.jsx`:
- `FormularioLivro({ onCadastrar, indisponivel })` usa exports nomeados `CATEGORIAS`, `validarCadastro`, `normalizarCadastro` de `src/domain/livro.js`
- Campos: título (1-120 chars), autor (1-100 chars), categoria (Literatura/Tecnologia/Ciências/Outros), ano (opcional, inteiro 1-corrente)
- Mensagens: erros por campo, "Cadastrando..." durante envio, sucesso e falha fixas da spec
- Estado: `enviando` desabilita campos/botão, `indisponivel` bloqueia formulário antes da primeira consulta

Integração com `src/pages/LivrosPage.jsx` e `src/api/livros.js`. Build e testes aprovados (20/20). Responsividade e acessibilidade ficam para blocos 5 e 6.

## Bloco 5 — Gustavo Alves Mota — 22/11/2026

Verificação automatizada no Chrome 157.0.8103.79 em modo headless, com Vite em desenvolvimento (`StrictMode`) e JSON Server 1.0.0-beta.15. Um roteiro temporário do Playwright controlou a entrega de respostas lentas. O front usou `VITE_API_URL` para acessar a API com uma cópia de `db.json`. A conferência final confirmou que a base do repositório permaneceu intacta.

| Tarefa | Verificação executada | Resultado |
| --- | --- | --- |
| 5.1 | Abrir a aplicação com GET inicial pendente e liberar a resposta HTTP 200 com `[]` | `App` exibiu as seções de acervo e cadastro. Durante o GET, apareceu apenas o carregamento e os cinco controles do formulário ficaram desabilitados. A resposta vazia exibiu “Nenhum livro cadastrado.” e liberou os controles. A recarga com registros exibiu a lista na ordem recebida |
| 5.2 | Desmontar a página durante um GET pendente e simular uma resposta antiga chegando após o cancelamento no `StrictMode` | O navegador registrou `net::ERR_ABORTED` ao desmontar. Na simulação, só o resultado da consulta mais recente permaneceu na tela |
| 5.2 | Desligar o JSON Server, recarregar a página, religar a API e clicar duas vezes seguidas em “Tentar novamente” | A falha de rede exibiu o alerta de consulta e manteve o formulário bloqueado. Os dois cliques produziram um GET; durante a nova tentativa, apenas o carregamento ficou visível. O HTTP 200 recuperou a tela e liberou o cadastro. Nenhum POST foi disparado nessa etapa |
| 5.3 | Fazer dois envios imediatos com o primeiro POST pendente | Uma requisição foi observada. Os controles ficaram bloqueados com “Cadastrando...”. Após o HTTP 201, o livro apareceu na lista e a mensagem de acervo vazio saiu. O formulário limpou os campos, exibiu a mensagem de sucesso em uma região de status e voltou a aceitar edição. Nenhum GET adicional foi executado |
| 5.3 | Desligar o JSON Server após os cadastros e enviar um terceiro livro | A única tentativa de POST falhou na rede. O formulário exibiu o alerta, preservou os quatro valores e voltou a aceitar edição. Os dois itens da lista permaneceram na mesma ordem. Religada a API, o navegador não repetiu o POST |
| 5.4 | Executar GET → dois POST com o mesmo título → reiniciar o JSON Server → recarregar | Os dois POST retornaram HTTP 201 com ids string distintos gerados pela API. O primeiro payload omitiu o ano e a lista exibiu “Ano não informado”. O segundo enviou `2008` como número e a lista exibiu o ano. O GET da recarga retornou HTTP 200 com os mesmos dois registros na ordem de cadastro, conferidos também no arquivo temporário |
| 5.1–5.4 | `node --test src/domain/livro.test.js src/api/livros.test.js`, `npm run build` e `npx --no-install openspec validate catalogo-de-livros --strict` | 20 testes passaram. O Vite 8.3.8 gerou o build com 21 módulos transformados. A mudança passou na validação estrutural do OpenSpec |

Com autorização de Gustavo, o formulário recebeu a importação de `useRef`, o bloqueio efetivo dos controles e as mensagens de sucesso e falha necessárias à integração. O contêiner `.livros-page` reúne as duas seções para o CSS do bloco 6. A validação conferiu as regiões de status e alerta no DOM. A revisão de responsividade, foco e anúncios em leitor de tela segue nas tarefas do bloco 6.

## Checagem final — Jorge, com assistência do Codex — 22/11/2026

Esta seção atualiza o andamento; os registros anteriores descrevem suas respectivas datas. Revisão final autorizada por Jorge, que relatou concordância dos responsáveis. Atribuições preservadas conforme solicitado.

| Tarefa | Execução e resultado real |
| --- | --- |
| 4.1 | E2E integrado: vazio, espaços, limites, categoria e anos inválidos bloqueados, foco no primeiro erro e ARIA associados. Payload válido normalizado. Ajustado ano para texto com inputMode numeric e formulário noValidate, preservando texto e aplicando a regra compartilhada. Reteste passou |
| 4.2 | Componente isolado com indisponivel e Promise controlada; dois requestSubmit síncronos geraram uma chamada. No fluxo HTTP, cinco controles bloqueados e um POST durante atraso. Passou |
| 4.3 | Callback isolado rejeitado preservou valores e liberou envio; resolução posterior limpou campos e anunciou sucesso. Falhas reais/interceptadas de HTTP preservaram os quatro campos e lista, sem repetição. Passou |
| 4.4 | Contrato permanece FormularioLivro({ onCadastrar, indisponivel }); callback recebe payload normalizado e retorna Promise. Cobertura de obrigatórios, ano vazio/válido/inválido, envio pendente, sucesso e falha em scripts/e2e.mjs; 17 verificações passaram |
| 6.2 | Teclado, outline, labels, foco, status/alert e árvore de acessibilidade Chrome conferidos. Concordância dos responsáveis relatada por Jorge. Sem leitor de tela nesta execução; não se afirma anúncio audível |
| 6.3 | README e organização reconciliados com a checagem final. Usuários GitHub ainda não fornecidos; tarefa aberta |
| 6.4 | Os 19 cenários da spec estão mapeados em checagem-final.md, cobertos pelas 17 verificações E2E. JSON Server real em banco temporário, reinício e perda de resposta após persistência conferidos. Presença dos seis na execução não informada; tarefa aberta nesse critério |
| 6.5 | 25 testes passaram; build da aplicação e da página isolada passaram; OpenSpec strict passou |
| 6.6 | Reflexão técnica redigida a pedido de Jorge, identificada como síntese assistida, sem falas fictícias. Concordância final dos seis registrada por relato de Jorge em revisao-do-grupo.md |

Detalhes, matriz dos 19 cenários, limites e reprodução: [checagem-final.md](checagem-final.md). Saída final de node scripts/e2e.mjs: 17 verificações E2E, Chrome 157.0.8103.79, exit 0. O banco original não foi alterado. Build não foi usado como substituto de validação funcional.
