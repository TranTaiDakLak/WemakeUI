<script setup lang="ts">
import { ref } from 'vue'
import SaasLayout from '../_layouts/SaasLayout.vue'
import CrudPage from '@/archetypes/crud/CrudPage.vue'
import { BaseButton, BaseBadge, BaseWizard, BaseTextarea } from '@/components/common'
import StatusChip from '@/components/common/StatusChip.vue'
import { useToast } from '@/composables/useToast'
import {
  transactionsConfig,
  TX_STATUS_MAP, PAYMENT_STATUS_MAP, TX_TYPE_MAP,
  PAYMENT_METHOD_LABEL, formatAmount,
} from '@/configs/saas/transactions.config'
import type { Transaction } from '@/configs/saas/transactions.config'

const { showToast } = useToast()
const crudRef = ref<InstanceType<typeof CrudPage> | null>(null)
function asTx(row: unknown): Transaction { return row as unknown as Transaction }

/* ── Wizard state (per-drawer: refundReason is cleared on mount via :key) ── */
const refundReason = ref('')

const REFUND_STEPS = ['Xác nhận', 'Chi tiết', 'Hoàn tất']

async function submitRefund(item: Transaction) {
  await new Promise(r => setTimeout(r, 900))
  showToast('success', `Đã xử lý hoàn tiền cho ${item.txCode}`)
}

/* ── Quick actions ── */
async function confirmTx(item: Transaction) {
  await new Promise(r => setTimeout(r, 800))
  showToast('success', `Đã xác nhận giao dịch ${item.txCode}`)
}

async function cancelTx(item: Transaction) {
  await new Promise(r => setTimeout(r, 800))
  showToast('warning', `Đã huỷ giao dịch ${item.txCode}`)
}
</script>

<template>
  <SaasLayout
    current="transactions"
    page-title="Giao dịch"
    page-description="Theo dõi và quản lý toàn bộ giao dịch thanh toán"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost">Xuất Excel</BaseButton>
    </template>

    <CrudPage ref="crudRef" :config="transactionsConfig">
      <!-- STT -->
      <template #cell-stt="{ index }">
        <span class="cell-stt">{{ index }}</span>
      </template>

      <!-- Mã GD -->
      <template #cell-txCode="{ row }">
        <code class="cell-code">{{ asTx(row).txCode }}</code>
      </template>

      <!-- Họ tên -->
      <template #cell-memberName="{ row }">
        <span class="cell-member-name">{{ asTx(row).memberName }}</span>
      </template>

      <!-- Email -->
      <template #cell-memberEmail="{ row }">
        <span class="cell-member-email">{{ asTx(row).memberEmail }}</span>
      </template>

      <!-- Sản phẩm -->
      <template #cell-productName="{ row }">
        <span class="cell-product">{{ asTx(row).productName }}</span>
      </template>

      <!-- Loại GD -->
      <template #cell-txType="{ row }">
        <StatusChip :status="asTx(row).txType" :map="TX_TYPE_MAP" :dot="false" />
      </template>

      <!-- Phương thức -->
      <template #cell-paymentMethod="{ row }">
        <span class="cell-method">{{ PAYMENT_METHOD_LABEL[asTx(row).paymentMethod] }}</span>
      </template>

      <!-- Giá trị -->
      <template #cell-amount="{ row }">
        <span class="cell-amount">{{ formatAmount(asTx(row).amount) }}</span>
      </template>

      <!-- Trạng thái thanh toán -->
      <template #cell-paymentStatus="{ row }">
        <StatusChip :status="asTx(row).paymentStatus" :map="PAYMENT_STATUS_MAP" :dot="false" size="sm" />
      </template>

      <!-- Trạng thái GD -->
      <template #cell-txStatus="{ row }">
        <StatusChip :status="asTx(row).txStatus" :map="TX_STATUS_MAP" />
      </template>

      <!-- Detail: header với amount highlight -->
      <template #detail-header="{ item }">
        <div class="tx-detail-header">
          <div class="tx-amount-highlight">
            <span class="tx-amount-label">Giá trị giao dịch</span>
            <span class="tx-amount-value">{{ formatAmount(asTx(item).amount) }}</span>
          </div>
          <div class="tx-badges">
            <StatusChip :status="asTx(item).txType"        :map="TX_TYPE_MAP"        :dot="false" />
            <StatusChip :status="asTx(item).txStatus"      :map="TX_STATUS_MAP"      />
            <StatusChip :status="asTx(item).paymentStatus" :map="PAYMENT_STATUS_MAP" :dot="false" />
          </div>
        </div>
      </template>

      <!-- Detail: quick actions + refund wizard + admin note -->
      <template #detail-extra="{ item }">
        <!-- Quick actions (confirm / cancel — không phải hoàn tiền) -->
        <div
          v-if="asTx(item).txStatus === 'processing'"
          class="tx-actions-section"
        >
          <p class="section-label">Thao tác nhanh</p>
          <div class="tx-action-btns">
            <BaseButton
              size="sm"
              variant="primary"
              @click="confirmTx(asTx(item))"
            >Xác nhận giao dịch</BaseButton>
            <BaseButton
              size="sm"
              variant="danger"
              @click="cancelTx(asTx(item))"
            >Huỷ giao dịch</BaseButton>
          </div>
        </div>

        <!-- Refund wizard — luôn hiện cho giao dịch có thể hoàn tiền -->
        <div
          v-if="['completed', 'processing'].includes(asTx(item).txStatus)"
          class="refund-wizard-wrap"
        >
          <p class="section-label">Xử lý hoàn tiền</p>
          <!-- :key reset wizard về step 0 mỗi khi mở giao dịch mới -->
          <BaseWizard
            :key="asTx(item).id"
            :steps="REFUND_STEPS"
            @finish="submitRefund(asTx(item))"
          >
            <!-- Step 0: Xác nhận -->
            <template #step-0>
              <div class="wiz-step-body">
                <p class="wiz-step-title">Xác nhận yêu cầu hoàn tiền</p>
                <p class="wiz-step-desc">
                  Bạn đang yêu cầu hoàn tiền cho giao dịch
                  <strong>{{ asTx(item).txCode }}</strong> của
                  <strong>{{ asTx(item).memberName }}</strong>.
                  Vui lòng kiểm tra thông tin trước khi tiếp tục.
                </p>
                <div class="wiz-info-row">
                  <span class="wiz-info-key">Giá trị hoàn</span>
                  <span class="wiz-info-val">{{ formatAmount(asTx(item).amount) }}</span>
                </div>
                <div class="wiz-info-row">
                  <span class="wiz-info-key">Phương thức TT</span>
                  <span class="wiz-info-val">{{ PAYMENT_METHOD_LABEL[asTx(item).paymentMethod] }}</span>
                </div>
              </div>
            </template>

            <!-- Step 1: Chi tiết -->
            <template #step-1>
              <div class="wiz-step-body">
                <p class="wiz-step-title">Lý do hoàn tiền</p>
                <BaseTextarea
                  v-model="refundReason"
                  :rows="3"
                  placeholder="Mô tả lý do hoàn tiền (bắt buộc)..."
                />
                <p class="wiz-step-desc">
                  Lý do này sẽ được ghi nhận vào lịch sử giao dịch và thông báo tới khách hàng.
                </p>
              </div>
            </template>

            <!-- Step 2: Hoàn tất -->
            <template #step-2>
              <div class="wiz-step-body wiz-step-body--done">
                <div class="wiz-done-icon">✓</div>
                <p class="wiz-step-title">Sẵn sàng xử lý</p>
                <p class="wiz-step-desc">
                  Nhấn <strong>Hoàn tất</strong> để gửi yêu cầu hoàn tiền.
                  Khách hàng sẽ nhận được thông báo qua email.
                </p>
                <div v-if="refundReason" class="wiz-reason-preview">
                  <span class="wiz-info-key">Lý do:</span> {{ refundReason }}
                </div>
              </div>
            </template>
          </BaseWizard>
        </div>

        <div v-if="asTx(item).adminNote" class="admin-note">
          <p class="section-label">Ghi chú admin</p>
          <p class="admin-note__text">{{ asTx(item).adminNote }}</p>
        </div>
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

