<script setup lang="ts">
/**
 * LandingHeader — header sticky của trang chủ: tile logo + wordmark, nav cuộn mượt tới
 * section, nút đăng nhập / dùng thử, menu mobile. Đổ bóng khi cuộn.
 * Layout lấy từ HomeHeader của MindAds (cao 68px, viền đáy mảnh, burger < 900px).
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useTheme } from '../../../ui-system/composables/useTheme'
import { BaseButton } from '../../../components/common'
import { BRAND, GITHUB_URL, NAV_LINKS, type NavLink } from './landing-content'

const router = useRouter()
const { isDark, toggleColorScheme } = useTheme()

const menuOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  const v = window.scrollY > 16
  if (v !== scrolled.value) scrolled.value = v
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('scroll', onScroll)
})

function go(link: NavLink) {
  menuOpen.value = false
  if (link.target.startsWith('/')) {
    void router.push(link.target)
    return
  }
  if (typeof document === 'undefined') return
  document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <header class="lh" :class="{ 'lh--scrolled': scrolled }" @keydown.esc="menuOpen = false">
    <div class="lh__inner">
      <RouterLink to="/" class="lh__brand" :aria-label="BRAND.name">
        <span class="lh__tile"><img src="/logo.png" :alt="BRAND.name" width="26" height="26" /></span>
        <span class="lh__brand-text">
          <span class="lh__name">{{ BRAND.name }}</span>
          <span class="lh__tag">{{ BRAND.tagline }}</span>
        </span>
      </RouterLink>

      <nav class="lh__nav" aria-label="Điều hướng chính">
        <button v-for="l in NAV_LINKS" :key="l.target" type="button" class="lh__link" @click="go(l)">
          {{ l.label }}
        </button>
      </nav>

      <div class="lh__actions">
        <button
          type="button"
          class="lh__icon"
          :aria-label="isDark ? 'Chế độ sáng' : 'Chế độ tối'"
          @click="toggleColorScheme"
        >
          <svg v-if="!isDark" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <a :href="GITHUB_URL" target="_blank" rel="noopener" class="lh__icon lh__icon--gh" aria-label="GitHub">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56v-2c-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.3-5.47-5.79 0-1.28.47-2.33 1.24-3.15-.13-.3-.54-1.5.11-3.14 0 0 1.01-.32 3.3 1.2a11.6 11.6 0 0 1 6 0c2.29-1.52 3.3-1.2 3.3-1.2.65 1.64.24 2.84.12 3.14.77.82 1.23 1.87 1.23 3.15 0 4.5-2.81 5.48-5.49 5.77.43.36.81 1.09.81 2.2v3.26c0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z"/></svg>
        </a>
        <RouterLink to="/auth/login" class="lh__login">Đăng nhập</RouterLink>
        <RouterLink to="/lab" class="lh__cta">
          <BaseButton variant="primary" size="sm">Dùng thử</BaseButton>
        </RouterLink>
      </div>

      <button
        type="button"
        class="lh__burger"
        :aria-label="menuOpen ? 'Đóng menu' : 'Mở menu'"
        :aria-expanded="menuOpen"
        aria-controls="lh-mobile"
        @click="menuOpen = !menuOpen"
      >
        <svg v-if="!menuOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <Transition name="lh-menu">
      <div v-if="menuOpen" id="lh-mobile" class="lh__menu">
        <button v-for="l in NAV_LINKS" :key="l.target" type="button" class="lh__menu-link" @click="go(l)">
          {{ l.label }}
        </button>
        <div class="lh__menu-actions">
          <RouterLink to="/auth/login" class="lh__menu-login" @click="menuOpen = false">Đăng nhập</RouterLink>
          <RouterLink to="/lab" class="lh__menu-cta" @click="menuOpen = false">Dùng thử</RouterLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.lh {
  position: sticky;
  top: 0;
  z-index: var(--wx-z-header);
  background: color-mix(in srgb, var(--wx-surface-base) 92%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--wx-border-subtle);
  transition: box-shadow var(--wx-d-normal) var(--wx-ease-standard), border-color var(--wx-d-normal) var(--wx-ease-standard);
}
.lh--scrolled {
  border-bottom-color: var(--wx-border-default);
  box-shadow: 0 6px 24px -10px rgba(15, 23, 42, 0.18);
}
.lh__inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 68px;
  padding: 0 var(--wx-space-5);
  display: flex;
  align-items: center;
  gap: var(--wx-space-5);
}

/* brand */
.lh__brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; flex-shrink: 0; border-radius: var(--wx-radius-lg); }
.lh__brand:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 3px; }
.lh__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--wx-brand-primary) 30%, transparent);
}
.lh__tile img { width: 26px; height: 26px; object-fit: contain; }
.lh__brand-text { display: flex; flex-direction: column; line-height: 1.15; }
.lh__name { font-size: var(--wx-fs-18); font-weight: 800; letter-spacing: -0.02em; color: var(--wx-text-primary); }
.lh__tag { font-size: 10.5px; font-weight: var(--wx-fw-medium); color: var(--wx-text-muted); }

