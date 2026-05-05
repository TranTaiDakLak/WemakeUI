<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '../_layouts/AppLayout.vue'
import { BaseButton, BaseInput, BaseToggle, BaseTabs, BaseCard, BaseBadge, FormField, GroupBox } from '../../components/common'

const tab = ref('chung')
const tabs = [
  { key: 'chung', label: 'Chung' },
  { key: 'bao-mat', label: 'Bảo mật' },
  { key: 'thong-bao', label: 'Thông báo' },
  { key: 'giao-dien', label: 'Giao diện' },
  { key: 'thanh-toan', label: 'Thanh toán' },
]

const name = ref('Nguyễn Văn A')
const email = ref('nguyenvana@example.com')
const phone = ref('0987 654 321')
const bio = ref('Senior Frontend Engineer tại WemakeUI.')

const notifs = ref({
  email: true, push: true, sms: false,
  digest: false, marketing: true, security: true,
})

function save() { /* demo */ }
</script>

<template>
  <AppLayout current="cài đặt" page-title="Cài đặt tài khoản" page-description="Quản lý hồ sơ, bảo mật và tuỳ chọn cá nhân">
    <BaseTabs v-model="tab" :tabs="tabs" />

    <!-- Chung -->
    <GroupBox v-if="tab === 'chung'" title="Thông tin cá nhân">
      <div class="settings-form">
        <FormField label="Họ và tên">
          <BaseInput v-model="name" placeholder="Nhập họ tên" />
        </FormField>
        <FormField label="Email">
          <BaseInput v-model="email" type="email" placeholder="email@example.com" />
        </FormField>
        <FormField label="Số điện thoại" :required="false">
          <BaseInput v-model="phone" placeholder="0xxx xxx xxx" />
        </FormField>
        <FormField label="Giới thiệu" hint="Tối đa 200 ký tự">
          <BaseInput v-model="bio" placeholder="Giới thiệu bản thân..." />
        </FormField>
        <div class="form-actions">
          <BaseButton variant="primary" @click="save">Lưu thay đổi</BaseButton>
          <BaseButton variant="ghost">Huỷ</BaseButton>
        </div>
      </div>
    </GroupBox>

    <!-- Bảo mật -->
    <template v-if="tab === 'bao-mat'">
      <GroupBox title="Đổi mật khẩu">
        <div class="settings-form">
          <FormField label="Mật khẩu hiện tại">
            <BaseInput type="password" placeholder="••••••••" />
          </FormField>
          <FormField label="Mật khẩu mới">
            <BaseInput type="password" placeholder="••••••••" />
          </FormField>
          <FormField label="Xác nhận mật khẩu mới">
            <BaseInput type="password" placeholder="••••••••" />
          </FormField>
          <BaseButton variant="primary">Cập nhật mật khẩu</BaseButton>
        </div>
      </GroupBox>
      <GroupBox title="Xác thực 2 bước (2FA)">
        <div class="toggle-row">
          <div>
            <p class="toggle-title">Kích hoạt xác thực 2 bước</p>
            <p class="toggle-desc">Bảo vệ tài khoản bằng TOTP hoặc SMS.</p>
          </div>
          <BaseToggle :model-value="false" />
        </div>
      </GroupBox>
      <GroupBox title="Phiên đăng nhập">
        <div class="sessions-list">
          <div v-for="s in [{label:'Chrome · Windows · Hà Nội', time:'Đang hoạt động', curr:true},{label:'Firefox · macOS · HCM',time:'3 ngày trước',curr:false},{label:'Safari · iOS · Đà Nẵng',time:'1 tuần trước',curr:false}]" :key="s.label" class="session-row">
            <div>
              <span class="sess-label">{{ s.label }}</span>
              <span class="sess-time">{{ s.time }}</span>
            </div>
            <BaseButton v-if="!s.curr" size="sm" variant="ghost">Đăng xuất</BaseButton>
            <BaseBadge v-else text="hiện tại" variant="success" />
          </div>
        </div>
      </GroupBox>
    </template>

    <!-- Thông báo -->
    <GroupBox v-if="tab === 'thong-bao'" title="Tuỳ chọn thông báo">
      <div class="notif-list">
        <div v-for="[key, label] in [['email','Thông báo qua email'],['push','Thông báo đẩy'],['sms','Thông báo SMS'],['digest','Tóm tắt hàng tuần'],['marketing','Tin tức & khuyến mãi'],['security','Cảnh báo bảo mật']]" :key="key" class="notif-row">
          <div>
            <span class="toggle-title">{{ label }}</span>
          </div>
          <BaseToggle v-model="notifs[key as keyof typeof notifs]" />
        </div>
      </div>
    </GroupBox>

    <!-- Giao diện -->
    <GroupBox v-if="tab === 'giao-dien'" title="Giao diện">
      <div class="notif-list">
        <div class="notif-row">
          <div>
            <span class="toggle-title">Chế độ tối</span>
            <p class="toggle-desc">Tự động theo hệ thống hoặc chọn thủ công.</p>
          </div>
          <BaseToggle :model-value="false" />
        </div>
        <div class="notif-row">
          <div>
            <span class="toggle-title">Mật độ hiển thị gọn</span>
            <p class="toggle-desc">Giảm khoảng cách để hiển thị nhiều dữ liệu hơn.</p>
          </div>
          <BaseToggle :model-value="true" />
        </div>
        <div class="notif-row">
          <div>
            <span class="toggle-title">Hiệu ứng chuyển trang</span>
            <p class="toggle-desc">Tắt nếu cảm thấy chuyển trang bị chậm.</p>
          </div>
          <BaseToggle :model-value="true" />
        </div>
      </div>
    </GroupBox>

    <!-- Thanh toán -->
    <template v-if="tab === 'thanh-toan'">
      <GroupBox title="Gói hiện tại">
        <div class="billing-plan">
          <div class="plan-info">
            <BaseBadge text="Pro" variant="primary" />
            <span class="plan-price">199.000 ₫ / tháng</span>
          </div>
          <BaseButton size="sm" variant="secondary">Nâng cấp Enterprise</BaseButton>
        </div>
      </GroupBox>
      <GroupBox title="Phương thức thanh toán">
        <div class="card-list">
          <div class="card-row">
            <span>💳 Visa •••• 4242</span>
            <BaseBadge text="mặc định" variant="neutral" size="sm" />
          </div>
          <BaseButton size="sm" variant="ghost">+ Thêm thẻ</BaseButton>
        </div>
      </GroupBox>
    </template>
  </AppLayout>
</template>

<style scoped>
.settings-form { display: flex; flex-direction: column; gap: var(--wx-space-4); max-width: 480px; }
.form-actions { display: flex; gap: var(--wx-space-3); }
.toggle-row { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-4); }
.toggle-title { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); }
.toggle-desc { font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin-top: 2px; }
.notif-list { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.notif-row { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-4); padding-bottom: var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.notif-row:last-child { border-bottom: none; padding-bottom: 0; }
.sessions-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.session-row { display: flex; align-items: center; justify-content: space-between; padding: var(--wx-space-3); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-md); }
.sess-label { display: block; font-size: var(--wx-fs-14); }
.sess-time { display: block; font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.billing-plan { display: flex; align-items: center; justify-content: space-between; }
.plan-info { display: flex; align-items: center; gap: var(--wx-space-3); }
.plan-price { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-bold); }
.card-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.card-row { display: flex; align-items: center; gap: var(--wx-space-3); }
</style>
