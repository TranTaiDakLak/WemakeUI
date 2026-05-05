<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BaseModal, GroupBox } from '../common'
import { useToast } from '../../composables'
import { useCategoriesStore } from '../../stores/categories'
import type { AccountRow } from '../../types/account'

interface ParsedRow {
  [key: string]: string
}

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{
  close: []
  preview: [accounts: ParsedRow[], fieldKeys: string[], categoryId: number | null]
}>()

const { showToast } = useToast()
const categoriesStore = useCategoriesStore()

/* ─── Field checkboxes (15 fields from WeBM frmAddAccount) ─── */
const fields = ref([
  { key: 'uid', label: 'UID', checked: true },
  { key: 'password', label: 'Mật khẩu', checked: true },
  { key: 'twofa', label: '2FA', checked: true },
  { key: 'email', label: 'Email', checked: true },
  { key: 'passEmail', label: 'Mật khẩu email', checked: false },
  { key: 'emailRecovery', label: 'Email khôi phục', checked: false },
  { key: 'emailOther', label: 'Mail khác', checked: false },
  { key: 'cookie', label: 'Cookie', checked: false },
  { key: 'token', label: 'Token', checked: false },
  { key: 'birthday', label: 'Sinh nhật', checked: false },
  { key: 'fullName', label: 'Họ tên', checked: false },
  { key: 'phone', label: 'Số điện thoại', checked: false },
  { key: 'note', label: 'Ghi chú', checked: false },
  { key: 'clientId', label: 'Client_ID', checked: false },
  { key: 'refreshToken', label: 'Refresh_token', checked: false },
])

const selectedFields = computed(() => fields.value.filter(f => f.checked))
const formatPreview = computed(() => selectedFields.value.map(f => f.label).join(' | '))

/* ─── Field reorder (WeBM btnUp/btnDown) ─── */
function moveFieldUp(idx: number) {
  if (idx <= 0) return
  const arr = fields.value
  ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
}
function moveFieldDown(idx: number) {
  if (idx >= fields.value.length - 1) return
  const arr = fields.value
  ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
}

/* ─── Account input ─── */
const accountText = ref('')
const separator = ref('|')
const accountCount = computed(() => {
  return accountText.value.trim().split('\n').filter(l => l.trim()).length
})

/* ─── Category (from store) ─── */
const selectedCategoryId = ref<number | null>(null)

/* ─── Recent formats ─── */
const recentFormats = ref<{ label: string; keys: string[] }[]>([])
function loadRecent() {
  try {
    const raw = localStorage.getItem('wc_add_recent')
    if (raw) recentFormats.value = JSON.parse(raw)
  } catch { /* ignore */ }
}
function saveRecent(keys: string[]) {
  const label = keys.join(' | ')
  recentFormats.value = recentFormats.value.filter(r => r.label !== label)
  recentFormats.value.unshift({ label, keys })
  if (recentFormats.value.length > 5) recentFormats.value.length = 5
  try { localStorage.setItem('wc_add_recent', JSON.stringify(recentFormats.value)) } catch { /* ignore */ }
}
function applyRecent(item: { label: string; keys: string[] }) {
  fields.value.forEach(f => { f.checked = item.keys.includes(f.key) })
}

/* ─── File import ─── */
function onFileImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.txt,.csv'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      accountText.value = accountText.value
        ? accountText.value + '\n' + text
        : text
      showToast('success', `Đã tải ${file.name}`)
    }
    reader.readAsText(file)
  }
  input.click()
}

/* ─── Parse & emit ─── */
function parseAccounts(): ParsedRow[] {
  const lines = accountText.value.trim().split('\n').filter(l => l.trim())
  const keys = selectedFields.value.map(f => f.key)
  const sep = separator.value === 'tab' ? '\t' : separator.value

  return lines.map(line => {
    const parts = line.split(sep)
    const row: ParsedRow = { _raw: line }
    keys.forEach((key, i) => {
      row[key] = (parts[i] || '').trim()
    })
    return row
  })
}

function handlePreview() {
  if (!accountText.value.trim()) {
    showToast('warning', 'Vui lòng nhập tài khoản!')
    return
  }
  if (!selectedFields.value.length) {
    showToast('warning', 'Vui lòng chọn ít nhất 1 trường!')
    return
  }
  saveRecent(selectedFields.value.map(f => f.key))
  const parsed = parseAccounts()
  emit('preview', parsed, selectedFields.value.map(f => f.key), selectedCategoryId.value)
}

/* ─── Reset on open ─── */
watch(() => props.show, (val) => {
  if (val) loadRecent()
})

loadRecent()
</script>

