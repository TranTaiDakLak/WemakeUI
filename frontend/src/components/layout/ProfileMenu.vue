<script setup lang="ts">
/**
 * ProfileMenu — chip tài khoản trên topbar + popover danh tính.
 *
 * Bố cục lấy từ profile popover của MindAds:
 *   [chip kính: avatar · tên · mã · icon trạng thái]
 *    └─ popover: thẻ "Tài khoản" (nhãn + chip trạng thái, avatar có quầng sáng,
 *       thông tin, hàng nút Hồ sơ / Đăng xuất, mục bảo mật mở rộng có tab trượt)
 *       → thẻ "Gói dịch vụ" (mức dùng + nâng cấp) → slot `extra` → footer
 *       (phiên bản · giao diện sáng/tối).
 *
 * Không gọi API/extension thật: mọi dữ liệu qua props, hành động qua emit.
 *
 *   <ProfileMenu name="Nguyễn Admin" user-id="MND-000123" email="admin@mindui.vn"
 *                plan="Pro" @logout="signOut" @profile="router.push('/app/profile')" />
 *
 * slots: trigger (thay chip) · extra (thẻ bổ sung) · footer-extra
 * expose: open() close() toggle()
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTheme } from '../../ui-system/composables/useTheme'
import { SHELL_ICONS } from './shell-icons'
import {
  DEFAULT_PROFILE_LABELS,
  type ProfileInfoRow,
  type ProfileMenuLabels,
} from './profile-menu-types'

const props = withDefaults(defineProps<{
  name?: string
  /** mã hiển thị (mono) — bấm để copy */
  userId?: string
  email?: string
  /** URL avatar; bỏ trống → chữ cái đầu */
  avatar?: string
  role?: string
  /** tên gói; bỏ trống → "Chưa có gói" */
  plan?: string
  planUsed?: number
  planLimit?: number
  /** trạng thái kết nối tài khoản */
  connected?: boolean
  version?: string
  /** chip thu gọn (chỉ avatar) */
  compact?: boolean
  /** hiện mục "Thông tin bảo mật & khác" */
  showSecurity?: boolean
  securityRows?: ProfileInfoRow[]
  otherRows?: ProfileInfoRow[]
  labels?: Partial<ProfileMenuLabels>
}>(), {
  name: 'Người dùng',
  connected: true,
  version: '0.1.0',
  compact: false,
  showSecurity: true,
})

const emit = defineEmits<{
  profile: []
  logout: []
  upgrade: []
  version: []
  'refresh-row': [key: string]
}>()

const L = computed<ProfileMenuLabels>(() => ({ ...DEFAULT_PROFILE_LABELS, ...props.labels }))

/* ── open / close ───────────────────────────────────────── */
const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const securityOpen = ref(false)

function openMenu() { open.value = true }
function closeMenu(returnFocus = false) {
  open.value = false
  if (returnFocus) triggerRef.value?.focus()
}
function toggle() { open.value ? closeMenu() : openMenu() }

function onDocMouseDown(e: MouseEvent) {
  if (!open.value) return
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) closeMenu()
}
function onDocKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    e.stopPropagation()
    closeMenu(true)
  }
}
onMounted(() => {
  if (typeof document === 'undefined') return
  document.addEventListener('mousedown', onDocMouseDown)
  document.addEventListener('keydown', onDocKeydown)
})
onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('mousedown', onDocMouseDown)
  document.removeEventListener('keydown', onDocKeydown)
  window.clearTimeout(copyTimer)
})
watch(open, (v) => { if (!v) securityOpen.value = false })

defineExpose({ open: openMenu, close: closeMenu, toggle })

/* ── hiển thị ───────────────────────────────────────────── */
const initials = computed(() => {
  const parts = props.name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
})
const avatarFailed = ref(false)
watch(() => props.avatar, () => { avatarFailed.value = false })

