<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseAvatar, FormField, BaseInput, GroupBox } from '../../components/common'

const router = useRouter()
const name = ref('Nguyễn Văn A')
const email = ref('nguyenvana@example.com')
const phone = ref('0987 654 321')
const bio = ref('Senior Frontend Engineer tại WemakeUI. Đam mê design system và DX tốt.')
const website = ref('https://wemakeui.vn')
const github = ref('wemakeui')
const linkedin = ref('nguyenvana')
const location = ref('Hà Nội, Việt Nam')

function save() { router.push('/app/profile') }
</script>

<template>
  <AppPageLayout section="app" current="chỉnh sửa hồ sơ" page-title="Chỉnh sửa hồ sơ" page-description="Cập nhật thông tin cá nhân và mạng xã hội">
    <template #actions>
      <BaseButton variant="ghost" @click="router.push('/app/profile')">Huỷ</BaseButton>
      <BaseButton variant="primary" @click="save">Lưu thay đổi</BaseButton>
    </template>

    <div class="edit-layout">
      <!-- avatar -->
      <GroupBox title="Ảnh đại diện">
        <div class="avatar-section">
          <BaseAvatar name="Nguyễn Văn A" size="xl" />
          <div class="avatar-actions">
            <BaseButton size="sm" variant="secondary">Tải ảnh mới</BaseButton>
            <BaseButton size="sm" variant="ghost">Xoá ảnh</BaseButton>
          </div>
          <p class="avatar-hint">PNG, JPG hoặc GIF. Tối đa 2MB. Khuyến nghị 200×200px.</p>
        </div>
      </GroupBox>

      <!-- basic info -->
      <GroupBox title="Thông tin cơ bản">
        <div class="form-grid">
          <FormField label="Họ và tên" required>
            <BaseInput v-model="name" placeholder="Nhập họ và tên" />
          </FormField>
          <FormField label="Email" required>
            <BaseInput v-model="email" type="email" placeholder="email@example.com" />
          </FormField>
          <FormField label="Số điện thoại">
            <BaseInput v-model="phone" placeholder="0xxx xxx xxx" />
          </FormField>
          <FormField label="Địa điểm">
            <BaseInput v-model="location" placeholder="Thành phố, Quốc gia" />
          </FormField>
          <FormField label="Website" :class="'full-width'">
            <BaseInput v-model="website" placeholder="https://" />
          </FormField>
          <FormField label="Giới thiệu" :class="'full-width'" hint="Tối đa 300 ký tự. Hiển thị trên trang hồ sơ công khai.">
            <textarea v-model="bio" class="bio-input" rows="4" placeholder="Mô tả ngắn về bản thân..." />
          </FormField>
        </div>
      </GroupBox>

      <!-- social -->
      <GroupBox title="Mạng xã hội">
        <div class="form-grid">
          <FormField label="GitHub">
            <BaseInput v-model="github" placeholder="username" prefix="github.com/" />
          </FormField>
          <FormField label="LinkedIn">
            <BaseInput v-model="linkedin" placeholder="username" prefix="linkedin.com/in/" />
          </FormField>
        </div>
      </GroupBox>

      <div class="form-footer">
        <BaseButton variant="primary" size="lg" @click="save">Lưu thay đổi</BaseButton>
        <BaseButton variant="ghost" size="lg" @click="router.push('/app/profile')">Huỷ bỏ</BaseButton>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.edit-layout { display: flex; flex-direction: column; gap: var(--wx-space-5); max-width: 680px; }
.avatar-section { display: flex; align-items: center; gap: var(--wx-space-5); flex-wrap: wrap; }
.avatar-actions { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.avatar-hint { font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin: 0; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-4); }
.form-grid :deep(.full-width) { grid-column: 1 / -1; }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
.bio-input { width: 100%; padding: var(--wx-space-2) var(--wx-space-3); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); background: var(--wx-bg-base); color: var(--wx-content-primary); font-size: var(--wx-fs-14); font-family: inherit; resize: vertical; line-height: var(--wx-lh-normal); }
.bio-input:focus { outline: none; border-color: var(--wx-border-focus); box-shadow: var(--wx-shadow-focus); }
.form-footer { display: flex; gap: var(--wx-space-3); }
</style>
