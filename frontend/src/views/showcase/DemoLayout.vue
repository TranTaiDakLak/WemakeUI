<script setup lang="ts">
/**
 * Demo layout — sidebar cố định bên trái + router-view bên phải.
 * Click route trong sidebar không reload menu, chỉ đổi nội dung.
 */
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { phases } from './_phases-data'

const collapsed = ref(false)

function toggleSidebar() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div class="dl" :class="{ 'dl--collapsed': collapsed }">
    <aside class="dl-sidebar">
      <div class="dl-sidebar__head">
        <RouterLink to="/" class="dl-brand">
          <span class="dl-brand__icon">⚡</span>
          <div v-if="!collapsed" class="dl-brand__text">
            <span class="dl-brand__name">WemakeUI</span>
            <span class="dl-brand__sub">showcase</span>
          </div>
        </RouterLink>
        <button
          type="button"
          class="dl-collapse-btn"
          :aria-label="collapsed ? 'Mở rộng menu' : 'Thu gọn menu'"
          @click="toggleSidebar"
        >
          {{ collapsed ? '›' : '‹' }}
        </button>
      </div>

      <nav class="dl-nav" :aria-label="'Showcase navigation'">
        <RouterLink
          to="/"
          class="dl-route dl-route--home"
          active-class="dl-route--active"
          exact-active-class="dl-route--active"
        >
          <span class="dl-route__icon">⌂</span>
          <span v-if="!collapsed" class="dl-route__label">sitemap</span>
        </RouterLink>

        <div v-for="p in phases" :key="p.n" class="dl-phase">
          <header v-if="!collapsed" class="dl-phase__head">
            <span class="dl-phase__num">phase {{ p.n }}</span>
            <span class="dl-phase__title">{{ p.title }}</span>
            <span class="dl-phase__badge" :data-status="p.status">
              {{ p.status === 'done' ? '✓' : '…' }}
            </span>
          </header>
          <div v-else class="dl-phase__divider">{{ p.n }}</div>

          <ul class="dl-phase__routes">
            <li v-for="r in p.routes" :key="r.path">
              <RouterLink
                :to="r.path"
                class="dl-route"
                active-class="dl-route--active"
                :title="collapsed ? r.label : ''"
              >
                <span class="dl-route__bullet">•</span>
                <span v-if="!collapsed" class="dl-route__label">{{ r.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <footer v-if="!collapsed" class="dl-sidebar__foot">
        <RouterLink to="/legacy" class="dl-foot-link">
          → Showcase v0 (legacy)
        </RouterLink>
      </footer>
    </aside>

    <main class="dl-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.dl {
  display: flex;
  min-height: 100vh;
  background: var(--wx-bg-sunken, var(--wx-surface-sunken));
}

/* ── Sidebar ─────────────────────────────────────── */
.dl-sidebar {
  width: 272px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--wx-bg-base, var(--wx-surface-base));
  border-right: 1px solid var(--wx-border-default);
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow: hidden;
  transition: width var(--wx-d-normal, 250ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
}

.dl--collapsed .dl-sidebar {
  width: 64px;
}

.dl-sidebar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--wx-border-subtle);
  flex-shrink: 0;
  min-height: 56px;
}

.dl-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  flex: 1;
  min-width: 0;
}

.dl-brand__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-gradient-button);
  color: var(--wx-text-inverse);
  font-size: 16px;
  flex-shrink: 0;
}

.dl-brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  min-width: 0;
}

.dl-brand__name {
  font-size: 14px;
  font-weight: 700;
  color: var(--wx-text-primary);
}

.dl-brand__sub {
  font-size: 11px;
  color: var(--wx-text-muted);
}

.dl-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  color: var(--wx-text-muted);
  border-radius: var(--wx-radius-sm);
  font-size: 14px;
  cursor: pointer;
  font-family: var(--wx-font-primary);
  transition: all var(--wx-d-fast, 150ms);
  flex-shrink: 0;
}

.dl-collapse-btn:hover {
  color: var(--wx-text-primary);
  border-color: var(--wx-brand-primary);
}

/* Nav */
.dl-nav {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dl-phase {
  padding: 4px 0;
}

.dl-phase__head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px 4px;
}

.dl-phase__num {
  font-family: var(--wx-font-mono);
  font-size: 10px;
  color: var(--wx-text-muted);
  background: var(--wx-surface-sunken);
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  flex-shrink: 0;
}

.dl-phase__title {
  font-size: 11px;
  font-weight: 600;
  color: var(--wx-text-secondary);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dl-phase__badge {
  font-size: 11px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--wx-radius-full);
  flex-shrink: 0;
  background: var(--wx-neutral-bg);
  color: var(--wx-neutral-text);
}

.dl-phase__badge[data-status="done"] {
  background: var(--wx-success-bg);
  color: var(--wx-success-text);
}

.dl-phase__divider {
  font-family: var(--wx-font-mono);
  font-size: 10px;
  color: var(--wx-text-muted);
  text-align: center;
  padding: 4px 0 2px;
  border-top: 1px solid var(--wx-border-subtle);
  margin: 4px 8px;
}

.dl-phase__routes {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.dl-route {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px 7px 20px;
  text-decoration: none;
  color: var(--wx-text-secondary);
  font-size: 12px;
  font-family: var(--wx-font-primary);
  border-left: 2px solid transparent;
  transition: all var(--wx-d-fast, 150ms);
  white-space: nowrap;
  overflow: hidden;
}

.dl--collapsed .dl-route {
  justify-content: center;
  padding: 8px 0;
}

.dl-route--home {
  padding: 10px 14px;
  margin-bottom: 4px;
  font-weight: 600;
  border-bottom: 1px solid var(--wx-border-subtle);
  color: var(--wx-text-primary);
}

.dl-route__icon {
  font-size: 14px;
  flex-shrink: 0;
}

.dl-route__bullet {
  color: var(--wx-text-muted);
  font-size: 8px;
  flex-shrink: 0;
}

.dl-route__label {
  text-overflow: ellipsis;
  overflow: hidden;
}

.dl-route:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}

.dl-route--active {
  background: var(--wx-info-bg);
  color: var(--wx-brand-primary);
  font-weight: 600;
  border-left-color: var(--wx-brand-primary);
}

.dl-route--active .dl-route__bullet {
  color: var(--wx-brand-primary);
}

/* Footer */
.dl-sidebar__foot {
  padding: 12px 14px;
  border-top: 1px solid var(--wx-border-subtle);
  flex-shrink: 0;
}

.dl-foot-link {
  font-size: 11px;
  color: var(--wx-text-link);
  text-decoration: none;
}

.dl-foot-link:hover {
  text-decoration: underline;
}

/* Main content */
.dl-main {
  flex: 1;
  min-width: 0;
  overflow-x: hidden;
}

/* Mobile — hide sidebar */
@media (max-width: 768px) {
  .dl-sidebar {
    width: 64px;
  }
  .dl-collapse-btn {
    display: none;
  }
  .dl-phase__head {
    display: none;
  }
  .dl-phase__divider {
    display: block;
  }
  .dl-route {
    justify-content: center;
    padding: 8px 0;
  }
  .dl-route__label,
  .dl-brand__text,
  .dl-sidebar__foot {
    display: none;
  }
}
</style>
