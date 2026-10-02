<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'neutral' | 'ghost' | 'danger' | 'success' | 'warning' | 'cta' | 'link' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconRight?: string
  block?: boolean
  /** thẻ/component gốc, vd 'a' hoặc RouterLink. Mặc định: 'a' nếu có `href`, ngược lại 'button' */
  tag?: string | Component
  /** có href → render <a> (trừ khi truyền `tag` khác) */
  href?: string
  target?: string
  /** target="_blank" mà không truyền rel → tự dùng "noopener noreferrer" */
  rel?: string
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const resolvedTag = computed<string | Component>(() => props.tag ?? (props.href ? 'a' : 'button'))
const isNativeButton = computed(() => resolvedTag.value === 'button')
const isInert = computed(() => Boolean(props.disabled || props.loading))
/** Thẻ không phải <button> không có `disabled` native → phải tự chặn tương tác */
const blocksInteraction = computed(() => !isNativeButton.value && isInert.value)
const resolvedRel = computed(() => props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined))

// Pha capture: chạy trước handler điều hướng của chính thẻ (vd RouterLink.navigate) nên chặn được cả điều hướng.
function onClickCapture(e: MouseEvent) {
  if (!blocksInteraction.value) return
  e.preventDefault()
  e.stopPropagation()
}
function onClick(e: MouseEvent) {
  if (blocksInteraction.value) { e.preventDefault(); return }
  emit('click', e)
}
</script>

<template>
  <component
    :is="resolvedTag"
    class="wx-btn"
    :class="[
      `wx-btn--${variant ?? 'primary'}`,
      `wx-btn--${size ?? 'md'}`,
      { 'wx-btn--loading': loading, 'wx-btn--block': block },
    ]"
    :type="isNativeButton ? (type ?? 'button') : undefined"
    :disabled="isNativeButton ? (disabled || loading) : undefined"
    :href="isNativeButton ? undefined : href"
    :target="isNativeButton ? undefined : target"
    :rel="isNativeButton ? undefined : resolvedRel"
    :aria-disabled="blocksInteraction ? 'true' : undefined"
    :tabindex="blocksInteraction ? -1 : undefined"
    @click.capture="onClickCapture"
    @click="onClick"
  >
    <span v-if="loading" class="wx-btn__spinner" aria-hidden="true" />
    <span v-else-if="icon" class="wx-btn__icon" v-html="icon" aria-hidden="true" />
    <span v-if="$slots.default" class="wx-btn__label"><slot /></span>
    <span v-if="iconRight && !loading" class="wx-btn__icon" v-html="iconRight" aria-hidden="true" />
    <!-- Shine chỉ cho CTA (marketing). Nút primary giữ nhận diện "solid" — không lấn phần còn lại. -->
    <span v-if="variant === 'cta'" class="wx-btn__shine" aria-hidden="true" />
  </component>
</template>

<style scoped>
.wx-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--wx-space-2);
  border: 1px solid transparent;
  border-radius: var(--wx-radius-ctrl);
  font-family: var(--wx-font-primary);
  font-weight: var(--wx-fw-semibold);
  cursor: pointer;
  transition:
    background   var(--wx-d-fast) var(--wx-ease-standard),
    box-shadow   var(--wx-d-fast) var(--wx-ease-standard),
    transform    var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard),
    filter       var(--wx-d-fast) var(--wx-ease-standard),
    color        var(--wx-d-fast) var(--wx-ease-standard);
  white-space: nowrap;
  line-height: 1;
  overflow: hidden;
  text-decoration: none; /* khi render là <a> (href/tag): bỏ gạch chân mặc định của link */
  letter-spacing: var(--wx-tracking-normal, 0);
  -webkit-user-select: none;
  user-select: none;
}

/* Accessibility: focus ring (nguồn: 2px, offset 2px) */
.wx-btn:focus-visible {
  outline: 2px solid var(--wx-brand-focus);
  outline-offset: 2px;
}

/* [aria-disabled] = bản tương đương của :disabled cho thẻ không phải <button> (<a>, RouterLink…) */
.wx-btn:disabled,
.wx-btn[aria-disabled="true"] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none;
}

/* Nhấn xuống 1px — cảm giác "cơ học" của nguồn, thay cho scale */
.wx-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.wx-btn--block { width: 100%; }

/* ── Sizes ──
   Chiều cao theo token control (34px chuẩn desktop; tự nâng lên 44px trên thiết bị cảm ứng
   qua @media (pointer: coarse) trong tokens.css). Padding ngang suy ra từ --wx-control-px. */
.wx-btn--sm   { min-height: var(--wx-control-h-sm); padding: 0 calc(var(--wx-control-px) - 2px); font-size: var(--wx-fs-12); gap: 6px; border-radius: var(--wx-radius-ctrl-sm); }
.wx-btn--md   { min-height: var(--wx-control-h-md); padding: 0 calc(var(--wx-control-px) + 2px); font-size: var(--wx-control-fs); gap: var(--wx-space-2); }
.wx-btn--lg   { min-height: var(--wx-control-h-lg); padding: 0 calc(var(--wx-control-px) + 6px); font-size: var(--wx-fs-14); gap: var(--wx-space-2); }
.wx-btn--xl   { min-height: var(--wx-control-h-xl); padding: 0 var(--wx-space-5); font-size: var(--wx-fs-15); gap: var(--wx-space-3); border-radius: var(--wx-radius-menu); }
.wx-btn--icon {
  padding: 0;
  width: var(--wx-control-h-md);
  height: var(--wx-control-h-md);
  min-height: 0;
  flex-shrink: 0;
}

