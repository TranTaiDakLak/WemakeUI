<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'
import type { NotifSeverity } from '@/stores/notifications'

const router = useRouter()
const store = useNotificationsStore()
const open = ref(false)

function toggle() { open.value = !open.value }
function close() { open.value = false }

const SEVERITY_ICON: Record<NotifSeverity, string> = {
  success: '✅',
  warning: '⚠️',
  error: '🔴',
  info: 'ℹ️',
}
const SEVERITY_CLASS: Record<NotifSeverity, string> = {
  success: 'notif--success',
  warning: 'notif--warning',
  error: 'notif--error',
  info: 'notif--info',
}

function handleAction(notif: typeof store.items[0]) {
  store.markRead(notif.id)
  if (notif.action?.to) {
    router.push(notif.action.to)
    close()
  }
}

const hasUnread = computed(() => store.unreadCount > 0)
</script>

<template>
  <div class="nc-root">
    <!-- trigger button -->
    <button class="nc-trigger" :class="{ 'nc-trigger--active': open }" aria-label="Thông báo" @click="toggle">
      <svg class="nc-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span v-if="hasUnread" class="nc-badge">{{ store.unreadCount > 9 ? '9+' : store.unreadCount }}</span>
    </button>

    <!-- overlay -->
    <Transition name="wx-fade">
      <div v-if="open" class="nc-overlay" @click.self="close" />
    </Transition>

    <!-- panel -->
    <Transition name="nc-panel">
      <div v-if="open" class="nc-panel" role="dialog" aria-label="Trung tâm thông báo">
        <div class="nc-panel__head">
          <span class="nc-panel__title">Thông báo</span>
          <div class="nc-panel__actions">
            <button v-if="hasUnread" class="nc-mark-all" @click="store.markAllRead">Đánh dấu tất cả đã đọc</button>
            <button class="nc-close" @click="close" aria-label="Đóng">✕</button>
          </div>
        </div>

        <div class="nc-list">
          <div v-if="!store.items.length" class="nc-empty">
            <span class="nc-empty__icon">🔔</span>
            <p>Không có thông báo nào</p>
          </div>

          <div
            v-for="notif in store.items"
            :key="notif.id"
            class="nc-item"
            :class="[SEVERITY_CLASS[notif.severity], { 'nc-item--unread': !notif.read }]"
            @click="store.markRead(notif.id)"
          >
            <span class="nc-item__icon">{{ SEVERITY_ICON[notif.severity] }}</span>
            <div class="nc-item__content">
              <div class="nc-item__head">
                <p class="nc-item__title">{{ notif.title }}</p>
                <span class="nc-item__time">{{ notif.time }}</span>
              </div>
              <p class="nc-item__body">{{ notif.body }}</p>
              <button
                v-if="notif.action"
                class="nc-item__action"
                @click.stop="handleAction(notif)"
              >{{ notif.action.label }} →</button>
            </div>
            <button
              class="nc-item__dismiss"
              aria-label="Bỏ thông báo"
              @click.stop="store.dismiss(notif.id)"
            >✕</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.nc-root { position: relative; }

/* trigger — bell trên topbar gradient luôn trắng */
.nc-trigger {
  position: relative;
  width: 36px; height: 36px;
  border-radius: var(--wx-radius-full);
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  transition: all var(--wx-d-fast);
}
.nc-trigger:hover, .nc-trigger--active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}
.nc-bell { width: 18px; height: 18px; }
.nc-badge {
  position: absolute;
  top: -4px; right: -4px;
  min-width: 20px; height: 20px;
  padding: 0 6px;
  border-radius: var(--wx-radius-full);
  background: #ef4444;       /* red-500 — luôn đỏ tươi */
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #fff;    /* trắng — viền nổi trên topbar gradient */
  line-height: 1;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.45);
  z-index: 1;
}
/* Dark mode: viền dùng topbar bg để blend, vẫn đỏ tươi */
.wx-dark .nc-badge { border-color: var(--wx-surface-base); }

/* overlay */
.nc-overlay {
  position: fixed; inset: 0;
  z-index: 200;
}

/* panel */
.nc-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-height: 520px;
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  box-shadow: var(--wx-shadow-lg);
  z-index: 201;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nc-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--wx-space-4) var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
  gap: var(--wx-space-2);
  flex-shrink: 0;
}
.nc-panel__title { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.nc-panel__actions { display: flex; align-items: center; gap: var(--wx-space-2); }
.nc-mark-all {
  font-size: var(--wx-fs-12);
  color: var(--wx-brand-primary);
  background: none; border: none; cursor: pointer;
  white-space: nowrap;
}
.nc-close {
  background: none; border: none; cursor: pointer;
  color: var(--wx-text-muted);
  width: 24px; height: 24px;
  border-radius: var(--wx-radius-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px;
}
.nc-close:hover { background: var(--wx-surface-elevated); }

.nc-list { flex: 1; overflow-y: auto; }
.nc-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-10) var(--wx-space-4);
  color: var(--wx-text-muted);
  font-size: var(--wx-fs-14);
}
.nc-empty__icon { font-size: 32px; }

.nc-item {
  display: flex;
  align-items: flex-start;
  gap: var(--wx-space-3);
  padding: var(--wx-space-4) var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
  cursor: pointer;
  position: relative;
  transition: background var(--wx-d-fast);
}
.nc-item:last-child { border-bottom: none; }
.nc-item:hover { background: var(--wx-surface-elevated); }
.nc-item--unread { background: color-mix(in srgb, var(--wx-brand-primary) 4%, transparent); }
.nc-item--unread::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--wx-brand-primary);
  border-radius: 0 2px 2px 0;
}
.nc-item--error.nc-item--unread::before { background: var(--wx-danger-solid); }
.nc-item--warning.nc-item--unread::before { background: var(--wx-warning-solid); }
.nc-item--success.nc-item--unread::before { background: var(--wx-success-solid); }

.nc-item__icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.nc-item__content { flex: 1; min-width: 0; }
.nc-item__head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--wx-space-2); margin-bottom: 2px; }
.nc-item__title { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); margin: 0; }
.nc-item__time { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; flex-shrink: 0; }
.nc-item__body { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); margin: 0 0 6px; line-height: 1.5; }
.nc-item__action {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-brand-primary);
  background: none; border: none; cursor: pointer; padding: 0;
}
.nc-item__action:hover { text-decoration: underline; }
.nc-item__dismiss {
  background: none; border: none; cursor: pointer;
  color: var(--wx-text-muted);
  font-size: 12px;
  width: 20px; height: 20px;
  border-radius: var(--wx-radius-sm);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity var(--wx-d-fast);
}
.nc-item:hover .nc-item__dismiss { opacity: 1; }
.nc-item__dismiss:hover { background: var(--wx-surface-sunken); }

/* panel transition */
.nc-panel-enter-active { transition: opacity 160ms ease, transform 160ms cubic-bezier(0,0,0.2,1); }
.nc-panel-leave-active { transition: opacity 100ms ease, transform 100ms ease; }
.nc-panel-enter-from, .nc-panel-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }
</style>
