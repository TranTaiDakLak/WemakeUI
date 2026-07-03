<script setup lang="ts">
import { ref } from 'vue'
import { BaseToggle } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const on = ref(true)
const notify = ref(false)

const basicCode = `<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
<\/script>

<template>
  <BaseToggle v-model="on" />
<\/template>`

const labelCode = `<BaseToggle v-model="notify" label="Nhận thông báo" />`

const disabledCode = `<BaseToggle :model-value="true" label="Đã khóa (bật)" disabled />
<BaseToggle :model-value="false" label="Đã khóa (tắt)" disabled />`

const props: PropRow[] = [
  { name: 'modelValue', type: 'boolean', desc: 'Trạng thái bật/tắt (v-model).' },
  { name: 'label', type: 'string', desc: 'Nhãn hiển thị cạnh công tắc.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hóa công tắc.' },
]

const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: boolean) => void', desc: 'Phát khi người dùng gạt công tắc.' },
]
</script>

<template>
  <DocPage
    name="BaseToggle"
    category="Form"
    description="Công tắc bật/tắt nền tảng — gọn nhẹ, hỗ trợ nhãn và trạng thái khóa."
    :imports="['BaseToggle']"
  >
    <h2>Cơ bản</h2>
    <p>Liên kết trạng thái bằng <code class="inline">v-model</code>.</p>
    <DemoBlock :code="basicCode">
      <BaseToggle v-model="on" />
    </DemoBlock>

    <h2>Kèm nhãn</h2>
    <p>Đặt <code class="inline">label</code> để mô tả lựa chọn bên cạnh công tắc.</p>
    <DemoBlock :code="labelCode">
      <BaseToggle v-model="notify" label="Nhận thông báo" />
    </DemoBlock>

    <h2>Vô hiệu hóa</h2>
    <p><code class="inline">disabled</code> làm mờ và chặn gạt.</p>
    <DemoBlock :code="disabledCode">
      <div class="row">
        <BaseToggle :model-value="true" label="Đã khóa (bật)" disabled />
        <BaseToggle :model-value="false" label="Đã khóa (tắt)" disabled />
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
