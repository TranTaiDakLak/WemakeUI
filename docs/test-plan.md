# Test Plan — WeConnect UI Migration QA

> **Project:** WeConnect (Wails + Vue 3)
> **Created:** 2026-03-24
> **Scope:** UI Migration Phases 1-5 (tokens, dark mode, components, skeleton, icons)
> **Method:** Manual browser QA + visual inspection
> **Target:** `http://localhost:5173/` (dev) hoặc `WeConnect.exe` (production build)

---

## 1. Test Environment

| Item | Value |
|------|-------|
| OS | Windows 10/11 |
| Runtime | Wails v2 desktop app |
| Browser engine | WebView2 (Chromium-based) |
| Resolution targets | 1920×1080 (primary), 1366×768 (secondary) |
| Build command | `wails build` |
| Dev command | `cd frontend && npm run dev` |
| Quality gate | `cd frontend && npx vue-tsc --noEmit && npm run build` |

---

## 2. Test Matrix

### 2.1 Login Page — `/login`

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| L1 | Login page renders | 🔴 Critical | Navigate to `/login` | Login form visible, no blank page | ☐ |
| L2 | Font: Fira Sans | 🟡 Medium | Inspect login heading text | Font visually different from default browser font | ☐ |
| L3 | Compact radii | 🟡 Medium | Check input fields + button corners | Border-radius ~4px (not round) | ☐ |
| L4 | Login flow | 🔴 Critical | Enter credentials → click "Đăng nhập" | Redirect to `/app/facebook` | ☐ |
| L5 | Dark mode on login | 🟡 Medium | Toggle dark mode before login → reload | Login page should use dark colors if previously set | ☐ |

### 2.2 Main Layout — `/app/*`

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| M1 | Sidebar renders | 🔴 Critical | Login successfully | Sidebar visible with 5 menu items | ☐ |
| M2 | Sidebar width | 🟡 Medium | Check sidebar visual width | Uses `--sidebar-width` (240px expanded) | ☐ |
| M3 | Sidebar collapse | 🔴 Critical | Click "Thu gọn" | Sidebar collapses to 64px, icons only | ☐ |
| M4 | Sidebar expand | 🔴 Critical | Click expand (arrows flip) | Sidebar expands back to full width | ☐ |
| M5 | Navigation: Facebook | 🔴 Critical | Click "Facebook" in sidebar | Facebook view loads, item highlighted | ☐ |
| M6 | Navigation: Instagram | 🟡 Medium | Click "Instagram" | Coming Soon page renders | ☐ |
| M7 | Navigation: YouTube | 🟡 Medium | Click "YouTube" | Coming Soon page renders | ☐ |
| M8 | Navigation: Zalo | 🟡 Medium | Click "Zalo" | Coming Soon page renders | ☐ |
| M9 | Navigation: Thiết bị | 🟡 Medium | Click "Thiết bị" | Coming Soon page renders | ☐ |
| M10 | Topbar title | 🟡 Medium | Navigate between pages | Title + subtitle update correctly | ☐ |
| M11 | Content padding | 🟢 Low | Check main content area | Uses `--card-padding-compact` (12px) | ☐ |

