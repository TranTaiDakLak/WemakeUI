<script setup lang="ts">
/**
 * BasePopover — rich-content floating panel with arrow.
 *
 * Defaults: placement='bottom', align='center', trigger='click', radius='lg' (12px).
 *
 * `align` căn panel theo trục NGANG của placement (cross axis):
 *  - placement top/bottom → start = mép trái panel thẳng mép trái trigger, end = mép phải thẳng mép phải.
 *  - placement left/right → trục chéo là dọc: start = mép trên, end = mép dưới.
 * Panel tự dịch (clamp) để không tràn khỏi viewport; mũi tên vẫn chỉ vào tâm trigger.
 *
 * Khác BaseTooltip: tooltip chỉ chứa text ngắn, popover chứa rich content
 *  (form, list, link…). Khác BaseDropdown: dropdown là menu list, popover
 *  free-form via slot.
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** căn panel theo trục chéo so với trigger (xem chú thích đầu file) */
  align?: 'start' | 'center' | 'end'
  trigger?: 'click' | 'hover'
  showArrow?: boolean
  width?: string
}>(), {
  placement: 'bottom',
  align: 'center',
  trigger: 'click',
  showArrow: true,
  width: '280px',
})

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const popRef = ref<HTMLElement>()

function open()  { isOpen.value = true }
function close() { isOpen.value = false }
function toggle() { isOpen.value ? close() : open() }

// ── Clamp trong viewport ──
const VIEWPORT_GUTTER = 8   // khoảng cách tối thiểu tới mép viewport (px)
const ARROW_INSET = 16      // mũi tên không sát góc bo của panel (px)

/** Đo trigger + panel, ghi --wx-popover-shift (px dịch panel) và --wx-popover-arrow (vị trí mũi tên) lên panel. */
function updatePosition() {
  const pop = popRef.value
  const trg = triggerRef.value
  if (!pop || !trg || typeof window === 'undefined') return

  const vertical = props.placement === 'left' || props.placement === 'right'
  // tắt transition tạm thời để việc dịch panel không bị animate trượt trong lúc mở
  pop.style.transition = 'none'
  // đo ở vị trí tự nhiên (shift = 0) rồi mới tính lại
  pop.style.setProperty('--wx-popover-shift', '0px')
  const p = pop.getBoundingClientRect()
  const t = trg.getBoundingClientRect()
  const root = document.documentElement
  const limit = vertical ? root.clientHeight : root.clientWidth
  const start = vertical ? p.top : p.left
  const end = vertical ? p.bottom : p.right
  const size = end - start

  let shift = 0
  if (end > limit - VIEWPORT_GUTTER) shift = limit - VIEWPORT_GUTTER - end
  if (start + shift < VIEWPORT_GUTTER) shift = VIEWPORT_GUTTER - start // panel rộng hơn viewport: ưu tiên mép đầu
  shift = Math.round(shift)

  const triggerCenter = vertical ? (t.top + t.bottom) / 2 : (t.left + t.right) / 2
  const arrow = Math.round(Math.min(Math.max(triggerCenter - (start + shift), ARROW_INSET), size - ARROW_INSET))

  pop.style.setProperty('--wx-popover-shift', `${shift}px`)
  pop.style.setProperty('--wx-popover-arrow', `${arrow}px`)
  void pop.offsetWidth // commit style mới trước khi bật lại transition
  pop.style.transition = ''
}

watch(isOpen, async (v) => {
  if (!v) return
  await nextTick()
  updatePosition()
})
watch(() => [props.placement, props.align, props.width], async () => {
  if (!isOpen.value) return
  await nextTick()
  updatePosition()
})
function onResize() { if (isOpen.value) updatePosition() }

function onClickOutside(e: MouseEvent) {
  if (!isOpen.value) return
  const t = e.target as Node
  if (popRef.value?.contains(t) || triggerRef.value?.contains(t)) return
  close()
}
function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) { e.stopPropagation(); close() }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('keydown', onEsc)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onEsc)
  window.removeEventListener('resize', onResize)
})

defineExpose({ open, close, toggle })
</script>

<template>
  <span class="wx-popover">
    <span
      ref="triggerRef"
      class="wx-popover__trigger"
      @click="trigger === 'click' && toggle()"
      @mouseenter="trigger === 'hover' && open()"
      @mouseleave="trigger === 'hover' && close()"
    >
      <slot name="trigger" :open="isOpen" />
    </span>

    <transition name="wx-popover">
      <div
        v-if="isOpen"
        ref="popRef"
        class="wx-popover__panel"
        :data-placement="placement"
        :data-align="align"
        :data-arrow="showArrow || undefined"
        :style="{ width }"
        role="dialog"
      >
        <span v-if="showArrow" class="wx-popover__arrow" aria-hidden="true" />
        <div class="wx-popover__body">
          <slot :close="close" />
        </div>
      </div>
    </transition>
  </span>
</template>

<style scoped>
.wx-popover {
  position: relative;
  display: inline-flex;
}
.wx-popover__trigger { display: inline-flex; }

