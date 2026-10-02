<script setup lang="ts">
/**
 * app/pricing — màn "Gói cước & Bảng giá" kiểu workspace:
 *  thanh điều hướng 3 tab (Mua gói · Quản lý gói cước · Lịch sử giao dịch) + stepper 3 bước
 *  (Lựa chọn → Xác nhận → Chờ duyệt), lưới gói chọn được, giỏ hàng bên phải.
 *
 * Bố cục lấy từ trang Pricing của MindAds. Toàn bộ là MOCK tĩnh — không checkout, không API.
 */
import { computed, ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseToggle } from '../../components/common'

type TabId = 'buy' | 'subscriptions' | 'transactions'
type Step = 1 | 2 | 3

const ic = (paths: string) =>
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'buy', label: 'Mua gói', icon: ic('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>') },
  { id: 'subscriptions', label: 'Quản lý gói cước', icon: ic('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>') },
  { id: 'transactions', label: 'Lịch sử giao dịch', icon: ic('<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/>') },
]
const STEPS: { num: Step; label: string }[] = [
  { num: 1, label: 'Lựa chọn' },
  { num: 2, label: 'Xác nhận' },
  { num: 3, label: 'Chờ duyệt' },
]

const tab = ref<TabId>('buy')
const step = ref<Step>(1)
const annual = ref(false)
const selectedKey = ref<string>('pro')

interface Plan {
  key: string
  name: string
  price: number
  priceAnnual: number
  desc: string
  badge?: string
  features: string[]
  cta: string
}
const plans: Plan[] = [
  { key: 'free', name: 'Miễn phí', price: 0, priceAnnual: 0, desc: 'Cho cá nhân và dự án nhỏ', features: ['5 dự án', '1 GB lưu trữ', 'Cơ bản components', 'Hỗ trợ qua email'], cta: 'Chọn gói' },
  { key: 'pro', name: 'Pro', price: 199000, priceAnnual: 159000, desc: 'Cho nhóm nhỏ và startups', badge: 'Phổ biến nhất', features: ['Không giới hạn dự án', '50 GB lưu trữ', 'Tất cả components', 'Priority support', 'Custom domain', 'Analytics nâng cao'], cta: 'Chọn gói' },
  { key: 'enterprise', name: 'Enterprise', price: 999000, priceAnnual: 799000, desc: 'Cho doanh nghiệp lớn', features: ['Tất cả tính năng Pro', 'SSO / SAML', 'SLA 99.99%', 'Dedicated support', 'On-premise option', 'Custom contract'], cta: 'Chọn gói' },
]

const selected = computed(() => plans.find((p) => p.key === selectedKey.value) ?? plans[0]!)
const unitPrice = computed(() => (annual.value ? selected.value.priceAnnual : selected.value.price))
const months = computed(() => (annual.value ? 12 : 1))
const subtotal = computed(() => selected.value.price * months.value)
const total = computed(() => unitPrice.value * months.value)
const discount = computed(() => subtotal.value - total.value)
const money = (n: number) => `${n.toLocaleString('vi-VN')}đ`

function next() { if (step.value < 3) step.value = (step.value + 1) as Step }
function back() { if (step.value > 1) step.value = (step.value - 1) as Step }
function reset() { step.value = 1 }

const subscriptions = [
  { id: 'SUB-2041', plan: 'Pro', cycle: 'Hàng tháng', status: 'active', renews: '14/11/2026', seats: '8 / 10 phiên' },
  { id: 'SUB-1877', plan: 'Add-on Analytics', cycle: 'Hàng năm', status: 'active', renews: '02/03/2027', seats: '—' },
  { id: 'SUB-1530', plan: 'Miễn phí', cycle: '—', status: 'ended', renews: '—', seats: '—' },
]
const transactions = [
  { id: 'TXN-90421', date: '14/10/2026', desc: 'Gói Pro — tháng 10', amount: '199.000đ', status: 'paid' },
  { id: 'TXN-90102', date: '14/09/2026', desc: 'Gói Pro — tháng 09', amount: '199.000đ', status: 'paid' },
  { id: 'TXN-88713', date: '02/03/2026', desc: 'Add-on Analytics — năm', amount: '1.490.000đ', status: 'paid' },
  { id: 'TXN-88001', date: '14/02/2026', desc: 'Gói Pro — tháng 02', amount: '199.000đ', status: 'refunded' },
]
const STATUS: Record<string, { label: string; tone: string }> = {
  active: { label: 'Đang hoạt động', tone: 'success' },
  ended: { label: 'Đã kết thúc', tone: 'neutral' },
  paid: { label: 'Đã thanh toán', tone: 'success' },
  refunded: { label: 'Đã hoàn tiền', tone: 'warning' },
}

