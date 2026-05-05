<script setup lang="ts">
/**
 * ErrorLayout — centered illustration + heading + cta.
 * Phase 6 — error & utility pages shared layout.
 */
import { RouterLink } from 'vue-router'

withDefaults(defineProps<{
  /** mã lỗi to (404, 500…) — hoặc emoji */
  code?: string
  /** tiêu đề chính */
  title: string
  /** mô tả ngắn */
  description?: string
  /** illustration: gradient blob hoặc emoji */
  variant?: 'gradient' | 'plain' | 'dark'
  /** mã code monospace nhỏ (request id, error id) */
  errorId?: string
}>(), {
  variant: 'gradient',
  description: '',
})
</script>

<template>
  <div class="err-shell" :data-variant="variant">
    <RouterLink to="/" class="err-home">← sitemap</RouterLink>

    <div class="err-blob err-blob--1" aria-hidden="true" />
    <div class="err-blob err-blob--2" aria-hidden="true" />

    <main class="err-main" role="main">
      <div v-if="$slots.illustration || code" class="err-illust">
        <slot name="illustration">
          <span class="err-code">{{ code }}</span>
        </slot>
      </div>

      <h1 class="err-title">{{ title }}</h1>
      <p v-if="description" class="err-desc">{{ description }}</p>

      <div v-if="$slots.actions" class="err-actions">
        <slot name="actions" />
      </div>

      <div v-if="$slots.default" class="err-extra">
        <slot />
      </div>

      <div v-if="errorId" class="err-meta">
        Mã lỗi: <code>{{ errorId }}</code>
      </div>
    </main>
  </div>
</template>

<style scoped>
.err-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--wx-space-5);
  font-family: var(--wx-font-primary);
  color: var(--wx-content-primary);
  background: var(--wx-surface-base);
  overflow: hidden;
}
.err-shell[data-variant="gradient"] { background: var(--wx-gradient-bg); }
.err-shell[data-variant="dark"]     { background: #0f172a; color: white; }

.err-home {
  position: absolute;
  top: var(--wx-space-4);
  left: var(--wx-space-5);
  font-size: var(--wx-fs-13);
  color: var(--wx-content-link);
  text-decoration: none;
  background: var(--wx-surface-base);
  padding: 4px 10px;
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
  z-index: 2;
}
.err-shell[data-variant="dark"] .err-home {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

/* decorative blobs */
.err-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  opacity: 0.5;
}
.err-blob--1 {
  width: 360px; height: 360px;
  background: var(--wx-gradient-button);
  top: -120px; left: -100px;
}
.err-blob--2 {
  width: 280px; height: 280px;
  background: var(--wx-gradient-cta);
  bottom: -80px; right: -80px;
  opacity: 0.35;
}
.err-shell[data-variant="plain"] .err-blob { display: none; }

.err-main {
  position: relative;
  text-align: center;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wx-space-3);
}

.err-illust {
  margin-bottom: var(--wx-space-3);
}

.err-code {
  display: inline-block;
  font-family: var(--wx-font-primary);
  font-size: 128px;
  font-weight: var(--wx-fw-bold);
  line-height: 1;
  letter-spacing: var(--wx-tracking-tight);
  background: var(--wx-gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.err-title {
  margin: 0;
  font-size: var(--wx-fs-32);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
  line-height: var(--wx-lh-tight);
}
.err-desc {
  margin: 0;
  font-size: var(--wx-fs-15);
  color: var(--wx-content-secondary);
  line-height: var(--wx-lh-relaxed);
  max-width: 460px;
}
.err-shell[data-variant="dark"] .err-desc { color: rgba(255, 255, 255, 0.7); }

.err-actions {
  display: flex;
  gap: var(--wx-space-2);
  margin-top: var(--wx-space-4);
  flex-wrap: wrap;
  justify-content: center;
}

.err-extra {
  margin-top: var(--wx-space-5);
  width: 100%;
  text-align: left;
}

.err-meta {
  margin-top: var(--wx-space-4);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
}
.err-meta code {
  font-family: var(--wx-font-mono);
  background: var(--wx-surface-sunken);
  padding: 2px 6px;
  border-radius: var(--wx-radius-sm);
}

@media (max-width: 600px) {
  .err-code { font-size: 88px; }
  .err-title { font-size: var(--wx-fs-24); }
}
</style>
