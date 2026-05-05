<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'
import { useAccountsStore } from '../../stores/accounts'
import { useCategoriesStore } from '../../stores/categories'

defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { showToast } = useToast()
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()

const selectedAccounts = computed(() => accountsStore.selectedAccounts)

const COPY_FIELD_OPTIONS = [
  // ── Đăng nhập ──
  { label: 'UID', field: 'uid' },
  { label: 'Password', field: 'password' },
  { label: '2FA', field: 'twofa' },
  { label: 'Email', field: 'email' },
  { label: 'Pass Email', field: 'passEmail' },
  { label: 'Mail khôi phục', field: 'emailRecovery' },
  { label: 'Dữ liệu gốc', field: 'inputAccount' },
  { label: 'Cookie', field: 'cookie' },
  { label: 'Token', field: 'token' },
  { label: 'Proxy', field: 'proxy' },
  { label: 'Useragent', field: 'ua' },
  { label: 'Phone', field: 'phone' },
  { label: '---', field: '' },
  // ── Thông tin cá nhân ──
  { label: 'Họ tên', field: 'fullName' },
  { label: 'Bạn bè', field: 'friends' },
  { label: 'Theo dõi', field: 'follower' },
  { label: 'Giới tính', field: 'gender' },
  { label: 'Sinh nhật', field: 'birthday' },
  { label: 'Bài viết', field: 'post' },
  { label: 'Location', field: 'location' },
  { label: 'Quê quán', field: 'hometown' },
  { label: 'Thành phố', field: 'currentCity' },
  { label: 'Lời mời', field: 'requestFriends' },
  { label: 'Ngày tạo', field: 'dateCreated' },
  { label: 'Group', field: 'groupJoined' },
  { label: 'Group admin', field: 'groupManager' },
  { label: 'Page', field: 'page' },
  { label: 'Page admin', field: 'pageManager' },
  { label: 'Chuyên nghiệp', field: 'professional' },
  { label: 'Hẹn hò', field: 'dating' },
  { label: 'Nick phụ', field: 'secondAccount' },
  { label: 'Marketplace', field: 'marketplace' },
  { label: 'Mail khác', field: 'emailOther' },
  { label: 'Client ID', field: 'clientId' },
  { label: 'Ref Token', field: 'refreshToken' },
  { label: '---', field: '' },
  // ── ADS & BM ──
  { label: 'Quảng cáo', field: 'statusAds' },
  { label: 'TKQC', field: 'tkqc' },
  { label: 'BM', field: 'bm' },
  { label: 'Chat Support', field: 'chatSupport' },
  { label: '---', field: '' },
  // ── Hệ thống ──
  { label: 'Trạng thái', field: 'status' },
  { label: 'Request', field: 'backupRequest' },
  { label: 'Chạy lần cuối', field: 'lastRun' },
  { label: 'Chrome', field: 'profileChrome' },
  { label: 'Thư mục', field: 'categoryId' },
  { label: 'Ngày nhập', field: 'dateImport' },
  { label: 'Ghi chú', field: 'note' },
  { label: 'Checkpoint', field: 'status282' },
  { label: 'Ghi chú chạy', field: 'noteRun' },
  { label: 'Hoạt động', field: 'run' },
] as const

const SEPARATOR_OPTIONS = [
  { label: '| (pipe)', value: '|' },
  { label: 'Tab', value: '\t' },
  { label: ', (phẩy)', value: ',' },
  { label: '; (chấm phẩy)', value: ';' },
  { label: 'Khoảng trắng', value: ' ' },
]

const SLOT_COUNT = 16
const copySlots = ref<number[]>(Array(SLOT_COUNT).fill(-1))
const copySeparator = ref('|')
const copyRecentFormats = ref<{ slots: number[]; label: string }[]>([])
const copyShowMore = ref(false)

function loadCopyRecent() {
  try {
    const raw = localStorage.getItem('wc_copy_recent')
    if (raw) copyRecentFormats.value = JSON.parse(raw)
  } catch { /* ignore */ }
}
function saveCopyRecent() {
  try { localStorage.setItem('wc_copy_recent', JSON.stringify(copyRecentFormats.value.slice(0, 5))) } catch { /* ignore */ }
}