const faqs = [
  { q: 'Có thể đổi gói bất cứ lúc nào không?', a: 'Có, bạn có thể nâng hoặc hạ gói bất kỳ lúc nào. Khi nâng, phần chênh lệch được tính theo ngày còn lại.' },
  { q: 'Có hoàn tiền không?', a: 'Có, trong vòng 30 ngày đầu tiên nếu bạn không hài lòng.' },
  { q: 'Thanh toán bằng gì?', a: 'Thẻ Visa/MasterCard, chuyển khoản ngân hàng, và ví điện tử MoMo, ZaloPay.' },
]
</script>

<template>
  <AppPageLayout section="app" current="gói dịch vụ" page-title="Gói dịch vụ" page-description="Chọn gói phù hợp với quy mô của bạn">
    <div class="pw">
      <!-- ── Thanh điều hướng workspace: tab + stepper + tư vấn ── -->
      <nav class="pw__nav" aria-label="Điều hướng gói cước">
        <div class="pw__tabs" role="tablist">
          <button
            v-for="t in TABS"
            :key="t.id"
            type="button"
            role="tab"
            class="pw__tab"
            :class="{ 'is-active': tab === t.id }"
            :aria-selected="tab === t.id"
            @click="tab = t.id"
          >
            <span aria-hidden="true" v-html="t.icon" />
            {{ t.label }}
            <span v-if="t.id === 'subscriptions'" class="pw__count">{{ subscriptions.filter(s => s.status === 'active').length }}</span>
          </button>
        </div>

        <div class="pw__nav-right">
          <ol v-if="tab === 'buy'" class="pw__stepper" aria-label="Tiến trình mua gói">
            <template v-for="(s, i) in STEPS" :key="s.num">
              <li class="pw__step" :class="{ 'is-current': step === s.num, 'is-done': step > s.num }">
                <span class="pw__step-dot">
                  <svg v-if="step > s.num" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  <template v-else>{{ s.num }}</template>
                </span>
                <span class="pw__step-label">{{ s.label }}</span>
              </li>
              <li v-if="i < STEPS.length - 1" class="pw__step-line" :class="{ 'is-done': step > s.num }" aria-hidden="true" />
            </template>
          </ol>
          <button type="button" class="pw__help">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            Tư vấn 1-1
          </button>
        </div>
      </nav>

      <!-- ══ Tab: Mua gói ══ -->
      <div v-if="tab === 'buy'" class="pw__buy">
        <section class="pw__main">
          <!-- Bước 1 -->
          <template v-if="step === 1">
            <div class="pw__lead">
              <h2 class="pw__h">Chọn gói phù hợp với nhu cầu của bạn</h2>
              <p class="pw__p">Bạn có thể bổ sung hoặc nâng cấp bất kỳ lúc nào.</p>
            </div>

            <div class="pw__billing">
              <span :class="{ 'is-muted': annual }">Thanh toán tháng</span>
              <BaseToggle v-model="annual" />
              <span :class="{ 'is-muted': !annual }">Thanh toán năm</span>
              <BaseBadge v-if="annual" text="tiết kiệm 20%" variant="success" />
            </div>

            <div class="pw__grid" role="radiogroup" aria-label="Chọn gói">
              <button
                v-for="p in plans"
                :key="p.key"
                type="button"
                role="radio"
                class="pw__plan"
                :class="{ 'is-selected': selectedKey === p.key, 'is-popular': !!p.badge }"
                :aria-checked="selectedKey === p.key"
                @click="selectedKey = p.key"
              >
                <span v-if="p.badge" class="pw__ribbon">{{ p.badge }}</span>
                <span class="pw__plan-top">
                  <span class="pw__plan-name">{{ p.name }}</span>
                  <span class="pw__radio" :class="{ 'is-on': selectedKey === p.key }" aria-hidden="true" />
                </span>
                <span class="pw__plan-price">
                  <span class="pw__amount">{{ p.price > 0 ? money(annual ? p.priceAnnual : p.price) : 'Miễn phí' }}</span>
                  <span v-if="p.price > 0" class="pw__period">/ tháng</span>
                </span>
                <span class="pw__plan-desc">{{ p.desc }}</span>
                <span class="pw__feats">
                  <span v-for="f in p.features" :key="f" class="pw__feat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ f }}
                  </span>
                </span>
              </button>
            </div>
          </template>

          <!-- Bước 2 -->
          <div v-else-if="step === 2" class="pw__confirm">
            <h2 class="pw__h">Xác nhận đơn hàng</h2>
            <p class="pw__p">Kiểm tra lại thông tin trước khi gửi yêu cầu.</p>
            <dl class="pw__dl">
              <div><dt>Gói</dt><dd>{{ selected.name }}</dd></div>
              <div><dt>Chu kỳ</dt><dd>{{ annual ? 'Hàng năm (12 tháng)' : 'Hàng tháng' }}</dd></div>
              <div><dt>Phương thức</dt><dd>Chuyển khoản ngân hàng</dd></div>
              <div><dt>Thành tiền</dt><dd class="is-strong">{{ money(total) }}</dd></div>
            </dl>
            <div class="pw__actions">
              <BaseButton variant="ghost" @click="back">← Quay lại</BaseButton>
              <BaseButton @click="next">Gửi yêu cầu</BaseButton>
            </div>
          </div>

          <!-- Bước 3 -->
          <div v-else class="pw__done">
            <span class="pw__done-ic" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <h2 class="pw__h">Yêu cầu đã được gửi — chờ duyệt</h2>
            <p class="pw__p">Mã đơn <strong>ORD-{{ selected.key.toUpperCase() }}-7741</strong>. Chúng tôi sẽ kích hoạt gói trong vòng 24 giờ sau khi nhận thanh toán.</p>
            <BaseButton variant="secondary" @click="reset">Mua gói khác</BaseButton>
          </div>

          <!-- FAQ -->
          <div v-if="step === 1" class="pw__faq">
            <h3 class="pw__faq-title">Câu hỏi thường gặp</h3>
            <div class="pw__faq-list">
              <div v-for="f in faqs" :key="f.q" class="pw__faq-item">
                <p class="pw__faq-q">{{ f.q }}</p>
                <p class="pw__faq-a">{{ f.a }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Giỏ hàng -->
        <aside class="pw__cart" aria-label="Giỏ hàng">
          <header class="pw__cart-head">
            <span class="pw__cart-ic" aria-hidden="true" v-html="TABS[0]!.icon" />
            <span>
              <strong>Giỏ hàng</strong>
              <small>1 gói được chọn</small>
            </span>
          </header>
          <div class="pw__cart-body">
            <div class="pw__line">
              <span><strong>{{ selected.name }}</strong><small>{{ annual ? 'Hàng năm' : 'Hàng tháng' }}</small></span>
              <span class="pw__line-price">{{ money(subtotal) }}</span>
            </div>
            <div v-if="discount > 0" class="pw__line pw__line--discount">
              <span>Ưu đãi thanh toán năm</span>
              <span>−{{ money(discount) }}</span>
            </div>
            <div class="pw__total"><span>Tổng cộng</span><strong>{{ money(total) }}</strong></div>
          </div>
          <footer class="pw__cart-foot">
            <BaseButton v-if="step === 1" block :disabled="selected.price === 0" @click="next">
              {{ selected.price === 0 ? 'Gói miễn phí — không cần thanh toán' : 'Tiếp tục' }}
            </BaseButton>
            <p v-else class="pw__cart-note">Bước {{ step }}/3 — {{ STEPS[step - 1]!.label }}</p>
          </footer>
        </aside>
      </div>

      <!-- ══ Tab: Quản lý gói cước ══ -->
      <section v-else-if="tab === 'subscriptions'" class="pw__panel">
        <h2 class="pw__h">Gói cước của bạn</h2>
        <div class="pw__table-wrap">
          <table class="pw__table">
            <thead><tr><th>Mã</th><th>Gói</th><th>Chu kỳ</th><th>Trạng thái</th><th>Gia hạn</th><th>Phiên</th></tr></thead>
            <tbody>
              <tr v-for="s in subscriptions" :key="s.id">
                <td class="is-mono">{{ s.id }}</td>
                <td class="is-strong">{{ s.plan }}</td>
                <td>{{ s.cycle }}</td>
                <td><span class="pw__pill" :data-tone="STATUS[s.status]!.tone">{{ STATUS[s.status]!.label }}</span></td>
                <td>{{ s.renews }}</td>
                <td>{{ s.seats }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ══ Tab: Lịch sử giao dịch ══ -->
      <section v-else class="pw__panel">
        <h2 class="pw__h">Lịch sử giao dịch</h2>
        <div class="pw__table-wrap">
          <table class="pw__table">
            <thead><tr><th>Mã</th><th>Ngày</th><th>Nội dung</th><th class="is-right">Số tiền</th><th>Trạng thái</th></tr></thead>
            <tbody>
              <tr v-for="t in transactions" :key="t.id">
                <td class="is-mono">{{ t.id }}</td>
                <td>{{ t.date }}</td>
                <td>{{ t.desc }}</td>
                <td class="is-right is-strong">{{ t.amount }}</td>
                <td><span class="pw__pill" :data-tone="STATUS[t.status]!.tone">{{ STATUS[t.status]!.label }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.pw { display: flex; flex-direction: column; gap: var(--wx-space-5); }

/* ── nav ── */
.pw__nav { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--wx-space-3); padding: var(--wx-space-2) var(--wx-space-3); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); background: var(--wx-surface-base); box-shadow: var(--wx-shadow-sm); }
.pw__tabs { display: inline-flex; padding: 4px; gap: 2px; border-radius: var(--wx-radius-lg); background: var(--wx-surface-sunken); }
.pw__tab { display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; border: 0; border-radius: var(--wx-radius-md); background: transparent; color: var(--wx-content-secondary); font: inherit; font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); cursor: pointer; transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard); }
.pw__tab:hover { color: var(--wx-content-primary); }
.pw__tab.is-active { background: var(--wx-surface-base); color: var(--wx-brand-primary); font-weight: var(--wx-fw-bold); box-shadow: var(--wx-shadow-sm); }
.pw__tab:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 1px; }
.pw__count { min-width: 18px; padding: 0 6px; border-radius: var(--wx-radius-full); background: var(--wx-shell-tone-brand-bg); color: var(--wx-shell-tone-brand-fg); font-size: 11px; font-weight: var(--wx-fw-bold); text-align: center; line-height: 18px; }
.pw__nav-right { display: flex; align-items: center; gap: var(--wx-space-4); }
.pw__stepper { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: var(--wx-space-2); }
.pw__step { display: inline-flex; align-items: center; gap: 8px; color: var(--wx-content-muted); font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); white-space: nowrap; }
.pw__step-dot { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; border: 1px solid var(--wx-border-default); background: var(--wx-surface-base); font-size: 11px; font-weight: var(--wx-fw-bold); }
.pw__step.is-current { color: var(--wx-brand-primary); font-weight: var(--wx-fw-bold); }
.pw__step.is-current .pw__step-dot { background: var(--wx-brand-600); border-color: transparent; color: var(--wx-text-on-brand); }
.pw__step.is-done { color: var(--wx-content-secondary); }
.pw__step.is-done .pw__step-dot { background: var(--wx-success-solid); border-color: transparent; color: var(--wx-text-on-brand); }
.pw__step-line { width: 24px; height: 2px; border-radius: 2px; background: var(--wx-border-default); }
.pw__step-line.is-done { background: var(--wx-success-solid); }
.pw__help { display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; border: 1px solid var(--wx-shell-tone-brand-bd); border-radius: var(--wx-radius-lg); background: var(--wx-shell-tone-brand-bg); color: var(--wx-shell-tone-brand-fg); font: inherit; font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); cursor: pointer; transition: filter var(--wx-d-fast) var(--wx-ease-standard); }
.pw__help:hover { filter: brightness(0.97); }
.pw__help:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }

