<script setup lang="ts">
/**
 * DashMetric — khối label + value lặp lại trong các card KPI dashboard.
 * Internal, demo-app-only — không phải thành phần thư viện.
 * size 'md': dùng ở CrmView/ProjectView. size 'lg': dùng ở AnalyticsView/EcommerceView.
 * Slot mặc định render bên dưới value (BaseTag, BaseProgress, note...).
 */
withDefaults(defineProps<{
  label: string
  value: string
  size?: 'md' | 'lg'
}>(), {
  size: 'md',
})
</script>

<template>
  <div class="dash-metric" :class="`dash-metric--${size}`">
    <span class="dash-metric__label">{{ label }}</span>
    <strong class="dash-metric__value">{{ value }}</strong>
    <slot />
  </div>
</template>

<style scoped>
.dash-metric {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}
.dash-metric__label {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
}
.dash-metric--md .dash-metric__value {
  font-size: var(--wx-fs-20);
  color: var(--wx-content-primary);
  font-weight: var(--wx-fw-bold);
}
.dash-metric--lg .dash-metric__value {
  font-size: var(--wx-fs-24);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
}
</style>
