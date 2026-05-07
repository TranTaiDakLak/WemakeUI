<script setup lang="ts">
import { ref, computed } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseInput, BaseTag, BaseBadge } from '../../components/common'

const query = ref('dashboard')
const activeFilter = ref('tất cả')

const FILTERS = ['tất cả', 'trang', 'component', 'tài liệu', 'người dùng']

const RESULTS = [
  { id: 1, type: 'trang', title: 'Dashboard · tổng quan', desc: '4 KPI sparkline + chart line + donut + activity feed', path: '/dashboard/overview', tags: ['dashboard', 'KPI'] },
  { id: 2, type: 'trang', title: 'Dashboard · analytics', desc: 'traffic source + funnel chuyển đổi + heatmap 7×24', path: '/dashboard/analytics', tags: ['analytics', 'heatmap'] },
  { id: 3, type: 'component', title: 'DataGridPro', desc: 'sort, virtual 10k rows, resize, pin, reorder, multi-select, inline-edit', path: '/showcase/data/grid', tags: ['data', 'table'] },
  { id: 4, type: 'component', title: 'LineChart', desc: '7 chart thuần SVG — multi-series, hover tooltip, crosshair', path: '/showcase/charts', tags: ['chart', 'SVG'] },
  { id: 5, type: 'tài liệu', title: 'Hướng dẫn tích hợp API', desc: 'Authentication, rate limit, error codes, webhooks', path: '/app/wiki', tags: ['API', 'docs'] },
  { id: 6, type: 'người dùng', title: 'Lê Thị B', desc: 'Designer · online', path: '/app/profile', tags: ['team'] },
]

const filtered = computed(() => RESULTS.filter(r => {
  const matchType = activeFilter.value === 'tất cả' || r.type === activeFilter.value
  const matchQ = !query.value || r.title.toLowerCase().includes(query.value.toLowerCase()) || r.desc.toLowerCase().includes(query.value.toLowerCase())
  return matchType && matchQ
}))

const TYPE_ICONS: Record<string, string> = { trang: '📄', component: '🧩', 'tài liệu': '📚', 'người dùng': '👤' }
</script>

<template>
  <AppPageLayout section="app" current="tìm kiếm" page-title="Kết quả tìm kiếm" page-description="Tìm trang, component, tài liệu và người dùng">
    <div class="search-wrap">
      <div class="search-bar">
        <BaseInput v-model="query" placeholder="Tìm kiếm..." size="md" clearable style="max-width: 600px; width: 100%;" />
        <span class="result-count">{{ filtered.length }} kết quả</span>
      </div>

      <div class="filter-row">
        <BaseTag
          v-for="f in FILTERS" :key="f"
          :text="f" size="sm"
          :variant="activeFilter === f ? 'primary' : 'neutral'"
          style="cursor: pointer"
          @click="activeFilter = f"
        />
      </div>

      <div class="results">
        <a v-for="r in filtered" :key="r.id" :href="`#${r.path}`" class="result-item">
          <span class="result-icon">{{ TYPE_ICONS[r.type] || '🔍' }}</span>
          <div class="result-info">
            <div class="result-row">
              <span class="result-title">{{ r.title }}</span>
              <BaseBadge :text="r.type" variant="neutral" size="sm" />
            </div>
            <span class="result-desc">{{ r.desc }}</span>
            <div class="result-tags">
              <BaseTag v-for="t in r.tags" :key="t" :text="t" size="sm" variant="neutral" />
            </div>
          </div>
        </a>

        <div v-if="filtered.length === 0" class="no-results">
          <span class="no-icon">🔍</span>
          <p>Không tìm thấy kết quả cho "<strong>{{ query }}</strong>"</p>
        </div>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.search-wrap { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.search-bar { display: flex; align-items: center; gap: var(--wx-space-4); }
.result-count { font-size: var(--wx-fs-13); color: var(--wx-content-muted); white-space: nowrap; }
.filter-row { display: flex; flex-wrap: wrap; gap: var(--wx-space-2); }

.results { display: flex; flex-direction: column; gap: 2px; background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; }
.result-item { display: flex; gap: var(--wx-space-4); padding: var(--wx-space-4) var(--wx-space-5); text-decoration: none; border-bottom: 1px solid var(--wx-border-subtle); transition: background var(--wx-d-micro); }
.result-item:last-child { border-bottom: none; }
.result-item:hover { background: var(--wx-hover-bg); }
.result-icon { font-size: 20px; width: 28px; text-align: center; flex-shrink: 0; margin-top: 2px; }
.result-info { flex: 1; display: flex; flex-direction: column; gap: var(--wx-space-1); }
.result-row { display: flex; align-items: center; gap: var(--wx-space-3); }
.result-title { font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); color: var(--wx-content-link); }
.result-desc { font-size: var(--wx-fs-13); color: var(--wx-content-secondary); }
.result-tags { display: flex; gap: var(--wx-space-1); flex-wrap: wrap; }

.no-results { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-3); padding: var(--wx-space-9); color: var(--wx-content-muted); }
.no-icon { font-size: 40px; }
</style>
