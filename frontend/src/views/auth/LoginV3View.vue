<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { BaseButton, BaseCheckbox, BaseSelectMenu, BaseProgress, FormField, BaseTabs } from '../../components/common'
import AuthField from '../_layouts/AuthField.vue'

const ICON_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
const ICON_USER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
const ICON_PHONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`

type AuthMode  = 'login' | 'signup'
type Direction = 'forward' | 'backward'

/* ── mode + direction ── */
const mode      = ref<AuthMode>('login')
const direction = ref<Direction>('forward')

const AUTH_TABS = [
  { key: 'login',  label: 'Đăng nhập' },
  { key: 'signup', label: 'Đăng ký'   },
]

function onTabChange(key: string) {
  switchTo(key as AuthMode)
}

/* ── toast ── */
interface Toast { msg: string; type: 'success' | 'error' }
const toast = ref<Toast | null>(null)
let toastTimer: ReturnType<typeof setTimeout>
function showToast(msg: string, type: Toast['type'] = 'success') {
  clearTimeout(toastTimer)
  toast.value = { msg, type }
  toastTimer = setTimeout(() => { toast.value = null }, 3500)
}

/* ── segmented switch ── */
function switchTo(next: AuthMode) {
  if (next === mode.value) return
  direction.value = next === 'signup' ? 'forward' : 'backward'
  mode.value = next
  if (next === 'login') {
    lErr.value = {}; lTouched.value = {}; lLoading.value = false
    sStep.value = 1; sErrors.value = {}
    sAccount.value = { email: '', password: '', confirm: '' }
  } else {
    sErrors.value = {}
  }
}

/* ── login form ── */
const lForm    = ref({ email: '', password: '', remember: false })
const lErr     = ref<{ email?: string; password?: string; general?: string }>({})
const lTouched = ref<{ email?: boolean; password?: boolean }>({})
const lLoading = ref(false)
const lDone    = ref(false)

function validateLogin() {
  const e: typeof lErr.value = {}
  if (!lForm.value.email.includes('@')) e.email = 'Email không hợp lệ.'
  if (lForm.value.password.length < 6)  e.password = 'Mật khẩu tối thiểu 6 ký tự.'
  lErr.value = e
  return Object.keys(e).length === 0
}

function onLBlur(field: 'email' | 'password') {
  lTouched.value[field] = true
  validateLogin()
}

/* ── shake feedback ── */
const cardShake = ref(false)
function triggerShake() {
  cardShake.value = false
  requestAnimationFrame(() => { cardShake.value = true })
  setTimeout(() => { cardShake.value = false }, 600)
}

async function submitLogin() {
  lTouched.value = { email: true, password: true }
  if (!validateLogin()) { triggerShake(); return }
  lLoading.value = true
  await new Promise(r => setTimeout(r, 900))
  lLoading.value = false
  if (lForm.value.email === 'wrong@test.com') {
    lErr.value.general = 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.'
    triggerShake()
    return
  }
  lDone.value = true
  showToast('Đăng nhập thành công! Đang chuyển hướng...', 'success')
}

/* ── sign-up wizard ── */
const sStep    = ref<1 | 2 | 3>(1)
const sAccount = ref({ email: '', password: '', confirm: '' })
const sProfile = ref({ fullName: '', phone: '', country: 'vn', role: 'pm' })
const sErrors  = ref<Record<string, string>>({})

const countryOpts = [
  { value: 'vn', label: 'Việt Nam' },
  { value: 'sg', label: 'Singapore' },
  { value: 'us', label: 'Hoa Kỳ' },
  { value: 'jp', label: 'Nhật Bản' },
]
const roleOpts = [
  { value: 'pm',  label: 'Quản lý sản phẩm' },
  { value: 'eng', label: 'Kỹ sư' },
  { value: 'des', label: 'Thiết kế' },
  { value: 'ops', label: 'Vận hành' },
  { value: 'biz', label: 'Kinh doanh' },
]

const passStrength = computed(() => {
  const p = sAccount.value.password
  let s = 0
  if (p.length >= 8) s += 25
  if (/[A-Z]/.test(p)) s += 25
  if (/[0-9]/.test(p)) s += 25
  if (/[^A-Za-z0-9]/.test(p)) s += 25
  return s
})
const passLabel = computed(() => {
  if (passStrength.value >= 75) return 'Mạnh'
  if (passStrength.value >= 50) return 'Khá'
  if (passStrength.value >= 25) return 'Yếu'
  return 'Rất yếu'
})
const passVariant = computed<'success' | 'primary' | 'warning' | 'danger'>(() => {
  if (passStrength.value >= 75) return 'success'
  if (passStrength.value >= 50) return 'primary'
  if (passStrength.value >= 25) return 'warning'
  return 'danger'
})

function nextStep() {
  sErrors.value = {}
  if (sStep.value === 1) {
    if (!sAccount.value.email.includes('@'))                        sErrors.value.email    = 'Email không hợp lệ.'
    if (passStrength.value < 50)                                    sErrors.value.password = 'Mật khẩu chưa đủ mạnh.'
    if (sAccount.value.password !== sAccount.value.confirm)         sErrors.value.confirm  = 'Mật khẩu xác nhận không khớp.'
    if (Object.keys(sErrors.value).length) return
    sStep.value = 2
  } else if (sStep.value === 2) {
    if (!sProfile.value.fullName.trim()) sErrors.value.fullName = 'Vui lòng nhập họ tên.'
    if (Object.keys(sErrors.value).length) return
    sStep.value = 3
  }
}
function backStep() {
  if (sStep.value > 1) sStep.value = (sStep.value - 1) as 1 | 2 | 3
}

const transitionName = computed(() => `auth-${direction.value}`)

const ICON_GOOGLE    = `<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`
const ICON_MICROSOFT = `<svg width="16" height="16" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#f25022"/><rect x="11" width="10" height="10" fill="#7fba00"/><rect y="11" width="10" height="10" fill="#00a4ef"/><rect x="11" y="11" width="10" height="10" fill="#ffb900"/></svg>`
</script>

