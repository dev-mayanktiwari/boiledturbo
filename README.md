# Turbo Boiler

A Turborepo monorepo: a Next.js web app, an Express + tRPC API server, and shared packages for
database, env, errors and config.

## Layout

```
apps/
  web/        Next.js app
  server/     Express server that mounts the tRPC router at /trpc
packages/
  api/        tRPC router and procedures (@repo/api)
  common/     Errors, logger, shared schemas (@repo/common)
  db/         Prisma contract and client factory (@repo/db)
  env/        Typed env loading and validation (@repo/env)
  eslint-config/       Shared ESLint configs
  typescript-config/   Shared tsconfig files
```

Put code in `apps/` only if it deploys. Put code in `packages/` only when more than one app uses it.

## Setup

Requires Node >= 24 and pnpm 11.

```sh
pnpm install
cp .env.example .env   # then fill in DATABASE_URL
```

## Commands

```sh
pnpm dev            # run every app in watch mode
pnpm build          # build everything
pnpm lint           # ESLint across the repo
pnpm check-types    # TypeScript across the repo
pnpm format         # Prettier across ts, tsx and md files
```

Database commands live in `packages/db` and run from there, for example
`pnpm --filter @repo/db db:migrate`.

## Conventions

### Formatting

Prettier is configured in [.prettierrc](.prettierrc): 110 columns, trailing commas, double quotes.
Run `pnpm format` before committing.

### File names

- Use `kebab-case` for every source file: `app-error.ts`, `error-handler.ts`.
- Framework and tool names are the exception: `page.tsx`, `layout.tsx`, `globals.css`,
  `next.config.js`, `prisma.config.ts`, and generated files such as `contract.json`.
- React components: the file is `kebab-case`, the export is `PascalCase` (`button.tsx` exports `Button`).
- Tests sit next to the code they test, named `<name>.test.ts`.
- Routers: `routes/<resource>.ts` exports `<resource>Router`.
- Folders are lowercase `kebab-case`.
- Config files use `.js`. Use `.mjs` only in a package without `"type": "module"`.

### Variable and type names

- Module-level constants that never change: `UPPER_SNAKE_CASE` (`ERROR_STATUS`, `ROOT_ENV_FILE`).
- Environment variables: `UPPER_SNAKE_CASE`. Browser-visible values start with `NEXT_PUBLIC_`.
- Functions and local variables: `camelCase`. Start functions with a verb (`createDb`, `toAppError`).
- Types, interfaces and classes: `PascalCase`, with no `I` prefix.
  - Props are named `<Component>Props`.
  - Use `interface` for object shapes and `type` for unions and derived types.
- Zod schemas end in `Schema` (`createUserSchema`). Their inferred types end in `Input`
  (`CreateUserInput`).
- Caught errors are named `err`. Use `error` only for fields a library defines.
- Unused parameters start with `_` (`_req`).
- Booleans start with `is` or `has` (`isOperational`).
- Router procedures: `list<Things>`, `getBy<Field>`, `create<Thing>`.
- Log messages are lowercase: `"server listening"`, `"unhandled error"`.

## Environment

All variables are in the root `.env`, which is gitignored. [.env.example](.env.example) lists them.
Real values set in the environment take precedence over the file.