.cell-code {
  font-family: var(--wx-font-mono, monospace);
  font-size: var(--wx-fs-12);
  color: var(--wx-brand-primary);
  background: color-mix(in srgb, var(--wx-brand-primary) 8%, transparent);
  padding: 2px 6px;
  border-radius: var(--wx-radius-sm);
}

.cell-member-name  { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); white-space: nowrap; }
.cell-member-email { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; }

.cell-product {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  white-space: nowrap;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.cell-method {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
  white-space: nowrap;
}

.cell-amount {
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* ── Detail header ── */
.tx-detail-header {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding-bottom: var(--wx-space-4);
  margin-bottom: var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.tx-amount-highlight {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--wx-space-3) var(--wx-space-4);
  background: color-mix(in srgb, var(--wx-brand-primary) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--wx-brand-primary) 20%, transparent);
  border-radius: var(--wx-radius-md);
}
.tx-amount-label { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }
.tx-amount-value { font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-brand-primary); }

.tx-badges { display: flex; gap: var(--wx-space-2); flex-wrap: wrap; }

/* ── Actions section ── */
.tx-actions-section {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-4);
}

.section-label {
  margin: 0;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
}

.tx-action-btns { display: flex; gap: var(--wx-space-2); flex-wrap: wrap; }

/* ── Refund wizard ── */
.refund-wizard-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-4);
  padding: var(--wx-space-4);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-lg);
}

.refund-wizard-cancel {
  display: flex;
  justify-content: flex-end;
}

.wiz-step-body {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding: var(--wx-space-2) 0;
}

.wiz-step-body--done { align-items: center; text-align: center; }

.wiz-done-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-success-subtle);
  color: var(--wx-success-text);
  font-size: 22px;
  font-weight: var(--wx-fw-bold);
}

.wiz-step-title {
  margin: 0;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
}

.wiz-step-desc {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  line-height: var(--wx-lh-relaxed);
}

.wiz-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--wx-fs-13);
  padding: var(--wx-space-2) var(--wx-space-3);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}

.wiz-info-key { color: var(--wx-text-muted); }
.wiz-info-val { font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); }


.wiz-reason-preview {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  padding: var(--wx-space-2) var(--wx-space-3);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}

/* ── Admin note ── */
.admin-note {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  margin-bottom: var(--wx-space-4);
}

.admin-note__text {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  line-height: var(--wx-lh-normal);
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  border-left: 3px solid var(--wx-warning-solid);
}
</style>
