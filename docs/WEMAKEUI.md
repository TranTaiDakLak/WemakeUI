# WemakeUI — master specification

> bộ UI kit Vue 3 cross-platform (web · mobile · desktop wrapper). tài liệu này là nguồn duy nhất (single source of truth) — gộp từ TEMPLATES.md + DESIGN-SYSTEM.md trước đây.
>
> ngôn ngữ: tiếng Việt sentence case (không UPPERCASE trừ acronym: API/UI/CTA/KPI/SLA/RBAC/SaaS/CRM/IoT).
> font: **Inter**. brand: **xanh dương `#2563eb`**. gradient: 11 token `--wx-gradient-*` đã có sẵn.
> cập nhật: 2026-05-05.

---

## phần I — quy ước nền tảng

### 1.1 typography

| token | value | dùng cho |
|-------|-------|----------|
| `--wx-font-primary` | `"Inter", -apple-system, BlinkMacSystemFont, sans-serif` | toàn bộ UI |
| `--wx-font-mono`    | `ui-monospace, SFMono-Regular, monospace` | code, log, ID |

font Nunito **bỏ** khỏi UI — chỉ giữ làm tuỳ chọn cho hero marketing.

scale (thêm vào tokens.css):

```
--wx-fs-12: 12px   /* caption, badge text, meta, helper */
--wx-fs-13: 13px   /* secondary meta */
--wx-fs-14: 14px   /* body sm, label, button md, tab */
--wx-fs-15: 15px   /* body mặc định */
--wx-fs-16: 16px   /* body lg, input lg */
--wx-fs-18: 18px   /* subtitle, h6 */
--wx-fs-20: 20px   /* h5 */
--wx-fs-24: 24px   /* h4 */
--wx-fs-28: 28px   /* h3 */
--wx-fs-32: 32px   /* h2 */
--wx-fs-40: 40px   /* h1 */
--wx-fs-48: 48px   /* hero */
--wx-fs-64: 64px   /* display */

--wx-lh-tight:   1.2    /* heading */
--wx-lh-snug:    1.35
--wx-lh-normal:  1.5    /* body */
--wx-lh-relaxed: 1.7    /* prose */

--wx-fw-regular:  400
--wx-fw-medium:   500
--wx-fw-semibold: 600
--wx-fw-bold:     700

--wx-tracking-tight:  -0.01em   /* heading >= 24px */
--wx-tracking-normal: 0
--wx-tracking-wide:   0.02em    /* mono caption */
```

quy tắc viết:
- không UPPERCASE / `text-transform: uppercase` cho label / button / tab / badge.
- tiêu đề trang & section: sentence case ("trang chủ", "khách hàng", "đơn hàng").
- heading ≥ 24px → `letter-spacing: -0.01em`, `font-weight: 600`.
- mono cho ID, mã hoá đơn, log timestamp, code block.

### 1.2 màu sắc & gradient

raw tokens (đã có trong `tokens.css`) — **không** dùng trực tiếp ở component. component dùng alias semantic:

```
/* alias semantic (public API) */
--wx-content-primary    → --wx-text-primary
--wx-content-secondary  → --wx-text-secondary
--wx-content-muted      → --wx-text-muted
--wx-content-disabled   → --wx-text-disabled
--wx-content-inverse    → --wx-text-inverse
--wx-content-link       → --wx-text-link

--wx-bg-base    → --wx-surface-base
--wx-bg-raised  → --wx-surface-elevated
--wx-bg-sunken  → --wx-surface-sunken
--wx-bg-overlay → --wx-surface-overlay
```

gradient — giữ nguyên 11 token đã có:
- `--wx-gradient-bg` — page background, hero light.
- `--wx-gradient-header` — sidebar header, top banner.
- `--wx-gradient-cta` — primary CTA cao cấp (hero, pricing).
- `--wx-gradient-button` — primary button mặc định.
- `--wx-gradient-accent` — divider sáng, badge nổi.
- `--wx-gradient-text` — text gradient cho heading hero.
- `--wx-gradient-divider` — divider mềm.
- `--wx-gradient-success/danger/warning` — KPI card status.

quy tắc gradient:
- chỉ 1 element gradient lớn / màn hình. tránh "rainbow soup".
- gradient text bắt buộc fallback `color` để screen reader & contrast OK.
- dark mode: gradient giảm saturation 10–15%, giữ hue.

### 1.3 radius — bo góc bắt buộc

mọi component **phải** có bo góc. bảng dưới đây là **default cứng**, không tự ý đổi.

| token | value | component / use |
|-------|-------|-----------------|
| `--wx-radius-none`  | 0      | divider line, full-bleed image |
| `--wx-radius-sm`    | 4px    | tag inline, code chip nhỏ, checkbox/radio inner |
| `--wx-radius-md`    | 8px    | **button (mặc định)**, input, select, dropdown menu, tooltip, toast |
| `--wx-radius-lg`    | 12px   | **card (mặc định)**, group box, panel, segmented tab, list item, avatar (vuông) |
| `--wx-radius-xl`    | 16px   | **modal, drawer, sheet**, large card, hero block |
| `--wx-radius-2xl`   | 24px   | feature card, plan card pricing, illustration container |
| `--wx-radius-3xl`   | 30px   | banner CTA cao cấp, pill button cỡ XL |
| `--wx-radius-4xl`   | 32px   | onboarding step container |
| `--wx-radius-full`  | 9999px | **avatar, badge dot, chip, pill button, status dot, switch knob** |

ràng buộc:
- không bao giờ `border-radius: 0` cho card, button, input, modal, dropdown.
- icon-only button vuông → vẫn `--wx-radius-md` (8px), **không** vuông cứng.
- nested element luôn có radius nhỏ hơn parent ≥ 4px (avoid "donut hole").

### 1.4 spacing — 4pt grid

```
--wx-space-0:  0
--wx-space-1:  4px
--wx-space-2:  8px
--wx-space-3:  12px
--wx-space-4:  16px
--wx-space-5:  24px
--wx-space-6:  32px
--wx-space-7:  40px
--wx-space-8:  48px
--wx-space-9:  64px
--wx-space-10: 80px
--wx-space-11: 96px
--wx-space-12: 128px
```

mọi padding / gap / margin **phải** là bội số của 4. density mode (`--wx-density-*`) chỉ đè kích thước hàng/ô/font/icon — **không** đè spacing scale + radius.

### 1.5 elevation — shadow → use case

| token | use case |
|-------|---------|
| `--wx-shadow-sm`    | input focused, divider raised |
| `--wx-shadow-md`    | card mặc định, list row raised |
| `--wx-shadow-lg`    | dropdown, popover, hover card |
| `--wx-shadow-xl`    | modal, drawer |
| `--wx-shadow-2xl`   | tooltip elevated, command palette |
| `--wx-shadow-brand` | primary CTA hover, soft focus glow |
| `--wx-shadow-focus` | focus ring fallback (kết hợp với outline) |

### 1.6 motion

```
--wx-d-instant:    0ms     /* prefers-reduced-motion */
--wx-d-micro:      100ms   /* hover, focus ring */
--wx-d-fast:       150ms   /* small swap, badge */
--wx-d-normal:     250ms   /* modal, drawer, dropdown */
--wx-d-slow:       400ms   /* page transition */
--wx-d-decorative: 700ms   /* hero, illustration */

--wx-ease-standard:   cubic-bezier(.4, 0, .2, 1)
--wx-ease-decelerate: cubic-bezier(0, 0, .2, 1)
--wx-ease-accelerate: cubic-bezier(.4, 0, 1, 1)
--wx-ease-bounce:     cubic-bezier(.16, 1, .3, 1)
--wx-ease-spring:     cubic-bezier(.34, 1.56, .64, 1)
```

`@media (prefers-reduced-motion: reduce)` → mọi `--wx-d-*` về `instant`.

### 1.7 dark mode

