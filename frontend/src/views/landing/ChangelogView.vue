<script setup lang="ts">
import LandingLayout from '../_layouts/LandingLayout.vue'
import { BaseBadge, BaseButton } from '../../components/common'

const CHANGELOG = [
  {
    version: 'v0.8.0', date: '2026-05-05', type: 'major',
    items: [
      { type: 'new', text: 'Chart system: 7 component SVG thuần — LineChart, AreaChart, BarChart, PieChart, Sparkline, Gauge, Heatmap' },
      { type: 'new', text: '27 page template mới: 10 auth, 7 error, 10 dashboard' },
      { type: 'new', text: 'DevPanel (Shift+Ctrl+D) — debug tab state, network, flags' },
      { type: 'improve', text: 'DataGridPro: thêm saved views, export CSV/JSON, density toggle' },
      { type: 'fix', text: 'BaseAvatarGroup: items prop không còn bắt buộc' },
      { type: 'fix', text: 'BaseBadge: thêm variant neutral, prop size' },
      { type: 'fix', text: 'BaseProgress: thêm variant danger' },
    ],
  },
  {
    version: 'v0.7.0', date: '2026-04-01', type: 'minor',
    items: [
      { type: 'new', text: 'Phase 5: EmptyState, ErrorState, JobCard, JobTimeline, LiveBadge, ConflictBanner, RetryButton, StepProgress' },
      { type: 'new', text: 'RBAC: useCan, useFlag, v-can, v-flag, CanShow, PermissionGate, UpgradeTooltip' },
      { type: 'new', text: 'Platform: TitleBar, WindowControls — auto-detect Wails/Tauri/Electron' },
      { type: 'new', text: 'OfflineBanner + mutation queue IndexedDB + exponential backoff' },
      { type: 'improve', text: 'useTheme: thêm system mode (auto detect prefers-color-scheme)' },
    ],
  },
  {
    version: 'v0.6.0', date: '2026-03-01', type: 'minor',
    items: [
      { type: 'new', text: 'Phase 4: DataGridPro, FilterBuilder, LogViewer, Kanban, Calendar, Timeline, Gallery' },
      { type: 'new', text: 'FilterBuilder: AND/OR nested groups max depth 3, URL serialize base64' },
      { type: 'new', text: 'LogViewer: streaming, level filter, search highlight, follow toggle, virtual scroll' },
      { type: 'improve', text: 'DataGrid: virtual scroll bật auto khi rows > 100' },
      { type: 'fix', text: 'Nhiều cải thiện accessibility: ARIA roles, keyboard nav' },
    ],
  },
]

const TYPE_CONFIG: Record<string, { label: string; variant: 'primary' | 'warning' | 'neutral' }> = {
  major: { label: 'Major', variant: 'primary' },
  minor: { label: 'Minor', variant: 'warning' },
  patch: { label: 'Patch', variant: 'neutral' },
}

const ITEM_ICONS: Record<string, string> = { new: '✨', improve: '⚡', fix: '🐛', break: '💥' }
const ITEM_COLORS: Record<string, string> = { new: 'success', improve: 'info', fix: 'warning', break: 'danger' }
</script>

<template>
  <LandingLayout>
    <section class="cl-hero">
      <h1 class="cl-title">Changelog</h1>
      <p class="cl-desc">Theo dõi mọi thay đổi và cập nhật của WemakeUI.</p>
    </section>

    <section class="cl-section">
      <div class="cl-inner">
        <div class="cl-feed">
          <div v-for="release in CHANGELOG" :key="release.version" class="release-block">
            <div class="release-header">
              <div class="version-row">
                <code class="version-num">{{ release.version }}</code>
                <BaseBadge :text="TYPE_CONFIG[release.type].label" :variant="TYPE_CONFIG[release.type].variant" />
              </div>
              <span class="release-date">{{ release.date }}</span>
            </div>
            <ul class="change-list">
              <li v-for="item in release.items" :key="item.text" class="change-item">
                <span class="change-icon">{{ ITEM_ICONS[item.type] }}</span>
                <span class="change-text">{{ item.text }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="cl-subscribe">
          <h2 class="sub-title">Nhận thông báo khi có phiên bản mới</h2>
          <div class="sub-form">
            <input class="sub-input" type="email" placeholder="email@example.com" />
            <BaseButton variant="primary">Đăng ký</BaseButton>
          </div>
        </div>
      </div>
    </section>
  </LandingLayout>
</template>

<style scoped>
.cl-hero { padding: var(--wx-space-12) var(--wx-space-5) var(--wx-space-8); text-align: center; background: var(--wx-gradient-bg); }
.cl-title { font-size: var(--wx-fs-48); font-weight: 800; letter-spacing: var(--wx-tracking-tight); margin-bottom: var(--wx-space-3); }
.cl-desc { font-size: var(--wx-fs-18); color: var(--wx-content-secondary); margin: 0; }
.cl-section { padding: var(--wx-space-8) var(--wx-space-5); }
.cl-inner { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--wx-space-8); }
.cl-feed { display: flex; flex-direction: column; gap: var(--wx-space-6); }

.release-block { padding: var(--wx-space-5); background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); }
.release-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--wx-space-4); }
.version-row { display: flex; align-items: center; gap: var(--wx-space-3); }
.version-num { font-family: var(--wx-font-mono); font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); color: var(--wx-brand-600); }
.release-date { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }

.change-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--wx-space-2); }
.change-item { display: flex; align-items: flex-start; gap: var(--wx-space-3); }
.change-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; margin-top: 2px; }
.change-text { font-size: var(--wx-fs-14); line-height: var(--wx-lh-normal); color: var(--wx-content-secondary); }

.cl-subscribe { padding: var(--wx-space-6); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-xl); text-align: center; }
.sub-title { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); margin-bottom: var(--wx-space-4); }
.sub-form { display: flex; gap: var(--wx-space-3); max-width: 400px; margin: 0 auto; }
.sub-input { flex: 1; padding: var(--wx-space-2) var(--wx-space-3); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); background: var(--wx-bg-base); color: var(--wx-content-primary); font-size: var(--wx-fs-14); }
</style>
