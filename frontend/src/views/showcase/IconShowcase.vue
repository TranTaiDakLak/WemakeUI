<script setup lang="ts">
/**
 * Icon Showcase — so sánh trực quan 5 bộ icon hiện đại
 * (Lucide đang dùng vs các ứng viên thay thế).
 *
 * Dùng @iconify/vue để load icon từ Iconify CDN bằng prefix name.
 * Mỗi hàng = 1 concept icon, mỗi cột = 1 bộ icon.
 */
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import PageHeader from '../../components/layout/PageHeader.vue'

/* ── Bộ icon được so sánh ── */
type IconSet = {
  key: string
  name: string
  prefix: string
  /** weights khả dụng cho bộ này (Iconify naming) */
  weights: { label: string; suffix: string }[]
  /** vibe ngắn gọn để hiển thị header */
  vibe: string
  license: string
  current?: boolean
}

const SETS: IconSet[] = [
  {
    key: 'lucide',
    name: 'Lucide',
    prefix: 'lucide',
    weights: [{ label: 'Regular', suffix: '' }],
    vibe: 'Minimal · stroke 2px',
    license: 'MIT',
    current: true,
  },
  {
    key: 'phosphor',
    name: 'Phosphor',
    prefix: 'ph',
    weights: [
      { label: 'Thin', suffix: '-thin' },
      { label: 'Light', suffix: '-light' },
      { label: 'Regular', suffix: '' },
      { label: 'Bold', suffix: '-bold' },
      { label: 'Fill', suffix: '-fill' },
      { label: 'Duotone', suffix: '-duotone' },
    ],
    vibe: '6 weights · flexible',
    license: 'MIT',
  },
  {
    key: 'solar',
    name: 'Solar',
    prefix: 'solar',
    weights: [
      { label: 'Linear', suffix: '-linear' },
      { label: 'Bold', suffix: '-bold' },
      { label: 'Bold Duotone', suffix: '-bold-duotone' },
      { label: 'Broken', suffix: '-broken' },
      { label: 'Outline', suffix: '-outline' },
    ],
    vibe: 'Trendy 2026 · chunky',
    license: 'CC-BY 4.0',
  },
  {
    key: 'tabler',
    name: 'Tabler',
    prefix: 'tabler',
    weights: [
      { label: 'Outline', suffix: '' },
      { label: 'Filled', suffix: '-filled' },
    ],
    vibe: 'Clean · 4500+',
    license: 'MIT',
  },
  {
    key: 'hugeicons',
    name: 'Hugeicons',
    prefix: 'hugeicons',
    weights: [{ label: 'Stroke', suffix: '' }],
    vibe: 'Fresh 2024 · AI/SaaS',
    license: 'CC-BY 4.0',
  },
]

/* ── Catalog icon: mỗi concept map sang tên cụ thể của từng bộ ──
 *  Tên trên Iconify dùng kebab-case. Suffix weight chỉ áp dụng được
 *  cho bộ thực sự cung cấp weight đó — Iconify trả empty nếu sai.
 */
type IconRow = {
  concept: string
  /** mapping per-set: base name (sẽ ghép với weight suffix nếu set hỗ trợ) */
  ids: Record<string, string>
}

