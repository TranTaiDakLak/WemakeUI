# WEMAKEUI — Platform Roadmap
> Config-driven, archetype-driven, platform-first development plan.
> Last updated: 2026-05-06

---

## Guiding Principle

```
Every phase must:
1. Add reusable infrastructure (not just pages)
2. Have a visible showcase deliverable (leadership can see it)
3. Reduce future technical debt (not create it)
4. Follow Architecture Rules without exception
```

---

## PHASE 1 — CRUD + Archetypes ✅ IN PROGRESS

**Goal:** Establish the core pattern for all data management UIs across every company product.

**Status:** ~72% complete

### Completed
- [x] CrudPageConfig<T> schema
- [x] CrudPage archetype (table + search + filter + pagination + add/edit + detail drawer + delete + bulk)
- [x] SaaS module: Members, Products, Transactions, Versions
- [x] WeConnect: Contacts via CrudPage
- [x] StatusChip, TagList, UserDropdown common components
- [x] FormModal, FormDrawer, ConfirmDialog archetypes

### Remaining
- [ ] Column sort in CrudPageConfig schema + CrudPage implementation
- [ ] Date range filter type in FilterConfig
- [ ] Export to CSV action in CrudPage bulk actions
- [ ] `useCrudState` wired as optional data source in CrudPage
- [ ] EmptyState integrated into CrudPage
- [ ] `FormSection` archetype — extract from SettingsView pattern

### Architecture Impact
- Adds: CrudPageConfig schema, CrudPage archetype, FormModal/FormDrawer/ConfirmDialog archetypes
- Prevents: Hand-rolled tables, duplicate form modals, inconsistent CRUD UX

### Reusable Impact
- Every future CRUD page = write config, use archetype, done
- 0 duplicated table code

### Risks
- Without column sort, CrudPage feels unfinished for power users
- Without export, business users will work around CrudPage

---

## PHASE 2 — Platform Infrastructure ← NEXT PRIORITY

**Goal:** Wire the existing foundation into real working infrastructure. Stop building on sand.

**Status:** 0% complete (infrastructure exists but unconnected)

### Deliverables
1. **Route Guards** — `router.beforeEach` for `/saas/*`, `/weconnect/*`, `/dashboard/*`
2. **useApi()** — composable with mock adapter + real adapter toggle via `VITE_API_MODE`
3. **NotificationCenter** — component + wire `useNotificationsStore` to SaasLayout bell
4. **Store Migration** — move SaaS page data from component-local to Pinia stores
5. **useDashboardStore → DashboardView** — wire existing store to SaaS dashboard page
6. **Realtime simulation** — polling interval in useDashboardStore for KPI updates

### Architecture Impact
- Adds: useApi() abstraction, route guard system, notification UI
- Removes: All component-local MOCK data in views
- Prevents: Direct fetch/axios anywhere in codebase

### Reusable Impact
- useApi() = mock-swappable for all future projects
- NotificationCenter = shared across all layouts
- Route guard system = reusable for any auth-required section

### Risks
- **HIGH:** If we skip this phase, every new page increases migration cost
- **MED:** useApi() design must accommodate REST and eventual GraphQL/tRPC
- **LOW:** Polling simulation might feel janky vs real SSE

### Dependencies
- Phase 1 mostly done (CrudPage stable)
- useAuthStore exists
- useNotificationsStore exists
- useDashboardStore exists

---

## PHASE 3 — Global Platform UX

**Goal:** WemakeUI becomes the face of the company. Homepage + consistent motion + enterprise feel.

