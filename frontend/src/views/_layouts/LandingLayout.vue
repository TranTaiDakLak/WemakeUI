<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { BaseButton } from '../../components/common'
import { useTheme } from '../../ui-system/composables/useTheme'

const { toggleTheme: toggle } = useTheme()
const mobileOpen = ref(false)

const NAV = [
  { label: 'Tính năng', href: '#/landing/features' },
  { label: 'Giá',       href: '#/app/pricing' },
  { label: 'Blog',      href: '#/landing/blog' },
  { label: 'Tài liệu',  href: '#/landing/api' },
  { label: 'Liên hệ',   href: '#/landing/contact' },
]

const SUN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
const MENU_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
const X_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
</script>

<template>
  <div class="landing-wrap">
    <!-- topbar -->
    <header class="topnav">
      <div class="topnav-inner">
        <RouterLink to="/" class="brand">
          <span class="brand-logo" aria-hidden="true">W</span>
          <span class="brand-name">WemakeUI</span>
        </RouterLink>

        <nav class="nav-links" role="navigation">
          <a v-for="n in NAV" :key="n.label" :href="n.href" class="nav-link">{{ n.label }}</a>
        </nav>

        <div class="nav-actions">
          <button class="icon-btn" aria-label="Đổi giao diện" @click="toggle">
            <span v-html="SUN_ICON" />
          </button>
          <RouterLink to="/auth/login" class="nav-link">Đăng nhập</RouterLink>
          <BaseButton size="sm" variant="primary" tag="a" href="#/auth/register">
            Dùng miễn phí
          </BaseButton>
        </div>

        <button class="mobile-toggle" :aria-label="mobileOpen ? 'Đóng menu' : 'Mở menu'" @click="mobileOpen = !mobileOpen">
          <span v-html="mobileOpen ? X_ICON : MENU_ICON" />
        </button>
      </div>

      <!-- mobile drawer -->
      <Transition name="slide-down">
        <div v-if="mobileOpen" class="mobile-menu">
          <a v-for="n in NAV" :key="n.label" :href="n.href" class="mob-link" @click="mobileOpen = false">{{ n.label }}</a>
          <RouterLink to="/auth/login" class="mob-link" @click="mobileOpen = false">Đăng nhập</RouterLink>
          <BaseButton size="sm" variant="primary" block>Dùng miễn phí</BaseButton>
        </div>
      </Transition>
    </header>

    <!-- page content -->
    <main class="landing-main">
      <slot />
    </main>

    <!-- footer -->
    <footer class="landing-footer">
      <div class="footer-inner">
        <span class="footer-brand">WemakeUI © 2026</span>
        <nav class="footer-links">
          <a href="#/landing/policy" class="f-link">Chính sách</a>
          <a href="#/landing/contact" class="f-link">Liên hệ</a>
          <a href="#/landing/blog" class="f-link">Blog</a>
          <a href="#/landing/changelog" class="f-link">Changelog</a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing-wrap { min-height: 100vh; display: flex; flex-direction: column; background: var(--wx-bg-base); }

.topnav {
  position: sticky; top: 0; z-index: 100;
  background: color-mix(in srgb, var(--wx-bg-base) 85%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--wx-border-default);
}
.topnav-inner {
  max-width: 1200px; margin: 0 auto;
  padding: 0 var(--wx-space-5);
  height: 60px;
  display: flex; align-items: center; gap: var(--wx-space-5);
}

.brand { display: flex; align-items: center; gap: var(--wx-space-2); text-decoration: none; }
.brand-logo {
  width: 32px; height: 32px; border-radius: var(--wx-radius-md);
  background: var(--wx-gradient-button);
  color: white; font-weight: 800; font-size: 16px;
  display: inline-flex; align-items: center; justify-content: center;
}
.brand-name { font-weight: 700; font-size: var(--wx-fs-16); color: var(--wx-content-primary); }

.nav-links { display: flex; align-items: center; gap: var(--wx-space-4); margin-left: auto; }
.nav-link {
  font-size: var(--wx-fs-14); color: var(--wx-content-secondary);
  text-decoration: none; font-weight: 500;
  transition: color var(--wx-d-micro) var(--wx-ease-standard);
}
.nav-link:hover { color: var(--wx-content-primary); }

.nav-actions { display: flex; align-items: center; gap: var(--wx-space-3); margin-left: var(--wx-space-3); }

.icon-btn {
  width: 32px; height: 32px; border: none; background: transparent;
  color: var(--wx-content-secondary); border-radius: var(--wx-radius-md);
  cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
}
.icon-btn:hover { background: var(--wx-hover-bg); color: var(--wx-content-primary); }

.mobile-toggle {
  display: none; border: none; background: transparent;
  color: var(--wx-content-primary); cursor: pointer;
  width: 36px; height: 36px; border-radius: var(--wx-radius-md);
  align-items: center; justify-content: center;
}
.mobile-menu {
  display: flex; flex-direction: column; gap: var(--wx-space-2);
  padding: var(--wx-space-3) var(--wx-space-5);
  border-top: 1px solid var(--wx-border-default);
  background: var(--wx-bg-base);
}
.mob-link {
  font-size: var(--wx-fs-15); color: var(--wx-content-primary);
  text-decoration: none; padding: var(--wx-space-2) 0;
  border-bottom: 1px solid var(--wx-border-subtle);
}

.slide-down-enter-active, .slide-down-leave-active { transition: all var(--wx-d-normal) var(--wx-ease-decelerate); }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-8px); opacity: 0; }

.landing-main { flex: 1; }

.landing-footer { border-top: 1px solid var(--wx-border-subtle); background: var(--wx-bg-sunken); }
.footer-inner {
  max-width: 1200px; margin: 0 auto;
  padding: var(--wx-space-5) var(--wx-space-5);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--wx-space-3);
}
.footer-brand { font-size: var(--wx-fs-13); color: var(--wx-content-muted); font-weight: 600; }
.footer-links { display: flex; gap: var(--wx-space-4); }
.f-link { font-size: var(--wx-fs-13); color: var(--wx-content-muted); text-decoration: none; }
.f-link:hover { color: var(--wx-content-primary); }

@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .mobile-toggle { display: inline-flex; margin-left: auto; }
}
</style>
