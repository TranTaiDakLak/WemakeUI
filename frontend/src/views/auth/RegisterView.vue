<script setup lang="ts">
/** auth/register — 3 bước wizard: account → profile → finish */
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import AuthHead from '../_layouts/AuthHead.vue'
import AuthField from '../_layouts/AuthField.vue'
import { BaseButton, BaseSelectMenu, FormField, BaseProgress } from '../../components/common'

const ICON_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
const ICON_USER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
const ICON_PHONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`

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
    <AuthHead
      :eyebrow="`Bước ${step}/3`"
      title="Tạo tài khoản mới"
      description="Thông tin cơ bản, hồ sơ, hoàn tất."
    />

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
      <AuthField
        v-model="account.email"
        label="Email công ty"
        type="email"
        :icon="ICON_MAIL"
        placeholder="ban@congty.vn"
        autocomplete="email"
        :error="errors.email"
        required
      />
      <AuthField
        v-model="account.password"
        label="Mật khẩu"
        type="password"
        :icon="ICON_LOCK"
        autocomplete="new-password"
        :error="errors.password"
        hint="Tối thiểu 8 ký tự, có chữ HOA, số, ký tự đặc biệt."
        required
      />
      <div v-if="account.password" class="strength">
        <BaseProgress :value="passStrength" :variant="passVariant" size="sm" />
        <span class="strength-label" :data-v="passVariant">{{ passLabel }}</span>
      </div>
      <AuthField
        v-model="account.confirm"
        label="Xác nhận mật khẩu"
        type="password"
        :icon="ICON_LOCK"
        autocomplete="new-password"
        :error="errors.confirm"
        required
      />
      <BaseButton type="submit" block>Tiếp tục →</BaseButton>
    </form>

    <!-- step 2 -->
    <form v-else-if="step === 2" class="auth-form" @submit.prevent="next">
      <AuthField
        v-model="profile.fullName"
        label="Họ và tên"
        :icon="ICON_USER"
        placeholder="Nguyễn Văn A"
        autocomplete="name"
        :error="errors.fullName"
        required
      />
      <AuthField
        v-model="profile.phone"
        label="Số điện thoại (không bắt buộc)"
        type="tel"
        :icon="ICON_PHONE"
        placeholder="+84 ..."
        autocomplete="tel"
      />
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
      <lord-icon
        src="https://cdn.lordicon.com/lupuorrc.json"
        trigger="loop"
        colors="primary:#8b5cf6,secondary:#ec4899"
        style="width: 80px; height: 80px;"
      />
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
.step--active .step-num { background: var(--wx-shell-grad-solid); color: var(--wx-text-on-brand); border-color: transparent; box-shadow: var(--wx-shadow-brand); }
.step--done .step-num   { background: var(--wx-success-solid); color: var(--wx-text-on-brand); border-color: transparent; }
.step--active .step-label { color: var(--wx-content-primary); font-weight: var(--wx-fw-semibold); }

.auth-form { display: flex; flex-direction: column; gap: var(--wx-space-4); }
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
