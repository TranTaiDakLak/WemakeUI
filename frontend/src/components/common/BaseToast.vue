<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import { ref, watch } from 'vue'

const { toasts, removeToast } = useToast()

const iconMap: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

// When a toast appears, move the container to the LAST position in <body>.
// Overlays teleported to body (modals, drawers) may be appended after the
// toast container's initial mount, putting them later in DOM order. The
// toast sits at --wx-z-toast (1200), above every form layer (modal 1000,
// popover 1100), but Chrome's backdrop-filter compositing can still reorder
// equal-context siblings. Appending last guarantees DOM order AND z-index
// both favour the toast.
const containerRef = ref<HTMLElement | null>(null)
watch(
  () => toasts.value.length,
  (n) => {
    if (n > 0 && containerRef.value?.parentNode === document.body) {
      document.body.appendChild(containerRef.value)
    }
  }
)
</script>

<template>
  <teleport to="body">
    <div ref="containerRef" class="wx-toast-container">
      <transition-group name="wx-toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="wx-toast"
          :class="`wx-toast--${toast.type}`"
        >
          <div class="wx-toast__icon-badge" :class="`wx-toast__icon-badge--${toast.type}`">
            <span>{{ iconMap[toast.type] }}</span>
          </div>
          <div class="wx-toast__content">
            <p class="wx-toast__message">{{ toast.message }}</p>
          </div>
          <button class="wx-toast__close" @click="removeToast(toast.id)">&times;</button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style scoped>
.wx-toast-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: var(--wx-z-toast);
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  pointer-events: none;
  max-width: 380px;
  width: 100%;
}

/* ── Toast card — tinted bg theo type + colored left border + icon badge ── */
.wx-toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  pointer-events: auto;
  min-width: 280px;
  font-family: var(--wx-font-primary, 'Inter', sans-serif);
}

/* Light mode: white card + colored left border + colored icon badge.
   Đồng bộ với card/modal trắng, tăng readability. */
.wx-toast--success,
.wx-toast--error,
.wx-toast--warning,
.wx-toast--info {
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
}
.wx-toast--success { border-left: 3px solid var(--wx-success-solid); }
.wx-toast--error   { border-left: 3px solid var(--wx-danger-solid); }
.wx-toast--warning { border-left: 3px solid var(--wx-warning-solid); }
.wx-toast--info    { border-left: 3px solid var(--wx-info-solid); }

/* ── Icon badge ── */
.wx-toast__icon-badge {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.wx-toast__icon-badge--success { background: var(--wx-success-solid); }
.wx-toast__icon-badge--error   { background: var(--wx-danger-solid); }
.wx-toast__icon-badge--warning { background: var(--wx-warning-solid); }
.wx-toast__icon-badge--info    { background: var(--wx-info-solid); }

/* ── Content ── */
.wx-toast__content {
  flex: 1;
  min-width: 0;
}

.wx-toast__message {
  font-size: 13px;
  color: var(--wx-text-primary);
  line-height: 1.5;
  margin: 0;
}

/* ── Close ── */
.wx-toast__close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.3);
  font-size: 18px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s;
}
.wx-toast__close:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.6);
}

/* ── Dark mode — surface-elevated thay vì white, giữ colored left border ── */
.wx-dark .wx-toast--success,
.wx-dark .wx-toast--error,
.wx-dark .wx-toast--warning,
.wx-dark .wx-toast--info {
  background: var(--wx-surface-elevated);
  border-color: var(--wx-border-default);
}
.wx-dark .wx-toast__close { color: var(--wx-text-muted); }
.wx-dark .wx-toast__close:hover { background: rgba(255,255,255,0.08); color: var(--wx-text-primary); }

/* ── Transition — slide in from right ── */
.wx-toast-enter-active { transition: all 0.3s ease-out; }
.wx-toast-leave-active { transition: all 0.2s ease-in; }
.wx-toast-enter-from { opacity: 0; transform: translateX(32px) scale(0.95); }
.wx-toast-leave-to { opacity: 0; transform: translateX(32px) scale(0.95); }
</style>
