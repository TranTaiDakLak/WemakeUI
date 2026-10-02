<script setup lang="ts">
/**
 * AppBanner — thông báo cấp ứng dụng (có bản cập nhật, dữ liệu cũ, cần tải lại…).
 *
 *  variant="floating" (mặc định): thẻ nổi, bo góc, có bóng — đặt trong <AppBannerStack>
 *                                 để neo ngay dưới topbar thật.
 *  variant="strip":              thanh liền khối full-width (đặt ngay dưới topbar).
 *
 *   <AppBanner tone="warning" title="Dữ liệu có thể đã cũ" action-label="Quét lại" @action="reload" />
 *   <AppBanner v-model="show" tone="info" title="Có phiên bản mới v1.4.0" description="Bản hiện tại 1.3.2" />
 *
 * slots: default (thay description) · actions (thêm nút phụ cạnh nút chính)
 */
import { computed } from 'vue'
import { SHELL_ICONS } from './shell-icons'

type Tone = 'info' | 'warning' | 'success' | 'danger'

const props = withDefaults(defineProps<{
  tone?: Tone
  variant?: 'floating' | 'strip'
  /** SVG html thay icon mặc định theo tone */
  icon?: string
  title?: string
  description?: string
  actionLabel?: string
  dismissible?: boolean
  dismissLabel?: string
}>(), {
  tone: 'info',
  variant: 'floating',
  dismissible: true,
  dismissLabel: 'Đóng thông báo',
})

const open = defineModel<boolean>({ default: true })

const emit = defineEmits<{
  action: []
  dismiss: []
}>()

const DEFAULT_ICON: Record<Tone, string> = {
  info: SHELL_ICONS.download,
  warning: SHELL_ICONS.clock,
  success: SHELL_ICONS.check,
  danger: SHELL_ICONS.warning,
}

const iconHtml = computed(() => props.icon ?? DEFAULT_ICON[props.tone])

function dismiss() {
  open.value = false
  emit('dismiss')
}
</script>

<template>
  <Transition name="wx-banner">
    <aside
      v-if="open"
      class="wx-banner"
      :class="[`wx-banner--${tone}`, `wx-banner--${variant}`]"
      role="status"
      aria-live="polite"
    >
      <span class="wx-banner__icon" aria-hidden="true" v-html="iconHtml" />

      <div class="wx-banner__text">
        <p v-if="title" class="wx-banner__title">{{ title }}</p>
        <p v-if="description || $slots.default" class="wx-banner__desc">
          <slot>{{ description }}</slot>
        </p>
      </div>

      <div v-if="actionLabel || $slots.actions" class="wx-banner__actions">
        <slot name="actions" />
        <button
          v-if="actionLabel"
          type="button"
          class="wx-banner__action"
          @click="emit('action')"
        >{{ actionLabel }}</button>
      </div>

      <button
        v-if="dismissible"
        type="button"
        class="wx-banner__close"
        :aria-label="dismissLabel"
        @click="dismiss"
      >
        <span aria-hidden="true" v-html="SHELL_ICONS.x" />
      </button>
    </aside>
  </Transition>
</template>

<style scoped>
.wx-banner {
  --_tone-bg: var(--wx-shell-tone-brand-bg);
  --_tone-fg: var(--wx-shell-tone-brand-fg);
  --_tone-bd: var(--wx-shell-tone-brand-bd);
  --_tone-solid: var(--wx-shell-solid-info);

  position: relative;
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  font-family: var(--wx-font-primary);
  color: var(--wx-text-primary);
}
.wx-banner--info    { --_tone-bg: var(--wx-info-bg);    --_tone-fg: var(--wx-info-text);    --_tone-bd: var(--wx-info-border);    --_tone-solid: var(--wx-shell-solid-info); }
.wx-banner--warning { --_tone-bg: var(--wx-warning-bg); --_tone-fg: var(--wx-warning-text); --_tone-bd: var(--wx-warning-border); --_tone-solid: var(--wx-shell-solid-warning); }
.wx-banner--success { --_tone-bg: var(--wx-success-bg); --_tone-fg: var(--wx-success-text); --_tone-bd: var(--wx-success-border); --_tone-solid: var(--wx-shell-solid-success); }
.wx-banner--danger  { --_tone-bg: var(--wx-danger-bg);  --_tone-fg: var(--wx-danger-text);  --_tone-bd: var(--wx-danger-border);  --_tone-solid: var(--wx-shell-solid-danger); }

