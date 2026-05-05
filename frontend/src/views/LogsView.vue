<script setup lang="ts">
import PageHeader from '../components/layout/PageHeader.vue'

const mockLogs = [
  { time: '23:15:02', level: 'INFO', module: 'AutoLike', message: 'Liked 12 posts for account UID 100012345678' },
  { time: '23:14:58', level: 'WARN', module: 'AddFriend', message: 'Rate limit reached for account UID 100087654321' },
  { time: '23:14:45', level: 'ERROR', module: 'AutoComment', message: 'Failed to comment — account checkpoint detected' },
  { time: '23:14:30', level: 'INFO', module: 'System', message: 'Job #4 completed successfully (36 accounts)' },
  { time: '23:14:12', level: 'INFO', module: 'AutoPoke', message: 'Started poke job for 5 accounts' },
  { time: '23:13:55', level: 'WARN', module: 'System', message: 'Memory usage above 80% threshold' },
  { time: '23:13:40', level: 'INFO', module: 'AutoLike', message: 'Processing batch 3/5 for job #1' },
  { time: '23:13:22', level: 'ERROR', module: 'Login', message: 'Authentication failed for account UID 100033334444' },
]
</script>

<template>
  <div class="page animate-in">
    <PageHeader title="Nhật ký" description="Lịch sử hoạt động và log hệ thống">
      <template #actions>
        <button class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          Xoá log
        </button>
      </template>
    </PageHeader>

    <div class="card log-card animate-in animate-delay-1">
      <div class="log-list">
        <div v-for="(log, i) in mockLogs" :key="i" class="log-entry">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-level" :class="'log-level--' + log.level.toLowerCase()">{{ log.level }}</span>
          <span class="log-module">[{{ log.module }}]</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-card {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  padding: var(--space-md);
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 6px var(--space-sm);
  border-radius: var(--radius-sm);
  transition: background 0.1s;
}

.log-entry:hover {
  background: var(--hover-bg);
}

.log-time {
  color: var(--text-tertiary);
  flex-shrink: 0;
  width: 72px;
}

.log-level {
  font-weight: 700;
  font-size: 11px;
  width: 48px;
  text-align: center;
  flex-shrink: 0;
  padding: 1px 4px;
  border-radius: 3px;
}

.log-level--info { color: var(--accent-color); }
.log-level--warn { color: var(--warning-color); }
.log-level--error { color: var(--error-color); }

.log-module {
  color: var(--text-secondary);
  flex-shrink: 0;
  width: 100px;
}

.log-message {
  color: var(--text-primary);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
