# Design

Status: aprovação coletiva informada por Jorge em 20/11/2026. Implementação parcial: blocos 1 e 2 concluídos; demais pendentes.

## Context

A base existente contém React/Vite, um ponto de entrada com mensagem provisória, as pastas exigidas e JSON Server configurado para a porta 3001. O `db.json` contém uma coleção vazia de livros. Não há cliente HTTP, formulário ou página funcional implementados.

Motivação e escopo: [proposal.md](proposal.md). Comportamentos exigidos, incluindo ano opcional: [spec.md](specs/catalogo-livros/spec.md). Este design utiliza a spec atual; os documentos em `docs/` são insumos preliminares e alguns ainda descrevem o contrato anterior, sem ano.

O design é necessário porque cliente HTTP, página e componentes serão implementados por pessoas diferentes. As interfaces abaixo estabelecem como essas entregas se conectam.

## Goals / Non-Goals

**Goals:**

- Definir responsabilidades, interfaces e estados sem depender de decisões paralelas incompatíveis.
- Concentrar comunicação HTTP e validação do contrato em uma fronteira explícita.
- Manter regras de campos consistentes entre formulário e respostas da API.
- Permitir verificar cada cenário da spec com uma solução local reproduzível.

**Non-Goals:**

- Introduzir roteamento, estado global, biblioteca de formulários ou servidor de produção neste ciclo.
- Definir identidade visual completa ou distribuir tarefas neste documento.
- Transformar o mock em um servidor que imponha regras de domínio.

## Decisions

### 1. Página única, estado local e componentes com interfaces explícitas

`src/main.jsx` montará `App`, que apresentará `LivrosPage`. Não será necessário um roteador para uma única página.

| Módulo previsto | Responsabilidade e interface |
| --- | --- |
| `src/pages/LivrosPage.jsx` | Controlar livros, estado da consulta e integração com a API |
| `src/components/ListaLivros.jsx` | Receber `{ livros }`; renderizar registros ou estado vazio, usando id como chave |
| `src/components/EstadoListagem.jsx` | Receber `{ carregando, erro, onTentarNovamente }`; renderizar carregamento ou erro de consulta |
| `src/components/FormularioLivro.jsx` | Receber `{ onCadastrar, indisponivel }`; controlar campos, validação, envio e mensagens do cadastro |
| `src/api/livros.js` | Exportar `listarLivros({ signal } = {})` e `cadastrarLivro(dados)`; retornar Promises com dados válidos ou rejeitar |
| `src/domain/livro.js` | Compartilhar categorias, normalização e validação do livro, sem dependência de React ou fetch |
| `src/styles.css` | Estilos compartilhados, foco e responsividade |

A pasta adicional `src/domain` mantém regras de domínio separadas das três pastas obrigatórias. Suas interfaces propostas são `CATEGORIAS`, `validarCadastro(campos, anoAtual)` (mapa de erros por campo), `normalizarCadastro(campos)` (payload) e `ehLivroValido(valor, anoAtual)` (booleano). O formulário só normaliza depois de validar.

`onCadastrar(dados)` retornará uma Promise: a página chama a API e acrescenta o livro confirmado à lista por atualização funcional do estado. Em falha, rejeita para o formulário apresentar a mensagem e preservar os campos. Apenas o formulário controla o estado de envio e as mensagens de cadastro.

**Justificativa:** um proprietário para cada estado evita cópias divergentes. Interfaces pequenas permitem desenvolver componentes separadamente.

**Alternativas consideradas:** Context/Redux adicionariam coordenação desnecessária para uma página. Um componente único concentraria responsabilidades e aumentaria conflitos entre integrantes. Duplicar validações no cliente e no formulário permitiria regras diferentes para o mesmo campo.

### 2. Consulta representada por estados exclusivos

A página manterá `livros` e um estado de consulta `carregando`, `sucesso` ou `erro`. Começará em carregamento. A lista só será apresentada em sucesso; um array vazio é sucesso, não um quarto estado de comunicação.

