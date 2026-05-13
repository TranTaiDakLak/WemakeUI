<script setup lang="ts">
/**
 * Phase 1 — Base primitives showcase.
 * Hiển thị 15 primitive với các state (default / hover / focus / disabled / loading / invalid / empty).
 */
import { ref, reactive } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import {
  BaseButton, BaseInput, BaseSelectMenu, BaseCheckbox, BaseRadio, BaseToggle,
  BaseBadge, BaseProgress, BaseSkeleton,
  BaseTextarea, BaseAvatar, BaseAvatarGroup, BaseSpinner, BaseTag, ShimmerBlock,
} from '../../components/common'

const form = reactive({
  text: '',
  textInvalid: 'không hợp lệ',
  textarea: 'gõ vài dòng để xem autosize hoạt động',
  select: 'pro',
  toggle: true,
  toggleOff: false,
  checkbox: true,
  checkboxIndeterminate: false,
  radio: 'monthly',
})

const tags = ref(['vue', 'typescript', 'design system', 'admin'])
function removeTag(t: string) {
  tags.value = tags.value.filter((x) => x !== t)
}

const planOptions = [
  { value: 'free', label: 'miễn phí' },
  { value: 'pro', label: 'pro' },
  { value: 'team', label: 'doanh nghiệp' },
]

const planRadioOptions = [
  { value: 'monthly', label: 'theo tháng' },
  { value: 'yearly', label: 'theo năm' },
  { value: 'custom', label: 'tuỳ chỉnh' },
]

