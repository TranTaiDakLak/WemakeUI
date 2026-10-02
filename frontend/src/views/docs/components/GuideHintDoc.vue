<script setup lang="ts">
import { BaseGuideHint } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const basicCode = `<span>Chọn tài khoản</span>
<BaseGuideHint
  title="Cách chọn tài khoản"
  :steps="['Bấm vào hàng để chọn', 'Giữ Shift để chọn nhiều hàng', 'Chuột phải để mở menu thao tác']"
/>`

const labelCode = `<BaseGuideHint label="Tài liệu hướng dẫn" title="Hướng dẫn" :steps="['Mở tài liệu ở tab mới']" />`

const slotCode = `<BaseGuideHint title="Tuỳ biến">
  <p>Nội dung tự do thay cho danh sách bước.</p>
</BaseGuideHint>`

const props: PropRow[] = [
  { name: 'title', type: 'string', desc: 'Tiêu đề popover; cũng là aria-label khi không có label.' },
  { name: 'steps', type: 'string[]', desc: 'Danh sách bước (gạch đầu dòng).' },
  { name: 'label', type: 'string', desc: 'Có chữ → nút dạng pill 22px có nhãn thay vì chấm (i).' },
  { name: 'icon', type: 'string', desc: 'Chuỗi SVG/HTML thay icon (i) mặc định.' },
  { name: 'width', type: 'number', default: '240', desc: 'Chiều rộng popover (px).' },
  { name: 'boundary', type: 'string', desc: 'Selector tổ tiên làm khung lật hướng; mặc định [role=dialog] → body.' },
]
const slots: PropRow[] = [
  { name: 'default', type: '—', desc: 'Nội dung popover thay cho title/steps.' },
]
</script>

<template>
  <DocPage
    name="BaseGuideHint"
    category="Mẫu Panel (MindAds)"
    description="Dấu (i) nhỏ — rê chuột / focus để mở popover hướng dẫn. Tự lật hướng theo khoảng trống của modal chứa nó, không theo cả viewport."
    :imports="['BaseGuideHint']"
  >
    <h2>Cơ bản</h2>
    <p>Popover được Teleport ra <code class="inline">body</code>, đóng bằng Esc hoặc khi rời chuột/focus (trễ 150ms để rê sang popover).</p>
    <DemoBlock :code="basicCode">
      <div class="row">
        <span>Chọn tài khoản</span>
        <BaseGuideHint title="Cách chọn tài khoản" :steps="['Bấm vào hàng để chọn', 'Giữ Shift để chọn nhiều hàng', 'Chuột phải để mở menu thao tác']" />
      </div>
    </DemoBlock>

    <h2>Dạng pill có chữ</h2>
    <DemoBlock :code="labelCode">
      <BaseGuideHint label="Tài liệu hướng dẫn" title="Hướng dẫn" :steps="['Mở tài liệu ở tab mới']" />
    </DemoBlock>

    <h2>Nội dung tuỳ biến</h2>
    <DemoBlock :code="slotCode">
      <BaseGuideHint title="Tuỳ biến">
        <p style="margin: 0">Nội dung tự do thay cho danh sách bước.</p>
      </BaseGuideHint>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />
    <h2>Slots</h2>
    <PropsTable :rows="slots" name-label="Slot" hide-default />
  </DocPage>
</template>

<style scoped>
.row { display: flex; align-items: center; gap: var(--wx-space-2); }
</style>
