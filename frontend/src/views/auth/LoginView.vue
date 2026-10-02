<script setup lang="ts">
/** auth/login — split panel + email/password + remember + social */
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import AuthHead from '../_layouts/AuthHead.vue'
import AuthField from '../_layouts/AuthField.vue'
import { BaseButton, BaseCheckbox, BaseTag } from '../../components/common'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = ref({ email: '', password: '', remember: true })

const ICON_GOOGLE    = `<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`
const ICON_MICROSOFT = `<svg width="16" height="16" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#f25022"/><rect x="11" width="10" height="10" fill="#7fba00"/><rect y="11" width="10" height="10" fill="#00a4ef"/><rect x="11" y="11" width="10" height="10" fill="#ffb900"/></svg>`
const ICON_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
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
    <AuthHead
      eyebrow="Chào mừng trở lại"
      title="Đăng nhập"
      description="Nhập thông tin để tiếp tục vào không gian làm việc của bạn."
    />

    <form class="auth-form" novalidate @submit.prevent="submit">
      <AuthField
        v-model="form.email"
        label="Email"
        type="email"
        :icon="ICON_MAIL"
        placeholder="ban@congty.vn"
        autocomplete="email"
        inputmode="email"
        :error="errors.email"
        required
      />

      <AuthField
        v-model="form.password"
        label="Mật khẩu"
        type="password"
        :icon="ICON_LOCK"
        placeholder="••••••••"
        autocomplete="current-password"
        :error="errors.password"
        required
      >
        <template #label-extra>
          <RouterLink to="/auth/forgot">Quên mật khẩu?</RouterLink>
        </template>
      </AuthField>

      <div class="auth-row">
        <BaseCheckbox v-model="form.remember" label="Ghi nhớ đăng nhập trên thiết bị này" />
      </div>

      <BaseButton type="submit" size="lg" :loading="loading" block>Đăng nhập</BaseButton>

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
      <span>© 2026 MindUI · phiên bản 0.6.0</span>
      <span><BaseTag size="sm" label="bảo mật end-to-end" variant="success" /></span>
    </template>
  </AuthLayout>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
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
  font-weight: var(--wx-fw-bold);
}
.link-sm:hover { text-decoration: underline; }
.auth-divider {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  margin: var(--wx-space-1) 0;
  color: var(--wx-content-muted);
  font-size: 11px;
  font-weight: var(--wx-fw-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.auth-divider::before, .auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--wx-border-default);
}
.social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-2);
}
.auth-foot-text {
  margin: var(--wx-space-1) 0 0;
  font-size: var(--wx-fs-13);
  text-align: center;
  color: var(--wx-content-muted);
}
</style>