</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="phase 1 — base primitives" />

    <main class="main">
      <PageHeader
        title="phase 1 — base primitives"
        description="15 component nguyên tử với các state (default / hover / focus / disabled / loading / invalid). dùng tab phím để thử focus ring."
      />

      <!-- ── 1. Button ────────────────────────────── -->
      <section id="button" class="card">
        <h2 class="h">1. button — variant × size × state</h2>

        <h3 class="sub">variant (9) — dùng tab để thấy focus ring</h3>
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

        <h3 class="sub">size (5)</h3>
        <div class="row" style="align-items:flex-end">
          <BaseButton size="sm">sm</BaseButton>
          <BaseButton size="md">md</BaseButton>
          <BaseButton size="lg">lg</BaseButton>
          <BaseButton size="xl">xl</BaseButton>
          <BaseButton size="icon" variant="secondary">
            <template #default>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </template>
          </BaseButton>
        </div>

        <h3 class="sub">state</h3>
        <div class="row">
          <BaseButton>default</BaseButton>
          <BaseButton loading>loading</BaseButton>
          <BaseButton disabled>disabled</BaseButton>
          <BaseButton variant="primary" loading>đang lưu</BaseButton>
          <BaseButton variant="secondary" disabled>không khả dụng</BaseButton>
          <BaseButton variant="danger" loading>đang xoá</BaseButton>
        </div>

        <h3 class="sub">with icon</h3>
        <div class="row">
          <BaseButton icon='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>'>thêm mới</BaseButton>
          <BaseButton variant="secondary" icon='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'>chỉnh sửa</BaseButton>
          <BaseButton variant="danger" icon-right='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>'>xoá</BaseButton>
        </div>

        <h3 class="sub">block</h3>
        <div class="block-row">
          <BaseButton block>full width primary</BaseButton>
          <BaseButton block variant="secondary">full width secondary</BaseButton>
        </div>
      </section>

      <!-- ── 2. Input ─────────────────────────────── -->
      <section id="input" class="card">
        <h2 class="h">2. input</h2>
        <h3 class="sub">size (sm / md)</h3>
        <div class="row">
          <BaseInput v-model="form.text" placeholder="size sm" size="sm" />
          <BaseInput v-model="form.text" placeholder="size md (mặc định)" size="md" />
        </div>
        <h3 class="sub">state</h3>
        <div class="grid-2">
          <BaseInput v-model="form.text" placeholder="default" />
          <BaseInput v-model="form.textInvalid" error="email không hợp lệ" />
          <BaseInput :model-value="'readonly value'" placeholder="readonly" readonly />
          <BaseInput placeholder="disabled" disabled />
        </div>
      </section>

      <!-- ── 3. Textarea ──────────────────────────── -->
      <section id="textarea" class="card">
        <h2 class="h">3. textarea — autosize</h2>
        <p class="muted">gõ thêm dòng → tự cao theo nội dung.</p>
        <div class="grid-2">
          <BaseTextarea v-model="form.textarea" placeholder="autosize on" />
          <BaseTextarea
            :model-value="'invalid state — viền đỏ'"
            invalid
            placeholder="invalid"
          />
          <BaseTextarea :model-value="'readonly content'" readonly />
          <BaseTextarea placeholder="disabled" disabled />
        </div>
      </section>

      <!-- ── 4. Select ────────────────────────────── -->
      <section id="select" class="card">
        <h2 class="h">4. select</h2>
        <div class="grid-3">
          <BaseSelectMenu v-model="form.select" :options="planOptions" label="gói" />
          <BaseSelectMenu :options="planOptions" placeholder="chưa chọn" label="empty" />
          <BaseSelectMenu v-model="form.select" :options="planOptions" label="disabled" disabled />
        </div>
      </section>

      <!-- ── 5. Checkbox ──────────────────────────── -->
      <section id="checkbox" class="card">
        <h2 class="h">5. checkbox</h2>
        <div class="row">
          <BaseCheckbox v-model="form.checkbox" label="đã chọn" />
          <BaseCheckbox label="chưa chọn" />
          <BaseCheckbox v-model="form.checkboxIndeterminate" indeterminate label="indeterminate" />
          <BaseCheckbox label="disabled" disabled />
          <BaseCheckbox :model-value="true" label="checked + disabled" disabled />
        </div>
      </section>

      <!-- ── 6. Radio group ───────────────────────── -->
      <section id="radio" class="card">
        <h2 class="h">6. radio group</h2>
        <div class="row">
          <BaseRadio
            v-model="form.radio"
            name="plan"
            :options="planRadioOptions"
            direction="horizontal"
          />
        </div>
        <p class="muted">đang chọn: <code>{{ form.radio }}</code></p>
      </section>

      <!-- ── 7. Toggle ────────────────────────────── -->
      <section id="toggle" class="card">
        <h2 class="h">7. toggle</h2>
        <div class="row">
          <BaseToggle v-model="form.toggle" label="đã bật" />
          <BaseToggle v-model="form.toggleOff" label="đã tắt" />
          <BaseToggle :model-value="true" label="bật + disabled" disabled />
          <BaseToggle :model-value="false" label="tắt + disabled" disabled />
        </div>
      </section>

      <!-- ── 8. Badge ─────────────────────────────── -->
      <section id="badge" class="card">
        <h2 class="h">8. badge</h2>
        <h3 class="sub">variant</h3>
        <div class="row">
          <BaseBadge text="primary" variant="primary" />
          <BaseBadge text="success" variant="success" />
          <BaseBadge text="warning" variant="warning" />
          <BaseBadge text="danger" variant="danger" />
          <BaseBadge text="info" variant="info" />
          <BaseBadge text="ghost" variant="ghost" />
        </div>
        <h3 class="sub">dot & pulsing</h3>
        <div class="row">
          <BaseBadge dot variant="success" />
          <BaseBadge dot pulsing variant="success" />
          <BaseBadge dot pulsing variant="danger" />
          <BaseBadge text="42" variant="primary" />
          <BaseBadge text="99+" variant="danger" />
        </div>
      </section>

      <!-- ── 9. Avatar ────────────────────────────── -->
      <section id="avatar" class="card">
        <h2 class="h">9. avatar</h2>
        <h3 class="sub">size — fallback initial / icon</h3>
        <div class="row align-end">
          <BaseAvatar size="xs" name="An" />
          <BaseAvatar size="sm" name="Bao" />
          <BaseAvatar size="md" name="Cường Trần" />
          <BaseAvatar size="lg" name="Diệu Anh" />
          <BaseAvatar size="xl" name="Em Linh" />
          <BaseAvatar size="md" />
        </div>
        <h3 class="sub">image + status + ring + square</h3>
        <div class="row align-end">
          <BaseAvatar
            size="lg"
            src="https://i.pravatar.cc/120?img=12"
            name="khách"
            status="online"
          />
          <BaseAvatar
            size="lg"
            src="https://i.pravatar.cc/120?img=5"
            name="khách"
            status="busy"
          />
          <BaseAvatar
            size="lg"
            src="https://i.pravatar.cc/120?img=32"
            name="khách"
            status="away"
            ring
          />
          <BaseAvatar size="lg" name="vuông" shape="square" />
        </div>
        <h3 class="sub">avatar group (max 4)</h3>
        <BaseAvatarGroup
          size="md"
          :max="4"
          :items="[
            { src: 'https://i.pravatar.cc/64?img=1', name: 'a' },
            { src: 'https://i.pravatar.cc/64?img=2', name: 'b' },
            { src: 'https://i.pravatar.cc/64?img=3', name: 'c' },
            { src: 'https://i.pravatar.cc/64?img=4', name: 'd' },
            { src: 'https://i.pravatar.cc/64?img=5', name: 'e' },
            { src: 'https://i.pravatar.cc/64?img=6', name: 'f' },
            { src: 'https://i.pravatar.cc/64?img=7', name: 'g' },
          ]"
        />
      </section>

      <!-- ── 10. Spinner ──────────────────────────── -->
      <section id="spinner" class="card">
        <h2 class="h">10. spinner</h2>
        <h3 class="sub">size (4)</h3>
        <div class="row align-end">
          <BaseSpinner size="sm" />
          <BaseSpinner size="md" />
          <BaseSpinner size="lg" />
          <BaseSpinner size="xl" />
        </div>
        <h3 class="sub">tone</h3>
        <div class="row align-end">
          <BaseSpinner tone="current" />
          <BaseSpinner tone="primary" />
          <BaseSpinner tone="muted" />
          <span class="dark-bg"><BaseSpinner tone="inverse" /></span>
        </div>
      </section>

      <!-- ── 11. Tag / Chip ───────────────────────── -->
      <section id="tag" class="card">
        <h2 class="h">11. tag / chip</h2>
        <h3 class="sub">variant</h3>
        <div class="row">
          <BaseTag label="neutral" variant="neutral" />
          <BaseTag label="primary" variant="primary" />
          <BaseTag label="success" variant="success" />
          <BaseTag label="warning" variant="warning" />
          <BaseTag label="danger" variant="danger" />
          <BaseTag label="info" variant="info" dot />
        </div>
        <h3 class="sub">removable (click "×" để xoá)</h3>
        <div class="row">
          <BaseTag
            v-for="t in tags"
            :key="t"
            :label="t"
            variant="primary"
            removable
            @remove="removeTag(t)"
          />
          <span v-if="tags.length === 0" class="muted">đã xoá hết — refresh trang để lấy lại</span>
        </div>
        <h3 class="sub">size + shape</h3>
        <div class="row align-center">
          <BaseTag label="sm" size="sm" />
          <BaseTag label="md (mặc định)" size="md" />
          <BaseTag label="lg" size="lg" />
          <BaseTag label="vuông" shape="square" />
          <BaseTag label="disabled" disabled removable />
        </div>
      </section>

      <!-- ── 12. Progress ─────────────────────────── -->
      <section id="progress" class="card">
        <h2 class="h">12. progress</h2>
        <h3 class="sub">determinate</h3>
        <BaseProgress :value="25" variant="primary" show-label />
        <BaseProgress :value="60" variant="success" show-label />
        <BaseProgress :value="80" variant="warning" show-label />
        <BaseProgress :value="100" variant="error" show-label />

        <h3 class="sub">size</h3>
        <div class="progress-stack">
          <div class="progress-row"><span class="progress-label">sm</span><BaseProgress :value="55" size="sm" /></div>
          <div class="progress-row"><span class="progress-label">md</span><BaseProgress :value="55" size="md" /></div>
          <div class="progress-row"><span class="progress-label">lg</span><BaseProgress :value="55" size="lg" /></div>
        </div>

        <h3 class="sub">animated stripes</h3>
        <BaseProgress :value="65" striped animated />
      </section>

      <!-- ── 13. Skeleton (rows/cols grid) ────────── -->
      <section id="skeleton" class="card">
        <h2 class="h">13. skeleton — table placeholder</h2>
        <BaseSkeleton :rows="4" :cols="4" />
      </section>

      <!-- ── 14. ShimmerBlock primitive ───────────── -->
      <section id="shimmer" class="card">
        <h2 class="h">14. shimmer block — building block cho skeleton</h2>
        <p class="muted">khớp shape thật → giảm CLS. dùng để compose card / list item skeleton.</p>

        <h3 class="sub">card placeholder (image + tiêu đề + 2 dòng)</h3>
        <div class="shimmer-card-demo">
          <div class="shimmer-card">
            <ShimmerBlock height="120px" radius="lg" />
            <ShimmerBlock width="60%" height="14px" shape="text" />
            <ShimmerBlock width="100%" height="10px" shape="text" />
            <ShimmerBlock width="80%" height="10px" shape="text" />
          </div>
          <div class="shimmer-card">
            <ShimmerBlock height="120px" radius="lg" />
            <ShimmerBlock width="40%" height="14px" shape="text" />
            <ShimmerBlock width="100%" height="10px" shape="text" />
            <ShimmerBlock width="70%" height="10px" shape="text" />
          </div>
        </div>

        <h3 class="sub">list item (avatar + 2 dòng)</h3>
        <div class="shimmer-list">
          <div v-for="n in 3" :key="n" class="shimmer-list-row">
            <ShimmerBlock width="40px" height="40px" shape="circle" />
            <div class="shimmer-list-col">
              <ShimmerBlock width="40%" height="12px" shape="text" />
              <ShimmerBlock width="80%" height="10px" shape="text" />
            </div>
          </div>
        </div>
      </section>

      <!-- ── 15. Loading composition ──────────────── -->
      <section id="loading" class="card">
        <h2 class="h">15. composition — loading button + spinner inline</h2>
        <div class="row">
          <BaseButton variant="primary">
            <template v-if="false">đang xử lý</template>
            <BaseSpinner size="sm" tone="inverse" /> <span>đang lưu</span>
          </BaseButton>
          <BaseButton variant="secondary">
            <BaseSpinner size="sm" /> <span>đồng bộ</span>
          </BaseButton>
          <span class="inline-status">
            <BaseSpinner size="sm" tone="primary" />
            <span class="muted">đang tải dữ liệu…</span>
          </span>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--wx-bg-sunken);
  color: var(--wx-content-primary);
  font-family: var(--wx-font-primary);
  position: relative;
  isolation: isolate;
}
.main {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--wx-space-5) var(--wx-space-4) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
  position: relative;
  z-index: 1;
}

