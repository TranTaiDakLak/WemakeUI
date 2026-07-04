<script setup lang="ts">
/**
 * AppShell — root layout wrapper, 3 variant:
 *   - 'sidebar'  : left sidebar + topbar + main + (optional sub-sidebar 3 cột)
 *   - 'topnav'   : full-width topbar + centered main (cho landing/profile public)
 *   - 'split'    : split-pane resizable (master-detail)
 *
 * Phase 3 — layout shells.
 *
 * slots:
 *   sidebar / sub-sidebar — bên trái
 *   topbar                — header trên cùng
 *   nav                   — top-nav variant (centered nav)
 *   default               — main content
 *   master / detail       — split variant
 *   footer                — bottom bar (toàn shell)
 */
import { computed, ref, onMounted, onBeforeUnmount, useSlots } from 'vue'
import { useSmoothScroll } from '../../composables/useSmoothScroll'

const props = withDefaults(defineProps<{
  variant?: 'sidebar' | 'topnav' | 'split'
  /** chiều cao topbar (default 56) */
  topbarHeight?: number
  /** width split pane mặc định */
  splitDefaultLeft?: number
  /** min width pane trái */
  splitMinLeft?: number
  /** min width pane phải */
  splitMinRight?: number
  /** giới hạn max-width main (cho topnav) */
  maxWidth?: number | null
  /** center main content theo viewport (cho topnav) */
  centered?: boolean
  /** background style: 'base' | 'sunken' | 'gradient' */
  background?: 'base' | 'sunken' | 'gradient'
}>(), {
  variant: 'sidebar',
  topbarHeight: 56,
  splitDefaultLeft: 320,
  splitMinLeft: 200,
  splitMinRight: 320,
  maxWidth: 1200,
  centered: true,
  background: 'sunken',
})

const slots = useSlots()
const hasSidebar = computed(() => Boolean(slots['sidebar']))
const hasSubSidebar = computed(() => Boolean(slots['sub-sidebar']))
const hasTopbar = computed(() => Boolean(slots['topbar']))
const hasNav = computed(() => Boolean(slots['nav']))
const hasFooter = computed(() => Boolean(slots['footer']))

/* ── split pane ── */
const splitLeftWidth = ref(props.splitDefaultLeft)
const splitContainer = ref<HTMLElement | null>(null)
const isResizing = ref(false)

function onResizeStart(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  isResizing.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  const onMove = (ev: MouseEvent | TouchEvent) => {
    if (!splitContainer.value) return
    const rect = splitContainer.value.getBoundingClientRect()
    const clientX = 'touches' in ev ? ev.touches[0].clientX : ev.clientX
    const next = clientX - rect.left
    const max = rect.width - props.splitMinRight
    splitLeftWidth.value = Math.max(props.splitMinLeft, Math.min(max, next))
  }
  const onUp = () => {
    isResizing.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend', onUp)
}

function onResizeKey(e: KeyboardEvent) {
  if (!splitContainer.value) return
  const rect = splitContainer.value.getBoundingClientRect()
  const max = rect.width - props.splitMinRight
  const step = e.shiftKey ? 32 : 8
  if (e.key === 'ArrowLeft') {
    splitLeftWidth.value = Math.max(props.splitMinLeft, splitLeftWidth.value - step)
    e.preventDefault()
  } else if (e.key === 'ArrowRight') {
    splitLeftWidth.value = Math.min(max, splitLeftWidth.value + step)
    e.preventDefault()
  } else if (e.key === 'Home') {
    splitLeftWidth.value = props.splitMinLeft
    e.preventDefault()
  } else if (e.key === 'End') {
    splitLeftWidth.value = max
    e.preventDefault()
  }
}

const cssVars = computed(() => ({
  '--wx-shell-topbar-h': `${props.topbarHeight}px`,
  '--wx-shell-max-w': props.maxWidth ? `${props.maxWidth}px` : 'none',
}))

/* ── Momentum scroll cho vùng cuộn nội bộ (.wx-shell__main) ──
   Lenis global (App.vue) chỉ điều khiển window — shell này tự cuộn bên trong
   1 div riêng (overflow-y: auto) nên cần instance Lenis riêng, scoped vào
   chính div đó. */
const mainEl = ref<HTMLElement | null>(null)
const mainInnerEl = ref<HTMLElement | null>(null)
let stopSmoothScroll = () => {}
onMounted(() => {
  if (mainEl.value && mainInnerEl.value) {
    stopSmoothScroll = useSmoothScroll({ wrapper: mainEl.value, content: mainInnerEl.value, lerp: 0.3 })
  }
})
onBeforeUnmount(() => stopSmoothScroll())
</script>

<template>
  <div
    class="wx-shell"
    :data-variant="variant"
    :data-bg="background"
    :style="cssVars"
  >
    <!-- ── sidebar variant ───────────────────────────────────── -->
    <template v-if="variant === 'sidebar'">
      <header v-if="hasTopbar" class="wx-shell__topbar">
        <slot name="topbar" />
      </header>
      <div class="wx-shell__body">
        <aside v-if="hasSidebar" class="wx-shell__sidebar" data-part="sidebar">
          <slot name="sidebar" />
        </aside>
        <aside v-if="hasSubSidebar" class="wx-shell__sub-sidebar" data-part="sub-sidebar">
          <slot name="sub-sidebar" />
        </aside>
        <main ref="mainEl" class="wx-shell__main" data-part="main">
          <div ref="mainInnerEl" class="wx-shell__main-inner">
            <slot />
          </div>
        </main>
      </div>
    </template>

    <!-- ── topnav variant ────────────────────────────────────── -->
    <template v-else-if="variant === 'topnav'">
      <header class="wx-shell__topbar wx-shell__topbar--full">
        <div class="wx-shell__topbar-inner" :class="{ 'wx-shell__topbar-inner--max': maxWidth }">
          <slot name="topbar" />
          <slot name="nav" />
        </div>
      </header>
      <main
        ref="mainEl"
        class="wx-shell__main wx-shell__main--centered"
        :class="{ 'wx-shell__main--max': maxWidth && centered }"
        data-part="main"
      >
        <div ref="mainInnerEl" class="wx-shell__main-inner">
          <slot />
        </div>
      </main>
    </template>

    <!-- ── split variant ─────────────────────────────────────── -->
    <template v-else-if="variant === 'split'">
      <header v-if="hasTopbar" class="wx-shell__topbar">
        <slot name="topbar" />
      </header>
      <div
        ref="splitContainer"
        class="wx-shell__split"
        :class="{ 'wx-shell__split--resizing': isResizing }"
      >
        <section
          class="wx-shell__split-master"
          :style="{ width: `${splitLeftWidth}px` }"
          data-part="master"
        >
          <slot name="master" />
        </section>
        <div
          class="wx-shell__split-handle"
          role="separator"
          aria-orientation="vertical"
          aria-label="Kéo để thay đổi tỉ lệ"
          tabindex="0"
          :aria-valuenow="splitLeftWidth"
          :aria-valuemin="splitMinLeft"
          @mousedown="onResizeStart"
          @touchstart="onResizeStart"
          @keydown="onResizeKey"
        >
          <span class="wx-shell__split-grip" aria-hidden="true" />
        </div>
        <section class="wx-shell__split-detail" data-part="detail">
          <slot name="detail">
            <slot />
          </slot>
        </section>
      </div>
    </template>

    <footer v-if="hasFooter" class="wx-shell__footer" data-part="footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.wx-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  font-family: var(--wx-font-primary);
  color: var(--wx-content-primary);
  overflow: hidden;
}
.wx-shell[data-bg="base"]    { background: var(--wx-surface-base); }
.wx-shell[data-bg="sunken"]  { background: var(--wx-surface-sunken); }
.wx-shell[data-bg="gradient"]{ background: var(--wx-gradient-bg); }

