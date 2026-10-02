<script setup lang="ts">
import { reactive } from 'vue'
import { BaseFormPanel, BaseButton, BaseOptionRow, BaseIconTile, BaseKbd } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></svg>'

const cols = reactive({ name: true, status: true, attachment: false })

const basicCode = `<BaseFormPanel
  title="Cột hiển thị"
  subtitle="Bật/tắt cột trong bảng"
  :icon="iconSvg"
  closable
  close-on-esc
  @close="open = false"
>
  <BaseOptionRow v-model="cols.name" label="Tên tài khoản" badge="Bắt buộc" />
  <BaseOptionRow v-model="cols.status" label="Trạng thái" />
  <BaseOptionRow v-model="cols.attachment" label="Tệp đính kèm" />

  <template #footer-hint>Kéo để sắp xếp</template>
  <template #footer>
    <BaseButton size="sm" variant="secondary">Mặc định</BaseButton>
    <BaseButton size="sm">Áp dụng</BaseButton>
  </template>
</BaseFormPanel>`

const scrollCode = `<!-- body-max-height: thân cuộn dọc với thanh cuộn mảnh 5px -->
<BaseFormPanel title="Danh sách dài" :width="320" :body-max-height="140" kbd="Esc">
  <BaseOptionRow v-for="n in 12" :key="n" :label="'Mục ' + n" indicator="check" />
</BaseFormPanel>`

const tileCode = `<BaseIconTile :icon="iconSvg" />
<BaseIconTile :icon="iconSvg" tone="success" size="lg" />
<BaseKbd>Esc</BaseKbd> <BaseKbd>Ctrl</BaseKbd> <BaseKbd>K</BaseKbd>`

const props: PropRow[] = [
  { name: 'title', type: 'string', desc: 'Tiêu đề (14px / 800).' },
  { name: 'subtitle', type: 'string', desc: 'Phụ đề nhỏ dưới tiêu đề (11px).' },
  { name: 'icon', type: 'string', desc: 'Chuỗi SVG/HTML cho icon-tile; hoặc dùng slot icon.' },
  { name: 'tone', type: "'brand' | 'blue' | 'success' | 'warning' | 'danger' | 'neutral'", default: "'brand'", desc: 'Tông gradient của icon-tile.' },
  { name: 'closable', type: 'boolean', default: 'false', desc: 'Hiện nút X ở góc phải đầu panel.' },
  { name: 'closeLabel', type: 'string', default: "'Đóng'", desc: 'aria-label / title cho nút X.' },
  { name: 'kbd', type: 'string', desc: 'Gợi ý phím tắt ở góc phải đầu panel (bỏ qua nếu closable).' },
  { name: 'closeOnEsc', type: 'boolean', default: 'false', desc: 'Nhấn Esc khi focus nằm trong panel → emit close (chỉ khi closable).' },
  { name: 'width', type: 'number | string', desc: 'Chiều rộng cố định (số = px). max-width luôn là 100%.' },
  { name: 'bodyMaxHeight', type: 'number | string', desc: 'Giới hạn chiều cao thân → cuộn dọc với thanh cuộn mảnh.' },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'Làm mờ thân panel và chặn tương tác.' },
  { name: 'flat', type: 'boolean', default: 'false', desc: 'Bỏ bóng nổi (khi nhúng sẵn trong card/popover khác).' },
]
const emits: PropRow[] = [
  { name: 'close', type: '() => void', desc: 'Nhấn nút X hoặc Esc (khi closeOnEsc).' },
]
const slots: PropRow[] = [
  { name: 'default', type: '—', desc: 'Thân panel.' },
  { name: 'icon', type: '—', desc: 'Thay nội dung icon-tile.' },
  { name: 'head-extra', type: '—', desc: 'Phụ kiện cạnh tiêu đề (badge, nút nhỏ).' },
  { name: 'footer', type: '—', desc: 'Cụm nút ở chân panel (căn phải).' },
  { name: 'footer-hint', type: '—', desc: 'Dòng gợi ý nhỏ trôi sang trái trong chân panel.' },
]
</script>

<template>
  <DocPage
    name="BaseFormPanel"
    category="Mẫu Panel (MindAds)"
    description="Khuôn form/popover V3: đầu (icon-tile + tiêu đề + phụ đề + nút đóng) / thân / chân (gợi ý + nút). Dùng cho popover cấu hình, panel nổi trong toolbar."
    :imports="['BaseFormPanel', 'BaseIconTile', 'BaseKbd']"
  >
    <h2>Cơ bản</h2>
    <p>Panel chỉ lo hình dạng và phát <code class="inline">close</code> — vị trí/đóng mở do host (<code class="inline">BasePopover</code>, <code class="inline">BaseDropdown</code>…) quyết định.</p>
    <DemoBlock :code="basicCode">
      <BaseFormPanel title="Cột hiển thị" subtitle="Bật/tắt cột trong bảng" :icon="ICON" closable close-on-esc :width="360">
        <BaseOptionRow v-model="cols.name" label="Tên tài khoản" badge="Bắt buộc" />
        <BaseOptionRow v-model="cols.status" label="Trạng thái" />
        <BaseOptionRow v-model="cols.attachment" label="Tệp đính kèm" />
        <template #footer-hint>Kéo để sắp xếp</template>
        <template #footer>
          <BaseButton size="sm" variant="secondary">Mặc định</BaseButton>
          <BaseButton size="sm">Áp dụng</BaseButton>
        </template>
      </BaseFormPanel>
    </DemoBlock>

    <h2>Thân cuộn</h2>
    <p><code class="inline">bodyMaxHeight</code> giữ panel gọn khi danh sách dài; thanh cuộn mảnh 5px theo token <code class="inline">--wx-scrollbar-width-thin</code>.</p>
    <DemoBlock :code="scrollCode">
      <BaseFormPanel title="Danh sách dài" :width="320" :body-max-height="140" kbd="Esc">
        <BaseOptionRow v-for="n in 12" :key="n" :label="'Mục ' + n" indicator="check" />
      </BaseFormPanel>
    </DemoBlock>

    <h2>Icon-tile và Kbd</h2>
    <p>Hai khối dựng sẵn của panel, dùng độc lập được: <code class="inline">BaseIconTile</code> (6 tông × 3 cỡ) và <code class="inline">BaseKbd</code> (phím tắt).</p>
    <DemoBlock :code="tileCode">
      <div class="row">
        <BaseIconTile :icon="ICON" />
        <BaseIconTile :icon="ICON" tone="success" size="lg" />
        <BaseIconTile :icon="ICON" tone="warning" size="sm" />
        <BaseIconTile :icon="ICON" tone="neutral" />
        <BaseKbd>Esc</BaseKbd><BaseKbd>Ctrl</BaseKbd><BaseKbd>K</BaseKbd>
      </div>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />
    <h2>Events</h2>
    <PropsTable :rows="emits" name-label="Event" hide-default />
    <h2>Slots</h2>
    <PropsTable :rows="slots" name-label="Slot" hide-default />
  </DocPage>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; gap: var(--wx-space-3); align-items: center; }
</style>