.card {
  background: var(--wx-bg-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-5);
  box-shadow: var(--wx-shadow-md);
  scroll-margin-top: 112px;
  position: relative;
  z-index: 2;
}

.h {
  margin: 0 0 var(--wx-space-3);
  font-size: var(--wx-fs-20);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}
.sub {
  margin: var(--wx-space-4) 0 var(--wx-space-2);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-content-secondary);
}
.sub:first-of-type { margin-top: 0; }
.muted {
  color: var(--wx-content-muted);
  font-size: var(--wx-fs-13);
}
code {
  font-family: var(--wx-font-mono);
  background: var(--wx-bg-sunken);
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  font-size: var(--wx-fs-12);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-3);
  align-items: center;
}
.row.align-end { align-items: flex-end; }
.row.align-center { align-items: center; }

.block-row { max-width: 360px; margin-top: var(--wx-space-3); }

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--wx-space-3);
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--wx-space-3);
}
@media (max-width: 768px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
}

.dark-bg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #0f172a;
  border-radius: var(--wx-radius-md);
  color: #fff;
}

.inline-status {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-2);
}

/* ── shimmer composition ─── */
.shimmer-card-demo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--wx-space-4);
}
@media (max-width: 768px) { .shimmer-card-demo { grid-template-columns: 1fr; } }
.shimmer-card {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  padding: var(--wx-space-4);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-bg-base);
}
.shimmer-list {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding: var(--wx-space-3);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
}
.shimmer-list-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
}
.progress-stack { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.progress-row { display: flex; align-items: center; gap: var(--wx-space-3); }
.progress-label { font-size: var(--wx-fs-11); font-family: var(--wx-font-mono); color: var(--wx-content-muted); width: 20px; flex-shrink: 0; }
.progress-row > :last-child { flex: 1; }

.shimmer-list-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}

</style>
