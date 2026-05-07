<script setup lang="ts">
import { ref, nextTick } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton, BaseSpinner } from '../../components/common'

/* ── Enter/Leave transition demos ── */
const showFade      = ref(false)
const showScaleFade = ref(false)
const showSlideUp   = ref(false)
const showSlideRight = ref(false)

/* ── Tab indicator demo ── */
const activeTab = ref(0)
const TABS = ['Tổng quan', 'Chiến dịch', 'Cài đặt']

/* ── Loading ── */
const isLoading = ref(false)
function triggerLoader() {
  isLoading.value = true
  setTimeout(() => (isLoading.value = false), 2000)
}

/* ── Button loading ── */
const btnLoading = ref(false)
function triggerBtnLoad() {
  btnLoading.value = true
  setTimeout(() => (btnLoading.value = false), 1800)
}

/* ── Form shake ── */
const shakeActive = ref(false)
let shakeTimer: ReturnType<typeof setTimeout>
function triggerShake() {
  shakeActive.value = false
  nextTick(() => {
    shakeActive.value = true
    clearTimeout(shakeTimer)
    shakeTimer = setTimeout(() => (shakeActive.value = false), 600)
  })
}

/* ── Success check ── */
const successActive = ref(false)
function triggerSuccess() {
  successActive.value = false
  nextTick(() => (successActive.value = true))
  setTimeout(() => (successActive.value = false), 2200)
}

/* ── Code toggle ── */
const openCode = ref<Record<string, boolean>>({})
function tog(k: string) { openCode.value[k] = !openCode.value[k] }

