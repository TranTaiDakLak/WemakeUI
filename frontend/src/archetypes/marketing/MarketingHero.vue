<script setup lang="ts">
import { RouterLink } from 'vue-router'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  ctaPrimary?: string
  ctaPrimaryTo?: string
  ctaSecondary?: string
  ctaSecondaryTo?: string
}>(), {
  title: 'Tự động hóa kênh xã hội\nthông minh hơn',
  subtitle: 'Nền tảng quản lý đa kênh — WhatsApp, Zalo, Telegram, SMS — tích hợp AI để tự động hóa chiến dịch, quản lý tài khoản và phân tích hiệu suất theo thời gian thực.',
  ctaPrimary: 'Dùng thử miễn phí',
  ctaPrimaryTo: '/auth/register',
  ctaSecondary: 'Xem demo',
  ctaSecondaryTo: '/saas/dashboard',
})
</script>

<template>
  <section class="hero">
    <!-- bg orbs -->
    <div class="hero__orb hero__orb--1" aria-hidden="true" />
    <div class="hero__orb hero__orb--2" aria-hidden="true" />

    <div class="hero__container">
      <div class="hero__content">
        <!-- badge -->
        <div class="hero__badge">
          <span class="hero__badge-dot" />
          Nền tảng SaaS hàng đầu Việt Nam
        </div>

        <!-- headline -->
        <h1 class="hero__title">
          <template v-for="(line, i) in title.split('\n')" :key="i">
            <span v-if="i === 0">{{ line }}</span>
            <span v-else class="hero__title-accent">{{ line }}</span>
            <br v-if="i < title.split('\n').length - 1" />
          </template>
        </h1>

        <p class="hero__subtitle">{{ subtitle }}</p>

        <!-- CTA -->
        <div class="hero__cta">
          <RouterLink :to="ctaPrimaryTo!" class="hero-btn hero-btn--primary">
            {{ ctaPrimary }}
            <svg viewBox="0 0 20 20" fill="currentColor" class="hero-btn__icon">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </RouterLink>
          <RouterLink :to="ctaSecondaryTo!" class="hero-btn hero-btn--ghost">
            {{ ctaSecondary }}
          </RouterLink>
        </div>

        <!-- stats -->
        <div class="hero__stats">
          <div class="hero__stat">
            <span class="hero__stat-value">10K+</span>
            <span class="hero__stat-label">Tài khoản đang quản lý</span>
          </div>
          <div class="hero__stat-divider" />
          <div class="hero__stat">
            <span class="hero__stat-value">98.4%</span>
            <span class="hero__stat-label">Tỷ lệ giao thành công</span>
          </div>
          <div class="hero__stat-divider" />
          <div class="hero__stat">
            <span class="hero__stat-value">200+</span>
            <span class="hero__stat-label">Doanh nghiệp tin dùng</span>
          </div>
        </div>
      </div>

      <!-- illustration -->
      <div class="hero__visual">
        <div class="hero__card hero__card--main">
          <div class="hero__card-head">
            <span class="hero__card-dot" style="background:#22c55e" />
            <span class="hero__card-dot" style="background:#f59e0b" />
            <span class="hero__card-dot" style="background:#ef4444" />
            <span class="hero__card-title">WemakeUI Dashboard</span>
          </div>
          <div class="hero__metrics">
            <div class="hero__metric">
              <span class="hero__metric-val" style="color:#22c55e">1,284</span>
              <span class="hero__metric-lbl">Tài khoản Live</span>
            </div>
            <div class="hero__metric">
              <span class="hero__metric-val" style="color:#60a5fa">4,821</span>
              <span class="hero__metric-lbl">Phiên hôm nay</span>
            </div>
            <div class="hero__metric">
              <span class="hero__metric-val" style="color:#a78bfa">142K</span>
              <span class="hero__metric-lbl">Tin nhắn</span>
            </div>
          </div>
          <svg class="hero__sparkline" viewBox="0 0 200 48" fill="none">
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#60a5fa" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <polygon
              points="0,48 0,38 25,28 50,32 75,18 100,22 125,10 150,15 175,8 200,4 200,48"
              fill="url(#sparkGrad)"
            />
            <polyline
              points="0,38 25,28 50,32 75,18 100,22 125,10 150,15 175,8 200,4"
              stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- floating badges -->
        <div class="hero__float hero__float--1">
          <span>📣</span> Chiến dịch gửi thành công
        </div>
        <div class="hero__float hero__float--2">
          <span>🔗</span> 47 kết nối mới
        </div>
        <div class="hero__float hero__float--3">
          <span>✅</span> Uptime 99.8%
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Hero wrapper ── */
.hero {
  position: relative;
  padding: 120px var(--wx-space-6) 96px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%);
  overflow: hidden;
}

