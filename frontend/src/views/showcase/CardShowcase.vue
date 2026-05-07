<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import { GroupBox, BaseCard, BaseButton, BaseBadge } from '../../components/common'

const clickCount = ref(0)
const selectedId = ref<number | null>(1)

const gboxCollapsed = ref(false)
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="components · card" />

    <main class="main">
      <PageHeader
        title="BaseCard & GroupBox"
        description="Surface container đa năng — header / body / footer / actions. GroupBox là variant đơn giản hơn dùng trong form và panel nội bộ."
        padded
      />

      <!-- ── Cấu trúc cơ bản ── -->
      <GroupBox title="Cấu trúc — slot layout">
        <div class="card-grid">

          <div class="card-item">
            <p class="card-label">Body only (default)</p>
            <BaseCard>
              Nội dung thuần — không cần title, không cần footer. Đây là slot mặc định.
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">Title + Subtitle + Body</p>
            <BaseCard title="Tiêu đề card" subtitle="Mô tả ngắn bên dưới tiêu đề">
              Phần body hiển thị nội dung chính.
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">Header + Actions slot</p>
            <BaseCard title="Với actions">
              <template #actions>
                <BaseButton size="sm" variant="ghost">Tuỳ chọn</BaseButton>
                <BaseButton size="sm">Lưu</BaseButton>
              </template>
              Slot <code>#actions</code> nằm bên phải header, tự co giãn.
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">Header + Body + Footer</p>
            <BaseCard title="Đầy đủ 3 zone">
              Phần body chính.
              <template #footer>
                <BaseButton size="sm" variant="ghost">Huỷ</BaseButton>
                <BaseButton size="sm">Xác nhận</BaseButton>
              </template>
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">#header slot (rich)</p>
            <BaseCard>
              <template #header>
                <div class="rich-header">
                  <BaseBadge text="BETA" variant="info" />
                  <span class="rich-header__title">Custom header slot</span>
                </div>
              </template>
              Dùng <code>#header</code> thay cho title/subtitle khi cần rich content.
            </BaseCard>
          </div>

        </div>
      </GroupBox>

      <!-- ── Shadow variants ── -->
      <GroupBox title="Shadow">
        <div class="card-row">
          <div v-for="s in ['none','sm','md','lg','xl'] as const" :key="s" class="card-shadow-item">
            <BaseCard :shadow="s" :padded="true">
              <p class="variant-label">shadow="{{ s }}"</p>
            </BaseCard>
          </div>
        </div>
      </GroupBox>

      <!-- ── Radius variants ── -->
      <GroupBox title="Radius">
        <div class="card-row">
          <div v-for="r in ['md','lg','xl','2xl'] as const" :key="r" class="card-radius-item">
            <BaseCard :radius="r">
              <p class="variant-label">radius="{{ r }}"</p>
            </BaseCard>
          </div>
        </div>
      </GroupBox>

      <!-- ── States ── -->
      <GroupBox title="States">
        <div class="card-grid">

          <div class="card-item">
            <p class="card-label">selected</p>
            <BaseCard title="Selected" :selected="true">
              Viền brand + ring nổi.
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">disabled</p>
            <BaseCard title="Disabled" :disabled="true">
              Opacity 0.55, pointer-events none.
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">loading</p>
            <BaseCard title="Loading" :loading="true">
              Skeleton shimmer overlay che phủ body.
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">bordered=false</p>
            <BaseCard title="Không viền" :bordered="false">
              Shadow tạo chiều sâu, không cần border.
            </BaseCard>
          </div>

        </div>
      </GroupBox>

      <!-- ── Hover & Click ── -->
      <GroupBox title="Hover & Clickable">
        <div class="card-grid">

          <div class="card-item">
            <p class="card-label">Default — blue glow (mọi card)</p>
            <BaseCard title="Hover vào card này">
              Không cần prop nào. Viền xanh + đổ bóng xanh là mặc định.
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">hoverable — glow + lift</p>
            <BaseCard title="Hover để lift" :hoverable="true">
              <code>hoverable</code> cộng thêm translateY(-2px) lên trên glow mặc định.
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">clickable — emit click</p>
            <BaseCard
              title="Click card"
              subtitle="Cả card là vùng click"
              :clickable="true"
              :hoverable="true"
              @click="clickCount++"
            >
              Đã click: <strong>{{ clickCount }}</strong> lần.
            </BaseCard>
          </div>

          <div class="card-item">
            <p class="card-label">Selection group (clickable + selected)</p>
            <div class="select-group">
              <BaseCard
                v-for="i in 3"
                :key="i"
                :title="`Tuỳ chọn ${i}`"
                :subtitle="`Mô tả lựa chọn ${i}`"
                :clickable="true"
                :selected="selectedId === i"
                @click="selectedId = i"
              >
                <template #actions>
                  <BaseBadge v-if="selectedId === i" text="✓" variant="success" />
                </template>
              </BaseCard>
            </div>
          </div>

        </div>
      </GroupBox>

      <!-- ── GroupBox ── -->
      <GroupBox title="GroupBox — variant đơn giản">
        <div class="card-grid">

          <div class="card-item">
            <p class="card-label">Cơ bản</p>
            <GroupBox title="GroupBox thường">
              Dùng trong form, panel, sidebar section. Header gọn, body padding nhỏ.
            </GroupBox>
          </div>

          <div class="card-item">
            <p class="card-label">Collapsible</p>
            <GroupBox
              title="Collapsible GroupBox"
              :collapsible="true"
              :collapsed="gboxCollapsed"
              @update:collapsed="gboxCollapsed = $event"
            >
              Nội dung này ẩn/hiện khi click header. Animation slide.
            </GroupBox>
          </div>

        </div>
      </GroupBox>

      <!-- ── Anatomy ── -->
      <GroupBox title="Anatomy — BaseCard">
        <div class="anatomy-grid">
          <div class="anatomy-item">
            <span class="anatomy-key">title / subtitle</span>
            <span class="anatomy-val">Props text → render header tự động. Dùng <code>#header</code> slot khi cần rich content.</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-key">#actions</span>
            <span class="anatomy-val">Slot bên phải header — buttons, badges, menu trigger.</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-key">#body / default</span>
            <span class="anatomy-val">Nội dung chính. <code>padded=true</code> thêm padding space-5 tự động.</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-key">#footer</span>
            <span class="anatomy-val">Zone action dưới cùng — align right, background sunken.</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-key">shadow</span>
            <span class="anatomy-val">none · sm · md (mặc định) · lg · xl</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-key">radius</span>
            <span class="anatomy-val">md · lg (mặc định) · xl · 2xl</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-key">hoverable</span>
            <span class="anatomy-val">translateY(-2px) + shadow++ khi hover. Không áp dụng khi disabled.</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-key">clickable</span>
            <span class="anatomy-val">cursor pointer + focus ring + emit click. Kết hợp selected để làm selection group.</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-key">selected</span>
            <span class="anatomy-val">Brand border + ring. Dùng cùng clickable để tạo picker card.</span>
          </div>
          <div class="anatomy-item">
            <span class="anatomy-key">loading</span>
            <span class="anatomy-val">Skeleton shimmer overlay — che body, giữ kích thước card.</span>
          </div>
        </div>
      </GroupBox>

    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--wx-surface-sunken);
  font-family: var(--wx-font-primary);
}

.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--wx-space-5) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}

/* ── Grid layouts ── */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--wx-space-4);
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-4);
}

.card-shadow-item,
.card-radius-item {
  flex: 1;
  min-width: 120px;
}

.card-item {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}

.card-label {
  margin: 0;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
}

/* ── Variant labels inside cards ── */
.variant-label {
  margin: 0;
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
  font-family: var(--wx-font-mono);
  text-align: center;
}

/* ── Rich header demo ── */
.rich-header {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  flex: 1;
  min-width: 0;
}

.rich-header__title {
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
}

/* ── Selection group ── */
.select-group {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}

/* ── code inline ── */
code {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  background: color-mix(in srgb, var(--wx-brand-primary) 10%, transparent);
  color: var(--wx-brand-primary);
  padding: 1px 5px;
  border-radius: var(--wx-radius-sm);
}

/* ── Anatomy ── */
.anatomy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--wx-space-3);
}

.anatomy-item {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
  padding: var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
}

.anatomy-key {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  font-family: var(--wx-font-mono);
  color: var(--wx-brand-primary);
}

.anatomy-val {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  line-height: 1.5;
}
</style>