const usagePct = computed(() => {
  if (!props.planLimit || props.planLimit <= 0) return 0
  return Math.min(100, Math.round(((props.planUsed ?? 0) / props.planLimit) * 100))
})
const usageTone = computed(() => (usagePct.value >= 90 ? 'danger' : usagePct.value >= 70 ? 'warning' : 'brand'))

/* ── copy (an toàn khi không có clipboard) ───────────────── */
const copiedKey = ref<string | null>(null)
let copyTimer = 0
async function copyText(text: string | undefined, key: string) {
  if (!text) return
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    }
  } catch { /* clipboard bị chặn → bỏ qua, chỉ không có phản hồi */ }
  copiedKey.value = key
  window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => { copiedKey.value = null }, 1400)
}

/* ── bảo mật & khác ─────────────────────────────────────── */
const tab = ref<'security' | 'other'>('security')
const defaultSecurity: ProfileInfoRow[] = [
  { key: 'session', label: 'Phiên', value: 'mnd_sess_••••••••8f2a', icon: SHELL_ICONS.database, refreshable: true },
  { key: 'apikey', label: 'API key', value: 'mnd_live_••••••••c91d', icon: SHELL_ICONS.key, refreshable: true },
]
const defaultOther: ProfileInfoRow[] = [
  { key: 'device', label: 'Thiết bị', value: 'Windows · Chrome', icon: SHELL_ICONS.grid },
  { key: 'region', label: 'Múi giờ', value: 'Việt Nam (UTC+7)', icon: SHELL_ICONS.globe },
]
const rows = computed(() =>
  tab.value === 'security'
    ? (props.securityRows ?? defaultSecurity)
    : (props.otherRows ?? defaultOther),
)
const refreshing = ref<string | null>(null)
let refreshTimer = 0
function refreshRow(key: string) {
  refreshing.value = key
  emit('refresh-row', key)
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => { refreshing.value = null }, 900)
}
onBeforeUnmount(() => window.clearTimeout(refreshTimer))

/* ── giao diện ──────────────────────────────────────────── */
const { isDark, setColorScheme } = useTheme()

/* ── actions ────────────────────────────────────────────── */
function onProfile() { emit('profile'); closeMenu() }
function onLogout() { emit('logout'); closeMenu() }
function onUpgrade() { emit('upgrade'); closeMenu() }
</script>

