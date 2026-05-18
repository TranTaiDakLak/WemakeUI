import type { CrudPageConfig } from '@/schemas/crud.schema'

/* ── Entity ── */
export interface Transaction {
  id: number
  txCode: string
  orderCode: string
  memberName: string
  memberEmail: string
  productName: string
  txType: 'purchase' | 'refund' | 'renewal'
  paymentMethod: 'bank_transfer' | 'momo' | 'vnpay' | 'zalopay' | 'card'
  amount: number
  paymentStatus: 'paid' | 'pending' | 'failed'
  txStatus: 'completed' | 'processing' | 'cancelled' | 'refunded'
  txTime: string
  handler: string
  adminNote: string
}

/* ── Status / type maps ── */
export const TX_STATUS_MAP = {
  completed:  { variant: 'success' as const, label: 'Hoàn thành', dot: true },
  processing: { variant: 'warning' as const, label: 'Đang xử lý', dot: true },
  cancelled:  { variant: 'neutral' as const, label: 'Đã huỷ',     dot: true },
  refunded:   { variant: 'info'    as const, label: 'Đã hoàn',    dot: true },
}

export const PAYMENT_STATUS_MAP = {
  paid:    { variant: 'success' as const, label: 'Đã thanh toán' },
  pending: { variant: 'warning' as const, label: 'Chờ thanh toán' },
  failed:  { variant: 'danger'  as const, label: 'Thất bại' },
}

export const TX_TYPE_MAP = {
  purchase: { variant: 'primary' as const, label: 'Mua hàng' },
  refund:   { variant: 'danger'  as const, label: 'Hoàn tiền' },
  renewal:  { variant: 'info'    as const, label: 'Gia hạn' },
}

export const PAYMENT_METHOD_LABEL: Record<Transaction['paymentMethod'], string> = {
  bank_transfer: 'Chuyển khoản',
  momo:          'MoMo',
  vnpay:         'VNPay',
  zalopay:       'ZaloPay',
  card:          'Thẻ quốc tế',
}

export function formatAmount(v: number): string {
  return v.toLocaleString('vi-VN') + 'đ'
}

/* ── Mock data ── */
const MEMBERS = [
  { name: 'Nguyễn Văn An',   email: 'user001@gmail.com' },
  { name: 'Trần Thị Bình',   email: 'user002@yahoo.com' },
  { name: 'Lê Quốc Cường',   email: 'user003@company.vn' },
  { name: 'Phạm Thị Dung',   email: 'user004@work.vn' },
  { name: 'Hoàng Minh Em',   email: 'user005@gmail.com' },
  { name: 'Vũ Ngọc Phương',  email: 'user006@outlook.com' },
  { name: 'Đặng Văn Giang',  email: 'user007@gmail.com' },
  { name: 'Bùi Kim Hoa',     email: 'user008@yahoo.com' },
  { name: 'Đỗ Hữu Hùng',    email: 'user009@company.vn' },
  { name: 'Ngô Thu Khanh',   email: 'user010@work.vn' },
]
const PRODUCTS = [
  'WemakeUI Pro', 'AutoMessage Plus', 'ChatBot Builder',
  'CRM Enterprise', 'Analytics Suite', 'API Access Pro',
  'Email Automation', 'SMS Gateway', 'Push Kit', 'Social Media Manager',
]
const METHODS: Transaction['paymentMethod'][] = ['bank_transfer', 'momo', 'vnpay', 'zalopay', 'card']
const TYPES: Transaction['txType'][]    = ['purchase', 'purchase', 'purchase', 'renewal', 'refund']
const PAY_ST: Transaction['paymentStatus'][] = ['paid', 'paid', 'paid', 'pending', 'failed']
const TX_ST:  Transaction['txStatus'][]      = ['completed', 'completed', 'processing', 'cancelled', 'refunded']
const HANDLERS = ['Nguyễn Admin', 'Trần Ops', 'System Auto', 'Lê Support', 'Phạm Finance']
const AMOUNTS  = [199_000, 299_000, 499_000, 799_000, 999_000, 1_490_000, 2_490_000, 4_990_000]

function genTx(i: number): Transaction {
  const member  = MEMBERS[i % MEMBERS.length]
  const product = PRODUCTS[i % PRODUCTS.length]
  const day  = String((i * 3 % 28) + 1).padStart(2, '0')
  const mon  = String((i % 6) + 1).padStart(2, '0')
  const hour = String((i * 7 % 24)).padStart(2, '0')
  const min  = String((i * 13 % 60)).padStart(2, '0')
  return {
    id:            i + 1,
    txCode:        `TX-${String(i + 1).padStart(5, '0')}`,
    orderCode:     `ORD-${String(i + 1).padStart(5, '0')}`,
    memberName:    member.name,
    memberEmail:   member.email,
    productName:   product,
    txType:        TYPES[i % TYPES.length],
    paymentMethod: METHODS[i % METHODS.length],
    amount:        AMOUNTS[i % AMOUNTS.length],
    paymentStatus: PAY_ST[i % PAY_ST.length],
    txStatus:      TX_ST[i % TX_ST.length],
    txTime:        `${day}/${mon}/2025 ${hour}:${min}`,
    handler:       HANDLERS[i % HANDLERS.length],
    adminNote:     i % 8 === 0 ? 'Cần xác minh thông tin thanh toán trước khi xử lý.' : '',
  }
}

