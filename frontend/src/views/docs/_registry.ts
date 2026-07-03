/**
 * Docs registry — nguồn dữ liệu duy nhất cho sidebar docs và route docs.
 * Thêm component mới: tạo `components/XxxDoc.vue` rồi thêm một entry vào đây.
 */
import type { Component } from 'vue'

export interface DocEntry {
  /** slug dưới /docs/<slug> */
  slug: string
  /** tên hiển thị (thường là tên component) */
  name: string
  /** mô tả ngắn cho sidebar/tìm kiếm */
  desc: string
  /** lazy component của trang docs */
  loader: () => Promise<Component>
}

export interface DocCategory {
  label: string
  entries: DocEntry[]
}

export const docCategories: DocCategory[] = [
  {
    label: 'Form',
    entries: [
      { slug: 'button',   name: 'BaseButton',   desc: 'Nút bấm — 10 variant, 5 size, loading, icon', loader: () => import('./components/ButtonDoc.vue') },
      { slug: 'input',    name: 'BaseInput',    desc: 'Ô nhập liệu — label, error, các kiểu',        loader: () => import('./components/InputDoc.vue') },
      { slug: 'select',   name: 'BaseSelect',   desc: 'Dropdown chọn — options, group',              loader: () => import('./components/SelectDoc.vue') },
      { slug: 'checkbox', name: 'BaseCheckbox', desc: 'Checkbox — indeterminate, error',             loader: () => import('./components/CheckboxDoc.vue') },
      { slug: 'radio',    name: 'BaseRadio',    desc: 'Nhóm radio — ngang / dọc',                    loader: () => import('./components/RadioDoc.vue') },
      { slug: 'toggle',   name: 'BaseToggle',   desc: 'Công tắc bật/tắt',                            loader: () => import('./components/ToggleDoc.vue') },
      { slug: 'textarea', name: 'BaseTextarea', desc: 'Vùng nhập nhiều dòng — autosize',             loader: () => import('./components/TextareaDoc.vue') },
    ],
  },
  {
    label: 'Hiển thị',
    entries: [
      { slug: 'badge',    name: 'BaseBadge',    desc: 'Nhãn trạng thái nhỏ — dot, pulsing',          loader: () => import('./components/BadgeDoc.vue') },
      { slug: 'tag',      name: 'BaseTag',      desc: 'Thẻ — removable, variant, shape',             loader: () => import('./components/TagDoc.vue') },
      { slug: 'avatar',   name: 'BaseAvatar',   desc: 'Ảnh đại diện — status ring, fallback',        loader: () => import('./components/AvatarDoc.vue') },
      { slug: 'progress', name: 'BaseProgress', desc: 'Thanh tiến trình — striped, animated',        loader: () => import('./components/ProgressDoc.vue') },
    ],
  },
  {
    label: 'Bố cục',
    entries: [
      { slug: 'card',     name: 'BaseCard',     desc: 'Thẻ chứa — header/footer, shadow, states',    loader: () => import('./components/CardDoc.vue') },
    ],
  },
  {
    label: 'Lớp phủ',
    entries: [
      { slug: 'modal',    name: 'BaseModal',    desc: 'Hộp thoại — 5 size, intent, focus trap',      loader: () => import('./components/ModalDoc.vue') },
      { slug: 'tooltip',  name: 'BaseTooltip',  desc: 'Chú giải khi hover — 4 hướng',                loader: () => import('./components/TooltipDoc.vue') },
      { slug: 'dropdown', name: 'BaseDropdown', desc: 'Menu thả xuống — auto flip',                  loader: () => import('./components/DropdownDoc.vue') },
    ],
  },
  {
    label: 'Mẫu Form (Popup)',
    entries: [
      { slug: 'form-modal',     name: 'FormModal',     desc: 'Modal chứa form — submit, loading, validation', loader: () => import('./components/FormModalDoc.vue') },
      { slug: 'form-drawer',    name: 'FormDrawer',    desc: 'Drawer chứa form — trượt từ cạnh, submit',      loader: () => import('./components/FormDrawerDoc.vue') },
      { slug: 'confirm-dialog', name: 'ConfirmDialog', desc: 'Hộp xác nhận — xoá/archive, intent, loading',  loader: () => import('./components/ConfirmDialogDoc.vue') },
    ],
  },
  {
    label: 'Dữ liệu',
    entries: [
      { slug: 'datagrid', name: 'DataGridPro', desc: 'Bảng dữ liệu — sort, chọn, density, virtual, slot ô', loader: () => import('./components/DataGridDoc.vue') },
    ],
  },
  {
    label: 'Phản hồi',
    entries: [
      { slug: 'toast',    name: 'useToast',     desc: 'Thông báo nổi — success/error/warning/info',  loader: () => import('./components/ToastDoc.vue') },
    ],
  },
]

/** Phẳng hóa toàn bộ entry — dùng cho router. */
export const docEntries: DocEntry[] = docCategories.flatMap(c => c.entries)
