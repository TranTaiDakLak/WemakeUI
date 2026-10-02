<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseInput, BaseSegmented, BaseTextarea } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import MindDialog from './MindDialog.vue'
import MindField from './MindField.vue'
import MindSection from './MindSection.vue'

const show = defineModel<boolean>({ required: true })

const activeTab = ref('share-link')
const TABS = [
  { value: 'share-link', label: 'Tạo liên kết chia sẻ' },
  { value: 'add-data',   label: 'Nhập từ nguồn khác' },
  { value: 'dedupe',     label: 'Kiểm tra trùng lặp' },
]
const shareRecordId = ref('')
const dedupeRecordId = ref('')
const addDataText = ref('')
</script>

<template>
  <MindDialog
    v-model="show"
    title="Tiện ích"
    subtitle="Chia sẻ, nhập dữ liệu và kiểm tra trùng lặp"
    :icon="SHELL_ICONS.wrench"
    size="md"
  >
    <div class="util-body">
      <BaseSegmented v-model="activeTab" :options="TABS" block size="sm" aria-label="Chọn tiện ích" />

      <MindSection v-if="activeTab === 'share-link'" title="Tạo liên kết chia sẻ" description="Sinh liên kết xem bản ghi cho người khác">
        <MindField label="Mã bản ghi" stacked>
          <div class="util-row">
            <BaseInput v-model="shareRecordId" placeholder="Nhập mã bản ghi..." size="sm" class="util-grow" />
            <BaseButton variant="primary" size="sm">Tạo liên kết</BaseButton>
          </div>
        </MindField>
        <div class="util-result">Kết quả sẽ hiển thị ở đây...</div>
      </MindSection>

      <MindSection v-else-if="activeTab === 'add-data'" title="Thêm dữ liệu từ phần mềm khác" description="Dán danh sách đã xuất từ công cụ khác">
        <BaseTextarea
          v-model="addDataText"
          :rows="8"
          :autosize="false"
          placeholder="Dán dữ liệu từ phần mềm khác vào đây..."
          style="font-family: var(--wx-font-mono)"
        />
        <div class="util-actions">
          <BaseButton variant="primary" size="sm">Xử lý dữ liệu</BaseButton>
        </div>
      </MindSection>

      <MindSection v-else title="Kiểm tra trùng lặp" description="So khớp mã bản ghi với dữ liệu hiện có">
        <MindField label="Mã bản ghi" stacked>
          <div class="util-row">
            <BaseInput v-model="dedupeRecordId" placeholder="Nhập mã bản ghi..." size="sm" class="util-grow" />
            <BaseButton variant="primary" size="sm">Kiểm tra</BaseButton>
          </div>
        </MindField>
        <div class="util-result">Kết quả sẽ hiển thị ở đây...</div>
      </MindSection>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
.util-body { display: flex; flex-direction: column; gap: var(--wx-space-4); min-height: 280px; }
.util-row { display: flex; gap: var(--wx-space-2); align-items: center; width: 100%; }
.util-grow { flex: 1; min-width: 0; }
.util-actions { display: flex; justify-content: flex-end; }
.util-result {
  padding: var(--wx-space-2) 10px;
  border: 1px dashed var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-13);
}
</style>
