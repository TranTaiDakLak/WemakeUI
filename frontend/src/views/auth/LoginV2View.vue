<script setup lang="ts">
/** auth/login-v2 — alt layout: hero illustration full-width + form bên dưới */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseInput, FormField, BaseTag, BaseAvatarGroup, BaseAvatar } from '../../components/common'

const form = ref({ email: '', password: '' })
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
      <BaseButton variant="secondary" block>Tiếp tục với Google</BaseButton>
      <BaseButton variant="secondary" block>Tiếp tục với Microsoft</BaseButton>
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
