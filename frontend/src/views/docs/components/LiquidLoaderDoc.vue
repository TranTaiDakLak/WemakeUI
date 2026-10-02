<script setup lang="ts">
import { ref } from 'vue'
import { BaseLiquidLoader, BaseButton } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const show = ref(false)
function run() {
  show.value = true
  setTimeout(() => { show.value = false }, 2600)
}

const basicCode = `<!-- Phủ cả viewport (mặc định) -->
<BaseLiquidLoader :show="loading" text="Đang tải dữ liệu" />

<!-- Chỉ phủ container (cha cần position: relative) -->
<div style="position: relative; height: 220px">
  <BaseLiquidLoader :show="loading" :fullscreen="false" />
</div>`

const logoCode = `<BaseLiquidLoader :show="loading" compact>
  <template #logo><img src="/logo.png" alt="" /></template>
</BaseLiquidLoader>`

const props: PropRow[] = [
  { name: 'show', type: 'boolean', default: 'true', desc: 'Hiển thị lớp phủ (fade 400ms).' },
  { name: 'text', type: 'string', default: "'Đang tải dữ liệu'", desc: 'Dòng chữ chính; từng ký tự nảy lần lượt (screen reader đọc cả câu).' },
  { name: 'compact', type: 'boolean', default: 'false', desc: 'Thẻ 280px cho popup nhỏ / extension.' },
  { name: 'fullscreen', type: 'boolean', default: 'true', desc: 'true: fixed phủ viewport (z-index topmost); false: absolute phủ container cha.' },
]
const slots: PropRow[] = [
  { name: 'logo', type: '—', desc: 'Logo ở giữa (img/svg, 56px). Không truyền thì dùng huy hiệu gradient mặc định.' },
]
</script>

<template>
  <DocPage
    name="BaseLiquidLoader"
    category="Mẫu Panel (MindAds)"
    description="Lớp phủ loading kiểu liquid: thẻ kính mờ, blob biến hình quanh logo, vòng sáng thở, chữ nảy từng ký tự, thanh laser chạy ngang (không hiển thị %)."
    :imports="['BaseLiquidLoader']"
  >
    <p>Khi bật <code class="inline">prefers-reduced-motion</code>, các hiệu ứng trang trí dừng; thanh laser vẫn chạy chậm vì đó là tín hiệu "đang tải".</p>

    <h2>Cơ bản</h2>
    <DemoBlock :code="basicCode">
      <div class="stage">
        <BaseButton variant="secondary" @click="run">Hiện loader (2,6 giây)</BaseButton>
        <BaseLiquidLoader :show="show" :fullscreen="false" />
      </div>
    </DemoBlock>

    <h2>Logo riêng</h2>
    <DemoBlock :code="logoCode">
      <code class="inline">&lt;template #logo&gt;&lt;img … /&gt;&lt;/template&gt;</code>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />
    <h2>Slots</h2>
    <PropsTable :rows="slots" name-label="Slot" hide-default />
  </DocPage>
</template>

<style scoped>
.stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-sunken);
  overflow: hidden;
}
</style>
