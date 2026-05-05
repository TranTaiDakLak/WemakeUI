<script setup lang="ts">
/** auth/reset — đặt lại mật khẩu với strength meter */
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseInput, FormField, BaseProgress } from '../../components/common'

const form = ref({ password: '', confirm: '' })
const errors = ref<Record<string, string>>({})
const loading = ref(false)
const done = ref(false)

const strength = computed(() => {
  const p = form.value.password
  let s = 0
  if (p.length >= 8) s += 25
  if (/[A-Z]/.test(p)) s += 25
  if (/[0-9]/.test(p)) s += 25
  if (/[^A-Za-z0-9]/.test(p)) s += 25
  return s
})
const checks = computed(() => ({
  len:    form.value.password.length >= 8,
  upper:  /[A-Z]/.test(form.value.password),
  num:    /[0-9]/.test(form.value.password),
  symbol: /[^A-Za-z0-9]/.test(form.value.password),
}))
const variant = computed<'success' | 'primary' | 'warning' | 'danger'>(() => {
  if (strength.value >= 75) return 'success'
  if (strength.value >= 50) return 'primary'
  if (strength.value >= 25) return 'warning'
  return 'danger'
})

async function submit() {
  errors.value = {}
  if (strength.value < 75) errors.value.password = 'Mật khẩu chưa đạt yêu cầu.'
  if (form.value.password !== form.value.confirm) errors.value.confirm = 'Mật khẩu xác nhận không khớp.'
  if (Object.keys(errors.value).length) return
  loading.value = true
  await new Promise((r) => setTimeout(r, 700))
  loading.value = false
  done.value = true
}
</script>

<template>
  <AuthLayout>
    <header class="auth-head">
      <h1>Đặt lại mật khẩu</h1>
      <p>Token hợp lệ. Nhập mật khẩu mới cho tài khoản của bạn.</p>
    </header>

    <form v-if="!done" class="auth-form" @submit.prevent="submit">
      <FormField label="Mật khẩu mới" :error="errors.password" required>
        <BaseInput v-model="form.password" type="password" />
      </FormField>

      <div class="strength">
        <BaseProgress :value="strength" :variant="variant" size="sm" />
        <ul class="checks">
          <li :class="{ ok: checks.len }">{{ checks.len ? '✓' : '○' }} Tối thiểu 8 ký tự</li>
          <li :class="{ ok: checks.upper }">{{ checks.upper ? '✓' : '○' }} Có chữ hoa</li>
          <li :class="{ ok: checks.num }">{{ checks.num ? '✓' : '○' }} Có số</li>
          <li :class="{ ok: checks.symbol }">{{ checks.symbol ? '✓' : '○' }} Có ký tự đặc biệt</li>
        </ul>
      </div>

      <FormField label="Xác nhận mật khẩu" :error="errors.confirm" required>
        <BaseInput v-model="form.confirm" type="password" />
      </FormField>

      <BaseButton type="submit" :loading="loading" block>Cập nhật mật khẩu</BaseButton>
    </form>

    <div v-else class="done">
      <div class="done-icon">✅</div>
      <h2>Mật khẩu đã được cập nhật</h2>
      <p>Bây giờ bạn có thể đăng nhập với mật khẩu mới.</p>
      <RouterLink to="/auth/login" class="cta">
        <BaseButton block>Đăng nhập ngay</BaseButton>
      </RouterLink>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth-head { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.auth-head h1 { margin: 0; font-size: var(--wx-fs-28); font-weight: var(--wx-fw-semibold); letter-spacing: var(--wx-tracking-tight); }
.auth-head p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-muted); }

.auth-form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.strength {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  padding: var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-fs-12);
}
.checks {
  list-style: none;
  margin: 0; padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-1);
  color: var(--wx-content-muted);
}
.checks .ok { color: var(--wx-success-text); }

.done {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-5);
  background: var(--wx-success-bg);
  border-radius: var(--wx-radius-xl);
}
.done-icon { font-size: 48px; }
.done h2 { margin: 0; font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); }
.done p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-secondary); }
.cta { width: 100%; text-decoration: none; }
</style>