<template>
  <div class="v3-page">

    <!-- ambient orbs -->
    <div class="v3-bg" aria-hidden="true">
      <div class="v3-orb v3-orb--a" />
      <div class="v3-orb v3-orb--b" />
      <div class="v3-orb v3-orb--c" />
    </div>

    <!-- center wrap -->
    <div class="v3-wrap">

      <!-- brand -->
      <RouterLink to="/" class="v3-brand">
        <span class="v3-logo-tile"><img src="/logo.png" alt="MindUI" class="v3-logo" /></span>
        <span class="v3-brand-name">MindUI</span>
      </RouterLink>

      <!-- card -->
      <div class="v3-card" :class="{ 'v3-card--shake': cardShake }">

        <!-- segmented switch -->
        <BaseTabs
          :model-value="mode"
          :tabs="AUTH_TABS"
          class="v3-tabs"
          @update:model-value="onTabChange"
        />

        <!-- form stage -->
        <div class="v3-stage">
          <Transition :name="transitionName">

            <!-- ─── Login form ─── -->
            <form v-if="mode === 'login'" key="login" class="v3-form" novalidate @submit.prevent="submitLogin">

              <!-- success state -->
              <div v-if="lDone" class="form-success" role="status">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Đăng nhập thành công! Đang chuyển hướng...
              </div>

              <template v-else>
                <div v-if="lErr.general" class="form-alert form-alert--error" role="alert">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {{ lErr.general }}
                </div>

                <AuthField
                  v-model="lForm.email"
                  label="Email"
                  type="email"
                  :icon="ICON_MAIL"
                  placeholder="ban@congty.vn"
                  autocomplete="email"
                  inputmode="email"
                  :error="lTouched.email ? lErr.email : undefined"
                  :disabled="lLoading"
                  required
                  @blur="onLBlur('email')"
                />

                <AuthField
                  v-model="lForm.password"
                  label="Mật khẩu"
                  type="password"
                  :icon="ICON_LOCK"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  :error="lTouched.password ? lErr.password : undefined"
                  :disabled="lLoading"
                  required
                  @blur="onLBlur('password')"
                >
                  <template #label-extra>
                    <RouterLink to="/auth/forgot">Quên mật khẩu?</RouterLink>
                  </template>
                </AuthField>

                <BaseCheckbox v-model="lForm.remember" label="Lưu mật khẩu trên thiết bị này" :disabled="lLoading" />

                <BaseButton type="submit" :loading="lLoading" block>Đăng nhập</BaseButton>

                <div class="form-divider"><span>hoặc tiếp tục với</span></div>

                <div class="social-grid">
                  <BaseButton variant="secondary" type="button" block :disabled="lLoading" :icon="ICON_GOOGLE">Google</BaseButton>
                  <BaseButton variant="secondary" type="button" block :disabled="lLoading" :icon="ICON_MICROSOFT">Microsoft</BaseButton>
                </div>

                <p class="form-foot">
                  Chưa có tài khoản?
                  <button type="button" class="link-btn" @click="switchTo('signup')">Đăng ký ngay →</button>
                </p>
              </template>
            </form>

            <!-- ─── Sign-up wizard ─── -->
            <div v-else key="signup" class="v3-signup">

              <!-- step indicators -->
              <div class="s-steps">
                <div v-for="i in 3" :key="i" class="s-step"
                  :class="{ 's-step--active': i === sStep, 's-step--done': i < sStep }">
                  <span class="s-step-num">{{ i }}</span>
                  <span class="s-step-label">
                    {{ i === 1 ? 'Tài khoản' : i === 2 ? 'Hồ sơ' : 'Hoàn tất' }}
                  </span>
                </div>
              </div>

              <!-- step 1: account -->
              <form v-if="sStep === 1" class="v3-form" @submit.prevent="nextStep">
                <AuthField v-model="sAccount.email" label="Email công ty" type="email" :icon="ICON_MAIL" placeholder="ban@congty.vn" autocomplete="email" :error="sErrors.email" required />
                <AuthField v-model="sAccount.password" label="Mật khẩu" type="password" :icon="ICON_LOCK" autocomplete="new-password" :error="sErrors.password" hint="Tối thiểu 8 ký tự, có chữ HOA, số, ký tự đặc biệt." required />
                <div v-if="sAccount.password" class="s-strength">
                  <BaseProgress :value="passStrength" :variant="passVariant" size="sm" />
                  <span class="s-strength-label" :data-v="passVariant">{{ passLabel }}</span>
                </div>
                <AuthField v-model="sAccount.confirm" label="Xác nhận mật khẩu" type="password" :icon="ICON_LOCK" autocomplete="new-password" :error="sErrors.confirm" required />
                <BaseButton type="submit" block>Tiếp tục →</BaseButton>
              </form>

              <!-- step 2: profile -->
              <form v-else-if="sStep === 2" class="v3-form" @submit.prevent="nextStep">
                <AuthField v-model="sProfile.fullName" label="Họ và tên" :icon="ICON_USER" placeholder="Nguyễn Văn A" autocomplete="name" :error="sErrors.fullName" required />
                <AuthField v-model="sProfile.phone" label="Số điện thoại (không bắt buộc)" type="tel" :icon="ICON_PHONE" placeholder="+84 ..." autocomplete="tel" />
                <FormField label="Quốc gia">
                  <BaseSelectMenu v-model="sProfile.country" :options="countryOpts" />
                </FormField>
                <FormField label="Vai trò">
                  <BaseSelectMenu v-model="sProfile.role" :options="roleOpts" />
                </FormField>
                <div class="s-row">
                  <BaseButton variant="ghost" type="button" @click="backStep">← Quay lại</BaseButton>
                  <BaseButton type="submit">Tiếp tục →</BaseButton>
                </div>
              </form>

              <!-- step 3: finish -->
              <div v-else class="s-finish">
                <div class="s-finish-emoji">🎉</div>
                <h2>Sẵn sàng bắt đầu!</h2>
                <p>Tài khoản <strong>{{ sAccount.email }}</strong> đã được tạo. Chúng tôi gửi email xác minh đến bạn.</p>
                <RouterLink to="/auth/email-verify" class="s-cta-link">
                  <BaseButton block>Mở hộp thư xác minh →</BaseButton>
                </RouterLink>
                <button type="button" class="link-btn" @click="switchTo('login')">Đã xác minh? Đăng nhập ngay</button>
              </div>

            </div>

          </Transition>
        </div>
      </div>

      <p class="v3-legal">© 2026 MindUI · Bảo mật end-to-end</p>
    </div>

    <!-- toast -->
    <Teleport to="body">
      <Transition name="toast-pop">
        <div
          v-if="toast"
          class="v3-toast"
          :class="`v3-toast--${toast.type}`"
          role="status"
          aria-live="polite"
        >
          <svg v-if="toast.type === 'success'" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ toast.msg }}
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* ── Page shell ── */
.v3-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--wx-shell-page-bg);
  position: relative;
  overflow: hidden;
}

