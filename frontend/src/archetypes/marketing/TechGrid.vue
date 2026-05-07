<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useStagger } from '@/composables/useStagger'

const stagger = useStagger(70)
const gridRef = ref<HTMLElement | null>(null)
const { revealed, observe } = useScrollReveal()
onMounted(() => { if (gridRef.value) observe(gridRef.value) })

const CARDS = [
  { icon: '🤖', title: 'AI Automation', desc: 'Tự động hóa phản hồi, phân loại hội thoại và tối ưu nội dung bằng GPT-4.' },
  { icon: '📊', title: 'Analytics & BI', desc: 'Dashboard thời gian thực, báo cáo tự động và drill-down theo chiều dữ liệu bất kỳ.' },
  { icon: '📣', title: 'Campaign Engine', desc: 'Broadcast đa kênh — WhatsApp, Zalo, Telegram, SMS — với targeting và A/B test.' },
  { icon: '🏗', title: 'Infrastructure', desc: 'Cloud-native, auto-scaling, 99.9% uptime SLA với backup tự động mỗi 4 giờ.' },
  { icon: '🔌', title: 'Integrations', desc: 'Open API, Webhook, Plugin marketplace với 80+ connector sẵn có.' },
  { icon: '🔒', title: 'Enterprise Security', desc: 'SOC 2 compliant, mã hóa end-to-end, RBAC granular và audit log đầy đủ.' },
  { icon: '📡', title: 'Monitoring', desc: 'APM tích hợp, alert thông minh, health check theo thời gian thực.' },
  { icon: '⚡', title: 'Performance', desc: 'Gửi 500K+ tin nhắn/giờ với hệ thống queue phân tán và retry tự động.' },
]
</script>

<template>
  <section class="tech-section">
    <div class="tech-container">
      <div class="tech-header">
        <span class="tech-eyebrow">Công nghệ cốt lõi</span>
        <h2 class="tech-title">Nền tảng kỹ thuật vượt trội</h2>
        <p class="tech-sub">Được xây dựng cho các doanh nghiệp đòi hỏi hiệu suất cao và độ tin cậy tuyệt đối.</p>
      </div>
      <div ref="gridRef" class="tech-grid">
        <div
          v-for="(card, i) in CARDS"
          :key="card.title"
          class="tech-card wx-reveal"
          :class="{ 'is-revealed': revealed }"
          :style="stagger(i)"
        >
          <span class="tech-card__icon">{{ card.icon }}</span>
          <h3 class="tech-card__title">{{ card.title }}</h3>
          <p class="tech-card__desc">{{ card.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tech-section {
  padding: 80px var(--wx-space-6);
  background: linear-gradient(180deg, var(--wx-surface-sunken) 0%, var(--wx-surface-base) 100%);
}
.tech-container { max-width: 1200px; margin: 0 auto; }

.tech-header {
  text-align: center;
  margin-bottom: var(--wx-space-9);
}

.tech-eyebrow {
  display: inline-block;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--wx-brand-primary);
  margin-bottom: var(--wx-space-3);
}

.tech-title {
  font-size: clamp(24px, 4vw, 40px);
  font-weight: var(--wx-fw-bold);
  letter-spacing: -0.02em;
  color: var(--wx-text-primary);
  margin: 0 0 var(--wx-space-4);
}
.tech-sub {
  font-size: var(--wx-fs-16);
  color: var(--wx-text-secondary);
  max-width: 560px;
  margin: 0 auto;
  line-height: var(--wx-lh-relaxed);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--wx-space-4);
}
@media (min-width: 768px)  { .tech-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .tech-grid { grid-template-columns: repeat(4, 1fr); } }

.tech-card {
  padding: var(--wx-space-5);
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-xl);
  transition: all var(--wx-d-normal) var(--wx-ease-standard);
}
.tech-card:hover {
  border-color: var(--wx-brand-300);
  box-shadow: 0 8px 24px rgba(37,99,235,0.1);
  transform: translateY(-3px);
}
.tech-card:hover .tech-card__icon {
  transform: scale(1.1);
}

.tech-card__icon {
  font-size: 28px;
  display: block;
  margin-bottom: var(--wx-space-3);
  transition: transform var(--wx-d-fast) var(--wx-ease-bounce);
}
.tech-card__title {
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
  margin: 0 0 var(--wx-space-2);
}
.tech-card__desc {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  line-height: var(--wx-lh-normal);
  margin: 0;
}
</style>
