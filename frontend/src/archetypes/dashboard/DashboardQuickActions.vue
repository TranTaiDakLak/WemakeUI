<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, FormModal, FormField, BaseInput, BaseSelectMenu, BaseTextarea } from '@/components/common'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

/* ── Campaign modal ─────────────────────────────────────── */
const campaignModal = ref(false)
const campaignLoading = ref(false)
const campaignForm = ref({ name: '', platform: 'WhatsApp', type: 'broadcast', message: '' })

async function submitCampaign() {
  if (!campaignForm.value.name.trim()) { showToast('error', 'Vui lòng nhập tên chiến dịch'); return }
  campaignLoading.value = true
  await new Promise(r => setTimeout(r, 1400))
  campaignLoading.value = false
  campaignModal.value = false
  showToast('success', `Chiến dịch "${campaignForm.value.name}" đã được tạo`)
  campaignForm.value = { name: '', platform: 'WhatsApp', type: 'broadcast', message: '' }
}

/* ── Account modal ──────────────────────────────────────── */
const accountModal = ref(false)
const accountLoading = ref(false)
const accountForm = ref({ phone: '', name: '', platform: 'WhatsApp', group: '', note: '' })

async function submitAccount() {
  if (!accountForm.value.phone.trim()) { showToast('error', 'Vui lòng nhập số điện thoại'); return }
  accountLoading.value = true
  await new Promise(r => setTimeout(r, 1200))
  accountLoading.value = false
  accountModal.value = false
  showToast('success', `Tài khoản ${accountForm.value.phone} đã được thêm`)
  accountForm.value = { phone: '', name: '', platform: 'WhatsApp', group: '', note: '' }
}

/* expose for parent trigger */
defineExpose({
  openCampaignModal: () => { campaignModal.value = true },
  openAccountModal: () => { accountModal.value = true },
})
</script>

<template>
  <div style="display: contents">
    <!-- modals rendered inline — parent calls expose methods to trigger -->
    <FormModal
      v-model="campaignModal"
      title="Tạo chiến dịch mới"
      :loading="campaignLoading"
      submit-label="Tạo chiến dịch"
      @submit="submitCampaign"
    >
      <div class="qa-form">
        <FormField label="Tên chiến dịch" :required="true">
          <BaseInput
            v-model="campaignForm.name"
            placeholder="VD: Khuyến mãi tháng 6..."
            :disabled="campaignLoading"
          />
        </FormField>
        <div class="qa-row-2">
          <FormField label="Nền tảng">
            <BaseSelectMenu
              v-model="campaignForm.platform"
              :options="[
                { value: 'WhatsApp', label: 'WhatsApp' },
                { value: 'Zalo', label: 'Zalo' },
                { value: 'Telegram', label: 'Telegram' },
                { value: 'SMS', label: 'SMS' },
              ]"
              :disabled="campaignLoading"
            />
          </FormField>
          <FormField label="Loại chiến dịch">
            <BaseSelectMenu
              v-model="campaignForm.type"
              :options="[
                { value: 'broadcast', label: 'Broadcast' },
                { value: 'autoresponder', label: 'Autoresponder' },
                { value: 'sequence', label: 'Sequence' },
              ]"
              :disabled="campaignLoading"
            />
          </FormField>
        </div>
        <FormField label="Nội dung tin nhắn">
          <BaseTextarea
            v-model="campaignForm.message"
            placeholder="Nhập nội dung tin nhắn mẫu..."
            :rows="4"
            :disabled="campaignLoading"
          />
        </FormField>
      </div>
    </FormModal>

    <FormModal
      v-model="accountModal"
      title="Thêm tài khoản"
      :loading="accountLoading"
      submit-label="Thêm tài khoản"
      @submit="submitAccount"
    >
      <div class="qa-form">
        <div class="qa-row-2">
          <FormField label="Số điện thoại" :required="true">
            <BaseInput v-model="accountForm.phone" placeholder="+84912345678" :disabled="accountLoading" />
          </FormField>
          <FormField label="Tên hiển thị">
            <BaseInput v-model="accountForm.name" placeholder="Tên tài khoản..." :disabled="accountLoading" />
          </FormField>
        </div>
        <div class="qa-row-2">
          <FormField label="Nền tảng">
            <BaseSelectMenu
              v-model="accountForm.platform"
              :options="[
                { value: 'WhatsApp', label: 'WhatsApp' },
                { value: 'Zalo', label: 'Zalo' },
                { value: 'Telegram', label: 'Telegram' },
              ]"
              :disabled="accountLoading"
            />
          </FormField>
          <FormField label="Nhóm">
            <BaseInput v-model="accountForm.group" placeholder="VD: Sales, Support..." :disabled="accountLoading" />
          </FormField>
        </div>
        <FormField label="Ghi chú">
          <BaseTextarea
            v-model="accountForm.note"
            placeholder="Ghi chú về tài khoản này..."
            :rows="3"
            :disabled="accountLoading"
          />
        </FormField>
      </div>
    </FormModal>

  </div>
</template>

<style scoped>
.qa-form { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.qa-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }
</style>
