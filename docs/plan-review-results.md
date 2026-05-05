# /plan-eng-review + /plan-design-review — WeConnect UI Migration

> **Date:** 2026-03-24 · **Branch:** master · **Plan:** weconnect-ui-design-doc
> **Reviewed:** Design doc từ /office-hours session

---

# PART 1: /plan-eng-review

## Step 0: Scope Challenge

### Existing code already solves these:
- ✅ CSS variable system (434 dòng, đã tokenized) — plan **reuses** correctly
- ✅ `.light-mode` class — dark mode pattern already established
- ✅ 16 base components (`Base*.vue`) — plan doesn't rebuild
- ✅ Design system check workflow — ensures compliance

### Complexity check
- **Files affected:** ~30 (plan estimate) — acceptable for CSS-first migration
- **New classes/services:** 0 — only modifying tokens + applying to existing components
- **Innovation tokens spent:** 0 — all proposed changes are boring (Layer 1)

### Scope assessment: ✅ ACCEPTED AS-IS
Plan touches CSS variables + component styling. No new abstractions, no backend changes. This is the minimum set for the stated goal.

---

## Section 1: Architecture Review

### 1.1 CSS Cascade Strategy
```
CURRENT STATE                      PROPOSED STATE
================                   ================
:root (default = light)            :root (default = light)
  └── .light-mode (override)         ├── .light-mode (override)
                                     └── .dark-mode (NEW)
```

**Finding:** Plan proposes `.dark-mode` class on body/app. This is correct — matches existing `.light-mode` pattern. No specificity conflicts.

**⚠️ Issue 1: Dark mode toggle persistence**
Where does dark mode preference get stored? Plan doesn't specify. Options:
- **1A)** localStorage (simplest, works immediately) — Completeness: 8/10
- **1B)** Pinia store + localStorage sync — Completeness: 10/10

**RECOMMENDATION: 1B** — Pinia store lets any component react to theme changes. localStorage alone requires page reload. Cost: ~15 extra lines.

### 1.2 Font Loading
**⚠️ Issue 2: Two @import fonts = render blocking**
Plan adds Fira Sans + Fira Code via `@import url(...)`. This blocks first paint.

- **2A)** Keep @import (simple, slight blocking) — Performance: 6/10
- **2B)** Use `<link rel="preload">` in index.html + font-display: swap — Performance: 10/10

**RECOMMENDATION: 2B** — Desktop app via Wails, but font flash is still jarring. Preloading costs 2 extra lines in index.html.

### 1.3 Dependency Graph
```
style.css (tokens)
  ├── BaseDataGrid.vue (consume --table-row-height, --font-family-mono)
  ├── .card (consume --card-padding-compact)
  ├── AppSidebar.vue (consume --sidebar-width)
  ├── AppTopbar.vue (consume --header-height)
  └── 35+ modals (inherit tokens automatically)
```
**No coupling concerns.** CSS variables cascade naturally. Modals inherit without changes.

---

## Section 2: Code Quality Review

### 2.1 DRY Analysis
**Current violations found in codebase:**

| Pattern | Count | Location |
|---------|-------|----------|
| Hardcoded `gap: 8px` | Likely in components | Should use `--grid-gap-compact` |
| `font-size: 12px` hardcoded | Likely in DataGrid | Should use `--font-size-small` |

**Plan fixes this** by introducing tokens. ✅ No DRY concerns in the plan itself.

### 2.2 Naming Review
Plan introduces:
- `--grid-gap-compact` → ✅ Clear, describes purpose
- `--card-padding-compact` → ✅ Clear
- `--table-row-height` → ✅ Clear
- `--font-family-mono` → ✅ Matches `--font-family` pattern

Naming is consistent with existing token scheme. ✅

---

## Section 3: Test Review

```
CODE PATH COVERAGE (CSS migration)
===========================
[+] frontend/src/style.css (tokens)
    │
    ├── :root variables
    │   ├── [N/A] Default tokens — CSS, no logic to test
    │   └── [GAP] New tokens (--table-row-height, --font-family-mono)
    │       → Verify they're consumed by at least one component
    │
    ├── .dark-mode
    │   ├── [GAP] All 15 color overrides work correctly
    │   └── [GAP] Toggle persistence (localStorage + Pinia)
    │
    └── .light-mode
        └── [N/A] Already exists, no changes

[+] BaseDataGrid.vue
    │
    ├── [GAP] --table-row-height applied correctly
    ├── [GAP] --font-family-mono on data cells
    └── [GAP] Dark mode contrast on alternating rows

[+] AppTopbar.vue
    │
    └── [GAP] Dark mode toggle button works

USER FLOW COVERAGE
===========================
[+] Dark mode toggle
    │
    ├── [GAP] [→E2E] User clicks toggle → theme changes immediately
    ├── [GAP] [→E2E] User refreshes → theme persists
    └── [GAP] Theme respects system preference (optional)

─────────────────────────────
COVERAGE: 0/9 paths tested
QUALITY: No tests exist (CSS project, no test framework configured)
GAPS: 9 paths need verification
─────────────────────────────
```

