<script setup lang="ts">
import { ref } from 'vue'
import { BaseInput } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const name = ref('')
const pwd = ref('')
const qty = ref<number | string>(1)
const email = ref('')

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
<\/script>

<template>
  <BaseInput v-model="name" label="Họ tên" placeholder="Nhập họ tên…" />
<\/template>`

const typesCode = `<script setup lang="ts">
import { ref } from 'vue'
const pwd = ref('')
const qty = ref(1)
<\/script>

<template>
  <BaseInput v-model="pwd" type="password" label="Mật khẩu" placeholder="••••••" />
  <BaseInput v-model="qty" type="number" label="Số lượng" />
<\/template>`

const stateCode = `<BaseInput
  v-model="email"
  type="email"
  label="Email"
  placeholder="ban@vidu.com"
  error="Email không hợp lệ"
/>
<BaseInput label="Khóa" placeholder="Không sửa được" disabled />`

const sizeCode = `<BaseInput size="sm" placeholder="size sm" />
<BaseInput size="md" placeholder="size md" />`

const prefixCode = `<script setup lang="ts">
const searchIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/>' +
  '<path d="M21 21l-4.3-4.3"/></svg>'
<\/script>

<template>
  <BaseInput v-model="query" placeholder="Tìm kiếm…">
    <template #prefix><span v-html="searchIcon" /></template>
  </BaseInput>
<\/template>`

const searchIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>'

const props: PropRow[] = [
  { name: 'modelValue', type: 'string | number', desc: 'Giá trị input (v-model).' },
  { name: 'type', type: "'text' | 'number' | 'password' | 'email' | 'search' | 'tel' | 'url'", default: "'text'", desc: 'Kiểu input. password tự thêm nút bật/tắt hiển thị.' },
  { name: 'label', type: 'string', desc: 'Nhãn hiển thị phía trên ô nhập.' },
  { name: 'placeholder', type: 'string', desc: 'Văn bản gợi ý khi rỗng.' },
  { name: 'error', type: 'string', desc: 'Thông báo lỗi — hiện chữ đỏ và viền đỏ.' },
  { name: 'invalid', type: 'boolean', default: 'false', desc: 'Chỉ tô viền lỗi, không kèm thông báo.' },
  { name: 'success', type: 'boolean', default: 'false', desc: 'Trạng thái hợp lệ với icon check.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hóa ô nhập.' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: 'Chỉ đọc, không cho sửa.' },
  { name: 'size', type: "'sm' | 'md'", default: "'md'", desc: 'Kích thước ô nhập.' },
  { name: 'align', type: "'left' | 'center' | 'right'", desc: 'Căn lề văn bản. Mặc định center cho type number.' },
]

const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: string | number) => void', desc: 'Phát khi giá trị thay đổi.' },
  { name: 'blur', type: '(event: FocusEvent) => void', desc: 'Phát khi ô nhập mất focus.' },
  { name: 'focus', type: '(event: FocusEvent) => void', desc: 'Phát khi ô nhập nhận focus.' },
]

const slots: PropRow[] = [
  { name: 'prefix', type: '—', desc: 'Icon / nội dung ngắn ở đầu ô (hộp 24px, đổi bằng --wx-input-prefix-w). Tự chừa padding-left; đổi màu theo focus / lỗi / disabled; bấm vào icon vẫn focus ô nhập.' },
]
</script>

<template>
  <DocPage
    name="BaseInput"
    category="Form"
    description="Ô nhập văn bản nền tảng — hỗ trợ nhiều type, nhãn, placeholder, trạng thái lỗi/thành công và 2 kích thước."
    :imports="['BaseInput']"
  >
    <h2>Cơ bản</h2>
    <p>Dùng <code class="inline">v-model</code> để liên kết giá trị, kèm <code class="inline">label</code> và <code class="inline">placeholder</code>.</p>
    <DemoBlock :code="basicCode">
      <div class="stack">
        <BaseInput v-model="name" label="Họ tên" placeholder="Nhập họ tên…" />
      </div>
    </DemoBlock>

    <h2>Các kiểu input</h2>
    <p><code class="inline">type="password"</code> tự thêm nút con mắt để bật/tắt hiển thị; <code class="inline">type="number"</code> căn giữa nội dung.</p>
    <DemoBlock :code="typesCode">
      <div class="stack">
        <BaseInput v-model="pwd" type="password" label="Mật khẩu" placeholder="••••••" />
        <BaseInput v-model="qty" type="number" label="Số lượng" />
      </div>
    </DemoBlock>

    <h2>Trạng thái</h2>
    <p><code class="inline">error</code> hiện thông báo đỏ kèm viền lỗi; <code class="inline">disabled</code> làm mờ và chặn nhập.</p>
    <DemoBlock :code="stateCode">
      <div class="stack">
        <BaseInput v-model="email" type="email" label="Email" placeholder="ban@vidu.com" error="Email không hợp lệ" />
        <BaseInput label="Khóa" placeholder="Không sửa được" disabled />
      </div>
    </DemoBlock>

    <h2>Kích thước</h2>
    <p>Hai kích thước <code class="inline">sm</code> và <code class="inline">md</code>.</p>
    <DemoBlock :code="sizeCode">
      <div class="stack">
        <BaseInput size="sm" placeholder="size sm" />
        <BaseInput size="md" placeholder="size md" />
      </div>
    </DemoBlock>

    <h2>Icon dẫn đầu (prefix)</h2>
    <p>Slot <code class="inline">#prefix</code> đặt icon ở đầu ô nhập; dùng được với <code class="inline">sm</code> / <code class="inline">md</code> và các trạng thái lỗi, disabled.</p>
    <DemoBlock :code="prefixCode">
      <div class="stack">
        <BaseInput placeholder="Tìm kiếm…">
          <template #prefix><span v-html="searchIcon" /></template>
        </BaseInput>
        <BaseInput size="sm" placeholder="Tìm kiếm (sm)…">
          <template #prefix><span v-html="searchIcon" /></template>
        </BaseInput>
      </div>
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
  gap: var(--wx-space-3);
  align-items: center;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
  max-width: 360px;
}
</style>
