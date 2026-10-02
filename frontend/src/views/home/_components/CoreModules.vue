<script setup lang="ts">
/**
 * CoreModules — 4 thẻ mô-đun cốt lõi (desktop 4 cột, tablet 2×2, mobile 1 cột).
 * Layout lấy từ "Core Product Modules" của trang chủ MindAds: icon tone, tiêu đề,
 * danh sách tick và link "Khám phá".
 */
import { RouterLink } from 'vue-router'
import { CORE_MODULES } from './landing-content'

function stagger(i: number) { return i * 90 }
</script>

<template>
  <section id="lp-modules" class="cm">
    <div class="cm__head" v-reveal>
      <span class="cm__eyebrow">Mô-đun cốt lõi</span>
      <h2 class="cm__title">Bốn nhóm giải quyết phần lớn bài toán giao diện</h2>
      <p class="cm__lead">Mỗi nhóm là một tập component, token và ví dụ có thể dùng độc lập — ghép lại thành sản phẩm hoàn chỉnh.</p>
    </div>

    <div class="cm__wrap">
      <div class="cm__ambient" aria-hidden="true">
        <span class="cm__blob cm__blob--brand" />
        <span class="cm__blob cm__blob--success" />
        <span class="cm__blob cm__blob--violet" />
        <span class="cm__blob cm__blob--warning" />
      </div>

      <div class="cm__grid">
        <article
          v-for="(m, i) in CORE_MODULES"
          :key="m.key"
          class="cm__card"
          :data-tone="m.tone"
          v-reveal="stagger(i)"
        >
          <span class="cm__icon" v-html="m.icon" />
          <div>
            <h3 class="cm__card-title">{{ m.title }}</h3>
            <p class="cm__card-sub">{{ m.subtitle }}</p>
          </div>
          <ul class="cm__list">
            <li v-for="f in m.features" :key="f">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ f }}</span>
            </li>
          </ul>
          <RouterLink :to="m.to" class="cm__more" :aria-label="`Khám phá: ${m.title}`">
            Khám phá
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cm { max-width: 1200px; margin: 0 auto; padding: var(--wx-space-9) var(--wx-space-5) var(--wx-space-5); }
.cm__head { text-align: center; max-width: 720px; margin: 0 auto var(--wx-space-7); }
.cm__eyebrow { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--wx-brand-primary); }
.cm__title { margin: 10px 0 0; font-size: var(--wx-fs-32); font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
.cm__lead { margin: 12px 0 0; font-size: 15.5px; line-height: 1.65; color: var(--wx-text-secondary); }

.cm__wrap { position: relative; }
.cm__ambient { position: absolute; inset: -30px 0; pointer-events: none; overflow: hidden; }
.cm__blob { position: absolute; width: 280px; height: 280px; border-radius: 50%; filter: blur(70px); opacity: 0.35; }
.cm__blob--brand   { background: var(--wx-brand-400);  top: -40px; left: 4%; }
.cm__blob--success { background: var(--wx-success-solid); bottom: -60px; left: 28%; opacity: 0.2; }
.cm__blob--violet  { background: var(--wx-shell-tone-violet-fg); top: -20px; right: 28%; opacity: 0.18; }
.cm__blob--warning { background: var(--wx-warning-solid); bottom: -40px; right: 4%; opacity: 0.18; }

.cm__grid { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--wx-space-4); }

.cm__card {
  --_bg: var(--wx-shell-tone-brand-bg);
  --_fg: var(--wx-shell-tone-brand-fg);
  --_bd: var(--wx-shell-tone-brand-bd);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
  padding: var(--wx-space-5);
  border: 1px solid var(--wx-border-default);
  border-top: 3px solid var(--_fg);
  border-radius: var(--wx-radius-xl);
  background: color-mix(in srgb, var(--wx-surface-base) 92%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: var(--wx-shadow-md);
  transition: transform var(--wx-d-normal) var(--wx-ease-bounce), box-shadow var(--wx-d-normal) var(--wx-ease-standard);
}
.cm__card:hover { transform: translateY(-6px); box-shadow: var(--wx-shadow-xl); }
.cm__card[data-tone='success'] { --_bg: var(--wx-shell-tone-success-bg); --_fg: var(--wx-shell-tone-success-fg); --_bd: var(--wx-shell-tone-success-bd); }
.cm__card[data-tone='violet']  { --_bg: var(--wx-shell-tone-violet-bg);  --_fg: var(--wx-shell-tone-violet-fg);  --_bd: var(--wx-shell-tone-violet-bd); }
.cm__card[data-tone='warning'] { --_bg: var(--wx-shell-tone-warning-bg); --_fg: var(--wx-shell-tone-warning-fg); --_bd: var(--wx-shell-tone-warning-bd); }

.cm__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: var(--_bg);
  color: var(--_fg);
  border: 1px solid var(--_bd);
}
.cm__card-title { margin: 0; font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
.cm__card-sub { margin: 3px 0 0; font-size: var(--wx-fs-13); color: var(--wx-text-muted); }
.cm__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.cm__list li { display: flex; align-items: flex-start; gap: 8px; font-size: var(--wx-fs-13); line-height: 1.5; color: var(--wx-text-secondary); }
.cm__list svg { flex-shrink: 0; margin-top: 3px; color: var(--_fg); }
.cm__more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-bold);
  color: var(--_fg);
  text-decoration: none;
}
.cm__more svg { transition: transform var(--wx-d-fast) var(--wx-ease-standard); }
.cm__more:hover svg { transform: translateX(4px); }
.cm__more:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 3px; border-radius: 4px; }

@media (max-width: 1080px) { .cm__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .cm__grid { grid-template-columns: 1fr; } .cm__title { font-size: 26px; } }
@media (prefers-reduced-motion: reduce) { .cm__card, .cm__more svg { transition: none; } }
</style>
