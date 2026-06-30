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

## Custom instructions
instructions/