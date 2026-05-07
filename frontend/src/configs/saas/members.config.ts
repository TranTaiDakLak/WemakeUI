import type { CrudPageConfig, FormFieldConfig } from '@/schemas/crud.schema'

/* ── Entity ── */
export interface Member {
  id: number
  name: string
  email: string
  phone: string
  gender: 'male' | 'female' | ''
  status: 'active' | 'blocked' | 'pending'
  joinedAt: string
  productsCount: number
  note: string
}

/* ── Status map ── */
export const MEMBER_STATUS_MAP = {
  active:  { variant: 'success' as const, label: 'Hoạt động', dot: true },
  blocked: { variant: 'danger'  as const, label: 'Đã khoá',   dot: true },
  pending: { variant: 'warning' as const, label: 'Chờ duyệt', dot: true },
}

/* ── Mock data generator ── */
const FIRSTS  = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô', 'Hà', 'Phan']
const MIDS_M  = ['Văn', 'Quốc', 'Minh', 'Hữu', 'Công', 'Quang', 'Tiến', 'Đức']
const MIDS_F  = ['Thị', 'Ngọc', 'Kim', 'Thu', 'Lan', 'Bích', 'Thanh', 'Ánh']
const LASTS   = ['An', 'Bình', 'Cường', 'Dung', 'Phương', 'Giang', 'Hoa', 'Hùng', 'Khanh', 'Linh', 'Minh', 'Nam', 'Oanh', 'Phúc', 'Quân', 'Sơn', 'Tâm', 'Uyên', 'Vinh', 'Xuân', 'Yến', 'Anh', 'Bảo', 'Chi']
const STATUSES: Member['status'][] = ['active', 'active', 'active', 'active', 'pending', 'blocked']
const DOMAINS  = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.vn', 'work.vn']

const PHONE_PREFIXES = ['090', '091', '093', '094', '096', '097', '098', '032', '033', '034', '035', '036', '038', '039', '070', '079', '077', '076', '078']

function genMember(i: number): Member {
  const isFemale = i % 3 === 2
  const fn  = FIRSTS[i % FIRSTS.length]
  const mid = isFemale ? MIDS_F[i % MIDS_F.length] : MIDS_M[i % MIDS_M.length]
  const ln  = LASTS[i % LASTS.length]
  const day = String((i * 7 % 28) + 1).padStart(2, '0')
  const mon = String((i % 12) + 1).padStart(2, '0')
  const yr  = i < 30 ? '2024' : '2025'
  const pfx = PHONE_PREFIXES[i % PHONE_PREFIXES.length]
  const sfx = String((i * 137 + 1234567) % 10000000).padStart(7, '0')
  return {
    id:            i + 1,
    name:          `${fn} ${mid} ${ln}`,
    email:         `user${String(i + 1).padStart(3, '0')}@${DOMAINS[i % DOMAINS.length]}`,
    phone:         `${pfx}${sfx}`,
    gender:        isFemale ? 'female' : 'male',
    status:        STATUSES[i % STATUSES.length],
    joinedAt:      `${day}/${mon}/${yr}`,
    productsCount: (i * 3 + 2) % 12,
    note:          i % 7 === 0 ? 'Khách VIP — ưu tiên hỗ trợ 24/7' : '',
  }
}

const MOCK: Member[] = Array.from({ length: 55 }, (_, i) => genMember(i))

/* ── Form fields ── */
const FORM_FIELDS: FormFieldConfig[] = [
  { key: 'name',   label: 'Họ và tên', type: 'text',  required: true, placeholder: 'Nguyễn Văn A' },
  { key: 'email',  label: 'Email',     type: 'email', required: true, placeholder: 'user@mail.vn', half: true },
  { key: 'phone',  label: 'Số điện thoại', type: 'text', placeholder: '09xxxxxxxx', half: true },
  {
    key: 'gender', label: 'Giới tính', type: 'checkbox',
    options: [
      { value: 'male',   label: 'Nam' },
      { value: 'female', label: 'Nữ' },
    ],
  },
  {
    key: 'status', label: 'Trạng thái', type: 'select',
    options: [
      { value: 'active',  label: 'Hoạt động' },
      { value: 'pending', label: 'Chờ duyệt' },
      { value: 'blocked', label: 'Đã khoá' },
    ],
  },
  { key: 'note', label: 'Ghi chú', type: 'textarea', placeholder: 'Ghi chú nội bộ...' },
]

