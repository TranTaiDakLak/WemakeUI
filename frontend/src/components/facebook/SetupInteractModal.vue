<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'
import { useSettingsStore } from '../../stores/settings'
import {
  CHECK_INFO_ACCOUNT_KEYS, CHECK_INFO_ADS_KEYS, PREMIUM_CHECK_KEYS,
  PAYMENT_TIME_OPTIONS, BM_OPERATIONS, TUT_TYPES,
  type BMOperationType, type TUTType,
  type ConfigInteraction,
  defaultCheckInfoConfig, defaultBMInteractionConfig,
  defaultCloneFarmingConfig, defaultTUTPremiumConfig,
} from '../../types/settings'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [], save: [] }>()

const { showToast } = useToast()
const settingsStore = useSettingsStore()

/* ─── Local form state (clone on open, write back on save) ─── */
const form = reactive<ConfigInteraction>({
  checkInfo: defaultCheckInfoConfig(),
  bm: defaultBMInteractionConfig(),
  page: { likePage: false, sharePage: false, commentPage: false },
  shareTKQC: { quantityPerBM: 1, receiverUid: '', shareBySpecificUid: false, bmType: '', tkqcList: [], mailType: '' },
  campaign: { campaignName: '', budget: 0, targeting: '', addCard: false },
  cloneFarming: defaultCloneFarmingConfig(),
  updateInfo: { updateName: false, updateAvatar: false, updateCover: false, updateBio: false, updateBirthday: false, updateLocation: false },
  checkpoint: { cpType: '', method: '', delay: 5 },
  accountResist: { appeal: false, verifyIdentity: false },
  tutPremium: defaultTUTPremiumConfig(),
})

watch(() => props.show, (val) => {
  if (val) {
    const src = settingsStore.interaction
    Object.assign(form, JSON.parse(JSON.stringify(src)))
  }
})

function handleSave() {
  settingsStore.updateInteraction(JSON.parse(JSON.stringify(form)))
  showToast('success', 'Đã lưu cài đặt tương tác')
  emit('save')
  emit('close')
}

/* ─── Tab navigation ─── */
const activeTab = ref('01')
const tabs = [
  { key: '01', label: 'Kiểm tra tài nguyên' },
  { key: '02', label: 'Business Manager' },
  { key: '03', label: 'Page' },
  { key: '04', label: 'Share TKQC' },
  { key: '05', label: 'Lên camp && Add thẻ' },
  { key: '06', label: 'Tương tác kịch bản' },
  { key: '07', label: 'Cập nhật thông tin' },
  { key: '08', label: 'Gỡ checkpoint' },
  { key: '09', label: 'Kháng tài khoản' },
  { key: '10', label: 'Cá nhân' },
]

/* ─── Tab 01: Kiểm tra tài nguyên ─── */
const ACCOUNT_CHECK_LABELS: Record<string, string> = {
  chkFullName: 'Họ tên', chkFriends: 'Bạn bè', chkFollower: 'Theo dõi',
  chkGender: 'Giới tính', chkGroup: 'Nhóm', chkCurrentCity: 'Thành phố',
  chkHometown: 'Quê quán', chkGroupManager: 'Nhóm quản trị', chkLocation: 'Location',
  chkCover: 'Ảnh bìa', chkAvatar: 'Ảnh đại diện', chkProfessional: 'Chuyên nghiệp',
  chkDating: 'Hẹn hò', chkSecondAccount: 'Nick phụ', chkMarketplace: 'Marketplace',
  chkCheckPost: 'Bài viết', chkRequestFriends: 'Lời mời kết bạn',
  chkDateAccountCreated: 'Ngày tạo', chkBirthday: 'Sinh nhật',
  chkEmailOther: 'Mail khác', chkToken: 'Token', chkPhone: 'Số điện thoại', chkPage: 'Trang',
}
const ADS_CHECK_LABELS: Record<string, string> = {
  chkTKQCAccount: 'TK quảng cáo chính', chkStatusADS: 'Trạng thái quảng cáo',
  chkBM: 'Business manager', chkTKQCFull: 'Toàn bộ TK quảng cáo',
  chkChatSupport: 'Check chat support',
}

const accountCheckedCount = computed(() =>
  CHECK_INFO_ACCOUNT_KEYS.filter(k => form.checkInfo.accountChecks[k]).length
)

/* Mutual exclusion: chkTKQCFull vs chkTKQCAccount */
watch(() => form.checkInfo.adsChecks.chkTKQCFull, (v) => { if (v) form.checkInfo.adsChecks.chkTKQCAccount = false })
watch(() => form.checkInfo.adsChecks.chkTKQCAccount, (v) => { if (v) form.checkInfo.adsChecks.chkTKQCFull = false })
/* Mutual exclusion: paymentAll vs paymentById */
watch(() => form.checkInfo.paymentAll, (v) => { if (v) form.checkInfo.paymentById = false })
watch(() => form.checkInfo.paymentById, (v) => { if (v) form.checkInfo.paymentAll = false })

/* Context menu for check groups */
const ctxMenu = ref({ show: false, x: 0, y: 0, target: '' })
function showCtx(e: MouseEvent, target: string) {
  e.preventDefault()
  ctxMenu.value = { show: true, x: e.clientX, y: e.clientY, target }
}
function hideCtx() { ctxMenu.value.show = false }
function selectAll(target: string, val: boolean) {
  if (target === 'account') {
    for (const k of CHECK_INFO_ACCOUNT_KEYS) form.checkInfo.accountChecks[k] = val
  } else if (target === 'ads') {
    for (const k of CHECK_INFO_ADS_KEYS) form.checkInfo.adsChecks[k] = val
  }
  hideCtx()
}

/* ─── Generic ID list editor (shared by BM + Tab06 + Tab10) ─── */
const idEditor = ref({ show: false, title: '', text: '' })
let idEditorCallback: ((items: string[]) => void) | null = null

function openIdEditor(title: string, currentItems: string[], onSave: (items: string[]) => void) {
  idEditor.value = { show: true, title, text: currentItems.join('\n') }
  idEditorCallback = onSave
}
function saveIdEditor() {
  if (idEditorCallback) {
    idEditorCallback(idEditor.value.text.split('\n').map(s => s.trim()).filter(Boolean))
  }
  idEditor.value.show = false
}

/* ─── Tab 06: Clone Farming UID editors ─── */
const showAddFriendEditor = ref(false)
const addFriendText = ref('')
function openAddFriendEditor() {
  addFriendText.value = form.cloneFarming.addFriendUids.join('\n')
  showAddFriendEditor.value = true
}
function saveAddFriendUids() {
  form.cloneFarming.addFriendUids = addFriendText.value.split('\n').map(s => s.trim()).filter(Boolean)
  showAddFriendEditor.value = false
}

const showAcceptFriendEditor = ref(false)
const acceptFriendText = ref('')
function openAcceptFriendEditor() {
  acceptFriendText.value = form.cloneFarming.acceptFriendUids.join('\n')
  showAcceptFriendEditor.value = true
}
function saveAcceptFriendUids() {
  form.cloneFarming.acceptFriendUids = acceptFriendText.value.split('\n').map(s => s.trim()).filter(Boolean)
  showAcceptFriendEditor.value = false
}

const showScanPageEditor = ref(false)
const scanPageText = ref('')
function openScanPageEditor() {
  scanPageText.value = form.cloneFarming.scanAdLibraryPageIds.join('\n')
  showScanPageEditor.value = true
}
function saveScanPageIds() {
  form.cloneFarming.scanAdLibraryPageIds = scanPageText.value.split('\n').map(s => s.trim()).filter(Boolean)
  showScanPageEditor.value = false
}

/* ─── Tab 10: TUT Premium ─── */
const TUT_BM5_CONFIG_OPTIONS = [
  { value: 'all', label: 'Toàn bộ' },
  { value: 'byId', label: 'Theo ID BM chỉ định' },
]
const TUT_BM5_TYPE_OPTIONS = [
  { value: 'all', label: 'Tất cả BM' },
  { value: 'bm350', label: 'BM350' },
  { value: 'bm50', label: 'BM50' },
  { value: 'bm50_350', label: 'BM50 + BM350' },
  { value: 'bm250', label: 'BM250' },
  { value: 'bmNolimit', label: 'BM Nolimit' },
]
const TUT_ACCOUNT1_CONFIG_OPTIONS = [
  { value: 0, label: 'TUT 1' },
  { value: 1, label: 'TUT whatapp die' },
  { value: 2, label: 'TUT BM chưa tạo app' },
  { value: 3, label: 'TUT 4' },
]
</script>

