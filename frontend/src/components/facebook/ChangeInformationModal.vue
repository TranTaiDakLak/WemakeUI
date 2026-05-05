<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const changeFields = ref([
  { key: 'fullName', label: 'Họ tên', checked: false },
  { key: 'birthday', label: 'Sinh nhật', checked: false },
  { key: 'gender', label: 'Giới tính', checked: false },
  { key: 'hometown', label: 'Quê quán', checked: false },
  { key: 'currentCity', label: 'Thành phố hiện tại', checked: false },
  { key: 'bio', label: 'Tiểu sử', checked: false },
  { key: 'avatar', label: 'Ảnh đại diện', checked: false },
  { key: 'cover', label: 'Ảnh bìa', checked: false },
  { key: 'password', label: 'Mật khẩu', checked: false },
  { key: 'email', label: 'Email', checked: false },
  { key: 'phone', label: 'Số điện thoại', checked: false },
  { key: '2fa', label: '2FA', checked: false },
])

const threadCount = ref(5)

function handleRun() {
  const selected = changeFields.value.filter(f => f.checked)
  if (!selected.length) { showToast('warning', 'Vui lòng chọn ít nhất 1 trường!'); return }
  showToast('info', `Cập nhật ${selected.length} trường — chức năng đang phát triển`)
}
</script>

<template>
  <BaseModal :show="show" title="Đổi thông tin" size="md" show-save save-label="Chạy" @close="$emit('close')" @save="handleRun">
    <div class="change-content">
      <div class="gbox">
        <div class="gbox-header">Chọn trường cần cập nhật</div>
        <div class="gbox-body gbox-body--grid">
          <label v-for="f in changeFields" :key="f.key" class="chk-item">
            <input type="checkbox" v-model="f.checked" /><span>{{ f.label }}</span>
          </label>
        </div>
      </div>

      <div class="gbox">
        <div class="gbox-header">Cấu hình</div>
        <div class="gbox-body">
          <div class="form-row"><span class="form-label">Số luồng</span><input type="number" class="form-input form-input--sm" v-model="threadCount" min="1" /></div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.change-content { display: flex; flex-direction: column; gap: 12px; }
.gbox { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; }
.gbox-header { padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.gbox-body { padding: 10px 14px; display: flex; flex-direction: column; gap: 2px; }
.gbox-body--grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 12px; }
.chk-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; padding: 3px 0; }
.chk-item input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-secondary); gap: 16px; }
.form-row:last-child { border-bottom: none; }
.form-label { flex: 1; }
</style>