const MOTION_TOKENS = [
  { name: '--wx-d-micro',      value: '100ms',  use: 'Focus ring, toggle, icon swap' },
  { name: '--wx-d-fast',       value: '150ms',  use: 'Hover, press, badge, chip' },
  { name: '--wx-d-normal',     value: '250ms',  use: 'Modal, drawer, page transition' },
  { name: '--wx-d-slow',       value: '400ms',  use: 'Complex layout, onboarding step' },
  { name: '--wx-d-decorative', value: '700ms',  use: 'Illustration, welcome animation' },
]
const EASE_TOKENS = [
  { name: '--wx-ease-standard',   value: 'cubic-bezier(.4,0,.2,1)',    use: 'Mặc định — phần lớn transitions' },
  { name: '--wx-ease-decelerate', value: 'cubic-bezier(0,0,.2,1)',     use: 'Enter — element vào màn hình' },
  { name: '--wx-ease-accelerate', value: 'cubic-bezier(.4,0,1,1)',     use: 'Leave — element thoát màn hình' },
  { name: '--wx-ease-bounce',     value: 'cubic-bezier(.16,1,.3,1)',   use: 'Dropdown, popup — nhẹ nhàng' },
  { name: '--wx-ease-spring',     value: 'cubic-bezier(.34,1.56,.64,1)', use: 'Segmented, tab indicator — spring nhẹ' },
]
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="animation showcase" />

    <main class="main">

      <!-- header -->
      <div class="hdr">
        <h1 class="hdr__title">Motion System</h1>
        <p class="hdr__sub">
          Tham chiếu animation patterns — token, preview, code. Mỗi animation dùng
          <code>--wx-d-*</code> và <code>--wx-ease-*</code>.
        </p>
      </div>

      <!-- ══════════════════════════ MOTION TOKENS ══════════════════════════ -->
      <section class="section">
        <h2 class="section__title">Motion Tokens</h2>

        <div class="two-col">
          <!-- duration -->
          <div class="token-table">
            <div class="token-table__head">Duration</div>
            <div v-for="t in MOTION_TOKENS" :key="t.name" class="token-row">
              <div class="token-row__bar-wrap">
                <div class="token-row__bar" :style="{ width: t.value, background: 'var(--wx-brand-primary)', opacity: .7 }" />
              </div>
              <code class="token-row__name">{{ t.name }}</code>
              <span class="token-row__val">{{ t.value }}</span>
              <span class="token-row__use">{{ t.use }}</span>
            </div>
          </div>

          <!-- easing -->
          <div class="token-table">
            <div class="token-table__head">Easing</div>
            <div v-for="e in EASE_TOKENS" :key="e.name" class="token-row token-row--ease">
              <code class="token-row__name">{{ e.name }}</code>
              <code class="token-row__val token-row__val--sm">{{ e.value }}</code>
              <span class="token-row__use">{{ e.use }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════ ENTER / LEAVE ══════════════════════════ -->
      <section class="section">
        <h2 class="section__title">Vue &lt;Transition&gt; — Enter / Leave</h2>
        <p class="section__desc">Dùng với <code>&lt;Transition name="..."&gt;</code>. Định nghĩa CSS classes <code>-enter-from</code>, <code>-enter-active</code>, <code>-leave-active</code>, <code>-leave-to</code>.</p>

        <div class="demo-grid">

          <!-- fade -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Fade</span>
              <div class="token-chips">
                <span class="chip chip--d">d-normal</span>
                <span class="chip chip--e">ease-standard</span>
              </div>
            </div>
            <div class="demo-area">
              <Transition name="anim-fade">
                <div v-if="showFade" class="demo-box demo-box--brand">Nội dung</div>
              </Transition>
            </div>
            <div class="demo-actions">
              <BaseButton variant="secondary" size="sm" @click="showFade = !showFade">
                {{ showFade ? 'Ẩn' : 'Hiện' }}
              </BaseButton>
              <button class="code-toggle" @click="tog('fade')">{{ openCode['fade'] ? '▲ Code' : '▼ Code' }}</button>
            </div>
            <div v-if="openCode['fade']" class="code-block">
<pre>.anim-fade-enter-active,
.anim-fade-leave-active {
  transition: opacity var(--wx-d-normal)
    var(--wx-ease-standard);
}
.anim-fade-enter-from,
.anim-fade-leave-to { opacity: 0; }</pre>
            </div>
            <p class="demo-note">Dùng cho: tooltip, badge, overlay nhẹ.</p>
          </div>

          <!-- scale + fade (modal-style) -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Scale + Fade</span>
              <div class="token-chips">
                <span class="chip chip--d">d-normal</span>
                <span class="chip chip--e">ease-decelerate</span>
              </div>
            </div>
            <div class="demo-area">
              <Transition name="anim-scale">
                <div v-if="showScaleFade" class="demo-box demo-box--surface demo-box--shadow">
                  <span style="font-size:13px;color:var(--wx-text-secondary)">Modal / Popup</span>
                </div>
              </Transition>
            </div>
            <div class="demo-actions">
              <BaseButton variant="secondary" size="sm" @click="showScaleFade = !showScaleFade">
                {{ showScaleFade ? 'Ẩn' : 'Hiện' }}
              </BaseButton>
              <button class="code-toggle" @click="tog('scale')">{{ openCode['scale'] ? '▲ Code' : '▼ Code' }}</button>
            </div>
            <div v-if="openCode['scale']" class="code-block">
<pre>.anim-scale-enter-active {
  transition: all var(--wx-d-normal)
    var(--wx-ease-decelerate);
}
.anim-scale-leave-active {
  transition: all var(--wx-d-fast)
    var(--wx-ease-accelerate);
}
.anim-scale-enter-from {
  opacity: 0;
  transform: scale(.94);
}
.anim-scale-leave-to {
  opacity: 0;
  transform: scale(.96);
}</pre>
            </div>
            <p class="demo-note">Dùng cho: modal, dialog, dropdown.</p>
          </div>

          <!-- slide up -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Slide Up</span>
              <div class="token-chips">
                <span class="chip chip--d">d-normal</span>
                <span class="chip chip--e">ease-decelerate</span>
              </div>
            </div>
            <div class="demo-area" style="align-items:flex-end">
              <Transition name="anim-slide-up">
                <div v-if="showSlideUp" class="demo-box demo-box--brand" style="width:100%">
                  <span style="font-size:12px">Bottom sheet / Toast</span>
                </div>
              </Transition>
            </div>
            <div class="demo-actions">
              <BaseButton variant="secondary" size="sm" @click="showSlideUp = !showSlideUp">
                {{ showSlideUp ? 'Ẩn' : 'Hiện' }}
              </BaseButton>
              <button class="code-toggle" @click="tog('slideUp')">{{ openCode['slideUp'] ? '▲ Code' : '▼ Code' }}</button>
            </div>
            <div v-if="openCode['slideUp']" class="code-block">
<pre>.anim-slide-up-enter-active {
  transition: all var(--wx-d-normal)
    var(--wx-ease-decelerate);
}
.anim-slide-up-leave-active {
  transition: all var(--wx-d-fast)
    var(--wx-ease-accelerate);
}
.anim-slide-up-enter-from,
.anim-slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px);
}</pre>
            </div>
            <p class="demo-note">Dùng cho: bottom sheet, toast, notification.</p>
          </div>

          <!-- slide right (drawer) -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Slide Right (Drawer)</span>
              <div class="token-chips">
                <span class="chip chip--d">d-normal</span>
                <span class="chip chip--e">ease-decelerate</span>
              </div>
            </div>
            <div class="demo-area" style="overflow:hidden;padding:0;border-radius:var(--wx-radius-md)">
              <Transition name="anim-drawer">
                <div v-if="showSlideRight" class="demo-box demo-box--surface demo-box--drawer">
                  <span style="font-size:12px;color:var(--wx-text-secondary)">Drawer</span>
                </div>
              </Transition>
            </div>
            <div class="demo-actions" style="margin-top:8px">
              <BaseButton variant="secondary" size="sm" @click="showSlideRight = !showSlideRight">
                {{ showSlideRight ? 'Đóng' : 'Mở Drawer' }}
              </BaseButton>
              <button class="code-toggle" @click="tog('drawer')">{{ openCode['drawer'] ? '▲ Code' : '▼ Code' }}</button>
            </div>
            <div v-if="openCode['drawer']" class="code-block">
