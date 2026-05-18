<script setup lang="ts">
/**
 * Phase 0 — Tokens showcase
 *  Hiển thị toàn bộ tokens mới (color, gradient, radius, spacing,
 *  typography, motion) — duyệt xem rồi mới sang phase 1.
 */
import { ref } from 'vue'
import { BaseSelectMenu } from '../../components/common'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import { useTheme, type Theme, type Variant } from '../../ui-system/composables/useTheme'

const {
  theme, setTheme,
  variant, setVariant,
  brandColor, setBrandColor,
  accentColor, setAccentColor,
  resetColors,
} = useTheme()
function pickTheme(t: Theme) { setTheme(t) }
function pickVariant(v: Variant) { setVariant(v) }

const brandInput = ref('#8b5cf6')
const accentInput = ref('#ec4899')
const brandPresets = ['#2563eb', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#14b8a6'] as const

const scaleStops = ['50','100','200','300','400','500','600','700','800','900'] as const

const feedbackTokens = [
  { name: 'success', solid: 'success-solid', bg: 'success-bg', text: 'success-text', border: 'success-border' },
  { name: 'danger',  solid: 'danger-solid',  bg: 'danger-bg',  text: 'danger-text',  border: 'danger-border' },
  { name: 'warning', solid: 'warning-solid', bg: 'warning-bg', text: 'warning-text', border: 'warning-border' },
  { name: 'info',    solid: 'info-solid',    bg: 'info-bg',    text: 'info-text',    border: 'info-border' },
  { name: 'neutral', solid: 'neutral-solid', bg: 'neutral-bg', text: 'neutral-text', border: 'neutral-border' },
] as const

function setFeedbackSolid(name: string, hex: string) {
  document.documentElement.style.setProperty(`--wx-${name}-solid`, hex)
}
function resetFeedback() {
  for (const f of feedbackTokens) {
    document.documentElement.style.removeProperty(`--wx-${f.solid}`)
  }
}

interface RadiusItem { name: string; value: string; hint?: string }
const radiusList: RadiusItem[] = [
  { name: 'none', value: '0' },
  { name: 'sm',   value: '4px' },
  { name: 'md',   value: '8px',  hint: 'button, input, tooltip, toast' },
  { name: 'lg',   value: '12px', hint: 'card, group box, list item' },
  { name: 'xl',   value: '16px', hint: 'modal, drawer' },
  { name: '2xl',  value: '24px', hint: 'feature card, pricing' },
  { name: '3xl',  value: '30px', hint: 'banner CTA' },
  { name: '4xl',  value: '32px', hint: 'onboarding' },
  { name: 'full', value: '9999px', hint: 'avatar, badge, pill' },
]

const spaceList = Array.from({ length: 13 }, (_, i) => ({
  step: i,
  px: [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128][i],
}))

const fsList = [12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 40, 48, 64] as const

const gradientList = [
  'bg', 'header', 'cta', 'button', 'accent', 'text',
  'success', 'danger', 'warning',
] as const

const durationList = [
  { name: 'micro',      ms: '100ms', use: 'hover, focus' },
  { name: 'fast',       ms: '150ms', use: 'small swap, page fade' },
  { name: 'normal',     ms: '250ms', use: 'modal, drawer' },
  { name: 'slow',       ms: '400ms', use: 'section transition' },
  { name: 'decorative', ms: '700ms', use: 'hero, illustration' },
] as const

const easingList = [
  'standard', 'decelerate', 'accelerate', 'bounce', 'spring',
] as const

const motionDuration = ref<typeof durationList[number]['name']>('normal')
const motionEasing = ref<typeof easingList[number]>('standard')
const motionTrigger = ref(false)
let motionResetTimer: number | undefined
function bumpMotion() {
  motionTrigger.value = true
  if (motionResetTimer) window.clearTimeout(motionResetTimer)
  motionResetTimer = window.setTimeout(() => {
    motionTrigger.value = false
  }, 1400)
}
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="phase 0 — tokens">
      <template #actions>
        <div class="theme-switch" role="group" aria-label="chọn theme">
          <button
            v-for="t in (['light','system','dark'] as Theme[])"
            :key="t"
            :data-active="theme === t"
            class="theme-btn"
            @click="pickTheme(t)"
          >{{ t }}</button>
        </div>
      </template>
    </AppTopbar>

    <main class="main">
      <PageHeader
        title="phase 0 — tokens showcase"
        description="bộ tokens nền tảng: color, gradient, radius, spacing, typography, motion. duyệt xong → sang phase 1 (base primitives)."
      />

      <!-- ── 1. Brand color (solid) ─────────────────── -->
      <section class="section">
        <h2 class="h">1. brand color — solid scale</h2>
        <p class="muted">
          3 alias chính + dải 10 stops (50→900). Khi đổi brand bên dưới, toàn bộ dải này
          được generate lại bằng HSL — đây là "màu đơn" cascade qua mọi component.
        </p>
        <div class="row">
          <div class="swatch" :style="{ background: 'var(--wx-brand-primary)' }">
            <span class="swatch-name">brand-primary</span>
            <span class="swatch-val">600</span>
          </div>
          <div class="swatch" :style="{ background: 'var(--wx-brand-accent)' }">
            <span class="swatch-name">brand-accent</span>
            <span class="swatch-val">cyan</span>
          </div>
          <div class="swatch" :style="{ background: 'var(--wx-brand-focus)' }">
            <span class="swatch-name">brand-focus</span>
            <span class="swatch-val">500</span>
          </div>
        </div>
        <div class="scale-strip">
          <div
            v-for="s in scaleStops"
            :key="s"
            class="scale-cell"
            :style="{ background: `var(--wx-brand-${s})` }"
          >
            <span class="scale-stop">{{ s }}</span>
          </div>
        </div>
        <div class="scale-strip scale-strip--accent">
          <div
            v-for="s in scaleStops"
            :key="`a-${s}`"
            class="scale-cell"
            :style="{ background: `var(--wx-accent-${s}, var(--wx-brand-${s}))` }"
          >
            <span class="scale-stop">{{ s }}</span>
          </div>
        </div>
        <span class="muted scale-caption">
          ↑ brand scale (top) — accent scale (bottom, chỉ active sau khi <code>setAccentColor()</code>)
        </span>
      </section>

      <!-- ── 1b. Theme playground ────────────────────── -->
      <section class="section">
        <h2 class="h">1b. theme playground — đổi brand / accent / variant runtime</h2>
        <p class="muted">
          custom brand color → toàn bộ gradient, button, shadow tự đổi theo.
          <code>variant=flat</code> tắt gradient → solid color. lưu localStorage, reload vẫn giữ.
        </p>

        <div class="playground">
          <div class="pg-row">
            <label class="pg-field">
              <span>brand color</span>
              <div class="pg-input-group">
                <input type="color" v-model="brandInput" class="pg-color" />
                <input type="text" v-model="brandInput" class="pg-text" />
                <button class="pg-btn" @click="setBrandColor(brandInput)">áp dụng</button>
              </div>
            </label>
            <div class="pg-presets">
              <button
                v-for="hex in brandPresets"
                :key="hex"
                class="pg-preset"
                :style="{ background: hex }"
                :title="hex"
                @click="setBrandColor(hex); brandInput = hex"
              />
            </div>
          </div>

          <div class="pg-row">
            <label class="pg-field">
              <span>accent color</span>
              <div class="pg-input-group">
                <input type="color" v-model="accentInput" class="pg-color" />
                <input type="text" v-model="accentInput" class="pg-text" />
                <button class="pg-btn" @click="setAccentColor(accentInput)">áp dụng</button>
              </div>
            </label>
            <button class="pg-btn pg-btn--ghost" @click="resetColors()">reset về default</button>
          </div>

          <div class="pg-row">
            <span class="pg-label">variant</span>
            <div class="pg-variant-switch" role="group" aria-label="chọn variant">
              <button
                v-for="v in (['default','flat'] as Variant[])"
                :key="v"
                :data-active="variant === v"
                class="pg-variant-btn"
                @click="pickVariant(v)"
              >{{ v }}</button>
            </div>
            <span class="pg-state">
              variant: <code>{{ variant }}</code> ·
              brand: <code>{{ brandColor ?? 'default' }}</code> ·
              accent: <code>{{ accentColor ?? 'default' }}</code>
            </span>
          </div>

          <div class="pg-preview">
            <button class="pg-demo-cta">button gradient</button>
            <button class="pg-demo-solid">button solid</button>
            <span class="pg-demo-text">text gradient</span>
            <div class="pg-demo-badge">badge</div>
          </div>
        </div>
      </section>

      <!-- ── 1c. Feedback solid colors ──────────────── -->
      <section class="section">
        <h2 class="h">1c. feedback colors — solid, bg, text, border</h2>
        <p class="muted">
          5 semantic màu đơn (success / danger / warning / info / neutral) — mỗi cái có
          4 biến thể. Click color picker bên cạnh để override <code>--wx-{name}-solid</code> runtime.
        </p>
        <div class="feedback-grid">
          <div v-for="f in feedbackTokens" :key="f.name" class="feedback-card">
            <div class="feedback-head">
              <span class="feedback-name">{{ f.name }}</span>
              <input
                type="color"
                class="pg-color"
                :value="undefined"
                @input="setFeedbackSolid(f.solid, ($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="feedback-swatches">
              <div class="fb-cell" :style="{ background: `var(--wx-${f.solid})` }">solid</div>
              <div
                class="fb-cell fb-cell--soft"
                :style="{
                  background: `var(--wx-${f.bg})`,
                  color: `var(--wx-${f.text})`,
                  borderColor: `var(--wx-${f.border})`,
                }"
              >bg + text + border</div>
            </div>
          </div>
        </div>
        <button class="pg-btn pg-btn--ghost" @click="resetFeedback()" style="margin-top: var(--wx-space-3)">
          reset feedback colors
        </button>
      </section>

      <!-- ── 2. Gradient ────────────────────────────── -->
      <section class="section">
        <h2 class="h">2. gradient (11 tokens)</h2>
        <div class="row">
          <div
            v-for="g in gradientList"
            :key="g"
            class="grad-card"
            :style="{ background: `var(--wx-gradient-${g})` }"
          >
            <span class="grad-name">--wx-gradient-{{ g }}</span>
          </div>
        </div>
      </section>

      <!-- ── 3. Radius ──────────────────────────────── -->
      <section class="section">
        <h2 class="h">3. radius — bo góc bắt buộc</h2>
        <p class="muted">mọi component có default radius. không bao giờ <code>border-radius: 0</code> cho card / button / input / modal / dropdown.</p>
        <div class="row">
          <div
            v-for="r in radiusList"
            :key="r.name"
            class="radius-card"
            :style="{ borderRadius: `var(--wx-radius-${r.name})` }"
          >
            <div class="radius-name">{{ r.name }}</div>
            <div class="radius-val">{{ r.value }}</div>
            <div v-if="r.hint" class="radius-hint">{{ r.hint }}</div>
          </div>
        </div>
      </section>

      <!-- ── 4. Spacing 4pt ─────────────────────────── -->
      <section class="section">
        <h2 class="h">4. spacing — 4pt grid</h2>
        <p class="muted">mọi padding / gap / margin phải là bội số của 4px.</p>
        <div class="space-grid">
          <div v-for="s in spaceList" :key="s.step" class="space-row">
            <div class="space-label">space-{{ s.step }}</div>
            <div class="space-bar" :style="{ width: `var(--wx-space-${s.step})` }" />
            <div class="space-val">{{ s.px }}px</div>
          </div>
        </div>
      </section>

      <!-- ── 5. Typography ──────────────────────────── -->
      <section class="section">
        <h2 class="h">5. typography — Inter, sentence case</h2>
        <div class="type-grid">
          <div v-for="n in fsList" :key="n" class="type-row">
            <span class="type-key">fs-{{ n }}</span>
            <span class="type-sample" :style="{ fontSize: `var(--wx-fs-${n})` }">
              quá trình thiết kế hệ thống
            </span>
          </div>
        </div>
        <div class="weight-row">
          <span style="font-weight: var(--wx-fw-regular)">regular 400</span>
          <span style="font-weight: var(--wx-fw-medium)">medium 500</span>
          <span style="font-weight: var(--wx-fw-semibold)">semibold 600</span>
          <span style="font-weight: var(--wx-fw-bold)">bold 700</span>
        </div>
      </section>

      <!-- ── 6. Motion ──────────────────────────────── -->
      <section class="section">
        <h2 class="h">6. motion — duration & easing</h2>
        <p class="muted">
          chọn duration + easing rồi bấm <strong>chạy thử</strong> — quả bóng sẽ
          di chuyển từ <strong>start</strong> sang <strong>end</strong> theo
          tổ hợp đã chọn để cảm nhận tốc độ & cách giảm tốc.
        </p>
        <div class="motion-controls">
          <label>
            <span>duration</span>
            <BaseSelectMenu
              :model-value="motionDuration"
              size="sm"
              :options="durationList.map(d => ({ value: d.name, label: `${d.name} — ${d.ms} (${d.use})` }))"
              @update:model-value="motionDuration = $event as typeof motionDuration"
            />
          </label>
          <label>
            <span>easing</span>
            <BaseSelectMenu
              :model-value="motionEasing"
              size="sm"
              :options="easingList.map(e => ({ value: e, label: e }))"
              @update:model-value="motionEasing = $event as typeof motionEasing"
            />
          </label>
          <button class="cta" @click="bumpMotion">chạy thử</button>
          <span class="motion-current">
            đang dùng:
            <code>--wx-d-{{ motionDuration }}</code>
            +
            <code>--wx-ease-{{ motionEasing }}</code>
          </span>
        </div>
        <div class="motion-stage">
          <span class="motion-mark motion-mark--start">start</span>
          <span class="motion-mark motion-mark--end">end</span>
          <div class="motion-track" />
          <div
            class="motion-ball"
            :data-on="motionTrigger"
            :style="{
              transitionDuration: `var(--wx-d-${motionDuration})`,
              transitionTimingFunction: `var(--wx-ease-${motionEasing})`,
            }"
          />
        </div>
      </section>

      <!-- ── 7. Focus ring ──────────────────────────── -->
      <section class="section">
        <h2 class="h">7. focus ring (chỉ hiện qua bàn phím)</h2>
        <p class="muted">tab vào các nút dưới — ring 2px màu <code>--wx-border-focus</code>, offset 2px. chuột click không hiện.</p>
        <div class="row">
          <button class="demo-btn">nút A</button>
          <button class="demo-btn">nút B</button>
          <button class="demo-btn">nút C</button>
          <input class="demo-input" placeholder="input có focus ring" />
        </div>
      </section>

      <!-- ── 8. Sentence case rule ──────────────────── -->
      <section class="section">
        <h2 class="h">8. quy tắc viết — sentence case</h2>
        <ul class="rule-list">
          <li>✓ "đăng nhập" — không "ĐĂNG NHẬP"</li>
          <li>✓ "tạo đơn hàng mới" — không "Tạo Đơn Hàng Mới"</li>
          <li>✓ acronym viết hoa: API, UI, KPI, SLA, RBAC, SaaS, CRM, IoT</li>
          <li>✓ heading ≥ 24px → letter-spacing -0.01em, font-weight 600</li>
        </ul>
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
}
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--wx-space-5) var(--wx-space-4) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-6);
}

