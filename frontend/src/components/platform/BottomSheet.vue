<script setup lang="ts">
/**
 * BottomSheet — mobile-first sheet trượt từ đáy lên.
 * Phase 3 — layout shells (mobile pattern).
 *
 * defaults phần II:
 *  - snapPoints: [0.4, 0.9]
 *  - radius: xl (16px top corners)
 *
 * features:
 *  - drag handle để mở rộng/đóng
 *  - swipe down để đóng (qua threshold)
 *  - backdrop click closes (configurable)
 *  - escape closes
 *  - safe-area inset bottom auto
 */
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  /** open/close (v-model) */
  modelValue?: boolean
  /** title sentence case */
  title?: string
  /** snap points 0..1, vd [0.4, 0.9] */
  snapPoints?: number[]
  /** snap point hiện tại (index) — uncontrolled nếu không pass v-model */
  snapIndex?: number
  /** đóng khi click backdrop */
  closeOnBackdrop?: boolean
  /** đóng khi nhấn Esc */
  closeOnEsc?: boolean
  /** hiện handle (gạch ngang trên) */
  showHandle?: boolean
  /** disable drag (cho non-touch desktop) */
  draggable?: boolean
}>(), {
  modelValue: false,
  snapPoints: () => [0.4, 0.9],
  snapIndex: 0,
  closeOnBackdrop: true,
  closeOnEsc: true,
  showHandle: true,
  draggable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:snapIndex': [value: number]
  'snap': [index: number]
}>()

const sheetRef = ref<HTMLElement | null>(null)
const internalSnapIndex = ref(props.snapIndex)
const dragOffset = ref(0)
const isDragging = ref(false)
const startY = ref(0)
const startHeightVh = ref(0)

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const currentSnap = computed(() => internalSnapIndex.value)

const heightVh = computed(() => {
  const snap = props.snapPoints[currentSnap.value] ?? props.snapPoints[0] ?? 0.5
  return snap * 100
})

const transformY = computed(() => {
  if (!isDragging.value) return 0
  return dragOffset.value
})

watch(() => props.snapIndex, (v) => { internalSnapIndex.value = v })

function close() { open.value = false }

function snapTo(idx: number) {
  const clamped = Math.max(0, Math.min(props.snapPoints.length - 1, idx))
  internalSnapIndex.value = clamped
  emit('update:snapIndex', clamped)
  emit('snap', clamped)
}

function onDragStart(e: TouchEvent | MouseEvent) {
  if (!props.draggable) return
  isDragging.value = true
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  startY.value = clientY
  const snap = props.snapPoints[currentSnap.value]
  startHeightVh.value = snap * window.innerHeight
}

function onDragMove(e: TouchEvent | MouseEvent) {
  if (!isDragging.value) return
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  dragOffset.value = clientY - startY.value
}

function onDragEnd() {
  if (!isDragging.value) return
  const delta = dragOffset.value
  const vh = window.innerHeight
  const currentSnapVal = props.snapPoints[currentSnap.value]
  const currentTopVh = currentSnapVal * vh

  // velocity-ish heuristic: drag > 100px hoặc > 25% chiều cao snap → đổi snap
  const threshold = Math.min(100, currentTopVh * 0.25)

  if (delta > threshold) {
    // drag down
    if (currentSnap.value > 0) {
      snapTo(currentSnap.value - 1)
    } else {
      close()
    }
  } else if (delta < -threshold) {
    // drag up
    if (currentSnap.value < props.snapPoints.length - 1) {
      snapTo(currentSnap.value + 1)
    }
  }

  isDragging.value = false
  dragOffset.value = 0
}

function onBackdropClick() {
  if (props.closeOnBackdrop) close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc && open.value) {
    close()
  }
}

/* lock scroll body khi mở */
let prevOverflow = ''
watch(open, async (v) => {
  if (typeof document === 'undefined') return
  if (v) {
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
  } else {
    document.body.style.overflow = prevOverflow
  }
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragEnd)
    window.addEventListener('touchmove', onDragMove, { passive: true })
    window.addEventListener('touchend', onDragEnd)
    window.addEventListener('keydown', onKeydown)
  }
})
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
    window.removeEventListener('touchmove', onDragMove)
    window.removeEventListener('touchend', onDragEnd)
    window.removeEventListener('keydown', onKeydown)
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = prevOverflow
  }
})
</script>

