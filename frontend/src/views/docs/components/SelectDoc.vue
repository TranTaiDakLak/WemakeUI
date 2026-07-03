<script setup lang="ts">
import { ref } from 'vue'
import { BaseSelect } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const fruit = ref<string | number>('apple')
const city = ref<string | number>('hn')

const fruitOptions = [
  { value: 'apple', label: 'Táo' },
  { value: 'banana', label: 'Chuối' },
  { value: 'orange', label: 'Cam' },
]

const cityOptions = [
  { value: 'hn', label: 'Hà Nội', group: 'Miền Bắc' },
  { value: 'hp', label: 'Hải Phòng', group: 'Miền Bắc' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh', group: 'Miền Nam' },
  { value: 'ct', label: 'Cần Thơ', group: 'Miền Nam' },
]

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
const fruit = ref('apple')
const fruitOptions = [
  { value: 'apple', label: 'Táo' },
  { value: 'banana', label: 'Chuối' },
  { value: 'orange', label: 'Cam' },
]
<\/script>

<template>
  <BaseSelect v-model="fruit" :options="fruitOptions" label="Trái cây" />
<\/template>`

const groupCode = `<script setup lang="ts">
import { ref } from 'vue'
const city = ref('hn')
const cityOptions = [
  { value: 'hn', label: 'Hà Nội', group: 'Miền Bắc' },
  { value: 'hp', label: 'Hải Phòng', group: 'Miền Bắc' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh', group: 'Miền Nam' },
  { value: 'ct', label: 'Cần Thơ', group: 'Miền Nam' },
]
<\/script>

<template>
  <BaseSelect v-model="city" :options="cityOptions" label="Thành phố" />
<\/template>`

const disabledCode = `<BaseSelect :options="fruitOptions" label="Khóa" disabled />`

const props: PropRow[] = [
  { name: 'modelValue', type: 'string | number', desc: 'Giá trị đang chọn (v-model).' },
  { name: 'options', type: '{ value: string | number; label: string; group?: string }[]', desc: 'Danh sách lựa chọn. Khai báo group để gom nhóm bằng optgroup.' },
  { name: 'label', type: 'string', desc: 'Nhãn hiển thị phía trên ô chọn.' },
  { name: 'placeholder', type: 'string', desc: 'Mục giả gợi ý khi chưa chọn.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hóa ô chọn.' },
  { name: 'size', type: "'sm' | 'md'", default: "'md'", desc: 'Kích thước ô chọn.' },
]

const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: string | number) => void', desc: 'Phát khi người dùng chọn mục khác.' },
]
</script>

<template>
  <DocPage
    name="BaseSelect"
    category="Form"
    description="Ô chọn nền tảng dựa trên thẻ select gốc — hỗ trợ nhãn, placeholder, gom nhóm options và 2 kích thước."
    :imports="['BaseSelect']"
  >
    <h2>Cơ bản</h2>
    <p>Truyền mảng <code class="inline">options</code> gồm <code class="inline">value</code> và <code class="inline">label</code>, liên kết bằng <code class="inline">v-model</code>.</p>
    <DemoBlock :code="basicCode">
      <div class="stack">
        <BaseSelect v-model="fruit" :options="fruitOptions" label="Trái cây" />
      </div>
    </DemoBlock>

    <h2>Gom nhóm</h2>
    <p>Thêm <code class="inline">group</code> vào từng option để tự động gom thành các <code class="inline">optgroup</code>.</p>
    <DemoBlock :code="groupCode">
      <div class="stack">
        <BaseSelect v-model="city" :options="cityOptions" label="Thành phố" />
      </div>
    </DemoBlock>

    <h2>Vô hiệu hóa</h2>
    <p>Dùng <code class="inline">disabled</code> để khóa ô chọn.</p>
    <DemoBlock :code="disabledCode">
      <div class="stack">
        <BaseSelect :options="fruitOptions" label="Khóa" disabled />
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
</style>
