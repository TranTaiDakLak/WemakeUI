<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseInput, BaseSelectMenu, BaseCheckbox, BaseTextarea, GroupBox, BaseTabs, BaseModal } from '../common'
import { useSettingsStore } from '../../stores/weconnect/settings'
import {
  CHECK_INFO_ITEMS, CHECK_ADS_ITEMS,
  BM_OPERATIONS, TUT_TYPES, PAYMENT_TIME_OPTIONS,
} from '../../types/settings'

const show = defineModel<boolean>({ required: true })
const settingsStore = useSettingsStore()

const activeTab = ref('resource')

const TABS = [
  { key: 'resource',   label: '01 Kiểm tra tài nguyên' },
  { key: 'bm',         label: '02 Business Manager' },
  { key: 'page',       label: '03 Page' },
  { key: 'share',      label: '04 Share TKQC' },
  { key: 'campaign',   label: '05 Lên camp & Add thẻ' },
  { key: 'farming',    label: '06 Tương tác kịch bản' },
  { key: 'updateinfo', label: '07 Cập nhật thông tin' },
  { key: 'checkpoint', label: '08 Gỡ checkpoint' },
  { key: 'resist',     label: '09 Kháng tài khoản' },
  { key: 'tut',        label: '10 Cá nhân (TUT Premium)' },
]

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
  { value: 'photo_id',   label: 'Photo ID' },
  { value: 'selfie',     label: 'Selfie' },
  { value: 'friend_review', label: 'Friend Review' },
]
const cpMethodOps = [
  { value: 'manual', label: 'Thủ công' },
  { value: 'auto',   label: 'Tự động' },
]
const bmTypeOps = [
  { value: 'personal', label: 'Personal' },
  { value: 'agency',   label: 'Agency' },
]
const mailTypeOps = [
  { value: 'gmail',   label: 'Gmail' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'yahoo',   label: 'Yahoo' },
]

function save() {
  inter.value.checkInfo.accountKeys = CHECK_INFO_ITEMS.filter(i => checkInfo.value[i.key]).map(i => i.key)
  inter.value.checkInfo.adsKeys = CHECK_ADS_ITEMS.filter(i => checkAds.value[i.key]).map(i => i.key)
  settingsStore.updateInteraction(inter.value)
  show.value = false
}
</script>

