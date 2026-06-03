<script lang="ts">
let _idCounter = 0
</script>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { ModalSize } from '../../types'

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

const intentDialogStyle = computed(() => {
  if (props.intent === 'danger') return {
    border: '1px solid rgba(239, 68, 68, 0.40)',
    boxShadow: '0 20px 50px rgba(220, 38, 38, 0.25), 0 8px 24px rgba(220, 38, 38, 0.15)',
  }
  if (props.intent === 'warning') return {
    border: '1px solid rgba(249, 115, 22, 0.22)',
    boxShadow: '0 20px 50px rgba(234, 88, 12, 0.12), 0 8px 24px rgba(234, 88, 12, 0.08)',
  }
  return {}
})

const intentHeaderStyle = computed(() => {
  if (props.intent === 'danger')  return { borderBottomColor: 'rgba(239, 68, 68, 0.20)' }
  if (props.intent === 'warning') return { borderBottomColor: 'rgba(249, 115, 22, 0.12)' }
  return {}
})

const emit = defineEmits<{
  close: []
  save: []
}>()

const sizeMap: Record<ModalSize, string> = {
  sm: '480px',
  md: '680px',
  lg: '920px',
  xl: '1140px',
  full: '95%',
}

// ── z-index stacking ──
let zIndex = 500
const modalStack: number[] = []

function pushZ(): number {
  zIndex += 10
  modalStack.push(zIndex)
  return zIndex
}
function popZ() {
  modalStack.pop()
  if (modalStack.length) zIndex = modalStack[modalStack.length - 1]
  else zIndex = 500
}

const currentZ = ref(500)

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
    emit('close')
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
    <div v-if="props.show" class="modal-overlay" :style="{ zIndex: currentZ }" @click.self="props.closeOnBackdrop && emit('close')">
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        class="modal-dialog"
        :style="[{ maxWidth: sizeMap[props.size] }, intentDialogStyle]"
      >
        <!-- Header -->
        <div class="modal-header" :style="intentHeaderStyle">
          <span :id="titleId" class="modal-title">{{ props.title }}</span>
          <slot name="header-extra" />
          <button
            v-if="props.closable"
            class="modal-close-btn"
            type="button"
            aria-label="Đóng"
            @click="emit('close')"
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
            <button
              v-if="props.showSave"
              class="modal-btn modal-btn--save"
              :disabled="props.loading"
              @click="emit('save')"
            >
              <span v-if="props.loading" class="modal-spinner" />
              {{ props.saveLabel }}
            </button>
            <button class="modal-btn modal-btn--close" @click="emit('close')">
              {{ props.closeLabel }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.modal-dialog {
  background: var(--wx-surface-base);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: var(--wx-radius-2xl, 16px);
  box-shadow:
    0 20px 50px rgba(37, 99, 235, 0.25),
    0 8px 24px rgba(37, 99, 235, 0.15);
  width: 90%;
  max-height: 85%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Không đặt `will-change: transform` mặc định: khi modal đứng yên, lớp composited GPU
     làm text render qua texture (mất subpixel-AA) → chữ trông mờ như bị scale.
     Chỉ promote layer trong lúc đang animate enter/leave (xem block bên dưới). */
}

/* ── Header ── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: var(--wx-surface-base);
  border-bottom: 1px solid rgba(59, 130, 246, 0.15);
  flex-shrink: 0;
}

.modal-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--wx-text-primary);
  letter-spacing: 0.2px;
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
  border-radius: var(--wx-radius-md, 6px);
  background: transparent;
  color: var(--wx-content-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--wx-d-fast, 150ms), color var(--wx-d-fast, 150ms);
}
.modal-close-btn:hover {
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
}
.modal-close-btn:active {
  transform: scale(0.92);
}

/* ── Body ── */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* ── Footer ── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px;
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-sunken);
  flex-shrink: 0;
  gap: 8px;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--wx-radius-lg);
  font-family: var(--wx-font-primary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--wx-d-fast, 150ms) var(--wx-ease-standard);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.modal-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.modal-btn--save {
  background: var(--wx-gradient-button);
  color: #fff;
  box-shadow: var(--wx-shadow-brand);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.modal-btn--save:hover:not(:disabled) {
  box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.4);
  filter: brightness(1.05);
}
.modal-btn--save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.modal-btn--close {
  background: var(--wx-gradient-danger);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.modal-btn--close:hover {
  box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.4);
  filter: brightness(1.05);
}

/* Save spinner */
.modal-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--wx-text-inverse);
  border-radius: var(--wx-radius-full);
  animation: modal-spin 0.6s linear infinite;
}
@keyframes modal-spin { to { transform: rotate(360deg); } }

/* Transition — WX scale-up */
.modal-enter-active { transition: opacity var(--wx-d-normal, 250ms) var(--wx-ease-decelerate); }
.modal-leave-active { transition: opacity var(--wx-d-fast, 150ms) var(--wx-ease-accelerate); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-dialog { animation: wxModalIn var(--wx-d-normal, 250ms) var(--wx-ease-decelerate); will-change: transform, opacity; }
.modal-leave-active .modal-dialog { animation: wxModalOut var(--wx-d-fast, 150ms) var(--wx-ease-accelerate) forwards; will-change: transform, opacity; }
@keyframes wxModalIn {
  from { transform: translateY(-16px) scale(0.95); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes wxModalOut {
  from { transform: translateY(0) scale(1); opacity: 1; }
  to   { transform: translateY(8px) scale(0.97); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active .modal-dialog,
  .modal-leave-active .modal-dialog { animation: none; }
}
</style>
