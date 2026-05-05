<script setup lang="ts">
import PageHeader from '../components/layout/PageHeader.vue'

const mockJobs = [
  { id: 1, name: 'Auto Like Posts', accounts: 24, status: 'running', progress: 68 },
  { id: 2, name: 'Auto Add Friend', accounts: 12, status: 'running', progress: 42 },
  { id: 3, name: 'Auto Comment', accounts: 8, status: 'queued', progress: 0 },
  { id: 4, name: 'Mass Report', accounts: 36, status: 'completed', progress: 100 },
  { id: 5, name: 'Auto Poke', accounts: 5, status: 'failed', progress: 15 },
]
</script>

<template>
  <div class="page animate-in">
    <PageHeader title="Công việc" description="Quản lý và giám sát tác vụ tự động">
      <template #actions>
        <button class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          Dừng tất cả
        </button>
        <button class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Tạo công việc
        </button>
      </template>
    </PageHeader>

    <div class="card animate-in animate-delay-1">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên công việc</th>
            <th>Số TK</th>
            <th>Trạng thái</th>
            <th>Tiến độ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in mockJobs" :key="job.id">
            <td>{{ job.id }}</td>
            <td style="color: var(--text-primary); font-weight: 500;">{{ job.name }}</td>
            <td>{{ job.accounts }}</td>
            <td>
              <span class="badge" :class="{
                'badge-success': job.status === 'completed',
                'badge-info': job.status === 'running',
                'badge-warning': job.status === 'queued',
                'badge-error': job.status === 'failed',
              }">{{ job.status }}</span>
            </td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: job.progress + '%' }" :class="{
                  'progress--success': job.status === 'completed',
                  'progress--error': job.status === 'failed',
                }"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--hover-bg);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-color);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress--success { background: var(--success-color); }
.progress--error { background: var(--error-color); }
</style>
