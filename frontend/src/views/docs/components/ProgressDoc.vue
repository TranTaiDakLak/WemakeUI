<script setup lang="ts">
import { BaseProgress } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const variantCode = `<BaseProgress variant="primary" :value="40" />
<BaseProgress variant="success" :value="100" />
<BaseProgress variant="warning" :value="60" />
<BaseProgress variant="danger" :value="25" />`

const sizeCode = `<BaseProgress size="sm" :value="60" />
<BaseProgress size="md" :value="60" />
<BaseProgress size="lg" :value="60" />`

const stripedCode = `<BaseProgress :value="50" striped />
<BaseProgress :value="70" striped animated variant="success" />`

const labelCode = `<BaseProgress :value="35" show-label />
<BaseProgress :value="80" show-label variant="success" />`

const props: PropRow[] = [
  { name: 'value', type: 'number', desc: 'Giá trị hiện tại (bắt buộc).' },
  { name: 'max', type: 'number', default: '100', desc: 'Giá trị tối đa để tính phần trăm.' },
  { name: 'variant', type: "'primary' | 'success' | 'warning' | 'error' | 'danger'", default: "'primary'", desc: 'Kiểu màu của thanh tiến trình.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Độ dày của thanh (4 / 8 / 12px).' },
  { name: 'striped', type: 'boolean', default: 'false', desc: 'Vẽ sọc chéo trên phần đã hoàn thành.' },
  { name: 'animated', type: 'boolean', default: 'false', desc: 'Cho sọc chạy động (tự bật sọc).' },
  { name: 'showLabel', type: 'boolean', default: 'false', desc: 'Hiện nhãn phần trăm bên phải.' },
]
</script>

<template>
  <DocPage
    name="BaseProgress"
    category="Hiển thị"
    description="Thanh tiến trình ngang — 5 variant màu, 3 độ dày, hỗ trợ sọc chạy động và nhãn phần trăm."
    :imports="['BaseProgress']"
  >
    <h2>Variant</h2>
    <p>Các variant màu cho từng ngữ cảnh — <code class="inline">success</code> khi hoàn tất, <code class="inline">danger</code> khi cảnh báo.</p>
    <DemoBlock :code="variantCode">
      <div class="stack">
        <BaseProgress variant="primary" :value="40" />
        <BaseProgress variant="success" :value="100" />
        <BaseProgress variant="warning" :value="60" />
        <BaseProgress variant="danger" :value="25" />
      </div>
    </DemoBlock>

    <h2>Kích thước</h2>
    <p>Ba độ dày từ <code class="inline">sm</code> (4px) đến <code class="inline">lg</code> (12px).</p>
    <DemoBlock :code="sizeCode">
      <div class="stack">
        <BaseProgress size="sm" :value="60" />
        <BaseProgress size="md" :value="60" />
        <BaseProgress size="lg" :value="60" />
      </div>
    </DemoBlock>

    <h2>Sọc &amp; chuyển động</h2>
    <p>Bật <code class="inline">striped</code> để vẽ sọc; thêm <code class="inline">animated</code> để sọc chạy động (tự bật sọc nếu chưa có).</p>
    <DemoBlock :code="stripedCode">
      <div class="stack">
        <BaseProgress :value="50" striped />
        <BaseProgress :value="70" striped animated variant="success" />
      </div>
    </DemoBlock>

    <h2>Nhãn phần trăm</h2>
    <p><code class="inline">show-label</code> hiện phần trăm đã hoàn thành ở bên phải thanh.</p>
    <DemoBlock :code="labelCode">
      <div class="stack">
        <BaseProgress :value="35" show-label />
        <BaseProgress :value="80" show-label variant="success" />
      </div>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />
  </DocPage>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
