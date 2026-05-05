<script setup lang="ts">
/**
 * Sitemap — overview "trang chủ" hiển thị bên trong DemoLayout.
 * Sidebar đã có ở DemoLayout, ở đây chỉ render cards phase tổng quan.
 */
import { RouterLink } from 'vue-router'
import PageHeader from '../../components/layout/PageHeader.vue'
import { phases } from './_phases-data'
</script>

<template>
  <div class="page">
    <main class="main">
      <PageHeader
        title="sitemap demo"
        description="menu cố định bên trái — click 1 mục để xem demo, menu vẫn giữ nguyên để dễ chuyển qua lại."
      />

      <div class="phases">
        <section
          v-for="p in phases"
          :key="p.n"
          class="phase-card"
          :data-status="p.status"
        >
          <header class="phase-head">
            <span class="phase-num">phase {{ p.n }}</span>
            <h2 class="phase-title">{{ p.title }}</h2>
            <span class="phase-badge" :data-status="p.status">
              {{ p.status === 'done' ? 'đã xong' : 'chưa làm' }}
            </span>
          </header>

          <ul class="route-list">
            <li v-for="r in p.routes" :key="r.path">
              <RouterLink :to="r.path" class="route-link">
                <span class="route-path">{{ r.path }}</span>
                <span class="route-label">{{ r.label }}</span>
                <span class="route-desc">{{ r.desc }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
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

.phases {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}

.phase-card {
  background: var(--wx-bg-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-4) var(--wx-space-5);
  box-shadow: var(--wx-shadow-md);
}
.phase-card[data-status="done"] {
  border-color: var(--wx-success-border);
}

.phase-head {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-3);
}
.phase-num {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  background: var(--wx-bg-sunken);
  padding: 2px 8px;
  border-radius: var(--wx-radius-sm);
}
.phase-title {
  margin: 0;
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-semibold);
}
.phase-badge {
  margin-left: auto;
  font-size: var(--wx-fs-12);
  padding: 2px 10px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-neutral-bg);
  color: var(--wx-neutral-text);
}
.phase-badge[data-status="done"] {
  background: var(--wx-success-bg);
  color: var(--wx-success-text);
}

.route-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}
.route-link {
  display: grid;
  grid-template-columns: 220px 1fr auto;
  gap: var(--wx-space-3);
  padding: var(--wx-space-2) var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  text-decoration: none;
  color: inherit;
  align-items: center;
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.route-link:hover { background: var(--wx-hover-bg); }
.route-path {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-link);
}
.route-label {
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-medium);
}
.route-desc {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  text-align: right;
}

@media (max-width: 768px) {
  .route-link { grid-template-columns: 1fr; }
  .route-desc { text-align: left; }
}
</style>
