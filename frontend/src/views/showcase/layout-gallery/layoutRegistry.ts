export type LayoutMode   = 'light' | 'dark' | 'both'
export type LayoutStatus = 'ready' | 'draft'

export type LayoutCategory =
  | 'WeConnect'      // Facebook automation platform — full tool set
  | 'WeDashboard'    // WeConnect KPI dashboard
  | 'ChartDashboard' // Analytics & chart-heavy dashboards
  | 'Dashboard'      // Full comprehensive dashboard layouts
  | 'PageTemplates'  // Auth, App, Landing, Error standalone pages
  | 'Forms'          // Form templates — basic, advanced, modal & drawer

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
  /** Sub-group trong category (WeConnect: 'WeConnect'|'Hệ thống', PageTemplates: 'Auth'|'App'|'Communication'|'Billing'|'Landing'|'Error') */
  group?: string
  variants: LayoutVariant[]
  tags?: string[]
}

export const CATEGORY_META: Record<LayoutCategory, { color: string; label: string; desc: string }> = {
  WeConnect:     { color: '#8b5cf6', label: 'WeConnect',       desc: 'Nền tảng automation — tài khoản, chiến dịch, datagrid, context menu, statusbar' },
  WeDashboard:   { color: '#2563eb', label: 'KPI Dashboard',   desc: 'KPI cards, sparkline, activity feed — dashboard tổng quan hệ thống WeConnect' },
  ChartDashboard:{ color: '#0ea5e9', label: 'Phân tích',       desc: 'Analytics, Finance, Ecommerce, CRM, Project — dashboard nặng biểu đồ' },
  Dashboard:     { color: '#f59e0b', label: 'Tổng hợp',        desc: 'Dashboard đa năng với KPI, area chart, activity feed, top list' },
  PageTemplates: { color: '#6366f1', label: 'Trang đơn',       desc: 'Auth · App · Billing · Landing · Error — các trang độc lập tiêu chuẩn' },
  Forms:         { color: '#f97316', label: 'Form mẫu',        desc: 'Controls, validation, wizard, file upload, modal & drawer — form patterns đầy đủ' },
}

