# CLAUDE.md — Central Contract

> **Project:** WemakeUI · **Type:** Cross-platform Vue 3 UI library
> **Stack:** Vue 3 (Composition API + `<script setup>` + TypeScript) · Pinia (optional) · Vue Router 4 (optional) · Vite · CSS variables
> **Targets:** Web · Mobile (Capacitor / Ionic / PWA) · Desktop (Wails / Tauri / Electron)
> **Last updated:** 2026-05-05

WemakeUI là bộ UI kit Vue 3 + Design System tách ra từ WeConnect desktop. Mục tiêu: dùng được trên mọi nền tảng — Web app, Mobile shell, Desktop wrapper — mà không phụ thuộc backend cụ thể.

## Commands

```bash
cd frontend && npm install            # install deps
cd frontend && npm run dev            # demo dev server (Vite)
cd frontend && npm run typecheck      # vue-tsc --noEmit
cd frontend && npm run build:app      # build demo → dist/
cd frontend && npm run build:lib      # build publishable library → dist-lib/
```

> **Quality Gate:** `cd frontend && npm run typecheck && npm run build:app` phải PASS trước khi claim done.

## Rules

1. **No secrets** — never read, print, or log .env, credentials, tokens, API keys
2. **Cross-platform first** — không hard-code DOM/browser assumptions; kiểm tra `window`, `navigator` trước khi dùng. Desktop shell features (window drag, native dialogs) phải có fallback no-op cho web/mobile
3. **Vietnamese UI** — labels, tooltips, messages mặc định bằng tiếng Việt; thiết kế cho i18n
4. **Design system compliance** — dùng CSS variables từ `frontend/src/ui-system/foundations/tokens.css`, KHÔNG hardcode colors/spacing
5. **TypeScript strict** — types cho tất cả props, emits, stores, composables
6. **Tree-shakable** — named exports, không side effects ngoài CSS, peer-deps cho `vue`/`vue-router`/`pinia`
7. **Verify before done** — chạy actual commands, paste output as evidence

## Library entry

- `frontend/src/lib.ts` — library entry (exposed qua npm package)
- `frontend/src/main.ts` — app entry (cho demo dev server)
- Khi thêm component/composable mới, nhớ export từ `lib.ts` (qua `components/common/index.ts` hoặc `composables/index.ts`)
