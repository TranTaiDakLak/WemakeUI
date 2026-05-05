# CLAUDE.md — Central Contract

> **Project:** WemakeUI / WeConnect · **Type:** fullstack (Go backend + Vue 3 frontend, Wails desktop)
> **Stack:** Go 1.22+ · Wails v2 · Vue 3 (Composition API + `<script setup>` + TypeScript) · Pinia · Vue Router 4 · Vite · SQLite
> **Last updated:** 2026-03-24

Ứng dụng desktop WeConnect — rebuild từ WeFacebook/WeBM (C# WinForms) sang Go/Wails. Quản lý hàng loạt tài khoản Facebook, Instagram, YouTube, Zalo; tự động hóa tương tác, quản lý BM/Ads.

## Commands

```bash
cd frontend && npm install          # install frontend deps
wails dev                           # dev server (Wails hot-reload)
cd frontend && npx vue-tsc --noEmit # typecheck
cd frontend && npm run build        # build (vue-tsc + vite build)
```

> **Quality Gate:** `cd frontend && npx vue-tsc --noEmit && npm run build` phải PASS trước khi claim done.

## Rules

1. **No secrets** — never read, print, or log .env, credentials, tokens, API keys
2. **Vietnamese UI** — tất cả labels, tooltips, messages bằng tiếng Việt
3. **Desktop-app style** — compact, dense, font nhỏ (12px), padding tối thiểu
4. **Design system compliance** — dùng CSS variables từ `frontend/src/style.css`, KHÔNG hardcode colors
5. **TypeScript strict** — types cho tất cả props, emits, stores
6. **Verify before done** — chạy actual commands, paste output as evidence
