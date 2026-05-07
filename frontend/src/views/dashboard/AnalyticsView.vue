<script setup lang="ts">
/** dashboard/analytics — traffic, page views, bounce, funnel, heatmap */
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseCard, BaseTag, BaseButton, BaseProgress } from '../../components/common'
import { sparkPath, sparkArea, seriesUp, seriesVolatile } from '../_layouts/dashboard-widgets'

const traffic = [
  { src: 'Tìm kiếm Google', val: 12_482, pct: 48, delta: '+8%' },
  { src: 'Truy cập trực tiếp', val: 6_104, pct: 24, delta: '+2%' },
  { src: 'Mạng xã hội', val: 3_842, pct: 15, delta: '+12%' },
  { src: 'Email marketing', val: 2_180, pct: 9, delta: '-3%' },
  { src: 'Khác', val: 1_024, pct: 4, delta: '+1%' },
]

const funnel = [
  { step: 'Truy cập trang', users: 12_482, pct: 100 },
  { step: 'Xem sản phẩm', users: 5_204, pct: 41 },
  { step: 'Thêm vào giỏ', users: 2_038, pct: 16 },
  { step: 'Bắt đầu thanh toán', users: 982, pct: 8 },
  { step: 'Hoàn tất đơn', users: 642, pct: 5 },
]

// heatmap 7 ngày × 24 giờ
const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
function intensity(d: number, h: number): number {
  const peak = (h >= 9 && h <= 11) || (h >= 14 && h <= 16) || (h >= 20 && h <= 22)
  const weekend = d >= 5
  const base = peak ? 0.8 : 0.3
  const noise = ((d * 7 + h * 3) % 10) / 10 * 0.3
  return Math.min(1, base + noise - (weekend ? 0.2 : 0))
}
</script>

<template>
  <AppPageLayout section="dashboards"
    current="Phân tích"
    page-title="Phân tích traffic"
    page-description="Hiểu hành vi người dùng — cập nhật mỗi 5 phút."
  >
    <template #actions>
      <BaseButton variant="ghost" size="sm">Hôm nay</BaseButton>
      <BaseButton variant="ghost" size="sm">7 ngày</BaseButton>
      <BaseButton size="sm">30 ngày</BaseButton>
    </template>

    <div class="kpi-grid">
      <BaseCard padded shadow="sm">
        <div class="metric">
          <div class="metric-label">Phiên truy cập</div>
          <div class="metric-value">25,632</div>
          <BaseTag size="sm" variant="success" text="+8.2% w-w" />
        </div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <div class="metric-label">Lượt xem trang</div>
          <div class="metric-value">182,408</div>
          <BaseTag size="sm" variant="success" text="+12% w-w" />
        </div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <div class="metric-label">Thời gian TB</div>
          <div class="metric-value">3:42</div>
          <BaseTag size="sm" variant="success" text="+18s" />
        </div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <div class="metric-label">Tỷ lệ bounce</div>
          <div class="metric-value">38.4%</div>
          <BaseTag size="sm" variant="warning" text="-2.1%" />
        </div>
      </BaseCard>
    </div>

    <div class="cols">
      <BaseCard title="Lượt xem theo giờ" padded shadow="sm">
        <svg class="chart" viewBox="0 0 600 220" preserveAspectRatio="none">
          <path :d="sparkArea([...seriesVolatile, ...seriesUp, ...seriesVolatile], 600, 220, 8)" fill="rgba(37,99,235,0.15)" />
          <path :d="sparkPath([...seriesVolatile, ...seriesUp, ...seriesVolatile], 600, 220, 8)" fill="none" stroke="#2563eb" stroke-width="2" />
        </svg>
      </BaseCard>

      <BaseCard title="Nguồn traffic" padded shadow="sm">
        <ul class="src-list">
          <li v-for="t in traffic" :key="t.src">
            <div class="src-line">
              <strong>{{ t.src }}</strong>
              <span>{{ t.val.toLocaleString('vi-VN') }}</span>
              <BaseTag :variant="t.delta.startsWith('+') ? 'success' : 'danger'" :text="t.delta" size="sm" />
            </div>
            <BaseProgress :value="t.pct" size="sm" variant="primary" />
          </li>
        </ul>
      </BaseCard>
    </div>

    <BaseCard title="Phễu chuyển đổi" subtitle="từ truy cập → đơn hàng" padded shadow="sm">
      <ul class="funnel">
        <li v-for="(f, i) in funnel" :key="f.step" class="funnel-step">
          <div class="funnel-bar" :style="{ width: `${f.pct}%` }">
            <span class="funnel-label">{{ f.step }}</span>
            <span class="funnel-meta">{{ f.users.toLocaleString('vi-VN') }} · {{ f.pct }}%</span>
          </div>
          <div v-if="i < funnel.length - 1" class="funnel-drop">
            ↓ giảm {{ funnel[i].pct - funnel[i + 1].pct }}%
          </div>
        </li>
      </ul>
    </BaseCard>

    <BaseCard title="Heatmap traffic" subtitle="Theo ngày × giờ" padded shadow="sm">
      <div class="heatmap">
        <div class="hm-yax">
          <span v-for="d in days" :key="d">{{ d }}</span>
        </div>
        <div class="hm-grid">
          <div v-for="d in 7" :key="d" class="hm-row">
            <span
              v-for="h in 24"
              :key="h"
              class="hm-cell"
              :style="{ background: `rgba(37,99,235,${intensity(d - 1, h - 1)})` }"
              :title="`${days[d-1]} ${h-1}h: ${Math.round(intensity(d-1, h-1) * 1200)} lượt`"
            />
          </div>
        </div>
        <div class="hm-xax">
          <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span>
        </div>
      </div>
    </BaseCard>
  </AppPageLayout>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--wx-space-3);
}
.metric { display: flex; flex-direction: column; gap: 4px; }
.metric-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.metric-value {
  font-size: var(--wx-fs-28);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
}

.cols {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--wx-space-4);
}
@media (max-width: 960px) { .cols { grid-template-columns: 1fr; } }
.chart { width: 100%; height: 220px; }

.src-list {
  list-style: none;
  margin: 0; padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
}
.src-line {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--wx-space-2);
  align-items: center;
  font-size: var(--wx-fs-13);
  margin-bottom: 4px;
}

.funnel { list-style: none; margin: 0; padding: 0; }
.funnel-step {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--wx-space-2);
}
.funnel-bar {
  background: var(--wx-gradient-button);
  color: white;
  padding: var(--wx-space-2) var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-3);
  min-width: 240px;
  transition: width var(--wx-d-normal) var(--wx-ease-decelerate);
}
.funnel-label { font-weight: var(--wx-fw-semibold); font-size: var(--wx-fs-13); }
.funnel-meta { font-size: var(--wx-fs-12); opacity: 0.85; white-space: nowrap; }
.funnel-drop {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  padding-left: var(--wx-space-3);
}

.heatmap { display: grid; grid-template-columns: 32px 1fr; gap: 4px; }
.hm-yax {
  display: flex;
  flex-direction: column;
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  gap: 4px;
}
.hm-yax span { flex: 1; display: flex; align-items: center; }
.hm-grid { display: flex; flex-direction: column; gap: 2px; }
.hm-row { display: grid; grid-template-columns: repeat(24, 1fr); gap: 2px; }
.hm-cell {
  aspect-ratio: 1;
  border-radius: 2px;
  min-height: 14px;
  border: 1px solid rgba(255,255,255,0.5);
}
.hm-xax {
  grid-column: 2;
  display: flex;
  justify-content: space-between;
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  margin-top: 4px;
}
</style>
