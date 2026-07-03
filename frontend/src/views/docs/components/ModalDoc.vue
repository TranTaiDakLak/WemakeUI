<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, BaseButton } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const showBasic = ref(false)

const showSized = ref(false)
const size = ref<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md')
function openSize(s: 'sm' | 'md' | 'lg' | 'xl' | 'full') {
  size.value = s
  showSized.value = true
}

const showDanger = ref(false)

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
<\/script>

<template>
  <BaseButton @click="show = true">Mở modal</BaseButton>
  <BaseModal
    :show="show"
    title="Thông tin tài khoản"
    @close="show = false"
  >
    <p>Đây là nội dung body của modal. Bấm Đóng hoặc nền mờ để thoát.</p>
  </BaseModal>
<\/template>`

const sizeCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
const size = ref<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md')
function open(s: typeof size.value) { size.value = s; show.value = true }
<\/script>

<template>
  <BaseButton @click="open('sm')">sm</BaseButton>
  <BaseButton @click="open('md')">md</BaseButton>
  <BaseButton @click="open('lg')">lg</BaseButton>
  <BaseButton @click="open('xl')">xl</BaseButton>
  <BaseButton @click="open('full')">full</BaseButton>

  <BaseModal :show="show" :size="size" :title="\`Kích thước: \${size}\`" @close="show = false">
    <p>Modal kích thước {{ size }}.</p>
  </BaseModal>
<\/template>`

const dangerCode = `<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
<\/script>

<template>
  <BaseButton variant="danger" @click="show = true">Xóa bản ghi</BaseButton>
  <BaseModal
    :show="show"
    intent="danger"
    title="Xác nhận xóa"
    save-label="Xóa"
    show-save
    @save="show = false"
    @close="show = false"
  >
    <p>Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa?</p>
  </BaseModal>
<\/template>`

const props: PropRow[] = [
  { name: 'show', type: 'boolean', desc: 'Hiện / ẩn modal.' },
  { name: 'title', type: 'string', desc: 'Tiêu đề hiển thị ở header.' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", desc: 'Chiều rộng tối đa của dialog.' },
  { name: 'showSave', type: 'boolean', default: 'false', desc: 'Hiện nút lưu mặc định ở footer.' },
  { name: 'saveLabel', type: 'string', default: "'Lưu'", desc: 'Nhãn nút lưu.' },
  { name: 'closeLabel', type: 'string', default: "'Đóng'", desc: 'Nhãn nút đóng.' },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'Hiện spinner trên nút lưu và khóa nút.' },
  { name: 'intent', type: "'default' | 'danger' | 'warning'", default: "'default'", desc: 'Sắc thái viền / bóng của dialog.' },
  { name: 'closable', type: 'boolean', default: 'true', desc: 'Hiện nút đóng (X) ở header.' },
]

const emits: PropRow[] = [
  { name: 'close', type: '() => void', desc: 'Phát khi đóng modal (nút X, nút Đóng, ESC, hoặc click nền mờ).' },
  { name: 'save', type: '() => void', desc: 'Phát khi bấm nút lưu.' },
]

const slots: PropRow[] = [
  { name: 'default', type: '—', desc: 'Nội dung body của modal.' },
  { name: 'footer', type: '—', desc: 'Thay thế toàn bộ footer mặc định (nút lưu / đóng).' },
]
</script>

<template>
  <DocPage
    name="BaseModal"
    category="Lớp phủ"
    description="Hộp thoại nổi trên nền mờ — 5 kích thước, sắc thái default / danger / warning, focus trap, đóng bằng ESC và footer tùy biến."
    :imports="['BaseModal']"
  >
    <h2>Cơ bản</h2>
    <p>Dùng một <code class="inline">ref</code> điều khiển prop <code class="inline">show</code>; lắng nghe <code class="inline">@close</code> để đặt lại về <code class="inline">false</code>. Modal được teleport ra <code class="inline">body</code> và phủ lên toàn trang.</p>
    <DemoBlock :code="basicCode">
      <BaseButton @click="showBasic = true">Mở modal</BaseButton>
      <BaseModal :show="showBasic" title="Thông tin tài khoản" @close="showBasic = false">
        <p style="margin:0">Đây là nội dung body của modal. Bấm Đóng hoặc nền mờ để thoát.</p>
      </BaseModal>
    </DemoBlock>

    <h2>Kích thước</h2>
    <p>Năm mức <code class="inline">size</code> — từ <code class="inline">sm</code> đến <code class="inline">full</code>. Bấm từng nút để mở modal tương ứng.</p>
    <DemoBlock :code="sizeCode">
      <div class="row">
        <BaseButton @click="openSize('sm')">sm</BaseButton>
        <BaseButton @click="openSize('md')">md</BaseButton>
        <BaseButton @click="openSize('lg')">lg</BaseButton>
        <BaseButton @click="openSize('xl')">xl</BaseButton>
        <BaseButton @click="openSize('full')">full</BaseButton>
      </div>
      <BaseModal :show="showSized" :size="size" :title="`Kích thước: ${size}`" @close="showSized = false">
        <p style="margin:0">Modal kích thước {{ size }}.</p>
      </BaseModal>
    </DemoBlock>

    <h2>Sắc thái danger</h2>
    <p>Đặt <code class="inline">intent="danger"</code> cho hộp thoại xác nhận phá hủy; kết hợp <code class="inline">show-save</code> và <code class="inline">save-label</code> để có nút hành động.</p>
    <DemoBlock :code="dangerCode">
      <BaseButton variant="danger" @click="showDanger = true">Xóa bản ghi</BaseButton>
      <BaseModal
        :show="showDanger"
        intent="danger"
        title="Xác nhận xóa"
        save-label="Xóa"
        show-save
        @save="showDanger = false"
        @close="showDanger = false"
      >
        <p style="margin:0">Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa?</p>
      </BaseModal>
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
</style>
