<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="page-header">
    <div class="page-header-info">
      <h2 class="page-header-title">{{ title }}</h2>
      <p v-if="description" class="page-header-desc">{{ description }}</p>
    </div>
    <div class="page-header-actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.page-header-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.page-header-desc {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.page-header-actions {
  display: flex;
  gap: var(--space-sm);
  flex-shrink: 0;
}
</style>
