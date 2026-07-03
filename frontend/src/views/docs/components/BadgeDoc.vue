<script setup lang="ts">
import { BaseBadge } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const variantCode = `<BaseBadge variant="primary" text="primary" />
<BaseBadge variant="success" text="success" />
<BaseBadge variant="warning" text="warning" />
<BaseBadge variant="danger" text="danger" />
<BaseBadge variant="info" text="info" />
<BaseBadge variant="ghost" text="ghost" />
<BaseBadge variant="neutral" text="neutral" />`

const sizeCode = `<BaseBadge size="sm" text="sm" />
<BaseBadge size="md" text="md" />
<BaseBadge size="lg" text="lg" />`

const dotCode = `<BaseBadge variant="success" dot pulsing text="live" />
<BaseBadge variant="warning" dot text="đang chờ" />
<BaseBadge variant="danger" dot pulsing>Sự cố</BaseBadge>`

const solidCode = `<BaseBadge variant="danger" solid text="3" />
<BaseBadge variant="success" solid text="12" />
<BaseBadge variant="info" solid text="99+" />`

const props: PropRow[] = [
  { name: 'text', type: 'string | number', desc: 'Nội dung hiển thị. Bị ghi đè nếu truyền slot mặc định.' },
  { name: 'variant', type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost' | 'neutral'", default: "'primary'", desc: 'Kiểu màu của badge.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Kích thước badge.' },
  { name: 'dot', type: 'boolean', default: 'false', desc: 'Hiện chấm trạng thái. Nếu không có text/slot, badge thu lại thành chấm tròn.' },
  { name: 'pulsing', type: 'boolean', default: 'false', desc: 'Thêm hiệu ứng nhấp nháy (hợp với chỉ báo "live").' },
  { name: 'solid', type: 'boolean', default: 'false', desc: 'Nền đậm + chữ trắng + viền trắng, kiểu số thông báo.' },
]
</script>

<template>
  <DocPage
    name="BaseBadge"
    category="Hiển thị"
    description="Nhãn trạng thái nhỏ gọn — 7 variant màu, 3 kích thước, hỗ trợ chấm trạng thái, hiệu ứng nhấp nháy và kiểu số thông báo solid."
    :imports="['BaseBadge']"
  >
    <h2>Variant</h2>
    <p>7 variant màu cho các ngữ cảnh trạng thái khác nhau. Dùng <code class="inline">success</code> / <code class="inline">danger</code> để báo kết quả, <code class="inline">ghost</code> / <code class="inline">neutral</code> cho nhãn trung tính.</p>
    <DemoBlock :code="variantCode">
      <div class="row">
        <BaseBadge variant="primary" text="primary" />
        <BaseBadge variant="success" text="success" />
        <BaseBadge variant="warning" text="warning" />
        <BaseBadge variant="danger" text="danger" />
        <BaseBadge variant="info" text="info" />
        <BaseBadge variant="ghost" text="ghost" />
        <BaseBadge variant="neutral" text="neutral" />
      </div>
    </DemoBlock>

    <h2>Kích thước</h2>
    <p>Ba kích thước từ <code class="inline">sm</code> đến <code class="inline">lg</code>.</p>
    <DemoBlock :code="sizeCode">
      <div class="row" style="align-items:center">
        <BaseBadge size="sm" text="sm" />
        <BaseBadge size="md" text="md" />
        <BaseBadge size="lg" text="lg" />
      </div>
    </DemoBlock>

    <h2>Chấm trạng thái &amp; nhấp nháy</h2>
    <p>Bật <code class="inline">dot</code> để thêm chấm trạng thái trước nhãn; kết hợp <code class="inline">pulsing</code> cho chỉ báo "live" thu hút chú ý.</p>
    <DemoBlock :code="dotCode">
      <div class="row">
        <BaseBadge variant="success" dot pulsing text="live" />
        <BaseBadge variant="warning" dot text="đang chờ" />
        <BaseBadge variant="danger" dot pulsing>Sự cố</BaseBadge>
      </div>
    </DemoBlock>

    <h2>Solid</h2>
    <p><code class="inline">solid</code> cho kiểu số thông báo — nền đậm, chữ trắng, viền trắng — hợp khi gắn lên icon hoặc avatar.</p>
    <DemoBlock :code="solidCode">
      <div class="row">
        <BaseBadge variant="danger" solid text="3" />
        <BaseBadge variant="success" solid text="12" />
        <BaseBadge variant="info" solid text="99+" />
      </div>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />
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
