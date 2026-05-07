<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseInput, BaseTabs, GroupBox, BaseTextarea, BaseModal } from '../common'

const show = defineModel<boolean>({ required: true })

const activeTab = ref('bm-link')
const TABS = [
  { key: 'bm-link',   label: 'Lấy link nhận BM' },
  { key: 'add-data',  label: 'Thêm dữ liệu từ PM khác' },
  { key: 'bm-vip',    label: 'Kiểm tra BM VIP' },
]
const bmLinkUid = ref('')
const bmVipUid = ref('')
const addDataText = ref('')
</script>

<template>
  <BaseModal :show="show" title="🔧 Tiện ích" size="lg" @close="show = false">
    <BaseTabs v-model="activeTab" :tabs="TABS">
      <template #bm-link>
        <GroupBox title="Lấy link nhận BM">
          <div class="util-row">
            <BaseInput v-model="bmLinkUid" placeholder="Nhập UID..." size="sm" style="flex:1" />
            <BaseButton variant="primary" size="sm">Lấy link</BaseButton>
          </div>
          <div class="util-result">Kết quả sẽ hiển thị ở đây...</div>
        </GroupBox>
      </template>

      <template #add-data>
        <GroupBox title="Thêm dữ liệu từ phần mềm khác">
          <BaseTextarea
            v-model="addDataText"
            :rows="8"
            :autosize="false"
            placeholder="Dán dữ liệu từ phần mềm khác vào đây..."
            style="font-family:var(--wx-font-mono)"
          />
          <BaseButton variant="primary" size="sm" style="margin-top:8px">Xử lý dữ liệu</BaseButton>
        </GroupBox>
      </template>

      <template #bm-vip>
        <GroupBox title="Kiểm tra BM VIP">
          <div class="util-row">
            <BaseInput v-model="bmVipUid" placeholder="Nhập BM ID..." size="sm" style="flex:1" />
            <BaseButton variant="primary" size="sm">Kiểm tra</BaseButton>
          </div>
          <div class="util-result">Kết quả sẽ hiển thị ở đây...</div>
        </GroupBox>
      </template>
    </BaseTabs>

    <template #footer>
      <div style="width:100%;display:flex;justify-content:flex-end">
        <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.util-row { display: flex; gap: var(--wx-space-2); align-items: center; }
.util-result { margin-top: var(--wx-space-3); padding: 8px 10px; background: var(--wx-surface-sunken); border-radius: var(--wx-radius-md); font-size: var(--wx-fs-13); color: var(--wx-text-muted); font-family: var(--wx-font-mono); }
</style>
