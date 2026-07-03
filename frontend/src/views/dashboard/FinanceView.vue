<script setup lang="ts">
/** dashboard/finance — số dư, dòng tiền, giao dịch */
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseCard, BasePanel, BaseTag, BaseButton } from '../../components/common'
import { sparkPath, sparkArea, seriesUp, seriesDown, seriesVolatile } from '../_layouts/dashboard-widgets'

const accounts = [
  { name: 'Tài khoản chính',   bank: 'Vietcombank', balance: '4.820 tr', delta: '+182tr',  type: 'main' },
  { name: 'Tài khoản phụ',     bank: 'BIDV',        balance: '1.420 tr', delta: '+24tr',   type: 'side' },
  { name: 'Tài khoản USD',     bank: 'HSBC',        balance: '$48,200',  delta: '-$1,200', type: 'foreign' },
  { name: 'Quỹ khẩn cấp',      bank: 'Techcombank', balance: '320 tr',   delta: '0',       type: 'reserve' },
]

const tx = [
  { date: '04/05', desc: 'Thanh toán hoá đơn AWS',     amount: '-12.4tr', cat: 'infra'  },
  { date: '04/05', desc: 'Thu tiền KH TechCorp',       amount: '+120tr',  cat: 'sales'  },
  { date: '03/05', desc: 'Lương tháng 4',              amount: '-340tr',  cat: 'salary' },
  { date: '03/05', desc: 'Thu phí dịch vụ tháng',      amount: '+82tr',   cat: 'sales'  },
  { date: '02/05', desc: 'Mua software Figma team',    amount: '-4.2tr',  cat: 'tools'  },
  { date: '02/05', desc: 'Hoàn tiền Microsoft',        amount: '+2.4tr',  cat: 'refund' },
]
</script>

<template>
  <AppPageLayout section="dashboards"
    current="Tài chính"
    page-title="Tổng quan tài chính"
    page-description="Số dư, dòng tiền và giao dịch — cập nhật 5 phút."
  >
    <template #actions>
      <BaseButton variant="ghost" size="sm">Xuất báo cáo</BaseButton>
      <BaseButton size="sm">Tạo phiếu</BaseButton>
    </template>

    <div class="balance-row">
      <BaseCard padded shadow="md" radius="xl">
        <div class="bal-main">
          <div class="bal-label">Tổng số dư</div>
          <div class="bal-value">6.582 triệu ₫</div>
          <div class="bal-meta">
            <BaseTag size="sm" variant="success" label="+3.2% so với tuần trước" />
            <span class="muted">cập nhật 12:34 hôm nay</span>
          </div>
          <svg class="bal-spark" viewBox="0 0 600 60" preserveAspectRatio="none">
            <path :d="sparkArea([...seriesUp, ...seriesUp], 600, 60, 4)" fill="rgba(37,99,235,0.18)" />
            <path :d="sparkPath([...seriesUp, ...seriesUp], 600, 60, 4)" stroke="#2563eb" stroke-width="1.5" fill="none" />
          </svg>
        </div>
      </BaseCard>
    </div>

    <div class="cols-3" v-reveal>
      <BaseCard title="Doanh thu tháng" padded shadow="sm">
        <div class="kpi">820 tr</div>
        <BaseTag size="sm" variant="success" label="+18%" />
        <svg class="spark-h" viewBox="0 0 100 32"><path :d="sparkPath([...seriesUp])" stroke="#10b981" stroke-width="1.5" fill="none" /></svg>
      </BaseCard>
      <BaseCard title="Chi phí tháng" padded shadow="sm">
        <div class="kpi">462 tr</div>
        <BaseTag size="sm" variant="warning" label="+4%" />
        <svg class="spark-h" viewBox="0 0 100 32"><path :d="sparkPath([...seriesVolatile])" stroke="#f59e0b" stroke-width="1.5" fill="none" /></svg>
      </BaseCard>
      <BaseCard title="Lợi nhuận ròng" padded shadow="sm">
        <div class="kpi">358 tr</div>
        <BaseTag size="sm" variant="success" label="44% biên" />
        <svg class="spark-h" viewBox="0 0 100 32"><path :d="sparkPath([...seriesUp])" stroke="#2563eb" stroke-width="1.5" fill="none" /></svg>
      </BaseCard>
    </div>

    <div class="cols" v-reveal>
      <BasePanel title="Tài khoản ngân hàng">
        <ul class="accs">
          <li v-for="a in accounts" :key="a.name" class="acc-row">
            <div class="acc-info">
              <strong>{{ a.name }}</strong>
              <div class="muted small">{{ a.bank }}</div>
            </div>
            <div class="acc-balance">
              <strong>{{ a.balance }}</strong>
              <BaseTag
                :variant="a.delta.startsWith('+') ? 'success' : a.delta.startsWith('-') ? 'danger' : 'neutral'"
                :label="a.delta"
                size="sm"
              />
            </div>
          </li>
        </ul>
      </BasePanel>

      <BasePanel title="Giao dịch gần đây">
        <ul class="tx-list">
          <li v-for="(t, i) in tx" :key="i" class="tx-row">
            <span class="muted small">{{ t.date }}</span>
            <span>{{ t.desc }}</span>
            <BaseTag size="sm" :label="t.cat" />
            <strong :class="{ neg: t.amount.startsWith('-'), pos: t.amount.startsWith('+') }">{{ t.amount }}</strong>
          </li>
        </ul>
      </BasePanel>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.balance-row > * { width: 100%; }
.bal-main { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.bal-label { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.bal-value {
  font-size: var(--wx-fs-40);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
  background: var(--wx-gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.bal-meta { display: flex; align-items: center; gap: var(--wx-space-2); font-size: var(--wx-fs-12); }
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }
.bal-spark { width: 100%; height: 60px; margin-top: var(--wx-space-2); }

.cols-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--wx-space-3);
}
@media (max-width: 880px) { .cols-3 { grid-template-columns: 1fr; } }
.kpi { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-bold); margin-top: 4px; }
.spark-h { width: 100%; height: 32px; margin-top: var(--wx-space-2); }

.cols { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-4); }
@media (max-width: 960px) { .cols { grid-template-columns: 1fr; } }

.accs { list-style: none; margin: 0; padding: 0; }
.acc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--wx-space-2) 0;
  border-bottom: 1px solid var(--wx-border-subtle);
}
.acc-row:last-child { border-bottom: none; }
.acc-info { display: flex; flex-direction: column; }
.acc-balance { display: flex; align-items: center; gap: var(--wx-space-2); }

.tx-list { list-style: none; margin: 0; padding: 0; }
.tx-row {
  display: grid;
  grid-template-columns: 50px 1fr auto auto;
  gap: var(--wx-space-2);
  align-items: center;
  padding: var(--wx-space-2) 0;
  border-bottom: 1px solid var(--wx-border-subtle);
  font-size: var(--wx-fs-13);
}
.pos { color: var(--wx-success-text); }
.neg { color: var(--wx-danger-text); }
</style>
