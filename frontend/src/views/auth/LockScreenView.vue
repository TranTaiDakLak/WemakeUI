<script setup lang="ts">
/** auth/lock — màn hình khoá: avatar + ô mật khẩu */
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import AuthField from '../_layouts/AuthField.vue'
import { BaseButton, BaseAvatar } from '../../components/common'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import lockedJson from '@/assets/animations/locked.json'

const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`

const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)
const now = ref(new Date())
setInterval(() => (now.value = new Date()), 1000 * 30)
const timeStr = computed(() =>
  now.value.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
)
const dateStr = computed(() =>
  now.value.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })
)

async function unlock() {
  error.value = null
  if (password.value.length < 4) {
    error.value = 'Mật khẩu chưa đúng.'
    return
  }
  loading.value = true
  await new Promise((r) => setTimeout(r, 600))
  loading.value = false
  if (password.value !== 'demo1234') {
    error.value = 'Mật khẩu không đúng. Còn 4 lần thử.'
  }
}
</script>

<template>
  <AuthLayout aside-tone="dark">
    <template #aside>
      <div class="lock-aside">
        <div class="clock">{{ timeStr }}</div>
        <div class="date">{{ dateStr }}</div>
        <DotLottieVue
          :data="lockedJson"
          autoplay
          loop
          class="lock-icon"
        />
        <p class="lock-tip">
          Phiên của bạn đã bị khoá sau <strong>15 phút</strong> không hoạt động.
          Nhập mật khẩu để tiếp tục.
        </p>
      </div>
    </template>

    <div class="lock-form">
      <div class="lock-user">
        <BaseAvatar name="Lê Văn A" size="xl" status="busy" ring />
        <h2>Lê Văn A</h2>
        <p class="muted">le.a@mind.vn</p>
      </div>

      <form class="lock-pw" @submit.prevent="unlock">
        <AuthField
          v-model="password"
          label="Mật khẩu"
          type="password"
          :icon="ICON_LOCK"
          placeholder="••••••••"
          autocomplete="current-password"
          :error="error ?? undefined"
          required
        />
        <BaseButton type="submit" size="lg" :loading="loading" block>Mở khoá</BaseButton>
        <p class="muted small">demo: <code>demo1234</code></p>
      </form>

      <div class="lock-actions">
        <RouterLink to="/auth/login" class="link-sm">← Đăng nhập tài khoản khác</RouterLink>
        <RouterLink to="/auth/forgot" class="link-sm">Quên mật khẩu?</RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>

<style scoped>
.lock-aside {
  color: white;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  text-align: center;
  align-items: center;
}
.clock {
  font-size: 96px;
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
  line-height: 1;
}
.date { font-size: var(--wx-fs-16); color: rgba(255,255,255,0.7); }
.lock-icon { width: 120px; height: 120px; margin-top: var(--wx-space-5); }
.lock-tip {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: rgba(255,255,255,0.7);
  max-width: 360px;
}

.lock-form { display: flex; flex-direction: column; gap: var(--wx-space-5); }
.lock-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wx-space-1);
  text-align: center;
}
.lock-user h2 {
  margin: var(--wx-space-2) 0 0;
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-semibold);
}
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }
.muted code { font-family: var(--wx-font-mono); padding: 1px 6px; background: var(--wx-surface-sunken); border-radius: var(--wx-radius-sm); }

.lock-pw { display: flex; flex-direction: column; gap: var(--wx-space-3); }

.lock-actions {
  display: flex;
  justify-content: space-between;
  font-size: var(--wx-fs-12);
}
.link-sm { font-size: var(--wx-fs-13); color: var(--wx-content-link); text-decoration: none; }
.link-sm:hover { text-decoration: underline; }
</style>