<template>
  <div ref="rootRef" class="wx-profile">
    <slot name="trigger" :open="open" :toggle="toggle">
      <button
        ref="triggerRef"
        type="button"
        class="wx-profile__chip"
        :class="{ 'wx-profile__chip--open': open, 'wx-profile__chip--compact': compact }"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-label="`${L.menuAria}: ${name}`"
        @click="toggle"
      >
        <span class="wx-profile__avatar wx-profile__avatar--sm">
          <img v-if="avatar && !avatarFailed" :src="avatar" :alt="name" @error="avatarFailed = true" />
          <span v-else>{{ initials }}</span>
        </span>

        <span v-if="!compact" class="wx-profile__chip-text">
          <span class="wx-profile__chip-name">{{ name }}</span>
          <span v-if="userId || role" class="wx-profile__chip-sub">{{ userId || role }}</span>
        </span>

        <span class="wx-profile__chip-status" aria-hidden="true">
          <span
            class="wx-profile__chip-ico"
            :class="connected ? 'is-on' : 'is-off'"
            v-html="SHELL_ICONS.idCard"
          />
          <span
            v-if="plan"
            class="wx-profile__chip-ico is-on"
            v-html="SHELL_ICONS.sparkle"
          />
        </span>
      </button>
    </slot>

    <Transition name="wx-profile-pop">
      <div
        v-if="open"
        class="wx-profile__panel"
        role="dialog"
        :aria-label="L.menuAria"
      >
        <!-- ── Thẻ tài khoản ── -->
        <section class="wx-profile__card wx-profile__card--account">
          <header class="wx-profile__card-head wx-profile__card-head--brand">
            <span class="wx-profile__kind">
              <span class="wx-profile__kind-ico" aria-hidden="true" v-html="SHELL_ICONS.user" />
              <span>{{ L.account }}</span>
            </span>
            <span class="wx-profile__head-actions">
              <span class="wx-profile__pill" :class="connected ? 'is-success' : 'is-neutral'">
                <span class="wx-profile__pill-dot" />
                {{ connected ? L.connected : L.notConnected }}
              </span>
              <button type="button" class="mind-icon-btn" :aria-label="L.close" @click="closeMenu(true)">
                <span aria-hidden="true" v-html="SHELL_ICONS.x" />
              </button>
            </span>
          </header>

          <div class="wx-profile__who">
            <span class="wx-profile__avatar-wrap" aria-hidden="true">
              <span class="wx-profile__glow wx-profile__glow--a" />
              <span class="wx-profile__glow wx-profile__glow--b" />
              <span class="wx-profile__avatar wx-profile__avatar--lg">
                <img v-if="avatar && !avatarFailed" :src="avatar" alt="" @error="avatarFailed = true" />
                <span v-else>{{ initials }}</span>
              </span>
              <span class="wx-profile__online" :class="{ 'is-off': !connected }" />
            </span>

            <div class="wx-profile__info">
              <h2 class="wx-profile__name">{{ name }}</h2>

              <button
                v-if="userId"
                type="button"
                class="wx-profile__copy wx-profile__copy--id"
                :title="L.copyId"
                @click="copyText(userId, 'id')"
              >
                <span>{{ userId }}</span>
                <span
                  class="wx-profile__copy-ico"
                  :class="{ 'is-done': copiedKey === 'id' }"
                  aria-hidden="true"
                  v-html="copiedKey === 'id' ? SHELL_ICONS.check : SHELL_ICONS.copy"
                />
              </button>

              <button
                v-if="email"
                type="button"
                class="wx-profile__copy wx-profile__copy--mail"
                :title="L.copyEmail"
                @click="copyText(email, 'email')"
              >
                <span class="wx-profile__mail-ico" aria-hidden="true" v-html="SHELL_ICONS.idCard" />
                <span class="wx-profile__mail-text">{{ email }}</span>
                <span
                  class="wx-profile__copy-ico"
                  :class="{ 'is-done': copiedKey === 'email' }"
                  aria-hidden="true"
                  v-html="copiedKey === 'email' ? SHELL_ICONS.check : SHELL_ICONS.copy"
                />
              </button>

              <div v-if="role || plan" class="wx-profile__tags">
                <span v-if="role" class="wx-profile__tag">{{ role }}</span>
                <span v-if="plan" class="wx-profile__tag wx-profile__tag--plan">{{ plan }}</span>
              </div>
            </div>
          </div>

          <div class="wx-profile__actions">
            <button type="button" class="wx-profile__btn" @click="onProfile">
              <span aria-hidden="true" v-html="SHELL_ICONS.user" />
              {{ L.profile }}
            </button>
            <button type="button" class="wx-profile__btn wx-profile__btn--danger" @click="onLogout">
              <span aria-hidden="true" v-html="SHELL_ICONS.power" />
              {{ L.logout }}
            </button>
          </div>

          <template v-if="showSecurity">
            <button
              type="button"
              class="wx-profile__toggle"
              :aria-expanded="securityOpen"
              aria-controls="wx-profile-security"
              @click="securityOpen = !securityOpen"
            >
              <span class="wx-profile__toggle-label">
                <span aria-hidden="true" v-html="SHELL_ICONS.lock" />
                {{ L.securityToggle }}
              </span>
              <span aria-hidden="true" v-html="securityOpen ? SHELL_ICONS.chevronUp : SHELL_ICONS.chevronDown" />
            </button>

            <Transition name="wx-profile-expand">
              <div v-if="securityOpen" id="wx-profile-security" class="wx-profile__security">
                <div class="wx-profile__tabs" role="tablist" :data-active="tab">
                  <span class="wx-profile__tabs-pill" aria-hidden="true" />
                  <button
                    type="button"
                    role="tab"
                    class="wx-profile__tab"
                    :class="{ 'is-active': tab === 'security' }"
                    :aria-selected="tab === 'security'"
                    @click="tab = 'security'"
                  >{{ L.tabSecurity }}</button>
                  <button
                    type="button"
                    role="tab"
                    class="wx-profile__tab"
                    :class="{ 'is-active': tab === 'other' }"
                    :aria-selected="tab === 'other'"
                    @click="tab = 'other'"
                  >{{ L.tabOther }}</button>
                </div>

                <ul class="wx-profile__rows">
                  <li v-for="row in rows" :key="row.key" class="wx-profile__row">
                    <span class="wx-profile__row-label">
                      <span v-if="row.icon" aria-hidden="true" v-html="row.icon" />
                      {{ row.label }}
                    </span>
                    <button
                      type="button"
                      class="wx-profile__row-value"
                      :disabled="row.copyable === false"
                      :title="L.copied"
                      @click="copyText(row.value, row.key)"
                    >
                      <code>{{ row.value }}</code>
                      <span
                        class="wx-profile__copy-ico"
                        :class="{ 'is-done': copiedKey === row.key }"
                        aria-hidden="true"
                        v-html="copiedKey === row.key ? SHELL_ICONS.check : SHELL_ICONS.copy"
                      />
                    </button>
                    <button
                      v-if="row.refreshable"
                      type="button"
                      class="mind-icon-btn wx-profile__row-refresh"
                      :class="{ 'is-spinning': refreshing === row.key }"
                      :aria-label="`${L.refresh} ${row.label}`"
                      @click="refreshRow(row.key)"
                    >
                      <span aria-hidden="true" v-html="SHELL_ICONS.refresh" />
                    </button>
                  </li>
                </ul>
              </div>
            </Transition>
          </template>
        </section>

        <!-- ── Thẻ gói dịch vụ ── -->
        <section class="wx-profile__card wx-profile__card--plan">
          <header class="wx-profile__card-head wx-profile__card-head--sky">
            <span class="wx-profile__kind">
              <span class="wx-profile__kind-ico" aria-hidden="true" v-html="SHELL_ICONS.sparkle" />
              <span>{{ L.plan }}</span>
            </span>
            <span class="wx-profile__pill" :class="plan ? 'is-success' : 'is-neutral'">
              <span class="wx-profile__pill-dot" />
              {{ plan ? plan : L.noPlan }}
            </span>
          </header>

          <div class="wx-profile__plan">
            <div class="wx-profile__plan-row">
              <span class="wx-profile__plan-label">{{ plan ? `${L.planLabel}: ${plan}` : L.noPlan }}</span>
              <button type="button" class="wx-profile__upgrade" @click="onUpgrade">
                {{ L.upgrade }}
                <span aria-hidden="true" v-html="SHELL_ICONS.arrowRight" />
              </button>
            </div>

            <div v-if="planLimit" class="wx-profile__usage">
              <div class="wx-profile__usage-meta">
                <span>{{ L.usage }}</span>
                <strong>{{ planUsed ?? 0 }} / {{ planLimit }}</strong>
              </div>
              <div
                class="wx-profile__usage-bar"
                role="progressbar"
                :aria-valuenow="usagePct"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span :class="`is-${usageTone}`" :style="{ width: `${usagePct}%` }" />
              </div>
            </div>
          </div>
        </section>

        <slot name="extra" :close="closeMenu" />

        <!-- ── Footer ── -->
        <footer class="wx-profile__foot">
          <button type="button" class="wx-profile__version" @click="emit('version')">
            <span aria-hidden="true" v-html="SHELL_ICONS.info" />
            {{ L.version }} {{ version }}
          </button>

          <div class="wx-profile__foot-right">
            <slot name="footer-extra" />
            <span class="wx-profile__sep" aria-hidden="true" />
            <div class="wx-profile__seg" role="group" :aria-label="L.appearance">
              <button
                type="button"
                class="wx-profile__seg-btn"
                :class="{ 'is-active': !isDark }"
                :aria-pressed="!isDark"
                :title="L.light"
                @click="setColorScheme('light')"
              >
                <span aria-hidden="true" v-html="SHELL_ICONS.sun" />
              </button>
              <button
                type="button"
                class="wx-profile__seg-btn"
                :class="{ 'is-active': isDark }"
                :aria-pressed="isDark"
                :title="L.dark"
                @click="setColorScheme('dark')"
              >
                <span aria-hidden="true" v-html="SHELL_ICONS.moon" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.wx-profile {
  position: relative;
  display: inline-flex;
  font-family: var(--wx-font-primary);
}

