<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import SaasLayout from '../_layouts/SaasLayout.vue'
import {
  BaseBadge, BaseButton, BaseFormPanel, BaseIconTile, BaseInput, BaseOptionRow, BaseSelectMenu, BaseStatusDot, BaseToggle, FormField,
} from '@/components/common'
import MindSection from '@/components/mindui/MindSection.vue'
import { SHELL_ICONS } from '@/components/layout/shell-icons'
import { useToast } from '@/composables/useToast'
import type { IconTileTone, StatusDotTone } from '@/types'

const { showToast } = useToast()

/* ── Danh mục cài đặt (nav dọc bên trái — cùng bố cục với Cài đặt tài khoản của app) ── */
type SectionKey = 'general' | 'notif' | 'security' | 'integrations'

const sections: { key: SectionKey; label: string; hint: string; desc: string; icon: string; tone: IconTileTone }[] = [
  { key: 'general',      label: 'Chung',     hint: 'Thông tin ứng dụng',      desc: 'Thông tin cơ bản của ứng dụng',               icon: SHELL_ICONS.settings, tone: 'brand' },
  { key: 'notif',        label: 'Thông báo', hint: 'Kênh và loại thông báo',  desc: 'Cấu hình kênh và loại thông báo',             icon: SHELL_ICONS.bell,     tone: 'blue' },
  { key: 'security',     label: 'Bảo mật',   hint: 'Xác thực và truy cập',    desc: 'Chính sách xác thực và kiểm soát truy cập',   icon: SHELL_ICONS.shield,   tone: 'success' },
  { key: 'integrations', label: 'Tích hợp',  hint: 'Dịch vụ bên ngoài',       desc: 'Kết nối với dịch vụ bên ngoài',               icon: SHELL_ICONS.globe,    tone: 'warning' },
]
const tab = ref<SectionKey>('general')
const active = computed(() => sections.find(s => s.key === tab.value) ?? sections[0])

/* ── Section: Chung ── */
const general = reactive({
  appName:       'MindUI SaaS',
  supportEmail:  'support@mindui.vn',
  timezone:      'asia-hcmc',
  language:      'vi',
  currency:      'vnd',
})
const generalDirty = ref(false)

const timezoneOptions = [
  { value: 'asia-hcmc',   label: 'Asia/Ho_Chi_Minh (UTC+7)' },
  { value: 'asia-bangkok', label: 'Asia/Bangkok (UTC+7)' },
  { value: 'utc',         label: 'UTC' },
]
const langOptions = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
]
const currencyOptions = [
  { value: 'vnd', label: 'VND — Việt Nam Đồng' },
  { value: 'usd', label: 'USD — US Dollar' },
]

async function saveGeneral() {
  generalDirty.value = false
  await new Promise(r => setTimeout(r, 600))
  showToast('success', 'Đã lưu cài đặt chung')
}

function resetGeneral() {
  general.appName      = 'MindUI SaaS'
  general.supportEmail = 'support@mindui.vn'
  general.timezone     = 'asia-hcmc'
  general.language     = 'vi'
  general.currency     = 'vnd'
  generalDirty.value   = false
  showToast('info', 'Đã khôi phục cài đặt chung')
}

/* ── Section: Thông báo ── */
const notif = reactive({
  emailNewMember:   true,
  emailNewTx:       true,
  emailFailedTx:    true,
  emailLowBalance:  false,
  pushDesktop:      true,
  pushNewTx:        true,
  dailyReport:      false,
  weeklyReport:     true,
})
const notifDirty = ref(false)

async function saveNotif() {
  notifDirty.value = false
  await new Promise(r => setTimeout(r, 600))
  showToast('success', 'Đã lưu cài đặt thông báo')
}

/* ── Section: Bảo mật ── */
const security = reactive({
  twoFactor:       true,
  sessionTimeout:  '60',
  ipWhitelist:     '',
  requireStrongPw: true,
  logActivity:     true,
})
const securityDirty = ref(false)

const timeoutOptions = [
  { value: '15',  label: '15 phút' },
  { value: '30',  label: '30 phút' },
  { value: '60',  label: '1 giờ' },
  { value: '240', label: '4 giờ' },
  { value: '0',   label: 'Không timeout' },
]

async function saveSecurity() {
  securityDirty.value = false
  await new Promise(r => setTimeout(r, 600))
  showToast('success', 'Đã lưu cài đặt bảo mật')
}

/* ── Section: Tích hợp ── */
interface Integration {
  id: string
  name: string
  desc: string
  /** SVG html cho ô icon */
  icon: string
  tone: IconTileTone
  connected: boolean
  status: 'ok' | 'error' | 'idle'
  statusText: string
}