<template>
  <Teleport to="body">
    <transition name="wx-bsheet">
      <div v-if="open" class="wx-bsheet-root" data-part="root">
        <div
          class="wx-bsheet__backdrop"
          data-part="backdrop"
          @click="onBackdropClick"
        />
        <div
          ref="sheetRef"
          class="wx-bsheet"
          role="dialog"
          aria-modal="true"
          :aria-label="title ?? 'Bottom sheet'"
          :style="{
            height: heightVh + 'vh',
            transform: `translateY(${transformY}px)`,
            transition: isDragging ? 'none' : undefined,
          }"
        >
          <div
            v-if="showHandle"
            class="wx-bsheet__handle-area"
            @mousedown="onDragStart"
            @touchstart.passive="onDragStart"
          >
            <span class="wx-bsheet__handle" aria-hidden="true" />
          </div>

          <header v-if="title || $slots.header" class="wx-bsheet__header" data-part="header">
            <slot name="header">
              <h3 class="wx-bsheet__title">{{ title }}</h3>
            </slot>
          </header>

          <div class="wx-bsheet__body" data-part="body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="wx-bsheet__footer" data-part="footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.wx-bsheet-root {
  position: fixed;
  inset: 0;
  z-index: var(--wx-z-modal);
  font-family: var(--wx-font-primary);
  pointer-events: none;
}

.wx-bsheet__backdrop {
  position: absolute;
  inset: 0;
  background: var(--wx-surface-overlay);
  pointer-events: auto;
}

.wx-bsheet {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  display: flex;
  flex-direction: column;
  background: var(--wx-surface-elevated);
  color: var(--wx-content-primary);
  border-top-left-radius: var(--wx-radius-xl);
  border-top-right-radius: var(--wx-radius-xl);
  box-shadow: var(--wx-shadow-xl);
  pointer-events: auto;
  transition: height var(--wx-d-normal) var(--wx-ease-decelerate),
              transform var(--wx-d-normal) var(--wx-ease-decelerate);
  padding-bottom: env(safe-area-inset-bottom, 0);
  overflow: hidden;
  max-height: 95vh;
}

.wx-bsheet__handle-area {
  flex-shrink: 0;
  padding: var(--wx-space-2) 0 var(--wx-space-1);
  display: flex;
  justify-content: center;
  cursor: grab;
  touch-action: none;
}
.wx-bsheet__handle-area:active { cursor: grabbing; }
.wx-bsheet__handle {
  display: block;
  width: 36px;
  height: 4px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-border-default);
}

.wx-bsheet__header {
  flex-shrink: 0;
  padding: var(--wx-space-3) var(--wx-space-5) var(--wx-space-2);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.wx-bsheet__title {
  margin: 0;
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}

.wx-bsheet__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--wx-space-4) var(--wx-space-5);
  -webkit-overflow-scrolling: touch;
}

.wx-bsheet__footer {
  flex-shrink: 0;
  padding: var(--wx-space-3) var(--wx-space-5);
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-base);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--wx-space-2);
}

/* enter/leave transitions */
.wx-bsheet-enter-active,
.wx-bsheet-leave-active {
  transition: opacity var(--wx-d-normal) var(--wx-ease-standard);
}
.wx-bsheet-enter-active .wx-bsheet,
.wx-bsheet-leave-active .wx-bsheet {
  transition: transform var(--wx-d-normal) var(--wx-ease-decelerate);
}
.wx-bsheet-enter-from,
.wx-bsheet-leave-to { opacity: 0; }
.wx-bsheet-enter-from .wx-bsheet,
.wx-bsheet-leave-to .wx-bsheet { transform: translateY(100%); }

@media (prefers-reduced-motion: reduce) {
  .wx-bsheet,
  .wx-bsheet-enter-active,
  .wx-bsheet-leave-active,
  .wx-bsheet-enter-active .wx-bsheet,
  .wx-bsheet-leave-active .wx-bsheet { transition: none; }
}
</style>
