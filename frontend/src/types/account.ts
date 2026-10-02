/**
 * Trạng thái của một bản ghi trong lưới demo.
 * Tông màu chấm trạng thái: Hoạt động = xanh · Chờ duyệt = vàng · Lưu trữ = xám (xem `statusMap` của BaseDataGrid).
 */
export type AccountStatus = 'Hoạt động' | 'Chờ duyệt' | 'Lưu trữ'

/**
 * Một dòng của lưới dữ liệu demo (trang `/mindui`). Tên trường giữ nguyên để tương thích ngược;
 * nhãn hiển thị do `DEFAULT_COLUMNS` (stores/mindui/settings.ts) quyết định:
 * uid → Mã · password → Loại · twofa → Phiên bản · email → Liên hệ · cookie → Tệp đính kèm · token → Đã duyệt
 * fullName → Tiêu đề · friends → Lượt xem · follower → Lượt tải · statusAds → Giai đoạn.
 */
export interface AccountRow {
  id: number
  chose: boolean
  uid: string
  password: string
  twofa: string
  email: string
  passEmail: string
  emailRecovery: string
  cookie: string
  token: string
  fullName: string
  friends: number
  follower: number
  statusAds: string
  status: AccountStatus
  categoryId: number | null
  note: string
  ua: string
  uaAndroid: string
  uaIos: string
  birthday: string
  phone: string
  proxy: string
  clientId: string
  refreshToken: string
  oauth2: string
  action: string
  checkpointType: string
}

export interface CategoryItem {
  id: number
  name: string
  count?: number
}
