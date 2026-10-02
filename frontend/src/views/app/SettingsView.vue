<script setup lang="ts">
import { computed, ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseInput, BaseToggle, BaseBadge, FormField, GroupBox } from '../../components/common'
import { SHELL_ICONS } from '../../components/layout/shell-icons'

const tab = ref('chung')
/** Danh mục cài đặt (nav dọc bên trái, bố cục giống trang Setting của MindAds) */
const tabs = [
  { key: 'chung',      label: 'Chung',      hint: 'Hồ sơ cá nhân',     icon: SHELL_ICONS.user },
  { key: 'bao-mat',    label: 'Bảo mật',    hint: 'Mật khẩu, 2FA',     icon: SHELL_ICONS.shield },
  { key: 'thong-bao',  label: 'Thông báo',  hint: 'Kênh nhận tin',     icon: SHELL_ICONS.bell },
  { key: 'giao-dien',  label: 'Giao diện',  hint: 'Chế độ sáng / tối', icon: SHELL_ICONS.sun },
  { key: 'thanh-toan', label: 'Thanh toán', hint: 'Gói và thẻ',        icon: SHELL_ICONS.idCard },
]
const activeTab = computed(() => tabs.find((t) => t.key === tab.value) ?? tabs[0])

const name = ref('Nguyễn Văn A')
const email = ref('nguyenvana@example.com')
const phone = ref('0987 654 321')
const bio = ref('Senior Frontend Engineer tại MindUI.')

const notifs = ref({
  email: true, push: true, sms: false,
  digest: false, marketing: true, security: true,
})

function save() { /* demo */ }
</script>

<template>
  <AppPageLayout section="app" current="cài đặt" page-title="Cài đặt tài khoản" page-description="Quản lý hồ sơ, bảo mật và tuỳ chọn cá nhân">
    <div class="st">
    <nav class="st__nav mind-slim-scroll" aria-label="Danh mục cài đặt">
      <button
        v-for="t in tabs"
        :key="t.key"
        type="button"
        class="st__item"
        :class="{ 'is-active': tab === t.key }"
        :aria-current="tab === t.key ? 'page' : undefined"
        @click="tab = t.key"
      >
        <span class="st__ico" v-html="t.icon" />
        <span class="st__txt">
          <span class="st__label">{{ t.label }}</span>
          <span class="st__hint">{{ t.hint }}</span>
        </span>
      </button>
    </nav>

    <div class="st__main" :aria-label="activeTab.label">

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
            <span class="card-name"><span class="card-ico" v-html="SHELL_ICONS.idCard" />Visa •••• 4242</span>
            <BaseBadge text="mặc định" variant="neutral" size="sm" />
          </div>
          <BaseButton size="sm" variant="ghost">+ Thêm thẻ</BaseButton>
        </div>
      </GroupBox>
    </template>
    </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
/* ── Bố cục Setting: nav dọc + vùng nội dung ── */
.st { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: var(--wx-space-5); align-items: start; }
.st__nav {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--wx-space-2);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-base);
  box-shadow: var(--wx-shadow-sm);
}
.st__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  width: 100%;
  padding: var(--wx-space-2) var(--wx-space-3);
  border: 0;
  border-radius: var(--wx-radius-lg);
  background: transparent;
  color: var(--wx-text-secondary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.st__item:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
.st__item:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: -2px; }
.st__item.is-active { background: var(--wx-shell-tone-brand-bg); color: var(--wx-shell-tone-brand-fg); }
.st__item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-brand-primary);
}
.st__ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
}
.st__ico :deep(svg) { width: 16px; height: 16px; }
.st__item.is-active .st__ico { background: var(--wx-brand-primary); color: var(--wx-text-inverse); }
.st__txt { display: flex; flex-direction: column; min-width: 0; }
.st__label { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); }
.st__hint { font-size: var(--wx-fs-12); color: var(--wx-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st__item.is-active .st__hint { color: var(--wx-shell-tone-brand-fg); }
.st__main { display: flex; flex-direction: column; gap: var(--wx-space-4); min-width: 0; }
.card-name { display: inline-flex; align-items: center; gap: var(--wx-space-2); }
.card-ico { display: inline-flex; color: var(--wx-text-muted); }
.card-ico :deep(svg) { width: 18px; height: 18px; }

@media (max-width: 860px) {
  .st { grid-template-columns: 1fr; }
  .st__nav { position: static; flex-direction: row; overflow-x: auto; }
  .st__item { width: auto; flex-shrink: 0; }
  .st__hint { display: none; }
}

.settings-form { display: flex; flex-direction: column; gap: var(--wx-space-4); max-width: 480px; }
.form-actions { display: flex; gap: var(--wx-space-3); }
.toggle-row { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-4); }
.toggle-title { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); }
.toggle-desc { font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin-top: 2px; }
.notif-list { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.notif-row { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-4); padding-bottom: var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.notif-row:last-child { border-bottom: none; padding-bottom: 0; }
.sessions-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.session-row { display: flex; align-items: center; justify-content: space-between; padding: var(--wx-space-3); background: var(--wx-surface-sunken); border-radius: var(--wx-radius-md); }
.sess-label { display: block; font-size: var(--wx-fs-14); }
.sess-time { display: block; font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.billing-plan { display: flex; align-items: center; justify-content: space-between; }
.plan-info { display: flex; align-items: center; gap: var(--wx-space-3); }
.plan-price { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-bold); }
.card-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.card-row { display: flex; align-items: center; gap: var(--wx-space-3); }
</style>
