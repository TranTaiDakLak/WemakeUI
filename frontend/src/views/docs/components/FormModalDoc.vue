<script setup lang="ts">
import { ref } from 'vue'
import { FormModal, FormField, BaseInput, BaseSelect, BaseButton } from '../../../components/common'
import { useToast } from '../../../composables'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const { showToast } = useToast()

const roleOptions = [
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'editor', label: 'Biên tập viên' },
  { value: 'viewer', label: 'Người xem' },
]

/* ── (a) basic ── */
const showBasic = ref(false)
const basicForm = ref({ name: '', email: '', role: 'editor' })
function submitBasic() {
  showBasic.value = false
  showToast('success', `Đã thêm "${basicForm.value.name || 'người dùng mới'}"`)
}

/* ── (b) loading ── */
const showLoading = ref(false)
const loading = ref(false)
function submitLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showLoading.value = false
    showToast('success', 'Đã lưu thay đổi')
  }, 1400)
}

/* ── (c) danger ── */
const showDanger = ref(false)
function submitDanger() {
  showDanger.value = false
  showToast('warning', 'Đã vô hiệu hoá tài khoản')
}

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
const form = ref({ name: '', email: '', role: 'editor' })
const roleOptions = [
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'editor', label: 'Biên tập viên' },
  { value: 'viewer', label: 'Người xem' },
]
function onSubmit() {
  show.value = false
  // ... gọi API tạo bản ghi
}
<\/script>

<template>
  <BaseButton @click="show = true">Thêm người dùng</BaseButton>

  <FormModal v-model="show" title="Thêm người dùng" @submit="onSubmit">
    <div class="stack">
      <FormField label="Họ tên" required>
        <BaseInput v-model="form.name" placeholder="Nguyễn Văn A" />
      </FormField>
      <FormField label="Email" required>
        <BaseInput v-model="form.email" type="email" placeholder="a@vd.com" />
      </FormField>
      <FormField label="Vai trò">
        <BaseSelect v-model="form.role" :options="roleOptions" />
      </FormField>
    </div>
  </FormModal>
<\/template>`

const loadingCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
const loading = ref(false)
const form = ref({ title: '' })

function onSubmit() {
  loading.value = true
  // mô phỏng request — khoá nút + spinner trong lúc lưu
  setTimeout(() => {
    loading.value = false
    show.value = false
  }, 1400)
}
<\/script>

<template>
  <BaseButton @click="show = true">Sửa nhãn</BaseButton>

  <FormModal
    v-model="show"
    title="Đổi tên nhãn"
    :loading="loading"
    submit-label="Lưu thay đổi"
    @submit="onSubmit"
  >
    <FormField label="Tên nhãn">
      <BaseInput v-model="form.title" placeholder="Nhập tên mới" />
    </FormField>
  </FormModal>
<\/template>`

const dangerCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
function onSubmit() { show.value = false /* ... */ }
<\/script>

<template>
  <BaseButton variant="danger" @click="show = true">Vô hiệu hoá</BaseButton>

  <FormModal
    v-model="show"
    title="Vô hiệu hoá tài khoản"
    danger
    submit-label="Vô hiệu hoá"
    @submit="onSubmit"
  >
    <FormField label="Lý do (tuỳ chọn)">
      <BaseInput placeholder="Ghi chú nội bộ" />
    </FormField>
  </FormModal>
