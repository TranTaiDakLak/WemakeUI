<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import {
  layoutPages, CATEGORIES, CATEGORY_META,
  totalVariants, totalPages,
  type LayoutPage, type LayoutVariant, type LayoutCategory, type LayoutStatus,
} from './layout-gallery/layoutRegistry'

const router = useRouter()

/* ── Flat card: one entry per variant ── */
interface FlatCard {
  key:     string
  page:    LayoutPage
  variant: LayoutVariant
  color:   string
}

const allCards = computed<FlatCard[]>(() => {
  const list: FlatCard[] = []
  for (const page of layoutPages) {
    for (const variant of page.variants) {
      list.push({ key: `${page.id}--${variant.id}`, page, variant, color: CATEGORY_META[page.category].color })
    }
  }
  return list
})

/* ── Filters ── */
const search         = ref('')
const activeCategory = ref<LayoutCategory | 'all'>('all')
const activeStatus   = ref<LayoutStatus | 'all'>('all')

const filteredCards = computed<FlatCard[]>(() => {
  let list = allCards.value
  if (activeCategory.value !== 'all')
    list = list.filter(c => c.page.category === activeCategory.value)
  if (activeStatus.value !== 'all')
    list = list.filter(c => c.variant.status === activeStatus.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(c =>
      c.page.title.toLowerCase().includes(q) ||
      c.variant.label.toLowerCase().includes(q) ||
      (c.variant.description ?? c.page.description).toLowerCase().includes(q) ||
      (c.page.tags ?? []).some(t => t.includes(q)) ||
      c.variant.components.some(s => s.toLowerCase().includes(q)) ||
      c.variant.patterns.some(s => s.toLowerCase().includes(q)),
    )
  }
  return list
})

/* ── Counts ── */
const countByCategory = computed(() => {
  const m: Partial<Record<LayoutCategory, number>> = {}
  for (const c of allCards.value) m[c.page.category] = (m[c.page.category] ?? 0) + 1
  return m
})
const readyCount = computed(() => allCards.value.filter(c => c.variant.status === 'ready').length)
const draftCount = computed(() => allCards.value.filter(c => c.variant.status === 'draft').length)

/* ── Prompt modal ── */
const promptCard = ref<FlatCard | null>(null)
const copyDone   = ref(false)

function openPrompt(card: FlatCard, e: Event) {
  e.stopPropagation()
  promptCard.value = card
  copyDone.value = false
}
function closePrompt() { promptCard.value = null }

function copyCode() {
  const c = promptCard.value
  if (!c) return
  const lines = [
    `# ${c.page.title} — ${c.variant.label}`,
    `Category: ${c.page.category}`,
    `File: ${c.variant.file}`,
    c.variant.route ? `Route: ${c.variant.route}` : '',
    '',
    `## Components\n${c.variant.components.join(', ')}`,
    '',
    `## Patterns\n${c.variant.patterns.join(', ')}`,
    '',
    `## Import\n${c.variant.components.map(s => `import { ${s} } from '@wemake/ui'`).join('\n')}`,
    '',
    c.variant.prompt ? `## Prompt\n${c.variant.prompt}` : '',
  ].filter(Boolean).join('\n')
  navigator.clipboard.writeText(lines).catch(() => {})
  copyDone.value = true
  setTimeout(() => { copyDone.value = false }, 2200)
}

