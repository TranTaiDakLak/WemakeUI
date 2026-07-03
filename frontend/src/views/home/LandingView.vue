<script setup lang="ts">
/**
 * LandingView — trang chủ công khai của thư viện WemakeUI ("/").
 * Cổng vào: giới thiệu, cài nhanh, tính năng, dẫn tới Docs và Demo Lab.
 */
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '../../ui-system/composables/useTheme'
import { BaseButton, BaseToggle, BaseProgress, BaseTag, BaseAvatarGroup } from '../../components/common'
import Sparkline from '../../components/charts/Sparkline.vue'
import CodeBlock from '../docs/_components/CodeBlock.vue'
import { totalVariants } from '../showcase/layout-gallery/layoutRegistry'
import { appTemplates, totalAppPages, totalApps, totalCollections } from '../showcase/appTemplates'

const { isDark, toggleColorScheme } = useTheme()

const GITHUB_URL = 'https://github.com/TranTaiDakLak/WemakeUI'

const installSnippet = `npm install @wemake/ui vue
# import '@wemake/ui/style.css' tại app root`

/* ── Entrance animation ── */
const heroReady = ref(false)
onMounted(() => {
  setTimeout(() => (heroReady.value = true), 100)
})

const features = [
  { icon: '🧩', title: '80+ component', desc: 'Form, data grid, charts, overlay, navigation, layout shell — phủ kín nhu cầu app thực tế.' },
  { icon: '🖥️', title: 'Đa nền tảng', desc: 'Một codebase chạy Web, Mobile (Capacitor/Ionic) và Desktop (Wails/Tauri/Electron) — có fallback no-op.' },
  { icon: '🌗', title: 'Dark mode sẵn có', desc: '3 trục chủ đề độc lập: light/dark/system, default/flat và màu thương hiệu đổi runtime.' },
  { icon: '🎨', title: 'Design tokens', desc: 'Toàn bộ màu, spacing, typography, motion qua CSS variables --wx-* — re-skin chỉ bằng vài token.' },
  { icon: '🌳', title: 'Tree-shakable', desc: 'Named exports, không side-effect ngoài CSS, peer-deps cho vue/router/pinia — bundle gọn.' },
  { icon: '🇻🇳', title: 'Tiếng Việt + i18n', desc: 'Nhãn, tooltip, thông báo mặc định tiếng Việt và thiết kế sẵn cho đa ngôn ngữ.' },
]

const stats = [
  { num: '80+', label: 'component', to: '/docs' },
  { num: `${totalVariants()}`, label: 'trang giao diện', to: '/showcase/templates' },
  { num: '40+', label: 'composable & directive', to: '/docs' },
  { num: 'MIT', label: 'giấy phép', to: null },
]

/* ── Reveal stagger theo hàng/cột (grid) ──
 * i*60ms tuyến tính bị "chìm" trong grid nhiều cột vì cả hàng lọt vào viewport
 * gần như cùng lúc. Tính delay theo hàng để card rõ ràng xuất hiện theo từng đợt. */
function gridStagger(i: number, cols: number, colMs = 80, rowMs = 220) {
  const row = Math.floor(i / cols)
  const col = i % cols
  return row * rowMs + col * colMs
}
</script>

