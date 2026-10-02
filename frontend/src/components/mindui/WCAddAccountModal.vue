<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseButton, BaseSelectMenu, BaseSegmented, BaseTextarea, BaseOptionRow } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import type { CategoryItem } from '../../types/account'
import MindDialog from './MindDialog.vue'
import MindSection from './MindSection.vue'

const show = defineModel<boolean>({ required: true })
const props = defineProps<{ categories: CategoryItem[] }>()
const emit = defineEmits<{ preview: [rows: string[][], fields?: string[]] }>()

const ALL_FIELDS = [
  { key: 'uid',           label: 'Mã *',             required: true  },
  { key: 'password',      label: 'Loại *',           required: true  },
  { key: 'twofa',         label: 'Phiên bản *',      required: true  },
  { key: 'email',         label: 'Email liên hệ *',  required: true  },
  { key: 'passEmail',     label: 'Email phụ',        required: false },
  { key: 'emailRecovery', label: 'Email dự phòng',   required: false },
  { key: 'cookie',        label: 'Tệp đính kèm',     required: false },
  { key: 'token',         label: 'Trạng thái duyệt', required: false },
  { key: 'fullName',      label: 'Tiêu đề',          required: false },
  { key: 'birthday',      label: 'Ngày tạo',         required: false },
  { key: 'phone',         label: 'Số điện thoại',    required: false },
  { key: 'proxy',         label: 'Đơn vị phụ trách', required: false },
  { key: 'ua',            label: 'Nguồn',            required: false },
  { key: 'note',          label: 'Ghi chú',          required: false },
  { key: 'clientId',      label: 'Mã tham chiếu',    required: false },
]

const selectedFields = ref<string[]>(['uid', 'password', 'twofa', 'email'])
const separator = ref('|')
const textarea = ref('')
const selectedCategoryId = ref<number>(1)
const recentFormats = ['uid|password|twofa|email', 'uid|fullName|password', 'uid|fullName|note']

/** Nhãn hiển thị của trường — bỏ dấu `*` (trạng thái bắt buộc đã có badge riêng). */
function plainLabel(key: string): string {
  return (ALL_FIELDS.find(f => f.key === key)?.label ?? key).replace(/\s*\*$/, '')
}

function isRequired(key: string): boolean {
  return ALL_FIELDS.find(f => f.key === key)?.required ?? false
}

/** Hiển thị format gần đây theo nhãn tiếng Việt thay vì key thô. */
function formatLabel(fmt: string): string {
  return fmt.split('|').map(plainLabel).join(' | ')
}

const separatorOptions = [
  { value: '|',  label: 'Pipe  |' },
  { value: ',',  label: 'Phẩy  ,' },
  { value: '\t', label: 'Tab  →' },
  { value: ':',  label: 'Hai chấm  :' },
]

const categoryOptions = computed(() =>
  props.categories.filter(c => c.id !== 0).map(c => ({ value: c.id.toString(), label: c.name }))
)

const formatPreview = computed(() =>
  selectedFields.value.map(plainLabel).join(separator.value === '\t' ? ' → ' : ` ${separator.value} `)
)

const unselectedFields = computed(() => ALL_FIELDS.filter(f => !selectedFields.value.includes(f.key)))

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
  emit('preview', parsed, selectedFields.value.map(plainLabel))
}
</script>

