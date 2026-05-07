# WEMAKEUI — Platform State
> **Single source of truth.** Cập nhật mỗi khi có thay đổi architecture hoặc hoàn thành phase.
> Last updated: 2026-05-07 (stack upgrade: Vite 3→6, TypeScript 4→5, vue-tsc 1→2, vite-plugin-dts 4 — index.d.ts generation fixed)

---

## 1. Vision & Platform Goal

**Vision:** WemakeUI là company-wide frontend ecosystem — một nền tảng dùng chung cho mọi sản phẩm của công ty, từ internal tool đến customer-facing SaaS, từ desktop shell đến web app.

**Platform Goal:**
- Mọi dự án frontend mới của công ty bắt đầu từ WemakeUI — không phải từ zero
- Developer chỉ cần viết business logic, không viết lại UI primitives
- Design system là pháp luật — không có ngoại lệ hardcode
- Config-driven trước, code-driven sau — ưu tiên archetypes

**Not goals:**
- Demo collection
- Component showcase (showcase chỉ là phương tiện, không phải mục đích)
- Per-project UI kit

---

## 2. Current Maturity Level

```
PLATFORM MATURITY: LEVEL 3 / 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Level 1: Component primitives ██████████ DONE
Level 2: Design system        ████████░░ 80%
Level 3: Archetypes           ██████░░░░ 60%  ← CURRENT
Level 4: Platform infra       ███░░░░░░░ 25%
Level 5: Data layer           ██░░░░░░░░ 15%
Level 6: Full ecosystem       █░░░░░░░░░  8%
```

---

## 3. Current Architecture

### 3.1 Foundation Layer
```
ui-system/foundations/
├── tokens.css        ← CSS custom properties (color, space, radius, shadow, fs, fw)
├── dark-mode.css     ← Dark theme overrides
├── layout.css        ← Reset, scroll, body baseline
├── surfaces.css      ← Glass, card, toolbar, overlay semantic classes
├── typography.css    ← Text hierarchy
├── interactive.css   ← Focus, hover, input baseline
├── loading.css       ← Spinner, skeleton, empty state
├── responsive.css    ← Breakpoints
├── motion.css        ← Animation utilities (fade, scale, slide)
└── focus.css         ← A11y focus management

ui-system/tokens/     ← TypeScript token exports (colors, spacing, typography, motion, etc.)
ui-system/utils.ts    ← cn() utility
ui-system/composables/useTheme.ts ← Theme switching
```

**Status:** Foundation solid. Tokens comprehensive. Motion foundation exists but inconsistently applied across views.

### 3.2 Component Layer
```
components/
├── common/     ← 51 exports — BaseButton, BaseInput, BaseModal, BaseDrawer, etc.
├── layout/     ← AppShell, AppSidebar, AppTopbar, PageHeader
├── charts/     ← 7 chart types: Line, Area, Bar, Pie, Sparkline, Gauge, Heatmap
├── data/       ← BulkActionBar, FilterBuilder, Kanban, Timeline, Gallery, DataGridPro
├── feedback/   ← EmptyState, ErrorState
├── async/      ← JobCard, JobTimeline, LiveBadge, RetryButton, StepProgress
├── permission/ ← CanShow, PermissionGate, UpgradeTooltip
└── platform/   ← BottomSheet, SafeAreaContainer, TitleBar, WindowControls, OfflineBanner
```

**Status:** Common layer mature. Data/feedback/async/permission exist but underused in actual views. Platform components for Capacitor/Tauri not tested in real shells.

### 3.3 Composable Layer
```
25 composables including:
├── UI:          useToast, useContextMenu, useSelection, useBreakpoint, useHoverable
├── UX:          useFocusTrap, useShortcut, useScrollReveal, useStagger
├── Data:        useCrudState, useFilter, useFormState, useVirtualScroll
├── Platform:    useOnline, useLiveQuery, useOptimistic, useClipboard
├── Permission:  useCan, useFlag
└── I18n:        useI18n (Vietnamese default)
```

**Status:** Infrastructure composables are impressive but most are not wired into real views. `useLiveQuery`, `useOptimistic`, `useOnline` exist but dashboard/SaaS pages don't use them.

### 3.4 Store Layer
```
stores/
├── app.ts               ← App metadata, sidebar state, optional user
├── auth.ts              ← Auth user (mock login/logout)
├── dashboard.ts         ← KPIs, system alerts, errors, jobs, tickets
├── notifications.ts     ← In-app notification center
└── weconnect/
    ├── accounts.ts      ← Facebook account management (rich state, 12+ actions)
    ├── categories.ts    ← Account categories
    └── settings.ts      ← WeConnect config (columns, general, IP, interaction)
```

**Status:** WeConnect stores are production-grade and well-structured. Saas module has NO stores — all state is component-local. Dashboard store exists but SaaS dashboard doesn't use it.

### 3.5 Archetype Layer
```
archetypes/
├── crud/
│   └── CrudPage.vue     ← Config-driven: table + search + filter + pagination + add/edit modal + detail drawer + bulk actions
└── dashboard/
    └── DashboardKPICard.vue ← KPI card with sparkline, delta, alert, loading state
```

**Schema:**
```
schemas/crud.schema.ts   ← CrudPageConfig<T> — unified CRUD config type
```

**Status:** CrudPage archetype is genuinely reusable and well-used (5 configs in saas/, 1 in weconnect/). DashboardKPICard is good but isolated. Marketing archetype is empty. Need: FormSection archetype, StatWidget archetype, ChartCard archetype.

### 3.6 Config Layer
```
configs/
├── saas/
│   ├── members.config.ts
│   ├── products.config.ts
│   ├── transactions.config.ts
│   └── versions.config.ts
└── weconnect/
    └── contacts.config.ts
```

