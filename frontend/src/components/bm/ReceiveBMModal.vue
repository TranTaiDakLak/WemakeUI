<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, GroupBox } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const firstName = ref('')
const lastName = ref('')
const linksBM = ref('')
const limitDone = ref(1)
const limitFail = ref(3)
const delay = ref(3)
const checkAfterReceive = ref(false)

function onSave() {
  showToast('info', 'Nhận BM — chức năng đang phát triển (cần backend)')
}
</script>

<template>
  <BaseModal :show="show" title="Nhận BM" size="md" @close="$emit('close')">
    <div class="bm-form">
      <GroupBox title="Thông tin nhận BM">
        <div class="form-grid">
          <div class="form-row-pair">
            <div class="form-row">
              <label>Họ:</label>
              <input v-model="lastName" class="form-input" placeholder="Họ" />
            </div>
            <div class="form-row">
              <label>Tên:</label>
              <input v-model="firstName" class="form-input" placeholder="Tên" />
            </div>
          </div>
          <div class="form-row">
            <label>Link nhận BM:</label>
            <textarea v-model="linksBM" class="form-textarea" rows="3" placeholder="Nhập link nhận BM (mỗi dòng 1 link)" />
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Giới hạn BM/TK:</label>
              <input v-model.number="limitDone" type="number" min="1" class="form-input form-input--sm" />
            </div>
            <div class="form-row">
              <label>Dừng khi fail:</label>
              <input v-model.number="limitFail" type="number" min="1" class="form-input form-input--sm" />
            </div>
          </div>
          <div class="form-row">
            <label>Thời gian nghỉ (giây):</label>
            <input v-model.number="delay" type="number" min="0" class="form-input form-input--sm" />
          </div>
          <label class="form-checkbox">
            <input type="checkbox" v-model="checkAfterReceive" /> Kiểm tra BM sau khi nhận
          </label>
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
.form-textarea { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); resize: vertical; }
.form-checkbox { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; cursor: pointer; }
.form-checkbox input { accent-color: var(--brand-primary); }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border-color); }
.btn { padding: 6px 16px; border: none; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--font-family); }
.btn--primary { background: var(--brand-primary); color: #fff; }
.btn--primary:hover { opacity: 0.88; }
.btn--close { background: #e74c3c; color: #fff; }
.btn--close:hover { opacity: 0.88; }
</style>
