<script setup lang="ts">
/** auth/forgot — gửi email khôi phục */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import AuthHead from '../_layouts/AuthHead.vue'
import AuthField from '../_layouts/AuthField.vue'
import { BaseButton, BaseTag } from '../../components/common'

const ICON_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
const ICON_KEY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/></svg>`

const email = ref('')
const sent = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  error.value = null
  if (!email.value.includes('@')) {
    error.value = 'Email không hợp lệ.'
    return
  }
  loading.value = true
  await new Promise((r) => setTimeout(r, 700))
  loading.value = false
  sent.value = true
}
</script>

<template>
  <AuthLayout>
    <AuthHead
      :icon="ICON_KEY"
      eyebrow="Khôi phục truy cập"
      title="Quên mật khẩu?"
      description="Nhập email — chúng tôi sẽ gửi đường dẫn khôi phục cho bạn."
    />

    <form v-if="!sent" class="auth-form" novalidate @submit.prevent="submit">
      <AuthField
        v-model="email"
        label="Email tài khoản"
        type="email"
        :icon="ICON_MAIL"
        placeholder="ban@congty.vn"
        autocomplete="email"
        inputmode="email"
        :error="error ?? undefined"
        required
      />
      <BaseButton type="submit" size="lg" :loading="loading" block>Gửi đường dẫn khôi phục</BaseButton>
      <RouterLink to="/auth/login" class="link-sm center">← Quay về đăng nhập</RouterLink>
    </form>

    <div v-else class="sent">
      <lord-icon
        src="https://cdn.lordicon.com/vxzzdaaj.json"
        trigger="loop"
        delay="2000"
        colors="primary:#3b82f6,secondary:#93c5fd"
        style="width: 80px; height: 80px;"
      />
      <h2>Đã gửi đường dẫn</h2>
      <p>Kiểm tra hộp thư <strong>{{ email }}</strong>. Đường dẫn có hiệu lực trong 30 phút.</p>
      <BaseTag size="md" variant="success" label="đã gửi" />
      <div class="sent-actions">
        <BaseButton variant="ghost" @click="sent = false">Gửi lại email khác</BaseButton>
        <RouterLink to="/auth/login">
          <BaseButton variant="ghost">← Quay về đăng nhập</BaseButton>
        </RouterLink>
      </div>
      <p class="muted small">
        Không thấy email? Kiểm tra thư rác hoặc
        <button class="link-btn" type="button" @click="submit">gửi lại sau 60s</button>.
      </p>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth-form { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.link-sm { font-size: var(--wx-fs-13); color: var(--wx-content-link); text-decoration: none; }
.link-sm:hover { text-decoration: underline; }
.center { text-align: center; }

.sent {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-5);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-xl);
}
.sent h2 { margin: 0; font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); }
.sent p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-secondary); }
.sent-actions { display: flex; flex-direction: column; gap: var(--wx-space-2); width: 100%; margin-top: var(--wx-space-3); }
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }
.link-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--wx-content-link);
  cursor: pointer;
  text-decoration: underline;
}
</style>
