<script setup lang="ts">
import { ref, computed } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton, BaseInput, FormField } from '../../components/common'

const name     = ref('')
const email    = ref('')
const password = ref('')
const confirm  = ref('')
const showCode = ref(false)
const submitted = ref(false)
const success   = ref(false)
const shaking   = ref<Record<string, boolean>>({})

function shake(field: string) {
  shaking.value[field] = true
  setTimeout(() => { shaking.value[field] = false }, 600)
}

const nameError = computed(() => {
  if (!submitted.value) return ''
  if (!name.value.trim()) return 'Họ và tên không được để trống.'
  if (name.value.trim().length < 2) return 'Tối thiểu 2 ký tự.'
  return ''
})
const emailError = computed(() => {
  if (!submitted.value) return ''
  if (!email.value.trim()) return 'Email không được để trống.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return 'Email không hợp lệ.'
  return ''
})
const passwordError = computed(() => {
  if (!submitted.value) return ''
  if (!password.value) return 'Mật khẩu không được để trống.'
  if (password.value.length < 8) return 'Tối thiểu 8 ký tự.'
  return ''
})
const confirmError = computed(() => {
  if (!submitted.value) return ''
  if (!confirm.value) return 'Vui lòng xác nhận mật khẩu.'
  if (confirm.value !== password.value) return 'Mật khẩu không khớp.'
  return ''
})

