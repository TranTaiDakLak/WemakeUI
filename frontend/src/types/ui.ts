/** Popup/modal identifiers used across the app */
export type PopupType =
  | ''
  | 'settings'
  | 'interaction'
  | 'display'
  | 'utils'
  | 'trash'
  | 'contact'
  | 'add'
  | 'review'
  | 'category'
  | 'search'
  | 'update'
  | 'updateByUid'
  | 'proxy'
  | 'chrome'
  | 'bm'
  | 'interactionForm'
  | 'page'
  | 'checkpoint'
  | 'changeInfo'

/** Context menu item definition */
export interface ContextMenuItem {
  id: string
  label: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  separator?: boolean
  children?: ContextMenuItem[]
  action?: () => void
}

/** DataGrid column configuration */
export interface ColumnConfig {
  key: string
  label: string
  visible: boolean
  group: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  class?: string
}

import type { ColumnGroup } from './settings'

/**
 * Default column configuration for DataGrid — 63 configurable columns.
 * UID, Chọn (checkbox), STT (row number) are always visible and not included here.
 * Keys match Account interface field names for direct data access.
 * Visibility defaults match WeBM frmFacebook.Core.Designer.cs.
 */
export const DEFAULT_COLUMNS: ColumnConfig[] = [
  // ── Group: account (Tài khoản) ──
  { key: 'password',      label: 'Mật khẩu',        visible: true,  group: 'account', width: '70px' },
  { key: 'twofa',         label: '2FA',              visible: true,  group: 'account', width: '40px' },
  { key: 'email',         label: 'Email',            visible: true,  group: 'account', width: '80px' },
  { key: 'passEmail',     label: 'Pass Email',       visible: false, group: 'account', width: '80px' },
  { key: 'emailRecovery', label: 'Mail khôi phục',   visible: false, group: 'account' },
  { key: 'inputAccount',  label: 'Dữ liệu gốc',     visible: false, group: 'account' },
  { key: 'cookie',        label: 'Cookie',           visible: true,  group: 'account', width: '50px',  align: 'center' },
  { key: 'token',         label: 'Token',            visible: true,  group: 'account', width: '50px',  align: 'center' },
  { key: 'proxy',         label: 'Proxy',            visible: false, group: 'account' },
  { key: 'ua',            label: 'User Agent',       visible: false, group: 'account', width: '60px' },
  { key: 'phone',         label: 'Số điện thoại',    visible: false, group: 'account', width: '40px' },

  // ── Group: info (Thông tin tài khoản) ──
  { key: 'fullName',       label: 'Họ tên',          visible: true,  group: 'info', width: '80px' },
  { key: 'friends',        label: 'Bạn bè',          visible: true,  group: 'info', width: '60px',  align: 'center' },
  { key: 'follower',       label: 'Theo dõi',        visible: true,  group: 'info', width: '80px',  align: 'center' },
  { key: 'post',           label: 'Bài viết',        visible: false, group: 'info', align: 'center' },
  { key: 'gender',         label: 'Giới tính',       visible: false, group: 'info', width: '80px',  align: 'center' },
  { key: 'birthday',       label: 'Sinh nhật',       visible: false, group: 'info', width: '80px' },
  { key: 'location',       label: 'Location',        visible: false, group: 'info', width: '60px' },
  { key: 'hometown',       label: 'Quê quán',        visible: false, group: 'info', width: '80px' },
  { key: 'currentCity',    label: 'Thành phố',       visible: false, group: 'info', width: '80px' },
  { key: 'requestFriends', label: 'Lời mời kết bạn', visible: false, group: 'info', width: '60px',  align: 'center' },
  { key: 'dateCreated',    label: 'Ngày tạo TK',     visible: false, group: 'info', width: '80px' },
  { key: 'groupJoined',    label: 'Nhóm',            visible: false, group: 'info', align: 'center' },
  { key: 'groupManager',   label: 'Nhóm quản trị',   visible: false, group: 'info', width: '90px',  align: 'center' },
  { key: 'page',           label: 'Trang',           visible: false, group: 'info', width: '40px',  align: 'center' },
  { key: 'pageManager',    label: 'Trang quản trị',  visible: false, group: 'info', width: '60px' },
  { key: 'avatar',         label: 'Ảnh đại diện',    visible: false, group: 'info', width: '40px',  align: 'center' },
  { key: 'cover',          label: 'Ảnh bìa',         visible: false, group: 'info', width: '40px',  align: 'center' },
  { key: 'professional',   label: 'Chuyên nghiệp',   visible: false, group: 'info', align: 'center' },
  { key: 'dating',         label: 'Hẹn hò',          visible: false, group: 'info', width: '80px',  align: 'center' },
  { key: 'secondAccount',  label: 'Nick phụ',        visible: false, group: 'info', width: '60px',  align: 'center' },
  { key: 'marketplace',    label: 'Marketplace',     visible: false, group: 'info', width: '80px',  align: 'center' },
  { key: 'emailOther',     label: 'Mail khác',       visible: false, group: 'info', width: '80px' },
  { key: 'refreshToken',   label: 'Refresh Token',   visible: false, group: 'info', width: '60px' },
  { key: 'clientId',       label: 'Client ID',       visible: false, group: 'info', width: '55px' },
  { key: 'oauth2',         label: 'OAuth2',          visible: false, group: 'info', width: '50px' },

  // ── Group: ads (Quảng cáo & BM) ──
  { key: 'statusAds',   label: 'Quảng cáo',     visible: true,  group: 'ads', width: '70px' },
  { key: 'tkqc',        label: 'TKQC',           visible: false, group: 'ads' },
  { key: 'bm',          label: 'BM',             visible: false, group: 'ads', width: '80px' },
  { key: 'chatSupport', label: 'Chat Support',   visible: false, group: 'ads', width: '110px' },

  // ── Group: action (Hoạt động) ──
  { key: 'status',      label: 'Trạng thái',     visible: true,  group: 'action', width: '92px',  align: 'center' },
  { key: 'status282',   label: 'Checkpoint',      visible: false, group: 'action', width: '88px' },
  { key: 'categoryId',  label: 'Thư mục',        visible: true,  group: 'action', align: 'center' },
  { key: 'note',        label: 'Ghi chú',        visible: true,  group: 'action' },
  { key: 'noteRun',     label: 'Ghi chú chạy',   visible: false, group: 'action' },
  { key: 'dateImport',  label: 'Ngày nhập',      visible: false, group: 'action' },
  { key: 'lastRun',     label: 'Chạy lần cuối',  visible: false, group: 'action' },
  { key: 'run',         label: 'Hoạt động',      visible: true,  group: 'action' },
  { key: 'backupRequest', label: 'Backup Request', visible: false, group: 'action' },
  { key: 'profileChrome', label: 'Profile Chrome', visible: false, group: 'action' },

]

/** Group labels for SetupViewModal display */
export const COLUMN_GROUP_LABELS: Record<ColumnGroup, string> = {
  account: 'Tài khoản',
  info: 'Thông tin tài khoản',
  ads: 'Quảng cáo và Business Manager',
  action: 'Hoạt động',
}

/** Cell reference for selection */
export interface CellRef {
  row: number
  col: string
}

/** Modal size presets */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

/** Copy popup field option */
export interface CopyFieldOption {
  label: string
  field: string
}

/** Copy popup separator option */
export interface CopySeparatorOption {
  label: string
  value: string
}

/** Saved copy format (recent) */
export interface CopyRecentFormat {
  slots: number[]
  label: string
}
