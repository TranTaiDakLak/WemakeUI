<script setup lang="ts">
/**
 * AuthLayout — split panel: gradient left + form right.
 * Phase 6 — auth templates shared layout.
 *
 * slots:
 *  - default: form content (right)
 *  - aside:   override left panel content (mặc định: brand + tagline + testimonial)
 *  - footer:  footer dưới form (privacy / terms / version)
 */
import { RouterLink } from 'vue-router'

withDefaults(defineProps<{
  /** ẩn aside (cho login-v2 alt layout) */
  noAside?: boolean
  /** thay đổi gradient aside */
  asideTone?: 'gradient' | 'brand' | 'dark'
  /** căn form left/center/right */
  align?: 'center' | 'top'
  /** hiện link "← quay về sitemap" */
  showHome?: boolean
}>(), {
  noAside: false,
  asideTone: 'gradient',
  align: 'center',
  showHome: true,
})
</script>

<template>
  <div class="auth-shell" :data-no-aside="noAside">
    <RouterLink v-if="showHome" to="/" class="auth-home">← sitemap</RouterLink>

    <aside v-if="!noAside" class="auth-aside" :data-tone="asideTone">
      <div class="auth-aside__content">
        <slot name="aside">
          <div class="auth-brand">
            <div class="auth-brand__logo">W</div>
            <span class="auth-brand__name">WemakeUI</span>
          </div>
          <h1 class="auth-tagline">
            Bộ UI kit <em>cross-platform</em> cho team Việt.
          </h1>
          <p class="auth-blurb">
            Một bộ component, ba nền tảng — web, mobile, desktop.
            Sentence case mặc định, dark mode, a11y first.
          </p>

          <figure class="auth-quote">
            <blockquote>
              "Migration từ thiết kế cũ sang WemakeUI mất 2 sprint —
              CLS giảm 60%, devs thoải mái với token semantic."
            </blockquote>
            <figcaption>
              <strong>Trần Quốc Anh</strong>
              <span>Frontend lead · TechCorp</span>
            </figcaption>
          </figure>

          <ul class="auth-features">
            <li>✓ 13 phase rõ ràng, ship được từng pha</li>
            <li>✓ Tree-shakable, peer deps</li>
            <li>✓ Vietnamese sentence case</li>
          </ul>
        </slot>
      </div>
    </aside>

    <main class="auth-main" :data-align="align">
      <div class="auth-main__inner">
        <slot />

        <footer v-if="$slots.footer" class="auth-foot">
          <slot name="footer" />
        </footer>
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  min-height: 100vh;
  background: var(--wx-surface-base);
  color: var(--wx-content-primary);
  font-family: var(--wx-font-primary);
  position: relative;
}
.auth-shell[data-no-aside="true"] { grid-template-columns: 1fr; }

.auth-home {
  position: absolute;
  top: var(--wx-space-4);
  left: var(--wx-space-5);
  font-size: var(--wx-fs-13);
  color: var(--wx-content-link);
  text-decoration: none;
  z-index: 2;
  background: var(--wx-surface-base);
  padding: 4px 10px;
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}
.auth-home:hover { background: var(--wx-surface-sunken); }

/* ── aside ── */
.auth-aside {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--wx-space-7);
}
.auth-aside[data-tone="gradient"] { background: var(--wx-gradient-bg); }
.auth-aside[data-tone="brand"]    { background: var(--wx-gradient-button); color: white; }
.auth-aside[data-tone="dark"]     { background: #0f172a; color: white; }

.auth-aside__content {
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}

.auth-brand { display: flex; align-items: center; gap: var(--wx-space-2); }
.auth-brand__logo {
  width: 40px; height: 40px;
  border-radius: var(--wx-radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--wx-gradient-button);
  color: white;
  font-weight: var(--wx-fw-bold);
  font-size: var(--wx-fs-18);
}
.auth-aside[data-tone="brand"] .auth-brand__logo,
.auth-aside[data-tone="dark"]  .auth-brand__logo {
  background: rgba(255, 255, 255, 0.18);
}
.auth-brand__name {
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-semibold);
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
  background: var(--wx-gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.auth-aside[data-tone="brand"] .auth-tagline em,
.auth-aside[data-tone="dark"]  .auth-tagline em {
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
.auth-aside[data-tone="dark"]  .auth-blurb { color: rgba(255, 255, 255, 0.78); }

.auth-quote {
  margin: 0;
  padding: var(--wx-space-4);
  border-radius: var(--wx-radius-xl);
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
}
.auth-aside[data-tone="brand"] .auth-quote,
.auth-aside[data-tone="dark"]  .auth-quote { background: rgba(255, 255, 255, 0.12); }
.auth-quote blockquote {
  margin: 0 0 var(--wx-space-3);
  font-size: var(--wx-fs-14);
  font-style: italic;
  line-height: var(--wx-lh-relaxed);
}
.auth-quote figcaption {
  font-size: var(--wx-fs-12);
  display: flex;
  flex-direction: column;
}

.auth-features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
  font-size: var(--wx-fs-13);
}

/* ── main (form) ── */
.auth-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--wx-space-7) var(--wx-space-5);
}
.auth-main[data-align="top"] { align-items: flex-start; padding-top: var(--wx-space-9); }

.auth-main__inner {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}

.auth-foot {
  margin-top: var(--wx-space-3);
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

@media (max-width: 880px) {
  .auth-shell { grid-template-columns: 1fr; }
  .auth-aside { display: none; }
  .auth-main { padding: var(--wx-space-9) var(--wx-space-4); }
}
</style>
