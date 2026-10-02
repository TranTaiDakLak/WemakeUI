<script setup lang="ts">
/**
 * BaseUpdateBanner — banner nhắc cập nhật / tải lại / thông báo hệ thống.
 * Port phần nhìn của UpdateBanner / ReloadPrompt / ExtensionUpdateBanner của MindAds:
 *   icon + tiêu đề + mô tả + nút hành động + nút đóng, tuỳ chọn khối "các bước" đánh số bên dưới.
 *
 * Không chứa logic kiểm tra phiên bản — host quyết định khi nào hiện (`show`) và xử lý `action`.
 *
 * placement:
 *   - 'inline' : nằm trong luồng trang
 *   - 'top'    : nổi giữa phía trên viewport (fixed), rộng tối đa 42rem
 *   - 'bottom' : nổi giữa phía dưới viewport
 *
 * Tone → màu: info (cyan thương hiệu), warning (hổ phách — "tải lại"), success, danger.
 * Có `actionHref` thì nút hành động là liên kết (mở tab mới) thay vì <button>.
 */
import { computed } from 'vue'
import type { BannerTone } from '../../types'
import BaseButton from './BaseButton.vue'

const props = withDefaults(defineProps<{
  /** hiển thị (v-model:show) */
  show?: boolean
  tone?: BannerTone
  title: string
  description?: string
  /** chuỗi SVG/HTML thay cho icon mặc định theo tone */
  icon?: string
  actionLabel?: string
  /** đặt thì nút hành động là <a> */
  actionHref?: string
  dismissible?: boolean
  dismissLabel?: string
  placement?: 'inline' | 'top' | 'bottom'
  /** khoảng cách tới mép viewport khi placement top/bottom (px) */
  offset?: number
  /** các bước hướng dẫn đánh số, hiện ở khối nền nhạt phía dưới */
  steps?: string[]
}>(), {
  show: true,
  tone: 'info',
  dismissible: true,
  dismissLabel: 'Đóng',
  placement: 'inline',
  offset: 12,
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  action: [event: MouseEvent]
  dismiss: []
}>()

const actionVariant = computed(() => ({
  info: 'primary',
  warning: 'warning',
  success: 'success',
  danger: 'danger',
}[props.tone] as 'primary' | 'warning' | 'success' | 'danger'))

const rootStyle = computed(() => {
  if (props.placement === 'top') return { top: `${props.offset}px` }
  if (props.placement === 'bottom') return { bottom: `${props.offset}px` }
  return undefined
})

function dismiss() {
  emit('update:show', false)
  emit('dismiss')
}
</script>

<template>
  <Transition name="wx-banner">
    <aside
      v-if="show"
      class="wx-banner"
      :class="[`wx-banner--${tone}`, `wx-banner--${placement}`, { 'wx-banner--has-steps': steps && steps.length }]"
      :style="rootStyle"
      role="status"
    >
      <div class="wx-banner__main">
        <span class="wx-banner__icon" aria-hidden="true">
          <span v-if="icon" class="wx-banner__glyph" v-html="icon" />
          <!-- icon mặc định theo tone -->
          <svg v-else-if="tone === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" />
          </svg>
          <svg v-else-if="tone === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
          </svg>
          <svg v-else-if="tone === 'danger'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" />
          </svg>
        </span>

        <div class="wx-banner__text">
          <div class="wx-banner__title">{{ title }}</div>
          <div v-if="description || $slots.default" class="wx-banner__desc"><slot>{{ description }}</slot></div>
        </div>

        <template v-if="actionLabel && !(steps && steps.length)">
          <a
            v-if="actionHref"
            class="wx-banner__link"
            :class="`wx-banner__link--${tone}`"
            :href="actionHref"
            target="_blank"
            rel="noopener"
            @click="emit('action', $event)"
          >{{ actionLabel }}</a>
          <BaseButton v-else size="sm" :variant="actionVariant" @click="emit('action', $event)">{{ actionLabel }}</BaseButton>
        </template>

        <button
          v-if="dismissible"
          type="button"
          class="wx-banner__close"
          :aria-label="dismissLabel"
          :title="dismissLabel"
          @click="dismiss"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <!-- Khối "các bước" — nền nhạt theo tông, nút hành động nằm cuối khối -->
      <div v-if="steps && steps.length" class="wx-banner__steps">
        <ol class="wx-banner__steps-list">
          <li v-for="(step, i) in steps" :key="i" class="wx-banner__step">
            <span class="wx-banner__step-no">{{ i + 1 }}</span>
            <span>{{ step }}</span>
          </li>
        </ol>
        <template v-if="actionLabel">
          <a
            v-if="actionHref"
            class="wx-banner__link wx-banner__link--block"
            :class="`wx-banner__link--${tone}`"
            :href="actionHref"
            target="_blank"
            rel="noopener"
            @click="emit('action', $event)"
          >{{ actionLabel }}</a>
          <BaseButton v-else size="sm" block :variant="actionVariant" @click="emit('action', $event)">{{ actionLabel }}</BaseButton>
        </template>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.wx-banner {
  --wx-banner-tone: var(--wx-brand-accent);
  --wx-banner-tone-solid: color-mix(in srgb, var(--wx-brand-accent) 80%, var(--wx-brand-600));
  overflow: hidden;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-primary);
  background: color-mix(in srgb, var(--wx-surface-elevated) 96%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid color-mix(in srgb, var(--wx-banner-tone) 35%, var(--wx-border-default));
  border-radius: var(--wx-radius-lg);
  box-shadow: var(--wx-shadow-lg);
}
.wx-banner--warning { --wx-banner-tone: var(--wx-warning-solid); --wx-banner-tone-solid: var(--wx-warning-text); }
.wx-banner--success { --wx-banner-tone: var(--wx-success-solid); --wx-banner-tone-solid: var(--wx-success-text); }
.wx-banner--danger  { --wx-banner-tone: var(--wx-danger-solid);  --wx-banner-tone-solid: var(--wx-danger-text); }

.wx-banner--top,
.wx-banner--bottom {
  position: fixed;
  left: 50%;
  z-index: var(--wx-z-overlay);
  width: calc(100% - 24px);
  max-width: 42rem;
  transform: translateX(-50%);
}
.wx-banner--has-steps.wx-banner--top,
.wx-banner--has-steps.wx-banner--bottom { max-width: 24rem; }

.wx-banner__main {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: 12px var(--wx-space-4);
}
.wx-banner--has-steps .wx-banner__main { align-items: flex-start; }

.wx-banner__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: var(--wx-radius-full);
  background: color-mix(in srgb, var(--wx-banner-tone) 14%, transparent);
  color: var(--wx-banner-tone-solid);
}
.wx-banner__glyph { display: inline-flex; align-items: center; justify-content: center; }

