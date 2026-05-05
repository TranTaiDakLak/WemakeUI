<script setup lang="ts">
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppTopbar from '../components/layout/AppTopbar.vue'
import { useAppStore } from '../stores/app'

const app = useAppStore()
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <div class="app-main">
      <AppTopbar />
      <main class="app-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--wx-surface-sunken);
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.app-content {
  flex: 1;
  overflow: hidden;
  padding: var(--wx-density-container-pad);
  background: var(--wx-surface-sunken);
  transition: background var(--wx-duration-normal) var(--wx-easing-default);
}

/* Page transition */
.page-enter-active { transition: opacity 0.2s var(--wx-easing-default); }
.page-leave-active { transition: opacity 0.15s var(--wx-easing-default); }
.page-enter-from { opacity: 0; }
.page-leave-to { opacity: 0; }
</style>
