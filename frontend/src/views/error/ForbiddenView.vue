<script setup lang="ts">
/** error/403 — forbidden / no permission */
import { RouterLink } from 'vue-router'
import ErrorLayout from '../_layouts/ErrorLayout.vue'
import { BaseButton, BaseTag } from '../../components/common'
</script>

<template>
  <ErrorLayout
    code="403"
    title="Bạn không có quyền truy cập"
    description="Trang này chỉ dành cho thành viên có vai trò admin trở lên. Hãy yêu cầu chủ workspace cấp quyền nếu cần."
    error-id="AUTH-403-1c3"
  >
    <template #actions>
      <BaseButton size="lg">Yêu cầu cấp quyền</BaseButton>
      <RouterLink to="/" class="no-link">
        <BaseButton variant="ghost" size="lg">Về trang chủ</BaseButton>
      </RouterLink>
    </template>

    <div class="ctx">
      <h3>Quyền hiện tại của bạn</h3>
      <div class="row">
        <span>Vai trò</span>
        <BaseTag text="member" variant="info" size="sm" />
      </div>
      <div class="row">
        <span>Quyền cần</span>
        <BaseTag text="admin" variant="warning" size="sm" />
      </div>
      <div class="row">
        <span>Trang yêu cầu</span>
        <code class="mono">/admin/billing/invoices</code>
      </div>
    </div>
  </ErrorLayout>
</template>

<style scoped>
.no-link { text-decoration: none; }
.ctx {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  padding: var(--wx-space-3);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-lg);
  margin-top: var(--wx-space-3);
  text-align: left;
}
.ctx h3 {
  margin: 0 0 var(--wx-space-1);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-content-secondary);
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--wx-fs-13);
}
.mono {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  background: var(--wx-surface-sunken);
  padding: 2px 6px;
  border-radius: var(--wx-radius-sm);
}
</style>
