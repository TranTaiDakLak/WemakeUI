<script setup lang="ts">
import { ref } from 'vue'
import { BaseRadio } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const plan = ref<string | number>('basic')
const ship = ref<string | number>('fast')
const locked = ref<string | number>('a')

const planOptions = [
  { value: 'basic', label: 'Cơ bản' },
  { value: 'pro', label: 'Chuyên nghiệp' },
  { value: 'enterprise', label: 'Doanh nghiệp' },
]

const shipOptions = [
  { value: 'fast', label: 'Nhanh' },
  { value: 'standard', label: 'Tiêu chuẩn' },
  { value: 'eco', label: 'Tiết kiệm' },
]

const lockedOptions = [
  { value: 'a', label: 'Lựa chọn A' },
  { value: 'b', label: 'Lựa chọn B' },
]

const verticalCode = `<script setup lang="ts">
import { ref } from 'vue'
const plan = ref('basic')
const planOptions = [
  { value: 'basic', label: 'Cơ bản' },
  { value: 'pro', label: 'Chuyên nghiệp' },
  { value: 'enterprise', label: 'Doanh nghiệp' },
]
<\/script>

<template>
  <BaseRadio
    v-model="plan"
    name="plan"
    label="Gói dịch vụ"
    :options="planOptions"
    direction="vertical"
  />
<\/template>`

const horizontalCode = `<BaseRadio
  v-model="ship"
  name="ship"
  label="Phương thức giao"
  :options="shipOptions"
  direction="horizontal"
/>`

const disabledCode = `<BaseRadio
  v-model="locked"
  name="locked"
  :options="lockedOptions"
  disabled
/>`

const props: PropRow[] = [
  { name: 'modelValue', type: 'string | number', desc: 'Giá trị đang chọn (v-model).' },
  { name: 'options', type: '{ value: string | number; label: string }[]', desc: 'Danh sách lựa chọn radio.' },
  { name: 'name', type: 'string', desc: 'Tên nhóm radio (bắt buộc) — gom các nút thành một nhóm.' },
  { name: 'label', type: 'string', desc: 'Nhãn nhóm hiển thị phía trên.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hóa toàn bộ nhóm.' },
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: 'Hướng sắp xếp các lựa chọn.' },
]

const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: string | number) => void', desc: 'Phát khi người dùng chọn mục khác.' },
]
</script>

<template>
  <DocPage
    name="BaseRadio"
    category="Form"
    description="Nhóm nút radio nền tảng — chọn một trong nhiều, hỗ trợ nhãn nhóm và bố cục ngang/dọc."
    :imports="['BaseRadio']"
  >
    <h2>Sắp xếp dọc</h2>
    <p>Dùng <code class="inline">direction="vertical"</code> để xếp các lựa chọn theo cột. Mỗi nhóm cần một <code class="inline">name</code> riêng.</p>
    <DemoBlock :code="verticalCode">
      <BaseRadio v-model="plan" name="plan" label="Gói dịch vụ" :options="planOptions" direction="vertical" />
    </DemoBlock>

    <h2>Sắp xếp ngang</h2>
    <p>Mặc định các lựa chọn xếp ngang — hợp khi nhãn ngắn.</p>
    <DemoBlock :code="horizontalCode">
      <BaseRadio v-model="ship" name="ship" label="Phương thức giao" :options="shipOptions" direction="horizontal" />
    </DemoBlock>

    <h2>Vô hiệu hóa</h2>
    <p><code class="inline">disabled</code> khóa toàn bộ nhóm.</p>
    <DemoBlock :code="disabledCode">
      <BaseRadio v-model="locked" name="locked" :options="lockedOptions" disabled />
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
