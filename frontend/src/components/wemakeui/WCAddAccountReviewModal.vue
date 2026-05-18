<script setup lang="ts">
import { computed } from 'vue'
import { BaseButton, BaseModal } from '../common'

const show = defineModel<boolean>({ required: true })
const props = defineProps<{
  rows: string[][]
  fields: string[]
}>()
const emit = defineEmits<{ confirm: [] }>()

const previewRows = computed(() => props.rows.slice(0, 50))
</script>

<template>
  <BaseModal :show="show" title="Xem trước dữ liệu" size="xl" @close="show = false">
    <div class="review-wrapper">
      <div class="review-info">{{ rows.length }} tài khoản sẽ được nhập</div>
      <div class="review-scroll">
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
        <div v-if="rows.length > 50" class="review-more">
          ... và {{ rows.length - 50 }} dòng khác
        </div>
      </div>
    </div>

    <template #footer>
      <div class="review-footer">
        <BaseButton variant="ghost" @click="show = false">Quay lại</BaseButton>
        <BaseButton variant="primary" @click="() => { emit('confirm'); show = false }">
          Nhập {{ rows.length }} tài khoản
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.review-wrapper { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.review-info { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }
.review-scroll { max-height: 420px; overflow: auto; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); }
.review-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-12); font-family: var(--wx-font-mono); }
.review-table th {
  padding: 7px 10px;
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
  font-size: var(--wx-fs-11);
  font-weight: 600;
  color: var(--wx-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
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
.stt-col { width: 40px; text-align: center; color: var(--wx-text-muted); }
.review-more { padding: 8px 12px; font-size: var(--wx-fs-12); color: var(--wx-text-muted); text-align: center; }
.review-footer { display: flex; justify-content: flex-end; gap: var(--wx-space-2); width: 100%; }
</style>
