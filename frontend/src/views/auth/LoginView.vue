<script setup lang="ts">
/** auth/login — split panel + email/password + remember + social */
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseInput, BaseCheckbox, FormField, BaseTag } from '../../components/common'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = ref({ email: '', password: '', remember: true })

const ICON_GOOGLE    = `<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`
const ICON_MICROSOFT = `<svg width="16" height="16" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#f25022"/><rect x="11" width="10" height="10" fill="#7fba00"/><rect y="11" width="10" height="10" fill="#00a4ef"/><rect x="11" y="11" width="10" height="10" fill="#ffb900"/></svg>`
const errors = ref<{ email?: string; password?: string }>({})
const loading = ref(false)

async function submit() {
  errors.value = {}
  if (!form.value.email.includes('@')) errors.value.email = 'Email không hợp lệ.'
  if (form.value.password.length < 6) errors.value.password = 'Mật khẩu tối thiểu 6 ký tự.'
  if (Object.keys(errors.value).length) return

  loading.value = true
  await new Promise((r) => setTimeout(r, 900))
  auth.login(form.value.email, form.value.password)
  loading.value = false
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/saas/dashboard'
  router.push(redirect)
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
        <BaseButton variant="secondary" block :icon="ICON_GOOGLE">Google</BaseButton>
        <BaseButton variant="secondary" block :icon="ICON_MICROSOFT">Microsoft</BaseButton>
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
