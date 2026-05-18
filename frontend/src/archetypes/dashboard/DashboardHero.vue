<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { BaseButton } from '@/components/common'
import { useDashboardStore } from '@/stores/dashboard'

const props = withDefaults(defineProps<{
  userName?: string
  showActions?: boolean
}>(), {
  userName: 'Quản trị viên',
  showActions: true,
})

const emit = defineEmits<{
  openCampaignModal: []
  openAccountModal: []
  openErrors: []
}>()

const router = useRouter()
const dashboard = useDashboardStore()

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Chào buổi sáng'
  if (h < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
})

const today = computed(() =>
  new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }),
)

const ENV_COLOR: Record<string, string> = {
  ok: '#22c55e',
  degraded: '#f59e0b',
  down: '#ef4444',
}
</script>

<template>
  <div class="d-hero">
    <div class="d-hero__left">
      <p class="d-hero__greeting">{{ greeting }}, {{ userName }} 👋</p>
      <h2 class="d-hero__title">Tổng quan hệ thống</h2>
      <p class="d-hero__date">{{ today }}</p>
    </div>

    <div class="d-hero__right">
      <!-- env status pills -->
      <div class="d-hero__env">
        <span class="d-hero__live">
          <span class="wx-live-ping" style="color: #22c55e; margin-right: 6px" />
          Realtime
        </span>
        <span
          v-for="svc in dashboard.envServices"
          :key="svc.label"
          class="d-hero__env-pill"
          :class="`d-hero__env-pill--${svc.status}`"
        >
          <span class="d-hero__env-dot" :style="{ background: ENV_COLOR[svc.status] }" />
          {{ svc.label }}
        </span>
      </div>

      <!-- quick action buttons -->
      <div v-if="showActions" class="d-hero__actions">
        <BaseButton size="sm" variant="ghost" @click="router.push('/wemakeui/scheduler')">
          ⏳ Scheduler
        </BaseButton>
        <BaseButton size="sm" variant="ghost" @click="router.push('/wemakeui/console')">
          🖥 Console
        </BaseButton>
        <BaseButton size="sm" variant="ghost" @click="emit('openCampaignModal')">
          📣 Tạo chiến dịch
        </BaseButton>
        <BaseButton size="sm" variant="primary" @click="emit('openAccountModal')">
          + Thêm tài khoản
        </BaseButton>
      </div>
    </div>
  </div>

  <!-- alert banner -->
  <Transition name="wx-slide-down">
    <div v-if="dashboard.activeAlerts.length" class="d-hero__alerts">
      <div class="alert-items">
        <div
          v-for="a in dashboard.activeAlerts"
          :key="a.id"
          class="alert-item"
          :class="`alert-item--${a.level}`"
        >
          <span class="alert-icon">{{ a.level === 'danger' ? '🔴' : '⚠️' }}</span>
          {{ a.text }}
          <BaseButton v-if="a.level === 'danger'" variant="ghost" size="sm" style="color: inherit; padding: 0 4px" @click="emit('openErrors')">
            Xem ngay →
          </BaseButton>
        </div>
      </div>
      <BaseButton
        variant="ghost"
        size="sm"
        aria-label="Đóng thông báo"
        @click="dashboard.activeAlerts.forEach(a => dashboard.dismissAlert(a.id))"
      >✕</BaseButton>
    </div>
  </Transition>
</template>

<style scoped>
.d-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--wx-space-4);
  padding: var(--wx-space-6) 0 var(--wx-space-4);
  flex-wrap: wrap;
}

.d-hero__left {}
.d-hero__greeting {
  font-size: var(--wx-text-sm);
  color: var(--wx-text-secondary);
  margin: 0 0 var(--wx-space-1);
}
.d-hero__title {
  font-size: var(--wx-text-2xl);
  font-weight: 700;
  color: var(--wx-text-primary);
  margin: 0 0 var(--wx-space-1);
  line-height: 1.25;
}
.d-hero__date {
  font-size: var(--wx-text-xs);
  color: var(--wx-text-tertiary);
  margin: 0;
  text-transform: capitalize;
}

.d-hero__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--wx-space-3);
}

.d-hero__env {
  display: flex;
  align-items: center;
  gap: var(--wx-space-1-5);
  flex-wrap: wrap;
  justify-content: flex-end;
}
.d-hero__live {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--wx-success);
  padding: 3px 10px;
  border-radius: var(--wx-radius-full);
  background: color-mix(in srgb, var(--wx-success) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--wx-success) 25%, transparent);
}
.d-hero__env-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-subtle);
  color: var(--wx-text-secondary);
}
.d-hero__env-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.d-hero__actions {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* alerts */
.d-hero__alerts {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3) var(--wx-space-4);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-subtle);
  margin-bottom: var(--wx-space-4);
}
.alert-items {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1-5);
  flex: 1;
}
.alert-item {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  font-size: var(--wx-text-sm);
}
.alert-item--danger { color: var(--wx-danger); }
.alert-item--warning { color: var(--wx-warning); }
.alert-icon { font-size: 14px; flex-shrink: 0; }
</style>
