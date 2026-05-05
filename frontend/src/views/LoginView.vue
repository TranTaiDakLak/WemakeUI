<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mockLogin } from '../utils/mockAuth'
import brandingImg from '../assets/login-branding.png'
import wemakeLogo from '../assets/wemake-logo.png'

const router = useRouter()

/* ── Form state ────────────────────────────── */
const form = reactive({
  softwareCode: '',
  email: '',
  password: '',
})

const errors = reactive({
  softwareCode: '',
  email: '',
  password: '',
  general: '',
})

const isLoading = ref(false)
const showPassword = ref(false)

/* ── Validation ────────────────────────────── */
function validateEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function validate(): boolean {
  let ok = true
  errors.softwareCode = ''
  errors.email = ''
  errors.password = ''
  errors.general = ''

  if (!form.softwareCode.trim()) {
    errors.softwareCode = 'Vui lòng nhập mã phần mềm'
    ok = false
  }
  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập email'
    ok = false
  } else if (!validateEmail(form.email)) {
    errors.email = 'Email không đúng định dạng'
    ok = false
  }
  if (!form.password.trim()) {
    errors.password = 'Vui lòng nhập mật khẩu'
    ok = false
  }
  return ok
}

/* ── Mock submit ───────────────────────────── */
async function handleLogin() {
  if (!validate()) return

  isLoading.value = true
  errors.general = ''

  try {
    const result = await mockLogin({
      softwareCode: form.softwareCode,
      email: form.email,
      password: form.password,
    })
    if (result.success) {
      router.push('/app/facebook')
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại'
    errors.general = msg
  } finally {
    isLoading.value = false
  }
}

function handleRegister() {
  /* placeholder — không navigate, chỉ ghi chú "sắp ra mắt" */
  errors.general = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') handleLogin()
}
</script>

<template>
  <div class="login-page" @keydown="onKeydown">
    <!-- ═══ LEFT: Branding Panel ═══ -->
    <section class="branding-panel" aria-hidden="true">
      <div class="branding-bg">
        <img :src="brandingImg" alt="" class="branding-img" />
        <div class="branding-overlay"></div>
      </div>

      <!-- Decorative dots -->
      <div class="decor-dots" aria-hidden="true"></div>

      <div class="branding-content">
        <h3 class="branding-label">WECONNECT</h3>

        <div class="coming-soon-block">
          <span class="deco deco-quote-l">'</span>
          <div class="coming-soon-text">
            <span class="cs-line1">COMING</span>
            <span class="cs-line2">
              <span class="deco deco-plus">+</span>
              SOON
            </span>
          </div>
          <span class="deco deco-quote-r">'</span>
        </div>

        <!-- Lightning bolts -->
        <div class="deco-bolts" aria-hidden="true">
          <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
            <path d="M24 0L18 22H30L12 56L20 30H8L24 0Z" fill="currentColor" opacity="0.9"/>
          </svg>
          <svg width="32" height="38" viewBox="0 0 48 56" fill="none">
            <path d="M24 0L18 22H30L12 56L20 30H8L24 0Z" fill="currentColor" opacity="0.7"/>
          </svg>
        </div>

        <div class="stay-tuned">
          <span>STAY TUNED</span>
        </div>

        <span class="deco deco-x">✕</span>
      </div>

      <div class="branding-footer">
        <span>wemake.vn</span>
      </div>
    </section>

    <!-- ═══ RIGHT: Login Form ═══ -->
    <section class="form-panel">
      <div class="form-wrapper">
        <!-- Header: logo + title -->
        <div class="form-header">
          <img :src="wemakeLogo" alt="Wemake" class="form-logo-icon" />
          <h1 class="form-title">WE CONNECT</h1>
        </div>

        <!-- General error -->
        <div v-if="errors.general" class="error-banner" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
            <path d="M8 4.5v4M8 10.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span>{{ errors.general }}</span>
        </div>

        <!-- Form -->
        <form class="login-form" @submit.prevent="handleLogin" novalidate>
          <!-- Mã phần mềm -->
          <div class="field" :class="{ 'field--error': errors.softwareCode }">
            <label for="softwareCode" class="field-label">Mã phần mềm</label>
            <input
              id="softwareCode"
              v-model="form.softwareCode"
              type="text"
              class="field-input"
              placeholder="Nhập mã phần mềm của bạn"
              autocomplete="off"
              :disabled="isLoading"
            />
            <span v-if="errors.softwareCode" class="field-error">{{ errors.softwareCode }}</span>
          </div>

          <!-- Email -->
          <div class="field" :class="{ 'field--error': errors.email }">
            <label for="loginEmail" class="field-label">Email</label>
            <input
              id="loginEmail"
              v-model="form.email"
              type="email"
              class="field-input"
              placeholder="Nhập địa chỉ email"
              autocomplete="email"
              :disabled="isLoading"
            />
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>

          <!-- Mật khẩu -->
          <div class="field" :class="{ 'field--error': errors.password }">
            <label for="loginPassword" class="field-label">Mật khẩu</label>
            <div class="field-password-wrap">
              <input
                id="loginPassword"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input field-input--password"
                placeholder="Nhập mật khẩu"
                autocomplete="current-password"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :title="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                tabindex="-1"
              >
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
          </div>

          <!-- Buttons: side by side -->
          <div class="form-actions">
            <button type="submit" class="btn-login" :disabled="isLoading">
              <svg v-if="isLoading" class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
                <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}</span>
            </button>

            <button type="button" class="btn-register" :disabled="isLoading" @click="handleRegister">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" stroke-linecap="round"/>
                <line x1="23" y1="11" x2="17" y2="11" stroke-linecap="round"/>
              </svg>
              <span>Đăng ký</span>
            </button>
          </div>
        </form>

        <!-- Footer hint -->
        <p class="form-hint">
          💡 Demo: nhập bất kỳ → success, email chứa "<strong>fail</strong>" → error
        </p>

        <p class="form-copyright">
          © 2026 Wemake Software Co., Ltd. All rights reserved. Version 1.0.0
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════
   LOGIN PAGE — WeConnect style
   All colors from CSS variables in style.css
   ═══════════════════════════════════════════════ */