const strength = computed(() => {
  const p = password.value
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})
const strengthLabel = computed(() => ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'][strength.value])
const strengthColor = computed(() => ['', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'][strength.value])

function handleSubmit() {
  submitted.value = true
  const hasError = nameError.value || emailError.value || passwordError.value || confirmError.value
  if (hasError) {
    if (nameError.value)     shake('name')
    if (emailError.value)    shake('email')
    if (passwordError.value) shake('password')
    if (confirmError.value)  shake('confirm')
    return
  }
  success.value = true
}

function reset() {
  name.value = ''; email.value = ''; password.value = ''; confirm.value = ''
  submitted.value = false; success.value = false
}
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — validation" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Form Validation</h1>
        <p class="fp__desc">
          Client-side validation với error shake animation, password strength meter và success check SVG.
          Dùng <code>computed</code> để tính lỗi theo thời gian thực, chỉ hiển thị sau lần submit đầu tiên.
        </p>
      </div>

      <!-- Success state -->
      <Transition name="val-success">
        <div v-if="success" class="fp__card fp__card--success">
          <div class="val-success-inner">
            <svg class="val-check" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5" fill="none" opacity=".2"/>
              <path class="val-check-path" d="M14 24l8 8 12-14" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <div>
              <p class="val-success-title">Đăng ký thành công!</p>
              <p class="val-success-sub">Tài khoản đã được tạo cho <strong>{{ email }}</strong>.</p>
            </div>
          </div>
          <BaseButton variant="ghost" size="sm" @click="reset">Thử lại</BaseButton>
        </div>
      </Transition>

      <!-- Form -->
      <div v-if="!success" class="fp__card">
        <p class="fp__card-title">Đăng ký tài khoản</p>
        <div class="fp__form">
          <div class="fp__row">
            <div :class="['val-field', { 'val-shake': shaking.name }]">
              <FormField label="Họ và tên" required :error="nameError">
                <BaseInput v-model="name" placeholder="Nguyễn Văn A" :invalid="!!nameError" />
              </FormField>
            </div>
            <div :class="['val-field', { 'val-shake': shaking.email }]">
              <FormField label="Email" required :error="emailError">
                <BaseInput v-model="email" type="email" placeholder="ban@congty.vn" :invalid="!!emailError" />
              </FormField>
            </div>
          </div>

          <div :class="['val-field', { 'val-shake': shaking.password }]">
            <FormField label="Mật khẩu" required :error="passwordError"
              :hint="password && !passwordError ? `Độ mạnh: ${strengthLabel}` : undefined">
              <BaseInput v-model="password" type="password" placeholder="Tối thiểu 8 ký tự" :invalid="!!passwordError" />
            </FormField>
            <div v-if="password" class="val-strength">
              <div class="val-strength-track">
                <div class="val-strength-fill"
                  :style="{ width: `${strength * 25}%`, background: strengthColor }" />
              </div>
            </div>
          </div>

          <div :class="['val-field', { 'val-shake': shaking.confirm }]">
            <FormField label="Xác nhận mật khẩu" required :error="confirmError">
              <BaseInput v-model="confirm" type="password" placeholder="Nhập lại mật khẩu" :invalid="!!confirmError" />
            </FormField>
          </div>
        </div>

        <div class="fp__actions">
          <BaseButton size="sm" @click="handleSubmit">Đăng ký</BaseButton>
        </div>
      </div>

      <!-- How it works -->
      <div class="fp__card fp__card--info">
        <p class="fp__card-title">Cách hoạt động</p>
        <ul class="fp__list">
          <li><code>submitted</code> flag — lỗi chỉ hiển thị sau lần nhấn submit đầu tiên</li>
          <li>Error shake: class <code>val-shake</code> + <code>@keyframes fx-shake</code>, reset sau 600ms</li>
          <li>Password strength: kiểm tra length ≥ 8, uppercase, number, special char → 4 cấp độ</li>
          <li>Success check: SVG <code>stroke-dashoffset</code> animation từ 100% → 0</li>
        </ul>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code snippet</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>/* Error shake */
@keyframes fx-shake {
  0%,100% { transform: translateX(0); }
  20%,60%  { transform: translateX(-6px); }
  40%,80%  { transform: translateX(6px); }
}
.val-shake { animation: fx-shake 0.5s var(--wx-ease-standard); }

/* Success check — SVG stroke-dashoffset */
.val-check-path {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw-check 0.5s var(--wx-ease-decelerate) 0.1s forwards;
}
@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}

/* Password strength bar */
.val-strength-fill {
  height: 3px;
  border-radius: 2px;
  transition: width var(--wx-d-fast) var(--wx-ease-standard),
              background var(--wx-d-fast) var(--wx-ease-standard);
}

// JS — computed validation
const emailError = computed(() => {
  if (!submitted.value) return ''
  if (!email.value) return 'Bắt buộc.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return 'Email không hợp lệ.'
  return ''
})

function handleSubmit() {
  submitted.value = true
  if (emailError.value) { shake('email'); return }
  // proceed...
}</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Components:</span>
          <span v-for="c in ['BaseInput','FormField','BaseButton']" :key="c" class="fp__chip">{{ c }}</span>
          <span class="fp__meta-label" style="margin-left:8px">Patterns:</span>
          <span v-for="p in ['ErrorShake','PasswordStrength','SuccessCheck','SubmitValidation']" :key="p" class="fp__chip">{{ p }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fp { min-height: 100vh; background: var(--wx-surface-sunken); }
.fp__main { max-width: 720px; margin: 0 auto; padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-10); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__hdr { margin-top: var(--wx-space-2); }
.fp__title { margin: 0 0 4px; font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.fp__desc  { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); line-height: 1.6; }
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__card--info { background: color-mix(in srgb, var(--wx-brand-primary) 5%, var(--wx-surface-elevated)); border-color: color-mix(in srgb, var(--wx-brand-primary) 20%, transparent); }
.fp__card--success { background: color-mix(in srgb, #22c55e 8%, var(--wx-surface-elevated)); border-color: color-mix(in srgb, #22c55e 30%, transparent); color: #16a34a; }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }
.fp__form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.fp__row  { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }
@media (max-width: 560px) { .fp__row { grid-template-columns: 1fr; } }
.fp__actions { display: flex; justify-content: flex-end; }
.fp__list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.fp__list li { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); line-height: 1.5; }
.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }

/* Validation */
.val-field { position: relative; }

@keyframes fx-shake {
  0%,100% { transform: translateX(0); }
  20%,60%  { transform: translateX(-6px); }
  40%,80%  { transform: translateX(6px); }
}
.val-shake { animation: fx-shake 0.5s var(--wx-ease-standard, cubic-bezier(.4,0,.2,1)); }

/* Password strength */
.val-strength { margin-top: 6px; }
.val-strength-track { height: 3px; background: var(--wx-border-subtle); border-radius: 2px; overflow: hidden; }
.val-strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: width var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1)),
              background var(--wx-d-fast, 150ms);
}

/* Success */
.val-success-inner { display: flex; align-items: center; gap: var(--wx-space-3); }
.val-success-title { margin: 0 0 2px; font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); }
.val-success-sub   { margin: 0; font-size: var(--wx-fs-13); opacity: .8; }
.val-check { color: #16a34a; }
.val-check-path {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw-check 0.5s var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1)) 0.1s forwards;
}
@keyframes draw-check { to { stroke-dashoffset: 0; } }

/* Success card enter */
.val-success-enter-active { transition: all var(--wx-d-normal, 250ms) var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1)); }
.val-success-enter-from   { opacity: 0; transform: translateY(-8px) scale(.97); }

@media (prefers-reduced-motion: reduce) {
  .val-shake { animation: none; }
  .val-check-path { animation: none; stroke-dashoffset: 0; }
  .val-strength-fill { transition: none; }
}
</style>
