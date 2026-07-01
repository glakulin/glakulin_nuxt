# AGENTS.md - Glakulin Nuxt Project

## Commands
- **Dev server**: `bun run dev`
- **Build**: `bun run build`
- **Generate static**: `bun run generate`
- **Preview production**: `bun run preview`
- **Prepare (postinstall)**: `bun run postinstall`

## Structure
- `app/app.vue` — App entry point (minimal, uses `<NuxtRouteAnnouncer />`)
- `nuxt.config.ts` — Nuxt 4 config with devtools enabled
- TypeScript config references `.nuxt/tsconfig.*.json` (generated)

## Package Manager
- **bun** (lockfile: `bun.lock`)

## Notes
- No lint, typecheck, or test scripts configured
- Nuxt 4 uses `compatibilityDate: '2025-07-15'`
- Run `bun run postinstall` after dependency changes (auto-runs on install)
- Do not use `bun run build` as an error check: it can succeed while building an error page

## Session start (mandatory)
- Read `context.json` and follow `instructions/context_import.md` at the very beginning of every session
- Then read and follow `instructions/system.md` before work

## Custom instructions
- Use `instructions/code_style.md` for generated code
- Use `instructions/code_review.md` for code reviews
- Use `instructions/context_export.md` when exporting session context
- Use `instructions/context_import.md` when importing session context
- Use `instructions/create_markdown.md` when authoring reusable agent instructions

## Instruction summary
- Start answers with `[VERIFIED]`, `[WEB_SEARCH]`, or `[ASSUMPTION - confirm?]` when following instruction files
- Ask up to 3 concise clarification questions with multiple-choice options if required context is missing
- Search web for latest APIs/docs/versions when freshness matters
- Never fabricate facts, paths, package names, sources, or numbers
- Code style: 2 spaces, snake_case vars/functions, Pascal_Snake_Case types, UPPER_SNAKE_CASE constants
- Prefer strict typing, explicit code, reusable functions, and performance-oriented solutions
- Comments should explain WHAT the code does, not WHY