.theme-switch {
  display: inline-flex;
  background: rgba(255,255,255,0.1);
  border-radius: var(--wx-radius-full);
  padding: 2px;
  gap: 2px;
}
.theme-btn {
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.85);
  border-radius: var(--wx-radius-full);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  cursor: pointer;
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.theme-btn[data-active="true"] {
  background: rgba(255,255,255,0.2);
  color: #fff;
}

.section {
  background: var(--wx-bg-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-5);
  box-shadow: var(--wx-shadow-md);
}

.h {
  margin: 0 0 var(--wx-space-3);
  font-size: var(--wx-fs-20);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}
.muted {
  margin: 0 0 var(--wx-space-4);
  color: var(--wx-content-secondary);
  font-size: var(--wx-fs-14);
}
code {
  font-family: var(--wx-font-mono);
  background: var(--wx-bg-sunken);
  padding: 2px 6px;
  border-radius: var(--wx-radius-sm);
  font-size: var(--wx-fs-13);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-3);
}

/* ── 1. swatch ─── */
.swatch {
  width: 200px;
  height: 100px;
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-3);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
  font-size: var(--wx-fs-12);
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.swatch-name { font-weight: var(--wx-fw-semibold); }
.swatch-val  { font-family: var(--wx-font-mono); opacity: 0.9; }