<pre>.anim-drawer-enter-active {
  transition: transform var(--wx-d-normal)
    var(--wx-ease-decelerate);
}
.anim-drawer-leave-active {
  transition: transform var(--wx-d-fast)
    var(--wx-ease-accelerate);
}
.anim-drawer-enter-from,
.anim-drawer-leave-to {
  transform: translateX(-100%);
}</pre>
            </div>
            <p class="demo-note">Dùng cho: sidebar drawer, side panel.</p>
          </div>

        </div>
      </section>

      <!-- ══════════════════════════ HOVER EFFECTS ══════════════════════════ -->
      <section class="section">
        <h2 class="section__title">Hover Effects (CSS only)</h2>
        <p class="section__desc">Hover vào từng element để thấy hiệu ứng. Không cần JS.</p>

        <div class="hover-grid">

          <div class="hover-item">
            <div class="hover-card hover-lift">
              <span class="hover-label">Hover Lift</span>
              <span class="hover-sub">translateY(-4px) + shadow</span>
            </div>
            <code class="hover-code">transition: var(--wx-d-fast) var(--wx-ease-standard)</code>
          </div>

          <div class="hover-item">
            <div class="hover-card hover-glow">
              <span class="hover-label">Hover Glow</span>
              <span class="hover-sub">box-shadow brand</span>
            </div>
            <code class="hover-code">box-shadow: 0 0 0 3px brand-20%</code>
          </div>

          <div class="hover-item">
            <div class="hover-card hover-scale">
              <span class="hover-label">Hover Scale</span>
              <span class="hover-sub">scale(1.02)</span>
            </div>
            <code class="hover-code">transform: scale(1.02)</code>
          </div>

          <div class="hover-item">
            <div class="hover-card hover-reveal">
              <div class="hover-reveal__content">
                <span class="hover-label">Hover Reveal</span>
                <span class="hover-sub">Hover để thấy action</span>
              </div>
              <div class="hover-reveal__action">
                <span>Chỉnh sửa</span>
              </div>
            </div>
            <code class="hover-code">opacity: 0 → 1 on parent:hover</code>
          </div>

        </div>
      </section>

      <!-- ══════════════════════════ TAB INDICATOR ══════════════════════════ -->
      <section class="section">
        <h2 class="section__title">Segmented / Tab Indicator</h2>
        <p class="section__desc">Active indicator trượt mượt khi đổi tab. Dùng <code>--wx-ease-spring</code> để có spring nhẹ.</p>

        <div class="demo-card" style="max-width:480px">
          <div class="tab-demo">
            <div class="tab-bar" role="tablist">
              <div
                class="tab-indicator"
                :style="{ transform: `translateX(${activeTab * 100}%)`, width: `${100 / TABS.length}%` }"
                aria-hidden="true"
              />
              <button
                v-for="(tab, i) in TABS"
                :key="tab"
                role="tab"
                class="tab-btn"
                :class="{ 'tab-btn--active': activeTab === i }"
                :aria-selected="activeTab === i"
                @click="activeTab = i"
              >
                {{ tab }}
              </button>
            </div>
            <div class="tab-content">
              <Transition name="tab-fade" mode="out-in">
                <div :key="activeTab" class="tab-panel">
                  Nội dung tab: <strong>{{ TABS[activeTab] }}</strong>
                </div>
              </Transition>
            </div>
          </div>

          <button class="code-toggle" @click="tog('tab')">{{ openCode['tab'] ? '▲ Code' : '▼ Code' }}</button>
          <div v-if="openCode['tab']" class="code-block">