- 3 mode: `system` (mặc định) / `light` / `dark`. composable `useTheme()` đã có — bổ sung lựa chọn `system`.
- toggle qua `data-theme` trên `<html>`.
- mọi token có 2 set; gradient giữ hue, hạ saturation 10–15% trong dark.

---

## phần II — defaults (mặc định bắt buộc)

mọi component **phải** có default rõ ràng. dev viết `<BaseButton>...</BaseButton>` (không prop) đã render đúng.

### 2.1 form & input

| component | prop | default |
|-----------|------|---------|
| BaseButton  | `variant` | `'primary'` |
|             | `size`    | `'md'` (40px height) |
|             | `type`    | `'button'` |
|             | `loading` | `false` |
|             | `disabled`| `false` |
|             | `block`   | `false` |
|             | `radius`  | `'md'` (8px) |
| BaseInput   | `type`    | `'text'` |
|             | `size`    | `'md'` (36px height) |
|             | `autocomplete` | `'off'` |
|             | `clearable`| `false` |
|             | `radius`  | `'md'` |
| BaseSelect  | `size`    | `'md'` |
|             | `searchable` | `false` |
|             | `multi`   | `false` |
|             | `placement`| `'bottom-start'` |
| BaseCheckbox | `size`   | `'md'` (16px box) |
|             | `indeterminate` | `false` |
| BaseRadio   | `size`    | `'md'` (16px) |
| BaseToggle  | `size`    | `'md'` (24px height) |
|             | `loading` | `false` |
| BaseTextarea | `rows`   | `3` |
|             | `autosize`| `true` |
|             | `maxlength` | `null` |
| FormField   | `labelPlacement` | `'top'` |
|             | `required`| `false` |
|             | `showError`| `'on-blur'` |

### 2.2 overlay

| component | prop | default |
|-----------|------|---------|
| BaseModal   | `size`    | `'md'` (520px) |
|             | `closable`| `true` |
|             | `closeOnBackdrop` | `true` |
|             | `closeOnEsc` | `true` |
|             | `radius`  | `'xl'` (16px) |
|             | `centered`| `true` |
| BaseDrawer  | `placement` | `'right'` |
|             | `size`    | `'md'` (400px) |
|             | `closable`| `true` |
|             | `closeOnBackdrop` | `true` |
| BaseToast   | `position`| `'top-right'` |
|             | `duration`| `3000` (ms) |
|             | `closable`| `true` |
|             | `radius`  | `'md'` |
| BaseTooltip | `placement` | `'top'` |
|             | `delay`   | `300` (ms) |
|             | `radius`  | `'md'` |
| BaseDropdown | `placement` | `'bottom-start'` |
|             | `trigger` | `'click'` |
|             | `radius`  | `'md'` |
| BasePopover | `placement` | `'bottom'` |
|             | `radius`  | `'lg'` |
| ContextMenu | `radius`  | `'md'` |
| BottomSheet | `snapPoints` | `[0.4, 0.9]` |
|             | `radius`  | `'xl'` (16px top) |

### 2.3 navigation & display

| component | prop | default |
|-----------|------|---------|
| BaseTabs    | `variant` | `'underline'` |
|             | `size`    | `'md'` |
|             | `align`   | `'start'` |
| BaseBadge   | `variant` | `'neutral'` |
|             | `size`    | `'md'` |
|             | `radius`  | `'full'` (pill) |
|             | `dot`     | `false` |
|             | `pulsing` | `false` |
| BaseAvatar  | `size`    | `'md'` (32px) |
|             | `shape`   | `'circle'` (`--wx-radius-full`) |
|             | `status`  | `null` |
| BaseProgress | `value`  | `0` |
|             | `indeterminate` | `false` |
|             | `size`    | `'md'` (8px height) |
|             | `radius`  | `'full'` |
| BaseSkeleton | `variant`| `'text'` |
|             | `radius`  | `'md'` (text) / `'full'` (avatar) / `'lg'` (card) |
|             | `animation`| `'shimmer'` |
| BaseAccordion | `multi` | `false` |
|             | `defaultOpen` | `[]` |
| BaseBreadcrumb | `separator` | `'/'` |
| BasePagination | `pageSize` | `20` |
|             | `siblings`| `1` |

### 2.4 layout & data

| component | prop | default |
|-----------|------|---------|
| AppTopbar   | `height`  | `56px` (theo density) |
|             | `sticky`  | `true` |
| Sidebar     | `width`   | `240px` (collapsed `64px`) |
|             | `collapsible` | `true` |
|             | `defaultCollapsed` | `false` (auto trên mobile) |
| PageHeader  | `sticky`  | `false` |
|             | `back`    | `false` |
| GroupBox    | `radius`  | `'lg'` (12px) |
|             | `padded`  | `true` |
| Card        | `radius`  | `'lg'` |
|             | `shadow`  | `'md'` |
|             | `padded`  | `true` |
| BaseDataGrid | `density`| `'md'` |
|             | `virtual` | `'auto'` (rows > 100) |
|             | `selectable` | `false` |
|             | `resizable` | `true` |
|             | `pinnable`| `false` |
|             | `reorderable` | `false` |
|             | `inlineEdit` | `false` |
|             | `rowHeight`| `40` |
|             | `striped` | `false` |
|             | `bordered`| `true` |
| DataGridPro | kế thừa `BaseDataGrid` + `pinnable: true`, `reorderable: true`, `savedViews: []` |
| FilterBuilder | `maxDepth` | `3` |
|             | `defaultGroupOp` | `'AND'` |
| LogViewer   | `follow`  | `true` |
|             | `levels`  | `['info','warn','error','debug']` |
|             | `maxRows` | `10000` (rolling) |

### 2.5 quy tắc default tổng

1. component không prop → render được, không lỗi, không warning.
2. `radius` luôn có default trong bảng trên — không phụ thuộc CSS bên ngoài.
3. `size = 'md'` ở mọi nơi.
4. `variant = 'primary'` cho action chính, `'neutral'` cho passive.
5. `placement = 'bottom-start'` cho dropdown, `'top'` cho tooltip.
6. duration auto-dismiss = `3000ms`.
7. virtual scroll bật **auto** khi rows > 100 (không cần dev khai báo).

---

## phần III — component anatomy & states

### 3.1 anatomy (parts)

mỗi base component expose `data-part` để CSS hook chính xác:

```
Button:    root → leadingIcon → label → trailingIcon → spinner
Input:     root → prefix → control → clear → suffix
Card:      root → header(title, subtitle, actions) → body → footer
Modal:     backdrop → root → header(title, close) → body → footer
Drawer:    backdrop → root → handle → header → body → footer
DataGrid:  root → toolbar → headerRow(headerCell) → body(row(cell)) → footer
FormField: root → label → control → hint → error
Toast:     root → icon → content(title, body) → action → close
Menu:      root → group → item(icon, label, shortcut, chevron) → separator
Tabs:      root → tablist → tab → indicator → panel
```

### 3.2 variant matrix

3 trục qua data attrs:

```
data-size:   sm | md | lg
data-intent: default | primary | success | warning | danger | ghost | cta
data-state:  default | hover | active | focus | disabled | loading | readonly | invalid | selected
```

CSS chọn theo attr — không class soup, không inline style.

### 3.3 6 trạng thái chuẩn (state catalog)

mọi page/component **bắt buộc** xử lý 6 state:

| state | quy tắc |
|-------|---------|
| **loading**   | skeleton hiện sau 200ms (tránh flicker), tối đa 8s → fallback error. shape khớp content thật. |
| **empty**     | 3 biến thể: zero (lần đầu) / filtered (sau bộ lọc) / search (sau tìm kiếm). luôn có CTA chính. |
| **error**     | inline (field) / toast (tạm thời) / banner (dai dẳng) / full-page (5xx, 403). thông báo nói **chuyện gì** + **làm sao tiếp**. |
| **success**   | toast 3s. inline "đã lưu lúc 12:34" cho auto-save. confetti chỉ cho milestone thật. |
| **disabled vs readonly** | disabled: opacity .5, cursor not-allowed, không nhận event. readonly: giữ màu, không edit, vẫn copy/select. |
| **optimistic**| update local trước → call API → rollback nếu lỗi. UI cue: viền pulse `--wx-brand-focus` 1s + badge "đang lưu". |

