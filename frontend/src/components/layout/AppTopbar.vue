<script setup lang="ts">
import { useTheme } from '../../ui-system/composables/useTheme'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
}>(), {
  title: 'WemakeUI',
  subtitle: '',
})

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header class="topbar no-select app-drag">
    <div class="topbar-left">
      <slot name="left" />
      <h1 class="topbar-title">{{ title }}</h1>
      <span v-if="subtitle" class="topbar-subtitle">{{ subtitle }}</span>
    </div>

    <div class="topbar-right app-no-drag">
      <slot name="actions" />

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
  padding: 0 var(--space-md);
  background: var(--wx-gradient-header);
  color: #fff;       /* default cho mọi icon/text trong topbar */
  flex-shrink: 0;
  z-index: var(--wx-z-dropdown);
  transition: background var(--wx-duration-normal) var(--wx-easing-default);
}

.topbar-left { display: flex; align-items: baseline; gap: var(--space-sm); }

.topbar-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--wx-text-inverse);
  letter-spacing: 0.3px;
}

.topbar-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
}

.topbar-right { display: flex; align-items: center; gap: var(--space-sm); }

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
  transition: all var(--wx-duration-fast) var(--wx-easing-default);
}

.topbar-icon-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: scale(1.05);
}

.topbar-icon-btn:active { transform: scale(0.95); }
</style>
