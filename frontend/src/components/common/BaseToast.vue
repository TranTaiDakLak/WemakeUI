<script setup lang="ts">
import { useToast } from '../../composables/useToast'

const { toasts, removeToast } = useToast()

const iconMap: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}
</script>

<template>
  <teleport to="body">
    <div class="wx-toast-container">
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
  z-index: 10000;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  pointer-events: none;
  max-width: 380px;
  width: 100%;
}

/* ── Toast card — WX style: white bg + colored left border + icon badge ── */
.wx-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  pointer-events: auto;
  min-width: 280px;
  font-family: var(--wx-font-primary, 'Inter', sans-serif);
}

/* Colored left accent borders */
.wx-toast--success { border-left: 3px solid #22c55e; }
.wx-toast--error   { border-left: 3px solid #ef4444; }
.wx-toast--warning { border-left: 3px solid #f59e0b; }
.wx-toast--info    { border-left: 3px solid #3b82f6; }

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
.wx-toast__icon-badge--success { background: #22c55e; }
.wx-toast__icon-badge--error   { background: #ef4444; }
.wx-toast__icon-badge--warning { background: #f59e0b; }
.wx-toast__icon-badge--info    { background: #3b82f6; }

/* ── Content ── */
.wx-toast__content {
  flex: 1;
  min-width: 0;
}

.wx-toast__message {
  font-size: 13px;
  color: #1f2937;
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

/* ── Dark mode ── */
.wx-dark .wx-toast {
  background: var(--wx-surface-elevated);
  border-color: var(--wx-border-default);
}
.wx-dark .wx-toast__message { color: var(--wx-text-primary); }
.wx-dark .wx-toast__close { color: var(--wx-text-muted); }
.wx-dark .wx-toast__close:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }

/* ── Transition — slide in from right ── */
.wx-toast-enter-active { transition: all 0.3s ease-out; }
.wx-toast-leave-active { transition: all 0.2s ease-in; }
.wx-toast-enter-from { opacity: 0; transform: translateX(32px) scale(0.95); }
.wx-toast-leave-to { opacity: 0; transform: translateX(32px) scale(0.95); }
</style>
