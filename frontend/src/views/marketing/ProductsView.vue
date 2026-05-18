<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarketingHeader from '@/archetypes/marketing/MarketingHeader.vue'
import { RouterLink } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useStagger } from '@/composables/useStagger'

const stagger = useStagger(70)
const gridRef = ref<HTMLElement | null>(null)
const { revealed, observe } = useScrollReveal()
onMounted(() => { if (gridRef.value) observe(gridRef.value) })

const PRODUCTS = [
  {
    slug: 'wemakeui',
    name: 'WemakeUI',
    icon: '🔗',
    version: 'v3.2.1',
    tags: ['WhatsApp', 'Zalo', 'Telegram', 'SMS'],
    desc: 'Nền tảng quản lý tài khoản đa kênh hợp nhất với AI automation, session management và bulk messaging.',
    highlights: ['Quản lý 1000+ tài khoản', 'AI chatbot tích hợp', 'Chiến dịch đa kênh', 'Realtime analytics'],
    color: '#2563eb',
  },
  {
    slug: 'wedashboard',
    name: 'WeDashboard',
    icon: '📊',
    version: 'v2.1.0',
    tags: ['Analytics', 'BI', 'Reporting'],
    desc: 'Trung tâm phân tích và báo cáo tập trung với drill-down analytics, custom charts và automated reports.',
    highlights: ['100+ biểu đồ tích hợp', 'Export PDF/Excel', 'Alert thông minh', 'Scheduled reports'],
    color: '#8b5cf6',
  },
  {
    slug: 'weautomation',
    name: 'WeAutomation',
    icon: '⚡',
    version: 'v1.5.0',
    tags: ['Workflow', 'AI', 'No-code'],
    desc: 'Công cụ xây dựng workflow tự động bằng drag-and-drop, tích hợp AI và 80+ connector sẵn có.',
    highlights: ['Visual flow builder', 'AI decision nodes', 'Webhook triggers', '80+ integrations'],
    color: '#f59e0b',
  },
  {
    slug: 'wescheduler',
    name: 'WeScheduler',
    icon: '⏰',
    version: 'v1.2.3',
    tags: ['Cron', 'Task Queue', 'Jobs'],
    desc: 'Hệ thống lên lịch và quản lý task phân tán với retry tự động, monitoring và alerting.',
    highlights: ['Cron jobs UI', 'Retry intelligent', 'Job priority queue', 'Distributed execution'],
    color: '#22c55e',
  },
]
</script>

<template>
  <div class="products-page">
    <MarketingHeader />

    <main>
      <div class="products-hero">
        <h1 class="products-hero__title">Hệ sinh thái sản phẩm Wemake</h1>
        <p class="products-hero__sub">Mỗi sản phẩm giải quyết một bài toán thực tế — kết hợp lại thành một nền tảng hoàn chỉnh.</p>
      </div>

      <div class="products-container">
        <div ref="gridRef" class="products-grid">
          <div
            v-for="(p, i) in PRODUCTS"
            :key="p.slug"
            class="product-card wx-reveal"
            :class="{ 'is-revealed': revealed }"
            :style="stagger(i)"
          >
            <div class="product-card__head">
              <span class="product-card__icon" :style="{ background: `${p.color}15` }">{{ p.icon }}</span>
              <div class="product-card__meta">
                <h2 class="product-card__name">{{ p.name }}</h2>
                <span class="product-card__version">{{ p.version }}</span>
              </div>
            </div>
            <p class="product-card__desc">{{ p.desc }}</p>
            <div class="product-card__tags">
              <span v-for="tag in p.tags" :key="tag" class="product-tag" :style="{ color: p.color, borderColor: `${p.color}30`, background: `${p.color}08` }">{{ tag }}</span>
            </div>
            <ul class="product-card__highlights">
              <li v-for="h in p.highlights" :key="h" class="product-hl">
                <span class="product-hl__check" :style="{ color: p.color }">✓</span>
                {{ h }}
              </li>
            </ul>
            <div class="product-card__cta">
              <RouterLink :to="`/products/${p.slug}`" class="product-btn product-btn--ghost">Xem chi tiết</RouterLink>
              <RouterLink to="/auth/register" class="product-btn product-btn--primary" :style="{ background: p.color }">Dùng thử</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.products-page { min-height: 100vh; padding-top: 64px; background: var(--wx-surface-base); }

.products-hero {
  text-align: center;
  padding: 120px var(--wx-space-6) var(--wx-space-12);
  background: linear-gradient(160deg, var(--wx-surface) 0%, color-mix(in srgb, var(--wx-primary) 4%, var(--wx-surface)) 100%);
}
.products-hero__title {
  font-size: clamp(28px, 5vw, 48px); font-weight: 700;
  letter-spacing: -0.02em; color: var(--wx-text-primary);
  margin: 0 0 var(--wx-space-4);
}
.products-hero__sub { font-size: var(--wx-text-lg); color: var(--wx-text-secondary); max-width: 560px; margin: 0 auto; line-height: 1.7; }

.products-container { max-width: 1200px; margin: 0 auto; padding: var(--wx-space-4) var(--wx-space-6) var(--wx-space-20); }
.products-grid { display: grid; gap: var(--wx-space-5); }
@media (min-width: 768px)  { .products-grid { grid-template-columns: repeat(2, 1fr); } }

.product-card {
  padding: var(--wx-space-7);
  background: var(--wx-surface-raised);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-2xl);
  display: flex; flex-direction: column; gap: var(--wx-space-5);
  transition: all var(--wx-d-normal);
}
.product-card:hover { box-shadow: 0 16px 48px rgba(0,0,0,0.1); transform: translateY(-4px); }

.product-card__head { display: flex; align-items: center; gap: var(--wx-space-4); }
.product-card__icon {
  width: 56px; height: 56px;
  border-radius: var(--wx-radius-xl);
  font-size: 28px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.product-card__meta {}
.product-card__name { font-size: var(--wx-text-xl); font-weight: 700; color: var(--wx-text-primary); margin: 0 0 2px; }
.product-card__version {
  font-size: var(--wx-text-xs); font-weight: 500;
  color: var(--wx-text-tertiary);
  font-family: monospace;
}
.product-card__desc { font-size: var(--wx-text-sm); color: var(--wx-text-secondary); line-height: 1.7; margin: 0; }

.product-card__tags { display: flex; flex-wrap: wrap; gap: var(--wx-space-1-5); }
.product-tag {
  font-size: 11px; font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  border: 1px solid;
}

.product-card__highlights { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--wx-space-2); }
.product-hl { display: flex; align-items: center; gap: var(--wx-space-2); font-size: var(--wx-text-sm); color: var(--wx-text-secondary); }
.product-hl__check { font-size: 14px; font-weight: 700; flex-shrink: 0; }

.product-card__cta { display: flex; gap: var(--wx-space-2); margin-top: auto; }
.product-btn {
  flex: 1; padding: var(--wx-space-2-5) var(--wx-space-4);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-text-sm); font-weight: 600;
  text-decoration: none; text-align: center;
  cursor: pointer; transition: all var(--wx-d-fast);
}
.product-btn--ghost {
  background: none; border: 1px solid var(--wx-border-subtle);
  color: var(--wx-text-secondary);
}
.product-btn--ghost:hover { background: var(--wx-surface-elevated); color: var(--wx-text-primary); }
.product-btn--primary { color: #fff; border: none; }
.product-btn--primary:hover { opacity: 0.9; transform: translateY(-1px); }
</style>
