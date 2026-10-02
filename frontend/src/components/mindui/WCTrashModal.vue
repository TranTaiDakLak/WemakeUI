<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import MindDialog from './MindDialog.vue'

const show = defineModel<boolean>({ required: true })

const trashItems = ref<{ id: number; uid: string; fullName: string; deletedAt: string }[]>([])

function restore(id: number) {
  trashItems.value = trashItems.value.filter(i => i.id !== id)
}

function deletePerm(id: number) {
  trashItems.value = trashItems.value.filter(i => i.id !== id)
}

function emptyAll() {
  trashItems.value = []
}
</script>

<template>
  <MindDialog
    v-model="show"
    title="Thùng rác"
    :subtitle="trashItems.length ? `${trashItems.length} mục đã xoá` : 'Bản ghi đã xoá được giữ tại đây'"
    :icon="SHELL_ICONS.trash"
    tone="neutral"
    size="md"
  >
    <div class="trash-body">
      <div class="trash-toolbar">
        <span class="trash-count">{{ trashItems.length }} mục</span>
        <BaseButton variant="danger" size="sm" :disabled="trashItems.length === 0" @click="emptyAll">
          Xóa tất cả vĩnh viễn
        </BaseButton>
      </div>

      <div v-if="trashItems.length === 0" class="trash-empty">
        <span class="trash-empty__ic" aria-hidden="true" v-html="SHELL_ICONS.trash" />
        <strong>Thùng rác trống</strong>
        <span>Bản ghi bị xoá sẽ xuất hiện ở đây để bạn khôi phục.</span>
      </div>

      <ul v-else class="trash-list mind-slim-scroll">
        <li v-for="item in trashItems" :key="item.id" class="trash-row">
          <div class="trash-info">
            <span class="trash-uid">{{ item.uid }}</span>
            <span class="trash-name">{{ item.fullName }}</span>
            <span class="trash-date">{{ item.deletedAt }}</span>
          </div>
          <div class="trash-actions">
            <BaseButton variant="ghost" size="sm" @click="restore(item.id)">
              <span class="trash-ic" aria-hidden="true" v-html="SHELL_ICONS.refresh" />Khôi phục
            </BaseButton>
            <BaseButton variant="danger" size="sm" @click="deletePerm(item.id)">Xóa vĩnh viễn</BaseButton>
          </div>
        </li>
      </ul>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
.trash-body { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.trash-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-3); flex-wrap: wrap; }
.trash-count {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border: 1px solid var(--wx-neutral-border);
  border-radius: var(--wx-radius-full);
  background: var(--wx-neutral-bg);
  color: var(--wx-neutral-text);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
}

.trash-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--wx-space-8) var(--wx-space-4);
  border: 1px dashed var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
  font-size: var(--wx-fs-12);
  text-align: center;
}
.trash-empty strong { font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }
.trash-empty__ic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--wx-space-1);
  border-radius: var(--wx-radius-item);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  color: var(--wx-text-light);
}
.trash-empty__ic :deep(svg) { width: 22px; height: 22px; }

.trash-list { display: flex; flex-direction: column; gap: var(--wx-space-1); max-height: 380px; margin: 0; padding: 0; list-style: none; overflow-y: auto; }
.trash-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
  padding: var(--wx-space-2) 10px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-ctrl);
  background: var(--wx-surface-elevated);
}
.trash-info { display: flex; align-items: center; flex-wrap: wrap; gap: 2px var(--wx-space-3); flex: 1; min-width: 0; }
.trash-uid { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-brand-600); white-space: nowrap; }
.trash-name { flex: 1 1 140px; min-width: 0; font-size: var(--wx-fs-13); color: var(--wx-text-primary); overflow-wrap: anywhere; }
.trash-date { font-size: var(--wx-fs-12); color: var(--wx-text-muted); margin-left: auto; white-space: nowrap; }
.trash-actions { display: flex; gap: var(--wx-space-2); }
.trash-ic { display: inline-flex; margin-right: 6px; }
@media (max-width: 520px) {
  .trash-actions { width: 100%; justify-content: flex-end; }
}
.trash-ic :deep(svg) { width: 14px; height: 14px; }
</style>
