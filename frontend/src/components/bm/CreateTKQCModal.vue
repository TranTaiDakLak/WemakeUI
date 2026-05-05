<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, GroupBox } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

/* General */
const config = ref('Tất cả')
const typeBM = ref('')
const bmIds = ref('')
const threadPerBM = ref(1)
const delay = ref(3)

/* Create TKQC */
const createTKQC = ref(true)
const limitPerBM = ref(1)
const country = ref('VN')
const timeZone = ref('Asia/Ho_Chi_Minh')
const currency = ref('VND')
const useName = ref(false)
const nameTKQC = ref('')
const tkqc2500 = ref(false)

/* Share partner */
const sharePartner = ref(false)
const partnerIds = ref('')

/* Get link */
const getLink = ref(false)
const mailType = ref('Email chính')
const linkLimit = ref(1)

/* Rename BM */
const renameBM = ref(false)
const newNameBM = ref('')

const CONFIG_OPTIONS = ['Tất cả', 'Theo ID BM']
const MAIL_OPTIONS = ['Email chính', 'Email khôi phục', 'Email khác']
const COUNTRY_OPTIONS = ['VN', 'US', 'UK', 'JP', 'KR', 'TH', 'ID', 'PH', 'MY', 'SG']
const TZ_OPTIONS = ['Asia/Ho_Chi_Minh', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo']
const CURRENCY_OPTIONS = ['VND', 'USD', 'EUR', 'GBP', 'JPY', 'KRW', 'THB']

function onSave() {
  showToast('info', 'Tạo TKQC — chức năng đang phát triển (cần backend)')
}
</script>

<template>
  <BaseModal :show="show" title="Tạo tài khoản quảng cáo" size="lg" @close="$emit('close')">
    <div class="bm-form">
      <GroupBox title="Cấu hình chung">
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
          <div v-if="config === 'Theo ID BM'" class="form-row">
            <label>ID BM:</label>
            <textarea v-model="bmIds" class="form-textarea" rows="2" placeholder="Nhập ID BM" />
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Luồng/BM:</label>
              <input v-model.number="threadPerBM" type="number" min="1" class="form-input form-input--sm" />
            </div>
            <div class="form-row">
              <label>Nghỉ (giây):</label>
              <input v-model.number="delay" type="number" min="0" class="form-input form-input--sm" />
            </div>
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Tạo TKQC">
        <div class="form-grid">
          <label class="form-checkbox"><input type="checkbox" v-model="createTKQC" /> Tạo tài khoản quảng cáo</label>
          <template v-if="createTKQC">
            <div class="form-row">
              <label>Số TKQC/BM:</label>
              <input v-model.number="limitPerBM" type="number" min="1" class="form-input form-input--sm" />
            </div>
            <div class="form-row-triple">
              <div class="form-row">
                <label>Quốc gia:</label>
                <select v-model="country" class="form-select"><option v-for="c in COUNTRY_OPTIONS" :key="c">{{ c }}</option></select>
              </div>
              <div class="form-row">
                <label>Múi giờ:</label>
                <select v-model="timeZone" class="form-select"><option v-for="tz in TZ_OPTIONS" :key="tz">{{ tz }}</option></select>
              </div>
              <div class="form-row">
                <label>Tiền tệ:</label>
                <select v-model="currency" class="form-select"><option v-for="c in CURRENCY_OPTIONS" :key="c">{{ c }}</option></select>
              </div>
            </div>
            <div class="form-row">
              <label><input type="checkbox" v-model="useName" /> Tên TKQC:</label>
              <input v-model="nameTKQC" class="form-input" :disabled="!useName" placeholder="Tên tài khoản quảng cáo" />
            </div>
            <label class="form-checkbox"><input type="checkbox" v-model="tkqc2500" /> 2500</label>
          </template>
        </div>
      </GroupBox>

      <GroupBox title="Share đối tác">
        <div class="form-grid">
          <label class="form-checkbox"><input type="checkbox" v-model="sharePartner" /> Share với đối tác</label>
          <div v-if="sharePartner" class="form-row">
            <label>ID đối tác:</label>
            <textarea v-model="partnerIds" class="form-textarea" rows="2" placeholder="Nhập ID đối tác" />
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Get Link Invite">
        <div class="form-grid">
          <label class="form-checkbox"><input type="checkbox" v-model="getLink" /> Lấy link mời</label>
          <template v-if="getLink">
            <div class="form-row-pair">
              <div class="form-row">
                <label>Loại mail:</label>
                <select v-model="mailType" class="form-select"><option v-for="m in MAIL_OPTIONS" :key="m">{{ m }}</option></select>
              </div>
              <div class="form-row">
                <label>Links/BM:</label>
                <input v-model.number="linkLimit" type="number" min="1" class="form-input form-input--sm" />
              </div>
            </div>
          </template>
        </div>
      </GroupBox>

      <GroupBox title="Đổi tên BM">
        <div class="form-grid">
          <div class="form-row">
            <label><input type="checkbox" v-model="renameBM" /> Đổi tên BM:</label>
            <input v-model="newNameBM" class="form-input" :disabled="!renameBM" placeholder="Tên BM mới" />
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
.form-row label { font-size: 12px; color: var(--text-secondary); white-space: nowrap; min-width: 100px; display: flex; align-items: center; gap: 4px; }
.form-row-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-row-triple { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.form-input { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; font-family: var(--font-family); }
.form-input--sm { max-width: 100px; }
.form-input:disabled { background: var(--bg-tertiary); color: var(--text-tertiary); }
.form-select { flex: 1; padding: 5px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px; background: #fff; }
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
