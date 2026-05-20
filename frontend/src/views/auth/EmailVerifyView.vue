<script setup lang="ts">
/** auth/email-verify — pending / verified / error states */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthLayout from '../_layouts/AuthLayout.vue'
import { BaseButton, BaseTag, BaseSpinner } from '../../components/common'

const state = ref<'pending' | 'verified' | 'error' | 'expired'>('pending')

function setState(s: typeof state.value) { state.value = s }
</script>

<template>
  <AuthLayout>
    <header class="auth-head">
      <h1>Xác minh email</h1>
      <p>Nhấn vào đường dẫn trong email <strong>ban@congty.vn</strong> để hoàn tất.</p>
    </header>

    <div v-if="state === 'pending'" class="state state--pending">
      <BaseSpinner size="lg" />
      <h2>Đang chờ xác minh</h2>
      <p>Mở hộp thư của bạn — đường dẫn có hiệu lực trong 30 phút.</p>
      <BaseTag size="md" variant="primary" text="đang chờ" />
      <div class="actions">
        <BaseButton variant="ghost">Mở Gmail</BaseButton>
        <BaseButton variant="ghost">Mở Outlook</BaseButton>
      </div>
      <p class="muted small">
        Không thấy email? <button class="link-btn" type="button">Gửi lại</button>
        · <button class="link-btn" type="button">Đổi địa chỉ email</button>
      </p>
    </div>

    <div v-else-if="state === 'verified'" class="state state--ok">
      <lord-icon
        src="https://cdn.lordicon.com/lupuorrc.json"
        trigger="loop"
        colors="primary:#10b981,secondary:#059669"
        style="width: 80px; height: 80px;"
      />
      <h2>Xác minh thành công!</h2>
      <p>Email của bạn đã được xác minh. Bạn có thể tiếp tục.</p>
      <BaseTag size="md" variant="success" text="đã xác minh" />
      <RouterLink to="/auth/onboarding" class="cta-link">
        <BaseButton block>Tiếp tục onboarding →</BaseButton>
      </RouterLink>
    </div>

    <div v-else-if="state === 'expired'" class="state state--warn">
      <lord-icon
        src="https://cdn.lordicon.com/azxkyjta.json"
        trigger="loop"
        state="hover-enlarge"
        delay="2000"
        colors="primary:#f59e0b,secondary:#92400e"
        style="width: 80px; height: 80px;"
      />
      <h2>Đường dẫn đã hết hạn</h2>
      <p>Đường dẫn xác minh chỉ có hiệu lực trong 30 phút. Hãy yêu cầu gửi lại.</p>
      <BaseTag size="md" variant="warning" text="hết hạn" />
      <BaseButton block @click="setState('pending')">Gửi đường dẫn mới</BaseButton>
    </div>

    <div v-else class="state state--err">
      <lord-icon
        src="https://cdn.lordicon.com/azxkyjta.json"
        trigger="loop"
        state="hover-enlarge"
        colors="primary:#ef4444,secondary:#991b1b"
        style="width: 80px; height: 80px;"
      />
      <h2>Không thể xác minh</h2>
      <p>Đường dẫn không hợp lệ hoặc đã được sử dụng. Vui lòng thử lại.</p>
      <BaseTag size="md" variant="danger" text="lỗi" />
      <BaseButton block @click="setState('pending')">Yêu cầu đường dẫn mới</BaseButton>
    </div>

    <div class="state-switch">
      <span class="muted small">demo state:</span>
      <button class="chip" :class="{ on: state === 'pending' }"  @click="setState('pending')">pending</button>
      <button class="chip" :class="{ on: state === 'verified' }" @click="setState('verified')">verified</button>
      <button class="chip" :class="{ on: state === 'expired' }"  @click="setState('expired')">expired</button>
      <button class="chip" :class="{ on: state === 'error' }"    @click="setState('error')">error</button>
    </div>
  </AuthLayout>
</template>

<style scoped>
.auth-head { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.auth-head h1 { margin: 0; font-size: var(--wx-fs-28); font-weight: var(--wx-fw-semibold); letter-spacing: var(--wx-tracking-tight); }
.auth-head p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-muted); }
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-5);
  border-radius: var(--wx-radius-xl);
}
.state--pending { background: var(--wx-surface-sunken); }
.state--ok      { background: var(--wx-success-bg); }
.state--warn    { background: var(--wx-warning-bg); }
.state--err     { background: var(--wx-danger-bg); }

.state h2 { margin: 0; font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); }
.state p { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-content-secondary); }
.actions { display: flex; gap: var(--wx-space-2); margin-top: var(--wx-space-2); }
.cta-link { width: 100%; text-decoration: none; }

.link-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--wx-content-link);
  cursor: pointer;
  text-decoration: underline;
}

.state-switch {
  display: flex;
  align-items: center;
  gap: var(--wx-space-1);
  flex-wrap: wrap;
  margin-top: var(--wx-space-3);
  padding-top: var(--wx-space-3);
  border-top: 1px dashed var(--wx-border-subtle);
}
.chip {
  background: transparent;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-full);
  padding: 2px 10px;
  font-size: var(--wx-fs-12);
  cursor: pointer;
  font-family: inherit;
  color: var(--wx-content-secondary);
}
.chip.on { background: var(--wx-brand-primary); color: white; border-color: transparent; }
</style>
