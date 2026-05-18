<script setup lang="ts">
import LandingLayout from '../_layouts/LandingLayout.vue'
import { BaseButton, BaseTag } from '../../components/common'

const FEATURES = [
  {
    category: 'UI Components',
    icon: '🧩',
    items: [
      'BaseButton — 7 variant, 3 size, loading, block',
      'BaseInput — prefix/suffix, clearable, autosize',
      'BaseModal — 5 size, focus trap, backdrop close',
      'BaseDrawer — 4 placement, drag handle',
      'BaseToast — queue, auto-dismiss, 4 type',
      'CommandPalette — fuzzy search, keyboard nav',
      'DataGridPro — 10k rows, pin, reorder, saved views',
      'FilterBuilder — AND/OR nested, URL serialize',
      'LogViewer — streaming, follow, search highlight',
    ],
  },
  {
    category: 'Chart System',
    icon: '📊',
    items: [
      'LineChart — multi-series, crosshair tooltip',
      'AreaChart — stacked / overlay mode',
      'BarChart — single / grouped series',
      'PieChart + DonutChart — slice hover, legend',
      'Sparkline — fill, dots, last marker',
      'Gauge — 270° arc, threshold color auto',
      'Heatmap — GitHub-style 26 tuần',
    ],
  },
  {
    category: 'Composables & Directives',
    icon: '⚙️',
    items: [
      'useTheme — system/light/dark, CSS data-theme',
      'useCan + v-can — RBAC runtime check',
      'useFlag + v-flag — feature flag với variant',
      'useOnline + OfflineBanner — mutation queue IndexedDB',
      'useShortcut — mod+k auto map cmd/ctrl',
      'useFocusTrap — modal/drawer/palette',
      'useOptimistic — rollback concurrent mutation',
      'useLiveQuery — WebSocket + polling backoff',
    ],
  },
  {
    category: 'Page Templates',
    icon: '📄',
    items: [
      '10 auth page — login, register, OTP, onboarding…',
      '7 error page — 404, 500, 403, 503, offline…',
      '10 dashboard — overview, analytics, CRM, IoT…',
      '20 app page — mailbox, chat, invoice, calendar…',
      '10 landing page — SaaS, API, blog, careers…',
      '10 WemakeUI page — admin, campaign, canvas…',
    ],
  },
]
</script>

<template>
  <LandingLayout>
    <section class="feat-hero">
      <h1 class="feat-title">Tất cả tính năng</h1>
      <p class="feat-desc">Từ atom đến page template — mọi thứ bạn cần trong một thư viện.</p>
    </section>

    <section class="feat-section">
      <div class="feat-inner">
        <div v-for="f in FEATURES" :key="f.category" class="feat-category">
          <div class="cat-header">
            <span class="cat-icon">{{ f.icon }}</span>
            <h2 class="cat-title">{{ f.category }}</h2>
            <span class="cat-count">{{ f.items.length }} mục</span>
          </div>
          <div class="feat-list">
            <div v-for="item in f.items" :key="item" class="feat-item">
              <span class="feat-check">✓</span>
              <span class="feat-name">{{ item }}</span>
            </div>
          </div>
        </div>

        <div class="feat-cta">
          <h2 class="cta-title">Sẵn sàng bắt đầu?</h2>
          <p class="cta-desc">Dùng thử showcase ngay — không cần cài đặt.</p>
          <div class="cta-actions">
            <BaseButton variant="primary" size="lg" tag="a" href="#/">Xem showcase</BaseButton>
            <BaseButton variant="secondary" size="lg" tag="a" href="#/auth/register">Đăng ký miễn phí</BaseButton>
          </div>
        </div>
      </div>
    </section>
  </LandingLayout>
</template>

<style scoped>
.feat-hero { padding: var(--wx-space-12) var(--wx-space-5) var(--wx-space-8); text-align: center; background: var(--wx-gradient-bg); }
.feat-title { font-size: var(--wx-fs-48); font-weight: 800; letter-spacing: var(--wx-tracking-tight); margin-bottom: var(--wx-space-3); }
.feat-desc { font-size: var(--wx-fs-18); color: var(--wx-content-secondary); margin: 0; }
.feat-section { padding: var(--wx-space-10) var(--wx-space-5); }
.feat-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--wx-space-8); }
.feat-category { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); overflow: hidden; }
.cat-header { display: flex; align-items: center; gap: var(--wx-space-3); padding: var(--wx-space-4) var(--wx-space-5); background: var(--wx-bg-sunken); border-bottom: 1px solid var(--wx-border-subtle); }
.cat-icon { font-size: 24px; }
.cat-title { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); margin: 0; flex: 1; }
.cat-count { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.feat-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1px; background: var(--wx-border-subtle); }
.feat-item { display: flex; align-items: flex-start; gap: var(--wx-space-2); padding: var(--wx-space-3) var(--wx-space-4); background: var(--wx-bg-base); }
.feat-check { color: var(--wx-status-success-text); font-weight: var(--wx-fw-bold); flex-shrink: 0; }
.feat-name { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); }
.feat-cta { text-align: center; padding: var(--wx-space-10); background: var(--wx-gradient-cta); border-radius: var(--wx-radius-2xl); display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-4); }
.cta-title { font-size: var(--wx-fs-32); font-weight: 800; color: white; margin: 0; }
.cta-desc { font-size: var(--wx-fs-16); color: rgba(255,255,255,0.8); margin: 0; }
.cta-actions { display: flex; gap: var(--wx-space-3); justify-content: center; flex-wrap: wrap; }
</style>
