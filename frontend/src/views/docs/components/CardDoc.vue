<script setup lang="ts">
import { ref } from 'vue'
import { BaseCard, BaseButton } from '../../../components/common'
import DocPage from '../_components/DocPage.vue'
import DemoBlock from '../_components/DemoBlock.vue'
import PropsTable from '../_components/PropsTable.vue'
import type { PropRow } from '../_components/PropsTable.vue'

const selected = ref(true)

const basicCode = `<BaseCard title="Doanh thu tháng 6" subtitle="Cập nhật 30/06/2026">
  <p>Tổng doanh thu đạt 1,2 tỷ đồng, tăng 18% so với tháng trước.</p>
</BaseCard>`

const shadowCode = `<BaseCard shadow="none" title="none">Không đổ bóng</BaseCard>
<BaseCard shadow="sm" title="sm">Bóng nhẹ</BaseCard>
<BaseCard shadow="md" title="md">Bóng vừa (mặc định)</BaseCard>
<BaseCard shadow="lg" title="lg">Bóng lớn</BaseCard>
<BaseCard shadow="xl" title="xl">Bóng rất lớn</BaseCard>`

const radiusCode = `<BaseCard radius="md" title="md">radius md</BaseCard>
<BaseCard radius="lg" title="lg">radius lg (mặc định)</BaseCard>
<BaseCard radius="xl" title="xl">radius xl</BaseCard>
<BaseCard radius="2xl" title="2xl">radius 2xl</BaseCard>`

const interactiveCode = `<BaseCard
  hoverable
  clickable
  title="Gói Pro"
  subtitle="Bấm để chọn gói"
  @click="onPick"
>
  <p>Card có hiệu ứng nhấc lên khi hover và phát sự kiện click.</p>
</BaseCard>`

const hoverEffectCode = `<BaseCard hover-effect="glow" title="Glow">Viền gradient phát sáng từ rìa.</BaseCard>
<BaseCard hover-effect="lift" title="Lift">Nhấc lên + shadow sâu.</BaseCard>
<BaseCard hover-effect="shimmer" title="Shimmer">Scale nhẹ + ánh sáng brand sweep qua.</BaseCard>
<BaseCard hover-effect="glow-lift" title="Glow + Lift">Kết hợp glow và lift.</BaseCard>
<BaseCard hover-effect="glow-shimmer" title="Glow + Shimmer">Kết hợp glow và shimmer.</BaseCard>`

const accentColorCode = `<BaseCard accent-color="#2563eb" hover-effect="glow-lift" title="SaaS Admin">
  Viền trái + glow theo màu riêng, không phụ thuộc brand color.
</BaseCard>`

const stateCode = `<script setup lang="ts">
import { ref } from 'vue'
const selected = ref(true)
<\/script>

<template>
  <BaseCard :selected="selected" title="Đã chọn" clickable @click="selected = !selected">
    Bấm để bật/tắt trạng thái selected.
  </BaseCard>
  <BaseCard loading title="Đang tải">Nội dung bị che bởi skeleton.</BaseCard>
  <BaseCard disabled title="Vô hiệu hóa">Không thể tương tác.</BaseCard>
<\/template>`

const headerSlotCode = `<BaseCard>
  <template #header>
    <strong>Header tùy biến</strong>
  </template>
  <p>Dùng slot #header khi cần nội dung phong phú hơn title/subtitle.</p>
</BaseCard>`

