<script setup lang="ts">
/** dashboard/logistics — bản đồ giao hàng, hiệu suất kho */
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseCard, BasePanel, BaseTag, BaseButton, BaseProgress } from '../../components/common'

const warehouses = [
  { name: 'Kho Hà Nội',     fill: 78, capacity: '12,000 SKU', status: 'normal' },
  { name: 'Kho Đà Nẵng',    fill: 92, capacity: '8,500 SKU',  status: 'warning' },
  { name: 'Kho HCM',        fill: 64, capacity: '18,000 SKU', status: 'normal' },
  { name: 'Kho Cần Thơ',    fill: 32, capacity: '4,000 SKU',  status: 'low' },
]

const shipments = [
  { code: 'SH-1284', from: 'Kho HCM',   to: 'Q.1, HCM',     status: 'transit',   eta: '12:30' },
  { code: 'SH-1283', from: 'Kho HCM',   to: 'Thủ Đức',      status: 'delivered', eta: '08:42' },
  { code: 'SH-1282', from: 'Kho HN',    to: 'Q.Hai Bà Trưng', status: 'pickup',  eta: '14:00' },
  { code: 'SH-1281', from: 'Kho HCM',   to: 'Bình Tân',     status: 'delayed',   eta: '11:00 (+1h)' },
  { code: 'SH-1280', from: 'Kho HN',    to: 'Q.Đống Đa',    status: 'transit',   eta: '15:20' },
] as const

const sLabel = (s: string) => ({
  pickup: 'đang lấy hàng',
  transit: 'đang giao',
  delivered: 'đã giao',
  delayed: 'trễ giờ',
}[s as 'pickup'] ?? s)

const sVariant = (s: string) => ({
  pickup: 'warning',
  transit: 'primary',
  delivered: 'success',
  delayed: 'danger',
}[s as 'pickup'] ?? 'neutral') as 'warning' | 'primary' | 'success' | 'danger' | 'neutral'

const cities = [
  { x: 22, y: 18, name: 'Hà Nội', orders: 248 },
  { x: 28, y: 38, name: 'Đà Nẵng', orders: 96 },
  { x: 36, y: 78, name: 'HCM', orders: 482 },
  { x: 30, y: 88, name: 'Cần Thơ', orders: 64 },
  { x: 34, y: 32, name: 'Vinh', orders: 42 },
]
</script>

<template>
  <AppPageLayout section="dashboards"
    current="Vận chuyển"
    page-title="Logistics"
    page-description="Theo dõi đơn hàng và hiệu suất kho theo thời gian thực."
  >
    <template #actions>
      <BaseButton variant="ghost" size="sm">Tạo đơn ship</BaseButton>
      <BaseButton size="sm">Bản đồ đầy đủ</BaseButton>
    </template>

    <div class="kpi-grid">
      <BaseCard padded shadow="sm">
        <div class="m-label">Đơn đang giao</div>
        <div class="m-value">128</div>
        <BaseTag size="sm" variant="primary" text="42 xe đang chạy" />
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="m-label">Đã giao hôm nay</div>
        <div class="m-value">412</div>
        <BaseTag size="sm" variant="success" text="98% đúng giờ" />
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="m-label">Trễ giờ</div>
        <div class="m-value">8</div>
        <BaseTag size="sm" variant="warning" text="2% sla" />
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="m-label">Hủy / hoàn</div>
        <div class="m-value">14</div>
        <BaseTag size="sm" variant="danger" text="1.4%" />
      </BaseCard>
    </div>

    <div class="cols">
      <BaseCard title="Bản đồ giao hàng" subtitle="theo thành phố · 24h gần nhất" padded shadow="sm">
        <div class="map">
          <svg viewBox="0 0 60 100" class="map-svg" preserveAspectRatio="xMidYMid meet">
            <!-- Stylized VN coast -->
            <path d="M 22 8 Q 28 14 30 24 L 34 32 L 32 42 L 28 50 L 26 60 L 30 70 L 36 80 L 32 92 L 26 96 L 22 90 Q 24 80 22 70 L 20 56 L 18 42 L 16 28 Z"
                  fill="rgba(37,99,235,0.08)" stroke="#2563eb" stroke-width="0.4" />
            <g v-for="c in cities" :key="c.name">
              <circle :cx="c.x" :cy="c.y" :r="Math.max(1.2, c.orders / 80)" fill="#2563eb" opacity="0.4" />
              <circle :cx="c.x" :cy="c.y" r="1.2" fill="#2563eb" />
              <text :x="c.x + 2" :y="c.y" font-size="2" fill="#1e293b">{{ c.name }} · {{ c.orders }}</text>
            </g>
          </svg>
        </div>
      </BaseCard>

      <BasePanel title="Hiệu suất kho">
        <ul class="warehouses">
          <li v-for="w in warehouses" :key="w.name">
            <div class="w-line">
              <strong>{{ w.name }}</strong>
              <BaseTag
                :variant="w.status === 'warning' ? 'warning' : w.status === 'low' ? 'danger' : 'success'"
                :text="`${w.fill}%`"
                size="sm"
              />
            </div>
            <BaseProgress :value="w.fill" size="sm" :variant="w.fill > 90 ? 'warning' : 'primary'" />
            <span class="muted small">{{ w.capacity }}</span>
          </li>
        </ul>
      </BasePanel>
    </div>

    <BasePanel title="Đơn hàng vận chuyển gần đây">
      <table class="ships">
        <thead><tr>
          <th>Mã</th><th>Từ</th><th>Đến</th><th>Trạng thái</th><th>ETA</th>
        </tr></thead>
        <tbody>
          <tr v-for="s in shipments" :key="s.code">
            <td><code class="mono">{{ s.code }}</code></td>
            <td>{{ s.from }}</td>
            <td>{{ s.to }}</td>
            <td><BaseTag :variant="sVariant(s.status)" :text="sLabel(s.status)" size="sm" /></td>
            <td><span class="muted">{{ s.eta }}</span></td>
          </tr>
        </tbody>
      </table>
    </BasePanel>
  </AppPageLayout>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--wx-space-3);
}
.m-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.m-value { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-bold); margin: 4px 0; letter-spacing: var(--wx-tracking-tight); }
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }

.cols { display: grid; grid-template-columns: 2fr 1fr; gap: var(--wx-space-4); }
@media (max-width: 960px) { .cols { grid-template-columns: 1fr; } }

.map { background: var(--wx-surface-sunken); border-radius: var(--wx-radius-md); padding: var(--wx-space-3); }
.map-svg { width: 100%; height: 320px; }

.warehouses { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--wx-space-3); }
.warehouses li { display: flex; flex-direction: column; gap: 4px; }
.w-line { display: flex; justify-content: space-between; align-items: center; font-size: var(--wx-fs-13); }

.ships { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.ships th, .ships td { text-align: left; padding: var(--wx-space-2) var(--wx-space-3); border-bottom: 1px solid var(--wx-border-subtle); }
.ships th { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-medium); }
.mono { font-family: var(--wx-font-mono); color: var(--wx-content-link); }
</style>
