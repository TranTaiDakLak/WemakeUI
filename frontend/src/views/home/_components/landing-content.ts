/**
 * Nội dung tĩnh cho trang chủ MindUI (LandingView). Toàn bộ là dữ liệu demo —
 * không gọi API, không có số liệu người dùng thật.
 */

export const BRAND = { name: 'MindUI', tagline: 'UI kit Vue 3 đa nền tảng' } as const

export const GITHUB_URL = 'https://github.com/TranTaiDakLak/MindUI'

export interface NavLink { label: string; target: string }

/** target: id section trong trang (cuộn mượt) hoặc route bắt đầu bằng "/" */
export const NAV_LINKS: NavLink[] = [
  { label: 'Tính năng',    target: 'lp-modules' },
  { label: 'Bộ giao diện', target: 'lp-apps' },
  { label: 'Quy trình',    target: 'lp-workflow' },
  { label: 'Bảng giá',     target: 'lp-pricing' },
  { label: 'Tài liệu',     target: '/docs' },
]

/* ── Mockup sản phẩm ───────────────────────────────────── */
export type MockStatus = 'live' | 'review' | 'paused' | 'error'

export const STATUS_LABEL: Record<MockStatus, string> = {
  live: 'Đang chạy',
  review: 'Chờ duyệt',
  paused: 'Tạm dừng',
  error: 'Lỗi kết nối',
}

export const MOCK_TABLE = {
  title: 'Mind Workspace — Tài khoản',
  tabs: ['Tài khoản', 'Chiến dịch', 'Phiên', 'Danh bạ'],
  search: 'Tìm theo tên hoặc mã…',
  addButton: 'Thêm tài khoản',
  columns: ['STT', 'Tài khoản', 'Loại', 'Trạng thái', 'Số dư', ''],
  rows: [
    { stt: 1, name: 'Zalo OA — Cửa hàng An', id: 'acc_zl_0412', kind: 'Zalo', status: 'live' as MockStatus, balance: '12.480.000đ' },
    { stt: 2, name: 'WhatsApp — Hỗ trợ VN', id: 'acc_wa_0099', kind: 'WhatsApp', status: 'live' as MockStatus, balance: '8.215.000đ' },
    { stt: 3, name: 'Telegram — Cộng đồng', id: 'acc_tg_0307', kind: 'Telegram', status: 'review' as MockStatus, balance: '0đ' },
    { stt: 4, name: 'Viber — Bán lẻ', id: 'acc_vb_0188', kind: 'Viber', status: 'paused' as MockStatus, balance: '3.940.000đ' },
    { stt: 5, name: 'Zalo OA — Chi nhánh 2', id: 'acc_zl_0521', kind: 'Zalo', status: 'error' as MockStatus, balance: '1.020.000đ' },
  ],
  quickActions: ['Kết nối lại', 'Tạm dừng', 'Chia sẻ quyền'],
  budget: [
    { label: 'Đang chạy', value: '103.430.000đ' },
    { label: 'Chờ duyệt', value: '0đ' },
    { label: 'Còn lại', value: '4.780.000đ' },
  ],
}

/* ── 4 mô-đun cốt lõi ─────────────────────────────────── */
export type Tone = 'brand' | 'success' | 'violet' | 'warning'

export interface CoreModule {
  key: string
  tone: Tone
  icon: string
  title: string
  subtitle: string
  features: string[]
  to: string
}

const ic = (paths: string) =>
  `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`

export const CORE_MODULES: CoreModule[] = [
  {
    key: 'form',
    tone: 'brand',
    icon: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/>'),
    title: 'Form & nhập liệu',
    subtitle: 'Input, select, wizard, upload',
    features: ['Input, textarea, select tuỳ biến', 'Validation + thông báo lỗi tiếng Việt', 'Wizard nhiều bước, drawer & modal form'],
    to: '/forms/control',
  },
  {
    key: 'data',
    tone: 'success',
    icon: ic('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>'),
    title: 'Dữ liệu & biểu đồ',
    subtitle: 'DataGrid, filter, chart',
    features: ['DataGrid ảo hoá, chọn nhiều, sắp xếp', 'FilterBuilder + thanh bộ lọc đang áp dụng', 'Chart, sparkline, KPI card'],
    to: '/showcase/data',
  },
  {
    key: 'shell',
    tone: 'violet',
    icon: ic('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/>'),
    title: 'Shell & layout',
    subtitle: 'Rail, topbar, profile, banner',
    features: ['Sidebar thu gọn, tooltip, phím tắt Alt+B', 'Topbar gradient + menu tài khoản', 'AppShell 3 biến thể: sidebar, topnav, split'],
    to: '/showcase/shell/sidebar',
  },
  {
    key: 'platform',
    tone: 'warning',
    icon: ic('<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'),
    title: 'Đa nền tảng',
    subtitle: 'Web · Mobile · Desktop',
    features: ['Titlebar desktop có fallback no-op', 'BottomSheet, SafeArea cho mobile', 'Banner offline & hàng đợi đồng bộ'],
    to: '/showcase/platform',
  },
]

