# Evidências de validação

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
