<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, GroupBox } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

/* Config */
const config = ref('Tất cả')
const typeBM = ref('')
const typeTKQC = ref('')
const bmIds = ref('')
const quantity = ref(1)
const linkOnBM = ref(1)
const delay = ref(3)
const failLimit = ref(3)

/* Mail */
const mailType = ref('Email chính')

/* Options */
const getLinkByToken = ref(false)
const onlyLiveBM = ref(false)
const onlyLiveTKQC = ref(false)
const kickLimit = ref(false)

const CONFIG_OPTIONS = ['Tất cả', 'Theo ID BM']
const MAIL_OPTIONS = ['Email chính', 'Email khôi phục', 'Email khác']

function onSave() {
  showToast('info', 'Get Link BM — chức năng đang phát triển (cần backend)')
}
</script>

<template>
  <BaseModal :show="show" title="Get Link BM" size="md" @close="$emit('close')">
    <div class="bm-form">
      <GroupBox title="Cấu hình">
        <div class="form-grid">
          <div class="form-row-pair">
            <div class="form-row">
              <label>Cấu hình:</label>
              <select v-model="config" class="form-select"><option v-for="c in CONFIG_OPTIONS" :key="c">{{ c }}</option></select>
            </div>
            <div class="form-row">
              <label>Loại BM:</label>
              <input v-model="typeBM" class="form-input" placeholder="Loại BM" />
            </div>
          </div>
          <div class="form-row">
            <label>Loại TKQC:</label>
            <input v-model="typeTKQC" class="form-input" placeholder="Loại TKQC" />
          </div>
          <div v-if="config === 'Theo ID BM'" class="form-row">
            <label>ID BM:</label>
            <textarea v-model="bmIds" class="form-textarea" rows="2" placeholder="Nhập ID BM" />
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Số lượng:</label>
              <input v-model.number="quantity" type="number" min="1" class="form-input form-input--sm" />
            </div>
            <div class="form-row">
              <label>Links/BM:</label>
              <input v-model.number="linkOnBM" type="number" min="1" class="form-input form-input--sm" />
            </div>
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Nghỉ (giây):</label>
              <input v-model.number="delay" type="number" min="0" class="form-input form-input--sm" />
            </div>
            <div class="form-row">
              <label>Dừng khi fail:</label>
              <input v-model.number="failLimit" type="number" min="1" class="form-input form-input--sm" />
            </div>
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Mail">
        <div class="form-grid">
          <div class="form-row">
            <label>Loại mail:</label>
            <select v-model="mailType" class="form-select"><option v-for="m in MAIL_OPTIONS" :key="m">{{ m }}</option></select>
          </div>
        </div>
      </GroupBox>

      <div class="form-options">
        <label class="form-checkbox"><input type="checkbox" v-model="getLinkByToken" /> Get link bằng token</label>
        <label class="form-checkbox"><input type="checkbox" v-model="onlyLiveBM" /> Chỉ BM Live</label>
        <label class="form-checkbox"><input type="checkbox" v-model="onlyLiveTKQC" /> Chỉ TKQC Live</label>
        <label class="form-checkbox"><input type="checkbox" v-model="kickLimit" /> Kick limit only</label>
      </div>
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
.form-row label { font-size: 12px; color: var(--text-secondary); white-space: nowrap; min-width: 100px; }
.form-row-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
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