<template>
  <BaseModal :show="show" title="≈ Thiết lập tương tác" size="xl" @close="show = false">
    <BaseTabs v-model="activeTab" :tabs="TABS">

      <!-- 01 Kiểm tra tài nguyên -->
      <template #resource>
        <div class="tab-content">
          <GroupBox title="Kiểm tra tài khoản (23 mục)">
            <div class="check-grid">
              <div
                v-for="item in CHECK_INFO_ITEMS"
                :key="item.key"
                class="check-item"
              >
                <BaseCheckbox v-model="checkInfo[item.key]" :label="item.label" />
                <span v-if="item.premium" class="premium-badge">PRO</span>
              </div>
            </div>
          </GroupBox>
          <GroupBox title="Kiểm tra quảng cáo (5 mục)">
            <div class="check-grid">
              <BaseCheckbox
                v-for="item in CHECK_ADS_ITEMS"
                :key="item.key"
                v-model="checkAds[item.key]"
                :label="item.label"
              />
            </div>
          </GroupBox>
          <GroupBox title="Thanh toán">
            <div class="form-row">
              <label>Thời hạn thanh toán</label>
              <BaseSelectMenu :model-value="'7'" :options="paymentOps" size="sm" />
            </div>
          </GroupBox>
        </div>
      </template>

      <!-- 02 Business Manager -->
      <template #bm>
        <div class="tab-content">
          <GroupBox title="Business Manager">
            <div class="form-row">
              <label>Loại thao tác</label>
              <BaseSelectMenu v-model="inter.bm.operation" :options="bmOps" size="sm" />
            </div>
            <template v-if="inter.bm.operation === 'createBM'">
              <div class="form-row mt-2">
                <label>Số lượng</label>
                <BaseInput v-model="inter.bm.quantity" type="number" size="sm" style="width:80px" />
              </div>
            </template>
            <template v-else-if="['receiveLink','sharePartner'].includes(inter.bm.operation)">
              <div class="form-row mt-2">
                <label>UID nhận</label>
                <BaseInput v-model="inter.bm.receiverUid" size="sm" placeholder="Nhập UID..." />
              </div>
              <div class="form-row">
                <label>Loại BM</label>
                <BaseSelectMenu v-model="inter.bm.bmType" :options="bmTypeOps" size="sm" />
              </div>
              <div class="form-row">
                <BaseCheckbox v-model="inter.bm.shareBySpecificUid" label="Share theo UID cụ thể" />
              </div>
            </template>
          </GroupBox>
        </div>
      </template>

      <!-- 03 Page -->
      <template #page>
        <div class="tab-content">
          <GroupBox title="Tương tác Page">
            <div class="form-col">
              <BaseCheckbox v-model="inter.page.likePage" label="Like Page" />
              <BaseCheckbox v-model="inter.page.sharePage" label="Share Page" />
              <BaseCheckbox v-model="inter.page.commentPage" label="Comment Page" />
            </div>
            <div class="form-row mt-3">
              <label>URL Page</label>
              <BaseInput v-model="inter.page.pageUrl" size="sm" placeholder="https://fb.com/..." style="flex:1" />
            </div>
          </GroupBox>
        </div>
      </template>

      <!-- 04 Share TKQC -->
      <template #share>
        <div class="tab-content">
          <GroupBox title="Share Tài khoản quảng cáo">
            <div class="form-row">
              <label>Số lượng/BM</label>
              <BaseInput v-model="inter.shareTKQC.quantityPerBM" type="number" size="sm" style="width:80px" />
            </div>
            <div class="form-row">
              <label>UID nhận</label>
              <BaseInput v-model="inter.shareTKQC.receiverUid" size="sm" placeholder="Nhập UID..." />
            </div>
            <div class="form-row">
              <label>Loại BM</label>
              <BaseSelectMenu v-model="inter.shareTKQC.bmType" :options="bmTypeOps" size="sm" />
            </div>
            <div class="form-row">
              <label>Mail type</label>
              <BaseSelectMenu v-model="inter.shareTKQC.mailType" :options="mailTypeOps" size="sm" />
            </div>
            <BaseCheckbox v-model="inter.shareTKQC.shareBySpecificUid" label="Share theo UID cụ thể" />
            <div class="form-col mt-2">
              <label>Danh sách TKQC</label>
              <BaseTextarea v-model="inter.shareTKQC.tkqcList" :rows="4" placeholder="Mỗi dòng một TKQC..." />
            </div>
          </GroupBox>
        </div>
      </template>

      <!-- 05 Campaign -->
      <template #campaign>
        <div class="tab-content">
          <GroupBox title="Lên chiến dịch & Thêm thẻ">
            <div class="form-row">
              <label>Tên chiến dịch</label>
              <BaseInput v-model="inter.campaign.campaignName" size="sm" placeholder="Nhập tên..." style="flex:1" />
            </div>
            <div class="form-row">
              <label>Ngân sách (VND)</label>
              <BaseInput v-model="inter.campaign.budget" type="number" size="sm" style="width:120px" />
            </div>
            <div class="form-col mt-2">
              <label>Đối tượng mục tiêu</label>
              <BaseTextarea v-model="inter.campaign.targeting" :rows="3" placeholder="Nhập targeting..." />
            </div>
            <BaseCheckbox v-model="inter.campaign.addCard" label="Thêm thẻ thanh toán" />
          </GroupBox>
        </div>
      </template>

      <!-- 06 Clone Farming -->
      <template #farming>
        <div class="tab-content">
          <GroupBox title="Tương tác kịch bản (Clone Farming)">
            <div class="form-col">
              <label>UIDs thêm bạn</label>
              <BaseTextarea v-model="inter.cloneFarming.addFriendUids" :rows="3" placeholder="Mỗi UID một dòng..." />
            </div>
            <div class="form-col mt-2">
              <label>UIDs chấp nhận kết bạn</label>
              <BaseTextarea v-model="inter.cloneFarming.acceptFriendUids" :rows="3" placeholder="Mỗi UID một dòng..." />
            </div>
            <div class="form-col mt-2">
              <label>Page IDs quét Ad Library</label>
              <BaseTextarea v-model="inter.cloneFarming.scanAdLibraryPageIds" :rows="3" placeholder="Mỗi Page ID một dòng..." />
            </div>
            <div class="form-row mt-2">
              <label>Hành động</label>
              <BaseSelectMenu
                v-model="inter.cloneFarming.action"
                :options="[{value:'like',label:'Like'},{value:'share',label:'Share'},{value:'comment',label:'Comment'}]"
                size="sm"
              />
            </div>
          </GroupBox>
        </div>
      </template>

      <!-- 07 Cập nhật thông tin -->
      <template #updateinfo>
        <div class="tab-content">
          <GroupBox title="Cập nhật thông tin tài khoản">
            <div class="form-col">
              <BaseCheckbox v-model="inter.updateInfo.updateName"     label="Họ và tên" />
              <BaseCheckbox v-model="inter.updateInfo.updateAvatar"   label="Ảnh đại diện" />
              <BaseCheckbox v-model="inter.updateInfo.updateCover"    label="Ảnh bìa" />
              <BaseCheckbox v-model="inter.updateInfo.updateBio"      label="Tiểu sử (Bio)" />
              <BaseCheckbox v-model="inter.updateInfo.updateBirthday" label="Ngày sinh" />
              <BaseCheckbox v-model="inter.updateInfo.updateLocation" label="Vị trí" />
            </div>
          </GroupBox>
        </div>
      </template>

      <!-- 08 Gỡ Checkpoint -->
      <template #checkpoint>
        <div class="tab-content">
          <GroupBox title="Gỡ Checkpoint">
            <div class="form-row">
              <label>Loại checkpoint</label>
              <BaseSelectMenu v-model="inter.checkpoint.cpType" :options="cpTypeOps" size="sm" />
            </div>
            <div class="form-row">
              <label>Phương thức</label>
              <BaseSelectMenu v-model="inter.checkpoint.method" :options="cpMethodOps" size="sm" />
            </div>
            <div class="form-row">
              <label>Delay (ms)</label>
              <BaseInput v-model="inter.checkpoint.delay" type="number" size="sm" style="width:100px" />
            </div>
          </GroupBox>
        </div>
      </template>

      <!-- 09 Kháng tài khoản -->
      <template #resist>
        <div class="tab-content">
          <GroupBox title="Kháng tài khoản">
            <div class="form-col">
              <BaseCheckbox v-model="inter.accountResist.appeal"         label="Kháng cáo tài khoản (Appeal)" />
              <BaseCheckbox v-model="inter.accountResist.verifyIdentity" label="Xác minh danh tính" />
            </div>
          </GroupBox>
        </div>
      </template>

      <!-- 10 TUT Premium -->
      <template #tut>
        <div class="tab-content">
          <GroupBox title="Cá nhân (TUT Premium)">
            <div class="form-row">
              <label>Loại TUT</label>
              <BaseSelectMenu v-model="inter.tutPremium.tutType" :options="tutTypeOps" size="sm" />
            </div>
            <div class="form-col mt-2">
              <label>BM5 Config</label>
              <BaseTextarea v-model="inter.tutPremium.bm5Config" :rows="4" placeholder="Cấu hình BM5..." />
            </div>
            <div class="form-col mt-2">
              <label>Options</label>
              <BaseTextarea v-model="inter.tutPremium.options" :rows="3" placeholder="Tùy chọn..." />
            </div>
          </GroupBox>
        </div>
      </template>
    </BaseTabs>

    <template #footer>
      <div class="interact-footer">
        <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
        <BaseButton variant="primary" @click="save">Lưu</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.tab-content { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.check-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px 12px;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.premium-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: var(--wx-radius-sm);
  background: #f59e0b;
  color: #fff;
  letter-spacing: 0.3px;
}
.form-row { display: flex; align-items: center; gap: var(--wx-space-3); font-size: var(--wx-fs-13); }
.form-row label { min-width: 160px; color: var(--wx-text-secondary); }
.form-col { display: flex; flex-direction: column; gap: 4px; font-size: var(--wx-fs-13); }
.form-col label { color: var(--wx-text-secondary); }
.mt-2 { margin-top: var(--wx-space-2); }
.mt-3 { margin-top: var(--wx-space-3); }
.interact-footer { display: flex; justify-content: flex-end; gap: var(--wx-space-2); width: 100%; }
</style>
