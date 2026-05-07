<script setup lang="ts">
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseCard } from '../../components/common'

const ORDER = {
  id: 'ORD-2026-08472',
  date: '2026-05-05 10:42',
  status: 'shipping',
  customer: { name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0987 654 321' },
  address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
  items: [
    { name: 'Áo thun Premium WemakeUI', variant: 'Xanh dương / M', qty: 2, price: 299000 },
    { name: 'Túi canvas thêu logo', variant: 'Nâu', qty: 1, price: 129000 },
  ],
  subtotal: 727000,
  shipping: 30000,
  discount: 50000,
  total: 707000,
}

const TIMELINE = [
  { status: 'Đặt hàng', time: '2026-05-05 10:42', done: true },
  { status: 'Xác nhận', time: '2026-05-05 10:55', done: true },
  { status: 'Đang lấy hàng', time: '2026-05-05 14:00', done: true },
  { status: 'Đang giao', time: '2026-05-06 08:30', done: true },
  { status: 'Đã giao', time: '—', done: false },
]

const STATUS_MAP: Record<string, { label: string; variant: 'info' | 'success' | 'warning' | 'neutral' }> = {
  shipping: { label: 'Đang giao', variant: 'info' },
  delivered: { label: 'Đã giao', variant: 'success' },
  cancelled: { label: 'Đã huỷ', variant: 'neutral' },
}

function fmt(n: number) { return n.toLocaleString('vi-VN') + ' ₫' }
</script>

<template>
  <AppPageLayout section="app" current="đơn hàng" page-title="Chi tiết đơn hàng" :page-description="`Mã đơn: ${ORDER.id}`">
    <template #actions>
      <BaseButton size="sm" variant="ghost">In hoá đơn</BaseButton>
      <BaseButton size="sm" variant="secondary">Liên hệ hỗ trợ</BaseButton>
    </template>

    <div class="order-grid">
      <div class="order-main">
        <!-- status timeline -->
        <BaseCard>
          <template #header>
            <div class="card-head">
              <span class="card-label">Trạng thái đơn hàng</span>
              <BaseBadge :text="STATUS_MAP[ORDER.status].label" :variant="STATUS_MAP[ORDER.status].variant" />
            </div>
          </template>
          <template #body>
            <div class="timeline">
              <div v-for="(step, i) in TIMELINE" :key="step.status" class="timeline-step" :class="{ done: step.done }">
                <div class="step-indicator">
                  <div class="step-dot" :class="{ done: step.done }" />
                  <div v-if="i < TIMELINE.length - 1" class="step-line" :class="{ done: step.done }" />
                </div>
                <div class="step-info">
                  <span class="step-label">{{ step.status }}</span>
                  <span class="step-time">{{ step.time }}</span>
                </div>
              </div>
            </div>
          </template>
        </BaseCard>

        <!-- items -->
        <BaseCard>
          <template #header><span class="card-label">Sản phẩm đặt mua</span></template>
          <template #body>
            <div class="items-list">
              <div v-for="item in ORDER.items" :key="item.name" class="order-item">
                <div class="item-img" />
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-variant">{{ item.variant }}</span>
                  <span class="item-qty">Số lượng: {{ item.qty }}</span>
                </div>
                <span class="item-price">{{ fmt(item.price * item.qty) }}</span>
              </div>
            </div>
            <div class="order-summary">
              <div class="summary-row"><span>Tạm tính</span><span>{{ fmt(ORDER.subtotal) }}</span></div>
              <div class="summary-row"><span>Phí vận chuyển</span><span>{{ fmt(ORDER.shipping) }}</span></div>
              <div class="summary-row discount"><span>Giảm giá</span><span>-{{ fmt(ORDER.discount) }}</span></div>
              <div class="summary-row total"><span>Tổng cộng</span><span>{{ fmt(ORDER.total) }}</span></div>
            </div>
          </template>
        </BaseCard>
      </div>

      <div class="order-aside">
        <BaseCard>
          <template #header><span class="card-label">Thông tin khách hàng</span></template>
          <template #body>
            <div class="info-list">
              <div class="info-row"><span class="info-key">Họ tên</span><span>{{ ORDER.customer.name }}</span></div>
              <div class="info-row"><span class="info-key">Email</span><span>{{ ORDER.customer.email }}</span></div>
              <div class="info-row"><span class="info-key">SĐT</span><span>{{ ORDER.customer.phone }}</span></div>
            </div>
          </template>
        </BaseCard>
        <BaseCard>
          <template #header><span class="card-label">Địa chỉ giao hàng</span></template>
          <template #body>
            <p class="address-text">{{ ORDER.address }}</p>
          </template>
        </BaseCard>
        <BaseCard>
          <template #header><span class="card-label">Thanh toán</span></template>
          <template #body>
            <div class="info-list">
              <div class="info-row"><span class="info-key">Phương thức</span><span>Thẻ Visa ••••4242</span></div>
              <div class="info-row"><span class="info-key">Trạng thái</span><BaseBadge text="Đã thanh toán" variant="success" /></div>
            </div>
          </template>
        </BaseCard>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.order-grid { display: grid; grid-template-columns: 1fr 320px; gap: var(--wx-space-5); align-items: start; }
@media (max-width: 900px) { .order-grid { grid-template-columns: 1fr; } }
.order-main { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.order-aside { display: flex; flex-direction: column; gap: var(--wx-space-4); }

.card-head { display: flex; align-items: center; justify-content: space-between; }
.card-label { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); }

.timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-step { display: flex; gap: var(--wx-space-3); }
.step-indicator { display: flex; flex-direction: column; align-items: center; }
.step-dot { width: 12px; height: 12px; border-radius: var(--wx-radius-full); background: var(--wx-border-default); border: 2px solid var(--wx-bg-base); box-shadow: 0 0 0 2px var(--wx-border-default); flex-shrink: 0; }
.step-dot.done { background: var(--wx-status-success-border); box-shadow: 0 0 0 2px var(--wx-status-success-border); }
.step-line { width: 2px; flex: 1; background: var(--wx-border-subtle); margin: 4px 0; min-height: 24px; }
.step-line.done { background: var(--wx-status-success-border); }
.step-info { padding-bottom: var(--wx-space-4); }
.step-label { display: block; font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); color: var(--wx-content-primary); }
.timeline-step:not(.done) .step-label { color: var(--wx-content-muted); }
.step-time { display: block; font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin-top: 2px; }

.items-list { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.order-item { display: flex; gap: var(--wx-space-3); align-items: flex-start; }
.item-img { width: 64px; height: 64px; background: var(--wx-bg-sunken); border-radius: var(--wx-radius-md); flex-shrink: 0; }
.item-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.item-name { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); }
.item-variant { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.item-qty { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.item-price { font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); flex-shrink: 0; }

.order-summary { margin-top: var(--wx-space-4); padding-top: var(--wx-space-4); border-top: 1px solid var(--wx-border-subtle); display: flex; flex-direction: column; gap: var(--wx-space-2); }
.summary-row { display: flex; justify-content: space-between; font-size: var(--wx-fs-14); }
.summary-row.discount { color: var(--wx-status-success-text); }
.summary-row.total { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-bold); border-top: 1px solid var(--wx-border-default); padding-top: var(--wx-space-2); }

.info-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.info-row { display: flex; gap: var(--wx-space-3); font-size: var(--wx-fs-14); }
.info-key { color: var(--wx-content-muted); min-width: 80px; }
.address-text { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); line-height: var(--wx-lh-normal); margin: 0; }
</style>
