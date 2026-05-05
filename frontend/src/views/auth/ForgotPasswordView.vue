<script setup lang="ts">
/** auth/forgot — gửi email khôi phục */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseInput, FormField, BaseTag } from '../../components/common'

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
    <header class="auth-head">
      <h1>Quên mật khẩu?</h1>
      <p>Nhập email — chúng tôi sẽ gửi đường dẫn khôi phục cho bạn.</p>
    </header>

    <form v-if="!sent" class="auth-form" @submit.prevent="submit">
      <FormField label="Email tài khoản" :error="error" required>
        <BaseInput v-model="email" type="email" placeholder="ban@congty.vn" autocomplete="email" />
      </FormField>
      <BaseButton type="submit" :loading="loading" block>Gửi đường dẫn khôi phục</BaseButton>
      <RouterLink to="/auth/login" class="link-sm center">← Quay về đăng nhập</RouterLink>
    </form>

    <div v-else class="sent">
      <div class="sent-icon">📬</div>
      <h2>Đã gửi đường dẫn</h2>
      <p>Kiểm tra hộp thư <strong>{{ email }}</strong>. Đường dẫn có hiệu lực trong 30 phút.</p>
      <BaseTag size="md" variant="success" text="đã gửi" />
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
.auth-head { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.auth-head h1 { margin: 0; font-size: var(--wx-fs-28); font-weight: var(--wx-fw-semibold); letter-spacing: var(--wx-tracking-tight); }
.auth-head p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-muted); }
.auth-form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
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
.sent-icon { font-size: 48px; }
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
