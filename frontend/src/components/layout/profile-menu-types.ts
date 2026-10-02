/**
 * Types + nhãn mặc định cho ProfileMenu — tách ra để re-export qua layout/index.ts
 * (vue-tsc không nhả type từ <script setup>).
 */

/** Toàn bộ chuỗi hiển thị của ProfileMenu — override từng phần qua prop `labels` (i18n). */
export interface ProfileMenuLabels {
  menuAria: string
  account: string
  connected: string
  notConnected: string
  close: string
  copyId: string
  copyEmail: string
  copied: string
  profile: string
  logout: string
  securityToggle: string
  tabSecurity: string
  tabOther: string
  refresh: string
  plan: string
  noPlan: string
  planLabel: string
  usage: string
  upgrade: string
  version: string
  light: string
  dark: string
  appearance: string
}

export const DEFAULT_PROFILE_LABELS: ProfileMenuLabels = {
  menuAria: 'Menu tài khoản',
  account: 'Tài khoản Mind',
  connected: 'Đã kết nối',
  notConnected: 'Chưa kết nối',
  close: 'Đóng',
  copyId: 'Sao chép mã',
  copyEmail: 'Sao chép email',
  copied: 'Đã sao chép',
  profile: 'Hồ sơ',
  logout: 'Đăng xuất',
  securityToggle: 'Thông tin bảo mật & khác',
  tabSecurity: 'Bảo mật',
  tabOther: 'Khác',
  refresh: 'Làm mới',
  plan: 'Gói dịch vụ',
  noPlan: 'Chưa có gói',
  planLabel: 'Gói hiện tại',
  usage: 'Phiên đang dùng',
  upgrade: 'Nâng cấp',
  version: 'Phiên bản',
  light: 'Sáng',
  dark: 'Tối',
  appearance: 'Giao diện',
}

/** Một dòng thông tin trong mục "Bảo mật & khác" (giá trị đã che nếu nhạy cảm). */
export interface ProfileInfoRow {
  key: string
  label: string
  value: string
  /** SVG html */
  icon?: string
  /** cho phép nút làm mới ở cuối dòng */
  refreshable?: boolean
  /** cho phép bấm để copy (mặc định true) */
  copyable?: boolean
}
