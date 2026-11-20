# Spec Delta

## Purpose

Permitir que o grupo consulte e amplie um catálogo compartilhado de livros, com persistência HTTP e respostas claras para validações e falhas de comunicação.

## ADDED Requirements

### Requirement: Consultar acervo

O sistema SHALL consultar `GET /livros` ao abrir a página e apresentar título, autor, categoria e ano quando informado, na ordem recebida. Para ano ausente SHALL mostrar “Ano não informado”. SHALL distinguir carregamento, resultado vazio e falha.

#### Scenario: Consulta pendente
- **WHEN** a consulta inicial ou uma nova tentativa estiver pendente
- **THEN** mostrar “Carregando livros...” e manter o cadastro indisponível.

#### Scenario: Consulta com registros
- **WHEN** a API responder HTTP 200 com um array válido de livros
- **THEN** apresentar todos os registros na ordem recebida e liberar o cadastro.

#### Scenario: Acervo vazio
- **WHEN** a API responder HTTP 200 com array vazio
- **THEN** mostrar “Nenhum livro cadastrado.” e liberar o cadastro, sem mensagem de erro.

### Requirement: Recuperar consulta com falha

O sistema SHALL tratar falhas de rede, status HTTP não bem-sucedido e JSON inválido como falha da consulta, oferecendo nova tentativa sem recarregar a página.

#### Scenario: Falha na consulta
- **WHEN** a consulta falhar
- **THEN** mostrar “Não foi possível carregar os livros.”, oferecer “Tentar novamente” e manter o cadastro indisponível.

#### Scenario: Nova tentativa
- **WHEN** o usuário acionar “Tentar novamente”
- **THEN** executar um novo GET, impedir outras tentativas enquanto pendente e, após sucesso, apresentar o resultado e liberar o cadastro.

### Requirement: Validar dados de cadastro

O formulário SHALL exigir título com 1–120 caracteres e autor com 1–100 caracteres após remover espaços nas pontas. Categoria SHALL ser Literatura, Tecnologia, Ciências ou Outros, com opção inicial “Selecione”. Livros com o mesmo título SHALL ser permitidos.

#### Scenario: Dados inválidos
- **WHEN** houver campo obrigatório vazio, só espaços, limite excedido ou categoria inválida
- **THEN** impedir o POST e apresentar erro junto aos campos correspondentes, preservando os valores digitados.

#### Scenario: Dados válidos
- **WHEN** o usuário enviar título, autor e categoria válidos
- **THEN** enviar um único POST `/livros` com titulo, autor e categoria, removendo espaços nas pontas dos textos, e incluir ano como número somente quando preenchido e válido.

### Requirement: Informar ano de publicação opcional

O sistema SHALL oferecer ano de publicação opcional. Quando preenchido, SHALL ser um número inteiro entre 1 e o ano corrente na data do cadastro, inclusive. Quando vazio, SHALL omitir o campo ano do POST e aceitar livros sem esse campo na consulta.

#### Scenario: Ano não preenchido
- **WHEN** o usuário enviar um cadastro válido sem ano
- **THEN** permitir o cadastro, omitir ano do POST e apresentar “Ano não informado” na lista.

#### Scenario: Ano válido
- **WHEN** o ano preenchido for inteiro entre 1 e o ano corrente, inclusive
- **THEN** enviar ano como número e apresentar o valor retornado pela API na lista.

#### Scenario: Ano inválido
- **WHEN** o ano preenchido não for numérico, for fracionário, menor que 1 ou posterior ao ano corrente
- **THEN** impedir o POST, mostrar erro junto ao campo e preservar os valores preenchidos.

#### Scenario: Título repetido
- **WHEN** o usuário cadastrar dados válidos com título já existente
- **THEN** permitir o envio sem rejeição por duplicidade.

### Requirement: Controlar envio de cadastro

O sistema SHALL desabilitar campos e botão durante o POST e mostrar “Cadastrando...”, impedindo envio duplo. O botão em repouso SHALL mostrar “Cadastrar livro”.

#### Scenario: Envio pendente
- **WHEN** um POST estiver pendente e o usuário tentar enviar novamente
- **THEN** não executar outro POST e manter campos e botão desabilitados até a operação terminar.

### Requirement: Confirmar cadastro persistido

O sistema SHALL aceitar HTTP 201 com livro válido e id string como sucesso, adicionar o livro retornado ao final da lista sem novo GET, limpar o formulário e anunciar o sucesso. O id SHALL ser gerado pela API.

#### Scenario: Cadastro bem-sucedido
- **WHEN** a API confirmar o cadastro com HTTP 201 e livro válido
- **THEN** mostrar “Livro cadastrado com sucesso.”, incluir o registro na lista, remover o estado vazio se presente, limpar e reabilitar o formulário.

#### Scenario: Persistência após recarga
- **WHEN** o usuário recarregar a página após cadastro confirmado
- **THEN** o GET apresentar o livro persistido, inclusive após reiniciar a API mantendo o mesmo db.json.

### Requirement: Preservar cadastro em falha

O sistema SHALL tratar falha de rede, status diferente de 201 e resposta JSON inválida ou sem livro válido como falha do cadastro. SHALL preservar os campos, reabilitar o formulário e não acrescentar registro localmente, sem repetir POST automaticamente.

#### Scenario: Erro de envio
- **WHEN** o POST falhar
- **THEN** mostrar “Não foi possível cadastrar o livro. Tente novamente.”, preservar lista e dados preenchidos e liberar o formulário para nova tentativa manual.

#### Scenario: Resposta perdida após persistência
- **WHEN** a API persistir o cadastro mas a resposta não chegar ao navegador
- **THEN** tratar como falha de envio sem repetição automática; uma recarga e novo GET permitem conferir o acervo antes de reenviar. Não há garantia de idempotência neste ciclo.

### Requirement: Respeitar contrato HTTP

O recurso `/livros` SHALL conter livros com id string, titulo e autor strings válidas, categoria permitida e ano opcional válido. GET SHALL retornar HTTP 200 e array. POST SHALL receber os três campos obrigatórios e ano quando informado e retornar HTTP 201 com o livro criado. O mock SHALL persistir em db.json, inicialmente com `{"livros": []}`.

#### Scenario: Resposta fora do contrato
- **WHEN** GET retornar estrutura diferente de array de livros válidos ou POST retornar livro fora do contrato
- **THEN** apresentar a falha correspondente à operação sem renderizar dados inválidos como sucesso.

### Requirement: Oferecer interface acessível e responsiva

O sistema SHALL funcionar a partir de 360 px sem rolagem horizontal, ter labels associados aos campos, foco visível, operação por teclado e mensagens de resultado anunciáveis por tecnologia assistiva.

#### Scenario: Uso em tela pequena e por teclado
- **WHEN** a página for utilizada com largura de 360 px e navegação por teclado
- **THEN** todos os campos e controles disponíveis permanecer acessíveis, sem rolagem horizontal, com foco visível e identificação dos campos.

#### Scenario: Anunciar resultado
- **WHEN** uma consulta ou cadastro terminar em sucesso ou falha
- **THEN** a mensagem de resultado estar disponível em uma região anunciável por tecnologia assistiva.
