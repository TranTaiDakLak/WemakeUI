<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'text' | 'success' | 'cta'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string
  block?: boolean
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="wx-btn"
    :class="[
      `wx-btn--${variant ?? 'primary'}`,
      `wx-btn--${size ?? 'md'}`,
      { 'wx-btn--loading': loading, 'wx-btn--block': block }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="wx-btn__spinner" />
    <span v-if="icon && !loading" class="wx-btn__icon" v-html="icon" />
    <span class="wx-btn__label"><slot /></span>

    <!-- Shine sweep for gradient buttons -->
    <span v-if="variant === 'primary' || variant === 'cta'" class="wx-btn__shine" />
  </button>
</template>

<style scoped>
.wx-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  font-family: var(--wx-font-primary, 'Inter', sans-serif);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  line-height: 1;
  overflow: hidden;
}

.wx-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.wx-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.wx-btn--block { width: 100%; }

/* ── Sizes (match WX: sm/md/lg) ── */
.wx-btn--sm { padding: 6px 12px; font-size: 12px; gap: 6px; }
.wx-btn--md { padding: 10px 20px; font-size: 14px; gap: 8px; }
.wx-btn--lg { padding: 14px 24px; font-size: 16px; gap: 10px; }

/* ── Primary — cyan→blue gradient + glow ── */
.wx-btn--primary {
  background: linear-gradient(to right, #06b6d4, #3b82f6);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.25);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.wx-btn--primary:hover:not(:disabled) {
  box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.4);
  filter: brightness(1.05);
}

/* ── CTA — deeper gradient ── */
.wx-btn--cta {
  background: linear-gradient(to right, #00d2ff, #3a7bd5, #0052D4);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(58, 123, 213, 0.4);
}
.wx-btn--cta:hover:not(:disabled) {
  box-shadow: 0 15px 25px -5px rgba(58, 123, 213, 0.5);
  transform: translateY(-1px);
}

/* ── Secondary — white card ── */
.wx-btn--secondary {
  background: #fff;
  color: #334155;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.wx-btn--secondary:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

/* ── Ghost — transparent ── */
.wx-btn--ghost {
  background: transparent;
  color: #4b5563;
  font-weight: 500;
}
.wx-btn--ghost:hover:not(:disabled) {
  background: #f3f4f6;
  color: #111827;
}

/* ── Text — minimal ── */
.wx-btn--text {
  background: transparent;
  color: #6b7280;
  font-weight: 500;
}
.wx-btn--text:hover:not(:disabled) {
  background: #f3f4f6;
  color: #374151;
}

/* ── Danger — rose→red gradient ── */
.wx-btn--danger {
  background: linear-gradient(to right, #f43f5e, #dc2626);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.wx-btn--danger:hover:not(:disabled) {
  box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.4);
  filter: brightness(1.05);
}

/* ── Success — emerald→green gradient ── */
.wx-btn--success {
  background: linear-gradient(to right, #10b981, #059669);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.25);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.wx-btn--success:hover:not(:disabled) {
  box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.4);
  filter: brightness(1.05);
}

/* ── Shine sweep ── */
.wx-btn__shine {
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
  pointer-events: none;
  transition: transform 0.7s ease;
}
.wx-btn:hover .wx-btn__shine {
  transform: translateX(100%);
}

/* ── Spinner ── */
.wx-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: wx-spin 0.6s linear infinite;
}
@keyframes wx-spin { to { transform: rotate(360deg); } }

.wx-btn__icon {
  display: inline-flex;
  align-items: center;
}
.wx-btn__label {
  position: relative;
  z-index: 1;
}

/* ── Dark mode overrides ── */
.wx-dark .wx-btn--secondary {
  background: var(--wx-surface-elevated);
  color: var(--wx-text-primary);
  border-color: var(--wx-border-default);
}
.wx-dark .wx-btn--secondary:hover:not(:disabled) {
  background: var(--wx-hover-bg);
}
.wx-dark .wx-btn--ghost:hover:not(:disabled) {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}
</style>
