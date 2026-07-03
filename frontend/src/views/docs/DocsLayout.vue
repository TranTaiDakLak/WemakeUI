<script setup lang="ts">
/**
 * DocsLayout — vỏ cho hệ thống tài liệu: top bar + sidebar (registry) + nội dung.
 * Sidebar lấy dữ liệu từ `_registry.ts` nên thêm trang docs là tự xuất hiện.
 */
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useTheme } from '../../ui-system/composables/useTheme'
import { docCategories } from './_registry'

const { isDark, toggleColorScheme } = useTheme()
const sidebarOpen = ref(false)

const GITHUB_URL = 'https://github.com/TranTaiDakLak/WemakeUI'
</script>

<template>
  <div class="docs" :class="{ 'docs--open': sidebarOpen }">
    <!-- ── Top bar ─────────────────────────────────────── -->
    <header class="docs-topbar">
      <button class="docs-burger" type="button" aria-label="Menu" @click="sidebarOpen = !sidebarOpen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <RouterLink to="/" class="docs-brand">
        <img src="/logo.png" alt="WemakeUI" class="docs-brand__logo" />
        WemakeUI
      </RouterLink>

      <nav class="docs-nav">
        <RouterLink to="/docs" class="docs-nav__link">Tài liệu</RouterLink>
        <RouterLink to="/lab" class="docs-nav__link">Demo Lab</RouterLink>
      </nav>

      <div class="docs-actions">
        <button class="docs-icon-btn" type="button" :aria-label="isDark ? 'Chế độ sáng' : 'Chế độ tối'" @click="toggleColorScheme">
          <svg v-if="!isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <a :href="GITHUB_URL" target="_blank" rel="noopener" class="docs-icon-btn" aria-label="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56v-2c-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.3-5.47-5.79 0-1.28.47-2.33 1.24-3.15-.13-.3-.54-1.5.11-3.14 0 0 1.01-.32 3.3 1.2a11.6 11.6 0 0 1 6 0c2.29-1.52 3.3-1.2 3.3-1.2.65 1.64.24 2.84.12 3.14.77.82 1.23 1.87 1.23 3.15 0 4.5-2.81 5.48-5.49 5.77.43.36.81 1.09.81 2.2v3.26c0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z"/></svg>
        </a>
      </div>
    </header>

    <!-- ── Sidebar ─────────────────────────────────────── -->
    <aside class="docs-sidebar" @click="sidebarOpen = false">
      <nav class="docs-side-nav">
        <div class="docs-side-group">
          <span class="docs-side-title">Bắt đầu</span>
          <RouterLink to="/docs" class="docs-side-link" exact-active-class="is-active">Giới thiệu &amp; Cài đặt</RouterLink>
        </div>

        <div v-for="cat in docCategories" :key="cat.label" class="docs-side-group">
          <span class="docs-side-title">{{ cat.label }}</span>
          <RouterLink
            v-for="e in cat.entries"
            :key="e.slug"
            :to="`/docs/${e.slug}`"
            class="docs-side-link"
            active-class="is-active"
          >{{ e.name }}</RouterLink>
        </div>
      </nav>
    </aside>

    <div class="docs-scrim" @click="sidebarOpen = false" />

    <!-- ── Content ─────────────────────────────────────── -->
    <main class="docs-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.docs {
  --topbar-h: 56px;
  --sidebar-w: 256px;
  min-height: 100vh;
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
}

/* ── Top bar ── */
.docs-topbar {
  position: fixed;
  inset: 0 0 auto 0;
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  background: color-mix(in srgb, var(--wx-surface-base) 86%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--wx-border-default);
  z-index: var(--wx-z-header, 200);
}
.docs-burger {
  display: none;
  background: none;
  border: none;
  color: var(--wx-text-secondary);
  cursor: pointer;
  padding: 4px;
}
.docs-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--wx-text-primary);
  text-decoration: none;
}
.docs-brand__logo {
  width: 26px;
  height: 26px;
  object-fit: contain;
  display: block;
}
.docs-nav {
  display: flex;
  gap: 4px;
  margin-left: 12px;
}
.docs-nav__link {
  padding: 6px 12px;
  border-radius: var(--wx-radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--wx-text-secondary);
  text-decoration: none;
  transition: background var(--wx-d-fast, 150ms) ease, color var(--wx-d-fast, 150ms) ease;
}
.docs-nav__link:hover { background: var(--wx-surface-sunken); color: var(--wx-text-primary); }
.docs-nav__link.router-link-active { color: var(--wx-brand-primary); }
.docs-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}
.docs-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  color: var(--wx-text-secondary);
  cursor: pointer;
  text-decoration: none;
  transition: background var(--wx-d-fast, 150ms) ease, color var(--wx-d-fast, 150ms) ease, border-color var(--wx-d-fast, 150ms) ease;
}
.docs-icon-btn:hover {
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
  border-color: var(--wx-border-focus);
}

/* ── Sidebar ── */
.docs-sidebar {
  position: fixed;
  top: var(--topbar-h);
  bottom: 0;
  left: 0;
  width: var(--sidebar-w);
  overflow-y: auto;
  padding: 24px 14px 60px;
  border-right: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  z-index: var(--wx-z-sticky, 100);
}
.docs-side-group { margin-bottom: 22px; }
.docs-side-title {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
  padding: 0 10px;
  margin-bottom: 8px;
}
.docs-side-link {
  display: block;
  padding: 7px 10px;
  border-radius: var(--wx-radius-md);
  font-size: 14px;
  color: var(--wx-text-secondary);
  text-decoration: none;
  transition: background var(--wx-d-fast, 150ms) ease, color var(--wx-d-fast, 150ms) ease;
}
.docs-side-link:hover { background: var(--wx-surface-sunken); color: var(--wx-text-primary); }
.docs-side-link.is-active {
  background: color-mix(in srgb, var(--wx-brand-primary) 12%, transparent);
  color: var(--wx-brand-primary);
  font-weight: 600;
}

/* ── Main ── */
.docs-main {
  margin-left: var(--sidebar-w);
  padding-top: var(--topbar-h);
  min-height: 100vh;
}

.docs-scrim {
  display: none;
  position: fixed;
  inset: var(--topbar-h) 0 0 0;
  background: var(--wx-surface-overlay, rgba(0,0,0,0.4));
  z-index: calc(var(--wx-z-sticky, 100) - 1);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .docs-burger { display: inline-flex; }
  .docs-nav { display: none; }
  .docs-sidebar {
    transform: translateX(-100%);
    transition: transform var(--wx-d-normal, 250ms) var(--wx-ease-standard, ease);
    box-shadow: var(--wx-shadow-xl);
  }
  .docs--open .docs-sidebar { transform: translateX(0); }
  .docs--open .docs-scrim { display: block; }
  .docs-main { margin-left: 0; }
}
</style>