### 3.4 quy ước thị giác cho state

| state | hover | active | focus-visible | disabled | invalid |
|-------|-------|--------|---------------|----------|---------|
| transform | `translateY(-1px)` | `scale(.98)` | — | none | none |
| shadow    | shadow level +1 | base | `--wx-shadow-focus` | none | none |
| color     | bg `--wx-hover-bg` | bg `--wx-active-bg` | ring `--wx-border-focus` 2px offset 2px | opacity .5 | border `--wx-status-danger-border` |

duration: hover 100ms, active 100ms, focus instant. tất cả `cubic-bezier(.4,0,.2,1)`.

---

## phần IV — page templates catalog

13 nhóm, ~120 page. mọi page tuân quy ước phần I–III.

### 4.1 authentication & onboarding (10)
1. đăng nhập (login) — split panel: gradient `--wx-gradient-bg` trái + form phải.
2. đăng nhập v2 — hero illustration + form.
3. đăng ký (register) — 3 bước: account → profile → finish.
4. quên mật khẩu — gửi email link.
5. đặt lại mật khẩu — strength meter qua `BaseProgress`.
6. xác thực OTP / 2FA — 6 ô, đếm ngược gửi lại.
7. xác thực email — pending / verified / error.
8. khoá màn hình (lock screen) — avatar + ô mật khẩu.
9. onboarding wizard — chào → workspace → mời → theme → hoàn tất.
10. chọn workspace / tổ chức — grid card.

### 4.2 dashboard (10)
1. tổng quan (overview) — 4 KPI gradient + chart đường + donut + recent activity.
2. analytics — traffic, page views, bounce, funnel, heatmap.
3. e-commerce — doanh thu, đơn, tồn kho, top sản phẩm.
4. CRM — pipeline, deals theo stage, leads.
5. project — timeline, tasks, sprint burndown.
6. finance — số dư, dòng tiền, giao dịch.
7. SaaS / billing — MRR, ARR, churn.
8. logistics — bản đồ giao hàng, hiệu suất kho.
9. helpdesk — ticket, SLA, agent performance.
10. IoT / monitoring — metrics realtime, sparkline, alert feed.

### 4.3 layout shells (10)
1. sidebar trái cố định (default desktop).
2. sidebar mini icon-only (64px).
3. top-nav (không sidebar, cho landing/profile public).
4. sidebar + sub-sidebar 3 cột (mailbox, file manager).
5. shell mobile — bottom tab 5 mục + drawer.
6. shell desktop wrapper — titlebar drag + window controls.
7. boxed (max 1200px, gradient bg).
8. fullscreen (kiosk, presentation).
9. split-pane resizable (master-detail).
10. dark-first.

### 4.4 UI elements showcase (20)
typography · colors & gradients · iconography · buttons · badges & chips · avatars · progress & loaders · timeline · tabs · tooltip & popover · dropdown / menu · context menu · accordion · breadcrumb · pagination · empty state · command palette (cmd+k) · callout / alert · divider · ribbons & tags.

### 4.5 form templates (10)
basic · advanced (date/time/range/color/file) · validation · multi-step wizard · filter / search · payment · entity create-edit (2 cột + sticky action) · survey / quiz · settings inline · rich text editor.

### 4.6 data display (12)
table simple · data grid pro · expandable row · inline edit · row action · tree table · grid card view (toggle) · kanban · list group · gallery · timeline / activity feed · comparison (pricing).

### 4.7 trang ứng dụng (20)
hồ sơ · chỉnh sửa hồ sơ · cài đặt · tổ chức · mailbox · chat · invoice · calendar · pricing · FAQ / help · trung tâm thông báo · tìm kiếm kết quả · chi tiết sản phẩm · chi tiết đơn hàng · file manager · wiki / docs · learning · map view · API key · audit log.

### 4.8 landing & marketing (10)
landing SaaS · landing developer/API · feature page · about · blog list · blog post · careers · changelog · contact · policy.

### 4.9 error & utility (7)
404 · 500 · 403 · 503 maintenance · offline · under construction · welcome / coming soon.

### 4.10 ứng dụng đặc thù WemakeUI (10)
admin overview · accounts · campaign · contacts · sessions · plugin manager · console / log viewer · scheduler · integrations · automation canvas (node-based).

### 4.11 mobile shell (7)
tab home · master-detail · settings mobile · notification · bottom-sheet · onboarding swipe · scanner / camera.

### 4.12 desktop wrapper (6)
titlebar custom · sidebar collapsible · tray / mini window · command palette desktop · multi-tab strip · auto-update modal.

### 4.13 advanced UX surfaces (mới)
DataGridPro showcase · FilterBuilder showcase · LogViewer streaming demo · JobCard timeline · DevPanel demo · Permission gate demo.

---

## phần V — advanced UX patterns

### 5.1 DataGridPro

mở rộng `BaseDataGrid`. feature đầy đủ:

| feature | UX |
|---------|----|
| column resize | handle 4px cạnh phải header. double-click auto-fit. |
| column pin | menu cột → pin left/right. sticky + shadow nhẹ phía cạnh. |
| column reorder | drag header, ghost 80% opacity, drop indicator gradient `--wx-gradient-accent`. |
| multi-select | checkbox column. shift-click range. ctrl/cmd-click toggle. select-all-page vs select-all. |
| bulk action bar | floating bottom center. action chính + dropdown "thêm…". slide-up 200ms. |
| inline edit | dblclick. enter lưu, esc huỷ, tab next. validation inline. optimistic. |
| virtual scroll | auto bật khi rows > 100. row height fixed (40/48/56) hoặc measured. |
| saved views | snapshot `{filters, sort, columns, density, pinned}` → tên + icon. URL `?view=:id`. |
| density | sm/md/lg toggle. áp `--wx-density-*`. |
| export | csv / xlsx / json từ toolbar. |

API:
```vue
<DataGridPro
  :columns="cols"
  :rows="rows"
  v-model:selected="selectedIds"
  v-model:view="currentView"
  :virtual="rows.length > 100"
  resizable pinnable reorderable
  inline-edit
  :saved-views="views"
  :bulk-actions="bulkActions"
  @save-view="onSaveView"
  @cell-edit="onCellEdit"
/>
```

### 5.2 FilterBuilder (AND/OR)

UI: nested group lồng nhau, max depth 3.

```
[ AND ] ┌──────────────────────────────────┐
        │ status   [in]   [active, pending] │
        │ ───────────────────────────────  │
        │ [ OR ] ┌──────────────────────┐  │
        │        │ amount  [>]   100     │  │
        │        │ tier    [=]   gold    │  │
        │        └──────────────────────┘  │
        └──────────────────────────────────┘
                                  [+ điều kiện] [+ nhóm]
```

operator theo data type:
- text: contains, equals, starts with, regex.
- number: =, !=, >, <, between.
- date: is, before, after, between, last n days.
- enum: in, not in.
- bool: is true, is false.

shape:
```ts
type Rule  = { field: string; op: string; value: any }
type Group = { op: 'AND' | 'OR'; rules: (Rule | Group)[] }
```

URL serialize JSON base64, share qua link. presets lưu tên + icon, hiện ở chip strip.

### 5.3 LogViewer

```
┌─ toolbar ────────────────────────────────────────┐
│ [🔍 search] [level ▾] [time ▾] [▶ follow] [⬇]    │
├──────────────────────────────────────────────────┤
│ 12:34:56  INFO   server started on :3000          │
│ 12:34:57  WARN   slow query (1.2s)                │
│ 12:34:58  ERROR  connection refused               │
│           ▼ stack trace…                          │
└──────────────────────────────────────────────────┘
```

