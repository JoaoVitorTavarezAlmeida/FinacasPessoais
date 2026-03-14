Fluxo local sugerido:

1. copiar `.env.example` para `.env`
2. ajustar `DATABASE_URL`
3. rodar `npm run prisma:migrate`
4. rodar `npm run prisma:seed`

O seed automatico esta em `prisma/seed.mjs` e popula:

- 1 usuario base usando `APP_USER_ID`
- 4 categorias
- transacoes recentes
- 2 metas

Credenciais iniciais do seed:

- email: `<APP_USER_ID>@local.test`
- senha: `12345678`

Exemplo com a configuracao padrao:

- email: `mock-user@local.test`
- senha: `12345678`
