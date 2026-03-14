## Fatec Financas

Dashboard de financas pessoais em Next.js com interface responsiva, mocks para desenvolvimento inicial e base pronta para integracao com PostgreSQL via Prisma.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Zod

## Rodando localmente

1. Instale as dependencias:

```bash
npm install
```

2. Suba o banco com Docker:

```bash
npm run db:up
```

3. Garanta o `.env`:

```bash
npm run env:ensure
```

4. Gere o client e aplique a migration:

```bash
npm run setup
```

5. Inicie a aplicacao:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Deploy recomendado

Para publicar rapido e abrir no celular, o caminho mais simples e:

1. subir o projeto para o GitHub
2. importar no Vercel
3. fazer o primeiro deploy sem `DATABASE_URL`
4. testar a interface publica no celular
5. depois conectar PostgreSQL gerenciado e adicionar `DATABASE_URL` no Vercel

Enquanto `DATABASE_URL` nao existir, a aplicacao usa fallback mock e continua funcional.

## Scripts

```bash
npm run dev
npm run db:up
npm run env:ensure
npm run db:wait
npm run db:down
npm run db:reset
npm run setup
npm run dev:full
npm run lint
npm run build -- --webpack
npm run prisma:generate
npm run prisma:migrate
npm run prisma:migrate:deploy
npm run prisma:seed
npm run prisma:studio
```

## Estrutura

```text
app/                 rotas, layout e server actions
components/          componentes reutilizaveis da dashboard
data/                mocks usados como fallback
lib/                 helpers de acesso, env e validacao
prisma/              schema, migrations e seed
repositories/        acesso a dados por provider
services/            regra de orquestracao entre app e repositories
types/               contratos e tipos do dominio
```

## Estado atual

- a dashboard esta pronta e responsiva
- os dados usam fallback mock se `DATABASE_URL` nao estiver definida
- com `DATABASE_URL`, o app passa a usar Prisma + PostgreSQL
- o formulario de categoria ja valida no servidor

## Banco local

O [docker-compose.yml](/home/vitoralmeida/dev/S/fatec-financas/docker-compose.yml) sobe um PostgreSQL local com:

- banco: `fatec_financas`
- usuario: `postgres`
- senha: `postgres`
- porta: `5432`

Os scripts `db:*` tentam usar automaticamente, nesta ordem:

- `docker compose`
- `podman compose`
- `docker-compose`
- `podman-compose`

Se nenhum estiver instalado, use `npm run dev` para rodar a UI com fallback mock.

String padrao para `.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fatec_financas?schema=public"
APP_USER_ID="mock-user"
```

## Observacao sobre build

No ambiente local e neste projeto, o build validado foi:

```bash
npm run build -- --webpack
```

Esse caminho evitou problemas do Turbopack em ambiente restrito.

## GitHub

Repositorio alvo:

```text
https://github.com/JoaoVitorTavarezAlmeida/FinacasPessoais
```

## Atalhos opcionais

Se preferir `make`:

```bash
make db-up
make env-ensure
make db-wait
make setup
make dev-full
make build
```

`npm run setup` e `npm run dev:full` usam `prisma migrate deploy`, sem prompt interativo.
Use `npm run prisma:migrate` apenas quando voce estiver criando novas migrations localmente.
