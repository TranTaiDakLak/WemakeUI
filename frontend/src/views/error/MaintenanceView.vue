<script setup lang="ts">
/** error/503 — bảo trì */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import ErrorLayout from '../_layouts/ErrorLayout.vue'
import { BaseButton, BaseTag, BaseProgress } from '../../components/common'

const eta = ref(45) // phút còn lại
const progress = ref(62)
</script>

<template>
  <ErrorLayout
    title="Đang bảo trì hệ thống"
    description="Chúng tôi đang triển khai bản cập nhật quan trọng. Hệ thống sẽ trở lại sớm — cảm ơn bạn đã kiên nhẫn."
    variant="gradient"
    tone="warning"
  >
    <template #illustration>
      <div class="wrench" aria-hidden="true">🔧</div>
    </template>

    <template #actions>
      <BaseTag size="md" variant="warning" label="503 service unavailable" />
      <BaseButton variant="ghost" size="lg" @click="$router.back()">← Quay lại</BaseButton>
      <RouterLink to="/" class="no-link">
        <BaseButton variant="ghost" size="lg">Về trang chủ</BaseButton>
      </RouterLink>
    </template>

    <div class="info">
      <div class="eta">
        <span class="eta-num">{{ eta }}</span>
        <span class="eta-unit">phút còn lại</span>
      </div>
      <BaseProgress :value="progress" size="md" variant="primary" :label="`${progress}%`" />
      <ul class="todo">
        <li>✓ Sao lưu cơ sở dữ liệu</li>
        <li>✓ Triển khai phiên bản mới</li>
        <li class="cur">→ Chạy migration</li>
        <li class="muted">○ Kiểm tra sức khoẻ</li>
        <li class="muted">○ Khôi phục lưu lượng</li>
      </ul>
    </div>
  </ErrorLayout>
</template>

<style scoped>
.no-link { text-decoration: none; }
.wrench { font-size: 96px; }

.info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding: var(--wx-space-4);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-xl);
  margin-top: var(--wx-space-3);
  text-align: left;
}
.eta {
  display: flex;
  align-items: baseline;
  gap: var(--wx-space-2);
  justify-content: center;
}
.eta-num {
  font-size: 64px;
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
  color: var(--wx-brand-primary);
  line-height: 1;
}
.eta-unit { font-size: var(--wx-fs-14); color: var(--wx-content-muted); }
.todo {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: var(--wx-fs-13);
}
.todo .cur { font-weight: var(--wx-fw-semibold); color: var(--wx-brand-primary); }
.todo .muted { color: var(--wx-content-muted); }
</style>