.wx-banner__text { flex: 1; min-width: 0; }
.wx-banner__title { margin: 0; font-size: var(--wx-fs-14); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); line-height: 1.35; }
.wx-banner__desc  { margin: 2px 0 0; font-size: var(--wx-fs-12); color: var(--wx-text-muted); line-height: 1.4; }
.wx-banner--inline .wx-banner__desc,
.wx-banner--top .wx-banner__desc,
.wx-banner--bottom .wx-banner__desc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wx-banner--has-steps .wx-banner__desc { white-space: normal; }

.wx-banner__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--wx-radius-ctrl-sm);
  background: transparent;
  color: var(--wx-text-light);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-banner__close:hover { background: var(--wx-hover-neutral); color: var(--wx-text-primary); }
.wx-banner__close:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: -1px; }
.wx-banner--has-steps .wx-banner__close { margin: -4px -6px 0 0; }

/* khối các bước */
.wx-banner__steps {
  padding: 12px var(--wx-space-4);
  background: color-mix(in srgb, var(--wx-banner-tone) 8%, var(--wx-surface-elevated));
  border-top: 1px solid color-mix(in srgb, var(--wx-banner-tone) 22%, transparent);
}
.wx-banner__steps-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
.wx-banner__step { display: flex; align-items: flex-start; gap: var(--wx-space-2); font-size: var(--wx-fs-12); line-height: 1.5; color: var(--wx-text-secondary); }
.wx-banner__step-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--wx-banner-tone) 28%, transparent);
  color: var(--wx-banner-tone-solid);
  font-size: var(--wx-fs-10);
  font-weight: var(--wx-fw-bold);
  line-height: 1;
}
.wx-banner__steps > .wx-btn,
.wx-banner__steps > .wx-banner__link { margin-top: 12px; }

/* nút hành động dạng liên kết (khi có actionHref) */
.wx-banner__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: var(--wx-control-h-sm);
  padding: 0 calc(var(--wx-control-px) - 2px);
  border-radius: var(--wx-radius-ctrl-sm);
  color: var(--wx-text-on-brand);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  text-decoration: none;
  white-space: nowrap;
  transition: filter var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-banner__link--info    { background: var(--wx-gradient-primary); }
.wx-banner__link--warning { background: var(--wx-gradient-warning); }
.wx-banner__link--success { background: var(--wx-gradient-success); }
.wx-banner__link--danger  { background: var(--wx-gradient-danger); }
.wx-banner__link:hover { filter: brightness(1.08); }
.wx-banner__link:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: 2px; }
.wx-banner__link--block { display: flex; width: 100%; }

/* transition */
.wx-banner-enter-active { transition: opacity var(--wx-d-normal) var(--wx-ease-bounce), transform var(--wx-d-normal) var(--wx-ease-bounce); }
.wx-banner-leave-active { transition: opacity var(--wx-d-fast) var(--wx-ease-accelerate), transform var(--wx-d-fast) var(--wx-ease-accelerate); }
.wx-banner--inline.wx-banner-enter-from,
.wx-banner--inline.wx-banner-leave-to { opacity: 0; transform: translateY(-6px); }
.wx-banner--top.wx-banner-enter-from,
.wx-banner--top.wx-banner-leave-to { opacity: 0; transform: translate(-50%, -12px); }
.wx-banner--bottom.wx-banner-enter-from,
.wx-banner--bottom.wx-banner-leave-to { opacity: 0; transform: translate(-50%, 12px); }

@media (prefers-reduced-motion: reduce) {
  .wx-banner-enter-active,
  .wx-banner-leave-active { transition: none; }
}

/* Màn hẹp: nút hành động xuống dòng dưới chữ (trước đây tiêu đề bị bóp còn ~100px, mô tả bị cắt "Bạn đang d…") */
@media (max-width: 479px) {
  .wx-banner__main { flex-wrap: wrap; }
  .wx-banner:not(.wx-banner--has-steps) .wx-banner__text {
    min-width: calc(100% - 36px - 28px - 2 * var(--wx-space-3));
  }
  .wx-banner--inline .wx-banner__desc,
  .wx-banner--top .wx-banner__desc,
  .wx-banner--bottom .wx-banner__desc { white-space: normal; }
  .wx-banner:not(.wx-banner--has-steps) .wx-banner__main > .wx-btn,
  .wx-banner:not(.wx-banner--has-steps) .wx-banner__main > .wx-banner__link { margin-left: calc(36px + var(--wx-space-3)); }
}
</style>
