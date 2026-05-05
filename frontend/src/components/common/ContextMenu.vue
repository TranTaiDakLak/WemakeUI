<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { ContextMenuItem } from '../../types'

const props = defineProps<{
  show: boolean
  x: number
  y: number
  items: ContextMenuItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

// ── State ──
const openSubId = ref('')
const focusedIdx = ref(-1)
const menuRef = ref<HTMLElement>()
let subTimer: ReturnType<typeof setTimeout> | null = null

// ── Flat actionable items (skip separators & section headers) ──
const actionItems = computed(() => props.items.filter(i => !i.separator && !i.disabled))

// ── Viewport-aware position ──
const posX = ref(0)
const posY = ref(0)

watch(() => props.show, (val) => {
  if (val) {
    focusedIdx.value = -1
    openSubId.value = ''
    nextTick(adjustPosition)
    nextTick(() => menuRef.value?.focus())
  }
})

function adjustPosition() {
  const menuW = 220
  const menuH = props.items.length * 32 + 8
  posX.value = props.x + menuW > window.innerWidth ? props.x - menuW : props.x
  posY.value = props.y + menuH > window.innerHeight ? Math.max(4, props.y - menuH) : props.y
}

const subOpenLeft = computed(() => posX.value + 440 > window.innerWidth)

// ── Submenu hover delay ──
function onSubHover(id: string) {
  if (subTimer) clearTimeout(subTimer)
  subTimer = setTimeout(() => { openSubId.value = id }, 200)
}

function onSubLeave() {
  if (subTimer) clearTimeout(subTimer)
  subTimer = setTimeout(() => { openSubId.value = '' }, 150)
}

// ── Item click ──
function onItemClick(item: ContextMenuItem) {
  if (item.disabled || item.separator) return
  if (item.children?.length) {
    openSubId.value = openSubId.value === item.id ? '' : item.id
    return
  }
  item.action?.()
  emit('close')
}

function onChildClick(child: ContextMenuItem) {
  if (child.disabled) return
  child.action?.()
  emit('close')
}

// ── Keyboard navigation ──
function onKeydown(e: KeyboardEvent) {
  if (!props.show) return
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusedIdx.value = Math.min(focusedIdx.value + 1, actionItems.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIdx.value = Math.max(focusedIdx.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      if (focusedIdx.value >= 0 && focusedIdx.value < actionItems.value.length) {
        onItemClick(actionItems.value[focusedIdx.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      emit('close')
      break
    case 'ArrowRight':
      // Open submenu
      if (focusedIdx.value >= 0) {
        const item = actionItems.value[focusedIdx.value]
        if (item.children?.length) openSubId.value = item.id
      }
      break
    case 'ArrowLeft':
      openSubId.value = ''
      break
  }
}

// ── Click outside ──
function onClickOutside() {
  if (props.show) emit('close')
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  if (subTimer) clearTimeout(subTimer)
})

function isFocused(item: ContextMenuItem): boolean {
  return focusedIdx.value >= 0 && actionItems.value[focusedIdx.value]?.id === item.id
}

// Check if item is a section header (has label, no action, no children, not separator)
function isSectionHeader(item: ContextMenuItem): boolean {
  return !item.separator && !item.action && !item.children?.length && item.disabled === true && !!item.label
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="props.show"
      ref="menuRef"
      class="dgv-ctx"
      :class="{ 'dgv-ctx--left': subOpenLeft }"
      :style="{ left: posX + 'px', top: posY + 'px' }"
      tabindex="-1"
      @click.stop
      @keydown="onKeydown"
    >
      <template v-for="item in props.items" :key="item.id">
        <!-- Separator -->
        <div v-if="item.separator" class="dgv-ctx-sep" />

        <!-- Section header -->
        <div v-else-if="isSectionHeader(item)" class="dgv-ctx-section">
          {{ item.label }}
        </div>

        <!-- Parent with children -->
        <div
          v-else-if="item.children?.length"
          class="dgv-ctx-item dgv-ctx-parent"
          :class="{
            'dgv-ctx-parent--active': openSubId === item.id,
            'dgv-ctx-disabled': item.disabled,
            'dgv-ctx-item--focused': isFocused(item)
          }"
          @click.stop="onItemClick(item)"
          @mouseenter="onSubHover(item.id)"
          @mouseleave="onSubLeave"
        >
          <span v-if="item.icon" class="dgv-ctx-icon" v-html="item.icon" />
          {{ item.label }}
          <div
            class="dgv-ctx-sub"
            :class="{ 'dgv-ctx-sub--open': openSubId === item.id }"
            @mouseenter="onSubHover(item.id)"
            @mouseleave="onSubLeave"
          >
            <button
              v-for="child in item.children"
              :key="child.id"
              class="dgv-ctx-item"
              :class="{ 'dgv-ctx-item--danger': child.danger, 'dgv-ctx-disabled': child.disabled }"
              @click.stop="onChildClick(child)"
            >
              <span v-if="child.icon" class="dgv-ctx-icon" v-html="child.icon" />
              {{ child.label }}
            </button>
          </div>
        </div>

        <!-- Normal item -->
        <button
          v-else
          class="dgv-ctx-item"
          :class="{
            'dgv-ctx-item--danger': item.danger,
            'dgv-ctx-disabled': item.disabled,
            'dgv-ctx-item--focused': isFocused(item)
          }"
          @click.stop="onItemClick(item)"
        >
          <span v-if="item.icon" class="dgv-ctx-icon" v-html="item.icon" />
          {{ item.label }}
        </button>
      </template>
    </div>
  </teleport>
</template>

<style scoped>
.dgv-ctx {
  position: fixed; z-index: 9999;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  box-shadow: var(--wx-shadow-xl);
  padding: 4px 0; min-width: 210px;
  overflow: visible; outline: none;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.dgv-ctx-item {
  display: flex; align-items: center; gap: 8px; width: 100%;
  padding: 7px 28px 7px 14px; border: none; background: none;
  text-align: left; font-size: 13px; cursor: pointer;
  color: var(--wx-text-primary); position: relative;
  white-space: nowrap; box-sizing: border-box;
  font-family: var(--wx-font-primary);
  transition: background var(--wx-duration-fast);
  border-radius: 0;
}
.dgv-ctx-item:hover, .dgv-ctx-item--focused { background: var(--wx-hover-bg); }
.dgv-ctx-item--danger { color: var(--wx-danger-text); }
.dgv-ctx-item--danger:hover { background: var(--wx-danger-bg); }
.dgv-ctx-sep { height: 1px; background: var(--wx-border-subtle); margin: 4px 8px; }
.dgv-ctx-section {
  padding: 6px 14px 4px; font-size: 10px; font-weight: 700;
  color: var(--wx-text-muted); text-transform: uppercase;
  letter-spacing: 0.5px; cursor: default;
}
.dgv-ctx-parent { cursor: default; padding-right: 32px; }
.dgv-ctx-parent::after { content: '▸'; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 11px; color: var(--wx-text-muted); }
.dgv-ctx-sub {
  display: none; position: absolute; left: 100%; top: -4px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  box-shadow: var(--wx-shadow-xl);
  padding: 4px 0; min-width: 220px; z-index: 10000;
  backdrop-filter: blur(12px);
}
.dgv-ctx-sub--open { display: block; }
.dgv-ctx--left .dgv-ctx-sub { left: auto; right: 100%; }
.dgv-ctx-parent.dgv-ctx-parent--active { background: var(--wx-selected-bg); }
.dgv-ctx-disabled { color: var(--wx-text-disabled); font-style: italic; pointer-events: none; }
.dgv-ctx-icon { display: inline-flex; width: 16px; height: 16px; align-items: center; justify-content: center; flex-shrink: 0; }
</style>
