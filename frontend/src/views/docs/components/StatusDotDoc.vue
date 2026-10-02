<script setup lang="ts">
import { BaseStatusDot } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const basicCode = `<BaseStatusDot tone="success" pulse label="Hoạt động" show-label />
<BaseStatusDot tone="danger" pulse label="Lỗi" show-label />
<BaseStatusDot tone="warning" label="Chờ duyệt" show-label />
<BaseStatusDot tone="neutral" label="Chưa kiểm tra" show-label />`

const sizeCode = `<BaseStatusDot size="sm" /> <BaseStatusDot /> <BaseStatusDot size="lg" />

<!-- Không hiện chữ: truyền label để có role="img" + aria-label -->
<BaseStatusDot tone="success" pulse label="Đang hoạt động" />`

const props: PropRow[] = [
  { name: 'tone', type: "'success' | 'danger' | 'warning' | 'info' | 'neutral'", default: "'success'", desc: 'Màu chấm = màu solid của tông.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '6 / 8 / 10px.' },
  { name: 'pulse', type: 'boolean', default: 'false', desc: 'Nhịp tỏa sáng 2s; tự tắt khi prefers-reduced-motion.' },
  { name: 'label', type: 'string', desc: 'Nhãn cho screen reader; hiển thị cạnh chấm nếu showLabel.' },
  { name: 'showLabel', type: 'boolean', default: 'false', desc: 'Hiện label thành chữ cạnh chấm.' },
]
</script>

<template>
  <DocPage
    name="BaseStatusDot"
    category="Mẫu Panel (MindAds)"
    description="Chấm trạng thái nhỏ có thể nhấp nháy — dùng trong hàng bảng / danh sách bản ghi (Hoạt động, Lỗi, Chờ duyệt…)."
    :imports="['BaseStatusDot']"
  >
    <p>Khác <code class="inline">BaseBadge dot</code> (nhãn đầy đủ) và <code class="inline">LiveBadge</code> (gắn với vòng đời realtime): đây chỉ là tín hiệu thị giác tối giản.</p>

    <h2>Tone và pulse</h2>
    <DemoBlock :code="basicCode">
      <div class="row">
        <BaseStatusDot tone="success" pulse label="Hoạt động" show-label />
        <BaseStatusDot tone="danger" pulse label="Lỗi" show-label />
        <BaseStatusDot tone="warning" label="Chờ duyệt" show-label />
        <BaseStatusDot tone="neutral" label="Chưa kiểm tra" show-label />
      </div>
    </DemoBlock>

    <h2>Size và truy cập</h2>
    <DemoBlock :code="sizeCode">
      <div class="row">
        <BaseStatusDot size="sm" /> <BaseStatusDot /> <BaseStatusDot size="lg" />
        <BaseStatusDot tone="success" pulse label="Đang hoạt động" />
      </div>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />
  </DocPage>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--wx-space-4); }
</style>
