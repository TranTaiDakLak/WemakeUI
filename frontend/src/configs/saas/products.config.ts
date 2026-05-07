import type { CrudPageConfig, FormFieldConfig } from '@/schemas/crud.schema'

/* ── Entity ── */
export interface Product {
  id: number
  name: string
  price: number
  type: 'one-time' | 'subscription' | 'trial'
  status: 'active' | 'inactive' | 'draft'
  purchaseCount: number
  createdAt: string
  description: string
  tags: string[]
}

/* ── Status / type maps ── */
export const PRODUCT_STATUS_MAP = {
  active:   { variant: 'success' as const, label: 'Đang bán',  dot: true },
  inactive: { variant: 'neutral' as const, label: 'Ngừng bán', dot: true },
  draft:    { variant: 'warning' as const, label: 'Nháp',      dot: true },
}

export const PRODUCT_TYPE_MAP = {
  'one-time':     { variant: 'info'    as const, label: 'Mua một lần' },
  'subscription': { variant: 'primary' as const, label: 'Đăng ký tháng' },
  'trial':        { variant: 'neutral' as const, label: 'Dùng thử' },
}

/* ── Helpers ── */
export function formatPrice(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + ' tr'
  return v.toLocaleString('vi-VN') + 'đ'
}

/* ── Mock data ── */
const NAMES = [
  'WeConnect Pro', 'AutoMessage Plus', 'ChatBot Builder', 'CRM Enterprise', 'Analytics Suite',
  'Report Generator', 'API Access Pro', 'WhatsApp Integration', 'Multi-Channel Hub', 'Customer Journey',
  'Lead Scoring Tool', 'Email Automation', 'SMS Gateway', 'Push Notification Kit', 'Social Media Manager',
]
const PRICES = [199_000, 299_000, 499_000, 799_000, 999_000, 1_490_000, 2_490_000, 4_990_000]
const TYPES: Product['type'][]   = ['one-time', 'subscription', 'trial']
const STATUSES: Product['status'][] = ['active', 'active', 'active', 'inactive', 'draft']
const TAG_POOL = ['automation', 'crm', 'analytics', 'integration', 'messaging', 'api', 'saas']

function genProduct(i: number): Product {
  const baseName = NAMES[i % NAMES.length]
  const ver = Math.floor(i / NAMES.length) + 1
  const name = ver > 1 ? `${baseName} v${ver}` : baseName
  const day  = String((i * 5 % 28) + 1).padStart(2, '0')
  const mon  = String((i % 12) + 1).padStart(2, '0')
  return {
    id:            i + 1,
    name,
    price:         PRICES[i % PRICES.length],
    type:          TYPES[i % TYPES.length],
    status:        STATUSES[i % STATUSES.length],
    purchaseCount: (i * 17 + 3) % 480 + 10,
    createdAt:     `${day}/${mon}/2024`,
    description:   `Gói ${name} — tích hợp đầy đủ tính năng cho doanh nghiệp.`,
    tags:          [TAG_POOL[i % TAG_POOL.length], TAG_POOL[(i + 3) % TAG_POOL.length]],
  }
}

const MOCK: Product[] = Array.from({ length: 55 }, (_, i) => genProduct(i))

/* ── Form fields ── */
const FORM_FIELDS: FormFieldConfig[] = [
  { key: 'name',  label: 'Tên sản phẩm', type: 'text',  required: true, placeholder: 'WeConnect Pro' },
  { key: 'price', label: 'Giá (VND)',     type: 'text',  required: true, placeholder: '499000', half: true },
  {
    key: 'type', label: 'Loại', type: 'select', half: true,
    options: [
      { value: 'one-time',     label: 'Mua một lần' },
      { value: 'subscription', label: 'Đăng ký tháng' },
      { value: 'trial',        label: 'Dùng thử' },
    ],
  },
  {
    key: 'status', label: 'Trạng thái', type: 'select',
    options: [
      { value: 'active',   label: 'Đang bán' },
      { value: 'inactive', label: 'Ngừng bán' },
      { value: 'draft',    label: 'Nháp' },
    ],
  },
  { key: 'description', label: 'Mô tả', type: 'textarea', placeholder: 'Mô tả sản phẩm...' },
  { key: 'tags', label: 'Tags', type: 'tags', placeholder: 'automation, crm, api...' },
]

