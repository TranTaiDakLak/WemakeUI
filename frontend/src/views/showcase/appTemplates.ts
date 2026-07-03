/**
 * appTemplates — các "bộ giao diện" theo sản phẩm / luồng.
 *
 * Khác với `layoutRegistry` (mỗi entry = 1 TRANG lẻ), mỗi entry ở đây là một
 * NHÓM có chủ đích. Có 2 loại:
 *   - kind 'app'        : sản phẩm thật có app shell + navigation trỏ đúng route
 *                         (mở `entry` rồi đi lại giữa các trang qua sidebar/header).
 *   - kind 'collection' : bộ màn ĐỘC LẬP (auth, error) — không có nav giữa các
 *                         màn; mỗi màn hiển thị riêng khi có sự kiện, nên ta liệt
 *                         kê từng màn để mở trực tiếp.
 *
 * Số trang đã đối chiếu với router.
 */
export interface AppScreen {
  label: string
  path: string
}

export interface AppTemplate {
  id: string
  name: string
  desc: string
  kind: 'app' | 'collection'
  /** route điểm vào (mở app). Với collection: màn tiêu biểu. */
  entry: string
  /** số trang/màn trong nhóm (đã khớp router) */
  pages: number
  /** danh sách màn — bắt buộc cho collection (để mở từng màn) */
  screens?: AppScreen[]
  /** nhóm/loại */
  category: string
  /** app shell dùng chung */
  shell: string
  icon: string
  accent: string
  highlights: string[]
}

