<script setup lang="ts">
import { computed } from 'vue'
import { BaseButton } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import MindDialog from './MindDialog.vue'

const show = defineModel<boolean>({ required: true })
const props = defineProps<{
  rows: string[][]
  fields: string[]
}>()
const emit = defineEmits<{ confirm: [] }>()

const previewRows = computed(() => props.rows.slice(0, 50))
</script>

<template>
  <MindDialog
    v-model="show"
    title="Xem trước dữ liệu"
    :subtitle="`${rows.length} bản ghi sẽ được nhập`"
    :icon="SHELL_ICONS.database"
    size="xl"
  >
    <div class="review-wrapper">
      <div class="review-scroll mind-slim-scroll">
        <table class="review-table">
          <thead>
            <tr>
              <th class="stt-col">STT</th>
              <th v-for="f in fields" :key="f">{{ f }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in previewRows" :key="idx">
              <td class="stt-col">{{ idx + 1 }}</td>
              <td v-for="(cell, ci) in row" :key="ci" :title="cell">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="rows.length === 0" class="review-more">Chưa có dữ liệu để xem trước.</div>
        <div v-if="rows.length > 50" class="review-more">
          ... và {{ rows.length - 50 }} dòng khác
        </div>
      </div>
    </div>

    <template #footer-hint>Hiển thị tối đa 50 dòng đầu</template>
    <template #footer>
      <BaseButton variant="ghost" @click="show = false">Quay lại</BaseButton>
      <BaseButton variant="primary" @click="() => { emit('confirm'); show = false }">
        Nhập {{ rows.length }} bản ghi
      </BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
.review-wrapper { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.review-scroll {
  max-height: 420px;
  overflow: auto;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-elevated);
}
.review-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-12); font-family: var(--wx-font-mono); }
.review-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 8px 10px;
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-label);
  text-transform: uppercase;
  color: var(--wx-text-muted);
  white-space: nowrap;
  text-align: left;
}
.review-table td {
  padding: 6px 10px;
  border-bottom: 1px solid var(--wx-border-subtle);
  color: var(--wx-text-secondary);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.review-table tbody tr:hover td { background: var(--wx-selected-bg); }
.review-table tbody tr:last-child td { border-bottom: 0; }
.stt-col { width: 48px; text-align: center !important; color: var(--wx-text-muted); }
.review-more { padding: var(--wx-space-3); font-size: var(--wx-fs-12); color: var(--wx-text-muted); text-align: center; }
</style>
