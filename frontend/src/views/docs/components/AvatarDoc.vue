<script setup lang="ts">
import { BaseAvatar } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const sizeCode = `<BaseAvatar size="xs" src="https://i.pravatar.cc/100?img=1" />
<BaseAvatar size="sm" src="https://i.pravatar.cc/100?img=1" />
<BaseAvatar size="md" src="https://i.pravatar.cc/100?img=1" />
<BaseAvatar size="lg" src="https://i.pravatar.cc/100?img=1" />
<BaseAvatar size="xl" src="https://i.pravatar.cc/100?img=1" />`

const fallbackCode = `<BaseAvatar name="Nguyễn Văn An" />
<BaseAvatar name="Trần Bình" />
<BaseAvatar name="Lê" />
<BaseAvatar />`

const statusCode = `<BaseAvatar name="Online" status="online" />
<BaseAvatar name="Busy" status="busy" />
<BaseAvatar name="Away" status="away" />
<BaseAvatar name="Offline" status="offline" />`

const ringCode = `<BaseAvatar size="lg" ring src="https://i.pravatar.cc/100?img=5" />
<BaseAvatar size="lg" shape="square" src="https://i.pravatar.cc/100?img=8" />
<BaseAvatar size="lg" shape="square" ring name="WM" />`

const props: PropRow[] = [
  { name: 'src', type: 'string | null', default: 'null', desc: 'URL ảnh đại diện. Nếu trống sẽ rơi về chữ viết tắt hoặc icon.' },
  { name: 'name', type: 'string', default: "''", desc: 'Tên người dùng — dùng tạo chữ viết tắt khi không có ảnh.' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", desc: 'Kích thước (20 / 24 / 32 / 40 / 56px).' },
  { name: 'shape', type: "'circle' | 'square'", default: "'circle'", desc: 'Hình tròn hoặc bo góc vuông.' },
  { name: 'status', type: "'online' | 'offline' | 'busy' | 'away' | null", default: 'null', desc: 'Chấm trạng thái ở góc dưới phải.' },
  { name: 'ring', type: 'boolean', default: 'false', desc: 'Thêm viền nhấn quanh avatar.' },
  { name: 'alt', type: 'string', default: "''", desc: 'Văn bản thay thế cho ảnh (a11y).' },
]
</script>

<template>
  <DocPage
    name="BaseAvatar"
    category="Hiển thị"
    description="Ảnh đại diện với fallback chữ viết tắt / icon, 5 kích thước, chấm trạng thái, viền nhấn và hai kiểu hình dạng tròn / vuông."
    :imports="['BaseAvatar']"
  >
    <h2>Kích thước</h2>
    <p>Năm kích thước từ <code class="inline">xs</code> (20px) đến <code class="inline">xl</code> (56px).</p>
    <DemoBlock :code="sizeCode">
      <div class="row" style="align-items:center">
        <BaseAvatar size="xs" src="https://i.pravatar.cc/100?img=1" />
        <BaseAvatar size="sm" src="https://i.pravatar.cc/100?img=1" />
        <BaseAvatar size="md" src="https://i.pravatar.cc/100?img=1" />
        <BaseAvatar size="lg" src="https://i.pravatar.cc/100?img=1" />
        <BaseAvatar size="xl" src="https://i.pravatar.cc/100?img=1" />
      </div>
    </DemoBlock>

    <h2>Fallback chữ viết tắt</h2>
    <p>Khi không có <code class="inline">src</code>, avatar tự tạo chữ viết tắt từ <code class="inline">name</code>; nếu cũng không có tên thì hiện icon mặc định.</p>
    <DemoBlock :code="fallbackCode">
      <div class="row">
        <BaseAvatar name="Nguyễn Văn An" />
        <BaseAvatar name="Trần Bình" />
        <BaseAvatar name="Lê" />
        <BaseAvatar />
      </div>
    </DemoBlock>

    <h2>Trạng thái</h2>
    <p><code class="inline">status</code> thêm chấm màu ở góc dưới phải — hợp để báo trạng thái hiện diện của người dùng.</p>
    <DemoBlock :code="statusCode">
      <div class="row">
        <BaseAvatar name="Online" status="online" />
        <BaseAvatar name="Busy" status="busy" />
        <BaseAvatar name="Away" status="away" />
        <BaseAvatar name="Offline" status="offline" />
      </div>
    </DemoBlock>

    <h2>Viền &amp; hình vuông</h2>
    <p>Bật <code class="inline">ring</code> để thêm viền nhấn; <code class="inline">shape="square"</code> cho avatar bo góc vuông.</p>
    <DemoBlock :code="ringCode">
      <div class="row">
        <BaseAvatar size="lg" ring src="https://i.pravatar.cc/100?img=5" />
        <BaseAvatar size="lg" shape="square" src="https://i.pravatar.cc/100?img=8" />
        <BaseAvatar size="lg" shape="square" ring name="WM" />
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
  gap: 16px;
  align-items: center;
}
</style>
