<script setup lang="ts">
/** error/under-construction — đang xây dựng */
import { RouterLink } from 'vue-router'
import ErrorLayout from '../_layouts/ErrorLayout.vue'
import { BaseButton, BaseInput, BaseTag } from '../../components/common'
import { ref } from 'vue'

const email = ref('')
const subscribed = ref(false)

function subscribe() {
  if (!email.value.includes('@')) return
  subscribed.value = true
}
</script>

<template>
  <ErrorLayout
    title="Tính năng đang xây dựng"
    description="Chúng tôi đang phát triển trang này. Đăng ký để nhận thông báo ngay khi sẵn sàng."
    variant="gradient"
  >
    <template #illustration>
      <div class="emoji">🏗️</div>
    </template>

    <template #actions>
      <BaseTag size="md" variant="primary" text="dự kiến: tháng 6/2026" />
      <RouterLink to="/" class="no-link">
        <BaseButton variant="ghost" size="lg">← Về trang chủ</BaseButton>
      </RouterLink>
    </template>

    <form v-if="!subscribed" class="notify" @submit.prevent="subscribe">
      <h3>Nhận thông báo khi sẵn sàng</h3>
      <div class="notify-row">
        <BaseInput v-model="email" type="email" placeholder="ban@congty.vn" />
        <BaseButton type="submit">Đăng ký</BaseButton>
      </div>
      <p class="muted small">Chúng tôi không spam — chỉ gửi 1 email duy nhất khi tính năng go-live.</p>
    </form>

    <div v-else class="ok">
      <span>✅</span>
      <strong>Đã đăng ký!</strong> Chúng tôi sẽ thông báo qua <strong>{{ email }}</strong>.
    </div>
  </ErrorLayout>
</template>

<style scoped>
.no-link { text-decoration: none; }
.emoji { font-size: 96px; }
.notify {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  padding: var(--wx-space-4);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-xl);
  margin-top: var(--wx-space-3);
  text-align: left;
}
.notify h3 {
  margin: 0;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-semibold);
}
.notify-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--wx-space-2);
}
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }
.ok {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-3);
  background: var(--wx-success-bg);
  border-radius: var(--wx-radius-lg);
  margin-top: var(--wx-space-3);
  font-size: var(--wx-fs-13);
}
</style>
