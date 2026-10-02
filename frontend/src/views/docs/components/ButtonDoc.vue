<script setup lang="ts">
import { BaseButton } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>'

const variantCode = `<BaseButton variant="primary">primary</BaseButton>
<BaseButton variant="secondary">secondary</BaseButton>
<BaseButton variant="neutral">neutral</BaseButton>
<BaseButton variant="success">success</BaseButton>
<BaseButton variant="danger">danger</BaseButton>
<BaseButton variant="warning">warning</BaseButton>
<BaseButton variant="ghost">ghost</BaseButton>
<BaseButton variant="link">link</BaseButton>
<BaseButton variant="cta">cta</BaseButton>`

const sizeCode = `<BaseButton size="sm">sm</BaseButton>
<BaseButton size="md">md</BaseButton>
<BaseButton size="lg">lg</BaseButton>
<BaseButton size="xl">xl</BaseButton>`

const stateCode = `<BaseButton>default</BaseButton>
<BaseButton loading>đang lưu</BaseButton>
<BaseButton disabled>disabled</BaseButton>`

const iconCode = `<script setup lang="ts">
const plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" ' +
  'fill="none" stroke="currentColor" stroke-width="2.2">' +
  '<path d="M12 5v14M5 12h14"/></svg>'
<\/script>

<template>
  <BaseButton :icon="plusIcon">Thêm mới</BaseButton>
  <BaseButton variant="secondary" :icon-right="plusIcon">Tiếp tục</BaseButton>
<\/template>`

const blockCode = `<BaseButton block>Nút full-width</BaseButton>`

const linkCode = `<!-- có href → render <a>; target="_blank" tự thêm rel="noopener noreferrer" -->
<BaseButton href="https://example.com" target="_blank" variant="secondary">Mở trang ngoài</BaseButton>

<!-- tag: truyền thẻ hoặc component (vd RouterLink) -->
<BaseButton :tag="RouterLink" to="/docs" variant="ghost">Về tài liệu</BaseButton>

<!-- disabled / loading: aria-disabled + tabindex=-1 + chặn điều hướng -->
<BaseButton href="/x" disabled>Không khả dụng</BaseButton>`

const props: PropRow[] = [
  { name: 'variant', type: "'primary' | 'secondary' | 'neutral' | 'ghost' | 'danger' | 'success' | 'warning' | 'cta' | 'link' | 'text'", default: "'primary'", desc: 'Kiểu hiển thị / màu sắc của nút.' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'icon'", default: "'md'", desc: "Kích thước. 'icon' cho nút chỉ chứa icon vuông." },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", desc: 'Thuộc tính type của thẻ button gốc.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Vô hiệu hóa nút.' },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'Hiện spinner và khóa tương tác.' },
  { name: 'icon', type: 'string', desc: 'Chuỗi HTML SVG hiện ở bên trái nhãn.' },
  { name: 'iconRight', type: 'string', desc: 'Chuỗi HTML SVG hiện ở bên phải nhãn.' },
  { name: 'block', type: 'boolean', default: 'false', desc: 'Trải rộng nút theo chiều ngang (full-width).' },
  { name: 'tag', type: 'string | Component', default: "'button' (hoặc 'a' khi có href)", desc: "Thẻ/component gốc, vd 'a' hoặc RouterLink (kèm to). Thẻ khác 'button' không gắn type; disabled/loading dùng aria-disabled." },
  { name: 'href', type: 'string', desc: 'Có href thì render thẻ <a> (trừ khi truyền tag khác).' },
  { name: 'target', type: 'string', desc: 'Thuộc tính target của link (chỉ áp dụng khi không phải <button>).' },
  { name: 'rel', type: 'string', desc: 'Thuộc tính rel. Khi target="_blank" mà không truyền rel → tự dùng "noopener noreferrer".' },
]

const emits: PropRow[] = [
  { name: 'click', type: '(event: MouseEvent) => void', desc: 'Phát khi người dùng bấm nút (không phát khi disabled/loading).' },
]
</script>

<template>
  <DocPage
    name="BaseButton"
    category="Form"
    description="Nút bấm nền tảng — 10 variant màu, 5 kích thước, trạng thái loading/disabled và hỗ trợ icon hai bên."
    :imports="['BaseButton']"
  >
    <h2>Variant</h2>
    <p>9 variant màu phủ hầu hết ngữ cảnh hành động. Dùng <code class="inline">primary</code> cho hành động chính, <code class="inline">danger</code> cho hành động phá hủy.</p>
    <DemoBlock :code="variantCode">
      <div class="row">
        <BaseButton variant="primary">primary</BaseButton>
        <BaseButton variant="secondary">secondary</BaseButton>
        <BaseButton variant="neutral">neutral</BaseButton>
        <BaseButton variant="success">success</BaseButton>
        <BaseButton variant="danger">danger</BaseButton>
        <BaseButton variant="warning">warning</BaseButton>
        <BaseButton variant="ghost">ghost</BaseButton>
        <BaseButton variant="link">link</BaseButton>
        <BaseButton variant="cta">cta</BaseButton>
      </div>
    </DemoBlock>

    <h2>Kích thước</h2>
    <p>Bốn kích thước nhãn từ <code class="inline">sm</code> đến <code class="inline">xl</code>.</p>
    <DemoBlock :code="sizeCode">
      <div class="row" style="align-items:flex-end">
        <BaseButton size="sm">sm</BaseButton>
        <BaseButton size="md">md</BaseButton>
        <BaseButton size="lg">lg</BaseButton>
        <BaseButton size="xl">xl</BaseButton>
      </div>
    </DemoBlock>

    <h2>Trạng thái</h2>
    <p><code class="inline">loading</code> hiện spinner và tự khóa tương tác; <code class="inline">disabled</code> làm mờ và chặn click.</p>
    <DemoBlock :code="stateCode">
      <div class="row">
        <BaseButton>default</BaseButton>
        <BaseButton loading>đang lưu</BaseButton>
        <BaseButton disabled>disabled</BaseButton>
      </div>
    </DemoBlock>

    <h2>Với icon</h2>
    <p>Truyền chuỗi HTML SVG qua <code class="inline">icon</code> hoặc <code class="inline">iconRight</code>. <code class="inline">currentColor</code> giúp icon tự ăn theo màu nhãn.</p>
    <DemoBlock :code="iconCode">
      <div class="row">
        <BaseButton :icon="plusIcon">Thêm mới</BaseButton>
        <BaseButton variant="secondary" :icon-right="plusIcon">Tiếp tục</BaseButton>
      </div>
    </DemoBlock>

    <h2>Full-width</h2>
    <p>Dùng <code class="inline">block</code> để nút trải rộng theo container — hợp với form mobile.</p>
    <DemoBlock :code="blockCode">
      <BaseButton block>Nút full-width</BaseButton>
    </DemoBlock>

    <h2>Dạng link</h2>
    <p>Truyền <code class="inline">href</code> hoặc <code class="inline">tag</code> để nút render thành thẻ <code class="inline">&lt;a&gt;</code> / component điều hướng mà giữ nguyên diện mạo.</p>
    <DemoBlock :code="linkCode">
      <div class="row">
        <BaseButton href="https://example.com" target="_blank" variant="secondary">Mở trang ngoài</BaseButton>
        <BaseButton href="/x" disabled>Không khả dụng</BaseButton>
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
  gap: var(--wx-space-3);
  align-items: center;
}
</style>
