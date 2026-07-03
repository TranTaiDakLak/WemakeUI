<script setup lang="ts">
import { BaseDropdown, BaseButton } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const basicCode = `<BaseDropdown>
  <template #trigger>
    <BaseButton variant="secondary">Tùy chọn ▾</BaseButton>
  </template>
  <template #default="{ close }">
    <div class="menu">
      <button class="menu-item" @click="close">Chỉnh sửa</button>
      <button class="menu-item" @click="close">Nhân bản</button>
      <div class="menu-divider" />
      <button class="menu-item menu-item--danger" @click="close">Xóa</button>
    </div>
  </template>
</BaseDropdown>`

const placementCode = `<BaseDropdown placement="bottom-start"> … </BaseDropdown>
<BaseDropdown placement="bottom-end"> … </BaseDropdown>
<BaseDropdown placement="top-start"> … </BaseDropdown>
<BaseDropdown placement="top-end"> … </BaseDropdown>`

const props: PropRow[] = [
  { name: 'placement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", default: "'bottom-start'", desc: 'Vị trí menu mở ra so với trigger.' },
]

const slots: PropRow[] = [
  { name: 'trigger', type: '—', desc: 'Phần tử bấm để mở / đóng menu.' },
  { name: 'default', type: '{ close }', desc: 'Nội dung menu. Slot prop close() đóng menu sau khi chọn.' },
]
</script>

<template>
  <DocPage
    name="BaseDropdown"
    category="Lớp phủ"
    description="Menu thả xuống bám theo trigger — tự đóng khi click ra ngoài, tự lật vị trí khi tràn viewport. Dùng slot trigger và slot default (kèm hàm close)."
    :imports="['BaseDropdown']"
  >
    <h2>Cơ bản</h2>
    <p>Đặt nút mở trong slot <code class="inline">#trigger</code>, danh sách mục trong slot mặc định. Slot prop <code class="inline">close</code> giúp đóng menu sau khi chọn một mục.</p>
    <DemoBlock :code="basicCode">
      <BaseDropdown>
        <template #trigger>
          <BaseButton variant="secondary">Tùy chọn ▾</BaseButton>
        </template>
        <template #default="{ close }">
          <div class="menu">
            <button class="menu-item" @click="close">Chỉnh sửa</button>
            <button class="menu-item" @click="close">Nhân bản</button>
            <div class="menu-divider" />
            <button class="menu-item menu-item--danger" @click="close">Xóa</button>
          </div>
        </template>
      </BaseDropdown>
    </DemoBlock>

    <h2>Vị trí mở</h2>
    <p>Bốn giá trị <code class="inline">placement</code> điều khiển góc menu xuất hiện so với trigger.</p>
    <DemoBlock :code="placementCode">
      <div class="row" style="gap:24px">
        <BaseDropdown placement="bottom-start">
          <template #trigger>
            <BaseButton variant="secondary">bottom-start</BaseButton>
          </template>
          <template #default="{ close }">
            <div class="menu">
              <button class="menu-item" @click="close">Mục 1</button>
              <button class="menu-item" @click="close">Mục 2</button>
            </div>
          </template>
        </BaseDropdown>

        <BaseDropdown placement="bottom-end">
          <template #trigger>
            <BaseButton variant="secondary">bottom-end</BaseButton>
          </template>
          <template #default="{ close }">
            <div class="menu">
              <button class="menu-item" @click="close">Mục 1</button>
              <button class="menu-item" @click="close">Mục 2</button>
            </div>
          </template>
        </BaseDropdown>

        <BaseDropdown placement="top-start">
          <template #trigger>
            <BaseButton variant="secondary">top-start</BaseButton>
          </template>
          <template #default="{ close }">
            <div class="menu">
              <button class="menu-item" @click="close">Mục 1</button>
              <button class="menu-item" @click="close">Mục 2</button>
            </div>
          </template>
        </BaseDropdown>

        <BaseDropdown placement="top-end">
          <template #trigger>
            <BaseButton variant="secondary">top-end</BaseButton>
          </template>
          <template #default="{ close }">
            <div class="menu">
              <button class="menu-item" @click="close">Mục 1</button>
              <button class="menu-item" @click="close">Mục 2</button>
            </div>
          </template>
        </BaseDropdown>
      </div>
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

/* Menu mẫu — markup gợi ý cho slot default của BaseDropdown */
.menu {
  display: flex;
  flex-direction: column;
  padding: 6px;
  min-width: 180px;
}
.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-text-primary);
  font-family: var(--wx-font-primary);
  font-size: 13.5px;
  text-align: left;
  cursor: pointer;
  transition: background var(--wx-d-fast, 150ms) ease, color var(--wx-d-fast, 150ms) ease;
}
.menu-item:hover {
  background: var(--wx-surface-sunken);
}
.menu-item--danger {
  color: var(--wx-danger, #ef4444);
}
.menu-item--danger:hover {
  background: color-mix(in srgb, var(--wx-danger, #ef4444) 12%, transparent);
}
.menu-divider {
  height: 1px;
  margin: 6px 4px;
  background: var(--wx-border-subtle);
}
</style>
