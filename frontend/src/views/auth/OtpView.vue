<script setup lang="ts">
/** auth/otp — 6 ô số + đếm ngược gửi lại */
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseTag } from '../../components/common'

const digits = ref<string[]>(['', '', '', '', '', ''])
const inputs = ref<HTMLInputElement[]>([])
const cooldown = ref(60)
const error = ref<string | null>(null)
const verified = ref(false)
const loading = ref(false)

let timer: number | null = null
function startCooldown() {
  cooldown.value = 60
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0 && timer) {
      window.clearInterval(timer); timer = null
    }
  }, 1000) as unknown as number
}

onMounted(() => {
  startCooldown()
  nextTick(() => inputs.value[0]?.focus())
})
onBeforeUnmount(() => { if (timer) window.clearInterval(timer) })

function onInput(i: number, e: Event) {
  const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1)
  digits.value[i] = v
  if (v && i < 5) inputs.value[i + 1]?.focus()
  // auto submit khi đủ 6
  if (digits.value.every((d) => d.length === 1)) verify()
}
function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    inputs.value[i - 1]?.focus()
  } else if (e.key === 'ArrowLeft' && i > 0) {
    inputs.value[i - 1]?.focus()
  } else if (e.key === 'ArrowRight' && i < 5) {
    inputs.value[i + 1]?.focus()
  }
}
function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const t = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? ''
  for (let i = 0; i < 6; i++) digits.value[i] = t[i] ?? ''
  inputs.value[Math.min(t.length, 5)]?.focus()
  if (t.length === 6) verify()
}

async function verify() {
  error.value = null
  const code = digits.value.join('')
  if (code.length !== 6) { error.value = 'Mã chưa đủ 6 ký tự.'; return }
  loading.value = true
  await new Promise((r) => setTimeout(r, 700))
  loading.value = false
  if (code === '123456') verified.value = true
  else error.value = 'Mã không đúng. Thử lại hoặc gửi lại.'
}
function resend() {
  if (cooldown.value > 0) return
  startCooldown()
  digits.value = ['', '', '', '', '', '']
  inputs.value[0]?.focus()
}
</script>

<template>
  <AuthLayout>
    <header class="auth-head">
      <h1>Xác thực 2 lớp</h1>
      <p>Nhập mã 6 chữ số chúng tôi vừa gửi về <strong>+84•••245</strong>.</p>
      <p class="muted small">Mã thử nghiệm: <code>123456</code></p>
    </header>

    <div v-if="!verified" class="otp-area">
      <div class="otp-grid" @paste="onPaste">
        <input
          v-for="i in 6"
          :key="i - 1"
          ref="inputs"
          class="otp-cell"
          :class="{ 'otp-cell--filled': digits[i - 1], 'otp-cell--error': error }"
          type="text"
          inputmode="numeric"
          maxlength="1"
          autocomplete="one-time-code"
          :aria-label="`Ô số ${i}`"
          :value="digits[i - 1]"
          @input="(e) => onInput(i - 1, e)"
          @keydown="(e) => onKeydown(i - 1, e)"
        />
      </div>

      <p v-if="error" class="otp-error">{{ error }}</p>

      <BaseButton :loading="loading" block @click="verify">Xác minh</BaseButton>

      <p class="resend">
        Không nhận được mã?
        <button
          class="link-btn"
          type="button"
          :disabled="cooldown > 0"
          @click="resend"
        >
          {{ cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại ngay' }}
        </button>
      </p>
    </div>

    <div v-else class="success">
      <div class="success-icon">🛡️</div>
      <h2>Xác thực thành công</h2>
      <BaseTag size="md" variant="success" label="đã xác minh" />
      <RouterLink to="/dashboard/overview" class="cta">
        <BaseButton block>Vào dashboard →</BaseButton>
      </RouterLink>
    </div>

    <template #footer>
      <RouterLink to="/auth/login" class="link-sm">← quay về đăng nhập</RouterLink>
      <span>2FA · TOTP</span>
    </template>
  </AuthLayout>
</template>

<style scoped>
.auth-head { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.auth-head h1 { margin: 0; font-size: var(--wx-fs-28); font-weight: var(--wx-fw-semibold); letter-spacing: var(--wx-tracking-tight); }
.auth-head p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-muted); }
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }
.muted code { font-family: var(--wx-font-mono); padding: 1px 6px; background: var(--wx-surface-sunken); border-radius: var(--wx-radius-sm); }

.otp-area { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.otp-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--wx-space-2);
}
.otp-cell {
  width: 100%;
  aspect-ratio: 1;
  text-align: center;
  font-size: var(--wx-fs-24);
  font-weight: var(--wx-fw-semibold);
  font-family: var(--wx-font-mono);
  border: 1.5px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  color: var(--wx-content-primary);
  transition: border-color var(--wx-d-fast) var(--wx-ease-standard),
              background var(--wx-d-fast) var(--wx-ease-standard);
}
.otp-cell:focus {
  outline: none;
  border-color: var(--wx-brand-primary);
  background: var(--wx-surface-base);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}
.otp-cell--filled { border-color: var(--wx-brand-primary); }
.otp-cell--error { border-color: var(--wx-danger-solid); }

.otp-error {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: var(--wx-danger-text);
  text-align: center;
}

.resend {
  text-align: center;
  font-size: var(--wx-fs-13);
  color: var(--wx-content-muted);
  margin: 0;
}
.link-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--wx-content-link);
  cursor: pointer;
  text-decoration: underline;
}
.link-btn:disabled { color: var(--wx-content-disabled); cursor: not-allowed; text-decoration: none; }

.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-5);
  background: var(--wx-success-bg);
  border-radius: var(--wx-radius-xl);
}
.success-icon { font-size: 48px; }
.success h2 { margin: 0; font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); }
.cta { width: 100%; text-decoration: none; }

.link-sm { font-size: var(--wx-fs-13); color: var(--wx-content-link); text-decoration: none; }
.link-sm:hover { text-decoration: underline; }
</style>