<template>
  <div class="lp">
    <!-- ── Nav ─────────────────────────────────────────── -->
    <header class="lp-nav">
      <div class="lp-nav__inner">
        <div class="lp-brand">
          <img src="/logo.png" alt="WemakeUI" class="lp-brand__logo" />
          WemakeUI
        </div>
        <nav class="lp-nav__links">
          <RouterLink to="/docs" class="lp-nav__link">Tài liệu</RouterLink>
          <RouterLink to="/lab" class="lp-nav__link">Xem trực tiếp</RouterLink>
          <button class="lp-icon-btn" type="button" :aria-label="isDark ? 'Chế độ sáng' : 'Chế độ tối'" @click="toggleColorScheme">
            <svg v-if="!isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <a :href="GITHUB_URL" target="_blank" rel="noopener" class="lp-icon-btn" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56v-2c-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.3-5.47-5.79 0-1.28.47-2.33 1.24-3.15-.13-.3-.54-1.5.11-3.14 0 0 1.01-.32 3.3 1.2a11.6 11.6 0 0 1 6 0c2.29-1.52 3.3-1.2 3.3-1.2.65 1.64.24 2.84.12 3.14.77.82 1.23 1.87 1.23 3.15 0 4.5-2.81 5.48-5.49 5.77.43.36.81 1.09.81 2.2v3.26c0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z"/></svg>
          </a>
        </nav>
      </div>
    </header>

    <!-- ── Hero ────────────────────────────────────────── -->
    <section class="lp-hero" :class="{ 'lp-hero--ready': heroReady }">
      <div class="lp-hero__glow" />

      <!-- Floating component previews — thuần trang trí, tự ẩn trên màn hẹp -->
      <div class="lp-hero__decor" aria-hidden="true">
        <div class="lp-float lp-float--a">
          <div class="lp-float__card">
            <span class="lp-float__label">Doanh thu tháng</span>
            <Sparkline :values="[4, 8, 6, 12, 9, 16, 13, 21]" :width="148" :height="40" fill smooth color="var(--wx-brand-primary)" />
            <span class="lp-float__meta">+24% so với kỳ trước</span>
          </div>
        </div>

        <div class="lp-float lp-float--b">
          <div class="lp-float__card lp-float__card--row">
            <BaseToggle :model-value="true" />
            <span class="lp-float__label">Chế độ tối</span>
          </div>
        </div>

        <div class="lp-float lp-float--c">
          <div class="lp-float__card lp-float__card--tags">
            <BaseTag label="Vue 3" variant="success" dot />
            <BaseTag label="TypeScript" variant="info" dot />
          </div>
        </div>

        <div class="lp-float lp-float--d">
          <div class="lp-float__card">
            <span class="lp-float__label">Kích thước bundle</span>
            <BaseProgress :value="38" variant="primary" size="sm" />
            <span class="lp-float__meta">182 KB / 200 KB</span>
          </div>
        </div>

        <div class="lp-float lp-float--e">
          <div class="lp-float__card lp-float__card--row">
            <BaseAvatarGroup :items="[{ name: 'An' }, { name: 'Bình' }, { name: 'Cường' }, { name: 'Dung' }]" size="sm" :max="3" />
            <span class="lp-float__label">1,200+ dev</span>
          </div>
        </div>
      </div>

      <div class="lp-hero__inner">
        <img src="/logo.png" alt="WemakeUI" class="lp-hero__logo lp-reveal" style="--reveal-d:0ms" />
        <span class="lp-badge lp-reveal" style="--reveal-d:80ms">Vue 3 · TypeScript · Vite 6</span>
        <h1 class="lp-hero__title lp-reveal" style="--reveal-d:160ms">
          Bộ UI kit Vue 3<br />
          <span class="lp-hero__grad">cho mọi nền tảng</span>
        </h1>
        <p class="lp-hero__sub lp-reveal" style="--reveal-d:260ms">
          80+ component sản xuất sẵn, design system theo token, dark mode và tree-shaking.
          Một codebase cho Web, Mobile và Desktop.
        </p>

        <div class="lp-hero__cta lp-reveal" style="--reveal-d:360ms">
          <RouterLink to="/docs">
            <BaseButton variant="primary" size="lg">Bắt đầu</BaseButton>
          </RouterLink>
          <RouterLink to="/lab">
            <BaseButton variant="secondary" size="lg">Khám phá ngay</BaseButton>
          </RouterLink>
        </div>

        <div class="lp-hero__install lp-reveal" style="--reveal-d:460ms">
          <CodeBlock :code="installSnippet" lang="bash" />
        </div>
      </div>
    </section>

    <!-- ── Stats ───────────────────────────────────────── -->
    <section class="lp-stats">
      <div
        v-for="(s, i) in stats"
        :key="s.label"
        class="lp-stat"
        :class="{ 'lp-stat--link': !!s.to }"
        v-reveal="gridStagger(i, 4)"
      >
        <RouterLink v-if="s.to" :to="s.to" class="lp-stat__inner">
          <span class="lp-stat__num">{{ s.num }}</span>
          <span class="lp-stat__label">{{ s.label }}</span>
          <span class="lp-stat__cta">Xem tất cả →</span>
        </RouterLink>
        <div v-else class="lp-stat__inner">
          <span class="lp-stat__num">{{ s.num }}</span>
          <span class="lp-stat__label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ── Bộ giao diện hoàn chỉnh (cấp sản phẩm) ──────────── -->
    <section class="lp-apps">
      <div class="lp-section-head" v-reveal>
        <h2 class="lp-section-title">Bộ giao diện hoàn chỉnh</h2>
        <p class="lp-section-sub">
          {{ totalApps }} app có app shell + navigation trỏ đúng page, và {{ totalCollections }} bộ màn độc lập
          (auth, error) — tổng {{ totalAppPages }} trang. Không chỉ là trang lẻ.
        </p>
      </div>

      <div class="lp-apps-grid">
        <div
          v-for="(app, i) in appTemplates"
          :key="app.id"
          v-reveal="gridStagger(i, 4)"
        >
          <RouterLink
            :to="app.kind === 'collection' ? `/showcase/apps#${app.id}` : app.entry"
            class="lp-app"
            :style="{ '--accent': app.accent }"
          >
            <span class="lp-app__icon">{{ app.icon }}</span>
            <span class="lp-app__body">
              <span class="lp-app__name">{{ app.name }}</span>
              <span class="lp-app__cat">{{ app.category }} · {{ app.pages }} trang</span>
            </span>
            <span class="lp-app__arrow">→</span>
          </RouterLink>
        </div>
      </div>

      <div class="lp-apps-foot">
        <RouterLink to="/showcase/apps">
          <BaseButton variant="secondary">Xem tất cả bộ giao diện →</BaseButton>
        </RouterLink>
      </div>
    </section>

    <!-- ── Features ────────────────────────────────────── -->
    <section class="lp-features">
      <div class="lp-section-head" v-reveal>
        <h2 class="lp-section-title">Vì sao chọn WemakeUI?</h2>
        <p class="lp-section-sub">Mọi thứ cần để dựng giao diện app nghiêm túc — không phụ thuộc backend.</p>
      </div>
      <div class="lp-feature-grid">
        <article v-for="(f, i) in features" :key="f.title" class="lp-feature" v-reveal="gridStagger(i, 3)">
          <span class="lp-feature__icon">{{ f.icon }}</span>
          <h3 class="lp-feature__title">{{ f.title }}</h3>
          <p class="lp-feature__desc">{{ f.desc }}</p>
        </article>
      </div>
    </section>

    <!-- ── CTA strip ───────────────────────────────────── -->
    <section class="lp-cta">
      <div class="lp-cta__inner">
        <h2 class="lp-cta__title">Sẵn sàng xây giao diện?</h2>
        <p class="lp-cta__sub">Đọc hướng dẫn, xem component trực tiếp, hoặc clone từ GitHub.</p>
        <div class="lp-cta__btns">
          <RouterLink to="/docs">
            <BaseButton variant="cta" size="lg">Mở tài liệu</BaseButton>
          </RouterLink>
          <RouterLink to="/lab">
            <BaseButton variant="secondary" size="lg">Khám phá ngay</BaseButton>
          </RouterLink>
          <a :href="GITHUB_URL" target="_blank" rel="noopener">
            <BaseButton variant="secondary" size="lg">GitHub ↗</BaseButton>
          </a>
        </div>
      </div>
    </section>

    <!-- ── Footer ──────────────────────────────────────── -->
    <footer class="lp-footer">
      <span>WemakeUI · MIT License</span>
      <div class="lp-footer__links">
        <RouterLink to="/docs">Tài liệu</RouterLink>
        <RouterLink to="/lab">Xem trực tiếp</RouterLink>
        <a :href="GITHUB_URL" target="_blank" rel="noopener">GitHub</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.lp {
  min-height: 100vh;
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  font-family: var(--wx-font-primary);
}