const props: PropRow[] = [
  { name: 'title', type: 'string', desc: 'Tiêu đề header dạng text. Cần rich hơn thì dùng slot #header.' },
  { name: 'subtitle', type: 'string', desc: 'Mô tả nhỏ hiển thị dưới title.' },
  { name: 'padded', type: 'boolean', default: 'true', desc: 'Thêm padding cho header / body / footer.' },
  { name: 'shadow', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", desc: 'Mức đổ bóng của card.' },
  { name: 'radius', type: "'md' | 'lg' | 'xl' | '2xl'", default: "'lg'", desc: 'Độ bo góc của card.' },
  { name: 'hoverable', type: 'boolean', default: 'false', desc: 'Hiệu ứng nhấc lên (translateY -2px) khi hover. Deprecated — dùng hoverEffect.' },
  { name: 'hoverEffect', type: "'none' | 'glow' | 'lift' | 'shimmer' | 'glow-lift' | 'glow-shimmer'", default: "'none'", desc: 'Kiểu hover nâng cao. lift và shimmer không combine được với nhau (cùng dùng transform).' },
  { name: 'accentColor', type: 'string', desc: 'CSS color — thêm viền trái 3px + nhuộm màu glow/lift riêng, thay vì --wx-brand-primary mặc định.' },
  { name: 'bordered', type: 'boolean', default: 'true', desc: 'Hiện viền card.' },
  { name: 'selected', type: 'boolean', default: 'false', desc: 'Trạng thái được chọn — viền và ring màu brand.' },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'Phủ skeleton shimmer lên nội dung.' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: 'Làm mờ và chặn tương tác.' },
  { name: 'clickable', type: 'boolean', default: 'false', desc: 'Cho phép click toàn card → phát sự kiện click, con trỏ pointer.' },
]

const emits: PropRow[] = [
  { name: 'click', type: '(event: MouseEvent) => void', desc: 'Phát khi click vào card có clickable (không phát khi disabled/loading).' },
]

const slots: PropRow[] = [
  { name: 'default', type: '—', desc: 'Nội dung body của card.' },
  { name: 'header', type: '—', desc: 'Nội dung header tùy biến, thay cho title/subtitle.' },
]
</script>