/* decorative orbs */
.hero__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.hero__orb--1 {
  width: 600px; height: 600px;
  top: -200px; right: -100px;
  background: radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%);
}
.hero__orb--2 {
  width: 400px; height: 400px;
  bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%);
}

.hero__container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--wx-space-9);
  align-items: center;
}
@media (min-width: 1024px) {
  .hero__container { grid-template-columns: 1fr 1fr; }
}

/* ── Badge ── */
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: var(--wx-radius-full);
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: rgba(255,255,255,0.9);
  margin-bottom: var(--wx-space-5);
  backdrop-filter: blur(8px);
}
.hero__badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #4ade80;
  animation: wx-pulse 2s ease-in-out infinite;
}

/* ── Headline ── */
.hero__title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: #fff;
  margin: 0 0 var(--wx-space-5);
}
.hero__title-accent {
  background: linear-gradient(to right, #93c5fd, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__subtitle {
  font-size: var(--wx-fs-16);
  color: rgba(255,255,255,0.75);
  line-height: var(--wx-lh-relaxed);
  margin: 0 0 var(--wx-space-8);
  max-width: 520px;
}

/* ── CTA buttons ── */
.hero__cta {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
  margin-bottom: var(--wx-space-10);
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-3) var(--wx-space-6);
  border-radius: var(--wx-radius-lg);
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-semibold);
  text-decoration: none;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
}
.hero-btn--primary {
  background: #fff;
  color: var(--wx-brand-primary);
}
.hero-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}
.hero-btn--ghost {
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(8px);
}
.hero-btn--ghost:hover {
  background: rgba(255,255,255,0.2);
}
.hero-btn__icon { width: 18px; height: 18px; }

/* ── Stats ── */
.hero__stats {
  display: flex;
  align-items: center;
  gap: var(--wx-space-6);
  flex-wrap: wrap;
}
.hero__stat { display: flex; flex-direction: column; gap: 2px; }
.hero__stat-value {
  font-size: var(--wx-fs-20);
  font-weight: var(--wx-fw-bold);
  color: #fff;
}
.hero__stat-label {
  font-size: var(--wx-fs-12);
  color: rgba(255,255,255,0.6);
}
.hero__stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255,255,255,0.2);
}

/* ── Dashboard card ── */
.hero__visual {
  position: relative;
  display: none;
}
@media (min-width: 1024px) { .hero__visual { display: block; } }

.hero__card {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--wx-radius-2xl);
  padding: var(--wx-space-5);
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 64px rgba(0,0,0,0.3);
}
.hero__card-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--wx-space-4);
}
.hero__card-dot { width: 10px; height: 10px; border-radius: 50%; }
.hero__card-title {
  font-size: var(--wx-fs-12);
  color: rgba(255,255,255,0.5);
  margin-left: var(--wx-space-1);
}
.hero__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-4);
}
.hero__metric { display: flex; flex-direction: column; gap: 2px; }
.hero__metric-val { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); }
.hero__metric-lbl { font-size: 10px; color: rgba(255,255,255,0.5); }
.hero__sparkline { width: 100%; }

/* ── Floating badges ── */
.hero__float {
  position: absolute;
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-2) var(--wx-space-3);
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--wx-radius-lg);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  color: #fff;
  white-space: nowrap;
  animation: wx-reveal-up 0.6s ease both;
}
.hero__float--1 { bottom: -20px; left: -24px; animation-delay: 0.3s; }
.hero__float--2 { top: 30px; right: -24px; animation-delay: 0.5s; }
.hero__float--3 { bottom: 60px; right: -16px; animation-delay: 0.7s; }
</style>
