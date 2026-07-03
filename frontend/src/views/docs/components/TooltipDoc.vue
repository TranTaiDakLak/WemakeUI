<script setup lang="ts">
import { BaseTooltip, BaseButton } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const placementCode = `<BaseTooltip content="Tooltip phía trên" placement="top">
  <BaseButton variant="secondary">Top</BaseButton>
</BaseTooltip>
<BaseTooltip content="Tooltip bên phải" placement="right">
  <BaseButton variant="secondary">Right</BaseButton>
</BaseTooltip>
<BaseTooltip content="Tooltip phía dưới" placement="bottom">
  <BaseButton variant="secondary">Bottom</BaseButton>
</BaseTooltip>
<BaseTooltip content="Tooltip bên trái" placement="left">
  <BaseButton variant="secondary">Left</BaseButton>
</BaseTooltip>`

const delayCode = `<BaseTooltip content="Hiện ngay" :delay="0">
  <BaseButton>delay 0ms</BaseButton>
</BaseTooltip>
<BaseTooltip content="Trễ 800ms" :delay="800">
  <BaseButton>delay 800ms</BaseButton>
</BaseTooltip>`

const disabledCode = `<BaseTooltip content="Bạn sẽ không thấy tooltip này" disabled>
  <BaseButton variant="ghost">Tooltip bị tắt</BaseButton>
</BaseTooltip>`

const props: PropRow[] = [
  { name: 'content', type: 'string', desc: 'Nội dung text hiển thị trong tooltip.' },
  { name: 'placement', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", desc: 'Vị trí tooltip so với phần tử trigger.' },
  { name: 'delay', type: 'number', default: '300', desc: 'Độ trễ (ms) trước khi hiện tooltip khi hover.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Tắt tooltip — không hiện khi hover.' },
]

const slots: PropRow[] = [
  { name: 'default', type: '—', desc: 'Phần tử trigger được bọc bởi tooltip.' },
]
</script>

<template>
  <DocPage
    name="BaseTooltip"
    category="Lớp phủ"
    description="Tooltip hiện khi hover — 4 hướng đặt, độ trễ tùy chỉnh và có thể tắt. Bọc bất kỳ phần tử nào qua slot mặc định."
    :imports="['BaseTooltip']"
  >
    <h2>Hướng đặt</h2>
    <p>Bốn giá trị <code class="inline">placement</code> — <code class="inline">top</code> (mặc định), <code class="inline">right</code>, <code class="inline">bottom</code>, <code class="inline">left</code>. Di chuột vào từng nút để xem.</p>
    <DemoBlock :code="placementCode">
      <div class="row" style="gap:24px">
        <BaseTooltip content="Tooltip phía trên" placement="top">
          <BaseButton variant="secondary">Top</BaseButton>
        </BaseTooltip>
        <BaseTooltip content="Tooltip bên phải" placement="right">
          <BaseButton variant="secondary">Right</BaseButton>
        </BaseTooltip>
        <BaseTooltip content="Tooltip phía dưới" placement="bottom">
          <BaseButton variant="secondary">Bottom</BaseButton>
        </BaseTooltip>
        <BaseTooltip content="Tooltip bên trái" placement="left">
          <BaseButton variant="secondary">Left</BaseButton>
        </BaseTooltip>
      </div>
    </DemoBlock>

    <h2>Độ trễ</h2>
    <p>Điều chỉnh <code class="inline">delay</code> (ms) để tooltip hiện ngay hay chờ một nhịp.</p>
    <DemoBlock :code="delayCode">
      <div class="row">
        <BaseTooltip content="Hiện ngay" :delay="0">
          <BaseButton>delay 0ms</BaseButton>
        </BaseTooltip>
        <BaseTooltip content="Trễ 800ms" :delay="800">
          <BaseButton>delay 800ms</BaseButton>
        </BaseTooltip>
      </div>
    </DemoBlock>

    <h2>Vô hiệu hóa</h2>
    <p>Đặt <code class="inline">disabled</code> để tạm tắt tooltip mà vẫn giữ nguyên markup.</p>
    <DemoBlock :code="disabledCode">
      <BaseTooltip content="Bạn sẽ không thấy tooltip này" disabled>
        <BaseButton variant="ghost">Tooltip bị tắt</BaseButton>
      </BaseTooltip>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />

    <h2>Slots</h2>
    <PropsTable :rows="slots" name-label="Slot" hide-default />
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
