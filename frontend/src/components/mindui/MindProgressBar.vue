<script setup lang="ts">
/**
 * MindProgressBar — thanh tiến trình tải/quét dữ liệu nằm trên đầu bảng.
 *
 * Port từ "Loading Progress Bar" của AccountManager: nền gradient nhạt có vệt shimmer quét ngang,
 * spinner nhỏ, nhãn giai đoạn, bộ đếm X/Y, thanh fill gradient có chấm sáng ở đầu và badge phần trăm.
 *
 *   <MindProgressBar :active="loading" label="Đang tải dữ liệu" :done="3" :total="8" />
 *   <MindProgressBar :active="scanning" label="Đang quét" />          ← không có total = chỉ shimmer
 *
 * `percent` ưu tiên hơn `done/total`. Có slot `action` (vd nút Dừng).
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  active: boolean
  label?: string
  done?: number
  total?: number
  percent?: number
  /** nhãn phụ trong pill (vd "Giai đoạn 1/2") */
  stage?: string
}>(), {
  label: 'Đang tải dữ liệu…',
})

const pct = computed(() => {
  if (typeof props.percent === 'number') return Math.max(0, Math.min(100, Math.round(props.percent)))
  if (props.total && props.total > 0) return Math.max(0, Math.min(100, Math.round(((props.done ?? 0) / props.total) * 100)))
  return null
})
</script>

<template>
  <Transition name="mpb">
    <div v-if="active" class="mpb" role="progressbar" :aria-valuenow="pct ?? undefined" aria-valuemin="0" aria-valuemax="100" :aria-label="label">
      <span class="mpb__shimmer" :class="{ 'mpb__shimmer--strong': pct === null }" aria-hidden="true" />

      <div class="mpb__row">
        <svg class="mpb__spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>
        <span v-if="stage" class="mpb__stage"><span class="mpb__dot" />{{ stage }}</span>
        <span class="mpb__label">{{ label }}</span>
        <span v-if="total" class="mpb__count"><strong>{{ done ?? 0 }}</strong> / {{ total }}</span>

        <div v-if="pct !== null" class="mpb__meter">
          <span class="mpb__track"><span class="mpb__fill" :style="{ width: `${pct}%` }" /></span>
          <span class="mpb__badge">{{ pct }}%</span>
        </div>

        <slot name="action" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.mpb {
  position: relative;
  height: 36px;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--wx-shell-tone-brand-bd);
  background: linear-gradient(to right, var(--wx-shell-tone-brand-bg), color-mix(in srgb, var(--wx-brand-accent) 10%, var(--wx-surface-base)), var(--wx-shell-tone-brand-bg));
}
.mpb__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--wx-surface-base) 75%, transparent), transparent);
  animation: mind-shimmer 2.4s ease-in-out infinite;
  opacity: 0.55;
}
.mpb__shimmer--strong { opacity: 1; animation-duration: 1.4s; }
.mpb__row { position: relative; z-index: 1; display: flex; align-items: center; gap: var(--wx-space-3); width: 100%; padding: 0 var(--wx-space-3); color: var(--wx-shell-tone-brand-fg); font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); }
.mpb__spin { flex-shrink: 0; animation: mpb-spin 0.9s linear infinite; }
@keyframes mpb-spin { to { transform: rotate(360deg); } }
.mpb__stage { display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px; border-radius: var(--wx-radius-full); background: var(--wx-surface-base); border: 1px solid var(--wx-shell-tone-brand-bd); font-size: 10.5px; font-weight: var(--wx-fw-bold); white-space: nowrap; }
.mpb__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--wx-brand-accent); animation: mind-pulse-ring 1.6s ease-in-out infinite; }
.mpb__label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mpb__count { white-space: nowrap; color: var(--wx-text-muted); font-weight: var(--wx-fw-medium); }
.mpb__count strong { color: var(--wx-brand-accent); font-weight: var(--wx-fw-bold); }
.mpb__meter { display: inline-flex; align-items: center; gap: var(--wx-space-2); margin-left: auto; flex-shrink: 0; }
.mpb__track { position: relative; width: 130px; height: 8px; border-radius: var(--wx-radius-full); background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-default); overflow: hidden; box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.12); }
.mpb__fill { position: relative; display: block; height: 100%; border-radius: inherit; background: linear-gradient(to right, var(--wx-brand-accent), var(--wx-brand-primary)); box-shadow: 0 0 8px color-mix(in srgb, var(--wx-brand-accent) 70%, transparent); transition: width var(--wx-d-normal) var(--wx-ease-standard); }
.mpb__fill::after { content: ''; position: absolute; right: -2px; top: 50%; width: 6px; height: 6px; transform: translateY(-50%); border-radius: 50%; background: var(--wx-surface-base); box-shadow: 0 0 6px var(--wx-brand-accent); }
.mpb__badge { min-width: 34px; padding: 1px 6px; border-radius: 6px; background: var(--wx-surface-base); border: 1px solid var(--wx-shell-tone-brand-bd); color: var(--wx-brand-accent); font-size: 10px; font-weight: 800; text-align: center; font-variant-numeric: tabular-nums; }

.mpb-enter-active, .mpb-leave-active { transition: opacity var(--wx-d-fast) var(--wx-ease-standard), max-height var(--wx-d-normal) var(--wx-ease-standard); max-height: 36px; }
.mpb-enter-from, .mpb-leave-to { opacity: 0; max-height: 0; }

@media (max-width: 640px) { .mpb__track { width: 70px; } .mpb__stage { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .mpb__shimmer, .mpb__spin, .mpb__dot { animation: none; }
  .mpb-enter-active, .mpb-leave-active, .mpb__fill { transition: none; }
}
</style>