O formulário recebe `indisponivel` quando a consulta não estiver em sucesso. Uma tentativa de recuperação muda erro para carregando, faz um GET e termina em sucesso ou erro. Enquanto pendente, o controle de nova tentativa fica desabilitado ou é substituído pelo carregamento.

O GET inicial será iniciado em um efeito com `AbortController` e limpeza no desmontar. Respostas de consultas canceladas não atualizarão a página nem produzirão mensagem de falha. React StrictMode pode iniciar e cancelar uma consulta adicional em desenvolvimento; isso não equivale a envio duplo de cadastro. O POST será iniciado exclusivamente pelo evento de envio, nunca por um efeito.

**Justificativa:** estados exclusivos impedem mostrar erro, vazio e carregamento simultaneamente; o cancelamento evita que uma resposta antiga sobrescreva o estado atual.

**Alternativa considerada:** biblioteca de cache/consultas. Seria útil com múltiplas páginas ou sincronização recorrente, mas acrescentaria uma dependência sem necessidade neste fluxo.

### 3. Fronteira HTTP com fetch e verificação explícita

O cliente usará `fetch`, com base `import.meta.env.VITE_API_URL` ou `http://localhost:3001`, removendo barras finais antes de acrescentar `/livros`. O POST enviará `Content-Type: application/json` e somente os campos do contrato.

`listarLivros` exigirá status 200, JSON em forma de array e todos os elementos válidos. `cadastrarLivro` exigirá status 201 e livro válido. JSON inválido, formato incompatível, falha de rede e status inesperado rejeitam a Promise. Um array parcialmente inválido é rejeitado inteiro para não apresentar um acervo incompleto como sucesso. As mensagens de interface serão fixas, conforme a spec, sem exibir detalhes internos da resposta.

**Justificativa:** fetch não trata automaticamente respostas HTTP de erro como rejeição; confirmar status e dados evita anunciar sucesso sem um livro utilizável.

**Alternativas consideradas:** Axios e validação por biblioteca de schemas. O contrato pequeno permite usar funções puras e fetch sem novas dependências. Aceitar qualquer resposta 2xx seria incompatível com os status especificados neste ciclo.

### 4. Ano opcional com representação única no payload

Os campos do formulário serão strings enquanto editados. Título e autor terão espaços das pontas removidos. Categoria deverá pertencer à lista compartilhada.

O campo ano terá indicação “opcional”. Vazio ou apenas espaços significa ausência: a propriedade `ano` será omitida do payload, sem enviar string vazia, zero ou null. Quando preenchido, deverá representar um inteiro entre 1 e o ano corrente e será convertido para número apenas após validação. O limite será calculado na data do envio pelo relógio local, sem fixar 2026 no código.

Na resposta, `ano` ausente é válido; se presente, deve ser número inteiro no intervalo. A lista apresentará o valor ou “Ano não informado”. As demais propriedades obrigatórias e id string também serão verificadas. Campos adicionais da resposta não precisarão ser exibidos nem reenviados.

**Justificativa:** distinguir ausência de zero e string vazia mantém um contrato simples para formulário, mock e listagem.

**Alternativas consideradas:** enviar null ou armazenar o ano como string. Ambas criariam representações adicionais não previstas no contrato atual.

### 5. Cadastro confirmado pela API, sem atualização otimista

O formulário validará no envio. Com erro, exibirá mensagens por campo e não chamará `onCadastrar`. Com dados válidos, limpará mensagens antigas, assumirá envio pendente e bloqueará campos e botão. Uma guarda síncrona de envio, por referência, impedirá chamadas repetidas antes mesmo da próxima renderização.

Ao resolver a Promise, o formulário limpará os campos e anunciará sucesso; a página já terá acrescentado o livro retornado ao final da lista. Ao rejeitar, manterá os campos e anunciará falha. Em ambos os casos, liberará a guarda e o estado pendente. Nenhum POST será repetido automaticamente.