<pre>/* Indicator slide */
.tab-indicator {
  transition: transform var(--wx-d-fast)
    var(--wx-ease-spring);
}

/* Content fade */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity var(--wx-d-fast)
    var(--wx-ease-standard);
}
.tab-fade-enter-from,
.tab-fade-leave-to { opacity: 0; }</pre>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════ LOADING ══════════════════════════ -->
      <section class="section">
        <h2 class="section__title">Loading States</h2>

        <div class="demo-grid">

          <!-- spinner -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Spinner</span>
              <div class="token-chips"><span class="chip chip--d">d-decorative · linear · repeat</span></div>
            </div>
            <div class="demo-area">
              <BaseSpinner v-if="isLoading" />
              <BaseButton v-else variant="secondary" size="sm" @click="triggerLoader">Start (2s)</BaseButton>
            </div>
            <p class="demo-note">Dùng cho: nội dung chưa tải xong, fetch data.</p>
          </div>

          <!-- shimmer skeleton -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Shimmer Skeleton</span>
              <div class="token-chips"><span class="chip chip--d">d-decorative · linear · repeat</span></div>
            </div>
            <div class="demo-area demo-area--col">
              <div class="skel skel--title wx-shimmer" />
              <div class="skel skel--line wx-shimmer" />
              <div class="skel skel--line skel--line-sm wx-shimmer" />
              <div class="skel skel--avatar wx-shimmer" />
            </div>
            <button class="code-toggle" @click="tog('shimmer')">{{ openCode['shimmer'] ? '▲ Code' : '▼ Code' }}</button>
            <div v-if="openCode['shimmer']" class="code-block">
<pre>/* Already in motion.css */
.wx-shimmer {
  background: linear-gradient(
    90deg,
    var(--wx-surface-sunken) 25%,
    var(--wx-surface-elevated) 50%,
    var(--wx-surface-sunken) 75%
  );
  background-size: 200% 100%;
  animation: wx-shimmer
    var(--wx-d-decorative)
    linear infinite;
}</pre>
            </div>
            <p class="demo-note">Dùng cho: placeholder list, card loading.</p>
          </div>

          <!-- pulse skeleton -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Pulse Skeleton</span>
              <div class="token-chips"><span class="chip chip--d">1200ms · ease-in-out · repeat</span></div>
            </div>
            <div class="demo-area demo-area--col">
              <div class="skel skel--title wx-pulse" />
              <div class="skel skel--line wx-pulse" />
              <div class="skel skel--line skel--line-sm wx-pulse" />
              <div class="skel skel--card wx-pulse" />
            </div>
            <button class="code-toggle" @click="tog('pulse')">{{ openCode['pulse'] ? '▲ Code' : '▼ Code' }}</button>
            <div v-if="openCode['pulse']" class="code-block">