/* ── buy layout ── */
.pw__buy { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: var(--wx-space-5); align-items: start; }
.pw__main { min-width: 0; display: flex; flex-direction: column; gap: var(--wx-space-5); }
.pw__lead { display: flex; flex-direction: column; gap: 2px; }
.pw__h { margin: 0; font-size: var(--wx-fs-18); font-weight: var(--wx-fw-bold); letter-spacing: var(--wx-tracking-tight); }
.pw__p { margin: 0; font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.pw__billing { display: flex; align-items: center; gap: var(--wx-space-3); font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); }
.is-muted { color: var(--wx-content-muted); }

.pw__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--wx-space-4); }
.pw__plan { position: relative; display: flex; flex-direction: column; gap: var(--wx-space-2); padding: var(--wx-space-5) var(--wx-space-4) var(--wx-space-4); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); background: var(--wx-surface-base); color: inherit; font: inherit; text-align: left; cursor: pointer; transition: border-color var(--wx-d-fast) var(--wx-ease-standard), box-shadow var(--wx-d-fast) var(--wx-ease-standard), transform var(--wx-d-normal) var(--wx-ease-bounce), background var(--wx-d-fast) var(--wx-ease-standard); }
.pw__plan:hover { border-color: var(--wx-brand-300); transform: translateY(-2px); box-shadow: var(--wx-shadow-md); }
.pw__plan.is-selected { border-width: 2px; padding: calc(var(--wx-space-5) - 1px) calc(var(--wx-space-4) - 1px) calc(var(--wx-space-4) - 1px); border-color: var(--wx-brand-primary); background: var(--wx-shell-tone-brand-bg); box-shadow: var(--wx-shadow-brand); }
.pw__plan:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }
.pw__ribbon { position: absolute; top: -11px; left: var(--wx-space-4); padding: 3px 12px; border-radius: var(--wx-radius-full); background: var(--wx-shell-grad-solid); color: var(--wx-text-on-brand); font-size: 10.5px; font-weight: var(--wx-fw-bold); letter-spacing: 0.04em; text-transform: uppercase; box-shadow: var(--wx-shadow-brand); }
.pw__plan-top { display: flex; align-items: center; justify-content: space-between; }
.pw__plan-name { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-bold); }
.pw__radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--wx-border-default); background: var(--wx-surface-base); transition: border-color var(--wx-d-fast) var(--wx-ease-standard); }
.pw__radio.is-on { border-color: var(--wx-brand-primary); background: radial-gradient(circle, var(--wx-brand-primary) 40%, transparent 44%); }
.pw__plan-price { display: flex; align-items: baseline; gap: 6px; margin-top: var(--wx-space-1); }
.pw__amount { font-size: var(--wx-fs-24); font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; color: var(--wx-brand-primary); }
.pw__period { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.pw__plan-desc { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.pw__feats { display: flex; flex-direction: column; gap: 8px; margin-top: var(--wx-space-2); padding-top: var(--wx-space-3); border-top: 1px solid var(--wx-border-subtle); }
.pw__feat { display: flex; align-items: flex-start; gap: 8px; font-size: var(--wx-fs-13); line-height: 1.45; color: var(--wx-content-secondary); }
.pw__feat svg { flex-shrink: 0; margin-top: 3px; color: var(--wx-success-solid); }

/* confirm / done */
.pw__confirm, .pw__done { display: flex; flex-direction: column; gap: var(--wx-space-3); padding: var(--wx-space-5); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); background: var(--wx-surface-base); }
.pw__done { align-items: center; text-align: center; padding: var(--wx-space-7) var(--wx-space-5); }
.pw__done-ic { display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 20px; background: var(--wx-shell-tone-warning-bg); color: var(--wx-shell-tone-warning-fg); border: 1px solid var(--wx-shell-tone-warning-bd); }
.pw__dl { margin: var(--wx-space-2) 0 0; display: flex; flex-direction: column; }
.pw__dl > div { display: flex; justify-content: space-between; gap: var(--wx-space-3); padding: 10px 0; border-bottom: 1px solid var(--wx-border-subtle); font-size: var(--wx-fs-14); }
.pw__dl dt { color: var(--wx-content-muted); }
.pw__dl dd { margin: 0; font-weight: var(--wx-fw-semibold); }
.pw__dl .is-strong { color: var(--wx-brand-primary); font-size: var(--wx-fs-16); font-weight: var(--wx-fw-bold); }
.pw__actions { display: flex; justify-content: space-between; gap: var(--wx-space-3); margin-top: var(--wx-space-3); }

/* cart */
.pw__cart { position: sticky; top: var(--wx-space-3); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); background: var(--wx-surface-base); box-shadow: var(--wx-shadow-md); overflow: hidden; }
.pw__cart-head { display: flex; align-items: center; gap: var(--wx-space-3); padding: 12px var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); background: var(--wx-shell-panel-head-bg); }
.pw__cart-ic { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 10px; background: var(--wx-shell-tile-gradient); color: var(--wx-text-on-brand); box-shadow: var(--wx-shell-tile-shadow); }
.pw__cart-head strong { display: block; font-size: var(--wx-fs-14); }
.pw__cart-head small, .pw__line small { display: block; font-size: 11.5px; color: var(--wx-content-muted); }
.pw__cart-body { padding: var(--wx-space-4); display: flex; flex-direction: column; gap: var(--wx-space-3); }
.pw__line { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--wx-space-3); font-size: var(--wx-fs-14); }
.pw__line-price { font-weight: var(--wx-fw-semibold); font-variant-numeric: tabular-nums; }
.pw__line--discount { color: var(--wx-success-text); font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); }
.pw__total { display: flex; align-items: baseline; justify-content: space-between; margin-top: var(--wx-space-1); padding-top: var(--wx-space-3); border-top: 1px dashed var(--wx-border-default); }
.pw__total span { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.pw__total strong { font-size: var(--wx-fs-24); font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.pw__cart-foot { padding: var(--wx-space-3) var(--wx-space-4) var(--wx-space-4); }
.pw__cart-note { margin: 0; text-align: center; font-size: var(--wx-fs-12); color: var(--wx-content-muted); }

/* faq */
.pw__faq-title { margin: 0 0 var(--wx-space-3); font-size: var(--wx-fs-16); font-weight: var(--wx-fw-bold); }
.pw__faq-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.pw__faq-item { padding: var(--wx-space-4); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-lg); border: 1px solid var(--wx-border-subtle); }
.pw__faq-q { margin: 0 0 var(--wx-space-1); font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); }
.pw__faq-a { margin: 0; font-size: var(--wx-fs-13); line-height: var(--wx-lh-relaxed); color: var(--wx-content-secondary); }

