<script setup lang="ts">
/** error/offline — không có kết nối */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ErrorLayout from '../_layouts/ErrorLayout.vue'
import { BaseButton, BaseTag } from '../../components/common'

const online = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
function update() { online.value = navigator.onLine }

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online',  update)
    window.addEventListener('offline', update)
  }
})
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('online',  update)
    window.removeEventListener('offline', update)
  }
})

function retry() { window.location.reload() }
</script>

<template>
  <ErrorLayout
    title="Không có kết nối mạng"
    description="Có vẻ bạn đang offline. Một số tính năng vẫn hoạt động nhờ cache — chúng tôi sẽ tự đồng bộ khi mạng quay lại."
    variant="plain"
  >
    <template #illustration>
      <div class="wifi" aria-hidden="true">📡</div>
    </template>

    <template #actions>
      <BaseButton size="lg" @click="retry">Thử lại</BaseButton>
      <BaseButton variant="ghost" size="lg">Xem dữ liệu offline</BaseButton>
    </template>

    <div class="status">
      <div class="status-row">
        <span>Kết nối</span>
        <BaseTag
          :label="online ? 'online' : 'offline'"
          :variant="online ? 'success' : 'danger'"
          size="sm"
        />
      </div>
      <div class="status-row">
        <span>Mutation queue</span>
        <BaseTag label="3 chờ sync" variant="warning" size="sm" />
      </div>
      <div class="status-row">
        <span>Cache còn hạn</span>
        <BaseTag label="14 mục" variant="neutral" size="sm" />
      </div>
      <p class="hint">
        Mọi thao tác bạn làm offline sẽ được đẩy lên khi mạng quay lại
        (queue lưu trong IndexedDB, không mất dữ liệu).
      </p>
    </div>
  </ErrorLayout>
</template>

<style scoped>
.wifi { font-size: 96px; opacity: 0.7; }
.status {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  padding: var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-lg);
  margin-top: var(--wx-space-3);
  text-align: left;
}
.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--wx-fs-13);
}
.hint {
  margin: var(--wx-space-2) 0 0;
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  line-height: var(--wx-lh-normal);
}
</style>
