<script setup lang="ts">
import { ref, reactive } from 'vue'
import AppTopbar from '../components/layout/AppTopbar.vue'
import PageHeader from '../components/layout/PageHeader.vue'
import {
  BaseButton, BaseInput, BaseSelect, BaseToggle,
  BaseCheckbox, BaseRadio, BaseTabs, BaseBadge,
  BaseProgress, BaseModal, BaseDropdown, BaseTooltip,
  GroupBox, FormField,
} from '../components/common'
import { useToast } from '../composables/useToast'

const { showToast } = useToast()

/* ── State ─────────────────────────── */
const form = reactive({
  username: '',
  password: '',
  country: 'vn',
  newsletter: true,
  plan: 'pro',
  agree: false,
})

const tab = ref('components')
const showModal = ref(false)
const progress = ref(45)

const tabs = [
  { key: 'components', label: 'Components' },
  { key: 'forms', label: 'Forms' },
  { key: 'feedback', label: 'Feedback' },
]

const countryOptions = [
  { value: 'vn', label: 'Việt Nam' },
  { value: 'us', label: 'United States' },
  { value: 'jp', label: 'Japan' },
  { value: 'sg', label: 'Singapore' },
]

const planOptions = [
  { value: 'free', label: 'Miễn phí' },
  { value: 'pro', label: 'Chuyên nghiệp' },
  { value: 'team', label: 'Doanh nghiệp' },
]
</script>

<template>
  <div class="showcase">
    <AppTopbar title="WemakeUI" subtitle="Cross-platform Vue 3 UI Kit" />

    <main class="showcase-main">
      <PageHeader
        title="Component Showcase"
        description="Bộ thành phần dùng được cho web, mobile, và desktop. Click qua các tab để xem các nhóm khác nhau."
      />

      <BaseTabs v-model="tab" :tabs="tabs" />

      <!-- ── Tab: Components ────────────────── -->
      <section v-if="tab === 'components'" class="grid">
        <GroupBox title="Buttons">
          <div class="row">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="success">Success</BaseButton>
            <BaseButton variant="danger">Danger</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
            <BaseButton variant="cta">CTA</BaseButton>
          </div>
          <div class="row">
            <BaseButton size="sm">Small</BaseButton>
            <BaseButton size="md">Medium</BaseButton>
            <BaseButton size="lg">Large</BaseButton>
            <BaseButton loading>Loading</BaseButton>
            <BaseButton disabled>Disabled</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="Badges">
          <div class="row">
            <BaseBadge text="Primary" variant="primary" />
            <BaseBadge text="Success" variant="success" />
            <BaseBadge text="Warning" variant="warning" />
            <BaseBadge text="Danger" variant="danger" />
            <BaseBadge text="Info" variant="info" />
            <BaseBadge dot variant="success" pulsing />
          </div>
        </GroupBox>

        <GroupBox title="Tooltip & Dropdown">
          <div class="row">
            <BaseTooltip content="Mô tả ngắn gọn">
              <BaseButton variant="ghost">Hover me</BaseButton>
            </BaseTooltip>
            <BaseDropdown placement="bottom-start">
              <template #trigger>
                <BaseButton variant="secondary">Tùy chọn ▾</BaseButton>
              </template>
              <template #default="{ close }">
                <div class="menu">
                  <button class="menu-item" @click="close()">Tải xuống</button>
                  <button class="menu-item" @click="close()">Chia sẻ</button>
                  <button class="menu-item menu-item--danger" @click="close()">Xóa</button>
                </div>
              </template>
            </BaseDropdown>
          </div>
        </GroupBox>
      </section>

      <!-- ── Tab: Forms ─────────────────────── -->
      <section v-if="tab === 'forms'" class="grid">
        <GroupBox title="Đăng ký">
          <FormField label="Tên người dùng" layout="vertical">
            <BaseInput v-model="form.username" placeholder="Nhập tên..." />
          </FormField>
          <FormField label="Mật khẩu" layout="vertical">
            <BaseInput v-model="form.password" type="password" placeholder="••••••••" />
          </FormField>
          <FormField label="Quốc gia" layout="vertical">
            <BaseSelect v-model="form.country" :options="countryOptions" />
          </FormField>
          <FormField label="Gói dịch vụ" layout="vertical">
            <BaseRadio
              v-model="form.plan"
              name="plan"
              :options="planOptions"
            />
          </FormField>
          <BaseToggle v-model="form.newsletter" label="Đăng ký nhận bản tin" />
          <BaseCheckbox v-model="form.agree" label="Tôi đồng ý với điều khoản" />
          <div class="row" style="margin-top: 12px">
            <BaseButton
              variant="primary"
              :disabled="!form.agree"
              @click="showToast('success', 'Đăng ký thành công!')"
            >
              Đăng ký
            </BaseButton>
            <BaseButton variant="ghost">Hủy</BaseButton>
          </div>
        </GroupBox>
      </section>

      <!-- ── Tab: Feedback ──────────────────── -->
      <section v-if="tab === 'feedback'" class="grid">
        <GroupBox title="Toast">
          <div class="row">
            <BaseButton variant="success" @click="showToast('success', 'Lưu thành công!')">
              Success
            </BaseButton>
            <BaseButton variant="danger" @click="showToast('error', 'Có lỗi xảy ra.')">
              Error
            </BaseButton>
            <BaseButton variant="secondary" @click="showToast('info', 'Thông báo mới.')">
              Info
            </BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="Progress">
          <BaseProgress :value="progress" />
          <div class="row" style="margin-top: 12px">
            <BaseButton size="sm" @click="progress = Math.max(0, progress - 10)">−10%</BaseButton>
            <BaseButton size="sm" @click="progress = Math.min(100, progress + 10)">+10%</BaseButton>
          </div>
        </GroupBox>

        <GroupBox title="Modal">
          <BaseButton variant="primary" @click="showModal = true">Mở Modal</BaseButton>
          <BaseModal
            :show="showModal"
            title="Xác nhận"
            size="sm"
            show-save
            save-label="Đồng ý"
            @close="showModal = false"
            @save="showModal = false; showToast('success', 'Đã xác nhận!')"
          >
            <p>Bạn có chắc chắn muốn thực hiện hành động này?</p>
          </BaseModal>
        </GroupBox>
      </section>
    </main>
  </div>
</template>

<style scoped>
.showcase {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.showcase-main {
  flex: 1;
  padding: var(--space-lg);
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.grid {
  display: grid;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

.menu {
  display: flex;
  flex-direction: column;
  padding: 4px;
  min-width: 160px;
}

.menu-item {
  text-align: left;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: var(--wx-radius-sm);
  color: var(--wx-text-primary);
  font-size: 13px;
  cursor: pointer;
}
.menu-item:hover { background: var(--wx-hover-bg); }
.menu-item--danger { color: var(--wx-danger-text); }
</style>
