<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const pageType = ref('create')
const pageTypes = [
  { value: 'create', label: 'Tạo Page' },
  { value: 'createSub', label: 'Tạo Sub Nick' },
  { value: 'share', label: 'Share Page' },
  { value: 'check', label: 'Kiểm tra Page' },
  { value: 'out', label: 'Out Page' },
]

/* Tab: Tạo Page */
const createPageName = ref('')
const createRandomName = ref(false)
const createAvatar = ref('')
const createCover = ref('')
const createQuantity = ref(1)
const createDelay = ref(3)
const createUpdateInfo = ref(false)
const createInfoChecks = ref([
  { key: 'website', label: 'Website', checked: false, count: 0 },
  { key: 'phone', label: 'Số điện thoại', checked: false, count: 0 },
  { key: 'email', label: 'Email', checked: false, count: 0 },
  { key: 'category', label: 'Danh mục', checked: false, count: 0 },
  { key: 'address', label: 'Địa chỉ', checked: false, count: 0 },
  { key: 'city', label: 'Thành phố', checked: false, count: 0 },
  { key: 'zipcode', label: 'Zipcode', checked: false, count: 0 },
  { key: 'bio', label: 'Tiểu sử', checked: false, count: 0 },
])

/* Tab: Tạo Sub Nick */
const subName = ref('')
const subRandomName = ref(false)
const subAvatar = ref('')
const subCover = ref('')
const subQuantity = ref(1)
const subDelay = ref(3)
const subUpdateInfo = ref(false)
const subInfoChecks = ref([
  { key: 'bio', label: 'Tiểu sử', checked: false, count: 0 },
  { key: 'highschool', label: 'Trường cấp 3', checked: false, count: 0 },
  { key: 'university', label: 'Đại học', checked: false, count: 0 },
  { key: 'workplace', label: 'Nơi làm việc', checked: false, count: 0 },
  { key: 'hometown', label: 'Quê quán', checked: false, count: 0 },
  { key: 'currentCity', label: 'Thành phố hiện tại', checked: false, count: 0 },
])

/* Tab: Share Page */
const shareTarget = ref('account')
const shareQuantity = ref(1)
const shareDelay = ref(3)

/* Tab: Check Page */
const checkMode = ref('all')
const checkDelay = ref(3)

/* Tab: Out Page */
const outTarget = ref('account')
const outAccountMode = ref('all')
const outBMMode = ref('all')
const outOptions = ref([
  { key: 'removeExceptAdmin', label: 'Xóa tất cả trừ Admin', checked: false },
  { key: 'removeEmployees', label: 'Xóa tất cả nhân viên', checked: false },
  { key: 'removeAdmins', label: 'Xóa tất cả Admin', checked: false },
  { key: 'leavePages', label: 'Rời tất cả Page', checked: false },
])
const outBMOptions = ref([
  { key: 'removeFromBM', label: 'Xóa Page khỏi BM', checked: false },
  { key: 'deletePage', label: 'Xóa Page hoàn toàn', checked: false },
  { key: 'removeDataset', label: 'Xóa dataset link', checked: false },
])

const currentLabel = computed(() => pageTypes.find(t => t.value === pageType.value)?.label ?? '')

function handleRun() {
  showToast('info', `${currentLabel.value} — chức năng đang phát triển`)
}
</script>