/* ── Config ── */
export const productsConfig: CrudPageConfig<Product> = {
  entity: 'product',
  label:  { singular: 'sản phẩm', plural: 'sản phẩm' },

  initialData: () => [...MOCK],
  pageSize: 15,

  columns: [
    { key: 'stt',           label: 'STT',         width: '52px', align: 'center' },
    { key: 'name',          label: 'Tên sản phẩm', slot: true },
    { key: 'price',         label: 'Giá',          align: 'right', slot: true },
    { key: 'type',          label: 'Loại',          slot: true },
    { key: 'status',        label: 'Trạng thái',   slot: true },
    { key: 'purchaseCount', label: 'Lượt mua',     align: 'right', slot: true },
    { key: 'createdAt',     label: 'Ngày tạo' },
  ],

  searchFields: ['name', 'description'],
  searchPlaceholder: 'Tìm tên sản phẩm...',

  filters: [
    {
      key: 'status',
      defaultValue: 'all',
      options: [
        { value: 'all',      label: 'Tất cả trạng thái' },
        { value: 'active',   label: 'Đang bán' },
        { value: 'inactive', label: 'Ngừng bán' },
        { value: 'draft',    label: 'Nháp' },
      ],
      match: (row, val) => row['status'] === val,
    },
    {
      key: 'type',
      defaultValue: 'all',
      options: [
        { value: 'all',          label: 'Tất cả loại' },
        { value: 'one-time',     label: 'Mua một lần' },
        { value: 'subscription', label: 'Đăng ký tháng' },
        { value: 'trial',        label: 'Dùng thử' },
      ],
      match: (row, val) => row['type'] === val,
    },
  ],

  addForm: {
    title: 'Thêm sản phẩm',
    fields: FORM_FIELDS,
    initialValues: () => ({ status: 'draft', type: 'one-time' }),
    validate: (f) => {
      if (!String(f.name ?? '').trim()) return 'Vui lòng nhập tên sản phẩm'
      if (!String(f.price ?? '').trim()) return 'Vui lòng nhập giá'
      return null
    },
    build: (f) => ({
      id:            Date.now(),
      name:          String(f.name ?? ''),
      price:         parseInt(String(f.price ?? '0'), 10) || 0,
      type:          (f.type as Product['type']) ?? 'one-time',
      status:        (f.status as Product['status']) ?? 'draft',
      purchaseCount: 0,
      createdAt:     new Date().toLocaleDateString('vi-VN'),
      description:   String(f.description ?? ''),
      tags:          String(f.tags ?? '').split(',').map(t => t.trim()).filter(Boolean),
    }),
  },

  editForm: {
    title: 'Chỉnh sửa sản phẩm',
    validate: (f) => {
      if (!String(f.name ?? '').trim()) return 'Vui lòng nhập tên sản phẩm'
      return null
    },
    fillMap: (key, val) => {
      if (key === 'tags') return Array.isArray(val) ? (val as string[]).join(', ') : String(val ?? '')
      if (key === 'price') return String(val ?? '')
      return val ?? ''
    },
    apply: (target, f) => ({
      ...target,
      name:        String(f.name ?? ''),
      price:       parseInt(String(f.price ?? String(target.price)), 10) || target.price,
      type:        (f.type as Product['type']) ?? target.type,
      status:      (f.status as Product['status']) ?? target.status,
      description: String(f.description ?? ''),
      tags:        String(f.tags ?? '').split(',').map(t => t.trim()).filter(Boolean),
    }),
  },

  detail: {
    titleKey: 'name',
    sections: [
      {
        title: 'Thông tin sản phẩm',
        fields: [
          { key: 'price',  label: 'Giá', format: (v) => formatPrice(v as number) },
          { key: 'type',   label: 'Loại', format: (v) => PRODUCT_TYPE_MAP[v as Product['type']]?.label ?? String(v) },
          { key: 'status', label: 'Trạng thái', format: (v) => PRODUCT_STATUS_MAP[v as Product['status']]?.label ?? String(v) },
          { key: 'purchaseCount', label: 'Lượt mua', format: (v) => `${v} lượt` },
          { key: 'createdAt',     label: 'Ngày tạo' },
        ],
      },
      {
        title: 'Mô tả',
        fields: [
          { key: 'description', label: 'Nội dung' },
        ],
      },
    ],
  },

  delete: {
    confirmTitle: 'Xoá sản phẩm?',
    confirmDescription: (p) => `"${p.name}" sẽ bị xoá vĩnh viễn.`,
    bulkConfirmTitle: 'Xoá nhiều sản phẩm?',
    bulkConfirmDescription: (n) => `${n} sản phẩm đã chọn sẽ bị xoá vĩnh viễn.`,
  },

  empty: { emoji: '📦', message: 'Không tìm thấy sản phẩm nào' },
}
