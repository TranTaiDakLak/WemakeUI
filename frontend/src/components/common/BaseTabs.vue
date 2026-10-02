<script lang="ts">
let _tabsIdCounter = 0
</script>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps<{
  modelValue: string
  tabs: Array<{ key: string; label: string; icon?: string; disabled?: boolean }>
  variant?: 'pill' | 'underline'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uid = ++_tabsIdCounter
function tabId(key: string) { return `base-tabs-${uid}-tab-${key}` }
function panelId(key: string) { return `base-tabs-${uid}-panel-${key}` }

const indicatorStyle = ref({ left: '0px', width: '0px' })
const tabsRef = ref<HTMLElement>()
const tabButtons = ref<HTMLButtonElement[]>([])

function setTabButtonRef(el: unknown, index: number) {
  if (el) tabButtons.value[index] = el as HTMLButtonElement
}

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

function selectTab(index: number) {
  const tab = props.tabs[index]
  if (!tab || tab.disabled) return
  emit('update:modelValue', tab.key)
  nextTick(() => tabButtons.value[index]?.focus())
}

function onTablistKeydown(e: KeyboardEvent) {
  const { tabs } = props
  if (!tabs.length) return
  const enabledIndices = tabs.map((_, i) => i).filter(i => !tabs[i].disabled)
  if (!enabledIndices.length) return
  const currentIndex = tabs.findIndex(t => t.key === props.modelValue)

  function step(from: number, dir: 1 | -1) {
    let i = from
    for (let count = 0; count < tabs.length; count++) {
      i = (i + dir + tabs.length) % tabs.length
      if (!tabs[i].disabled) return i
    }
    return from
  }

  let targetIndex: number | null = null
  switch (e.key) {
    case 'ArrowRight':
      targetIndex = step(currentIndex, 1)
      break
    case 'ArrowLeft':
      targetIndex = step(currentIndex, -1)
      break
    case 'Home':
      targetIndex = enabledIndices[0]
      break
    case 'End':
      targetIndex = enabledIndices[enabledIndices.length - 1]
      break
    default:
      return
  }
  e.preventDefault()
  if (targetIndex !== null) selectTab(targetIndex)
}
</script>

<template>
  <div class="base-tabs" :class="`base-tabs--${variant ?? 'pill'}`">
    <div ref="tabsRef" class="base-tabs__header" role="tablist" @keydown="onTablistKeydown">
      <button
        v-for="(tab, tabIndex) in tabs"
        :key="tab.key"
        :ref="el => setTabButtonRef(el, tabIndex)"
        :id="tabId(tab.key)"
        role="tab"
        class="base-tabs__tab"
        :class="{
          'base-tabs__tab--active': modelValue === tab.key,
          'base-tabs__tab--disabled': tab.disabled
        }"
        :disabled="tab.disabled"
        :aria-selected="tab.key === modelValue"
        :aria-disabled="tab.disabled"
        :aria-controls="panelId(tab.key)"
        :tabindex="tab.key === modelValue ? 0 : -1"
        @click="!tab.disabled && $emit('update:modelValue', tab.key)"
      >
        <span v-if="tab.icon" class="base-tabs__icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
      <span v-if="(variant ?? 'pill') === 'pill'" class="base-tabs__indicator" :style="indicatorStyle" />
    </div>
    <div class="base-tabs__content">
      <template v-for="tab in tabs" :key="tab.key">
        <div
          v-show="modelValue === tab.key"
          :id="panelId(tab.key)"
          role="tabpanel"
          :aria-labelledby="tabId(tab.key)"
          tabindex="0"
        >
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

/* Pill = segmented control kiểu nguồn (LanguageSwitcher): rãnh sunken + viền, mục đang chọn là khối xanh đặc */
.base-tabs__header {
  position: relative;
  display: flex;
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-default);
  padding: var(--wx-space-1);
  border-radius: var(--wx-radius-lg, 12px);
  margin-bottom: 20px;
}

.base-tabs__tab {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--wx-space-2);
  min-height: var(--wx-control-h-md);
  padding: 0 var(--wx-space-4);
  border: none;
  background: transparent;
  color: var(--wx-text-secondary);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-control-fs);
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--wx-radius-ctrl);
  transition: color var(--wx-duration-fast) var(--wx-easing-default),
              background var(--wx-duration-fast) var(--wx-easing-default);
}
.base-tabs__tab:focus-visible {
  outline: 2px solid var(--wx-brand-focus);
  outline-offset: 1px;
}
.base-tabs__tab:hover:not(:disabled):not(.base-tabs__tab--active) {
  color: var(--wx-brand-primary);
  background: var(--wx-surface-base);
}
.base-tabs__tab--active {
  color: var(--wx-text-on-brand);
}
.base-tabs__tab--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-tabs__indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  background: var(--wx-gradient-primary);
  border-radius: var(--wx-radius-ctrl);
  box-shadow: var(--wx-shadow-btn);
  transition: left var(--wx-d-normal) var(--wx-ease-bounce), width var(--wx-d-normal) var(--wx-ease-bounce);
  z-index: 0;
}

.base-tabs__icon {
  display: inline-flex;
  font-size: 16px;
}

/* ── Underline variant ── */
.base-tabs--underline .base-tabs__header {
  background: transparent;
  padding: var(--wx-space-1) 6px;
  border-radius: var(--wx-radius-lg, 8px);
  border: 1px solid var(--wx-border-default);
  margin-bottom: 20px;
  gap: 2px;
}
.base-tabs--underline .base-tabs__tab {
  flex: none;
  min-height: calc(var(--wx-control-h-md) - 6px);
  padding: 0 14px;
  border-radius: var(--wx-radius-ctrl-sm);
  color: var(--wx-text-secondary);
  font-size: var(--wx-control-fs);
  font-weight: 500;
  position: relative;
  transition: color var(--wx-duration-fast) var(--wx-easing-default),
              background var(--wx-duration-fast) var(--wx-easing-default);
}
.base-tabs--underline .base-tabs__tab::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 8px;
  right: 8px;
  height: 2px;
  background: var(--wx-brand-primary);
  border-radius: 2px 2px 0 0;
  transform: scaleX(0);
  transition: transform 0.2s var(--wx-easing-default);
}
.base-tabs--underline .base-tabs__tab--active {
  color: var(--wx-brand-primary);
  font-weight: 600;
}
.base-tabs--underline .base-tabs__tab--active::after {
  transform: scaleX(1);
}
.base-tabs--underline .base-tabs__tab:hover:not(:disabled):not(.base-tabs__tab--active) {
  color: var(--wx-text-primary);
  background: var(--wx-hover-neutral);
}
</style>