/* ── Auto-save/load last format (like WeBM format_copy.txt) ── */
function saveLastFormat() {
  try { localStorage.setItem('wc_copy_format', JSON.stringify(copySlots.value)) } catch { /* ignore */ }
}
function loadLastFormat() {
  try {
    const raw = localStorage.getItem('wc_copy_format')
    if (raw) {
      const slots = JSON.parse(raw) as number[]
      copySlots.value = slots.concat(Array(SLOT_COUNT).fill(-1)).slice(0, SLOT_COUNT)
    }
  } catch { /* ignore */ }
}

onMounted(() => { loadCopyRecent(); loadLastFormat() })

function reset() {
  copySlots.value = Array(SLOT_COUNT).fill(-1)
}

function applyRecent(item: { slots: number[]; label: string }) {
  copySlots.value = [...item.slots]
  while (copySlots.value.length < SLOT_COUNT) copySlots.value.push(-1)
}

function copyToClipboard(text: string): boolean {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
      return true
    }
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    return true
  } catch { return false }
}

function execute() {
  const maxSlot = copyShowMore.value ? SLOT_COUNT : 8
  const activeSlots = copySlots.value.slice(0, maxSlot)
    .map((s, i) => ({ s, i }))
    .filter(x => x.s >= 0 && COPY_FIELD_OPTIONS[x.s]?.field)
    .map(x => x.s)

  if (!activeSlots.length) { showToast('warning', 'Vui lòng chọn ít nhất 1 trường!'); return }
  if (!selectedAccounts.value.length) { showToast('warning', 'Không có tài khoản đã chọn!'); return }

  const sep = copySeparator.value
  const lines = selectedAccounts.value.map(acc =>
    activeSlots.map(idx => {
      const f = COPY_FIELD_OPTIONS[idx].field
      if (f === 'categoryId') {
        const cat = categoriesStore.categories.find(c => c.id === acc.categoryId)
        return cat ? cat.name : ''
      }
      const val = String((acc as unknown as Record<string, unknown>)[f] ?? '')
      // BM/TKQC: wrap in double quotes (matching WeBM behavior)
      if ((f === 'bm' || f === 'tkqc') && val) return `"${val}"`
      return val
    }).join(sep)
  )
  copyToClipboard(lines.join('\n'))

  const label = activeSlots.map(i => COPY_FIELD_OPTIONS[i].label).join(' | ')
  const exists = copyRecentFormats.value.findIndex(r => r.label === label)
  if (exists >= 0) copyRecentFormats.value.splice(exists, 1)
  copyRecentFormats.value.unshift({ slots: [...copySlots.value], label })
  if (copyRecentFormats.value.length > 5) copyRecentFormats.value.length = 5
  saveCopyRecent()
  saveLastFormat()

  showToast('success', `Đã sao chép ${selectedAccounts.value.length} dòng!`)
  emit('close')
}

function previewText(): string {
  const slots = copySlots.value.slice(0, copyShowMore.value ? 16 : 8)
    .filter(s => s >= 0 && COPY_FIELD_OPTIONS[s]?.field)
  if (!slots.length) return '(chưa chọn trường nào)'
  const sepLabel = copySeparator.value === '\t' ? 'TAB' : copySeparator.value
  return slots.map(s => COPY_FIELD_OPTIONS[s].label).join(` ${sepLabel} `)
}

function removeRecent(idx: number) {
  copyRecentFormats.value.splice(idx, 1)
  saveCopyRecent()
}
</script>