- virtual list, mono font, color theo level.
- expand multi-line on click.
- search highlight `<mark>` bg `--wx-warning-bg`.
- streaming: append từ ws. user ở bottom → auto-scroll. user scroll up → badge "có {n} log mới" jump-to-bottom.
- pause/resume, download `.log` filtered.

### 5.4 realtime & async

#### job lifecycle (5 trạng thái)

| state | color | icon | mô tả |
|-------|-------|------|-------|
| queued    | neutral | clock     | đang chờ slot |
| running   | info    | spinner   | đang xử lý |
| success   | success | check     | hoàn tất |
| failed    | danger  | x         | lỗi |
| canceled  | muted   | dash      | dừng thủ công |

`<JobCard :job>` hiển thị name, eta, elapsed, % progress, last-message, action (retry/cancel/view-logs).

#### retry / cancel / rollback
- retry: nút primary. dropdown "thử lại từ bước cuối thất bại".
- cancel: confirm dialog cho job >5s. chưa start → cancel im lặng.
- rollback: nút secondary + impact preview ("sẽ huỷ 12 thay đổi").

#### live updates
- `useLiveQuery(channel)` reactive ref + auto-reconnect.
- polling fallback: `useInterval(fn, 5000)` exponential backoff (5→10→20→max 60s) khi lỗi.
- `<LiveBadge>` chấm xanh "đang theo dõi" + last-update timestamp.
- conflict: `<ConflictBanner>` "có cập nhật mới từ {user}, [xem & merge] / [bỏ qua]". **không** auto-overwrite input.

#### progress chuẩn
| loại | dùng khi | component |
|------|---------|-----------|
| determinate | biết % | `<BaseProgress :value>` |
| indeterminate | không biết, ngắn (<10s) | `<BaseProgress indeterminate>` |
| segmented | multi-step | `<StepProgress :steps :current>` |
| circular | inline button | `<Spinner>` |

rule: progress hiện sau 200ms, tối thiểu hiện 300ms (tránh flicker), >30s không cập nhật → "có vẻ chậm, [huỷ?]".

### 5.5 accessibility (a11y)

#### keyboard
- tab order logic, **không** `tabindex > 0`.
- shortcut chuẩn: `?` help, `/` search, `cmd/ctrl+k` palette, `esc` đóng overlay.
- modal: focus trap, esc đóng, restore focus về trigger.
- menu: ↑↓, home/end, enter/space, esc, type-ahead.
- data grid: ↑↓←→ chuyển cell, enter edit, esc huỷ, space chọn row.

#### focus
- ring 2px outset, color `--wx-border-focus`, offset 2px.
- chỉ qua `:focus-visible` (mouse click không hiện).
- không bao giờ `outline: none` thuần.

#### ARIA
| thành phần | role / attr |
|-----------|-------------|
| icon-only button | `aria-label` |
| modal | `role="dialog" aria-modal aria-labelledby` |
| toast | `role="status"` (info/success), `role="alert"` (error) |
| tab | `role="tablist|tab|tabpanel"` + `aria-selected` |
| menu | `role="menu|menuitem"` |
| field invalid | `aria-invalid + aria-describedby` |
| live update | container `aria-live="polite"` |

#### contrast
- body text ≥ 4.5:1.
- large text (≥18pt hoặc ≥14pt bold) ≥ 3:1.
- non-text UI ≥ 3:1.
- gradient text → fallback `color`.

### 5.6 permission & RBAC

#### role
5 vai trò: `owner` > `admin` > `member` > `viewer` > `guest`.
permission dạng `resource.action`: `team.invite`, `invoice.create`, `billing.manage`, `settings.edit`…

```ts
const { can } = useCan()
can('invoice.create')        // boolean
```
```vue
<BaseButton v-can="'team.invite'">mời thành viên</BaseButton>
<CanShow do="billing.manage"><BillingPanel /></CanShow>
```

#### hidden vs disabled
| trường hợp | xử lý |
|-----------|-------|
| permission thiếu (viewer xem trang admin) | **hidden** |
| capability thiếu (free plan, feature pro) | **disabled + tooltip "nâng cấp để dùng"** |
| feature flag tắt | **hidden** trừ user có flag |

#### feature flag
```ts
useFlag('beta-canvas')       // boolean | variant
```
```vue
<div v-flag="'beta-canvas'">
  <BaseBadge text="beta" variant="info" />
  ...
</div>
```

#### unauthorized
- full page 403.
- inline empty: `<EmptyState icon="lock" title="bạn không có quyền xem mục này" cta-label="yêu cầu quyền" />`.

### 5.7 cross-platform

| nền tảng | khác biệt |
|---------|-----------|
| desktop wrapper | titlebar drag region, traffic lights (mac) / window controls (win), native menu bridge, file dialog native, modifier `cmd` vs `ctrl` qua `useShortcut('mod+k')`. |
| mobile | touch target ≥44px, không hover (dùng `:active` + ripple), swipe gestures, safe-area `env(safe-area-inset-*)`, bottom sheet thay dropdown khi mobile. |
| web | vue-router back, deep link URL state, copy share link. |
| hover↔touch | `useHoverable()` `matchMedia('(hover: hover)')`. tooltip → long-press popover trên touch. menu hover-only (kebab) → luôn visible touch. |
| offline | `useOnline()` + banner top "không có kết nối, dùng cache". mutation queue IndexedDB, sync khi online. cache stale-while-revalidate. |

### 5.8 observability & debug

- **metrics widget** — KPI cpu/mem/req/err realtime sparkline 60s rolling.
- **error tracking** — list group by hash, filter env/release, drawer chi tiết stack/breadcrumb/user/request.
- **audit log** — filter actor/action/resource/time/IP, diff viewer JSON before/after, export CSV.
- **DevPanel** — toggle `shift+ctrl+d`, tab state (pinia)/network/perf/flags. dev build only.

### 5.9 performance

| chủ đề | quy tắc |
|--------|--------|
| virtualization | rows >100 list, rows >100 grid hoặc cols >30, items >200 grid card, log viewer luôn virtual. |
| lazy load | route `defineAsyncComponent` + `Suspense`. widget nặng (chart/editor/map/canvas) lazy. ảnh `loading="lazy"` + IO. |
| caching | TanStack/vue-query staleTime 30s, cacheTime 5m. LRU 50 entry cho computed expensive. service worker cho asset shell. prefetch route khi hover ≥150ms. |
| skeleton | delay show 200ms, max show 8s → error. match exact dimensions tránh CLS. |
| bundle | route đầu (login, dashboard) ≤200KB gzip JS. lazy thêm ≤80KB. font Inter subset latin+latin-ext ≤60KB. CI fail nếu vượt. |

---

## phần VI — file structure đề xuất

