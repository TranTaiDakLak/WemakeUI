<script setup lang="ts">
/**
 * MindStatBar — thanh thống kê ở chân bảng: các chip "nhãn: số" có tông màu + slot bên phải
 * (phân trang, thông tin dải hiển thị…).
 *
 * Port từ cụm chip thống kê "Tổng / Đã chọn / Live / Die" ở góc dưới trái bảng của MindAds.
 *
 *   <MindStatBar :items="[{ label: 'Tổng', value: 8 }, { label: 'Đã chọn', value: 2, tone: 'violet' }]">
 *     <template #right>Hiển thị 1–8</template>
 *   </MindStatBar>
 */
import type { MindStatItem } from './mind-types'

withDefaults(defineProps<{
  items: MindStatItem[]
}>(), {})
</script>

<template>
  <footer class="msb">
    <div class="msb__chips">
      <template v-for="(it, i) in items" :key="`${it.label}-${i}`">
        <span class="msb__chip" :data-tone="it.tone ?? 'neutral'">
          <span class="msb__label">{{ it.label }}</span>
          <strong class="msb__value">{{ it.value }}</strong>
        </span>
        <span v-if="it.divider" class="msb__div" aria-hidden="true" />
      </template>
    </div>
    <div v-if="$slots.right" class="msb__right"><slot name="right" /></div>
  </footer>
</template>

<style scoped>
.msb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--wx-space-3);
  padding: 8px var(--wx-space-4);
  border-top: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  font-size: var(--wx-fs-12);
}
.msb__chips { display: flex; align-items: center; flex-wrap: wrap; gap: var(--wx-space-2); min-width: 0; }
.msb__chip {
  --_bg: var(--wx-shell-tone-neutral-bg);
  --_fg: var(--wx-shell-tone-neutral-fg);
  --_bd: var(--wx-shell-tone-neutral-bd);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--_bd);
  border-radius: 8px;
  background: var(--_bg);
  white-space: nowrap;
}
.msb__chip[data-tone='brand']   { --_bg: var(--wx-shell-tone-brand-bg);   --_fg: var(--wx-shell-tone-brand-fg);   --_bd: var(--wx-shell-tone-brand-bd); }
.msb__chip[data-tone='success'] { --_bg: var(--wx-shell-tone-success-bg); --_fg: var(--wx-shell-tone-success-fg); --_bd: var(--wx-shell-tone-success-bd); }
.msb__chip[data-tone='warning'] { --_bg: var(--wx-shell-tone-warning-bg); --_fg: var(--wx-shell-tone-warning-fg); --_bd: var(--wx-shell-tone-warning-bd); }
.msb__chip[data-tone='danger']  { --_bg: var(--wx-shell-tone-danger-bg);  --_fg: var(--wx-shell-tone-danger-fg);  --_bd: var(--wx-shell-tone-danger-bd); }
.msb__chip[data-tone='violet']  { --_bg: var(--wx-shell-tone-violet-bg);  --_fg: var(--wx-shell-tone-violet-fg);  --_bd: var(--wx-shell-tone-violet-bd); }
.msb__label { color: var(--wx-text-secondary); font-weight: var(--wx-fw-medium); }
.msb__value { color: var(--_fg); font-weight: var(--wx-fw-bold); font-variant-numeric: tabular-nums; }
.msb__div { width: 1px; height: 16px; background: var(--wx-border-default); }
.msb__right { display: inline-flex; align-items: center; gap: var(--wx-space-2); color: var(--wx-text-muted); font-weight: var(--wx-fw-medium); }
</style>
