# Checagem final — 22/11/2026

Execução técnica pelo Codex a pedido de Jorge, preservando as atribuições existentes. Jorge informou que os responsáveis concordam com a revisão final. Isso é concordância por relato, não comprovação de presença dos seis durante a execução automatizada.

## Execução reproduzível

Instale `playwright-core` em um ambiente de testes separado e disponibilize Chrome. Execute `node scripts/e2e.mjs` com `PLAYWRIGHT_MODULE` apontando para a URL `file:///.../playwright-core/index.mjs` dessa instalação. Sem a variável, o script procura `playwright-core` normalmente. `E2E_BROWSER` permite selecionar outro canal compatível. Nesta máquina foi reutilizada uma instalação existente no cache npm, sem alterar o lockfile.

O script inicia Vite na porta 5187 e JSON Server na 3107. Usa um diretório temporário com banco próprio; encerra seus processos e remove esse diretório ao terminar. Não altera `db.json` do grupo. Não execute duas instâncias simultâneas nas mesmas portas.

Comando executado em PowerShell nesta máquina:

```powershell
$env:PLAYWRIGHT_MODULE='file:///C:/Users/user/AppData/Local/npm-cache/_npx/9b9809298fe40d2c/node_modules/playwright-core/index.mjs'
node scripts/e2e.mjs
```

Resultado final: **17 verificações passaram, código de saída 0**, Chrome 157.0.8103.79. A primeira versão do teste contou opções desabilitadas junto com controles; o seletor foi corrigido. O fixture isolado exigiu ajustar a interoperabilidade do módulo ReactDOM e a inicialização de React Refresh. Esses problemas eram do roteiro; a execução final passou integralmente.

## Matriz dos 19 cenários da spec

| Cenário | Evidência observada na execução final |
| --- | --- |
| Consulta pendente | GET atrasado; carregamento visível e formulário bloqueado |
| Consulta com registros | Registros exibidos após GET e após reinício real da API |
| Acervo vazio | Mensagem de vazio e cadastro liberado |
| Falha na consulta | Rede interrompida, HTTP 503, JSON inválido e objeto fora do contrato exibem erro e bloqueiam formulário |
| Nova tentativa | Recuperação por botão após cada uma das quatro falhas |
| Dados inválidos | Vazio, espaços, título de 121 caracteres, autor de 101 e categoria vazia não enviam POST; foco e erro associados |
| Dados válidos | Payload com trim e apenas campos do contrato; registro confirmado sem novo GET |
| Ano não preenchido | Payload sem propriedade ano e lista com “Ano não informado” |
| Ano válido | Limite inferior 1 e ano corrente enviados como números |
| Ano inválido | Zero, negativo, fracionário, texto e futuro bloqueados, com valor preservado e foco no ano |
| Título repetido | Dois registros de mesmo título aceitos com ids distintos |
| Envio pendente | Dois eventos síncronos geram um POST; cinco controles bloqueados e “Cadastrando...” visível |
| Cadastro bem-sucedido | Item acrescentado, vazio removido, campos limpos e mensagem de sucesso |
| Persistência após recarga | API encerrada e reiniciada sobre banco temporário; recarga preserva registros e ordem |
| Erro de envio | Quatro falhas de POST preservam os quatro campos e lista, reabilitam controles e não repetem POST |
| Resposta perdida após persistência | Proxy de teste encaminha POST real, descarta a resposta e interrompe a conexão; arquivo tem um novo registro, tela mantém lista anterior, recarga recupera registro sem novo POST |
| Resposta fora do contrato | GET objeto e POST com id numérico rejeitados na interface |
| Uso em tela pequena e por teclado | 360 e 1280 px sem overflow, título com 120 caracteres sem espaços; Tab segue autor/categoria/ano/botão; foco com outline e labels presentes |
| Anunciar resultado | Papéis status/alert no DOM e árvore de acessibilidade Chrome com campo Título nomeado. Sem leitor de tela: não se afirma anúncio audível |

As falhas HTTP são interceptadas pelo Playwright; o fluxo normal e a persistência usam JSON Server real. A prova de resposta perdida usa POST real antes de interromper sua resposta. O teste isolado usa o componente real com callback controlado, conferindo `indisponivel`, normalização, guarda dupla, rejeição, preservação, sucesso e limpeza. Não é uma sessão coletiva presencial.

## Ajuste encontrado e reteste

O input numérico e a validação nativa podiam impedir que ano fracionário chegasse ao handler e apagavam texto não numérico. O formulário passou a usar `noValidate` e ano textual com `inputMode="numeric"`: o domínio decide os erros, preserva a entrada e direciona o foco. Reteste com `1.5`, `abc`, zero, negativo e futuro passou.

## Verificações complementares

- `node --test src/domain/livro.test.js src/api/livros.test.js scripts/transporte-validacao.test.js`: 25 passaram, zero falhas.
- `npm run build`: sucesso, 22 módulos.
- `npm run validar:preparar`: sucesso, 24 módulos.
- `npx --no-install openspec validate catalogo-de-livros --strict`: mudança válida.

## Reflexão técnica elaborada a pedido de Jorge

O texto abaixo foi escrito com assistência do Codex em linguagem de estudante. É uma síntese dos resultados registrados; não representa falas individuais inventadas.

Ao estudar este projeto, fica mais claro que fazer a tela funcionar é só uma parte do trabalho. A spec definiu detalhes que poderiam passar despercebidos, como omitir o ano vazio, aceitar título repetido e aguardar a confirmação da API antes de inserir um livro na lista.

Uma dificuldade foi perceber que testes de funções e build não garantem o comportamento do navegador. O campo de ano, por exemplo, precisava preservar entradas inválidas e apresentar a mensagem do domínio. O teste de ponta a ponta permitiu conferir esse comportamento junto com foco, bloqueio de controles e recuperação de erros.

O OpenSpec ajudou a separar comportamento, solução técnica e tarefas. Também mostrou um cuidado necessário: documentação pode ficar desatualizada mesmo quando o código avança. A lista de tarefas e as evidências precisam ser revisadas juntas.

Em outro trabalho, seria útil preparar a automação de navegador e a matriz de cenários mais cedo. Se outro framework fosse usado, ainda seria necessário manter contratos claros e registrar resultados reais. A ferramenta organiza o processo, mas não substitui os testes nem a coordenação do grupo.

## Limitações administrativas

Usuários GitHub individuais ainda não informados. A presença dos seis na execução final não foi informada. A concordância com a revisão foi relatada por Jorge; não foram inventadas assinaturas, contas ou execução coletiva. Por isso 6.3 e 6.4 continuam abertas nos respectivos critérios administrativos, embora a documentação e os 19 cenários técnicos tenham sido conferidos.
