<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useStagger } from '@/composables/useStagger'

const stagger = useStagger(80)
const gridRef = ref<HTMLElement | null>(null)
const { revealed, observe } = useScrollReveal()
onMounted(() => { if (gridRef.value) observe(gridRef.value) })

const CASES = [
  {
    industry: 'Thương mại điện tử',
    company: 'Shopee Vietnam',
    challenge: 'Quản lý 50,000+ chat/ngày từ sellers trên nhiều kênh riêng biệt.',
    solution: 'Triển khai WemakeUI để hợp nhất kênh, tự động phân loại và gán ticket theo loại vấn đề.',
    metrics: [
      { value: '78%', label: 'Giảm thời gian xử lý' },
      { value: '3.2×', label: 'Tăng năng suất team' },
      { value: '4.8/5', label: 'CSAT score' },
    ],
    icon: '🛍',
    color: '#f97316',
  },
  {
    industry: 'Viễn thông',
    company: 'Viettel Digital',
    challenge: 'Gửi OTP và thông báo dịch vụ đến 5M thuê bao với SLA 99.9%.',
    solution: 'Hệ thống phân tải thông minh với fallback SMS khi Zalo/WhatsApp không khả dụng.',
    metrics: [
      { value: '99.97%', label: 'Delivery rate' },
      { value: '1.2s', label: 'Thời gian gửi trung bình' },
      { value: '40%', label: 'Giảm chi phí SMS' },
    ],
    icon: '📡',
    color: '#2563eb',
  },
  {
    industry: 'Tài chính',
    company: 'MoMo E-wallet',
    challenge: 'Chiến dịch retention cho 30M+ người dùng với cá nhân hóa cao.',
    solution: 'AI segmentation + sequence campaign tự động theo hành vi người dùng.',
    metrics: [
      { value: '24%', label: 'Tăng tỷ lệ quay lại' },
      { value: '11×', label: 'ROI chiến dịch' },
      { value: '8M+', label: 'Giao dịch từ campaign' },
    ],
    icon: '💳',
    color: '#8b5cf6',
  },
]
</script>

<template>
  <section class="cs-section">
    <div class="cs-container">
      <div class="cs-header">
        <h2 class="cs-title">Kết quả thực tế từ khách hàng</h2>
        <p class="cs-sub">Không phải demo. Đây là những con số thật từ những doanh nghiệp thật.</p>
      </div>

      <div ref="gridRef" class="cs-grid">
        <div
          v-for="(c, i) in CASES"
          :key="c.company"
          class="cs-card wx-reveal"
          :class="{ 'is-revealed': revealed }"
          :style="stagger(i)"
        >
          <div class="cs-card__head">
            <span class="cs-card__icon" :style="{ background: `${c.color}18` }">{{ c.icon }}</span>
            <div>
              <span class="cs-card__industry">{{ c.industry }}</span>
              <h3 class="cs-card__company">{{ c.company }}</h3>
            </div>
          </div>
          <div class="cs-card__body">
            <div class="cs-row">
              <span class="cs-label">Vấn đề</span>
              <p class="cs-text">{{ c.challenge }}</p>
            </div>
            <div class="cs-row">
              <span class="cs-label">Giải pháp</span>
              <p class="cs-text">{{ c.solution }}</p>
            </div>
          </div>
          <div class="cs-card__metrics">
            <div v-for="m in c.metrics" :key="m.label" class="cs-metric">
              <span class="cs-metric__val" :style="{ color: c.color }">{{ m.value }}</span>
              <span class="cs-metric__lbl">{{ m.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cs-section {
  padding: 80px var(--wx-space-6);
  background: var(--wx-brand-50);
  border-top: 1px solid var(--wx-brand-100);
}
.cs-container { max-width: 1200px; margin: 0 auto; }
.cs-header { text-align: center; margin-bottom: var(--wx-space-9); }
.cs-title {
  font-size: clamp(24px, 4vw, 40px);
  font-weight: var(--wx-fw-bold);
  letter-spacing: -0.02em;
  color: var(--wx-text-primary);
  margin: 0 0 var(--wx-space-4);
}
.cs-sub { font-size: var(--wx-fs-16); color: var(--wx-text-secondary); margin: 0; line-height: var(--wx-lh-relaxed); }

.cs-grid { display: grid; gap: var(--wx-space-5); }
@media (min-width: 768px)  { .cs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .cs-grid { grid-template-columns: repeat(3, 1fr); } }

.cs-card {
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-brand-100);
  border-radius: var(--wx-radius-2xl);
  padding: var(--wx-space-6);
  display: flex; flex-direction: column; gap: var(--wx-space-5);
  transition: all var(--wx-d-normal) var(--wx-ease-standard);
}
.cs-card:hover {
  box-shadow: 0 12px 32px rgba(37,99,235,0.1);
  border-color: var(--wx-brand-200);
  transform: translateY(-4px);
}

.cs-card__head { display: flex; align-items: center; gap: var(--wx-space-3); }
.cs-card__icon {
  width: 48px; height: 48px;
  border-radius: var(--wx-radius-xl);
  font-size: 24px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.cs-card__industry {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--wx-text-muted);
}
.cs-card__company {
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-primary);
  margin: 2px 0 0;
}

.cs-card__body { display: flex; flex-direction: column; gap: var(--wx-space-3); flex: 1; }
.cs-row {}
.cs-label {
  display: block;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--wx-text-muted);
  margin-bottom: 4px;
}
.cs-text { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); margin: 0; line-height: var(--wx-lh-normal); }

.cs-card__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--wx-space-3);
  padding-top: var(--wx-space-4);
  border-top: 1px solid var(--wx-border-subtle);
}
.cs-metric { display: flex; flex-direction: column; gap: 2px; }
.cs-metric__val { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); }
.cs-metric__lbl { font-size: 10px; color: var(--wx-text-muted); line-height: 1.4; }
</style>
