<script setup lang="ts">
/**
 * Phase 2 — Nav showcase
 *  Tabs · Accordion · Breadcrumb · Pagination · CommandPalette
 */
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import {
  BaseTabs, BaseAccordion, BaseBreadcrumb, BasePagination,
  CommandPalette, BaseButton,
  type PaletteItem,
} from '../../components/common'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()

/* ── tabs ── */
const tab = ref('tổng quan')
const tabs = [
  { key: 'tổng quan',    label: 'tổng quan' },
  { key: 'thành viên',   label: 'thành viên' },
  { key: 'thanh toán',   label: 'thanh toán' },
  { key: 'tích hợp',     label: 'tích hợp' },
  { key: 'nâng cao',     label: 'nâng cao', disabled: true },
]

/* ── accordion ── */
const faq = [
  { key: 'q1', title: 'WemakeUI là gì?',           description: 'mô tả ngắn' },
  { key: 'q2', title: 'có hỗ trợ dark mode không?', description: 'có, qua data-wx-theme' },
  { key: 'q3', title: 'tree-shake được không?',     description: 'có, named export' },
  { key: 'q4', title: 'tính năng beta',             disabled: true },
]

/* ── breadcrumb ── */
const crumbs = [
  { label: 'trang chủ',   to: '/' },
  { label: 'cài đặt',     to: '/settings' },
  { label: 'thành viên',  to: '/settings/members' },
  { label: 'mời mới' },
]

/* ── pagination ── */
const page1 = ref(3)
const page2 = ref(7)
const page3 = ref(1)
const lmLoading = ref(false)
function onLoadMore() {
  lmLoading.value = true
  setTimeout(() => {
    lmLoading.value = false
    page3.value++
    showToast('success', `đã tải trang ${page3.value}`)
  }, 800)
}

