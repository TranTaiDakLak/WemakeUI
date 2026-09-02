<script setup lang="ts">
/**
 * LegendDot — chấm màu tròn nhỏ dùng trong chú thích (legend) biểu đồ/label.
 * Internal, demo-app-only — không phải thành phần thư viện.
 */
withDefaults(defineProps<{
  color: string
  size?: number
}>(), {
  size: 8,
})
</script>

<template>
  <span class="legend-dot" :style="{ background: color, width: size + 'px', height: size + 'px' }" />
</template>

<style scoped>
.legend-dot {
  display: inline-block;
  border-radius: 9999px;
  flex-shrink: 0;
}
</style>
