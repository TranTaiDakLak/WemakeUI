import type { CrudPageConfig, FormFieldConfig } from '@/schemas/crud.schema'

/* ── Entity ── */
export interface SoftwareVersion {
  id: number
  version: string
  releaseDate: string
  status: 'stable' | 'beta' | 'deprecated'
  changelog: string
  changelogFull: string
  fixCount: number
  updateCount: number
  newCount: number
}

/* ── Status map ── */
export const VERSION_STATUS_MAP = {
  stable:     { variant: 'success' as const, label: 'Ổn định',    dot: true },
  beta:       { variant: 'warning' as const, label: 'Beta',        dot: true },
  deprecated: { variant: 'neutral' as const, label: 'Ngừng hỗ trợ', dot: true },
}

/* ── Mock data ── */
const MOCK: SoftwareVersion[] = [
  {
    id: 1, version: '3.5.0', releaseDate: '01/05/2025', status: 'stable',
    changelog: 'Thêm module thống kê realtime, cải thiện hiệu suất API',
    changelogFull: '### Tính năng mới\n- Module thống kê realtime với WebSocket\n- Dashboard KPI theo thời gian thực\n- Export báo cáo CSV/Excel\n\n### Cải thiện\n- Tối ưu API response 40%\n- Cache layer Redis cho dashboard\n\n### Sửa lỗi\n- Fix lỗi timeout khi tải nhiều tài khoản\n- Fix hiển thị biểu đồ trên Safari',
    fixCount: 8, updateCount: 6, newCount: 3,
  },
  {
    id: 2, version: '3.4.2', releaseDate: '12/04/2025', status: 'stable',
    changelog: 'Sửa lỗi checkpoint, cập nhật WhatsApp API v21',
    changelogFull: '### Sửa lỗi\n- Fix lỗi checkpoint không nhận được mã xác minh\n- Fix crash khi import danh bạ > 10000 liên hệ\n- Fix lỗi gửi tin nhắn đa phương tiện trên iOS\n\n### Cập nhật\n- WhatsApp Business API v21\n- Facebook Graph API v19',
    fixCount: 12, updateCount: 2, newCount: 0,
  },
  {
    id: 3, version: '3.4.1', releaseDate: '28/03/2025', status: 'stable',
    changelog: 'Hotfix lỗi kết nối session, bảo mật 2FA',
    changelogFull: '### Hotfix\n- Fix lỗi session disconnect không tự reconnect\n- Tăng cường bảo mật 2FA cho tài khoản admin\n\n### Sửa lỗi nhỏ\n- Fix UI button trên mobile\n- Fix encoding tiếng Việt trong email',
    fixCount: 4, updateCount: 1, newCount: 0,
  },
  {
    id: 4, version: '3.4.0', releaseDate: '10/03/2025', status: 'stable',
    changelog: 'Chiến dịch đa kênh, scheduler cải tiến, bulk import',
    changelogFull: '### Tính năng mới\n- Chiến dịch đa kênh (Zalo + Facebook cùng lúc)\n- Scheduler hỗ trợ cron expression\n- Bulk import CSV lên đến 50.000 liên hệ\n\n### Cải thiện\n- UI/UX trang campaigns redesign\n- Filter nâng cao cho danh bạ',
    fixCount: 5, updateCount: 8, newCount: 3,
  },
  {
    id: 5, version: '3.3.5', releaseDate: '15/02/2025', status: 'stable',
    changelog: 'Tối ưu bộ nhớ, fix race condition scheduler',
    changelogFull: '### Cải thiện hiệu suất\n- Giảm 35% memory usage cho worker processes\n- Tối ưu connection pool database\n\n### Sửa lỗi\n- Fix race condition khi nhiều scheduler cùng chạy\n- Fix memory leak trong long-running connections',
    fixCount: 6, updateCount: 3, newCount: 0,
  },
  {
    id: 6, version: '3.3.0', releaseDate: '20/01/2025', status: 'stable',
    changelog: 'Plugin marketplace, API webhook v2, dark mode',
    changelogFull: '### Tính năng mới\n- Plugin marketplace với 20+ plugin tích hợp\n- Webhook API v2 với retry logic\n- Dark mode cho toàn bộ giao diện\n- Notification center\n\n### Cải thiện\n- Redesign sidebar navigation\n- Performance audit + optimization',
    fixCount: 10, updateCount: 12, newCount: 4,
  },
  {
    id: 7, version: '3.6.0-beta', releaseDate: '05/05/2025', status: 'beta',
    changelog: '[Beta] AI auto-reply, sentiment analysis, smart scheduling',
    changelogFull: '### Tính năng thử nghiệm\n- AI auto-reply với GPT integration\n- Sentiment analysis cho tin nhắn đến\n- Smart scheduling dựa trên hành vi người dùng\n\n⚠️ **Lưu ý:** Đây là phiên bản beta, không dùng cho production.',
    fixCount: 2, updateCount: 4, newCount: 3,
  },
  {
    id: 8, version: '3.2.8', releaseDate: '10/11/2024', status: 'deprecated',
    changelog: 'Phiên bản cuối series 3.2 — không còn được hỗ trợ',
    changelogFull: '### Thông báo ngừng hỗ trợ\nPhiên bản 3.2.x sẽ không còn nhận cập nhật bảo mật từ 01/01/2025. Vui lòng nâng cấp lên 3.4.x trở lên.\n\n### Sửa lỗi cuối\n- Fix lỗi bảo mật XSS trong chat widget',
    fixCount: 1, updateCount: 0, newCount: 0,
  },
  {
    id: 9, version: '3.1.0', releaseDate: '05/08/2024', status: 'deprecated',
    changelog: 'Phiên bản cũ — đã ngừng hỗ trợ',
    changelogFull: '### Thông báo\nPhiên bản này đã ngừng hỗ trợ. Vui lòng cập nhật ngay.',
    fixCount: 0, updateCount: 0, newCount: 0,
  },
  {
    id: 10, version: '3.0.0', releaseDate: '01/06/2024', status: 'deprecated',
    changelog: 'Major release đầu tiên series 3.x — đã ngừng hỗ trợ',
    changelogFull: '### Major Release\n- Kiến trúc mới hoàn toàn (microservices)\n- Vue 3 + TypeScript rewrite\n- API v2\n\nPhiên bản này đã ngừng hỗ trợ.',
    fixCount: 0, updateCount: 0, newCount: 0,
  },
]