<template>
  <BaseModal :show="show" :title="'Page — ' + currentLabel" size="lg" show-save save-label="Chạy" @close="$emit('close')" @save="handleRun">
    <div class="page-content">
      <!-- Type selector -->
      <div class="gbox">
        <div class="gbox-header">Loại thao tác</div>
        <div class="gbox-body">
          <div class="form-row">
            <span class="form-label">Chọn loại:</span>
            <select class="form-input" v-model="pageType">
              <option v-for="t in pageTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tab: Tạo Page -->
      <template v-if="pageType === 'create'">
        <div class="gbox">
          <div class="gbox-header">Cấu hình tạo Page</div>
          <div class="gbox-body">
            <div class="form-row">
              <span class="form-label">Tên Page</span>
              <input type="text" class="form-input" v-model="createPageName" placeholder="Nhập tên Page..." :disabled="createRandomName" />
            </div>
            <div class="form-row"><label class="chk-label"><input type="checkbox" v-model="createRandomName" /> Dùng tên ngẫu nhiên</label></div>
            <div class="form-row"><span class="form-label">Ảnh đại diện</span><input type="text" class="form-input" v-model="createAvatar" placeholder="URL ảnh đại diện..." /></div>
            <div class="form-row"><span class="form-label">Ảnh bìa</span><input type="text" class="form-input" v-model="createCover" placeholder="URL ảnh bìa..." /></div>
            <div class="form-row"><span class="form-label">Số lượng</span><input type="number" class="form-input form-input--sm" v-model="createQuantity" min="1" /></div>
            <div class="form-row"><span class="form-label">Delay (giây)</span><input type="number" class="form-input form-input--sm" v-model="createDelay" min="0" /></div>
          </div>
        </div>
        <div class="gbox">
          <div class="gbox-header">
            <label class="chk-label chk-label--header"><input type="checkbox" v-model="createUpdateInfo" /> Cập nhật thông tin</label>
          </div>
          <div v-if="createUpdateInfo" class="gbox-body gbox-body--grid">
            <label v-for="c in createInfoChecks" :key="c.key" class="chk-item">
              <input type="checkbox" v-model="c.checked" /><span>{{ c.label }} <template v-if="c.count">({{ c.count }})</template></span>
            </label>
          </div>
        </div>
      </template>

      <!-- Tab: Tạo Sub Nick -->
      <template v-else-if="pageType === 'createSub'">
        <div class="gbox">
          <div class="gbox-header">Cấu hình tạo Sub Nick</div>
          <div class="gbox-body">
            <div class="form-row">
              <span class="form-label">Tên Sub Nick</span>
              <input type="text" class="form-input" v-model="subName" placeholder="Nhập tên..." :disabled="subRandomName" />
            </div>
            <div class="form-row"><label class="chk-label"><input type="checkbox" v-model="subRandomName" /> Dùng tên ngẫu nhiên</label></div>
            <div class="form-row"><span class="form-label">Ảnh đại diện</span><input type="text" class="form-input" v-model="subAvatar" placeholder="URL ảnh đại diện..." /></div>
            <div class="form-row"><span class="form-label">Ảnh bìa</span><input type="text" class="form-input" v-model="subCover" placeholder="URL ảnh bìa..." /></div>
            <div class="form-row"><span class="form-label">Số lượng</span><input type="number" class="form-input form-input--sm" v-model="subQuantity" min="1" /></div>
            <div class="form-row"><span class="form-label">Delay (giây)</span><input type="number" class="form-input form-input--sm" v-model="subDelay" min="0" /></div>
          </div>
        </div>
        <div class="gbox">
          <div class="gbox-header">
            <label class="chk-label chk-label--header"><input type="checkbox" v-model="subUpdateInfo" /> Cập nhật thông tin</label>
          </div>
          <div v-if="subUpdateInfo" class="gbox-body gbox-body--grid">
            <label v-for="c in subInfoChecks" :key="c.key" class="chk-item">
              <input type="checkbox" v-model="c.checked" /><span>{{ c.label }} <template v-if="c.count">({{ c.count }})</template></span>
            </label>
          </div>
        </div>
      </template>

      <!-- Tab: Share Page -->
      <template v-else-if="pageType === 'share'">
        <div class="gbox">
          <div class="gbox-header">Cấu hình Share Page</div>
          <div class="gbox-body">
            <div class="form-row">
              <label class="radio-label"><input type="radio" v-model="shareTarget" value="account" /> Share tới Account</label>
              <label class="radio-label"><input type="radio" v-model="shareTarget" value="bm" /> Share tới BM</label>
            </div>
            <div class="form-row"><span class="form-label">Số lượng mỗi TK</span><input type="number" class="form-input form-input--sm" v-model="shareQuantity" min="1" /></div>
            <div class="form-row"><span class="form-label">Delay (giây)</span><input type="number" class="form-input form-input--sm" v-model="shareDelay" min="0" /></div>
          </div>
        </div>
      </template>

      <!-- Tab: Kiểm tra Page -->
      <template v-else-if="pageType === 'check'">
        <div class="gbox">
          <div class="gbox-header">Cấu hình kiểm tra Page</div>
          <div class="gbox-body">
            <div class="form-row">
              <label class="radio-label"><input type="radio" v-model="checkMode" value="all" /> Kiểm tra tất cả</label>
              <label class="radio-label"><input type="radio" v-model="checkMode" value="byId" /> Theo ID Page</label>
            </div>
            <div class="form-row"><span class="form-label">Delay (giây)</span><input type="number" class="form-input form-input--sm" v-model="checkDelay" min="0" /></div>
          </div>
        </div>
      </template>

      <!-- Tab: Out Page -->
      <template v-else-if="pageType === 'out'">
        <div class="gbox">
          <div class="gbox-header">Cấu hình Out Page</div>
          <div class="gbox-body">
            <div class="form-row">
              <span class="form-label">Đối tượng:</span>
              <select class="form-input" v-model="outTarget">
                <option value="account">Account</option>
                <option value="bm">Business Manager</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Account options -->
        <div v-if="outTarget === 'account'" class="gbox">
          <div class="gbox-header">Tùy chọn Account</div>
          <div class="gbox-body">
            <div class="form-row">
              <label class="radio-label"><input type="radio" v-model="outAccountMode" value="all" /> Tất cả Page</label>
              <label class="radio-label"><input type="radio" v-model="outAccountMode" value="byId" /> Theo ID Page</label>
            </div>
            <label v-for="o in outOptions" :key="o.key" class="chk-item chk-item--row">
              <input type="checkbox" v-model="o.checked" /><span>{{ o.label }}</span>
            </label>
          </div>
        </div>

        <!-- BM options -->
        <div v-if="outTarget === 'bm'" class="gbox">
          <div class="gbox-header">Tùy chọn Business Manager</div>
          <div class="gbox-body">
            <div class="form-row">
              <label class="radio-label"><input type="radio" v-model="outBMMode" value="all" /> Tất cả Page</label>
              <label class="radio-label"><input type="radio" v-model="outBMMode" value="byId" /> Theo ID Page</label>
            </div>
            <label v-for="o in outBMOptions" :key="o.key" class="chk-item chk-item--row">
              <input type="checkbox" v-model="o.checked" /><span>{{ o.label }}</span>
            </label>
          </div>
        </div>
      </template>
    </div>
  </BaseModal>
</template>

<style scoped>
.page-content { display: flex; flex-direction: column; gap: 12px; }
.gbox { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; }
.gbox-header { padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.gbox-body { padding: 10px 14px; display: flex; flex-direction: column; gap: 2px; }
.gbox-body--grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px 16px; }
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-secondary); gap: 16px; }
.form-row:last-child { border-bottom: none; }
.form-label { min-width: 120px; flex-shrink: 0; }
.radio-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; }
.radio-label input[type="radio"] { accent-color: var(--brand-primary); cursor: pointer; }
.chk-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; }
.chk-label--header { color: var(--brand-primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; font-size: 12px; }
.chk-label input[type="checkbox"], .chk-item input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }
.chk-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; padding: 3px 0; }
.chk-item--row { padding: 6px 0; border-bottom: 1px solid var(--border-color); }
.chk-item--row:last-child { border-bottom: none; }
</style>