/* ── 2. gradient card ─── */
.grad-card {
  width: 220px;
  height: 90px;
  border-radius: var(--wx-radius-lg);
  display: flex;
  align-items: flex-end;
  padding: var(--wx-space-2) var(--wx-space-3);
}
.grad-name {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}

/* ── 3. radius card ─── */
.radius-card {
  width: 140px;
  height: 110px;
  background: var(--wx-bg-raised);
  border: 1px solid var(--wx-border-default);
  padding: var(--wx-space-3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 2px;
}
.radius-name {
  font-weight: var(--wx-fw-semibold);
  font-size: var(--wx-fs-14);
}
.radius-val {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-secondary);
}
.radius-hint {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  margin-top: var(--wx-space-1);
}

/* ── 4. spacing ─── */
.space-grid { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.space-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
}
.space-label {
  width: 80px;
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-secondary);
}
.space-bar {
  height: 16px;
  background: var(--wx-gradient-button);
  border-radius: var(--wx-radius-sm);
  min-width: 1px;
}
.space-val {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
}

/* ── 5. typography ─── */
.type-grid {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.type-row {
  display: flex;
  align-items: baseline;
  gap: var(--wx-space-4);
}
.type-key {
  width: 70px;
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
}
.type-sample { font-weight: var(--wx-fw-medium); }
.weight-row {
  margin-top: var(--wx-space-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-4);
  font-size: var(--wx-fs-16);
}

/* ── 6. motion ─── */
.motion-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-3);
  align-items: flex-end;
  margin-bottom: var(--wx-space-4);
}
.motion-controls label {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-secondary);
}
.motion-controls select {
  height: 36px;
  padding: 0 var(--wx-space-3);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-bg-base);
  color: var(--wx-content-primary);
  font-size: var(--wx-fs-14);
}
.cta {
  height: 36px;
  padding: 0 var(--wx-space-4);
  border: none;
  border-radius: var(--wx-radius-md);
  background: var(--wx-gradient-button);
  color: #fff;
  font-weight: var(--wx-fw-semibold);
  font-size: var(--wx-fs-14);
  cursor: pointer;
  box-shadow: var(--wx-shadow-md);
}
.cta:hover { box-shadow: var(--wx-shadow-brand); transform: translateY(-1px); }
.cta:active { transform: scale(0.98); }
.motion-current {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  margin-left: auto;
}
.motion-current code {
  background: var(--wx-bg-sunken);
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  font-size: var(--wx-fs-12);
}
.motion-stage {
  height: 100px;
  background: var(--wx-bg-sunken);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-3) var(--wx-space-4);
  position: relative;
  overflow: hidden;
}
.motion-mark {
  position: absolute;
  top: var(--wx-space-2);
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  letter-spacing: var(--wx-tracking-wide);
}
.motion-mark--start { left: var(--wx-space-4); }
.motion-mark--end   { right: var(--wx-space-4); }
.motion-track {
  position: absolute;
  left: var(--wx-space-4);
  right: var(--wx-space-4);
  bottom: calc(50% - 1px);
  height: 2px;
  background:
    repeating-linear-gradient(
      to right,
      var(--wx-border-default) 0 6px,
      transparent 6px 12px
    );
}
.motion-ball {
  position: absolute;
  top: 50%;
  left: var(--wx-space-4);
  width: 40px;
  height: 40px;
  margin-top: -20px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-gradient-cta);
  box-shadow: var(--wx-shadow-brand);
  transition-property: transform;
  transform: translateX(0);
}
.motion-ball[data-on="true"] {
  /* stage có overflow:hidden + padding ~16, section max 1200px →
     ~1000px là đủ "đi tới end mark" trên desktop, clip gọn ở mobile */
  transform: translateX(min(880px, calc(100vw - 160px)));
}