/* ── Nav ── */
.lp-nav {
  position: sticky;
  top: 0;
  z-index: var(--wx-z-header, 200);
  background: color-mix(in srgb, var(--wx-surface-base) 84%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--wx-border-default);
}
.lp-nav__inner {
  max-width: 1080px;
  margin: 0 auto;
  height: 60px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.lp-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.lp-brand__logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
  display: block;
}
.lp-nav__links {
  display: flex;
  align-items: center;
  gap: 6px;
}
.lp-nav__link {
  padding: 7px 14px;
  border-radius: var(--wx-radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--wx-text-secondary);
  text-decoration: none;
  transition: background var(--wx-d-fast, 150ms) ease, color var(--wx-d-fast, 150ms) ease;
}
.lp-nav__link:hover { background: var(--wx-surface-sunken); color: var(--wx-text-primary); }
.lp-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: 4px;
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  color: var(--wx-text-secondary);
  cursor: pointer;
  text-decoration: none;
  transition: background var(--wx-d-fast, 150ms) ease, color var(--wx-d-fast, 150ms) ease;
}
.lp-icon-btn:hover { background: var(--wx-surface-sunken); color: var(--wx-text-primary); }

/* ── Hero ── */
.lp-hero {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 88px 24px 64px;
}
.lp-hero__glow {
  position: absolute;
  top: -180px;
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  height: 480px;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--wx-brand-primary) 30%, transparent), transparent);
  filter: blur(40px);
  pointer-events: none;
  opacity: 0.7;
  animation: lp-glow-pulse 4s var(--wx-ease-standard) infinite;
}
.lp-hero__inner {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
}
.lp-hero__logo {
  width: 84px;
  height: 84px;
  object-fit: contain;
  display: block;
  margin: 0 auto 20px;
}
.lp-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-elevated);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--wx-text-secondary);
  margin-bottom: 24px;
}
.lp-hero__title {
  margin: 0;
  font-size: 52px;
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.lp-hero__grad {
  background: var(--wx-gradient-button, linear-gradient(135deg, var(--wx-brand-accent), var(--wx-brand-primary)));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.lp-hero__sub {
  margin: 22px auto 0;
  max-width: 560px;
  font-size: 17px;
  line-height: 1.65;
  color: var(--wx-text-secondary);
}
.lp-hero__cta {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.lp-hero__cta a { text-decoration: none; }
.lp-hero__install {
  margin: 36px auto 0;
  max-width: 480px;
  text-align: left;
}

/* ── Floating component previews ── */
.lp-hero__inner { z-index: 2; }
.lp-hero__decor {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.lp-float {
  position: absolute;
}
.lp-float__card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg, 14px);
  background: color-mix(in srgb, var(--wx-surface-elevated) 90%, transparent);
  box-shadow: var(--wx-shadow-lg);
  backdrop-filter: blur(8px);
}
.lp-float__card--row { flex-direction: row; align-items: center; gap: 10px; }
.lp-float__card--tags { flex-direction: row; gap: 6px; }
.lp-float__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--wx-text-secondary);
  white-space: nowrap;
}
.lp-float__meta {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--wx-brand-primary);
  white-space: nowrap;
}

