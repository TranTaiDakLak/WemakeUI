<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'
import { useAccountsStore } from '../../stores/accounts'
import { useCategoriesStore } from '../../stores/categories'
import type { AccountRow } from '../../types/account'

interface ParsedRow {
  [key: string]: string
}

const FIELD_LABELS: Record<string, string> = {
  uid: 'UID', password: 'Mật khẩu', twofa: '2FA', email: 'Email',
  passEmail: 'Pass Email', emailRecovery: 'Mail khôi phục', emailOther: 'Mail khác',
  cookie: 'Cookie', token: 'Token', birthday: 'Sinh nhật', fullName: 'Họ tên',
  phone: 'Phone', note: 'Ghi chú', clientId: 'Client ID', refreshToken: 'Refresh Token',
}

const props = defineProps<{
  show: boolean
  accounts: ParsedRow[]
  fieldKeys: string[]
  categoryId: number | null
}>()

const emit = defineEmits<{ close: [], done: [] }>()

const { showToast } = useToast()
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()

const replaceExisting = ref(false)
const selectedCategoryId = ref<number | null>(null)

/* ─── Dynamic columns from selected fields ─── */
const columns = computed(() => {
  return props.fieldKeys.map(key => ({
    key,
    label: FIELD_LABELS[key] || key,
  }))
})

/* ─── Stats ─── */
const existingUids = computed(() => new Set(accountsStore.accounts.map(a => a.uid)))
const countTotal = computed(() => props.accounts.length)
const countSuccess = computed(() => props.accounts.filter(a => a.uid?.trim()).length)
const countFail = computed(() => props.accounts.filter(a => !a.uid?.trim()).length)
const countDup = computed(() => props.accounts.filter(a => a.uid && existingUids.value.has(a.uid)).length)

/* ─── Import ─── */
function handleImport() {
  const rows = props.accounts
    .filter(a => a.uid?.trim())
    .filter(a => replaceExisting.value || !existingUids.value.has(a.uid))

  if (!rows.length) {
    showToast('warning', 'Không có tài khoản hợp lệ để thêm!')
    return
  }

  const mapped: Array<Partial<AccountRow> & { uid: string }> = rows.map(row => {
    const acc: Record<string, string> = {}
    for (const key of props.fieldKeys) {
      if (row[key]) acc[key] = row[key]
    }
    return acc as unknown as Partial<AccountRow> & { uid: string }
  })

  accountsStore.addBatch(mapped)
  showToast('success', `Đã thêm ${mapped.length} tài khoản!`)
  emit('done')
  emit('close')
}

/* ─── Sync category from parent on open ─── */
import { watch } from 'vue'
watch(() => props.show, (val) => {
  if (val) selectedCategoryId.value = props.categoryId
})
</script>

<template>
  <BaseModal :show="show" title="Xem trước nhập tài khoản" size="xl" show-save save-label="Thêm" @close="$emit('close')" @save="handleImport">
    <div class="review-content">
      <!-- Header: Category + Stats -->
      <div class="review-header">
        <div class="review-category">
          <span class="review-label">Thư mục:</span>
          <select class="form-input" v-model="selectedCategoryId">
            <option :value="null">Tất cả</option>
            <option v-for="cat in categoriesStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div class="review-stats">
          <span class="stat stat--total">Tổng: <strong>{{ countTotal }}</strong></span>
          <span class="stat stat--success">Thành công: <strong>{{ countSuccess }}</strong></span>
          <span class="stat stat--fail">Lỗi: <strong>{{ countFail }}</strong></span>
          <span class="stat stat--dup">Trùng: <strong>{{ countDup }}</strong></span>
        </div>
      </div>

      <!-- DataGrid preview -->
      <div class="review-grid">
        <table class="review-table">
          <thead><tr>
            <th style="width:40px;text-align:center">STT</th>
            <th v-for="col in columns" :key="col.key" :style="{ minWidth: col.key === 'cookie' ? '200px' : '100px' }">{{ col.label }}</th>
            <th style="min-width:200px">Dữ liệu gốc</th>
          </tr></thead>
          <tbody>
            <tr v-for="(acc, idx) in accounts" :key="idx" :class="{ 'row-error': !acc.uid?.trim(), 'row-dup': acc.uid && existingUids.has(acc.uid) }">
              <td style="text-align:center;color:var(--text-tertiary)">{{ idx + 1 }}</td>
              <td v-for="col in columns" :key="col.key"
                  :style="{ fontFamily: ['uid','password','twofa','cookie','token','clientId','refreshToken'].includes(col.key) ? 'Consolas,monospace' : 'inherit', fontSize: '12px' }">
                {{ acc[col.key] || '—' }}
              </td>
              <td style="font-family:Consolas,monospace;font-size:11px;color:var(--text-tertiary);max-width:300px;overflow:hidden;text-overflow:ellipsis">{{ acc._raw || '' }}</td>
            </tr>
            <tr v-if="!accounts.length">
              <td :colspan="columns.length + 2" style="text-align:center;color:var(--text-tertiary);padding:40px">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Replace option -->
      <label class="replace-option">
        <input type="checkbox" v-model="replaceExisting" />
        <span>Xóa và ghi lại tài khoản nếu đã có trong phần mềm ({{ countDup }} trùng)</span>
      </label>
    </div>
  </BaseModal>
</template>

<style scoped>
.review-content { display: flex; flex-direction: column; gap: 12px; }
.review-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.review-category { display: flex; align-items: center; gap: 8px; }
.review-label { font-size: 13px; color: var(--text-secondary); font-weight: 600; white-space: nowrap; }
.form-input {
  font-family: var(--font-family); font-size: 13px; padding: 5px 10px;
  border: 1px solid var(--border-color); border-radius: var(--radius-sm);
  background: var(--bg-primary); color: var(--text-primary); outline: none;
}
.review-stats { display: flex; gap: 20px; font-size: 13px; }
.stat strong { font-weight: 700; }
.stat--total strong { color: dodgerblue; }
.stat--success strong { color: green; }
.stat--fail strong { color: red; }
.stat--dup strong { color: orange; }
.review-grid { overflow: auto; max-height: 400px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); }
.review-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.review-table th { padding: 8px 10px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-tertiary); background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); white-space: nowrap; position: sticky; top: 0; z-index: 2; }
.review-table td { padding: 7px 10px; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
.review-table tbody tr:hover td { background: var(--hover-bg); }
.row-error td { background: rgba(239, 68, 68, 0.06); }
.row-dup td { background: rgba(245, 158, 11, 0.06); }
.replace-option { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); cursor: pointer; }
.replace-option input { accent-color: var(--brand-primary); }
</style>
