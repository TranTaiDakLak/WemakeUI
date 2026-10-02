<script setup lang="ts">
/**
 * LandingFooter — logo + 4 nhóm link + social + dòng bản quyền.
 * Link có `to` dùng RouterLink, `href` mở tab mới (rel noopener). Không có link chết.
 */
import { RouterLink } from 'vue-router'
import { BRAND, FOOTER_COPY, FOOTER_GROUPS, GITHUB_URL, type FooterGroup } from './landing-content'

withDefaults(defineProps<{
  /** nhóm link (mặc định: bộ link của MindUI) */
  groups?: FooterGroup[]
  /** đoạn giới thiệu dưới logo */
  blurb?: string
  /** dòng bản quyền */
  copy?: string
  /** dòng nhỏ dưới tên thương hiệu */
  tagline?: string
}>(), {
  groups: () => FOOTER_GROUPS,
  blurb: 'Bộ UI kit Vue 3 đa nền tảng, design system theo token — xây giao diện web, mobile và desktop từ một codebase.',
  copy: FOOTER_COPY,
  tagline: BRAND.tagline,
})
</script>

<template>
  <footer class="lf">
    <div class="lf__inner">
      <div class="lf__top">
        <div class="lf__about">
          <RouterLink to="/" class="lf__brand" :aria-label="BRAND.name">
            <span class="lf__tile"><img src="/logo.png" :alt="BRAND.name" width="28" height="28" /></span>
            <span class="lf__brand-text">
              <span class="lf__name">{{ BRAND.name }}</span>
              <span class="lf__tag">{{ tagline }}</span>
            </span>
          </RouterLink>
          <p class="lf__blurb">{{ blurb }}</p>
          <div class="lf__social">
            <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="lf__soc" aria-label="GitHub" title="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56v-2c-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.3-5.47-5.79 0-1.28.47-2.33 1.24-3.15-.13-.3-.54-1.5.11-3.14 0 0 1.01-.32 3.3 1.2a11.6 11.6 0 0 1 6 0c2.29-1.52 3.3-1.2 3.3-1.2.65 1.64.24 2.84.12 3.14.77.82 1.23 1.87 1.23 3.15 0 4.5-2.81 5.48-5.49 5.77.43.36.81 1.09.81 2.2v3.26c0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z"/></svg>
            </a>
            <RouterLink to="/landing/contact" class="lf__soc" aria-label="Liên hệ" title="Liên hệ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </RouterLink>
            <RouterLink to="/landing/blog" class="lf__soc" aria-label="Blog" title="Blog">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </RouterLink>
          </div>
        </div>

        <nav v-for="g in groups" :key="g.title" :aria-label="g.title" class="lf__group">
          <h3 class="lf__title">{{ g.title }}</h3>
          <div class="lf__links">
            <template v-for="l in g.links" :key="l.label">
              <RouterLink v-if="l.to" :to="l.to" class="lf__link">{{ l.label }}</RouterLink>
              <a v-else-if="l.href" :href="l.href" target="_blank" rel="noopener noreferrer" class="lf__link">{{ l.label }}</a>
              <span v-else class="lf__plain">{{ l.label }}</span>
            </template>
          </div>
        </nav>
      </div>

      <div class="lf__bottom">
        <span>{{ copy }}</span>
        <span class="lf__status"><span class="lf__dot" /> Mọi hệ thống hoạt động bình thường</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.lf { border-top: 1px solid var(--wx-border-default); background: var(--wx-surface-sunken); }
.lf__inner { max-width: 1200px; margin: 0 auto; padding: var(--wx-space-8) var(--wx-space-5) var(--wx-space-5); }
.lf__top { display: grid; grid-template-columns: minmax(0, 1.6fr) repeat(4, minmax(0, 1fr)); gap: var(--wx-space-6); }
.lf__brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; }
.lf__tile { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: var(--wx-surface-base); border: 1px solid var(--wx-border-default); box-shadow: var(--wx-shadow-sm); }
.lf__tile img { width: 28px; height: 28px; object-fit: contain; }
.lf__brand-text { display: flex; flex-direction: column; line-height: 1.15; }
.lf__name { font-size: var(--wx-fs-18); font-weight: 800; letter-spacing: -0.02em; }
.lf__tag { font-size: 10.5px; color: var(--wx-text-muted); }
.lf__blurb { margin: var(--wx-space-3) 0 0; max-width: 320px; font-size: var(--wx-fs-13); line-height: 1.65; color: var(--wx-text-secondary); }
.lf__social { display: flex; gap: var(--wx-space-2); margin-top: var(--wx-space-4); }
.lf__soc { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: var(--wx-radius-md); border: 1px solid var(--wx-border-default); background: var(--wx-surface-base); color: var(--wx-text-secondary); text-decoration: none; transition: color var(--wx-d-fast) var(--wx-ease-standard), border-color var(--wx-d-fast) var(--wx-ease-standard), transform var(--wx-d-fast) var(--wx-ease-standard); }
.lf__soc:hover { color: var(--wx-brand-primary); border-color: var(--wx-brand-300); transform: translateY(-2px); }
.lf__soc:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }
.lf__title { margin: 0 0 var(--wx-space-3); font-size: 11.5px; font-weight: var(--wx-fw-bold); letter-spacing: 0.08em; text-transform: uppercase; color: var(--wx-text-muted); }
.lf__links { display: flex; flex-direction: column; gap: 10px; }
.lf__link { font-size: var(--wx-fs-14); color: var(--wx-text-secondary); text-decoration: none; transition: color var(--wx-d-fast) var(--wx-ease-standard); }
.lf__link:hover { color: var(--wx-brand-primary); }
.lf__link:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; border-radius: 3px; }
.lf__plain { font-size: var(--wx-fs-14); color: var(--wx-text-muted); }
.lf__bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--wx-space-3); margin-top: var(--wx-space-7); padding-top: var(--wx-space-4); border-top: 1px solid var(--wx-border-default); font-size: var(--wx-fs-13); color: var(--wx-text-muted); }
.lf__status { display: inline-flex; align-items: center; gap: 8px; }
.lf__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--wx-success-solid); box-shadow: 0 0 0 3px var(--wx-success-bg); }

@media (max-width: 960px) { .lf__top { grid-template-columns: repeat(2, minmax(0, 1fr)); } .lf__about { grid-column: 1 / -1; } }
@media (max-width: 520px) { .lf__inner { padding: var(--wx-space-7) var(--wx-space-4) var(--wx-space-4); } }
@media (prefers-reduced-motion: reduce) { .lf__soc, .lf__link { transition: none; } }
</style>
