<script setup lang="ts">
/**
 * WindowControls — minimize / maximize / close.
 * 2 style: mac (traffic lights) / windows.
 *
 *   <WindowControls style-variant="mac" @minimize=".." @maximize=".." @close=".." />
 *
 *  Caller bridge sang native API (Wails: WindowMinimise, Tauri: appWindow.minimize, Electron: ipcRenderer).
 *  fallback no-op trên web.
 */
interface Props {
  styleVariant?: 'mac' | 'windows'
  /** ẩn nút maximize */
  hideMaximize?: boolean
  /** ẩn nút minimize */
  hideMinimize?: boolean
}

withDefaults(defineProps<Props>(), {
  styleVariant: 'mac',
})

defineEmits<{
  minimize: []
  maximize: []
  close: []
}>()
</script>

<template>
  <div class="wx-wc" :data-style="styleVariant" role="group" aria-label="window controls">
    <template v-if="styleVariant === 'mac'">
      <button
        type="button"
        class="wx-wc__dot wx-wc__dot--close"
        aria-label="đóng"
        @click="$emit('close')"
      />
      <button
        v-if="!hideMinimize"
        type="button"
        class="wx-wc__dot wx-wc__dot--min"
        aria-label="thu nhỏ"
        @click="$emit('minimize')"
      />
      <button
        v-if="!hideMaximize"
        type="button"
        class="wx-wc__dot wx-wc__dot--max"
        aria-label="phóng to"
        @click="$emit('maximize')"
      />
    </template>

    <template v-else>
      <button
        v-if="!hideMinimize"
        type="button"
        class="wx-wc__btn"
        aria-label="thu nhỏ"
        @click="$emit('minimize')"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <line x1="2" y1="5" x2="8" y2="5" stroke="currentColor" stroke-width="1" />
        </svg>
      </button>
      <button
        v-if="!hideMaximize"
        type="button"
        class="wx-wc__btn"
        aria-label="phóng to"
        @click="$emit('maximize')"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <rect x="2" y="2" width="6" height="6" stroke="currentColor" stroke-width="1" fill="none" />
        </svg>
      </button>
      <button
        type="button"
        class="wx-wc__btn wx-wc__btn--close"
        aria-label="đóng"
        @click="$emit('close')"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 2 L8 8 M8 2 L2 8" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
        </svg>
      </button>
    </template>
  </div>
</template>

<style scoped>
.wx-wc {
  display: inline-flex;
  align-items: center;
  -webkit-app-region: no-drag;
}

/* mac traffic lights */
.wx-wc[data-style='mac'] { gap: 8px; padding: 0 var(--wx-space-2); }
.wx-wc[data-style='mac'] .wx-wc__dot {
  width: 12px;
  height: 12px;
  border-radius: var(--wx-radius-full);
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: filter var(--wx-d-micro) var(--wx-ease-standard);
}
.wx-wc[data-style='mac'] .wx-wc__dot:hover { filter: brightness(0.9); }
.wx-wc[data-style='mac'] .wx-wc__dot:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}
.wx-wc__dot--close { background: #ff5f57; }
.wx-wc__dot--min   { background: #ffbd2e; }
.wx-wc__dot--max   { background: #28c940; }

/* windows controls */
.wx-wc[data-style='windows'] .wx-wc__btn {
  width: 46px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--wx-text-secondary);
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.wx-wc[data-style='windows'] .wx-wc__btn:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}
.wx-wc[data-style='windows'] .wx-wc__btn--close:hover {
  background: var(--wx-danger-solid);
  color: var(--wx-text-inverse);
}
.wx-wc[data-style='windows'] .wx-wc__btn:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: -2px;
}
</style>
