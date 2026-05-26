# DESIGN.md — WemakeUI Design System Reference

> Dense reference for Claude Code. Read when working on components, tokens, theming, or composables.
> Do NOT read README.md — overlaps CLAUDE.md, humans only.

---

## 1. Token System — `--wx-*` prefix

All tokens are CSS variables. Source: `frontend/src/ui-system/foundations/tokens.css`. Import once at app root.

### 1.1 Color

| Group | Tokens | Notes |
|-------|--------|-------|
| **Brand scale** | `--wx-brand-50..900`, `--wx-brand-primary`(#2563eb), `--wx-brand-accent`(#06b6d4), `--wx-brand-focus`(#007bff) | Override primary/accent to re-skin whole UI |
| **Text** | `primary`(#1e293b) `secondary`(#6b7280) `muted`(#9ca3af) `disabled`(#d1d5db) `inverse`(#fff) `link`(#2563eb) | Prefix: `--wx-text-*` |
| **Surface** | `base`(#fff) `elevated`(#fff) `sunken`(#f8fafc) `overlay`(rgba 0,0,0,0.2) | Prefix: `--wx-surface-*` |
| **Border** | `default`(#e5e7eb) `subtle`(#f3f4f6) `focus`(#007bff) `glass`(rgba fff 0.5) `glass-light`(rgba fff 0.3) | Prefix: `--wx-border-*` |
| **Glass** | `heavy/medium/light/subtle` × `-bg/-blur/-border` | Prefix: `--wx-glass-*` |
| **Feedback** | `success/danger/warning/info/neutral` × `-bg/-text/-solid/-border` | Prefix: `--wx-{tone}-*` |
| **Status aliases** | `success/danger/warning/info` × `-text/-border` → points to feedback tokens | Prefix: `--wx-status-*` |
| **Interactive** | `--wx-hover-bg/text`, `--wx-selected-bg/text`, `--wx-active-bg/text`, `--wx-disabled-bg/text` | All reference brand tokens |
| **Semantic text** | `primary/secondary/muted/disabled/inverse/link` → aliases to `--wx-text-*` | Prefix: `--wx-content-*` |
| **Semantic bg** | `base/raised/sunken/overlay` → aliases to `--wx-surface-*` | Prefix: `--wx-bg-*` |

### 1.2 Gradients (`--wx-gradient-*`)

`bg` `header` `cta` `button`(brand→primary) `accent` `text` `divider` `success` `danger` `warning`

### 1.3 Spacing — 4pt grid (`--wx-space-*`)

`0`=0 · `1`=4px · `2`=8px · `3`=12px · `4`=16px · `5`=24px · `6`=32px · `7`=40px · `8`=48px · `9`=64px · `10`=80px · `11`=96px · `12`=128px

### 1.4 Typography

| Group | Tokens |
|-------|--------|
| Font families | `--wx-font-primary`(Inter) · `--wx-font-display`(Nunito) · `--wx-font-mono` |
| Font sizes | `--wx-fs-12/13/14/15/16/18/20/24/28/32/40/48/64` |
| Line heights | `--wx-lh-tight`(1.2) `snug`(1.35) `normal`(1.5) `relaxed`(1.7) |
| Font weights | `--wx-fw-regular`(400) `medium`(500) `semibold`(600) `bold`(700) |
| Letter spacing | `--wx-tracking-tight`(-0.01em) `normal`(0) `wide`(0.02em) |

### 1.5 Shape & Elevation

| Group | Tokens |
|-------|--------|
| Radius | `--wx-radius-none/sm`(4)`/md`(8)`/lg`(12)`/xl`(16)`/2xl`(24)`/3xl`(30)`/4xl`(32)`/full`(9999) |
| Shadow | `--wx-shadow-none/sm/md/lg/xl/2xl/brand/focus/lift` |
| Z-index | `--wx-z-behind`(-1) `base`(0) `raised`(10) `dropdown`(50) `sticky`(100) `header`(200) `overlay`(500) `modal`(1000) `popover`(1100) `toast`(1200) `tooltip`(1300) `topmost`(9999) |

### 1.6 Motion

| Group | Tokens |
|-------|--------|
| Duration | `--wx-d-instant`(0) `micro`(100ms) `fast`(150ms) `normal`(250ms) `slow`(400ms) `decorative`(700ms) |
| Easing | `--wx-ease-standard` `decelerate` `accelerate` `bounce` `spring` |
| Stagger | `--wx-stagger-xs`(30ms) `sm`(50ms) `md`(80ms) |

`prefers-reduced-motion` → tất cả `--wx-d-*` về 0ms tự động.

### 1.7 Density (`--wx-density-*`)

Applied via `html.wx-compact / .wx-comfortable` or `[data-wx-density="compact|comfortable"]`.

| Token | default | compact | comfortable |
|-------|---------|---------|-------------|
| `header-height` | 56px | 48px | 64px |
| `row-height` | 40px | 32px | 48px |
| `input-height` | 36px | 28px | 44px |
| `cell-px` | 12px | 8px | 16px |
| `cell-py` | 8px | 4px | 12px |
| `font-size` | 14px | 11px | 15px |
| `icon-size` | 16px | 14px | 20px |
| `avatar-size` | 32px | 24px | 40px |
| `gap` | 8px | 4px | 12px |
| `container-pad` | 16px | 12px | 24px |

---

## 2. Theme System

### Three independent axes

| Axis | Type | Values | Activation |
|------|------|--------|------------|
| Color scheme | `ColorScheme` | `'light' \| 'dark' \| 'system'` | `html.wx-dark` / `[data-wx-theme="dark"]` |
| Variant | `Variant` | `'default' \| 'flat'` | `html.wx-variant-flat` / `[data-wx-variant="flat"]` |
| Brand color | any hex | dynamic | inline `--wx-brand-*` override via JS |

Dark token overrides: `frontend/src/ui-system/foundations/dark-mode.css` (selector `.wx-dark, [data-wx-theme="dark"]`).
Flat variant overrides: `frontend/src/ui-system/foundations/flat-mode.css`.

### `useTheme()` API

```ts
const {
  colorScheme,        // Ref<ColorScheme>
  isDark,             // Ref<boolean>
  setColorScheme,     // (t: ColorScheme) => void
  toggleColorScheme,  // () => void

  variant,            // Ref<Variant>
  setVariant,         // (v: 'default'|'flat') => void

  brandColor,         // Ref<string|null>
  setBrandColor,      // (hex: string|null) => void  — re-skins entire UI
  accentColor,        // Ref<string|null>
  setAccentColor,     // (hex: string|null) => void

  resetColors,        // () => void

  // legacy aliases
  theme, setTheme, toggleTheme,
} = useTheme()
```

Persisted in `localStorage`: keys `wx-theme`, `wx-variant`, `wx-brand-color`, `wx-accent-color`.

---

## 3. CSS Naming Conventions

| Pattern | Used for |
|---------|---------|
| `wx-btn`, `wx-btn--{variant}`, `wx-btn--{size}`, `wx-btn__{element}` | BaseButton (exception — global prefix) |
| `base-{block}`, `base-{block}__{element}`, `base-{block}--{modifier}` | All other components (BEM) |
| `form-input` | Shared field style on `<input>`, `<select>`, `<textarea>` |
| `.wx-dark .base-*` | Dark mode overrides inside `<style scoped>` |
| `.app-drag` | Desktop titlebar drag region (no-op on web/mobile) |
| `[data-wx-theme]` `[data-wx-variant]` `[data-wx-density]` | HTML root data attributes |

---

## 4. Shared Prop Conventions

| Prop | Values | Used in |
|------|--------|---------|
| `variant` | `primary \| secondary \| ghost \| neutral \| danger \| success \| warning \| info` | Button, Badge, Tag, Progress, Toast… |
| `size` | `sm \| md \| lg` (Button adds `xl`, `icon`) | All sizeable components |
| `disabled` | `boolean` | All form controls + Button |
| `loading` | `boolean` | Button, FormModal, FormDrawer, JobCard… |
| `modelValue` | typed | All form controls (v-model) |
| `label` | `string` | Input, Select, Textarea, Checkbox, Radio, Toggle |
| `error` | `string` | Input, Textarea (shows message) |
| `invalid` | `boolean` | Input (error styling, no message) |
| `placement` | `top\|bottom\|left\|right` + `-start\|-end` | Dropdown, Tooltip, Popover |
| `intent` | `default \| danger \| warning` | Modal, ConfirmDialog (colored border/glow) |
| `closable` | `boolean` | Modal, Drawer (default true) |
| `closeOnBackdrop` | `boolean` | Drawer, BottomSheet (default true) |

---

## 5. Component API Reference

### 5.1 Form Controls

**`BaseInput`**
```
props:  modelValue?: string|number
        type?: 'text'|'number'|'password'|'email'|'search'|'tel'|'url'
        label?  placeholder?  error?  invalid?: boolean  success?: boolean
        disabled?  readonly?  size?: 'sm'|'md'  align?: 'left'|'center'|'right'
emits:  update:modelValue  blur  focus
notes:  type=number → default align center; password → eye toggle built-in
```

**`BaseSelect`**
```
props:  modelValue?: string|number
        options: {value: string|number, label: string, group?: string}[]
        label?  placeholder?  disabled?  size?: 'sm'|'md'
emits:  update:modelValue
```

**`BaseSelectMenu`** — custom-styled select (replaces native `<select>`)
```
props:  modelValue?: string|number
        options: {value, label}[]  label?  placeholder?  disabled?  size?: 'sm'|'md'
emits:  update:modelValue
```

**`BaseTextarea`**
```
props:  modelValue?: string  placeholder?  rows?: number(3)  maxlength?: number|null
        autosize?: boolean(true)  disabled?  readonly?  invalid?  size?: 'sm'|'md'|'lg'
emits:  update:modelValue  blur  focus
```

**`BaseCheckbox`**
```
props:  modelValue?: boolean  label?  disabled?  indeterminate?  error?: boolean  size?: 'sm'|'md'
emits:  update:modelValue
```

**`BaseRadio`**
```
props:  modelValue?: string|number
        options: {value, label}[]  name: string  label?  disabled?
        direction?: 'horizontal'|'vertical'
emits:  update:modelValue
```

**`BaseToggle`**
```
props:  modelValue?: boolean  label?  disabled?
emits:  update:modelValue
```

**`BaseFileUpload`**
```
props:  modelValue?: File[]  accept?  multiple?  maxSize?  disabled?
emits:  update:modelValue  error
```

**`FormField`** — label + error wrapper for any input
```
slots:  default (input), label, error
props:  label?  error?  required?  hint?
```

---

### 5.2 Display & Feedback

**`BaseBadge`**
```
props:  text?: string|number  variant?: primary|success|warning|danger|info|ghost|neutral
        size?: 'sm'|'md'|'lg'  dot?: boolean  pulsing?: boolean  solid?: boolean
slots:  default (overrides text)
```

**`BaseAvatar`**
```
props:  src?: string|null  name?: string  size?: 'xs'|'sm'|'md'|'lg'|'xl'
        shape?: 'circle'|'square'(def:circle)  status?: 'online'|'offline'|'busy'|'away'|null
        ring?: boolean  alt?: string
```

**`BaseAvatarGroup`**
```
props:  items?: {src?,name?}[]  size?: 'xs'|'sm'|'md'|'lg'|'xl'  max?: number(4)
slots:  default (fallback)
```

**`BaseProgress`**
```
props:  value: number  max?: number(100)  variant?: primary|success|warning|error|danger
        size?: 'sm'|'md'|'lg'  striped?  animated?  showLabel?
```

**`BaseSkeleton`**
```
props:  rows?: number(5)  cols?: number(4)  height?: string('28px')
```

**`ShimmerBlock`**
```
props:  width?: string|number('100%')  height?: string|number('14px')
        radius?: none|sm|md|lg|xl|full  shape?: 'block'|'text'|'circle'
```

**`BaseSpinner`**
```
props:  size?: 'sm'|'md'|'lg'|'xl'  tone?: 'current'|'primary'|'inverse'|'muted'  label?: string
```

**`BaseTag`**
```
props:  label?  variant?: neutral|primary|success|warning|danger|info
        size?: 'sm'|'md'|'lg'  removable?  disabled?  shape?: 'pill'|'square'  dot?
emits:  remove  click
slots:  default (label override)
```

**`TagList`**
```
props:  tags: string[]  maxVisible?: number(3)  size?: 'sm'|'md'  variant?
```

**`StatusChip`**
```
props:  status: string  map: StatusChipMap  size?: 'sm'|'md'  dot?: boolean(true)
notes:  StatusChipMap = Record<string, {label, variant, dot?}>
```

---

### 5.3 Layout Containers

**`BaseCard`**
```
props:  title?  subtitle?  padded?: boolean(true)  shadow?: none|sm|md|lg|xl(def:md)
        radius?: md|lg|xl|2xl(def:lg)  hoverable?  bordered?: boolean(true)
        selected?  loading?  disabled?  clickable?
emits:  click
slots:  default, header (override title row)
```

**`BasePanel`**
```
props:  title?  description?  padded?: boolean(true)  radius?: md|lg|xl(def:lg)
        tone?: 'default'|'sunken'|'subtle'  collapsible?  defaultCollapsed?  collapsed?
emits:  update:collapsed
slots:  default, header (override)
```

**`GroupBox`**
```
props:  title: string  fill?: boolean  collapsible?  collapsed?
emits:  update:collapsed
slots:  default
```

---

### 5.4 Navigation

**`BaseTabs`**
```
props:  modelValue: string  tabs: {key,label,icon?,disabled?}[]
        variant?: 'pill'|'underline'
emits:  update:modelValue
notes:  animated indicator (offsetLeft/Width tracking)
```

**`BaseBreadcrumb`**
```
props:  items: {label, to?, href?, icon?}[]  separator?: 'chevron'|'slash'|'dot'(def:chevron)
        size?: 'sm'|'md'
emits:  item-click[item, index, event]
```

**`BasePagination`**
```
props:  modelValue: number  total: number  pageSize?: number(20)  siblings?: number(1)
        variant?: 'full'|'compact'|'load-more'  size?: 'sm'|'md'  loading?
emits:  update:modelValue  load-more
```

**`AnchorBar`**
```
props:  sections: {id,label}[]  scrollSpy?: boolean(true)  stickyTop?: number(12)  inline?
v-model: active section id
```

---

### 5.5 Overlay & Popup

**`BaseModal`**
```
props:  show: boolean  title: string  size?: 'sm'|'md'|'lg'|'xl'|'full'(def:md)
        showSave?  saveLabel?('Lưu')  closeLabel?('Đóng')  loading?
        intent?: 'default'|'danger'|'warning'  closable?: boolean(true)
emits:  update:show  save  close
slots:  default, footer
```

**`FormModal`**
```
props:  modelValue: boolean  title: string  size?: ModalSize(def:md)  loading?
        submitLabel?('Lưu')  cancelLabel?('Huỷ')  danger?  submitDisabled?  closable?
emits:  update:modelValue  submit
slots:  default (form content), footer-extra
```

**`FormDrawer`**
```
props:  modelValue: boolean  title: string  placement?: 'left'|'right'(def:right)
        size?: 'sm'|'md'|'lg'|'xl'(def:md)  loading?  submitLabel?('Lưu')
        cancelLabel?('Huỷ')  danger?  submitDisabled?  showSubmit?: boolean(true)
emits:  update:modelValue  submit
slots:  default (form content)
```

**`BaseDrawer`**
```
props:  show: boolean  title?  placement?: 'left'|'right'|'top'|'bottom'(def:right)
        size?: 'sm'|'md'|'lg'|'xl'|'full'(def:md)  closable?(true)
        closeOnBackdrop?(true)  closeOnEsc?(true)
emits:  update:show  close
slots:  default, footer
```

**`ConfirmDialog`**
```
props:  modelValue: boolean  title: string  description?
        intent?: 'danger'|'warning'|'info'(def:danger)
        confirmLabel?('Xác nhận')  cancelLabel?('Huỷ')  loading?
emits:  update:modelValue  confirm
```

**`BaseDropdown`**
```
props:  placement?: 'bottom-start'|'bottom-end'|'top-start'|'top-end'
slots:  trigger, default (menu content)
notes:  auto flip when near viewport edge
```

**`BaseTooltip`**
```
props:  content: string  placement?: top|right|bottom|left(def:top)
        delay?: number(300)  disabled?
slots:  default (trigger)
```

**`BasePopover`**
```
props:  placement?: top|bottom|left|right(def:bottom)
        trigger?: 'click'|'hover'(def:click)  showArrow?: boolean(true)  width?: string('280px')
slots:  trigger, default (content)
expose:  open(), close(), toggle()
```

**`CommandPalette`**
```
props:  show?: boolean(false)  items: PaletteItem[]  placeholder?('tìm lệnh...')
        maxResults?: number(8)  autoShortcut?: boolean(true)
emits:  update:show  select[item]
type PaletteItem = {id, label, icon?, shortcut?, action?}
notes:  autoShortcut=true → registers Ctrl+K/Cmd+K globally
```

---

### 5.6 Accordion & Wizard

**`BaseAccordion`**
```
props:  items: {key,title,description?,icon?,disabled?}[]
        multi?: boolean(false)  defaultOpen?: string[]  variant?: 'bordered'|'flush'
```

**`BaseWizard`**
```
props:  steps: {label,description?,icon?,status?}[]  modelValue?: number
emits:  update:modelValue  finish
slots:  default (step content keyed by index)
```

---

### 5.7 Layout Shell

**`AppShell`**
```
props:  variant?: 'sidebar'|'topnav'|'split'(def:sidebar)
        topbarHeight?: number(56)
        splitDefaultLeft?: number(320)  splitMinLeft?: number(200)  splitMinRight?: number(320)
        maxWidth?: number|null(1200)  centered?: boolean(true)
        background?: 'base'|'sunken'|'gradient'(def:sunken)
slots:  sidebar, sub-sidebar, topbar, nav, default (main content), master, detail, footer
```

**`AppSidebar`**
```
props:  sections?: SidebarSection[]  brand?: string  logoGradient?: boolean(true)
        width?: number(240)  collapsedWidth?: number(64)  collapsible?: boolean(true)
        activeId?: string|null  autoCollapseOnMobile?: boolean(true)
        collapsePosition?: 'header'|'footer'(def:footer)  collapsed?: boolean(false)
emits:  select[item]  update:collapsed
slots:  brand, default (extra items), footer
type SidebarItem = {id, label, icon?, to?, badge?, children?: SidebarItem[]}
type SidebarSection = {title?, items: SidebarItem[]}
```

**`AppTopbar`**
```
props:  title?: string  subtitle?: string
slots:  left, actions
```

**`PageHeader`**
```
props:  title: string  description?  back?: boolean(false)  backLabel?('Quay lại')
        sticky?: boolean  padded?: boolean  size?: 'sm'|'md'|'lg'
emits:  back
slots:  default (action buttons)
```

---

### 5.8 Data Components

**`BaseDataGrid`** — virtualized, selection, sort, resize
```
props:  columns: ColumnConfig[]  rows: Record<string,unknown>[]
        highlightedRows?: Set<number>  selectedCells?: {row,col}[]
        showCheckbox?: boolean(true)  allChosen?: boolean  rowHeight?: number(36)  loading?
emits:  toggle-all  toggle-row  row-mousedown  row-mouseenter  row-dblclick
        cell-click  contextmenu  keydown  sort[col,dir]
```

**`DataGridPro`** — full-featured data grid
```
props:  columns: ColumnConfig[]  rows: Record<string,unknown>[]  rowKey?: string('id')
        selected?: Set<string|number>  density?: 'sm'|'md'|'lg'(def:md)
        virtual?: boolean|'auto'(def:auto)  resizable?(true)  pinnable?  reorderable?
        inlineEdit?  loading?  savedViews?: SavedView[]  bordered?(true)  striped?
emits:  update:selected  update:density  update:columns
        cell-edit[row,col,oldVal,newVal]  sort[col,dir]
        save-view[view]  apply-view[view]  export[format,rows]
slots:  cell-{colKey} (per-column custom render)
```

**`BulkActionBar`**
```
props:  count: number  show?: boolean
emits:  clear
slots:  default (action buttons)
```

**`FilterBuilder`** — visual query builder
```
props:  modelValue: FilterGroup  fields: FilterFieldDef[]
emits:  update:modelValue
type FilterRule   = {field, op: FilterOperator, value}
type FilterGroup  = {logic: 'and'|'or', rules: (FilterRule|FilterGroup)[]}
type FilterFieldDef = {key, label, type: FilterDataType, options?}
```

**`FilterChips`**
```
props:  group: FilterGroup  fieldLabels?: Record<string,string>
emits:  remove[path: number[]]  clear
```

**`Kanban`**
```
props:  modelValue: KanbanColumn[]
emits:  update:modelValue  card-click[card,column]  card-move[cardId,fromCol,toCol]
type KanbanCard   = {id, title, description?, tags?, assignee?, priority?, meta?}
type KanbanColumn = {id, title, color?, cards: KanbanCard[]}
```

**`BaseCalendar`**
```
props:  modelValue?: string(YYYY-MM-DD)  events?: CalendarEvent[]  view?: 'month'|'agenda'
emits:  update:modelValue  update:view  event-click[event]  date-click[date]
type CalendarEvent = {id, title, date, endDate?, color?, allDay?, meta?}
```

**`Timeline`**
```
props:  items: TimelineItem[]  groupByDay?: boolean(true)
slots:  default (per item)
type TimelineItem = {id, title, description?, date, icon?, color?, meta?}
```

**`Gallery`**
```
props:  items: GalleryItem[]  columns?: number(3)  gap?: number(8)
slots:  default (per item / lightbox)
type GalleryItem = {id, src, thumb?, title?, description?, meta?}
```

**`LogViewer`**
```
props:  logs: LogEntry[]  rowHeight?: number(24)  maxRows?: number(10000)
emits:  download[filtered: LogEntry[]]
type LogLevel = 'debug'|'info'|'warn'|'error'
type LogEntry = {id, level: LogLevel, message, timestamp, meta?}
```

---

### 5.9 Feedback States

**`EmptyState`**
```
props:  variant?: 'zero'|'filtered'|'search'(def:zero)  title?  description?  icon?
        ctaLabel?  secondaryLabel?  size?: 'sm'|'md'|'lg'  query?
emits:  cta  secondary
```

**`ErrorState`**
```
props:  surface?: 'inline'|'banner'|'fullpage'(def:inline)
        intent?: 'danger'|'warning'(def:danger)
        title?  description?  code?: string|number
        retryLabel?  secondaryLabel?  hideIcon?
emits:  retry  secondary
```

---

### 5.10 Async / Realtime

**`JobCard`**
```
props:  job: {id,name,status: JobStatus,progress?,eta?,elapsed?,message?,createdAt?}
        hideActions?
emits:  retry[job]  cancel[job]  logs[job]
slots:  default (extra actions)
type JobStatus = 'pending'|'running'|'done'|'failed'|'cancelled'
```

**`LiveBadge`**
```
props:  status?: 'live'|'polling'|'connecting'|'idle'|'error'(def:idle)
        lastUpdate?: number|null  channel?  iconOnly?
```

**`ConflictBanner`**
```
props:  user: string  at?: number|null  description?
        mergeLabel?('xem & merge')  ignoreLabel?('bỏ qua')
emits:  merge  ignore
```

**`RetryButton`**
```
props:  loading?  disabled?  label?('thử lại')  options?: {label,value}[]  size?: 'sm'|'md'
emits:  retry  retry-with[value: string]
```

**`StepProgress`**
```
props:  steps: (string | {label,description?,status?})[]  current?: number(0)
        orientation?: 'horizontal'|'vertical'  size?: 'sm'|'md'|'lg'
slots:  per-step via template
```

**`CountdownTimer`**
```
props:  seconds: number  label?  autoStart?: boolean(true)  size?: 'sm'|'md'|'lg'
        warnAt?: number(30)  dangerAt?: number(10)
emits:  expire
expose:  start(), stop(), reset()
```

---

### 5.11 Platform (Mobile / Desktop)

**`BottomSheet`**
```
props:  modelValue?: boolean(false)  title?
        snapPoints?: number[](def:[0.4, 0.9])  snapIndex?: number(0)
        closeOnBackdrop?(true)  closeOnEsc?(true)  showHandle?(true)  draggable?(true)
emits:  update:modelValue  update:snapIndex  snap[index]
slots:  default (content), handle
```

**`SafeAreaContainer`**
```
props:  edges?: 'all'|'top'|'bottom'|'horizontal'|'vertical'|Array<'top'|'bottom'|'left'|'right'>(def:all)
        padding?: string|number(0)  as?: keyof HTMLElementTagNameMap(def:'div')
        flex?  scrollY?
slots:  default
```

**`TitleBar`** — desktop window titlebar
```
props:  title?  force?: boolean(false)  draggable?(true)
        controlsPlacement?: 'auto'|'left'|'right'|'none'(def:auto)
        controlsStyle?: 'mac'|'windows'(def:mac)
slots:  left, right
```

**`WindowControls`**
```
props:  styleVariant?: 'mac'|'windows'(def:mac)  hideMaximize?  hideMinimize?
emits:  minimize  maximize  close
```

**`OfflineBanner`**
```
props:  online?: boolean (override)  queued?: number (override)  hideWhenIdle?
slots:  actions
```

---

### 5.12 Permission

**`CanShow`**
```
props:  do?: string  any?: string[]  all?: string[]
slots:  default (shown if allowed), fallback
```

**`PermissionGate`**
```
props:  do?: string  flag?: string  anyDo?: string[]  allDo?: string[]
        mode?: 'hide'|'disable'|'fallback'(def:hide)  upgradeLabel?
slots:  default (gated content), fallback, upgrade
```

**`UpgradeTooltip`**
```
props:  locked?: boolean(false)  plan?: string('pro')  description?
        placement?: top|bottom|left|right  ctaLabel?('nâng cấp')
emits:  upgrade
slots:  default (wrapped element)
```

---

### 5.13 SaaS UI

**`UserDropdown`** — uses auth store internally, no required props

**`NotificationCenter`** — uses notifications store internally, no required props

---

## 6. Composables

| Composable | Signature | Returns |
|-----------|-----------|---------|
| `useToast()` | — | `{ toasts: ToastItem[], showToast(type, msg, duration?), removeToast(id) }` |
| `useTheme()` | — | see §2 |
| `useBreakpoint()` | — | `{ breakpoint: Ref<Breakpoint>, width, isMobile, isTablet, isDesktop, BREAKPOINTS }` |
| `useViewMode()` | — | `{ mode: Ref<ViewMode>, isCompact, isDefault }` · `setViewMode(mode)` |
| `useI18n()` | — | `{ t(key, fallback?), locale }` · `setLocale(l)` `setOverride(key, val)` |
| `useCan()` | — | `{ can(perm), canAny(perms), canAll(perms), roles }` · `setRoles` `grant` `deny` `reset` |
| `useFlag(key)` | `key: string` | `ComputedRef<FlagValue>` |
| `useFlagValue()` | — | `{ isOn(key), variant(key), flags }` · `setFlag` `setFlags` `clearFlag` `resetFlags` |
| `useContextMenu()` | — | `{ open(event, items), close, visible, position, items }` |
| `useSelection()` | — | `{ selected, toggle(id), toggleAll(ids), clear, isSelected(id), count }` |
| `useClipboard()` | — | `{ copy(text), copied, error }` |
| `useCopyClipboard()` | — | `{ copyToClipboard(text), hasCopied }` |
| `useVirtualScroll()` | `(items, rowHeight, containerHeight)` | `{ visibleItems, startIndex, totalHeight, onScroll }` |
| `useKeyboard()` | — | `{ on(combo, handler), off(combo) }` |
| `useShortcut()` | `(options: ShortcutOptions)` | registers local shortcuts, auto-cleans on unmount |
| `useColumnResize()` | `(columns)` | `{ widths, onMousedown, resizing }` |
| `useFocusTrap()` | `(options?)` | `{ activate, deactivate, trapped }` |
| `useHoverable()` | — | `{ isHovered, onMouseenter, onMouseleave }` |
| `useOnline()` | — | `{ online, queue, enqueue(mutation), remove(id), clear, flush(runner) }` |
| `useLiveQuery<T>()` | `(opts: {url, interval?, transform?})` | `{ data, status: LiveStatus, lastUpdate, error, start, stop, retry }` |
| `useOptimistic<T>()` | `(initial: T)` | `{ value, set, pending, pendings, error, run(opts) }` |
| `useScrollReveal()` | `(opts?: ScrollRevealOptions)` | `{ revealed, observe(el) }` |
| `useStagger()` | `(baseDelayMs, maxItems)` | `(index) => { 'animation-delay': string }` |
| `useCrudState<T>()` | `(initialData)` | `{ items, selected, dialogs, loaders, targets, select, deselect, openAdd, openEdit, openDelete, openDetail, closeAll }` |
| `useFormState()` | `(fields: Record<string,unknown>)` | `{ form, reset(initial?), fillFrom(item, mapFn?), parseTags(val) }` |
| `useFilter<T>()` | `(source, searchFields, filters?)` | `{ search, filterValues, filtered, setFilter, resetFilters }` |

---

## 7. Directives

| Directive | Usage | Behavior |
|-----------|-------|---------|
| `v-can="'action:resource'"` | `<button v-can="'edit:user'">` | Hides element if no permission |
| `v-flag="'flag-name'"` | `<div v-flag="'beta-feature'">` | Hides element if flag is off |
| `registerDirectives(app)` | `registerDirectives(createApp(App))` | Registers both globally |

---

## 8. Types

| Type | Location | Shape |
|------|----------|-------|
| `ModalSize` | `types/ui.ts` | `'sm'\|'md'\|'lg'\|'xl'\|'full'` |
| `ColumnConfig` | `types/ui.ts` | `{key,label,visible,group,width?,align?,sortable?,class?}` |
| `ContextMenuItem` | `types/ui.ts` | `{id,label,icon?,danger?,disabled?,separator?,children?,action?}` |
| `CellRef` | `types/ui.ts` | `{row:number, col:string}` |
| `GridStats` | `types/ui.ts` | `{total,live,highlighted,selected}` |
| `ColorScheme` | `ui-system/composables/useTheme.ts` | `'light'\|'dark'\|'system'` |
| `Variant` | `ui-system/composables/useTheme.ts` | `'default'\|'flat'` |
| `Theme` | `ui-system/composables/useTheme.ts` | alias for `ColorScheme` (deprecated) |
| `ToastType` | `composables/useToast.ts` | `'success'\|'error'\|'warning'\|'info'` |
| `ViewMode` | `composables/useViewMode.ts` | `'desktop'\|'mobile'\|'tablet'` |
| `Breakpoint` | `composables/useBreakpoint.ts` | `'xs'\|'sm'\|'md'\|'lg'\|'xl'\|'2xl'` |
| `Role` | `composables/useCan.ts` | `string` |
| `FlagValue` | `composables/useFlag.ts` | `boolean\|string\|number` |
| `LiveStatus` | `composables/useLiveQuery.ts` | `'idle'\|'connecting'\|'live'\|'polling'\|'error'` |
| `QueuedMutation` | `composables/useOnline.ts` | `{id,fn,label?,createdAt}` |
| `FilterRule` | `components/data/filter-types.ts` | `{field,op:FilterOperator,value}` |
| `FilterGroup` | `components/data/filter-types.ts` | `{logic:'and'\|'or', rules:(FilterRule\|FilterGroup)[]}` |
| `FilterFieldDef` | `components/data/filter-types.ts` | `{key,label,type:FilterDataType,options?}` |
| `SidebarItem` | `components/layout/sidebar-types.ts` | `{id,label,icon?,to?,badge?,children?}` |
| `SidebarSection` | `components/layout/sidebar-types.ts` | `{title?,items:SidebarItem[]}` |
| `JobStatus` | `components/async/JobCard.vue` | `'pending'\|'running'\|'done'\|'failed'\|'cancelled'` |

---

## 9. CrudPage Archetype

`CrudPage` — full CRUD page from a single config object. Entry: `frontend/src/archetypes/crud/CrudPage.vue`.

```ts
interface CrudPageConfig<T> {
  entity:            string            // singular slug, e.g. 'user'
  label:             string            // display name
  initialData():     Omit<T, 'id'>    // blank form object factory
  columns:           CrudColumnDef[]  // {key, label, width?, align?, slot?}
  searchFields:      (keyof T)[]
  searchPlaceholder?: string
  filters?:          FilterConfig[]   // {key, defaultValue, options[], match(row,value)}
  bulkActions?:      BulkActionConfig[] // {key, label, variant?, confirm?}
  addForm?:          FormFieldConfig[]
  editForm?:         FormFieldConfig[]
  detail?:           DetailSectionConfig[] // {title, fields[{key,label,format?,code?}]}
  delete?:           { title?, description? }
  handlers?: {
    load?():         Promise<T[]>
    create?(data):   Promise<T>
    update?(id, d):  Promise<T>
    delete?(id):     Promise<void>
    bulkAction?(key, ids): Promise<void>
  }
  empty?: { title?, description?, ctaLabel? }
  pageSize?: number
}

type FormFieldConfig = {
  key: string; label: string
  type: 'text'|'email'|'password'|'textarea'|'select'|'toggle'|'tags'|'radio'|'checkbox'
  required?; placeholder?; hint?
  options?: {value,label}[]
  half?: boolean  // 50% width in 2-col form grid
}
```

---

## 10. Adding a Component — Checklist

1. Create `frontend/src/components/{group}/YourComponent.vue`
2. Props strictly typed via `defineProps<{...}>()` — use tokens only, zero hardcoded values
3. Dark mode: `.wx-dark .your-block { ... }` inside `<style scoped>`
4. Export from group `index.ts` → auto-included in `lib.ts`
5. New types → add to `frontend/src/types/ui.ts` and re-export from `types/index.ts`
6. Quality gate: `cd frontend && npm run typecheck && npm run build:lib`
