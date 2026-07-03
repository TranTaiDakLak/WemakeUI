<script setup lang="ts">
/**
 * /showcase/apps — "Bộ giao diện hoàn chỉnh".
 * Mỗi card là MỘT sản phẩm cấp app (app shell + navigation trỏ đúng route),
 * khác với Template Gallery (mỗi card = 1 trang lẻ).
 */
import { RouterLink } from 'vue-router'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import { BaseButton } from '../../components/common'
import { appTemplates, totalAppTemplates, totalAppPages } from './appTemplates'
</script>

<template>
  <div class="apps-page">
    <AppTopbar title="WemakeUI" subtitle="bộ giao diện hoàn chỉnh" />

    <main class="apps-main">
      <PageHeader
        title="Bộ giao diện hoàn chỉnh"
        :description="`${totalAppTemplates} sản phẩm cấp app — mỗi bộ có app shell + navigation trỏ đúng page, gồm ${totalAppPages} trang. Bấm 'Mở app' để dùng thật.`"
      />

      <div class="apps-grid">
        <article
          v-for="app in appTemplates"
          :id="app.id"
          :key="app.id"
          class="app-card"
          :style="{ '--accent': app.accent }"
        >
          <div class="app-card__top">
            <span class="app-card__icon">{{ app.icon }}</span>
            <div class="app-card__head">
              <h2 class="app-card__name">{{ app.name }}</h2>
              <span class="app-card__cat">{{ app.category }}</span>
            </div>
            <span class="app-card__pages">{{ app.pages }} trang</span>
          </div>

          <p class="app-card__desc">{{ app.desc }}</p>

          <ul class="app-card__highlights">
            <li v-for="h in app.highlights" :key="h">{{ h }}</li>
          </ul>

          <div class="app-card__meta">
            <span class="app-card__kind" :class="`app-card__kind--${app.kind}`">
              {{ app.kind === 'app' ? '◉ App · có navigation' : '▢ Bộ màn độc lập' }}
            </span>
            <span class="app-card__shell">⌗ {{ app.shell }}</span>
          </div>

          <!-- App thật: vào entry rồi điều hướng bằng nav của app -->
          <div v-if="app.kind === 'app'" class="app-card__actions">
            <RouterLink :to="app.entry" class="app-card__open">
              <BaseButton variant="primary" size="sm" block>Mở app →</BaseButton>
            </RouterLink>
            <code class="app-card__entry">{{ app.entry }}</code>
          </div>

          <!-- Collection: các màn độc lập, mở từng màn -->
          <div v-else class="app-card__screens">
            <span class="app-card__screens-label">Mở từng màn ({{ app.screens?.length }}):</span>
            <div class="app-card__screens-list">
              <RouterLink
                v-for="sc in app.screens"
                :key="sc.path"
                :to="sc.path"
                class="app-card__screen"
              >{{ sc.label }}</RouterLink>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
.apps-page {
  min-height: 100vh;
}
.apps-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
  margin-top: 8px;
}

.app-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid var(--wx-border-default);
  border-top: 3px solid var(--accent);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-elevated);
  scroll-margin-top: 80px;
  transition: transform var(--wx-d-fast, 150ms) ease, box-shadow var(--wx-d-fast, 150ms) ease, border-color var(--wx-d-fast, 150ms) ease;
}
.app-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--wx-shadow-lg);
  border-color: var(--accent);
}
.app-card:target {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent);
}

.app-card__top {
  display: flex;
  align-items: center;
  gap: 12px;
}
.app-card__icon {
  font-size: 26px;
  line-height: 1;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--wx-radius-lg);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}
.app-card__head { flex: 1; min-width: 0; }
.app-card__name {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--wx-text-primary);
}
.app-card__cat {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}
.app-card__pages {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--wx-surface-sunken);
  color: var(--wx-text-secondary);
}

.app-card__desc {
  margin: 14px 0 12px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--wx-text-secondary);
  flex: 1;
}

.app-card__highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
}
.app-card__highlights li {
  font-size: 11.5px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-secondary);
  border: 1px solid var(--wx-border-subtle);
}

.app-card__meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 14px;
}
.app-card__kind {
  font-size: 11.5px;
  font-weight: 600;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 999px;
}
.app-card__kind--app {
  color: var(--wx-success-text, #15803d);
  background: var(--wx-success-bg, #dcfce7);
}
.app-card__kind--collection {
  color: var(--wx-text-secondary);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-default);
}
.app-card__shell {
  font-family: var(--wx-font-mono);
  font-size: 11.5px;
  color: var(--wx-text-muted);
}

/* ── Collection: danh sách màn ── */
.app-card__screens-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--wx-text-secondary);
  margin-bottom: 8px;
}
.app-card__screens-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.app-card__screen {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  color: var(--wx-text-secondary);
  text-decoration: none;
  transition: background var(--wx-d-fast, 150ms) ease, color var(--wx-d-fast, 150ms) ease, border-color var(--wx-d-fast, 150ms) ease;
}
.app-card__screen:hover {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  color: var(--accent);
  border-color: var(--accent);
}

.app-card__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.app-card__open { flex: 1; text-decoration: none; }
.app-card__entry {
  font-family: var(--wx-font-mono);
  font-size: 11px;
  color: var(--wx-text-muted);
  white-space: nowrap;
}

@media (max-width: 560px) {
  .apps-grid { grid-template-columns: 1fr; }
  .apps-main { padding: 0 14px 60px; }
}
</style>