/* ── Form fields ── */
const FORM_FIELDS: FormFieldConfig[] = [
  { key: 'version',     label: 'Phiên bản',    type: 'text',     required: true, placeholder: '3.5.1', half: true },
  { key: 'releaseDate', label: 'Ngày phát hành', type: 'text',   required: true, placeholder: 'DD/MM/YYYY', half: true },
  {
    key: 'status', label: 'Trạng thái', type: 'select',
    options: [
      { value: 'beta',       label: 'Beta' },
      { value: 'stable',     label: 'Ổn định' },
      { value: 'deprecated', label: 'Ngừng hỗ trợ' },
    ],
  },
  { key: 'changelog',     label: 'Tóm tắt changelog', type: 'text',     placeholder: 'Mô tả ngắn về thay đổi...' },
  { key: 'changelogFull', label: 'Changelog đầy đủ',  type: 'textarea', placeholder: 'Markdown changelog...' },
]

/* ── Config ── */
export const versionsConfig: CrudPageConfig<SoftwareVersion> = {
  entity: 'version',
  label:  { singular: 'phiên bản', plural: 'phiên bản' },

  initialData: () => [...MOCK],
  pageSize: 10,

  columns: [
    { key: 'stt',         label: 'STT',         width: '52px',  align: 'center' },
    { key: 'version',     label: 'Phiên bản',   slot: true },
    { key: 'releaseDate', label: 'Ngày phát hành' },
    { key: 'status',      label: 'Trạng thái',  slot: true },
    { key: 'changelog',   label: 'Changelog',   slot: true },
    { key: 'fixCount',    label: 'Fix',          align: 'center', slot: true },
    { key: 'updateCount', label: 'Update',       align: 'center', slot: true },
    { key: 'newCount',    label: 'Mới',          align: 'center', slot: true },
  ],

  searchFields: ['version', 'changelog', 'changelogFull'],
  searchPlaceholder: 'Tìm phiên bản, changelog...',

  filters: [
    {
      key: 'status',
      defaultValue: 'all',
      options: [
        { value: 'all',        label: 'Tất cả trạng thái' },
        { value: 'stable',     label: 'Ổn định' },
        { value: 'beta',       label: 'Beta' },
        { value: 'deprecated', label: 'Ngừng hỗ trợ' },
      ],
      match: (row, val) => row['status'] === val,
    },
  ],

  addForm: {
    title: 'Thêm phiên bản mới',
    fields: FORM_FIELDS,
    initialValues: () => ({ status: 'beta' }),
    validate: (f) => {
      if (!String(f.version ?? '').trim()) return 'Vui lòng nhập số phiên bản'
      return null
    },
    build: (f) => ({
      id:             Date.now(),
      version:        String(f.version ?? ''),
      releaseDate:    String(f.releaseDate ?? new Date().toLocaleDateString('vi-VN')),
      status:         (f.status as SoftwareVersion['status']) ?? 'beta',
      changelog:      String(f.changelog ?? ''),
      changelogFull:  String(f.changelogFull ?? ''),
      fixCount:       0,
      updateCount:    0,
      newCount:       0,
    }),
  },

  editForm: {
    title: 'Cập nhật phiên bản',
    validate: (f) => {
      if (!String(f.version ?? '').trim()) return 'Vui lòng nhập số phiên bản'
      return null
    },
    apply: (target, f) => ({
      ...target,
      version:       String(f.version ?? ''),
      releaseDate:   String(f.releaseDate ?? target.releaseDate),
      status:        (f.status as SoftwareVersion['status']) ?? target.status,
      changelog:     String(f.changelog ?? ''),
      changelogFull: String(f.changelogFull ?? ''),
    }),
  },

  detail: {
    titleKey: 'version',
    sections: [
      {
        title: 'Thông tin phiên bản',
        fields: [
          { key: 'version',     label: 'Phiên bản', code: true },
          { key: 'releaseDate', label: 'Ngày phát hành' },
          { key: 'status',      label: 'Trạng thái', format: (v) => VERSION_STATUS_MAP[v as SoftwareVersion['status']]?.label ?? String(v) },
          { key: 'fixCount',    label: 'Bug fixes', format: (v) => `${v} fixes` },
          { key: 'updateCount', label: 'Cải thiện',  format: (v) => `${v} updates` },
          { key: 'newCount',    label: 'Tính năng mới', format: (v) => `${v} features` },
        ],
      },
      {
        title: 'Tóm tắt',
        fields: [
          { key: 'changelog', label: 'Changelog ngắn' },
        ],
      },
      {
        title: 'Changelog đầy đủ',
        fields: [
          { key: 'changelogFull', label: 'Chi tiết' },
        ],
      },
    ],
  },

  delete: {
    confirmTitle: 'Xoá phiên bản?',
    confirmDescription: (v) => `Phiên bản "${v.version}" sẽ bị xoá vĩnh viễn.`,
  },

  empty: { emoji: '🚀', message: 'Không tìm thấy phiên bản nào' },
}
