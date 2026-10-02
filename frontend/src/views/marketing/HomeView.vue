<script setup lang="ts">
import MarketingHeader from '@/archetypes/marketing/MarketingHeader.vue'
import MarketingHero from '@/archetypes/marketing/MarketingHero.vue'
import PartnerLoop from '@/archetypes/marketing/PartnerLoop.vue'
import TechGrid from '@/archetypes/marketing/TechGrid.vue'
import CaseStudyGrid from '@/archetypes/marketing/CaseStudyGrid.vue'
import LandingFooter from '@/views/home/_components/LandingFooter.vue'
import type { FooterGroup } from '@/views/home/_components/landing-content'
import { RouterLink } from 'vue-router'

const FOOTER_GROUPS: FooterGroup[] = [
  { title: 'Sản phẩm', links: [{ label: 'Tất cả sản phẩm', to: '/products' }, { label: 'Bảng giá', to: '/app/pricing' }, { label: 'Bộ giao diện', to: '/showcase/apps' }] },
  { title: 'Công ty', links: [{ label: 'Đối tác', to: '/partners' }, { label: 'Liên hệ', to: '/contact' }, { label: 'FAQ', to: '/faqs' }, { label: 'Tuyển dụng', to: '/landing/careers' }] },
  { title: 'Tài nguyên', links: [{ label: 'Tài liệu', to: '/docs' }, { label: 'Blog', to: '/landing/blog' }, { label: 'Changelog', to: '/landing/changelog' }] },
  { title: 'Pháp lý', links: [{ label: 'Điều khoản sử dụng', to: '/landing/policy' }, { label: 'Chính sách bảo mật', to: '/landing/policy' }] },
]
</script>

<template>
  <div class="home">
    <MarketingHeader />

    <main>
      <!-- Hero -->
      <MarketingHero />

      <!-- Partner marquee -->
      <PartnerLoop v-reveal />

      <!-- Tech expertise grid -->
      <TechGrid v-reveal />

      <!-- Case studies -->
      <CaseStudyGrid v-reveal />

      <!-- CTA band -->
      <section class="home-cta-band" v-reveal>
        <div class="home-cta-band__inner">
          <h2 class="home-cta-band__title">Sẵn sàng tự động hóa?</h2>
          <p class="home-cta-band__sub">Bắt đầu miễn phí 14 ngày, không cần thẻ tín dụng.</p>
          <div class="home-cta-band__btns">
            <RouterLink to="/auth/register" class="mkt-cta mkt-cta--primary">Dùng thử miễn phí</RouterLink>
            <RouterLink to="/contact" class="mkt-cta mkt-cta--ghost">Liên hệ tư vấn</RouterLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <LandingFooter :groups="FOOTER_GROUPS" tagline="Nền tảng tự động hóa đa kênh" blurb="Nền tảng tự động hóa đa kênh hàng đầu Việt Nam — quản lý tài khoản, chiến dịch và phiên kết nối ở một nơi." copy="© 2026 Mind Technology. All rights reserved." />
  </div>
</template>

<style scoped>
.home { min-height: 100vh; padding-top: 64px; background: var(--wx-surface-base); }

/* CTA band */
.home-cta-band {
  padding: var(--wx-space-10) var(--wx-space-6);
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%);
}
.home-cta-band__inner { max-width: 680px; margin: 0 auto; text-align: center; }
.home-cta-band__title {
  font-size: clamp(24px, 4vw, 40px);
  font-weight: var(--wx-fw-bold);
  color: #fff;
  margin: 0 0 var(--wx-space-3);
  letter-spacing: -0.02em;
}
.home-cta-band__sub {
  font-size: var(--wx-fs-16);
  color: rgba(255,255,255,0.8);
  margin: 0 0 var(--wx-space-8);
}
.home-cta-band__btns { display: flex; align-items: center; justify-content: center; gap: var(--wx-space-3); flex-wrap: wrap; }
.mkt-cta {
  display: inline-flex; align-items: center; justify-content: center;
  padding: var(--wx-space-3) var(--wx-space-6);
  border-radius: var(--wx-radius-lg);
  font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold);
  text-decoration: none; cursor: pointer;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
}
.mkt-cta--primary {
  background: #fff; color: var(--wx-brand-700);
}
.mkt-cta--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.mkt-cta--ghost {
  background: rgba(255,255,255,0.15);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}
.mkt-cta--ghost:hover { background: rgba(255,255,255,0.25); }
</style>
