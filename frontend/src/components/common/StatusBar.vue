<script setup lang="ts">
import type { AccountStats } from '../../types'

const props = withDefaults(defineProps<{
  stats?: AccountStats
  statusText?: string
  userName?: string
  expiryDate?: string
  version?: string
  progress?: number
}>(), {
  statusText: 'Sẵn sàng',
  userName: '',
  expiryDate: '',
  version: '',
  progress: -1,
})

const emit = defineEmits<{
  'segment-click': [segment: string]
}>()
</script>

<template>
  <div class="app-statusbar">
    <div class="statusbar-group">
      <!-- Default stats (if provided) -->
      <template v-if="props.stats">
        <span class="statusbar-item statusbar-item--clickable" @click="emit('segment-click', 'live')">
          Live: <b class="sb-val sb-live">{{ props.stats.live }}</b>
        </span>
        <span class="sb-sep" />
        <span class="statusbar-item statusbar-item--clickable" @click="emit('segment-click', 'die')">
          Die: <b class="sb-val sb-die">{{ props.stats.total - props.stats.live }}</b>
        </span>
        <span class="sb-sep" />
        <span class="statusbar-item statusbar-item--clickable" @click="emit('segment-click', 'total')">
          Tổng: <b class="sb-val sb-total">{{ props.stats.total }}</b>
        </span>
        <span class="sb-sep" />
        <span class="statusbar-item statusbar-item--clickable" @click="emit('segment-click', 'highlighted')">
          Bôi đen: <b class="sb-val sb-highlight">{{ props.stats.highlighted }}</b>
        </span>
        <span class="sb-sep" />
        <span class="statusbar-item statusbar-item--clickable" @click="emit('segment-click', 'selected')">
          Đã chọn: <b class="sb-val sb-selected">{{ props.stats.selected }}</b>
        </span>
      </template>

      <!-- Custom left slot -->
      <slot name="left" />

      <!-- Progress indicator -->
      <template v-if="props.progress >= 0">
        <span class="sb-sep" />
        <span class="statusbar-item statusbar-progress">
          <span class="statusbar-progress__bar">
            <span class="statusbar-progress__fill" :style="{ width: Math.min(100, props.progress) + '%' }" />
          </span>
          <span class="statusbar-progress__text">{{ Math.round(props.progress) }}%</span>
        </span>
      </template>
    </div>

    <div class="statusbar-group">
      <!-- Custom right slot -->
      <slot name="right" />

      <span v-if="props.statusText" class="statusbar-item">
        <b class="sb-val sb-status">{{ props.statusText }}</b>
      </span>
      <template v-if="props.userName">
        <span class="sb-sep" />
        <span class="statusbar-item">
          <b class="sb-val sb-user">{{ props.userName }}</b>
        </span>
      </template>
      <template v-if="props.expiryDate">
        <span class="sb-sep" />
        <span class="statusbar-item">
          HSD: <b class="sb-val sb-expiry">{{ props.expiryDate }}</b>
        </span>
      </template>
      <template v-if="props.version">
        <span class="sb-sep" />
        <span class="statusbar-item sb-version">{{ props.version }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.app-statusbar {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background: var(--wx-surface-sunken);
  border-top: 1px solid var(--wx-border-subtle);
  flex-shrink: 0;
  font-family: var(--wx-font-primary);
  font-size: 12px;
  color: var(--wx-text-secondary);
}
.statusbar-group { display: flex; align-items: center; gap: 8px; }
.statusbar-item { display: inline-flex; align-items: center; gap: 3px; white-space: nowrap; }
.statusbar-item--clickable { cursor: pointer; border-radius: var(--wx-radius-sm); padding: 1px 4px; margin: -1px -4px; transition: background var(--wx-duration-fast); }
.statusbar-item--clickable:hover { background: var(--wx-hover-bg); }
.sb-sep { width: 1px; height: 14px; background: var(--wx-border-subtle); flex-shrink: 0; }
.sb-val { font-weight: 600; }
.sb-live { color: var(--wx-success-text); }
.sb-die { color: var(--wx-danger-text); }
.sb-total { color: var(--wx-success-text); }
.sb-highlight { color: var(--wx-brand-primary); }
.sb-selected { color: var(--wx-danger-text); }
.sb-status { color: var(--wx-success-text); }
.sb-user { color: var(--wx-success-text); }
.sb-expiry { color: var(--wx-success-text); }
.sb-version { font-size: 11px; color: var(--wx-text-muted); }

/* Progress indicator */
.statusbar-progress { gap: 6px; }
.statusbar-progress__bar {
  width: 80px;
  height: 6px;
  background: var(--wx-border-default);
  border-radius: var(--wx-radius-full);
  overflow: hidden;
}
.statusbar-progress__fill {
  display: block;
  height: 100%;
  background: var(--wx-gradient-button);
  border-radius: var(--wx-radius-full);
  transition: width 0.3s var(--wx-easing-default);
}
.statusbar-progress__text {
  font-size: 11px;
  color: var(--wx-text-secondary);
  min-width: 30px;
}
</style>