<template>
  <DocPage
    name="BaseCard"
    category="Bố cục"
    description="Khung surface chứa nội dung — header tùy biến, 5 mức bóng, 4 mức bo góc, có trạng thái selected / loading / disabled và chế độ clickable."
    :imports="['BaseCard']"
  >
    <h2>Cơ bản</h2>
    <p>Truyền <code class="inline">title</code> và <code class="inline">subtitle</code> để dựng header nhanh; nội dung body đặt trong slot mặc định.</p>
    <DemoBlock :code="basicCode">
      <BaseCard title="Doanh thu tháng 6" subtitle="Cập nhật 30/06/2026" style="max-width:360px">
        <p style="margin:0">Tổng doanh thu đạt 1,2 tỷ đồng, tăng 18% so với tháng trước.</p>
      </BaseCard>
    </DemoBlock>

    <h2>Mức đổ bóng</h2>
    <p>Năm mức <code class="inline">shadow</code> từ <code class="inline">none</code> đến <code class="inline">xl</code>.</p>
    <DemoBlock :code="shadowCode">
      <div class="grid">
        <BaseCard shadow="none" title="none">Không đổ bóng</BaseCard>
        <BaseCard shadow="sm" title="sm">Bóng nhẹ</BaseCard>
        <BaseCard shadow="md" title="md">Bóng vừa (mặc định)</BaseCard>
        <BaseCard shadow="lg" title="lg">Bóng lớn</BaseCard>
        <BaseCard shadow="xl" title="xl">Bóng rất lớn</BaseCard>
      </div>
    </DemoBlock>

    <h2>Bo góc</h2>
    <p>Bốn mức <code class="inline">radius</code> để khớp với ngữ cảnh giao diện.</p>
    <DemoBlock :code="radiusCode">
      <div class="grid">
        <BaseCard radius="md" title="md">radius md</BaseCard>
        <BaseCard radius="lg" title="lg">radius lg (mặc định)</BaseCard>
        <BaseCard radius="xl" title="xl">radius xl</BaseCard>
        <BaseCard radius="2xl" title="2xl">radius 2xl</BaseCard>
      </div>
    </DemoBlock>

    <h2>Hoverable & clickable</h2>
    <p>Kết hợp <code class="inline">hoverable</code> và <code class="inline">clickable</code> cho card chọn được — card sẽ nhấc lên khi hover và phát sự kiện <code class="inline">click</code>.</p>
    <DemoBlock :code="interactiveCode">
      <BaseCard hoverable clickable title="Gói Pro" subtitle="Bấm để chọn gói" style="max-width:360px">
        <p style="margin:0">Card có hiệu ứng nhấc lên khi hover và phát sự kiện click.</p>
      </BaseCard>
    </DemoBlock>

    <h2>Hover effect nâng cao</h2>
    <p>
      <code class="inline">hoverEffect</code> cho 5 kiểu hover phong phú hơn <code class="inline">hoverable</code>:
      <code class="inline">glow</code> (viền gradient phát sáng), <code class="inline">lift</code> (nhấc lên + shadow sâu),
      <code class="inline">shimmer</code> (ánh sáng sweep qua), và 2 tổ hợp <code class="inline">glow-lift</code> /
      <code class="inline">glow-shimmer</code>. Lưu ý <code class="inline">lift</code> và <code class="inline">shimmer</code>
      không combine được với nhau vì cùng dùng <code class="inline">transform</code>.
    </p>
    <DemoBlock :code="hoverEffectCode">
      <div class="grid">
        <BaseCard hover-effect="glow" title="Glow">Viền gradient phát sáng từ rìa.</BaseCard>
        <BaseCard hover-effect="lift" title="Lift">Nhấc lên + shadow sâu.</BaseCard>
        <BaseCard hover-effect="shimmer" title="Shimmer">Scale nhẹ + ánh sáng brand sweep qua.</BaseCard>
        <BaseCard hover-effect="glow-lift" title="Glow + Lift">Kết hợp glow và lift.</BaseCard>
        <BaseCard hover-effect="glow-shimmer" title="Glow + Shimmer">Kết hợp glow và shimmer.</BaseCard>
      </div>
    </DemoBlock>

    <h2>Màu accent riêng</h2>
    <p>
      <code class="inline">accentColor</code> thêm viền trái 3px và nhuộm màu <code class="inline">glow</code>/<code class="inline">lift</code>
      theo màu riêng thay vì <code class="inline">--wx-brand-primary</code> mặc định — hữu ích khi mỗi card cần 1 màu nhận diện
      (lưới app, danh mục).
    </p>
    <DemoBlock :code="accentColorCode">
      <BaseCard accent-color="#2563eb" hover-effect="glow-lift" title="SaaS Admin" style="max-width:360px">
        Viền trái + glow theo màu riêng, không phụ thuộc brand color.
      </BaseCard>
    </DemoBlock>

    <h2>Trạng thái</h2>
    <p><code class="inline">selected</code> tô viền brand, <code class="inline">loading</code> phủ skeleton, <code class="inline">disabled</code> làm mờ và chặn click.</p>
    <DemoBlock :code="stateCode">
      <div class="grid">
        <BaseCard :selected="selected" title="Đã chọn" clickable @click="selected = !selected">
          Bấm để bật/tắt trạng thái selected.
        </BaseCard>
        <BaseCard loading title="Đang tải">Nội dung bị che bởi skeleton.</BaseCard>
        <BaseCard disabled title="Vô hiệu hóa">Không thể tương tác.</BaseCard>
      </div>
    </DemoBlock>

    <h2>Header tùy biến</h2>
    <p>Dùng slot <code class="inline">#header</code> khi cần header phong phú hơn cặp title/subtitle.</p>
    <DemoBlock :code="headerSlotCode">
      <BaseCard style="max-width:360px">
        <template #header>
          <div class="row" style="justify-content:space-between;width:100%">
            <strong>Header tùy biến</strong>
            <BaseButton size="sm" variant="ghost">Tùy chọn</BaseButton>
          </div>
        </template>
        <p style="margin:0">Dùng slot #header khi cần nội dung phong phú hơn title/subtitle.</p>
      </BaseCard>
    </DemoBlock>

    <h2>Props</h2>
    <PropsTable :rows="props" />

    <h2>Sự kiện</h2>
    <PropsTable :rows="emits" name-label="Event" hide-default />

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
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
</style>