/* ═══ Chip trên topbar ═══ */
.wx-profile__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-2);
  height: 38px;
  padding: 0 10px 0 6px;
  max-width: 280px;
  border: 1px solid var(--wx-shell-glass-border);
  border-radius: 12px;
  background: var(--wx-shell-glass-bg);
  color: var(--wx-shell-on-brand);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  font-family: inherit;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-profile__chip:hover,
.wx-profile__chip--open {
  background: var(--wx-shell-glass-bg-hover);
  border-color: var(--wx-shell-glass-border-hover);
}
.wx-profile__chip:focus-visible { outline: 2px solid var(--wx-shell-on-brand); outline-offset: 2px; }
.wx-profile__chip--compact { padding: 0 6px; }

.wx-profile__chip-text { display: flex; flex-direction: column; min-width: 0; text-align: left; line-height: 1.15; }
.wx-profile__chip-name {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
.wx-profile__chip-sub {
  font-family: var(--wx-font-mono);
  font-size: 10.5px;
  color: var(--wx-shell-on-brand-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
.wx-profile__chip-status { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; }
.wx-profile__chip-ico { display: inline-flex; transition: color var(--wx-d-fast) var(--wx-ease-standard); }
.wx-profile__chip-ico :deep(svg) { width: 13px; height: 13px; }
.wx-profile__chip-ico.is-on  { color: var(--wx-shell-on-brand); }
.wx-profile__chip-ico.is-off { color: rgba(255, 255, 255, 0.4); }

@media (max-width: 639px) {
  .wx-profile__chip-text,
  .wx-profile__chip-status { display: none; }
  .wx-profile__chip { padding: 0 6px; }
}

/* Avatar */
.wx-profile__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--wx-radius-full);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--wx-shell-grad-solid);
  color: var(--wx-text-on-brand);
  font-weight: var(--wx-fw-bold);
  user-select: none;
}
.wx-profile__avatar img { width: 100%; height: 100%; object-fit: cover; }
.wx-profile__avatar--sm { width: 26px; height: 26px; font-size: 11px; box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4); }
.wx-profile__avatar--lg {
  width: 46px; height: 46px; font-size: 17px;
  border: 2px solid var(--wx-surface-base);
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.22);
  position: relative; z-index: 1;
}