function viewDemo(card: FlatCard, e: Event) {
  e.stopPropagation()
  if (card.variant.route && card.variant.status === 'ready') router.push(card.variant.route)
}
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="template gallery" />

    <main class="main">

      <!-- ── Header ── -->
      <div class="hdr">
        <div>
          <h1 class="hdr__title">Template Gallery</h1>
          <p class="hdr__desc">{{ totalPages() }} loại trang · {{ totalVariants() }} variant · Bấm để xem demo thật</p>
        </div>
        <div class="hdr__stats">
          <div class="stat"><span class="stat__n">{{ allCards.length }}</span><span class="stat__l">Templates</span></div>
          <div class="stat"><span class="stat__n">{{ readyCount }}</span><span class="stat__l">Ready</span></div>
          <div class="stat"><span class="stat__n">{{ CATEGORIES.length }}</span><span class="stat__l">Categories</span></div>
        </div>
      </div>

      <!-- ── Filter bar ── -->
      <div class="filter-bar">
        <div class="search-wrap">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="search" class="search-input" placeholder="Tìm template, component, pattern..." />
          <button v-if="search" class="search-clear" @click="search = ''" aria-label="Xóa">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="status-tabs">
          <button class="stab" :class="{ 'stab--on': activeStatus === 'all' }" @click="activeStatus = 'all'">
            All <span class="stab__n">{{ allCards.length }}</span>
          </button>
          <button class="stab" :class="{ 'stab--on': activeStatus === 'ready' }" @click="activeStatus = 'ready'">
            <span class="stab__dot stab__dot--ready" />
            Ready <span class="stab__n">{{ readyCount }}</span>
          </button>
          <button class="stab" :class="{ 'stab--on': activeStatus === 'draft' }" @click="activeStatus = 'draft'">
            <span class="stab__dot stab__dot--draft" />
            Draft <span class="stab__n">{{ draftCount }}</span>
          </button>
        </div>

        <span class="result-count">{{ filteredCards.length }} kết quả</span>
      </div>

      <!-- ── Category tabs ── -->
      <div class="cat-bar">
        <button class="ctab" :class="{ 'ctab--on': activeCategory === 'all' }" @click="activeCategory = 'all'">
          Tất cả <span class="ctab__n">{{ allCards.length }}</span>
        </button>
        <button
          v-for="cat in CATEGORIES" :key="cat"
          class="ctab"
          :class="{ 'ctab--on': activeCategory === cat }"
          :style="activeCategory === cat ? { '--ctab-color': CATEGORY_META[cat].color } : {}"
          @click="activeCategory = activeCategory === cat ? 'all' : cat"
        >
          <span v-if="activeCategory === cat" class="ctab__dot" :style="{ background: CATEGORY_META[cat].color }" />
          {{ CATEGORY_META[cat].label }}
          <span class="ctab__n">{{ countByCategory[cat] ?? 0 }}</span>
        </button>
      </div>

      <!-- ── Grid ── -->
      <TransitionGroup
        v-if="filteredCards.length > 0"
        tag="div"
        name="tcard"
        appear
        class="grid"
      >
        <div
          v-for="(card, i) in filteredCards"
          :key="card.key"
          class="tcard"
          :class="{ 'tcard--draft': card.variant.status === 'draft' }"
          :style="{ '--tcard-i': i }"
          @click="card.variant.status === 'ready' && card.variant.route && router.push(card.variant.route)"
        >
          <!-- Thumbnail -->
          <div
            class="tcard__thumb"
            :style="{ background: `linear-gradient(145deg, ${card.color}cc 0%, ${card.color}88 100%)` }"
          >
            <svg class="tcard__wire" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <template v-if="card.page.group === 'Auth'">
                <rect x="22" y="4" width="56" height="52" rx="4" fill="rgba(255,255,255,.15)"/>
                <rect x="30" y="10" width="40" height="5" rx="2" fill="rgba(255,255,255,.5)"/>
                <rect x="30" y="18" width="40" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
                <rect x="30" y="29" width="40" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
                <rect x="30" y="40" width="40" height="8" rx="3" fill="rgba(255,255,255,.45)"/>
              </template>
              <template v-else-if="card.page.group === 'Landing'">
                <rect x="0" y="0" width="100" height="8" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="10" y="12" width="80" height="14" rx="3" fill="rgba(255,255,255,.18)"/>
                <rect x="25" y="16" width="50" height="5" rx="2" fill="rgba(255,255,255,.45)"/>
                <rect x="35" y="28" width="30" height="6" rx="2" fill="rgba(255,255,255,.5)"/>
                <rect x="0" y="38" width="31" height="12" rx="2" fill="rgba(255,255,255,.15)"/>
                <rect x="35" y="38" width="31" height="12" rx="2" fill="rgba(255,255,255,.15)"/>
                <rect x="70" y="38" width="30" height="12" rx="2" fill="rgba(255,255,255,.15)"/>
              </template>
              <template v-else-if="card.page.group === 'Error'">
                <rect x="15" y="8" width="70" height="44" rx="5" fill="rgba(255,255,255,.12)"/>
                <rect x="30" y="14" width="40" height="8" rx="2" fill="rgba(255,255,255,.3)"/>
                <rect x="35" y="26" width="30" height="4" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="32" y="35" width="16" height="7" rx="2" fill="rgba(255,255,255,.4)"/>
                <rect x="52" y="35" width="16" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
              </template>
              <template v-else-if="card.page.group === 'Billing'">
                <rect x="0" y="4" width="30" height="50" rx="3" fill="rgba(255,255,255,.15)"/>
                <rect x="35" y="4" width="30" height="50" rx="3" fill="rgba(255,255,255,.28)"/>
                <rect x="70" y="4" width="30" height="50" rx="3" fill="rgba(255,255,255,.15)"/>
                <rect x="40" y="10" width="20" height="4" rx="1" fill="rgba(255,255,255,.6)"/>
                <rect x="42" y="18" width="16" height="6" rx="1" fill="rgba(255,255,255,.4)"/>
                <rect x="40" y="40" width="20" height="8" rx="2" fill="rgba(255,255,255,.5)"/>
              </template>
              <template v-else-if="card.page.group === 'Basic' || card.page.group === 'Advanced' || card.page.group === 'Modal & Drawer'">
                <rect x="10" y="4" width="80" height="52" rx="3" fill="rgba(255,255,255,.12)"/>
                <rect x="16" y="9" width="30" height="3" rx="1" fill="rgba(255,255,255,.4)"/>
                <rect x="16" y="15" width="68" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
                <rect x="16" y="26" width="68" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
                <rect x="16" y="37" width="32" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
                <rect x="52" y="37" width="32" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
                <rect x="42" y="48" width="26" height="5" rx="2" fill="rgba(255,255,255,.5)"/>
              </template>
              <template v-else-if="card.page.group === 'Communication'">
                <rect x="0" y="0" width="28" height="60" rx="1" fill="rgba(255,255,255,.12)"/>
                <rect x="32" y="6" width="38" height="7" rx="3" fill="rgba(255,255,255,.3)"/>
                <rect x="54" y="18" width="38" height="7" rx="3" fill="rgba(255,255,255,.2)"/>
                <rect x="32" y="30" width="38" height="7" rx="3" fill="rgba(255,255,255,.3)"/>
                <rect x="54" y="42" width="38" height="7" rx="3" fill="rgba(255,255,255,.2)"/>
              </template>
              <template v-else-if="card.page.category === 'WeConnect'">
                <!-- WeConnect: sidebar nav + menustrip + datagrid rows + statusbar -->
                <rect x="0" y="0" width="20" height="60" fill="rgba(255,255,255,.15)"/>
                <rect x="3" y="4" width="14" height="3" rx="1" fill="rgba(255,255,255,.5)"/>
                <rect x="3" y="9" width="14" height="2" rx="1" fill="rgba(255,255,255,.25)"/>
                <rect x="3" y="13" width="14" height="2" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="3" y="17" width="14" height="2" rx="1" fill="rgba(255,255,255,.15)"/>
                <rect x="3" y="21" width="10" height="2" rx="1" fill="rgba(255,255,255,.15)"/>
                <rect x="20" y="0" width="80" height="6" fill="rgba(255,255,255,.2)"/>
                <rect x="22" y="8" width="76" height="5" fill="rgba(255,255,255,.12)"/>
                <rect x="23" y="9.5" width="22" height="2" rx="1" fill="rgba(255,255,255,.4)"/>
                <rect x="87" y="9" width="10" height="3.5" rx="1" fill="rgba(255,255,255,.5)"/>
                <rect x="22" y="16" width="76" height="5" fill="rgba(255,255,255,.28)"/>
                <rect x="22" y="23" width="76" height="4" fill="rgba(255,255,255,.15)"/>
                <rect x="22" y="29" width="76" height="4" fill="rgba(255,255,255,.1)"/>
                <rect x="22" y="35" width="76" height="4" fill="rgba(255,255,255,.18)"/>
                <rect x="22" y="41" width="76" height="4" fill="rgba(255,255,255,.1)"/>
                <rect x="22" y="47" width="76" height="4" fill="rgba(255,255,255,.15)"/>
                <rect x="20" y="54" width="80" height="6" fill="rgba(255,255,255,.22)"/>
              </template>
              <template v-else-if="card.page.category === 'WeDashboard' || card.page.category === 'ChartDashboard' || card.page.category === 'Dashboard'">
                <!-- Dashboard: sidebar + topbar + KPI row + chart areas -->
                <rect x="0" y="0" width="20" height="60" fill="rgba(255,255,255,.15)"/>
                <rect x="3" y="4" width="14" height="3" rx="1" fill="rgba(255,255,255,.5)"/>
                <rect x="3" y="9" width="14" height="2" rx="1" fill="rgba(255,255,255,.25)"/>
                <rect x="3" y="13" width="14" height="2" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="3" y="17" width="14" height="2" rx="1" fill="rgba(255,255,255,.15)"/>
                <rect x="20" y="0" width="80" height="7" fill="rgba(255,255,255,.2)"/>
                <rect x="22" y="10" width="17" height="13" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="41" y="10" width="17" height="13" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="60" y="10" width="17" height="13" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="79" y="10" width="19" height="13" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="25" y="17" width="8" height="3" rx="1" fill="rgba(255,255,255,.5)"/>
                <rect x="44" y="17" width="8" height="3" rx="1" fill="rgba(255,255,255,.5)"/>
                <rect x="63" y="17" width="8" height="3" rx="1" fill="rgba(255,255,255,.5)"/>
                <rect x="82" y="17" width="8" height="3" rx="1" fill="rgba(255,255,255,.5)"/>
                <rect x="22" y="26" width="47" height="28" rx="2" fill="rgba(255,255,255,.12)"/>
                <polyline points="24,50 30,43 37,46 43,39 49,44 56,35 67,41" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/>
                <rect x="71" y="26" width="27" height="28" rx="2" fill="rgba(255,255,255,.12)"/>
                <circle cx="84" cy="40" r="9" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="4"/>
                <path d="M84,31 a9,9 0 0,1 7.8,4.5" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="4"/>
              </template>
              <template v-else>
                <rect x="0" y="0" width="22" height="60" rx="1" fill="rgba(255,255,255,.12)"/>
                <rect x="3" y="4" width="16" height="3" rx="1" fill="rgba(255,255,255,.5)"/>
                <rect x="3" y="10" width="16" height="2" rx="1" fill="rgba(255,255,255,.3)"/>
                <rect x="3" y="14" width="16" height="2" rx="1" fill="rgba(255,255,255,.3)"/>
                <rect x="3" y="18" width="16" height="2" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="3" y="22" width="16" height="2" rx="1" fill="rgba(255,255,255,.2)"/>
                <rect x="26" y="2" width="19" height="12" rx="2" fill="rgba(255,255,255,.22)"/>
                <rect x="49" y="2" width="19" height="12" rx="2" fill="rgba(255,255,255,.22)"/>
                <rect x="72" y="2" width="19" height="12" rx="2" fill="rgba(255,255,255,.22)"/>
                <rect x="26" y="18" width="65" height="16" rx="2" fill="rgba(255,255,255,.15)"/>
                <rect x="26" y="38" width="30" height="10" rx="2" fill="rgba(255,255,255,.15)"/>
                <rect x="60" y="38" width="31" height="10" rx="2" fill="rgba(255,255,255,.15)"/>
              </template>
            </svg>

            <!-- Top badges -->
            <div class="tcard__badges">
              <span
                class="tcard__cat-badge"
                :style="{ background: card.color + '44', borderColor: card.color + '77' }"
              >{{ CATEGORY_META[card.page.category].label }}</span>
              <span class="tcard__mode">{{ card.variant.mode }}</span>
            </div>

            <!-- Bottom status -->
            <span class="tcard__status" :class="`tcard__status--${card.variant.status}`">
              {{ card.variant.status === 'ready' ? '● ready' : '○ draft' }}
            </span>

            <!-- Hover overlay -->
            <div class="tcard__overlay">
              <button
                class="tcard__btn tcard__btn--primary"
                :disabled="card.variant.status === 'draft' || !card.variant.route"
                @click="viewDemo(card, $event)"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {{ card.variant.status === 'draft' ? 'Draft' : 'View demo' }}
              </button>
              <button class="tcard__btn tcard__btn--ghost" @click="openPrompt(card, $event)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copy code
              </button>
            </div>
          </div>

          <!-- Card body -->
          <div class="tcard__body">
            <div class="tcard__titles">
              <p class="tcard__group">
                {{ CATEGORY_META[card.page.category].label }}<template v-if="card.page.group"> › {{ card.page.group }}</template>
              </p>
              <h3 class="tcard__title">{{ card.page.title }}</h3>
              <p class="tcard__sub">{{ card.variant.label }}</p>
              <p class="tcard__desc">{{ card.variant.description ?? card.page.description }}</p>
            </div>
            <div class="tcard__meta">
              <div class="tcard__chips-row">
                <span class="tcard__meta-lbl">Comp</span>
                <div class="tcard__chips">
                  <span v-for="c in card.variant.components.slice(0, 3)" :key="c" class="tchip">{{ c }}</span>
                  <span v-if="card.variant.components.length > 3" class="tchip tchip--more">+{{ card.variant.components.length - 3 }}</span>
                </div>
              </div>
              <div class="tcard__chips-row">
                <span class="tcard__meta-lbl">Pat</span>
                <div class="tcard__chips">
                  <span v-for="p in card.variant.patterns.slice(0, 2)" :key="p" class="tchip tchip--pat">{{ p }}</span>
                  <span v-if="card.variant.patterns.length > 2" class="tchip tchip--more">+{{ card.variant.patterns.length - 2 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- ── Empty ── -->
      <div v-else class="empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity=".3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>Không tìm thấy template nào.</p>
        <button class="empty__reset" @click="search = ''; activeCategory = 'all'; activeStatus = 'all'">Xóa bộ lọc</button>
      </div>

    </main>

    <!-- ── Prompt modal ── -->
    <Teleport to="body">
      <div v-if="promptCard" class="pm-back" @click.self="closePrompt">
        <div class="pm">
          <div class="pm__head">
            <div>
              <h2 class="pm__title">{{ promptCard.page.title }} — {{ promptCard.variant.label }}</h2>
              <code class="pm__file">{{ promptCard.variant.file }}</code>
            </div>
            <button class="pm__close" @click="closePrompt" aria-label="Đóng">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="pm__meta">
            <span class="pm__badge">{{ promptCard.page.category }}</span>
            <span class="pm__badge">{{ promptCard.variant.mode }}</span>
            <span class="pm__badge" :class="`pm__badge--${promptCard.variant.status}`">{{ promptCard.variant.status }}</span>
            <code v-if="promptCard.variant.route" class="pm__route">{{ promptCard.variant.route }}</code>
          </div>
          <div class="pm__section">
            <div class="pm__label">Components</div>
            <div class="pm__chips"><span v-for="c in promptCard.variant.components" :key="c" class="pm__chip">{{ c }}</span></div>
          </div>
          <div class="pm__section">
            <div class="pm__label">Patterns</div>
            <div class="pm__chips"><span v-for="p in promptCard.variant.patterns" :key="p" class="pm__chip pm__chip--pat">{{ p }}</span></div>
          </div>
          <div v-if="promptCard.variant.prompt" class="pm__section">
            <div class="pm__label">Prompt gợi ý</div>
            <pre class="pm__pre">{{ promptCard.variant.prompt }}</pre>
          </div>
          <div class="pm__section">
            <div class="pm__label">Import</div>
            <pre class="pm__pre">{{ promptCard.variant.components.map(c => `import { ${c} } from '@wemake/ui'`).join('\n') }}</pre>
          </div>
          <div class="pm__foot">
            <button class="pm__copy" @click="copyCode">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              {{ copyDone ? 'Đã copy ✓' : 'Copy tất cả' }}
            </button>
            <button
              v-if="promptCard.variant.route && promptCard.variant.status === 'ready'"
              class="pm__demo"
              @click="router.push(promptCard.variant.route!); closePrompt()"
            >View demo →</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Page shell ── */
.page { min-height: 100vh; background: var(--wx-surface-sunken); }
.main {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--wx-space-6) var(--wx-space-6) var(--wx-space-12);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}

/* ── Header ── */
.hdr {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--wx-space-4);
  padding-top: var(--wx-space-2);
}
.hdr__title { margin: 0 0 4px; font-size: var(--wx-fs-28); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); letter-spacing: -.5px; }
.hdr__desc  { margin: 0; font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }
.hdr__stats { display: flex; gap: var(--wx-space-5); }
.stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat__n { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); line-height: 1; }
.stat__l { font-size: 10px; color: var(--wx-text-muted); text-transform: uppercase; letter-spacing: .5px; }