**Justificativa:** a spec exige adicionar somente o registro confirmado, preservando os dados em falha e sem novo GET após sucesso.

**Alternativas consideradas:** atualização otimista exigiria desfazer registros provisórios. Refazer o GET após cadastrar acrescentaria uma segunda operação que poderia falhar depois de um cadastro bem-sucedido e contrariaria a spec atual.

### 6. HTML semântico e CSS simples

A página terá um título, uma seção para cadastro e uma para o acervo. Em 360 px, o conteúdo ficará em uma coluna; em telas maiores, poderá usar duas colunas com CSS Grid. Livros serão itens de uma lista semântica com quebra de textos longos, evitando tabelas largas.

Labels terão associação por id; erros de campo usarão `aria-invalid` e `aria-describedby`. Mensagens de carregamento e sucesso usarão região de status; falhas usarão região de alerta. O foco permanecerá visível e seguirá a ordem do documento. O primeiro campo inválido receberá foco após tentativa de envio inválida.

**Justificativa:** recursos nativos atendem aos critérios de teclado, mensagens anunciáveis e largura mínima sem acrescentar biblioteca visual.

**Alternativa considerada:** biblioteca de componentes. Não é necessária para este conjunto pequeno de controles e exigiria padronização adicional pelo grupo.

### 7. Verificação por camadas

Na implementação, funções de domínio e cliente HTTP poderão ser verificadas com `node:test` e fetch simulado, cobrindo limites do ano, ausência do campo, status inesperado, JSON inválido e dados fora do contrato. Não será necessário acrescentar biblioteca de testes para essas verificações.

Os cenários de interface serão executados com a API local, incluindo carregamento lento, lista vazia, sucesso, falha de GET/POST, recuperação, preservação dos campos, envio duplo, recarga, teclado e largura de 360 px. As evidências deverão distinguir resultado observado de critério ainda pendente. Build e validação OpenSpec complementam essas verificações, mas não substituem testes funcionais.

**Justificativa:** separar domínio/HTTP de interface permite reproduzir falhas difíceis de provocar só desligando o mock.

**Alternativa considerada:** começar com uma suíte completa de automação de navegador. Pode ser útil em ciclos posteriores, mas adiciona configuração para um primeiro fluxo pequeno.

## Risks / Trade-offs

- [Mock não valida domínio] → Validar no front e verificar respostas; documentar que chamadas externas podem inserir dados inválidos. Um backend real precisará impor o contrato no servidor.
- [POST persistido com resposta perdida] → Não repetir automaticamente. Preservar os campos e permitir conferir a lista por recarga antes de reenviar, conforme a spec; não há idempotência.
- [Relógio local incorreto] → Calcular o ano no envio e documentar essa dependência. Validação autoritativa de tempo pertence a um futuro servidor real.
- [Divergências entre membros do grupo] → Usar estas interfaces como contrato antes de dividir as tarefas; mudanças de comportamento voltam à spec.
- [Documentos preliminares sem o campo ano] → Consultar a spec atual e este design; reconciliar os insumos quando houver autorização para editar esses arquivos.
- [JSON Server em versão beta] → Usar a versão do lockfile e conferir id string, status e persistência no ambiente do grupo.

## Migration Plan

Não há dados existentes a migrar: a coleção atual está vazia. Registros sem ano continuarão válidos, pois a propriedade é opcional.

A execução seguirá localmente, com API e front em processos separados e dependências reproduzidas por `npm ci`. Nenhuma publicação ou alteração no GitHub faz parte deste design. Antes de qualquer teste que escreva dados reais de demonstração, preservar uma cópia de `db.json`; para reverter dados de teste, restaurar essa cópia. Código futuro poderá ser revertido pelo controle de versão quando o grupo autorizar commits.