<pre>/* Already in motion.css */
.wx-pulse {
  animation: wx-pulse
    1200ms
    ease-in-out
    infinite;
}
@keyframes wx-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .45; }
}</pre>
            </div>
            <p class="demo-note">Dùng cho: image placeholder, khi layout đơn giản.</p>
          </div>

          <!-- button loading -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Button Loading State</span>
              <div class="token-chips"><span class="chip chip--d">d-decorative</span></div>
            </div>
            <div class="demo-area">
              <BaseButton :loading="btnLoading" @click="triggerBtnLoad">
                {{ btnLoading ? '' : 'Lưu thay đổi' }}
              </BaseButton>
            </div>
            <p class="demo-note">BaseButton tự quản lý loading spinner qua prop <code>:loading</code>.</p>
          </div>

        </div>
      </section>

      <!-- ══════════════════════════ FORM FEEDBACK ══════════════════════════ -->
      <section class="section">
        <h2 class="section__title">Form Feedback</h2>

        <div class="demo-grid">

          <!-- error shake -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Error Shake</span>
              <div class="token-chips"><span class="chip chip--d">600ms · ease-in-out</span></div>
            </div>
            <div class="demo-area">
              <div class="shake-field" :class="{ 'shake-anim': shakeActive }">
                <input type="text" class="fake-input" placeholder="Email không hợp lệ" readonly />
              </div>
            </div>
            <div class="demo-actions">
              <BaseButton variant="danger" size="sm" @click="triggerShake">Kích hoạt</BaseButton>
              <button class="code-toggle" @click="tog('shake')">{{ openCode['shake'] ? '▲ Code' : '▼ Code' }}</button>
            </div>
            <div v-if="openCode['shake']" class="code-block">
<pre>@keyframes wx-shake {
  0%, 100% { transform: translateX(0); }
  15%       { transform: translateX(-8px); }
  45%       { transform: translateX(8px); }
  75%       { transform: translateX(-5px); }
  90%       { transform: translateX(3px); }
}
.shake-anim {
  animation: wx-shake 600ms ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .shake-anim { animation: none; }
}</pre>
            </div>
            <p class="demo-note">Dùng khi submit form với lỗi validation.</p>
          </div>

          <!-- success check -->
          <div class="demo-card">
            <div class="demo-card__head">
              <span class="demo-card__name">Success Check</span>
              <div class="token-chips">
                <span class="chip chip--d">d-normal</span>
                <span class="chip chip--e">ease-spring</span>
              </div>
            </div>
            <div class="demo-area">
              <div class="success-wrap" :class="{ 'success-wrap--active': successActive }">
                <svg class="success-icon" viewBox="0 0 52 52">
                  <circle class="success-circle" cx="26" cy="26" r="25" fill="none" />
                  <path class="success-check" fill="none" d="M14 27 l8 8 l16-16" />
                </svg>
              </div>
            </div>
            <div class="demo-actions">
              <BaseButton variant="success" size="sm" @click="triggerSuccess">Kích hoạt</BaseButton>
              <button class="code-toggle" @click="tog('success')">{{ openCode['success'] ? '▲ Code' : '▼ Code' }}</button>
            </div>
            <div v-if="openCode['success']" class="code-block">
