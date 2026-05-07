<script setup lang="ts">
/** auth/login-v2 — alt layout: hero illustration full-width + form bên dưới */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseInput, FormField, BaseTag, BaseAvatarGroup, BaseAvatar } from '../../components/common'

const form = ref({ email: '', password: '' })

const ICON_GOOGLE    = `<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`
const ICON_MICROSOFT = `<svg width="16" height="16" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#f25022"/><rect x="11" width="10" height="10" fill="#7fba00"/><rect y="11" width="10" height="10" fill="#00a4ef"/><rect x="11" y="11" width="10" height="10" fill="#ffb900"/></svg>`
const loading = ref(false)

function submit() {
  loading.value = true
  setTimeout(() => (loading.value = false), 800)
}
</script>

<template>
  <AuthLayout aside-tone="brand">
    <template #aside>
      <div class="hero">
        <div class="auth-brand">
          <div class="auth-brand__logo">W</div>
          <span class="auth-brand__name">WemakeUI</span>
        </div>

        <div class="hero-illust" aria-hidden="true">
          <div class="hero-card hero-card--1">
            <div class="hero-card__title">Doanh thu hôm nay</div>
            <div class="hero-card__value">128.420.000₫</div>
            <BaseTag size="sm" variant="success" text="+12% so với hôm qua" />
          </div>
          <div class="hero-card hero-card--2">
            <div class="hero-card__title">Đơn hàng</div>
            <div class="hero-card__value">1,284</div>
          </div>
          <div class="hero-card hero-card--3">
            <BaseAvatarGroup size="md" :max="4">
              <BaseAvatar name="Nguyễn A" size="sm" />
              <BaseAvatar name="Trần B" size="sm" />
              <BaseAvatar name="Lê C" size="sm" />
              <BaseAvatar name="Phạm D" size="sm" />
              <BaseAvatar name="Hoàng E" size="sm" />
            </BaseAvatarGroup>
            <span class="hero-card__sub">5 thành viên đang online</span>
          </div>
        </div>

        <p class="hero-cap">
          Hơn <strong>2,400</strong> team Việt đang dùng WemakeUI mỗi ngày.
        </p>
      </div>
    </template>

    <header class="auth-head">
      <h1>Quay lại tài khoản của bạn</h1>
      <p>Phiên bản v2 — input full-width, social trên đỉnh.</p>
    </header>

    <div class="social-grid">
      <BaseButton variant="secondary" block :icon="ICON_GOOGLE">Tiếp tục với Google</BaseButton>
      <BaseButton variant="secondary" block :icon="ICON_MICROSOFT">Tiếp tục với Microsoft</BaseButton>
    </div>

    <div class="auth-divider"><span>hoặc dùng email</span></div>

    <form @submit.prevent="submit" class="auth-form">
      <FormField label="Email" required>
        <BaseInput v-model="form.email" type="email" placeholder="ban@congty.vn" />
      </FormField>
      <FormField label="Mật khẩu" required>
        <BaseInput v-model="form.password" type="password" />
      </FormField>
      <BaseButton type="submit" :loading="loading" block>Tiếp tục →</BaseButton>
    </form>

    <p class="auth-foot-text">
      Chưa có tài khoản?
      <RouterLink to="/auth/register" class="link-sm">Đăng ký →</RouterLink>
    </p>
  </AuthLayout>
</template>

<style scoped>
.hero { display: flex; flex-direction: column; gap: var(--wx-space-5); }
.auth-brand { display: flex; align-items: center; gap: var(--wx-space-2); color: white; }
.auth-brand__logo {
  width: 40px; height: 40px;
  border-radius: var(--wx-radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.2);
  font-weight: var(--wx-fw-bold);
  font-size: var(--wx-fs-18);
}
.auth-brand__name { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); }

.hero-illust {
  position: relative;
  height: 320px;
}
.hero-card {
  position: absolute;
  background: white;
  color: var(--wx-content-primary);
  border-radius: var(--wx-radius-xl);
  padding: var(--wx-space-3);
  box-shadow: 0 16px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}
.hero-card--1 { top: 0; left: 0; min-width: 220px; }
.hero-card--2 { top: 32%; right: 12%; min-width: 160px; }
.hero-card--3 { bottom: 8%; left: 20%; }
.hero-card__title { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.hero-card__value { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); }
.hero-card__sub { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }

.hero-cap { color: white; font-size: var(--wx-fs-13); margin: 0; }
.hero-cap strong { color: white; }

.auth-head { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.auth-head h1 { margin: 0; font-size: var(--wx-fs-28); font-weight: var(--wx-fw-semibold); letter-spacing: var(--wx-tracking-tight); }
.auth-head p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-muted); }
.auth-form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.social-grid { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.auth-divider {
  display: flex; align-items: center; gap: var(--wx-space-3);
  color: var(--wx-content-muted); font-size: var(--wx-fs-12);
}
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--wx-border-subtle); }
.link-sm { font-size: var(--wx-fs-13); color: var(--wx-content-link); text-decoration: none; font-weight: var(--wx-fw-medium); }
.link-sm:hover { text-decoration: underline; }
.auth-foot-text { margin: 0; text-align: center; font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
</style>
