<script setup lang="ts">
import { ref } from 'vue'
import { ConfirmDialog, BaseButton } from '../../../components/common'
import { useToast } from '../../../composables'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const { showToast } = useToast()

/* ── (a) delete (danger) ── */
const showDelete = ref(false)
function confirmDelete() {
  showDelete.value = false
  showToast('success', 'Đã xoá bản ghi')
}

/* ── (b) archive (warning) ── */
const showArchive = ref(false)
function confirmArchive() {
  showArchive.value = false
  showToast('info', 'Đã chuyển vào lưu trữ')
}

/* ── (c) loading on confirm ── */
const showLoading = ref(false)
const loading = ref(false)
function confirmLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showLoading.value = false
    showToast('success', 'Đã thu hồi quyền truy cập')
  }, 1400)
}

const deleteCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
function onConfirm() {
  show.value = false
  // ... gọi API xoá
}
<\/script>

<template>
  <BaseButton variant="danger" @click="show = true">Xoá bản ghi</BaseButton>

  <ConfirmDialog
    v-model="show"
    title="Xoá bản ghi?"
    description="Hành động này không thể hoàn tác. Dữ liệu sẽ bị xoá vĩnh viễn."
    intent="danger"
    confirm-label="Xoá"
    @confirm="onConfirm"
  />
<\/template>`

const warningCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
function onConfirm() { show.value = false /* ... */ }
<\/script>

<template>
  <BaseButton variant="warning" @click="show = true">Lưu trữ</BaseButton>

  <ConfirmDialog
    v-model="show"
    title="Lưu trữ mục này?"
    description="Mục sẽ được ẩn khỏi danh sách chính nhưng có thể khôi phục sau."
    intent="warning"
    confirm-label="Lưu trữ"
    @confirm="onConfirm"
  />
<\/template>`

const loadingCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
const loading = ref(false)

function onConfirm() {
  loading.value = true
  // giữ dialog mở + spinner cho tới khi request xong
  setTimeout(() => {
    loading.value = false
    show.value = false
  }, 1400)
}
<\/script>

<template>
  <BaseButton variant="danger" @click="show = true">Thu hồi quyền</BaseButton>

  <ConfirmDialog
    v-model="show"
    title="Thu hồi quyền truy cập?"
    description="Người dùng sẽ mất quyền ngay lập tức."
    intent="danger"
    confirm-label="Thu hồi"
    :loading="loading"
    @confirm="onConfirm"
  />
<\/template>`

const props: PropRow[] = [
  { name: 'modelValue', type: 'boolean', desc: 'Trạng thái hiện / ẩn — dùng qua v-model.' },
  { name: 'title', type: 'string', desc: 'Câu hỏi xác nhận hiển thị ở header.' },
  { name: 'description', type: 'string', desc: 'Mô tả hệ quả của hành động, hiện dưới icon.' },
  { name: 'intent', type: "'danger' | 'warning' | 'info'", default: "'danger'", desc: 'Sắc thái — quyết định icon và màu nút xác nhận.' },
  { name: 'confirmLabel', type: 'string', default: "'Xác nhận'", desc: 'Nhãn nút xác nhận.' },
  { name: 'cancelLabel', type: 'string', default: "'Huỷ'", desc: 'Nhãn nút huỷ.' },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'Hiện spinner trên nút xác nhận và khoá thao tác.' },
]

const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: boolean) => void', desc: 'Phát khi đóng dialog (nút Huỷ, X, hoặc nền mờ) — đồng bộ v-model.' },
  { name: 'confirm', type: '() => void', desc: 'Phát khi bấm nút xác nhận.' },
]
</script>

<template>
  <DocPage
    name="ConfirmDialog"
    category="Mẫu Form (Popup)"
    description="Hộp thoại xác nhận có icon + mô tả cho các hành động cần cân nhắc: xoá, lưu trữ, thu hồi, reset. Ba sắc thái danger / warning / info quyết định icon và màu nút."
    :imports="['ConfirmDialog']"
  >
    <h2>Xác nhận xoá (danger)</h2>
    <p>Điều khiển bằng <code class="inline">v-model</code>; lắng nghe <code class="inline">@confirm</code> để thực thi hành động rồi đóng. <code class="inline">intent="danger"</code> cho icon cảnh báo và nút đỏ.</p>
    <DemoBlock :code="deleteCode">
      <BaseButton variant="danger" @click="showDelete = true">Xoá bản ghi</BaseButton>
      <ConfirmDialog
        v-model="showDelete"
        title="Xoá bản ghi?"
        description="Hành động này không thể hoàn tác. Dữ liệu sẽ bị xoá vĩnh viễn."
        intent="danger"
        confirm-label="Xoá"
        @confirm="confirmDelete"
      />
    </DemoBlock>

    <h2>Sắc thái warning</h2>
    <p>Dùng <code class="inline">intent="warning"</code> cho hành động có thể đảo ngược như lưu trữ — icon vàng, nút màu cảnh báo.</p>
    <DemoBlock :code="warningCode">
      <BaseButton variant="warning" @click="showArchive = true">Lưu trữ</BaseButton>
      <ConfirmDialog
        v-model="showArchive"
        title="Lưu trữ mục này?"
        description="Mục sẽ được ẩn khỏi danh sách chính nhưng có thể khôi phục sau."
        intent="warning"
        confirm-label="Lưu trữ"
        @confirm="confirmArchive"
      />
    </DemoBlock>

    <h2>Trạng thái loading</h2>
    <p>Bật <code class="inline">loading</code> trong lúc gọi API: nút xác nhận hiện spinner và dialog giữ nguyên cho tới khi xử lý xong.</p>
    <DemoBlock :code="loadingCode">
      <BaseButton variant="danger" @click="showLoading = true">Thu hồi quyền</BaseButton>
      <ConfirmDialog
        v-model="showLoading"
        title="Thu hồi quyền truy cập?"
        description="Người dùng sẽ mất quyền ngay lập tức."
        intent="danger"
        confirm-label="Thu hồi"
        :loading="loading"
        @confirm="confirmLoading"
      />
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />

    <h2>Sự kiện</h2>
    <PropsTable :rows="emits" name-label="Event" hide-default />
  </DocPage>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