const ROWS: IconRow[] = [
  {
    concept: 'Home',
    ids: { lucide: 'home', phosphor: 'house', solar: 'home-2', tabler: 'home', hugeicons: 'home-01' },
  },
  {
    concept: 'User',
    ids: { lucide: 'user', phosphor: 'user', solar: 'user', tabler: 'user', hugeicons: 'user' },
  },
  {
    concept: 'Search',
    ids: { lucide: 'search', phosphor: 'magnifying-glass', solar: 'magnifer', tabler: 'search', hugeicons: 'search-01' },
  },
  {
    concept: 'Settings',
    ids: { lucide: 'settings', phosphor: 'gear', solar: 'settings', tabler: 'settings', hugeicons: 'settings-01' },
  },
  {
    concept: 'Bell',
    ids: { lucide: 'bell', phosphor: 'bell', solar: 'bell', tabler: 'bell', hugeicons: 'notification-01' },
  },
  {
    concept: 'Heart',
    ids: { lucide: 'heart', phosphor: 'heart', solar: 'heart', tabler: 'heart', hugeicons: 'favourite' },
  },
  {
    concept: 'Star',
    ids: { lucide: 'star', phosphor: 'star', solar: 'star', tabler: 'star', hugeicons: 'star' },
  },
  {
    concept: 'Mail',
    ids: { lucide: 'mail', phosphor: 'envelope', solar: 'letter', tabler: 'mail', hugeicons: 'mail-01' },
  },
  {
    concept: 'Cloud',
    ids: { lucide: 'cloud', phosphor: 'cloud', solar: 'cloud', tabler: 'cloud', hugeicons: 'cloud' },
  },
  {
    concept: 'Lock',
    ids: { lucide: 'lock', phosphor: 'lock', solar: 'lock-keyhole-minimalistic', tabler: 'lock', hugeicons: 'square-lock-01' },
  },
  {
    concept: 'Trash',
    ids: { lucide: 'trash-2', phosphor: 'trash', solar: 'trash-bin-trash', tabler: 'trash', hugeicons: 'delete-02' },
  },
  {
    concept: 'Calendar',
    ids: { lucide: 'calendar', phosphor: 'calendar', solar: 'calendar', tabler: 'calendar', hugeicons: 'calendar-03' },
  },
  {
    concept: 'Chart',
    ids: { lucide: 'bar-chart-3', phosphor: 'chart-bar', solar: 'chart-2', tabler: 'chart-bar', hugeicons: 'chart-01' },
  },
  {
    concept: 'Folder',
    ids: { lucide: 'folder', phosphor: 'folder', solar: 'folder', tabler: 'folder', hugeicons: 'folder-01' },
  },
  {
    concept: 'Download',
    ids: { lucide: 'download', phosphor: 'download', solar: 'download', tabler: 'download', hugeicons: 'download-01' },
  },
  {
    concept: 'Bot / AI',
    ids: { lucide: 'bot', phosphor: 'robot', solar: 'magic-stick-3', tabler: 'robot', hugeicons: 'ai-magic' },
  },
  {
    concept: 'Code',
    ids: { lucide: 'code-2', phosphor: 'code', solar: 'code', tabler: 'code', hugeicons: 'source-code' },
  },
  {
    concept: 'Wallet',
    ids: { lucide: 'wallet', phosphor: 'wallet', solar: 'wallet', tabler: 'wallet', hugeicons: 'wallet-01' },
  },
]

/* ── State ── */
const size = ref<16 | 20 | 24 | 32 | 40>(24)
const weightIndex = ref(2) // index trong weight matrix global (0..5)
const dark = ref(false)
const colored = ref(true)
const filterText = ref('')

/* Mỗi set có số lượng weight khác nhau — clamp về cuối khi vượt */
function weightFor(set: IconSet) {
  const i = Math.min(weightIndex.value, set.weights.length - 1)
  return set.weights[i]
}

function iconName(set: IconSet, baseId: string) {
  const w = weightFor(set)
  return `${set.prefix}:${baseId}${w.suffix}`
}

const filteredRows = computed(() =>
  filterText.value.trim()
    ? ROWS.filter(r => r.concept.toLowerCase().includes(filterText.value.toLowerCase()))
    : ROWS
)

const weightLabels = ['Thinnest', 'Light', 'Regular', 'Bold', 'Fill', 'Duotone']

/* ──────────────────────────────────────────────────────────────────
 * Section 4 — Animated Outline Icons (Lordicon)
 * Bo tròn · viền · nền trong · animation on hover/loop.
 * Web component <lord-icon> đã load qua CDN trong index.html.
 * Free tier yêu cầu attribution; license commercial cần Lordicon Pro.
 * ────────────────────────────────────────────────────────────────── */