<pre>/* SVG stroke-dasharray trick */
.success-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  transition: stroke-dashoffset
    var(--wx-d-normal)
    var(--wx-ease-decelerate);
}
.success-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  transition: stroke-dashoffset
    var(--wx-d-fast)
    var(--wx-ease-spring) 200ms;
}
.success-wrap--active .success-circle,
.success-wrap--active .success-check {
  stroke-dashoffset: 0;
}</pre>
            </div>
            <p class="demo-note">Dùng khi submit thành công, upload hoàn tất.</p>
          </div>

        </div>
      </section>

      <!-- ══════════════════════════ REDUCED MOTION ══════════════════════════ -->
      <section class="section section--note">
        <h2 class="section__title">Reduced Motion</h2>
        <p>Luôn bọc animation trong <code>@media (prefers-reduced-motion: reduce)</code> để tắt hoặc giảm animation cho người dùng nhạy cảm.</p>
        <div class="code-block code-block--inline">
<pre>@media (prefers-reduced-motion: reduce) {
  /* Option 1: tắt hoàn toàn */
  .my-transition { transition: none; }

  /* Option 2: chỉ giữ opacity, bỏ transform */
  .my-transition {
    transition: opacity var(--wx-d-micro) linear;
  }
}</pre>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--wx-surface-sunken); }
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--wx-space-6) var(--wx-space-6) var(--wx-space-12);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-8);
}

/* header */
.hdr { padding-top: var(--wx-space-2); }
.hdr__title { margin: 0 0 6px; font-size: var(--wx-fs-26); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.hdr__sub   { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }

/* section */
.section { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.section__title { margin: 0 0 2px; font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.section__desc  { margin: 0; font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }
.section--note {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  padding: var(--wx-space-5);
}
.section--note p { margin: 0 0 var(--wx-space-3); font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }

/* two-col */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-4);
}
@media (max-width: 640px) { .two-col { grid-template-columns: 1fr; } }

/* token table */
.token-table {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  overflow: hidden;
}
.token-table__head {
  padding: 10px 16px;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-bold);
  text-transform: uppercase;
  letter-spacing: .6px;
  color: var(--wx-text-muted);
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.token-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: 10px 16px;
  font-size: var(--wx-fs-12);
  border-bottom: 1px solid var(--wx-border-subtle);
  flex-wrap: wrap;
}
.token-row:last-child { border-bottom: none; }
.token-row--ease { flex-direction: column; align-items: flex-start; gap: 3px; }
.token-row__bar-wrap { width: 80px; height: 6px; background: var(--wx-surface-sunken); border-radius: 3px; overflow: hidden; flex-shrink: 0; }
.token-row__bar { height: 100%; border-radius: 3px; transition: none; }
.token-row__name { font-family: var(--wx-font-mono); font-size: 11px; color: var(--wx-brand-primary); }
.token-row__val  { font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.token-row__val--sm { font-size: 10px; color: var(--wx-text-muted); }
.token-row__use  { margin-left: auto; color: var(--wx-text-muted); font-size: 11px; }

/* chip */
.chip {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  font-size: 10px;
  font-weight: var(--wx-fw-semibold);
}
.chip--d { background: color-mix(in srgb, var(--wx-brand-primary) 12%, transparent); color: var(--wx-brand-primary); }
.chip--e { background: color-mix(in srgb, #10b981 12%, transparent); color: #059669; }

/* demo grid */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--wx-space-4);
}

/* demo card */
.demo-card {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  padding: var(--wx-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
}
.demo-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-2);
  flex-wrap: wrap;
}
.demo-card__name {
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
}
.token-chips { display: flex; gap: 4px; flex-wrap: wrap; }

/* demo area */
.demo-area {
  min-height: 100px;
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--wx-space-3);
}
.demo-area--col { flex-direction: column; align-items: stretch; gap: var(--wx-space-2); }

.demo-box {
  width: 100px; height: 60px;
  border-radius: var(--wx-radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--wx-fs-12); font-weight: var(--wx-fw-medium);
}
.demo-box--brand   { background: var(--wx-brand-primary); color: #fff; }
.demo-box--surface { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); color: var(--wx-text-primary); }
.demo-box--shadow  { box-shadow: 0 8px 24px -4px rgba(0,0,0,.16); width: 140px; height: 80px; }
.demo-box--drawer  { width: 100%; height: 90px; border-radius: 0; justify-content: flex-end; padding-right: 16px; }

