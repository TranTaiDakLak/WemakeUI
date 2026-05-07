<script setup lang="ts">
import { ref, computed } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton, BaseInput, BaseSelectMenu, BaseToggle, FormField } from '../../components/common'

const step      = ref(0)
const direction = ref<'forward' | 'backward'>('forward')
const showCode  = ref(false)

const steps = [
  { label: 'Thông tin', icon: '①' },
  { label: 'Cài đặt',   icon: '②' },
  { label: 'Xác nhận',  icon: '③' },
]

// Step 1
const firstName = ref('')
const lastName  = ref('')
const email     = ref('')

// Step 2
const timezone = ref('utc+7')
const lang     = ref('vi')
const marketing = ref(false)

// Step 3 — review only

const timezoneOpts = [
  { value: 'utc+7', label: '(UTC+7) Hà Nội' },
  { value: 'utc+8', label: '(UTC+8) Singapore' },
  { value: 'utc+9', label: '(UTC+9) Tokyo' },
  { value: 'utc+0', label: '(UTC+0) London' },
]
const langOpts = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
]

const transitionName = computed(() =>
  direction.value === 'forward' ? 'wiz-fwd' : 'wiz-bwd'
)

function next() {
  direction.value = 'forward'
  step.value++
}
function back() {
  direction.value = 'backward'
  step.value--
}

const done = ref(false)
function finish() { done.value = true }
function restart() { step.value = 0; done.value = false; firstName.value = ''; email.value = '' }
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — wizard" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">Multi-step Wizard</h1>
        <p class="fp__desc">
          Form nhiều bước với step indicator, slide transition có chiều (forward/backward). Pattern phổ biến cho onboarding, checkout, setup flows.
        </p>
      </div>

      <!-- Wizard card -->
      <Transition name="wiz-done">
        <div v-if="done" class="fp__card fp__card--success">
          <div class="wiz-done">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2.5" fill="none" opacity=".2"/>
              <path class="wiz-check-path" d="M14 24l8 8 12-14" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <p class="wiz-done-title">Thiết lập hoàn tất!</p>
            <p class="wiz-done-sub">Tài khoản đã sẵn sàng. Chào mừng <strong>{{ firstName || 'bạn' }}</strong>.</p>
            <BaseButton size="sm" variant="ghost" @click="restart">Bắt đầu lại</BaseButton>
          </div>
        </div>
      </Transition>

      <div v-if="!done" class="fp__card wiz-card">
        <!-- Step indicator -->
        <div class="wiz-steps">
          <template v-for="(s, i) in steps" :key="i">
            <div class="wiz-step" :class="{ 'wiz-step--active': i === step, 'wiz-step--done': i < step }">
              <div class="wiz-step-dot">
                <svg v-if="i < step" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="wiz-step-label">{{ s.label }}</span>
            </div>
            <div v-if="i < steps.length - 1" class="wiz-connector" :class="{ 'wiz-connector--done': i < step }" />
          </template>
        </div>

        <!-- Step content -->
        <div class="wiz-body">
          <Transition :name="transitionName" mode="out-in">
            <!-- Step 0: Info -->
            <div v-if="step === 0" key="s0" class="wiz-step-content">
              <p class="wiz-step-title">Thông tin cá nhân</p>
              <div class="fp__form">
                <div class="fp__row">
                  <FormField label="Họ" required>
                    <BaseInput v-model="lastName" placeholder="Nguyễn" />
                  </FormField>
                  <FormField label="Tên" required>
                    <BaseInput v-model="firstName" placeholder="Văn A" />
                  </FormField>
                </div>
                <FormField label="Email" required>
                  <BaseInput v-model="email" type="email" placeholder="ban@example.com" />
                </FormField>
              </div>
            </div>

            <!-- Step 1: Settings -->
            <div v-else-if="step === 1" key="s1" class="wiz-step-content">
              <p class="wiz-step-title">Cài đặt tài khoản</p>
              <div class="fp__form">
                <FormField label="Múi giờ">
                  <BaseSelectMenu v-model="timezone" :options="timezoneOpts" />
                </FormField>
                <FormField label="Ngôn ngữ">
                  <BaseSelectMenu v-model="lang" :options="langOpts" />
                </FormField>
                <div class="wiz-toggle-row">
                  <BaseToggle v-model="marketing" label="Nhận email về tính năng mới và ưu đãi" />
                </div>
              </div>
            </div>

            <!-- Step 2: Confirm -->
            <div v-else key="s2" class="wiz-step-content">
              <p class="wiz-step-title">Xác nhận thông tin</p>
              <div class="wiz-review">
                <div class="wiz-review-row"><span class="wiz-review-k">Họ tên</span><span class="wiz-review-v">{{ lastName }} {{ firstName }}</span></div>
                <div class="wiz-review-row"><span class="wiz-review-k">Email</span><span class="wiz-review-v">{{ email || '—' }}</span></div>
                <div class="wiz-review-row"><span class="wiz-review-k">Múi giờ</span><span class="wiz-review-v">{{ timezoneOpts.find(o => o.value === timezone)?.label }}</span></div>
                <div class="wiz-review-row"><span class="wiz-review-k">Ngôn ngữ</span><span class="wiz-review-v">{{ langOpts.find(o => o.value === lang)?.label }}</span></div>
                <div class="wiz-review-row"><span class="wiz-review-k">Email marketing</span><span class="wiz-review-v">{{ marketing ? 'Bật' : 'Tắt' }}</span></div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Nav -->
        <div class="wiz-nav">
          <BaseButton v-if="step > 0" variant="ghost" size="sm" @click="back">← Quay lại</BaseButton>
          <div v-else />
          <BaseButton v-if="step < 2" size="sm" @click="next">Tiếp theo →</BaseButton>
          <BaseButton v-else size="sm" @click="finish">Hoàn tất ✓</BaseButton>
        </div>
      </div>

      <!-- How it works -->
      <div class="fp__card fp__card--info">
        <p class="fp__card-title">Cách hoạt động</p>
        <ul class="fp__list">
          <li><code>direction</code> ref — quyết định tên transition (<code>wiz-fwd</code> hoặc <code>wiz-bwd</code>)</li>
          <li>Leaving element dùng <code>position: absolute</code> để tránh layout shift khi 2 step hiện cùng lúc</li>
          <li>Step indicator: dot active + connector filled khi step đã qua</li>
          <li>Step 3 chỉ review dữ liệu — không có thêm input mới</li>
        </ul>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code snippet</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>// Direction-aware slide