/* ═══ Panel ═══ */
.wx-profile__panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: var(--wx-z-popover);
  width: 348px;
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  padding: var(--wx-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-2xl);
  box-shadow: var(--wx-shell-panel-shadow);
  color: var(--wx-text-primary);
  text-align: left;
  scrollbar-width: thin;
}

/* Thẻ danh tính */
.wx-profile__card {
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-base);
  box-shadow: var(--wx-shadow-sm);
  overflow: hidden;
}
.wx-profile__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-2);
  min-height: 34px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--wx-border-subtle);
}
.wx-profile__card-head--brand { background: var(--wx-shell-tone-brand-bg); color: var(--wx-shell-tone-brand-fg); }
.wx-profile__card-head--sky   { background: var(--wx-shell-tone-brand-bg); color: var(--wx-shell-tone-brand-fg); }
.wx-profile__kind {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-bold);
}
.wx-profile__kind-ico { display: inline-flex; }
.wx-profile__kind-ico :deep(svg) { width: 14px; height: 14px; }
.wx-profile__head-actions { display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; }

.wx-profile__pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: var(--wx-radius-full);
  font-size: 11.5px;
  font-weight: var(--wx-fw-semibold);
  white-space: nowrap;
}
.wx-profile__pill-dot { width: 6px; height: 6px; border-radius: var(--wx-radius-full); background: currentColor; }
.wx-profile__pill.is-success { background: var(--wx-shell-tone-success-bg); color: var(--wx-shell-tone-success-fg); }
.wx-profile__pill.is-neutral { background: var(--wx-shell-tone-neutral-bg); color: var(--wx-shell-tone-neutral-fg); }

