<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() { scrolled.value = window.scrollY > 20 }
import { onMounted, onUnmounted } from 'vue'
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const NAV = [
  { label: 'Trang chủ', to: '/home' },
  { label: 'Sản phẩm',  to: '/products' },
  { label: 'FAQs',      to: '/faqs' },
  { label: 'Đối tác',   to: '/partners' },
  { label: 'Liên hệ',   to: '/contact' },
]

function isActive(to: string) {
  return route.path === to || (to !== '/home' && route.path.startsWith(to))
}
</script>

<template>
  <header class="mkt-header" :class="{ 'mkt-header--scrolled': scrolled }">
    <div class="mkt-header__inner">

      <!-- Logo -->
      <RouterLink to="/home" class="mkt-logo">
        <span class="mkt-logo__mark">W</span>
        <span class="mkt-logo__text">emake</span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="mkt-nav" aria-label="Điều hướng chính">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="mkt-nav__link"
          :class="{ 'mkt-nav__link--active': isActive(item.to) }"
        >{{ item.label }}</RouterLink>
      </nav>

      <!-- Desktop CTA -->
      <div class="mkt-header__cta">
        <RouterLink to="/auth/login" class="mkt-btn mkt-btn--ghost">Đăng nhập</RouterLink>
        <RouterLink to="/auth/register" class="mkt-btn mkt-btn--primary">Dùng thử miễn phí</RouterLink>
      </div>

      <!-- Mobile toggle -->
      <button
        class="mkt-mobile-toggle"
        :aria-expanded="mobileOpen"
        aria-label="Mở menu"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="mkt-hamburger" :class="{ 'mkt-hamburger--open': mobileOpen }" />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="wx-slide-down">
      <div v-if="mobileOpen" class="mkt-mobile-menu">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="mkt-mobile-link"
          :class="{ 'mkt-mobile-link--active': isActive(item.to) }"
          @click="mobileOpen = false"
        >{{ item.label }}</RouterLink>
        <div class="mkt-mobile-cta">
          <RouterLink to="/auth/login" class="mkt-btn mkt-btn--ghost mkt-btn--block" @click="mobileOpen = false">Đăng nhập</RouterLink>
          <RouterLink to="/auth/register" class="mkt-btn mkt-btn--primary mkt-btn--block" @click="mobileOpen = false">Dùng thử</RouterLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* ── Wrapper ── */
.mkt-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: var(--wx-z-header);
  background: var(--wx-surface-base);
  border-bottom: 1px solid var(--wx-border-subtle);
  transition:
    box-shadow var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard);
}

.mkt-header--scrolled {
  box-shadow: var(--wx-shadow-md);
  border-color: var(--wx-border-default);
}

/* ── Inner ── */
.mkt-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--wx-space-6);
  height: 64px;
  display: flex;
  align-items: center;
  gap: var(--wx-space-8);
}

/* ── Logo ── */
.mkt-logo {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  text-decoration: none;
  flex-shrink: 0;
}

.mkt-logo__mark {
  width: 32px;
  height: 32px;
  border-radius: var(--wx-radius-lg);
  background: var(--wx-brand-primary);
  color: #fff;
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -1px;
  flex-shrink: 0;
}

.mkt-logo__text {
  font-size: var(--wx-fs-20);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-primary);
  letter-spacing: var(--wx-tracking-tight);
}

/* ── Desktop nav ── */
.mkt-nav {
  display: none;
  flex: 1;
  align-items: center;
  gap: var(--wx-space-1);
}
@media (min-width: 768px) { .mkt-nav { display: flex; } }

.mkt-nav__link {
  padding: var(--wx-space-2) var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
  text-decoration: none;
  transition: background var(--wx-d-fast), color var(--wx-d-fast);
}

.mkt-nav__link:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}

.mkt-nav__link--active {
  color: var(--wx-brand-primary);
  background: var(--wx-brand-50);
  font-weight: var(--wx-fw-semibold);
}

/* ── Desktop CTA ── */
.mkt-header__cta {
  display: none;
  align-items: center;
  gap: var(--wx-space-2);
  margin-left: auto;
}
@media (min-width: 768px) { .mkt-header__cta { display: flex; } }

/* ── Mobile toggle ── */
.mkt-mobile-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  cursor: pointer;
  margin-left: auto;
  border-radius: var(--wx-radius-md);
}
@media (min-width: 768px) { .mkt-mobile-toggle { display: none; } }

.mkt-hamburger {
  position: relative;
  display: block;
  width: 20px;
  height: 2px;
  background: var(--wx-text-primary);
  border-radius: 2px;
  transition: background var(--wx-d-fast);
}
.mkt-hamburger::before,
.mkt-hamburger::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: inherit;
  border-radius: 2px;
  transition: transform var(--wx-d-normal);
}
.mkt-hamburger::before { top: -6px; }
.mkt-hamburger::after  { top: 6px; }
.mkt-hamburger--open { background: transparent; }
.mkt-hamburger--open::before { transform: translateY(6px) rotate(45deg); }
.mkt-hamburger--open::after  { transform: translateY(-6px) rotate(-45deg); }

/* ── Mobile menu ── */
.mkt-mobile-menu {
  background: var(--wx-surface-base);
  border-top: 1px solid var(--wx-border-subtle);
  padding: var(--wx-space-4) var(--wx-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}

.mkt-mobile-link {
  padding: var(--wx-space-2) var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
  text-decoration: none;
  transition: background var(--wx-d-fast), color var(--wx-d-fast);
}

.mkt-mobile-link:hover,
.mkt-mobile-link--active {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}

.mkt-mobile-link--active {
  color: var(--wx-brand-primary);
  background: var(--wx-brand-50);
}

.mkt-mobile-cta {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  padding-top: var(--wx-space-3);
  border-top: 1px solid var(--wx-border-subtle);
  margin-top: var(--wx-space-2);
}

/* ── Link buttons — match wx-btn visual style ── */
.mkt-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--wx-space-2) var(--wx-space-4);
  border-radius: var(--wx-radius-lg);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    box-shadow var(--wx-d-fast) var(--wx-ease-standard),
    transform   var(--wx-d-fast) var(--wx-ease-standard),
    color       var(--wx-d-fast) var(--wx-ease-standard);
}

.mkt-btn--primary {
  background: var(--wx-brand-primary);
  color: #fff;
  border-color: var(--wx-brand-primary);
}
.mkt-btn--primary:hover {
  background: var(--wx-brand-700);
  border-color: var(--wx-brand-700);
  transform: translateY(-1px);
  box-shadow: var(--wx-shadow-brand);
}

.mkt-btn--ghost {
  background: transparent;
  color: var(--wx-text-secondary);
  border-color: var(--wx-border-default);
}
.mkt-btn--ghost:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}

.mkt-btn--block { width: 100%; }
</style>
