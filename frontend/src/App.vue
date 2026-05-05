<script setup lang="ts">
import BaseToast from './components/common/BaseToast.vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <div id="wemake-root">
    <router-view />
    <BaseToast />
  </div>
</template>
