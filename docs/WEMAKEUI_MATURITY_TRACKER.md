# WEMAKEUI — Maturity Tracker
> Track trạng thái thật sự của từng hệ thống. Cập nhật sau mỗi phase.
> Last updated: 2026-05-07 (stack upgrade: Vite 6, TypeScript 5, vite-plugin-dts 4 — TypeScript definitions generation hoạt động)

---

## Scoring System

```
0%   — Not started
25%  — Proof of concept / stub
50%  — Working for happy path, untested edge cases
75%  — Production-quality, some gaps remain
90%  — Production-ready, minor polish
100% — Complete: tested, documented, peer-reviewed
```

---

## 1. Token System

**Completion: 82%**

| Sub-system | Status | % |
|---|---|---|
| Color tokens (brand, semantic, neutral) | ✅ Complete | 95% |
| Spacing scale (wx-space-1 → wx-space-16) | ✅ Complete | 95% |
| Typography scale (fs, fw, lh) | ✅ Complete | 90% |
| Radius scale (sm, md, lg, full) | ✅ Complete | 95% |
| Shadow/elevation scale | ✅ Complete | 85% |
| Motion tokens (d-fast/normal/slow, ease-*) | ✅ Defined | 80% |
| Dark mode overrides | ✅ Working | 85% |
| Component-level semantic tokens | ⚠️ Partial | 60% |
| TS token exports (for JS usage) | ✅ Present | 75% |

**Blockers:** Some components still use color-mix() with hardcoded hex fallback.

**Technical Debt:** motion tokens defined but applied inconsistently. Need audit of all CSS transition/animation values.

**Next Milestone:** Token audit script to detect violations + dark mode edge case fixes.

---

## 2. Motion System

**Completion: 40%**

| Sub-system | Status | % |
|---|---|---|
| motion.css foundation classes | ✅ Defined | 80% |
| motionScale.ts TS exports | ✅ Present | 70% |
| useScrollReveal composable | ✅ Built | 70% |
| useStagger composable | ✅ Built | 65% |
| Vue Transition wrappers (fade, scale, slide) | ✅ Present | 75% |
| Scroll reveal applied to real views | ❌ None | 0% |
| Stagger applied to real views | ❌ None | 0% |
| Page transition system | ❌ None | 0% |
| Homepage section animations | ❌ None | 0% |
| Reduced-motion support | ⚠️ CSS only | 40% |

**Blockers:** Motion system infrastructure exists but zero real-world application. Showcase exists (AnimationShowcase.vue) but actual pages are static.

**Technical Debt:** HIGH — useScrollReveal and useStagger are wasted investment until applied.

**Next Milestone:** Apply scroll reveal to Homepage hero + features section. Apply stagger to CRUD table rows on initial load.

---

## 3. Component System

**Completion: 78%**

| Category | Count | Quality | % |
|---|---|---|---|
| Common primitives (Button, Input, Modal, etc.) | 51 | Production | 85% |
| Layout shells (AppShell, Sidebar, Topbar) | 4 | Production | 85% |
| Charts (Line, Bar, Pie, Area, Sparkline, etc.) | 7 | Good | 75% |
| Data components (Grid, Kanban, Timeline, Gallery) | 8 | Good | 70% |
| Feedback (EmptyState, ErrorState) | 2 | Basic | 60% |
| Async (JobCard, LiveBadge, RetryButton) | 6 | Basic | 55% |
| Permission (CanShow, PermissionGate) | 3 | Good | 70% |
| Platform (BottomSheet, SafeAreaContainer, TitleBar) | 5 | Untested | 30% |

**Blockers:**
- Platform components not tested in real Capacitor/Tauri shell
- Async components not wired to real async operations
- EmptyState/ErrorState underused

**Technical Debt:** 51 common exports but many are used sparingly. Usage audit needed.

**Next Milestone:** Wire EmptyState into CrudPage for zero-results state. Add ErrorState to chart cards.

---

## 4. CRUD Architecture

**Completion: 72%**

| Sub-system | Status | % |
|---|---|---|
| CrudPageConfig<T> schema | ✅ Complete | 90% |
| CrudPage archetype (core) | ✅ Complete | 85% |
| Pagination | ✅ Built | 80% |
| Search | ✅ Built | 80% |
| Filter (select-based) | ✅ Built | 80% |
| Add modal | ✅ Built | 80% |
| Edit modal | ✅ Built | 80% |
| Detail drawer | ✅ Built | 85% |
| Delete confirm | ✅ Built | 85% |
| Bulk actions | ✅ Built | 75% |
| Sort (column) | ❌ Not built | 0% |
| Date range filter | ❌ Not built | 0% |
| Export (CSV/Excel) | ❌ Not built | 0% |
| Inline edit | ❌ Not built | 0% |
| Real API connection | ❌ Mock only | 0% |
| Optimistic updates | ❌ Not built | 0% |
| useCrudState wired to CrudPage | ❌ Not wired | 0% |

