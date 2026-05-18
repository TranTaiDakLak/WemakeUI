<script setup lang="ts">
import { ref } from 'vue'
import SaasLayout from '../_layouts/SaasLayout.vue'
import CrudPage from '@/archetypes/crud/CrudPage.vue'
import { BaseButton, BaseAvatar, BaseBadge, BaseTabs } from '@/components/common'
import StatusChip from '@/components/common/StatusChip.vue'
import { membersConfig, MEMBER_STATUS_MAP } from '@/configs/saas/members.config'
import type { Member } from '@/configs/saas/members.config'

const crudRef = ref<InstanceType<typeof CrudPage> | null>(null)
function asMember(row: unknown): Member { return row as unknown as Member }

/* ── Detail tabs ── */
const detailTab = ref('info')

const MEMBER_TABS = [
  { key: 'info',     label: 'Thông tin' },
  { key: 'products', label: 'Sản phẩm sở hữu' },
]

const PRODUCTS_POOL = [
  { name: 'WemakeUI Pro',        plan: 'Subscription', price: '499.000đ/tháng', since: '01/01/2024', status: 'active' },
  { name: 'AutoMessage Plus',     plan: 'One-time',     price: '1.490.000đ',     since: '15/02/2024', status: 'active' },
  { name: 'ChatBot Builder',      plan: 'Subscription', price: '299.000đ/tháng', since: '08/03/2024', status: 'active' },
  { name: 'CRM Enterprise',       plan: 'Subscription', price: '799.000đ/tháng', since: '22/04/2024', status: 'expired' },
  { name: 'Analytics Suite',      plan: 'One-time',     price: '990.000đ',       since: '01/05/2024', status: 'active' },
  { name: 'API Access Pro',       plan: 'Subscription', price: '199.000đ/tháng', since: '10/06/2024', status: 'active' },
  { name: 'Email Automation',     plan: 'One-time',     price: '2.490.000đ',     since: '15/07/2024', status: 'active' },
  { name: 'SMS Gateway',          plan: 'Subscription', price: '399.000đ/tháng', since: '20/08/2024', status: 'pending' },
  { name: 'Push Kit',             plan: 'One-time',     price: '790.000đ',       since: '01/09/2024', status: 'active' },
  { name: 'Social Media Manager', plan: 'Subscription', price: '599.000đ/tháng', since: '12/10/2024', status: 'active' },
  { name: 'WemakeUI Pro',        plan: 'Renewal',      price: '499.000đ/tháng', since: '01/11/2024', status: 'active' },
]

function getMemberProducts(m: Member) {
  const count = m.productsCount
  return PRODUCTS_POOL.slice(0, count)
}
</script>

