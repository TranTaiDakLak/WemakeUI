<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseButton, BaseSelectMenu, BaseCheckbox, BaseTextarea, BaseModal } from '../common'
import type { CategoryItem } from '../../types/account'

const show = defineModel<boolean>({ required: true })
const props = defineProps<{ categories: CategoryItem[] }>()
const emit = defineEmits<{ preview: [rows: string[][]] }>()

const ALL_FIELDS = [
  { key: 'uid',           label: 'UID *',           required: true  },
  { key: 'password',      label: 'Mật khẩu *',      required: true  },
  { key: 'twofa',         label: '2FA *',            required: true  },
  { key: 'email',         label: 'Email *',          required: true  },
  { key: 'passEmail',     label: 'Pass Email',       required: false },
  { key: 'emailRecovery', label: 'Email Recovery',   required: false },
  { key: 'cookie',        label: 'Cookie',           required: false },
  { key: 'token',         label: 'Token',            required: false },
  { key: 'fullName',      label: 'Họ tên',           required: false },
  { key: 'birthday',      label: 'Ngày sinh',        required: false },
  { key: 'phone',         label: 'Số điện thoại',   required: false },
  { key: 'proxy',         label: 'Proxy',            required: false },
  { key: 'ua',            label: 'Useragent',        required: false },
  { key: 'note',          label: 'Ghi chú',          required: false },
  { key: 'clientId',      label: 'Client ID',        required: false },
]

const selectedFields = ref<string[]>(['uid', 'password', 'twofa', 'email'])
const separator = ref('|')
const textarea = ref('')
const selectedCategoryId = ref<number>(1)
const recentFormats = ['uid|pass|2fa|email', 'uid|pass|email', 'cookie|token']

const separatorOptions = [
  { value: '|',  label: '| Pipe' },
  { value: ',',  label: ', Dấu phẩy' },
  { value: '\t', label: '→ Tab' },
  { value: ':',  label: ': Hai chấm' },
]

const categoryOptions = computed(() =>
  props.categories.filter(c => c.id !== 0).map(c => ({ value: c.id.toString(), label: c.name }))
)

const formatPreview = computed(() =>
  selectedFields.value.map(f => ALL_FIELDS.find(x => x.key === f)?.label ?? f).join(separator.value)
)

const rowCount = computed(() =>
  textarea.value.trim() ? textarea.value.trim().split('\n').filter(Boolean).length : 0
)

function moveUp(index: number) {
  if (index <= 0) return
  const arr = [...selectedFields.value]
  ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
  selectedFields.value = arr
}

function moveDown(index: number) {
  if (index >= selectedFields.value.length - 1) return
  const arr = [...selectedFields.value]
  ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
  selectedFields.value = arr
}

function toggleField(key: string) {
  const idx = selectedFields.value.indexOf(key)
  if (idx > -1) {
    if (ALL_FIELDS.find(f => f.key === key)?.required) return
    selectedFields.value.splice(idx, 1)
  } else {
    selectedFields.value.push(key)
  }
}

function applyFormat(fmt: string) {
  selectedFields.value = fmt.split(/[|,\t:]/)
  separator.value = fmt.includes('|') ? '|' : fmt.includes(',') ? ',' : '|'
}

function doPreview() {
  const lines = textarea.value.trim().split('\n').filter(Boolean)
  const parsed = lines.map(line => line.split(separator.value))
  emit('preview', parsed)
}
</script>