/* ── Filter bar ── */
.filter-bar {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
}
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  max-width: 360px;
}
.search-icon { position: absolute; left: 11px; color: var(--wx-text-muted); pointer-events: none; }
.search-input {
  width: 100%;
  padding: 9px 32px 9px 34px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-primary);
  background: var(--wx-surface-elevated);
  transition: border-color var(--wx-d-fast), box-shadow var(--wx-d-fast);
}
.search-input:focus {
  outline: none;
  border-color: var(--wx-brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-brand-primary) 12%, transparent);
}
.search-input::placeholder { color: var(--wx-text-muted); }
.search-clear {
  position: absolute; right: 8px;
  background: none; border: none;
  color: var(--wx-text-muted);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  width: 20px; height: 20px;
  border-radius: 50%;
  transition: background var(--wx-d-fast);
}
.search-clear:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }

.status-tabs {
  display: flex; gap: 3px;
  padding: 4px;
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
}
.stab {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px;
  border: none; border-radius: var(--wx-radius-md);
  background: transparent; color: var(--wx-text-secondary);
  font-size: var(--wx-fs-12); font-family: var(--wx-font-primary); font-weight: var(--wx-fw-medium);
  cursor: pointer;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
}
.stab:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
.stab--on { background: var(--wx-surface-sunken); color: var(--wx-text-primary); box-shadow: var(--wx-shadow-sm); }
.stab__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.stab__dot--ready { background: var(--wx-success-solid, #22c55e); }
.stab__dot--draft { background: var(--wx-text-muted); }
.stab__n { font-size: 10px; color: var(--wx-text-muted); }

.result-count { font-size: var(--wx-fs-12); color: var(--wx-text-muted); margin-left: auto; }

/* ── Category tabs ── */
.cat-bar {
  display: flex; flex-wrap: wrap; gap: var(--wx-space-2);
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
}
.ctab {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 13px;
  border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-full);
  background: transparent; color: var(--wx-text-secondary);
  font-size: var(--wx-fs-12); font-family: var(--wx-font-primary); font-weight: var(--wx-fw-medium);
  cursor: pointer; white-space: nowrap;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
}
.ctab:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
.ctab--on {
  background: var(--ctab-color, var(--wx-brand-primary));
  color: #fff;
  border-color: var(--ctab-color, var(--wx-brand-primary));
}
.ctab__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.ctab__n {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 16px; padding: 0 4px;
  border-radius: var(--wx-radius-full); font-size: 10px; font-weight: var(--wx-fw-bold);
  background: rgba(255,255,255,.22);
}
.ctab:not(.ctab--on) .ctab__n { background: var(--wx-surface-sunken); color: var(--wx-text-muted); }

/* ── Grid + TransitionGroup ── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--wx-space-4);
  position: relative;
}

@keyframes tcard-in {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.tcard-enter-active {
  animation: tcard-in var(--wx-d-normal, 250ms) var(--wx-ease-decelerate) both;
  animation-delay: calc(var(--tcard-i, 0) * var(--wx-stagger-xs, 30ms));
}
.tcard-leave-active {
  transition: opacity var(--wx-d-fast) var(--wx-ease-accelerate),
              transform var(--wx-d-fast) var(--wx-ease-accelerate);
}
.tcard-leave-to { opacity: 0; transform: scale(0.93); }
.tcard-move     { transition: transform var(--wx-d-normal) var(--wx-ease-standard); }

@media (prefers-reduced-motion: reduce) {
  .tcard-enter-active { animation: none; }
  .tcard-leave-active, .tcard-move { transition: none; }
}

/* ── Template card ── */
.tcard {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition:
    transform    var(--wx-d-fast) var(--wx-ease-standard),
    box-shadow   var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard);
}
.tcard:hover {
  transform: translateY(-4px);
  box-shadow: var(--wx-shadow-lift, 0 8px 24px -4px rgba(0,0,0,.12));
  border-color: var(--wx-brand-primary);
}
.tcard--draft { opacity: .72; cursor: default; }
.tcard--draft:hover { transform: none; box-shadow: none; border-color: var(--wx-border-default); }

