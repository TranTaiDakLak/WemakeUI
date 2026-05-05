<script setup lang="ts">
/**
 * TitleBar — custom titlebar cho desktop wrapper (Wails / Tauri / Electron).
 * Trên web/mobile: render no-op (fallback hidden) trừ khi `force=true`.
 *
 *   <TitleBar title="WemakeUI" :draggable="true">
 *     <template #left>...</template>
 *     <template #right>...</template>
 *   </TitleBar>
 *
 *  drag region: data-wx-drag-region (Wails / Tauri đọc attribute này).
 *  cross-platform safe: không assume DOM API ngoài window/navigator.
 */
import { computed, onMounted, ref } from 'vue'
import WindowControls from './WindowControls.vue'

interface Props {
  title?: string
  /** ép hiện ngay cả trên web (vd preview trong showcase) */
  force?: boolean
  /** bật vùng drag (mặc định true) */
  draggable?: boolean
  /** vị trí window controls (mac trái, win/linux phải) */
  controlsPlacement?: 'auto' | 'left' | 'right' | 'none'
  /** style icon set */
  controlsStyle?: 'mac' | 'windows'
}

const props = withDefaults(defineProps<Props>(), {
  draggable: true,
  controlsPlacement: 'auto',
  controlsStyle: 'mac',
})

const isDesktopShell = ref(false)

onMounted(() => {
  if (typeof window === 'undefined') return
  // Wails injects `runtime`; Tauri injects `__TAURI__`; Electron injects `process.versions.electron`.
  const w = window as unknown as {
    runtime?: unknown
    __TAURI__?: unknown
    process?: { versions?: { electron?: string } }
  }
  isDesktopShell.value =
    Boolean(w.runtime) ||
    Boolean(w.__TAURI__) ||
    Boolean(w.process?.versions?.electron)
})

const visible = computed(() => isDesktopShell.value || props.force)

const platform = computed<'mac' | 'windows'>(() => {
  if (typeof navigator === 'undefined') return 'windows'
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'mac' : 'windows'
})

const placement = computed<'left' | 'right' | 'none'>(() => {
  if (props.controlsPlacement === 'auto') {
    return platform.value === 'mac' ? 'left' : 'right'
  }
  return props.controlsPlacement
})
</script>

<template>
  <header
    v-if="visible"
    class="wx-titlebar"
    :data-platform="platform"
    :data-controls="placement"
    :data-wx-drag-region="draggable ? '' : undefined"
  >
    <div v-if="placement === 'left'" class="wx-titlebar__controls">
      <WindowControls :style-variant="controlsStyle" />
    </div>
    <div class="wx-titlebar__left">
      <slot name="left" />
    </div>
    <div class="wx-titlebar__title" data-wx-drag-region>
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="wx-titlebar__right">
      <slot name="right" />
    </div>
    <div v-if="placement === 'right'" class="wx-titlebar__controls">
      <WindowControls :style-variant="controlsStyle" />
    </div>
  </header>
</template>

<style scoped>
.wx-titlebar {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  height: 38px;
  padding: 0 var(--wx-space-2);
  background: var(--wx-surface-base);
  border-bottom: 1px solid var(--wx-border-subtle);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-primary);
  user-select: none;
  -webkit-app-region: drag; /* Electron */
}
.wx-titlebar :deep(button),
.wx-titlebar :deep(a),
.wx-titlebar :deep(input) {
  -webkit-app-region: no-drag;
}

.wx-titlebar__left,
.wx-titlebar__right {
  display: flex;
  align-items: center;
  gap: var(--wx-space-1);
  -webkit-app-region: no-drag;
}

.wx-titlebar__title {
  flex: 1;
  text-align: center;
  font-weight: var(--wx-fw-medium);
  letter-spacing: var(--wx-tracking-tight);
  color: var(--wx-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wx-titlebar__controls {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
}
.wx-titlebar[data-controls='left'] .wx-titlebar__controls { order: 0; }
.wx-titlebar[data-controls='right'] .wx-titlebar__controls { order: 99; }
</style>