/* Phần "ai" */
.wx-profile__who { display: flex; align-items: flex-start; gap: 14px; padding: 12px; }
.wx-profile__avatar-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 66px;
  flex-shrink: 0;
}
.wx-profile__glow {
  position: absolute;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  filter: blur(3px);
  pointer-events: none;
  will-change: transform, border-radius;
}
.wx-profile__glow--a {
  width: 94px; height: 94px;
  background: linear-gradient(to top right, color-mix(in srgb, var(--wx-brand-accent) 35%, transparent), color-mix(in srgb, var(--wx-brand-focus) 20%, transparent));
  animation: mind-blob-morph 6s ease-in-out infinite, mind-blob-spin 10s linear infinite;
}
.wx-profile__glow--b {
  width: 84px; height: 84px;
  background: linear-gradient(to bottom right, color-mix(in srgb, var(--wx-brand-focus) 25%, transparent), color-mix(in srgb, var(--wx-brand-accent) 15%, transparent));
  animation: mind-blob-morph 7s ease-in-out infinite reverse, mind-blob-spin 8s linear infinite reverse;
}
.wx-profile__online {
  position: absolute;
  right: 6px;
  bottom: 6px;
  z-index: 2;
  width: 12px;
  height: 12px;
  border-radius: var(--wx-radius-full);
  border: 2px solid var(--wx-surface-base);
  background: var(--wx-shell-dot-online);
}
.wx-profile__online.is-off { background: var(--wx-shell-dot-offline); }

.wx-profile__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.wx-profile__name {
  margin: 0;
  font-size: var(--wx-fs-14);
  font-weight: 800;
  letter-spacing: var(--wx-tracking-tight);
  line-height: var(--wx-lh-tight);
  color: var(--wx-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
}
.wx-profile__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 1px 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  color: var(--wx-text-secondary);
}
.wx-profile__copy--id {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-bold);
  letter-spacing: 0.03em;
  color: var(--wx-brand-primary);
}
.wx-profile__copy--id:hover { color: var(--wx-brand-700); }
.wx-profile__copy--mail { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-medium); }
.wx-profile__copy--mail:hover { color: var(--wx-brand-primary); }
.wx-profile__copy:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; border-radius: 4px; }
.wx-profile__mail-ico { display: inline-flex; color: var(--wx-brand-accent); }
.wx-profile__mail-ico :deep(svg) { width: 13px; height: 13px; }
.wx-profile__mail-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.wx-profile__copy-ico { display: inline-flex; color: var(--wx-text-disabled); opacity: 0; transition: opacity var(--wx-d-fast) var(--wx-ease-standard); }
.wx-profile__copy-ico :deep(svg) { width: 12px; height: 12px; }
.wx-profile__copy:hover .wx-profile__copy-ico,
.wx-profile__copy:focus-visible .wx-profile__copy-ico,
.wx-profile__row-value:hover .wx-profile__copy-ico { opacity: 1; }
.wx-profile__copy-ico.is-done { opacity: 1; color: var(--wx-success-solid); }

.wx-profile__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.wx-profile__tag {
  padding: 1px 8px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-default);
  font-size: 11px;
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-secondary);
  text-transform: capitalize;
}
.wx-profile__tag--plan {
  background: var(--wx-shell-tone-warning-bg);
  border-color: var(--wx-shell-tone-warning-bd);
  color: var(--wx-shell-tone-warning-fg);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 10px;
}