<\/template>`

const props: PropRow[] = [
  { name: 'modelValue', type: 'boolean', desc: 'Trạng thái hiện / ẩn — dùng qua v-model.' },
  { name: 'title', type: 'string', desc: 'Tiêu đề hiển thị ở header.' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", desc: 'Chiều rộng tối đa của dialog (ModalSize).' },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'Hiện spinner trên nút lưu và khoá thao tác.' },
  { name: 'submitLabel', type: 'string', default: "'Lưu'", desc: 'Nhãn nút submit chính.' },
  { name: 'cancelLabel', type: 'string', default: "'Huỷ'", desc: 'Nhãn nút huỷ.' },
  { name: 'danger', type: 'boolean', default: 'false', desc: 'Đổi nút submit sang variant danger.' },
  { name: 'submitDisabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hoá nút submit (ví dụ form chưa hợp lệ).' },
  { name: 'closable', type: 'boolean', default: 'true', desc: 'Hiện nút đóng (X) ở header.' },
  { name: 'closeOnBackdrop', type: 'boolean', default: 'false', desc: 'Cho phép đóng khi click vào nền mờ.' },
]

const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: boolean) => void', desc: 'Phát khi đóng modal (nút Huỷ, X, hoặc nền mờ) — đồng bộ v-model.' },
  { name: 'submit', type: '() => void', desc: 'Phát khi bấm nút submit chính.' },
]

const slots: PropRow[] = [
  { name: 'default', type: '—', desc: 'Nội dung form (FormField + control).' },
  { name: 'footer-extra', type: '—', desc: 'Nội dung phụ canh trái ở footer, bên cạnh cụm nút Huỷ / Lưu.' },
]
</script>

<template>
  <DocPage
    name="FormModal"
    category="Mẫu Form (Popup)"
    description="Mẫu popup form chuẩn dựng trên BaseModal — header tiêu đề, body là slot form, footer sẵn nút Huỷ / Lưu với trạng thái loading và biến thể danger."
    :imports="['FormModal', 'FormField', 'BaseInput', 'BaseSelect']"
  >
    <h2>Cơ bản</h2>
    <p>Điều khiển bằng <code class="inline">v-model</code>. Đặt các <code class="inline">FormField</code> + control bên trong slot mặc định; lắng nghe <code class="inline">@submit</code> để xử lý lưu rồi đóng popup.</p>
    <DemoBlock :code="basicCode">
      <BaseButton @click="showBasic = true">Thêm người dùng</BaseButton>
      <FormModal v-model="showBasic" title="Thêm người dùng" @submit="submitBasic">
        <div class="stack">
          <FormField label="Họ tên" required>
            <BaseInput v-model="basicForm.name" placeholder="Nguyễn Văn A" />
          </FormField>
          <FormField label="Email" required>
            <BaseInput v-model="basicForm.email" type="email" placeholder="a@vd.com" />
          </FormField>
          <FormField label="Vai trò">
            <BaseSelect v-model="basicForm.role" :options="roleOptions" />
          </FormField>
        </div>
      </FormModal>
    </DemoBlock>

    <h2>Trạng thái loading</h2>
    <p>Bật prop <code class="inline">loading</code> trong lúc gọi API: nút submit hiện spinner và khoá, nút Huỷ cũng bị vô hiệu hoá để tránh đóng giữa chừng.</p>
    <DemoBlock :code="loadingCode">
      <BaseButton @click="showLoading = true">Sửa nhãn</BaseButton>
      <FormModal
        v-model="showLoading"
        title="Đổi tên nhãn"
        :loading="loading"
        submit-label="Lưu thay đổi"
        @submit="submitLoading"
      >
        <FormField label="Tên nhãn">
          <BaseInput placeholder="Nhập tên mới" />
        </FormField>
      </FormModal>
    </DemoBlock>

    <h2>Biến thể danger</h2>
    <p>Đặt <code class="inline">danger</code> cho các form hành động phá hủy / rủi ro — nút submit chuyển sang màu đỏ.</p>
    <DemoBlock :code="dangerCode">
      <BaseButton variant="danger" @click="showDanger = true">Vô hiệu hoá</BaseButton>
      <FormModal
        v-model="showDanger"
        title="Vô hiệu hoá tài khoản"
        danger
        submit-label="Vô hiệu hoá"
        @submit="submitDanger"
      >
        <FormField label="Lý do (tuỳ chọn)">
          <BaseInput placeholder="Ghi chú nội bộ" />
        </FormField>
      </FormModal>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />

    <h2>Sự kiện</h2>
    <PropsTable :rows="emits" name-label="Event" hide-default />

    <h2>Slots</h2>
    <PropsTable :rows="slots" name-label="Slot" hide-default />
  </DocPage>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