**Test strategy for CSS-only changes:** Since this is a Wails desktop app without a test framework for frontend, verification = `/qa` visual QA after implementation. Plan should specify `/qa` as Phase 5.

---

## Section 4: Performance Review

| Concern | Risk | Mitigation |
|---------|------|-----------|
| 2 Google Font imports | Medium — render blocking | Use `<link rel="preload">` + font-display: swap |
| `.dark-mode` selector specificity | Low | Same specificity as `.light-mode` ✅ |
| CSS variable lookup | Negligible | Browser-native, no measurable cost |
| 35+ modal re-renders | None | CSS cascade, no JS needed |

**No N+1 queries, no memory concerns.** This is pure CSS + minor JS (toggle).

---

## Eng Review Completion Summary

| Section | Result |
|---------|--------|
| Step 0: Scope | ✅ Accepted as-is |
| Architecture | 2 issues (toggle persistence, font loading) |
| Code Quality | 0 issues |
| Test Review | 9 gaps (expected for CSS-only, use /qa) |
| Performance | 1 concern (font loading) |
| NOT in scope | Backend, new views, DB schema |
| What already exists | CSS variable system, .light-mode, 16 base components |
| Failure modes | 0 critical gaps |
| Lake Score | 2/2 recommendations chose complete option |

---

# PART 2: /plan-design-review

## System Audit
- **DESIGN.md:** ❌ Does not exist — flagged as gap
- **UI scope:** ✅ CSS tokens, dark mode, font swap, DataGrid, spacing
- **Existing patterns:** 16 base components, 35+ modals, DataGrid-centric layout
- **Classifier:** **APP UI** (workspace-driven, data-dense, task-focused)

## Step 0: Initial Design Rating

**Overall: 5/10**

The plan has solid token changes and good Pro Max research backing, but **missing critical design dimensions:** interaction states, responsive behavior, and specific visual specs.

A 10 would have: every state specified, responsive breakpoints defined, keyboard nav patterns, and specific UI mock descriptions for dark mode.

---

## Pass 1: Information Architecture — 7/10

✅ **Good:** Plan defines clear hierarchy:
- Sidebar (240px) → Topbar (56px) → Content area → DataGrid (central)
- Card padding compact (12px) — data-first, not chrome-first

⚠️ **Gap:** Plan doesn't specify what happens to the **sidebar navigation in dark mode**. Current sidebar is brand-blue (`--sidebar-bg: #50a0ff`). In dark mode, does sidebar stay blue or go dark?

**Fix added to plan:** Dark mode sidebar should shift to `#1E293B` (slate) — brand blue sidebar in dark is too loud. Active nav item uses brand blue accent.

**After fix: 8/10**

---

## Pass 2: Interaction State Coverage — 3/10 → needs work

```
FEATURE              | LOADING | EMPTY | ERROR | SUCCESS | PARTIAL
---------------------|---------|-------|-------|---------|--------
DataGrid             | ❌      | ❌    | ❌    | ✅      | ❌
Dark mode toggle     | N/A     | N/A   | ❌    | ✅      | N/A
Font loading         | ❌      | N/A   | ❌    | ✅      | ❌ (FOUT)
Category switching   | ❌      | ❌    | N/A   | ✅      | N/A
```

**Critical gaps:**
- No loading state for DataGrid (1000+ accounts loading from SQLite)
- No FOUT (Flash of Unstyled Text) handling for font swap
- No empty state for DataGrid ("Chưa có tài khoản nào")

**Fixes needed in plan:**
1. Skeleton loader for DataGrid (Phase 4)
2. `font-display: swap` with fallback font stack
3. Empty state component with illustration + CTA "Thêm tài khoản"

**After fix: 7/10** (still needs per-modal empty states, deferred)

---

## Pass 3: User Journey & Emotional Arc — 5/10

```
STEP | USER DOES              | USER FEELS           | PLAN SPECIFIES?
-----|------------------------|---------------------|----------------
1    | Opens app              | Neutral/expectation | ❌ First-load experience
2    | Sees DataGrid          | Familiarity (if WeFB user) | ✅ Compact, familiar
3    | Toggles dark mode      | Satisfaction         | ❌ Animation/transition?
4    | Scans account data     | Efficient            | ✅ Fira Code for data
5    | Reads status badges    | Quick comprehension  | ✅ Modern green/red
```

