<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import BaseToast from './components/common/BaseToast.vue'
import DevPanel from './components/debug/DevPanel.vue'
import { useTheme } from './ui-system/composables/useTheme'

useTheme()

const route = useRoute()

// Hiện nút quay về khi đang ở trang full-page template (không phải showcase/sitemap)
const showBackBtn = computed(() => {
  const p = route.path
  return p !== '/' && !p.startsWith('/showcase') && !p.startsWith('/legacy')
})
</script>

<template>
  <div id="wemake-ui-root">
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>

    <!-- Nút quay về showcase — chỉ hiện trên trang full-page template -->
    <Transition name="back-fade">
      <RouterLink v-if="showBackBtn" to="/" class="back-to-showcase" title="Quay về Showcase Sitemap">
        ← Showcase
      </RouterLink>
    </Transition>

    <BaseToast />
    <DevPanel />
  </div>
</template>

<style>
#wemake-ui-root {
  min-height: 100vh;
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Back to Showcase button ─────────────────────────── */
.back-to-showcase {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 8000;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--wx-bg-base, #fff);
  color: var(--wx-text-secondary, #555);
  border: 1px solid var(--wx-border-default, #ddd);
  border-radius: 999px;
  font-size: 12px;
  font-family: var(--wx-font-primary, sans-serif);
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  transition: all 0.15s ease;
}

.back-to-showcase:hover {
  background: var(--wx-brand-600, #2563eb);
  color: #fff;
  border-color: var(--wx-brand-600, #2563eb);
  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
}

.back-fade-enter-active,
.back-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.back-fade-enter-from,
.back-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
