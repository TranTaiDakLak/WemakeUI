<script lang="ts">
let _hintIdCounter = 0
</script>

<script setup lang="ts">
/**
 * BaseGuideHint — dấu (i) nhỏ; rê chuột / focus mở popover hướng dẫn (tiêu đề + các bước).
 * Port từ GuideHint của MindAds, bỏ store bật/tắt hướng dẫn (host dùng `v-if` nếu cần).
 *
 * Tự định vị (không dùng BasePopover): popover được Teleport ra <body>, lật lên/xuống theo khoảng
 * trống của *container cuộn gần nhất* (mặc định modal/drawer chứa nút) thay vì cả viewport —
 * tránh trường hợp icon ở cuối sidebar trong modal bị tràn ra ngoài card.
 *
 * Có `label` → nút dạng pill có chữ ("Tài liệu hướng dẫn") thay vì chấm (i).
 * Slot mặc định thay thế danh sách `steps` bằng nội dung tuỳ ý.
 */
import { computed, onBeforeUnmount, reactive, ref } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  steps?: string[]
  /** có chữ → pill; rỗng → chấm tròn chỉ icon */
  label?: string
  /** chuỗi SVG/HTML thay cho icon (i) mặc định */
  icon?: string
  /** chiều rộng popover (px) */
  width?: number
  /** selector tổ tiên dùng làm khung lật hướng; mặc định: [role=dialog], [aria-modal], rồi body */
  boundary?: string
}>(), {
  width: 240,
})

const uid = ++_hintIdCounter
const panelId = `wx-guide-hint-${uid}`

const btnRef = ref<HTMLButtonElement>()
const visible = ref(false)
const panelStyle = reactive<{ top: string; bottom: string; left: string }>({ top: '', bottom: '', left: '' })
let closeTimer: ReturnType<typeof setTimeout> | undefined

const GAP = 8
/** Ước lượng chiều cao tối đa của popover — quyết định lật hướng TRƯỚC khi render để khỏi nhấp nháy sai vị trí. */
const EST_HEIGHT = 200

const ariaLabel = computed(() => props.label || props.title || 'Hướng dẫn')

function position() {
  const btn = btnRef.value
  if (!btn || typeof window === 'undefined') return
  const rect = btn.getBoundingClientRect()
  const container =
    (props.boundary ? btn.closest(props.boundary) : null) ||
    btn.closest('[role="dialog"], [aria-modal="true"]') ||
    document.body
  const bounds = container.getBoundingClientRect()

  const openUpward = bounds.bottom - rect.bottom < EST_HEIGHT
  panelStyle.top = openUpward ? '' : `${rect.bottom + GAP}px`
  panelStyle.bottom = openUpward ? `${window.innerHeight - rect.top + GAP}px` : ''

  const maxLeft = window.innerWidth - props.width - 8
  panelStyle.left = `${Math.max(8, Math.min(rect.left, maxLeft))}px`
}

function open() {
  clearTimeout(closeTimer)
  position()
  visible.value = true
}
function cancelClose() { clearTimeout(closeTimer) }
/** Trễ nhỏ khi rời chuột để không chớp tắt lúc rê từ icon xuống popover. */
function scheduleClose() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => { visible.value = false }, 150)
}
function close() {
  clearTimeout(closeTimer)
  visible.value = false
}

onBeforeUnmount(() => clearTimeout(closeTimer))
</script>

<template>
  <span class="wx-guide-hint">
    <button
      ref="btnRef"
      type="button"
      class="wx-guide-hint__btn"
      :class="{ 'wx-guide-hint__btn--labeled': label }"
      :aria-label="ariaLabel"
      :aria-describedby="visible ? panelId : undefined"
      @mouseenter="open"
      @mouseleave="scheduleClose"
      @focus="open"
      @blur="scheduleClose"
      @keydown.esc="close"
    >
      <span v-if="icon" class="wx-guide-hint__icon" aria-hidden="true" v-html="icon" />
      <svg v-else class="wx-guide-hint__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
      <span v-if="label" class="wx-guide-hint__label">{{ label }}</span>
    </button>

    <Teleport to="body">
      <div
        v-if="visible"
        :id="panelId"
        class="wx-guide-hint__panel"
        :style="{ ...panelStyle, width: `${width}px` }"
        role="tooltip"
        @mouseenter="cancelClose"
        @mouseleave="scheduleClose"
      >
        <slot>
          <strong v-if="title" class="wx-guide-hint__title">{{ title }}</strong>
          <ul v-if="steps && steps.length" class="wx-guide-hint__list">
            <li v-for="(step, i) in steps" :key="i">{{ step }}</li>
          </ul>
        </slot>
      </div>
    </Teleport>
  </span>
</template>

<style scoped>
.wx-guide-hint { display: inline-flex; align-items: center; vertical-align: middle; }

.wx-guide-hint__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: var(--wx-radius-full);
  background: transparent;
  color: var(--wx-brand-primary);
  cursor: help;
  transition: opacity var(--wx-d-fast) var(--wx-ease-standard), background var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-guide-hint__btn:hover { opacity: 0.75; }
.wx-guide-hint__btn:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: 2px; }

.wx-guide-hint__icon { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* Bản pill có chữ: bo 6px (không tròn), nền xanh nhạt + viền */
.wx-guide-hint__btn--labeled {
  width: auto;
  height: 22px;
  padding: 0 8px;
  border: 1px solid var(--wx-selected-border);
  border-radius: 6px;
  background: var(--wx-selected-bg);
  cursor: pointer;
}
.wx-guide-hint__btn--labeled:hover {
  opacity: 1;
  background: var(--wx-selected-bg-hover);
  border-color: var(--wx-selected-border-hover);
}
.wx-guide-hint__label { font-size: var(--wx-fs-10); font-weight: var(--wx-fw-bold); white-space: nowrap; }
</style>

<!-- Panel được Teleport ra <body> nên nằm ngoài cây scope — style global, tiền tố riêng để không rò rỉ -->
<style>
.wx-guide-hint__panel {
  position: fixed;
  z-index: var(--wx-z-tooltip);
  padding: 10px 12px;
  background: var(--wx-tooltip-bg);
  color: var(--wx-tooltip-text);
  border-radius: var(--wx-radius-item);
  box-shadow: var(--wx-shadow-tooltip);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-11);
  line-height: 1.55;
}
.wx-guide-hint__title { display: block; margin-bottom: 6px; font-size: var(--wx-fs-12); }
.wx-guide-hint__list {
  margin: 0;
  padding-left: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: disc;
}
</style>
