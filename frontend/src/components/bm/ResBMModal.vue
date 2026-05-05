<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, GroupBox } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const bmScope = ref<'all' | 'list'>('all')
const bmIds = ref('')
const typeBM = ref('')
const quantity = ref(1)
const delay = ref(3)
const hasCreatedTKQC = ref(true)
const noCreatedTKQC = ref(false)

function onSave() {
  showToast('info', 'Kháng BM — chức năng đang phát triển (cần backend)')
}
</script>

<template>
  <BaseModal :show="show" title="Kháng BM" size="md" @close="$emit('close')">
    <div class="bm-form">
      <GroupBox title="Cấu hình kháng BM">
        <div class="form-grid">
          <div class="form-options">
            <label class="form-radio"><input type="radio" v-model="bmScope" value="all" /> Tất cả</label>
            <label class="form-radio"><input type="radio" v-model="bmScope" value="list" /> Theo danh sách ID</label>
          </div>
          <div v-if="bmScope === 'list'" class="form-row">
            <label>ID BM:</label>
            <textarea v-model="bmIds" class="form-textarea" rows="3" placeholder="Nhập ID BM (mỗi dòng 1 ID)" />
          </div>
          <div class="form-row">
            <label>Loại BM:</label>
            <input v-model="typeBM" class="form-input" placeholder="Loại BM" />
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>BM/TK cần kick:</label>
              <input v-model.number="quantity" type="number" min="1" class="form-input form-input--sm" />
            </div>
            <div class="form-row">
              <label>Nghỉ (giây):</label>
              <input v-model.number="delay" type="number" min="0" class="form-input form-input--sm" />
            </div>
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Lọc tài khoản">
        <div class="form-options">
          <label class="form-checkbox"><input type="checkbox" v-model="hasCreatedTKQC" /> Đã tạo tài khoản</label>
          <label class="form-checkbox"><input type="checkbox" v-model="noCreatedTKQC" /> Chưa tạo tài khoản</label>
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
.form-row label { font-size: 12px; color: var(--text-secondary); white-space: nowrap; min-width: 120px; }
.form-row-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-input { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); }
.form-input--sm { max-width: 100px; }
.form-select { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; background: #fff; }
.form-textarea { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); resize: vertical; }
.form-checkbox, .form-radio { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; cursor: pointer; }
.form-checkbox input, .form-radio input { accent-color: var(--brand-primary); }
.form-options { display: flex; gap: 16px; flex-wrap: wrap; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border-color); }
.btn { padding: 6px 16px; border: none; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--font-family); }
.btn--primary { background: var(--brand-primary); color: #fff; }
.btn--primary:hover { opacity: 0.88; }
.btn--close { background: #e74c3c; color: #fff; }
.btn--close:hover { opacity: 0.88; }
</style>