<template>
  <BaseModal :show="show" title="〜 Thiết lập tương tác" size="lg" show-save @close="$emit('close')" @save="handleSave">
    <!-- Tab navigation -->
    <div class="tab-nav">
      <button v-for="t in tabs" :key="t.key"
        class="tab-btn" :class="{ 'tab-btn--active': activeTab === t.key }"
        @click="activeTab = t.key">
        {{ t.label }}
      </button>
    </div>

    <div class="tab-content" @click="hideCtx">
      <!-- ═══ TAB 01: Kiểm tra tài nguyên ═══ -->
      <div v-if="activeTab === '01'" class="tab-panel">
        <!-- GroupBox: Thông tin tài khoản -->
        <div class="gbox" @contextmenu="showCtx($event, 'account')">
          <div class="gbox-header">Thông tin tài khoản <span class="gbox-count">({{ accountCheckedCount }}/{{ CHECK_INFO_ACCOUNT_KEYS.length }})</span></div>
          <div class="gbox-body gbox-body--grid">
            <label v-for="k in CHECK_INFO_ACCOUNT_KEYS" :key="k" class="chk-item" :class="{ 'chk-item--premium': PREMIUM_CHECK_KEYS.has(k) }">
              <input type="checkbox" v-model="form.checkInfo.accountChecks[k]" />
              <span>{{ ACCOUNT_CHECK_LABELS[k] }}</span>
              <span v-if="PREMIUM_CHECK_KEYS.has(k)" class="premium-badge">Premium</span>
            </label>
          </div>
        </div>

        <!-- GroupBox: Quảng cáo và BM -->
        <div class="gbox" @contextmenu="showCtx($event, 'ads')">
          <div class="gbox-header">Quảng cáo và Business Manager <span class="premium-badge">Premium</span></div>
          <div class="gbox-body gbox-body--grid">
            <label v-for="k in CHECK_INFO_ADS_KEYS" :key="k" class="chk-item">
              <input type="checkbox" v-model="form.checkInfo.adsChecks[k]"
                :disabled="(k === 'chkTKQCAccount' && form.checkInfo.adsChecks.chkTKQCFull) || (k === 'chkTKQCFull' && form.checkInfo.adsChecks.chkTKQCAccount)" />
              <span>{{ ADS_CHECK_LABELS[k] }}</span>
            </label>
          </div>
        </div>

        <!-- GroupBox: Lập hóa đơn && thanh toán -->
        <div class="gbox">
          <div class="gbox-header">Lập hóa đơn && thanh toán <span class="premium-badge">Premium</span></div>
          <div class="gbox-body">
            <div class="payment-row">
              <label class="chk-item"><input type="checkbox" v-model="form.checkInfo.paymentAll" /><span>Toàn bộ</span></label>
              <select class="form-select" v-model="form.checkInfo.paymentTimePeriod">
                <option v-for="o in PAYMENT_TIME_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>
            <div class="payment-row">
              <label class="chk-item">
                <input type="checkbox" v-model="form.checkInfo.paymentById" :disabled="form.checkInfo.paymentAll" />
                <span>Tài khoản quảng cáo ({{ form.checkInfo.paymentIds.length }})</span>
              </label>
              <button class="btn-sm" @click="openIdEditor('ID tài khoản quảng cáo', form.checkInfo.paymentIds, ids => form.checkInfo.paymentIds = ids)" :disabled="!form.checkInfo.paymentById">Chọn ID</button>
            </div>
          </div>
        </div>

        <!-- Context menu -->
        <teleport to="body">
          <div v-if="ctxMenu.show" class="ctx-menu" :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }" @click.stop>
            <button class="ctx-item" @click="selectAll(ctxMenu.target, true)">Chọn tất cả</button>
            <button class="ctx-item ctx-item--red" @click="selectAll(ctxMenu.target, false)">Bỏ chọn tất cả</button>
          </div>
        </teleport>
      </div>

      <!-- ═══ TAB 02: Business Manager ═══ -->
      <div v-else-if="activeTab === '02'" class="tab-panel">
        <div class="form-row">
          <span class="form-label">Loại</span>
          <select class="form-select form-select--lg" v-model="form.bm.selectedOperation">
            <option v-for="op in BM_OPERATIONS" :key="op.value" :value="op.value">{{ op.label }}</option>
          </select>
        </div>

        <div class="bm-content">
          <!-- ── Tạo BM ── -->
          <template v-if="form.bm.selectedOperation === 'createBM'">
            <div class="gbox"><div class="gbox-header">Tạo Business Manager</div><div class="gbox-body">
              <div class="cf-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBM.nameBMEnabled" /><span>Tên BM</span></label>
                <input type="text" class="form-input" v-model="form.bm.createBM.nameBM" :disabled="!form.bm.createBM.nameBMEnabled" placeholder="Nhập tên BM..." />
              </div>
              <div class="cf-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBM.getLinkEnabled" /><span>Get link mời</span></label>
                <div v-if="form.bm.createBM.getLinkEnabled" class="cf-sub-fields">
                  <div class="cf-row-2col">
                    <div class="cf-inline"><span class="form-label">Số lượng:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createBM.getLinkQuantity" min="1" /></div>
                    <div class="cf-inline"><span class="form-label">Thời gian nghỉ:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createBM.getLinkDelay" min="0" /></div>
                  </div>
                  <div class="cf-row-2col">
                    <div class="cf-inline"><span class="form-label">Số link/ BM:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createBM.getLinkPerBM" min="1" /></div>
                    <div class="cf-inline"><span class="form-label">Mail:</span><input type="text" class="form-input" v-model="form.bm.createBM.getLinkMailType" placeholder="Loại mail..." /></div>
                  </div>
                </div>
              </div>
              <div class="cf-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBM.createTKQCEnabled" /><span>Tạo tài khoản quảng cáo</span></label>
                <div v-if="form.bm.createBM.createTKQCEnabled" class="cf-sub-fields">
                  <div class="cf-inline"><label class="chk-item"><input type="checkbox" v-model="form.bm.createBM.createTKQCNameEnabled" /><span>Tên</span></label><input type="text" class="form-input" v-model="form.bm.createBM.createTKQCName" :disabled="!form.bm.createBM.createTKQCNameEnabled" /></div>
                  <div class="cf-row-3col">
                    <div class="cf-inline"><span class="form-label">Quốc gia:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.createBM.createTKQCCountry" /></div>
                    <div class="cf-inline"><span class="form-label">Múi giờ:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.createBM.createTKQCTimeZone" /></div>
                    <div class="cf-inline"><span class="form-label">Tiền tệ:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.createBM.createTKQCCurrency" /></div>
                  </div>
                  <div class="cf-inline"><span class="form-label">Số lượng:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createBM.createTKQCQuantity" min="1" /></div>
                </div>
              </div>
              <div class="tut-chk-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBM.sharePartnerEnabled" /><span>Share đối tác</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBM.getBMLive" /><span>Chỉ Lấy BM Live</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBM.kickLimitOnly" /><span>Kick limit only</span></label>
              </div>
              <div v-if="form.bm.createBM.sharePartnerEnabled" class="cf-sub">
                <span class="cf-count">ID đối tác ({{ form.bm.createBM.sharePartnerUids.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('ID đối tác', form.bm.createBM.sharePartnerUids, ids => form.bm.createBM.sharePartnerUids = ids)">Chọn</button>
              </div>
            </div></div>
          </template>

          <!-- ── Lấy link mời ── -->
          <template v-else-if="form.bm.selectedOperation === 'getLinkBM'">
            <div class="gbox"><div class="gbox-header">Get link BM</div><div class="gbox-body">
              <div class="form-row"><span class="form-label">Cấu hình:</span>
                <select class="form-select" v-model="form.bm.getLinkBM.config"><option value="all">Toàn bộ</option><option value="byId">Theo ID BM chỉ định</option></select>
              </div>
              <div v-if="form.bm.getLinkBM.config === 'byId'" class="cf-sub">
                <span class="cf-count">ID chỉ định ({{ form.bm.getLinkBM.bmIds.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Danh sách ID BM', form.bm.getLinkBM.bmIds, ids => form.bm.getLinkBM.bmIds = ids)">Chọn</button>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">BM:</span><input type="text" class="form-input" v-model="form.bm.getLinkBM.typeBM" placeholder="Loại BM..." /></div>
                <div class="form-row"><span class="form-label">Dạng tài khoản:</span><input type="text" class="form-input" v-model="form.bm.getLinkBM.typeTKQC" placeholder="Loại TKQC..." /></div>
              </div>
              <div class="tut-chk-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.getLinkBM.statusBMLive" /><span>Chỉ lấy BM Live</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.bm.getLinkBM.typeTKQCLive" /><span>Chỉ lấy tài khoản Live</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.bm.getLinkBM.kickLimit" /><span>Kick limit only</span></label>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Số lượng:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.getLinkBM.quantity" min="1" /></div>
                <div class="form-row"><span class="form-label">Thời gian nghỉ:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.getLinkBM.delay" min="0" /></div>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Link/ BM:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.getLinkBM.linkPerBM" min="1" /></div>
                <div class="form-row"><span class="form-label">Dừng khi lỗi:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.getLinkBM.failStop" min="1" /></div>
              </div>
              <div class="form-row"><span class="form-label">Mail backup:</span><input type="text" class="form-input" v-model="form.bm.getLinkBM.mailBackup" /></div>
            </div></div>
          </template>

          <!-- ── Nhận BM ── -->
          <template v-else-if="form.bm.selectedOperation === 'receiveBM'">
            <div class="gbox"><div class="gbox-header">Nhận BM</div><div class="gbox-body">
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Họ:</span><input type="text" class="form-input" v-model="form.bm.receiveBM.lastName" /></div>
                <div class="form-row"><span class="form-label">Tên:</span><input type="text" class="form-input" v-model="form.bm.receiveBM.firstName" /></div>
              </div>
              <div class="cf-sub">
                <span class="cf-count">Link nhận ({{ form.bm.receiveBM.links.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Link nhận BM', form.bm.receiveBM.links, ids => form.bm.receiveBM.links = ids)">Chọn</button>
              </div>
              <div class="cf-row-3col">
                <div class="form-row"><span class="form-label">Giới hạn BM/ TK:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.receiveBM.limitDone" min="0" /></div>
                <div class="form-row"><span class="form-label">Dừng khi thất bại:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.receiveBM.limitFail" min="0" /></div>
                <div class="form-row"><span class="form-label">Thời gian nghỉ:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.receiveBM.delay" min="0" /></div>
              </div>
              <label class="chk-item"><input type="checkbox" v-model="form.bm.receiveBM.checkAfterReceive" /><span>Kiểm tra BM sau khi nhận</span></label>
            </div></div>
          </template>

          <!-- ── Tạo TKQC ── -->
          <template v-else-if="form.bm.selectedOperation === 'createTKQC'">
            <div class="gbox"><div class="gbox-header">Tạo tài khoản quảng cáo</div><div class="gbox-body">
              <!-- Row 1: Cấu hình + BM + 2500 -->
              <div class="cf-row-3col-auto">
                <div class="form-row"><span class="form-label">Cấu hình:</span>
                  <select class="form-select" v-model="form.bm.createTKQC.config"><option value="all">Toàn bộ</option><option value="byId">Theo ID BM chỉ định</option></select>
                </div>
                <div class="form-row"><span class="form-label">BM:</span><input type="text" class="form-input" v-model="form.bm.createTKQC.typeBM" placeholder="Loại BM..." /></div>
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createTKQC.is2500" /><span>2500</span></label>
              </div>
              <div v-if="form.bm.createTKQC.config === 'byId'" class="cf-sub">
                <span class="cf-count">ID BM chỉ định ({{ form.bm.createTKQC.bmIds.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('ID BM chỉ định', form.bm.createTKQC.bmIds, ids => form.bm.createTKQC.bmIds = ids)">Chọn</button>
              </div>
              <!-- Row 2: Số luồng + Thời gian nghỉ -->
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Số luồng/ BM:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createTKQC.threadPerBM" min="1" /></div>
                <div class="form-row"><span class="form-label">Thời gian nghỉ:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createTKQC.delay" min="0" /></div>
              </div>
              <!-- Nested GroupBox: Tài khoản quảng cáo / BM -->
              <div class="gbox">
                <div class="gbox-header">
                  <label class="chk-item"><input type="checkbox" v-model="form.bm.createTKQC.createTKQCEnabled" /><span>Tạo tài khoản quảng cáo</span></label>
                  <span style="margin-left: auto;" class="form-label">TKQC/ BM:</span>
                  <input type="number" class="form-input form-input--xs" v-model.number="form.bm.createTKQC.tkqcPerBM" min="1" style="width: 50px;" />
                </div>
                <div v-if="form.bm.createTKQC.createTKQCEnabled" class="gbox-body">
                  <div class="cf-inline"><label class="chk-item"><input type="checkbox" v-model="form.bm.createTKQC.nameEnabled" /><span>Tên</span></label><input type="text" class="form-input" v-model="form.bm.createTKQC.name" :disabled="!form.bm.createTKQC.nameEnabled" /></div>
                  <div class="cf-row-3col">
                    <div class="cf-inline"><span class="form-label">Quốc gia:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.createTKQC.country" /></div>
                    <div class="cf-inline"><span class="form-label">Tiền tệ:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.createTKQC.currency" /></div>
                    <div class="cf-inline"><span class="form-label">Múi giờ:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.createTKQC.timeZone" /></div>
                  </div>
                </div>
              </div>
              <!-- Đổi tên BM -->
              <div class="cf-inline">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createTKQC.renameBMEnabled" /><span>Đổi tên BM</span></label>
                <input v-if="form.bm.createTKQC.renameBMEnabled" type="text" class="form-input" v-model="form.bm.createTKQC.renameBM" placeholder="Tên BM mới..." />
              </div>
              <!-- Get link mời -->
              <div class="cf-inline">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createTKQC.getLinkEnabled" /><span>Get link mời</span></label>
                <template v-if="form.bm.createTKQC.getLinkEnabled">
                  <span class="form-label">Số link/ BM:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createTKQC.linkPerBM" min="1" />
                </template>
              </div>
              <!-- Share đối tác -->
              <div class="cf-inline">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createTKQC.sharePartnerEnabled" /><span>Share đối tác</span></label>
                <template v-if="form.bm.createTKQC.sharePartnerEnabled">
                  <span class="cf-count">ID đối tác ({{ form.bm.createTKQC.sharePartnerUids.length }}):</span>
                  <button class="btn-sm" @click="openIdEditor('ID đối tác', form.bm.createTKQC.sharePartnerUids, ids => form.bm.createTKQC.sharePartnerUids = ids)">Chọn</button>
                </template>
              </div>
            </div></div>
          </template>

          <!-- ── Đổi thông tin & Share đối tác ── -->
          <template v-else-if="form.bm.selectedOperation === 'changeBMShare'">
            <div class="gbox"><div class="gbox-header">Đổi thông tin và share đối tác</div><div class="gbox-body">
              <!-- Row 1: Cấu hình -->
              <div class="form-row"><span class="form-label">Cấu hình:</span>
                <select class="form-select" v-model="form.bm.changeBMShare.configMode"><option value="all">Tất cả</option><option value="byId">Theo ID BM chỉ định</option></select>
              </div>
              <!-- Row 2: BM -->
              <div class="form-row"><span class="form-label">BM:</span><input type="text" class="form-input" v-model="form.bm.changeBMShare.typeBM" placeholder="Loại BM..." /></div>
              <!-- Đổi tên BM (same row as checkbox + input) -->
              <div class="cf-inline">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.changeBMShare.renameBMEnabled" /><span>Đổi tên BM</span></label>
                <input v-if="form.bm.changeBMShare.renameBMEnabled" type="text" class="form-input" v-model="form.bm.changeBMShare.renameBMName" placeholder="Tên BM mới..." />
              </div>
              <!-- Nested GroupBox: Đổi thông tin tài khoản quảng cáo -->
              <div class="gbox">
                <div class="gbox-header">
                  <label class="chk-item"><input type="checkbox" v-model="form.bm.changeBMShare.changeNameTKQCEnabled" /><span>Đổi thông tin tài khoản quảng cáo</span></label>
                </div>
                <div v-if="form.bm.changeBMShare.changeNameTKQCEnabled" class="gbox-body">
                  <div class="cf-inline"><label class="chk-item"><input type="checkbox" /><span>Tên</span></label><input type="text" class="form-input" v-model="form.bm.changeBMShare.changeNameTKQC" placeholder="Tên TKQC..." /></div>
                  <div class="cf-row-3col">
                    <div class="cf-inline"><span class="form-label">Quốc gia:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.changeBMShare.country" /></div>
                    <div class="cf-inline"><span class="form-label">Tiền tệ:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.changeBMShare.currency" /></div>
                    <div class="cf-inline"><span class="form-label">Múi giờ:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.changeBMShare.timeZone" /></div>
                  </div>
                </div>
              </div>
              <!-- ID lists row -->
              <div class="cf-inline">
                <span class="cf-count">Danh sách ID BM ({{ form.bm.changeBMShare.bmIds.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Danh sách ID BM chỉ định', form.bm.changeBMShare.bmIds, ids => form.bm.changeBMShare.bmIds = ids)">Chọn</button>
                <label class="chk-item" style="margin-left: 16px;"><input type="checkbox" v-model="form.bm.changeBMShare.changeTKQCByIdEnabled" /><span>Theo ID TKQC chỉ định</span></label>
                <template v-if="form.bm.changeBMShare.changeTKQCByIdEnabled">
                  <span class="cf-count">ID TKQC ({{ form.bm.changeBMShare.tkqcIds.length }}):</span>
                  <button class="btn-sm" @click="openIdEditor('ID TKQC chỉ định', form.bm.changeBMShare.tkqcIds, ids => form.bm.changeBMShare.tkqcIds = ids)">Chọn</button>
                </template>
              </div>
              <!-- Get link mời -->
              <div class="cf-inline">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.changeBMShare.getLinkEnabled" /><span>Get link mời</span></label>
                <template v-if="form.bm.changeBMShare.getLinkEnabled">
                  <span class="form-label">Số link/ BM:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.changeBMShare.linkPerBM" min="1" />
                </template>
              </div>
              <!-- Share đối tác -->
              <div class="cf-inline">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.changeBMShare.sharePartnerEnabled" /><span>Share đối tác</span></label>
                <template v-if="form.bm.changeBMShare.sharePartnerEnabled">
                  <span class="cf-count">ID đối tác ({{ form.bm.changeBMShare.sharePartnerUids.length }}):</span>
                  <button class="btn-sm" @click="openIdEditor('ID đối tác', form.bm.changeBMShare.sharePartnerUids, ids => form.bm.changeBMShare.sharePartnerUids = ids)">Chọn</button>
                </template>
              </div>
            </div></div>
          </template>

          <!-- ── Kiểm tra BM ── -->
          <template v-else-if="form.bm.selectedOperation === 'checkBM'">
            <div class="gbox"><div class="gbox-header">Kiểm tra thông tin Business Manager</div><div class="gbox-body">
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Cấu hình:</span>
                  <select class="form-select" v-model="form.bm.checkBM.config"><option value="all">Toàn bộ</option><option value="byId">Theo ID BM chỉ định</option></select>
                </div>
                <div class="form-row"><span class="form-label">Loại:</span><input type="text" class="form-input" v-model="form.bm.checkBM.typeBM" placeholder="Loại BM..." /></div>
              </div>
              <div v-if="form.bm.checkBM.config === 'byId'" class="cf-sub">
                <span class="cf-count">Danh sách ID BM ({{ form.bm.checkBM.bmIds.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Danh sách ID BM', form.bm.checkBM.bmIds, ids => form.bm.checkBM.bmIds = ids)">Chọn</button>
              </div>
              <div class="form-row"><span class="form-label">Thời gian nghỉ:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.checkBM.delay" min="0" /></div>
              <div class="tut-chk-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.checkBM.switchModeIG" /><span>Chuyển chế độ IG</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.bm.checkBM.kickLimit" /><span>Kích limit</span></label>
              </div>
            </div></div>
          </template>

          <!-- ── Thoát BM ── -->
          <template v-else-if="form.bm.selectedOperation === 'outBM'">
            <div class="gbox"><div class="gbox-header">Thoát BM</div><div class="gbox-body">
              <div class="form-row"><span class="form-label">Cấu hình:</span>
                <select class="form-select" v-model="form.bm.outBM.config"><option value="all">Toàn bộ</option><option value="byId">Theo ID BM chỉ định</option></select>
              </div>
              <div v-if="form.bm.outBM.config === 'byId'" class="cf-sub">
                <span class="cf-count">Danh sách ID BM ({{ form.bm.outBM.bmIds.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Danh sách ID BM', form.bm.outBM.bmIds, ids => form.bm.outBM.bmIds = ids)">Chọn</button>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Dạng BM:</span><input type="text" class="form-input" v-model="form.bm.outBM.typeBM" placeholder="Loại BM..." /></div>
                <div class="form-row"><span class="form-label">Dạng tài khoản:</span><input type="text" class="form-input" v-model="form.bm.outBM.typeTKQC" placeholder="Loại TKQC..." /></div>
              </div>
              <div class="cf-row-2col">
                <div class="cf-inline">
                  <span class="form-label">Thoát BM:</span>
                  <label class="chk-item"><input type="checkbox" v-model="form.bm.outBM.outBMLive" /><span>Live</span></label>
                  <label class="chk-item"><input type="checkbox" v-model="form.bm.outBM.outBMDie" /><span>Die</span></label>
                </div>
                <div class="cf-inline">
                  <span class="form-label">Thoát TK:</span>
                  <label class="chk-item"><input type="checkbox" v-model="form.bm.outBM.outTKQCLive" /><span>Live</span></label>
                  <label class="chk-item"><input type="checkbox" v-model="form.bm.outBM.outTKQCDie" /><span>Die</span></label>
                </div>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Dừng khi lỗi:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.outBM.failStop" min="1" /></div>
                <div class="form-row"><span class="form-label">Thời gian nghỉ:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.outBM.delay" min="0" /></div>
              </div>
            </div></div>
          </template>

          <!-- ── Kháng BM ── -->
          <template v-else-if="form.bm.selectedOperation === 'resBM'">
            <div class="gbox"><div class="gbox-header">Kháng BM</div><div class="gbox-body">
              <div class="form-row"><span class="form-label">Nguồn:</span>
                <select class="form-select" v-model="form.bm.resBM.configMode"><option value="all">Tất cả</option><option value="byId">Theo ID chỉ định</option></select>
              </div>
              <div class="form-row"><span class="form-label">BM:</span><input type="text" class="form-input" v-model="form.bm.resBM.typeBM" placeholder="Loại BM..." /></div>
              <div v-if="form.bm.resBM.configMode === 'byId'" class="cf-sub">
                <span class="cf-count">Danh sách ID BM ({{ form.bm.resBM.bmIds.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Danh sách ID BM', form.bm.resBM.bmIds, ids => form.bm.resBM.bmIds = ids)">Chọn</button>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">BM kháng/ tài khoản:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.resBM.quantity" min="1" /></div>
                <div class="form-row"><span class="form-label">Thời gian nghỉ:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.resBM.delay" min="0" /></div>
              </div>
              <div class="tut-chk-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.resBM.hasCreated" /><span>Đã tạo tài khoản</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.bm.resBM.hasNotCreated" /><span>Chưa tạo tài khoản</span></label>
              </div>
            </div></div>
          </template>

          <!-- ── Tạo BM TUT ── -->
          <template v-else-if="form.bm.selectedOperation === 'createBMTUT'">
            <div class="gbox"><div class="gbox-header">Tạo Business Manager (TUT)</div><div class="gbox-body">
              <div class="cf-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBMTUT.nameBMEnabled" /><span>Tên BM</span></label>
                <input type="text" class="form-input" v-model="form.bm.createBMTUT.nameBM" :disabled="!form.bm.createBMTUT.nameBMEnabled" placeholder="Nhập tên BM..." />
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Số lượng:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createBMTUT.quantity" min="1" /></div>
                <div class="form-row"><span class="form-label">Thời gian nghỉ:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createBMTUT.delay" min="0" /></div>
              </div>
              <div class="cf-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBMTUT.getLinkEnabled" /><span>Get link mời</span></label>
                <div v-if="form.bm.createBMTUT.getLinkEnabled" class="cf-sub-fields">
                  <div class="cf-inline"><span class="form-label">Số link/ BM:</span><input type="number" class="form-input form-input--xs" v-model.number="form.bm.createBMTUT.getLinkPerBM" min="1" /></div>
                  <div class="cf-inline"><span class="form-label">Mail:</span><input type="text" class="form-input" v-model="form.bm.createBMTUT.getLinkMailType" /></div>
                </div>
              </div>
              <div class="cf-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBMTUT.createTKQCEnabled" /><span>Tạo tài khoản quảng cáo</span></label>
                <div v-if="form.bm.createBMTUT.createTKQCEnabled" class="cf-sub-fields">
                  <div class="cf-inline"><label class="chk-item"><input type="checkbox" v-model="form.bm.createBMTUT.createTKQCNameEnabled" /><span>Tên</span></label><input type="text" class="form-input" v-model="form.bm.createBMTUT.createTKQCName" :disabled="!form.bm.createBMTUT.createTKQCNameEnabled" /></div>
                  <div class="cf-row-3col">
                    <div class="cf-inline"><span class="form-label">Quốc gia:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.createBMTUT.createTKQCCountry" /></div>
                    <div class="cf-inline"><span class="form-label">Múi giờ:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.createBMTUT.createTKQCTimeZone" /></div>
                    <div class="cf-inline"><span class="form-label">Tiền tệ:</span><input type="text" class="form-input form-input--sm" v-model="form.bm.createBMTUT.createTKQCCurrency" /></div>
                  </div>
                </div>
              </div>
              <div class="cf-row">
                <label class="chk-item"><input type="checkbox" v-model="form.bm.createBMTUT.sharePartnerEnabled" /><span>Share đối tác</span></label>
                <div v-if="form.bm.createBMTUT.sharePartnerEnabled" class="cf-sub">
                  <span class="cf-count">ID đối tác ({{ form.bm.createBMTUT.sharePartnerUids.length }}):</span>
                  <button class="btn-sm" @click="openIdEditor('ID đối tác', form.bm.createBMTUT.sharePartnerUids, ids => form.bm.createBMTUT.sharePartnerUids = ids)">Chọn</button>
                </div>
              </div>
            </div></div>
          </template>

          <!-- ── Tạo BM xác minh DN ── -->
          <template v-else-if="form.bm.selectedOperation === 'createBMVerification'">
            <div class="gbox"><div class="gbox-header">Tạo BM xác minh doanh nghiệp</div><div class="gbox-body">
              <div class="form-row"><span class="form-label">Cấu hình:</span>
                <select class="form-select" v-model="form.bm.createBMVerification.config"><option value="all">Toàn bộ</option><option value="byId">Theo ID BM chỉ định</option></select>
              </div>
              <div v-if="form.bm.createBMVerification.config === 'byId'" class="cf-sub">
                <span class="cf-count">Danh sách ID BM ({{ form.bm.createBMVerification.bmIds.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Danh sách ID BM', form.bm.createBMVerification.bmIds, ids => form.bm.createBMVerification.bmIds = ids)">Chọn</button>
              </div>
              <div class="cf-sub">
                <span class="cf-count">Danh sách doanh nghiệp ({{ form.bm.createBMVerification.businessList.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Danh sách doanh nghiệp', form.bm.createBMVerification.businessList, ids => form.bm.createBMVerification.businessList = ids)">Chọn</button>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Quốc gia:</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.country" /></div>
                <div class="form-row"><span class="form-label">Tên pháp lí của doanh nghiệp:</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.legalName" /></div>
              </div>
              <div class="form-row"><span class="form-label">Địa chỉ:</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.address1" /></div>
              <div class="form-row"><span class="form-label">Địa chỉ (dòng 2):</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.address2" /></div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Tỉnh/Thành phố:</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.city" /></div>
                <div class="form-row"><span class="form-label">Tiểu bang/tỉnh/khu vực:</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.state" /></div>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Mã zip/Mã bưu chính:</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.zipCode" /></div>
                <div class="form-row"><span class="form-label">Mã số thuế:</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.taxId" /></div>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Trang web doanh nghiệp:</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.website" /></div>
                <div class="form-row"><span class="form-label">Số điện thoại của doanh nghiệp:</span><input type="text" class="form-input" v-model="form.bm.createBMVerification.phone" /></div>
              </div>
            </div></div>
          </template>
        </div>
      </div>

      <!-- ═══ TAB 03: Page ═══ -->
      <div v-else-if="activeTab === '03'" class="tab-panel">
        <div class="gbox">
          <div class="gbox-header">Tương tác Page</div>
          <div class="gbox-body">
            <label class="chk-item"><input type="checkbox" v-model="form.page.likePage" /><span>Like Page</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.page.sharePage" /><span>Share Page</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.page.commentPage" /><span>Comment Page</span></label>
          </div>
        </div>
      </div>

      <!-- ═══ TAB 04: Share TKQC ═══ -->
      <div v-else-if="activeTab === '04'" class="tab-panel">
        <div class="gbox">
          <div class="gbox-header">Share tài khoản quảng cáo</div>
          <div class="gbox-body">
            <div class="form-row"><span class="form-label">Số lượng TKQC / BM</span><input type="number" class="form-input form-input--sm" v-model.number="form.shareTKQC.quantityPerBM" min="0" /></div>
            <div class="form-row"><span class="form-label">UID nhận share</span><input type="text" class="form-input" v-model="form.shareTKQC.receiverUid" placeholder="Nhập UID..." /></div>
            <div class="form-row"><span class="form-label">Loại BM</span><input type="text" class="form-input" v-model="form.shareTKQC.bmType" placeholder="Loại BM..." /></div>
            <div class="form-row"><span class="form-label">Loại mail</span><input type="text" class="form-input" v-model="form.shareTKQC.mailType" placeholder="Loại mail..." /></div>
            <label class="chk-item"><input type="checkbox" v-model="form.shareTKQC.shareBySpecificUid" /><span>Share theo UID chỉ định</span></label>
          </div>
        </div>
      </div>

      <!-- ═══ TAB 05: Lên camp && Add thẻ ═══ -->
      <div v-else-if="activeTab === '05'" class="tab-panel">
        <div class="gbox">
          <div class="gbox-header">Tạo chiến dịch</div>
          <div class="gbox-body">
            <div class="form-row"><span class="form-label">Tên chiến dịch</span><input type="text" class="form-input" v-model="form.campaign.campaignName" placeholder="Nhập tên..." /></div>
            <div class="form-row"><span class="form-label">Ngân sách</span><input type="number" class="form-input form-input--sm" v-model.number="form.campaign.budget" min="0" /></div>
            <div class="form-row"><span class="form-label">Targeting</span><input type="text" class="form-input" v-model="form.campaign.targeting" placeholder="Nhập targeting..." /></div>
            <label class="chk-item"><input type="checkbox" v-model="form.campaign.addCard" /><span>Thêm thẻ thanh toán</span></label>
          </div>
        </div>
      </div>

      <!-- ═══ TAB 06: Tương tác kịch bản (Clone Farming) ═══ -->
      <div v-else-if="activeTab === '06'" class="tab-panel">
        <!-- Quản lý bạn bè -->
        <div class="gbox">
          <div class="gbox-header">Quản lý bạn bè</div>
          <div class="gbox-body">
            <div class="cf-row">
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.addFriendEnabled" /><span>Gửi lời mời kết bạn theo UID</span></label>
              <div class="cf-sub">
                <span class="cf-count">ID gửi lời mời chỉ định ({{ form.cloneFarming.addFriendUids.length }}):</span>
                <button class="btn-sm" @click="openAddFriendEditor">Chọn</button>
              </div>
            </div>
            <div class="cf-row">
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.acceptFriendEnabled" /><span>Chấp nhận lời mời kết bạn theo UID</span></label>
              <div class="cf-sub">
                <span class="cf-count">ID xác nhận chỉ định ({{ form.cloneFarming.acceptFriendUids.length }}):</span>
                <button class="btn-sm" @click="openAcceptFriendEditor">Chọn</button>
              </div>
            </div>
            <div class="tut-chk-row">
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.unlockDisableEnabled" /><span>Mở vô hiệu hóa TK</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.disableEnabled" /><span>Vô hiệu hóa TK</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.disablePermanentEnabled" /><span>Vô hiệu hóa TK Vĩnh Viễn</span></label>
            </div>
          </div>
        </div>

        <!-- Quét thư viện quảng cáo -->
        <div class="gbox">
          <div class="gbox-header">Quét thư viện quảng cáo</div>
          <div class="gbox-body">
            <div class="cf-row">
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.scanPageInAdLibraryEnabled" /><span>Quét ID Page trong thư viện quảng cáo</span></label>
              <div class="cf-sub">
                <span class="form-label">Từ khóa:</span>
                <input type="text" class="form-input" v-model="form.cloneFarming.scanPageKeywords" placeholder="Nhập từ khóa..." />
              </div>
            </div>
            <div class="cf-row">
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.scanAdLibraryEnabled" /><span>Quét thư viện quảng cáo của trang</span></label>
              <div class="cf-sub">
                <span class="cf-count">ID Page ({{ form.cloneFarming.scanAdLibraryPageIds.length }}):</span>
                <button class="btn-sm" @click="openScanPageEditor">Chọn</button>
                <span class="form-label" style="margin-left: 12px;">Số page / ID:</span>
                <input type="number" class="form-input form-input--xs" v-model.number="form.cloneFarming.scanAdLibraryPagesPerThread" min="1" />
              </div>
            </div>
          </div>
        </div>

        <!-- Kick TKQC 250 -->
        <div class="gbox">
          <div class="gbox-header">Kick TKQC 250</div>
          <div class="gbox-body">
            <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.kick250Enabled" /><span>Kick TKCN 250</span></label>
            <div class="cf-inline">
              <span class="form-label">Số lần đóng TKQC:</span>
              <input type="number" class="form-input form-input--xs" v-model.number="form.cloneFarming.kick250CloseCount" min="1" />
            </div>
            <div class="cf-inline">
              <span class="form-label">Delay mỗi lần:</span>
              <input type="number" class="form-input form-input--xs" v-model.number="form.cloneFarming.kick250DelayFrom" min="0" />
              <span>—</span>
              <input type="number" class="form-input form-input--xs" v-model.number="form.cloneFarming.kick250DelayTo" min="0" />
              <span class="form-hint">giây</span>
            </div>
            <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.kickBM3Enabled" /><span>Kick BM3</span></label>
          </div>
        </div>

        <!-- TUT & Kiểm tra -->
        <div class="cf-row-2col">
          <div class="gbox">
            <div class="gbox-header">TUT</div>
            <div class="gbox-body">
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.tutInMoneyEnabled" /><span>Tut In Tiền</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.tutInMoneyV2Enabled" /><span>Tut In Tiền v2.0</span></label>
              <div class="cf-inline">
                <span class="form-label">ID bài viết:</span>
                <input type="text" class="form-input" v-model="form.cloneFarming.postId" placeholder="Nhập ID..." />
              </div>
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.addBtnEnabled" /><span>Add btn</span></label>
            </div>
          </div>
          <div class="gbox">
            <div class="gbox-header">Kiểm tra</div>
            <div class="gbox-body">
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.checkPassFBEnabled" /><span>Pass FB</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.cloneFarming.checkMailFBEnabled" /><span>Mail liên kết</span></label>
            </div>
          </div>
        </div>

        <!-- UID editors (Tab 06) -->
        <teleport to="body">
          <div v-if="showAddFriendEditor" class="overlay" @click.self="showAddFriendEditor = false">
            <div class="mini-modal">
              <div class="mini-modal-header">ID gửi lời mời kết bạn</div>
              <textarea class="mini-modal-textarea" v-model="addFriendText" placeholder="Nhập mỗi UID một dòng..." rows="8"></textarea>
              <div class="mini-modal-footer">
                <button class="btn-sm btn-sm--primary" @click="saveAddFriendUids">Lưu</button>
                <button class="btn-sm" @click="showAddFriendEditor = false">Đóng</button>
              </div>
            </div>
          </div>
          <div v-if="showAcceptFriendEditor" class="overlay" @click.self="showAcceptFriendEditor = false">
            <div class="mini-modal">
              <div class="mini-modal-header">ID xác nhận kết bạn</div>
              <textarea class="mini-modal-textarea" v-model="acceptFriendText" placeholder="Nhập mỗi UID một dòng..." rows="8"></textarea>
              <div class="mini-modal-footer">
                <button class="btn-sm btn-sm--primary" @click="saveAcceptFriendUids">Lưu</button>
                <button class="btn-sm" @click="showAcceptFriendEditor = false">Đóng</button>
              </div>
            </div>
          </div>
          <div v-if="showScanPageEditor" class="overlay" @click.self="showScanPageEditor = false">
            <div class="mini-modal">
              <div class="mini-modal-header">ID Page quảng cáo</div>
              <textarea class="mini-modal-textarea" v-model="scanPageText" placeholder="Nhập mỗi ID một dòng..." rows="8"></textarea>
              <div class="mini-modal-footer">
                <button class="btn-sm btn-sm--primary" @click="saveScanPageIds">Lưu</button>
                <button class="btn-sm" @click="showScanPageEditor = false">Đóng</button>
              </div>
            </div>
          </div>
        </teleport>
      </div>

      <!-- ═══ TAB 07: Cập nhật thông tin ═══ -->
      <div v-else-if="activeTab === '07'" class="tab-panel">
        <div class="gbox">
          <div class="gbox-header">Cập nhật thông tin tài khoản</div>
          <div class="gbox-body gbox-body--grid">
            <label class="chk-item"><input type="checkbox" v-model="form.updateInfo.updateName" /><span>Đổi tên</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.updateInfo.updateAvatar" /><span>Đổi ảnh đại diện</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.updateInfo.updateCover" /><span>Đổi ảnh bìa</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.updateInfo.updateBio" /><span>Đổi tiểu sử</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.updateInfo.updateBirthday" /><span>Đổi ngày sinh</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.updateInfo.updateLocation" /><span>Đổi vị trí</span></label>
          </div>
        </div>
      </div>

      <!-- ═══ TAB 08: Gỡ checkpoint ═══ -->
      <div v-else-if="activeTab === '08'" class="tab-panel">
        <div class="gbox">
          <div class="gbox-header">Cấu hình gỡ checkpoint</div>
          <div class="gbox-body">
            <div class="form-row"><span class="form-label">Loại checkpoint</span><input type="text" class="form-input" v-model="form.checkpoint.cpType" placeholder="Loại CP..." /></div>
            <div class="form-row"><span class="form-label">Phương thức</span><input type="text" class="form-input" v-model="form.checkpoint.method" placeholder="Phương thức..." /></div>
            <div class="form-row"><span class="form-label">Delay (giây)</span><input type="number" class="form-input form-input--sm" v-model.number="form.checkpoint.delay" min="0" /></div>
          </div>
        </div>
      </div>

      <!-- ═══ TAB 09: Kháng tài khoản ═══ -->
      <div v-else-if="activeTab === '09'" class="tab-panel">
        <div class="gbox">
          <div class="gbox-header">Kháng tài khoản</div>
          <div class="gbox-body gbox-body--grid">
            <label class="chk-item"><input type="checkbox" v-model="form.accountResist.appeal" /><span>Kháng nghị (Appeal)</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.accountResist.verifyIdentity" /><span>Xác minh danh tính</span></label>
          </div>
        </div>
      </div>

      <!-- ═══ TAB 10: Cá nhân (TUT Premium) ═══ -->
      <div v-else-if="activeTab === '10'" class="tab-panel">
        <!-- Radio navigation 7 TUT types -->
        <div class="gbox">
          <div class="gbox-header">Loại TUT</div>
          <div class="gbox-body tut-radio-group">
            <label v-for="t in TUT_TYPES" :key="t.value" class="radio-item">
              <input type="radio" :value="t.value" v-model="form.tutPremium.selectedType" name="tutType" />
              <span>{{ t.label }}</span>
            </label>
          </div>
        </div>

        <!-- TUT 01: Tạo VH TKQC trong BM -->
        <template v-if="form.tutPremium.selectedType === 'regAdAccountBM'">
          <div class="gbox"><div class="gbox-header">Tạo VH TKQC trong BM</div><div class="gbox-body">
            <div class="tut-chk-row">
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.regAdAccountBM.unlimitedAccount1" /><span>Tạo vô hạn dòng 1</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.regAdAccountBM.unlimitedAccount3" /><span>Tạo vô hạn nhóm tài sản</span></label>
            </div>
            <div class="cf-row-2col">
              <div class="form-row"><span class="form-label">Tạo tên TKQC</span><input type="text" class="form-input" v-model="form.tutPremium.regAdAccountBM.name" /></div>
              <div class="form-row"><span class="form-label">Tạo tên nhóm TKQC</span><input type="text" class="form-input" v-model="form.tutPremium.regAdAccountBM.nameGroup" /></div>
            </div>
            <div class="cf-row-2col">
              <div class="form-row"><span class="form-label">Số lượng TKQC / nhóm</span><input type="number" class="form-input form-input--sm" v-model.number="form.tutPremium.regAdAccountBM.quantity" min="1" /></div>
              <div class="form-row"><span class="form-label">Cấu hình TUT dòng 1</span>
                <select class="form-select" v-model.number="form.tutPremium.regAdAccountBM.account1Config">
                  <option v-for="o in TUT_ACCOUNT1_CONFIG_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
                </select>
              </div>
            </div>
            <div class="cf-sub">
              <span class="cf-count">Danh sách BM tạo VH ({{ form.tutPremium.regAdAccountBM.bmListIds.length }}):</span>
              <button class="btn-sm" @click="openIdEditor('Danh sách BM tạo VH', form.tutPremium.regAdAccountBM.bmListIds, ids => form.tutPremium.regAdAccountBM.bmListIds = ids)">Chọn</button>
            </div>
          </div></div>
        </template>

        <!-- TUT 02: Tách vô hạn -->
        <template v-else-if="form.tutPremium.selectedType === 'divideAdAccount'">
          <div class="gbox"><div class="gbox-header">Tách vô hạn</div><div class="gbox-body">
            <div class="tut-chk-row">
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.divide.typeAccount1" /><span>Tách vô hạn dòng 1</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.divide.typeAccount2" /><span>Tách TKQC ẩn && BM</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.divide.typeAccount3" /><span>Tách TKQC trong nhóm tài sản</span></label>
            </div>
            <div class="form-row"><span class="form-label">Tạo tên TKQC</span><input type="text" class="form-input" v-model="form.tutPremium.divide.name" /></div>
            <div class="cf-row-2col">
              <div class="form-row"><span class="form-label">Số lượng TKQC tách / lần</span><input type="number" class="form-input form-input--sm" v-model.number="form.tutPremium.divide.quantity" min="1" /></div>
              <div class="form-row"><span class="form-label">Delay (giây)</span><input type="number" class="form-input form-input--sm" v-model.number="form.tutPremium.divide.delay" min="0" /></div>
            </div>
            <div class="tut-chk-row">
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.divide.persist" /><span>Nhớ ID BM lần sau lấy chạy trùng</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.divide.reOpenRepeat" /><span>Mở lại TK cá bị đóng trước khi dừng</span></label>
            </div>
            <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.divide.outBM" /><span>Thoát BM ngay sau khi mở xong</span></label>
            <div class="cf-sub">
              <span class="cf-count">Danh sách BM tách ({{ form.tutPremium.divide.bmListIds.length }}):</span>
              <button class="btn-sm" @click="openIdEditor('Danh sách BM tách', form.tutPremium.divide.bmListIds, ids => form.tutPremium.divide.bmListIds = ids)">Chọn</button>
            </div>
          </div></div>
        </template>

        <!-- TUT 03: Nolimit 250 -->
        <template v-else-if="form.tutPremium.selectedType === 'nolimit250'">
          <!-- Cấu hình chung -->
          <div class="gbox"><div class="gbox-header">Cấu hình chung</div><div class="gbox-body">
            <p class="form-hint">Tool tự động ngắt khi tạo ra tài khoản quảng cáo 250 Nolimit</p>
            <div class="tut-chk-row">
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.noLimit" /><span>Nolimit</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.bm50" /><span>50$</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.bm250" /><span>250$</span></label>
            </div>
            <div class="tut-chk-row">
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.changeName" /><span>Đổi tên TKQC</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.changeTKQC" /><span>Đổi thông tin TKQC</span></label>
            </div>
            <div class="form-row"><span class="form-label">Tên TKQC</span><input type="text" class="form-input" v-model="form.tutPremium.nolimit250.name" /></div>
            <div class="cf-row-3col">
              <div class="form-row"><span class="form-label">Quốc gia</span><input type="text" class="form-input" v-model="form.tutPremium.nolimit250.country" /></div>
              <div class="form-row"><span class="form-label">Múi giờ</span><input type="text" class="form-input" v-model="form.tutPremium.nolimit250.timeZone" /></div>
              <div class="form-row"><span class="form-label">Tiền tệ</span><input type="text" class="form-input" v-model="form.tutPremium.nolimit250.currency" /></div>
            </div>
            <div class="cf-inline">
              <span class="form-label">Thời gian nghỉ từ:</span>
              <input type="number" class="form-input form-input--xs" v-model.number="form.tutPremium.nolimit250.pauseFrom" min="0" />
              <span>đến:</span>
              <input type="number" class="form-input form-input--xs" v-model.number="form.tutPremium.nolimit250.pauseTo" min="0" />
              <span class="form-hint">giây</span>
            </div>
            <div class="form-row"><span class="form-label">Số lần chạy reg</span><input type="number" class="form-input form-input--sm" v-model.number="form.tutPremium.nolimit250.regCount" min="1" /></div>
          </div></div>

          <!-- Share TKQC -->
          <div class="gbox"><div class="gbox-header">Share tài khoản quảng cáo</div><div class="gbox-body">
            <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareTKQC" /><span>Share tài khoản quảng cáo</span></label>
            <div v-if="form.tutPremium.nolimit250.shareTKQC" class="cf-sub-fields">
              <div class="tut-chk-row">
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareTKQCNLM" /><span>Nolimit</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareTKQC50" /><span>50$</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareTKQC250" /><span>250$</span></label>
              </div>
              <div class="tut-chk-row">
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareFullTKQC" /><span>Share tới khi full TKQC</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareTKQCbyList" /><span>Share TKQC theo ID chỉ định</span></label>
              </div>
              <div v-if="form.tutPremium.nolimit250.shareTKQCbyList" class="cf-sub">
                <span class="cf-count">ID chỉ định ({{ form.tutPremium.nolimit250.shareTKQCList.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Share TKQC theo ID', form.tutPremium.nolimit250.shareTKQCList, ids => form.tutPremium.nolimit250.shareTKQCList = ids)">Chọn</button>
              </div>
              <div class="cf-inline">
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareAccountMax9" /><span>Share TKQC Account (Max</span></label>
                <input type="number" class="form-input form-input--xs" v-model.number="form.tutPremium.nolimit250.maxAccounts" min="1" />
                <span class="form-hint">)</span>
              </div>
              <div class="tut-chk-row">
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.onlyShareTKQCLive" /><span>Chỉ TKQC Live</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.ripAfterShare" /><span>Tự sát sau khi share</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.unfriendAfterShare" /><span>Hủy kết bạn sau share</span></label>
              </div>
            </div>
          </div></div>

          <!-- Share BM -->
          <div class="gbox"><div class="gbox-header">Share Business Manager</div><div class="gbox-body">
            <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareBM" /><span>Share Business Manager</span></label>
            <div v-if="form.tutPremium.nolimit250.shareBM" class="cf-sub-fields">
              <div class="tut-chk-row">
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareTKQCToBMNLM" /><span>Nolimit</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareTKQCToBM50" /><span>50$</span></label>
                <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.shareTKQCToBM250" /><span>250$</span></label>
              </div>
              <div class="form-row"><span class="form-label">Số lượng nhận TKQC/ BM</span><input type="number" class="form-input form-input--xs" v-model.number="form.tutPremium.nolimit250.shareTKQConBM" min="1" /></div>
              <div class="cf-sub">
                <span class="cf-count">ID BM chỉ định ({{ form.tutPremium.nolimit250.bmReceiveIds.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('ID BM chỉ định (nhận tất cả)', form.tutPremium.nolimit250.bmReceiveIds, ids => form.tutPremium.nolimit250.bmReceiveIds = ids)">Chọn</button>
              </div>
              <div class="cf-row-2col">
                <div class="form-row"><span class="form-label">Thư mục nhận BM</span><input type="text" class="form-input" v-model="form.tutPremium.nolimit250.bmReceiveFolder" /></div>
                <div class="form-row"><span class="form-label">Thư mục nhận TKQC</span><input type="text" class="form-input" v-model="form.tutPremium.nolimit250.tkqcReceiveFolder" /></div>
              </div>
            </div>
          </div></div>

          <!-- Cấu hình thoát -->
          <div class="gbox"><div class="gbox-header">Cấu hình thoát</div><div class="gbox-body">
            <div class="tut-chk-row">
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.out" /><span>Thoát</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.outAllTKQC" /><span>Thoát tất cả TKQC</span></label>
            </div>
            <div class="tut-chk-row">
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.deleteAdmin" /><span>Xóa quản trị viên trừ via cầm</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.deleteAdminHide" /><span>Xóa quản trị viên ẩn</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.deleteOutAllBM" /><span>Xóa BM trừ nick cầm</span></label>
            </div>
            <div class="cf-row">
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.nolimit250.outByListUID" /><span>Thoát theo UID</span></label>
              <div v-if="form.tutPremium.nolimit250.outByListUID" class="cf-sub">
                <span class="cf-count">UID ({{ form.tutPremium.nolimit250.outByListUIDs.length }}):</span>
                <button class="btn-sm" @click="openIdEditor('Thoát theo UID', form.tutPremium.nolimit250.outByListUIDs, ids => form.tutPremium.nolimit250.outByListUIDs = ids)">Chọn</button>
              </div>
            </div>
          </div></div>
        </template>

        <!-- TUT 04: Lưỡng tính -->
        <template v-else-if="form.tutPremium.selectedType === 'lgbt'">
          <div class="gbox"><div class="gbox-header">Lưỡng tính</div><div class="gbox-body">
            <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.lgbt.enabled" /><span>Kích hoạt</span></label>
            <p class="form-hint">Cấu hình chi tiết sẽ được cập nhật khi chạy.</p>
          </div></div>
        </template>

        <!-- TUT 05: Kích BM3-BM5 -->
        <template v-else-if="form.tutPremium.selectedType === 'bm5'">
          <div class="gbox"><div class="gbox-header">Kích BM3-BM5</div><div class="gbox-body">
            <div class="form-row"><span class="form-label">Cấu hình</span>
              <select class="form-select" v-model="form.tutPremium.bm5.config">
                <option v-for="o in TUT_BM5_CONFIG_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>
            <div v-if="form.tutPremium.bm5.config === 'byId'" class="cf-sub">
              <span class="cf-count">ID chỉ định ({{ form.tutPremium.bm5.bmIds.length }}):</span>
              <button class="btn-sm" @click="openIdEditor('ID BM chỉ định', form.tutPremium.bm5.bmIds, ids => form.tutPremium.bm5.bmIds = ids)">Chọn</button>
            </div>
            <div class="form-row"><span class="form-label">Loại BM</span>
              <select class="form-select" v-model="form.tutPremium.bm5.typeBM">
                <option v-for="o in TUT_BM5_TYPE_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>
            <div class="form-row"><span class="form-label">Vòng lặp</span><input type="number" class="form-input form-input--sm" v-model.number="form.tutPremium.bm5.loops" min="1" /></div>
            <div class="cf-row-2col">
              <div class="form-row"><span class="form-label">Thời gian nghỉ (giây)</span><input type="number" class="form-input form-input--sm" v-model.number="form.tutPremium.bm5.delay" min="0" /></div>
              <div class="form-row"><span class="form-label">Dừng khi thất bại</span><input type="number" class="form-input form-input--sm" v-model.number="form.tutPremium.bm5.stopOnFail" min="1" /></div>
            </div>
            <div class="tut-chk-row">
              <label class="radio-item"><input type="radio" value="bm5new" v-model="form.tutPremium.bm5.method" name="bm5method" /><span>Kick BM5 NEW</span></label>
              <label class="radio-item"><input type="radio" value="apinew" v-model="form.tutPremium.bm5.method" name="bm5method" /><span>API NEW</span></label>
            </div>
            <div class="tut-chk-row">
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.bm5.checkBM" /><span>Kiểm tra BM</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.bm5.notDelete" /><span>Không dọn dữ liệu</span></label>
              <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.bm5.deleteData" /><span>Dọn sạch dữ liệu</span></label>
            </div>
          </div></div>
        </template>

        <!-- TUT 06: Kích BM10 -->
        <template v-else-if="form.tutPremium.selectedType === 'activeBM10'">
          <div class="gbox"><div class="gbox-header">Kích BM10</div><div class="gbox-body">
            <div class="form-row"><span class="form-label">Định dạng nhập UID | ID TKQC tách</span></div>
            <textarea class="form-textarea" rows="4" v-model="form.tutPremium.activeBM10.listRun" placeholder="UID|ID TKQC Tách"></textarea>
            <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.activeBM10.call" /><span>Call</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.activeBM10.kick10" /><span>Kick Lên 10</span></label>
          </div></div>
        </template>

        <!-- TUT 07: Kích BM2500 -->
        <template v-else-if="form.tutPremium.selectedType === 'activeBM2500'">
          <div class="gbox"><div class="gbox-header">Kích BM2500</div><div class="gbox-body">
            <div class="form-row"><span class="form-label">Danh sách TKQC</span></div>
            <textarea class="form-textarea" rows="3" v-model="form.tutPremium.activeBM2500.listAdAccount" placeholder="UID|ID TKQC Tách"></textarea>
            <div class="form-row"><span class="form-label">Danh sách ID BM</span></div>
            <textarea class="form-textarea" rows="3" v-model="form.tutPremium.activeBM2500.listIDBM" placeholder="UID|ID TKQC Tách"></textarea>
            <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.activeBM2500.call" /><span>Call</span></label>
            <label class="chk-item"><input type="checkbox" v-model="form.tutPremium.activeBM2500.kick10" /><span>Kick Lên 10</span></label>
          </div></div>
        </template>
      </div>
    </div>

    <!-- ═══ Generic ID list editor (shared across all tabs) ═══ -->
    <teleport to="body">
      <div v-if="idEditor.show" class="overlay" @click.self="idEditor.show = false">
        <div class="mini-modal">
          <div class="mini-modal-header">{{ idEditor.title }}</div>
          <textarea class="mini-modal-textarea" v-model="idEditor.text" placeholder="Nhập mỗi dòng một mục..." rows="8"></textarea>
          <div class="mini-modal-footer">
            <button class="btn-sm btn-sm--primary" @click="saveIdEditor">Lưu</button>
            <button class="btn-sm" @click="idEditor.show = false">Đóng</button>
          </div>
        </div>
      </div>
    </teleport>
  </BaseModal>
</template>

<style scoped>
/* Tab navigation */
.tab-nav { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color); margin-bottom: 16px; }
.tab-btn { padding: 6px 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-primary); color: var(--text-secondary); font-family: var(--font-family); font-size: 12px; cursor: pointer; transition: all 0.15s; white-space: nowrap; text-align: center; }
.tab-btn:hover { background: var(--hover-bg); color: var(--text-primary); }
.tab-btn--active { background: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }
.tab-btn--active:hover { background: var(--brand-primary); color: #fff; }
.tab-content { }
.tab-panel { display: flex; flex-direction: column; gap: 12px; }

/* GroupBox (inline) */
.gbox { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; }
.gbox-header { padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 6px; }
.gbox-count { font-weight: 400; color: var(--text-tertiary); font-size: 11px; }
.gbox-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
.gbox-body--grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px 12px; }

/* Checkbox / Radio items */
.chk-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; padding: 3px 0; white-space: nowrap; }
.chk-item input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }
.chk-item--premium { color: var(--text-tertiary); }
.premium-badge { font-size: 9px; padding: 1px 4px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; border-radius: 3px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
.radio-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; padding: 3px 0; white-space: nowrap; }
.radio-item input[type="radio"] { accent-color: var(--brand-primary); cursor: pointer; }
.tut-radio-group { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px 12px; }
.tut-chk-row { display: flex; flex-wrap: wrap; gap: 6px 20px; }

/* Form rows & inputs */
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-secondary); gap: 12px; }
.form-row:last-child { border-bottom: none; }
.form-label { flex-shrink: 0; font-size: 13px; color: var(--text-secondary); }
.form-input { border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 5px 8px; font-size: 12px; font-family: var(--font-family); background: var(--bg-primary); color: var(--text-primary); outline: none; min-width: 0; flex: 1; }
.form-input:focus { border-color: var(--brand-primary); }
.form-input:disabled { opacity: 0.45; cursor: not-allowed; }
.form-input--sm { max-width: 100px; flex: none; }
.form-input--xs { max-width: 64px; flex: none; }
.form-select { border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 5px 8px; font-size: 12px; font-family: var(--font-family); background: var(--bg-primary); color: var(--text-primary); outline: none; min-width: 120px; }
.form-select:focus { border-color: var(--brand-primary); }
.form-select--lg { flex: 1; }
.form-textarea { border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 6px 8px; font-size: 12px; font-family: var(--font-family); background: var(--bg-primary); color: var(--text-primary); outline: none; resize: vertical; width: 100%; }
.form-textarea:focus { border-color: var(--brand-primary); }
.form-hint { font-size: 11px; color: var(--text-tertiary); }

/* Clone Farming / BM layout */
.cf-row { display: flex; flex-direction: column; gap: 4px; padding: 4px 0; }
.cf-sub { display: flex; align-items: center; gap: 8px; padding-left: 22px; }
.cf-sub-fields { display: flex; flex-direction: column; gap: 4px; padding-left: 22px; }
.cf-count { font-size: 12px; color: var(--text-tertiary); }
.cf-inline { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
.cf-row-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.cf-row-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.cf-row-3col-auto { display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; align-items: center; }

/* Payment row */
.payment-row { display: flex; align-items: center; gap: 12px; padding: 6px 0; }

/* BM content */
.bm-content { }

/* Mini buttons */
.btn-sm { padding: 4px 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-primary); color: var(--text-secondary); font-size: 11px; font-family: var(--font-family); cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.btn-sm:hover { background: var(--hover-bg); }
.btn-sm:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-sm--primary { background: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }
.btn-sm--primary:hover { opacity: 0.9; }

/* Context menu */
.ctx-menu { position: fixed; z-index: 9999; background: #fff; border: 1px solid #ddd; border-radius: var(--radius-sm); box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 4px 0; min-width: 180px; }
.ctx-item { display: block; width: 100%; padding: 8px 16px; border: none; background: none; text-align: left; font-size: 13px; cursor: pointer; color: #333; }
.ctx-item:hover { background: var(--hover-bg); }
.ctx-item--red:hover { background: rgba(239,68,68,0.08); color: var(--error-color); }

/* Overlay & mini-modal */
.overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; }
.mini-modal { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); width: 400px; max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
.mini-modal-header { padding: 10px 14px; font-size: 13px; font-weight: 700; color: var(--brand-primary); background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.mini-modal-textarea { display: block; width: 100%; border: none; border-bottom: 1px solid var(--border-color); padding: 10px 14px; font-size: 12px; font-family: var(--font-family); resize: vertical; outline: none; background: var(--bg-primary); color: var(--text-primary); box-sizing: border-box; }
.mini-modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 8px 14px; }
</style>