const integrations = ref<Integration[]>([
  { id: 'stripe',   name: 'Stripe',        desc: 'Cổng thanh toán quốc tế',    icon: SHELL_ICONS.idCard,   tone: 'blue',    connected: true,  status: 'ok',    statusText: 'Đang kết nối' },
  { id: 'payos',    name: 'PayOS',          desc: 'Thanh toán nội địa VN',       icon: SHELL_ICONS.database, tone: 'success', connected: true,  status: 'ok',    statusText: 'Đang kết nối' },
  { id: 'sendgrid', name: 'SendGrid',       desc: 'Gửi email hàng loạt',         icon: SHELL_ICONS.message,  tone: 'brand',   connected: false, status: 'idle',  statusText: 'Chưa kết nối' },
  { id: 'zalo',     name: 'Zalo OA',        desc: 'Thông báo qua Zalo',          icon: SHELL_ICONS.users,    tone: 'blue',    connected: true,  status: 'error', statusText: 'Hết hạn kết nối' },
  { id: 'slack',    name: 'Slack',          desc: 'Thông báo nội bộ team',       icon: SHELL_ICONS.bell,     tone: 'warning', connected: false, status: 'idle',  statusText: 'Chưa kết nối' },
  { id: 'webhook',  name: 'Webhook URL',    desc: 'HTTP callback tùy chỉnh',     icon: SHELL_ICONS.sync,     tone: 'neutral', connected: true,  status: 'ok',    statusText: 'Đang kết nối' },
])

const STATUS_TONE: Record<Integration['status'], StatusDotTone> = { ok: 'success', error: 'danger', idle: 'neutral' }

const testingId = ref<string | null>(null)

async function testIntegration(itg: Integration) {
  testingId.value = itg.id
  await new Promise(r => setTimeout(r, 1200))
  testingId.value = null
  if (itg.status === 'error') {
    showToast('error', `${itg.name}: Kết nối thất bại — phiên kết nối đã hết hạn`)
  } else if (itg.connected) {
    showToast('success', `${itg.name}: Kết nối thành công`)
  } else {
    showToast('warning', `${itg.name}: Chưa được cấu hình`)
  }
}

async function toggleIntegration(itg: Integration) {
  await new Promise(r => setTimeout(r, 500))
  itg.connected = !itg.connected
  itg.status    = itg.connected ? 'ok'   : 'idle'
  itg.statusText = itg.connected ? 'Đang kết nối' : 'Chưa kết nối'
  showToast(itg.connected ? 'success' : 'info', `${itg.name}: ${itg.statusText}`)
}

/** Dấu "chưa lưu" trên nav + đầu panel */
const dirtyOf = (k: SectionKey) => (k === 'general' ? generalDirty.value : k === 'notif' ? notifDirty.value : k === 'security' ? securityDirty.value : false)
</script>