/* Hàng nút */
.wx-profile__actions {
  display: flex;
  gap: var(--wx-space-2);
  padding: var(--wx-space-2);
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-sunken);
}
.wx-profile__btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 var(--wx-space-2);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  color: var(--wx-text-secondary);
  font-family: inherit;
  font-size: 11.5px;
  font-weight: var(--wx-fw-bold);
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard),
    color var(--wx-d-fast) var(--wx-ease-standard),
    transform var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-profile__btn :deep(svg) { width: 13px; height: 13px; }
.wx-profile__btn:hover { background: var(--wx-hover-bg); border-color: var(--wx-brand-300); color: var(--wx-brand-primary); transform: translateY(-1px); }
.wx-profile__btn--danger:hover { background: var(--wx-danger-bg); border-color: var(--wx-danger-border); color: var(--wx-danger-text); }
.wx-profile__btn:active { transform: translateY(0); }
.wx-profile__btn:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 1px; }

/* Toggle bảo mật */
.wx-profile__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-2);
  height: 38px;
  padding: 0 12px;
  border: 0;
  border-top: 1px solid var(--wx-border-subtle);
  background: transparent;
  color: var(--wx-text-secondary);
  font-family: inherit;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-profile__toggle:hover { background: var(--wx-surface-sunken); color: var(--wx-text-primary); }
.wx-profile__toggle:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: -2px; }
.wx-profile__toggle-label { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
.wx-profile__toggle :deep(svg) { width: 14px; height: 14px; }

/* Mục bảo mật */
.wx-profile__security { padding: 10px; border-top: 1px solid var(--wx-border-subtle); background: var(--wx-surface-sunken); overflow: hidden; }
.wx-profile__tabs {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  padding: 2px;
  margin-bottom: 8px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
}
.wx-profile__tabs-pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  width: calc(50% - 3px);
  border-radius: 6px;
  background: var(--wx-shell-tone-brand-bg);
  border: 1px solid var(--wx-shell-tone-brand-bd);
  transition: transform var(--wx-d-normal) var(--wx-ease-standard);
}
.wx-profile__tabs[data-active='other'] .wx-profile__tabs-pill { transform: translateX(calc(100% + 2px)); }
.wx-profile__tab {
  position: relative;
  z-index: 1;
  height: 28px;
  border: 0;
  background: transparent;
  border-radius: 6px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-muted);
  cursor: pointer;
  transition: color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-profile__tab:hover { color: var(--wx-text-primary); }
.wx-profile__tab.is-active { color: var(--wx-shell-tone-brand-fg); }
.wx-profile__tab:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: -2px; }

.wx-profile__rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.wx-profile__row { display: grid; grid-template-columns: 68px 1fr auto; align-items: center; gap: 6px; }
.wx-profile__row-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-muted);
  white-space: nowrap;
}
.wx-profile__row-label :deep(svg) { width: 12px; height: 12px; color: var(--wx-brand-accent); }
.wx-profile__row-value {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-sm);
  background: var(--wx-surface-base);
  cursor: pointer;
  font-family: inherit;
  transition: border-color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-profile__row-value:hover:not(:disabled) { border-color: var(--wx-brand-400); }
.wx-profile__row-value:disabled { cursor: default; }
.wx-profile__row-value:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 1px; }
.wx-profile__row-value code {
  flex: 1;
  min-width: 0;
  font-family: var(--wx-font-mono);
  font-size: 11.5px;
  color: var(--wx-text-secondary);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wx-profile__row-refresh.is-spinning :deep(svg) { animation: wx-profile-spin 0.8s linear infinite; }
@keyframes wx-profile-spin { to { transform: rotate(360deg); } }

/* Thẻ gói */
.wx-profile__plan { display: flex; flex-direction: column; gap: 10px; padding: 10px 12px; }
.wx-profile__plan-row { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-2); }
.wx-profile__plan-label { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-medium); color: var(--wx-text-secondary); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wx-profile__upgrade {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 28px;
  padding: 4px 10px;
  border: 1px solid var(--wx-shell-tone-warning-bd);
  border-radius: var(--wx-radius-md);
  background: var(--wx-shell-tone-warning-bg);
  color: var(--wx-shell-tone-warning-fg);
  font-family: inherit;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-bold);
  cursor: pointer;
  flex-shrink: 0;
  transition: filter var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-profile__upgrade :deep(svg) { width: 12px; height: 12px; }
