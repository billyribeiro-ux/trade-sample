# Contributing

The Trading Store is built in ordered phases. Follow the current phase before
starting later work.

## Requirements

- Node.js 22 LTS
- pnpm 10.x
- Git

## Workflow

```bash
pnpm install
pnpm check
pnpm test
pnpm build
```

## Code Standards

- TypeScript strict mode.
- Svelte 5 runes only.
- No Tailwind.
- No `any`, `@ts-ignore`, or unchecked secrets.
- Use Valibot schemas at external boundaries.
- Keep product and pricing data in the database.

## Commits

Use Conventional Commits:

```txt
feat(scope): short subject

Phase: N
Refs: PE7-AREA
```

