<script setup lang="ts">
import MarketingHeader from '@/archetypes/marketing/MarketingHeader.vue'
import MarketingHero from '@/archetypes/marketing/MarketingHero.vue'
import PartnerLoop from '@/archetypes/marketing/PartnerLoop.vue'
import TechGrid from '@/archetypes/marketing/TechGrid.vue'
import CaseStudyGrid from '@/archetypes/marketing/CaseStudyGrid.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <MarketingHeader />

    <main>
      <!-- Hero -->
      <MarketingHero />

      <!-- Partner marquee -->
      <PartnerLoop />

      <!-- Tech expertise grid -->
      <TechGrid />

      <!-- Case studies -->
      <CaseStudyGrid />

      <!-- CTA band -->
      <section class="home-cta-band">
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
    <footer class="home-footer">
      <div class="home-footer__inner">
        <div class="home-footer__brand">
          <span class="home-footer__logo">Wemake</span>
          <p class="home-footer__tagline">Nền tảng tự động hóa đa kênh hàng đầu Việt Nam.</p>
        </div>
        <div class="home-footer__links">
          <div class="home-footer__col">
            <h4 class="home-footer__col-title">Sản phẩm</h4>
            <RouterLink to="/products" class="home-footer__link">WeConnect</RouterLink>
            <RouterLink to="/products" class="home-footer__link">WeDashboard</RouterLink>
            <RouterLink to="/products" class="home-footer__link">WeAnalytics</RouterLink>
          </div>
          <div class="home-footer__col">
            <h4 class="home-footer__col-title">Công ty</h4>
            <RouterLink to="/partners" class="home-footer__link">Đối tác</RouterLink>
            <RouterLink to="/contact" class="home-footer__link">Liên hệ</RouterLink>
            <RouterLink to="/faqs" class="home-footer__link">FAQ</RouterLink>
          </div>
          <div class="home-footer__col">
            <h4 class="home-footer__col-title">Pháp lý</h4>
            <RouterLink to="/landing/policy" class="home-footer__link">Điều khoản sử dụng</RouterLink>
            <RouterLink to="/landing/policy" class="home-footer__link">Chính sách bảo mật</RouterLink>
          </div>
        </div>
      </div>
      <div class="home-footer__bottom">
        <p>© 2026 Wemake Technology. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home { min-height: 100vh; padding-top: 64px; background: var(--wx-surface-base); }

/* CTA band */
.home-cta-band {
  padding: 80px var(--wx-space-6);
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
  background: #fff; color: var(--wx-primary);
}
.mkt-cta--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.mkt-cta--ghost {
  background: rgba(255,255,255,0.15);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}
.mkt-cta--ghost:hover { background: rgba(255,255,255,0.25); }

/* footer */
.home-footer { background: var(--wx-surface-sunken); border-top: 1px solid var(--wx-border-subtle); }
.home-footer__inner {
  max-width: 1200px; margin: 0 auto;
  padding: var(--wx-space-12) var(--wx-space-6);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--wx-space-10);
}
@media (min-width: 768px) { .home-footer__inner { grid-template-columns: 1fr 2fr; } }

.home-footer__brand {}
.home-footer__logo {
  font-size: var(--wx-text-2xl); font-weight: 800;
  color: var(--wx-text-primary); letter-spacing: -0.5px;
  display: block; margin-bottom: var(--wx-space-3);
}
.home-footer__tagline { font-size: var(--wx-text-sm); color: var(--wx-text-secondary); line-height: 1.6; margin: 0; }

.home-footer__links { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--wx-space-6); }
.home-footer__col { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.home-footer__col-title {
  font-size: var(--wx-text-xs); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--wx-text-tertiary);
  margin: 0 0 var(--wx-space-1);
}
.home-footer__link {
  font-size: var(--wx-text-sm); color: var(--wx-text-secondary);
  text-decoration: none;
}
.home-footer__link:hover { color: var(--wx-text-primary); }

.home-footer__bottom {
  max-width: 1200px; margin: 0 auto;
  padding: var(--wx-space-5) var(--wx-space-6);
  border-top: 1px solid var(--wx-border-subtle);
  font-size: var(--wx-text-sm); color: var(--wx-text-tertiary);
}
.home-footer__bottom p { margin: 0; }
</style>
