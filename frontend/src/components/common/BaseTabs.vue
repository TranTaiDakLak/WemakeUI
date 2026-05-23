<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps<{
  modelValue: string
  tabs: Array<{ key: string; label: string; icon?: string; disabled?: boolean }>
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const indicatorStyle = ref({ left: '0px', width: '0px' })
const tabsRef = ref<HTMLElement>()

function updateIndicator() {
  if (!tabsRef.value) return
  const active = tabsRef.value.querySelector('.base-tabs__tab--active') as HTMLElement
  if (active) {
    indicatorStyle.value = {
      left: `${active.offsetLeft}px`,
      width: `${active.offsetWidth}px`
    }
  }
}

watch(() => props.modelValue, () => nextTick(updateIndicator))
watch(() => props.tabs, () => nextTick(updateIndicator), { deep: true })
onMounted(() => nextTick(updateIndicator))
</script>

<template>
  <div class="base-tabs">
    <div ref="tabsRef" class="base-tabs__header">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="base-tabs__tab"
        :class="{
          'base-tabs__tab--active': modelValue === tab.key,
          'base-tabs__tab--disabled': tab.disabled
        }"
        :disabled="tab.disabled"
        @click="!tab.disabled && $emit('update:modelValue', tab.key)"
      >
        <span v-if="tab.icon" class="base-tabs__icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
      <span class="base-tabs__indicator" :style="indicatorStyle" />
    </div>
    <div class="base-tabs__content">
      <template v-for="tab in tabs" :key="tab.key">
        <div v-show="modelValue === tab.key">
          <slot :name="tab.key" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.base-tabs {
  display: flex;
  flex-direction: column;
}

.base-tabs__header {
  position: relative;
  display: flex;
  background: var(--wx-surface-sunken);
  padding: 4px;
  border-radius: var(--wx-radius-xl, 12px);
  margin-bottom: 20px;
}

.base-tabs__tab {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: var(--wx-text-secondary);
  font-family: var(--wx-font-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--wx-radius-lg, 8px);
  transition: color var(--wx-duration-fast) var(--wx-easing-default),
              background var(--wx-duration-fast) var(--wx-easing-default);
}
.base-tabs__tab:hover:not(:disabled):not(.base-tabs__tab--active) {
  color: var(--wx-brand-primary);
  background: color-mix(in srgb, var(--wx-brand-primary) 10%, transparent);
}
.base-tabs__tab--active {
  color: var(--wx-text-inverse);
}
.base-tabs__tab--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-tabs__indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  background: var(--wx-gradient-header);
  border-radius: var(--wx-radius-lg, 8px);
  box-shadow: var(--wx-shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

.base-tabs__icon {
  display: inline-flex;
  font-size: 16px;
}
</style>