const MOCK: Transaction[] = Array.from({ length: 100 }, (_, i) => genTx(i))

/* ── Config ── */
export const transactionsConfig: CrudPageConfig<Transaction> = {
  entity: 'transaction',
  label:  { singular: 'giao dịch', plural: 'giao dịch' },

  initialData: () => [...MOCK],
  pageSize: 20,

  columns: [
    { key: 'stt',           label: 'STT',          width: '52px', align: 'center' },
    { key: 'txCode',        label: 'Mã GD',         slot: true },
    { key: 'memberName',    label: 'Họ tên',         slot: true },
    { key: 'memberEmail',   label: 'Email',          slot: true },
    { key: 'productName',   label: 'Sản phẩm',      slot: true },
    { key: 'txType',        label: 'Loại GD',        slot: true },
    { key: 'paymentMethod', label: 'Phương thức',   slot: true },
    { key: 'amount',        label: 'Giá trị',        align: 'right', slot: true },
    { key: 'paymentStatus', label: 'TT thanh toán', slot: true },
    { key: 'txStatus',      label: 'Trạng thái GD', slot: true },
    { key: 'txTime',        label: 'Thời gian' },
    { key: 'handler',       label: 'Người xử lý' },
  ],

  searchFields: ['txCode', 'orderCode', 'memberName', 'memberEmail', 'productName'],
  searchPlaceholder: 'Tìm mã GD, thành viên, sản phẩm...',

  filters: [
    {
      key: 'txStatus',
      defaultValue: 'all',
      options: [
        { value: 'all',        label: 'Tất cả trạng thái' },
        { value: 'completed',  label: 'Hoàn thành' },
        { value: 'processing', label: 'Đang xử lý' },
        { value: 'cancelled',  label: 'Đã huỷ' },
        { value: 'refunded',   label: 'Đã hoàn' },
      ],
      match: (row, val) => row['txStatus'] === val,
    },
    {
      key: 'txType',
      defaultValue: 'all',
      options: [
        { value: 'all',      label: 'Tất cả loại' },
        { value: 'purchase', label: 'Mua hàng' },
        { value: 'renewal',  label: 'Gia hạn' },
        { value: 'refund',   label: 'Hoàn tiền' },
      ],
      match: (row, val) => row['txType'] === val,
    },
    {
      key: 'paymentMethod',
      defaultValue: 'all',
      options: [
        { value: 'all',           label: 'Tất cả PTTT' },
        { value: 'bank_transfer', label: 'Chuyển khoản' },
        { value: 'momo',          label: 'MoMo' },
        { value: 'vnpay',         label: 'VNPay' },
        { value: 'zalopay',       label: 'ZaloPay' },
        { value: 'card',          label: 'Thẻ quốc tế' },
      ],
      match: (row, val) => row['paymentMethod'] === val,
    },
  ],

  detail: {
    titleKey: 'txCode',
    sections: [
      {
        title: 'Thông tin giao dịch',
        fields: [
          { key: 'txCode',        label: 'Mã giao dịch', code: true },
          { key: 'orderCode',     label: 'Mã đơn hàng',  code: true },
          { key: 'txType',        label: 'Loại', format: (v) => TX_TYPE_MAP[v as Transaction['txType']]?.label ?? String(v) },
          { key: 'txStatus',      label: 'Trạng thái GD', format: (v) => TX_STATUS_MAP[v as Transaction['txStatus']]?.label ?? String(v) },
          { key: 'txTime',        label: 'Thời gian' },
          { key: 'handler',       label: 'Người xử lý' },
        ],
      },
      {
        title: 'Khách hàng',
        fields: [
          { key: 'memberName',  label: 'Họ tên' },
          { key: 'memberEmail', label: 'Email', code: true },
        ],
      },
      {
        title: 'Thanh toán',
        fields: [
          { key: 'amount',        label: 'Giá trị', format: (v) => formatAmount(v as number) },
          { key: 'paymentMethod', label: 'Phương thức', format: (v) => PAYMENT_METHOD_LABEL[v as Transaction['paymentMethod']] },
          { key: 'paymentStatus', label: 'Trạng thái TT', format: (v) => PAYMENT_STATUS_MAP[v as Transaction['paymentStatus']]?.label ?? String(v) },
        ],
      },
      {
        title: 'Ghi chú admin',
        fields: [
          { key: 'adminNote', label: 'Nội dung', format: (v) => String(v || '(trống)') },
        ],
      },
    ],
  },

  bulkActions: [
    {
      key: 'confirm',
      label: 'Xác nhận',
      variant: 'default',
      confirm: { title: 'Xác nhận giao dịch?', description: 'Các giao dịch đã chọn sẽ được xác nhận.', intent: 'info' },
    },
    {
      key: 'cancel',
      label: 'Huỷ',
      variant: 'warning',
      confirm: { title: 'Huỷ giao dịch?', description: 'Các giao dịch đã chọn sẽ bị huỷ.', intent: 'warning' },
    },
  ],

  handlers: {
    onBulkAction: async (key, ids) => {
      console.log(`[mock] bulk action "${key}" on:`, ids)
    },
  },

  empty: { emoji: '💳', message: 'Không tìm thấy giao dịch nào' },
}
