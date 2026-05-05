<script setup lang="ts">
import LandingLayout from '../_layouts/LandingLayout.vue'
import { BaseButton, BaseBadge, BaseTag } from '../../components/common'

const FEATURES = [
  { icon: '⚡', title: 'Hiệu năng cao', desc: 'Bundle <200KB, virtual scroll, lazy load — tốc độ vượt trội trên mọi thiết bị.' },
  { icon: '🎨', title: 'Design system đầy đủ', desc: 'Tokens, dark mode, radius, spacing, motion — đồng nhất từ atom đến page.' },
  { icon: '🌐', title: 'Cross-platform', desc: 'Web, Mobile (Capacitor/PWA), Desktop (Tauri/Electron) — một codebase.' },
  { icon: '🔒', title: 'RBAC tích hợp', desc: 'useCan, v-can, CanShow, PermissionGate — phân quyền rõ ràng.' },
  { icon: '📊', title: '7 chart SVG', desc: 'Line, Area, Bar, Pie, Sparkline, Gauge, Heatmap — không deps ngoài.' },
  { icon: '🛡️', title: 'TypeScript strict', desc: 'Type an toàn cho props, emits, composables và store.' },
]

const LOGOS = ['Công ty TNHH ABC', 'Startup XYZ', 'Tập đoàn DEF', 'Corp GHI', 'Agency JKL']
</script>

<template>
  <LandingLayout>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <BaseBadge text="Phiên bản 0.8 đã ra mắt 🎉" variant="info" />
        <h1 class="hero-title">
          UI kit Vue 3 cho<br>
          <span class="gradient-text">mọi nền tảng</span>
        </h1>
        <p class="hero-desc">
          120+ component, design tokens, composables RBAC và 50+ page template.
          Sẵn sàng cho web, mobile và desktop — không cần cấu hình.
        </p>
        <div class="hero-actions">
          <BaseButton variant="primary" size="lg" tag="a" href="#/auth/register">Bắt đầu miễn phí</BaseButton>
          <BaseButton variant="secondary" size="lg" tag="a" href="#/showcase">Xem showcase</BaseButton>
        </div>
        <p class="hero-social">Được tin dùng bởi 1,200+ developer · ⭐ 4.9/5</p>
      </div>
    </section>

    <!-- Logos -->
    <section class="logos-section">
      <p class="logos-label">Được sử dụng tại</p>
      <div class="logos-row">
        <span v-for="l in LOGOS" :key="l" class="logo-item">{{ l }}</span>
      </div>
    </section>

    <!-- Features -->
    <section class="features-section">
      <div class="section-inner">
        <h2 class="section-title">Mọi thứ bạn cần để ship nhanh</h2>
        <p class="section-desc">Từ token đến page template — không cần build từ đầu.</p>
        <div class="features-grid">
          <div v-for="f in FEATURES" :key="f.title" class="feature-card">
            <span class="feature-icon">{{ f.icon }}</span>
            <h3 class="feature-name">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-inner">
        <h2 class="cta-title">Sẵn sàng xây dựng<br>sản phẩm tuyệt vời?</h2>
        <p class="cta-desc">Dùng thử miễn phí 14 ngày, không cần thẻ tín dụng.</p>
        <BaseButton variant="cta" size="lg">Bắt đầu ngay hôm nay</BaseButton>
      </div>
    </section>
  </LandingLayout>
</template>

<style scoped>
.hero { padding: var(--wx-space-12) var(--wx-space-5) var(--wx-space-10); background: var(--wx-gradient-bg); text-align: center; }
.hero-inner { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-5); }
.hero-title { font-size: var(--wx-fs-48); font-weight: 800; line-height: var(--wx-lh-tight); letter-spacing: var(--wx-tracking-tight); margin: 0; }
.gradient-text { background: var(--wx-gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: var(--wx-brand-600); }
.hero-desc { font-size: var(--wx-fs-18); color: var(--wx-content-secondary); line-height: var(--wx-lh-normal); max-width: 560px; margin: 0; }
.hero-actions { display: flex; gap: var(--wx-space-3); justify-content: center; flex-wrap: wrap; }
.hero-social { font-size: var(--wx-fs-13); color: var(--wx-content-muted); margin: 0; }

.logos-section { padding: var(--wx-space-7) var(--wx-space-5); border-top: 1px solid var(--wx-border-subtle); border-bottom: 1px solid var(--wx-border-subtle); background: var(--wx-bg-sunken); text-align: center; }
.logos-label { font-size: var(--wx-fs-13); color: var(--wx-content-muted); margin-bottom: var(--wx-space-4); font-weight: var(--wx-fw-medium); }
.logos-row { display: flex; justify-content: center; gap: var(--wx-space-8); flex-wrap: wrap; }
.logo-item { font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); }

.features-section { padding: var(--wx-space-10) var(--wx-space-5); }
.section-inner { max-width: 1100px; margin: 0 auto; }
.section-title { font-size: var(--wx-fs-32); font-weight: var(--wx-fw-bold); text-align: center; letter-spacing: var(--wx-tracking-tight); margin-bottom: var(--wx-space-3); }
.section-desc { font-size: var(--wx-fs-16); color: var(--wx-content-muted); text-align: center; margin-bottom: var(--wx-space-8); }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--wx-space-5); }
.feature-card { padding: var(--wx-space-5); background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-xl); }
.feature-icon { font-size: 32px; display: block; margin-bottom: var(--wx-space-3); }
.feature-name { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); margin: 0 0 var(--wx-space-2); }
.feature-desc { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); line-height: var(--wx-lh-relaxed); margin: 0; }

.cta-section { padding: var(--wx-space-10) var(--wx-space-5); background: var(--wx-gradient-cta); }
.cta-inner { max-width: 600px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-5); }
.cta-title { font-size: var(--wx-fs-40); font-weight: 800; color: white; letter-spacing: var(--wx-tracking-tight); margin: 0; line-height: var(--wx-lh-tight); }
.cta-desc { font-size: var(--wx-fs-16); color: rgba(255,255,255,0.8); margin: 0; }
</style>
