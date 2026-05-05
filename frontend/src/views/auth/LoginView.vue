<script setup lang="ts">
/** auth/login — split panel + email/password + remember + social */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseInput, BaseCheckbox, FormField, BaseTag } from '../../components/common'

const form = ref({ email: '', password: '', remember: true })
const errors = ref<{ email?: string; password?: string }>({})
const loading = ref(false)

async function submit() {
  errors.value = {}
  if (!form.value.email.includes('@')) errors.value.email = 'Email không hợp lệ.'
  if (form.value.password.length < 6) errors.value.password = 'Mật khẩu tối thiểu 6 ký tự.'
  if (Object.keys(errors.value).length) return

  loading.value = true
  await new Promise((r) => setTimeout(r, 900))
  loading.value = false
}
</script>

<template>
  <AuthLayout>
    <header class="auth-head">
      <h1>Đăng nhập</h1>
      <p>Chào mừng bạn quay lại. Nhập thông tin để tiếp tục.</p>
    </header>

    <form class="auth-form" @submit.prevent="submit">
      <FormField label="Email" :error="errors.email" required>
        <BaseInput v-model="form.email" type="email" placeholder="ban@congty.vn" autocomplete="email" />
      </FormField>

      <FormField label="Mật khẩu" :error="errors.password" required>
        <template #label>
          <span style="display:flex;align-items:center;justify-content:space-between;width:100%;">
            <span>Mật khẩu</span>
            <RouterLink to="/auth/forgot" class="link-sm">Quên mật khẩu?</RouterLink>
          </span>
        </template>
        <BaseInput v-model="form.password" type="password" autocomplete="current-password" />
      </FormField>

      <div class="auth-row">
        <BaseCheckbox v-model="form.remember" label="Ghi nhớ đăng nhập trên thiết bị này" />
      </div>

      <BaseButton type="submit" :loading="loading" block>Đăng nhập</BaseButton>

      <div class="auth-divider"><span>hoặc tiếp tục với</span></div>

      <div class="social-grid">
        <BaseButton variant="secondary" block>Google</BaseButton>
        <BaseButton variant="secondary" block>Microsoft</BaseButton>
      </div>

      <p class="auth-foot-text">
        Chưa có tài khoản?
        <RouterLink to="/auth/register" class="link-sm">Đăng ký miễn phí →</RouterLink>
      </p>
    </form>

    <template #footer>
      <span>© 2026 WemakeUI · phiên bản 0.6.0</span>
      <span><BaseTag size="sm" text="bảo mật end-to-end" variant="success" /></span>
    </template>
  </AuthLayout>
</template>

<style scoped>
.auth-head { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.auth-head h1 {
  margin: 0;
  font-size: var(--wx-fs-28);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}
.auth-head p {
  margin: 0;
  font-size: var(--wx-fs-14);
  color: var(--wx-content-muted);
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
}
.auth-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.link-sm {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-link);
  text-decoration: none;
  font-weight: var(--wx-fw-medium);
}
.link-sm:hover { text-decoration: underline; }
.auth-divider {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  margin: var(--wx-space-2) 0;
  color: var(--wx-content-muted);
  font-size: var(--wx-fs-12);
}
.auth-divider::before, .auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--wx-border-subtle);
}
.social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-2);
}
.auth-foot-text {
  margin: var(--wx-space-2) 0 0;
  font-size: var(--wx-fs-13);
  text-align: center;
  color: var(--wx-content-muted);
}
</style>
