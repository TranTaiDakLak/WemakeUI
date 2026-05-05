# Implementation Plan — WeConnect UI Migration (ui-ux-pro-max)

> **Created:** 2026-03-24 · **Completed:** 2026-03-24
> **Reviews:** Eng ✅ CLEAR · Design ✅ CLEAR (5→7/10)
> **Source:** /office-hours design doc + ui-ux-pro-max 6-domain analysis
> **Status:** ✅ ALL PHASES COMPLETE · BUILD PASS · QA PASS

---

## Tổng quan

Chuyển đổi giao diện WeConnect từ **generic web app** sang **data-dense dashboard + dark mode** theo khuyến nghị ui-ux-pro-max. Thay đổi thuần CSS tokens + minor component updates, không refactor kiến trúc.

**Quality Gate:** `cd frontend && npx vue-tsc --noEmit && npm run build` — PASS sau mỗi phase ✅

---

## Phase 1: Design Tokens (style.css) ✅ DONE

**Files:** 2 files · **Actual:** ~15 min

### Task 1.1: Thêm font Fira Sans + Fira Code ✅

- [x] **index.html** — Thêm `<link rel="preconnect">` + `<link rel="stylesheet">` cho Google Fonts (KHÔNG dùng @import CSS — tránh render blocking, per eng review)
- [x] **style.css** line 1 — XÓA `@import url(...)` → comment giải thích fonts loaded via HTML

### Task 1.2: Cập nhật :root tokens ✅

- [x] **style.css** — Sửa `--font-family` → `'Fira Sans', 'Inter', ...`
- [x] **style.css** — THÊM `--font-family-mono: 'Fira Code', 'Consolas', monospace;`

### Task 1.3: Thêm Data-Dense tokens ✅

- [x] **style.css** — THÊM 6 tokens mới:
  - `--grid-gap-compact: 8px`
  - `--card-padding-compact: 12px`
  - `--font-size-small: 12px`
  - `--table-row-height: 36px`
  - `--sidebar-width: 240px`
  - `--header-height: 56px`

### Task 1.4: Giảm border-radius ✅

- [x] `--radius-sm: 4px` (was 6px), `--radius-md: 6px` (was 10px), `--radius-lg: 8px` (was 16px), `--radius-xl: 12px` (was 20px)

### Task 1.5: Cập nhật semantic colors ✅