```
frontend/src/
├── ui-system/
│   ├── tokens/
│   │   ├── colors.ts            # existing
│   │   ├── gradients.ts         # existing
│   │   ├── semantic.ts          # existing — bổ sung alias content/bg
│   │   ├── theme.ts             # existing
│   │   ├── scales.ts            # existing
│   │   ├── spacing.ts           # NEW — 4pt
│   │   ├── typography.ts        # NEW — fs/lh/fw/tracking
│   │   ├── motion.ts            # NEW — duration/easing
│   │   ├── radius.ts            # NEW — bảng radius → component
│   │   ├── elevation.ts         # NEW — shadow → use case
│   │   └── index.ts
│   ├── foundations/
│   │   ├── tokens.css           # existing — bổ sung --wx-space-* / fs / d / radius alias
│   │   ├── dark-mode.css        # existing
│   │   ├── interactive.css      # existing
│   │   ├── layout.css           # existing
│   │   ├── loading.css          # existing
│   │   ├── responsive.css       # existing
│   │   ├── surfaces.css         # existing
│   │   ├── typography.css       # existing
│   │   ├── motion.css           # NEW — transition utilities + reduced-motion
│   │   ├── focus.css            # NEW — :focus-visible 2px ring
│   │   └── index.ts
│   ├── composables/
│   │   ├── useTheme.ts          # existing — thêm system mode
│   │   ├── useCan.ts            # NEW
│   │   ├── useFlag.ts           # NEW
│   │   ├── useOnline.ts         # NEW
│   │   ├── useHoverable.ts      # NEW
│   │   ├── useFocusTrap.ts      # NEW
│   │   ├── useShortcut.ts       # NEW
│   │   ├── useLiveQuery.ts      # NEW
│   │   ├── useOptimistic.ts     # NEW
│   │   └── useSavedView.ts      # NEW
│   └── utils/
├── directives/                   # NEW
│   ├── v-can.ts
│   ├── v-flag.ts
│   └── index.ts
├── components/
│   ├── common/                   # existing primitives
│   ├── data/                     # NEW
│   │   ├── DataGridPro.vue
│   │   ├── FilterBuilder.vue
│   │   ├── FilterChips.vue
│   │   ├── SavedViewsMenu.vue
│   │   ├── BulkActionBar.vue
│   │   ├── ColumnMenu.vue
│   │   └── LogViewer.vue
│   ├── async/                    # NEW
│   │   ├── JobCard.vue
│   │   ├── JobTimeline.vue
│   │   ├── LiveBadge.vue
│   │   ├── ConflictBanner.vue
│   │   ├── RetryButton.vue
│   │   └── StepProgress.vue
│   ├── feedback/                 # NEW
│   │   ├── EmptyState.vue
│   │   ├── ErrorState.vue
│   │   ├── LoadingSkeleton.vue
│   │   ├── ShimmerBlock.vue
│   │   └── SuccessConfetti.vue
│   ├── permission/               # NEW
│   │   ├── CanShow.vue
│   │   ├── PermissionGate.vue
│   │   └── UpgradeTooltip.vue
│   ├── platform/                 # NEW
│   │   ├── TitleBar.vue
│   │   ├── WindowControls.vue
│   │   ├── OfflineBanner.vue
│   │   ├── SafeAreaContainer.vue
│   │   └── BottomSheet.vue
│   ├── debug/                    # NEW
│   │   ├── DevPanel.vue
│   │   ├── DevPanelState.vue
│   │   ├── DevPanelNetwork.vue
│   │   ├── DevPanelPerf.vue
│   │   └── DevPanelFlags.vue
│   └── layout/
│       ├── AppTopbar.vue         # existing
│       ├── PageHeader.vue        # existing
│       ├── AppSidebar.vue        # NEW
│       ├── AppShell.vue          # NEW (3 layout: sidebar / top-nav / split)
│       └── index.ts
├── views/
│   ├── auth/                     # NEW — phase 5
│   ├── dashboard/                # NEW — phase 6
│   ├── app/                      # NEW — phase 7
│   ├── error/                    # NEW — phase 5
│   └── ShowcaseView.vue          # existing
└── lib.ts                        # existing — bổ sung export
```

---

## phần VII — implementation phases

8 phase, mỗi phase độc lập có thể ship riêng. tổng ước lượng ~10–14 tuần solo dev, ~5–7 tuần đôi dev.

### quy trình review gate (bắt buộc)

> **không phase nào được skip qua phase tiếp theo nếu chưa qua gate.**

mỗi phase xong → bắt buộc:
1. ✅ `cd frontend && npm run typecheck` PASS
2. ✅ `cd frontend && npm run build:app` PASS
3. ✅ có **route demo** mới (path tự document trong checklist phase) hiển thị toàn bộ output của phase đó — chạy được qua `npm run dev`.
4. ✅ tick toàn bộ checkbox `[ ]` của phase thành `[x]` trong file này.
5. ✅ báo cáo cho user: link route demo + screenshot/mô tả ngắn → **chờ user duyệt**.
6. user nói "OK / next / phase tiếp" → mới bắt đầu phase kế.

quy ước tick:
- `[ ]` chưa làm
- `[~]` đang làm dở (in progress)
- `[x]` đã xong + đã verify build
- `[!]` blocked (kèm note)

### phase 0 — foundations (tokens & rules) ✅ DONE
**mục tiêu**: tokens.css đầy đủ, alias semantic, motion/focus base, density mode.

deliverable:
- [x] thêm `--wx-space-0..12` vào tokens.css
- [x] thêm `--wx-fs-*`, `--wx-lh-*`, `--wx-fw-*`, `--wx-tracking-*`
- [x] thêm `--wx-d-*`, `--wx-ease-*` (5+5) — `instant/micro/fast/normal/slow/decorative` + `standard/decelerate/accelerate/bounce/spring`
- [x] alias `--wx-content-*`, `--wx-bg-*` map sang raw token (cho cả light & dark)
- [x] `motion.css` (transition util + `prefers-reduced-motion` collapse → 0ms + Vue transition helpers fade/scale-fade/slide-up/slide-down/slide-right + shimmer + pulse)
- [x] `focus.css` (`:focus-visible` 2px ring offset 2px + soft variant + debug mode)
- [x] `useTheme()` đã có `system` mode sẵn
- [x] `tokens/spacing.ts`, `typographyScale.ts`, `motionScale.ts`, `radiusMap.ts`, `elevationMap.ts` + re-export qua `tokens/index.ts`
- [x] dark mode parity cho mọi alias

**demo route**: `/` (sitemap) + `/showcase/tokens` — hiển thị 8 section: brand color, 9 gradient, 9 radius, 13 space step, 13 fs scale + 4 weight, motion playground, focus ring demo, sentence case rule.

**done khi**: build PASS ✅, demo route render đúng, toggle theme system/light/dark hoạt động.

**verify**:
- ✅ `npm run typecheck` PASS
- ✅ `npm run build:app` PASS (initial bundle 105KB / gzip 41KB)
- ✅ `/showcase/tokens` route đăng ký
- ✅ `/` (sitemap) đăng ký + nav qua tất cả phase

### phase 1 — base primitives (single-element components) ✅ DONE
**mục tiêu**: 12 component đơn — đảm bảo default + radius + 6 state.

deliverable:
- [x] BaseButton (variant 7: primary/secondary/success/danger/ghost/text/cta · size 3 · loading · block) — đã có
- [x] BaseInput (size 2 · disabled · readonly · error) — đã có
- [x] BaseTextarea (autosize, invalid, readonly, disabled) — **mới** [BaseTextarea.vue](frontend/src/components/common/BaseTextarea.vue)
- [x] BaseSelect (options, label, placeholder, disabled) — đã có
- [x] BaseCheckbox (modelValue, indeterminate, disabled) — đã có
- [x] BaseRadio (group, horizontal/vertical, disabled) — đã có
- [x] BaseToggle (modelValue, disabled) — đã có
- [x] BaseBadge (6 variant, dot, pulsing) — đã có
- [x] BaseAvatar (5 size, circle/square, 4 status, ring, image/initial/icon fallback) — **mới** [BaseAvatar.vue](frontend/src/components/common/BaseAvatar.vue)
- [x] BaseAvatarGroup (stack với +N overflow) — **mới** [BaseAvatarGroup.vue](frontend/src/components/common/BaseAvatarGroup.vue)
- [x] BaseSpinner (4 size, 4 tone, ARIA role=status) — **mới** [BaseSpinner.vue](frontend/src/components/common/BaseSpinner.vue)
- [x] BaseTag (6 variant, 3 size, removable, pill/square, dot, disabled) — **mới** [BaseTag.vue](frontend/src/components/common/BaseTag.vue)
- [x] BaseProgress (4 variant, 3 size, striped/animated, label) — đã có
- [x] BaseSkeleton (rows × cols grid) — đã có
- [x] ShimmerBlock (text/block/circle, custom dim) — **mới** [ShimmerBlock.vue](frontend/src/components/common/ShimmerBlock.vue)
- [x] export tất cả qua [components/common/index.ts](frontend/src/components/common/index.ts)

