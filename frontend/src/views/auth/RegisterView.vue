<script setup lang="ts">
/** auth/register — 3 bước wizard: account → profile → finish */
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseInput, BaseSelectMenu, FormField, BaseProgress } from '../../components/common'

const step = ref<1 | 2 | 3>(1)
const account = ref({ email: '', password: '', confirm: '' })
const profile = ref({ fullName: '', phone: '', country: 'vn', role: 'pm' })
const errors = ref<Record<string, string>>({})

const countryOpts = [
  { value: 'vn', label: 'Việt Nam' },
  { value: 'sg', label: 'Singapore' },
  { value: 'us', label: 'Hoa Kỳ' },
  { value: 'jp', label: 'Nhật Bản' },
]
const roleOpts = [
  { value: 'pm',  label: 'Quản lý sản phẩm' },
  { value: 'eng', label: 'Kỹ sư' },
  { value: 'des', label: 'Thiết kế' },
  { value: 'ops', label: 'Vận hành' },
  { value: 'biz', label: 'Kinh doanh' },
]

const passStrength = computed(() => {
  const p = account.value.password
  let s = 0
  if (p.length >= 8) s += 25
  if (/[A-Z]/.test(p)) s += 25
  if (/[0-9]/.test(p)) s += 25
  if (/[^A-Za-z0-9]/.test(p)) s += 25
  return s
})
const passLabel = computed(() => {
  if (passStrength.value >= 75) return 'Mạnh'
  if (passStrength.value >= 50) return 'Khá'
  if (passStrength.value >= 25) return 'Yếu'
  return 'Rất yếu'
})
const passVariant = computed<'success' | 'primary' | 'warning' | 'danger'>(() => {
  if (passStrength.value >= 75) return 'success'
  if (passStrength.value >= 50) return 'primary'
  if (passStrength.value >= 25) return 'warning'
  return 'danger'
})

function next() {
  errors.value = {}
  if (step.value === 1) {
    if (!account.value.email.includes('@')) errors.value.email = 'Email không hợp lệ.'
    if (passStrength.value < 50) errors.value.password = 'Mật khẩu chưa đủ mạnh.'
    if (account.value.password !== account.value.confirm) errors.value.confirm = 'Mật khẩu xác nhận không khớp.'
    if (Object.keys(errors.value).length) return
    step.value = 2
  } else if (step.value === 2) {
    if (!profile.value.fullName.trim()) errors.value.fullName = 'Vui lòng nhập họ tên.'
    if (Object.keys(errors.value).length) return
    step.value = 3
  }
}
function back() {
  if (step.value > 1) step.value = (step.value - 1) as 1 | 2 | 3
}
</script>