<template>
  <BaseModal :show="show" title="+ Thêm tài khoản" size="xl" @close="show = false">
    <div class="add-layout">
      <!-- LEFT: field selector -->
      <div class="add-left">
        <div class="field-section-title">Chọn trường dữ liệu</div>

        <div class="field-list">
          <div
            v-for="(fk, idx) in selectedFields"
            :key="fk"
            class="field-row"
          >
            <span class="field-move-btn" @click="moveUp(idx)">▲</span>
            <span class="field-move-btn" @click="moveDown(idx)">▼</span>
            <BaseCheckbox
              :model-value="true"
              :label="ALL_FIELDS.find(f => f.key === fk)?.label ?? fk"
              :disabled="ALL_FIELDS.find(f => f.key === fk)?.required"
              @update:model-value="() => toggleField(fk)"
            />
          </div>

          <div class="field-divider" />

          <div
            v-for="field in ALL_FIELDS.filter(f => !selectedFields.includes(f.key))"
            :key="field.key"
            class="field-row"
          >
            <span class="field-move-spacer" />
            <span class="field-move-spacer" />
            <BaseCheckbox
              :model-value="false"
              :label="field.label"
              @update:model-value="() => toggleField(field.key)"
            />
          </div>
        </div>

        <div class="recent-formats">
          <div class="field-section-title" style="margin-top:12px">Format gần đây</div>
          <div
            v-for="fmt in recentFormats"
            :key="fmt"
            class="recent-fmt-item"
            @click="applyFormat(fmt)"
          >{{ fmt }}</div>
        </div>
      </div>

      <!-- RIGHT: preview + input -->
      <div class="add-right">
        <div class="preview-bar">
          <span class="preview-label">Preview:</span>
          <span class="preview-text">{{ formatPreview }}</span>
        </div>

        <div class="sep-row">
          <label>Dấu phân cách</label>
          <BaseSelectMenu v-model="separator" :options="separatorOptions" size="sm" />
          <BaseButton variant="ghost" size="sm">📂 Tải file...</BaseButton>
        </div>

        <BaseTextarea
          v-model="textarea"
          :rows="14"
          :autosize="false"
          placeholder="Dán dữ liệu vào đây, mỗi dòng một tài khoản..."
          style="font-family:var(--wx-font-mono);flex:1"
        />

        <div class="add-footer-row">
          <span class="row-count">{{ rowCount }} tài khoản</span>
          <BaseSelectMenu
            :model-value="selectedCategoryId.toString()"
            :options="categoryOptions"
            size="sm"
            @update:model-value="v => (selectedCategoryId = Number(v))"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="add-footer">
        <BaseButton variant="ghost" @click="show = false">Hủy</BaseButton>
        <BaseButton variant="primary" :disabled="rowCount === 0" @click="doPreview">Xem trước</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.add-layout { display: grid; grid-template-columns: 240px 1fr; gap: var(--wx-space-4); }

.add-left { display: flex; flex-direction: column; overflow-y: auto; max-height: 480px; }
.field-section-title { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.field-list { display: flex; flex-direction: column; gap: 4px; }
.field-row { display: flex; align-items: center; gap: 4px; }
.field-move-btn { width: 16px; font-size: 10px; color: var(--wx-text-muted); cursor: pointer; user-select: none; text-align: center; }
.field-move-btn:hover { color: var(--wx-brand-600); }
.field-move-spacer { width: 16px; }
.field-divider { height: 1px; background: var(--wx-border-subtle); margin: 6px 0; }

.recent-fmt-item {
  font-size: var(--wx-fs-12);
  font-family: var(--wx-font-mono);
  color: var(--wx-text-secondary);
  padding: 3px 6px;
  border-radius: var(--wx-radius-sm);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recent-fmt-item:hover { background: var(--wx-surface-sunken); color: var(--wx-brand-600); }

.add-right { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.preview-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-fs-12);
  font-family: var(--wx-font-mono);
  overflow-x: auto;
}
.preview-label { font-weight: 600; color: var(--wx-text-muted); white-space: nowrap; }
.preview-text { color: var(--wx-brand-600); }
.sep-row { display: flex; align-items: center; gap: var(--wx-space-3); font-size: var(--wx-fs-13); }
.sep-row label { color: var(--wx-text-secondary); white-space: nowrap; }
.add-footer-row { display: flex; align-items: center; gap: var(--wx-space-3); }
.row-count { font-size: var(--wx-fs-12); color: var(--wx-text-muted); flex: 1; }
.add-footer { display: flex; justify-content: flex-end; gap: var(--wx-space-2); width: 100%; }
</style>
