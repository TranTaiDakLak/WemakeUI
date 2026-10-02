/**
 * Types cho AppTopbar — tách ra để re-export qua layout/index.ts
 * (vue-tsc không nhả type từ <script setup>).
 */

/** Dữ liệu chip tài khoản — truyền object để AppTopbar bật ProfileMenu có sẵn. */
export interface TopbarUser {
  name: string
  /** mã hiển thị (mono) */
  userId?: string
  email?: string
  avatar?: string
  role?: string
  /** tên gói dịch vụ */
  plan?: string
  planUsed?: number
  planLimit?: number
  /** mặc định true */
  connected?: boolean
}