<template>
  <SaasLayout
    current="settings"
    page-title="Cài đặt hệ thống"
    page-description="Cấu hình ứng dụng, thông báo, bảo mật và tích hợp"
  >
    <div class="st">
      <nav class="st__nav mind-slim-scroll" aria-label="Danh mục cài đặt hệ thống">
        <button
          v-for="s in sections"
          :key="s.key"
          type="button"
          class="st__item"
          :class="{ 'is-active': tab === s.key }"
          :aria-current="tab === s.key ? 'page' : undefined"
          @click="tab = s.key"
        >
          <span class="st__ico" v-html="s.icon" />
          <span class="st__txt">
            <span class="st__label">{{ s.label }}</span>
            <span class="st__hint">{{ s.hint }}</span>
          </span>
          <span v-if="dirtyOf(s.key)" class="st__dirty" title="Có thay đổi chưa lưu" aria-label="Có thay đổi chưa lưu" />
        </button>
      </nav>

      <div class="st__main">
        <BaseFormPanel
          :key="active.key"
          class="st__panel"
          flat
          :title="active.label"
          :subtitle="active.desc"
          :icon="active.icon"
          :tone="active.tone"
        >
          <template v-if="dirtyOf(active.key)" #head-extra>
            <BaseBadge text="Chưa lưu" variant="warning" dot size="sm" />
          </template>

          <!-- ── Chung ── -->
          <div v-if="tab === 'general'" class="st__form">
            <div class="st__grid st__grid--2">
              <FormField label="Tên ứng dụng">
                <BaseInput v-model="general.appName" placeholder="Tên hiển thị..." @input="generalDirty = true" />
              </FormField>
              <FormField label="Email hỗ trợ">
                <BaseInput v-model="general.supportEmail" type="email" placeholder="support@..." @input="generalDirty = true" />
              </FormField>
            </div>
            <div class="st__grid st__grid--3">
              <FormField label="Múi giờ">
                <BaseSelectMenu v-model="general.timezone" :options="timezoneOptions" @update:modelValue="generalDirty = true" />
              </FormField>
              <FormField label="Ngôn ngữ">
                <BaseSelectMenu v-model="general.language" :options="langOptions" @update:modelValue="generalDirty = true" />
              </FormField>
              <FormField label="Tiền tệ">
                <BaseSelectMenu v-model="general.currency" :options="currencyOptions" @update:modelValue="generalDirty = true" />
              </FormField>
            </div>
          </div>

          <!-- ── Thông báo ── -->
          <div v-else-if="tab === 'notif'" class="st__form">
            <MindSection title="Email">
              <div class="st__rows">
                <BaseOptionRow v-model="notif.emailNewMember" label="Thành viên mới đăng ký" description="Gửi email khi có tài khoản mới" @update:model-value="notifDirty = true" />
                <BaseOptionRow v-model="notif.emailNewTx" label="Giao dịch mới" description="Thông báo mỗi giao dịch thành công" @update:model-value="notifDirty = true" />
                <BaseOptionRow v-model="notif.emailFailedTx" label="Giao dịch thất bại" description="Cảnh báo khi giao dịch lỗi" @update:model-value="notifDirty = true" />
                <BaseOptionRow v-model="notif.emailLowBalance" label="Số dư thấp" description="Cảnh báo khi credit giảm dưới ngưỡng" @update:model-value="notifDirty = true" />
              </div>
            </MindSection>

            <MindSection title="Báo cáo định kỳ">
              <div class="st__rows">
                <BaseOptionRow v-model="notif.dailyReport" indicator="check" label="Báo cáo hàng ngày (8:00 sáng)" @update:model-value="notifDirty = true" />
                <BaseOptionRow v-model="notif.weeklyReport" indicator="check" label="Báo cáo hàng tuần (Thứ 2, 8:00 sáng)" @update:model-value="notifDirty = true" />
                <BaseOptionRow v-model="notif.pushDesktop" indicator="check" label="Thông báo desktop" @update:model-value="notifDirty = true" />
              </div>
            </MindSection>
          </div>

          <!-- ── Bảo mật ── -->
          <div v-else-if="tab === 'security'" class="st__form">
            <MindSection title="Chính sách">
              <div class="st__rows">
                <BaseOptionRow v-model="security.twoFactor" label="Xác thực 2 bước (2FA)" description="Bắt buộc tất cả admin dùng 2FA" @update:model-value="securityDirty = true" />
                <BaseOptionRow v-model="security.requireStrongPw" label="Mật khẩu mạnh bắt buộc" description="Tối thiểu 8 ký tự, có chữ hoa và số" @update:model-value="securityDirty = true" />
                <BaseOptionRow v-model="security.logActivity" label="Ghi log hoạt động" description="Lưu lịch sử đăng nhập và thao tác" @update:model-value="securityDirty = true" />
              </div>
            </MindSection>

            <MindSection title="Truy cập">
              <div class="st__grid st__grid--2">
                <FormField label="Timeout phiên làm việc">
                  <BaseSelectMenu v-model="security.sessionTimeout" :options="timeoutOptions" @update:modelValue="securityDirty = true" />
                </FormField>
                <FormField label="IP whitelist" hint="Phân cách bằng dấu phẩy">
                  <BaseInput v-model="security.ipWhitelist" placeholder="192.168.1.1, 10.0.0.0/24" @input="securityDirty = true" />
                </FormField>
              </div>
            </MindSection>
          </div>

          <!-- ── Tích hợp ── -->
          <div v-else class="st__form">
            <ul class="st__integrations">
              <li v-for="itg in integrations" :key="itg.id" class="itg">
                <BaseIconTile :tone="itg.tone" size="md" :icon="itg.icon" />
                <div class="itg__info">
                  <span class="itg__name">{{ itg.name }}</span>
                  <span class="itg__desc">{{ itg.desc }}</span>
                </div>
                <div class="itg__controls">
                  <span class="itg__status" :class="`itg__status--${itg.status}`">
                    <BaseStatusDot :tone="STATUS_TONE[itg.status]" size="sm" :pulse="itg.status === 'ok'" />{{ itg.statusText }}
                  </span>
                  <div class="itg__actions">
                    <BaseButton
                      size="sm"
                      variant="ghost"
                      :disabled="testingId === itg.id"
                      @click="testIntegration(itg)"
                    >{{ testingId === itg.id ? 'Đang thử…' : 'Kiểm tra' }}</BaseButton>
                    <BaseToggle :model-value="itg.connected" :aria-label="`Bật/tắt ${itg.name}`" @update:modelValue="toggleIntegration(itg)" />
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <template v-if="tab === 'general'" #footer>
            <BaseButton size="sm" variant="ghost" @click="resetGeneral">Khôi phục</BaseButton>
            <BaseButton size="sm" :disabled="!generalDirty" @click="saveGeneral">Lưu thay đổi</BaseButton>
          </template>
          <template v-else-if="tab === 'notif'" #footer>
            <BaseButton size="sm" :disabled="!notifDirty" @click="saveNotif">Lưu thay đổi</BaseButton>
          </template>
          <template v-else-if="tab === 'security'" #footer>
            <BaseButton size="sm" :disabled="!securityDirty" @click="saveSecurity">Lưu thay đổi</BaseButton>
          </template>
        </BaseFormPanel>
      </div>
    </div>
  </SaasLayout>