type LordTrigger = 'hover' | 'loop' | 'loop-on-hover' | 'morph' | 'click'

const lordTrigger = ref<LordTrigger>('loop-on-hover')
const lordStroke = ref<'light' | 'regular' | 'bold'>('regular')
/** Single color — apply đồng thời cho cả primary + secondary slot
 *  vì Lordicon icon mỗi cái có slot name khác nhau, để 2 picker thường
 *  chỉ 1 cái có hiệu lực → confusing. Dùng 1 màu cho chắc ăn. */
const lordColor = ref('#8b5cf6')
const lordSize = ref<64 | 80 | 96 | 120>(96)

type LordRow = {
  useCase: string
  hash: string
  context: string
  /** Override màu primary (icon sẽ không bị color picker chung ảnh hưởng) */
  accentColor?: string
  /** Override màu secondary riêng — nếu không set thì dùng accentColor */
  accentColor2?: string
  /** Override stroke — 'bold' | 'regular' | 'light' */
  strokeOverride?: 'light' | 'regular' | 'bold'
  /** Lordicon animation state cụ thể (vd 'hover-enlarge', 'morph') */
  state?: string
  /** Delay giữa các lần loop (ms) */
  delay?: number
}

/* Chỉ giữ 8 hash đã verify 200-OK từ cdn.lordicon.com.
 * Label match đúng với hình ảnh thực sự render (không gán nhầm như trước).
 * Muốn thêm icon mới: vào lordicon.com/icons, chọn icon free, copy hash
 * từ URL CDN (ví dụ cdn.lordicon.com/xyboiuok.json → hash là xyboiuok). */
const LORD_ROWS: LordRow[] = [
  { useCase: 'Celebrate', hash: 'lupuorrc', context: 'Confetti — milestone, onboarding done' },
  { useCase: 'Party',     hash: 'tyvtvbcy', context: 'Party popper — celebration, achievement' },
  { useCase: 'Warning',   hash: 'azxkyjta', context: 'Triangle alert — caution, expired', accentColor: '#ffc738', accentColor2: '#c71f16', state: 'hover-enlarge', delay: 2000 },
  { useCase: 'Settings',  hash: 'lecprnjb', context: 'Gear — configuration, preferences' },
  { useCase: 'Loading',   hash: 'xjovhxra', context: 'Spinner — processing, waiting' },
  { useCase: 'Cloud',     hash: 'yedgackm', context: 'Cloud code — API, sync, deploy' },
  { useCase: 'Bell',      hash: 'lznlxwtc', context: 'Notification, alert' },
  { useCase: 'Heart',     hash: 'xyboiuok', context: 'Favorite, save, like' },
]

/** Stroke thực sự áp dụng: strokeOverride (nếu có) > lordStroke (chung) */
function rowStroke(row: LordRow) {
  return row.strokeOverride ?? lordStroke.value
}

function rowColor(row: LordRow) {
  return row.accentColor ?? lordColor.value
}
function rowColorsAttr(row: LordRow) {
  const p = rowColor(row)
  const s = row.accentColor2 ?? p
  return `primary:${p},secondary:${s}`
}

/** Khi <lord-icon> load xong, discover ALL slot màu rồi override.
 *  Nếu row có accentColor2: slot "primary*" → accentColor, "secondary*" → accentColor2.
 *  Nếu không: tất cả slot → cùng 1 màu. */
function onLordReady(event: Event, row: LordRow) {
  const el = event.target as any
  if (!el) return
  const currentColors = el.colors
  if (!currentColors || typeof currentColors !== 'object') return
  const primary = rowColor(row)
  const secondary = row.accentColor2 ?? primary
  const keys = Object.keys(currentColors)
  const next: Record<string, string> = {}
  keys.forEach((key, i) => {
    // slot đầu tiên = primary color, slot thứ 2 trở đi = secondary color
    next[key] = i === 0 ? primary : secondary
  })
  el.colors = next
}