/* ── Config ── */
export const membersConfig: CrudPageConfig<Member> = {
  entity: 'member',
  label:  { singular: 'thành viên', plural: 'thành viên' },

  initialData: () => [...MOCK],
  pageSize: 15,

  columns: [
    { key: 'stt',           label: 'STT',      width: '52px',  align: 'center' },
    { key: 'name',          label: 'Thành viên', slot: true },
    { key: 'email',         label: 'Email' },
    { key: 'status',        label: 'Trạng thái', slot: true },
    { key: 'joinedAt',      label: 'Ngày tham gia' },
    { key: 'productsCount', label: 'Sản phẩm mua', align: 'center', slot: true },
  ],

  searchFields: ['name', 'email'],
  searchPlaceholder: 'Tìm tên, email...',

  filters: [
    {
      key: 'status',
      defaultValue: 'all',
      options: [
        { value: 'all',     label: 'Tất cả trạng thái' },
        { value: 'active',  label: 'Hoạt động' },
        { value: 'pending', label: 'Chờ duyệt' },
        { value: 'blocked', label: 'Đã khoá' },
      ],
      match: (row, val) => row['status'] === val,
    },
  ],

  addForm: {
    title: 'Thêm thành viên',
    fields: FORM_FIELDS,
    initialValues: () => ({ status: 'active' }),
    validate: (f) => {
      if (!String(f.name ?? '').trim()) return 'Vui lòng nhập họ và tên'
      if (!String(f.email ?? '').trim()) return 'Vui lòng nhập email'
      return null
    },
    build: (f) => ({
      id:            Date.now(),
      name:          String(f.name ?? ''),
      email:         String(f.email ?? ''),
      phone:         String(f.phone ?? ''),
      gender:        (f.gender as Member['gender']) ?? '',
      status:        (f.status as Member['status']) ?? 'active',
      joinedAt:      new Date().toLocaleDateString('vi-VN'),
      productsCount: 0,
      note:          String(f.note ?? ''),
    }),
  },

  editForm: {
    title: 'Chỉnh sửa thành viên',
    validate: (f) => {
      if (!String(f.name ?? '').trim()) return 'Vui lòng nhập họ và tên'
      return null
    },
    apply: (target, f) => ({
      ...target,
      name:   String(f.name ?? ''),
      email:  String(f.email ?? ''),
      phone:  String(f.phone ?? ''),
      gender: (f.gender as Member['gender']) ?? target.gender,
      status: (f.status as Member['status']) ?? target.status,
      note:   String(f.note ?? ''),
    }),
  },

  detail: {
    titleKey: 'name',
    sections: [
      {
        title: 'Thông tin tài khoản',
        fields: [
          { key: 'email',         label: 'Email', code: true },
          { key: 'status',        label: 'Trạng thái', format: (v) => MEMBER_STATUS_MAP[v as Member['status']]?.label ?? String(v) },
          { key: 'joinedAt',      label: 'Ngày tham gia' },
          { key: 'productsCount', label: 'Sản phẩm đã mua', format: (v) => `${v} sản phẩm` },
        ],
      },
      {
        title: 'Ghi chú',
        fields: [
          { key: 'note', label: 'Nội dung', format: (v) => String(v || '(trống)') },
        ],
      },
    ],
  },

  delete: {
    confirmTitle: 'Xoá thành viên?',
    confirmDescription: (m) => `"${m.name}" sẽ bị xoá vĩnh viễn.`,
    bulkConfirmTitle: 'Xoá nhiều thành viên?',
    bulkConfirmDescription: (n) => `${n} thành viên đã chọn sẽ bị xoá vĩnh viễn.`,
  },

  bulkActions: [
    {
      key: 'block',
      label: 'Khoá',
      variant: 'warning',
      confirm: { title: 'Khoá thành viên?', description: 'Các thành viên đã chọn sẽ bị khoá.', intent: 'warning' },
    },
  ],

  handlers: {
    onBulkAction: async (key, ids) => {
      if (key === 'block') console.log('[mock] block members:', ids)
    },
  },

  empty: { emoji: '👤', message: 'Không tìm thấy thành viên nào' },
}