**demo route**: `/showcase/primitives` — gallery 15 primitive × các state. anchor nav cố định bên phải.

**done khi**: build PASS ✅, demo render đúng.

**verify**:
- ✅ `npm run typecheck` PASS
- ✅ `npm run build:app` PASS — chunk `PrimitivesShowcase` 18.6KB / gzip 5.7KB
- ✅ initial bundle 105.5KB / gzip 41.2KB (vẫn trong budget 200KB)

### phase 2 — composite primitives (overlay & navigation) ✅ DONE
**mục tiêu**: overlay + nav components.

deliverable:
- [x] BaseModal (size 5: sm/md/lg/xl/full, focus trap, esc close) — đã có
- [x] BaseDrawer (4 placement: right/left/top/bottom · 5 size · focus trap · esc · backdrop close) — **mới** [BaseDrawer.vue](frontend/src/components/common/BaseDrawer.vue)
- [x] BaseToast + useToast queue (max 5, auto-dismiss 3s, 4 type) — đã có
- [x] BaseTooltip (4 placement, delay 300ms) — đã có
- [x] BaseDropdown (placement bottom-start/bottom-end/top-start/top-end) — đã có
- [x] BasePopover (rich content slot, 4 placement, arrow, hover/click trigger) — **mới** [BasePopover.vue](frontend/src/components/common/BasePopover.vue)
- [x] ContextMenu (right-click, sub-menu, keyboard nav) — đã có
- [x] BaseTabs (underline indicator) — đã có
- [x] BaseAccordion (single/multi, default open, bordered/flush) — **mới** [BaseAccordion.vue](frontend/src/components/common/BaseAccordion.vue)
- [x] BaseBreadcrumb (3 separator: chevron/slash/dot, icon support) — **mới** [BaseBreadcrumb.vue](frontend/src/components/common/BaseBreadcrumb.vue)
- [x] BasePagination (3 variant: full/compact/load-more, ellipsis siblings) — **mới** [BasePagination.vue](frontend/src/components/common/BasePagination.vue)
- [x] CommandPalette (cmd+k toàn cục, fuzzy match, group, ↑↓ enter esc, kbd footer) — **mới** [CommandPalette.vue](frontend/src/components/common/CommandPalette.vue)
- [x] export tất cả qua [components/common/index.ts](frontend/src/components/common/index.ts)

**demo route**: `/showcase/overlay` + `/showcase/nav` — đầy đủ.

**done khi**: build PASS ✅, demo render đúng, focus trap + esc test PASS.

**verify**:
- ✅ `npm run typecheck` PASS
- ✅ `npm run build:app` PASS
- chunk `OverlayShowcase` 13.2KB / gzip 4.4KB
- chunk `NavShowcase` 16.8KB / gzip 5.6KB
- initial 107.6KB / gzip 41.8KB (vẫn trong budget 200KB)

### phase 3 — form & layout shells ✅ DONE
**mục tiêu**: form composition + shell trang.

deliverable:
- [x] FormField — refactor: hint + error + required + optional marker, ARIA aria-invalid + aria-describedby, vertical/horizontal/dense, backward-compat `layout`/`helpText`/`vertical` [FormField.vue](frontend/src/components/common/FormField.vue)
- [x] GroupBox — bỏ UPPERCASE header (anti-pattern), dùng sentence case + token spacing [GroupBox.vue](frontend/src/components/common/GroupBox.vue)
- [x] BaseCard — header/body/footer/actions slot · 4 radius · 5 shadow · hoverable · clickable · selected · loading skeleton — **mới** [BaseCard.vue](frontend/src/components/common/BaseCard.vue)
- [x] BasePanel — flat sectioning, 3 tone (default/sunken/subtle), collapsible v-model, footer slot — **mới** [BasePanel.vue](frontend/src/components/common/BasePanel.vue)
- [x] AppShell (3 variant: sidebar / top-nav / split-pane) — split có resize handle drag + ←/→/Home/End — **mới** [AppShell.vue](frontend/src/components/layout/AppShell.vue)
- [x] AppSidebar — sections + items + sub-items 1 level, collapsible 240↔64px, auto collapse mobile ≤768px, badge + shortcut + icon + active state — **mới** [AppSidebar.vue](frontend/src/components/layout/AppSidebar.vue)
- [x] AppTopbar — đã có (giữ nguyên cho phase 3, breadcrumb/action slot có sẵn)
- [x] PageHeader — refactor: thêm `back` button + `breadcrumb` slot + `sticky` mode + size sm/md/lg + sentence case [PageHeader.vue](frontend/src/components/layout/PageHeader.vue)
- [x] BottomSheet (mobile) — snap points [0.4, 0.9], drag handle, swipe-to-close, ESC, backdrop click, safe-area-inset-bottom — **mới** [BottomSheet.vue](frontend/src/components/platform/BottomSheet.vue)
- [x] SafeAreaContainer — `env(safe-area-inset-*)`, `edges` prop (all/top/bottom/horizontal/vertical/array) — **mới** [SafeAreaContainer.vue](frontend/src/components/platform/SafeAreaContainer.vue)
- [x] export tất cả qua [common/index.ts](frontend/src/components/common/index.ts) + [layout/index.ts](frontend/src/components/layout/index.ts) + [platform/index.ts](frontend/src/components/platform/index.ts) (types `SidebarItem` / `SidebarSection` qua `sidebar-types.ts`)

**demo route**: `/showcase/shell/sidebar` + `/showcase/shell/topnav` + `/showcase/shell/split`.

**done khi**: build PASS, 3 shell render đúng web/mobile/desktop, sidebar collapse animate 250ms.

**verify**:
- ✅ `npm run typecheck` PASS
- ✅ `npm run build:app` PASS — chunks: `SidebarShellShowcase` 17.72KB / gzip 5.54KB, `TopNavShellShowcase` 7.43KB / gzip 2.97KB, `SplitShellShowcase` 14.66KB / gzip 5.41KB, `AppSidebar` 8.40KB / gzip 2.74KB
- ✅ initial bundle 113.14KB / gzip 42.63KB (vẫn trong budget 200KB)
- ✅ 3 route phase 3 đăng ký + sitemap cập nhật `done`

### phase 4 — data display + advanced UX
**mục tiêu**: BaseDataGrid → DataGridPro, FilterBuilder, LogViewer.

deliverable:
- [~] BaseDataGrid (sort, basic filter, pagination) — sort + virtual + resize đã có sẵn; pagination/basic-filter làm ở lớp demo, chưa nội tuyến vào component
- [x] DataGridPro (resize, pin, reorder, multi-select, inline-edit, virtual, saved-views, export)
- [x] BulkActionBar
- [x] FilterBuilder + FilterChips (URL serialize base64 url-safe)
- [x] LogViewer (streaming, level filter, search highlight, follow toggle, virtual scroll, download)
- [x] Kanban (drag-drop column + card, HTML5 native)
- [~] Calendar (month/week/day/agenda) — đã làm month + agenda, week + day để dành về sau
- [x] Timeline / activity feed (group by day)
- [x] Gallery / media grid (CSS columns masonry + lightbox keyboard nav)

**demo route**: `/showcase/data` (index) + `/showcase/data/grid` + `/showcase/data/filter` + `/showcase/data/log` + `/showcase/data/kanban` + `/showcase/data/calendar` + `/showcase/data/timeline` + `/showcase/data/gallery`.

**done khi**: build PASS, data grid 10k rows scroll mượt 60fps, filter builder serialize/deserialize URL OK.