**Configs using CrudPage:** 5 (members, products, transactions, versions, wemakeui/contacts)

**Technical Debt:** Column sort is missing — most data tables need it. Export button exists in some views but does nothing. `useCrudState` composable exists but isn't used by CrudPage.

**Next Milestone:** Add column sort to CrudPageConfig schema + CrudPage implementation.

---

## 5. Dashboard Ecosystem

**Completion: 58%**

| Sub-system | Status | % |
|---|---|---|
| DashboardKPICard archetype | ✅ Built | 85% |
| Sparkline in KPI cards | ✅ Built | 80% |
| useSaasStore → SaaS DashboardView | ✅ Done — KPIs, pendingTxs, alert, counts | 85% |
| useDashboardStore (WemakeUI ops) | ✅ Built | 70% |
| useDashboardStore wired to WeDashboard views | ⚠️ WeDashboardV1/V2 use it | 60% |
| Alert banner dismissible | ✅ Done in SaaS Dashboard | 85% |
| Quick action buttons → routes | ✅ Done | 85% |
| Confirm tx action (store + toast + notification) | ✅ Done | 85% |
| ChartCard archetype | ❌ Not built | 0% |
| StatWidget archetype | ❌ Not built | 0% |
| ActivityFeed archetype | ❌ Not built | 0% |
| Dashboard layout grid system | ⚠️ Ad-hoc CSS grid | 45% |
| Realtime-feel (polling/SSE) | ❌ None | 0% |
| Dashboard-to-CRUD navigation | ✅ Quick actions + table links | 80% |

**Technical Debt:** `.chart-card` CSS pattern duplicated in DashboardView — extract to ChartCard archetype (R11 violation). No realtime simulation.

**Next Milestone:** Extract ChartCard archetype. Add polling simulation to useSaasStore for KPI updates.

---

## 6. Homepage / Marketing Ecosystem

**Completion: 22%**

| Sub-system | Status | % |
|---|---|---|
| LandingLayout shell | ✅ Built | 80% |
| LandingSaasView.vue | ✅ Built | 60% |
| AboutView.vue | ✅ Built | 55% |
| BlogListView.vue + BlogPostView.vue | ✅ Built | 55% |
| ContactView.vue | ✅ Built | 55% |
| ChangelogView.vue | ✅ Built | 60% |
| FeaturesView.vue | ✅ Built | 55% |
| CareersView.vue | ✅ Built | 50% |
| **WemakeUI Platform Homepage** | ❌ Not built | 0% |
| Marketing archetype | ❌ Empty stub | 0% |
| Scroll reveal on sections | ❌ None | 0% |
| Enterprise design language | ⚠️ Partial | 40% |
| Same token DNA as dashboard | ✅ Yes | 90% |

**Technical Debt:** Landing pages exist for generic SaaS. WemakeUI's own platform homepage (what the company shows leadership/clients) doesn't exist. Marketing archetype is an empty directory.

**Next Milestone:** Build WemakeUI platform homepage — Hero (platform value prop) + Architecture showcase + Use cases + Pricing.

---

## 7. API Layer

**Completion: 5%**

| Sub-system | Status | % |
|---|---|---|
| useApi() composable | ❌ Not built | 0% |
| Request interceptor | ❌ Not built | 0% |
| Response typing | ❌ Not built | 0% |
| Mock adapter | ❌ Not built | 0% |
| Error handling | ❌ Not built | 0% |
| Loading state integration | ❌ Not built | 0% |
| Config-driven base URL | ❌ Not built | 0% |

**Current state:** All data comes from inline MOCK arrays in config files. Zero HTTP calls.

**Technical Debt:** HIGH — when real API is ready, touching 20+ files. Need abstraction layer NOW.

**Next Milestone:** Implement `useApi()` with mock adapter that reads from configs/. Swap to real adapter via environment variable.

---

## 8. Auth Layer

**Completion: 72%**

| Sub-system | Status | % |
|---|---|---|
| useAuthStore (Pinia) | ✅ Built | 90% |
| Mock login/logout | ✅ Wired to LoginView | 90% |
| isLoggedIn computed | ✅ Built | 90% |
| Route guards | ✅ Done — router.beforeEach /saas /wemakeui /dashboard | 90% |
| Login redirect (query param support) | ✅ Done | 85% |
| Logout → /auth/login | ✅ Done (UserDropdown) | 90% |
| Token storage (localStorage) | ❌ Not built | 0% |
| Refresh token flow | ❌ Not built | 0% |
| Permission system (useCan) | ✅ Built | 70% |
| Role-based UI (PermissionGate) | ✅ Built | 65% |

**Technical Debt:** No persistent session — refresh clears auth state (but mock user re-initializes on store init, so demo is stable). No real token flow.

**Next Milestone:** localStorage persistence for auth token (needed before real backend).

---

## 9. Query / Mutation Layer

**Completion: 12%**