const direction = ref&lt;'forward' | 'backward'&gt;('forward')
const transitionName = computed(() =>
  direction.value === 'forward' ? 'wiz-fwd' : 'wiz-bwd'
)
function next() { direction.value = 'forward'; step.value++ }
function back() { direction.value = 'backward'; step.value-- }

&lt;!-- Template --&gt;
&lt;Transition :name="transitionName" mode="out-in"&gt;
  &lt;div v-if="step === 0" key="s0"&gt;...&lt;/div&gt;
  &lt;div v-else-if="step === 1" key="s1"&gt;...&lt;/div&gt;
  &lt;div v-else key="s2"&gt;...&lt;/div&gt;
&lt;/Transition&gt;

/* CSS — bidirectional */
.wiz-body { position: relative; overflow: hidden; }
.wiz-fwd-leave-active,
.wiz-bwd-leave-active  { position: absolute; top: 0; left: 0; right: 0; }

.wiz-fwd-enter-from    { transform: translateX(40px); opacity: 0; }
.wiz-fwd-leave-to      { transform: translateX(-40px); opacity: 0; }
.wiz-bwd-enter-from    { transform: translateX(-40px); opacity: 0; }
.wiz-bwd-leave-to      { transform: translateX(40px); opacity: 0; }</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Components:</span>
          <span v-for="c in ['BaseInput','BaseSelect','BaseToggle','FormField','BaseButton']" :key="c" class="fp__chip">{{ c }}</span>
          <span class="fp__meta-label" style="margin-left:8px">Patterns:</span>
          <span v-for="p in ['MultiStepWizard','DirectionTransition','StepIndicator','ReviewStep']" :key="p" class="fp__chip">{{ p }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fp { min-height: 100vh; background: var(--wx-surface-sunken); }
.fp__main { max-width: 720px; margin: 0 auto; padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-10); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__hdr { margin-top: var(--wx-space-2); }
.fp__title { margin: 0 0 4px; font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.fp__desc  { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); line-height: 1.6; }
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__card--info { background: color-mix(in srgb, var(--wx-brand-primary) 5%, var(--wx-surface-elevated)); border-color: color-mix(in srgb, var(--wx-brand-primary) 20%, transparent); }
.fp__card--success { background: color-mix(in srgb, #22c55e 8%, var(--wx-surface-elevated)); border-color: color-mix(in srgb, #22c55e 30%, transparent); color: #16a34a; }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }
.fp__form { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.fp__row  { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }
@media (max-width: 560px) { .fp__row { grid-template-columns: 1fr; } }
.fp__list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.fp__list li { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); line-height: 1.5; }
.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }

/* Wizard */
.wiz-card { gap: 0; }
.wiz-steps {
  display: flex; align-items: center; padding-bottom: var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle); margin-bottom: var(--wx-space-4);
}
.wiz-step { display: flex; align-items: center; gap: 8px; }
.wiz-step-dot {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--wx-fs-12); font-weight: var(--wx-fw-bold);
  border: 2px solid var(--wx-border-default);
  color: var(--wx-text-muted);
  background: var(--wx-surface-elevated);
  transition: all var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
  flex-shrink: 0;
}
.wiz-step--active .wiz-step-dot {
  border-color: var(--wx-brand-primary);
  background: var(--wx-brand-primary);
  color: #fff;
}
.wiz-step--done .wiz-step-dot {
  border-color: var(--wx-brand-primary);
  background: var(--wx-brand-primary);
  color: #fff;
}
.wiz-step-label { font-size: var(--wx-fs-13); color: var(--wx-text-muted); white-space: nowrap; }
.wiz-step--active .wiz-step-label { color: var(--wx-text-primary); font-weight: var(--wx-fw-medium); }
.wiz-connector {
  flex: 1; height: 2px; background: var(--wx-border-default); margin: 0 8px;
  transition: background var(--wx-d-fast, 150ms);
}
.wiz-connector--done { background: var(--wx-brand-primary); }