<template>
  <BaseModal :show="show" title="Thêm tài khoản" size="lg" show-save save-label="Xem trước" @close="$emit('close')" @save="handlePreview">
    <div class="add-layout">
      <!-- Left: Field selection -->
      <div class="add-left">
        <GroupBox title="Định dạng nhập">
          <div class="field-list">
            <div v-for="(f, idx) in fields" :key="f.key" class="field-item">
              <label class="chk-item">
                <input type="checkbox" v-model="f.checked" /><span>{{ f.label }}</span>
              </label>
              <div class="field-arrows">
                <button class="arrow-btn" :disabled="idx === 0" @click="moveFieldUp(idx)" title="Lên">▲</button>
                <button class="arrow-btn" :disabled="idx === fields.length - 1" @click="moveFieldDown(idx)" title="Xuống">▼</button>
              </div>
            </div>
          </div>
        </GroupBox>
        <div v-if="recentFormats.length" class="recent-list">
          <div class="recent-title">Định dạng gần đây:</div>
          <div v-for="(r, i) in recentFormats" :key="i" class="recent-item" @click="applyRecent(r)">{{ r.label }}</div>
        </div>
      </div>

      <!-- Right: Account input -->
      <div class="add-right">
        <div class="format-preview">
          <span class="format-label">Định dạng:</span>
          <code>{{ formatPreview || '(chưa chọn trường)' }}</code>
        </div>

        <!-- Separator + File import row -->
        <div class="input-toolbar">
          <span class="toolbar-label">Phân cách:</span>
          <select class="form-input form-input--sm" v-model="separator">
            <option value="|">| (pipe)</option>
            <option value="tab">Tab</option>
            <option value=",">, (dấu phẩy)</option>
            <option value=";">; (chấm phẩy)</option>
          </select>
          <button class="toolbar-btn" @click="onFileImport" title="Tải từ file TXT/CSV">Tải file...</button>
        </div>

        <textarea v-model="accountText" class="account-input" rows="14"
          :placeholder="`Nhập tài khoản, mỗi dòng một tài khoản\nĐịnh dạng: ${formatPreview}\nPhân cách bằng ${separator === 'tab' ? 'Tab' : separator}`" />

        <div class="account-footer">
          <span class="account-count">{{ accountCount }} tài khoản</span>
          <div class="category-select">
            <span class="category-label">Thư mục:</span>
            <select class="form-input" v-model="selectedCategoryId">
              <option :value="null">Tất cả</option>
              <option v-for="cat in categoriesStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.add-layout { display: flex; gap: 16px; }
.add-left { width: 240px; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px; }
.add-right { flex: 1; display: flex; flex-direction: column; gap: 8px; }

.field-list { display: flex; flex-direction: column; gap: 1px; }
.field-item { display: flex; align-items: center; justify-content: space-between; }
.chk-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; padding: 2px 0; flex: 1; }
.chk-item input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }
.field-arrows { display: flex; gap: 2px; }
.arrow-btn {
  width: 18px; height: 16px; border: none; background: var(--bg-tertiary); color: var(--text-tertiary);
  font-size: 8px; cursor: pointer; border-radius: 2px; display: flex; align-items: center; justify-content: center;
  transition: all 0.12s;
}
.arrow-btn:hover:not(:disabled) { background: var(--hover-bg); color: var(--brand-primary); }
.arrow-btn:disabled { opacity: 0.3; cursor: default; }

.format-preview { padding: 8px 12px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; }
.format-label { color: var(--text-tertiary); font-weight: 600; margin-right: 6px; }
.format-preview code { color: var(--brand-primary); font-family: Consolas, monospace; font-size: 12px; }

.input-toolbar { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.toolbar-label { color: var(--text-tertiary); white-space: nowrap; }
.toolbar-btn {
  padding: 4px 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);
  background: var(--bg-primary); color: var(--text-secondary); font-size: 12px; cursor: pointer;
  transition: all 0.12s;
}
.toolbar-btn:hover { border-color: var(--brand-primary); color: var(--brand-primary); }

.form-input {
  font-family: var(--font-family); font-size: 13px; padding: 5px 10px;
  border: 1px solid var(--border-color); border-radius: var(--radius-sm);
  background: var(--bg-primary); color: var(--text-primary); outline: none;
}
.form-input:focus { border-color: var(--brand-primary); }
.form-input--sm { width: 100px; }

.account-input {
  flex: 1; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);
  font-family: Consolas, monospace; font-size: 13px; resize: none;
  background: var(--bg-primary); color: var(--text-secondary); outline: none;
}
.account-input:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
.account-input::placeholder { color: var(--text-tertiary); font-family: var(--font-family); }

.account-footer { display: flex; align-items: center; justify-content: space-between; }
.account-count { font-size: 12px; font-weight: 600; color: var(--brand-primary); }
.category-select { display: flex; align-items: center; gap: 8px; }
.category-label { font-size: 12px; color: var(--text-tertiary); white-space: nowrap; }

.recent-list { display: flex; flex-direction: column; gap: 4px; }
.recent-title { font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; }
.recent-item { padding: 5px 8px; font-size: 11px; color: var(--text-secondary); background: var(--bg-tertiary); border-radius: var(--radius-sm); cursor: pointer; transition: all 0.12s; }
.recent-item:hover { background: var(--hover-bg); color: var(--brand-primary); }
</style>
