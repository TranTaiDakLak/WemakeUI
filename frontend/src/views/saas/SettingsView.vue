<script setup lang="ts">
import { ref, reactive } from 'vue'
import SaasLayout from '../_layouts/SaasLayout.vue'
import { BaseButton, BaseInput, BaseSelectMenu, BaseToggle, BaseCheckbox } from '@/components/common'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

/* ── Section: Chung ── */
const general = reactive({
  appName:       'WeConnect SaaS',
  supportEmail:  'support@wemakeui.vn',
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
  general.appName      = 'WeConnect SaaS'
  general.supportEmail = 'support@wemakeui.vn'
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
  icon: string
  connected: boolean
  status: 'ok' | 'error' | 'idle'
  statusText: string
}

const integrations = ref<Integration[]>([
  { id: 'stripe',   name: 'Stripe',        desc: 'Cổng thanh toán quốc tế',    icon: '💳', connected: true,  status: 'ok',    statusText: 'Đang kết nối' },
  { id: 'payos',    name: 'PayOS',          desc: 'Thanh toán nội địa VN',       icon: '🏦', connected: true,  status: 'ok',    statusText: 'Đang kết nối' },
  { id: 'sendgrid', name: 'SendGrid',       desc: 'Gửi email hàng loạt',         icon: '📧', connected: false, status: 'idle',  statusText: 'Chưa kết nối' },
  { id: 'zalo',     name: 'Zalo OA',        desc: 'Thông báo qua Zalo',          icon: '💬', connected: true,  status: 'error', statusText: 'Token hết hạn' },
  { id: 'slack',    name: 'Slack',          desc: 'Thông báo nội bộ team',       icon: '🔔', connected: false, status: 'idle',  statusText: 'Chưa kết nối' },
  { id: 'webhook',  name: 'Webhook URL',    desc: 'HTTP callback tùy chỉnh',     icon: '🔗', connected: true,  status: 'ok',    statusText: 'Đang kết nối' },
])

const testingId = ref<string | null>(null)

async function testIntegration(itg: Integration) {
  testingId.value = itg.id
  await new Promise(r => setTimeout(r, 1200))
  testingId.value = null
  if (itg.status === 'error') {
    showToast('error', `${itg.name}: Kết nối thất bại — token hết hạn`)
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
</script>

<template>
  <SaasLayout
    current="settings"
    page-title="Cài đặt hệ thống"
    page-description="Cấu hình ứng dụng, thông báo, bảo mật và tích hợp"
  >
    <!-- ── Section: Chung ── -->
    <div class="settings-card">
      <div class="settings-card__header">
        <div class="settings-card__title-row">
          <span class="settings-card__icon">⚙️</span>
          <h3 class="settings-card__title">Cài đặt chung</h3>
          <span v-if="generalDirty" class="dirty-badge">Chưa lưu</span>
        </div>
        <p class="settings-card__desc">Thông tin cơ bản của ứng dụng</p>
      </div>

      <div class="settings-card__body">
        <div class="form-row">
          <div class="form-col">
            <label class="field-label">Tên ứng dụng</label>
            <BaseInput v-model="general.appName" placeholder="Tên hiển thị..." @input="generalDirty = true" />
          </div>
          <div class="form-col">
            <label class="field-label">Email hỗ trợ</label>
            <BaseInput v-model="general.supportEmail" type="email" placeholder="support@..." @input="generalDirty = true" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <label class="field-label">Múi giờ</label>
            <BaseSelectMenu v-model="general.timezone" :options="timezoneOptions" @update:modelValue="generalDirty = true" />
          </div>
          <div class="form-col">
            <label class="field-label">Ngôn ngữ</label>
            <BaseSelectMenu v-model="general.language" :options="langOptions" @update:modelValue="generalDirty = true" />
          </div>
          <div class="form-col">
            <label class="field-label">Tiền tệ</label>
            <BaseSelectMenu v-model="general.currency" :options="currencyOptions" @update:modelValue="generalDirty = true" />
          </div>
        </div>
      </div>

      <div class="settings-card__footer">
        <BaseButton size="sm" variant="ghost" @click="resetGeneral">Khôi phục</BaseButton>
        <BaseButton size="sm" :disabled="!generalDirty" @click="saveGeneral">Lưu thay đổi</BaseButton>
      </div>
    </div>

    <!-- ── Section: Thông báo ── -->
    <div class="settings-card">
      <div class="settings-card__header">
        <div class="settings-card__title-row">
          <span class="settings-card__icon">🔔</span>
          <h3 class="settings-card__title">Thông báo</h3>
          <span v-if="notifDirty" class="dirty-badge">Chưa lưu</span>
        </div>
        <p class="settings-card__desc">Cấu hình kênh và loại thông báo</p>
      </div>

      <div class="settings-card__body">
        <div class="notif-section">
          <p class="notif-section__label">Email</p>
          <div class="toggle-list">
            <div class="toggle-row">
              <div class="toggle-row__info">
                <span class="toggle-row__name">Thành viên mới đăng ký</span>
                <span class="toggle-row__desc">Gửi email khi có tài khoản mới</span>
              </div>
              <BaseToggle v-model="notif.emailNewMember" @update:modelValue="notifDirty = true" />
            </div>
            <div class="toggle-row">
              <div class="toggle-row__info">
                <span class="toggle-row__name">Giao dịch mới</span>
                <span class="toggle-row__desc">Thông báo mỗi giao dịch thành công</span>
              </div>
              <BaseToggle v-model="notif.emailNewTx" @update:modelValue="notifDirty = true" />
            </div>
            <div class="toggle-row">
              <div class="toggle-row__info">
                <span class="toggle-row__name">Giao dịch thất bại</span>
                <span class="toggle-row__desc">Cảnh báo khi giao dịch lỗi</span>
              </div>
              <BaseToggle v-model="notif.emailFailedTx" @update:modelValue="notifDirty = true" />
            </div>
            <div class="toggle-row">
              <div class="toggle-row__info">
                <span class="toggle-row__name">Số dư thấp</span>
                <span class="toggle-row__desc">Cảnh báo khi credit giảm dưới ngưỡng</span>
              </div>
              <BaseToggle v-model="notif.emailLowBalance" @update:modelValue="notifDirty = true" />
            </div>
          </div>
        </div>

        <div class="notif-section">
          <p class="notif-section__label">Báo cáo định kỳ</p>
          <div class="checkbox-list">
            <BaseCheckbox v-model="notif.dailyReport"  label="Báo cáo hàng ngày (8:00 sáng)" @update:modelValue="notifDirty = true" />
            <BaseCheckbox v-model="notif.weeklyReport"  label="Báo cáo hàng tuần (Thứ 2, 8:00 sáng)" @update:modelValue="notifDirty = true" />
            <BaseCheckbox v-model="notif.pushDesktop"  label="Thông báo desktop" @update:modelValue="notifDirty = true" />
          </div>
        </div>
      </div>

      <div class="settings-card__footer">
        <BaseButton size="sm" :disabled="!notifDirty" @click="saveNotif">Lưu thay đổi</BaseButton>
      </div>
    </div>

    <!-- ── Section: Bảo mật ── -->
    <div class="settings-card">
      <div class="settings-card__header">
        <div class="settings-card__title-row">
          <span class="settings-card__icon">🔒</span>
          <h3 class="settings-card__title">Bảo mật</h3>
          <span v-if="securityDirty" class="dirty-badge">Chưa lưu</span>
        </div>
        <p class="settings-card__desc">Chính sách xác thực và kiểm soát truy cập</p>
      </div>

      <div class="settings-card__body">
        <div class="toggle-list">
          <div class="toggle-row">
            <div class="toggle-row__info">
              <span class="toggle-row__name">Xác thực 2 bước (2FA)</span>
              <span class="toggle-row__desc">Bắt buộc tất cả admin dùng 2FA</span>
            </div>
            <BaseToggle v-model="security.twoFactor" @update:modelValue="securityDirty = true" />
          </div>
          <div class="toggle-row">
            <div class="toggle-row__info">
              <span class="toggle-row__name">Mật khẩu mạnh bắt buộc</span>
              <span class="toggle-row__desc">Tối thiểu 8 ký tự, có chữ hoa và số</span>
            </div>
            <BaseToggle v-model="security.requireStrongPw" @update:modelValue="securityDirty = true" />
          </div>
          <div class="toggle-row">
            <div class="toggle-row__info">
              <span class="toggle-row__name">Ghi log hoạt động</span>
              <span class="toggle-row__desc">Lưu lịch sử đăng nhập và thao tác</span>
            </div>
            <BaseToggle v-model="security.logActivity" @update:modelValue="securityDirty = true" />
          </div>
        </div>

        <div class="form-row mt-4">
          <div class="form-col">
            <label class="field-label">Timeout phiên làm việc</label>
            <BaseSelectMenu v-model="security.sessionTimeout" :options="timeoutOptions" @update:modelValue="securityDirty = true" />
          </div>
          <div class="form-col form-col--wide">
            <label class="field-label">IP whitelist (phân cách bằng dấu phẩy)</label>
            <BaseInput v-model="security.ipWhitelist" placeholder="192.168.1.1, 10.0.0.0/24" @input="securityDirty = true" />
          </div>
        </div>
      </div>

      <div class="settings-card__footer">
        <BaseButton size="sm" :disabled="!securityDirty" @click="saveSecurity">Lưu thay đổi</BaseButton>
      </div>
    </div>

    <!-- ── Section: Tích hợp ── -->
    <div class="settings-card">
      <div class="settings-card__header">
        <div class="settings-card__title-row">
          <span class="settings-card__icon">🔌</span>
          <h3 class="settings-card__title">Tích hợp</h3>
        </div>
        <p class="settings-card__desc">Kết nối với dịch vụ bên ngoài</p>
      </div>

      <div class="settings-card__body">
        <div class="integration-list">
          <div v-for="itg in integrations" :key="itg.id" class="integration-row">
            <span class="integration-row__icon">{{ itg.icon }}</span>
            <div class="integration-row__body">
              <div class="integration-row__info">
                <span class="integration-row__name">{{ itg.name }}</span>
                <span class="integration-row__desc">{{ itg.desc }}</span>
              </div>
              <div class="integration-row__controls">
                <span
                  class="integration-row__status"
                  :class="`integration-row__status--${itg.status}`"
                >{{ itg.statusText }}</span>
                <div class="integration-row__actions">
                  <BaseButton
                    size="sm"
                    variant="ghost"
                    :disabled="testingId === itg.id"
                    @click="testIntegration(itg)"
                  >{{ testingId === itg.id ? '...' : 'Test' }}</BaseButton>
                  <BaseToggle :model-value="itg.connected" @update:modelValue="toggleIntegration(itg)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SaasLayout>
</template>

<style scoped>
.settings-card {
  background: var(--wx-surface-default);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
}

.settings-card__header {
  padding: var(--wx-space-4) var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-sunken);
}

.settings-card__title-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  margin-bottom: var(--wx-space-1);
}

.settings-card__icon { font-size: 18px; }

.settings-card__title {
  margin: 0;
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
}

.settings-card__desc {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: var(--wx-text-muted);
}

.dirty-badge {
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  background: color-mix(in srgb, var(--wx-warning-solid) 15%, transparent);
  color: var(--wx-warning-solid);
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
}

.settings-card__body {
  padding: var(--wx-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}

.settings-card__footer {
  padding: var(--wx-space-3) var(--wx-space-5);
  border-top: 1px solid var(--wx-border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: var(--wx-space-2);
}

/* ── Form layout ── */
.form-row {
  display: flex;
  gap: var(--wx-space-4);
  flex-wrap: wrap;
}

.form-col {
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}

.form-col--wide { flex: 2; }

.field-label {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
}

.mt-4 { margin-top: var(--wx-space-4); }

/* ── Notification toggles ── */
.notif-section {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
}

.notif-section__label {
  margin: 0;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  overflow: hidden;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3) var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
}

@media (max-width: 520px) {
  .toggle-row { padding: var(--wx-space-3); }
  .settings-card__body { padding: var(--wx-space-4) var(--wx-space-3); }
  .settings-card__header { padding: var(--wx-space-3); }
  .settings-card__footer { padding: var(--wx-space-3); }
}

.toggle-row:last-child { border-bottom: none; }
.toggle-row:hover { background: var(--wx-surface-hover); }

.toggle-row__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toggle-row__name { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); }
.toggle-row__desc { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3) var(--wx-space-4);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
}