/* Neo theo tâm (calc(50% + …)); độ sâu + chiều cao + góc nghiêng lệch nhau cho freestyle.
 * Mỗi card trôi theo một quỹ đạo riêng (nhiều điểm dừng translateX/Y, không lặp lại theo đường thẳng)
 * với chu kỳ + độ trễ khác nhau để không đồng bộ — cảm giác trôi tự do, không như bob lên xuống đều.
 * Chu kỳ dài (32–44s) + easing ease-in-out mượt để tốc độ px/giây luôn thấp — tránh gây chóng mặt/
 * buồn nôn (motion sickness) dù animation này cố tình bỏ qua prefers-reduced-motion theo yêu cầu.
 * !important bắt buộc phải có: foundations/layout.css có rule `* { animation-duration: 0.01ms !important }`
 * khi OS bật giảm chuyển động — nếu không có !important ở đây, rule global đó vẫn đè mất animation. */
.lp-float--a { top: 52px;  right: calc(50% + 408px); width: 184px; opacity: 0.94; animation: lp-drift-a 34s -5s ease-in-out infinite !important; }
.lp-float--a .lp-float__card { transform: rotate(-7deg); }
.lp-float--b { top: 268px; right: calc(50% + 368px);              opacity: 0.88; animation: lp-drift-b 40s -14s ease-in-out infinite !important; }
.lp-float--b .lp-float__card { transform: rotate(5deg); }
.lp-float--c { top: 96px;  left:  calc(50% + 372px);              opacity: 0.92; animation: lp-drift-c 37s -22s ease-in-out infinite !important; }
.lp-float--c .lp-float__card { transform: rotate(6deg); }
.lp-float--d { top: 308px; left:  calc(50% + 446px); width: 188px; opacity: 0.86; animation: lp-drift-d 44s -9s ease-in-out infinite !important; }
.lp-float--d .lp-float__card { transform: rotate(-5deg); }
.lp-float--e { top: 452px; right: calc(50% + 476px);              opacity: 0.8;  animation: lp-drift-e 36s -27s ease-in-out infinite !important; }
.lp-float--e .lp-float__card { transform: rotate(-3deg); }

