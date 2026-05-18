<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseCheckbox, GroupBox, BaseModal } from '../common'
import { useSettingsStore } from '../../stores/wemakeui/settings'
import type { ColumnConfig } from '../../types'

const show = defineModel<boolean>({ required: true })
const settingsStore = useSettingsStore()

const localCols = ref<ColumnConfig[]>(settingsStore.dgvColumns.map(c => ({ ...c })))

const GROUPS: { key: string; label: string }[] = [
  { key: 'account', label: 'Tài khoản' },
  { key: 'info',    label: 'Thông tin' },
  { key: 'ads',     label: 'Quảng cáo' },
  { key: 'action',  label: 'Hoạt động' },
]

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
  <BaseModal :show="show" title="▦ Cấu hình hiển thị cột" size="lg" @close="show = false">
    <div class="view-grid">
      <GroupBox
        v-for="g in GROUPS"
        :key="g.key"
        :title="g.label"
      >
        <div class="view-actions">
          <BaseButton variant="neutral" size="sm" @click="selectAll(g.key)">Chọn tất</BaseButton>
          <BaseButton variant="neutral" size="sm" @click="deselectAll(g.key)">Bỏ chọn</BaseButton>
        </div>
        <div class="view-col-list">
          <BaseCheckbox
            v-for="col in colsForGroup(g.key)"
            :key="col.key"
            v-model="col.visible"
            :label="col.label"
          />
        </div>
      </GroupBox>
    </div>

    <template #footer>
      <div class="view-footer">
        <BaseButton variant="ghost" @click="show = false">Hủy</BaseButton>
        <BaseButton variant="primary" @click="save">Lưu</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.view-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-4);
}
.view-actions {
  display: flex;
  gap: var(--wx-space-2);
  margin-bottom: var(--wx-space-2);
}
.view-col-list { display: flex; flex-direction: column; gap: 6px; }
.view-footer { display: flex; justify-content: flex-end; gap: var(--wx-space-2); width: 100%; }
</style>