.demo-actions { display: flex; align-items: center; gap: var(--wx-space-2); }
.demo-note { margin: 0; font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

/* code toggle */
.code-toggle {
  background: none; border: none;
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-link, var(--wx-brand-primary));
  cursor: pointer; padding: 2px 0;
}
.code-toggle:hover { text-decoration: underline; }

/* code block */
.code-block {
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  overflow: hidden;
}
.code-block--inline { border-radius: var(--wx-radius-xl); }
.code-block pre {
  margin: 0;
  padding: var(--wx-space-3);
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-secondary);
  line-height: 1.65;
  overflow-x: auto;
}

/* ── Enter/Leave transitions ── */
.anim-fade-enter-active,
.anim-fade-leave-active {
  transition: opacity var(--wx-d-normal, 250ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
}
.anim-fade-enter-from,
.anim-fade-leave-to { opacity: 0; }

.anim-scale-enter-active {
  transition: all var(--wx-d-normal, 250ms) var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1));
}
.anim-scale-leave-active {
  transition: all var(--wx-d-fast, 150ms) var(--wx-ease-accelerate, cubic-bezier(.4,0,1,1));
}
.anim-scale-enter-from { opacity: 0; transform: scale(.94); }
.anim-scale-leave-to   { opacity: 0; transform: scale(.96); }

.anim-slide-up-enter-active {
  transition: all var(--wx-d-normal, 250ms) var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1));
}
.anim-slide-up-leave-active {
  transition: all var(--wx-d-fast, 150ms) var(--wx-ease-accelerate, cubic-bezier(.4,0,1,1));
}
.anim-slide-up-enter-from,
.anim-slide-up-leave-to { opacity: 0; transform: translateY(16px); }

.anim-drawer-enter-active {
  transition: transform var(--wx-d-normal, 250ms) var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1));
}
.anim-drawer-leave-active {
  transition: transform var(--wx-d-fast, 150ms) var(--wx-ease-accelerate, cubic-bezier(.4,0,1,1));
}
.anim-drawer-enter-from,
.anim-drawer-leave-to { transform: translateX(-100%); }

/* ── Hover effects ── */
.hover-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--wx-space-4); }
.hover-item { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.hover-card {
  height: 100px;
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px; cursor: pointer;
}
.hover-label { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.hover-sub   { font-size: var(--wx-fs-11); color: var(--wx-text-muted); }
.hover-code  {
  font-family: var(--wx-font-mono); font-size: 10px;
  color: var(--wx-text-muted); background: var(--wx-surface-sunken);
  padding: 4px 8px; border-radius: var(--wx-radius-sm);
  border: 1px solid var(--wx-border-subtle);
}

.hover-lift {
  transition: transform var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1)),
              box-shadow var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px -6px rgba(0,0,0,.18);
}
.hover-glow {
  transition: box-shadow var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
}
.hover-glow:hover {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-brand-primary) 25%, transparent);
  border-color: var(--wx-brand-primary);
}
.hover-scale {
  transition: transform var(--wx-d-fast, 150ms) var(--wx-ease-spring, cubic-bezier(.34,1.56,.64,1));
}
.hover-scale:hover { transform: scale(1.03); }

.hover-reveal { position: relative; overflow: hidden; }
.hover-reveal__content { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; width: 100%; height: 100%; }
.hover-reveal__action {
  position: absolute; inset: 0;
  background: color-mix(in srgb, var(--wx-brand-primary) 90%, transparent);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold);
  opacity: 0;
  transition: opacity var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
  border-radius: calc(var(--wx-radius-xl) - 2px);
}
.hover-reveal:hover .hover-reveal__action { opacity: 1; }