.wx-popover__panel {
  position: absolute;
  background: var(--wx-bg-base);
  color: var(--wx-content-primary);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-menu);
  box-shadow: var(--wx-shadow-popover);
  z-index: var(--wx-z-popover);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-14);
}

/* Trục chính theo placement; trục chéo theo data-align (center = hành vi cũ).
   --wx-popover-shift / --wx-popover-arrow do JS (updatePosition) ghi để clamp trong viewport;
   chưa có (SSR / chưa đo) thì rơi về 0px / giá trị mặc định theo align. */
.wx-popover__panel[data-placement="bottom"] { top: calc(100% + 8px); }
.wx-popover__panel[data-placement="top"]    { bottom: calc(100% + 8px); }
.wx-popover__panel[data-placement="right"]  { left: calc(100% + 8px); }
.wx-popover__panel[data-placement="left"]   { right: calc(100% + 8px); }

/* top / bottom → trục chéo là NGANG */
.wx-popover__panel[data-placement="top"],
.wx-popover__panel[data-placement="bottom"] {
  transform: translate(var(--wx-pop-tx, 0px), var(--wx-pop-dy, 0px));
}
.wx-popover__panel[data-placement="top"][data-align="center"],
.wx-popover__panel[data-placement="bottom"][data-align="center"] {
  left: 50%;
  --wx-pop-tx: calc(-50% + var(--wx-popover-shift, 0px));
}
.wx-popover__panel[data-placement="top"][data-align="start"],
.wx-popover__panel[data-placement="bottom"][data-align="start"] {
  left: 0;
  --wx-pop-tx: var(--wx-popover-shift, 0px);
}
.wx-popover__panel[data-placement="top"][data-align="end"],
.wx-popover__panel[data-placement="bottom"][data-align="end"] {
  right: 0;
  --wx-pop-tx: var(--wx-popover-shift, 0px);
}

/* left / right → trục chéo là DỌC (start = mép trên, end = mép dưới) */
.wx-popover__panel[data-placement="left"],
.wx-popover__panel[data-placement="right"] {
  transform: translateY(var(--wx-pop-ty, 0px));
}
.wx-popover__panel[data-placement="left"][data-align="center"],
.wx-popover__panel[data-placement="right"][data-align="center"] {
  top: 50%;
  --wx-pop-ty: calc(-50% + var(--wx-popover-shift, 0px));
}
.wx-popover__panel[data-placement="left"][data-align="start"],
.wx-popover__panel[data-placement="right"][data-align="start"] {
  top: 0;
  --wx-pop-ty: var(--wx-popover-shift, 0px);
}
.wx-popover__panel[data-placement="left"][data-align="end"],
.wx-popover__panel[data-placement="right"][data-align="end"] {
  bottom: 0;
  --wx-pop-ty: var(--wx-popover-shift, 0px);
}

/* vị trí mũi tên mặc định (khi chưa đo): giữa với center, cách mép 20px với start/end */
.wx-popover__panel { --wx-popover-arrow: 50%; }
.wx-popover__panel[data-align="start"] { --wx-popover-arrow: 20px; }
.wx-popover__panel[data-align="end"]   { --wx-popover-arrow: calc(100% - 20px); }

.wx-popover__body {
  padding: var(--wx-space-3);
}

/* arrow */
.wx-popover__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--wx-bg-base);
  border: 1px solid var(--wx-border-default);
  transform: rotate(45deg);
}
/* mũi tên đặt theo --wx-popover-arrow (tâm mũi tên, tính từ mép đầu panel) — trỏ vào tâm trigger */
.wx-popover__panel[data-placement="bottom"] .wx-popover__arrow {
  top: -6px; left: calc(var(--wx-popover-arrow) - 5px);
  border-right: none; border-bottom: none;
}
.wx-popover__panel[data-placement="top"] .wx-popover__arrow {
  bottom: -6px; left: calc(var(--wx-popover-arrow) - 5px);
  border-left: none; border-top: none;
}
.wx-popover__panel[data-placement="right"] .wx-popover__arrow {
  left: -6px; top: calc(var(--wx-popover-arrow) - 5px);
  border-right: none; border-top: none;
}
.wx-popover__panel[data-placement="left"] .wx-popover__arrow {
  right: -6px; top: calc(var(--wx-popover-arrow) - 5px);
  border-left: none; border-bottom: none;
}

/* transition */
.wx-popover-enter-active, .wx-popover-leave-active {
  transition: opacity var(--wx-d-fast) var(--wx-ease-standard),
              transform var(--wx-d-fast) var(--wx-ease-decelerate);
}
.wx-popover-enter-from, .wx-popover-leave-to {
  opacity: 0;
}
/* trượt nhẹ 4px theo trục chính (top/bottom) — dùng --wx-pop-dy để không phụ thuộc align */
.wx-popover__panel[data-placement="bottom"].wx-popover-enter-from,
.wx-popover__panel[data-placement="bottom"].wx-popover-leave-to {
  --wx-pop-dy: -4px;
}
.wx-popover__panel[data-placement="top"].wx-popover-enter-from,
.wx-popover__panel[data-placement="top"].wx-popover-leave-to {
  --wx-pop-dy: 4px;
}
</style>