@keyframes lp-drift-a {
  0%   { transform: translate(0, 0) rotate(0deg); }
  22%  { transform: translate(26px, -32px) rotate(3deg); }
  48%  { transform: translate(10px, -50px) rotate(-1deg); }
  71%  { transform: translate(-30px, -20px) rotate(-4deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes lp-drift-b {
  0%   { transform: translate(0, 0) rotate(0deg); }
  30%  { transform: translate(-32px, -18px) rotate(-3deg); }
  55%  { transform: translate(-12px, -44px) rotate(1deg); }
  80%  { transform: translate(22px, -28px) rotate(4deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes lp-drift-c {
  0%   { transform: translate(0, 0) rotate(0deg); }
  20%  { transform: translate(-22px, -34px) rotate(4deg); }
  50%  { transform: translate(28px, -46px) rotate(1deg); }
  78%  { transform: translate(18px, -8px) rotate(-3deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes lp-drift-d {
  0%   { transform: translate(0, 0) rotate(0deg); }
  26%  { transform: translate(28px, -25px) rotate(-3deg); }
  53%  { transform: translate(-7px, -48px) rotate(3deg); }
  82%  { transform: translate(-30px, -15px) rotate(4deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes lp-drift-e {
  0%   { transform: translate(0, 0) rotate(0deg); }
  33%  { transform: translate(-20px, -40px) rotate(3deg); }
  60%  { transform: translate(25px, -30px) rotate(-4deg); }
  85%  { transform: translate(17px, -4px) rotate(1deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* ── Hero entrance stagger ── */
.lp-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity var(--wx-d-slow) var(--wx-ease-decelerate),
    transform var(--wx-d-slow) var(--wx-ease-decelerate);
  transition-delay: var(--reveal-d, 0ms);
}
.lp-hero--ready .lp-reveal {
  opacity: 1;
  transform: translateY(0);
}

/* ── Glow pulse ── */
@keyframes lp-glow-pulse {
  0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
  50%      { opacity: 0.9; transform: translateX(-50%) scale(1.05); }
}

/* ── Floating cards entrance ── */
.lp-hero__decor {
  opacity: 0;
  transition: opacity 0.8s var(--wx-ease-decelerate) 0.5s;
}
.lp-hero--ready .lp-hero__decor {
  opacity: 1;
}

/* Card trôi (.lp-float--a..e) CỐ Ý bỏ qua prefers-reduced-motion theo yêu cầu — animation đã
 * được thiết kế chu kỳ dài + easing mượt để không gây chóng mặt, nên vẫn chạy kể cả khi OS bật
 * "giảm chuyển động". Các animation khác (glow, reveal) vẫn tôn trọng setting này bình thường. */
@media (prefers-reduced-motion: reduce) {
  .lp-hero__glow { animation: none; }
  .lp-reveal { opacity: 1; transform: none; transition: none; }
  .lp-hero__decor { opacity: 1; transition: none; }
}
/* Cần margin hai bên đủ rộng — ẩn khi hero hẹp lại */
@media (max-width: 1240px) {
  .lp-hero__decor { display: none; }
}

/* ── Stats ── */
.lp-stats {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.lp-stat {
  position: relative;
  display: block;
  text-align: center;
  padding: 22px 12px;
  border: 1px solid color-mix(in srgb, var(--wx-border-default) 60%, transparent);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-elevated);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition:
    transform var(--wx-d-normal) var(--wx-ease-bounce),
    box-shadow var(--wx-d-normal) var(--wx-ease-standard),
    border-color var(--wx-d-normal) var(--wx-ease-standard);
}
.lp-stat::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 40%,
    color-mix(in srgb, var(--wx-brand-primary) 8%, transparent) 70%,
    color-mix(in srgb, var(--wx-brand-primary) 14%, transparent) 100%
  );
  opacity: 0;
  transition: opacity var(--wx-d-normal) var(--wx-ease-standard);
  pointer-events: none;
}
.lp-stat--link { cursor: pointer; }
.lp-stat__inner {
  display: block;
  text-align: center;
  text-decoration: none;
  color: inherit;
}
.lp-stat:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--wx-brand-primary) 30%, transparent);
  box-shadow:
    0 12px 32px -8px color-mix(in srgb, var(--wx-brand-primary) 18%, transparent),
    0 4px 12px color-mix(in srgb, var(--wx-brand-primary) 10%, transparent);
}
.lp-stat:hover::before {
  opacity: 1;
}
.lp-stat__num {
  display: block;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--wx-brand-primary);
}
.lp-stat__label {
  font-size: 13px;
  color: var(--wx-text-muted);
}
.lp-stat__cta {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--wx-brand-primary);
  opacity: 0;
  transition: opacity var(--wx-d-fast, 150ms) ease;
}
.lp-stat--link:hover .lp-stat__cta { opacity: 1; }
.lp-stat:hover .lp-stat__num {
  background: var(--wx-gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Bộ giao diện hoàn chỉnh ── */
.lp-apps {
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 24px 8px;
}
.lp-apps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.lp-app {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--wx-border-default) 60%, transparent);
  border-left: 3px solid var(--accent);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-elevated);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition:
    transform var(--wx-d-normal) var(--wx-ease-bounce),
    box-shadow var(--wx-d-normal) var(--wx-ease-standard),
    border-color var(--wx-d-normal) var(--wx-ease-standard);
}
.lp-app::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 40%,
    color-mix(in srgb, var(--wx-brand-primary) 6%, transparent) 70%,
    color-mix(in srgb, var(--wx-brand-primary) 12%, transparent) 100%
  );
  opacity: 0;
  transition: opacity var(--wx-d-normal) var(--wx-ease-standard);
  pointer-events: none;
}
.lp-app:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 32px -8px color-mix(in srgb, var(--accent) 22%, transparent),
    0 4px 12px color-mix(in srgb, var(--accent) 12%, transparent);
  border-color: var(--accent);
}
.lp-app:hover::before {
  opacity: 1;
}
.lp-app__icon {
  font-size: 22px;
  line-height: 1;
  flex-shrink: 0;
}
.lp-app__body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.lp-app__name {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--wx-text-primary);
}
.lp-app__cat {
  font-size: 12px;
  color: var(--wx-text-muted);
}
.lp-app__arrow {
  color: var(--accent);
  font-size: 16px;
  flex-shrink: 0;
  transition: transform var(--wx-d-fast, 150ms) ease;
}
.lp-app:hover .lp-app__arrow { transform: translateX(3px); }
.lp-apps-foot {
  margin-top: 16px;
  text-align: center;
}
.lp-apps-foot a { text-decoration: none; }

/* ── Features ── */
.lp-features {
  max-width: 1080px;
  margin: 0 auto;
  padding: 64px 24px;
}
.lp-section-head { text-align: center; margin-bottom: 40px; }
.lp-section-title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.lp-section-sub {
  margin: 10px 0 0;
  font-size: 15.5px;
  color: var(--wx-text-secondary);
}
.lp-feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.lp-feature {
  position: relative;
  padding: 24px;
  border: 1px solid color-mix(in srgb, var(--wx-border-default) 60%, transparent);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-elevated);
  overflow: hidden;
  transition:
    transform var(--wx-d-normal) var(--wx-ease-standard),
    box-shadow var(--wx-d-normal) var(--wx-ease-standard),
    border-color var(--wx-d-normal) var(--wx-ease-standard);
}
.lp-feature::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    105deg,
    transparent 35%,
    color-mix(in srgb, var(--wx-brand-accent) 12%, transparent) 45%,
    color-mix(in srgb, var(--wx-brand-primary) 10%, transparent) 55%,
    transparent 65%
  );
  transform: translateX(-110%);
  pointer-events: none;
}
.lp-feature:hover {
  transform: scale(1.015);
  border-color: color-mix(in srgb, var(--wx-brand-primary) 35%, var(--wx-border-default));
  box-shadow:
    0 8px 24px -4px color-mix(in srgb, var(--wx-brand-primary) 15%, transparent),
    0 4px 10px color-mix(in srgb, var(--wx-brand-primary) 8%, transparent);
}
.lp-feature:hover::after {
  animation: lp-shimmer 0.9s var(--wx-ease-standard) forwards;
}
@keyframes lp-shimmer {
  to { transform: translateX(110%); }
}
.lp-feature__icon { font-size: 28px; }
.lp-feature__title {
  margin: 12px 0 6px;
  font-size: 17px;
  font-weight: 700;
}
.lp-feature__desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--wx-text-secondary);
}

