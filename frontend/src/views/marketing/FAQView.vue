<script setup lang="ts">
import MarketingHeader from '@/archetypes/marketing/MarketingHeader.vue'
import FAQAccordion from '@/archetypes/marketing/FAQAccordion.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="faq-page">
    <MarketingHeader />

    <main class="faq-main">
      <div class="faq-page__hero" v-reveal>
        <h1 class="faq-page__title">Câu hỏi thường gặp</h1>
        <p class="faq-page__sub">Không tìm thấy câu trả lời? <RouterLink to="/contact" class="faq-page__contact-link">Liên hệ chúng tôi</RouterLink></p>
      </div>

      <div class="faq-page__content" v-reveal="80">
        <FAQAccordion :searchable="true" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.faq-page { min-height: 100vh; padding-top: 64px; background: var(--wx-surface-base); }
.faq-main { max-width: 800px; margin: 0 auto; padding: 100px var(--wx-space-6) var(--wx-space-20); }
.faq-page__hero { text-align: center; margin-bottom: var(--wx-space-12); }
.faq-page__title {
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--wx-text-primary);
  margin: 0 0 var(--wx-space-3);
}
.faq-page__sub { font-size: var(--wx-text-lg); color: var(--wx-text-secondary); margin: 0; }
.faq-page__contact-link { color: var(--wx-primary); text-decoration: none; font-weight: 500; }
.faq-page__contact-link:hover { text-decoration: underline; }
.faq-page__content {}
</style>