/* nav */
.lh__nav { display: flex; align-items: center; gap: 2px; margin: 0 auto; }
.lh__link {
  position: relative;
  padding: 8px 14px;
  border: 0;
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-text-secondary);
  font: inherit;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-medium);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.lh__link:hover { background: var(--wx-hover-bg); color: var(--wx-brand-primary); }
.lh__link:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 1px; }

/* actions */
.lh__actions { display: flex; align-items: center; gap: var(--wx-space-2); flex-shrink: 0; }
.lh__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  color: var(--wx-text-secondary);
  cursor: pointer;
  text-decoration: none;
  box-shadow: var(--wx-shadow-sm);
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard), border-color var(--wx-d-fast) var(--wx-ease-standard);
}
.lh__icon:hover { background: var(--wx-surface-sunken); color: var(--wx-text-primary); border-color: var(--wx-text-muted); }
.lh__icon:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }
.lh__login {
  padding: 8px 14px;
  border-radius: var(--wx-radius-md);
  color: var(--wx-text-primary);
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-semibold);
  text-decoration: none;
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.lh__login:hover { background: var(--wx-hover-bg); }
.lh__cta { text-decoration: none; }

/* burger + mobile menu */
.lh__burger {
  display: none;
  margin-left: auto;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  cursor: pointer;
}
.lh__menu {
  display: none;
  flex-direction: column;
  gap: 2px;
  padding: var(--wx-space-3) var(--wx-space-5) var(--wx-space-4);
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-base);
}
.lh__menu-link {
  text-align: left;
  padding: 12px var(--wx-space-3);
  border: 0;
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-text-primary);
  font: inherit;
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-medium);
  cursor: pointer;
}
.lh__menu-link:hover { background: var(--wx-hover-bg); }
.lh__menu-actions { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-2); margin-top: var(--wx-space-3); }
.lh__menu-login,
.lh__menu-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  border-radius: var(--wx-radius-lg);
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-semibold);
  text-decoration: none;
}
.lh__menu-login { border: 1px solid var(--wx-border-default); color: var(--wx-text-primary); }
.lh__menu-cta { background: var(--wx-shell-grad-solid); color: var(--wx-text-on-brand); }

.lh-menu-enter-active, .lh-menu-leave-active { transition: opacity var(--wx-d-fast) var(--wx-ease-standard), transform var(--wx-d-fast) var(--wx-ease-standard); }
.lh-menu-enter-from, .lh-menu-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 960px) {
  .lh__nav, .lh__actions { display: none; }
  .lh__burger { display: inline-flex; }
  .lh__menu { display: flex; }
  .lh__inner { gap: var(--wx-space-3); }
}
@media (max-width: 520px) {
  .lh__tag { display: none; }
  .lh__inner { padding: 0 var(--wx-space-4); }
}
@media (prefers-reduced-motion: reduce) {
  .lh, .lh-menu-enter-active, .lh-menu-leave-active { transition: none; }
}
</style>
