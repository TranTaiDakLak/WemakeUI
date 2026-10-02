<script lang="ts">
let _dropdownIdCounter = 0
</script>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps<{
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  /**
   * Render menu ra `<body>` (position: fixed) để không bị cắt bởi cha có `overflow: hidden/auto`
   * (thanh menu cuộn ngang, card bo góc…). Mặc định false = menu nằm ngay trong cây DOM như trước.
   */
  teleport?: boolean
}>()

const dropdownId = `base-dropdown-${++_dropdownIdCounter}`

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const dropRef = ref<HTMLElement>()

/** style inline khi teleport: toạ độ viewport tính từ trigger */
const fixedStyle = ref<Record<string, string>>({})

function placeFixed() {
  const t = triggerRef.value
  if (!props.teleport || !t) return
  const r = t.getBoundingClientRect()
  const pl = props.placement ?? 'bottom-start'
  const s: Record<string, string> = { position: 'fixed', margin: '0', zIndex: 'var(--wx-z-popover)' }
  if (pl.startsWith('bottom')) s.top = `${r.bottom + 6}px`
  else s.bottom = `${window.innerHeight - r.top + 4}px`
  if (pl.endsWith('end')) s.right = `${window.innerWidth - r.right}px`
  else s.left = `${r.left}px`
  fixedStyle.value = s
}

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    placeFixed()
    nextTick(adjustPosition)
  }
}

/** teleport: cuộn/resize làm lệch trigger → đóng menu (trừ khi đang cuộn bên trong menu) */
function onViewportChange(e: Event) {
  if (!isOpen.value || !props.teleport) return
  if (e.type === 'scroll' && dropRef.value?.contains(e.target as Node)) return
  close()
}

function close() {
  isOpen.value = false
}

function adjustPosition() {
  if (!dropRef.value || !triggerRef.value) return
  const drop = dropRef.value
  const rect = drop.getBoundingClientRect()
  if (props.teleport) {
    const tr = triggerRef.value.getBoundingClientRect()
    if (rect.bottom > window.innerHeight && tr.top > rect.height) {
      drop.style.top = 'auto'
      drop.style.bottom = `${window.innerHeight - tr.top + 4}px`
    }
    if (rect.right > window.innerWidth) {
      drop.style.left = 'auto'
      drop.style.right = `${Math.max(8, window.innerWidth - tr.right)}px`
    }
    if (rect.left < 0) {
      drop.style.right = 'auto'
      drop.style.left = '8px'
    }
    return
  }
  if (rect.bottom > window.innerHeight) {
    drop.style.top = 'auto'
    drop.style.bottom = '100%'
    drop.style.marginBottom = '4px'
    drop.style.marginTop = '0'
  }
  if (rect.right > window.innerWidth) {
    drop.style.left = 'auto'
    drop.style.right = '0'
  }
}

function onClickOutside(e: MouseEvent) {
  if (!triggerRef.value?.contains(e.target as Node) && !dropRef.value?.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  window.addEventListener('scroll', onViewportChange, true)
  window.addEventListener('resize', onViewportChange)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
})
</script>

<template>
  <div class="base-dropdown" :class="[`base-dropdown--${placement ?? 'bottom-start'}`]">
    <div
      ref="triggerRef"
      class="base-dropdown__trigger"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-controls="dropdownId"
      @click.stop="toggle"
    >
      <slot name="trigger" />
    </div>
    <Teleport to="body" :disabled="!teleport">
      <transition name="dropdown">
        <div
          v-if="isOpen"
          :id="dropdownId"
          ref="dropRef"
          class="base-dropdown__content"
          :class="{ 'base-dropdown__content--fixed': teleport }"
          :style="teleport ? fixedStyle : undefined"
          @click.stop
        >
          <slot :close="close" />
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.base-dropdown {
  position: relative;
  display: inline-block;
}

.base-dropdown__trigger {
  cursor: pointer;
}

.base-dropdown__content {
  position: absolute;
  z-index: 100;
  margin-top: 6px;
  background: color-mix(in srgb, var(--wx-surface-elevated) 98%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-menu);
  box-shadow: var(--wx-shadow-menu);
  min-width: 160px;
  overflow: hidden;
}

/* teleport: width theo nội dung (không bị kéo giãn tới mép viewport), vẫn chừa lề 8px */
.base-dropdown__content--fixed { width: max-content; max-width: calc(100vw - 16px); max-height: calc(100vh - 16px); overflow-y: auto; }

.base-dropdown--bottom-start .base-dropdown__content { left: 0; top: 100%; }
.base-dropdown--bottom-end .base-dropdown__content { right: 0; top: 100%; }
.base-dropdown--top-start .base-dropdown__content { left: 0; bottom: 100%; margin-top: 0; margin-bottom: var(--wx-space-1); }
.base-dropdown--top-end .base-dropdown__content { right: 0; bottom: 100%; margin-top: 0; margin-bottom: var(--wx-space-1); }

/* Transition */
.dropdown-enter-active { transition: opacity var(--wx-d-fast) var(--wx-ease-bounce), transform var(--wx-d-fast) var(--wx-ease-bounce); }
.dropdown-leave-active { transition: opacity var(--wx-d-micro) var(--wx-ease-accelerate), transform var(--wx-d-micro) var(--wx-ease-accelerate); }
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
