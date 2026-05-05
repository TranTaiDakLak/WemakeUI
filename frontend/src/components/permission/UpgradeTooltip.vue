<script setup lang="ts">
/**
 * UpgradeTooltip — hover/focus → "nâng cấp để dùng".
 * dành cho capability gate (free plan thiếu pro feature).
 *
 *   <UpgradeTooltip
 *     :locked="!isPro"
 *     plan="pro"
 *     description="xuất file CSV chỉ khả dụng cho gói pro"
 *   >
 *     <BaseButton>xuất CSV</BaseButton>
 *   </UpgradeTooltip>
 */
import { ref } from 'vue'

interface Props {
  /** đang khoá? — true → hiển thị tooltip + opacity slot */
  locked?: boolean
  /** tên gói cần nâng cấp */
  plan?: string
  /** mô tả ngắn */
  description?: string
  /** vị trí tooltip */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** label CTA */
  ctaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  locked: false,
  plan: 'pro',
  placement: 'top',
  ctaLabel: 'nâng cấp',
})

defineEmits<{
  upgrade: []
}>()

const open = ref(false)
function show() { if (props.locked) open.value = true }
function hide() { open.value = false }
</script>

<template>
  <span
    class="wx-upgrade"
    :data-locked="locked ? 'true' : 'false'"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <span class="wx-upgrade__slot">
      <slot />
    </span>
    <Transition name="wx-upgrade-fade">
      <span
        v-if="open && locked"
        class="wx-upgrade__tooltip"
        :data-placement="placement"
        role="tooltip"
      >
        <span class="wx-upgrade__head">
          <span class="wx-upgrade__lock" aria-hidden="true">🔒</span>
          <span>cần gói <strong>{{ plan }}</strong></span>
        </span>
        <span v-if="description" class="wx-upgrade__desc">{{ description }}</span>
        <button
          type="button"
          class="wx-upgrade__cta"
          @click.stop="$emit('upgrade')"
        >
          {{ ctaLabel }}
        </button>
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.wx-upgrade {
  display: inline-flex;
  position: relative;
  font-family: var(--wx-font-primary);
}

.wx-upgrade[data-locked='true'] .wx-upgrade__slot :deep(*) {
  pointer-events: none;
  opacity: 0.55;
}

.wx-upgrade__tooltip {
  position: absolute;
  z-index: var(--wx-z-tooltip);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
  padding: var(--wx-space-2) var(--wx-space-3);
  background: var(--wx-text-primary);
  color: var(--wx-text-inverse);
  border-radius: var(--wx-radius-md);
  box-shadow: var(--wx-shadow-2xl);
  font-size: var(--wx-fs-12);
  white-space: nowrap;
  pointer-events: auto;
}
.wx-upgrade__tooltip[data-placement='top']    { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
.wx-upgrade__tooltip[data-placement='bottom'] { top: calc(100% + 6px);    left: 50%; transform: translateX(-50%); }
.wx-upgrade__tooltip[data-placement='left']   { right: calc(100% + 6px);  top: 50%;  transform: translateY(-50%); }
.wx-upgrade__tooltip[data-placement='right']  { left: calc(100% + 6px);   top: 50%;  transform: translateY(-50%); }

.wx-upgrade__head {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-1);
  font-weight: var(--wx-fw-medium);
}
.wx-upgrade__lock { font-size: 12px; }
.wx-upgrade__desc {
  white-space: normal;
  max-width: 240px;
  color: rgba(255, 255, 255, 0.78);
  font-size: var(--wx-fs-12);
  line-height: var(--wx-lh-normal);
}

.wx-upgrade__cta {
  align-self: flex-start;
  margin-top: 2px;
  font-family: inherit;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  padding: 2px 10px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border: none;
  cursor: pointer;
  transition: filter var(--wx-d-micro) var(--wx-ease-standard);
}
.wx-upgrade__cta:hover { filter: brightness(0.95); }
.wx-upgrade__cta:focus-visible {
  outline: 2px solid var(--wx-brand-accent);
  outline-offset: 2px;
}

.wx-upgrade-fade-enter-active,
.wx-upgrade-fade-leave-active {
  transition: opacity var(--wx-d-fast) var(--wx-ease-standard),
              transform var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-upgrade-fade-enter-from,
.wx-upgrade-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
