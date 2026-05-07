<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import MarketingHeader from '@/archetypes/marketing/MarketingHeader.vue'
import FAQAccordion from '@/archetypes/marketing/FAQAccordion.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const PRODUCT_DATA: Record<string, { name: string; icon: string; version: string; color: string; tagline: string; overview: string; features: string[] }> = {
  weconnect: {
    name: 'WeConnect', icon: '🔗', version: '3.2.1', color: '#2563eb',
    tagline: 'Quản lý đa kênh nhắn tin thông minh',
    overview: 'WeConnect là giải pháp quản lý tập trung mọi kênh nhắn tin — WhatsApp, Zalo, Telegram, SMS — trên một dashboard duy nhất. Với AI automation, bạn có thể tự động hóa phản hồi, phân loại hội thoại và tối ưu chiến dịch.',
    features: ['Session management đa thiết bị', 'AI chatbot với GPT-4 integration', 'Bulk messaging 500K+/giờ', 'Proxy & fingerprint management', 'Webhook & Open API', 'Team collaboration & RBAC'],
  },
  wedashboard: {
    name: 'WeDashboard', icon: '📊', version: '2.1.0', color: '#8b5cf6',
    tagline: 'BI và analytics cho doanh nghiệp hiện đại',
    overview: 'WeDashboard cung cấp cái nhìn 360° về hoạt động kinh doanh với 100+ loại biểu đồ, drill-down analytics và báo cáo tự động được gửi qua email, Slack hoặc Telegram.',
    features: ['100+ chart types', 'Custom dashboard builder', 'Scheduled PDF/Excel reports', 'Alert & anomaly detection', 'Multi-source data fusion', 'White-label option'],
  },
  weautomation: {
    name: 'WeAutomation', icon: '⚡', version: '1.5.0', color: '#f59e0b',
    tagline: 'Workflow automation không cần code',
    overview: 'WeAutomation cho phép xây dựng quy trình tự động phức tạp bằng giao diện kéo-thả trực quan, tích hợp AI để ra quyết định và kết nối với 80+ ứng dụng phổ biến.',
    features: ['Visual drag-and-drop flow builder', 'AI decision & classification nodes', 'HTTP/Webhook triggers', '80+ pre-built connectors', 'Error handling & retry logic', 'Version control for flows'],
  },
  wescheduler: {
    name: 'WeScheduler', icon: '⏰', version: '1.2.3', color: '#22c55e',
    tagline: 'Job scheduling và task queue phân tán',
    overview: 'WeScheduler là hệ thống lên lịch và quản lý tác vụ phân tán, đảm bảo mọi job đều được thực thi đúng thời điểm với cơ chế retry thông minh và monitoring real-time.',
    features: ['Cron expression UI builder', 'Distributed job execution', 'Priority queue & rate limiting', 'Intelligent retry with backoff', 'Job dependency chains', 'Full audit log & alerting'],
  },
}

const product = computed(() => PRODUCT_DATA[slug.value])
</script>

