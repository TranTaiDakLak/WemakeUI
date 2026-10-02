<script setup lang="ts">
import { ref } from 'vue'
import { BaseSegmented } from '../../../components/common'
import type { SegmentedOption } from '../../../types'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const lang = ref('vi')
const range = ref('week')

const langOptions: SegmentedOption<string>[] = [
  { value: 'vi', label: 'VI' },
  { value: 'en', label: 'EN' },
]
const rangeOptions: SegmentedOption<string>[] = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
  { value: 'year', label: 'Năm', disabled: true },
]

const basicCode = `<BaseSegmented v-model="lang" :options="[
  { value: 'vi', label: 'VI' },
  { value: 'en', label: 'EN' },
]" aria-label="Ngôn ngữ" />`

const toneCode = `<BaseSegmented v-model="range" :options="rangeOptions" tone="neutral" />
<BaseSegmented v-model="range" :options="rangeOptions" size="sm" />
<BaseSegmented v-model="range" :options="rangeOptions" size="lg" />`

const blockCode = `<BaseSegmented v-model="range" :options="rangeOptions" block tone="neutral" />`

const props: PropRow[] = [
  { name: 'modelValue', type: 'T (string | number)', desc: 'Giá trị đang chọn (v-model).' },
  { name: 'options', type: 'SegmentedOption<T>[]', desc: '{ value, label?, icon?, title?, disabled? }. Chỉ icon thì nên có title (làm aria-label).' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Cao 24 / 28 / 34px (theo token control).' },
  { name: 'tone', type: "'primary' | 'neutral'", default: "'primary'", desc: 'primary: mục chọn xanh đặc chữ trắng; neutral: thẻ trắng nổi nhẹ.' },
  { name: 'block', type: 'boolean', default: 'false', desc: 'Giãn đều hết chiều ngang.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Khoá cả nhóm.' },
  { name: 'ariaLabel', type: 'string', desc: 'Nhãn nhóm cho screen reader.' },
]
const emits: PropRow[] = [
  { name: 'update:modelValue', type: '(value: T) => void', desc: 'Phát khi chọn mục mới (click hoặc phím mũi tên / Home / End).' },
]
</script>

<template>
  <DocPage
    name="BaseSegmented"
    category="Mẫu Panel (MindAds)"
    description="Nhóm nút chọn 1 trong N — đổi ngôn ngữ, chế độ xem, khoảng thời gian. role=radiogroup + roving tabindex."
    :imports="['BaseSegmented']"
  >
    <h2>Cơ bản</h2>
    <DemoBlock :code="basicCode">
      <BaseSegmented v-model="lang" :options="langOptions" aria-label="Ngôn ngữ" />
    </DemoBlock>

    <h2>Tone và size</h2>
    <p>Mục <code class="inline">disabled</code> bị bỏ qua khi điều hướng bằng phím.</p>
    <DemoBlock :code="toneCode">
      <div class="col">
        <BaseSegmented v-model="range" :options="rangeOptions" tone="neutral" aria-label="Khoảng thời gian" />
        <BaseSegmented v-model="range" :options="rangeOptions" size="sm" aria-label="Khoảng thời gian (sm)" />
        <BaseSegmented v-model="range" :options="rangeOptions" size="lg" aria-label="Khoảng thời gian (lg)" />
      </div>
    </DemoBlock>

    <h2>Block</h2>
    <DemoBlock :code="blockCode">
      <BaseSegmented v-model="range" :options="rangeOptions" block tone="neutral" aria-label="Khoảng thời gian (block)" />
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />
    <h2>Events</h2>
    <PropsTable :rows="emits" name-label="Event" hide-default />
  </DocPage>
</template>

<style scoped>
.col { display: flex; flex-direction: column; align-items: flex-start; gap: var(--wx-space-3); }
</style>