**Status:** 0% complete (components exist, application doesn't)

### Deliverables
1. **WemakeUI Platform Homepage** (`/wemakeui` or `/`)
   - Hero: Platform value proposition + live component preview
   - Architecture: Visual diagram of platform layers
   - Use cases: WeConnect demo, SaaS demo, Dashboard demo
   - Ecosystem: Token system, archetypes, composables showcase
   - CTA: Get started, Documentation
2. **Motion System Application**
   - Scroll reveal on all landing page sections
   - Stagger on dashboard KPI cards initial load
   - Page transition system (Vue Router)
   - Hover elevation on interactive cards
3. **Marketing Archetype**
   - `HeroSection` archetype (props: headline, subline, cta, visual)
   - `FeatureGrid` archetype (props: features[], columns, icon style)
   - `SectionWrapper` archetype (props: title, description, background, reveal)
4. **Design Language Unification**
   - Homepage and Dashboard must use same typography, spacing, motion
   - Enterprise sans-serif heading hierarchy
   - Subtle gradient accents (not kitsch)

### Architecture Impact
- Adds: Marketing archetype, HeroSection/FeatureGrid/SectionWrapper
- Adds: Page transition system
- Applies: useScrollReveal, useStagger to real pages for first time

### Reusable Impact
- Marketing archetype reusable for all product landing pages
- Motion system finally has real consumers
- Homepage demonstrates platform capabilities

### Risks
- **HIGH:** Without motion, homepage looks static and unmemorable
- **MED:** Enterprise aesthetic is subjective — needs design decision upfront
- **LOW:** Marketing archetype may over-generalize early

### Dependencies
- Phase 2 (platform infra) doesn't block homepage, but auth should be working

---

## PHASE 4 — Advanced Data Engine

**Goal:** Make CrudPage and dashboards genuinely powerful — not just a table + modal.

**Status:** 0% complete (foundation exists)

### Deliverables
1. **CrudPage V2**
   - Column sort (ascending/descending, multi-column)
   - Column visibility toggle (show/hide columns)
   - Date range filter type
   - Full-text search with highlight
   - Keyboard navigation (↑↓ rows, Enter = open detail)
   - Virtual scroll for 10,000+ rows
   - Inline edit (click cell to edit)
   - Export to CSV/Excel
2. **FilterBuilder integration**
   - Connect existing FilterBuilder component to CrudPage
   - Advanced filter: field + operator + value
3. **DataGridPro upgrade**
   - Pinned columns
   - Row grouping
   - Aggregate rows (sum, count, avg)
4. **Dashboard Grid System**
   - DraggableWidgetGrid archetype
   - Widget: ChartCard, StatCard, AlertCard, ActivityCard
   - Widget resize handles
   - Dashboard layout persistence (localStorage)
5. **QueryEngine**
   - useCrudState wired to CrudPage as real data source
   - Optimistic add/edit/delete via useOptimistic
   - Cache invalidation on filter change

### Architecture Impact
- Extends CrudPageConfig schema (new field types)
- Adds: Widget archetype system for dashboards
- Promotes: useCrudState, useOptimistic to first-class usage

### Reusable Impact
- Every CRUD page gets power features for free
- Dashboard becomes configurable by non-developers

### Risks
- **HIGH:** Inline edit significantly complicates CrudPage — careful schema extension
- **MED:** Drag-and-drop widget grid may conflict with AppShell layout

---

## PHASE 5 — Realtime + Analytics Ecosystem

**Goal:** Platform feels live, not static. Business insight is built-in.

**Status:** 0% complete

### Deliverables
1. **Realtime Engine**
   - SSE adapter in useApi() for live updates
   - useDashboardStore polling → SSE migration
   - LiveBadge wired to actual real-time state
   - Optimistic mutation with SSE rollback
2. **Analytics Archetype**
   - `AnalyticsPage` archetype: filter bar + KPI grid + chart grid + table
   - Replaces one-off StatisticsView
   - Props: entity, metrics, dimensions, dateRange
3. **Activity Bus**
   - Global event bus for cross-module activities
   - ActivityFeed archetype consuming bus
   - Activity types: crud.create, crud.update, crud.delete, auth.login, system.error
4. **Reporting System**
   - ReportBuilder: select metrics + group by + date range
   - Export: PDF, Excel, CSV
   - Scheduled reports via backend job
5. **Error Tracking**
   - ErrorBoundary Vue component
   - useErrorStore for unhandled exceptions
   - Error reporting UI in dashboard

### Architecture Impact
- Adds: SSE adapter, ActivityBus, ErrorBoundary, ReportBuilder
- Replaces: StatisticsView with AnalyticsPage archetype
- Wires: useLiveQuery, useOptimistic to real use cases

### Risks
- **HIGH:** SSE requires backend changes — depends on infrastructure team
- **HIGH:** ReportBuilder scope can balloon — needs strict MVP definition

---

## PHASE 6 — Infrastructure Platform

**Goal:** WemakeUI is genuinely publishable, testable, and deployable as a company platform.

**Status:** 0% complete

### Deliverables
1. **Testing Infrastructure**
   - Vitest unit tests: all composables
   - Component tests: CrudPage, DashboardKPICard, FormModal, FormDrawer
   - E2E tests (Playwright): key user flows (CRUD, auth, dashboard)
   - Coverage gate: 80% for archetypes, 60% for components
2. **Developer Experience**
   - Storybook: all common components with all prop combinations
   - Auto-generated documentation from TypeScript types
   - Token viewer in Storybook
   - Migration guide: v0 → v1
3. **Build Pipeline**
   - ESLint + Prettier enforced in CI
   - Pre-commit hooks (husky + lint-staged)
   - npm publish workflow
   - Versioning strategy (semver)
   - Changelog generation
4. **i18n Completion**
   - useI18n wired to all hardcoded Vietnamese strings
   - Translation files: vi.json, en.json
   - RTL layout support groundwork
5. **Performance**
   - Bundle size audit and optimization
   - Code splitting per route (already done via lazy imports)
   - Image optimization pipeline
   - Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Architecture Impact
- Finalizes: Library API surface
- Enforces: All architecture rules via automated tooling
- Enables: External teams to consume WemakeUI safely

### Risks
- **HIGH:** Storybook maintenance overhead — needs dedicated owner
- **MED:** Translating all strings is a large one-time effort

---

## Milestone Summary

| Phase | Name | Status | ETA |
|---|---|---|---|
| Phase 1 | CRUD + Archetypes | 🟡 72% | 1-2 weeks |
| Phase 2 | Platform Infrastructure | 🔴 0% | 2-3 weeks |
| Phase 3 | Global Platform UX | 🔴 0% | 2-3 weeks |
| Phase 4 | Advanced Data Engine | 🔴 0% | 3-4 weeks |
| Phase 5 | Realtime + Analytics | 🔴 0% | 4-6 weeks |
| Phase 6 | Infrastructure Platform | 🔴 0% | 4-6 weeks |

**Total estimated remaining:** 16-24 weeks to full platform maturity

---

## Priority Override Rules

**Never defer for later:**
1. Route guards (security)
2. Architecture rule violations (compound)
3. Type safety breaks (cascade)

**Always defer until Phase 3+:**
1. i18n string migration
2. Testing coverage
3. Storybook
4. Performance optimization
