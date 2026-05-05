<script setup lang="ts">
/**
 * StepProgress — segmented progress cho multi-step process.
 * Theo §5.4: progress chuẩn `segmented` cho multi-step.
 *
 *   <StepProgress :steps="['nhập email', 'xác thực', 'hoàn tất']" :current="1" />
 *
 * states mỗi step: pending / active / done / error.
 */

interface Props {
  steps: ReadonlyArray<string | { label: string; description?: string; status?: StepStatus }>
  /** index của step đang active (zero-based). các step trước = done. */
  current?: number
  /** orientation. default horizontal */
  orientation?: 'horizontal' | 'vertical'
  /** size. default md */
  size?: 'sm' | 'md' | 'lg'
}

type StepStatus = 'pending' | 'active' | 'done' | 'error'

const props = withDefaults(defineProps<Props>(), {
  current: 0,
  orientation: 'horizontal',
  size: 'md',
})

function stepStatus(idx: number, override?: StepStatus): StepStatus {
  if (override) return override
  if (idx < props.current) return 'done'
  if (idx === props.current) return 'active'
  return 'pending'
}

function stepLabel(s: Props['steps'][number]) {
  return typeof s === 'string' ? s : s.label
}
function stepDesc(s: Props['steps'][number]) {
  return typeof s === 'string' ? '' : s.description ?? ''
}
function stepOverride(s: Props['steps'][number]) {
  return typeof s === 'string' ? undefined : s.status
}
</script>

<template>
  <ol
    class="wx-step-progress"
    :data-orientation="orientation"
    :data-size="size"
    role="list"
  >
    <li
      v-for="(s, i) in steps"
      :key="i"
      class="wx-step"
      :data-status="stepStatus(i, stepOverride(s))"
      :aria-current="stepStatus(i, stepOverride(s)) === 'active' ? 'step' : undefined"
    >
      <div class="wx-step__marker" aria-hidden="true">
        <span v-if="stepStatus(i, stepOverride(s)) === 'done'" class="wx-step__icon">✓</span>
        <span v-else-if="stepStatus(i, stepOverride(s)) === 'error'" class="wx-step__icon">!</span>
        <span v-else class="wx-step__num">{{ i + 1 }}</span>
      </div>
      <div class="wx-step__body">
        <div class="wx-step__label">{{ stepLabel(s) }}</div>
        <div v-if="stepDesc(s)" class="wx-step__desc">{{ stepDesc(s) }}</div>
      </div>
      <span v-if="i < steps.length - 1" class="wx-step__connector" aria-hidden="true" />
    </li>
  </ol>
</template>

<style scoped>
.wx-step-progress {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  font-family: var(--wx-font-primary);
}
.wx-step-progress[data-orientation='horizontal'] { flex-direction: row; align-items: flex-start; }
.wx-step-progress[data-orientation='vertical']   { flex-direction: column; }

.wx-step {
  position: relative;
  display: flex;
  gap: var(--wx-space-2);
  flex: 1;
  min-width: 0;
}
.wx-step-progress[data-orientation='vertical'] .wx-step {
  align-items: flex-start;
  padding-bottom: var(--wx-space-4);
}

.wx-step__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--wx-radius-full);
  border: 2px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  color: var(--wx-text-secondary);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  flex-shrink: 0;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard),
    color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-step-progress[data-size='sm'] .wx-step__marker { width: 20px; height: 20px; font-size: 11px; }
.wx-step-progress[data-size='lg'] .wx-step__marker { width: 32px; height: 32px; font-size: var(--wx-fs-14); }

.wx-step__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 2px;
  min-width: 0;
}
.wx-step__label {
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
}
.wx-step__desc {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
}

.wx-step__connector {
  position: absolute;
  background: var(--wx-border-default);
  z-index: 0;
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-step-progress[data-orientation='horizontal'] .wx-step__connector {
  height: 2px;
  top: 11px;
  left: calc(24px + var(--wx-space-2));
  right: calc(-1 * var(--wx-space-2));
}
.wx-step-progress[data-orientation='horizontal'][data-size='sm'] .wx-step__connector { top: 9px; left: calc(20px + var(--wx-space-2)); }
.wx-step-progress[data-orientation='horizontal'][data-size='lg'] .wx-step__connector { top: 15px; left: calc(32px + var(--wx-space-2)); }
.wx-step-progress[data-orientation='vertical'] .wx-step__connector {
  width: 2px;
  left: 11px;
  top: calc(24px + 4px);
  bottom: 4px;
}

/* status */
.wx-step[data-status='active'] .wx-step__marker {
  border-color: var(--wx-brand-primary);
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--wx-brand-primary) 18%, transparent);
}
.wx-step[data-status='active'] .wx-step__label {
  color: var(--wx-text-primary);
  font-weight: var(--wx-fw-semibold);
}

.wx-step[data-status='done'] .wx-step__marker {
  border-color: var(--wx-success-solid);
  background: var(--wx-success-solid);
  color: var(--wx-text-inverse);
}
.wx-step[data-status='done'] + .wx-step .wx-step__connector,
.wx-step[data-status='done'] .wx-step__connector {
  background: var(--wx-success-solid);
}

.wx-step[data-status='error'] .wx-step__marker {
  border-color: var(--wx-danger-solid);
  background: var(--wx-danger-solid);
  color: var(--wx-text-inverse);
}
.wx-step[data-status='error'] .wx-step__label { color: var(--wx-danger-text); }

@media (prefers-reduced-motion: reduce) {
  .wx-step__marker,
  .wx-step__connector { transition: none; }
}
</style>
