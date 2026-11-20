# Estante do Grupo — requisitos para revisão

Status: requisitos preliminares aprovados pelo solicitante na conversa. Aprovação coletiva informada por Jorge nesta conversa em 20/11/2026; detalhes da sessão no registro do grupo. A spec estruturada atual está em `openspec/changes/catalogo-de-livros/specs/catalogo-livros/spec.md` e prevalece em caso de divergência com este insumo.

## Objetivo

Criar um catálogo compartilhado de livros para que o grupo consulte o acervo e cadastre títulos. A primeira entrega contém uma única funcionalidade completa: consultar e cadastrar livros por uma API HTTP.

Framework proposto: OpenSpec, por organizar uma mudança pequena em proposta, especificação, design e tarefas. Stack proposta: React com Vite, JavaScript, CSS e JSON Server. Confirmar essas escolhas na sessão conjunta.

## Escopo

- Uma página com formulário de cadastro e lista de livros.
- Carregamento inicial, lista vazia, cadastro bem-sucedido e falhas de comunicação.
- Persistência no arquivo `db.json` por meio do JSON Server.

Ficam para outro ciclo: login, usuários, empréstimos, edição, exclusão, pesquisa, filtros, capas e integração com APIs externas de livros.

## Contrato da API

Endereço local proposto: `http://localhost:3001`, configurável por `VITE_API_URL`. Recurso: `/livros`.

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | string | Gerado pela API; o front não envia no cadastro |
| titulo | string | Obrigatório, de 1 a 120 caracteres após remover espaços nas pontas |
| autor | string | Obrigatório, de 1 a 100 caracteres após remover espaços nas pontas |
| categoria | string | Um dos valores: Literatura, Tecnologia, Ciências, Outros |
| ano | number, opcional | Inteiro entre 1 e o ano corrente; omitir quando vazio |

Conteúdo inicial de `db.json`: `{"livros": []}`. Dados de demonstração são opcionais e devem respeitar o contrato.

| Operação | Requisição | Resposta esperada |
| --- | --- | --- |
| Listar | `GET /livros` | HTTP 200 e array de livros |
| Cadastrar | `POST /livros`, JSON com titulo, autor, categoria e ano opcional | HTTP 201 e livro persistido com id |

O JSON Server é um mock e não garante essas regras de domínio. A validação dos campos é responsabilidade do front neste ciclo. Não há restrição de duplicidade: livros com o mesmo título são permitidos. O front deve verificar o status HTTP e tratar falhas de rede, respostas não bem-sucedidas e JSON inválido como erro da operação.

## Requisitos funcionais e aceitação

### RF01 — Listar livros

Ao abrir a página, consultar `GET /livros` e mostrar título, autor, categoria e ano de cada livro; quando ausente, apresentar “Ano não informado”; manter os livros na ordem recebida da API.

- CA01: enquanto a consulta estiver pendente, exibir “Carregando livros...”.
- CA02: com resposta válida contendo livros, mostrar todos os registros, usando id como chave.
- CA03: com array vazio, mostrar “Nenhum livro cadastrado.”, sem tratar como erro.
- CA04: em falha, mostrar “Não foi possível carregar os livros.” e botão “Tentar novamente”. O botão repete a consulta sem recarregar a página.
- CA05: durante uma nova tentativa, impedir consultas repetidas pelo botão.

### RF02 — Cadastrar livro

O formulário contém título, autor, categoria com opção inicial “Selecione”, ano opcional e botão “Cadastrar livro”.

- CA06: campos em branco ou só com espaços, limites excedidos ou categoria não selecionada impedem o POST e exibem mensagens junto aos campos. Os limites devem ser conferidos também na validação do envio.
- CA07: um envio válido remove espaços nas pontas de título e autor e faz um único POST com os três campos obrigatórios e ano numérico quando informado; omitir ano quando vazio.
- CA08: enquanto o POST estiver pendente, desabilitar o botão de envio e os campos e mostrar “Cadastrando...”, impedindo envio duplo.
- CA09: após sucesso, adicionar à lista o livro retornado pela API, sem novo GET, limpar o formulário e mostrar “Livro cadastrado com sucesso.”. A lista vazia deixa de aparecer.
- CA10: se o POST falhar, manter os valores preenchidos, reabilitar o formulário, mostrar “Não foi possível cadastrar o livro. Tente novamente.” e não adicionar um livro localmente.
- CA11: após sucesso e recarregamento da página, o livro deve continuar disponível pela API.
- CA12: o formulário fica indisponível enquanto a listagem estiver carregando ou com erro. Ele é liberado após uma consulta bem-sucedida, inclusive quando vazia. Isso evita misturar uma lista desconhecida com o cadastro.

Em falhas de rede, o servidor pode ter recebido um POST mesmo sem o navegador receber a resposta. Não repetir o POST automaticamente; o usuário pode consultar novamente a lista antes de reenviar. Não se exige idempotência neste mock.

### RF03 — Ano de publicação opcional

- CA13: permitir cadastro sem ano e omitir a propriedade do POST.
- CA14: quando preenchido, aceitar somente inteiro entre 1 e o ano corrente no envio; rejeitar valor futuro, fracionário, não numérico, zero ou negativo com erro no campo e sem POST.
- CA15: aceitar livros sem ano na consulta e mostrar “Ano não informado”; ano presente na resposta deve ser número válido. Respostas fora do contrato são falha da operação.

Exemplos de payload (o id é gerado pela API):

```json
{"titulo":"Dom Casmurro","autor":"Machado de Assis","categoria":"Literatura"}
```

```json
{"titulo":"Dom Casmurro","autor":"Machado de Assis","categoria":"Literatura","ano":1899}
```

## Requisitos não funcionais

- RNF01: usar React com Vite e as pastas `src/api`, `src/components` e `src/pages`.
- RNF02: centralizar as chamadas HTTP em `src/api/livros.js`; componentes não acessam `db.json` diretamente nem usam localStorage como persistência.
- RNF03: funcionar em largura de 360 px e em desktop, sem rolagem horizontal.
- RNF04: formulário com labels associados, navegação por teclado, foco visível e mensagens de resultado anunciáveis por tecnologia assistiva.
- RNF05: fornecer instruções reproduzíveis para subir API e front em terminais separados, além de `.env.example` e dependências com versões registradas no lockfile.
- RNF06: versionar código, contrato, artefatos do OpenSpec e evidências de validação. Não versionar `node_modules` ou segredos.

## Rastreabilidade da atividade

| Exigência | Como será atendida |
| --- | --- |
| React com Vite e organização exigida | RNF01 e estrutura no plano preliminar |
| Consumo HTTP | GET e POST em `/livros` |
| Listagem, cadastro e erro | RF01, RF02 e CA04/CA10 |
| Spec, plano e tarefas do framework | Gerar e revisar na sessão OpenSpec; estes documentos são insumos |
| Participação dos seis integrantes | Divisão preliminar em `docs/divisao-preliminar.md` |
| Alteração própria em cada etapa | Registrar mudanças reais em `docs/revisao-do-grupo.md` |
| GitHub e colaboradores | Criar repositório e convidar os outros cinco integrantes |
| Validação e reflexão | Executar os critérios e documentar resultados reais |

## Decisões a confirmar na sessão

Tema, framework, campos, limites, categorias, permissão de duplicatas e bloqueio do cadastro quando a listagem falhar. Cada integrante deve ler e concordar; divergências e mudanças ficam registradas nos arquivos.
