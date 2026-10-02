<script setup lang="ts">
import { reactive, ref } from 'vue'
import { BaseOptionRow, BaseOptionCard } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const SHEET = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></svg>'

const rows = reactive({ a: true, b: false, c: true })
const mode = ref<'all' | 'selected'>('all')
const pick = ref<string | null>(null)

const rowCode = `<BaseOptionRow v-model="a" label="Tên tài khoản" badge="Bắt buộc" />
<BaseOptionRow v-model="b" label="Trạng thái" description="Hoạt động / Tạm dừng / Chờ duyệt" />
<BaseOptionRow v-model="c" label="Cột đã ghim" highlight />
<BaseOptionRow label="Chỉ hiển thị" indicator="none" />`

const radioCode = `<BaseOptionRow
  :model-value="mode === 'all'"
  indicator="radio"
  label="Tất cả tài khoản"
  @update:model-value="mode = 'all'"
/>
<BaseOptionRow
  :model-value="mode === 'selected'"
  indicator="radio"
  label="Chỉ các dòng đã chọn"
  @update:model-value="mode = 'selected'"
/>`

const cardCode = `<BaseOptionCard title="Xuất Excel" description="Tệp .xlsx đầy đủ cột" :icon="sheetSvg" tone="success"
  :selected="pick === 'xlsx'" @click="pick = 'xlsx'" />
<BaseOptionCard title="Xuất PDF" description="Chưa hỗ trợ" :icon="sheetSvg" tone="neutral" disabled />`

const rowProps: PropRow[] = [
  { name: 'modelValue', type: 'boolean', default: 'false', desc: 'Trạng thái bật (v-model).' },
  { name: 'label', type: 'string', desc: 'Tên hàng; hoặc dùng slot mặc định.' },
  { name: 'description', type: 'string', desc: 'Dòng mô tả nhỏ dưới tên.' },
  { name: 'indicator', type: "'toggle' | 'radio' | 'check' | 'none'", default: "'toggle'", desc: 'Kiểu chỉ báo: công tắc 36×20 ở cuối, radio/check ở đầu, hoặc không có (chỉ hiển thị).' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Khoá hàng, giảm độ đậm.' },
  { name: 'highlight', type: 'boolean', default: 'false', desc: 'Nhấn mạnh (vd cột ghim): nền xanh nhạt + vạch trái 3px.' },
  { name: 'badge', type: 'string', desc: 'Nhãn nhỏ cạnh tên, kiểu "Bắt buộc" (ấm, viết hoa).' },
]
const rowSlots: PropRow[] = [
  { name: 'leading', type: '—', desc: 'Đầu hàng (tay kéo…). Click trong slot không bật/tắt hàng.' },
  { name: 'default', type: '—', desc: 'Thay phần tên.' },
  { name: 'trailing', type: '—', desc: 'Trước chỉ báo (nút ghim…). Click trong slot không bật/tắt hàng.' },
]
const cardProps: PropRow[] = [
  { name: 'title', type: 'string', desc: 'Tiêu đề (hoặc slot mặc định).' },
  { name: 'description', type: 'string', desc: 'Dòng mô tả (hoặc slot description).' },
  { name: 'icon', type: 'string', desc: 'Chuỗi SVG/HTML cho icon-tile; hoặc slot icon.' },
  { name: 'tone', type: "'brand' | 'blue' | 'success' | 'warning' | 'danger' | 'neutral'", default: "'blue'", desc: 'Tông icon-tile.' },
  { name: 'selected', type: 'boolean', default: 'false', desc: 'Giữ nền xanh như khi hover; đặt aria-pressed.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Khoá thẻ.' },
]
</script>

<template>
  <DocPage
    name="BaseOptionRow · BaseOptionCard"
    category="Mẫu Panel (MindAds)"
    description="Hàng chọn bật/tắt trong panel và thẻ chọn hành động (icon-tile + 2 dòng chữ). Cả hai là phần tử bàn phím được, có focus ring."
    :imports="['BaseOptionRow', 'BaseOptionCard']"
  >
    <h2>BaseOptionRow — công tắc</h2>
    <p>Cả hàng là vùng bấm; Space / Enter bật tắt. Dùng <code class="inline">badge</code> cho nhãn "Bắt buộc", <code class="inline">highlight</code> cho hàng nhấn mạnh.</p>
    <DemoBlock :code="rowCode">
      <div class="col">
        <BaseOptionRow v-model="rows.a" label="Tên tài khoản" badge="Bắt buộc" />
        <BaseOptionRow v-model="rows.b" label="Trạng thái" description="Hoạt động / Tạm dừng / Chờ duyệt" />
        <BaseOptionRow v-model="rows.c" label="Cột đã ghim" highlight />
        <BaseOptionRow label="Chỉ hiển thị" indicator="none" />
      </div>
    </DemoBlock>

    <h2>BaseOptionRow — radio (lựa chọn loại trừ)</h2>
    <p>Host tự bỏ chọn các hàng còn lại khi một hàng được chọn.</p>
    <DemoBlock :code="radioCode">
      <div class="col">
        <BaseOptionRow :model-value="mode === 'all'" indicator="radio" label="Tất cả tài khoản" @update:model-value="mode = 'all'" />
        <BaseOptionRow :model-value="mode === 'selected'" indicator="radio" label="Chỉ các dòng đã chọn" @update:model-value="mode = 'selected'" />
      </div>
    </DemoBlock>

    <h2>BaseOptionCard</h2>
    <DemoBlock :code="cardCode">
      <div class="col">
        <BaseOptionCard title="Xuất Excel" description="Tệp .xlsx đầy đủ cột" :icon="SHEET" tone="success" :selected="pick === 'xlsx'" @click="pick = 'xlsx'" />
        <BaseOptionCard title="Xuất JSON" description="Dành cho tích hợp" :icon="SHEET" tone="blue" :selected="pick === 'json'" @click="pick = 'json'" />
        <BaseOptionCard title="Xuất PDF" description="Chưa hỗ trợ" :icon="SHEET" tone="neutral" disabled />
      </div>
    </DemoBlock>

    <h2>BaseOptionRow — props</h2>
    <PropsTable :rows="rowProps" />
    <h2>BaseOptionRow — slots</h2>
    <PropsTable :rows="rowSlots" name-label="Slot" hide-default />
    <h2>BaseOptionCard — props</h2>
    <PropsTable :rows="cardProps" />
  </DocPage>
</template>

<style scoped>
.col { display: flex; flex-direction: column; gap: var(--wx-space-2); max-width: 360px; }
</style>
