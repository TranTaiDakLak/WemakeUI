<script setup lang="ts">
import { ref } from 'vue'
import { FormDrawer, FormField, BaseInput, BaseSelect, BaseButton } from '../../../components/common'
import { useToast } from '../../../composables'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const { showToast } = useToast()

const statusOptions = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'paused', label: 'Tạm dừng' },
  { value: 'archived', label: 'Đã lưu trữ' },
]

/* ── (a) basic right ── */
const showRight = ref(false)
const form = ref({ name: '', phone: '', status: 'active' })
function submitRight() {
  showRight.value = false
  showToast('success', 'Đã lưu liên hệ')
}

/* ── (b) left placement ── */
const showLeft = ref(false)
function submitLeft() {
  showLeft.value = false
  showToast('success', 'Đã áp dụng bộ lọc')
}

/* ── (c) read-only / no submit ── */
const showInfo = ref(false)

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
const form = ref({ name: '', phone: '', status: 'active' })
const statusOptions = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'paused', label: 'Tạm dừng' },
  { value: 'archived', label: 'Đã lưu trữ' },
]
function onSubmit() {
  show.value = false
  // ... gọi API
}
<\/script>

<template>
  <BaseButton @click="show = true">Chỉnh sửa liên hệ</BaseButton>

  <FormDrawer v-model="show" title="Chỉnh sửa liên hệ" @submit="onSubmit">
    <FormField label="Tên" required>
      <BaseInput v-model="form.name" placeholder="Tên liên hệ" />
    </FormField>
    <FormField label="Số điện thoại">
      <BaseInput v-model="form.phone" type="tel" placeholder="09xx xxx xxx" />
    </FormField>
    <FormField label="Trạng thái">
      <BaseSelect v-model="form.status" :options="statusOptions" />
    </FormField>
  </FormDrawer>
<\/template>`

const leftCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
function onSubmit() { show.value = false /* ... */ }
<\/script>

<template>
  <BaseButton @click="show = true">Bộ lọc</BaseButton>

  <FormDrawer
    v-model="show"
    title="Bộ lọc nâng cao"
    placement="left"
    submit-label="Áp dụng"
    @submit="onSubmit"
  >
    <FormField label="Từ khoá">
      <BaseInput placeholder="Tìm theo tên..." />
    </FormField>
  </FormDrawer>
<\/template>`

const infoCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
<\/script>

<template>
  <BaseButton @click="show = true">Xem chi tiết</BaseButton>

  <!-- showSubmit=false → drawer chỉ-đọc, chỉ còn nút Huỷ (đóng) -->
  <FormDrawer
    v-model="show"
    title="Chi tiết bản ghi"
    :show-submit="false"
    cancel-label="Đóng"
  >
    <FormField label="Mã">
      <BaseInput model-value="REC-00128" readonly />
    </FormField>
    <FormField label="Người tạo">
      <BaseInput model-value="Nguyễn Văn A" readonly />
    </FormField>
  </FormDrawer>
<\/template>`

const props: PropRow[] = [
  { name: 'modelValue', type: 'boolean', desc: 'Trạng thái hiện / ẩn — dùng qua v-model.' },
  { name: 'title', type: 'string', desc: 'Tiêu đề hiển thị ở header.' },
  { name: 'placement', type: "'left' | 'right'", default: "'right'", desc: 'Cạnh trượt vào của panel.' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", desc: 'Chiều rộng của panel.' },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'Hiện spinner trên nút lưu và khoá thao tác.' },
  { name: 'submitLabel', type: 'string', default: "'Lưu'", desc: 'Nhãn nút submit chính.' },
  { name: 'cancelLabel', type: 'string', default: "'Huỷ'", desc: 'Nhãn nút huỷ / đóng.' },
  { name: 'danger', type: 'boolean', default: 'false', desc: 'Đổi nút submit sang variant danger.' },
  { name: 'submitDisabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hoá nút submit.' },
  { name: 'showSubmit', type: 'boolean', default: 'true', desc: 'Ẩn nút submit để biến drawer thành chỉ-đọc / thông tin.' },
]

const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: boolean) => void', desc: 'Phát khi đóng drawer — đồng bộ v-model.' },
  { name: 'submit', type: '() => void', desc: 'Phát khi bấm nút submit chính.' },
]

const slots: PropRow[] = [
  { name: 'default', type: '—', desc: 'Nội dung form (FormField + control). Các field xếp dọc với khoảng cách chuẩn.' },
]
</script>

<template>
  <DocPage
    name="FormDrawer"
    category="Mẫu Form (Popup)"
    description="Panel form trượt từ cạnh màn hình, dựng trên BaseDrawer — hợp cho form dài / nhiều field hơn FormModal. Hỗ trợ đặt bên trái / phải, loading và chế độ chỉ-đọc."
    :imports="['FormDrawer', 'FormField', 'BaseInput', 'BaseSelect']"
  >
    <h2>Cơ bản</h2>
    <p>Điều khiển bằng <code class="inline">v-model</code>; mặc định trượt từ cạnh phải. Đặt các <code class="inline">FormField</code> trong slot mặc định và xử lý <code class="inline">@submit</code>.</p>
    <DemoBlock :code="basicCode">
      <BaseButton @click="showRight = true">Chỉnh sửa liên hệ</BaseButton>
      <FormDrawer v-model="showRight" title="Chỉnh sửa liên hệ" @submit="submitRight">
        <FormField label="Tên" required>
          <BaseInput v-model="form.name" placeholder="Tên liên hệ" />
        </FormField>
        <FormField label="Số điện thoại">
          <BaseInput v-model="form.phone" type="tel" placeholder="09xx xxx xxx" />
        </FormField>
        <FormField label="Trạng thái">
          <BaseSelect v-model="form.status" :options="statusOptions" />
        </FormField>
      </FormDrawer>
    </DemoBlock>

    <h2>Đặt bên trái</h2>
    <p>Đặt <code class="inline">placement="left"</code> để panel trượt từ cạnh trái — thường dùng cho bộ lọc hoặc điều hướng phụ.</p>
    <DemoBlock :code="leftCode">
      <BaseButton @click="showLeft = true">Bộ lọc</BaseButton>
      <FormDrawer
        v-model="showLeft"
        title="Bộ lọc nâng cao"
        placement="left"
        submit-label="Áp dụng"
        @submit="submitLeft"
      >
        <FormField label="Từ khoá">
          <BaseInput placeholder="Tìm theo tên..." />
        </FormField>
      </FormDrawer>
    </DemoBlock>

    <h2>Chế độ chỉ-đọc</h2>
    <p>Đặt <code class="inline">:show-submit="false"</code> để bỏ nút lưu — drawer trở thành panel xem thông tin, chỉ còn nút đóng.</p>
    <DemoBlock :code="infoCode">
      <BaseButton @click="showInfo = true">Xem chi tiết</BaseButton>
      <FormDrawer
        v-model="showInfo"
        title="Chi tiết bản ghi"
        :show-submit="false"
        cancel-label="Đóng"
      >
        <FormField label="Mã">
          <BaseInput model-value="REC-00128" readonly />
        </FormField>
        <FormField label="Người tạo">
          <BaseInput model-value="Nguyễn Văn A" readonly />
        </FormField>
      </FormDrawer>
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