.wx-profile__upgrade:hover { filter: brightness(0.96); }
.wx-profile__upgrade:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 1px; }
.wx-profile__usage-meta { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11.5px; color: var(--wx-text-muted); }
.wx-profile__usage-meta strong { color: var(--wx-text-primary); font-variant-numeric: tabular-nums; }
.wx-profile__usage-bar { height: 6px; border-radius: var(--wx-radius-full); background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); overflow: hidden; }
.wx-profile__usage-bar > span { display: block; height: 100%; border-radius: inherit; transition: width var(--wx-d-slow) var(--wx-ease-decelerate); }
.wx-profile__usage-bar > .is-brand { background: var(--wx-gradient-button); }
.wx-profile__usage-bar > .is-warning { background: var(--wx-gradient-warning); }
.wx-profile__usage-bar > .is-danger { background: var(--wx-gradient-danger); }

/* Footer */
.wx-profile__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-2);
  padding-top: var(--wx-space-2);
  border-top: 1px solid var(--wx-border-subtle);
}
.wx-profile__version {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  border: 0;
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-text-muted);
  font-family: inherit;
  font-size: 11px;
  font-weight: var(--wx-fw-bold);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-profile__version :deep(svg) { width: 12px; height: 12px; }
.wx-profile__version:hover { background: var(--wx-hover-bg); color: var(--wx-brand-primary); }
.wx-profile__foot-right { display: inline-flex; align-items: center; gap: var(--wx-space-2); min-width: 0; }
.wx-profile__sep { width: 1px; height: 16px; background: var(--wx-border-default); }
.wx-profile__seg { display: inline-flex; padding: 2px; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); background: var(--wx-surface-sunken); }
.wx-profile__seg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--wx-text-muted);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-profile__seg-btn :deep(svg) { width: 13px; height: 13px; }
.wx-profile__seg-btn:hover { color: var(--wx-text-primary); }
.wx-profile__seg-btn.is-active { background: var(--wx-surface-base); color: var(--wx-brand-primary); box-shadow: var(--wx-shadow-sm); }
.wx-profile__seg-btn:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 1px; }

/* ═══ Transition ═══ */
.wx-profile-pop-enter-active,
.wx-profile-pop-leave-active {
  transition: opacity var(--wx-d-fast) var(--wx-ease-standard), transform var(--wx-d-fast) var(--wx-ease-standard);
  transform-origin: top right;
}
.wx-profile-pop-enter-from,
.wx-profile-pop-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }

.wx-profile-expand-enter-active,
.wx-profile-expand-leave-active {
  transition: opacity var(--wx-d-fast) var(--wx-ease-standard), max-height var(--wx-d-normal) var(--wx-ease-standard);
  max-height: 260px;
}
.wx-profile-expand-enter-from,
.wx-profile-expand-leave-to { opacity: 0; max-height: 0; }

@media (max-width: 480px) {
  .wx-profile__panel { position: fixed; top: calc(var(--wx-density-header-height, 56px) + 8px); right: 8px; left: 8px; width: auto; max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  .wx-profile__glow,
  .wx-profile__row-refresh.is-spinning :deep(svg) { animation: none; }
  .wx-profile-pop-enter-active,
  .wx-profile-pop-leave-active,
  .wx-profile-expand-enter-active,
  .wx-profile-expand-leave-active,
  .wx-profile__tabs-pill,
  .wx-profile__usage-bar > span { transition: none; }
}
</style>