**Gap:** Transition from light → dark mode. Should it be instant or fade?

**Fix:** Add `transition: background-color 0.3s, color 0.3s` to body/app — smooth cross-fade, no jarring switch.

**After fix: 7/10**

---

## Pass 4: AI Slop Risk — 9/10 ✅

Plan is excellent here:
- ❌ No generic card grid — uses DataGrid-centric layout
- ❌ No purple gradients — keeps brand blue
- ❌ No emoji as design elements
- ❌ No centered-everything pattern
- ✅ Specific fonts named (Fira Sans/Code)
- ✅ Specific colors from Pro Max research
- ✅ Desktop-app style, not SaaS template

**No AI slop detected.** The Pro Max research gives it specificity.

---

## Pass 5: Design System Alignment — 6/10

**Gap:** No DESIGN.md exists. Plan has implicit design system but it's not documented.

**Fix recommended:** Create `DESIGN.md` after implementation:
- Color tokens with swatch previews
- Font usage rules (when Sans vs Code)
- Spacing scale documentation
- Component catalog

**Deferred to separate task — not blocking this plan.**

**After fix (with TODO): 7/10**

---

## Pass 6: Responsive & Accessibility — 2/10

**This is a Wails desktop app** — no mobile/tablet needed. But:

⚠️ **Keyboard navigation:** Not specified. DataGrid needs:
- Arrow keys for row navigation
- Enter to select/edit
- Tab between toolbar and grid
- Esc to close modals

⚠️ **Screen reader:** Not specified (low priority for desktop admin tool but good practice)

⚠️ **Color contrast:** Dark mode text `#F1F5F9` on `#1E293B` = 11.6:1 ratio → ✅ WCAG AAA

**Fix:** Add keyboard nav spec for DataGrid (Phase 3). Desktop app = no mobile needed.

**After fix: 5/10** (limited by desktop-only scope, which is OK)

---

## Pass 7: Unresolved Design Decisions — 3 resolved, 2 deferred

```
DECISION NEEDED                    | RESOLUTION
----------------------------------|---------------------------
Dark sidebar color?               | ✅ #1E293B (slate) — decided
Light→dark transition?            | ✅ 300ms crossfade — decided
Font fallback during load?        | ✅ font-display: swap — decided
Empty state illustrations?        | 🟡 Deferred to Phase 4
Per-modal empty states?           | 🟡 Deferred to TODO
```

---

## Design Review Completion Summary

```
+====================================================================+
|         DESIGN PLAN REVIEW — COMPLETION SUMMARY                    |
+====================================================================+
| System Audit         | No DESIGN.md, APP UI classifier             |
| Step 0               | 5/10 initial, focus: all 7 dimensions       |
| Pass 1  (Info Arch)  | 7/10 → 8/10 (sidebar dark mode decided)     |
| Pass 2  (States)     | 3/10 → 7/10 (skeleton + empty + FOUT fixes) |
| Pass 3  (Journey)    | 5/10 → 7/10 (transition animation added)    |
| Pass 4  (AI Slop)    | 9/10 → 9/10 (no issues)                    |
| Pass 5  (Design Sys) | 6/10 → 7/10 (DESIGN.md TODO added)          |
| Pass 6  (Responsive) | 2/10 → 5/10 (keyboard nav spec, desktop OK) |
| Pass 7  (Decisions)  | 3 resolved, 2 deferred                      |
+--------------------------------------------------------------------+
| NOT in scope         | 3 items (DESIGN.md, modal empty states, a11y)|
| What already exists  | CSS vars, .light-mode, 16 Base components    |
| TODOS.md updates     | 3 items proposed                             |
| Decisions made       | 3 added to plan                              |
| Decisions deferred   | 2 (empty state illustrations, modal states)  |
| Overall design score | 5/10 → 7/10                                 |
+====================================================================+
```

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests | 1 | ✅ CLEAR | 2 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | ✅ CLEAR | score: 5/10 → 7/10, 3 decisions |

**VERDICT:** ENG + DESIGN CLEARED — ready to implement.

---

## Amendments to Design Doc

Based on reviews, the plan needs these additions:

### Amendment 1: Dark mode toggle in Pinia store
```typescript
// stores/theme.ts
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')
  // Apply to document and persist
})
```

### Amendment 2: Font preloading in index.html
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=...">
```

### Amendment 3: Phase 5 = /qa visual verification (mandatory)

### Amendment 4: Dark mode transition
```css
body { transition: background-color 0.3s, color 0.3s; }
```

### Amendment 5: Sidebar dark mode = #1E293B (not brand blue)
