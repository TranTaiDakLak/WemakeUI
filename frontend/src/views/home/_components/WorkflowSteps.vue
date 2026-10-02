<script setup lang="ts">
/**
 * WorkflowSteps — 5 bước từ cài đặt đến ship.
 * Desktop: 5 thẻ nằm ngang có mũi tên nối; mobile (<768px): timeline dọc (đổi bằng CSS).
 * Không animation lặp (chỉ reveal một lần).
 */
import { WORKFLOW } from './landing-content'
</script>

<template>
  <section id="lp-workflow" class="ws">
    <div class="ws__ambient" aria-hidden="true"><span /><span /></div>

    <div class="ws__inner">
      <div class="ws__head" v-reveal>
        <span class="ws__eyebrow">Quy trình</span>
        <h2 class="ws__title">{{ WORKFLOW.title }}</h2>
      </div>

      <ol class="ws__flow">
        <li v-for="(s, i) in WORKFLOW.steps" :key="s.no" class="ws__step" v-reveal="i * 90">
          <span class="ws__ic" v-html="s.icon" />
          <span class="ws__no">{{ s.no }}</span>
          <h3 class="ws__step-title">{{ s.title }}</h3>
          <p class="ws__desc">{{ s.description }}</p>
          <span v-if="i < WORKFLOW.steps.length - 1" class="ws__arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.ws { position: relative; padding: var(--wx-space-9) var(--wx-space-5); overflow: hidden; }
.ws__ambient { position: absolute; inset: 0; pointer-events: none; }
.ws__ambient span { position: absolute; border-radius: 50%; filter: blur(90px); }
.ws__ambient span:first-child { width: 360px; height: 360px; left: -80px; top: 20%; background: var(--wx-shell-orb-a); }
.ws__ambient span:last-child  { width: 320px; height: 320px; right: -60px; bottom: 10%; background: var(--wx-shell-orb-b); }

.ws__inner { position: relative; max-width: 1200px; margin: 0 auto; }
.ws__head { text-align: center; margin-bottom: var(--wx-space-7); }
.ws__eyebrow { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--wx-brand-primary); }
.ws__title { margin: 10px 0 0; font-size: var(--wx-fs-32); font-weight: 800; letter-spacing: -0.02em; }

.ws__flow { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--wx-space-4); counter-reset: ws; }
.ws__step {
  position: relative;
  padding: var(--wx-space-5) var(--wx-space-4);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-base);
  box-shadow: var(--wx-shadow-sm);
  transition: transform var(--wx-d-normal) var(--wx-ease-bounce), box-shadow var(--wx-d-normal) var(--wx-ease-standard), border-color var(--wx-d-normal) var(--wx-ease-standard);
}
.ws__step:hover { transform: translateY(-4px); box-shadow: var(--wx-shadow-lg); border-color: var(--wx-brand-300); }
.ws__ic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: var(--wx-shell-tile-gradient);
  color: var(--wx-text-on-brand);
  box-shadow: var(--wx-shell-tile-shadow);
}
.ws__no {
  position: absolute;
  top: var(--wx-space-4);
  right: var(--wx-space-4);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: color-mix(in srgb, var(--wx-brand-500) 22%, var(--wx-surface-base)); /* số mờ làm watermark, theo surface để dark mode không chói */
  line-height: 1;
}
.ws__step-title { margin: var(--wx-space-4) 0 6px; font-size: 16px; font-weight: 700; }
.ws__desc { margin: 0; font-size: var(--wx-fs-13); line-height: 1.6; color: var(--wx-text-secondary); }
.ws__arrow {
  position: absolute;
  top: 50%;
  right: calc(var(--wx-space-4) * -1 + 1px);
  z-index: 2;
  transform: translate(50%, -50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  color: var(--wx-brand-primary);
  box-shadow: var(--wx-shadow-sm);
}

@media (max-width: 1080px) {
  .ws__flow { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ws__arrow { display: none; }
}
/* mobile: timeline dọc */
@media (max-width: 767px) {
  .ws__flow { grid-template-columns: 1fr; position: relative; padding-left: 28px; gap: var(--wx-space-3); }
  .ws__flow::before { content: ''; position: absolute; left: 10px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, var(--wx-brand-accent), var(--wx-brand-primary)); opacity: 0.35; border-radius: 2px; }
  .ws__step::before { content: ''; position: absolute; left: -24px; top: 26px; width: 10px; height: 10px; border-radius: 50%; background: var(--wx-brand-primary); box-shadow: 0 0 0 4px var(--wx-shell-frame-bg); }
  .ws__title { font-size: 26px; }
}
@media (prefers-reduced-motion: reduce) { .ws__step { transition: none; } }
</style>
