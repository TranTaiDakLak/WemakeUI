<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardKPICard from './DashboardKPICard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useStagger } from '@/composables/useStagger'

const router = useRouter()
const dashboard = useDashboardStore()
const stagger = useStagger(55)

const gridRef = ref<HTMLElement | null>(null)
const { revealed, observe } = useScrollReveal()
onMounted(() => { if (gridRef.value) observe(gridRef.value) })

function handleClick(kpi: typeof dashboard.kpis[0]) {
  if (kpi.routeTo) router.push(kpi.routeTo as Parameters<typeof router.push>[0])
  else if (kpi.onAction) kpi.onAction()
}
</script>

<template>
  <section ref="gridRef" class="kpi-grid" aria-label="KPI metrics">
    <!-- loading skeletons -->
    <template v-if="dashboard.loading">
      <DashboardKPICard
        v-for="i in 8" :key="`sk-${i}`"
        label="Đang tải..." :loading="true"
      />
    </template>
    <!-- live cards -->
    <template v-else>
      <DashboardKPICard
        v-for="(kpi, i) in dashboard.kpis"
        :key="kpi.label"
        v-bind="kpi"
        :loading="false"
        :style="stagger(i)"
        class="wx-reveal"
        :class="{ 'is-revealed': revealed }"
        @click="handleClick(kpi)"
      />
    </template>
  </section>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-5);
}
@media (min-width: 640px) { .kpi-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .kpi-grid { grid-template-columns: repeat(4, 1fr); } }
</style>
