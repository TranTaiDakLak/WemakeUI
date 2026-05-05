<script setup lang="ts">
import BaseToast from './components/common/BaseToast.vue'
import { useTheme } from './ui-system/composables/useTheme'

useTheme()
</script>

<template>
  <div id="wemake-ui-root">
    <router-view />
    <BaseToast />
  </div>
</template>

<style>
#wemake-ui-root {
  min-height: 100vh;
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
}
</style>
