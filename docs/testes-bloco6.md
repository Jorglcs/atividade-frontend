# Testes manuais do bloco 6

O solicitante assumiu a execução manual dos testes. Este roteiro contém resultados esperados; não representa execução ou aprovação já realizada.

## Aplicação com a API real

Na raiz do projeto, execute `npm run api` em um terminal e `npm run dev` em outro. Abra o endereço apresentado pelo Vite, normalmente `http://localhost:5173`.

Confira cadastro com e sem ano, título repetido, persistência por recarga, mensagens de erro e navegação por Tab. Envie dados inválidos: o primeiro campo inválido deve receber foco e explicar seu erro. Em 360px e desktop, não deve haver rolagem horizontal, inclusive com títulos longos.

## Simulações isoladas

Execute em outro terminal:

```powershell
npm run validar
```

Abra `http://localhost:5174/validacao.html`. O comando compila a página e inicia o servidor de testes; encerre com Ctrl+C. Esta página não precisa do JSON Server. Ela monta os componentes reais e substitui o transporte HTTP somente nela. Os livros ficam no localStorage da página de teste, sem tocar em `db.json`. Isso simula persistência entre recargas do navegador, não um reinício real de servidor ou uma falha real de rede.

Use “Limpar dados simulados” antes de cada cenário independente. Abra “Evidência do transporte simulado” para acompanhar consultas, cadastros, último payload e livros persistidos. O cenário selecionado vale para as próximas requisições; mudar a seleção não apaga o formulário.

| Cenário selecionado | Como executar | Resultado esperado |
| --- | --- | --- |
| Respostas normais | Cadastrar sem ano; depois com ano e mesmo título | Sucesso, campos limpos, itens na ordem; ano omitido/válido no payload; duplicata aceita |
| GET fora do contrato | Selecionar e clicar “Recarregar catálogo” | Erro de consulta; cadastro bloqueado; nenhum registro inválido exibido |
| GET com JSON inválido / GET HTTP 503 / GET com falha de rede | Repetir individualmente com recarga | Mesma falha de consulta. Para recuperar, selecionar “Respostas normais” e clicar “Tentar novamente” |
| GET lento | Selecionar e recarregar | “Carregando livros...” e campos bloqueados por cerca de 3 segundos; depois lista/vazio |
| POST fora do contrato | Preencher dados válidos e enviar | Falha de cadastro, valores preservados, lista intacta, controles liberados; nenhum livro simulado persistido |
| POST com JSON inválido / POST HTTP 503 / POST com falha de rede | Repetir individualmente com dados válidos | Mesmo tratamento de falha; não reenviar automaticamente |
| POST lento | Preencher e tentar clicar duas vezes no envio | Campos e botão desabilitados; “Cadastrando...”; contador de cadastros aumenta uma vez; sucesso após cerca de 3 segundos |
| Persistir POST e perder a resposta | Enviar uma vez; conferir evidência; recarregar sem reenviar | Tela mostra falha e preserva campos; evidência contém um cadastro e um livro. Após recarga, GET mostra o livro; contador de cadastros continua em um |

Para testar recuperação mantendo os valores após falha de POST, selecione “Respostas normais” e reenvie manualmente. No cenário de resposta perdida, confira a lista por recarga antes de reenviar para evitar duplicatas.

## Acessibilidade e registro

Confira labels, ordem de teclado, foco visível, foco no primeiro erro e associação da categoria à sua mensagem. Se houver leitor de tela disponível, confira anúncios de carregamento, sucesso e falha; registre a ferramenta utilizada ou sua indisponibilidade.

Registre em `docs/validacao.md`: autor, data, cenário, resultado observado, evidência, defeito e reteste. A matriz dos 19 cenários já está nesse arquivo. A identificação/revisão dos integrantes e a reflexão real ficam em `docs/revisao-do-grupo.md`. Não marcar tarefas como concluídas apenas por este roteiro existir.

## Verificações automatizadas

```powershell
node --test src/domain/livro.test.js src/api/livros.test.js scripts/transporte-validacao.test.js
npm run build
npm run validar:preparar
npx --no-install openspec validate catalogo-de-livros --strict
```

`dist` contém o build da aplicação; `dist-validacao` contém apenas o ambiente isolado. Ambos são gerados e ignorados pelo Git. Os testes do transporte exercitam o cliente HTTP real com respostas simuladas; não substituem sua conferência da tela.
