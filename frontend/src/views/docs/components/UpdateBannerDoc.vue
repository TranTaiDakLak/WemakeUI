<script setup lang="ts">
import { ref } from 'vue'
import { BaseUpdateBanner, BaseButton } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const show = ref(true)

const basicCode = `<BaseUpdateBanner
  v-model:show="show"
  title="Có bản MindAds 1.4.0 mới"
  description="Bạn đang dùng 1.3.2 · Cải thiện tốc độ bảng dữ liệu"
  action-label="Xem thay đổi"
  @action="openChangelog"
/>`

const toneCode = `<BaseUpdateBanner tone="warning" title="Có phiên bản web mới" description="Tải lại để nạp bản mới nhất." action-label="Tải lại" @action="reload" />
<BaseUpdateBanner tone="success" title="Đã cập nhật xong" :dismissible="false" />
<BaseUpdateBanner tone="danger" title="Phiên đăng nhập sắp hết hạn" action-label="Gia hạn" />`

const stepsCode = `<BaseUpdateBanner
  tone="warning"
  title="Cập nhật extension lên 2.1.0"
  description="Đang cài 2.0.4"
  action-label="Tải bản mới"
  action-href="https://example.com/extension.zip"
  :steps="['Tải tệp .zip về máy', 'Giải nén vào thư mục cố định', 'Mở chrome://extensions và bấm Tải lại']"
/>`

const floatCode = `<!-- nổi giữa phía trên viewport; chỉnh khoảng cách bằng :offset -->
<BaseUpdateBanner placement="top" :offset="12" title="Có bản mới" action-label="Xem" />`

const props: PropRow[] = [
  { name: 'show', type: 'boolean', default: 'true', desc: 'Hiển thị (v-model:show).' },
  { name: 'tone', type: "'info' | 'warning' | 'success' | 'danger'", default: "'info'", desc: 'Tông màu + icon mặc định (tải xuống / đồng bộ / dấu tích / cảnh báo).' },
  { name: 'title', type: 'string', desc: 'Tiêu đề (bắt buộc).' },
  { name: 'description', type: 'string', desc: 'Mô tả một dòng (cắt bớt bằng …); hoặc slot mặc định.' },
  { name: 'icon', type: 'string', desc: 'Chuỗi SVG/HTML thay icon mặc định.' },
  { name: 'actionLabel', type: 'string', desc: 'Nhãn nút hành động; bỏ trống thì không có nút.' },
  { name: 'actionHref', type: 'string', desc: 'Có giá trị thì nút hành động là liên kết mở tab mới.' },
  { name: 'dismissible', type: 'boolean', default: 'true', desc: 'Hiện nút đóng.' },
  { name: 'dismissLabel', type: 'string', default: "'Đóng'", desc: 'aria-label nút đóng.' },
  { name: 'placement', type: "'inline' | 'top' | 'bottom'", default: "'inline'", desc: 'inline nằm trong luồng; top/bottom nổi giữa viewport (fixed).' },
  { name: 'offset', type: 'number', default: '12', desc: 'Khoảng cách tới mép viewport (px) khi top/bottom.' },
  { name: 'steps', type: 'string[]', desc: 'Các bước đánh số trong khối nền nhạt phía dưới; nút hành động chuyển xuống cuối khối.' },
]
const emits: PropRow[] = [
  { name: 'update:show', type: '(value: boolean) => void', desc: 'Khi bấm nút đóng.' },
  { name: 'action', type: '(event: MouseEvent) => void', desc: 'Khi bấm nút/liên kết hành động.' },
  { name: 'dismiss', type: '() => void', desc: 'Khi bấm nút đóng (kèm update:show).' },
]
</script>

<template>
  <DocPage
    name="BaseUpdateBanner"
    category="Mẫu Panel (MindAds)"
    description="Banner nhắc cập nhật / tải lại / thông báo hệ thống: icon + tiêu đề + mô tả + nút hành động + nút đóng, tuỳ chọn khối các bước."
    :imports="['BaseUpdateBanner']"
  >
    <p>Chỉ là phần nhìn — host tự kiểm tra phiên bản, nhớ trạng thái "đã đóng" (vd <code class="inline">sessionStorage</code>) và xử lý <code class="inline">action</code>.</p>

    <h2>Cơ bản</h2>
    <DemoBlock :code="basicCode">
      <BaseUpdateBanner v-model:show="show" title="Có bản MindAds 1.4.0 mới" description="Bạn đang dùng 1.3.2 · Cải thiện tốc độ bảng dữ liệu" action-label="Xem thay đổi" />
      <BaseButton v-if="!show" size="sm" variant="secondary" @click="show = true">Hiện lại</BaseButton>
    </DemoBlock>

    <h2>Tone</h2>
    <DemoBlock :code="toneCode">
      <div class="col">
        <BaseUpdateBanner tone="warning" title="Có phiên bản web mới" description="Tải lại để nạp bản mới nhất." action-label="Tải lại" />
        <BaseUpdateBanner tone="success" title="Đã cập nhật xong" :dismissible="false" />
        <BaseUpdateBanner tone="danger" title="Phiên đăng nhập sắp hết hạn" action-label="Gia hạn" />
      </div>
    </DemoBlock>

    <h2>Các bước hướng dẫn</h2>
    <DemoBlock :code="stepsCode">
      <BaseUpdateBanner
        tone="warning"
        title="Cập nhật extension lên 2.1.0"
        description="Đang cài 2.0.4"
        action-label="Tải bản mới"
        action-href="#"
        :steps="['Tải tệp .zip về máy', 'Giải nén vào thư mục cố định', 'Mở chrome://extensions và bấm Tải lại']"
      />
    </DemoBlock>

    <h2>Nổi trên viewport</h2>
    <p><code class="inline">placement="top"</code> hoặc <code class="inline">"bottom"</code> neo giữa màn hình, rộng tối đa 42rem (24rem khi có bước), z-index <code class="inline">--wx-z-overlay</code>.</p>
    <DemoBlock :code="floatCode">
      <code class="inline">placement="top"</code>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />
    <h2>Events</h2>
    <PropsTable :rows="emits" name-label="Event" hide-default />
  </DocPage>
</template>

<style scoped>
.col { display: flex; flex-direction: column; gap: var(--wx-space-3); }
</style>