/* ── Quy trình 5 bước ──────────────────────────────────── */
export const WORKFLOW = {
  title: 'Từ cài đặt đến ship trong 5 bước',
  steps: [
    { no: '01', icon: ic('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'), title: 'Cài đặt', description: 'npm install @mind/ui — chỉ cần vue làm peer dependency.' },
    { no: '02', icon: ic('<path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>'), title: 'Nạp style', description: 'Import style.css một lần ở app root để có token & dark mode.' },
    { no: '03', icon: ic('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>'), title: 'Dựng shell', description: 'AppShell + AppSidebar + AppTopbar — khung ứng dụng sẵn sàng.' },
    { no: '04', icon: ic('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'), title: 'Ghép màn hình', description: 'Chọn archetype CRUD, dashboard, auth rồi chỉnh theo nghiệp vụ.' },
    { no: '05', icon: ic('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>'), title: 'Ship', description: 'build:lib ra ESM + UMD + d.ts, tree-shake gọn cho production.' },
  ],
}

/* ── Chọn nhiều, xử lý một lần ─────────────────────────── */
export const BULK = {
  title: 'Chọn nhiều, xử lý một lần',
  description:
    'BulkActionBar, DataGridPro và useSelection cho phép chọn hàng loạt rồi áp dụng một hành động — kèm xác nhận, tiến trình và hoàn tác.',
  cta: 'Xem DataGrid trực tiếp',
  selectedTitle: 'Đã chọn',
  selected: [
    { name: 'Zalo OA — Cửa hàng An', id: 'acc_zl_0412' },
    { name: 'WhatsApp — Hỗ trợ VN', id: 'acc_wa_0099' },
    { name: 'Viber — Bán lẻ', id: 'acc_vb_0188' },
  ],
  actionsTitle: 'Hành động',
  actions: ['Kết nối lại', 'Tạm dừng', 'Gắn nhãn', 'Xuất CSV'],
  runLabel: 'Thực hiện',
}

/* ── Bảng giá hỗ trợ ───────────────────────────────────── */
export interface Plan {
  key: string
  name: string
  tagline: string
  monthly: number | null
  yearly: number | null
  highlight?: boolean
  badge?: string
  cta: string
  features: string[]
}

export const PLANS: Plan[] = [
  {
    key: 'community',
    name: 'Community',
    tagline: 'Dùng thử và dự án cá nhân',
    monthly: 0,
    yearly: 0,
    cta: 'Bắt đầu miễn phí',
    features: ['Toàn bộ component (MIT)', 'Tài liệu & Demo Lab', 'Hỗ trợ qua GitHub Issues'],
  },
  {
    key: 'team',
    name: 'Team',
    tagline: 'Đội sản phẩm 3–20 người',
    monthly: 490000,
    yearly: 4900000,
    highlight: true,
    badge: 'Phổ biến',
    cta: 'Dùng thử 14 ngày',
    features: ['Mọi thứ trong Community', 'Bộ giao diện hoàn chỉnh (6 app)', 'Hỗ trợ ưu tiên trong 24 giờ', 'Tư vấn tích hợp design token'],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    tagline: 'Tổ chức nhiều sản phẩm',
    monthly: null,
    yearly: null,
    cta: 'Liên hệ tư vấn',
    features: ['Mọi thứ trong Team', 'Theme & brand riêng', 'SLA và kênh hỗ trợ riêng', 'Đào tạo cho đội ngũ'],
  },
]

/* ── Footer ────────────────────────────────────────────── */
export interface FooterLink { label: string; to?: string; href?: string }
export interface FooterGroup { title: string; links: FooterLink[] }

export const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: 'Sản phẩm',
    links: [
      { label: 'Component', to: '/lab' },
      { label: 'Bộ giao diện', to: '/showcase/apps' },
      { label: 'Design token', to: '/showcase/tokens' },
      { label: 'Changelog', to: '/landing/changelog' },
    ],
  },
  {
    title: 'Tài nguyên',
    links: [
      { label: 'Tài liệu', to: '/docs' },
      { label: 'Blog', to: '/landing/blog' },
      { label: 'API', to: '/landing/api' },
      { label: 'Câu hỏi thường gặp', to: '/faqs' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Giới thiệu', to: '/landing/about' },
      { label: 'Tuyển dụng', to: '/landing/careers' },
      { label: 'Đối tác', to: '/partners' },
      { label: 'Liên hệ', to: '/landing/contact' },
    ],
  },
  {
    title: 'Pháp lý',
    links: [
      { label: 'Chính sách & điều khoản', to: '/landing/policy' },
      { label: 'Giấy phép MIT', href: `${GITHUB_URL}/blob/main/LICENSE` },
    ],
  },
]

export const FOOTER_COPY = '© 2026 MindUI · Phát hành theo giấy phép MIT'
