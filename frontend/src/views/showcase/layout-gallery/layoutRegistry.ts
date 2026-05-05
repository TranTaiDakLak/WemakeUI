export type LayoutMode   = 'light' | 'dark' | 'both'
export type LayoutStatus = 'ready' | 'draft'

/** Sub-group cho WeConnect: khớp đúng sidebar gốc */
export type WCGroup = 'WeConnect' | 'Hệ thống'

export type LayoutCategory =
  | 'WeConnect'   // messaging automation platform — 10 trang
  | 'Dashboard'   // generic analytics/business dashboards
  | 'Auth'        // login, register, otp, onboarding
  | 'App'         // profile, settings, files, wiki...
  | 'Communication' // mailbox, chat
  | 'Billing'     // pricing, invoices
  | 'Landing'     // marketing pages
  | 'Error'       // 404, 500, maintenance

/* ── Một variant = một cách bố cục cụ thể ── */
export interface LayoutVariant {
  id: string
  label: string
  description?: string
  route?: string
  status: LayoutStatus
  mode: LayoutMode
  components: string[]
  patterns: string[]
  file: string
  prompt?: string
}

/* ── Một page = loại trang, chứa nhiều variants ── */
export interface LayoutPage {
  id: string
  title: string
  description: string
  category: LayoutCategory
  /** Sub-group trong category (chỉ dùng cho WeConnect) */
  group?: WCGroup
  variants: LayoutVariant[]
  tags?: string[]
}

export const CATEGORY_META: Record<LayoutCategory, { color: string; label: string; desc: string }> = {
  WeConnect:     { color: '#8b5cf6', label: 'WeConnect',     desc: 'WhatsApp automation platform — 10 trang' },
  Dashboard:     { color: '#0ea5e9', label: 'Dashboard',     desc: 'Tổng quan analytics/business' },
  Auth:          { color: '#6366f1', label: 'Auth',          desc: 'Đăng nhập, đăng ký, xác thực' },
  App:           { color: '#10b981', label: 'App',           desc: 'Profile, settings, files, wiki...' },
  Communication: { color: '#f97316', label: 'Communication', desc: 'Email, chat, messenger' },
  Billing:       { color: '#84cc16', label: 'Billing',       desc: 'Pricing, invoices, payment' },
  Landing:       { color: '#14b8a6', label: 'Landing',       desc: 'Marketing, blog, about' },
  Error:         { color: '#94a3b8', label: 'Error',         desc: '404, 500, maintenance...' },
}

