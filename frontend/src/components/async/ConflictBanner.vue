<script setup lang="ts">
/**
 * ConflictBanner — "có cập nhật mới từ {user}, [xem & merge] / [bỏ qua]".
 * theo §5.4 — KHÔNG auto-overwrite input của user.
 *
 *   <ConflictBanner :user="'Lan'" :at="ts" @merge="..." @ignore="..." />
 */
import { computed, onBeforeUnmount, ref } from 'vue'

interface Props {
  /** tên user khác đã cập nhật */
  user: string
  /** ms epoch lần cập nhật của họ */
  at?: number | null
  /** label nút merge */
  mergeLabel?: string
  /** label nút bỏ qua */
  ignoreLabel?: string
  /** mô tả thêm */
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  at: null,
  mergeLabel: 'xem & merge',
  ignoreLabel: 'bỏ qua',
})

defineEmits<{
  merge: []
  ignore: []
}>()

const now = ref(Date.now())
const timer = setInterval(() => (now.value = Date.now()), 1000)
onBeforeUnmount(() => clearInterval(timer))

const relative = computed(() => {
  if (!props.at) return ''
  const diff = Math.max(0, now.value - props.at)
  const sec = Math.floor(diff / 1000)
  if (sec < 5) return 'vừa xong'
  if (sec < 60) return `${sec}s trước`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} phút trước`
  return `${Math.floor(min / 60)} giờ trước`
})
</script>

<template>
  <div class="wx-conflict" role="alert">
    <span class="wx-conflict__icon" aria-hidden="true">↻</span>
    <div class="wx-conflict__body">
      <div class="wx-conflict__title">
        có cập nhật mới từ <strong>{{ user }}</strong>
        <span v-if="relative" class="wx-conflict__time">· {{ relative }}</span>
      </div>
      <div v-if="description" class="wx-conflict__desc">{{ description }}</div>
    </div>
    <div class="wx-conflict__actions">
      <button type="button" class="wx-conflict__btn wx-conflict__btn--primary" @click="$emit('merge')">
        {{ mergeLabel }}
      </button>
      <button type="button" class="wx-conflict__btn" @click="$emit('ignore')">
        {{ ignoreLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.wx-conflict {
  display: flex;
  gap: var(--wx-space-3);
  align-items: center;
  padding: var(--wx-space-3) var(--wx-space-4);
  border-radius: var(--wx-radius-md);
  background: var(--wx-warning-bg);
  border: 1px solid var(--wx-warning-border);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-primary);
  box-shadow: var(--wx-shadow-sm);
}

.wx-conflict__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-warning-solid);
  color: var(--wx-text-inverse);
  font-size: 14px;
  font-weight: var(--wx-fw-bold);
  flex-shrink: 0;
}

.wx-conflict__body {
  flex: 1;
  min-width: 0;
}
.wx-conflict__title { color: var(--wx-warning-text); font-weight: var(--wx-fw-medium); }
.wx-conflict__time {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  margin-left: var(--wx-space-1);
}
.wx-conflict__desc {
  margin-top: 2px;
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
}

.wx-conflict__actions {
  display: flex;
  gap: var(--wx-space-2);
  flex-shrink: 0;
}

.wx-conflict__btn {
  font-family: inherit;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  padding: 6px 12px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  border: 1px solid var(--wx-border-default);
  cursor: pointer;
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.wx-conflict__btn:hover { background: var(--wx-hover-bg); }
.wx-conflict__btn--primary {
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border-color: var(--wx-brand-primary);
}
.wx-conflict__btn--primary:hover { filter: brightness(0.95); background: var(--wx-brand-primary); }
.wx-conflict__btn:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}

@media (max-width: 600px) {
  .wx-conflict { flex-wrap: wrap; }
  .wx-conflict__actions { width: 100%; justify-content: flex-end; }
}
</style>
