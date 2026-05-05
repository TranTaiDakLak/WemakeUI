# WemakeUI

> Cross-platform Vue 3 UI template — designed for **Web · Mobile · Desktop**.

WemakeUI is a Vue 3 component library + design system with a built-in showcase you can fork as a starting template. It ships components, composables, design tokens, and foundation styles that work in any Vue 3 environment: a regular web app, a mobile shell (Capacitor / Ionic / PWA), or a desktop wrapper (Wails / Tauri / Electron).

## Highlights

- **Vue 3 + TypeScript** — strict typing, Composition API, `<script setup>` SFCs
- **Design tokens** — CSS variables + TS tokens (colors, spacing, motion, density, themes)
- **Theming** — light/dark mode out of the box, density modes (comfortable / compact / dense)
- **Cross-platform** — no DOM/browser-only assumptions; desktop-shell utilities (`.app-drag`) are no-ops on web/mobile
- **Tree-shakable** — named exports, `sideEffects` only on CSS

## Try it

```bash
cd frontend
npm install
npm run dev
```

Opens the showcase at the dev URL. The home route renders [src/views/ShowcaseView.vue](frontend/src/views/ShowcaseView.vue) demonstrating buttons, badges, forms, tooltips, dropdowns, modals, toasts, and progress.

## Use as a library

```bash
npm install @wemake/ui
npm install vue                       # peer dep
npm install vue-router pinia          # optional, only if you use those
```

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

import '@wemake/ui/style.css'
import { BaseButton, useToast } from '@wemake/ui'

createApp(App).mount('#app')
```

```vue
<script setup lang="ts">
import { BaseButton, BaseInput, useToast } from '@wemake/ui'

const { showToast } = useToast()
</script>

<template>
  <BaseInput placeholder="Tên tài khoản" />
  <BaseButton @click="showToast('success', 'Đã lưu!')">Lưu</BaseButton>
</template>
```

## Use as a template

Fork or clone, then strip what you don't need:

1. Replace [ShowcaseView.vue](frontend/src/views/ShowcaseView.vue) with your own pages
2. Add routes in [router/index.ts](frontend/src/router/index.ts)
3. Add stores in [stores/](frontend/src/stores/) (Pinia)
4. Customize tokens in [ui-system/foundations/tokens.css](frontend/src/ui-system/foundations/tokens.css)

## Project layout

```
frontend/
├─ src/
│  ├─ components/
│  │  ├─ common/        # BaseButton, BaseInput, BaseModal, BaseDataGrid, …
│  │  └─ layout/        # AppTopbar, PageHeader
│  ├─ composables/      # useToast, useClipboard, useKeyboard, …
│  ├─ ui-system/
│  │  ├─ tokens/        # colors, scales, semantic, themes (TS)
│  │  ├─ foundations/   # tokens.css, surfaces.css, typography.css …
│  │  ├─ composables/   # useTheme (system / light / dark)
│  │  └─ utils/         # cn(), helpers
│  ├─ stores/           # Pinia stores (app, theme)
│  ├─ router/           # Vue Router config
│  ├─ types/            # Generic UI types
│  ├─ views/            # ShowcaseView (demo)
│  ├─ lib.ts            # Library entry — exposed via npm package
│  ├─ main.ts           # App entry — used by `npm run build:app`
│  └─ style.css         # Global utilities + short-name aliases
├─ vite.config.ts       # dual-mode: app + lib
└─ package.json
```

## Scripts

```bash
cd frontend
npm install

npm run dev          # showcase dev server
npm run typecheck    # vue-tsc --noEmit
npm run build        # build the showcase (default)
npm run build:app    # build showcase → dist/
npm run build:lib    # build the publishable library → dist-lib/
```

## Platform notes

| Target            | Notes                                                                     |
|-------------------|---------------------------------------------------------------------------|
| Web (SPA / PWA)   | Just install and import. `<BaseDataGrid>` virtualizes long lists.         |
| Mobile (Capacitor / Ionic) | Tokens include touch-friendly density mode. Use `useViewMode()`. |
| Desktop (Wails / Tauri / Electron) | Add `.app-drag` to title-bar elements for window dragging.    |

## License

MIT.