/* ambient orbs */
.v3-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.v3-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: .12;
  will-change: transform;
  animation: mind-orb-float 22s ease-in-out infinite alternate;
}
.v3-orb--a {
  width: 560px; height: 560px;
  background: var(--wx-brand-400);
  opacity: .15;
  top: -220px; left: -180px;
}
.v3-orb--b {
  width: 420px; height: 420px;
  background: var(--wx-brand-accent);
  opacity: .12;
  bottom: -200px; right: -140px;
  animation-delay: -8s;
}
.v3-orb--c {
  width: 320px; height: 320px;
  background: var(--wx-shell-orb-c);
  opacity: .5;
  top: 40%; left: 55%;
  animation-delay: -14s;
  animation-duration: 18s;
}

/* wrap */
.v3-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wx-space-4);
  width: 100%;
  max-width: 560px;
  padding: var(--wx-space-5) var(--wx-space-4);
}

/* brand */
.v3-brand {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  text-decoration: none;
  color: inherit;
}
.v3-logo-tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.18);
}
.v3-logo {
  width: 30px; height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}
.v3-brand-name {
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
}

/* card */
.v3-card {
  width: 100%;
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-2xl);
  box-shadow:
    0 4px 6px -1px rgba(37, 99, 235, 0.08),
    0 10px 24px -4px rgba(37, 99, 235, 0.14),
    0 24px 64px -12px rgba(37, 99, 235, 0.22),
    0 0 0 1px rgba(37, 99, 235, 0.06);
  padding: var(--wx-space-9) var(--wx-space-8);
  min-height: 620px;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-6);
  overflow: hidden;
}