const lordFilter = ref('')
const filteredLordRows = computed(() =>
  lordFilter.value.trim()
    ? LORD_ROWS.filter(r =>
        r.useCase.toLowerCase().includes(lordFilter.value.toLowerCase()) ||
        r.context.toLowerCase().includes(lordFilter.value.toLowerCase()),
      )
    : LORD_ROWS,
)

function lordSrc(hash: string) {
  return `https://cdn.lordicon.com/${hash}.json`
}

</script>

<template>
  <div class="page" :class="{ 'is-dark': dark }">
    <PageHeader
      title="Icon Showcase — So sánh 5 bộ icon hiện đại"
      description="Lucide (đang dùng) vs Phosphor · Solar · Tabler · Hugeicons. Bấm thử weight/size/màu để xem bộ nào hợp WemakeUI nhất."
      padded
    />

    <!-- Controls -->
    <section class="controls">
      <div class="control-group">
        <label>Size</label>
        <div class="seg">
          <button
            v-for="s in [16, 20, 24, 32, 40]"
            :key="s"
            :class="{ active: size === s }"
            @click="size = s as typeof size"
          >{{ s }}</button>
        </div>
      </div>

      <div class="control-group">
        <label>Weight (áp dụng nếu bộ hỗ trợ)</label>
        <div class="seg">
          <button
            v-for="(w, i) in weightLabels"
            :key="w"
            :class="{ active: weightIndex === i }"
            @click="weightIndex = i"
          >{{ w }}</button>
        </div>
      </div>

      <div class="control-group">
        <label>Theme</label>
        <div class="seg">
          <button :class="{ active: !dark }" @click="dark = false">Light</button>
          <button :class="{ active: dark }" @click="dark = true">Dark</button>
        </div>
      </div>

      <div class="control-group">
        <label>Màu icon</label>
        <div class="seg">
          <button :class="{ active: !colored }" @click="colored = false">Neutral</button>
          <button :class="{ active: colored }" @click="colored = true">Brand</button>
        </div>
      </div>

      <div class="control-group grow">
        <label>Lọc concept</label>
        <input
          v-model="filterText"
          placeholder="Home, search, AI..."
          class="filter-input"
        />
      </div>
    </section>

    <!-- Header row: bộ icon -->
    <section class="grid-wrap">
      <div class="grid" :style="{ '--cols': SETS.length }">
        <!-- top-left empty -->
        <div class="cell header concept-header">Concept</div>
        <div
          v-for="set in SETS"
          :key="set.key"
          class="cell header set-header"
          :class="{ current: set.current }"
        >
          <div class="set-name">
            {{ set.name }}
            <span v-if="set.current" class="badge-current">đang dùng</span>
          </div>
          <div class="set-meta">
            <span>{{ set.vibe }}</span>
            <span class="dot">·</span>
            <span>{{ set.license }}</span>
          </div>
          <div class="set-weight">
            {{ weightFor(set).label }}
          </div>
        </div>

        <!-- Data rows -->
        <template v-for="row in filteredRows" :key="row.concept">
          <div class="cell concept">{{ row.concept }}</div>
          <div
            v-for="set in SETS"
            :key="set.key + row.concept"
            class="cell icon-cell"
            :class="{ current: set.current, brand: colored }"
          >
            <Icon
              :icon="iconName(set, row.ids[set.key])"
              :width="size"
              :height="size"
              aria-hidden="true"
            />
          </div>
        </template>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         Section 4 — Animated Outline Icons (Lordicon)
         Bo tròn · nền trong · có viền · có animation
         ═══════════════════════════════════════════════════════════ -->
    <section class="section-divider">
      <h2>Animated Outline · Lordicon</h2>
      <p>
        Outline · bo tròn · nền trong · viền tuỳ chỉnh · animation on hover hoặc loop —
        đây là phong cách 2026 mạnh nhất cho onboarding, empty state, status card cao cấp.
        Hover vào icon để thấy animation chạy. Đổi màu để xem phối với brand WemakeUI.
      </p>
    </section>

    <!-- Lordicon controls -->
    <section class="controls">
      <div class="control-group">
        <label>Trigger animation</label>
        <div class="seg">
          <button :class="{ active: lordTrigger === 'hover' }" @click="lordTrigger = 'hover'">Hover</button>
          <button :class="{ active: lordTrigger === 'loop-on-hover' }" @click="lordTrigger = 'loop-on-hover'">Loop ↻ hover</button>
          <button :class="{ active: lordTrigger === 'loop' }" @click="lordTrigger = 'loop'">Loop ↻ always</button>
          <button :class="{ active: lordTrigger === 'morph' }" @click="lordTrigger = 'morph'">Morph</button>
          <button :class="{ active: lordTrigger === 'click' }" @click="lordTrigger = 'click'">Click</button>
        </div>
      </div>
      <div class="control-group">
        <label>Stroke (độ dày viền)</label>
        <div class="seg">
          <button
            v-for="s in (['light', 'regular', 'bold'] as const)"
            :key="s"
            :class="{ active: lordStroke === s }"
            @click="lordStroke = s"
          >{{ s }}</button>
        </div>
      </div>
      <div class="control-group">
        <label>Size</label>
        <div class="seg">
          <button
            v-for="s in [64, 80, 96, 120]"
            :key="s"
            :class="{ active: lordSize === s }"
            @click="lordSize = s as typeof lordSize"
          >{{ s }}</button>
        </div>
      </div>
      <div class="control-group">
        <label>Màu icon</label>
        <div class="color-row">
          <input v-model="lordColor" type="color" class="color-input" />
          <button
            v-for="c in ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#111827']"
            :key="c"
            class="swatch"
            :style="{ background: c }"
            :class="{ active: lordColor === c }"
            @click="lordColor = c"
            :aria-label="`Set color to ${c}`"
          />
        </div>
      </div>
      <div class="control-group grow">
        <label>Lọc use case</label>
        <input
          v-model="lordFilter"
          placeholder="success, error, premium..."
          class="filter-input"
        />
      </div>
    </section>

    <!-- Lordicon animated gallery (card grid, not table — animation cần không gian) -->
    <section class="lord-gallery">
      <div
        v-for="row in filteredLordRows"
        :key="row.hash"
        class="lord-card"
        :class="{ 'has-accent': !!row.accentColor }"
        :style="row.accentColor ? { '--accent': row.accentColor } : undefined"
      >
        <div class="lord-anim-wrap" :style="{ width: lordSize + 'px', height: lordSize + 'px' }">
          <!-- :key force re-mount khi đổi màu/stroke/trigger vì web component không
               reactive với attribute change sau lúc khởi tạo.
               @ready: discover slot màu của icon rồi override (xem onLordReady). -->
          <lord-icon
            :key="row.hash + rowColor(row) + lordTrigger + rowStroke(row)"
            :src="lordSrc(row.hash)"
            :trigger="row.state ? 'loop' : lordTrigger"
            :state="row.state"
            :delay="row.delay"
            :colors="rowColorsAttr(row)"
            :stroke="rowStroke(row)"
            :style="{ width: lordSize + 'px', height: lordSize + 'px' }"
            @ready="onLordReady($event, row)"
          />
        </div>
        <div class="lord-info">
          <div class="lord-use-case">
            {{ row.useCase }}
            <span
              v-if="row.accentColor"
              class="accent-dot"
              :style="{ background: row.accentColor }"
              title="Semantic color — không bị color picker chung override"
            />
          </div>
          <div class="lord-context">{{ row.context }}</div>
        </div>
      </div>
    </section>

    <!-- Footer notes -->
    <section class="notes">
      <h3>Ghi chú — UI icons</h3>
      <ul>
        <li><strong>Lucide</strong> chỉ có 1 weight — Regular cell sẽ luôn hiển thị giống nhau khi đổi weight.</li>
        <li><strong>Phosphor</strong> đủ 6 weight — bộ duy nhất phủ hết toàn bộ thang weight ở trên.</li>
        <li><strong>Solar</strong> "Bold Duotone" là look đặc trưng của Cursor/Linear/Raycast. Chỉ free khi attribution.</li>
        <li><strong>Tabler</strong> chỉ có Outline + Filled — chuẩn dashboard, nhiều icon kỹ thuật.</li>
        <li><strong>Hugeicons</strong> mới (2024), 36k icon — bản miễn phí giới hạn, full đẹp nhưng cần license cho thư viện thương mại.</li>
      </ul>

      <h3 style="margin-top: var(--wx-space-5)">Ghi chú — Animated Outline (Lordicon)</h3>
      <ul>
        <li><strong>Bo tròn · viền · nền trong · animation</strong> — đúng combo bạn yêu cầu. Mỗi icon là 1 Lottie JSON nhỏ (3-15KB), render qua web component <code>&lt;lord-icon&gt;</code>.</li>
        <li><strong>Trigger</strong>: Hover (1 lần khi rê chuột) — Loop on hover (lặp khi giữ chuột) — Loop always (chạy mãi, dùng cho loading) — Morph (biến đổi 2 chiều) — Click (chạm vào).</li>
        <li><strong>Màu icon</strong> đổi runtime — apply đồng thời cho cả primary + secondary slot nên màu luôn hiện. Stroke 2-4px chỉnh độ dày viền.</li>
        <li>Showcase đang hiển thị 8 icon đã verify (mỗi hash đã test HTTP 200). Muốn thêm: vào <a href="https://lordicon.com/icons" target="_blank" rel="noopener">lordicon.com/icons</a>, chọn icon free, copy 8-char hash từ URL CDN (vd <code>cdn.lordicon.com/xyboiuok.json</code> → hash <code>xyboiuok</code>).</li>
        <li><strong>License</strong>: 1500+ icon free yêu cầu attribution; full library 12k+ icon cần <a href="https://lordicon.com/pricing" target="_blank" rel="noopener">Lordicon Pro</a> (~$49/năm). Cho production WemakeUI nên dùng tier Pro hoặc download Lottie JSON về <code>public/lottie/</code>.</li>
        <li><strong>Alternative miễn phí MIT</strong>: Microsoft Fluent Emoji Animated (3D animated Lottie, ~3000 emoji) — vibe khác (3D thay vì outline).</li>
      </ul>

      <p class="hint">
        Icon được load on-demand từ Iconify CDN (api.iconify.design). Nếu offline / 1 vài icon không hiện
        có nghĩa là tên icon trong bộ đó khác — Iconify chỉ trả về icon tồn tại.
      </p>
    </section>
  </div>
