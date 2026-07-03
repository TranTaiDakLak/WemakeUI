<script setup lang="ts">
import { ref } from 'vue'
import { BaseCheckbox } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const agree = ref(true)
const partial = ref(false)
const smChecked = ref(true)
const mdChecked = ref(true)

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
const agree = ref(true)
<\/script>

<template>
  <BaseCheckbox v-model="agree" label="Tôi đồng ý điều khoản" />
<\/template>`

const indeterminateCode = `<BaseCheckbox v-model="partial" :indeterminate="true" label="Chọn một phần" />`

const disabledCode = `<BaseCheckbox :model-value="true" label="Đã khóa (bật)" disabled />
<BaseCheckbox :model-value="false" label="Đã khóa (tắt)" disabled />`

const sizeCode = `<BaseCheckbox v-model="smChecked" size="sm" label="size sm" />
<BaseCheckbox v-model="mdChecked" size="md" label="size md" />`

const props: PropRow[] = [
  { name: 'modelValue', type: 'boolean', desc: 'Trạng thái đã tích hay chưa (v-model).' },
  { name: 'label', type: 'string', desc: 'Nhãn hiển thị cạnh ô tích.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hóa ô tích.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', desc: 'Hiển thị trạng thái nửa (dấu gạch).' },
  { name: 'error', type: 'boolean', default: 'false', desc: 'Tô màu lỗi cho ô tích và nhãn.' },
  { name: 'size', type: "'sm' | 'md'", default: "'md'", desc: 'Kích thước ô tích.' },
]

const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: boolean) => void', desc: 'Phát khi người dùng tích/bỏ tích.' },
]
</script>

<template>
  <DocPage
    name="BaseCheckbox"
    category="Form"
    description="Ô tích nền tảng — hỗ trợ nhãn, trạng thái nửa (indeterminate), trạng thái lỗi và 2 kích thước."
    :imports="['BaseCheckbox']"
  >
    <h2>Cơ bản</h2>
    <p>Liên kết trạng thái bằng <code class="inline">v-model</code> và đặt nhãn qua <code class="inline">label</code>.</p>
    <DemoBlock :code="basicCode">
      <BaseCheckbox v-model="agree" label="Tôi đồng ý điều khoản" />
    </DemoBlock>

    <h2>Trạng thái nửa</h2>
    <p><code class="inline">indeterminate</code> hiển thị dấu gạch — hợp cho ô "chọn tất cả" khi chỉ chọn một phần.</p>
    <DemoBlock :code="indeterminateCode">
      <BaseCheckbox v-model="partial" :indeterminate="true" label="Chọn một phần" />
    </DemoBlock>

    <h2>Vô hiệu hóa</h2>
    <p><code class="inline">disabled</code> làm mờ và chặn tương tác.</p>
    <DemoBlock :code="disabledCode">
      <div class="row">
        <BaseCheckbox :model-value="true" label="Đã khóa (bật)" disabled />
        <BaseCheckbox :model-value="false" label="Đã khóa (tắt)" disabled />
      </div>
    </DemoBlock>

    <h2>Kích thước</h2>
    <p>Hai kích thước <code class="inline">sm</code> và <code class="inline">md</code>.</p>
    <DemoBlock :code="sizeCode">
      <div class="row">
        <BaseCheckbox v-model="smChecked" size="sm" label="size sm" />
        <BaseCheckbox v-model="mdChecked" size="md" label="size md" />
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
</style>
