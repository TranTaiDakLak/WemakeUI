<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, GroupBox } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const typeBM = ref('')
const typeBMOut = ref('')
const typeOut = ref('')
const typeTKQC = ref('')
const config = ref('Tất cả')
const bmIds = ref('')
const failLimit = ref(3)
const delay = ref(3)

/* BM status filter */
const bmLive = ref(true)
const bmDie = ref(false)

/* TKQC status filter */
const tkqcLive = ref(true)
const tkqcDie = ref(false)

const CONFIG_OPTIONS = ['Tất cả', 'Theo ID BM']

function onSave() {
  showToast('info', 'Thoát BM — chức năng đang phát triển (cần backend)')
}
</script>

<template>
  <BaseModal :show="show" title="Thoát BM" size="md" @close="$emit('close')">
    <div class="bm-form">
      <GroupBox title="Cấu hình thoát BM">
        <div class="form-grid">
          <div class="form-row-pair">
            <div class="form-row">
              <label>Loại BM:</label>
              <input v-model="typeBM" class="form-input" placeholder="Loại BM" />
            </div>
            <div class="form-row">
              <label>Loại BM thoát:</label>
              <input v-model="typeBMOut" class="form-input" placeholder="Loại BM thoát" />
            </div>
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Kiểu thoát:</label>
              <input v-model="typeOut" class="form-input" placeholder="Kiểu thoát" />
            </div>
            <div class="form-row">
              <label>Loại TKQC:</label>
              <input v-model="typeTKQC" class="form-input" placeholder="Loại TKQC" />
            </div>
          </div>
          <div class="form-row">
            <label>Cấu hình:</label>
            <select v-model="config" class="form-select"><option v-for="c in CONFIG_OPTIONS" :key="c">{{ c }}</option></select>
          </div>
          <div v-if="config === 'Theo ID BM'" class="form-row">
            <label>ID BM:</label>
            <textarea v-model="bmIds" class="form-textarea" rows="2" placeholder="Nhập ID BM" />
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Dừng khi fail:</label>
              <input v-model.number="failLimit" type="number" min="1" class="form-input form-input--sm" />
            </div>
            <div class="form-row">
              <label>Nghỉ (giây):</label>
              <input v-model.number="delay" type="number" min="0" class="form-input form-input--sm" />
            </div>
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Lọc trạng thái">
        <div class="form-grid">
          <div class="form-row-pair">
            <div>
              <label class="filter-label">BM:</label>
              <div class="form-options">
                <label class="form-checkbox"><input type="checkbox" v-model="bmLive" /> Live</label>
                <label class="form-checkbox"><input type="checkbox" v-model="bmDie" /> Die</label>
              </div>
            </div>
            <div>
              <label class="filter-label">TKQC:</label>
              <div class="form-options">
                <label class="form-checkbox"><input type="checkbox" v-model="tkqcLive" /> Live</label>
                <label class="form-checkbox"><input type="checkbox" v-model="tkqcDie" /> Die</label>
              </div>
            </div>
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
.form-row label { font-size: 12px; color: var(--text-secondary); white-space: nowrap; min-width: 100px; }
.form-row-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-input { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); }
.form-input--sm { max-width: 100px; }
.form-select { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; background: #fff; }
.form-textarea { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); resize: vertical; }
.form-checkbox { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; cursor: pointer; }
.form-checkbox input { accent-color: var(--brand-primary); }
.form-options { display: flex; gap: 16px; flex-wrap: wrap; }
.filter-label { font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 4px; display: block; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border-color); }
.btn { padding: 6px 16px; border: none; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--font-family); }
.btn--primary { background: var(--brand-primary); color: #fff; }
.btn--primary:hover { opacity: 0.88; }
.btn--close { background: #e74c3c; color: #fff; }
.btn--close:hover { opacity: 0.88; }
</style>
