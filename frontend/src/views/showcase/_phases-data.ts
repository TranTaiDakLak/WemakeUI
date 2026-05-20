/**
 * Shared sidebar/overview data — single source of truth cho cả DemoLayout
 * (sidebar cố định) và overview page (overview cards).
 */

export type PhaseStatus = 'done' | 'pending'

export interface ShowcaseAnchor {
  id: string
  label: string
}

export interface ShowcaseRoute {
  path: string
  label: string
  /** Short label for sidebar nav. Falls back to label.split(' — ')[0]. */
  navLabel?: string
  desc: string
  anchors?: ShowcaseAnchor[]
}

export interface ShowcasePhase {
  n: number
  title: string
  status: PhaseStatus
  routes: readonly ShowcaseRoute[]
}

export const phases: readonly ShowcasePhase[] = [
  {
    n: 0,
    title: 'Foundations — Tokens',
    status: 'done',
    routes: [
      {
        path: '/showcase/tokens',
        navLabel: 'Design Tokens',
        label: 'Color · Spacing · Typography · Motion',
        desc: 'color, gradient, radius, spacing, typography, motion, focus, sentence case',
      },
      {
        path: '/showcase/icons',
        navLabel: 'Icon Sets',
        label: 'Lucide · Phosphor · Solar · Tabler · Hugeicons',
        desc: 'so sánh trực quan 5 bộ icon hiện đại — weight, size, theme, brand color',
      },
    ],
  },
  {
    n: 1,
    title: 'Base Primitives',
    status: 'done',
    routes: [
      {
        path: '/showcase/primitives',
        navLabel: 'Primitives',
        label: 'Button · Input · Badge · Avatar · Toggle · Spinner',
        desc: 'button, input, textarea, select, checkbox, radio, toggle, badge, avatar, spinner, tag, progress, skeleton, shimmer, loading composition',
      },
      {
        path: '/showcase/cards',
        navLabel: 'Card & GroupBox',
        label: 'BaseCard · GroupBox — Surface Containers',
        desc: 'header/body/footer slots, shadow, radius, states (selected/disabled/loading), hoverable, clickable, selection group, GroupBox collapsible',
      },
    ],
  },
  {
    n: 2,
    title: 'Composite (Overlay & Nav)',
    status: 'done',
    routes: [
      {
        path: '/showcase/overlay',
        navLabel: 'Modal & Overlay',
        label: 'Modal · Drawer · Toast',
        desc: '5 size modal, 4 placement drawer, focus trap, esc, queue toast',
      },
      {
        path: '/showcase/nav',
        navLabel: 'Tabs & Navigation',
        label: 'Tabs · Accordion · Pagination · Command Palette',
        desc: 'underline tab, single+multi accordion, 3 separator, 3 variant pagination, cmd+k palette fuzzy',
      },
    ],
  },
  {
    n: 3,
    title: 'Form & Layout Shells',
    status: 'done',
    routes: [
      { path: '/showcase/shell/sidebar', label: 'Sidebar Shell — AppShell + 3-cột',    desc: 'AppShell + AppSidebar collapsible + sub-sidebar 3 cột, KPI + form + activity (Card / Panel / FormField)' },
      { path: '/showcase/shell/topnav',  label: 'Top-Nav Shell — Hero + Contact Form', desc: 'full-width nav + hero gradient + features grid + contact form (FormField error/hint, GroupBox)' },
      { path: '/showcase/shell/split',   label: 'Split-Pane Shell — Master / Detail',  desc: 'master-detail mailbox, resize handle, BottomSheet mobile, SafeAreaContainer' },
    ],
  },
  {
    n: 4,
    title: 'Data Display + Advanced UX',
    status: 'done',
    routes: [
      { path: '/showcase/data',          label: 'Data Display — Tổng quan',                           desc: 'tổng quan các component data display + advanced UX' },
      { path: '/showcase/data/grid',     label: 'DataGrid — Sort · Filter · Inline Edit · Export',    desc: 'sort, virtual 10k rows, resize, pin, reorder, multi-select, inline-edit, saved-views, export' },
      { path: '/showcase/data/filter',   label: 'FilterBuilder — AND / OR Lồng nhau',                desc: 'AND/OR lồng nhau max depth 3, URL serialize base64, FilterChips strip' },
      { path: '/showcase/data/log',      label: 'LogViewer — Stream · Level Filter · Virtual Scroll', desc: 'streaming, level filter, search highlight, follow toggle, virtual scroll, download .log' },
      { path: '/showcase/data/kanban',   label: 'Kanban Board — Drag & Drop Columns',                desc: 'drag-drop card giữa column, HTML5 native, priority + tags + assignee' },
      { path: '/showcase/data/calendar', label: 'Calendar — Month Grid + Agenda',                    desc: 'month grid + agenda view, events nhiều màu' },
      { path: '/showcase/data/timeline', label: 'Timeline — Activity Feed',                          desc: 'group by day, dot icon variant, actor + timestamp' },
      { path: '/showcase/data/gallery',  label: 'Gallery — Masonry Grid + Lightbox',                 desc: 'CSS columns masonry + lightbox keyboard nav' },
      { path: '/showcase/data/crud',     navLabel: 'CrudPage / Data Table', label: 'CrudPage — Config-driven CRUD Table',               desc: 'Bảng dữ liệu config-driven: search, filter, pagination, CRUD đầy đủ, bulk actions, density control' },
    ],
  },
  {
    n: 4.5,
    title: 'Chart System',
    status: 'done',
    routes: [
      {
        path: '/showcase/charts',
        navLabel: 'Charts',
        label: 'Line · Bar · Pie · Gauge · Sparkline · Heatmap',
        desc: '7 chart thuần SVG, không deps, theme-aware qua --wx-*, hover tooltip + crosshair, KPI sparkline cards',
      },
    ],
  },
  {
    n: 5,
    title: 'Feedback / Async / Permission / Platform',
    status: 'done',
    routes: [
      { path: '/showcase/async',      navLabel: 'Async & States', label: 'EmptyState · ErrorState · JobCard · StepProgress',      desc: '3 biến thể empty, 4 surface error, 5 lifecycle job, JobTimeline group theo ngày, retry dropdown' },
      { path: '/showcase/permission', navLabel: 'Permissions',    label: 'useCan · PermissionGate · UpgradeTooltip · v-can',       desc: '5 role RBAC switch realtime, hidden vs disable, capability gate + upgrade tooltip' },
      { path: '/showcase/platform',   navLabel: 'Platform',       label: 'TitleBar · OfflineBanner · useShortcut · useOptimistic', desc: 'mac/windows controls, mutation queue offline, mod+k palette focus trap, optimistic rollback' },
    ],
  },

  /* ── Phase 6 → split: 6.1 Auth / 6.2 Error Pages / 6.3 Dashboards ───── */
  {
    n: 6.1,
    title: 'Auth',
    status: 'done',
    routes: [
      { path: '/auth/login',        label: 'Login — Split Panel + Social',     desc: 'split panel + email/password + remember + social Google/Microsoft' },
      { path: '/auth/login-v2',     label: 'Login v2 — Brand Gradient + Hero', desc: 'aside brand gradient + 3 hero card stack + social trên đỉnh' },
      { path: '/auth/register',     label: 'Register — 3-Step Wizard',         desc: '3 bước wizard: account → profile → finish, strength meter' },
      { path: '/auth/forgot',       label: 'Forgot Password — Email Link',     desc: 'gửi đường dẫn khôi phục + sent state + retry 60s' },
      { path: '/auth/reset',        label: 'Reset Password — Strength Meter',  desc: 'strength meter + 4 checks (8 ký tự, hoa, số, ký tự đặc biệt)' },
      { path: '/auth/otp',          label: 'OTP / 2FA — 6-Digit Auto-Advance', desc: '6 ô số tự auto-advance, paste, đếm ngược 60s, demo: 123456' },
      { path: '/auth/email-verify', label: 'Email Verify — 4 States',          desc: '4 trạng thái: pending / verified / expired / error' },
      { path: '/auth/lock',         label: 'Lock Screen — Clock + Password',   desc: 'avatar + ô mật khẩu + clock realtime, demo: demo1234' },
      { path: '/auth/onboarding',   label: 'Onboarding — 5-Step Wizard',       desc: '5 bước: chào → workspace → mời → theme (system/light/dark) → done' },
      { path: '/auth/workspace',    label: 'Workspace Picker — Grid + Search', desc: 'grid 4 card workspace với role/plan/members + tìm kiếm' },
    ],
  },
  {
    n: 6.2,
    title: 'Error Pages',
    status: 'done',
    routes: [
      { path: '/error/404',                label: '404 — Not Found',          desc: 'mã code gradient text, suggest links về pages khác' },
      { path: '/error/500',                label: '500 — Server Error',       desc: 'status table 3 dịch vụ + retry + liên hệ hỗ trợ' },
      { path: '/error/403',                label: '403 — Forbidden',          desc: 'role current vs required + path yêu cầu' },
      { path: '/error/503',                label: '503 — Maintenance Mode',   desc: 'eta countdown + progress + checklist 5 bước' },
      { path: '/error/offline',            label: 'Offline — Mutation Queue', desc: 'detect navigator.onLine + mutation queue + cache status' },
      { path: '/error/under-construction', label: 'Under Construction',       desc: 'subscribe email khi go-live' },
      { path: '/error/coming-soon',        label: 'Coming Soon — Countdown',  desc: 'countdown 14 ngày + sub form + social' },
    ],
  },
  {
    n: 6.3,
    title: 'Dashboards',
    status: 'done',
    routes: [
      { path: '/dashboard/overview',  navLabel: 'Overview',  label: 'Dashboard — Tổng quan (KPI + Charts)',      desc: '4 KPI sparkline + chart line + donut + activity feed' },
      { path: '/dashboard/analytics', navLabel: 'Analytics', label: 'Dashboard — Analytics (Traffic + Funnel)', desc: 'traffic source + funnel chuyển đổi + heatmap 7×24' },
      { path: '/dashboard/ecommerce', navLabel: 'Ecommerce', label: 'Dashboard — Ecommerce (Đơn hàng)',         desc: '4 KPI mini-chart + bảng đơn + top sản phẩm' },
      { path: '/dashboard/crm',       navLabel: 'CRM',       label: 'Dashboard — CRM (Pipeline Kanban)',        desc: '5 stage pipeline kanban + leaderboard sales' },
      { path: '/dashboard/project',   navLabel: 'Project',   label: 'Dashboard — Project (Sprint Burndown)',    desc: 'sprint burndown + task table + team online' },
      { path: '/dashboard/finance',   navLabel: 'Finance',   label: 'Dashboard — Finance (Số dư + Giao dịch)', desc: 'số dư hero + 3 KPI + 4 tài khoản + giao dịch' },
      { path: '/dashboard/saas',      navLabel: 'SaaS',      label: 'Dashboard — SaaS (MRR · ARR · Churn)',    desc: 'MRR/ARR/churn/NPS + cohort retention table' },
      { path: '/dashboard/logistics', navLabel: 'Logistics', label: 'Dashboard — Logistics (Map + Shipment)',  desc: 'bản đồ VN + 4 kho + bảng shipment realtime' },
      { path: '/dashboard/helpdesk',  navLabel: 'Helpdesk',  label: 'Dashboard — Helpdesk (Ticket + SLA)',     desc: 'ticket table + agent SLA + 8 topics' },
      { path: '/dashboard/iot',       navLabel: 'IoT',       label: 'Dashboard — IoT (Sensor Realtime)',       desc: '6 sensor card auto-update 2.5s + alert feed' },
    ],
  },

  {
    n: 7.1,
    title: 'App Pages (20)',
    status: 'done',
    routes: [
      { path: '/app/profile',       label: 'Profile — Avatar + Stats + Activity Feed',          desc: 'hai cột: avatar + skills + stats grid + activity feed' },
      { path: '/app/profile-edit',  label: 'Profile Edit — 4-Section Form',                    desc: 'form 4 section: thông tin cá nhân, bảo mật, mạng xã hội, nguy hiểm' },
      { path: '/app/settings',      label: 'Settings — 5 Tabs (Chung · Bảo mật · Thanh toán)', desc: '5 tab: Chung / Bảo mật / Thông báo / Giao diện / Thanh toán' },
      { path: '/app/mailbox',       label: 'Mailbox — 3-Column Mail Client',                   desc: '3 cột: folder list + mail list + mail detail' },
      { path: '/app/chat',          label: 'Chat — Bubble Chat + Enter to Send',               desc: 'danh sách liên hệ + bubble chat + gửi bằng Enter' },
      { path: '/app/pricing',       label: 'Pricing — 3 Plans + Monthly/Yearly Toggle',        desc: '3 plan + toggle năm/tháng + highlight plan popular' },
      { path: '/app/notifications', label: 'Notifications — 3 Tabs + Mark All Read',           desc: '3 tab + markAllRead + TransitionGroup list animation' },
      { path: '/app/faq',           label: 'FAQ — Search + Tag Filter + Accordion',            desc: 'search + tag filter + BaseAccordion expandable' },
      { path: '/app/search',        label: 'Search — Full-text + Type Filter',                 desc: 'full-text search + type filter + result list' },
      { path: '/app/invoices',      label: 'Invoices — KPI + Invoice Table',                   desc: '4 KPI + bảng invoice với action buttons' },
      { path: '/app/files',         label: 'File Manager — Breadcrumb + Grid/List',            desc: 'breadcrumb + grid/list toggle + bulk select' },
      { path: '/app/api-keys',      label: 'API Keys — Create + List + Code Example',          desc: 'create form + key list + code example' },
      { path: '/app/audit-log',     label: 'Audit Log — Expandable Rows + JSON Diff',          desc: 'expandable rows với JSON diff before/after' },
      { path: '/app/wiki',          label: 'Wiki — Tree Nav + Markdown Renderer',              desc: 'tree nav sidebar + inline markdown renderer' },
      { path: '/app/organization',  label: 'Organization — Members / Groups / Settings',       desc: '3 tab: members / groups / settings' },
      { path: '/app/product',       label: 'Product Detail — Gallery + Variants + Reviews',    desc: 'gallery + variants + qty + reviews + rating bars' },
      { path: '/app/order',         label: 'Order Detail — Timeline + Items + Aside',          desc: 'timeline + items + aside: khách / địa chỉ / thanh toán' },
      { path: '/app/learning',      label: 'Learning — Course Tabs + Progress Bars',           desc: '3 tab khoá học + progress bar per course' },
      { path: '/app/map',           label: 'Map — SVG Vietnam + Pins + Detail',                desc: 'SVG map VN + pin locations + location detail' },
      { path: '/app/calendar',      label: 'Calendar — Month Grid + Event Sidebar',            desc: 'BaseCalendar + event list sidebar' },
    ],
  },
  {
    n: 7.2,
    title: 'Landing Pages (10)',
    status: 'done',
    routes: [
      { path: '/landing',           label: 'SaaS Home — Hero + Features + CTA',    desc: 'hero + logos + 6 features grid + CTA' },
      { path: '/landing/about',     label: 'About — Story + Team Grid',            desc: 'story + 4 values + team grid + join CTA' },
      { path: '/landing/contact',   label: 'Contact — Form + Channels',            desc: 'contact form + sent state + channels' },
      { path: '/landing/blog',      label: 'Blog — Tag Filter + Post Cards',       desc: 'tag filter + 6 post cards' },
      { path: '/landing/blog/post', label: 'Blog Post — Article + Author',         desc: 'article layout + author card + related' },
      { path: '/landing/changelog', label: 'Changelog — Feature / Fix / Breaking', desc: '3 releases với typed items (feature/fix/breaking)' },
      { path: '/landing/careers',   label: 'Careers — Culture + Job Filter',       desc: 'culture grid + job listings với dept filter' },
      { path: '/landing/policy',    label: 'Policy — 7 Sections + Sticky TOC',     desc: '7 sections + sticky TOC' },
      { path: '/landing/api',       label: 'API Docs — Endpoints + SDK Grid',      desc: 'quick start + endpoints table + SDK grid' },
      { path: '/landing/features',  label: 'Features — 4 Categories + Items Grid', desc: '4 feature categories + items grid' },
    ],
  },
  {
    n: 7.3,
    title: 'WemakeUI Pages (10)',
    status: 'done',
    routes: [
      { path: '/wemakeui',              label: 'Admin — KPI + Realtime Feed',              desc: '4 KPI + Sparkline + activity feed realtime' },
      { path: '/wemakeui/accounts',     label: 'Accounts — Connect / QR Actions',          desc: 'accounts table + connect/disconnect/QR actions' },
      { path: '/wemakeui/sessions',     label: 'Sessions — Auto-update Interval',          desc: 'session cards + setInterval auto-update messages' },
      { path: '/wemakeui/contacts',     label: 'Contacts — Search + Tag Filter',           desc: 'contacts table + search + tag filter' },
      { path: '/wemakeui/campaigns',    label: 'Campaigns — Progress Bar + Stats',         desc: 'campaign cards + progress bar + stats' },
      { path: '/wemakeui/plugins',      label: 'Plugins — Enable / Disable Toggle',        desc: 'plugin cards + BaseToggle enable/disable' },
      { path: '/wemakeui/console',      label: 'Console — Log Stream + Level Filter',      desc: 'streaming log viewer + level/session filter + dark terminal' },
      { path: '/wemakeui/scheduler',    label: 'Scheduler — Cron Job Manager',             desc: 'cron job list + create/run/delete + enabled toggle' },
      { path: '/wemakeui/integrations', label: 'Integrations — Cards + Webhook Table',     desc: 'integration cards + webhook table + add webhook form' },
      { path: '/wemakeui/automation',   label: 'Automation Canvas — SVG Drag-Drop Nodes',  desc: 'SVG canvas drag-drop nodes + curved edges + run animation' },
    ],
  },
  {
    n: 8,
    title: 'DX Tooling',
    status: 'done',
    routes: [
      { path: '/showcase/dev-panel',     label: 'DevPanel — State · Network · FPS · Flags',          desc: 'FAB debug overlay: state snapshot, fetch interceptor, FPS sparkline, feature flags. DEV-only, Teleport to body.' },
      { path: '/showcase/observability', label: 'Observability — Metrics · Service Health · Errors', desc: 'Metrics dashboard: error rate sparkline, response histogram, service health grid, error tracker with resolve.' },
    ],
  },
  {
    n: 9,
    title: 'Form Popup Patterns',
    status: 'done',
    routes: [
      {
        path: '/showcase/patterns',
        navLabel: 'Form Patterns',
        label: 'FormModal · FormDrawer · ConfirmDialog',
        desc: 'pattern thực chiến: add modal, edit modal, drawer form, confirm delete/archive/revoke — đầy đủ loading, validation, toast, success state',
        anchors: [
          { id: 'add-modal',   label: 'Add Modal' },
          { id: 'edit-modal',  label: 'Edit Modal' },
          { id: 'form-drawer', label: 'Form Drawer' },
          { id: 'confirm',     label: 'Confirm Dialog' },
          { id: 'states',      label: 'States' },
        ],
      },
    ],
  },
  {
    n: 9.5,
    title: 'Template Gallery',
    status: 'done',
    routes: [
      {
        path: '/showcase/templates',
        navLabel: 'Template Gallery',
        label: 'Template Gallery — 120 trang sẵn dùng cho dev nội bộ',
        desc: 'browse 120 templates theo category (Auth / Error / Dashboard / App / Landing / WemakeUI), tìm kiếm, xem preview, copy path',
      },
    ],
  },
]
