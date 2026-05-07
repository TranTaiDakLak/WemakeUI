# WEMAKEUI — Reusable Boundaries
> Xác định rõ cái gì phải reusable, cái gì không được duplicate, và ranh giới giữa archetype/component/view.
> Last updated: 2026-05-06

---

## Boundary Model

```
┌────────────────────────────────────────────────────┐
│  VIEWS  — business-specific, 1 instance per route  │
│  views/saas/MembersView.vue                        │
├────────────────────────────────────────────────────┤
│  ARCHETYPES  — reusable page patterns              │
│  archetypes/crud/CrudPage.vue                      │
│  archetypes/dashboard/DashboardKPICard.vue         │
├────────────────────────────────────────────────────┤
│  COMPONENTS  — reusable UI blocks                  │
│  components/common/BaseButton.vue                  │
│  components/charts/LineChart.vue                   │
├────────────────────────────────────────────────────┤
│  FOUNDATION  — tokens, motion, layout              │
│  ui-system/foundations/tokens.css                  │
└────────────────────────────────────────────────────┘
```

**Rule:** Each layer consumes from the layer below, never skips a layer, never reaches upward.

---

## Layer 1: Foundation (ALWAYS REUSABLE — NEVER DUPLICATE)

### Design Tokens
**Location:** `ui-system/foundations/tokens.css` + `ui-system/tokens/`

Every project consuming WemakeUI gets these for free. Never replicate token values.

| Token Group | Examples | Must reuse |
|---|---|---|
| Colors | `--wx-brand-primary`, `--wx-danger-solid` | ✅ |
| Surfaces | `--wx-surface-default`, `--wx-surface-sunken` | ✅ |
| Text | `--wx-text-primary`, `--wx-text-muted` | ✅ |
| Spacing | `--wx-space-1` through `--wx-space-16` | ✅ |
| Typography | `--wx-fs-*`, `--wx-fw-*`, `--wx-lh-*` | ✅ |
| Radius | `--wx-radius-sm`, `--wx-radius-md`, `--wx-radius-full` | ✅ |
| Shadow | `--wx-shadow-sm`, `--wx-shadow-md` | ✅ |
| Motion | `--wx-d-fast`, `--wx-ease-out` | ✅ |

### Motion Utilities
**Location:** `ui-system/foundations/motion.css`, `useScrollReveal`, `useStagger`

| Utility | What it provides | Must reuse |
|---|---|---|
| `.fade-in` | Opacity 0→1 | ✅ |
| `.scale-in` | Scale + fade | ✅ |
| `.slide-up` | Y translate + fade | ✅ |
| `useScrollReveal` | IntersectionObserver-driven reveal | ✅ |
| `useStagger` | Staggered child animation | ✅ |

---

## Layer 2: Components (REUSABLE — NEVER DUPLICATE)

### Core Primitives (LOCKED — never clone, always reuse)

| Component | What NOT to duplicate |
|---|---|
| `BaseButton` | No `<button class="my-btn">` in views |
| `BaseInput` | No `<input class="my-input">` in views |
| `BaseModal` | Use FormModal or ConfirmDialog instead |
| `BaseDrawer` | Use FormDrawer instead |
| `BaseDropdown` | No custom dropdown implementations |
| `BasePagination` | No custom pagination |
| `BaseBadge` | No `<span class="my-badge">` |
| `BaseAvatar` | No `<img class="avatar">` |
| `BaseSelect` | No native `<select>` in views |
| `BaseToggle` | No `<input type="checkbox" class="toggle">` |
| `BaseToast` / `useToast` | No custom alert/toast |

### Chart Components (LOCKED — never build custom SVG charts)

| Component | What NOT to duplicate |
|---|---|
| `LineChart` | No inline SVG path calculations |
| `BarChart` | No `<div class="bar">` CSS bars |
| `PieChart` | No `conic-gradient` pie hacks |
| `AreaChart` | No D3 imports in views |
| `Sparkline` | No `<canvas>` sparkline |
| `Gauge` | No SVG arc calculations in views |

### Layout Components (LOCKED)

| Component | What NOT to duplicate |
|---|---|
| `AppShell` | No custom layout grid in views |
| `AppSidebar` | No custom nav sidebar |
| `AppTopbar` | No custom topbar |
| `PageHeader` | No custom page header with breadcrumb |

### SaaS-specific Components (REUSABLE within platform)

| Component | When to reuse |
|---|---|
| `StatusChip` | Any field showing status + color-coded badge |
| `TagList` | Any field showing N tags + overflow |
| `UserDropdown` | All layouts with authenticated user menu |
| `FormModal` | All add/edit forms in modal |
| `FormDrawer` | All add/edit forms in side drawer |
| `ConfirmDialog` | All delete/destructive confirmation |

---

## Layer 3: Archetypes (REUSABLE PATTERNS — NEVER HAND-ROLL)

### Existing Archetypes

#### CrudPage (`archetypes/crud/CrudPage.vue`)
**What it provides:** Complete CRUD table with search, filter, pagination, add modal, edit modal, detail drawer, delete confirm, bulk actions.

**When to use:** ANY view that manages a list of entities.

