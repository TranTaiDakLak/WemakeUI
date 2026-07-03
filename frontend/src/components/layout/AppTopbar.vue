<script setup lang="ts">
import { useTheme } from '../../ui-system/composables/useTheme'
import { useRouter } from 'vue-router'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  /** Ẩn nút quay về Lab */
  hideLabLink?: boolean
}>(), {
  title: 'WemakeUI',
  subtitle: '',
  hideLabLink: false,
})

const router = useRouter()
const { isDark, toggleTheme } = useTheme()

function goHome() { router.push('/') }
function goLab() { router.push('/lab') }
</script>

<template>
  <header class="topbar no-select app-drag">
    <div class="topbar-left">
      <slot name="left" />
      <h1 class="topbar-title" @click="goHome" title="Về trang chủ">{{ title }}</h1>
      <span v-if="subtitle" class="topbar-subtitle">{{ subtitle }}</span>
    </div>

    <div class="topbar-right app-no-drag">
      <slot name="actions" />

      <button
        v-if="!hideLabLink"
        class="topbar-icon-btn topbar-lab-btn"
        @click="goLab"
        title="Xem trực tiếp"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      </button>

      <button
        class="topbar-icon-btn"
        @click="toggleTheme()"
        :title="isDark ? 'Chế độ sáng' : 'Chế độ tối'"
      >
        <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  height: var(--wx-density-header-height, 56px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--wx-space-4);
  background: var(--wx-gradient-header);
  color: #fff;       /* default cho mọi icon/text trong topbar */
  flex-shrink: 0;
  z-index: var(--wx-z-dropdown);
  transition: background var(--wx-duration-normal) var(--wx-easing-default);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  min-width: 0; /* allow children to ellipsis instead of forcing wrap */
  flex: 1 1 auto;
  overflow: hidden;
}

.topbar-title {
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-inverse);
  letter-spacing: var(--wx-tracking-tight);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: opacity var(--wx-d-fast) var(--wx-ease-standard);
}
.topbar-title:hover {
  opacity: 0.8;
}

.topbar-subtitle {
  font-size: var(--wx-fs-12);
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30vw;
}

/* The user chip in the topbar already shows the same name; on narrow
   viewports the subtitle just duplicates that info AND forces wrap. */
@media (max-width: 640px) {
  .topbar-subtitle { display: none; }
}

.topbar-right { display: flex; align-items: center; gap: var(--wx-space-2); }

.topbar-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--wx-radius-full);
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
}

.topbar-icon-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: scale(1.05);
}

.topbar-icon-btn:active { transform: scale(0.95); }

.topbar-lab-btn {
  font-size: var(--wx-fs-12);
  gap: var(--wx-space-1);
}
</style>
