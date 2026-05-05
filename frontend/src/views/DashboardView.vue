<script setup lang="ts">
import PageHeader from '../components/layout/PageHeader.vue'
</script>

<template>
  <div class="page animate-in">
    <PageHeader title="Dashboard" description="Tổng quan tài khoản và hoạt động hệ thống" />

    <!-- Stat cards -->
    <div class="grid-4">
      <div class="card stat-card animate-in animate-delay-1">
        <div class="stat-label">Tài khoản</div>
        <div class="stat-value">128</div>
        <div class="stat-change stat-change--up">+12 tuần này</div>
      </div>
      <div class="card stat-card animate-in animate-delay-2">
        <div class="stat-label">Đang hoạt động</div>
        <div class="stat-value">94</div>
        <div class="stat-change stat-change--up">73.4%</div>
      </div>
      <div class="card stat-card animate-in animate-delay-3">
        <div class="stat-label">Công việc hôm nay</div>
        <div class="stat-value">36</div>
        <div class="stat-change">12 đang chạy</div>
      </div>
      <div class="card stat-card animate-in animate-delay-4">
        <div class="stat-label">Lỗi 24h</div>
        <div class="stat-value" style="color: var(--error-color)">3</div>
        <div class="stat-change stat-change--down">-2 so với hôm qua</div>
      </div>
    </div>

    <!-- Recent activity & chart placeholder -->
    <div class="grid-2" style="margin-top: var(--space-lg);">
      <div class="card section-card animate-in animate-delay-2">
        <div class="section-header">
          <div>
            <div class="section-title">Hoạt động gần đây</div>
            <div class="section-subtitle">Cập nhật 5 phút trước</div>
          </div>
        </div>
        <div class="placeholder-list">
          <div v-for="i in 5" :key="i" class="placeholder-row">
            <div class="placeholder-dot"></div>
            <div class="placeholder-bar" :style="{ width: (70 + Math.random() * 30) + '%' }"></div>
            <div class="placeholder-badge"></div>
          </div>
        </div>
      </div>

      <div class="card section-card animate-in animate-delay-3">
        <div class="section-header">
          <div>
            <div class="section-title">Thống kê tuần</div>
            <div class="section-subtitle">Lượt tương tác theo ngày</div>
          </div>
        </div>
        <div class="chart-placeholder">
          <div v-for="i in 7" :key="i" class="chart-bar" :style="{ height: (20 + Math.random() * 60) + '%' }"></div>
        </div>
        <div class="chart-labels">
          <span v-for="d in ['T2','T3','T4','T5','T6','T7','CN']" :key="d">{{ d }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-change {
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 500;
}
.stat-change--up { color: var(--success-color); }
.stat-change--down { color: var(--error-color); }

.section-card {
  min-height: 240px;
}

/* Placeholder list */
.placeholder-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.placeholder-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
}

.placeholder-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.5;
  flex-shrink: 0;
}

.placeholder-bar {
  height: 10px;
  border-radius: 5px;
  background: var(--hover-bg);
}

.placeholder-badge {
  width: 48px;
  height: 18px;
  border-radius: 9px;
  background: var(--hover-bg);
  margin-left: auto;
  flex-shrink: 0;
}

/* Chart placeholder */
.chart-placeholder {
  display: flex;
  align-items: flex-end;
  gap: var(--space-sm);
  height: 140px;
  padding-top: var(--space-md);
}

.chart-bar {
  flex: 1;
  background: var(--accent-gradient);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.chart-bar:hover {
  opacity: 1;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  margin-top: var(--space-xs);
  font-size: 11px;
  color: var(--text-tertiary);
}
</style>
