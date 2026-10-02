<script lang="ts">
let _idCounter = 0
</script>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { ModalSize } from '../../types'
import BaseButton from './BaseButton.vue'

type ModalIntent = 'default' | 'danger' | 'warning'

const titleId = `modal-title-${++_idCounter}`

const props = withDefaults(defineProps<{
  show: boolean
  title: string
  size?: ModalSize
  showSave?: boolean
  saveLabel?: string
  closeLabel?: string
  loading?: boolean
  intent?: ModalIntent
  closable?: boolean
  closeOnBackdrop?: boolean
}>(), {
  size: 'md',
  showSave: false,
  saveLabel: 'Lưu',
  closeLabel: 'Đóng',
  loading: false,
  intent: 'default',
  closable: true,
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  close: []
  save: []
  /** để dùng `v-model:show` (đóng bằng ESC / backdrop / nút × → phát false). `@close` vẫn hoạt động như cũ. */
  'update:show': [value: boolean]
}>()

function requestClose() {
  emit('update:show', false)
  emit('close')
}

const sizeMap: Record<ModalSize, string> = {
  sm: '480px',
  md: '680px',
  lg: '920px',
  xl: '1140px',
  full: '95%',
}

// ── z-index stacking ──
// Base = --wx-z-modal (1000). Each nested modal stacks +10 (1000, 1010, …),
// staying under the popover band (1100: selects, lightboxes, nested popups)
// and the toast (1200), so notifications always render in front of any modal.
const MODAL_Z_BASE = 1000
let zIndex = MODAL_Z_BASE
const modalStack: number[] = []

function pushZ(): number {
  zIndex += 10
  modalStack.push(zIndex)
  return zIndex
}
function popZ() {
  modalStack.pop()
  if (modalStack.length) zIndex = modalStack[modalStack.length - 1]
  else zIndex = MODAL_Z_BASE
}

const currentZ = ref(MODAL_Z_BASE)

watch(() => props.show, (val) => {
  if (val) {
    currentZ.value = pushZ()
    nextTick(trapFocusInit)
  } else {
    popZ()
  }
})

// ── ESC close ──
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    requestClose()
  }
  // Focus trap
  if (e.key === 'Tab' && props.show) {
    trapFocusHandle(e)
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

// ── Focus Trap ──
const dialogRef = ref<HTMLElement>()

function getFocusables(): HTMLElement[] {
  if (!dialogRef.value) return []
  return Array.from(dialogRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ))
}

function trapFocusInit() {
  const els = getFocusables()
  if (els.length) els[0].focus()
}

function trapFocusHandle(e: KeyboardEvent) {
  const els = getFocusables()
  if (!els.length) return
  const first = els[0]
  const last = els[els.length - 1]
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

</script>

<template>
  <Teleport to="body">
  <transition name="modal">
    <div v-if="props.show" class="modal-overlay" :style="{ zIndex: currentZ }" @click.self="props.closeOnBackdrop && requestClose()">
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        class="modal-dialog"
        :class="`modal-dialog--${props.intent}`"
        :style="{ maxWidth: sizeMap[props.size] }"
      >
        <!-- Header -->
        <div class="modal-header">
          <span :id="titleId" class="modal-title">{{ props.title }}</span>
          <slot name="header-extra" />
          <button
            v-if="props.closable"
            class="modal-close-btn"
            type="button"
            aria-label="Đóng"
            @click="requestClose()"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <slot />
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <slot name="footer">
            <BaseButton variant="ghost" @click="requestClose()">
              {{ props.closeLabel }}
            </BaseButton>
            <BaseButton
              v-if="props.showSave"
              variant="primary"
              :loading="props.loading"
              @click="emit('save')"
            >
              {{ props.saveLabel }}
            </BaseButton>
          </slot>
        </div>
      </div>
    </div>
  </transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop chuẩn hoá (nguồn: slate-900 @ 50% + blur 2px) — dùng chung với BaseDrawer */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--wx-backdrop-bg);
  backdrop-filter: blur(var(--wx-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--wx-backdrop-blur));
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  box-shadow: var(--wx-shadow-2xl);
  width: 90%;
  max-height: 85%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Không đặt `will-change: transform` mặc định: khi modal đứng yên, lớp composited GPU
     làm text render qua texture (mất subpixel-AA) → chữ trông mờ như bị scale.
     Chỉ promote layer trong lúc đang animate enter/leave (xem block bên dưới). */
}

/* Intent: viền + bóng ngả theo màu ngữ nghĩa (token, không hardcode) */
.modal-dialog--danger {
  border-color: color-mix(in srgb, var(--wx-danger-solid) 40%, transparent);
  box-shadow: 0 20px 50px color-mix(in srgb, var(--wx-danger-solid) 25%, transparent),
              0 8px 24px color-mix(in srgb, var(--wx-danger-solid) 15%, transparent);
}
.modal-dialog--warning {
  border-color: color-mix(in srgb, var(--wx-warning-solid) 28%, transparent);
  box-shadow: 0 20px 50px color-mix(in srgb, var(--wx-warning-solid) 14%, transparent),
              0 8px 24px color-mix(in srgb, var(--wx-warning-solid) 10%, transparent);
}
.modal-dialog--danger .modal-header  { border-bottom-color: color-mix(in srgb, var(--wx-danger-solid) 20%, transparent); }
.modal-dialog--warning .modal-header { border-bottom-color: color-mix(in srgb, var(--wx-warning-solid) 16%, transparent); }

/* ── Header — nền trắng → xanh rất nhạt như đầu form panel ── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-2);
  padding: 13px var(--wx-space-5) 11px;
  background: var(--wx-gradient-panel-head);
  border-bottom: 1px solid var(--wx-border-subtle);
  flex-shrink: 0;
}

.modal-title {
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-extrabold);
  color: var(--wx-text-primary);
  letter-spacing: var(--wx-tracking-snug);
  flex: 1;
}

.modal-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--wx-radius-ctrl-sm);
  background: transparent;
  color: var(--wx-text-light);
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--wx-d-fast, 150ms), color var(--wx-d-fast, 150ms);
}
.modal-close-btn:hover {
  background: var(--wx-hover-neutral);
  color: var(--wx-text-primary);
}
.modal-close-btn:focus-visible {
  outline: 2px solid var(--wx-brand-focus);
  outline-offset: -1px;
}
.modal-close-btn:active {
  transform: scale(0.92);
}

/* ── Body ── */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--wx-space-5);
}

/* ── Footer — nền sunken để tách khỏi body (như foot của form-panel nguồn) ── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--wx-space-3) var(--wx-space-5);
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-sunken);
  flex-shrink: 0;
  gap: var(--wx-space-2);
}

/* Transition — nguồn: vào 180ms ease-out-expo scale .96, ra 140ms ease-in */
.modal-enter-active { transition: opacity var(--wx-d-overlay-in) var(--wx-ease-bounce); }
.modal-leave-active { transition: opacity var(--wx-d-overlay-out) var(--wx-ease-accelerate); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-dialog { animation: wxModalIn var(--wx-d-overlay-in) var(--wx-ease-bounce); will-change: transform, opacity; }
.modal-leave-active .modal-dialog { animation: wxModalOut var(--wx-d-overlay-out) var(--wx-ease-accelerate) forwards; will-change: transform, opacity; }
@keyframes wxModalIn {
  from { transform: scale(0.96); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
@keyframes wxModalOut {
  from { transform: scale(1); opacity: 1; }
  to   { transform: scale(0.96); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active .modal-dialog,
  .modal-leave-active .modal-dialog { animation: none; }
}
</style>
