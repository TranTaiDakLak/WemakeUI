import type { CrudPageConfig, FormFieldConfig } from '@/schemas/crud.schema'

/* ── Entity type ── */
export interface Contact {
  id: number
  name: string
  phone: string
  email: string
  company: string
  tags: string[]
  status: 'active' | 'blocked' | 'pending'
  lastMsg: string
  note: string
  createdAt: string
}

/* ── Status metadata ── */
export const CONTACT_STATUS_BADGE: Record<Contact['status'], 'success' | 'danger' | 'warning'> = {
  active:  'success',
  blocked: 'danger',
  pending: 'warning',
}

export const CONTACT_STATUS_LABEL: Record<Contact['status'], string> = {
  active:  'Hoạt động',
  blocked: 'Đã khoá',
  pending: 'Chờ duyệt',
}

/* ── Mock data ── */
const MOCK: Contact[] = [
  { id: 1, name: 'Nguyễn Văn Minh',   phone: '+84912345678', email: 'minh.nv@company.vn',  company: 'FPT Software',     tags: ['VIP', 'Hà Nội'],    status: 'active',  lastMsg: '10 phút trước', note: 'Khách hàng lâu năm, ưu tiên phản hồi trong 2 giờ.', createdAt: '12/03/2024' },
  { id: 2, name: 'Lê Thị Lan',        phone: '+84987654321', email: 'lan.lt@gmail.com',     company: 'Vingroup',         tags: ['new'],              status: 'active',  lastMsg: '1 giờ trước',   note: '',                                                   createdAt: '20/04/2024' },
  { id: 3, name: 'Trần Đức Anh',      phone: '+84901234567', email: 'anh.td@viettel.vn',   company: 'Viettel',          tags: ['blocked'],          status: 'blocked', lastMsg: '3 ngày trước',  note: 'Tài khoản bị khoá do vi phạm điều khoản.',           createdAt: '05/01/2024' },
  { id: 4, name: 'Phạm Thị Hoa',      phone: '+84956789012', email: 'hoa.pt@vnpt.vn',      company: 'VNPT',             tags: ['VIP', 'TP.HCM'],   status: 'active',  lastMsg: '30 phút trước', note: 'Liên hệ ưu tiên cao, đối tác chiến lược.',           createdAt: '14/02/2024' },
  { id: 5, name: 'Hoàng Văn Nam',     phone: '+84923456789', email: 'nam.hv@startup.io',   company: 'Startup XYZ',     tags: ['pending'],          status: 'pending', lastMsg: '2 giờ trước',   note: 'Đang chờ xác minh tài khoản.',                       createdAt: '01/05/2024' },
  { id: 6, name: 'Vũ Thị Mai',        phone: '+84934567890', email: 'mai.vt@shopee.vn',    company: 'Shopee Vietnam',  tags: ['VIP'],              status: 'active',  lastMsg: '5 phút trước',  note: '',                                                   createdAt: '17/03/2024' },
  { id: 7, name: 'Đặng Quốc Hùng',   phone: '+84945678901', email: 'hung.dq@tiki.vn',     company: 'Tiki',            tags: ['Hà Nội'],           status: 'active',  lastMsg: '45 phút trước', note: 'Cần hỗ trợ tích hợp API Zalo.',                      createdAt: '22/04/2024' },
  { id: 8, name: 'Bùi Thị Ngọc',     phone: '+84967890123', email: 'ngoc.bt@lazada.vn',   company: 'Lazada',          tags: ['TP.HCM', 'new'],   status: 'active',  lastMsg: '3 giờ trước',   note: '',                                                   createdAt: '28/04/2024' },
]

/* ── Form fields (shared between add + edit) ── */
const CONTACT_FORM_FIELDS: FormFieldConfig[] = [
  { key: 'name',    label: 'Họ và tên',     type: 'text',     required: true, placeholder: 'Nguyễn Văn A',      half: true },
  { key: 'phone',   label: 'Số điện thoại', type: 'text',     required: true, placeholder: '+84912345678',      half: true },
  { key: 'email',   label: 'Email',          type: 'email',    placeholder: 'email@company.vn' },
  { key: 'company', label: 'Công ty',        type: 'text',     placeholder: 'Tên công ty...' },
  {
    key: 'status', label: 'Trạng thái', type: 'select',
    options: [
      { value: 'active',  label: 'Đang hoạt động' },
      { value: 'blocked', label: 'Đã khoá' },
      { value: 'pending', label: 'Chờ xác minh' },
    ],
  },
  { key: 'tags', label: 'Nhãn', type: 'tags', placeholder: 'VIP, Hà Nội, new...', hint: 'Cách nhau bởi dấu phẩy' },
  { key: 'note', label: 'Ghi chú', type: 'textarea', placeholder: 'Ghi chú về liên hệ này...' },
]

