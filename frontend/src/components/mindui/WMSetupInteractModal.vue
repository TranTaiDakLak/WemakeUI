<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseButton, BaseInput, BaseSelectMenu, BaseTextarea, BaseOptionRow } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import { useSettingsStore } from '../../stores/mindui/settings'
import {
  CHECK_INFO_ITEMS, CHECK_ADS_ITEMS,
  BM_OPERATIONS, TUT_TYPES, PAYMENT_TIME_OPTIONS,
} from '../../types/settings'
import MindDialog from './MindDialog.vue'
import MindField from './MindField.vue'
import MindSection from './MindSection.vue'

const show = defineModel<boolean>({ required: true })
const settingsStore = useSettingsStore()

const activeTab = ref('resource')

/** Danh mục bước thiết lập (nav dọc bên trái, bố cục master-detail như hộp thoại thiết lập của MindAds) */
const TABS = [
  { key: 'resource',   no: '01', label: 'Kiểm tra dữ liệu',      hint: 'Mục cần kiểm tra mỗi lượt' },
  { key: 'bm',         no: '02', label: 'Nhóm đơn vị',           hint: 'Tạo, chia sẻ và kiểm tra nhóm' },
  { key: 'page',       no: '03', label: 'Trang nội dung',        hint: 'Tương tác với trang' },
  { key: 'share',      no: '04', label: 'Chia sẻ mục',           hint: 'Gửi mục dữ liệu cho người nhận' },
  { key: 'campaign',   no: '05', label: 'Chiến dịch & Thanh toán', hint: 'Ngân sách và đối tượng' },
  { key: 'farming',    no: '06', label: 'Tương tác kịch bản',    hint: 'Danh sách mã và hành động' },
  { key: 'updateinfo', no: '07', label: 'Cập nhật thông tin',    hint: 'Trường hồ sơ cần cập nhật' },
  { key: 'checkpoint', no: '08', label: 'Xử lý ngoại lệ',        hint: 'Xác minh khi gặp ngoại lệ' },
  { key: 'resist',     no: '09', label: 'Xem xét lại',           hint: 'Gửi yêu cầu và xác minh' },
  { key: 'tut',        no: '10', label: 'Gói nâng cao',          hint: 'Loại gói và cấu hình' },
]
const activeMeta = computed(() => TABS.find(t => t.key === activeTab.value) ?? TABS[0])

const inter = ref(JSON.parse(JSON.stringify(settingsStore.interaction)))

const checkInfo = ref<Record<string, boolean>>(
  Object.fromEntries(CHECK_INFO_ITEMS.map(i => [i.key, inter.value.checkInfo.accountKeys.includes(i.key)]))
)
const checkAds = ref<Record<string, boolean>>(
  Object.fromEntries(CHECK_ADS_ITEMS.map(i => [i.key, inter.value.checkInfo.adsKeys.includes(i.key)]))
)

const bmOps = BM_OPERATIONS.map(o => ({ value: o.value, label: o.label }))
const tutTypeOps = TUT_TYPES.map(o => ({ value: o.value, label: o.label }))
const paymentOps = PAYMENT_TIME_OPTIONS.map(o => ({ value: o.value, label: o.label }))

const cpTypeOps = [
  { value: 'photo_id',      label: 'Xác minh biểu mẫu' },
  { value: 'selfie',        label: 'Xác minh hình ảnh' },
  { value: 'friend_review', label: 'Duyệt chéo' },
]
const cpMethodOps = [
  { value: 'manual', label: 'Thủ công' },
  { value: 'auto',   label: 'Tự động' },
]
const bmTypeOps = [
  { value: 'personal', label: 'Cá nhân' },
  { value: 'agency',   label: 'Tổ chức' },
]
const mailTypeOps = [
  { value: 'gmail',   label: 'Gmail' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'yahoo',   label: 'Yahoo' },
]
const farmingActionOps = [
  { value: 'like',    label: 'Thích' },
  { value: 'share',   label: 'Chia sẻ' },
  { value: 'comment', label: 'Bình luận' },
]

