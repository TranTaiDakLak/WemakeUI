<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseModal, BaseBadge } from '../common'

const show = defineModel<boolean>({ required: true })

const trashItems = ref([
  { id: 1, uid: '100011111111', fullName: 'Tài khoản A', deletedAt: '2026-05-01 10:00' },
  { id: 2, uid: '100022222222', fullName: 'Tài khoản B', deletedAt: '2026-05-02 14:30' },
  { id: 3, uid: '100033333333', fullName: 'Tài khoản C', deletedAt: '2026-05-03 09:15' },
])

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
  <BaseModal :show="show" title="🗑 Thùng rác" size="lg" @close="show = false">
    <div class="trash-body">
      <div class="trash-toolbar">
        <span class="trash-count">{{ trashItems.length }} mục</span>
        <BaseButton variant="danger" size="sm" :disabled="trashItems.length === 0" @click="emptyAll">
          Xóa tất cả vĩnh viễn
        </BaseButton>
      </div>

      <div v-if="trashItems.length === 0" class="trash-empty">Thùng rác trống</div>

      <div v-else class="trash-list">
        <div v-for="item in trashItems" :key="item.id" class="trash-row">
          <div class="trash-info">
            <span class="trash-uid">{{ item.uid }}</span>
            <span class="trash-name">{{ item.fullName }}</span>
            <span class="trash-date">{{ item.deletedAt }}</span>
          </div>
          <div class="trash-actions">
            <BaseButton variant="ghost" size="sm" @click="restore(item.id)">↩ Khôi phục</BaseButton>
            <BaseButton variant="danger" size="sm" @click="deletePerm(item.id)">Xóa vĩnh viễn</BaseButton>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="trash-footer">
        <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.trash-body { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.trash-toolbar { display: flex; align-items: center; justify-content: space-between; }
.trash-count { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }
.trash-empty { text-align: center; padding: var(--wx-space-8); font-size: var(--wx-fs-14); color: var(--wx-text-muted); }
.trash-list { display: flex; flex-direction: column; gap: 4px; max-height: 380px; overflow-y: auto; }
.trash-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-3);
  padding: 8px 10px;
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
}
.trash-info { display: flex; align-items: center; gap: var(--wx-space-3); flex: 1; }
.trash-uid { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-brand-600); }
.trash-name { font-size: var(--wx-fs-13); color: var(--wx-text-primary); }
.trash-date { font-size: var(--wx-fs-11); color: var(--wx-text-muted); margin-left: auto; }
.trash-actions { display: flex; gap: var(--wx-space-2); }
.trash-footer { display: flex; justify-content: flex-end; width: 100%; }
</style>
