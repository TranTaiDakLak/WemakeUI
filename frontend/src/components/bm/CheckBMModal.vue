<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, GroupBox } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const config = ref('Tất cả')
const checkType = ref('Kiểm tra thông tin BM')
const bmIds = ref('')
const delay = ref(3)
const switchIG = ref(false)
const kickLimit = ref(false)

const CONFIG_OPTIONS = ['Tất cả', 'Theo ID BM']
const CHECK_TYPES = [
  'Kiểm tra thông tin BM',
  'Kiểm tra TKQC trong BM',
  'Kiểm tra BM cơ bản (nhanh)',
  'Kiểm tra BM có nút kick',
  'Kiểm tra BM đã kick về',
  'Kiểm tra page có mua hàng trong BM',
]

function onSave() {
  showToast('info', 'Kiểm tra BM — chức năng đang phát triển (cần backend)')
}
</script>

<template>
  <BaseModal :show="show" title="Kiểm tra thông tin Business Manager" size="md" @close="$emit('close')">
    <div class="bm-form">
      <GroupBox title="Cấu hình kiểm tra">
        <div class="form-grid">
          <div class="form-row">
            <label>Cấu hình:</label>
            <select v-model="config" class="form-select">
              <option v-for="c in CONFIG_OPTIONS" :key="c">{{ c }}</option>
            </select>
          </div>
          <div class="form-row">
            <label>Kiểu kiểm tra:</label>
            <select v-model="checkType" class="form-select">
              <option v-for="t in CHECK_TYPES" :key="t">{{ t }}</option>
            </select>
          </div>
          <div v-if="config === 'Theo ID BM'" class="form-row">
            <label>Danh sách ID BM:</label>
            <textarea v-model="bmIds" class="form-textarea" rows="3" placeholder="Nhập ID BM (mỗi dòng 1 ID)" />
          </div>
          <div class="form-row">
            <label>Thời gian nghỉ (giây):</label>
            <input v-model.number="delay" type="number" min="0" class="form-input form-input--sm" />
          </div>
          <div class="form-options">
            <label class="form-checkbox"><input type="checkbox" v-model="switchIG" /> Chuyển sang chế độ IG</label>
            <label class="form-checkbox"><input type="checkbox" v-model="kickLimit" /> Kick limit</label>
          </div>
        </div>
      </GroupBox>
    </div>

    <template #footer>
      <div class="modal-footer">
        <button class="btn btn--primary" @click="onSave">Lưu</button>
        <button class="btn btn--close" @click="$emit('close')">Đóng</button>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.bm-form { display: flex; flex-direction: column; gap: 12px; }
.form-grid { display: flex; flex-direction: column; gap: 8px; }
.form-row { display: flex; align-items: center; gap: 8px; }
.form-row label { font-size: 12px; color: var(--text-secondary); white-space: nowrap; min-width: 140px; }
.form-input { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); }
.form-input--sm { max-width: 100px; }
.form-select { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; background: #fff; }
.form-textarea { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); resize: vertical; }
.form-checkbox { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; cursor: pointer; }
.form-checkbox input { accent-color: var(--brand-primary); }
.form-options { display: flex; gap: 16px; flex-wrap: wrap; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border-color); }
.btn { padding: 6px 16px; border: none; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--font-family); }
.btn--primary { background: var(--brand-primary); color: #fff; }
.btn--primary:hover { opacity: 0.88; }
.btn--close { background: #e74c3c; color: #fff; }
.btn--close:hover { opacity: 0.88; }
</style>
