<script setup lang="ts">
/** dashboard/ecommerce — doanh thu, đơn, tồn kho, top sản phẩm */
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseCard, BasePanel, BaseTag, BaseButton, BaseAvatar, BaseProgress } from '../../components/common'
import { sparkPath, sparkArea, seriesUp, seriesDown, seriesVolatile } from '../_layouts/dashboard-widgets'

const orders = [
  { id: '#1284', customer: 'Nguyễn Văn A', total: '2.450.000₫', status: 'shipped' },
  { id: '#1283', customer: 'Trần Thị B',   total: '1.180.000₫', status: 'pending' },
  { id: '#1282', customer: 'Lê Văn C',     total: '4.620.000₫', status: 'shipped' },
  { id: '#1281', customer: 'Phạm Thị D',   total: '780.000₫',   status: 'delivered' },
  { id: '#1280', customer: 'Hoàng Văn E',  total: '3.200.000₫', status: 'cancelled' },
  { id: '#1279', customer: 'Vũ Thị F',     total: '950.000₫',   status: 'delivered' },
] as const

const statusVariant = (s: string) =>
  s === 'pending'   ? 'warning' :
  s === 'shipped'   ? 'primary' :
  s === 'delivered' ? 'success' : 'danger'

const statusLabel = (s: string) =>
  s === 'pending'   ? 'chờ xử lý' :
  s === 'shipped'   ? 'đang giao' :
  s === 'delivered' ? 'đã giao'  : 'huỷ'

const products = [
  { name: 'Áo thun WemakeUI', sales: 248, stock: 1248, revenue: '124tr', trend: 'up' },
  { name: 'Sticker pack',     sales: 184, stock: 542,  revenue: '36tr',  trend: 'up' },
  { name: 'Cốc gradient',     sales: 92,  stock: 124,  revenue: '24tr',  trend: 'down' },
  { name: 'Sổ tay design',    sales: 64,  stock: 0,    revenue: '12tr',  trend: 'flat' },
  { name: 'Móc khoá Vue',     sales: 32,  stock: 1840, revenue: '4tr',   trend: 'up' },
]
</script>

<template>
  <AppPageLayout section="dashboards"
    current="Bán hàng"
    page-title="Tổng quan bán hàng"
    page-description="Đơn hàng, doanh thu và tồn kho — cập nhật realtime."
  >
    <template #actions>
      <BaseButton variant="ghost" size="sm">Xuất Excel</BaseButton>
      <BaseButton size="sm">+ Tạo đơn</BaseButton>
    </template>

    <div class="kpi-grid">
      <BaseCard padded shadow="sm">
        <div class="metric">
          <div class="metric-label">Doanh thu hôm nay</div>
          <div class="metric-value">128.420.000₫</div>
          <div class="metric-foot">
            <BaseTag size="sm" variant="success" text="+12%" />
            <svg class="spark" viewBox="0 0 100 24"><path :d="sparkPath([...seriesUp], 100, 24)" fill="none" stroke="#10b981" stroke-width="1.5" /></svg>
          </div>
        </div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <div class="metric-label">Đơn hàng</div>
          <div class="metric-value">1,284</div>
          <div class="metric-foot">
            <BaseTag size="sm" variant="success" text="+58 đơn" />
            <svg class="spark" viewBox="0 0 100 24"><path :d="sparkPath([...seriesVolatile], 100, 24)" fill="none" stroke="#2563eb" stroke-width="1.5" /></svg>
          </div>
        </div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <div class="metric-label">Giá trị TB</div>
          <div class="metric-value">1.840.000₫</div>
          <div class="metric-foot">
            <BaseTag size="sm" variant="warning" text="-2%" />
            <svg class="spark" viewBox="0 0 100 24"><path :d="sparkPath([...seriesDown], 100, 24)" fill="none" stroke="#f59e0b" stroke-width="1.5" /></svg>
          </div>
        </div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <div class="metric-label">Hủy đơn</div>
          <div class="metric-value">18</div>
          <div class="metric-foot">
            <BaseTag size="sm" variant="danger" text="1.4%" />
            <svg class="spark" viewBox="0 0 100 24"><path :d="sparkPath([...seriesDown], 100, 24)" fill="none" stroke="#ef4444" stroke-width="1.5" /></svg>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="cols">
      <BasePanel title="Đơn hàng gần đây" tone="default">
        <template #actions>
          <BaseButton variant="ghost" size="sm">Xem tất cả →</BaseButton>
        </template>
        <table class="orders">
          <thead>
            <tr><th>Mã đơn</th><th>Khách</th><th>Tổng tiền</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o.id">
              <td><code class="mono">{{ o.id }}</code></td>
              <td>
                <span class="cust">
                  <BaseAvatar :name="o.customer" size="xs" />
                  {{ o.customer }}
                </span>
              </td>
              <td>{{ o.total }}</td>
              <td><BaseTag size="sm" :variant="statusVariant(o.status)" :text="statusLabel(o.status)" /></td>
            </tr>
          </tbody>
        </table>
      </BasePanel>

      <BasePanel title="Top sản phẩm" tone="default">
        <ul class="prods">
          <li v-for="(p, i) in products" :key="p.name">
            <div class="prod-line">
              <span class="prod-rank">{{ i + 1 }}</span>
              <span class="prod-name">{{ p.name }}</span>
              <BaseTag
                v-if="p.stock === 0"
                size="sm" variant="danger" text="hết hàng"
              />
              <BaseTag v-else-if="p.stock < 200" size="sm" variant="warning" :text="`${p.stock} còn`" />
              <span class="prod-rev">{{ p.revenue }}</span>
            </div>
            <BaseProgress :value="(p.sales / 250) * 100" size="sm" variant="primary" />
          </li>
        </ul>
      </BasePanel>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--wx-space-3);
}
.metric { display: flex; flex-direction: column; gap: 4px; }
.metric-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.metric-value { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-bold); letter-spacing: var(--wx-tracking-tight); }
.metric-foot { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-2); }
.spark { width: 80px; height: 24px; }

.cols { display: grid; grid-template-columns: 2fr 1fr; gap: var(--wx-space-4); }
@media (max-width: 960px) { .cols { grid-template-columns: 1fr; } }

.orders { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.orders th, .orders td {
  text-align: left;
  padding: var(--wx-space-2) var(--wx-space-3);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.orders th {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  font-weight: var(--wx-fw-medium);
  text-transform: none;
}
.cust { display: inline-flex; align-items: center; gap: var(--wx-space-2); }
.mono { font-family: var(--wx-font-mono); color: var(--wx-content-link); }

.prods { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--wx-space-3); }
.prod-line {
  display: flex; align-items: center; gap: var(--wx-space-2);
  font-size: var(--wx-fs-13);
  margin-bottom: 4px;
}
.prod-rank {
  width: 20px; height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-full);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
}
.prod-name { flex: 1; }
.prod-rev { font-weight: var(--wx-fw-semibold); color: var(--wx-brand-primary); }
</style>
