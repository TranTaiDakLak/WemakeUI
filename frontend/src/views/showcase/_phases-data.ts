/**
 * Shared sidebar/sitemap data — single source of truth cho cả DemoLayout
 * (sidebar cố định) và SitemapView (overview cards).
 */

export type PhaseStatus = 'done' | 'pending'

export interface ShowcaseRoute {
  path: string
  label: string
  desc: string
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
    title: 'foundations — tokens',
    status: 'done',
    routes: [
      { path: '/showcase/tokens', label: 'tokens showcase', desc: 'color, gradient, radius, spacing, typography, motion, focus, sentence case' },
    ],
  },
  {
    n: 1,
    title: 'base primitives',
    status: 'done',
    routes: [
      { path: '/showcase/primitives', label: 'gallery 15 primitive × state', desc: 'button, input, textarea, select, checkbox, radio, toggle, badge, avatar, spinner, tag, progress, skeleton, shimmer, loading composition' },
    ],
  },
  {
    n: 2,
    title: 'composite (overlay & nav)',
    status: 'done',
    routes: [
      { path: '/showcase/overlay', label: 'overlay primitives', desc: '5 size modal, 4 placement drawer, focus trap, esc, queue toast' },
      { path: '/showcase/nav', label: 'nav primitives', desc: 'underline tab, single+multi accordion, 3 separator, 3 variant pagination, cmd+k palette fuzzy' },
    ],
  },
  {
    n: 3,
    title: 'form & layout shells',
    status: 'done',
    routes: [
      { path: '/showcase/shell/sidebar', label: 'sidebar shell', desc: 'AppShell + AppSidebar collapsible + sub-sidebar 3 cột, KPI + form + activity (Card / Panel / FormField)' },
      { path: '/showcase/shell/topnav', label: 'top-nav shell', desc: 'full-width nav + hero gradient + features grid + contact form (FormField error/hint, GroupBox)' },
      { path: '/showcase/shell/split', label: 'split-pane shell', desc: 'master-detail mailbox, resize handle, BottomSheet mobile, SafeAreaContainer' },
    ],
  },
  {
    n: 4,
    title: 'data display + advanced UX',
    status: 'done',
    routes: [
      { path: '/showcase/data', label: 'phase 4 index', desc: 'tổng quan các component data display + advanced UX' },
      { path: '/showcase/data/grid', label: 'DataGridPro', desc: 'sort, virtual 10k rows, resize, pin, reorder, multi-select, inline-edit, saved-views, export' },
      { path: '/showcase/data/filter', label: 'FilterBuilder', desc: 'AND/OR lồng nhau max depth 3, URL serialize base64, FilterChips strip' },
      { path: '/showcase/data/log', label: 'LogViewer', desc: 'streaming, level filter, search highlight, follow toggle, virtual scroll, download .log' },
      { path: '/showcase/data/kanban', label: 'kanban board', desc: 'drag-drop card giữa column, HTML5 native, priority + tags + assignee' },
      { path: '/showcase/data/calendar', label: 'calendar', desc: 'month grid + agenda view, events nhiều màu' },
      { path: '/showcase/data/timeline', label: 'timeline / activity feed', desc: 'group by day, dot icon variant, actor + timestamp' },
      { path: '/showcase/data/gallery', label: 'gallery / media grid', desc: 'CSS columns masonry + lightbox keyboard nav' },
    ],
  },
  {
    n: 4.5,
    title: 'chart system',
    status: 'done',
    routes: [
      { path: '/showcase/charts', label: 'LineChart · AreaChart · BarChart · PieChart · Sparkline · Gauge · Heatmap', desc: '7 chart thuần SVG, không deps, theme-aware qua --wx-*, hover tooltip + crosshair, KPI sparkline cards' },
    ],
  },
  {
    n: 5,
    title: 'feedback / async / permission / platform',
    status: 'done',
    routes: [
      { path: '/showcase/async', label: 'EmptyState · ErrorState · JobCard · LiveBadge · ConflictBanner · RetryButton · StepProgress', desc: '3 biến thể empty, 4 surface error, 5 lifecycle job, JobTimeline group theo ngày, retry dropdown' },
      { path: '/showcase/permission', label: 'useCan · useFlag · CanShow · PermissionGate · UpgradeTooltip · v-can · v-flag', desc: '5 role RBAC switch realtime, hidden vs disable, capability gate + upgrade tooltip' },
      { path: '/showcase/platform', label: 'TitleBar · WindowControls · OfflineBanner · useOnline · useShortcut · useFocusTrap · useOptimistic · useHoverable', desc: 'mac/windows controls, mutation queue offline, mod+k palette focus trap, optimistic rollback' },
    ],
  },
  {
    n: 7,
    title: 'page templates · app + landing + weconnect',
    status: 'done',
    routes: [
      /* app pages */
      { path: '/app/profile',       label: 'app · hồ sơ',             desc: 'hai cột: avatar + skills + stats grid + activity feed' },
      { path: '/app/profile-edit',  label: 'app · chỉnh sửa hồ sơ',   desc: 'form 4 section: thông tin cá nhân, bảo mật, mạng xã hội, nguy hiểm' },
      { path: '/app/settings',      label: 'app · cài đặt',           desc: '5 tab: Chung / Bảo mật / Thông báo / Giao diện / Thanh toán' },
      { path: '/app/mailbox',       label: 'app · hộp thư',           desc: '3 cột: folder list + mail list + mail detail' },
      { path: '/app/chat',          label: 'app · chat',              desc: 'danh sách liên hệ + bubble chat + gửi bằng Enter' },
      { path: '/app/pricing',       label: 'app · bảng giá',          desc: '3 plan + toggle năm/tháng + highlight plan popular' },
      { path: '/app/notifications', label: 'app · thông báo',         desc: '3 tab + markAllRead + TransitionGroup list animation' },
      { path: '/app/faq',           label: 'app · FAQ',               desc: 'search + tag filter + BaseAccordion expandable' },
      { path: '/app/search',        label: 'app · tìm kiếm',          desc: 'full-text search + type filter + result list' },
      { path: '/app/invoices',      label: 'app · hoá đơn',           desc: '4 KPI + bảng invoice với action buttons' },
      { path: '/app/files',         label: 'app · file manager',      desc: 'breadcrumb + grid/list toggle + bulk select' },
      { path: '/app/api-keys',      label: 'app · API keys',          desc: 'create form + key list + code example' },
      { path: '/app/audit-log',     label: 'app · audit log',         desc: 'expandable rows với JSON diff before/after' },
      { path: '/app/wiki',          label: 'app · wiki',              desc: 'tree nav sidebar + inline markdown renderer' },
      { path: '/app/organization',  label: 'app · tổ chức',           desc: '3 tab: members / groups / settings' },
      { path: '/app/product',       label: 'app · chi tiết sản phẩm', desc: 'gallery + variants + qty + reviews + rating bars' },
      { path: '/app/order',         label: 'app · chi tiết đơn hàng', desc: 'timeline + items + aside: khách / địa chỉ / thanh toán' },
      { path: '/app/learning',      label: 'app · học tập',           desc: '3 tab khoá học + progress bar per course' },
      { path: '/app/map',           label: 'app · bản đồ',            desc: 'SVG map VN + pin locations + location detail' },
      { path: '/app/calendar',      label: 'app · lịch',              desc: 'BaseCalendar + event list sidebar' },
      /* landing pages */
      { path: '/landing',           label: 'landing · SaaS home',     desc: 'hero + logos + 6 features grid + CTA' },
      { path: '/landing/about',     label: 'landing · về chúng tôi',  desc: 'story + 4 values + team grid + join CTA' },
      { path: '/landing/contact',   label: 'landing · liên hệ',       desc: 'contact form + sent state + channels' },
      { path: '/landing/blog',      label: 'landing · blog',          desc: 'tag filter + 6 post cards' },
      { path: '/landing/blog/post', label: 'landing · bài viết',      desc: 'article layout + author card + related' },
      { path: '/landing/changelog', label: 'landing · changelog',     desc: '3 releases với typed items (feature/fix/breaking)' },
      { path: '/landing/careers',   label: 'landing · tuyển dụng',    desc: 'culture grid + job listings với dept filter' },
      { path: '/landing/policy',    label: 'landing · chính sách',    desc: '7 sections + sticky TOC' },
      { path: '/landing/api',       label: 'landing · API docs',      desc: 'quick start + endpoints table + SDK grid' },
      { path: '/landing/features',  label: 'landing · tính năng',     desc: '4 feature categories + items grid' },
      /* weconnect pages */
      { path: '/weconnect',              label: 'weconnect · admin',       desc: '4 KPI + Sparkline + activity feed realtime' },
      { path: '/weconnect/accounts',     label: 'weconnect · tài khoản',   desc: 'accounts table + connect/disconnect/QR actions' },
      { path: '/weconnect/sessions',     label: 'weconnect · phiên',       desc: 'session cards + setInterval auto-update messages' },
      { path: '/weconnect/contacts',     label: 'weconnect · danh bạ',     desc: 'contacts table + search + tag filter' },
      { path: '/weconnect/campaigns',    label: 'weconnect · chiến dịch',  desc: 'campaign cards + progress bar + stats' },
      { path: '/weconnect/plugins',      label: 'weconnect · plugins',     desc: 'plugin cards + BaseToggle enable/disable' },
      { path: '/weconnect/console',      label: 'weconnect · console',     desc: 'streaming log viewer + level/session filter + dark terminal' },
      { path: '/weconnect/scheduler',    label: 'weconnect · scheduler',   desc: 'cron job list + create/run/delete + enabled toggle' },
      { path: '/weconnect/integrations', label: 'weconnect · tích hợp',    desc: 'integration cards + webhook table + add webhook form' },
      { path: '/weconnect/automation',   label: 'weconnect · automation',  desc: 'SVG canvas drag-drop nodes + curved edges + run animation' },
    ],
  },
  {
    n: 6,
    title: 'page templates · auth + error + dashboard',
    status: 'done',
    routes: [
      /* auth */
      { path: '/auth/login',         label: 'auth · đăng nhập',         desc: 'split panel + email/password + remember + social Google/Microsoft' },
      { path: '/auth/login-v2',      label: 'auth · đăng nhập v2',      desc: 'aside brand gradient + 3 hero card stack + social trên đỉnh' },
      { path: '/auth/register',      label: 'auth · đăng ký',           desc: '3 bước wizard: account → profile → finish, strength meter' },
      { path: '/auth/forgot',        label: 'auth · quên mật khẩu',     desc: 'gửi đường dẫn khôi phục + sent state + retry 60s' },
      { path: '/auth/reset',         label: 'auth · đặt lại mật khẩu',  desc: 'strength meter + 4 checks (8 ký tự, hoa, số, ký tự đặc biệt)' },
      { path: '/auth/otp',           label: 'auth · OTP / 2FA',         desc: '6 ô số tự auto-advance, paste, đếm ngược 60s, demo: 123456' },
      { path: '/auth/email-verify',  label: 'auth · xác minh email',    desc: '4 trạng thái: pending / verified / expired / error' },
      { path: '/auth/lock',          label: 'auth · khoá màn hình',     desc: 'avatar + ô mật khẩu + clock realtime, demo: demo1234' },
      { path: '/auth/onboarding',    label: 'auth · onboarding wizard', desc: '5 bước: chào → workspace → mời → theme (system/light/dark) → done' },
      { path: '/auth/workspace',     label: 'auth · chọn workspace',    desc: 'grid 4 card workspace với role/plan/members + tìm kiếm' },
      /* error */
      { path: '/error/404',                  label: 'error · 404 not found',     desc: 'mã code gradient text, suggest links về pages khác' },
      { path: '/error/500',                  label: 'error · 500 server',        desc: 'status table 3 dịch vụ + retry + liên hệ hỗ trợ' },
      { path: '/error/403',                  label: 'error · 403 forbidden',     desc: 'role current vs required + path yêu cầu' },
      { path: '/error/503',                  label: 'error · 503 maintenance',   desc: 'eta countdown + progress + checklist 5 bước' },
      { path: '/error/offline',              label: 'error · offline',           desc: 'detect navigator.onLine + mutation queue + cache status' },
      { path: '/error/under-construction',   label: 'error · under construction', desc: 'subscribe email khi go-live' },
      { path: '/error/coming-soon',          label: 'error · coming soon',       desc: 'countdown 14 ngày + sub form + social' },
      /* dashboard */
      { path: '/dashboard/overview',  label: 'dashboard · tổng quan',  desc: '4 KPI sparkline + chart line + donut + activity feed' },
      { path: '/dashboard/analytics', label: 'dashboard · analytics',  desc: 'traffic source + funnel chuyển đổi + heatmap 7×24' },
      { path: '/dashboard/ecommerce', label: 'dashboard · bán hàng',   desc: '4 KPI mini-chart + bảng đơn + top sản phẩm' },
      { path: '/dashboard/crm',       label: 'dashboard · CRM',        desc: '5 stage pipeline kanban + leaderboard sales' },
      { path: '/dashboard/project',   label: 'dashboard · dự án',      desc: 'sprint burndown + task table + team online' },
      { path: '/dashboard/finance',   label: 'dashboard · tài chính',  desc: 'số dư hero + 3 KPI + 4 tài khoản + giao dịch' },
      { path: '/dashboard/saas',      label: 'dashboard · SaaS',       desc: 'MRR/ARR/churn/NPS + cohort retention table' },
      { path: '/dashboard/logistics', label: 'dashboard · vận chuyển', desc: 'bản đồ VN + 4 kho + bảng shipment realtime' },
      { path: '/dashboard/helpdesk',  label: 'dashboard · helpdesk',   desc: 'ticket table + agent SLA + 8 topics' },
      { path: '/dashboard/iot',       label: 'dashboard · IoT realtime', desc: '6 sensor card auto-update 2.5s + alert feed' },
    ],
  },
]