/* ── BaseTabs override — strip margin-bottom (form stage handles gap) ── */
.v3-tabs :deep(.base-tabs__content) { display: none; }
.v3-tabs :deep(.base-tabs__header)  { margin-bottom: 0; }

/* ── Form stage ── */
.v3-stage {
  position: relative;
}

/* ── Form ── */
.v3-form {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
  width: 100%;
}

/* ── Form transitions — reveal top → bottom ── */

/* Leaving: fade out nhanh */
.auth-forward-leave-active,
.auth-backward-leave-active {
  position: absolute;
  top: 0; left: 0; right: 0;
  pointer-events: none;
  transition: opacity 200ms ease;
}
.auth-forward-leave-to,
.auth-backward-leave-to { opacity: 0; }

/* Entering: clip-path reveal từ trên xuống trong 1s */
.auth-forward-enter-active,
.auth-backward-enter-active {
  transition: clip-path 1s cubic-bezier(.4, 0, .2, 1);
}
.auth-forward-enter-from,
.auth-backward-enter-from { clip-path: inset(0 0 100% 0); }
.auth-forward-enter-to,
.auth-backward-enter-to   { clip-path: inset(0 0 0% 0); }

@media (prefers-reduced-motion: reduce) {
  .auth-forward-enter-active,
  .auth-backward-enter-active { transition: opacity 120ms linear; }
  .auth-forward-enter-from,
  .auth-backward-enter-from { clip-path: none; opacity: 0; }
  .auth-forward-enter-to,
  .auth-backward-enter-to   { clip-path: none; opacity: 1; }
}

