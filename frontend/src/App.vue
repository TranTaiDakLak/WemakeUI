<script setup lang="ts">
import BaseToast from './components/common/BaseToast.vue'
import { useTheme } from './ui-system/composables/useTheme'

useTheme()
</script>

<template>
  <div id="wemake-ui-root">
    <router-view v-slot="{ Component, route }">
      <Transition name="page">
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>

    <BaseToast />
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
  transition: opacity 120ms ease;
  position: absolute;
  width: 100%;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