/* ── Primary — solid blue (brand-500 → brand-600), bóng xanh mềm ── */
.wx-btn--primary {
  background: var(--wx-gradient-primary);
  color: var(--wx-text-on-brand);
  box-shadow: var(--wx-shadow-btn);
}
.wx-btn--primary:hover:not(:disabled) {
  background: var(--wx-gradient-primary-hover);
  box-shadow: var(--wx-shadow-btn-hover);
}

/* ── CTA — deeper gradient (marketing / hero) ── */
.wx-btn--cta {
  background: var(--wx-gradient-cta);
  color: var(--wx-text-on-brand);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--wx-text-on-brand) 18%, transparent), 0 4px 14px -2px color-mix(in srgb, var(--wx-brand-500) 35%, transparent);
}
.wx-btn--cta:hover:not(:disabled) {
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--wx-text-on-brand) 18%, transparent), 0 8px 22px -2px color-mix(in srgb, var(--wx-brand-500) 50%, transparent);
  filter: brightness(1.05);
}

/* ── Secondary — nền surface, viền slate, hover nền trung tính + viền đậm hơn ── */
.wx-btn--secondary {
  background: var(--wx-surface-elevated);
  color: var(--wx-text-secondary);
  border-color: var(--wx-border-default);
}
.wx-btn--secondary:hover:not(:disabled) {
  background: var(--wx-hover-neutral-raised);
  border-color: var(--wx-border-control);
  color: var(--wx-text-primary);
}

/* ── Neutral — subtle filled ── */
.wx-btn--neutral {
  background: var(--wx-neutral-bg);
  color: var(--wx-neutral-text);
  border-color: var(--wx-neutral-border);
}
.wx-btn--neutral:hover:not(:disabled) {
  background: var(--wx-hover-neutral);
  color: var(--wx-text-primary);
  border-color: var(--wx-border-control);
}

/* ── Ghost — transparent ── */
.wx-btn--ghost {
  background: transparent;
  color: var(--wx-text-secondary);
}
.wx-btn--ghost:hover:not(:disabled) {
  background: var(--wx-hover-neutral);
  color: var(--wx-text-primary);
}

/* ── Danger / Success / Warning — gradient tông ngữ nghĩa, bóng theo màu ── */
.wx-btn--danger {
  background: var(--wx-gradient-danger);
  color: var(--wx-text-on-brand);
  box-shadow: 0 2px 6px color-mix(in srgb, var(--wx-danger-solid) 34%, transparent);
}
.wx-btn--danger:hover:not(:disabled) {
  box-shadow: 0 4px 10px color-mix(in srgb, var(--wx-danger-solid) 44%, transparent);
  filter: brightness(1.06);
}

.wx-btn--success {
  background: var(--wx-gradient-success);
  color: var(--wx-text-on-brand);
  box-shadow: 0 2px 6px color-mix(in srgb, var(--wx-success-solid) 34%, transparent);
}
.wx-btn--success:hover:not(:disabled) {
  box-shadow: 0 4px 10px color-mix(in srgb, var(--wx-success-solid) 44%, transparent);
  filter: brightness(1.06);
}

.wx-btn--warning {
  background: var(--wx-gradient-warning);
  color: var(--wx-text-on-brand);
  box-shadow: 0 2px 6px color-mix(in srgb, var(--wx-warning-solid) 34%, transparent);
}
.wx-btn--warning:hover:not(:disabled) {
  box-shadow: 0 4px 10px color-mix(in srgb, var(--wx-warning-solid) 44%, transparent);
  filter: brightness(1.06);
}

/* ── Link / Text — text link minimal ── */
.wx-btn--text {
  background: transparent;
  color: var(--wx-text-secondary);
  padding-left: var(--wx-space-1);
  padding-right: var(--wx-space-1);
  font-weight: var(--wx-fw-medium);
  overflow: visible;
}
.wx-btn--text:hover:not(:disabled) {
  background: var(--wx-hover-neutral);
  color: var(--wx-text-primary);
}

.wx-btn--link {
  background: transparent;
  color: var(--wx-text-link);
  padding-left: var(--wx-space-1);
  padding-right: var(--wx-space-1);
  font-weight: var(--wx-fw-medium);
  overflow: visible;
}
.wx-btn--link:hover:not(:disabled) {
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── Shine sweep — cta only ── */
.wx-btn__shine {
  position: absolute;
  inset: 0;
  transform: translateX(calc(-100% - 2px));
  background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--wx-text-on-brand) 18%, transparent) 50%, transparent 100%);
  pointer-events: none;
  transition: transform var(--wx-d-decorative) var(--wx-ease-accelerate);
}
.wx-btn:hover .wx-btn__shine {
  transform: translateX(calc(100% + 2px));
}

/* ── Spinner ── */
.wx-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid color-mix(in srgb, var(--wx-text-on-brand) 30%, transparent);
  border-top-color: currentColor;
  border-radius: var(--wx-radius-full);
  animation: wx-btn-spin 0.6s linear infinite;
  flex-shrink: 0;
}
/* Nút không nền đặc: vòng quay dùng màu chữ thay vì trắng mờ */
.wx-btn--secondary .wx-btn__spinner,
.wx-btn--neutral .wx-btn__spinner,
.wx-btn--ghost .wx-btn__spinner,
.wx-btn--text .wx-btn__spinner,
.wx-btn--link .wx-btn__spinner {
  border-color: color-mix(in srgb, currentColor 25%, transparent);
  border-top-color: currentColor;
}
@keyframes wx-btn-spin { to { transform: rotate(360deg); } }

.wx-btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}

.wx-btn__label {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Dark mode: không cần override — surface/hover/border/shadow đều là token đã tự đổi theo theme. */

@media (prefers-reduced-motion: reduce) {
  .wx-btn { transition: none; }
  .wx-btn__shine { display: none; }
}
</style>
