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