/* ═══════════════════════════════════════════
   1. ENTRANCE — staggered fade + slide-up
═══════════════════════════════════════════ */
@keyframes v3-entrance {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.v3-brand { animation: v3-entrance 0.45s cubic-bezier(0,0,.2,1) both 0.05s; }
.v3-card  { animation: v3-entrance 0.50s cubic-bezier(0,0,.2,1) both 0.10s; }

/* tab switch bên trong card */
.v3-tabs  { animation: v3-entrance 0.38s cubic-bezier(0,0,.2,1) both 0.18s; }

/* step indicators của wizard */
.s-steps  { animation: v3-entrance 0.35s cubic-bezier(0,0,.2,1) both 0.18s; }

/* form fields — mỗi field lệch 50ms */
.v3-form > *:nth-child(1) { animation: v3-entrance 0.38s cubic-bezier(0,0,.2,1) both 0.22s; }
.v3-form > *:nth-child(2) { animation: v3-entrance 0.38s cubic-bezier(0,0,.2,1) both 0.27s; }
.v3-form > *:nth-child(3) { animation: v3-entrance 0.38s cubic-bezier(0,0,.2,1) both 0.32s; }
.v3-form > *:nth-child(4) { animation: v3-entrance 0.38s cubic-bezier(0,0,.2,1) both 0.36s; }
.v3-form > *:nth-child(5) { animation: v3-entrance 0.38s cubic-bezier(0,0,.2,1) both 0.40s; }
.v3-form > *:nth-child(6) { animation: v3-entrance 0.38s cubic-bezier(0,0,.2,1) both 0.44s; }
.v3-form > *:nth-child(7) { animation: v3-entrance 0.38s cubic-bezier(0,0,.2,1) both 0.48s; }

/* ═══════════════════════════════════════════
   2. INTERACTIVE — focus ring ripple
═══════════════════════════════════════════ */
@keyframes v3-focus-ring {
  from { box-shadow: 0 0 0 0 rgba(37,99,235,0.5); }
  to   { box-shadow: 0 0 0 3px rgba(37,99,235,0.16), 0 0 0 1px rgba(37,99,235,0.35); }
}
.v3-form :deep(.base-input__field:focus) {
  animation: v3-focus-ring 250ms cubic-bezier(0,0,.2,1) forwards;
}

/* ═══════════════════════════════════════════
   3. FEEDBACK — card shake on error
═══════════════════════════════════════════ */
@keyframes v3-shake {
  0%,100% { transform: translateX(0); }
  18%     { transform: translateX(-10px); }
  36%     { transform: translateX(10px); }
  54%     { transform: translateX(-7px); }
  72%     { transform: translateX(7px); }
  88%     { transform: translateX(-3px); }
}
.v3-card--shake {
  animation: v3-shake 0.55s cubic-bezier(.36,.07,.19,.97) both !important;
}

@media (prefers-reduced-motion: reduce) {
  .v3-brand, .v3-card, .v3-tabs, .s-steps,
  .v3-form > * { animation: none; opacity: 1; transform: none; }
  .v3-card--shake { animation: none !important; }
  .v3-orb { animation: none; }
}

/* ── Field helpers ── */
.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.link-sm {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-link);
  text-decoration: none;
  font-weight: var(--wx-fw-medium);
}
.link-sm:hover { text-decoration: underline; }

.link-btn {
  background: none; border: none; padding: 0;
  font-family: var(--wx-font-primary);
  font-size: inherit;
  color: var(--wx-text-link);
  font-weight: var(--wx-fw-medium);
  cursor: pointer;
}
.link-btn:hover { text-decoration: underline; }


