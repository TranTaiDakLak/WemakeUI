<script setup lang="ts">
/**
 * MindFilterStrip — thanh trạng thái bộ lọc đang áp dụng (nổi ở đáy bảng, ngay trên footer).
 *
 * Port từ RuleFilterBar của MindAds, tinh gọn thành 3 nhóm:
 *   1. ngữ cảnh lọc (pill xanh; đỏ khi `risk`)   2. số kết quả   3. hành động (quản lý · xoá, Esc)
 *
 *   <MindFilterStrip :active="isFiltering" :label="'Trạng thái: Lỗi'" :count="3" @clear="reset" />
 *
 * Esc = xoá bộ lọc (chỉ khi strip đang hiện và focus không nằm trong input/textarea).
 */
import { onBeforeUnmount, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  active: boolean
  /** mô tả điều kiện đang lọc */
  label: string
  count: number
  countLabel?: string
  /** tông cảnh báo (đỏ nhạt) cho điều kiện rủi ro */
  risk?: boolean
  manageLabel?: string
  clearLabel?: string
  /** ẩn nút quản lý */
  hideManage?: boolean
}>(), {
  countLabel: 'kết quả',
  risk: false,
  manageLabel: 'Quản lý bộ lọc',
  clearLabel: 'Xoá bộ lọc',
  hideManage: false,
})

const emit = defineEmits<{
  clear: []
  manage: []
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !props.active) return
  const t = e.target as HTMLElement | null
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return
  emit('clear')
}
onMounted(() => { if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown) })
onBeforeUnmount(() => { if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown) })
</script>

<template>
  <Transition name="mfs">
    <div v-if="active" class="mfs" role="region" aria-label="Bộ lọc đang áp dụng">
      <span class="mfs__pill" :class="{ 'mfs__pill--risk': risk }" :title="label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        <span class="mfs__label">{{ label }}</span>
      </span>

      <span class="mfs__div" aria-hidden="true" />

      <span class="mfs__count"><strong>{{ count }}</strong> {{ countLabel }}</span>

      <span class="mfs__div" aria-hidden="true" />

      <div class="mfs__actions">
        <button v-if="!hideManage" type="button" class="mfs__btn" @click="emit('manage')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          {{ manageLabel }}
        </button>
        <button type="button" class="mfs__btn mfs__btn--clear" :title="`${clearLabel} (Esc)`" @click="emit('clear')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {{ clearLabel }}
          <kbd class="mind-kbd">Esc</kbd>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.mfs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--wx-space-3);
  padding: 8px var(--wx-space-4);
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-sunken);
}
.mfs__pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--wx-shell-tone-brand-bd);
  border-radius: var(--wx-radius-md);
  background: var(--wx-shell-tone-brand-bg);
  color: var(--wx-shell-tone-brand-fg);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
}
.mfs__pill--risk { background: var(--wx-shell-tone-danger-bg); border-color: var(--wx-shell-tone-danger-bd); color: var(--wx-shell-tone-danger-fg); }
.mfs__label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mfs__div { width: 1px; height: 18px; background: var(--wx-border-default); }
.mfs__count { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); font-weight: var(--wx-fw-medium); }
.mfs__count strong { color: var(--wx-text-primary); font-weight: var(--wx-fw-bold); font-variant-numeric: tabular-nums; }
.mfs__actions { display: inline-flex; align-items: center; gap: var(--wx-space-2); margin-left: auto; }
.mfs__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  color: var(--wx-text-secondary);
  font: inherit;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), border-color var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.mfs__btn:hover { background: var(--wx-hover-bg); border-color: var(--wx-brand-300); color: var(--wx-brand-primary); }
.mfs__btn--clear:hover { background: var(--wx-danger-bg); border-color: var(--wx-danger-border); color: var(--wx-danger-text); }
.mfs__btn:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }
.mfs .mind-kbd { height: 16px; font-size: 9.5px; }

.mfs-enter-active, .mfs-leave-active { transition: opacity var(--wx-d-fast) var(--wx-ease-standard), transform var(--wx-d-fast) var(--wx-ease-standard); }
.mfs-enter-from, .mfs-leave-to { opacity: 0; transform: translateY(6px); }

@media (max-width: 640px) { .mfs__actions { margin-left: 0; width: 100%; } }
@media (prefers-reduced-motion: reduce) { .mfs-enter-active, .mfs-leave-active { transition: none; } }
</style>
