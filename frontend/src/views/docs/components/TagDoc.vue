<script setup lang="ts">
import { ref } from 'vue'
import { BaseTag } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const variantCode = `<BaseTag variant="neutral" label="neutral" />
<BaseTag variant="primary" label="primary" />
<BaseTag variant="success" label="success" />
<BaseTag variant="warning" label="warning" />
<BaseTag variant="danger" label="danger" />
<BaseTag variant="info" label="info" />`

const removableCode = `<script setup lang="ts">
import { ref } from 'vue'
const tags = ref(['Vue', 'TypeScript', 'Vite', 'Pinia'])
function remove(t: string) {
  tags.value = tags.value.filter(x => x !== t)
}
<\/script>

<template>
  <BaseTag
    v-for="t in tags"
    :key="t"
    :label="t"
    variant="primary"
    removable
    @remove="remove(t)"
  />
<\/template>`

const shapeCode = `<BaseTag shape="pill" variant="primary" label="pill" />
<BaseTag shape="square" variant="primary" label="square" />`

const tags = ref(['Vue', 'TypeScript', 'Vite', 'Pinia'])
function remove(t: string) {
  tags.value = tags.value.filter(x => x !== t)
}

const props: PropRow[] = [
  { name: 'label', type: 'string', desc: 'Nội dung nhãn. Bị ghi đè nếu truyền slot mặc định.' },
  { name: 'variant', type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", desc: 'Kiểu màu của tag.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Kích thước tag.' },
  { name: 'removable', type: 'boolean', default: 'false', desc: 'Hiện nút xoá; bấm sẽ phát sự kiện remove.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hoá (mờ + ẩn nút xoá).' },
  { name: 'shape', type: "'pill' | 'square'", default: "'pill'", desc: 'Bo tròn dạng viên thuốc hoặc bo góc vuông nhẹ.' },
  { name: 'dot', type: 'boolean', default: 'false', desc: 'Hiện chấm màu trước nhãn.' },
]

const emits: PropRow[] = [
  { name: 'click', type: '(event: MouseEvent) => void', desc: 'Phát khi người dùng bấm vào tag.' },
  { name: 'remove', type: '(event: MouseEvent) => void', desc: 'Phát khi bấm nút xoá (chỉ khi removable và không disabled).' },
]
</script>

<template>
  <DocPage
    name="BaseTag"
    category="Hiển thị"
    description="Chip nhãn nhỏ có thể tương tác — 6 variant màu, 3 kích thước, hỗ trợ chấm màu, nút xoá và hai kiểu hình dạng pill / square."
    :imports="['BaseTag']"
  >
    <h2>Variant</h2>
    <p>6 variant màu phủ các ngữ cảnh phân loại phổ biến. Khác với <code class="inline">BaseBadge</code>, tag mang tính tương tác (click, xoá).</p>
    <DemoBlock :code="variantCode">
      <div class="row">
        <BaseTag variant="neutral" label="neutral" />
        <BaseTag variant="primary" label="primary" />
        <BaseTag variant="success" label="success" />
        <BaseTag variant="warning" label="warning" />
        <BaseTag variant="danger" label="danger" />
        <BaseTag variant="info" label="info" />
      </div>
    </DemoBlock>

    <h2>Có thể xoá</h2>
    <p>Bật <code class="inline">removable</code> và lắng nghe <code class="inline">@remove</code> để gỡ tag khỏi danh sách. Thử bấm nút x trên từng tag bên dưới.</p>
    <DemoBlock :code="removableCode">
      <div class="row">
        <BaseTag
          v-for="t in tags"
          :key="t"
          :label="t"
          variant="primary"
          removable
          @remove="remove(t)"
        />
        <span v-if="!tags.length" class="hint">Đã xoá hết — tải lại trang để khôi phục.</span>
      </div>
    </DemoBlock>

    <h2>Hình dạng</h2>
    <p><code class="inline">shape</code> chọn giữa <code class="inline">pill</code> (viên thuốc, mặc định) và <code class="inline">square</code> (bo góc vuông nhẹ).</p>
    <DemoBlock :code="shapeCode">
      <div class="row">
        <BaseTag shape="pill" variant="primary" label="pill" />
        <BaseTag shape="square" variant="primary" label="square" />
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
.hint {
  font-size: 13px;
  color: var(--wx-text-secondary);
}
</style>