| Sub-system | Status | % |
|---|---|---|
| useLiveQuery composable | ✅ Built | 60% |
| useOptimistic composable | ✅ Built | 55% |
| Query wired to any view | ❌ None | 0% |
| Optimistic update in any view | ❌ None | 0% |
| Cache invalidation | ❌ Not designed | 0% |
| Loading skeleton integration | ⚠️ Manual | 30% |

**Technical Debt:** Infrastructure built speculatively. Has no consumers. Risk of drift if API design doesn't match assumptions.

**Next Milestone:** Wire useLiveQuery to CrudPage as optional data source (replaces initialData).

---

## 10. Notification System

**Completion: 82%**

| Sub-system | Status | % |
|---|---|---|
| useNotificationsStore | ✅ Built | 90% |
| Severity levels (info/warning/error/success) | ✅ Built | 90% |
| useToast composable (inline) | ✅ Built | 85% |
| BaseToast component | ✅ Built | 80% |
| In-app notification center UI | ✅ Done — NotificationCenter.vue | 85% |
| Notification bell with live unread count | ✅ Done — wired to store.unreadCount | 90% |
| push() from any store/view | ✅ Wired — DashboardView confirmTx pushes | 80% |
| dismiss() | ✅ Working | 85% |
| markAllRead | ✅ Working | 85% |
| mark-read on click | ✅ Working | 85% |
| Action link navigates + marks read | ✅ Working | 85% |

**Technical Debt:** Notification center not available in WemakeUI layout or DashboardLayout (only in SaasLayout). No persistence — cleared on refresh.

**Next Milestone:** Add NotificationCenter to WemakeUILayout topbar.

---

## 11. Realtime

**Completion: 8%**

| Sub-system | Status | % |
|---|---|---|
| useLiveQuery (polling) | ✅ Built | 60% |
| LiveBadge component | ✅ Built | 65% |
| SSE / WebSocket support | ❌ Not built | 0% |
| Realtime KPI updates | ❌ Not built | 0% |
| Realtime activity feed | ❌ Not built | 0% |

**Next Milestone:** Use setInterval in useDashboardStore to simulate realtime KPI updates (polling-feel).

---

## 12. Infrastructure / Platform

**Completion: 18%**

| Sub-system | Status | % |
|---|---|---|
| Vite build system | ✅ Production-ready | 90% |
| Library build (build:lib) | ✅ Working | 80% |
| TypeScript strict mode | ✅ Enforced | 85% |
| ESLint / Prettier | ❌ Not configured | 0% |
| Testing (Vitest/Cypress) | ❌ Zero tests | 0% |
| Storybook / component docs | ❌ Not built | 0% |
| i18n system | ✅ useI18n built | 65% |
| Cross-platform readiness | ⚠️ CSS only | 30% |
| CI/CD pipeline | ❌ Not defined | 0% |
| npm publish ready | ⚠️ Build works | 50% |

**Technical Debt:** CRITICAL — zero testing. ESLint not configured. CI/CD missing. Without these, platform can't be "company-wide" — no quality gates.

**Next Milestone:** Add Vitest + minimal component tests for CrudPage and DashboardKPICard.

---

## 13. Platform UX

**Completion: 45%**

| Sub-system | Status | % |
|---|---|---|
| Consistent sidebar navigation | ✅ Working | 80% |
| Dark mode toggle | ✅ Working | 85% |
| Responsive layout | ⚠️ Desktop-only | 40% |
| Keyboard navigation | ⚠️ Basic | 45% |
| A11y (ARIA, roles) | ⚠️ Partial | 35% |
| Loading states throughout | ⚠️ Ad-hoc | 45% |
| Empty states throughout | ⚠️ CrudPage only | 40% |
| Error boundaries | ❌ None | 0% |
| Offline experience | ⚠️ OfflineBanner exists | 25% |
| Toast feedback consistency | ✅ useToast available | 70% |

**Technical Debt:** A11y is the biggest gap. Platform is currently desktop-first. Mobile/tablet layouts need work for responsive views.

---

## Summary Scorecard

| System | % | Status |
|---|---|---|
| Token System | 82% | 🟢 Good |
| Motion System | 40% | 🔴 Critical debt — applies nowhere |
| Component System | 78% | 🟢 Good |
| CRUD Architecture | 72% | 🟡 Needs sort/export |
| Dashboard Ecosystem | 58% | 🟡 Wired, needs ChartCard archetype |
| Homepage / Marketing | 68% | 🟢 Done — `/home` route live |
| API Layer | 5% | 🔴 Critical debt |
| Auth Layer | 72% | 🟡 Login/logout/guard done, no persistence |
| Query / Mutation | 12% | 🟡 Built, unused |
| Notification System | 82% | 🟢 Center + store + push done |
| Realtime | 8% | 🔴 Not started |
| Infrastructure | 18% | 🔴 No tests, no CI |
| Platform UX | 55% | 🟡 Desktop-only, toast/notif consistent |

**Overall Platform Maturity: 52%** _(re-audit 2026-05-06 — previous 37% was based on stale docs)_
