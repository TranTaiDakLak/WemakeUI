<script setup lang="ts">
/**
 * AuthLayout — split panel: gradient left + form right.
 * Phase 6 — auth templates shared layout.
 *
 * Bố cục lấy từ trang đăng nhập MindAds: nền orb mờ chuyển động, thẻ form bo 20px
 * có hiệu ứng vào, ô logo trắng + dòng eyebrow xanh viết hoa, nút công cụ (giao diện sáng/tối)
 * nổi góc trên, chân thẻ có huy hiệu bảo mật.
 *
 * slots:
 *  - default: form content (right)
 *  - aside:   override left panel content (mặc định: brand + tagline + preview + tính năng + trích dẫn)
 *  - footer:  footer dưới form (privacy / terms / version)
 *  - tools:   thêm nút vào cụm công cụ nổi góc trên phải
 */
import { RouterLink } from 'vue-router'
import { useTheme } from '../../ui-system/composables/useTheme'

withDefaults(defineProps<{
  /** ẩn aside (cho login-v2 alt layout) */
  noAside?: boolean
  /** thay đổi gradient aside */
  asideTone?: 'gradient' | 'brand' | 'dark'
  /** căn form left/center/right */
  align?: 'center' | 'top'
  /** ẩn cụm công cụ nổi (đổi giao diện) */
  hideTools?: boolean
}>(), {
  noAside: false,
  asideTone: 'gradient',
  align: 'center',
  hideTools: false,
})

const { isDark, toggleTheme } = useTheme()

