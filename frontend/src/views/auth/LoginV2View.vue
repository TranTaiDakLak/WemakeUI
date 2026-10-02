<script setup lang="ts">
/** auth/login-v2 — alt layout: hero illustration full-width + form bên dưới */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import AuthHead from '../_layouts/AuthHead.vue'
import AuthField from '../_layouts/AuthField.vue'
import { BaseButton, BaseTag, BaseAvatarGroup, BaseAvatar } from '../../components/common'

const ICON_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`

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
        <RouterLink to="/" class="auth-brand">
          <img src="/logo.png" alt="MindUI" class="auth-brand__logo" />
          <span class="auth-brand__name">MindUI</span>
        </RouterLink>

        <div class="hero-illust" aria-hidden="true">
          <div class="hero-card hero-card--1">
            <div class="hero-card__title">Doanh thu hôm nay</div>
            <div class="hero-card__value">128.420.000₫</div>
            <BaseTag size="sm" variant="success" label="+12% so với hôm qua" />
          </div>
          <div class="hero-card hero-card--2">
            <div class="hero-card__title">Đơn hàng</div>
            <div class="hero-card__value">1,284</div>
          </div>
          <div class="hero-card hero-card--3">
            <BaseAvatarGroup size="md" :max="4">
              <BaseAvatar name="Nguyễn A" size="md" />
              <BaseAvatar name="Trần B" size="md" />
              <BaseAvatar name="Lê C" size="md" />
              <BaseAvatar name="Phạm D" size="md" />
              <BaseAvatar name="Hoàng E" size="md" />
            </BaseAvatarGroup>
            <span class="hero-card__sub">5 thành viên đang online</span>
          </div>
        </div>

        <p class="hero-cap">
          Hơn <strong>2,400</strong> team Việt đang dùng MindUI mỗi ngày.
        </p>
      </div>
    </template>

    <AuthHead
      eyebrow="Chào mừng trở lại"
      title="Quay lại tài khoản của bạn"
      description="Phiên bản v2 — social trên đỉnh, form gọn bên dưới."
    />

    <div class="social-grid">
      <BaseButton variant="secondary" block :icon="ICON_GOOGLE">Tiếp tục với Google</BaseButton>
      <BaseButton variant="secondary" block :icon="ICON_MICROSOFT">Tiếp tục với Microsoft</BaseButton>
    </div>

    <div class="auth-divider"><span>hoặc dùng email</span></div>

    <form @submit.prevent="submit" class="auth-form">
      <AuthField v-model="form.email" label="Email" type="email" :icon="ICON_MAIL" placeholder="ban@congty.vn" autocomplete="email" required />
      <AuthField v-model="form.password" label="Mật khẩu" type="password" :icon="ICON_LOCK" placeholder="••••••••" autocomplete="current-password" required />
      <BaseButton type="submit" size="lg" :loading="loading" block>Tiếp tục →</BaseButton>
    </form>

    <p class="auth-foot-text">
      Chưa có tài khoản?
      <RouterLink to="/auth/register" class="link-sm">Đăng ký →</RouterLink>
    </p>
  </AuthLayout>
</template>

<style scoped>
.hero { display: flex; flex-direction: column; gap: var(--wx-space-5); }
.auth-brand { display: flex; align-items: center; gap: var(--wx-space-2); color: white; text-decoration: none; }
.auth-brand__logo {
  width: 40px; height: 40px;
  object-fit: contain;
  display: inline-block;
}
.auth-brand__name { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); }

.hero-illust {
  position: relative;
  height: 320px;
}
.hero-card {
  position: absolute;
  background: var(--wx-surface-elevated);
  color: var(--wx-content-primary);
  border: 1px solid var(--wx-border-default);
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
/* avatar chồng nhau: viền cùng màu thẻ để các vòng tròn tách nhau rõ */
.hero-card--3 :deep(.wx-avatar) { box-shadow: 0 0 0 2px var(--wx-surface-elevated); }
.hero-card--3 :deep(.wx-avatar:not(:first-child)) { margin-left: -3px; }

.hero-cap { color: white; font-size: var(--wx-fs-13); margin: 0; }
.hero-cap strong { color: white; }

.auth-form { display: flex; flex-direction: column; gap: var(--wx-space-4); }
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