export const layoutPages: LayoutPage[] = [

  /* ════════════════════════════════════════════════
     WECONNECT — WhatsApp automation platform
     Sidebar gốc:
       Group "WeConnect": Tổng quan / Tài khoản / Chiến dịch / Danh bạ / Phiên kết nối
       Group "Hệ thống":  Plugin / Console / Lịch tác vụ / Tích hợp / Automation canvas
  ════════════════════════════════════════════════ */
  {
    id: 'wc-admin',
    title: 'Tổng quan',
    description: 'Dashboard messaging: tài khoản hoạt động, phiên kết nối, chiến dịch đang chạy, tỷ lệ giao thành công + activity feed.',
    category: 'WeConnect',
    group: 'WeConnect',
    tags: ['dashboard', 'kpi', 'messaging', 'admin'],
    variants: [
      {
        id: 'wc-admin-v1',
        label: 'KPI cards + Sparkline + Activity feed',
        description: '4 KPI (accounts / sessions / campaigns / delivery rate) với sparkline chart, recent activity timeline.',
        route: '/weconnect',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'Sparkline'],
        patterns: ['KpiGrid', 'SparklineCard', 'ActivityFeed'],
        file: 'src/views/weconnect/AdminView.vue',
        prompt: 'WeConnect dashboard: 4 KPI cards (Tài khoản hoạt động / Phiên kết nối hôm nay / Chiến dịch đang chạy / Tỷ lệ giao thành công), mỗi card có sparkline 24h, bên dưới là activity feed với màu theo type (campaign/account/plugin/error/session).',
      },
    ],
  },

  {
    id: 'wc-accounts',
    title: 'Tài khoản',
    description: 'Quản lý tài khoản WhatsApp/WhatsApp Business: kết nối QR, trạng thái, số session, tìm kiếm.',
    category: 'WeConnect',
    group: 'WeConnect',
    tags: ['accounts', 'whatsapp', 'qr', 'connection'],
    variants: [
      {
        id: 'wc-accounts-table',
        label: 'Table + QR connect modal',
        description: 'Bảng tài khoản, badge trạng thái (connected/disconnected/qr_pending), nút kết nối mới.',
        route: '/weconnect/accounts',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseBadge', 'BaseAvatar', 'BaseInput'],
        patterns: ['AccountTable', 'StatusBadge', 'QrModal', 'SearchBar'],
        file: 'src/views/weconnect/AccountsView.vue',
        prompt: 'Accounts table: search bar, badge tổng kết nối, bảng có avatar + tên + loại (WA/WA Business) + badge trạng thái + số session + thời gian cuối, action: QR reconnect / disconnect.',
      },
    ],
  },

  {
    id: 'wc-campaigns',
    title: 'Chiến dịch',
    description: 'Campaign gửi tin nhắn: inline progress, filter platform/status, bulk pause/activate/delete.',
    category: 'WeConnect',
    group: 'WeConnect',
    tags: ['campaign', 'bulk', 'progress', 'zalo', 'facebook', 'sms'],
    variants: [
      {
        id: 'wc-campaigns-table',
        label: 'Table + Progress + 3 bulk actions',
        route: '/weconnect/campaigns',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseSelect', 'BaseBadge', 'BaseProgress', 'FormModal', 'ConfirmDialog', 'BulkActionBar'],
        patterns: ['TableFilter', 'InlineProgress', 'BulkPause', 'BulkActivate', 'BulkDelete'],
        file: 'src/views/weconnect/CampaignsView.vue',
        prompt: 'Campaigns: search + platform select (Zalo/Facebook/SMS/Email) + status select, table có inline progress bar 6px cho running/completed/paused, checkbox multi-select, bulk action bar với pause/activate/delete.',
      },
    ],
  },

  {
    id: 'wc-contacts',
    title: 'Danh bạ',
    description: 'Quản lý liên hệ: CRUD đầy đủ với Add/Edit modal, Detail drawer, Bulk delete, multi-select.',
    category: 'WeConnect',
    group: 'WeConnect',
    tags: ['contacts', 'crud', 'drawer', 'bulk', 'table'],
    variants: [
      {
        id: 'wc-contacts-crud',
        label: 'Full CRUD — Table + Detail drawer',
        route: '/weconnect/contacts',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseInput', 'BaseSelect', 'BaseBadge', 'FormModal', 'FormDrawer', 'ConfirmDialog', 'BulkActionBar'],
        patterns: ['FullCRUD', 'MultiSelect', 'RowActionsOnHover', 'DetailDrawer', 'BulkDelete'],
        file: 'src/views/weconnect/ContactsView.vue',
        prompt: 'Contacts CRUD: search + filter, checkbox multi-select, row actions (edit/delete) chỉ hiện khi hover, Add modal, Edit modal, Detail drawer có "Chỉnh sửa" button, Delete confirm dialog, Bulk action bar.',
      },
    ],
  },

  {
    id: 'wc-sessions',
    title: 'Phiên kết nối',
    description: 'Giám sát session WhatsApp đang hoạt động realtime: uptime, tin nhắn đã gửi, thiết bị, trạng thái.',
    category: 'WeConnect',
    group: 'WeConnect',
    tags: ['sessions', 'realtime', 'monitor', 'whatsapp'],
    variants: [
      {
        id: 'wc-sessions-cards',
        label: 'Session cards + realtime counter',
        description: 'Card grid mỗi session, tự cập nhật số tin nhắn mỗi 3s, badge màu theo trạng thái.',
        route: '/weconnect/sessions',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseButton'],
        patterns: ['SessionCard', 'StatusBadge', 'LiveCounter', 'DisconnectAction'],
        file: 'src/views/weconnect/SessionsView.vue',
        prompt: 'Sessions: card grid, mỗi card có session ID (mono font) + account + device + uptime + message count (realtime +random mỗi 3s) + badge active/idle/error, footer: Logs + Disconnect/Reconnect buttons.',
      },
    ],
  },

  {
    id: 'wc-plugins',
    title: 'Plugin',
    description: 'Marketplace plugin: cài đặt, cập nhật, toggle bật/tắt.',
    category: 'WeConnect',
    group: 'Hệ thống',
    tags: ['plugins', 'extensions', 'marketplace'],
    variants: [
      {
        id: 'wc-plugins-list',
        label: 'Plugin list + install/toggle',
        route: '/weconnect/plugins',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseButton', 'BaseToggle'],
        patterns: ['PluginCard', 'VersionBadge', 'InstallAction'],
        file: 'src/views/weconnect/PluginsView.vue',
      },
    ],
  },

  {
    id: 'wc-console',
    title: 'Console / Log',
    description: 'System log realtime: filter theo level (info/warn/error), auto-scroll, copy log.',
    category: 'WeConnect',
    group: 'Hệ thống',
    tags: ['console', 'log', 'debug', 'realtime'],
    variants: [
      {
        id: 'wc-console-log',
        label: 'Log viewer + level filter',
        route: '/weconnect/console',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseSelect', 'BaseBadge'],
        patterns: ['LogViewer', 'LevelFilter', 'AutoScroll'],
        file: 'src/views/weconnect/ConsoleView.vue',
      },
    ],
  },

  {
    id: 'wc-scheduler',
    title: 'Lịch tác vụ',
    description: 'Cron jobs: tạo task định kỳ, xem lịch chạy tiếp theo, enable/disable.',
    category: 'WeConnect',
    group: 'Hệ thống',
    tags: ['scheduler', 'cron', 'task', 'automation'],
    variants: [
      {
        id: 'wc-scheduler-list',
        label: 'Task list + cron expression',
        route: '/weconnect/scheduler',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseButton', 'BaseToggle'],
        patterns: ['TaskList', 'CronExpression', 'NextRunBadge'],
        file: 'src/views/weconnect/SchedulerView.vue',
      },
    ],
  },

  {
    id: 'wc-integrations',
    title: 'Tích hợp',
    description: 'Kết nối app bên ngoài: Zapier, CRM, webhook, API config.',
    category: 'WeConnect',
    group: 'Hệ thống',
    tags: ['integrations', 'webhook', 'api', 'zapier'],
    variants: [
      {
        id: 'wc-integrations-grid',
        label: 'Integration app grid + config drawer',
        route: '/weconnect/integrations',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseButton', 'BaseToggle'],
        patterns: ['IntegrationCard', 'ConfigDrawer', 'ConnectedBadge'],
        file: 'src/views/weconnect/IntegrationsView.vue',
      },
    ],
  },

  {
    id: 'wc-automation',
    title: 'Automation Canvas',
    description: 'Visual flow builder: drag-drop node, trigger → condition → action, kết nối bằng đường.',
    category: 'WeConnect',
    group: 'Hệ thống',
    tags: ['automation', 'flow', 'canvas', 'nocode', 'drag-drop'],
    variants: [
      {
        id: 'wc-automation-canvas',
        label: 'Flow canvas — Node editor',
        route: '/weconnect/automation',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseBadge', 'BaseCard', 'BaseSelect'],
        patterns: ['FlowNode', 'NodeConnector', 'TriggerNode', 'ActionNode', 'ConditionNode'],
        file: 'src/views/weconnect/AutomationCanvasView.vue',
        prompt: 'Automation canvas: toolbar trên (zoom/undo/save), canvas infinite scroll, node types: Trigger (xanh) / Condition (vàng) / Action (tím), kéo thả từ panel bên trái, kết nối bằng bezier curve.',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     DASHBOARD — generic business dashboards
     (KHÔNG phải WeConnect — đây là dashboard dạng
      analytics/business/ecommerce/saas)
  ════════════════════════════════════════════════ */
  {
    id: 'dash-analytics',
    title: 'Analytics Dashboard',
    description: 'Phân tích traffic, funnel conversion, retention, cohort. Dùng cho SaaS/web product.',
    category: 'Dashboard',
    tags: ['analytics', 'chart', 'funnel', 'retention'],
    variants: [
      {
        id: 'dash-analytics-v1',
        label: 'Charts focus — Line + Bar + Funnel',
        route: '/dashboard/analytics',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseSelect'],
        patterns: ['LineChart', 'BarChart', 'FunnelChart', 'DateRangeFilter'],
        file: 'src/views/dashboard/AnalyticsView.vue',
      },
      {
        id: 'dash-overview-v1',
        label: 'Overview — KPI + Activity + Top list',
        route: '/dashboard/overview',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseProgress', 'BaseAvatar'],
        patterns: ['StatGrid', 'AreaChart', 'ActivityFeed', 'TopList'],
        file: 'src/views/dashboard/OverviewView.vue',
      },
    ],
  },

  {
    id: 'dash-finance',
    title: 'Finance Dashboard',
    description: 'Doanh thu, P&L, budget so thực tế, cash flow. Dùng cho finance/accounting team.',
    category: 'Dashboard',
    tags: ['finance', 'revenue', 'pnl', 'budget'],
    variants: [
      {
        id: 'dash-finance-v1',
        label: 'Revenue + P&L + Budget bars',
        route: '/dashboard/finance',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseSelect'],
        patterns: ['RevenueChart', 'PnlTable', 'BudgetBar'],
        file: 'src/views/dashboard/FinanceView.vue',
      },
      {
        id: 'dash-saas-v1',
        label: 'SaaS — MRR + Churn + Trial conversion',
        route: '/dashboard/saas',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseProgress'],
        patterns: ['MrrChart', 'ChurnRate', 'TrialFunnel'],
        file: 'src/views/dashboard/SaasView.vue',
      },
    ],
  },

  {
    id: 'dash-ecommerce',
    title: 'E-commerce Dashboard',
    description: 'Doanh thu, đơn hàng, top sản phẩm, tỷ lệ chuyển đổi. Dùng cho shop online.',
    category: 'Dashboard',
    tags: ['ecommerce', 'orders', 'products', 'revenue'],
    variants: [
      {
        id: 'dash-ecom-v1',
        label: 'Revenue + Order table + Product rank',
        route: '/dashboard/ecommerce',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseProgress'],
        patterns: ['RevenueChart', 'OrderTable', 'ProductRank'],
        file: 'src/views/dashboard/EcommerceView.vue',
      },
    ],
  },

  {
    id: 'dash-crm',
    title: 'CRM Dashboard',
    description: 'Pipeline deals, win rate, top contacts. Dùng cho sales team.',
    category: 'Dashboard',
    tags: ['crm', 'pipeline', 'deals', 'sales'],
    variants: [
      {
        id: 'dash-crm-v1',
        label: 'Deal pipeline + Win rate + Contact list',
        route: '/dashboard/crm',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseAvatar', 'BaseBadge', 'BaseProgress'],
        patterns: ['DealKanban', 'WinRate', 'ContactRank'],
        file: 'src/views/dashboard/CrmView.vue',
      },
    ],
  },

  {
    id: 'dash-project',
    title: 'Project Dashboard',
    description: 'Task board, timeline, team workload. Dùng cho project management.',
    category: 'Dashboard',
    tags: ['project', 'kanban', 'gantt', 'tasks'],
    variants: [
      {
        id: 'dash-project-v1',
        label: 'Task board + Gantt + Team load',
        route: '/dashboard/project',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseAvatar', 'BaseBadge', 'BaseProgress'],
        patterns: ['KanbanBoard', 'GanttBar', 'TeamWorkload'],
        file: 'src/views/dashboard/ProjectView.vue',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     AUTH
  ════════════════════════════════════════════════ */
  {
    id: 'auth-login',
    title: 'Login',
    description: 'Đăng nhập với nhiều phong cách bố cục.',
    category: 'Auth',
    tags: ['login', 'signin', 'auth'],
    variants: [
      {
        id: 'login-split',
        label: 'Split — Brand panel + Form',
        description: 'Trái: gradient brand. Phải: form email/password + social.',
        route: '/auth/login',
        status: 'ready',
        mode: 'light',
        components: ['BaseButton', 'BaseInput', 'BaseToggle'],
        patterns: ['SocialLogin', 'RememberMe'],
        file: 'src/views/auth/LoginView.vue',
        prompt: 'Login split: left gradient panel với logo + tagline, right form email + password + remember me + social login (Google/GitHub), forgot link.',
      },
      {
        id: 'login-centered',
        label: 'Full-page — Centered card',
        route: '/auth/login-v2',
        status: 'ready',
        mode: 'light',
        components: ['BaseButton', 'BaseInput', 'BaseCard'],
        patterns: ['AuthCard', 'SocialLogin'],
        file: 'src/views/auth/LoginV2View.vue',
      },
      {
        id: 'login-dark',
        label: 'Dark — Glass morphism',
        status: 'draft',
        mode: 'dark',
        components: ['BaseButton', 'BaseInput'],
        patterns: ['GlassCard'],
        file: 'src/views/auth/LoginDarkView.vue',
      },
    ],
  },

  {
    id: 'auth-register',
    title: 'Register',
    description: 'Đăng ký tài khoản.',
    category: 'Auth',
    tags: ['register', 'signup'],
    variants: [
      {
        id: 'register-multistep',
        label: 'Multi-step wizard',
        route: '/auth/register',
        status: 'ready',
        mode: 'light',
        components: ['BaseButton', 'BaseInput', 'StepProgress'],
        patterns: ['MultiStepForm', 'PasswordStrength'],
        file: 'src/views/auth/RegisterView.vue',
      },
    ],
  },

  {
    id: 'auth-otp',
    title: 'OTP / 2FA',
    description: 'Xác thực 2 yếu tố.',
    category: 'Auth',
    tags: ['otp', '2fa', 'verify'],
    variants: [
      {
        id: 'otp-6digit',
        label: '6-digit + Countdown',
        route: '/auth/otp',
        status: 'ready',
        mode: 'light',
        components: ['BaseButton', 'BaseInput'],
        patterns: ['OtpInput', 'CountdownTimer'],
        file: 'src/views/auth/OtpView.vue',
      },
      {
        id: 'email-verify',
        label: 'Email verification',
        route: '/auth/email-verify',
        status: 'ready',
        mode: 'light',
        components: ['BaseButton'],
        patterns: ['EmailVerifyCard'],
        file: 'src/views/auth/EmailVerifyView.vue',
      },
    ],
  },

  {
    id: 'auth-onboarding',
    title: 'Onboarding',
    description: 'Welcome flow cho user mới.',
    category: 'Auth',
    tags: ['onboarding', 'wizard', 'setup'],
    variants: [
      {
        id: 'onboarding-wizard',
        label: 'Multi-step onboarding',
        route: '/auth/onboarding',
        status: 'ready',
        mode: 'light',
        components: ['BaseButton', 'BaseCard', 'StepProgress'],
        patterns: ['OnboardingStep', 'RolePicker'],
        file: 'src/views/auth/OnboardingView.vue',
      },
      {
        id: 'workspace-picker',
        label: 'Workspace picker',
        route: '/auth/workspace',
        status: 'ready',
        mode: 'light',
        components: ['BaseCard', 'BaseButton', 'BaseAvatar'],
        patterns: ['WorkspaceCard'],
        file: 'src/views/auth/WorkspacePickerView.vue',
      },
    ],
  },

  {
    id: 'auth-recovery',
    title: 'Forgot / Reset Password',
    description: 'Quên mật khẩu và đặt lại.',
    category: 'Auth',
    tags: ['forgot', 'reset', 'recovery'],
    variants: [
      {
        id: 'forgot-email',
        label: 'Forgot — Email input',
        route: '/auth/forgot',
        status: 'ready',
        mode: 'light',
        components: ['BaseButton', 'BaseInput'],
        patterns: ['AuthCard', 'EmailForm'],
        file: 'src/views/auth/ForgotPasswordView.vue',
      },
      {
        id: 'reset-new-pwd',
        label: 'Reset — New password + Strength',
        route: '/auth/reset',
        status: 'ready',
        mode: 'light',
        components: ['BaseButton', 'BaseInput'],
        patterns: ['PasswordStrength', 'AuthCard'],
        file: 'src/views/auth/ResetPasswordView.vue',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     APP PAGES
  ════════════════════════════════════════════════ */
  {
    id: 'app-settings',
    title: 'Settings',
    description: 'Cài đặt nhiều section: profile, security, notifications, billing, danger zone.',
    category: 'App',
    tags: ['settings', 'profile', 'config'],
    variants: [
      {
        id: 'settings-sidebar',
        label: 'Sidebar nav + multi-section form',
        route: '/app/settings',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseInput', 'BaseToggle', 'BaseSelect', 'BaseCard'],
        patterns: ['SettingsSection', 'InlineForm', 'DangerZone'],
        file: 'src/views/app/SettingsView.vue',
        prompt: 'Settings: left sidebar nav 5 mục, mỗi section = BaseCard với form fields, danger zone cuối trang, save/cancel sticky bottom.',
      },
    ],
  },

  {
    id: 'app-profile',
    title: 'Profile',
    description: 'Hồ sơ cá nhân: cover, avatar, bio, stats.',
    category: 'App',
    tags: ['profile', 'user', 'bio'],
    variants: [
      {
        id: 'profile-cover',
        label: 'Cover header + Bio + Stats',
        route: '/app/profile',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseButton', 'BaseAvatar', 'BaseBadge'],
        patterns: ['CoverHeader', 'StatRow', 'ActivityList'],
        file: 'src/views/app/ProfileView.vue',
      },
      {
        id: 'profile-edit',
        label: 'Edit form',
        route: '/app/profile-edit',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseInput', 'BaseCard'],
        patterns: ['AvatarUpload', 'InlineForm'],
        file: 'src/views/app/ProfileEditView.vue',
      },
    ],
  },

  {
    id: 'app-files',
    title: 'File Manager',
    description: 'Quản lý file: grid/list, breadcrumb, upload zone.',
    category: 'App',
    tags: ['files', 'upload', 'storage'],
    variants: [
      {
        id: 'files-main',
        label: 'Grid/List toggle + Upload zone',
        route: '/app/files',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseInput', 'BaseCard'],
        patterns: ['FileGrid', 'Breadcrumb', 'UploadZone'],
        file: 'src/views/app/FileManagerView.vue',
      },
    ],
  },

  {
    id: 'app-wiki',
    title: 'Wiki / Docs',
    description: 'Tài liệu nội bộ: sidebar mục lục, article body.',
    category: 'App',
    tags: ['wiki', 'docs', 'knowledge'],
    variants: [
      {
        id: 'wiki-article',
        label: 'Doc sidebar + Article',
        route: '/app/wiki',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge'],
        patterns: ['DocSidebar', 'ArticleBody', 'Toc'],
        file: 'src/views/app/WikiView.vue',
      },
    ],
  },

  {
    id: 'app-organization',
    title: 'Organization',
    description: 'Quản lý team, phân quyền, mời thành viên.',
    category: 'App',
    tags: ['org', 'team', 'roles', 'members'],
    variants: [
      {
        id: 'org-members',
        label: 'Members table + Role picker',
        route: '/app/organization',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseAvatar', 'BaseBadge', 'BaseButton', 'BaseSelect'],
        patterns: ['MemberTable', 'RolePicker', 'InviteModal'],
        file: 'src/views/app/OrganizationView.vue',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     COMMUNICATION
  ════════════════════════════════════════════════ */
  {
    id: 'com-mailbox',
    title: 'Mailbox',
    description: 'Email client 3-panel: folders / list / detail.',
    category: 'Communication',
    tags: ['email', 'mailbox', '3-panel'],
    variants: [
      {
        id: 'mailbox-3panel',
        label: '3-panel — Folders + List + Detail',
        route: '/app/mailbox',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseInput', 'BaseBadge', 'BaseAvatar'],
        patterns: ['SplitPanel', 'MessageList', 'MessageDetail'],
        file: 'src/views/app/MailboxView.vue',
      },
    ],
  },

  {
    id: 'com-chat',
    title: 'Chat',
    description: 'Messenger: contact list, bubble thread, composer.',
    category: 'Communication',
    tags: ['chat', 'messenger', 'realtime'],
    variants: [
      {
        id: 'chat-messenger',
        label: 'Bubble thread + Contact sidebar',
        route: '/app/chat',
        status: 'ready',
        mode: 'both',
        components: ['BaseInput', 'BaseAvatar', 'BaseBadge', 'BaseButton'],
        patterns: ['MessageBubble', 'ChatSidebar', 'Composer'],
        file: 'src/views/app/ChatView.vue',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     BILLING
  ════════════════════════════════════════════════ */
  {
    id: 'billing-pricing',
    title: 'Pricing',
    description: '3 tier cards, toggle monthly/yearly, feature list.',
    category: 'Billing',
    tags: ['pricing', 'plans', 'tier'],
    variants: [
      {
        id: 'pricing-3tier',
        label: '3-tier + Monthly/Yearly toggle',
        route: '/app/pricing',
        status: 'ready',
        mode: 'light',
        components: ['BaseCard', 'BaseButton', 'BaseBadge', 'BaseToggle'],
        patterns: ['PricingCard', 'PeriodToggle', 'FeatureList'],
        file: 'src/views/app/PricingView.vue',
      },
    ],
  },

  {
    id: 'billing-invoices',
    title: 'Invoices',
    description: 'Danh sách hóa đơn, status badge, tải PDF.',
    category: 'Billing',
    tags: ['invoice', 'billing', 'payment'],
    variants: [
      {
        id: 'invoice-list',
        label: 'Invoice list + status',
        route: '/app/invoices',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseButton'],
        patterns: ['InvoiceList', 'StatusBadge'],
        file: 'src/views/app/InvoiceView.vue',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     LANDING
  ════════════════════════════════════════════════ */
  {
    id: 'landing-saas',
    title: 'SaaS Landing',
    description: 'Marketing page: hero, features, pricing teaser, CTA.',
    category: 'Landing',
    tags: ['landing', 'saas', 'marketing', 'hero'],
    variants: [
      {
        id: 'landing-full',
        label: 'Full SaaS — Hero + Features + CTA',
        route: '/landing',
        status: 'ready',
        mode: 'light',
        components: ['BaseButton', 'BaseCard', 'BaseBadge'],
        patterns: ['HeroSection', 'FeatureGrid', 'CtaBanner'],
        file: 'src/views/landing/LandingSaasView.vue',
      },
      {
        id: 'landing-api',
        label: 'API / Developer landing',
        route: '/landing/api',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseCard'],
        patterns: ['CodeBlock', 'ApiHero'],
        file: 'src/views/landing/LandingApiView.vue',
      },
    ],
  },

  {
    id: 'landing-blog',
    title: 'Blog',
    description: 'Blog list và bài viết chi tiết.',
    category: 'Landing',
    tags: ['blog', 'article', 'cms'],
    variants: [
      {
        id: 'blog-list',
        label: 'Blog list — Card grid',
        route: '/landing/blog',
        status: 'ready',
        mode: 'light',
        components: ['BaseCard', 'BaseBadge', 'BaseButton'],
        patterns: ['BlogCard', 'FeaturedPost'],
        file: 'src/views/landing/BlogListView.vue',
      },
      {
        id: 'blog-post',
        label: 'Article layout',
        route: '/landing/blog/post',
        status: 'ready',
        mode: 'light',
        components: ['BaseCard', 'BaseAvatar', 'BaseBadge'],
        patterns: ['ArticleHeader', 'Toc', 'RelatedPosts'],
        file: 'src/views/landing/BlogPostView.vue',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     ERROR
  ════════════════════════════════════════════════ */
  {
    id: 'error-pages',
    title: 'Error Pages',
    description: '404, 500, 403, 503 Maintenance, Coming Soon, Offline.',
    category: 'Error',
    tags: ['error', '404', '500', 'maintenance'],
    variants: [
      { id: 'err-404', label: '404 — Not found',      route: '/error/404',           status: 'ready', mode: 'both', components: ['BaseButton'], patterns: ['ErrorLayout'], file: 'src/views/error/NotFoundView.vue' },
      { id: 'err-500', label: '500 — Server error',   route: '/error/500',           status: 'ready', mode: 'both', components: ['BaseButton'], patterns: ['ErrorLayout'], file: 'src/views/error/ServerErrorView.vue' },
      { id: 'err-403', label: '403 — Forbidden',      route: '/error/403',           status: 'ready', mode: 'both', components: ['BaseButton'], patterns: ['PermissionBlock'], file: 'src/views/error/ForbiddenView.vue' },
      { id: 'err-503', label: '503 — Maintenance',    route: '/error/503',           status: 'ready', mode: 'both', components: ['BaseButton'], patterns: ['CountdownTimer'], file: 'src/views/error/MaintenanceView.vue' },
      { id: 'err-soon', label: 'Coming Soon',         route: '/error/coming-soon',   status: 'ready', mode: 'both', components: ['BaseButton', 'BaseInput'], patterns: ['CountdownTimer', 'EmailCapture'], file: 'src/views/error/ComingSoonView.vue' },
      { id: 'err-offline', label: 'Offline',          route: '/error/offline',       status: 'ready', mode: 'both', components: ['BaseButton'], patterns: ['OfflineState'], file: 'src/views/error/OfflineView.vue' },
    ],
  },
]

export const CATEGORIES = Object.keys(CATEGORY_META) as LayoutCategory[]

export function totalVariants(): number {
  return layoutPages.reduce((s, p) => s + p.variants.length, 0)
}

export function totalPages(): number {
  return layoutPages.length
}