**Status:** Pattern is correct. All CRUD config via CrudPageConfig<T>. Mock data inline in configs (acceptable for now).

### 3.7 View Layer
```
views/
├── _layouts/   7 layout shells (App, Auth, Dashboard, Error, Landing, Saas, WeConnect)
├── app/        21 app pages (profile, mailbox, chat, wiki, etc.)
├── auth/       11 auth pages
├── dashboard/  11 dashboard variants
├── error/      7 error pages
├── forms/      11 form demos
├── landing/    10 landing pages
├── saas/       7 SaaS internal pages ← NEW, complete
├── showcase/   17 showcase demos
└── weconnect/  10 WeConnect pages
```

**Total:** 123 Vue views

---

## 4. Locked Architecture Decisions

These decisions are FINAL. Do not revisit without explicit governance review.

| Decision | Rationale |
|---|---|
| Vue 3 + `<script setup lang="ts">` | No Options API |
| CSS custom properties for ALL design values | No Tailwind, no hardcode |
| CrudPageConfig<T> for all CRUD tables | No hand-rolled tables |
| Pinia for state management | Domain-segmented stores only |
| Config objects in `configs/` directory | No inline data in views |
| Named exports everywhere | Tree-shakable library |
| archetypes/ for reusable page patterns | Not views/, not components/ |
| Vietnamese UI default + i18n-ready | useI18n for all strings eventually |

---

## 5. Current Priorities (Ranked)

> **Audit 2026-05-06:** Route guards, useSaasStore→DashboardView, NotificationCenter đều ĐÃ DONE.
> Platform maturity thực tế cao hơn governance docs mô tả. Cập nhật priorities:

1. **useApi()** — `useApi()` composable với mock adapter, toggle via `VITE_API_MODE`
2. **Column sort** — thêm vào `CrudPageConfig<T>` schema + CrudPage implementation
3. **Motion polish** — apply `useScrollReveal` vào homepage sections, `useStagger` vào KPI grid
4. **Mobile responsive** — breakpoint audit + fix layout cho màn hình < 768px
5. **FormSection archetype** — extract từ pattern trong SettingsView
6. **Test coverage** — Vitest cho CrudPage, DashboardKPICard, FormModal
7. **ChartCard archetype** — extract `.chart-card` pattern đang lặp trong DashboardView

---

## 6. Technical Debt

| Debt | Severity | Impact |
|---|---|---|
| SaaS pages (members/products/etc) use config-local mock data — no shared Pinia store | MEDIUM | Acceptable for now, needs useApi() migration when real backend ready |
| `useDashboardStore` (WeConnect ops) exists but only used in WeDashboard views, not SaaS dashboard | LOW | SaaS dashboard correctly uses useSaasStore |
| ~~No route guards~~ **DONE** — router.beforeEach guards /saas, /weconnect, /dashboard | ✅ RESOLVED | — |
| ~~NotificationCenter missing~~ **DONE** — component built + wired in SaasLayout | ✅ RESOLVED | — |
| No API layer — mocks scattered in configs | MEDIUM | Hard to switch to real API |
| No testing infrastructure | MEDIUM | No coverage |
| `useScrollReveal`/`useStagger` not applied to any real view | MEDIUM | Motion system wasted |
| Marketing archetype/ is empty | MEDIUM | Homepage will be built without pattern |
| `useLiveQuery`/`useOptimistic` not wired to any view | LOW-MED | Advanced infra unused |
| WeConnect stores detailed but WeConnect UI uses local state in some views | LOW | Inconsistent |
| i18n composable exists but strings are hardcoded Vietnamese | LOW | Won't matter until multi-lang |

---

## 7. Scaling Risks

| Risk | Probability | Impact |
|---|---|---|
| Dashboard pages remain isolated silos with no shared state | HIGH | Every new dashboard = full rebuild |
| New developers copy-paste tables instead of using CrudPage | HIGH | Design drift |
| Token violations creep in (hardcoded colors in new views) | MEDIUM | Design system corruption |
| Archetype layer stays thin — devs fall back to writing views from scratch | MEDIUM | Platform value lost |
| No API abstraction means switching from mock to real API requires touching 20+ files | HIGH | Migration pain |
| Homepage built as one-off page instead of using marketing archetype | MEDIUM | Can't reuse for landing pages |

---

## 8. Forbidden Patterns

See `WEMAKEUI_ARCHITECTURE_RULES.md` for the complete locked list.

Quick reference:
- ❌ Hardcoded colors, shadows, spacing, radius in components or views
- ❌ Hand-rolled data tables (must use CrudPage or DataGridPro)
- ❌ Fetch/axios calls inside Vue components or composables (must go through API layer)
- ❌ Duplicate form modals (must use FormModal/FormDrawer archetypes)
- ❌ Per-page motion implementations (must use useScrollReveal/useStagger)
- ❌ Auth-unguarded routes in production paths
- ❌ Inline mock data in views (must live in configs/)

---

## 9. Current Phase

**ACTIVE: Demo-Ready Polish**

Hệ thống đã đủ để demo cho cấp trên. Đang polish:
- Login flow wired (`auth.login()` + `router.push` sau submit)
- Notification push on actions (confirmTx → push to notifStore)
- Hero "Xem demo" dẫn đúng vào `/saas/dashboard`
- WEMAKEUI_DEMO_CHECKLIST.md đã tạo

---

## 10. Next Phase

**NEXT: Data Layer + CrudPage V2**

1. `useApi()` composable — mock adapter + `VITE_API_MODE` toggle
2. Column sort trong `CrudPageConfig<T>` + CrudPage implementation
3. `useScrollReveal` applied to homepage sections
4. `useStagger` applied to KPI card grid
5. `FormSection` archetype — extract từ SettingsView pattern
