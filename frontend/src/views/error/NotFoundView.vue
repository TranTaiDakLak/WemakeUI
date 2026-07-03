<script setup lang="ts">
/** error/404 — page not found */
import { RouterLink } from 'vue-router'
import ErrorLayout from '../_layouts/ErrorLayout.vue'
import { BaseButton } from '../../components/common'
</script>

<template>
  <ErrorLayout
    code="404"
    tone="info"
    title="Trang không tồn tại"
    description="Đường dẫn bạn vừa truy cập không tồn tại hoặc đã được di chuyển. Kiểm tra lại URL hoặc quay về trang chủ."
    error-id="REQ-404-3aF92"
  >
    <template #actions>
      <RouterLink to="/" class="no-link">
        <BaseButton size="lg">Về trang chủ</BaseButton>
      </RouterLink>
      <BaseButton variant="ghost" size="lg" @click="$router.back()">← Quay lại</BaseButton>
    </template>

    <ul class="suggest">
      <li><strong>Có thể bạn đang tìm:</strong></li>
      <li><RouterLink to="/dashboard/overview">Dashboard tổng quan</RouterLink></li>
      <li><RouterLink to="/">Trang chủ</RouterLink></li>
      <li><RouterLink to="/auth/login">Đăng nhập</RouterLink></li>
    </ul>
  </ErrorLayout>
</template>

<style scoped>
.no-link { text-decoration: none; }
.suggest {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: var(--wx-fs-13);
  color: var(--wx-content-muted);
}
.suggest a {
  color: var(--wx-content-link);
  text-decoration: none;
}
.suggest a:hover { text-decoration: underline; }
</style>
