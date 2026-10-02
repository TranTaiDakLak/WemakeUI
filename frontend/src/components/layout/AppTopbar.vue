<script setup lang="ts">
/**
 * AppTopbar — thanh trên cùng của shell (gradient thương hiệu, chữ trắng).
 *
 * anatomy:  [left slot] [brand tile · title/tagline]  [center]  [actions · tìm kiếm · theme · lab · user]
 *
 * Bố cục lấy từ HeaderComponent của MindAds: tile logo trắng có viền mờ + bóng,
 * hai dòng tên/tagline, cụm nút kính (glass) bên phải, chip tài khoản mở popover.
 *
 * props cũ giữ nguyên: title · subtitle · hideLabLink.
 * props mới (đều tuỳ chọn): logoSrc · tagline · searchable · user · hideThemeToggle
 *
 * slots: left · center · actions
 * emits: search · logout · profile · upgrade
 */
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useTheme } from '../../ui-system/composables/useTheme'
import TopbarButton from './TopbarButton.vue'
import ProfileMenu from './ProfileMenu.vue'
import { SHELL_ICONS } from './shell-icons'
import type { ProfileMenuLabels } from './profile-menu-types'
import type { TopbarUser } from './topbar-types'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  /** Ẩn nút quay về Lab */
  hideLabLink?: boolean
  /** URL logo (mặc định /logo.png) */
  logoSrc?: string
  /** dòng nhỏ dưới tên thương hiệu */
  tagline?: string
  /** hiện ô tìm kiếm dạng viên thuốc (emit `search` khi bấm) */
  searchable?: boolean
  searchPlaceholder?: string
  searchShortcut?: string
  /** truyền để hiện chip tài khoản + ProfileMenu */
  user?: TopbarUser | null
  profileLabels?: Partial<ProfileMenuLabels>
  hideThemeToggle?: boolean
}>(), {
  title: 'MindUI',
  subtitle: '',
  hideLabLink: false,
  logoSrc: '/logo.png',
  tagline: '',
  searchable: false,
  searchPlaceholder: 'Tìm kiếm…',
  searchShortcut: 'Ctrl K',
  user: null,
  hideThemeToggle: false,
})

const emit = defineEmits<{
  search: []
  logout: []
  profile: []
  upgrade: []
}>()

const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const themeLabel = computed(() => (isDark.value ? 'Chế độ sáng' : 'Chế độ tối'))

function goLab() { void router.push('/lab') }
</script>

<template>
  <header class="topbar no-select app-drag">
    <div class="topbar-left">
      <slot name="left" />

      <RouterLink to="/" class="topbar-brand app-no-drag" :aria-label="`${title} — về trang chủ`">
        <span class="topbar-brand__tile">
          <img :src="logoSrc" :alt="title" class="topbar-brand__img" />
        </span>
        <span class="topbar-brand__text">
          <span class="topbar-title">{{ title }}</span>
          <span v-if="tagline" class="topbar-tagline">{{ tagline }}</span>
        </span>
      </RouterLink>

      <span v-if="subtitle" class="topbar-subtitle">{{ subtitle }}</span>
    </div>

    <div v-if="$slots.center || searchable" class="topbar-center app-no-drag">
      <slot name="center">
        <button
          type="button"
          class="topbar-search"
          :aria-label="searchPlaceholder"
          @click="emit('search')"
        >
          <span class="topbar-search__icon" aria-hidden="true" v-html="SHELL_ICONS.search" />
          <span class="topbar-search__text">{{ searchPlaceholder }}</span>
          <kbd v-if="searchShortcut" class="topbar-search__kbd">{{ searchShortcut }}</kbd>
        </button>
      </slot>
    </div>

    <div class="topbar-right app-no-drag">
      <slot name="actions" />

      <span v-if="$slots.actions && (user || !hideThemeToggle || !hideLabLink)" class="topbar-divider" aria-hidden="true" />

      <TopbarButton v-if="!hideLabLink" label="Xem trực tiếp" @click="goLab">
        <span v-html="SHELL_ICONS.grid" />
      </TopbarButton>

      <TopbarButton
        v-if="!hideThemeToggle"
        :label="themeLabel"
        @click="toggleTheme()"
      >
        <span v-html="isDark ? SHELL_ICONS.sun : SHELL_ICONS.moon" />
      </TopbarButton>

      <ProfileMenu
        v-if="user"
        :name="user.name"
        :user-id="user.userId"
        :email="user.email"
        :avatar="user.avatar"
        :role="user.role"
        :plan="user.plan"
        :plan-used="user.planUsed"
        :plan-limit="user.planLimit"
        :connected="user.connected ?? true"
        :labels="profileLabels"
        @profile="emit('profile')"
        @logout="emit('logout')"
        @upgrade="emit('upgrade')"
      />
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  height: var(--wx-density-header-height, 56px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-3);
  padding: 0 var(--wx-space-4);
  background: var(--wx-shell-topbar-bg);
  color: var(--wx-shell-on-brand);
  flex-shrink: 0;
  z-index: var(--wx-z-dropdown);
  transition: background var(--wx-duration-normal) var(--wx-easing-default);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  min-width: 0;
  flex: 1 1 auto;
}