export const appTemplates: AppTemplate[] = [
  {
    id: 'saas-admin',
    name: 'SaaS Admin',
    desc: 'Bảng điều khiển quản trị SaaS: dashboard KPI, thành viên, sản phẩm, giao dịch, thống kê, phiên bản, cài đặt — sidebar điều hướng đầy đủ.',
    kind: 'app',
    entry: '/saas/dashboard',
    pages: 7,
    category: 'Internal tool',
    shell: 'SaasLayout',
    icon: '📊',
    accent: '#2563eb',
    highlights: ['Sidebar nav', 'KPI dashboard', 'CRUD bảng', 'Auth guard'],
  },
  {
    id: 'wemakeui-platform',
    name: 'WemakeUI Platform',
    desc: 'Nền tảng tự động hoá messaging: tài khoản, phiên kết nối, chiến dịch, danh bạ, plugin, console log, lịch tác vụ, tích hợp, automation canvas.',
    kind: 'app',
    entry: '/wemakeui',
    pages: 10,
    category: 'SaaS app',
    shell: 'AppPageLayout · wemakeui',
    icon: '🤖',
    accent: '#7c3aed',
    highlights: ['DataGrid + context menu', 'Realtime console', 'Automation canvas', 'Scheduler'],
  },
  {
    id: 'app-suite',
    name: 'App Suite',
    desc: 'Bộ trang ứng dụng người dùng: hồ sơ, cài đặt, hộp thư, chat, thông báo, hoá đơn, tệp, wiki, lịch, bản đồ, API key, audit log…',
    kind: 'app',
    entry: '/app/profile',
    pages: 21,
    category: 'Application',
    shell: 'AppPageLayout · app',
    icon: '🧩',
    accent: '#0891b2',
    highlights: ['21 trang', 'Sidebar theo nhóm', 'Mailbox 3 cột', 'Chat realtime'],
  },
  {
    id: 'dashboard-suite',
    name: 'Dashboard Suite',
    desc: '12 dashboard theo ngành: tổng quan, analytics, e-commerce, CRM, dự án, tài chính, SaaS, logistics, helpdesk, IoT — chung shell điều hướng.',
    kind: 'app',
    entry: '/dashboard/overview',
    pages: 12,
    category: 'Dashboard',
    shell: 'AppPageLayout · dashboards',
    icon: '📈',
    accent: '#059669',
    highlights: ['12 ngành', 'Charts thuần SVG', 'KPI + sparkline', 'Heatmap / funnel'],
  },
  {
    id: 'marketing-site',
    name: 'Marketing Site',
    desc: 'Website giới thiệu sản phẩm: trang chủ, danh sách & chi tiết sản phẩm, FAQ, đối tác, liên hệ — header điều hướng RouterLink đầy đủ.',
    kind: 'app',
    entry: '/home',
    pages: 6,
    category: 'Marketing',
    shell: 'MarketingHeader',
    icon: '🌐',
    accent: '#e11d48',
    highlights: ['Header nav', 'Hero + features', 'Partner loop', 'Contact form'],
  },
  {
    id: 'landing-pages',
    name: 'Landing Pages',
    desc: 'Bộ trang landing/marketing: SaaS home, about, blog, changelog, careers, policy, API docs, features, contact — header + footer điều hướng.',
    kind: 'app',
    entry: '/landing',
    pages: 10,
    category: 'Landing',
    shell: 'LandingLayout',
    icon: '🚀',
    accent: '#d97706',
    highlights: ['Header + footer nav', 'Blog + bài viết', 'Changelog', 'Sticky TOC'],
  },
  {
    id: 'auth-flow',
    name: 'Auth Flow',
    desc: 'Bộ màn xác thực độc lập (không có nav chung): login 3 biến thể, đăng ký wizard, quên/đặt lại mật khẩu, OTP/2FA, xác minh email, lock, onboarding, workspace.',
    kind: 'collection',
    entry: '/auth/login',
    pages: 11,
    screens: [
      { label: 'Login', path: '/auth/login' },
      { label: 'Login v2', path: '/auth/login-v2' },
      { label: 'Login v3', path: '/auth/login-v3' },
      { label: 'Đăng ký', path: '/auth/register' },
      { label: 'Quên mật khẩu', path: '/auth/forgot' },
      { label: 'Đặt lại mật khẩu', path: '/auth/reset' },
      { label: 'OTP / 2FA', path: '/auth/otp' },
      { label: 'Xác minh email', path: '/auth/email-verify' },
      { label: 'Lock screen', path: '/auth/lock' },
      { label: 'Onboarding', path: '/auth/onboarding' },
      { label: 'Chọn workspace', path: '/auth/workspace' },
    ],
    category: 'Authentication',
    shell: 'AuthLayout',
    icon: '🔐',
    accent: '#4f46e5',
    highlights: ['Bộ màn độc lập', 'OTP auto-advance', 'Strength meter', 'Onboarding wizard'],
  },
  {
    id: 'error-pages',
    name: 'Error Pages',
    desc: 'Bộ màn lỗi/trạng thái độc lập (mỗi màn hiển thị riêng khi có sự kiện, không có nav giữa các màn): 404, 500, 403, 503, offline, under-construction, coming-soon.',
    kind: 'collection',
    entry: '/error/404',
    pages: 7,
    screens: [
      { label: '404 — Not Found', path: '/error/404' },
      { label: '500 — Server Error', path: '/error/500' },
      { label: '403 — Forbidden', path: '/error/403' },
      { label: '503 — Maintenance', path: '/error/503' },
      { label: 'Offline', path: '/error/offline' },
      { label: 'Under Construction', path: '/error/under-construction' },
      { label: 'Coming Soon', path: '/error/coming-soon' },
    ],
    category: 'System',
    shell: 'ErrorLayout',
    icon: '⚠️',
    accent: '#dc2626',
    highlights: ['Bộ màn độc lập', 'Maintenance ETA', 'Offline queue', 'Coming-soon countdown'],
  },
]

export const totalAppTemplates = appTemplates.length
export const totalAppPages = appTemplates.reduce((s, a) => s + a.pages, 0)
export const totalApps = appTemplates.filter(a => a.kind === 'app').length
export const totalCollections = appTemplates.filter(a => a.kind === 'collection').length
