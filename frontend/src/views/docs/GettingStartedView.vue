<script setup lang="ts">
/**
 * /docs — Giới thiệu & Cài đặt. Trang chủ của hệ thống tài liệu.
 */
import { RouterLink } from 'vue-router'
import { BaseButton } from '../../components/common'
import CodeBlock from './_components/CodeBlock.vue'
import DemoBlock from './_components/DemoBlock.vue'
import { totalVariants } from '../showcase/layout-gallery/layoutRegistry'
import { totalAppTemplates, totalAppPages } from '../showcase/appTemplates'

const templateCount = totalVariants()

const installCode = `# npm
npm install @wemake/ui vue

# pnpm
pnpm add @wemake/ui vue

# yarn
yarn add @wemake/ui vue`

const setupCode = `// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// Bắt buộc: import styles của thư viện một lần ở app root
import '@wemake/ui/style.css'

createApp(App).mount('#app')`

const usageCode = `<script setup lang="ts">
import { BaseButton } from '@wemake/ui'
<\/script>

<template>
  <BaseButton variant="primary">Xin chào WemakeUI</BaseButton>
<\/template>`

const themeCode = `<script setup lang="ts">
import { useTheme } from '@wemake/ui'

const { isDark, toggleColorScheme, setBrandColor } = useTheme()
// toggleColorScheme()      -> đổi sáng/tối
// setBrandColor('#9333ea') -> đổi màu thương hiệu toàn UI
<\/script>`

const buttonDemo = `<BaseButton variant="primary">Xin chào WemakeUI</BaseButton>`
</script>

<template>
  <article class="gs">
    <header class="gs__head">
      <span class="gs__eyebrow">Tài liệu</span>
      <h1 class="gs__title">Bắt đầu với WemakeUI</h1>
      <p class="gs__lead">
        Bộ UI kit Vue 3 đa nền tảng — Web, Mobile (Capacitor/Ionic) và Desktop (Wails/Tauri/Electron).
        80+ component, design tokens, dark mode và tree-shaking sẵn có.
      </p>
    </header>

    <h2 class="gs__h2">1. Cài đặt</h2>
    <p class="gs__p">
      Cài qua trình quản lý gói. <code class="gs__code">vue@^3.2</code> là peer dependency;
      <code class="gs__code">vue-router</code> và <code class="gs__code">pinia</code> là tùy chọn.
    </p>
    <CodeBlock :code="installCode" lang="bash" />

    <h2 class="gs__h2">2. Nạp styles</h2>
    <p class="gs__p">
      Import file CSS gộp <strong>một lần duy nhất</strong> tại điểm khởi tạo app. File này chứa toàn bộ
      design tokens, dark mode và style component.
    </p>
    <CodeBlock :code="setupCode" lang="ts" />

    <h2 class="gs__h2">3. Dùng component đầu tiên</h2>
    <p class="gs__p">Mọi component là <em>named export</em>, import đúng cái cần để tree-shake tối ưu.</p>
    <DemoBlock :code="usageCode" open>
      <div style="display:flex; justify-content:center;">
        <BaseButton variant="primary">Xin chào WemakeUI</BaseButton>
      </div>
    </DemoBlock>

    <h2 class="gs__h2">4. Dark mode &amp; chủ đề</h2>
    <p class="gs__p">
      Dùng composable <code class="gs__code">useTheme()</code> để bật/tắt dark mode hoặc đổi màu thương hiệu
      cho toàn bộ UI tại runtime. Trạng thái được lưu trong <code class="gs__code">localStorage</code>.
    </p>
    <CodeBlock :code="themeCode" lang="ts" />

    <div class="gs__note">
      <strong>Đa nền tảng:</strong> mọi component kiểm tra <code class="gs__code">window</code>/<code class="gs__code">navigator</code>
      trước khi dùng và có fallback no-op trên web/mobile, nên dùng được an toàn trong cả vỏ desktop lẫn PWA.
    </div>

    <p class="gs__p" style="margin-top:32px;">
      Sẵn sàng khám phá? Chọn một component ở thanh bên để xem tài liệu, hoặc duyệt
      <RouterLink to="/showcase/apps" class="gs__link">{{ totalAppTemplates }} bộ giao diện</RouterLink>
      (app có navigation + bộ màn auth/error), và
      <RouterLink to="/showcase/templates" class="gs__link">{{ templateCount }} trang giao diện</RouterLink>
      lẻ trong Template Gallery.
    </p>

    <RouterLink to="/showcase/apps" class="gs__browse">
      <span class="gs__browse-icon">▦</span>
      <span class="gs__browse-text">
        <strong>Bộ giao diện hoàn chỉnh</strong>
        <span>{{ totalAppTemplates }} bộ (SaaS, Dashboard, WemakeUI, Marketing…) · {{ totalAppPages }} trang · app có navigation + bộ màn độc lập (auth/error)</span>
      </span>
      <span class="gs__browse-arrow">→</span>
    </RouterLink>
  </article>
</template>

<style scoped>
.gs {
  max-width: 880px;
  margin: 0 auto;
  padding: 40px 32px 96px;
}
.gs__eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-brand-primary);
  margin-bottom: 8px;
}
.gs__title {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--wx-text-primary);
}
.gs__lead {
  margin: 12px 0 0;
  font-size: 16px;
  line-height: 1.7;
  color: var(--wx-text-secondary);
}
.gs__h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--wx-text-primary);
  margin: 44px 0 12px;
}
.gs__p {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--wx-text-secondary);
  margin: 0 0 16px;
}
.gs__code {
  font-family: var(--wx-font-mono);
  font-size: 12.5px;
  padding: 2px 6px;
  border-radius: var(--wx-radius-sm);
  background: var(--wx-surface-sunken);
  color: var(--wx-brand-primary);
}
.gs__note {
  margin-top: 28px;
  padding: 16px 18px;
  border: 1px solid var(--wx-info-border, var(--wx-border-default));
  border-left: 3px solid var(--wx-brand-primary);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-info-bg, var(--wx-surface-sunken));
  font-size: 14px;
  line-height: 1.65;
  color: var(--wx-text-secondary);
}

.gs__link {
  color: var(--wx-brand-primary);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--wx-brand-primary) 40%, transparent);
}
.gs__link:hover { border-bottom-color: var(--wx-brand-primary); }

.gs__browse {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  padding: 16px 18px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-elevated);
  text-decoration: none;
  color: inherit;
  transition: transform var(--wx-d-fast, 150ms) ease, box-shadow var(--wx-d-fast, 150ms) ease, border-color var(--wx-d-fast, 150ms) ease;
}
.gs__browse:hover {
  transform: translateY(-2px);
  box-shadow: var(--wx-shadow-md);
  border-color: var(--wx-brand-primary);
}
.gs__browse-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: var(--wx-radius-lg);
  background: color-mix(in srgb, var(--wx-brand-primary) 12%, transparent);
  color: var(--wx-brand-primary);
  font-size: 20px;
}
.gs__browse-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.gs__browse-text strong { font-size: 15px; color: var(--wx-text-primary); }
.gs__browse-text span { font-size: 13px; color: var(--wx-text-muted); }
.gs__browse-arrow {
  font-size: 20px;
  color: var(--wx-brand-primary);
  transition: transform var(--wx-d-fast, 150ms) ease;
}
.gs__browse:hover .gs__browse-arrow { transform: translateX(4px); }

@media (max-width: 640px) {
  .gs { padding: 28px 16px 72px; }
  .gs__title { font-size: 27px; }
}
</style>