/* ── Tab indicator ── */
.tab-demo { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.tab-bar {
  position: relative;
  display: flex;
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-lg);
  padding: 4px;
  gap: 0;
}
.tab-indicator {
  position: absolute;
  top: 4px; left: 4px;
  height: calc(100% - 8px);
  background: var(--wx-surface-elevated);
  border-radius: calc(var(--wx-radius-lg) - 4px);
  box-shadow: 0 1px 4px rgba(0,0,0,.1);
  transition: transform var(--wx-d-fast, 150ms) var(--wx-ease-spring, cubic-bezier(.34,1.56,.64,1));
}
.tab-btn {
  flex: 1; position: relative; z-index: 1;
  padding: 8px 12px; border: none; background: transparent;
  font-size: var(--wx-fs-13); font-family: var(--wx-font-primary);
  font-weight: var(--wx-fw-medium); color: var(--wx-text-muted);
  border-radius: calc(var(--wx-radius-lg) - 4px); cursor: pointer;
  transition: color var(--wx-d-fast, 150ms);
}
.tab-btn--active { color: var(--wx-text-primary); font-weight: var(--wx-fw-semibold); }
.tab-content { padding: var(--wx-space-3); background: var(--wx-surface-sunken); border-radius: var(--wx-radius-md); min-height: 60px; display: flex; align-items: center; }
.tab-panel { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
}
.tab-fade-enter-from,
.tab-fade-leave-to { opacity: 0; }

/* ── Skeleton ── */
.skel { border-radius: var(--wx-radius-md); background: var(--wx-surface-sunken); }
.skel--title  { height: 18px; width: 60%; }
.skel--line   { height: 12px; width: 100%; }
.skel--line-sm { width: 75%; }
.skel--avatar { height: 40px; width: 40px; border-radius: 50%; }
.skel--card   { height: 60px; width: 100%; }

/* shimmer/pulse — global classes from motion.css */
:global(.wx-shimmer) {
  background: linear-gradient(
    90deg,
    var(--wx-surface-sunken) 25%,
    var(--wx-surface-elevated) 50%,
    var(--wx-surface-sunken) 75%
  );
  background-size: 200% 100%;
  animation: wx-shimmer 700ms linear infinite;
}
:global(.wx-pulse) {
  animation: wx-pulse 1200ms ease-in-out infinite;
}

/* ── Error shake ── */
.shake-field { padding: 4px; }
.fake-input {
  width: 100%; padding: 8px 12px;
  border: 1.5px solid var(--wx-error-border, #fca5a5);
  border-radius: var(--wx-radius-md);
  background: var(--wx-error-bg, #fee2e2);
  font-size: var(--wx-fs-13);
  font-family: var(--wx-font-primary);
  color: var(--wx-error-text, #991b1b);
  pointer-events: none;
}

@keyframes wx-shake {
  0%, 100% { transform: translateX(0); }
  15%  { transform: translateX(-8px); }
  45%  { transform: translateX(8px); }
  75%  { transform: translateX(-5px); }
  90%  { transform: translateX(3px); }
}
.shake-anim { animation: wx-shake 600ms ease-in-out; }

@media (prefers-reduced-motion: reduce) {
  .shake-anim { animation: none; border-color: var(--wx-error-border, #fca5a5); }
}

/* ── Success check ── */
.success-wrap {
  width: 64px; height: 64px;
  display: flex; align-items: center; justify-content: center;
}
.success-icon { width: 52px; height: 52px; }
.success-circle {
  stroke: var(--wx-success-text, #15803d);
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  transition: stroke-dashoffset var(--wx-d-normal, 250ms) var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1));
}
.success-check {
  stroke: var(--wx-success-text, #15803d);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  transition: stroke-dashoffset var(--wx-d-fast, 150ms) var(--wx-ease-spring, cubic-bezier(.34,1.56,.64,1)) 200ms;
}
.success-wrap--active .success-circle,
.success-wrap--active .success-check {
  stroke-dashoffset: 0;
}

@media (prefers-reduced-motion: reduce) {
  .success-circle,
  .success-check { transition: none; }
  .success-wrap--active .success-circle,
  .success-wrap--active .success-check {
    stroke-dashoffset: 0;
    transition: none;
  }
}

/* ── shimmer/pulse keyframes (fallback nếu motion.css chưa load) ── */
@keyframes wx-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
@keyframes wx-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: .45; }
}
</style>