<template>
  <SaasLayout
    current="members"
    page-title="Thành viên"
    page-description="Quản lý tài khoản thành viên, phân quyền và lịch sử mua hàng"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost">Xuất CSV</BaseButton>
      <BaseButton size="sm" @click="crudRef?.openAdd()">+ Thêm thành viên</BaseButton>
    </template>

    <CrudPage ref="crudRef" :config="membersConfig" @open-detail="detailTab = 'info'">
      <!-- STT -->
      <template #cell-stt="{ index }">
        <span class="cell-stt">{{ index }}</span>
      </template>

      <!-- Avatar + tên -->
      <template #cell-name="{ row }">
        <div class="member-cell">
          <BaseAvatar :name="asMember(row).name" size="sm" />
          <span class="member-name">{{ asMember(row).name }}</span>
        </div>
      </template>

      <!-- Email -->
      <template #cell-email="{ row }">
        <span class="cell-mono">{{ asMember(row).email }}</span>
      </template>

      <!-- Trạng thái -->
      <template #cell-status="{ row }">
        <StatusChip :status="asMember(row).status" :map="MEMBER_STATUS_MAP" />
      </template>

      <!-- Số sản phẩm -->
      <template #cell-productsCount="{ row }">
        <BaseBadge
          :text="String(asMember(row).productsCount)"
          :variant="asMember(row).productsCount > 5 ? 'success' : asMember(row).productsCount > 0 ? 'info' : 'neutral'"
        />
      </template>

      <!-- Detail header: avatar + info -->
      <template #detail-header="{ item }">
        <div class="detail-hero">
          <BaseAvatar :name="asMember(item).name" size="lg" />
          <div class="detail-hero__info">
            <h3 class="detail-hero__name">{{ asMember(item).name }}</h3>
            <p class="detail-hero__email">{{ asMember(item).email }}</p>
            <StatusChip :status="asMember(item).status" :map="MEMBER_STATUS_MAP" />
          </div>
        </div>
      </template>

      <!-- Detail body: BaseTabs với 2 tab -->
      <template #detail-body="{ item }">
        <BaseTabs v-model="detailTab" :tabs="MEMBER_TABS">
          <!-- Tab: Thông tin -->
          <template #info>
            <div class="detail-section">
              <p class="detail-section__label">Thông tin tài khoản</p>
              <div class="detail-row">
                <span class="detail-key">Email</span>
                <code class="detail-val">{{ asMember(item).email }}</code>
              </div>
              <div class="detail-row">
                <span class="detail-key">Trạng thái</span>
                <StatusChip :status="asMember(item).status" :map="MEMBER_STATUS_MAP" />
              </div>
              <div class="detail-row">
                <span class="detail-key">Ngày tham gia</span>
                <span class="detail-val">{{ asMember(item).joinedAt }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Sản phẩm đã mua</span>
                <span class="detail-val">{{ asMember(item).productsCount }} sản phẩm</span>
              </div>
            </div>
            <div v-if="asMember(item).note" class="detail-section">
              <p class="detail-section__label">Ghi chú</p>
              <div class="detail-row">
                <span class="detail-val detail-val--note">{{ asMember(item).note }}</span>
              </div>
            </div>
          </template>

          <!-- Tab: Sản phẩm -->
          <template #products>
            <div v-if="getMemberProducts(asMember(item)).length === 0" class="detail-empty">
              <span class="detail-empty__icon">📦</span>
              <p>Chưa có sản phẩm nào</p>
            </div>
            <div v-else class="product-list">
              <div
                v-for="(p, i) in getMemberProducts(asMember(item))"
                :key="i"
                class="product-item"
              >
                <div class="product-item__icon">📦</div>
                <div class="product-item__info">
                  <span class="product-item__name">{{ p.name }}</span>
                  <span class="product-item__meta">{{ p.plan }} · {{ p.price }}</span>
                  <span class="product-item__since">Từ {{ p.since }}</span>
                </div>
                <span
                  class="product-item__status"
                  :class="`product-status--${p.status}`"
                >{{ p.status === 'active' ? 'Đang dùng' : p.status === 'expired' ? 'Hết hạn' : 'Chờ duyệt' }}</span>
              </div>
            </div>
          </template>
        </BaseTabs>
      </template>
    </CrudPage>
  </SaasLayout>
</template>

<style scoped>
.cell-stt {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  font-variant-numeric: tabular-nums;
}

.member-cell {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  min-width: 160px;
}

.member-name {
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-mono {
  font-family: var(--wx-font-mono, monospace);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
}

.detail-hero {
  display: flex;
  align-items: flex-start;
  gap: var(--wx-space-4);
  padding-bottom: var(--wx-space-5);
  margin-bottom: var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.detail-hero__info {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}

.detail-hero__name {
  margin: 0;
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
}

.detail-hero__email {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: var(--wx-text-muted);
}

.detail-section {
  margin-bottom: var(--wx-space-4);
}
.detail-section__label {
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
  margin: 0 0 var(--wx-space-2);
}
.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-3);
  padding: var(--wx-space-2) 0;
  border-bottom: 1px solid var(--wx-border-subtle);
}
.detail-row:last-child { border-bottom: none; }
.detail-key {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  flex-shrink: 0;
}
.detail-val {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-primary);
  text-align: right;
}
.detail-val--note {
  color: var(--wx-text-secondary);
  font-style: italic;
  text-align: left;
}

/* ── Product list ── */
.product-list {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.product-item {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-lg);
  border: 1px solid var(--wx-border-subtle);
}
.product-item__icon {
  font-size: 20px;
  flex-shrink: 0;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}
.product-item__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.product-item__name {
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-primary);
}
.product-item__meta {
  font-size: var(--wx-fs-11);
  color: var(--wx-text-muted);
}
.product-item__since {
  font-size: 10px;
  color: var(--wx-text-muted);
}
.product-item__status {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  flex-shrink: 0;
}
.product-status--active  { background: rgba(16,185,129,0.12); color: #059669; }
.product-status--expired { background: rgba(239,68,68,0.12);  color: #dc2626; }
.product-status--pending { background: rgba(245,158,11,0.12); color: #d97706; }

/* ── Empty ── */
.detail-empty {
  text-align: center;
  padding: var(--wx-space-8) 0;
  color: var(--wx-text-muted);
}
.detail-empty__icon { font-size: 32px; margin-bottom: var(--wx-space-2); }
.detail-empty p { font-size: var(--wx-fs-13); margin: 0; }
</style>