/* ── floating ── */
.wx-banner--floating {
  padding: var(--wx-space-3) 36px var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-shell-banner-bg);
  border: 1px solid var(--_tone-bd);
  border-radius: var(--wx-radius-lg);
  box-shadow: var(--wx-shell-banner-shadow);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100%;
}
.wx-banner--floating .wx-banner__icon {
  width: 34px;
  height: 34px;
  border-radius: var(--wx-radius-full);
  background: var(--_tone-bg);
  color: var(--_tone-fg);
}

/* ── strip ── */
.wx-banner--strip {
  padding: var(--wx-space-2) var(--wx-space-4);
  background: var(--_tone-solid);
  color: var(--wx-text-on-brand);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  padding-right: 40px;
}
.wx-banner--strip .wx-banner__icon { color: inherit; }
.wx-banner--strip .wx-banner__desc { color: inherit; opacity: 0.92; }
.wx-banner--strip .wx-banner__title { color: inherit; }
.wx-banner--strip .wx-banner__action {
  background: rgba(255, 255, 255, 0.18);
  color: inherit;
  border-color: rgba(255, 255, 255, 0.28);
}
.wx-banner--strip .wx-banner__action:hover { background: rgba(255, 255, 255, 0.3); }
.wx-banner--strip .wx-banner__close { color: inherit; }
.wx-banner--strip .wx-banner__close:hover { background: rgba(255, 255, 255, 0.2); color: inherit; }

.wx-banner__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.wx-banner__text { flex: 1; min-width: 0; }
.wx-banner__title {
  margin: 0;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-bold);
  line-height: var(--wx-lh-snug);
  color: var(--wx-text-primary);
}
.wx-banner__desc {
  margin: 2px 0 0;
  font-size: var(--wx-fs-12);
  line-height: var(--wx-lh-normal);
  color: var(--wx-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
}
.wx-banner--strip .wx-banner__title + .wx-banner__desc { margin-top: 0; }
.wx-banner--strip .wx-banner__text { display: flex; align-items: baseline; gap: var(--wx-space-2); flex-wrap: wrap; }
.wx-banner--strip .wx-banner__desc { margin: 0; }

.wx-banner__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-2);
  flex-shrink: 0;
}
.wx-banner__action {
  height: 30px;
  padding: 0 var(--wx-space-3);
  border: 1px solid transparent;
  border-radius: var(--wx-radius-md);
  background: var(--_tone-solid);
  color: var(--wx-text-on-brand);
  font-family: inherit;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  white-space: nowrap;
  cursor: pointer;
  transition: filter var(--wx-d-fast) var(--wx-ease-standard),
              transform var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-banner__action:hover { filter: brightness(0.92); }
.wx-banner__action:active { transform: translateY(1px); }
.wx-banner__action:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }

.wx-banner__close {
  position: absolute;
  top: 50%;
  right: var(--wx-space-2);
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--wx-radius-sm);
  background: transparent;
  color: var(--wx-text-muted);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard),
              color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-banner__close :deep(svg) { width: 14px; height: 14px; }
.wx-banner__close:hover { background: var(--wx-surface-sunken); color: var(--wx-text-primary); }
.wx-banner__close:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 0; }

/* ── transition ── */
.wx-banner-enter-active,
.wx-banner-leave-active {
  transition: opacity var(--wx-d-normal) var(--wx-ease-standard),
              transform var(--wx-d-normal) var(--wx-ease-standard);
}
.wx-banner-enter-from,
.wx-banner-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 479px) {
  .wx-banner--floating { flex-wrap: wrap; row-gap: var(--wx-space-2); }
  .wx-banner__actions { width: 100%; justify-content: flex-end; }
}

@media (prefers-reduced-motion: reduce) {
  .wx-banner-enter-active,
  .wx-banner-leave-active { transition: none; }
}
</style>