/* Thumbnail */
.tcard__thumb {
  position: relative;
  height: 160px;
  overflow: hidden;
  flex-shrink: 0;
}
.tcard__wire {
  position: absolute; inset: 0; width: 100%; height: 100%;
  padding: 12px; box-sizing: border-box;
  transition: transform var(--wx-d-normal) var(--wx-ease-decelerate);
}
.tcard:hover .tcard__wire { transform: scale(1.06); }

/* Badges */
.tcard__badges {
  position: absolute; top: 10px; left: 10px; right: 10px;
  display: flex; align-items: center; justify-content: space-between; gap: 6px;
}
.tcard__cat-badge {
  padding: 2px 8px;
  border-radius: var(--wx-radius-full);
  font-size: 10px; font-weight: var(--wx-fw-semibold);
  font-family: var(--wx-font-primary);
  color: #fff;
  backdrop-filter: blur(8px);
  border: 1px solid;
  white-space: nowrap;
  max-width: calc(100% - 64px);
  overflow: hidden; text-overflow: ellipsis;
}
.tcard__mode {
  padding: 2px 7px;
  border-radius: var(--wx-radius-full);
  background: rgba(255,255,255,.18); backdrop-filter: blur(6px);
  color: rgba(255,255,255,.9); font-size: 10px;
  font-family: var(--wx-font-primary); font-weight: var(--wx-fw-medium);
  text-transform: capitalize; flex-shrink: 0;
}
.tcard__status {
  position: absolute; bottom: 10px; left: 10px;
  padding: 2px 8px; border-radius: var(--wx-radius-full);
  font-size: 10px; font-weight: var(--wx-fw-bold); font-family: var(--wx-font-mono);
  backdrop-filter: blur(6px);
}
.tcard__status--ready { background: rgba(22,163,74,.25); color: #bbf7d0; }
.tcard__status--draft { background: rgba(0,0,0,.3); color: rgba(255,255,255,.55); }

/* Hover overlay */
.tcard__overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,.5);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  opacity: 0;
  transition: opacity var(--wx-d-fast) var(--wx-ease-standard);
}
.tcard:hover .tcard__overlay { opacity: 1; }