<template>
  <BaseModal :show="show" :title="`Sao chép tùy chỉnh (${selectedAccounts.length} TK)`" size="lg" @close="$emit('close')">
    <div class="copy-body">
      <div class="copy-slots">
        <div v-for="i in 8" :key="i - 1" class="copy-slot">
          <label>Trường {{ i }}</label>
          <select v-model="copySlots[i - 1]">
            <option :value="-1">— Bỏ trống —</option>
            <template v-for="(opt, j) in COPY_FIELD_OPTIONS" :key="j">
              <option v-if="opt.field" :value="j">{{ opt.label }}</option>
              <option v-else disabled>────────────</option>
            </template>
          </select>
        </div>
      </div>
      <div v-if="copyShowMore" class="copy-slots copy-slots--more">
        <div v-for="i in 8" :key="i + 7" class="copy-slot">
          <label>Trường {{ i + 8 }}</label>
          <select v-model="copySlots[i + 7]">
            <option :value="-1">— Bỏ trống —</option>
            <template v-for="(opt, j) in COPY_FIELD_OPTIONS" :key="j">
              <option v-if="opt.field" :value="j">{{ opt.label }}</option>
              <option v-else disabled>────────────</option>
            </template>
          </select>
        </div>
      </div>
      <div class="copy-separator">
        <label>Ký tự phân cách:</label>
        <select v-model="copySeparator">
          <option v-for="s in SEPARATOR_OPTIONS" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>
      <div class="copy-preview">
        <label>Xem trước:</label>
        <code>{{ previewText() }}</code>
      </div>
    </div>
    <div class="copy-actions">
      <button class="copy-btn copy-btn--primary" @click="execute">Sao chép</button>
      <button class="copy-btn copy-btn--secondary" @click="reset">Reset</button>
      <button class="copy-btn copy-btn--secondary" @click="copyShowMore = !copyShowMore">{{ copyShowMore ? 'Thu gọn' : 'Thêm trường' }}</button>
    </div>
    <div v-if="copyRecentFormats.length" class="copy-recent">
      <label>Định dạng gần đây:</label>
      <div v-for="(r, i) in copyRecentFormats" :key="i" class="copy-recent-item">
        <span class="copy-recent-label" @click="applyRecent(r)">{{ r.label }}</span>
        <button class="copy-recent-remove" @click.stop="removeRecent(i)" title="Xóa">&times;</button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.copy-body { margin-bottom: 12px; }
.copy-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px 12px; margin-bottom: 14px; }
.copy-slots--more { border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 4px; }
.copy-slot { display: flex; flex-direction: column; gap: 3px; }
.copy-slot label { font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.3px; }
.copy-slot select { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px; background: var(--card-bg); color: var(--text-primary); cursor: pointer; }
.copy-slot select:focus { border-color: var(--brand-primary); outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
.copy-separator { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.copy-separator label { font-size: 13px; color: var(--text-secondary); font-weight: 600; white-space: nowrap; }
.copy-separator select { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px; flex: 1; max-width: 180px; background: var(--card-bg); color: var(--text-primary); }
.copy-preview { background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 4px; padding: 10px 14px; margin-bottom: 4px; }
.copy-preview label { display: block; font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 4px; }
.copy-preview code { font-size: 13px; color: var(--brand-primary); font-family: var(--font-family-mono); word-break: break-all; }
.copy-actions { display: flex; gap: 8px; margin-top: 12px; }
.copy-btn { padding: 8px 18px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; }
.copy-btn--primary { background: var(--brand-primary); color: #fff; }
.copy-btn--primary:hover { opacity: 0.88; }
.copy-btn--secondary { background: var(--bg-tertiary); color: var(--text-primary); border-color: var(--border-color); }
.copy-btn--secondary:hover { background: var(--hover-bg); }
.copy-recent { padding-top: 12px; border-top: 1px solid var(--border-color); margin-top: 12px; }
.copy-recent > label { display: block; font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 6px; }
.copy-recent-item { display: flex; align-items: center; gap: 6px; padding: 6px 10px; font-size: 12px; color: var(--text-secondary); background: var(--bg-tertiary); border-radius: 4px; margin-bottom: 4px; transition: all 0.12s; }
.copy-recent-label { flex: 1; cursor: pointer; }
.copy-recent-label:hover { color: var(--brand-primary); }
.copy-recent-remove { background: none; border: none; color: var(--text-tertiary); font-size: 16px; cursor: pointer; padding: 0 4px; line-height: 1; }
.copy-recent-remove:hover { color: var(--error-color); }
</style>
