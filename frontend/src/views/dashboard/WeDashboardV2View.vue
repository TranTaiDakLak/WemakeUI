<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import DashboardHero from '@/archetypes/dashboard/DashboardHero.vue'
import DashboardKPIGrid from '@/archetypes/dashboard/DashboardKPIGrid.vue'
import DashboardAnalytics from '@/archetypes/dashboard/DashboardAnalytics.vue'
import DashboardActivity from '@/archetypes/dashboard/DashboardActivity.vue'
import DashboardQuickActions from '@/archetypes/dashboard/DashboardQuickActions.vue'
import { BaseToast } from '@/components/common'

/* refs to archetype components for cross-component communication */
const activityRef = ref<InstanceType<typeof DashboardActivity> | null>(null)
const quickActionsRef = ref<InstanceType<typeof DashboardQuickActions> | null>(null)
</script>

<template>
  <AppPageLayout section="dashboards"
    current="wedashboard-v2"
    page-title="WeConnect Dashboard v2"
    page-description="Tổng quan trạng thái và hoạt động hệ thống — kiến trúc archetype"
  >
    <BaseToast />

    <!-- Hero: greeting + env status + alerts + action buttons -->
    <DashboardHero
      user-name="Quản trị viên"
      @open-campaign-modal="quickActionsRef?.openCampaignModal()"
      @open-account-modal="quickActionsRef?.openAccountModal()"
      @open-errors="activityRef?.openErrorsDrawer()"
    />

    <!-- KPI metrics grid (4-col, stagger reveal) -->
    <DashboardKPIGrid />

    <!-- Analytics: line chart, donut, bar chart, timeline -->
    <DashboardAnalytics
      @filter-accounts="(f) => activityRef?.setAccountFilter(f)"
    />

    <!-- Actionable tables: jobs / expiring accounts / pending tickets -->
    <DashboardActivity ref="activityRef" />

    <!-- Form modals (triggered via Hero buttons) -->
    <DashboardQuickActions ref="quickActionsRef" />
  </AppPageLayout>
</template>
