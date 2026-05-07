<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarketingHeader from '@/archetypes/marketing/MarketingHeader.vue'
import { RouterLink } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useStagger } from '@/composables/useStagger'

const stagger = useStagger(60)
const gridRef = ref<HTMLElement | null>(null)
const { revealed, observe } = useScrollReveal()
onMounted(() => { if (gridRef.value) observe(gridRef.value) })

const PARTNERS = [
  { name: 'Viettel', logo: '🔵', field: 'Viễn thông', desc: 'Tích hợp hệ thống SMS, OTP và thông báo dịch vụ cho 110M thuê bao.', tags: ['SMS', 'Enterprise', 'Telco'] },
  { name: 'VNPT', logo: '🟡', field: 'Viễn thông', desc: 'Đối tác chiến lược cho giải pháp cloud và messaging tại Việt Nam.', tags: ['Cloud', 'Messaging', 'B2B'] },
  { name: 'Shopee VN', logo: '🟠', field: 'Thương mại điện tử', desc: 'Tự động hóa chat hỗ trợ khách hàng trên WhatsApp và Zalo.', tags: ['E-commerce', 'WhatsApp', 'Zalo'] },
  { name: 'MoMo', logo: '🩷', field: 'Fintech', desc: 'Campaign retention và OTP authentication cho 30M+ người dùng.', tags: ['Fintech', 'Campaign', 'OTP'] },
  { name: 'VNPay', logo: '🔴', field: 'Thanh toán', desc: 'Thông báo giao dịch thời gian thực qua đa kênh.', tags: ['Payment', 'Realtime', 'Banking'] },
  { name: 'FPT Telecom', logo: '🟠', field: 'ISP / Công nghệ', desc: 'Hệ thống chăm sóc khách hàng tự động đa kênh.', tags: ['ISP', 'CX', 'Automation'] },
]
</script>

<template>
  <div class="partners-page">
    <MarketingHeader />

    <main>
      <div class="partners-hero">
        <h1 class="partners-hero__title">Đối tác của Wemake</h1>
        <p class="partners-hero__sub">Chúng tôi hợp tác với các doanh nghiệp hàng đầu Việt Nam để mang lại giải pháp tốt nhất.</p>
      </div>

      <div class="partners-container">
        <div ref="gridRef" class="partners-grid">
          <div
            v-for="(p, i) in PARTNERS"
            :key="p.name"
            class="partner-card wx-reveal"
            :class="{ 'is-revealed': revealed }"
            :style="stagger(i)"
          >
            <div class="partner-card__head">
              <span class="partner-card__logo">{{ p.logo }}</span>
              <div>
                <span class="partner-card__field">{{ p.field }}</span>
                <h3 class="partner-card__name">{{ p.name }}</h3>
              </div>
            </div>
            <p class="partner-card__desc">{{ p.desc }}</p>
            <div class="partner-card__tags">
              <span v-for="tag in p.tags" :key="tag" class="partner-tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- become a partner -->
        <div class="partner-join">
          <h2 class="partner-join__title">Trở thành đối tác của Wemake</h2>
          <p class="partner-join__sub">Cùng xây dựng hệ sinh thái tự động hóa đa kênh mạnh mẽ nhất Đông Nam Á.</p>
          <RouterLink to="/contact" class="partner-join__btn">Đăng ký hợp tác</RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.partners-page { min-height: 100vh; padding-top: 64px; background: var(--wx-surface-base); }

.partners-hero {
  text-align: center;
  padding: 120px var(--wx-space-6) var(--wx-space-16);
  background: linear-gradient(160deg, var(--wx-surface) 0%, color-mix(in srgb, var(--wx-primary) 4%, var(--wx-surface)) 100%);
}
.partners-hero__title {
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--wx-text-primary);
  margin: 0 0 var(--wx-space-4);
}
.partners-hero__sub { font-size: var(--wx-text-lg); color: var(--wx-text-secondary); max-width: 560px; margin: 0 auto; line-height: 1.7; }

.partners-container { max-width: 1200px; margin: 0 auto; padding: 0 var(--wx-space-6) var(--wx-space-20); }
.partners-grid {
  display: grid;
  gap: var(--wx-space-5);
  margin-bottom: var(--wx-space-16);
}
@media (min-width: 640px)  { .partners-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .partners-grid { grid-template-columns: repeat(3, 1fr); } }

.partner-card {
  padding: var(--wx-space-6);
  background: var(--wx-surface-raised);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-2xl);
  display: flex; flex-direction: column; gap: var(--wx-space-4);
  transition: all var(--wx-d-normal);
}
.partner-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.08); transform: translateY(-4px); }
.partner-card__head { display: flex; align-items: center; gap: var(--wx-space-3); }
.partner-card__logo {
  width: 52px; height: 52px;
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-elevated);
  font-size: 26px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.partner-card__field {
  font-size: var(--wx-text-xs);
  font-weight: 500; text-transform: uppercase;
  letter-spacing: 0.05em; color: var(--wx-text-tertiary);
  display: block; margin-bottom: 2px;
}
.partner-card__name { font-size: var(--wx-text-base); font-weight: 700; color: var(--wx-text-primary); margin: 0; }
.partner-card__desc { font-size: var(--wx-text-sm); color: var(--wx-text-secondary); line-height: 1.6; margin: 0; flex: 1; }
.partner-card__tags { display: flex; flex-wrap: wrap; gap: var(--wx-space-1-5); }
.partner-tag {
  font-size: 11px; font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-subtle);
  color: var(--wx-text-secondary);
}

.partner-join {
  background: color-mix(in srgb, var(--wx-primary) 6%, var(--wx-surface));
  border: 1px solid color-mix(in srgb, var(--wx-primary) 20%, transparent);
  border-radius: var(--wx-radius-2xl);
  padding: var(--wx-space-12);
  text-align: center;
}
.partner-join__title { font-size: clamp(22px, 3vw, 32px); font-weight: 700; color: var(--wx-text-primary); margin: 0 0 var(--wx-space-3); }
.partner-join__sub { font-size: var(--wx-text-base); color: var(--wx-text-secondary); margin: 0 0 var(--wx-space-6); line-height: 1.7; }
.partner-join__btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: var(--wx-space-3) var(--wx-space-8);
  background: var(--wx-primary); color: #fff;
  border-radius: var(--wx-radius-lg);
  font-size: var(--wx-text-base); font-weight: 600;
  text-decoration: none;
  transition: all var(--wx-d-fast);
}
.partner-join__btn:hover { opacity: 0.9; transform: translateY(-2px); }
</style>