</template>

<style scoped>
/* ── Bố cục Setting: nav dọc + vùng nội dung ── */
.st { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: var(--wx-space-5); align-items: start; }
.st__nav {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--wx-space-2);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-base);
  box-shadow: var(--wx-shadow-sm);
}
.st__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  width: 100%;
  padding: var(--wx-space-2) var(--wx-space-3);
  border: 0;
  border-radius: var(--wx-radius-lg);
  background: transparent;
  color: var(--wx-text-secondary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.st__item:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
.st__item:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: -2px; }
.st__item.is-active { background: var(--wx-shell-tone-brand-bg); color: var(--wx-shell-tone-brand-fg); }
.st__item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-brand-primary);
}
.st__ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
}
.st__ico :deep(svg) { width: 16px; height: 16px; }
.st__item.is-active .st__ico { background: var(--wx-brand-primary); color: var(--wx-text-inverse); }
.st__txt { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.st__label { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); }
.st__hint { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st__dirty {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--wx-warning-solid);
  box-shadow: 0 0 0 3px var(--wx-warning-bg);
}
.st__item.is-active .st__hint { color: var(--wx-shell-tone-brand-fg); }
.st__main { min-width: 0; }

/* ── Panel: khung form-panel, thân thoáng hơn bản popover ── */
.st__panel { box-shadow: var(--wx-shadow-sm); }
.st__panel :deep(.wx-form-panel__head) { padding: 14px var(--wx-space-5) 12px; }
.st__panel :deep(.wx-form-panel__title) { font-size: var(--wx-fs-15); }
.st__panel :deep(.wx-form-panel__sub) { font-size: var(--wx-fs-12); }
.st__panel :deep(.wx-form-panel__body) { padding: var(--wx-space-5); }
.st__panel :deep(.wx-form-panel__foot) { padding: var(--wx-space-3) var(--wx-space-5); }

.st__form { display: flex; flex-direction: column; gap: var(--wx-space-5); }
.st__grid { display: grid; gap: var(--wx-space-4); }
.st__grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.st__grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.st__rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--wx-space-1);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-sunken);
}

/* ── Danh sách tích hợp ── */
.st__integrations {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
}
.itg {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-elevated);
  border-bottom: 1px solid var(--wx-border-subtle);
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.itg:last-child { border-bottom: 0; }
.itg:hover { background: var(--wx-hover-bg); }
.itg__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.itg__name { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.itg__desc { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.itg__controls { display: flex; align-items: center; gap: var(--wx-space-3); flex-shrink: 0; }
.itg__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px var(--wx-space-2);
  border: 1px solid transparent;
  border-radius: var(--wx-radius-full);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  white-space: nowrap;
}
.itg__status--ok    { background: var(--wx-success-bg); border-color: var(--wx-success-border); color: var(--wx-success-text); }
.itg__status--error { background: var(--wx-danger-bg);  border-color: var(--wx-danger-border);  color: var(--wx-danger-text); }
.itg__status--idle  { background: var(--wx-neutral-bg); border-color: var(--wx-neutral-border); color: var(--wx-neutral-text); }
.itg__actions { display: flex; align-items: center; gap: var(--wx-space-2); }

/* ── Mobile ── */
@media (max-width: 860px) {
  .st { grid-template-columns: minmax(0, 1fr); }
  .st__nav { position: static; flex-direction: row; overflow-x: auto; }
  .st__item { width: auto; flex-shrink: 0; }
  .st__hint { display: none; }
  .st__grid--3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .st__grid--2, .st__grid--3 { grid-template-columns: minmax(0, 1fr); }
  .st__panel :deep(.wx-form-panel__body) { padding: var(--wx-space-3); }
  .st__panel :deep(.wx-form-panel__head),
  .st__panel :deep(.wx-form-panel__foot) { padding-left: var(--wx-space-3); padding-right: var(--wx-space-3); }
  .itg { flex-wrap: wrap; align-items: flex-start; padding: var(--wx-space-3); }
  .itg__info { flex-basis: calc(100% - 52px); }
  .itg__desc { white-space: normal; }
  .itg__controls { width: 100%; justify-content: space-between; }
}
</style>