- [x] `--success-color: #22C55E` (was #228b22)
- [x] `--info-color: #3B82F6` (was #0000cd)

### Task 1.6: Cập nhật grid gaps ✅

- [x] `.grid-2`, `.grid-3`, `.grid-4` → `gap: var(--grid-gap-compact)`

### Task 1.7: Cập nhật card padding ✅

- [x] `.card` → `padding: var(--card-padding-compact)`, `border-radius: var(--radius-md)`

### ✅ Phase 1 Checkpoint — PASS

---

## Phase 2: Dark Mode ✅ DONE

**Files:** 5 files · **Actual:** ~25 min

### Task 2.1: Thêm .dark-mode CSS class ✅

- [x] **style.css** — Thêm `.dark-mode { ... }` (39 dòng) với OLED-optimized colors
- [x] Sidebar dark = `#1E293B` (slate, NOT brand blue — per design review)
- [x] Login page dark overrides included (error bg, overlay, glass)

### Task 2.2: Smooth transition ✅

- [x] **style.css** `body` — Thêm `transition: background-color 0.3s ease, color 0.3s ease;`

### Task 2.3: Tạo Pinia theme store ✅

- [x] **TẠO** `frontend/src/stores/theme.ts` — Pinia store + localStorage + DOM class sync

### Task 2.4: Khởi tạo theme trong App.vue ✅

- [x] **App.vue** — Import `useThemeStore`

### Task 2.5: Fix hardcoded colors trong BaseDataGrid ✅

- [x] `.row-highlight td` → `var(--active-bg)` (was #cce5ff)
- [x] `.cell-selected` → `var(--hover-bg)` + `var(--brand-primary)` (was #b3d4fc/#3b82f6)

### Task 2.6: Fix hardcoded Consolas ✅

- [x] `.form-textarea` → `var(--font-family-mono)` (was 'Consolas', monospace)

### ✅ Phase 2 Checkpoint — PASS

---

## Phase 3: Component Updates ✅ DONE

**Files:** 7 files · **Actual:** ~30 min

### Task 3.1: BaseDataGrid — compact row height + font ✅

- [x] Default `rowHeight: 36` (was 35)
- [x] `.datagrid` font-size → `var(--font-size-small, 12px)` (was 14px)

### Task 3.2: Layout components ✅

- [x] **AppSidebar.vue** — `width/min-width: var(--sidebar-width)` (was 220px), `background: var(--sidebar-bg)` (was --brand-primary), thêm `transition: background 0.3s`
- [x] **AppTopbar.vue** — `height: var(--header-height, 36px)`, `background: var(--topbar-bg, var(--brand-primary))`, thêm transition
- [x] **MainLayout.vue** — `padding: var(--card-padding-compact)` (was --space-lg), thêm `transition: background 0.3s`

### Task 3.3: AppTopbar — dark mode toggle ✅

- [x] Thêm sun/moon SVG toggle button (Lucide-style inline SVG, not emoji)
- [x] Import `useThemeStore`

### Task 3.4: Fix hardcoded colors trong modals ✅

- [x] **FacebookActionBar.vue** — 30+ hardcoded colors → CSS variables (toolbar, search, selects, icon buttons, category dropdown)
- [x] **FacebookMenuStrip.vue** — 15+ hardcoded colors → CSS variables (menu strip, buttons, dropdowns)
- [x] **CopyModal.vue** — 12+ hardcoded colors → CSS variables (slots, preview, buttons, recent items, Consolas→--font-family-mono)
- [x] **CategoryModal.vue** — Fix `#cce5ff` highlight → `var(--active-bg)`

### ✅ Phase 3 Checkpoint — PASS

---

## Phase 4: Loading States + Icons ✅ DONE

**Files:** 3 files · **Actual:** ~10 min

### Task 4.1: Cài lucide-vue-next ✅

- [x] `npm install lucide-vue-next` — added to package.json

### Task 4.2: Tạo BaseSkeleton component ✅

- [x] **TẠO** `components/common/BaseSkeleton.vue` — configurable rows/cols/height, uses design tokens
- [x] **common/index.ts** — Export `BaseSkeleton`

### Task 4.3: Cải thiện empty state ⏭️ DEFERRED

- [ ] DataGrid empty state upgrade — existing slot-based solution sufficient for now

### Task 4.4: Thay emoji bằng Lucide ⏭️ DEFERRED

- [ ] Scan + replace — no emoji icons found in current codebase

### ✅ Phase 4 Checkpoint — PASS

---

## Phase 5: Verification (/qa) ✅ DONE

**Method:** Browser visual QA · **Date:** 2026-03-24

- [x] Chạy dev server + browser verification
- [x] Test dark ↔ light toggle — smooth 300ms fade ✅
- [x] Test font rendering — Fira Sans body visible ✅
- [x] Test DataGrid compact — 36px rows, 12px font ✅
- [x] Test dark mode persistence — survives refresh ✅
- [x] Test sidebar dark (#1E293B slate) ✅
- [x] Test toolbar/menustrip dark mode ✅

### QA Results: 20/20 PASS · 3 minor issues deferred

---

## Actual Files Changed

| Phase | File | Action |
|-------|------|--------|
| 1 | `frontend/index.html` | +4 lines: font preconnect + stylesheet |
| 1 | `frontend/src/style.css` | Remove @import, add tokens, update radii/colors/gaps/padding |
| 2 | `frontend/src/style.css` | +39 lines: .dark-mode block, body transition, fix Consolas |
| 2 | `frontend/src/stores/theme.ts` | **NEW** — Pinia theme store (27 lines) |
| 2 | `frontend/src/App.vue` | +3 lines: import theme store |
| 2 | `frontend/src/components/common/BaseDataGrid.vue` | Fix #cce5ff, #b3d4fc hardcoded |
| 3 | `frontend/src/components/common/BaseDataGrid.vue` | rowHeight=36, font-size=12px |
| 3 | `frontend/src/components/layout/AppSidebar.vue` | --sidebar-width, --sidebar-bg |
| 3 | `frontend/src/components/layout/AppTopbar.vue` | Dark toggle, --header-height, --topbar-bg |
| 3 | `frontend/src/layouts/MainLayout.vue` | --card-padding-compact, transition |
| 3 | `frontend/src/components/facebook/FacebookActionBar.vue` | 30+ hardcoded → CSS vars |
| 3 | `frontend/src/components/facebook/FacebookMenuStrip.vue` | 15+ hardcoded → CSS vars |
| 3 | `frontend/src/components/facebook/CopyModal.vue` | 12+ hardcoded → CSS vars |
| 3 | `frontend/src/components/facebook/CategoryModal.vue` | Fix highlight color |
| 4 | `frontend/package.json` | +lucide-vue-next |
| 4 | `frontend/src/components/common/BaseSkeleton.vue` | **NEW** — skeleton component |
| 4 | `frontend/src/components/common/index.ts` | +1 export BaseSkeleton |

**Tổng:** 14 files modified, 2 files created · ~1.5 giờ AI-assisted

---

## Deferred Items (Next Sprint)

| Item | Lý do | Priority |
|------|-------|----------|
| TrashModal status badge hardcoded colors | Only visible when modal open | 🟡 Low |
| SetupInteractModal context menu `#fff` | Only visible in context menu | 🟡 Low |
| SetupViewModal context menu `#fff`/`#ddd` | Only visible in context menu | 🟡 Low |
| DataGrid empty state upgrade | Current slot-based solution OK | 🟡 Low |
| Replace emoji with Lucide icons | No emoji found in current code | ⚪ N/A |
| Tạo DESIGN.md | Deferred — do after UI stable | 🟡 Medium |
| Per-modal empty states | Feature enhancement | 🟡 Low |
| Mobile/tablet responsive | Desktop app only (Wails) | ⚪ N/A |

---

## NOT In Scope

| Item | Lý do |
|------|-------|
| Backend Go implementation | Separate concern, không liên quan UI |
| Instagram/YouTube/Zalo views | New features, không phải migration |
| Split SetupInteractModal (84KB) | Refactor riêng, không block migration |

---

## GSTACK REVIEW REPORT

| Review | Trigger | Runs | Status | Findings |
|--------|---------|------|--------|----------|
| Eng Review | `/plan-eng-review` | 1 | ✅ CLEAR | 2 issues (toggle + font), resolved |
| Design Review | `/plan-design-review` | 1 | ✅ CLEAR | score: 5→7/10, 3 decisions made |
| Visual QA | `/qa` (browser) | 1 | ✅ PASS | 20/20 checks, 3 minor deferred |

**FINAL VERDICT:** ✅ SHIP-READY — All phases complete, build pass, QA pass.
