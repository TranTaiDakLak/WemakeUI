<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseCard, BaseToggle } from '../../components/common'

const annual = ref(false)

const plans = [
  {
    name: 'Miễn phí', price: 0, priceAnnual: 0, color: 'neutral',
    desc: 'Cho cá nhân và dự án nhỏ',
    features: ['5 dự án', '1 GB lưu trữ', 'Cơ bản components', 'Hỗ trợ qua email'],
    cta: 'Bắt đầu miễn phí', ctaVariant: 'secondary' as const,
  },
  {
    name: 'Pro', price: 199000, priceAnnual: 159000, color: 'primary',
    desc: 'Cho nhóm nhỏ và startups', badge: 'Phổ biến nhất',
    features: ['Không giới hạn dự án', '50 GB lưu trữ', 'Tất cả components', 'Priority support', 'Custom domain', 'Analytics nâng cao'],
    cta: 'Dùng thử 14 ngày', ctaVariant: 'primary' as const,
  },
  {
    name: 'Enterprise', price: 999000, priceAnnual: 799000, color: 'neutral',
    desc: 'Cho doanh nghiệp lớn',
    features: ['Tất cả tính năng Pro', 'SSO / SAML', 'SLA 99.99%', 'Dedicated support', 'On-premise option', 'Custom contract'],
    cta: 'Liên hệ tư vấn', ctaVariant: 'secondary' as const,
  },
]

const faqs = [
  { q: 'Có thể đổi gói bất cứ lúc nào không?', a: 'Có, bạn có thể nâng hoặc hạ gói bất kỳ lúc nào. Khi nâng, phần chênh lệch được tính theo ngày còn lại.' },
  { q: 'Có hoàn tiền không?', a: 'Có, trong vòng 30 ngày đầu tiên nếu bạn không hài lòng.' },
  { q: 'Thanh toán bằng gì?', a: 'Thẻ Visa/MasterCard, chuyển khoản ngân hàng, và ví điện tử MoMo, ZaloPay.' },
]
</script>

<template>
  <AppPageLayout section="app" current="gói dịch vụ" page-title="Gói dịch vụ" page-description="Chọn gói phù hợp với quy mô của bạn">
    <div class="pricing-wrap">
      <div class="billing-toggle">
        <span :class="{ muted: annual }">Thanh toán tháng</span>
        <BaseToggle v-model="annual" />
        <span :class="{ muted: !annual }">Thanh toán năm</span>
        <BaseBadge v-if="annual" text="tiết kiệm 20%" variant="success" />
      </div>

      <div class="plans-grid">
        <BaseCard v-for="p in plans" :key="p.name" class="plan-card" :class="{ popular: p.badge }">
          <template #header>
            <div class="plan-head">
              <span class="plan-name">{{ p.name }}</span>
              <BaseBadge v-if="p.badge" :text="p.badge" variant="primary" />
            </div>
          </template>
          <template #body>
            <div class="plan-price">
              <span v-if="p.price > 0" class="price-num">
                {{ (annual ? p.priceAnnual : p.price).toLocaleString('vi-VN') }}đ
              </span>
              <span v-else class="price-num">Miễn phí</span>
              <span v-if="p.price > 0" class="price-period">/ tháng</span>
            </div>
            <p class="plan-desc">{{ p.desc }}</p>
            <ul class="features">
              <li v-for="f in p.features" :key="f" class="feature-item">
                <span class="check">✓</span> {{ f }}
              </li>
            </ul>
          </template>
          <template #footer>
            <BaseButton :variant="p.ctaVariant" block>{{ p.cta }}</BaseButton>
          </template>
        </BaseCard>
      </div>

      <div class="faq-section">
        <h2 class="faq-title">Câu hỏi thường gặp</h2>
        <div class="faqs">
          <div v-for="f in faqs" :key="f.q" class="faq-item">
            <p class="faq-q">{{ f.q }}</p>
            <p class="faq-a">{{ f.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.pricing-wrap { display: flex; flex-direction: column; gap: var(--wx-space-7); align-items: center; }
.billing-toggle { display: flex; align-items: center; gap: var(--wx-space-3); font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); }
.muted { color: var(--wx-content-muted); }

.plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--wx-space-5); width: 100%; max-width: 900px; align-items: start; }
@media (max-width: 768px) { .plans-grid { grid-template-columns: 1fr; } }

.plan-card { transition: transform var(--wx-d-normal) var(--wx-ease-standard); }
.plan-card.popular { border-color: var(--wx-brand-400); box-shadow: var(--wx-shadow-brand); transform: scale(1.02); }

.plan-head { display: flex; align-items: center; justify-content: space-between; }
.plan-name { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-bold); }
.plan-price { margin-bottom: var(--wx-space-3); }
.price-num { font-size: var(--wx-fs-32); font-weight: 800; letter-spacing: var(--wx-tracking-tight); }
.price-period { font-size: var(--wx-fs-14); color: var(--wx-content-muted); margin-left: 4px; }
.plan-desc { font-size: var(--wx-fs-14); color: var(--wx-content-muted); margin-bottom: var(--wx-space-4); }

.features { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--wx-space-2); }
.feature-item { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); display: flex; gap: var(--wx-space-2); }
.check { color: var(--wx-status-success-text); font-weight: var(--wx-fw-bold); }

.faq-section { width: 100%; max-width: 700px; }
.faq-title { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-semibold); text-align: center; margin-bottom: var(--wx-space-5); letter-spacing: var(--wx-tracking-tight); }
.faqs { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.faq-item { padding: var(--wx-space-4); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-lg); }
.faq-q { font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); margin: 0 0 var(--wx-space-2); }
.faq-a { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); margin: 0; line-height: var(--wx-lh-relaxed); }
</style>