/* ── 7. focus demo ─── */
.demo-btn {
  height: 36px;
  padding: 0 var(--wx-space-4);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-bg-base);
  color: var(--wx-content-primary);
  font-size: var(--wx-fs-14);
  cursor: pointer;
}
.demo-input {
  height: 36px;
  padding: 0 var(--wx-space-3);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-bg-base);
  color: var(--wx-content-primary);
  font-size: var(--wx-fs-14);
  min-width: 220px;
}

/* ── 1. scale strip ─── */
.scale-strip {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  margin-top: var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  overflow: hidden;
  border: 1px solid var(--wx-border-default);
}
.scale-strip--accent { margin-top: var(--wx-space-2); }
.scale-cell {
  height: 56px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: var(--wx-space-1);
}
.scale-stop {
  font-family: var(--wx-font-mono);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  font-weight: var(--wx-fw-semibold);
}
.scale-caption {
  display: block;
  margin-top: var(--wx-space-2);
  font-size: var(--wx-fs-12);
}

/* ── 1c. feedback grid ─── */
.feedback-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--wx-space-3);
}
.feedback-card {
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  padding: var(--wx-space-3);
  background: var(--wx-bg-base);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.feedback-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.feedback-name {
  font-weight: var(--wx-fw-semibold);
  font-size: var(--wx-fs-14);
  text-transform: lowercase;
}
.feedback-swatches {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: var(--wx-space-2);
}
.fb-cell {
  height: 56px;
  border-radius: var(--wx-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.fb-cell--soft {
  border-width: 1px;
  border-style: solid;
  text-shadow: none;
}

/* ── 1b. theme playground ─── */
.playground {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
  padding: var(--wx-space-5);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-bg-base);
}
.pg-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-4);
  flex-wrap: wrap;
}
.pg-field {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  font-size: var(--wx-fs-13);
  color: var(--wx-content-secondary);
}
.pg-input-group {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
}
.pg-color {
  width: 40px;
  height: 36px;
  padding: 2px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-bg-base);
  cursor: pointer;
}
.pg-text {
  height: 36px;
  padding: 0 var(--wx-space-3);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-bg-base);
  color: var(--wx-content-primary);
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-13);
  width: 110px;
}
.pg-btn {
  height: 36px;
  padding: 0 var(--wx-space-4);
  border: none;
  border-radius: var(--wx-radius-md);
  background: var(--wx-gradient-button);
  color: #fff;
  font-weight: var(--wx-fw-semibold);
  font-size: var(--wx-fs-13);
  cursor: pointer;
  box-shadow: var(--wx-shadow-brand);
  transition: transform var(--wx-d-fast) var(--wx-ease-standard);
}
.pg-btn:hover { transform: translateY(-1px); }
.pg-btn--ghost {
  background: transparent;
  color: var(--wx-content-secondary);
  border: 1px solid var(--wx-border-default);
  box-shadow: none;
}
.pg-presets {
  display: flex;
  gap: var(--wx-space-2);
  align-self: flex-end;
}
.pg-preset {
  width: 28px;
  height: 28px;
  border: 2px solid var(--wx-border-default);
  border-radius: var(--wx-radius-full);
  cursor: pointer;
  padding: 0;
  transition: transform var(--wx-d-fast) var(--wx-ease-standard);
}
.pg-preset:hover { transform: scale(1.15); }
.pg-label {
  font-size: var(--wx-fs-13);
  color: var(--wx-content-secondary);
  font-weight: var(--wx-fw-medium);
}
.pg-state {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  margin-left: auto;
}
.pg-variant-switch {
  display: inline-flex;
  gap: 4px;
  padding: 3px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-full);
  background: var(--wx-bg-sunken);
}
.pg-variant-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  color: var(--wx-content-secondary);
  border-radius: var(--wx-radius-full);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  cursor: pointer;
  text-transform: lowercase;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
}
.pg-variant-btn:hover { color: var(--wx-content-primary); }
.pg-variant-btn[data-active="true"] {
  background: var(--wx-brand-primary);
  color: #fff;
  box-shadow: var(--wx-shadow-sm);
}
.pg-state code {
  font-family: var(--wx-font-mono);
  background: var(--wx-bg-sunken);
  padding: 2px 6px;
  border-radius: var(--wx-radius-sm);
  color: var(--wx-content-primary);
}
.pg-preview {
  display: flex;
  align-items: center;
  gap: var(--wx-space-4);
  padding: var(--wx-space-4);
  border-top: 1px dashed var(--wx-border-default);
  flex-wrap: wrap;
}
.pg-demo-cta {
  height: 40px;
  padding: 0 var(--wx-space-5);
  border: none;
  border-radius: var(--wx-radius-md);
  background: var(--wx-gradient-button);
  color: #fff;
  font-weight: var(--wx-fw-semibold);
  cursor: pointer;
  box-shadow: var(--wx-shadow-brand);
}
.pg-demo-solid {
  height: 40px;
  padding: 0 var(--wx-space-5);
  border: none;
  border-radius: var(--wx-radius-md);
  background: var(--wx-brand-primary);
  color: #fff;
  font-weight: var(--wx-fw-semibold);
  cursor: pointer;
}
.pg-demo-text {
  font-size: var(--wx-fs-20);
  font-weight: var(--wx-fw-bold);
  background: var(--wx-gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.pg-demo-badge {
  padding: 4px 12px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-brand-100);
  color: var(--wx-brand-700);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
}

/* ── 8. rule list ─── */
.rule-list {
  margin: 0;
  padding-left: var(--wx-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  font-size: var(--wx-fs-14);
  color: var(--wx-content-primary);
}
</style>