/* ── Success inline ── */
.form-success {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px var(--wx-space-4);
  border-radius: var(--wx-radius-md);
  background: var(--wx-success-bg);
  color: var(--wx-success-text);
  border: 1px solid var(--wx-success-border);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  animation: fade-in var(--wx-d-fast) var(--wx-ease-decelerate);
}
@keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }

/* ── General error alert ── */
.form-alert {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: 10px 14px;
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-fs-13);
  line-height: 1.4;
}
.form-alert--error {
  background: var(--wx-danger-bg);
  color: var(--wx-danger-text);
  border: 1px solid var(--wx-danger-border);
}

/* ── Divider ── */
.form-divider {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  color: var(--wx-text-muted);
  font-size: var(--wx-fs-12);
}
.form-divider::before,
.form-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--wx-border-subtle);
}

/* ── Social ── */
.social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-2);
}

/* ── Footer ── */
.form-foot {
  margin: var(--wx-space-1) 0 0;
  font-size: var(--wx-fs-13);
  text-align: center;
  color: var(--wx-text-muted);
}

.v3-legal {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  text-align: center;
}

/* ── Signup wizard ── */
.v3-signup {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}

.s-steps {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  font-size: var(--wx-fs-12);
}
.s-step {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  color: var(--wx-text-muted);
  flex: 1;
}
.s-step:not(:last-child)::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--wx-border-default);
  margin-left: var(--wx-space-2);
}
.s-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; height: 24px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
  font-weight: var(--wx-fw-semibold);
  border: 1px solid var(--wx-border-default);
  flex-shrink: 0;
}
.s-step--active .s-step-num { background: var(--wx-brand-600); color: var(--wx-text-on-brand); border-color: transparent; }
.s-step--done   .s-step-num { background: var(--wx-success-solid); color: var(--wx-text-on-brand); border-color: transparent; }
.s-step--active .s-step-label { color: var(--wx-text-primary); font-weight: var(--wx-fw-medium); }

.s-strength {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  font-size: var(--wx-fs-12);
}
.s-strength-label[data-v="success"] { color: var(--wx-success-text); }
.s-strength-label[data-v="primary"] { color: var(--wx-brand-primary); }
.s-strength-label[data-v="warning"] { color: var(--wx-warning-text); }
.s-strength-label[data-v="danger"]  { color: var(--wx-danger-text); }

.s-row { display: flex; gap: var(--wx-space-2); justify-content: space-between; }

.s-finish {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-2) 0;
}
.s-finish-emoji { font-size: 48px; }
.s-finish h2 { margin: 0; font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); }
.s-finish p  { margin: 0; color: var(--wx-text-secondary); font-size: var(--wx-fs-14); }
.s-cta-link  { width: 100%; text-decoration: none; }

/* ── Toast ── */
.v3-toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-3) 20px;
  border-radius: var(--wx-radius-xl);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  font-family: var(--wx-font-primary);
  box-shadow: 0 8px 32px -4px rgba(0,0,0,.2);
  z-index: 9999;
  white-space: nowrap;
  border: 1px solid transparent;
}
.v3-toast--success {
  background: var(--wx-success-bg);
  color: var(--wx-success-text);
  border-color: var(--wx-success-border);
}
.v3-toast--error {
  background: var(--wx-danger-bg);
  color: var(--wx-danger-text);
  border-color: var(--wx-danger-border);
}

.toast-pop-enter-active {
  transition: all var(--wx-d-fast) var(--wx-ease-decelerate);
}
.toast-pop-leave-active {
  transition: all var(--wx-d-fast) var(--wx-ease-accelerate);
}
.toast-pop-enter-from,
.toast-pop-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(14px);
}

@media (prefers-reduced-motion: reduce) {
  .toast-pop-enter-active,
  .toast-pop-leave-active {
    transition: opacity var(--wx-d-micro) linear;
  }
  .toast-pop-enter-from,
  .toast-pop-leave-to {
    transform: translateX(-50%);
  }
}
</style>