.tcard__btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 16px; border-radius: var(--wx-radius-lg);
  font-size: var(--wx-fs-12); font-family: var(--wx-font-primary); font-weight: var(--wx-fw-semibold);
  cursor: pointer; border: none; white-space: nowrap;
  transform: translateY(8px);
  transition:
    transform  var(--wx-d-normal) var(--wx-ease-decelerate),
    filter     var(--wx-d-fast)   var(--wx-ease-standard),
    background var(--wx-d-fast)   var(--wx-ease-standard);
}
.tcard:hover .tcard__btn              { transform: translateY(0); }
.tcard:hover .tcard__btn:nth-child(2) { transition-delay: 60ms; }
.tcard__btn--primary { background: var(--wx-gradient-button); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.2); }
.tcard__btn--primary:hover:not(:disabled) { filter: brightness(1.1); }
.tcard__btn--primary:disabled { opacity: .5; cursor: not-allowed; }
.tcard__btn--ghost {
  background: rgba(255,255,255,.15); color: #fff;
  border: 1px solid rgba(255,255,255,.3); backdrop-filter: blur(4px);
}
.tcard__btn--ghost:hover { background: rgba(255,255,255,.25); }

/* Card body */
.tcard__body {
  padding: 14px 16px 16px;
  display: flex; flex-direction: column; gap: var(--wx-space-3);
  flex: 1;
}
.tcard__titles { display: flex; flex-direction: column; gap: 3px; }
.tcard__group {
  margin: 0 0 1px;
  font-size: 10px;
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: .6px;
  color: var(--wx-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tcard__title {
  margin: 0;
  font-size: var(--wx-fs-14); font-weight: var(--wx-fw-bold);
  color: var(--wx-text-primary); line-height: 1.2;
}
.tcard__sub {
  margin: 0;
  font-size: var(--wx-fs-12); font-weight: var(--wx-fw-medium);
  color: var(--wx-brand-primary); line-height: 1.3;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.tcard__desc {
  margin: 0;
  font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Meta chips */
.tcard__meta {
  display: flex; flex-direction: column; gap: 5px;
  padding-top: var(--wx-space-2);
  border-top: 1px solid var(--wx-border-subtle);
  margin-top: auto;
}
.tcard__chips-row {
  display: flex; align-items: flex-start; gap: 6px;
}
.tcard__meta-lbl {
  font-size: 9px; font-weight: var(--wx-fw-bold);
  text-transform: uppercase; letter-spacing: .5px;
  color: var(--wx-text-muted); white-space: nowrap;
  margin-top: 3px; flex-shrink: 0; min-width: 28px;
}
.tcard__chips { display: flex; flex-wrap: wrap; gap: 3px; }
.tchip {
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  border: 1px solid var(--wx-border-subtle);
  font-size: 10px; color: var(--wx-text-muted);
  font-family: var(--wx-font-mono);
  background: var(--wx-surface-sunken);
}
.tchip--pat {
  background: color-mix(in srgb, var(--wx-brand-primary) 8%, transparent);
  color: var(--wx-brand-primary);
  border-color: color-mix(in srgb, var(--wx-brand-primary) 18%, transparent);
}
.tchip--more { border-color: transparent; background: transparent; color: var(--wx-text-muted); }

/* ── Empty ── */
.empty {
  display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-3);
  padding: var(--wx-space-12) 0; color: var(--wx-text-secondary);
}
.empty p { margin: 0; font-size: var(--wx-fs-14); }
.empty__reset {
  padding: 8px 20px; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-elevated); font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13); cursor: pointer; color: var(--wx-text-primary);
  transition: background var(--wx-d-fast);
}
.empty__reset:hover { background: var(--wx-hover-bg); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
  .hdr__stats { display: none; }
}
@media (max-width: 600px) {
  .main { padding: var(--wx-space-4) var(--wx-space-3) var(--wx-space-10); }
  .grid { grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }
  .filter-bar { gap: var(--wx-space-2); }
  .result-count { display: none; }
}
@media (max-width: 440px) {
  .grid { grid-template-columns: 1fr; }
}

/* ── Prompt modal ── */
.pm-back { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: var(--wx-space-4); }
.pm {
  background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-2xl); width: 100%; max-width: 540px; max-height: 86vh;
  overflow-y: auto; display: flex; flex-direction: column;
  box-shadow: 0 24px 64px -12px rgba(0,0,0,.25);
}
.pm__head {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-3);
  border-bottom: 1px solid var(--wx-border-default); gap: var(--wx-space-3);
  position: sticky; top: 0; background: var(--wx-surface-elevated); z-index: 1;
}
.pm__title { margin: 0 0 3px; font-size: var(--wx-fs-15); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.pm__file  { font-family: var(--wx-font-mono); font-size: var(--wx-fs-11); color: var(--wx-text-muted); }
.pm__close { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: var(--wx-radius-md); background: transparent; border: none; color: var(--wx-text-secondary); cursor: pointer; flex-shrink: 0; transition: background var(--wx-d-fast); }
.pm__close:hover { background: var(--wx-hover-bg); }
.pm__meta { display: flex; flex-wrap: wrap; align-items: center; gap: var(--wx-space-2); padding: var(--wx-space-3) var(--wx-space-5); }
.pm__badge { padding: 3px 10px; border-radius: var(--wx-radius-full); font-size: 11px; font-weight: var(--wx-fw-semibold); background: var(--wx-neutral-bg); color: var(--wx-text-secondary); text-transform: capitalize; }
.pm__badge--ready { background: var(--wx-success-bg, #dcfce7); color: var(--wx-success-text, #15803d); }
.pm__badge--draft { background: var(--wx-neutral-bg); color: var(--wx-text-muted); }
.pm__route { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-link); padding: 3px 8px; background: var(--wx-surface-sunken); border-radius: var(--wx-radius-sm); }
.pm__section { padding: var(--wx-space-3) var(--wx-space-5); border-top: 1px solid var(--wx-border-subtle); display: flex; flex-direction: column; gap: var(--wx-space-2); }
.pm__label { font-size: 10px; font-weight: var(--wx-fw-semibold); text-transform: uppercase; letter-spacing: .7px; color: var(--wx-text-muted); }
.pm__chips { display: flex; flex-wrap: wrap; gap: 5px; }
.pm__chip { padding: 3px 9px; border-radius: var(--wx-radius-sm); font-size: var(--wx-fs-12); background: var(--wx-surface-sunken); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); border: 1px solid var(--wx-border-subtle); }
.pm__chip--pat { background: color-mix(in srgb, var(--wx-brand-primary) 10%, transparent); color: var(--wx-brand-primary); border-color: color-mix(in srgb, var(--wx-brand-primary) 20%, transparent); }
.pm__pre { margin: 0; padding: var(--wx-space-3); background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); white-space: pre-wrap; line-height: 1.6; }
.pm__foot { display: flex; align-items: center; gap: var(--wx-space-3); padding: var(--wx-space-4) var(--wx-space-5); border-top: 1px solid var(--wx-border-default); background: var(--wx-surface-sunken); border-radius: 0 0 var(--wx-radius-2xl) var(--wx-radius-2xl); }
.pm__copy { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: var(--wx-radius-lg); border: 1px solid var(--wx-border-default); background: var(--wx-surface-elevated); font-size: var(--wx-fs-13); font-family: var(--wx-font-primary); font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); cursor: pointer; transition: background var(--wx-d-fast); }
.pm__copy:hover { background: var(--wx-hover-bg); }
.pm__demo { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: var(--wx-radius-lg); border: none; background: var(--wx-gradient-button); color: #fff; font-size: var(--wx-fs-13); font-family: var(--wx-font-primary); font-weight: var(--wx-fw-semibold); cursor: pointer; transition: filter var(--wx-d-fast); }
.pm__demo:hover { filter: brightness(1.08); }
</style>
