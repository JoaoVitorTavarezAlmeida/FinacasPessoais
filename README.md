# Fatec Financas

Aplicacao web de financas pessoais construida com Next.js, TypeScript, Tailwind CSS, Prisma e PostgreSQL.

O projeto foi desenhado com foco em responsividade, organizacao por dominio e crescimento incremental. Hoje a aplicacao ja oferece autenticacao, dashboard dinamica, gestao de transacoes, categorias e metas, com suporte a ambiente local e deploy em producao.

## Principais funcionalidades

- autenticacao com cadastro, login, sessao por cookie e logout
- dashboard como hub principal com cards de resumo, grafico dinamico e atalhos para as areas do sistema
- grafico financeiro com:
  - periodo padrao no mes atual
  - suporte a ultimos 30 dias e intervalo customizado
  - escala dinamica para valores positivos e negativos
  - linha principal de saldo acumulado
  - linhas adicionais por categoria, habilitadas separadamente
- CRUD de transacoes
- CRUD de categorias
- CRUD de metas
- movimentacoes associadas a metas sem impactar o saldo geral
- filtros e paginacao nas paginas operacionais
- fallback mock quando `DATABASE_URL` nao esta configurada

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7
- PostgreSQL
- Zod
- bcryptjs

## Arquitetura

O projeto segue uma separacao simples entre interface, validacao, regras de negocio e acesso a dados:

```text
app/                 rotas, layout e server actions
components/          componentes reutilizaveis por dominio
data/                mocks usados no modo demonstracao
lib/                 helpers, validacao, auth e funcoes de dominio
prisma/              schema, migrations e seed
repositories/        implementacoes de acesso a dados
services/            orquestracao entre app e repositories
types/               contratos tipados do dominio
```

### Camadas principais

- `app/`: rotas da aplicacao, paginas e server actions
- `components/dashboard/`: shell, navegacao, filtros, formularios e listas
- `lib/validation/`: schemas `zod` para formularios e actions
- `repositories/dashboard/`: provider mock e provider Prisma
- `services/dashboard/`: escolhe a fonte de dados e expoe uma interface estavel para a app

## Estrutura funcional atual

### Rotas

- `/dashboard`: visao geral do sistema
- `/transactions`: operacao de transacoes com filtros e paginacao
- `/categories`: operacao de categorias com filtros e paginacao
- `/goals`: operacao de metas com filtros e paginacao
- `/auth`: autenticacao

### Dominio de dados

O schema Prisma atual contem:

- `User`
- `Session`
- `Transaction`
- `Category`
- `Goal`

As transacoes suportam dois escopos:

- `BALANCE`: afeta o saldo geral
- `GOAL`: afeta apenas o saldo de uma meta

## Requisitos

- Node.js 20+
- npm
- PostgreSQL local ou gerenciado

Opcional:

- Docker ou Podman, caso queira subir o banco local com `docker-compose.yml`

## Configuracao de ambiente

Crie o arquivo `.env` a partir de `.env.example`:

```bash
npm run env:ensure
```

Exemplo de variaveis:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fatec_financas?schema=public"
APP_USER_ID="mock-user"
```

### Sobre as variaveis

- `DATABASE_URL`: conexao principal com PostgreSQL
- `APP_USER_ID`: usado no seed inicial e em cenarios de apoio

Se `DATABASE_URL` nao estiver presente, a aplicacao continua funcionando em modo demonstracao com dados mockados.

## Rodando localmente

### Opcao 1: com PostgreSQL local ja instalado

1. instale as dependencias

```bash
npm install
```

2. ajuste o `.env` com sua `DATABASE_URL`

3. gere o client Prisma

```bash
npm run prisma:generate
```

4. aplique as migrations

```bash
npm run prisma:migrate:deploy
```

5. popule dados iniciais

```bash
npm run prisma:seed
```

6. suba a aplicacao

```bash
npm run dev
```

### Opcao 2: com container local

```bash
npm install
npm run dev:full
```

Esse fluxo:

1. garante o `.env`
2. sobe o banco local
3. espera o banco ficar disponivel
4. gera o client Prisma
5. aplica as migrations
6. executa o seed
7. inicia o servidor Next.js

## Banco local

O arquivo `docker-compose.yml` sobe um PostgreSQL local com:

- banco: `fatec_financas`
- usuario: `postgres`
- senha: `postgres`
- porta: `5432`

Scripts disponiveis:

```bash
npm run db:up
npm run db:down
npm run db:reset
npm run db:wait
```

Os wrappers do projeto tentam usar automaticamente:

- `docker compose`
- `podman compose`
- `docker-compose`
- `podman-compose`

## Seed inicial

O seed cria uma base minima para testes:

- 1 usuario base
- categorias iniciais
- transacoes recentes
- metas iniciais

Consulte `prisma/seed-notes.md` para detalhes atualizados de credenciais e dados criados.

## Scripts

```bash
npm run dev
npm run dev:full
npm run build
npm run start
npm run lint

npm run env:ensure
npm run setup

npm run db:up
npm run db:down
npm run db:reset
npm run db:wait

npm run prisma:generate
npm run prisma:migrate
npm run prisma:migrate:deploy
npm run prisma:seed
npm run prisma:studio
```

## Deploy

### Vercel

O fluxo recomendado de deploy e:

1. subir o repositorio no GitHub
2. importar o projeto no Vercel
3. configurar `DATABASE_URL` nas variaveis de ambiente
4. aplicar as migrations no banco de producao
5. fazer o redeploy

### Banco de producao

O projeto ja foi preparado para usar PostgreSQL gerenciado, como Neon.

Fluxo recomendado:

1. criar o banco no provider escolhido
2. copiar a `DATABASE_URL`
3. configurar essa URL no Vercel
4. aplicar migrations
5. opcionalmente executar o seed

## Validacao

Comandos usados para validar o projeto:

```bash
npm run lint
npm run build
```

## Estado atual do projeto

Hoje a aplicacao ja esta em um ponto funcional para uso e iteracao:

- autenticacao ativa
- dashboard operacional
- modulo de transacoes funcional
- modulo de categorias funcional
- modulo de metas funcional
- navegacao responsiva para desktop e mobile
- fallback mock para demonstracao

Ainda existe espaco para evolucao em areas como relatorios mais avancados, refinamento de UX, observabilidade, testes automatizados e recuperacao de conta.

## Repositorio

```text
https://github.com/JoaoVitorTavarezAlmeida/FinacasPessoais
```
