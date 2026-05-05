<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const selectedScript = ref('')
const scripts = [
  { value: 'like_post', label: 'Like bài viết' },
  { value: 'comment_post', label: 'Comment bài viết' },
  { value: 'add_friend', label: 'Kết bạn' },
  { value: 'poke', label: 'Poke' },
  { value: 'share_post', label: 'Chia sẻ bài viết' },
  { value: 'follow', label: 'Follow' },
  { value: 'join_group', label: 'Tham gia nhóm' },
  { value: 'like_page', label: 'Like Page' },
]

const accountPrimary = ref(true)
const accountSecondary = ref(false)
const accountPage = ref(false)

function handleManageScripts() {
  showToast('info', 'Quản lý kịch bản — chức năng đang phát triển')
}

function handleSave() {
  if (!selectedScript.value) { showToast('warning', 'Vui lòng chọn kịch bản!'); return }
  if (!accountPrimary.value && !accountSecondary.value && !accountPage.value) {
    showToast('warning', 'Vui lòng chọn ít nhất 1 loại tài khoản!')
    return
  }
  showToast('info', 'Lưu cấu hình tương tác — chức năng đang phát triển')
}
</script>

<template>
  <BaseModal :show="show" title="Tương tác kịch bản" size="md" show-save save-label="Lưu" @close="$emit('close')" @save="handleSave">
    <div class="interact-content">
      <div class="gbox">
        <div class="gbox-header">Tùy chọn tương tác</div>
        <div class="gbox-body">
          <div class="gbox-inner">
            <div class="gbox-inner-header">Tương tác theo kịch bản</div>
            <div class="gbox-inner-body">
              <div class="form-row">
                <span class="form-label">Chọn kịch bản:</span>
                <select class="form-input" v-model="selectedScript">
                  <option value="" disabled>-- Chọn kịch bản --</option>
                  <option v-for="s in scripts" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
              </div>
              <div class="form-row">
                <span class="form-label"></span>
                <button class="btn-manage" @click="handleManageScripts">Quản lý kịch bản</button>
              </div>
            </div>
          </div>

          <div class="account-section">
            <div class="account-label">Chọn tài khoản chạy</div>
            <div class="account-checks">
              <label class="chk-label"><input type="checkbox" v-model="accountPrimary" /> Chính</label>
              <label class="chk-label"><input type="checkbox" v-model="accountSecondary" /> Phụ</label>
              <label class="chk-label"><input type="checkbox" v-model="accountPage" /> Page</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.interact-content { display: flex; flex-direction: column; gap: 12px; }
.gbox { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; }
.gbox-header { padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.gbox-body { padding: 14px; display: flex; flex-direction: column; gap: 16px; }
.gbox-inner { border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; }
.gbox-inner-header { padding: 6px 12px; font-size: 12px; font-weight: 600; color: var(--text-secondary); background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.gbox-inner-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; }
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-secondary); gap: 16px; }
.form-row:last-child { border-bottom: none; }
.form-label { min-width: 110px; }
.btn-manage { padding: 5px 14px; font-size: 12px; font-family: var(--font-family); background: var(--brand-primary); color: #fff; border: none; border-radius: var(--radius-sm); cursor: pointer; transition: opacity 0.15s; }
.btn-manage:hover { opacity: 0.85; }
.account-section { display: flex; flex-direction: column; gap: 8px; }
.account-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.account-checks { display: flex; gap: 24px; }
.chk-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; }
.chk-label input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }
</style>
