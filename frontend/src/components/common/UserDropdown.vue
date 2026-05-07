<script setup lang="ts">
import { ref } from 'vue'
import BaseDropdown from './BaseDropdown.vue'
import BaseAvatar from './BaseAvatar.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const confirmingLogout = ref(false)

function goSettings() {
  router.push('/saas/settings')
}

async function handleLogout() {
  confirmingLogout.value = true
  await new Promise(r => setTimeout(r, 600))
  auth.logout()
  confirmingLogout.value = false
  router.push('/auth/login')
}
</script>

<template>
  <BaseDropdown placement="bottom-end">
    <template #trigger>
      <button class="user-trigger" :title="auth.user?.email ?? 'User'">
        <BaseAvatar :name="auth.user?.name ?? 'Admin'" size="sm" />
      </button>
    </template>

    <template #default="{ close }">
      <div class="user-menu">
        <!-- Profile info -->
        <div class="user-menu__header">
          <BaseAvatar :name="auth.user?.name ?? 'Admin'" size="md" />
          <div class="user-menu__identity">
            <span class="user-menu__name">{{ auth.user?.name }}</span>
            <span class="user-menu__email">{{ auth.user?.email }}</span>
            <span class="user-menu__role">{{ auth.user?.role }}</span>
          </div>
        </div>

        <div class="user-menu__divider" />

        <!-- Nav items -->
        <button class="user-menu__item" @click="() => { goSettings(); close() }">
          <span class="user-menu__item-icon">⚙️</span>
          Cài đặt tài khoản
        </button>
        <button class="user-menu__item" @click="() => { router.push('/app/profile'); close() }">
          <span class="user-menu__item-icon">👤</span>
          Hồ sơ cá nhân
        </button>

        <div class="user-menu__divider" />

        <!-- Logout -->
        <button
          class="user-menu__item user-menu__item--danger"
          :disabled="confirmingLogout"
          @click="() => { handleLogout(); close() }"
        >
          <span class="user-menu__item-icon">{{ confirmingLogout ? '⏳' : '🚪' }}</span>
          {{ confirmingLogout ? 'Đang đăng xuất...' : 'Đăng xuất' }}
        </button>
      </div>
    </template>
  </BaseDropdown>
</template>

<style scoped>
.user-trigger {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  border-radius: var(--wx-radius-full);
  display: inline-flex;
  align-items: center;
  transition: opacity 0.15s;
}
.user-trigger:hover { opacity: 0.85; }

.user-menu {
  min-width: 220px;
  padding: var(--wx-space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-menu__header {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-2) var(--wx-space-2) var(--wx-space-3);
}

.user-menu__identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.user-menu__name {
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu__email {
  font-size: var(--wx-fs-11);
  color: var(--wx-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu__role {
  font-size: var(--wx-fs-10);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-brand-primary);
}

.user-menu__divider {
  height: 1px;
  background: var(--wx-border-subtle);
  margin: var(--wx-space-1) 0;
}

.user-menu__item {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  width: 100%;
  padding: var(--wx-space-2) var(--wx-space-2);
  border: none;
  background: transparent;
  border-radius: var(--wx-radius-sm);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-primary);
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
}

.user-menu__item:hover:not(:disabled) {
  background: var(--wx-surface-hover);
}

.user-menu__item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.user-menu__item--danger { color: var(--wx-danger-solid); }
.user-menu__item--danger:hover:not(:disabled) { background: color-mix(in srgb, var(--wx-danger-solid) 8%, transparent); }

.user-menu__item-icon { font-size: 14px; flex-shrink: 0; }
</style>
