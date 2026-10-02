<script setup lang="ts">
/** auth/reset — đặt lại mật khẩu với strength meter */
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import AuthHead from '../_layouts/AuthHead.vue'
import AuthField from '../_layouts/AuthField.vue'
import { BaseButton, BaseProgress } from '../../components/common'

const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
const ICON_SHIELD = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`

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
    <AuthHead
      :icon="ICON_SHIELD"
      eyebrow="Đặt lại truy cập"
      title="Đặt lại mật khẩu"
      description="Token hợp lệ. Nhập mật khẩu mới cho tài khoản của bạn."
    />

    <form v-if="!done" class="auth-form" novalidate @submit.prevent="submit">
      <AuthField
        v-model="form.password"
        label="Mật khẩu mới"
        type="password"
        :icon="ICON_LOCK"
        autocomplete="new-password"
        :error="errors.password"
        required
      />

      <div class="strength">
        <BaseProgress :value="strength" :variant="variant" size="sm" />
        <ul class="checks">
          <li :class="{ ok: checks.len }">{{ checks.len ? '✓' : '○' }} Tối thiểu 8 ký tự</li>
          <li :class="{ ok: checks.upper }">{{ checks.upper ? '✓' : '○' }} Có chữ hoa</li>
          <li :class="{ ok: checks.num }">{{ checks.num ? '✓' : '○' }} Có số</li>
          <li :class="{ ok: checks.symbol }">{{ checks.symbol ? '✓' : '○' }} Có ký tự đặc biệt</li>
        </ul>
      </div>

      <AuthField
        v-model="form.confirm"
        label="Xác nhận mật khẩu"
        type="password"
        :icon="ICON_LOCK"
        autocomplete="new-password"
        :error="errors.confirm"
        required
      />

      <BaseButton type="submit" size="lg" :loading="loading" block>Cập nhật mật khẩu</BaseButton>
    </form>

    <div v-else class="done">
      <lord-icon
        src="https://cdn.lordicon.com/lupuorrc.json"
        trigger="loop"
        colors="primary:#10b981,secondary:#059669"
        style="width: 80px; height: 80px;"
      />
      <h2>Mật khẩu đã được cập nhật</h2>
      <p>Bây giờ bạn có thể đăng nhập với mật khẩu mới.</p>
      <RouterLink to="/auth/login" class="cta">
        <BaseButton block>Đăng nhập ngay</BaseButton>
      </RouterLink>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth-form { display: flex; flex-direction: column; gap: var(--wx-space-4); }
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
.done h2 { margin: 0; font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); }
.done p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-secondary); }
.cta { width: 100%; text-decoration: none; }
</style>