/* ── CTA ── */
.lp-cta {
  padding: 24px;
}
.lp-cta__inner {
  max-width: 1080px;
  margin: 0 auto;
  text-align: center;
  padding: 56px 24px;
  border-radius: var(--wx-radius-3xl, 30px);
  background: var(--wx-gradient-cta, linear-gradient(135deg, var(--wx-brand-primary), color-mix(in srgb, var(--wx-brand-primary) 60%, #7c3aed)));
  color: #fff;
}
.lp-cta__title { margin: 0; font-size: 30px; font-weight: 800; color: #fff; }
.lp-cta__sub { margin: 10px 0 0; font-size: 15.5px; color: rgba(255,255,255,0.82); }
.lp-cta__btns {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.lp-cta__btns a { text-decoration: none; }
.lp-cta__btns :deep(.wx-btn--secondary) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
  backdrop-filter: blur(4px);
}
.lp-cta__btns :deep(.wx-btn--secondary:hover) {
  background: rgba(255, 255, 255, 0.25);
  border-color: #fff;
}

/* ── Footer ── */
.lp-footer {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  border-top: 1px solid var(--wx-border-default);
  font-size: 13.5px;
  color: var(--wx-text-muted);
}
.lp-footer__links { display: flex; gap: 18px; }
.lp-footer__links a {
  color: var(--wx-text-secondary);
  text-decoration: none;
}
.lp-footer__links a:hover { color: var(--wx-brand-primary); }

/* ── Responsive ── */
@media (max-width: 860px) {
  .lp-hero__title { font-size: 38px; }
  .lp-stats { grid-template-columns: repeat(2, 1fr); }
  .lp-feature-grid { grid-template-columns: 1fr; }
  .lp-apps-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 520px) {
  .lp-nav__link { padding: 6px 10px; }
  .lp-hero { padding: 56px 18px 48px; }
  .lp-hero__title { font-size: 32px; }
  .lp-apps-grid { grid-template-columns: 1fr; }
}
</style>
