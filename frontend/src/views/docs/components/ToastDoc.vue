<script setup lang="ts">
import { BaseButton } from '../../../components/common'
import { useToast } from '../../../composables'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const { showToast } = useToast()

const typesCode = `<script setup lang="ts">
import { useToast } from '@wemake/ui'
const { showToast } = useToast()
<\/script>

<template>
  <BaseButton variant="success" @click="showToast('success', 'Đã lưu thành công')">Success</BaseButton>
  <BaseButton variant="danger" @click="showToast('error', 'Có lỗi xảy ra')">Error</BaseButton>
  <BaseButton variant="warning" @click="showToast('warning', 'Hãy kiểm tra lại')">Warning</BaseButton>
  <BaseButton variant="secondary" @click="showToast('info', 'Thông tin tham khảo')">Info</BaseButton>
<\/template>`

const durationCode = `<script setup lang="ts">
import { useToast } from '@wemake/ui'
const { showToast } = useToast()
<\/script>

<template>
  <!-- Hiển thị 6 giây thay vì mặc định 3 giây -->
  <BaseButton variant="secondary" @click="showToast('info', 'Tồn tại 6 giây', 6000)">6 giây</BaseButton>

  <!-- duration = 0 → giữ mãi cho đến khi gọi removeToast(id) -->
  <BaseButton variant="warning" @click="showToast('warning', 'Giữ mãi cho tới khi đóng', 0)">Persistent</BaseButton>
<\/template>`

const api: PropRow[] = [
  { name: 'showToast(type, message, duration?)', type: "(type: ToastType, message: string, duration?: number) => void", desc: 'Hiện một toast mới. duration tính bằng ms, mặc định 3000. Truyền 0 để toast tồn tại mãi cho tới khi gọi removeToast.' },
  { name: 'removeToast(id)', type: '(id: number) => void', desc: 'Gỡ thủ công một toast theo id (id nằm trong từng phần tử của toasts).' },
  { name: 'toasts', type: 'ToastItem[]', desc: 'Mảng reactive các toast đang hiển thị (tối đa 5). Mỗi item: { id, type, message, duration }.' },
]

const types: PropRow[] = [
  { name: 'success', type: "'success'", desc: 'Hành động thành công — màu xanh.' },
  { name: 'error', type: "'error'", desc: 'Lỗi / thất bại — màu đỏ.' },
  { name: 'warning', type: "'warning'", desc: 'Cảnh báo cần chú ý — màu vàng.' },
  { name: 'info', type: "'info'", desc: 'Thông tin trung lập — màu xanh dương.' },
]
</script>

<template>
  <DocPage
    name="useToast"
    category="Phản hồi"
    description="Composable hiển thị thông báo nổi (toast) — 4 loại success/error/warning/info, tự ẩn sau thời lượng tùy chỉnh hoặc giữ mãi."
    :imports="['useToast']"
  >
    <h2>4 loại thông báo</h2>
    <p>Gọi <code class="inline">showToast(type, message)</code> với <code class="inline">type</code> là một trong <code class="inline">success</code>, <code class="inline">error</code>, <code class="inline">warning</code>, <code class="inline">info</code>. Toast tự ẩn sau 3 giây.</p>
    <DemoBlock :code="typesCode">
      <div class="row">
        <BaseButton variant="success" @click="showToast('success', 'Đã lưu thành công')">Success</BaseButton>
        <BaseButton variant="danger" @click="showToast('error', 'Có lỗi xảy ra')">Error</BaseButton>
        <BaseButton variant="warning" @click="showToast('warning', 'Hãy kiểm tra lại')">Warning</BaseButton>
        <BaseButton variant="secondary" @click="showToast('info', 'Thông tin tham khảo')">Info</BaseButton>
      </div>
    </DemoBlock>

    <h2>Tùy chỉnh thời lượng</h2>
    <p>Tham số thứ ba <code class="inline">duration</code> (ms) đặt thời gian hiển thị, mặc định <code class="inline">3000</code>. Đặt <code class="inline">duration = 0</code> để toast <strong>không tự ẩn</strong> — nó tồn tại cho tới khi bạn gọi <code class="inline">removeToast(id)</code> (BaseToast cũng có nút đóng để gỡ thủ công).</p>
    <DemoBlock :code="durationCode">
      <div class="row">
        <BaseButton variant="secondary" @click="showToast('info', 'Tồn tại 6 giây', 6000)">6 giây</BaseButton>
        <BaseButton variant="warning" @click="showToast('warning', 'Giữ mãi cho tới khi đóng', 0)">Persistent</BaseButton>
      </div>
    </DemoBlock>

    <h2>API</h2>
    <PropsTable :rows="api" name-label="Hàm / thuộc tính" hide-default />

    <h2>ToastType</h2>
    <PropsTable :rows="types" name-label="Loại" hide-default />
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
