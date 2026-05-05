<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, GroupBox } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const config = ref('Tất cả')
const bmIds = ref('')
const country = ref('VN')
const businessList = ref('')

/* Business info */
const legalName = ref('')
const address1 = ref('')
const address2 = ref('')
const city = ref('')
const state = ref('')
const zipCode = ref('')
const taxId = ref('')
const website = ref('')
const phone = ref('')

const CONFIG_OPTIONS = ['Tất cả', 'Theo ID BM']
const COUNTRY_OPTIONS = ['VN', 'US', 'UK', 'JP', 'KR', 'TH', 'ID', 'PH', 'MY', 'SG']

function onSave() {
  showToast('info', 'Xác minh BM — chức năng đang phát triển (cần backend)')
}
</script>

<template>
  <BaseModal :show="show" title="Tạo BM xác minh Doanh nghiệp" size="lg" @close="$emit('close')">
    <div class="bm-form">
      <GroupBox title="Cấu hình">
        <div class="form-grid">
          <div class="form-row-pair">
            <div class="form-row">
              <label>Cấu hình:</label>
              <select v-model="config" class="form-select"><option v-for="c in CONFIG_OPTIONS" :key="c">{{ c }}</option></select>
            </div>
            <div class="form-row">
              <label>Quốc gia:</label>
              <select v-model="country" class="form-select"><option v-for="c in COUNTRY_OPTIONS" :key="c">{{ c }}</option></select>
            </div>
          </div>
          <div v-if="config === 'Theo ID BM'" class="form-row">
            <label>ID BM:</label>
            <textarea v-model="bmIds" class="form-textarea" rows="2" placeholder="Nhập ID BM" />
          </div>
          <div class="form-row">
            <label>Danh sách DN:</label>
            <textarea v-model="businessList" class="form-textarea" rows="2" placeholder="Nhập danh sách doanh nghiệp" />
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Thông tin doanh nghiệp">
        <div class="form-grid">
          <div class="form-row">
            <label>Tên pháp lý:</label>
            <input v-model="legalName" class="form-input" placeholder="Tên doanh nghiệp (pháp lý)" />
          </div>
          <div class="form-row">
            <label>Địa chỉ 1:</label>
            <input v-model="address1" class="form-input" placeholder="Số nhà, đường" />
          </div>
          <div class="form-row">
            <label>Địa chỉ 2:</label>
            <input v-model="address2" class="form-input" placeholder="Tòa nhà, tầng (tùy chọn)" />
          </div>
          <div class="form-row-triple">
            <div class="form-row">
              <label>Thành phố:</label>
              <input v-model="city" class="form-input" placeholder="Thành phố" />
            </div>
            <div class="form-row">
              <label>Tỉnh/Bang:</label>
              <input v-model="state" class="form-input" placeholder="Tỉnh/Bang" />
            </div>
            <div class="form-row">
              <label>Mã bưu điện:</label>
              <input v-model="zipCode" class="form-input" placeholder="Zip/Postal" />
            </div>
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Mã số thuế:</label>
              <input v-model="taxId" class="form-input" placeholder="MST" />
            </div>
            <div class="form-row">
              <label>Điện thoại:</label>
              <input v-model="phone" class="form-input" placeholder="SĐT doanh nghiệp" />
            </div>
          </div>
          <div class="form-row">
            <label>Website:</label>
            <input v-model="website" class="form-input" placeholder="https://example.com" />
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
.form-row-triple { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.form-input { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); }
.form-select { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; background: #fff; }
.form-textarea { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); resize: vertical; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border-color); }
.btn { padding: 6px 16px; border: none; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--font-family); }
.btn--primary { background: var(--brand-primary); color: #fff; }
.btn--primary:hover { opacity: 0.88; }
.btn--close { background: #e74c3c; color: #fff; }
.btn--close:hover { opacity: 0.88; }
</style>