</template>

<style scoped>
.page {
  padding: 0 var(--wx-space-6) var(--wx-space-12);
}
.page.is-dark {
  background: var(--wx-color-bg-base, #0b0f17);
  color: var(--wx-color-text-primary, #e6e8ec);
  border-radius: var(--wx-radius-lg, 12px);
}

/* ── Controls ── */
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-4);
  align-items: flex-end;
  padding: var(--wx-space-4) var(--wx-space-5);
  margin: var(--wx-space-4) 0;
  background: var(--wx-color-bg-elevated, #fff);
  border: 1px solid var(--wx-color-border-default, #e5e7eb);
  border-radius: var(--wx-radius-lg, 12px);
}
.is-dark .controls {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}
.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.control-group.grow { flex: 1; min-width: 200px; }
.control-group > label {
  font-size: 12px;
  font-weight: 600;
  color: var(--wx-color-text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.seg {
  display: inline-flex;
  border: 1px solid var(--wx-color-border-default, #e5e7eb);
  border-radius: var(--wx-radius-md, 8px);
  overflow: hidden;
  background: var(--wx-color-bg-base, #fff);
}
.is-dark .seg {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.12);
}
.seg button {
  padding: 6px 12px;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 13px;
  color: inherit;
  cursor: pointer;
  border-right: 1px solid var(--wx-color-border-default, #e5e7eb);
  transition: background 120ms;
}
.is-dark .seg button { border-right-color: rgba(255, 255, 255, 0.08); }
.seg button:last-child { border-right: none; }
.seg button:hover { background: var(--wx-color-bg-hover, rgba(0, 0, 0, 0.04)); }
.seg button.active {
  background: var(--wx-color-brand-solid, #8b5cf6);
  color: #fff;
}
.filter-input {
  padding: 8px 12px;
  border: 1px solid var(--wx-color-border-default, #e5e7eb);
  border-radius: var(--wx-radius-md, 8px);
  font: inherit;
  font-size: 14px;
  background: var(--wx-color-bg-base, #fff);
  color: inherit;
}
.is-dark .filter-input {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
  color: inherit;
}

/* ── Comparison grid ── */
.grid-wrap {
  border: 1px solid var(--wx-color-border-default, #e5e7eb);
  border-radius: var(--wx-radius-lg, 12px);
  overflow: hidden;
  background: var(--wx-color-bg-elevated, #fff);
}
.is-dark .grid-wrap {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.08);
}
.grid {
  display: grid;
  grid-template-columns: 140px repeat(var(--cols), 1fr);
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--wx-space-3) var(--wx-space-2);
  border-right: 1px solid var(--wx-color-border-subtle, #f1f3f5);
  border-bottom: 1px solid var(--wx-color-border-subtle, #f1f3f5);
  min-height: 64px;
}
.is-dark .cell {
  border-right-color: rgba(255, 255, 255, 0.06);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}
.cell:nth-last-child(-n + var(--cols, 6)) { border-bottom: none; }
.cell.header {
  background: var(--wx-color-bg-subtle, #f9fafb);
  font-weight: 600;
  flex-direction: column;
  gap: 4px;
  text-align: center;
  padding: var(--wx-space-4) var(--wx-space-3);
}
.is-dark .cell.header { background: rgba(255, 255, 255, 0.04); }
.cell.header.current {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(236, 72, 153, 0.12));
}
.concept-header { font-size: 12px; color: var(--wx-color-text-secondary, #6b7280); }
.set-name {
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.badge-current {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--wx-color-brand-solid, #8b5cf6);
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.set-meta {
  display: flex;
  gap: 4px;
  font-size: 11px;
  color: var(--wx-color-text-secondary, #6b7280);
  font-weight: 400;
}
.set-meta .dot { opacity: 0.5; }
.set-weight {
  font-size: 11px;
  color: var(--wx-color-text-tertiary, #9ca3af);
  font-weight: 500;
}

.concept {
  justify-content: flex-start;
  padding-left: var(--wx-space-4);
  font-size: 13px;
  font-weight: 500;
  color: var(--wx-color-text-secondary, #6b7280);
  background: var(--wx-color-bg-subtle, #f9fafb);
}
.is-dark .concept { background: rgba(255, 255, 255, 0.02); }

.icon-cell {
  color: var(--wx-color-text-primary, #1f2937);
  transition: background 120ms;
}
.is-dark .icon-cell { color: #e6e8ec; }
.icon-cell.brand { color: var(--wx-color-brand-solid, #8b5cf6); }
.icon-cell.current {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.04), rgba(236, 72, 153, 0.04));
}
.icon-cell:hover {
  background: var(--wx-color-bg-hover, rgba(0, 0, 0, 0.04));
}
.is-dark .icon-cell:hover { background: rgba(255, 255, 255, 0.06); }

/* ── Notes ── */
.notes {
  margin-top: var(--wx-space-6);
  padding: var(--wx-space-5);
  border-radius: var(--wx-radius-lg, 12px);
  background: var(--wx-color-bg-subtle, #f9fafb);
  border: 1px solid var(--wx-color-border-default, #e5e7eb);
}
.is-dark .notes {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.08);
}
.notes h3 {
  margin: 0 0 var(--wx-space-3);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--wx-color-text-secondary, #6b7280);
}
.notes ul {
  margin: 0;
  padding-left: var(--wx-space-5);
  font-size: 14px;
  line-height: 1.7;
}
.notes li + li { margin-top: 6px; }
.notes .hint {
  margin-top: var(--wx-space-4);
  padding-top: var(--wx-space-3);
  border-top: 1px dashed var(--wx-color-border-default, #e5e7eb);
  font-size: 13px;
  color: var(--wx-color-text-tertiary, #9ca3af);
}
.notes code {
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.875em;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--wx-color-bg-base, #fff);
  border: 1px solid var(--wx-color-border-default, #e5e7eb);
}
.is-dark .notes code {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
}

/* ── Section divider ── */
.section-divider {
  margin-top: var(--wx-space-12);
  padding-top: var(--wx-space-6);
  border-top: 2px dashed var(--wx-color-border-default, #e5e7eb);
}
.is-dark .section-divider { border-top-color: rgba(255, 255, 255, 0.08); }
.section-divider h2 {
  margin: 0 0 var(--wx-space-2);
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.section-divider p {
  margin: 0 0 var(--wx-space-4);
  font-size: 14px;
  line-height: 1.6;
  color: var(--wx-color-text-secondary, #6b7280);
  max-width: 760px;
}

/* ── Emoji concept (multi-line) ── */
.emoji-concept {
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding-left: var(--wx-space-4);
}
.concept-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--wx-color-text-primary, #1f2937);
}
.is-dark .concept-name { color: #e6e8ec; }
.concept-context {
  font-size: 11px;
  color: var(--wx-color-text-tertiary, #9ca3af);
  line-height: 1.3;
}
.emoji-cell { min-height: 96px; }

/* (CSS demo-cards / status-card đã bỏ cùng Section 2.) */

/* ── 3D rendered cell ── */
.threed-cell {
  background: var(--wx-color-bg-base, #fff);
  min-height: 120px;
}
.is-dark .threed-cell { background: rgba(255, 255, 255, 0.02); }
.threed-cell img {
  max-width: 80px;
  max-height: 80px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}
.threed-cell.current {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(236, 72, 153, 0.06));
}

/* ── Lordicon section ── */
.color-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.color-input {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--wx-color-border-default, #e5e7eb);
  border-radius: var(--wx-radius-md, 8px);
  cursor: pointer;
  background: transparent;
}
.is-dark .color-input { border-color: rgba(255, 255, 255, 0.12); }
.swatch {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 120ms, border-color 120ms;
}
.swatch:hover { transform: scale(1.1); }
.swatch.active {
  border-color: var(--wx-color-text-primary, #111827);
  transform: scale(1.15);
}
.is-dark .swatch.active { border-color: #fff; }

.lord-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--wx-space-3);
  padding: var(--wx-space-2);
  background: var(--wx-color-bg-elevated, #fff);
  border: 1px solid var(--wx-color-border-default, #e5e7eb);
  border-radius: var(--wx-radius-lg, 12px);
}
.is-dark .lord-gallery {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.08);
}
.lord-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-4) var(--wx-space-3);
  background: transparent;
  border-radius: var(--wx-radius-md, 8px);
  transition: background 150ms, transform 150ms;
}
.lord-card:hover {
  background: var(--wx-color-bg-hover, rgba(0, 0, 0, 0.03));
  transform: translateY(-2px);
}
.is-dark .lord-card:hover { background: rgba(255, 255, 255, 0.04); }
.lord-anim-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.lord-info { text-align: center; }
.lord-use-case {
  font-size: 14px;
  font-weight: 600;
  color: var(--wx-color-text-primary, #1f2937);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.accent-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: help;
}
.is-dark .lord-use-case { color: #e6e8ec; }
.lord-context {
  margin-top: 2px;
  font-size: 11px;
  color: var(--wx-color-text-tertiary, #9ca3af);
  line-height: 1.4;
  max-width: 180px;
}
</style>