function save() {
  inter.value.checkInfo.accountKeys = CHECK_INFO_ITEMS.filter(i => checkInfo.value[i.key]).map(i => i.key)
  inter.value.checkInfo.adsKeys = CHECK_ADS_ITEMS.filter(i => checkAds.value[i.key]).map(i => i.key)
  settingsStore.updateInteraction(inter.value)
  show.value = false
}
</script>

<template>
  <MindDialog
    v-model="show"
    title="Thiết lập tương tác"
    :subtitle="`Bước ${activeMeta.no}/${TABS.length} · ${activeMeta.label}`"
    :icon="SHELL_ICONS.activity"
    size="xl"
  >
    <div class="it-layout">
      <nav class="it-nav mind-slim-scroll" aria-label="Các bước thiết lập">
        <button
          v-for="t in TABS"
          :key="t.key"
          type="button"
          class="it-nav__item"
          :class="{ 'is-active': activeTab === t.key }"
          :aria-current="activeTab === t.key ? 'page' : undefined"
          @click="activeTab = t.key"
        >
          <span class="it-nav__no">{{ t.no }}</span>
          <span class="it-nav__txt">
            <span class="it-nav__label">{{ t.label }}</span>
            <span class="it-nav__hint">{{ t.hint }}</span>
          </span>
        </button>
      </nav>

      <div class="it-main" :aria-label="activeMeta.label">
        <!-- 01 Kiểm tra dữ liệu -->
        <div v-if="activeTab === 'resource'" class="tab-content">
          <MindSection :title="`Kiểm tra bản ghi (${CHECK_INFO_ITEMS.length} mục)`" boxed>
            <div class="check-grid">
              <BaseOptionRow
                v-for="item in CHECK_INFO_ITEMS"
                :key="item.key"
                v-model="checkInfo[item.key]"
                indicator="check"
                :label="item.label"
                :badge="item.premium ? 'PRO' : undefined"
              />
            </div>
          </MindSection>
          <MindSection :title="`Kiểm tra chiến dịch (${CHECK_ADS_ITEMS.length} mục)`" boxed>
            <div class="check-grid">
              <BaseOptionRow
                v-for="item in CHECK_ADS_ITEMS"
                :key="item.key"
                v-model="checkAds[item.key]"
                indicator="check"
                :label="item.label"
              />
            </div>
          </MindSection>
          <MindSection title="Thanh toán" boxed>
            <MindField label="Thời hạn thanh toán">
              <BaseSelectMenu :model-value="'7'" :options="paymentOps" size="sm" />
            </MindField>
          </MindSection>
        </div>

        <!-- 02 Nhóm đơn vị -->
        <div v-else-if="activeTab === 'bm'" class="tab-content">
          <MindSection title="Nhóm đơn vị" boxed>
            <MindField label="Loại thao tác">
              <BaseSelectMenu v-model="inter.bm.operation" :options="bmOps" size="sm" />
            </MindField>
            <template v-if="inter.bm.operation === 'createBM'">
              <MindField label="Số lượng">
                <BaseInput v-model="inter.bm.quantity" type="number" size="sm" style="width: 100px; flex: 0 0 auto" />
              </MindField>
            </template>
            <template v-else-if="['receiveLink','sharePartner'].includes(inter.bm.operation)">
              <MindField label="Mã người nhận">
                <BaseInput v-model="inter.bm.receiverUid" size="sm" placeholder="Nhập mã..." />
              </MindField>
              <MindField label="Loại nhóm">
                <BaseSelectMenu v-model="inter.bm.bmType" :options="bmTypeOps" size="sm" />
              </MindField>
              <BaseOptionRow v-model="inter.bm.shareBySpecificUid" label="Chia sẻ theo mã cụ thể" />
            </template>
          </MindSection>
        </div>

        <!-- 03 Trang nội dung -->
        <div v-else-if="activeTab === 'page'" class="tab-content">
          <MindSection title="Tương tác trang nội dung" boxed>
            <BaseOptionRow v-model="inter.page.likePage" label="Thích" description="Tự động thích nội dung của trang" />
            <BaseOptionRow v-model="inter.page.sharePage" label="Chia sẻ" description="Chia sẻ nội dung của trang" />
            <BaseOptionRow v-model="inter.page.commentPage" label="Bình luận" description="Đăng bình luận theo mẫu" />
            <MindField label="URL trang">
              <BaseInput v-model="inter.page.pageUrl" size="sm" placeholder="https://example.com/..." />
            </MindField>
          </MindSection>
        </div>

        <!-- 04 Chia sẻ mục -->
        <div v-else-if="activeTab === 'share'" class="tab-content">
          <MindSection title="Chia sẻ mục dữ liệu" boxed>
            <MindField label="Số lượng/nhóm">
              <BaseInput v-model="inter.shareTKQC.quantityPerBM" type="number" size="sm" style="width: 100px; flex: 0 0 auto" />
            </MindField>
            <MindField label="Mã người nhận">
              <BaseInput v-model="inter.shareTKQC.receiverUid" size="sm" placeholder="Nhập mã..." />
            </MindField>
            <MindField label="Loại nhóm">
              <BaseSelectMenu v-model="inter.shareTKQC.bmType" :options="bmTypeOps" size="sm" />
            </MindField>
            <MindField label="Loại email">
              <BaseSelectMenu v-model="inter.shareTKQC.mailType" :options="mailTypeOps" size="sm" />
            </MindField>
            <BaseOptionRow v-model="inter.shareTKQC.shareBySpecificUid" label="Chia sẻ theo mã cụ thể" />
            <MindField label="Danh sách mục" stacked>
              <BaseTextarea v-model="inter.shareTKQC.tkqcList" :rows="4" placeholder="Mỗi dòng một mục..." />
            </MindField>
          </MindSection>
        </div>

        <!-- 05 Chiến dịch & Thanh toán -->
        <div v-else-if="activeTab === 'campaign'" class="tab-content">
          <MindSection title="Chiến dịch & Thanh toán" boxed>
            <MindField label="Tên chiến dịch">
              <BaseInput v-model="inter.campaign.campaignName" size="sm" placeholder="Nhập tên..." />
            </MindField>
            <MindField label="Ngân sách (VND)">
              <BaseInput v-model="inter.campaign.budget" type="number" size="sm" style="width: 140px; flex: 0 0 auto" />
            </MindField>
            <MindField label="Đối tượng mục tiêu" stacked>
              <BaseTextarea v-model="inter.campaign.targeting" :rows="3" placeholder="Nhập đối tượng mục tiêu..." />
            </MindField>
            <BaseOptionRow v-model="inter.campaign.addCard" label="Thêm thẻ thanh toán" />
          </MindSection>
        </div>

        <!-- 06 Tương tác kịch bản -->
        <div v-else-if="activeTab === 'farming'" class="tab-content">
          <MindSection title="Tương tác kịch bản" boxed>
            <MindField label="Mã mục cần theo dõi" stacked>
              <BaseTextarea v-model="inter.cloneFarming.addFriendUids" :rows="3" placeholder="Mỗi mã một dòng..." />
            </MindField>
            <MindField label="Mã mục cần chấp nhận" stacked>
              <BaseTextarea v-model="inter.cloneFarming.acceptFriendUids" :rows="3" placeholder="Mỗi mã một dòng..." />
            </MindField>
            <MindField label="Mã trang cần quét" stacked>
              <BaseTextarea v-model="inter.cloneFarming.scanAdLibraryPageIds" :rows="3" placeholder="Mỗi mã trang một dòng..." />
            </MindField>
            <MindField label="Hành động">
              <BaseSelectMenu v-model="inter.cloneFarming.action" :options="farmingActionOps" size="sm" />
            </MindField>
          </MindSection>
        </div>

        <!-- 07 Cập nhật thông tin -->
        <div v-else-if="activeTab === 'updateinfo'" class="tab-content">
          <MindSection title="Cập nhật thông tin hồ sơ" boxed>
            <div class="check-grid">
              <BaseOptionRow v-model="inter.updateInfo.updateName"     indicator="check" label="Họ và tên" />
              <BaseOptionRow v-model="inter.updateInfo.updateAvatar"   indicator="check" label="Ảnh đại diện" />
              <BaseOptionRow v-model="inter.updateInfo.updateCover"    indicator="check" label="Ảnh bìa" />
              <BaseOptionRow v-model="inter.updateInfo.updateBio"      indicator="check" label="Tiểu sử (Bio)" />
              <BaseOptionRow v-model="inter.updateInfo.updateBirthday" indicator="check" label="Ngày sinh" />
              <BaseOptionRow v-model="inter.updateInfo.updateLocation" indicator="check" label="Vị trí" />
            </div>
          </MindSection>
        </div>

        <!-- 08 Xử lý ngoại lệ -->
        <div v-else-if="activeTab === 'checkpoint'" class="tab-content">
          <MindSection title="Xử lý ngoại lệ" boxed>
            <MindField label="Loại xác minh">
              <BaseSelectMenu v-model="inter.checkpoint.cpType" :options="cpTypeOps" size="sm" />
            </MindField>
            <MindField label="Phương thức">
              <BaseSelectMenu v-model="inter.checkpoint.method" :options="cpMethodOps" size="sm" />
            </MindField>
            <MindField label="Delay (ms)">
              <BaseInput v-model="inter.checkpoint.delay" type="number" size="sm" style="width: 140px; flex: 0 0 auto" />
            </MindField>
          </MindSection>
        </div>

        <!-- 09 Xem xét lại -->
        <div v-else-if="activeTab === 'resist'" class="tab-content">
          <MindSection title="Xem xét lại" boxed>
            <BaseOptionRow v-model="inter.accountResist.appeal" label="Gửi yêu cầu xem xét lại" description="Tự động gửi yêu cầu khi bản ghi bị từ chối" />
            <BaseOptionRow v-model="inter.accountResist.verifyIdentity" label="Xác minh thông tin" description="Hoàn tất bước xác minh khi được yêu cầu" />
          </MindSection>
        </div>

        <!-- 10 Gói nâng cao -->
        <div v-else class="tab-content">
          <MindSection title="Gói nâng cao" boxed>
            <MindField label="Loại gói">
              <BaseSelectMenu v-model="inter.tutPremium.tutType" :options="tutTypeOps" size="sm" />
            </MindField>
            <MindField label="Cấu hình gói" stacked>
              <BaseTextarea v-model="inter.tutPremium.bm5Config" :rows="4" placeholder="Nhập cấu hình..." />
            </MindField>
            <MindField label="Tuỳ chọn" stacked>
              <BaseTextarea v-model="inter.tutPremium.options" :rows="3" placeholder="Tùy chọn..." />
            </MindField>
          </MindSection>
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
      <BaseButton variant="primary" @click="save">Lưu</BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