/* ── Brand ── */
.topbar-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  text-decoration: none;
  color: inherit;
  border-radius: var(--wx-radius-lg);
  transition: opacity var(--wx-d-fast) var(--wx-ease-standard);
}
.topbar-brand:hover { opacity: 0.9; }
.topbar-brand:focus-visible { outline: 2px solid var(--wx-shell-on-brand); outline-offset: 3px; }

.topbar-brand__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--wx-shell-brand-tile-bg);
  border: 2px solid var(--wx-shell-brand-tile-ring);
  box-shadow: var(--wx-shell-brand-tile-shadow);
}
.topbar-brand__img { width: 24px; height: 24px; object-fit: contain; }

.topbar-brand__text { display: flex; flex-direction: column; min-width: 0; line-height: 1.2; }
.topbar-title {
  font-size: 15px;
  font-weight: var(--wx-fw-bold);
  color: var(--wx-shell-on-brand);
  letter-spacing: var(--wx-tracking-tight);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.topbar-tagline {
  font-size: 10px;
  font-weight: var(--wx-fw-medium);
  color: var(--wx-shell-on-brand-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-subtitle {
  position: relative;
  padding-left: var(--wx-space-3);
  font-size: var(--wx-fs-12);
  color: var(--wx-shell-on-brand-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30vw;
}
.topbar-subtitle::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 1px;
  height: 14px;
  transform: translateY(-50%);
  background: var(--wx-shell-glass-border);
}

/* ── Center / search ── */
.topbar-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 360px;
  min-width: 0;
  max-width: 480px;
}
.topbar-search {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  width: 100%;
  height: 34px;
  padding: 0 10px 0 12px;
  border: 1px solid var(--wx-shell-glass-border);
  border-radius: var(--wx-radius-full);
  background: var(--wx-shell-glass-bg);
  color: var(--wx-shell-on-brand-dim);
  font-family: inherit;
  font-size: var(--wx-fs-13);
  text-align: left;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background var(--wx-d-fast) var(--wx-ease-standard), border-color var(--wx-d-fast) var(--wx-ease-standard);
}
.topbar-search:hover { background: var(--wx-shell-glass-bg-hover); border-color: var(--wx-shell-glass-border-hover); }
.topbar-search:focus-visible { outline: 2px solid var(--wx-shell-on-brand); outline-offset: 2px; }
.topbar-search__icon { display: inline-flex; }
.topbar-search__icon :deep(svg) { width: 15px; height: 15px; }
.topbar-search__text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.topbar-search__kbd {
  padding: 1px 6px;
  border: 1px solid var(--wx-shell-glass-border);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--wx-shell-on-brand);
  font-family: inherit;
  font-size: 10px;
  font-weight: var(--wx-fw-semibold);
}

/* ── Right ── */
.topbar-right { display: flex; align-items: center; gap: var(--wx-space-2); flex-shrink: 0; }
.topbar-divider { width: 1px; height: 20px; margin: 0 2px; background: var(--wx-shell-glass-border); }

/* The user chip already shows the name; on narrow viewports the subtitle just duplicates it. */
@media (max-width: 639px) {
  .topbar-subtitle { display: none; }
  .topbar-tagline { display: none; }
  .topbar-center { display: none; }
  .topbar { padding: 0 var(--wx-space-3); }
}
@media (max-width: 1023px) {
  .topbar-search__text, .topbar-search__kbd { display: none; }
  .topbar-center { flex: 0 0 auto; width: 34px; }
  .topbar-search { width: 34px; padding: 0; justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .topbar,
  .topbar-brand,
  .topbar-search { transition: none; }
}
</style>
