<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton, BaseOptionRow } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import { useSettingsStore } from '../../stores/mindui/settings'
import type { ColumnConfig } from '../../types'
import MindDialog from './MindDialog.vue'
import MindSection from './MindSection.vue'

const show = defineModel<boolean>({ required: true })
const settingsStore = useSettingsStore()

const localCols = ref<ColumnConfig[]>(settingsStore.dgvColumns.map(c => ({ ...c })))

const GROUPS: { key: string; label: string; description: string }[] = [
  { key: 'account', label: 'Định danh',  description: 'Mã và thông tin nhận diện' },
  { key: 'info',    label: 'Thông tin',  description: 'Thuộc tính mô tả bản ghi' },
  { key: 'ads',     label: 'Tiến trình', description: 'Số liệu theo dõi xử lý' },
  { key: 'action',  label: 'Hoạt động',  description: 'Kết quả và ghi chú thao tác' },
]

const visibleCount = computed(() => localCols.value.filter(c => c.visible).length)

function colsForGroup(group: string) {
  return localCols.value.filter(c => c.group === group)
}

function selectAll(group: string) {
  localCols.value.filter(c => c.group === group).forEach(c => { c.visible = true })
}

function deselectAll(group: string) {
  localCols.value.filter(c => c.group === group).forEach(c => { c.visible = false })
}

function save() {
  settingsStore.updateDgvColumns(localCols.value.map(c => ({ ...c })))
  show.value = false
}
</script>

<template>
  <MindDialog
    v-model="show"
    title="Cấu hình hiển thị cột"
    :subtitle="`${visibleCount}/${localCols.length} cột đang hiển thị trong bảng`"
    :icon="SHELL_ICONS.columns"
    size="lg"
  >
    <div class="view-grid">
      <MindSection
        v-for="g in GROUPS"
        :key="g.key"
        :title="g.label"
        :description="g.description"
        boxed
      >
        <template #extra>
          <BaseButton variant="link" size="sm" @click="selectAll(g.key)">Chọn tất</BaseButton>
          <BaseButton variant="link" size="sm" @click="deselectAll(g.key)">Bỏ chọn</BaseButton>
        </template>
        <div class="view-col-list">
          <BaseOptionRow
            v-for="col in colsForGroup(g.key)"
            :key="col.key"
            v-model="col.visible"
            indicator="check"
            :label="col.label"
          />
          <p v-if="colsForGroup(g.key).length === 0" class="view-empty">Không có cột trong nhóm này.</p>
        </div>
      </MindSection>
    </div>

    <template #footer-hint>Cột bỏ chọn sẽ ẩn khỏi bảng bản ghi</template>
    <template #footer>
      <BaseButton variant="ghost" @click="show = false">Hủy</BaseButton>
      <BaseButton variant="primary" @click="save">Lưu</BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
/* 2 cột chảy tự cân bằng chiều cao (nhóm dài không kéo giãn nhóm ngắn bên cạnh) */
.view-grid { column-count: 2; column-gap: var(--wx-space-4); }
.view-grid > * { break-inside: avoid; margin-bottom: var(--wx-space-4); }
.view-col-list { display: flex; flex-direction: column; gap: 2px; }
.view-empty { margin: 0; padding: var(--wx-space-2); font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

@media (max-width: 720px) {
  .view-grid { column-count: 1; }
}
</style>
