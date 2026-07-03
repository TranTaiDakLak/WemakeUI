<script setup lang="ts">
import { ref } from 'vue'
import { BaseTextarea } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const note = ref('')
const bio = ref('')

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
const note = ref('')
<\/script>

<template>
  <BaseTextarea v-model="note" placeholder="Nhập ghi chú…" />
<\/template>`

const maxlengthCode = `<script setup lang="ts">
import { ref } from 'vue'
const bio = ref('')
<\/script>

<template>
  <BaseTextarea v-model="bio" placeholder="Giới thiệu ngắn…" :maxlength="120" />
  <small>{{ bio.length }}/120</small>
<\/template>`

const disabledCode = `<BaseTextarea
  :model-value="'Nội dung chỉ đọc, không sửa được.'"
  disabled
/>`

const props: PropRow[] = [
  { name: 'modelValue', type: 'string', desc: 'Nội dung văn bản (v-model).' },
  { name: 'placeholder', type: 'string', desc: 'Văn bản gợi ý khi rỗng.' },
  { name: 'rows', type: 'number', default: '3', desc: 'Số dòng hiển thị ban đầu.' },
  { name: 'maxlength', type: 'number | null', default: 'null', desc: 'Giới hạn số ký tự tối đa.' },
  { name: 'autosize', type: 'boolean', default: 'true', desc: 'Tự giãn chiều cao theo nội dung.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hóa ô nhập.' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: 'Chỉ đọc, không cho sửa.' },
  { name: 'invalid', type: 'boolean', default: 'false', desc: 'Tô viền lỗi.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Kích thước ô nhập.' },
]

const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: string) => void', desc: 'Phát khi nội dung thay đổi.' },
  { name: 'blur', type: '(event: FocusEvent) => void', desc: 'Phát khi ô nhập mất focus.' },
  { name: 'focus', type: '(event: FocusEvent) => void', desc: 'Phát khi ô nhập nhận focus.' },
]
</script>

<template>
  <DocPage
    name="BaseTextarea"
    category="Form"
    description="Ô nhập nhiều dòng — tự giãn chiều cao theo nội dung (autosize), hỗ trợ giới hạn ký tự, trạng thái lỗi và 3 kích thước."
    :imports="['BaseTextarea']"
  >
    <h2>Cơ bản (autosize)</h2>
    <p>Mặc định <code class="inline">autosize</code> bật — ô tự cao dần khi gõ thêm dòng.</p>
    <DemoBlock :code="basicCode">
      <div class="stack">
        <BaseTextarea v-model="note" placeholder="Nhập ghi chú…" />
      </div>
    </DemoBlock>

    <h2>Giới hạn ký tự</h2>
    <p>Dùng <code class="inline">maxlength</code> để chặn số ký tự và tự đếm bằng độ dài giá trị.</p>
    <DemoBlock :code="maxlengthCode">
      <div class="stack">
        <BaseTextarea v-model="bio" placeholder="Giới thiệu ngắn…" :maxlength="120" />
        <small>{{ bio.length }}/120</small>
      </div>
    </DemoBlock>

    <h2>Vô hiệu hóa</h2>
    <p><code class="inline">disabled</code> làm mờ và chặn nhập.</p>
    <DemoBlock :code="disabledCode">
      <div class="stack">
        <BaseTextarea :model-value="'Nội dung chỉ đọc, không sửa được.'" disabled />
      </div>
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
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 360px;
}
.stack small {
  font-size: 12px;
  color: var(--wx-text-muted);
}
</style>