<template>
  <div class="pd-page">
    <MarketingHeader />

    <main v-if="product">
      <!-- hero -->
      <div class="pd-hero" :style="{ background: `linear-gradient(160deg, var(--wx-surface) 0%, ${product.color}08 100%)` }">
        <div class="pd-hero__inner">
          <RouterLink to="/products" class="pd-back">← Tất cả sản phẩm</RouterLink>
          <div class="pd-hero__head">
            <span class="pd-hero__icon" :style="{ background: `${product.color}15` }">{{ product.icon }}</span>
            <div>
              <h1 class="pd-hero__name">{{ product.name }}</h1>
              <p class="pd-hero__tagline">{{ product.tagline }}</p>
            </div>
          </div>
          <div class="pd-hero__cta">
            <RouterLink to="/auth/register" class="pd-btn pd-btn--primary" :style="{ background: product.color }">Dùng thử miễn phí</RouterLink>
            <RouterLink to="/contact" class="pd-btn pd-btn--ghost">Liên hệ tư vấn</RouterLink>
            <span class="pd-version">v{{ product.version }}</span>
          </div>
        </div>
      </div>

      <div class="pd-container">
        <!-- overview -->
        <section class="pd-section">
          <h2 class="pd-section__title">Tổng quan</h2>
          <p class="pd-overview">{{ product.overview }}</p>
        </section>

        <!-- features -->
        <section class="pd-section">
          <h2 class="pd-section__title">Tính năng nổi bật</h2>
          <div class="pd-features">
            <div v-for="f in product.features" :key="f" class="pd-feature">
              <span class="pd-feature__check" :style="{ color: product.color }">✓</span>
              {{ f }}
            </div>
          </div>
        </section>

        <!-- faq -->
        <section class="pd-section">
          <h2 class="pd-section__title">Câu hỏi thường gặp</h2>
          <FAQAccordion :searchable="false" />
        </section>
      </div>
    </main>

    <div v-else class="pd-notfound">
      <h2>Sản phẩm không tồn tại</h2>
      <RouterLink to="/products">← Quay lại danh sách sản phẩm</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.pd-page { min-height: 100vh; padding-top: 64px; background: var(--wx-surface-base); }

.pd-hero { padding: 100px var(--wx-space-6) var(--wx-space-12); }
.pd-hero__inner { max-width: 800px; margin: 0 auto; }
.pd-back {
  display: inline-block; margin-bottom: var(--wx-space-6);
  font-size: var(--wx-text-sm); color: var(--wx-text-secondary);
  text-decoration: none;
}
.pd-back:hover { color: var(--wx-text-primary); }
.pd-hero__head { display: flex; align-items: center; gap: var(--wx-space-5); margin-bottom: var(--wx-space-6); }
.pd-hero__icon {
  width: 64px; height: 64px; border-radius: var(--wx-radius-2xl);
  font-size: 32px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.pd-hero__name { font-size: clamp(28px, 5vw, 48px); font-weight: 700; letter-spacing: -0.02em; color: var(--wx-text-primary); margin: 0 0 var(--wx-space-1); }
.pd-hero__tagline { font-size: var(--wx-text-lg); color: var(--wx-text-secondary); margin: 0; }
.pd-hero__cta { display: flex; align-items: center; gap: var(--wx-space-3); flex-wrap: wrap; }
.pd-btn {
  padding: var(--wx-space-2-5) var(--wx-space-6);
  border-radius: var(--wx-radius-lg);
  font-size: var(--wx-text-sm); font-weight: 600;
  text-decoration: none; cursor: pointer; transition: all var(--wx-d-fast);
}
.pd-btn--primary { color: #fff; border: none; }
.pd-btn--primary:hover { opacity: 0.9; transform: translateY(-1px); }
.pd-btn--ghost { background: none; border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); }
.pd-btn--ghost:hover { background: var(--wx-surface-elevated); color: var(--wx-text-primary); }
.pd-version { font-size: var(--wx-text-xs); color: var(--wx-text-tertiary); font-family: monospace; }

.pd-container { max-width: 800px; margin: 0 auto; padding: 0 var(--wx-space-6) var(--wx-space-20); }
.pd-section { margin-bottom: var(--wx-space-12); }
.pd-section__title { font-size: var(--wx-text-2xl); font-weight: 700; color: var(--wx-text-primary); margin: 0 0 var(--wx-space-6); }
.pd-overview { font-size: var(--wx-text-base); color: var(--wx-text-secondary); line-height: 1.8; margin: 0; }

.pd-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--wx-space-3); }
.pd-feature {
  display: flex; align-items: flex-start; gap: var(--wx-space-2);
  font-size: var(--wx-text-sm); color: var(--wx-text-secondary);
  padding: var(--wx-space-3);
  background: var(--wx-surface-elevated);
  border-radius: var(--wx-radius-md);
}
.pd-feature__check { font-weight: 700; flex-shrink: 0; }

.pd-notfound {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 60vh; gap: var(--wx-space-4);
  font-size: var(--wx-text-lg); color: var(--wx-text-secondary);
}
.pd-notfound a { color: var(--wx-primary); text-decoration: none; }
</style>