/* tables */
.pw__panel { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.pw__table-wrap { border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); overflow-x: auto; background: var(--wx-surface-base); }
.pw__table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.pw__table th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: var(--wx-fw-bold); letter-spacing: 0.05em; text-transform: uppercase; color: var(--wx-content-muted); background: var(--wx-surface-sunken); border-bottom: 1px solid var(--wx-border-default); white-space: nowrap; }
.pw__table td { padding: 12px 14px; border-bottom: 1px solid var(--wx-border-subtle); white-space: nowrap; }
.pw__table tr:last-child td { border-bottom: 0; }
.pw__table tbody tr:hover { background: var(--wx-hover-bg); }
.is-mono { font-family: var(--wx-font-mono); font-size: 12px; color: var(--wx-content-secondary); }
.is-strong { font-weight: var(--wx-fw-semibold); }
.is-right { text-align: right !important; }
.pw__pill { display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px; border-radius: var(--wx-radius-full); font-size: 11.5px; font-weight: var(--wx-fw-bold); }
.pw__pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.pw__pill[data-tone='success'] { background: var(--wx-success-bg); color: var(--wx-success-text); }
.pw__pill[data-tone='warning'] { background: var(--wx-warning-bg); color: var(--wx-warning-text); }
.pw__pill[data-tone='neutral'] { background: var(--wx-neutral-bg); color: var(--wx-neutral-text); }

@media (max-width: 1100px) { .pw__buy { grid-template-columns: 1fr; } .pw__cart { position: static; } }
@media (max-width: 860px) { .pw__grid { grid-template-columns: 1fr; } .pw__nav-right { width: 100%; justify-content: space-between; } }
@media (max-width: 560px) { .pw__step-label { display: none; } .pw__tab { padding: 0 10px; } }
@media (prefers-reduced-motion: reduce) { .pw__plan { transition: none; } }
</style>