<template>
  <MindDialog
    v-model="show"
    title="Thêm bản ghi"
    subtitle="Chọn trường dữ liệu, dán danh sách rồi xem trước khi nhập"
    :icon="SHELL_ICONS.plus"
    size="xl"
  >
    <div class="add-layout">
      <!-- TRÁI: chọn trường dữ liệu -->
      <div class="add-left">
        <MindSection title="Trường dữ liệu" :description="`${selectedFields.length} trường đang dùng`">
          <div class="field-list mind-slim-scroll">
            <BaseOptionRow
              v-for="(fk, idx) in selectedFields"
              :key="fk"
              indicator="check"
              highlight
              :model-value="true"
              :label="plainLabel(fk)"
              :badge="isRequired(fk) ? 'Bắt buộc' : undefined"
              :disabled="isRequired(fk)"
              @update:model-value="toggleField(fk)"
            >
              <template #trailing>
                <span class="field-move">
                  <button type="button" class="field-move__btn" :disabled="idx === 0" :aria-label="`Đưa ${plainLabel(fk)} lên trên`" @click="moveUp(idx)" v-html="SHELL_ICONS.chevronUp" />
                  <button type="button" class="field-move__btn" :disabled="idx === selectedFields.length - 1" :aria-label="`Đưa ${plainLabel(fk)} xuống dưới`" @click="moveDown(idx)" v-html="SHELL_ICONS.chevronDown" />
                </span>
              </template>
            </BaseOptionRow>

            <div v-if="unselectedFields.length" class="field-divider" role="separator" />

            <BaseOptionRow
              v-for="field in unselectedFields"
              :key="field.key"
              indicator="check"
              :model-value="false"
              :label="plainLabel(field.key)"
              @update:model-value="toggleField(field.key)"
            />
          </div>
        </MindSection>

        <MindSection title="Định dạng gần đây">
          <div class="recent-list">
            <button
              v-for="fmt in recentFormats"
              :key="fmt"
              type="button"
              class="recent-fmt-item"
              :title="formatLabel(fmt)"
              @click="applyFormat(fmt)"
            >{{ formatLabel(fmt) }}</button>
          </div>
        </MindSection>
      </div>

      <!-- PHẢI: xem trước + nhập liệu -->
      <div class="add-right">
        <div class="preview-bar">
          <span class="preview-label">Định dạng</span>
          <span class="preview-text">{{ formatPreview }}</span>
        </div>

        <MindSection title="Dấu phân cách">
          <div class="sep-row">
            <BaseSegmented v-model="separator" :options="separatorOptions" size="sm" tone="neutral" aria-label="Dấu phân cách" />
            <BaseButton variant="ghost" size="sm" :icon="SHELL_ICONS.download">Tải file…</BaseButton>
          </div>
        </MindSection>

        <MindSection title="Dữ liệu" description="Mỗi dòng là một bản ghi" class="add-data">
          <BaseTextarea
            v-model="textarea"
            :rows="12"
            :autosize="false"
            placeholder="Dán dữ liệu vào đây, mỗi dòng một bản ghi..."
            style="font-family: var(--wx-font-mono)"
          />
        </MindSection>

        <div class="add-footer-row">
          <span class="row-count" :class="{ 'is-ready': rowCount > 0 }">{{ rowCount }} bản ghi</span>
          <span class="add-cat-label">Thư mục</span>
          <BaseSelectMenu
            :model-value="selectedCategoryId.toString()"
            :options="categoryOptions"
            size="sm"
            class="add-cat-select"
            @update:model-value="v => (selectedCategoryId = Number(v))"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="show = false">Hủy</BaseButton>
      <BaseButton variant="primary" :disabled="rowCount === 0" @click="doPreview">Xem trước</BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
.add-layout { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: var(--wx-space-5); align-items: start; }

.add-left { display: flex; flex-direction: column; gap: var(--wx-space-4); min-width: 0; }
.field-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 360px;
  overflow-y: auto;
  padding: var(--wx-space-1);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-sunken);
}
/* trường bắt buộc: vẫn khoá thao tác nhưng giữ chữ rõ (badge Bắt buộc) */
.field-list :deep(.wx-option-row--disabled) { opacity: 1; }
.field-divider { height: 1px; margin: 4px 6px; background: var(--wx-border-default); }

.field-move { display: inline-flex; align-items: center; gap: 2px; }
.field-move__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: var(--wx-radius-ctrl-sm);
  background: transparent;
  color: var(--wx-text-light);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.field-move__btn :deep(svg) { width: 14px; height: 14px; }
.field-move__btn:hover:not(:disabled) { background: var(--wx-hover-neutral); color: var(--wx-brand-600); }
.field-move__btn:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: -1px; }
.field-move__btn:disabled { opacity: 0.3; cursor: default; }

.recent-list { display: flex; flex-direction: column; gap: 2px; }
.recent-fmt-item {
  display: block;
  width: 100%;
  padding: 5px 8px;
  border: 1px solid transparent;
  border-radius: var(--wx-radius-ctrl-sm);
  background: transparent;
  color: var(--wx-text-secondary);
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-11);
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), border-color var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.recent-fmt-item:hover { background: var(--wx-selected-bg); border-color: var(--wx-selected-border); color: var(--wx-brand-600); }
.recent-fmt-item:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: -1px; }

.add-right { display: flex; flex-direction: column; gap: var(--wx-space-4); min-width: 0; }
.preview-bar {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: 8px 12px;
  border: 1px solid var(--wx-selected-border);
  border-radius: var(--wx-radius-ctrl);
  background: var(--wx-selected-bg);
  font-size: var(--wx-fs-12);
  overflow-x: auto;
}
.preview-label { flex-shrink: 0; font-weight: var(--wx-fw-bold); letter-spacing: var(--wx-tracking-label); text-transform: uppercase; font-size: 10px; color: var(--wx-text-muted); }
.preview-text { font-family: var(--wx-font-mono); font-weight: var(--wx-fw-semibold); color: var(--wx-brand-600); white-space: nowrap; }
.sep-row { display: flex; align-items: center; gap: var(--wx-space-3); flex-wrap: wrap; }
.add-data :deep(textarea) { min-height: 200px; }

.add-footer-row { display: flex; align-items: center; gap: var(--wx-space-3); flex-wrap: wrap; }
.row-count { margin-right: auto; font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-text-muted); }
.row-count.is-ready { color: var(--wx-brand-600); }
.add-cat-label { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-text-secondary); }
.add-cat-select { min-width: 160px; }

@media (max-width: 820px) {
  .add-layout { grid-template-columns: minmax(0, 1fr); }
  .field-list { max-height: 260px; }
}
</style>
