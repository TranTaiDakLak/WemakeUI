<script lang="ts">
let _dialogIdCounter = 0
</script>

<script setup lang="ts">
/**
 * MindDialog — vỏ modal cho khuôn form-panel của MindAds:
 *   head (icon-tile + tiêu đề + phụ đề + nút đóng)  /  body (cuộn)  /  foot (hint + nút).
 *
 * Bản thân lo overlay (backdrop mờ), ESC, bấm nền để đóng, focus trap và hoạt ảnh vào/ra;
 * phần khung nhìn do <BaseFormPanel flat> đảm nhiệm nên cùng ngôn ngữ với popover/panel khác.
 *
 *   <MindDialog v-model="show" title="Thùng rác" subtitle="0 mục" :icon="ICON" size="md">
 *     …thân…
 *     <template #footer><BaseButton variant="ghost" @click="show = false">Đóng</BaseButton></template>
 *   </MindDialog>
 *
 * Slots: mặc định (thân) · `footer` · `footer-hint` · `head-extra` · `icon`.
 * Overlay dùng cùng token với BaseModal (z-index, backdrop) nên select/popover bên trong vẫn nổi lên trên.
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { IconTileTone } from '../../types'
import BaseFormPanel from '../common/BaseFormPanel.vue'

type DialogSize = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  /** chuỗi SVG cho icon-tile ở đầu hộp thoại */
  icon?: string
  tone?: IconTileTone
  size?: DialogSize
  /** bấm vùng nền mờ để đóng */
  closeOnBackdrop?: boolean
  closeLabel?: string
  /** làm mờ thân + chặn thao tác khi đang tải */
  loading?: boolean
}>(), {
  tone: 'brand',
  size: 'md',
  closeOnBackdrop: true,
  closeLabel: 'Đóng',
  loading: false,
})

const show = defineModel<boolean>({ required: true })

const WIDTHS: Record<DialogSize, string> = { sm: '460px', md: '640px', lg: '880px', xl: '1100px' }
const maxWidth = computed(() => WIDTHS[props.size])

const dialogId = `mind-dialog-${++_dialogIdCounter}`
const dialogRef = ref<HTMLElement>()

function close() {
  show.value = false
}

function focusables(): HTMLElement[] {
  if (!dialogRef.value) return []
  return Array.from(dialogRef.value.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  ))
}

function onKeydown(e: KeyboardEvent) {
  if (!show.value) return
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key === 'Tab') {
    const els = focusables()
    if (!els.length) return
    const first = els[0]
    const last = els[els.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

let previouslyFocused: HTMLElement | null = null

/* Chỉ nghe phím khi hộp thoại đang mở (guard SSR / môi trường không có document). */
watch(show, (open) => {
  if (typeof document === 'undefined') return
  if (open) {
    previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.addEventListener('keydown', onKeydown)
    nextTick(() => {
      /* ưu tiên ô nhập đầu tiên; không có thì đặt focus vào chính hộp thoại (tránh vòng focus thừa trên nút đóng) */
      const target = dialogRef.value?.querySelector<HTMLElement>('[data-autofocus], input:not([disabled]), textarea:not([disabled])')
        ?? dialogRef.value
      target?.focus({ preventScroll: true })
    })
  } else {
    document.removeEventListener('keydown', onKeydown)
    previouslyFocused?.focus?.()
    previouslyFocused = null
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="mind-dialog">
      <div
        v-if="show"
        class="mind-dialog__overlay"
        @mousedown.self="closeOnBackdrop && close()"
      >
        <div
          :id="dialogId"
          ref="dialogRef"
          class="mind-dialog"
          :style="{ maxWidth }"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          :aria-label="title"
        >
          <BaseFormPanel
            class="mind-dialog__panel"
            flat
            closable
            :title="title"
            :subtitle="subtitle"
            :icon="icon"
            :tone="tone"
            :close-label="closeLabel"
            :loading="loading"
            @close="close"
          >
            <template v-if="$slots.icon" #icon><slot name="icon" /></template>
            <template v-if="$slots['head-extra']" #head-extra><slot name="head-extra" /></template>
            <slot />
            <template v-if="$slots.footer" #footer><slot name="footer" /></template>
            <template v-if="$slots['footer-hint']" #footer-hint><slot name="footer-hint" /></template>
          </BaseFormPanel>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mind-dialog__overlay {
  position: fixed;
  inset: 0;
  z-index: var(--wx-z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--wx-space-4);
  background: var(--wx-backdrop-bg);
  backdrop-filter: blur(var(--wx-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--wx-backdrop-blur));
}

.mind-dialog {
  outline: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: min(88vh, 100%);
  border-radius: var(--wx-radius-panel);
  box-shadow: var(--wx-shadow-2xl);
}

/* Khung form-panel lấp đầy hộp thoại; thân cuộn còn đầu/chân giữ nguyên */
.mind-dialog__panel {
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;
}
.mind-dialog__panel :deep(.wx-form-panel__body) {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: var(--wx-space-4);
  scrollbar-width: thin;
  scrollbar-color: var(--wx-scrollbar-thumb) transparent;
}
.mind-dialog__panel :deep(.wx-form-panel__head) { padding: 14px var(--wx-space-5) 12px; }
.mind-dialog__panel :deep(.wx-form-panel__foot) { padding: var(--wx-space-3) var(--wx-space-5); }
.mind-dialog__panel :deep(.wx-form-panel__title) { font-size: var(--wx-fs-15); }
.mind-dialog__panel :deep(.wx-form-panel__sub) { font-size: var(--wx-fs-12); }

/* hoạt ảnh vào/ra — cùng nhịp với BaseModal */
.mind-dialog-enter-active { transition: opacity var(--wx-d-overlay-in) var(--wx-ease-bounce); }
.mind-dialog-leave-active { transition: opacity var(--wx-d-overlay-out) var(--wx-ease-accelerate); }
.mind-dialog-enter-from,
.mind-dialog-leave-to { opacity: 0; }
.mind-dialog-enter-active .mind-dialog { animation: mindDialogIn var(--wx-d-overlay-in) var(--wx-ease-bounce); }
.mind-dialog-leave-active .mind-dialog { animation: mindDialogOut var(--wx-d-overlay-out) var(--wx-ease-accelerate) forwards; }
@keyframes mindDialogIn {
  from { transform: scale(0.96); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
@keyframes mindDialogOut {
  from { transform: scale(1); opacity: 1; }
  to   { transform: scale(0.96); opacity: 0; }
}

@media (max-width: 520px) {
  .mind-dialog__overlay { padding: var(--wx-space-2); }
  .mind-dialog__panel :deep(.wx-form-panel__body) { padding: var(--wx-space-3); }
  .mind-dialog__panel :deep(.wx-form-panel__head),
  .mind-dialog__panel :deep(.wx-form-panel__foot) { padding-left: var(--wx-space-3); padding-right: var(--wx-space-3); }
}

@media (prefers-reduced-motion: reduce) {
  .mind-dialog-enter-active .mind-dialog,
  .mind-dialog-leave-active .mind-dialog { animation: none; }
}
</style>