const ICON_SUN = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
const ICON_MOON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
const ICON_LOCK = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
const ICON_LAYERS = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`
const ICON_TREE = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22V12"/><path d="M12 12 7 7"/><path d="M12 12l5-5"/><circle cx="7" cy="5" r="2"/><circle cx="17" cy="5" r="2"/><circle cx="12" cy="3" r="1.5"/></svg>`
const ICON_GLOBE = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`

const FEATURES = [
  { icon: ICON_LAYERS, title: '13 phase rõ ràng', desc: 'Ship được từng pha, không phụ thuộc nhau' },
  { icon: ICON_TREE,   title: 'Tree-shakable',    desc: 'Named export, peer deps vue / router / pinia' },
  { icon: ICON_GLOBE,  title: 'Tiếng Việt mặc định', desc: 'Sentence case, thiết kế sẵn cho i18n' },
]
</script>

<template>
  <div class="auth-shell" :data-no-aside="noAside">
    <!-- orb mờ chuyển động — trang trí, không nhận tương tác -->
    <div class="auth-orbs" aria-hidden="true">
      <span class="auth-orb auth-orb--a" />
      <span class="auth-orb auth-orb--b" />
      <span class="auth-orb auth-orb--c" />
    </div>

    <aside v-if="!noAside" class="auth-aside" :data-tone="asideTone">
      <div class="auth-aside__content">
        <slot name="aside">
          <RouterLink to="/" class="auth-brand">
            <span class="auth-brand__tile"><img src="/logo.png" alt="MindUI" class="auth-brand__logo" /></span>
            <span class="auth-brand__name">MindUI</span>
          </RouterLink>
          <h1 class="auth-tagline">
            Bộ UI kit <em>cross-platform</em> cho team Việt.
          </h1>
          <p class="auth-blurb">
            Một bộ component, ba nền tảng — web, mobile, desktop.
            Sentence case mặc định, dark mode, a11y first.
          </p>

          <ul class="auth-features">
            <li v-for="f in FEATURES" :key="f.title" class="auth-feature">
              <span class="auth-feature__icon" v-html="f.icon" />
              <span class="auth-feature__text">
                <strong>{{ f.title }}</strong>
                <span>{{ f.desc }}</span>
              </span>
            </li>
          </ul>

          <figure class="auth-quote">
            <blockquote>
              "Migration từ thiết kế cũ sang MindUI mất 2 sprint —
              CLS giảm 60%, devs thoải mái với token semantic."
            </blockquote>
            <figcaption>
              <span class="auth-quote__avatar" aria-hidden="true">TA</span>
              <span class="auth-quote__who">
                <strong>Trần Quốc Anh</strong>
                <span>Frontend lead · TechCorp</span>
              </span>
            </figcaption>
          </figure>
        </slot>
      </div>
    </aside>

    <div v-if="!hideTools" class="auth-tools">
      <slot name="tools" />
      <button
        type="button"
        class="auth-tool-btn"
        :aria-label="isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'"
        :title="isDark ? 'Giao diện sáng' : 'Giao diện tối'"
        @click="toggleTheme()"
      >
        <span v-html="isDark ? ICON_SUN : ICON_MOON" />
      </button>
    </div>

    <main class="auth-main" :data-align="align">
      <div class="auth-main__inner">
        <!-- ô logo: chỉ hiện khi không có aside (mobile / noAside) -->
        <RouterLink to="/" class="auth-card-logo" aria-label="MindUI — trang chủ">
          <img src="/logo.png" alt="" />
        </RouterLink>

        <slot />

        <footer class="auth-foot">
          <slot name="footer">
            <span class="auth-foot__secure"><span v-html="ICON_LOCK" /> Kết nối được mã hoá end-to-end</span>
          </slot>
        </footer>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Shell ── */
.auth-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  min-height: 100vh;
  background: var(--wx-shell-page-bg);
  color: var(--wx-content-primary);
  font-family: var(--wx-font-primary);
  position: relative;
  overflow: hidden;
}
.auth-shell[data-no-aside="true"] { grid-template-columns: 1fr; }

/* orb mờ nền — token --wx-shell-orb-* */
.auth-orbs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.auth-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  will-change: transform;
  animation: mind-orb-float 20s ease-in-out infinite alternate;
}
.auth-orb--a {
  width: 520px; height: 520px;
  background: radial-gradient(circle, var(--wx-shell-orb-a) 0%, transparent 70%);
  top: -12%; right: 8%;
}
.auth-orb--b {
  width: 560px; height: 560px;
  background: radial-gradient(circle, var(--wx-shell-orb-b) 0%, transparent 70%);
  bottom: -16%; right: -6%;
  animation-delay: -6s;
  animation-duration: 24s;
}
.auth-orb--c {
  width: 340px; height: 340px;
  background: radial-gradient(circle, var(--wx-shell-orb-c) 0%, transparent 70%);
  top: 38%; left: 46%;
  animation-delay: -12s;
  animation-duration: 18s;
}

/* ── Aside (left branding panel) ── */
.auth-aside {
  position: relative;
  z-index: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--wx-space-7);
}
/* lớp chấm lưới mờ cho aside */
.auth-aside::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(color-mix(in srgb, var(--wx-surface-base) 55%, transparent) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.5;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 25%, #000 75%, transparent);
}
.auth-aside[data-tone="gradient"] { background: var(--wx-shell-aside-bg); }
/*
 * data-tone="brand"/"dark" là aside login cố ý luôn tối/brand (hardcode
 * hex + rgba white-glass) bất kể site đang light hay dark mode — cùng chủ đích
 * với gradient hero marketing, không phải bug thiếu token.
 */
.auth-aside[data-tone="brand"]    { background: linear-gradient(145deg, #1e3a8a, #1d4ed8, #2563eb); color: white; }
.auth-aside[data-tone="dark"]     { background: #0f172a; color: white; }

/* glassmorphism content card — only on brand/dark tones */
.auth-aside[data-tone="brand"] .auth-aside__content,
.auth-aside[data-tone="dark"]  .auth-aside__content {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(135, 206, 250, 0.30);
  border-radius: var(--wx-radius-2xl);
  padding: var(--wx-space-6);
}

.auth-aside__content {
  position: relative;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}

.auth-brand { display: flex; align-items: center; gap: var(--wx-space-3); text-decoration: none; color: inherit; }
.auth-brand__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--wx-shell-brand-tile-bg);
  border: 2px solid var(--wx-shell-brand-tile-ring);
  box-shadow: var(--wx-shell-brand-tile-shadow);
}
.auth-brand__logo {
  width: 30px; height: 30px;
  object-fit: contain;
  display: inline-block;
}
.auth-brand__name {
  font-size: var(--wx-fs-20);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
}

.auth-tagline {
  margin: 0;
  font-size: var(--wx-fs-32);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
  line-height: var(--wx-lh-tight);
}
.auth-tagline em {
  font-style: normal;
  background: var(--wx-shell-text-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
/* brand tone: blue → cyan glow gradient */
.auth-aside[data-tone="brand"] .auth-tagline em {
  background: linear-gradient(to right, #7dd3fc, #38bdf8, #e0f2fe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.55));
}
.auth-aside[data-tone="dark"] .auth-tagline em {
  background: linear-gradient(to right, #fff, rgba(255,255,255,0.7));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.auth-blurb {
  margin: 0;
  font-size: var(--wx-fs-15);
  line-height: var(--wx-lh-relaxed);
  color: var(--wx-content-secondary);
}
.auth-aside[data-tone="brand"] .auth-blurb,
.auth-aside[data-tone="dark"]  .auth-blurb { color: rgba(255, 255, 255, 0.80); }

/* tính năng — hàng icon + 2 dòng */
.auth-features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.auth-feature {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: 10px 12px;
  border-radius: var(--wx-radius-lg);
  background: color-mix(in srgb, var(--wx-surface-base) 55%, transparent);
  border: 1px solid var(--wx-border-glass);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform var(--wx-d-fast) var(--wx-ease-standard), background var(--wx-d-fast) var(--wx-ease-standard);
}
.auth-feature:hover { transform: translateX(3px); background: color-mix(in srgb, var(--wx-surface-base) 72%, transparent); }
.auth-feature__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 11px;
  background: var(--wx-shell-tile-gradient);
  color: var(--wx-text-on-brand);
  box-shadow: var(--wx-shell-tile-shadow);
}
.auth-feature__text { display: flex; flex-direction: column; line-height: 1.3; font-size: var(--wx-fs-12); color: var(--wx-content-secondary); }
.auth-feature__text strong { font-size: var(--wx-fs-14); color: var(--wx-content-primary); font-weight: var(--wx-fw-semibold); }
.auth-aside[data-tone="brand"] .auth-feature,
.auth-aside[data-tone="dark"]  .auth-feature { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.18); }
.auth-aside[data-tone="brand"] .auth-feature__text,
.auth-aside[data-tone="dark"]  .auth-feature__text { color: rgba(255,255,255,0.75); }
.auth-aside[data-tone="brand"] .auth-feature__text strong,
.auth-aside[data-tone="dark"]  .auth-feature__text strong { color: #fff; }

.auth-quote {
  margin: 0;
  padding: var(--wx-space-4);
  border-radius: var(--wx-radius-xl);
  background: color-mix(in srgb, var(--wx-surface-base) 55%, transparent);
  border: 1px solid var(--wx-border-glass);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.auth-aside[data-tone="brand"] .auth-quote,
.auth-aside[data-tone="dark"]  .auth-quote {
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.auth-quote blockquote {
  margin: 0 0 var(--wx-space-3);
  font-size: var(--wx-fs-14);
  font-style: italic;
  line-height: var(--wx-lh-relaxed);
}
.auth-quote figcaption { display: flex; align-items: center; gap: var(--wx-space-2); font-size: var(--wx-fs-12); }
.auth-quote__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--wx-radius-full);
  background: linear-gradient(135deg, var(--wx-brand-600), var(--wx-brand-800));
  color: var(--wx-text-on-brand);
  font-size: 11px;
  font-weight: var(--wx-fw-bold);
}
.auth-quote__who { display: flex; flex-direction: column; line-height: 1.3; }

/* ── Cụm công cụ nổi ── */
.auth-tools {
  position: absolute;
  top: var(--wx-space-4);
  right: var(--wx-space-4);
  z-index: 20;
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
}
.auth-tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-base);
  color: var(--wx-content-secondary);
  box-shadow: var(--wx-shadow-sm);
  cursor: pointer;
  transition: color var(--wx-d-fast) var(--wx-ease-standard), border-color var(--wx-d-fast) var(--wx-ease-standard), transform var(--wx-d-fast) var(--wx-ease-standard);
}
.auth-tool-btn:hover { color: var(--wx-brand-primary); border-color: var(--wx-brand-300); transform: translateY(-1px); }
.auth-tool-btn:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }

/* ── Main (right form panel) ── */
.auth-main {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--wx-space-9) var(--wx-space-5) var(--wx-space-7);
}
.auth-main[data-align="top"] { align-items: flex-start; padding-top: var(--wx-space-9); }

/* form card with colored depth shadow */
.auth-main__inner {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
  background: var(--wx-surface-elevated, #fff);
  border: 1px solid var(--wx-border-default);
  border-radius: 20px;
  padding: 2.25rem 2.25rem 1.75rem;
  box-shadow:
    0 24px 60px -20px rgba(15, 23, 42, 0.22),
    0 2px 8px -2px rgba(15, 23, 42, 0.06);
  animation: mind-card-in 0.55s var(--wx-ease-bounce) both;
}

.auth-card-logo {
  display: none;
  align-self: center;
  width: 56px;
  height: 56px;
  padding: 8px;
  border-radius: 18px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.18);
}
.auth-card-logo img { width: 100%; height: 100%; object-fit: contain; }
.auth-shell[data-no-aside="true"] .auth-card-logo { display: block; }

.auth-foot {
  margin-top: var(--wx-space-2);
  padding-top: var(--wx-space-3);
  border-top: 1px solid var(--wx-border-subtle);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--wx-space-2);
}
.auth-foot__secure { display: inline-flex; align-items: center; gap: 6px; }
.auth-foot__secure :deep(svg) { color: var(--wx-success-solid); }

@media (max-width: 880px) {
  .auth-shell { grid-template-columns: 1fr; }
  .auth-aside { display: none; }
  .auth-card-logo { display: block; }
  .auth-main { padding: var(--wx-space-9) var(--wx-space-4) var(--wx-space-6); }
  .auth-main__inner { padding: var(--wx-space-6) var(--wx-space-5) var(--wx-space-5); }
}

@media (prefers-reduced-motion: reduce) {
  .auth-orb, .auth-main__inner { animation: none; }
  .auth-feature, .auth-tool-btn { transition: none; }
}
</style>