/* ── master-detail: nav dọc + vùng nội dung (cùng ngôn ngữ trang Cài đặt của app) ── */
.it-layout { display: grid; grid-template-columns: 230px minmax(0, 1fr); gap: var(--wx-space-4); align-items: start; }
.it-nav {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--wx-space-1);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-sunken);
}
.it-nav__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  width: 100%;
  padding: 7px var(--wx-space-2);
  border: 0;
  border-radius: var(--wx-radius-ctrl);
  background: transparent;
  color: var(--wx-text-secondary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.it-nav__item:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
.it-nav__item:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: -2px; }
.it-nav__item.is-active { background: var(--wx-shell-tone-brand-bg); color: var(--wx-shell-tone-brand-fg); }
.it-nav__item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-brand-primary);
}
.it-nav__no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: var(--wx-radius-ctrl-sm);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  color: var(--wx-text-muted);
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-bold);
}
.it-nav__item.is-active .it-nav__no { background: var(--wx-brand-primary); border-color: transparent; color: var(--wx-text-inverse); }
.it-nav__txt { display: flex; flex-direction: column; min-width: 0; line-height: 1.25; }
.it-nav__label { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.it-nav__hint { font-size: 10.5px; color: var(--wx-text-light); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.it-nav__item.is-active .it-nav__hint { color: var(--wx-shell-tone-brand-fg); }

.it-main { min-width: 0; }
.tab-content { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.check-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 2px var(--wx-space-2);
}

@media (max-width: 760px) {
  .it-layout { grid-template-columns: minmax(0, 1fr); gap: var(--wx-space-3); }
  .it-nav { position: static; flex-direction: row; overflow-x: auto; }
  .it-nav__item { width: auto; flex-shrink: 0; }
  .it-nav__hint { display: none; }
}
</style>
