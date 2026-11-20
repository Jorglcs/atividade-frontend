# Proposal

Status: aprovação coletiva informada por Jorge em 20/11/2026. Implementação parcial: blocos 1 e 2 concluídos; demais pendentes.

## Why

O grupo precisa consultar e ampliar um acervo compartilhado de livros. Uma entrega pequena com listagem, cadastro e erros explícitos permite praticar SDD e validar um fluxo HTTP completo.

## What Changes

- Oferecer listagem do acervo com carregamento, estado vazio e recuperação de falha.
- Permitir cadastro validado de título, autor e categoria, com ano de publicação opcional e persistência pela API.
- Manter os dados digitados quando o envio falhar e impedir envios simultâneos.
- Registrar critérios verificáveis e contrato do mock.
- Fora de escopo: autenticação, empréstimos, edição, exclusão, pesquisa, filtros e capas.

## Capabilities

### New Capabilities

- `catalogo-livros`: consulta e cadastro de livros, validação de campos e estados de comunicação HTTP.

### Modified Capabilities

Nenhuma; ainda não existem capacidades implementadas.

## Impact

React com Vite; cliente HTTP em `src/api`, componentes em `src/components` e página em `src/pages`. JSON Server expõe `/livros`, persistido em `db.json`. Configuração por `VITE_API_URL`, com endereço padrão `http://localhost:3001`.

O contrato proposto usa id string gerado pela API, titulo string de 1–120 caracteres, autor string de 1–100 caracteres e categoria Literatura, Tecnologia, Ciências ou Outros. O campo ano é opcional: inteiro entre 1 e o ano atual quando preenchido, omitido quando vazio. A validação de domínio ocorre no front; duplicatas são permitidas. A spec desta mudança é a referência atual; `docs/requisitos.md` é o insumo preliminar.

Decisão explícita desta preparação: cadastro bloqueado até a primeira consulta bem-sucedida, para evitar apresentar uma lista parcial como acervo completo. Alterações próprias do grupo ainda devem ser registradas na sessão coletiva.