/* ── Integration list ── */
.integration-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  overflow: hidden;
}

.integration-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3) var(--wx-space-4);
  border-bottom: 1px solid var(--wx-border-subtle);
  transition: background 0.12s;
}

.integration-row:last-child { border-bottom: none; }
.integration-row:hover { background: var(--wx-surface-hover); }

.integration-row__icon { font-size: 22px; flex-shrink: 0; align-self: flex-start; margin-top: 2px; }

.integration-row__body {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
}

.integration-row__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.integration-row__name { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.integration-row__desc { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.integration-row__controls {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  flex-shrink: 0;
}

.integration-row__status {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  white-space: nowrap;
}

.integration-row__status--ok    { background: rgba(16,185,129,0.1); color: var(--wx-success-solid); }
.integration-row__status--error { background: rgba(239,68,68,0.1);  color: var(--wx-danger-solid); }
.integration-row__status--idle  { background: var(--wx-surface-sunken); color: var(--wx-text-muted); }

.integration-row__actions {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  flex-shrink: 0;
}

/* ── Mobile: stack controls below info ── */
@media (max-width: 520px) {
  .integration-row {
    align-items: flex-start;
    padding: var(--wx-space-3);
  }
  .integration-row__body {
    flex-direction: column;
    align-items: stretch;
    gap: var(--wx-space-2);
  }
  .integration-row__info {
    /* Let name/desc show fully without ellipsis on mobile */
  }
  .integration-row__name,
  .integration-row__desc {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }
  .integration-row__controls {
    justify-content: flex-end;
    gap: var(--wx-space-2);
  }
}
</style>
