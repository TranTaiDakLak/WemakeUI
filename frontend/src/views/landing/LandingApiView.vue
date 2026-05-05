<script setup lang="ts">
import LandingLayout from '../_layouts/LandingLayout.vue'
import { BaseButton, BaseBadge, BaseTag } from '../../components/common'

const ENDPOINTS = [
  { method: 'GET', path: '/api/v1/components', desc: 'Lấy danh sách tất cả components' },
  { method: 'GET', path: '/api/v1/components/:id', desc: 'Lấy chi tiết component theo ID' },
  { method: 'POST', path: '/api/v1/themes', desc: 'Tạo theme custom mới' },
  { method: 'PUT', path: '/api/v1/themes/:id', desc: 'Cập nhật theme' },
  { method: 'DELETE', path: '/api/v1/themes/:id', desc: 'Xoá theme' },
]

const METHOD_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  GET: 'success', POST: 'info', PUT: 'warning', DELETE: 'danger',
}

const SDKs = [
  { lang: 'JavaScript', icon: '🟨', install: 'npm install @wemake/ui' },
  { lang: 'TypeScript', icon: '🔷', install: 'npm install @wemake/ui' },
  { lang: 'Vue 3', icon: '💚', install: 'npm install @wemake/ui' },
]
</script>

<template>
  <LandingLayout>
    <!-- hero -->
    <section class="api-hero">
      <BaseBadge text="API v1" variant="primary" />
      <h1 class="api-title">API dành cho developer</h1>
      <p class="api-desc">RESTful API đầy đủ tài liệu, SDK cho JavaScript/TypeScript, rate limit hợp lý và sandbox miễn phí.</p>
      <div class="api-actions">
        <BaseButton variant="primary" size="lg">Bắt đầu dùng API</BaseButton>
        <BaseButton variant="secondary" size="lg" tag="a" href="#/app/api-keys">Lấy API key</BaseButton>
      </div>
    </section>

    <!-- quick start -->
    <section class="section">
      <div class="section-inner">
        <h2 class="section-title">Bắt đầu trong 5 phút</h2>
        <div class="quick-grid">
          <div class="step-card">
            <span class="step-num">1</span>
            <h3 class="step-title">Tạo API key</h3>
            <p class="step-desc">Vào <a href="#/app/api-keys" class="link">Cài đặt → API key</a> và tạo khoá mới với quyền cần thiết.</p>
          </div>
          <div class="step-card">
            <span class="step-num">2</span>
            <h3 class="step-title">Cài đặt SDK</h3>
            <pre class="code-sm">npm install @wemake/ui</pre>
          </div>
          <div class="step-card">
            <span class="step-num">3</span>
            <h3 class="step-title">Gọi API đầu tiên</h3>
            <pre class="code-sm">const res = await fetch('/api/v1/components', {
  headers: { Authorization: `Bearer ${key}` }
})</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- endpoints -->
    <section class="section section-alt">
      <div class="section-inner">
        <h2 class="section-title">Endpoints</h2>
        <div class="endpoint-list">
          <div v-for="ep in ENDPOINTS" :key="ep.path" class="endpoint-row">
            <BaseBadge :text="ep.method" :variant="METHOD_VARIANTS[ep.method]" />
            <code class="ep-path">{{ ep.path }}</code>
            <span class="ep-desc">{{ ep.desc }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SDKs -->
    <section class="section">
      <div class="section-inner">
        <h2 class="section-title">SDK</h2>
        <div class="sdk-grid">
          <div v-for="s in SDKs" :key="s.lang" class="sdk-card">
            <span class="sdk-icon">{{ s.icon }}</span>
            <h3 class="sdk-name">{{ s.lang }}</h3>
            <pre class="code-sm">{{ s.install }}</pre>
          </div>
        </div>
      </div>
    </section>
  </LandingLayout>
</template>

<style scoped>
.api-hero { padding: var(--wx-space-12) var(--wx-space-5) var(--wx-space-10); text-align: center; background: var(--wx-gradient-bg); display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-5); }
.api-title { font-size: var(--wx-fs-40); font-weight: 800; letter-spacing: var(--wx-tracking-tight); margin: 0; }
.api-desc { font-size: var(--wx-fs-18); color: var(--wx-content-secondary); max-width: 600px; margin: 0; }
.api-actions { display: flex; gap: var(--wx-space-3); justify-content: center; }
.section { padding: var(--wx-space-10) var(--wx-space-5); }
.section-alt { background: var(--wx-bg-sunken); }
.section-inner { max-width: 1000px; margin: 0 auto; }
.section-title { font-size: var(--wx-fs-28); font-weight: var(--wx-fw-bold); letter-spacing: var(--wx-tracking-tight); margin-bottom: var(--wx-space-6); }
.quick-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--wx-space-5); }
.step-card { padding: var(--wx-space-5); background: var(--wx-bg-base); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-xl); }
.step-num { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: var(--wx-brand-100); color: var(--wx-brand-600); border-radius: var(--wx-radius-full); font-weight: var(--wx-fw-bold); font-size: var(--wx-fs-16); margin-bottom: var(--wx-space-3); }
.step-title { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); margin: 0 0 var(--wx-space-2); }
.step-desc { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); margin: 0; }
.code-sm { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); padding: var(--wx-space-2) var(--wx-space-3); margin: var(--wx-space-2) 0 0; overflow-x: auto; }
.endpoint-list { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.endpoint-row { display: flex; align-items: center; gap: var(--wx-space-4); padding: var(--wx-space-3) var(--wx-space-4); background: var(--wx-bg-base); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); }
.ep-path { font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); color: var(--wx-content-link); flex: 0 0 auto; }
.ep-desc { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); }
.sdk-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--wx-space-4); }
.sdk-card { padding: var(--wx-space-5); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-xl); display: flex; flex-direction: column; gap: var(--wx-space-3); }
.sdk-icon { font-size: 32px; }
.sdk-name { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); margin: 0; }
.link { color: var(--wx-content-link); }
</style>