.login-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: var(--font-family);
  background: var(--login-bg);
}

/* ─── Branding Panel (Left ~55%) ──────────── */
.branding-panel {
  flex: 0 0 55%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.branding-bg {
  position: absolute;
  inset: 0;
}

.branding-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.branding-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    var(--brand-primary-dark) 0%,
    var(--login-overlay-start) 50%,
    var(--login-overlay-end) 100%
  );
}

/* Decorative dot grid */
.decor-dots {
  position: absolute;
  top: var(--space-xl);
  left: var(--space-xl);
  width: 120px;
  height: 80px;
  z-index: 1;
  background-image: radial-gradient(circle, var(--login-glass-bg) 1.5px, transparent 1.5px);
  background-size: 14px 14px;
  opacity: 0.6;
}

.branding-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--login-card-bg);
  padding: var(--space-2xl);
}

.branding-label {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: var(--space-lg);
}

/* Coming Soon block */
.coming-soon-block {
  position: relative;
  display: inline-block;
  margin-bottom: var(--space-xl);
}

.coming-soon-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cs-line1 {
  font-size: 72px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0 var(--brand-primary-dark);
}

.cs-line2 {
  font-size: 88px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0 var(--brand-primary-dark);
  position: relative;
}

/* Decorative elements */
.deco {
  position: absolute;
  font-weight: 900;
  opacity: 0.7;
}

.deco-quote-l {
  font-size: 64px;
  top: -10px;
  left: -40px;
}

.deco-quote-r {
  font-size: 64px;
  bottom: -10px;
  right: -40px;
}

.deco-plus {
  position: relative;
  font-size: 28px;
  margin-right: var(--space-sm);
  opacity: 0.7;
}

.deco-x {
  position: absolute;
  bottom: 140px;
  right: 80px;
  font-size: 20px;
  opacity: 0.5;
  z-index: 2;
}

.deco-bolts {
  position: absolute;
  top: 80px;
  right: 100px;
  z-index: 2;
  display: flex;
  gap: var(--space-xs);
  color: var(--login-card-bg);
  transform: rotate(-5deg);
}

/* Stay Tuned badge */
.stay-tuned {
  display: inline-block;
}

.stay-tuned span {
  display: inline-block;
  padding: var(--space-sm) var(--space-xl);
  border: 3px solid var(--login-card-bg);
  border-radius: 100px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 3px;
}

.branding-footer {
  position: absolute;
  bottom: var(--space-xl);
  left: 0;
  right: 0;
  z-index: 2;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--login-card-bg);
  opacity: 0.7;
}

/* ─── Form Panel (Right ~45%) ─────────────── */
.form-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  background: var(--login-card-bg);
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
}

/* Header: logo + title inline */
.form-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.form-logo-icon {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.form-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--brand-primary-dark);
  letter-spacing: 1px;
  margin: 0;
}

/* Error banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  background: var(--login-error-bg);
  color: var(--login-error-text);
  font-size: 13px;
  margin-bottom: var(--space-md);
  animation: fadeInUp 0.3s ease;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* Field */
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--login-heading);
}

.field-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--login-input-focus);
  border-radius: var(--radius-sm);
  background: var(--login-card-bg);
  font-family: var(--font-family);
  font-size: 14px;
  color: var(--login-heading);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input::placeholder {
  color: var(--login-text-muted);
}

.field-input:focus {
  border-color: var(--login-input-focus);
  box-shadow: var(--login-focus-ring);
}

.field-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.field--error .field-input {
  border-color: var(--login-error-text);
}

.field--error .field-input:focus {
  box-shadow: var(--login-error-ring);
}

.field-error {
  font-size: 12px;
  color: var(--login-error-text);
  animation: fadeInUp 0.2s ease;
}

/* Password toggle */
.field-password-wrap {
  position: relative;
}

.field-input--password {
  padding-right: 42px;
}

.password-toggle {
  position: absolute;
  right: var(--space-sm);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--login-text-muted);
  padding: var(--space-xs);
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: var(--login-text);
}

/* Buttons — side by side */
.form-actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-sm);
}

.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  flex: 1;
  padding: 10px var(--space-md);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--brand-primary-dark);
  color: var(--login-card-bg);
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
}

.btn-login:hover:not(:disabled) {
  background: var(--brand-primary);
  box-shadow: var(--shadow-md);
}

.btn-login:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-register {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  flex: 1;
  padding: 10px var(--space-md);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--register-color);
  color: var(--login-card-bg);
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-register:hover:not(:disabled) {
  background: var(--register-hover);
}

.btn-register:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-register:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Footer */
.form-hint {
  margin-top: var(--space-lg);
  font-size: 11px;
  color: var(--login-text-muted);
  text-align: center;
  line-height: 1.5;
  padding: var(--space-sm) var(--space-md);
  background: var(--login-input-bg);
  border-radius: var(--radius-sm);
}

.form-copyright {
  margin-top: var(--space-lg);
  font-size: 11px;
  color: var(--login-text-muted);
  text-align: center;
}

/* ─── Responsive ─────────────────────────── */
@media (max-width: 900px) {
  .branding-panel {
    display: none;
  }
  .form-panel {
    flex: 1;
    background: var(--login-bg);
  }
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
  }
  .form-header {
    flex-direction: column;
    gap: var(--space-sm);
  }
}
</style>
