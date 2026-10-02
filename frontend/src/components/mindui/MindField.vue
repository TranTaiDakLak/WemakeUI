<script setup lang="ts">
/**
 * MindField — một dòng trường nhập trong hộp thoại: nhãn + (gợi ý) + điều khiển.
 *
 *   <MindField label="Số luồng" hint="1–50"><BaseInput v-model="n" type="number" size="sm" /></MindField>
 *   <MindField label="Danh sách" stacked><BaseTextarea … /></MindField>
 *
 * Mặc định xếp ngang (nhãn bên trái, điều khiển bên phải); `stacked` hoặc màn hẹp thì xếp dọc.
 */
withDefaults(defineProps<{
  label: string
  hint?: string
  /** xếp nhãn phía trên điều khiển */
  stacked?: boolean
  /** bề rộng cột nhãn khi xếp ngang */
  labelWidth?: string
}>(), {
  stacked: false,
  labelWidth: '150px',
})
</script>

<template>
  <div class="mind-field-row" :class="{ 'mind-field-row--stacked': stacked }" :style="{ '--mf-label-w': labelWidth }">
    <div class="mind-field-row__label">
      <span class="mind-field-row__name">{{ label }}</span>
      <span v-if="hint" class="mind-field-row__hint">{{ hint }}</span>
    </div>
    <div class="mind-field-row__control"><slot /></div>
  </div>
</template>

<style scoped>
.mind-field-row {
  display: grid;
  grid-template-columns: var(--mf-label-w) minmax(0, 1fr);
  align-items: center;
  gap: var(--wx-space-3);
  min-width: 0;
}
.mind-field-row--stacked { grid-template-columns: minmax(0, 1fr); align-items: stretch; gap: 6px; }
.mind-field-row__label { display: flex; flex-direction: column; min-width: 0; }
.mind-field-row__name { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-text-secondary); }
.mind-field-row__hint { font-size: var(--wx-fs-11); color: var(--wx-text-light); }
.mind-field-row__control { display: flex; align-items: center; gap: var(--wx-space-2); min-width: 0; }
/* điều khiển trực tiếp giãn hết cột; ô có width cố định (vd số) thêm flex: 0 0 auto để giữ nguyên */
.mind-field-row__control > :deep(*) { flex: 1 1 auto; min-width: 0; }
.mind-field-row--stacked .mind-field-row__control { align-items: stretch; }

@media (max-width: 560px) {
  .mind-field-row { grid-template-columns: minmax(0, 1fr); align-items: stretch; gap: 6px; }
  .mind-field-row__control { align-items: stretch; }
}
</style>