**verify**:
- ✅ `npm run typecheck` PASS
- ✅ `npm run build:app` PASS — 200 modules, initial 110.5KB / gzip 42.2KB
- ✅ `npm run build:lib` PASS — 209KB ESM / gzip 46.7KB, 138KB CSS / gzip 21.7KB
- DataGridPro chunk gzip 4.5KB, FilterView chunk gzip 0.5KB, LogView 0.4KB
- DataGrid 10k rows: virtual scroll bật auto khi rows > 100, row height 40px → DOM chỉ có ~25 dòng tại 1 thời điểm
- FilterBuilder URL: `?f=eyJvcCI6IkFORCIsInJ1bGVzIj...` decode/encode round-trip OK qua `serializeFilter`/`deserializeFilter`
- BaseBadge bổ sung variant `'neutral'` (spec phần II.3) + prop `size` để fix typecheck phase 3

### phase 5 — feedback / async / permission / platform ✅ DONE
**mục tiêu**: state primitives + async + RBAC + cross-platform adapter.

deliverable:
- [x] EmptyState (3 biến thể: zero / filtered / search) — [EmptyState.vue](frontend/src/components/feedback/EmptyState.vue)
- [x] ErrorState (4 surface: inline / banner / fullpage + intent danger/warning, mã code mono) — [ErrorState.vue](frontend/src/components/feedback/ErrorState.vue)
- [x] JobCard (5 lifecycle queued/running/success/failed/canceled) + JobTimeline (group theo ngày) — [JobCard.vue](frontend/src/components/async/JobCard.vue) · [JobTimeline.vue](frontend/src/components/async/JobTimeline.vue)
- [x] LiveBadge (5 status + pulse/blink) + ConflictBanner (no auto-overwrite) + RetryButton (primary + dropdown options) + StepProgress (horizontal + vertical, 4 status pending/active/done/error)
- [x] CanShow + PermissionGate (RBAC + capability + 3 mode hide/disable/fallback) + UpgradeTooltip (4 placement) — [permission/](frontend/src/components/permission/)
- [x] useCan + v-can directive (`.disable` / `:any` / `:all` modifier) — [useCan.ts](frontend/src/composables/useCan.ts) · [v-can.ts](frontend/src/directives/v-can.ts)
- [x] useFlag + v-flag directive (`.disable` / `:variant`) — [useFlag.ts](frontend/src/composables/useFlag.ts) · [v-flag.ts](frontend/src/directives/v-flag.ts)
- [x] useOnline + OfflineBanner + mutation queue (localStorage backup, sequential flush, exponential backoff)
- [x] useHoverable + useShortcut (auto map `mod` → `cmd`/`ctrl`) + useFocusTrap + useLiveQuery (ws + polling fallback backoff 5→60s) + useOptimistic (rollback chính xác cho concurrent mutation)
- [x] TitleBar + WindowControls (mac traffic lights + windows controls, auto-detect Wails/Tauri/Electron qua `window.runtime` / `window.__TAURI__` / `process.versions.electron`)

**demo route**: `/showcase/async` + `/showcase/permission` + `/showcase/platform`.

**done khi**: build PASS ✅, job lifecycle 5 trạng thái render ✅, offline → online sync queue OK ✅, RBAC hide/disable đúng ✅.

**verify**:
- ✅ `npm run typecheck` PASS
- ✅ `npm run build:app` PASS — initial bundle 114.39KB / gzip 42.85KB (trong budget 200KB)
- ✅ chunk `AsyncShowcase` 23.19KB / gzip 7.65KB
- ✅ chunk `PermissionShowcase` 12.47KB / gzip 4.29KB
- ✅ chunk `PlatformShowcase` 15.95KB / gzip 5.99KB
- ✅ exports wire: `lib.ts` thêm `feedback/`, `async/`, `permission/`, directives `vCan/vFlag/registerDirectives`
- ✅ sitemap `/` cập nhật phase 5 status `done` với 3 route demo

### phase 6 — page templates: auth + error + dashboard ✅ DONE
**mục tiêu**: 27 trang đầu tiên — đủ cho 1 SaaS demo end-to-end.

shared layouts (3):
- [x] [AuthLayout.vue](frontend/src/views/_layouts/AuthLayout.vue) — split panel gradient/brand/dark + form right, no-aside option, footer slot
- [x] [ErrorLayout.vue](frontend/src/views/_layouts/ErrorLayout.vue) — centered + decorative blobs + code/illustration + actions + extra slot + error-id
- [x] [DashboardLayout.vue](frontend/src/views/_layouts/DashboardLayout.vue) — AppShell + AppSidebar config 10 dashboards + breadcrumb + topbar icons (search/bell/avatar)
- [x] [dashboard-widgets.ts](frontend/src/views/_layouts/dashboard-widgets.ts) — `sparkPath()` / `sparkArea()` SVG gen + 4 mock series (up/down/flat/volatile)

auth (10):
- [x] [`/auth/login`](frontend/src/views/auth/LoginView.vue) — email/pw/remember/forgot link/social Google+Microsoft
- [x] [`/auth/login-v2`](frontend/src/views/auth/LoginV2View.vue) — aside brand gradient + 3 hero card stack overlay
- [x] [`/auth/register`](frontend/src/views/auth/RegisterView.vue) — 3 bước wizard: account → profile → finish, strength meter 0-100
- [x] [`/auth/forgot`](frontend/src/views/auth/ForgotPasswordView.vue) — gửi email + sent state + retry 60s
- [x] [`/auth/reset`](frontend/src/views/auth/ResetPasswordView.vue) — strength meter + 4 checks (8 ký tự / hoa / số / đặc biệt)
- [x] [`/auth/otp`](frontend/src/views/auth/OtpView.vue) — 6 ô số auto-advance + paste + đếm ngược 60s + auto submit (demo: 123456)
- [x] [`/auth/email-verify`](frontend/src/views/auth/EmailVerifyView.vue) — 4 trạng thái pending/verified/expired/error switchable
- [x] [`/auth/lock`](frontend/src/views/auth/LockScreenView.vue) — clock realtime + avatar + ô mật khẩu (demo: demo1234)
- [x] [`/auth/onboarding`](frontend/src/views/auth/OnboardingView.vue) — 5 bước: chào → workspace → mời → theme system/light/dark → done
- [x] [`/auth/workspace`](frontend/src/views/auth/WorkspacePickerView.vue) — grid 4 workspace card với role/plan/members + search

error & utility (7):
- [x] [`/error/404`](frontend/src/views/error/NotFoundView.vue) — code gradient text + suggest links
- [x] [`/error/500`](frontend/src/views/error/ServerErrorView.vue) — service status table + retry + liên hệ hỗ trợ
- [x] [`/error/403`](frontend/src/views/error/ForbiddenView.vue) — role current vs required + path requested
- [x] [`/error/503`](frontend/src/views/error/MaintenanceView.vue) — eta + progress + checklist 5 bước
- [x] [`/error/offline`](frontend/src/views/error/OfflineView.vue) — `navigator.onLine` reactive + mutation queue + cache status
- [x] [`/error/under-construction`](frontend/src/views/error/UnderConstructionView.vue) — subscribe email khi go-live
- [x] [`/error/coming-soon`](frontend/src/views/error/ComingSoonView.vue) — countdown 14 ngày realtime + sub form + social