**What NOT to duplicate:**
- Hand-rolled `<table>` with CRUD operations
- Custom `<BaseModal>` with form inside
- Custom search/filter implementation
- Custom pagination

**Consume via:**
```typescript
const config: CrudPageConfig<MyEntity> = { ... }
// In template:
<CrudPage :config="config" />
```

#### DashboardKPICard (`archetypes/dashboard/DashboardKPICard.vue`)
**What it provides:** Metric display with sparkline, delta trend, alert chip, loading skeleton, icon with 7 color backgrounds.

**When to use:** ANY KPI/metric card in any dashboard.

**What NOT to duplicate:**
- Custom metric cards
- Custom sparkline implementations
- Trend arrows hardcoded in views

**Consume via:**
```vue
<DashboardKPICard
  label="Doanh thu"
  :metric="1845000"
  :delta="12.4"
  :sparkline="[80, 95, 110, 150, 184]"
  icon-emoji="💰"
  icon-bg="blue"
/>
```

---

### Archetypes To Build (MUST build before implementing 2nd instance)

#### FormSection (PLANNED — Phase 1 remaining)
**Needed for:** SettingsView pattern (4 section cards with header/body/footer + dirty tracking)

**What it will provide:** Settings section with title, description, dirty badge, save/reset actions, slot for fields.

**Trigger:** SettingsView.vue has this pattern hand-rolled. As soon as a second settings page is needed → extract first.

#### ChartCard (PLANNED — Phase 2)
**Needed for:** Every chart in DashboardView, StatisticsView, future analytics pages

**What it will provide:** Card shell with title, subtitle, period selector, loading state, slot for chart content, error state.

**Trigger:** DashboardView + StatisticsView both hand-roll `.chart-card` CSS. → extract.

#### StatWidget (PLANNED — Phase 2)
**Needed for:** Summary stats rows (not full KPI cards, just number + label + tiny indicator)

**What it will provide:** Compact stat display for use in drawers, sidebars, table footers.

#### ActivityFeed (PLANNED — Phase 3)
**Needed for:** Dashboard activity stream, audit log, notification center

**What it will provide:** Timeline of events with icon, actor, action, timestamp, severity.

#### HeroSection (PLANNED — Phase 3)
**Needed for:** Homepage, product landing pages

**What it will provide:** Full-width hero with headline, subline, CTA buttons, visual/illustration slot, background options.

#### FeatureGrid (PLANNED — Phase 3)
**Needed for:** Homepage features section, product detail pages

**What it will provide:** Grid of feature cards with icon, title, description, stagger animation.

#### AnalyticsPage (PLANNED — Phase 5)
**Needed for:** StatisticsView, future analytics modules

**What it will provide:** Full analytics page pattern: filter bar + metric grid + chart grid + data table, all config-driven.

---

## Layer 4: Views (BUSINESS-SPECIFIC — one per route, no reuse)

Views are the ONLY layer allowed to be business-specific and non-reusable.

**A view MAY:**
- Contain page-specific layout composition
- Use archetypes with specific configs
- Have page-specific slot overrides for CrudPage/charts
- Contain typed helper functions (e.g., `function asMember(row): Member`)

**A view MUST NOT:**
- Contain shared components not in components/ directory
- Contain MOCK data (must be in configs/)
- Contain business logic that could be in a store or composable
- Duplicate CSS patterns that exist in another view (→ extract to archetype)

---

## Duplication Red Lines

These are patterns that CANNOT appear more than once before being extracted:

| Pattern | First occurrence | Extract to |
|---|---|---|
| Settings card (header/body/footer + dirty) | `SettingsView.vue` | `FormSection` archetype |
| Chart card (title + chart slot) | `DashboardView.vue` | `ChartCard` archetype |
| Pending items table with action buttons | `DashboardView.vue` | `ActionableTable` archetype |
| Top-N list with rank, name, value | `StatisticsView.vue` | `RankedList` archetype |
| Integration row (icon, name, status, toggle, test) | `SettingsView.vue` | `IntegrationRow` component |
| Member mini (avatar + name + email stacked) | Multiple views | `MemberCell` component |
| Code badge (`<code class="...">`) | Multiple views | `CodeBadge` component |
| Amount display with tabular-nums | Multiple views | `AmountCell` component |

---

## What Is NOT Reusable (By Design)

These should remain view-specific:

| Item | Why not reusable |
|---|---|
| `versionsConfig` | Business-specific config, not a pattern |
| `membersConfig` | Business-specific config, not a pattern |
| `asMember()` typed cast helper | View-local slot typing bridge |
| `confirmTx()` action | Business-specific async action |
| Page breadcrumb content | Route-specific |
| Page title and description | Route-specific |
| `TX_STATUS_MAP` | Business-specific status mapping |

---

## Duplication Detection Checklist

Before writing a new CSS class or component:

```
□ Does tokens.css already cover this visual value?
□ Does any component in components/common/ do this?
□ Does any archetype in archetypes/ do this?
□ Have I seen this exact pattern in another view?
  □ Yes → Extract BEFORE implementing here
□ Will this CSS class appear in more than 1 file?
  □ Yes → Move to appropriate foundation or component
```