/* ── command palette ── */
const paletteShow = ref(false)
const paletteItems: PaletteItem[] = [
  { id: 'home',    label: 'trang chủ',         group: 'điều hướng', shortcut: 'g h', action: () => showToast('info', 'điều hướng → trang chủ') },
  { id: 'settings',label: 'cài đặt',           group: 'điều hướng', shortcut: 'g s', action: () => showToast('info', 'điều hướng → cài đặt') },
  { id: 'members', label: 'thành viên',        group: 'điều hướng',                  action: () => showToast('info', 'điều hướng → thành viên') },
  { id: 'create',  label: 'tạo mới',           group: 'hành động',  shortcut: 'c',   action: () => showToast('success', 'mở form tạo mới') },
  { id: 'invite',  label: 'mời thành viên',    group: 'hành động',                   action: () => showToast('success', 'mở form mời') },
  { id: 'export',  label: 'xuất file',         group: 'hành động',                   action: () => showToast('info', 'đang xuất…') },
  { id: 'theme',   label: 'đổi theme',         group: 'cài đặt',    shortcut: 't',   action: () => showToast('info', 'đổi theme') },
  { id: 'help',    label: 'trợ giúp',          group: 'cài đặt',    shortcut: '?',   action: () => showToast('info', 'mở trợ giúp') },
  { id: 'logout',  label: 'đăng xuất',         group: 'cài đặt',                     action: () => showToast('warning', 'đã đăng xuất') },
]
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="phase 2 — navigation" />
    <main class="main">
      <PageHeader
        title="phase 2 — navigation"
        description="tabs · accordion · breadcrumb · pagination · command palette. bấm cmd/ctrl+k bất kỳ đâu để mở palette."
      />

      <!-- ── 1. Tabs ─── -->
      <section class="card">
        <h2 class="h">1. tabs — underline indicator</h2>
        <BaseTabs v-model="tab" :tabs="tabs" />
        <div class="tab-panel">
          <p class="muted">đang chọn: <code>{{ tab }}</code></p>
        </div>
      </section>

      <!-- ── 2. Accordion ─── -->
      <section class="card">
        <h2 class="h">2. accordion — single (mặc định) + multi</h2>

        <h3 class="sub">single open</h3>
        <BaseAccordion :items="faq" :default-open="['q1']">
          <template #q1>
            <p>WemakeUI là bộ UI kit Vue 3 cross-platform.</p>
          </template>
          <template #q2>
            <p>có. dùng <code>useTheme()</code> với 3 mode: system / light / dark.</p>
          </template>
          <template #q3>
            <p>có. tất cả component đều named export, không side-effect ngoài CSS.</p>
          </template>
        </BaseAccordion>

        <h3 class="sub">multi open</h3>
        <BaseAccordion :items="faq.slice(0, 3)" multi :default-open="['q1', 'q2']">
          <template #q1><p>nội dung 1.</p></template>
          <template #q2><p>nội dung 2.</p></template>
          <template #q3><p>nội dung 3.</p></template>
        </BaseAccordion>
      </section>

      <!-- ── 3. Breadcrumb ─── -->
      <section class="card">
        <h2 class="h">3. breadcrumb — 3 separator</h2>

        <h3 class="sub">chevron (mặc định)</h3>
        <BaseBreadcrumb :items="crumbs" />

        <h3 class="sub">slash</h3>
        <BaseBreadcrumb :items="crumbs" separator="slash" />

        <h3 class="sub">dot</h3>
        <BaseBreadcrumb :items="crumbs" separator="dot" />
      </section>

      <!-- ── 4. Pagination ─── -->
      <section class="card">
        <h2 class="h">4. pagination — 3 variant</h2>

        <h3 class="sub">full — page numbers + ellipsis</h3>
        <BasePagination v-model="page1" :total="200" :page-size="20" />

        <h3 class="sub">full — many pages, siblings=1</h3>
        <BasePagination v-model="page2" :total="500" :page-size="20" />

        <h3 class="sub">compact — "x / y"</h3>
        <BasePagination v-model="page1" :total="200" :page-size="20" variant="compact" />

        <h3 class="sub">load-more — infinite scroll</h3>
        <BasePagination
          v-model="page3"
          :total="200"
          :page-size="20"
          variant="load-more"
          :loading="lmLoading"
          @load-more="onLoadMore"
        />
      </section>

      <!-- ── 5. Command palette ─── -->
      <section class="card">
        <h2 class="h">5. command palette — cmd+k / ctrl+k</h2>
        <p class="muted">bấm phím tắt (toàn cục) hoặc nút bên dưới. ↑↓ điều hướng, enter chọn, esc đóng.</p>
        <div class="row">
          <BaseButton variant="primary" @click="paletteShow = true">mở palette (cmd+k)</BaseButton>
          <span class="kbd-hint">
            <kbd>cmd</kbd>+<kbd>k</kbd> hoặc <kbd>ctrl</kbd>+<kbd>k</kbd>
          </span>
        </div>
        <CommandPalette
          v-model:show="paletteShow"
          :items="paletteItems"
          @select="(it) => showToast('success', `đã chọn: ${it.label}`)"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--wx-bg-sunken);
  color: var(--wx-content-primary);
  font-family: var(--wx-font-primary);
}
.main {
  max-width: 1080px;
  margin: 0 auto;
  padding: var(--wx-space-5) var(--wx-space-4) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}
.card {
  background: var(--wx-bg-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-5);
  box-shadow: var(--wx-shadow-md);
}
.h {
  margin: 0 0 var(--wx-space-3);
  font-size: var(--wx-fs-20);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}
.sub {
  margin: var(--wx-space-4) 0 var(--wx-space-2);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-content-secondary);
}
.sub:first-of-type { margin-top: 0; }
.muted {
  color: var(--wx-content-secondary);
  font-size: var(--wx-fs-14);
  margin: 0 0 var(--wx-space-3);
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-3);
  align-items: center;
}
code {
  font-family: var(--wx-font-mono);
  background: var(--wx-bg-sunken);
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  font-size: var(--wx-fs-12);
}

.tab-panel {
  margin-top: var(--wx-space-3);
  padding: var(--wx-space-4);
  background: var(--wx-bg-sunken);
  border-radius: var(--wx-radius-md);
}

.kbd-hint {
  font-size: var(--wx-fs-13);
  color: var(--wx-content-secondary);
}
.kbd-hint kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  font-family: var(--wx-font-mono);
  font-size: 12px;
  background: var(--wx-bg-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-sm);
  margin: 0 2px;
  color: var(--wx-content-primary);
}
</style>