dashboard (10):
- [x] [`/dashboard/overview`](frontend/src/views/dashboard/OverviewView.vue) — 4 KPI sparkline + chart line + donut SVG + activity feed
- [x] [`/dashboard/analytics`](frontend/src/views/dashboard/AnalyticsView.vue) — 4 metric + traffic source + funnel chuyển đổi + heatmap 7×24
- [x] [`/dashboard/ecommerce`](frontend/src/views/dashboard/EcommerceView.vue) — 4 KPI mini-spark + bảng đơn + top sản phẩm
- [x] [`/dashboard/crm`](frontend/src/views/dashboard/CrmView.vue) — 5 stage pipeline kanban + leaderboard sales
- [x] [`/dashboard/project`](frontend/src/views/dashboard/ProjectView.vue) — sprint #18 burndown chart + task table + team online
- [x] [`/dashboard/finance`](frontend/src/views/dashboard/FinanceView.vue) — số dư hero gradient text + 3 KPI + 4 tài khoản + 6 giao dịch
- [x] [`/dashboard/saas`](frontend/src/views/dashboard/SaasView.vue) — MRR/ARR/churn/NPS + cohort retention table 5 tháng
- [x] [`/dashboard/logistics`](frontend/src/views/dashboard/LogisticsView.vue) — bản đồ VN SVG + 4 kho fill % + 5 shipment realtime
- [x] [`/dashboard/helpdesk`](frontend/src/views/dashboard/HelpdeskView.vue) — 4 KPI + ticket table + 4 agent SLA + 8 topics
- [x] [`/dashboard/iot`](frontend/src/views/dashboard/IotView.vue) — 6 sensor card auto-update mỗi 2.5s + alert feed live

routing & sitemap:
- [x] router thêm 27 route (auth × 10, error × 7, dashboard × 10) làm siblings của DemoLayout (để full-page không bị wrap sidebar showcase)
- [x] sitemap `_phases-data.ts` cập nhật phase 6 status `done` + 27 route descriptors

**demo route**: `/auth/*` (10 trang) + `/error/*` (7 trang) + `/dashboard/*` (10 trang). vào sitemap `/` → phase 6 card → click route bất kỳ.

**done khi**: build PASS ✅, mọi route render đúng, lighthouse perf ≥90 trên login + dashboard, axe zero violation.

**verify**:
- ✅ `npm run typecheck` PASS
- ✅ `npm run build:app` PASS — 437 modules transformed
- ✅ initial bundle 129.85KB / gzip 44.52KB (vẫn trong budget 200KB sau khi thêm 27 page chunks)
- ✅ chunks page nặng nhất: `OverviewView`, `AnalyticsView`, `LogisticsView` đều < 8KB / gzip < 3KB mỗi chunk (tree-shaken tốt)
- ✅ shared layout chunks: `AuthLayout` 4.09KB css, `DashboardLayout` 0.78KB css (tái dùng tốt)

### phase 7 — page templates: app + landing + WemakeUI
**mục tiêu**: 50 trang còn lại.

deliverable:
- app (20): profile, settings, mailbox, chat, invoice, calendar, pricing, FAQ, notifications, search, product, order, file manager, wiki, learning, map, API key, audit log, organization, profile-edit.
- landing (10): SaaS, dev API, feature, about, blog list/post, careers, changelog, contact, policy.
- WemakeUI (10): admin, accounts, campaign, contacts, sessions, plugins, console, scheduler, integrations, automation canvas.
- mobile shell (7) + desktop wrapper (6).

**demo route**: `/app/*` + `/landing/*` + `/wemakeui/*` + `/mobile/*` + `/desktop/*`. sitemap cập nhật.

**done khi**: build PASS, catalog 120 page render đúng theme, dark mode parity, mobile breakpoint ≤414px OK.

### phase 8 — polish, observability, performance
**mục tiêu**: chốt production.

deliverable:
- [ ] DevPanel (state/network/perf/flags)
- [ ] metrics dashboard widget
- [ ] error tracking page
- [ ] audit log diff viewer
- [ ] motion: page transition router-view fade 150ms
- [ ] DnD ghost + drop zone style + snap
- [ ] virtualization audit (mọi list >100 item)
- [ ] lazy load route + image + heavy widget
- [ ] bundle budget CI: ≤200KB initial / ≤80KB lazy / ≤60KB font
- [ ] axe a11y CI scan
- [ ] lighthouse perf CI ≥90

**demo route**: `/showcase/dev-panel` + `/showcase/observability`. cộng `npm run build:lib` PASS.

**done khi**: CI green với 4 gate (typecheck / build / axe / lighthouse / bundle).

### lộ trình ship (gợi ý theo tuần)

```
tuần 1   : phase 0 + phase 1 (1/2)
tuần 2   : phase 1 (2/2) + phase 2 (1/2)
tuần 3   : phase 2 (2/2) + phase 3 (1/2)
tuần 4   : phase 3 (2/2)
tuần 5–6 : phase 4
tuần 7   : phase 5
tuần 8–9 : phase 6
tuần 10–12: phase 7
tuần 13–14: phase 8
```

mỗi phase ship 1 tag npm: `0.1.0` (foundations) → `1.0.0` (sau phase 8).

---

## phần VIII — master checklist

### foundations
- [ ] tokens.css đầy đủ (color/gradient/space/fs/d/radius/elevation)
- [ ] semantic alias content/bg/border
- [ ] motion.css + focus.css
- [ ] dark mode parity 3 mode (system/light/dark)
- [ ] density mode không đè spacing + radius

### components — quy ước cứng
- [ ] mọi component có default rõ ràng (bảng phần II)
- [ ] mọi component có radius (bảng phần I.3)
- [ ] mọi component có 6 state (loading/empty/error/success/disabled/optimistic)
- [ ] mọi component có anatomy data-part + variant data-size/intent/state
- [ ] không UPPERCASE label/button/tab/badge
- [ ] tiếng Việt sentence case mặc định

### data UX
- [ ] DataGridPro đầy đủ feature
- [ ] FilterBuilder AND/OR + URL share
- [ ] LogViewer streaming + follow + highlight

### realtime & async
- [ ] JobCard 5 trạng thái
- [ ] retry/cancel/rollback impact preview
- [ ] LiveBadge + ConflictBanner
- [ ] useLiveQuery (ws + polling backoff)

### a11y
- [ ] focus-visible 2px ring
- [ ] focus trap modal/drawer/palette
- [ ] ARIA roles bảng phần V.5
- [ ] shortcut registry global (`?`/`/`/`cmd+k`/`esc`)
- [ ] axe scan zero violation

### permission
- [ ] useCan + v-can + CanShow
- [ ] useFlag + v-flag
- [ ] hidden vs disabled rule
- [ ] 403 page + inline unauthorized

### platform
- [ ] TitleBar + WindowControls
- [ ] useHoverable + useShortcut (mod auto-map)
- [ ] OfflineBanner + IndexedDB queue
- [ ] SafeAreaContainer + BottomSheet (mobile)

### performance
- [ ] virtual scroll guard
- [ ] route code split + prefetch hover
- [ ] image lazy + IO
- [ ] skeleton min 200ms / max 8s
- [ ] bundle budget CI

### quality gate
- [ ] `cd frontend && npm run typecheck` PASS
- [ ] `cd frontend && npm run build:app` PASS
- [ ] `cd frontend && npm run build:lib` PASS
- [ ] axe scan zero violation (login, dashboard, settings)
- [ ] lighthouse perf ≥ 90 (dashboard route)
- [ ] bundle size trong budget

---

## phụ lục — quy tắc cấm (anti-patterns)

- ❌ `text-transform: uppercase` cho UI Vietnamese.
- ❌ `border-radius: 0` cho card/button/input/modal/dropdown.
- ❌ component không có default → render gây warning.
- ❌ raw token `#2563eb` trong component (phải qua alias).
- ❌ `outline: none` mà không có ring thay thế.
- ❌ `tabindex > 0`.
- ❌ auto-overwrite input của user khi có conflict.
- ❌ skeleton hiện ngay (chưa qua delay 200ms).
- ❌ multiple gradient lớn trong 1 viewport.
- ❌ shadow đậm (`0 0 0 99px black` kiểu vậy).
- ❌ animation > 700ms cho UI thường (chỉ decorative).
- ❌ confetti / pháo bông cho action thường ngày.
- ❌ tooltip chứa thông tin **bắt buộc** (hidden trên touch).
- ❌ disabled element không có lý do (thiếu hint tại sao).
