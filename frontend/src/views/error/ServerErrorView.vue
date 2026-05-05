<script setup lang="ts">
/** error/500 — server error */
import { RouterLink } from 'vue-router'
import ErrorLayout from '../_layouts/ErrorLayout.vue'
import { BaseButton, BaseTag } from '../../components/common'
</script>

<template>
  <ErrorLayout
    code="500"
    title="Lỗi máy chủ"
    description="Đã có lỗi xảy ra ở phía máy chủ. Đội ngũ kỹ thuật đã được thông báo. Vui lòng thử lại sau ít phút."
    error-id="ERR-500-d39f81c"
  >
    <template #actions>
      <BaseButton size="lg" @click="$router.go(0)">Thử lại</BaseButton>
      <RouterLink to="/" class="no-link">
        <BaseButton variant="ghost" size="lg">Về trang chủ</BaseButton>
      </RouterLink>
      <BaseButton variant="ghost" size="lg">Liên hệ hỗ trợ</BaseButton>
    </template>

    <div class="status">
      <div class="status-row">
        <span>API gateway</span>
        <BaseTag size="sm" variant="success" text="hoạt động" />
      </div>
      <div class="status-row">
        <span>Database</span>
        <BaseTag size="sm" variant="warning" text="chậm" />
      </div>
      <div class="status-row">
        <span>Cache layer</span>
        <BaseTag size="sm" variant="danger" text="lỗi" />
      </div>
      <p class="status-cap">
        Xem chi tiết tại <a href="#">status.wemake.app</a>
      </p>
    </div>
  </ErrorLayout>
</template>

<style scoped>
.no-link { text-decoration: none; }
.status {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  padding: var(--wx-space-3);
  background: var(--wx-surface-elevated);
  border-radius: var(--wx-radius-lg);
  border: 1px solid var(--wx-border-subtle);
  margin-top: var(--wx-space-3);
}
.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--wx-fs-13);
}
.status-cap {
  margin: var(--wx-space-2) 0 0;
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  text-align: center;
}
.status-cap a { color: var(--wx-content-link); text-decoration: none; }
.status-cap a:hover { text-decoration: underline; }
</style>