export const layoutPages: LayoutPage[] = [

  /* ════════════════════════════════════════════════
     WECONNECT — Facebook automation platform
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
        route: '/dashboard/weconnect-v1',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'Sparkline'],
        patterns: ['KpiGrid', 'SparklineCard', 'ActivityFeed'],
        file: 'src/views/dashboard/WeDashboardV1View.vue',
        prompt: 'WeConnect dashboard: 4 KPI cards (Tài khoản hoạt động / Phiên kết nối hôm nay / Chiến dịch đang chạy / Tỷ lệ giao thành công), mỗi card có sparkline 24h, bên dưới là activity feed với màu theo type (campaign/account/plugin/error/session).',
      },
    ],
  },

  {
    id: 'wc-accounts',
    title: 'Tài khoản',
    description: 'Quản lý tài khoản Facebook: kết nối, trạng thái, tìm kiếm, bulk action, context menu 14 nhóm.',
    category: 'WeConnect',
    group: 'WeConnect',
    tags: ['accounts', 'facebook', 'datagrid', 'context-menu'],
    variants: [
      {
        id: 'wc-accounts-table',
        label: 'DataGrid + MenuStrip + ActionBar + StatusBar',
        description: 'Bảng tài khoản virtual scroll, badge trạng thái, context menu 14 nhóm, 10 modal.',
        route: '/weconnect',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseBadge', 'BaseDataGrid', 'BaseInput'],
        patterns: ['AccountTable', 'StatusBadge', 'ContextMenu', 'SearchBar', 'StatusBar'],
        file: 'src/views/weconnect/AdminView.vue',
        prompt: 'Accounts table: MenuStrip 6 mục, ActionBar run/stop + search + category, DataGrid virtual scroll với context menu 14 nhóm, StatusBar tổng kết.',
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
        components: ['BaseButton', 'BaseSelectMenu', 'BaseBadge', 'BaseProgress', 'FormModal', 'ConfirmDialog', 'BulkActionBar'],
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
        components: ['BaseButton', 'BaseInput', 'BaseSelectMenu', 'BaseBadge', 'FormModal', 'FormDrawer', 'ConfirmDialog', 'BulkActionBar'],
        patterns: ['FullCRUD', 'MultiSelect', 'RowActionsOnHover', 'DetailDrawer', 'BulkDelete'],
        file: 'src/views/weconnect/ContactsView.vue',
        prompt: 'Contacts CRUD: search + filter, checkbox multi-select, row actions (edit/delete) chỉ hiện khi hover, Add modal, Edit modal, Detail drawer có "Chỉnh sửa" button, Delete confirm dialog, Bulk action bar.',
      },
    ],
  },

  {
    id: 'wc-sessions',
    title: 'Phiên kết nối',
    description: 'Giám sát session đang hoạt động realtime: uptime, tin nhắn đã gửi, thiết bị, trạng thái.',
    category: 'WeConnect',
    group: 'WeConnect',
    tags: ['sessions', 'realtime', 'monitor'],
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
        components: ['BaseButton', 'BaseSelectMenu', 'BaseBadge'],
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
        components: ['BaseButton', 'BaseBadge', 'BaseCard', 'BaseSelectMenu'],
        patterns: ['FlowNode', 'NodeConnector', 'TriggerNode', 'ActionNode', 'ConditionNode'],
        file: 'src/views/weconnect/AutomationCanvasView.vue',
        prompt: 'Automation canvas: toolbar trên (zoom/undo/save), canvas infinite scroll, node types: Trigger (xanh) / Condition (vàng) / Action (tím), kéo thả từ panel bên trái, kết nối bằng bezier curve.',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     WEDASHBOARD — WeDashboard branded KPI templates
  ════════════════════════════════════════════════ */
  {
    id: 'dash-weconnect',
    title: 'WeConnect Dashboard',
    description: 'Dashboard overview cho hệ thống Facebook automation: KPI cards với sparkline, quick stats, activity feed.',
    category: 'WeDashboard',
    tags: ['dashboard', 'kpi', 'sparkline', 'messaging', 'facebook'],
    variants: [
      {
        id: 'dash-weconnect-v1',
        label: 'KPI 4-col + Quick stats + Activity feed',
        description: '4 KPI cards (tài khoản / phiên / chiến dịch / tỷ lệ giao), sparkline 24h, recent activity feed, quick stats panel.',
        route: '/dashboard/weconnect-v1',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'Sparkline'],
        patterns: ['KpiGrid', 'SparklineCard', 'ActivityFeed', 'QuickStats'],
        file: 'src/views/dashboard/WeDashboardV1View.vue',
        prompt: 'WeConnect dashboard v1: 4 KPI cards với sparkline 24h (Tài khoản hoạt động / Phiên kết nối hôm nay / Chiến dịch đang chạy / Tỷ lệ giao thành công), bên dưới 2 cột: trái là activity feed với màu dot theo type, phải là quick stats (Tổng TK / Chiến dịch hoàn thành / Tin nhắn đã gửi / Uptime).',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     CHART DASHBOARD — Analytics & chart-heavy
  ════════════════════════════════════════════════ */
  {
    id: 'dash-analytics',
    title: 'Analytics Dashboard',
    description: 'Phân tích traffic, funnel conversion, retention, cohort. Dùng cho SaaS/web product.',
    category: 'ChartDashboard',
    tags: ['analytics', 'chart', 'funnel', 'retention'],
    variants: [
      {
        id: 'dash-analytics-v1',
        label: 'Charts focus — Line + Bar + Funnel',
        route: '/dashboard/analytics',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseSelectMenu'],
        patterns: ['LineChart', 'BarChart', 'FunnelChart', 'DateRangeFilter'],
        file: 'src/views/dashboard/AnalyticsView.vue',
      },
    ],
  },

  {
    id: 'dash-finance',
    title: 'Finance Dashboard',
    description: 'Doanh thu, P&L, budget so thực tế, cash flow. Dùng cho finance/accounting team.',
    category: 'ChartDashboard',
    tags: ['finance', 'revenue', 'pnl', 'budget'],
    variants: [
      {
        id: 'dash-finance-v1',
        label: 'Revenue + P&L + Budget bars',
        route: '/dashboard/finance',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseBadge', 'BaseSelectMenu'],
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
    category: 'ChartDashboard',
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
    category: 'ChartDashboard',
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
    category: 'ChartDashboard',
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
     DASHBOARD — Full comprehensive layouts
  ════════════════════════════════════════════════ */
  {
    id: 'dash-overview',
    title: 'Overview Dashboard',
    description: 'Dashboard tổng hợp: KPI, area chart, activity feed, top list. Dùng cho business overview.',
    category: 'Dashboard',
    tags: ['overview', 'kpi', 'activity', 'stats'],
    variants: [
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

  /* ════════════════════════════════════════════════
     PAGE TEMPLATES — Standalone pages
  ════════════════════════════════════════════════ */

  /* Auth group */
  {
    id: 'auth-login',
    title: 'Login',
    description: 'Đăng nhập với nhiều phong cách bố cục.',
    category: 'PageTemplates',
    group: 'Auth',
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
        id: 'login-v3',
        label: 'Centered — Animated Login / Sign up switch',
        description: 'Form căn giữa với segmented switch, bidirectional slide animation, toast state.',
        route: '/auth/login-v3',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseInput', 'BaseCheckbox', 'FormField'],
        patterns: ['SegmentedSwitch', 'AnimatedFormTransition', 'FormValidation', 'ToastFeedback'],
        file: 'src/views/auth/LoginV3View.vue',
        prompt: 'LoginV3: form căn giữa, segmented switch Login/Đăng ký, animation trượt 2 chiều (login→signup forward, signup→login backward), validate inline, toast success/error, social buttons, reduced-motion support.',
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
    category: 'PageTemplates',
    group: 'Auth',
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
    category: 'PageTemplates',
    group: 'Auth',
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
    category: 'PageTemplates',
    group: 'Auth',
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
    category: 'PageTemplates',
    group: 'Auth',
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

  /* App group */
  {
    id: 'app-settings',
    title: 'Settings',
    description: 'Cài đặt nhiều section: profile, security, notifications, billing, danger zone.',
    category: 'PageTemplates',
    group: 'App',
    tags: ['settings', 'profile', 'config'],
    variants: [
      {
        id: 'settings-sidebar',
        label: 'Sidebar nav + multi-section form',
        route: '/app/settings',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseInput', 'BaseToggle', 'BaseSelectMenu', 'BaseCard'],
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
    category: 'PageTemplates',
    group: 'App',
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
    category: 'PageTemplates',
    group: 'App',
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
    category: 'PageTemplates',
    group: 'App',
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
    category: 'PageTemplates',
    group: 'App',
    tags: ['org', 'team', 'roles', 'members'],
    variants: [
      {
        id: 'org-members',
        label: 'Members table + Role picker',
        route: '/app/organization',
        status: 'ready',
        mode: 'both',
        components: ['BaseCard', 'BaseAvatar', 'BaseBadge', 'BaseButton', 'BaseSelectMenu'],
        patterns: ['MemberTable', 'RolePicker', 'InviteModal'],
        file: 'src/views/app/OrganizationView.vue',
      },
    ],
  },

  /* Communication group */
  {
    id: 'com-mailbox',
    title: 'Mailbox',
    description: 'Email client 3-panel: folders / list / detail.',
    category: 'PageTemplates',
    group: 'Communication',
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
    category: 'PageTemplates',
    group: 'Communication',
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

  /* Billing group */
  {
    id: 'billing-pricing',
    title: 'Pricing',
    description: '3 tier cards, toggle monthly/yearly, feature list.',
    category: 'PageTemplates',
    group: 'Billing',
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
    category: 'PageTemplates',
    group: 'Billing',
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

  /* Landing group */
  {
    id: 'landing-saas',
    title: 'SaaS Landing',
    description: 'Marketing page: hero, features, pricing teaser, CTA.',
    category: 'PageTemplates',
    group: 'Landing',
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
    category: 'PageTemplates',
    group: 'Landing',
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

  /* Error group */
  {
    id: 'error-pages',
    title: 'Error Pages',
    description: '404, 500, 403, 503 Maintenance, Coming Soon, Offline.',
    category: 'PageTemplates',
    group: 'Error',
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
  /* Showcase group */
  {
    id: 'showcase-animations',
    title: 'Animation System',
    description: 'Motion tokens, Vue Transition patterns, hover effects, loading states, form feedback — tham chiếu và demo live.',
    category: 'PageTemplates',
    group: 'Showcase',
    tags: ['animation', 'motion', 'transition', 'hover', 'skeleton', 'loading'],
    variants: [
      {
        id: 'animations-v1',
        label: 'Motion reference — tokens + live demo',
        description: 'Toàn bộ animation patterns với live preview, code copy, token badges.',
        route: '/showcase/animations',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton', 'BaseSpinner', 'BaseSkeleton'],
        patterns: ['MotionTokens', 'VueTransition', 'HoverEffect', 'LoadingState', 'FormFeedback', 'ReducedMotion'],
        file: 'src/views/showcase/AnimationShowcase.vue',
        prompt: 'Animation showcase: motion token table (d-*/ease-*), Vue Transition demos (fade/scale/slide-up/drawer), CSS hover effects, skeleton shimmer/pulse, error shake, success check SVG animation. Mỗi item có live preview + code snippet + reduced-motion note.',
      },
    ],
  },

  /* ════════════════════════════════════════════════
     FORMS — Phoenix-style form templates
     Sub-groups: Basic / Advanced / Modal & Drawer
  ════════════════════════════════════════════════ */

  /* Basic group */
  {
    id: 'form-control',
    title: 'Form Controls',
    description: 'Tất cả form controls cơ bản: input, textarea, select, toggle, checkbox. Reference khi xây dựng form.',
    category: 'Forms',
    group: 'Basic',
    tags: ['input', 'textarea', 'select', 'toggle', 'checkbox', 'form'],
    variants: [
      {
        id: 'form-control-v1',
        label: 'All controls — states + sizes',
        description: 'Text inputs, textarea, select, toggle. States: default/disabled/readonly/error/hint. Sizes: sm/md/lg.',
        route: '/forms/control',
        status: 'ready',
        mode: 'both',
        components: ['BaseInput', 'BaseTextarea', 'BaseSelectMenu', 'BaseToggle', 'FormField', 'BaseButton'],
        patterns: ['FormLayout', 'FieldState', 'SizeVariant', 'FocusGlow'],
        file: 'src/views/forms/FormControlView.vue',
      },
    ],
  },

  {
    id: 'form-input-group',
    title: 'Input Groups',
    description: 'Input với icon/text prefix/suffix và button addon. CSS-only pattern, không cần component riêng.',
    category: 'Forms',
    group: 'Basic',
    tags: ['input-group', 'addon', 'prefix', 'suffix', 'icon', 'password'],
    variants: [
      {
        id: 'input-group-v1',
        label: 'Icon prefix · Text prefix · Suffix button · Password toggle',
        route: '/forms/input-group',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton'],
        patterns: ['InputAddon', 'IconPrefix', 'ButtonSuffix', 'PrefixSuffix', 'PasswordToggle'],
        file: 'src/views/forms/InputGroupView.vue',
      },
    ],
  },

  {
    id: 'form-select',
    title: 'Select',
    description: 'BaseSelectMenu với nhiều kiểu dữ liệu, placeholder, states và size variants.',
    category: 'Forms',
    group: 'Basic',
    tags: ['select', 'dropdown', 'options', 'placeholder'],
    variants: [
      {
        id: 'select-v1',
        label: 'Country · Timezone · Role · Currency — sizes + states',
        route: '/forms/select',
        status: 'ready',
        mode: 'both',
        components: ['BaseSelectMenu', 'FormField'],
        patterns: ['SelectOptions', 'Placeholder', 'SizeVariant', 'DisabledState'],
        file: 'src/views/forms/SelectView.vue',
      },
    ],
  },

  {
    id: 'form-checks',
    title: 'Checks, Radio & Toggle',
    description: 'Checkbox list với mô tả, radio group dọc/ngang, toggle switches — phổ biến trong form cài đặt.',
    category: 'Forms',
    group: 'Basic',
    tags: ['checkbox', 'radio', 'toggle', 'permissions', 'notifications'],
    variants: [
      {
        id: 'checks-v1',
        label: 'Checkbox list · Radio vertical/horizontal · Toggle list',
        route: '/forms/checks',
        status: 'ready',
        mode: 'both',
        components: ['BaseCheckbox', 'BaseRadio', 'BaseToggle', 'FormField'],
        patterns: ['CheckList', 'RadioGroup', 'ToggleList'],
        file: 'src/views/forms/ChecksView.vue',
      },
    ],
  },

  {
    id: 'form-floating-labels',
    title: 'Floating Labels',
    description: 'Label trôi lên khi focus/có nội dung — CSS-only với :placeholder-shown + :focus.',
    category: 'Forms',
    group: 'Basic',
    tags: ['floating-label', 'css-only', 'placeholder-shown', 'animation'],
    variants: [
      {
        id: 'floating-v1',
        label: 'Input · Email · Phone · Select · Textarea',
        route: '/forms/floating-labels',
        status: 'ready',
        mode: 'both',
        components: [],
        patterns: ['FloatingLabel', 'CssOnly', 'placeholder-shown', 'FocusGlow'],
        file: 'src/views/forms/FloatingLabelsView.vue',
      },
    ],
  },

  /* Advanced group */
  {
    id: 'form-validation',
    title: 'Form Validation',
    description: 'Client-side validation với error shake, password strength meter và success check SVG animation.',
    category: 'Forms',
    group: 'Advanced',
    tags: ['validation', 'error', 'shake', 'password-strength', 'success-check'],
    variants: [
      {
        id: 'validation-v1',
        label: 'Error shake · Password strength · Success check',
        route: '/forms/validation',
        status: 'ready',
        mode: 'both',
        components: ['BaseInput', 'FormField', 'BaseButton'],
        patterns: ['ErrorShake', 'PasswordStrength', 'SuccessCheck', 'SubmitValidation'],
        file: 'src/views/forms/ValidationView.vue',
      },
    ],
  },

  {
    id: 'form-wizard',
    title: 'Multi-step Wizard',
    description: 'Form nhiều bước với step indicator, slide transition có chiều. Phổ biến cho onboarding, checkout.',
    category: 'Forms',
    group: 'Advanced',
    tags: ['wizard', 'multi-step', 'stepper', 'onboarding', 'transition'],
    variants: [
      {
        id: 'wizard-v1',
        label: '3-step — Info → Settings → Confirm',
        route: '/forms/wizard',
        status: 'ready',
        mode: 'both',
        components: ['BaseInput', 'BaseSelectMenu', 'BaseToggle', 'FormField', 'BaseButton'],
        patterns: ['MultiStepWizard', 'DirectionTransition', 'StepIndicator', 'ReviewStep'],
        file: 'src/views/forms/WizardView.vue',
      },
    ],
  },

  {
    id: 'form-file-upload',
    title: 'File Upload',
    description: 'Drag & drop zone, progress bar giả lập, danh sách file theo loại. Thuần HTML5 + CSS.',
    category: 'Forms',
    group: 'Advanced',
    tags: ['file-upload', 'drag-drop', 'progress', 'dropzone'],
    variants: [
      {
        id: 'file-upload-v1',
        label: 'Drop zone + Progress + File list',
        route: '/forms/file-upload',
        status: 'ready',
        mode: 'both',
        components: ['BaseButton'],
        patterns: ['DragDrop', 'FileInput', 'ProgressBar', 'TransitionGroup'],
        file: 'src/views/forms/FileUploadView.vue',
      },
    ],
  },

  /* Modal & Drawer group */
  {
    id: 'form-add-modal',
    title: 'Add Modal Form',
    description: 'Data table + BaseModal thêm mới. Pattern CRUD chuẩn — modal với form nhập liệu + loading state.',
    category: 'Forms',
    group: 'Modal & Drawer',
    tags: ['modal', 'add', 'crud', 'create', 'table'],
    variants: [
      {
        id: 'add-modal-v1',
        label: 'Members table + Add modal',
        route: '/forms/add-modal',
        status: 'ready',
        mode: 'both',
        components: ['BaseModal', 'BaseInput', 'BaseSelectMenu', 'FormField', 'BaseButton'],
        patterns: ['AddModal', 'DataTable', 'LoadingState', 'CRUDCreate'],
        file: 'src/views/forms/AddModalFormView.vue',
      },
    ],
  },

  {
    id: 'form-edit-modal',
    title: 'Edit Modal Form',
    description: 'Click hàng mở modal pre-populated + nút Xóa với confirm dialog riêng.',
    category: 'Forms',
    group: 'Modal & Drawer',
    tags: ['modal', 'edit', 'crud', 'update', 'delete', 'confirm'],
    variants: [
      {
        id: 'edit-modal-v1',
        label: 'Products table + Edit modal + Delete confirm',
        route: '/forms/edit-modal',
        status: 'ready',
        mode: 'both',
        components: ['BaseModal', 'BaseInput', 'BaseSelectMenu', 'FormField', 'BaseButton'],
        patterns: ['EditModal', 'ConfirmDelete', 'PrePopulate', 'CRUDUpdate'],
        file: 'src/views/forms/EditModalFormView.vue',
      },
    ],
  },

  {
    id: 'form-drawer',
    title: 'Drawer Form',
    description: 'Settings card + BaseDrawer từ bên phải. Phù hợp cho cài đặt chi tiết không che khuất nội dung.',
    category: 'Forms',
    group: 'Modal & Drawer',
    tags: ['drawer', 'settings', 'slide-in', 'panel'],
    variants: [
      {
        id: 'drawer-v1',
        label: 'Settings card + Drawer from right',
        route: '/forms/drawer-form',
        status: 'ready',
        mode: 'both',
        components: ['BaseDrawer', 'BaseInput', 'BaseSelectMenu', 'BaseToggle', 'BaseTextarea', 'FormField'],
        patterns: ['DrawerForm', 'SettingsPanel', 'FooterSlot', 'SlideinPanel'],
        file: 'src/views/forms/DrawerFormView.vue',
      },
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