.wiz-body { position: relative; overflow: hidden; min-height: 180px; }
.wiz-step-content { padding-bottom: var(--wx-space-2); }
.wiz-step-title { margin: 0 0 var(--wx-space-3); font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }

.wiz-toggle-row { padding: var(--wx-space-2) 0; }

.wiz-review { display: flex; flex-direction: column; gap: 2px; }
.wiz-review-row { display: flex; gap: var(--wx-space-3); padding: var(--wx-space-2) 0; border-bottom: 1px solid var(--wx-border-subtle); }
.wiz-review-row:last-child { border-bottom: none; }
.wiz-review-k { min-width: 120px; font-size: var(--wx-fs-13); color: var(--wx-text-muted); }
.wiz-review-v { font-size: var(--wx-fs-13); color: var(--wx-text-primary); font-weight: var(--wx-fw-medium); }

.wiz-nav {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: var(--wx-space-4); border-top: 1px solid var(--wx-border-subtle);
}

/* Bidirectional slide */
.wiz-fwd-enter-active,
.wiz-fwd-leave-active,
.wiz-bwd-enter-active,
.wiz-bwd-leave-active {
  transition: all var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1));
}
.wiz-fwd-leave-active,
.wiz-bwd-leave-active { position: absolute; top: 0; left: 0; right: 0; }

.wiz-fwd-enter-from { transform: translateX(40px); opacity: 0; }
.wiz-fwd-leave-to   { transform: translateX(-40px); opacity: 0; }
.wiz-bwd-enter-from { transform: translateX(-40px); opacity: 0; }
.wiz-bwd-leave-to   { transform: translateX(40px); opacity: 0; }

/* Done state */
.wiz-done { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-3); padding: var(--wx-space-4) 0; text-align: center; }
.wiz-done-title { margin: 0; font-size: var(--wx-fs-18); font-weight: var(--wx-fw-bold); color: #16a34a; }
.wiz-done-sub   { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }
.wiz-check-path {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw-check 0.5s var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1)) 0.1s forwards;
}
@keyframes draw-check { to { stroke-dashoffset: 0; } }

.wiz-done-enter-active { transition: all var(--wx-d-normal, 250ms) var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1)); }
.wiz-done-enter-from   { opacity: 0; transform: scale(.96); }

@media (prefers-reduced-motion: reduce) {
  .wiz-fwd-enter-active, .wiz-fwd-leave-active,
  .wiz-bwd-enter-active, .wiz-bwd-leave-active { transition: opacity var(--wx-d-fast, 150ms); }
  .wiz-fwd-enter-from, .wiz-bwd-enter-from { transform: none; }
  .wiz-fwd-leave-to, .wiz-bwd-leave-to { transform: none; }
  .wiz-check-path { animation: none; stroke-dashoffset: 0; }
}
</style>
