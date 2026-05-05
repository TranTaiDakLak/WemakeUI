<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { GroupBox } from '../../../components/common'

const router = useRouter()

const routes = [
  { path: '/showcase/data/grid', title: 'BaseDataGrid + DataGridPro', desc: 'sort, virtual scroll, resize, pin, reorder, multi-select, inline edit, saved views, export CSV/JSON, BulkActionBar' },
  { path: '/showcase/data/filter', title: 'FilterBuilder', desc: 'nested AND/OR groups, operators theo data type, URL serialize base64, FilterChips strip' },
  { path: '/showcase/data/log', title: 'LogViewer', desc: 'streaming, level filter, search highlight, follow toggle, virtual scroll, download .log' },
  { path: '/showcase/data/kanban', title: 'Kanban', desc: 'drag-drop card giữa column, HTML5 native, priority + tags + assignee' },
  { path: '/showcase/data/calendar', title: 'Calendar', desc: 'month view + agenda view, events theo ngày, navigation prev/next/today' },
  { path: '/showcase/data/timeline', title: 'Timeline / Activity feed', desc: 'group by day, dot icon variant, actor + timestamp' },
  { path: '/showcase/data/gallery', title: 'Gallery / Media grid', desc: 'CSS columns masonry, lightbox với keyboard nav (←→Esc)' },
]
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI · Phase 4" subtitle="Data display + advanced UX" />
    <main class="main">
      <PageHeader
        title="Phase 4 — Data display"
        description="9 thành phần dữ liệu nâng cao theo spec WEMAKEUI.md phần V. Click vào từng card để xem demo."
      >
        <template #actions>
          <button class="back-btn" @click="router.push('/')">← Showcase chính</button>
        </template>
      </PageHeader>

      <div class="grid">
        <GroupBox v-for="r in routes" :key="r.path" :title="r.title">
          <p class="desc">{{ r.desc }}</p>
          <button class="open-btn" @click="router.push(r.path)">Mở demo →</button>
        </GroupBox>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; }
.main {
  flex: 1;
  padding: var(--space-lg);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
}
.desc {
  font-size: 13px;
  color: var(--wx-text-secondary);
  line-height: 1.5;
  margin: 0 0 12px;
}
.open-btn {
  padding: 6px 14px;
  background: var(--wx-gradient-button);
  color: #fff;
  border: none;
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--wx-font-primary);
}
.open-btn:hover {
  filter: brightness(1.05);
  box-shadow: var(--wx-shadow-md);
}
.back-btn {
  padding: 6px 12px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  cursor: pointer;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-secondary);
}
.back-btn:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
</style>