### 2.3 Dark Mode Toggle

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| D1 | Toggle exists | 🔴 Critical | Look at topbar right side | Sun/moon icon visible between notification and user | ☐ |
| D2 | Light → Dark | 🔴 Critical | Click toggle (moon icon) | All UI transitions to dark palette, icon changes to sun | ☐ |
| D3 | Dark → Light | 🔴 Critical | Click toggle again (sun icon) | All UI returns to light palette, icon changes to moon | ☐ |
| D4 | Transition smoothness | 🟡 Medium | Toggle rapidly | 300ms fade, no flash of unstyled content | ☐ |
| D5 | Persistence: refresh | 🔴 Critical | Set dark → F5 reload page | Dark mode maintained after refresh | ☐ |
| D6 | Persistence: navigate | 🔴 Critical | Set dark → navigate to other page | Dark mode maintained during navigation | ☐ |
| D7 | Sidebar dark color | 🟡 Medium | In dark mode, check sidebar | Slate (#1E293B), NOT brand blue | ☐ |
| D8 | Topbar dark color | 🟡 Medium | In dark mode, check topbar | Dark translucent background | ☐ |
| D9 | Content bg dark | 🟡 Medium | In dark mode, check main area | Dark background (#1E293B) | ☐ |
| D10 | Text readability dark | 🟡 Medium | In dark mode, read all text | High contrast, no invisible text | ☐ |

### 2.4 DataGrid (Facebook View)

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| G1 | Grid renders | 🔴 Critical | Navigate to Facebook | Table visible with data rows | ☐ |
| G2 | Row height compact | 🟡 Medium | Check row spacing visually | ~36px row height (data-dense) | ☐ |
| G3 | Font size small | 🟡 Medium | Check cell text size | 12px font-size (compact) | ☐ |
| G4 | Column header style | 🟡 Medium | Check header row | Uppercase, 13px, tertiary color | ☐ |
| G5 | Row hover | 🟡 Medium | Hover over a data row | Row highlights with `--hover-bg` | ☐ |
| G6 | Row click/highlight | 🟡 Medium | Click a row | Row uses `--active-bg` (not hardcoded #cce5ff) | ☐ |
| G7 | Cell selection | 🟡 Medium | Click a cell | Cell uses `--hover-bg` + `--brand-primary` outline | ☐ |
| G8 | Checkbox column | 🟡 Medium | Check checkbox column | Checkboxes aligned, functional | ☐ |
| G9 | Column resize | 🟡 Medium | Drag column border | Column resizes smoothly | ☐ |
| G10 | Sort by column | 🟡 Medium | Click sortable header | Data sorts, indicator visible | ☐ |
| G11 | Status colors | 🟡 Medium | Check "Live", "Die", "Checkpoint" badges | Colors correct: green, red, yellow | ☐ |
| G12 | Grid in dark mode | 🔴 Critical | Toggle dark → check grid | Dark bg, light text, borders visible | ☐ |
| G13 | Scrollbar | 🟢 Low | Resize to show many rows | Scrollbar functional, doesn't overlap | ☐ |

### 2.5 Toolbar (FacebookActionBar)

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| T1 | Toolbar renders | 🔴 Critical | Navigate to Facebook view | Toolbar visible below menu strip | ☐ |
| T2 | Run button | 🔴 Critical | Click "Chạy" | Button functional, green gradient | ☐ |
| T3 | Add button | 🔴 Critical | Click "Thêm TK" | Add account modal opens | ☐ |
| T4 | Search input | 🟡 Medium | Type in search box | Text appears, search functional | ☐ |
| T5 | Search focus ring | 🟢 Low | Focus search input | Blue brand border + box shadow | ☐ |
| T6 | Category dropdown | 🟡 Medium | Click category dropdown | Dropdown opens with category list | ☐ |
| T7 | Category select/deselect | 🟡 Medium | Check/uncheck categories | Filter updates correctly | ☐ |
| T8 | Toolbar dark mode | 🔴 Critical | Toggle dark → check toolbar | Uses `--bg-secondary`, no white backgrounds | ☐ |
| T9 | Search dark mode | 🟡 Medium | Dark mode → focus search | Input text visible, placeholder visible | ☐ |
| T10 | Dropdown dark mode | 🟡 Medium | Dark mode → open category dropdown | Dark card bg, readable text | ☐ |

### 2.6 Menu Strip (FacebookMenuStrip)

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| MS1 | Menu strip renders | 🔴 Critical | Navigate to Facebook | Menu strip below topbar | ☐ |
| MS2 | Menu buttons | 🟡 Medium | Check all menu buttons | All 6 buttons visible, clickable | ☐ |
| MS3 | Dropdown: Tiện ích | 🟡 Medium | Click "Tiện ích" | Dropdown opens with 3 items | ☐ |
| MS4 | Dropdown: Liên hệ | 🟡 Medium | Click "Liên hệ" | Dropdown opens with 5 items | ☐ |
| MS5 | Menu strip dark mode | 🔴 Critical | Toggle dark → check | Uses `--bg-tertiary`, no white | ☐ |
| MS6 | Dropdown dark mode | 🟡 Medium | Dark mode → open dropdown | Dark bg, readable text | ☐ |

### 2.7 Modals

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| MO1 | Settings modal | 🟡 Medium | Click "Cài đặt chung" | Modal opens correctly | ☐ |
| MO2 | Copy modal | 🟡 Medium | Right-click → "Sao chép tùy chỉnh" | Modal opens, selects dark-safe | ☐ |
| MO3 | Copy modal dark mode | 🟡 Medium | Dark mode → open copy modal | Slots, preview use CSS vars | ☐ |
| MO4 | Category modal | 🟡 Medium | Click folder icon in toolbar | Category modal opens | ☐ |
| MO5 | Category highlight | 🟡 Medium | Click row in category modal | Highlight uses `--active-bg` | ☐ |
| MO6 | Trash modal | 🟡 Medium | Click "Thùng rác" | Trash modal opens correctly | ☐ |
| MO7 | Add account modal | 🟡 Medium | Click "Thêm TK" | Add account form renders | ☐ |
| MO8 | Modal close | 🟡 Medium | Click X or press Escape | Modal closes cleanly | ☐ |
| MO9 | Modal backdrop dark | 🟢 Low | Dark mode → open any modal | Backdrop visible, modal card dark | ☐ |

### 2.8 Typography & Fonts

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| F1 | Fira Sans loaded | 🔴 Critical | Check any text in app | Not default Times/Arial | ☐ |
| F2 | Fira Code in data | 🟡 Medium | Check textarea / code preview | Monospace font visible | ☐ |
| F3 | Font rendering quality | 🟡 Medium | Look at text at various sizes | Anti-aliased, no pixelation | ☐ |
| F4 | font-display: swap | 🟡 Medium | Clear cache → reload fast | Text visible immediately (no FOUT) | ☐ |

### 2.9 Status Bar

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| S1 | Status bar renders | 🟡 Medium | Check bottom of Facebook view | Status bar with account counts | ☐ |
| S2 | Status bar dark mode | 🟡 Medium | Toggle dark → check status bar | Readable, proper dark colors | ☐ |

### 2.10 User Menu (Topbar)

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| U1 | User avatar | 🟡 Medium | Check topbar right | Avatar circle with initial letter | ☐ |
| U2 | Dropdown opens | 🟡 Medium | Click user name | Dropdown with profile/settings/logout | ☐ |
| U3 | Dropdown dark mode | 🟡 Medium | Dark mode → open user dropdown | Card bg dark, text readable | ☐ |
| U4 | Click outside closes | 🟡 Medium | Open dropdown → click elsewhere | Dropdown closes | ☐ |

---

## 3. Regression Tests

These verify that existing functionality was NOT broken by the migration:

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| R1 | Login still works | 🔴 Critical | Full login flow | Successfully enters app | ☐ |
| R2 | Context menu | 🔴 Critical | Right-click on grid row | Context menu appears with all options | ☐ |
| R3 | Copy to clipboard | 🔴 Critical | Select rows → copy | Data copied to clipboard | ☐ |
| R4 | Move to category | 🟡 Medium | Right-click → Move to category | Category changes | ☐ |
| R5 | Toast notifications | 🟡 Medium | Trigger any action | Toast appears and auto-dismisses | ☐ |
| R6 | Page transitions | 🟡 Medium | Navigate between pages | Smooth fade transitions | ☐ |
| R7 | Wails window drag | 🟡 Medium | Drag topbar | Window moves (wails-drag works) | ☐ |
| R8 | Build size | 🟢 Low | Check dist/ output | No significant size increase (< 5%) | ☐ |

---

## 4. Performance Tests

| # | Test Case | Priority | Steps | Expected | Pass? |
|---|-----------|----------|-------|----------|-------|
| P1 | Initial load | 🟡 Medium | Cold start app | < 2s to interactive | ☐ |
| P2 | Font loading | 🟡 Medium | Clear cache → reload | Fonts visible within 500ms | ☐ |
| P3 | Theme toggle speed | 🟡 Medium | Toggle dark/light rapidly | < 300ms per toggle, no jank | ☐ |
| P4 | Grid scroll perf | 🟡 Medium | Scroll grid with 100+ rows | Smooth 60fps, no stuttering | ☐ |

---

## 5. Known Issues (Deferred — Do NOT block release)

These are acknowledged minor issues that will be fixed in a follow-up sprint:

| # | Issue | Severity | Component | Reason deferred |
|---|-------|----------|-----------|-----------------|
| K1 | TrashModal status badges hardcoded colors | 🟢 Low | TrashModal.vue | Only visible when modal open |
| K2 | SetupInteractModal ctx menu uses `#fff` | 🟢 Low | SetupInteractModal.vue | Only visible in context menu |
| K3 | SetupViewModal ctx menu uses `#fff`/`#ddd` | 🟢 Low | SetupViewModal.vue | Only visible in context menu |
| K4 | CategoryModal inline style `color:#e53e3e` | 🟢 Low | CategoryModal.vue:273 | Single inline style |

---

## 6. Test Execution Summary

| Category | Total | Critical | Medium | Low | Pass | Fail |
|----------|-------|----------|--------|-----|------|------|
| Login | 5 | 2 | 3 | 0 | ☐ | ☐ |
| Main Layout | 11 | 4 | 6 | 1 | ☐ | ☐ |
| Dark Mode | 10 | 4 | 6 | 0 | ☐ | ☐ |
| DataGrid | 13 | 2 | 10 | 1 | ☐ | ☐ |
| Toolbar | 10 | 3 | 6 | 1 | ☐ | ☐ |
| Menu Strip | 6 | 2 | 4 | 0 | ☐ | ☐ |
| Modals | 9 | 0 | 8 | 1 | ☐ | ☐ |
| Typography | 4 | 1 | 3 | 0 | ☐ | ☐ |
| Status Bar | 2 | 0 | 2 | 0 | ☐ | ☐ |
| User Menu | 4 | 0 | 4 | 0 | ☐ | ☐ |
| Regression | 8 | 3 | 4 | 1 | ☐ | ☐ |
| Performance | 4 | 0 | 4 | 0 | ☐ | ☐ |
| **TOTAL** | **86** | **21** | **60** | **5** | **☐** | **☐** |

---

## 7. Test Execution Workflow

```
1. Build: wails build
2. Launch: WeConnect.exe
3. Run ALL Critical tests (21 tests) — STOP if any fail
4. Run Medium tests (60 tests) — note failures
5. Run Low tests (5 tests) — note for backlog
6. Fill summary table
7. Create bug reports for any failures
```

### Pass Criteria

- ✅ **SHIP:** 100% Critical pass, ≥ 90% Medium pass
- ⚠️ **CONDITIONAL:** 100% Critical pass, 70-89% Medium pass (fix Medium failures before next release)
- ❌ **BLOCK:** Any Critical failure → fix before shipping

---

## 8. Files Changed (Test Focus Areas)

| Changed File | Test Focus |
|-------------|-----------|
| `style.css` (tokens + dark mode) | D1-D10, F1-F4, all dark mode tests |
| `stores/theme.ts` | D2-D6 (toggle + persistence) |
| `App.vue` | D5-D6 (theme initialization) |
| `AppSidebar.vue` | M1-M4, D7 |
| `AppTopbar.vue` | D1, U1-U4, M10 |
| `MainLayout.vue` | M11, R6 |
| `BaseDataGrid.vue` | G1-G13 |
| `FacebookActionBar.vue` | T1-T10 |
| `FacebookMenuStrip.vue` | MS1-MS6 |
| `CopyModal.vue` | MO2-MO3 |
| `CategoryModal.vue` | MO4-MO5 |
| `BaseSkeleton.vue` | N/A (new component, no consumer yet) |