<template>
  <AuthLayout>
    <header class="auth-head">
      <h1>Tạo tài khoản mới</h1>
      <p>Bước {{ step }}/3 — thông tin cơ bản, hồ sơ, hoàn tất.</p>
    </header>

    <div class="steps">
      <div v-for="i in 3" :key="i" class="step" :class="{ 'step--active': i === step, 'step--done': i < step }">
        <span class="step-num">{{ i }}</span>
        <span class="step-label">
          {{ i === 1 ? 'Tài khoản' : i === 2 ? 'Hồ sơ' : 'Hoàn tất' }}
        </span>
      </div>
    </div>

    <!-- step 1 -->
    <form v-if="step === 1" class="auth-form" @submit.prevent="next">
      <FormField label="Email công ty" :error="errors.email" required>
        <BaseInput v-model="account.email" type="email" placeholder="ban@congty.vn" />
      </FormField>
      <FormField label="Mật khẩu" :error="errors.password" required hint="Tối thiểu 8 ký tự, có chữ HOA, số, ký tự đặc biệt.">
        <BaseInput v-model="account.password" type="password" />
      </FormField>
      <div v-if="account.password" class="strength">
        <BaseProgress :value="passStrength" :variant="passVariant" size="sm" />
        <span class="strength-label" :data-v="passVariant">{{ passLabel }}</span>
      </div>
      <FormField label="Xác nhận mật khẩu" :error="errors.confirm" required>
        <BaseInput v-model="account.confirm" type="password" />
      </FormField>
      <BaseButton type="submit" block>Tiếp tục →</BaseButton>
    </form>

    <!-- step 2 -->
    <form v-else-if="step === 2" class="auth-form" @submit.prevent="next">
      <FormField label="Họ và tên" :error="errors.fullName" required>
        <BaseInput v-model="profile.fullName" placeholder="Nguyễn Văn A" />
      </FormField>
      <FormField label="Số điện thoại" show-optional>
        <BaseInput v-model="profile.phone" type="text" placeholder="+84 ..." />
      </FormField>
      <FormField label="Quốc gia">
        <BaseSelectMenu v-model="profile.country" :options="countryOpts" />
      </FormField>
      <FormField label="Vai trò">
        <BaseSelectMenu v-model="profile.role" :options="roleOpts" />
      </FormField>
      <div class="auth-row">
        <BaseButton variant="ghost" type="button" @click="back">← Quay lại</BaseButton>
        <BaseButton type="submit">Tiếp tục →</BaseButton>
      </div>
    </form>

    <!-- step 3 -->
    <div v-else class="finish">
      <div class="finish-emoji">🎉</div>
      <h2>Sẵn sàng bắt đầu!</h2>
      <p>Tài khoản <strong>{{ account.email }}</strong> đã được tạo. Chúng tôi gửi email xác minh đến bạn.</p>
      <RouterLink to="/auth/email-verify" class="cta-link">
        <BaseButton block>Mở hộp thư xác minh →</BaseButton>
      </RouterLink>
      <RouterLink to="/auth/login" class="link-sm">Đã xác minh? Đăng nhập ngay</RouterLink>
    </div>

    <template #footer>
      <RouterLink to="/auth/login" class="link-sm">Đã có tài khoản? Đăng nhập</RouterLink>
      <span>Bằng việc đăng ký bạn đồng ý với điều khoản.</span>
    </template>
  </AuthLayout>
</template>

<style scoped>
.auth-head { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.auth-head h1 { margin: 0; font-size: var(--wx-fs-28); font-weight: var(--wx-fw-semibold); letter-spacing: var(--wx-tracking-tight); }
.auth-head p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-muted); }

.steps {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  font-size: var(--wx-fs-12);
}
.step {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  color: var(--wx-content-muted);
  flex: 1;
  position: relative;
}
.step:not(:last-child)::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--wx-border-default);
  margin-left: var(--wx-space-2);
}
.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; height: 24px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-sunken);
  color: var(--wx-content-muted);
  font-weight: var(--wx-fw-semibold);
  border: 1px solid var(--wx-border-default);
}
.step--active .step-num { background: var(--wx-brand-primary); color: white; border-color: transparent; }
.step--done .step-num   { background: var(--wx-success-solid); color: white; border-color: transparent; }
.step--active .step-label { color: var(--wx-content-primary); font-weight: var(--wx-fw-medium); }

.auth-form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.auth-row { display: flex; gap: var(--wx-space-2); justify-content: space-between; }
.strength {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  font-size: var(--wx-fs-12);
}
.strength-label[data-v="success"] { color: var(--wx-success-text); }
.strength-label[data-v="primary"] { color: var(--wx-brand-primary); }
.strength-label[data-v="warning"] { color: var(--wx-warning-text); }
.strength-label[data-v="danger"]  { color: var(--wx-danger-text); }

.finish {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-2) 0;
}
.finish-emoji { font-size: 48px; }
.finish h2 { margin: 0; font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); }
.finish p { margin: 0; color: var(--wx-content-secondary); font-size: var(--wx-fs-14); }
.cta-link { width: 100%; text-decoration: none; }
.link-sm {
  font-size: var(--wx-fs-13);
  color: var(--wx-content-link);
  text-decoration: none;
}
.link-sm:hover { text-decoration: underline; }
</style>