/* ── Config ── */
export const contactsConfig: CrudPageConfig<Contact> = {
  entity: 'contact',
  label:  { singular: 'liên hệ', plural: 'liên hệ' },

  initialData: () => [...MOCK],

  columns: [
    { key: 'name',    label: 'Liên hệ',      slot: true },
    { key: 'phone',   label: 'Số điện thoại', slot: true },
    { key: 'company', label: 'Công ty' },
    { key: 'tags',    label: 'Nhãn',          slot: true },
    { key: 'status',  label: 'Trạng thái',    slot: true },
    { key: 'lastMsg', label: 'Tin cuối' },
  ],

  searchFields: ['name', 'phone', 'email', 'company'],
  searchPlaceholder: 'Tìm tên, SĐT, email, công ty...',

  filters: [
    {
      key: 'status',
      defaultValue: 'all',
      options: [
        { value: 'all',     label: 'Tất cả trạng thái' },
        { value: 'active',  label: 'Đang hoạt động' },
        { value: 'blocked', label: 'Đã khoá' },
        { value: 'pending', label: 'Chờ xác minh' },
      ],
      match: (row, val) => row['status'] === val,
    },
  ],

  addForm: {
    title: 'Thêm liên hệ mới',
    fields: CONTACT_FORM_FIELDS,
    initialValues: () => ({ status: 'active' }),
    validate: (form) => {
      if (!String(form.name ?? '').trim()) return 'Vui lòng điền họ và tên'
      if (!String(form.phone ?? '').trim()) return 'Vui lòng điền số điện thoại'
      return null
    },
    build: (form) => ({
      id:        Date.now(),
      name:      String(form.name ?? ''),
      phone:     String(form.phone ?? ''),
      email:     String(form.email ?? ''),
      company:   String(form.company ?? ''),
      tags:      String(form.tags ?? '').split(',').map(t => t.trim()).filter(Boolean),
      status:    (form.status as Contact['status']) ?? 'active',
      note:      String(form.note ?? ''),
      lastMsg:   'Vừa thêm',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    }),
  },

  editForm: {
    title: 'Chỉnh sửa liên hệ',
    validate: (form) => {
      if (!String(form.name ?? '').trim()) return 'Vui lòng điền tên liên hệ'
      return null
    },
    fillMap: (key, val) => {
      if (key === 'tags') return Array.isArray(val) ? (val as string[]).join(', ') : String(val ?? '')
      return val ?? ''
    },
    apply: (target, form) => ({
      ...target,
      name:    String(form.name ?? ''),
      phone:   String(form.phone ?? ''),
      email:   String(form.email ?? ''),
      company: String(form.company ?? ''),
      tags:    String(form.tags ?? '').split(',').map(t => t.trim()).filter(Boolean),
      status:  (form.status as Contact['status']) ?? target.status,
      note:    String(form.note ?? ''),
    }),
  },

  detail: {
    titleKey: 'name',
    sections: [
      {
        title: 'Thông tin liên hệ',
        fields: [
          { key: 'phone',   label: 'Điện thoại', code: true },
          { key: 'email',   label: 'Email' },
          { key: 'company', label: 'Công ty' },
        ],
      },
      {
        title: 'Hoạt động',
        fields: [
          { key: 'lastMsg',   label: 'Tin nhắn cuối' },
          { key: 'createdAt', label: 'Ngày thêm' },
        ],
      },
    ],
  },

  delete: {
    confirmTitle: 'Xoá liên hệ?',
    confirmDescription: (c) => `'${c.name}' sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.`,
    bulkConfirmTitle: 'Xoá nhiều liên hệ?',
    bulkConfirmDescription: (n) => `${n} liên hệ đã chọn sẽ bị xoá vĩnh viễn.`,
  },

  empty: {
    emoji: '👤',
    message: 'Không tìm thấy liên hệ nào',
  },
}
