# API de livros

Documentação do contrato HTTP e do cliente implementado em `src/api/livros.js`. Os exemplos abaixo foram conferidos contra a API local em 20/11/2026, com `json-server` 1.0.0-beta.15. Os ids são gerados pela API a cada cadastro e variam entre execuções.

## Endereço e configuração

- Endpoint local: `http://localhost:3001/livros`.
- A API é iniciada com `npm run api`, que executa o JSON Server sobre `db.json` na porta 3001. O arquivo começa com `{"livros": []}`.
- O front lê a base de `VITE_API_URL`. Sem a variável, usa `http://localhost:3001`; barras finais são removidas antes de acrescentar `/livros`.
- O exemplo de configuração está em `.env.example`: `VITE_API_URL=http://localhost:3001`.
- Variáveis do Vite são lidas na inicialização de `npm run dev` ou `npm run build`. Depois de alterar `.env`, reinicie o processo.
- A configuração foi verificada no servidor de desenvolvimento: com `VITE_API_URL=http://exemplo.test:9999/`, o módulo servido recebeu `VITE_API_URL` com esse valor.

## Contrato do recurso

| Campo | Regra |
| --- | --- |
| `id` | String não vazia, gerada pela API. O front não envia id. |
| `titulo` | String de 1 a 120 caracteres após remover espaços das pontas. |
| `autor` | String de 1 a 100 caracteres após remover espaços das pontas. |
| `categoria` | `Literatura`, `Tecnologia`, `Ciências` ou `Outros`. |
| `ano` | Opcional. Quando presente, inteiro entre 1 e o ano corrente, inclusive. Quando vazio, deve ser omitido. |

Títulos repetidos são permitidos. Campos adicionais na resposta da API são ignorados pelo front, mas não são exibidos nem reenviados.

## Cliente HTTP

### `listarLivros({ signal } = {})`

- Executa `GET /livros` e repassa `signal` ao `fetch`, permitindo cancelar a consulta.
- Sucesso exige HTTP 200 e um array em que todos os elementos sejam livros válidos. Retorna o array recebido, na mesma ordem.
- Rejeita status diferente de 200, JSON inválido, estrutura que não seja array e array com qualquer elemento inválido. O array parcialmente inválido é rejeitado inteiro para não apresentar um acervo incompleto como sucesso.
- Falhas de rede e o cancelamento rejeitam a Promise; `AbortError` não é convertido em falha de consulta.

### `cadastrarLivro(dados)`

- Valida os campos com `validarCadastro` de `src/domain/livro.js`. Entrada inválida rejeita sem chamar `fetch`.
- Normaliza com `normalizarCadastro`: remove espaços de título e autor, envia somente `titulo`, `autor`, `categoria` e, se preenchido e válido, `ano` como número. Id e ano vazio não são enviados.
- Executa `POST /livros` com `Content-Type: application/json`.
- Sucesso exige HTTP 201 e livro válido na resposta, incluindo id string. Retorna o livro criado.
- Rejeita status diferente de 201, JSON inválido, livro fora do contrato e falhas de rede.

As mensagens de erro do cliente são genéricas. A interface deve usar os textos fixos da spec; detalhes internos da resposta não são exibidos.

## Exemplos verificados

### POST sem ano

Requisição:

```http
POST /livros HTTP/1.1
Content-Type: application/json

{"titulo":"Dom Casmurro","autor":"Machado de Assis","categoria":"Literatura"}
```

Resposta observada: HTTP 201.

```json
{
  "categoria": "Literatura",
  "autor": "Machado de Assis",
  "titulo": "Dom Casmurro",
  "id": "N4I_qF6BNdU"
}
```

### POST com ano

Requisição:

```http
POST /livros HTTP/1.1
Content-Type: application/json

{"titulo":"Clean Code","autor":"Robert C. Martin","categoria":"Tecnologia","ano":2008}
```

Resposta observada: HTTP 201.

```json
{
  "categoria": "Tecnologia",
  "autor": "Robert C. Martin",
  "titulo": "Clean Code",
  "ano": 2008,
  "id": "pcKXPjr4iT8"
}
```

### GET do acervo

Resposta observada: HTTP 200.

```json
[
  {
    "categoria": "Literatura",
    "autor": "Machado de Assis",
    "titulo": "Dom Casmurro",
    "id": "N4I_qF6BNdU"
  },
  {
    "categoria": "Tecnologia",
    "autor": "Robert C. Martin",
    "titulo": "Clean Code",
    "ano": 2008,
    "id": "pcKXPjr4iT8"
  }
]
```

## Limitações do mock

- O JSON Server não impõe o domínio. Na verificação local, um POST com título só de espaços, categoria inexistente e ano futuro recebeu HTTP 201 e foi persistido. A validação do front protege apenas o fluxo da aplicação; chamadas HTTP externas podem inserir dados inválidos. Um backend real precisaria validar no servidor.
- Por consequência, um acervo com dados inseridos fora do fluxo do front fará `listarLivros` rejeitar o array inteiro, conforme o contrato.
- O mock não oferece idempotência. Se a API persistir um cadastro e a resposta não chegar ao navegador, não há repetição automática; é necessário recarregar o acervo para conferir antes de reenviar.
- A persistência é o arquivo `db.json` na raiz do projeto. Reiniciar a API mantendo o arquivo preserva os registros; restaurar uma cópia anterior do arquivo remove os dados de teste.
- A versão usada é beta. O id é string, mas o comportamento pode mudar em atualizações; usar a versão fixada pelo `package-lock.json`.
- Os testes do cliente usam `fetch` simulado; não dependem da API local. Os exemplos desta página foram verificados contra a API real, com restauração de `db.json` ao final.