/* ── Topbar (sidebar/split variant) ── */
.wx-shell__topbar {
  flex-shrink: 0;
  height: var(--wx-shell-topbar-h);
  z-index: var(--wx-z-sticky);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.wx-shell__topbar--full {
  background: var(--wx-surface-base);
}
.wx-shell__topbar-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-3);
  padding: 0 var(--wx-space-5);
  margin: 0 auto;
}
.wx-shell__topbar-inner--max {
  max-width: var(--wx-shell-max-w);
  width: 100%;
}

/* ── Body (sidebar variant) ── */
.wx-shell__body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.wx-shell__sidebar {
  flex-shrink: 0;
  height: 100%;
  z-index: var(--wx-z-raised);
}
.wx-shell__sub-sidebar {
  flex-shrink: 0;
  width: 280px;
  height: 100%;
  background: var(--wx-surface-base);
  border-right: 1px solid var(--wx-border-subtle);
  overflow-y: auto;
}

.wx-shell__main {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* ── Topnav variant ── */
.wx-shell__main--centered {
  width: 100%;
  margin: 0 auto;
}
.wx-shell__main--max {
  max-width: var(--wx-shell-max-w);
}

/* ── Split variant ── */
.wx-shell__split {
  flex: 1;
  display: flex;
  min-height: 0;
  position: relative;
}
.wx-shell__split--resizing { user-select: none; cursor: col-resize; }

.wx-shell__split-master {
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-base);
}

.wx-shell__split-handle {
  width: 6px;
  flex-shrink: 0;
  cursor: col-resize;
  position: relative;
  background: transparent;
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-shell__split-handle:hover,
.wx-shell__split--resizing .wx-shell__split-handle {
  background: rgba(37, 99, 235, 0.1);
}
.wx-shell__split-handle:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: -2px;
}
.wx-shell__split-grip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 32px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-border-default);
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-shell__split-handle:hover .wx-shell__split-grip,
.wx-shell__split--resizing .wx-shell__split-grip { background: var(--wx-brand-primary); }

.wx-shell__split-detail {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  background: var(--wx-surface-sunken);
}

/* ── Footer ── */
.wx-shell__footer {
  flex-shrink: 0;
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-base);
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .wx-shell__sub-sidebar { display: none; }
  .wx-shell__split { flex-direction: column; }
  .wx-shell__split-master {
    width: 100% !important;
    height: 40%;
    border-right: none;
    border-bottom: 1px solid var(--wx-border-subtle);
  }
  .wx-shell__split-handle { display: none; }
}

@media (max-width: 480px) {
  /* Ẩn hoàn toàn sidebar trên điện thoại nhỏ — dùng topbar để navigate */
  .wx-shell__sidebar { display: none; }
}
</style>
