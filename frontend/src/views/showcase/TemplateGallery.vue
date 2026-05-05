<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import {
  layoutPages, CATEGORIES, CATEGORY_META,
  totalVariants, totalPages,
  type LayoutPage, type LayoutVariant, type LayoutCategory, type WCGroup,
} from './layout-gallery/layoutRegistry'

const router = useRouter()

/* ── Filters ── */
const search        = ref('')
const activeCategory = ref<LayoutCategory | 'all'>('all')

const filteredPages = computed<LayoutPage[]>(() => {
  let list = layoutPages
  if (activeCategory.value !== 'all')
    list = list.filter(p => p.category === activeCategory.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags ?? []).some(t => t.includes(q)) ||
      p.variants.some(v => v.label.toLowerCase().includes(q))
    )
  }
  return list
})

const pagesByCategory = computed(() => {
  if (activeCategory.value !== 'all') {
    return [{ category: activeCategory.value as LayoutCategory, pages: filteredPages.value }]
  }
  return CATEGORIES
    .map(cat => ({ category: cat, pages: filteredPages.value.filter(p => p.category === cat) }))
    .filter(g => g.pages.length > 0)
})

/** WeConnect pages grouped by sub-group ('WeConnect' | 'Hệ thống') */
function wcSubGroups(pages: LayoutPage[]): { group: WCGroup; pages: LayoutPage[] }[] {
  const groups: WCGroup[] = ['WeConnect', 'Hệ thống']
  return groups
    .map(g => ({ group: g, pages: pages.filter(p => p.group === g) }))
    .filter(g => g.pages.length > 0)
}

const countByCategory = computed(() => {
  const m: Partial<Record<LayoutCategory, number>> = {}
  for (const p of layoutPages) m[p.category] = (m[p.category] ?? 0) + 1
  return m
})

/* ── Prompt modal ── */
const promptVariant = ref<{ page: LayoutPage; variant: LayoutVariant } | null>(null)
const copyDone = ref(false)

function openPrompt(page: LayoutPage, variant: LayoutVariant, e: Event) {
  e.stopPropagation()
  promptVariant.value = { page, variant }
  copyDone.value = false
}
function closePrompt() { promptVariant.value = null }

function copyCode() {
  const v = promptVariant.value
  if (!v) return
  const lines = [
    `# ${v.page.title} — ${v.variant.label}`,
    `Category: ${v.page.category}`,
    `File: ${v.variant.file}`,
    v.variant.route ? `Route: ${v.variant.route}` : '',
    '',
    `## Components\n${v.variant.components.join(', ')}`,
    '',
    `## Patterns\n${v.variant.patterns.join(', ')}`,
    '',
    `## Import\n${v.variant.components.map(c => `import { ${c} } from '@wemake/ui'`).join('\n')}`,
    '',
    v.variant.prompt ? `## Prompt\n${v.variant.prompt}` : '',
  ].filter(Boolean).join('\n')
  navigator.clipboard.writeText(lines).catch(() => {})
  copyDone.value = true
  setTimeout(() => { copyDone.value = false }, 2200)
}

function viewDemo(v: LayoutVariant, e: Event) {
  e.stopPropagation()
  if (v.route && v.status === 'ready') router.push(v.route)
}
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="layout gallery" />

    <main class="main">

      <!-- ── Header ── -->
      <div class="header">
        <div>
          <h1 class="header__title">Layout Gallery</h1>
          <p class="header__desc">
            {{ totalPages() }} loại trang · {{ totalVariants() }} variant · Bấm để xem demo thật
          </p>
        </div>
        <div class="search-wrap">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="search" class="search-input" placeholder="Tìm trang, variant, tag..." />
        </div>
      </div>

      <!-- ── Category tabs ── -->
      <div class="cat-bar">
        <button class="ctab" :class="{ 'ctab--on': activeCategory === 'all' }" @click="activeCategory = 'all'">
          Tất cả <span class="ctab__n">{{ layoutPages.length }}</span>
        </button>
        <button
          v-for="cat in CATEGORIES" :key="cat"
          class="ctab"
          :class="{ 'ctab--on': activeCategory === cat }"
          :style="activeCategory === cat ? { background: CATEGORY_META[cat].color, borderColor: CATEGORY_META[cat].color, color: '#fff' } : {}"
          @click="activeCategory = activeCategory === cat ? 'all' : cat"
        >
          {{ cat }}
          <span class="ctab__n">{{ countByCategory[cat] ?? 0 }}</span>
        </button>
      </div>

      <!-- ── Gallery: grouped by category ── -->
      <div v-for="group in pagesByCategory" :key="group.category" class="cat-section">

        <!-- Category heading -->
        <div class="cat-heading">
          <span class="cat-dot" :style="{ background: CATEGORY_META[group.category].color }" />
          <h2 class="cat-title">{{ CATEGORY_META[group.category].label }}</h2>
          <span class="cat-subdesc">{{ CATEGORY_META[group.category].desc }}</span>
          <span class="cat-count">{{ group.pages.length }} trang</span>
        </div>

        <!-- WeConnect: render sub-groups (WeConnect / Hệ thống) -->
        <template v-if="group.category === 'WeConnect'">
          <div v-for="sub in wcSubGroups(group.pages)" :key="sub.group" class="wc-subgroup">
            <div class="wc-subgroup-head">
              <span class="wc-subgroup-label">{{ sub.group }}</span>
              <span class="wc-subgroup-count">{{ sub.pages.length }} trang</span>
            </div>
            <div class="pages-list">
              <div v-for="page in sub.pages" :key="page.id" class="page-block">
                <div class="page-label-row">
                  <h3 class="page-title">{{ page.title }}</h3>
                  <p class="page-desc">{{ page.description }}</p>
                  <div v-if="page.tags?.length" class="page-tags">
                    <span v-for="t in page.tags.slice(0, 4)" :key="t" class="ptag">#{{ t }}</span>
                  </div>
                </div>
                <div class="variants-row">
                  <div
                    v-for="variant in page.variants" :key="variant.id"
                    class="vcard" :class="{ 'vcard--draft': variant.status === 'draft' }"
                    @click="variant.status === 'ready' && variant.route && router.push(variant.route)"
                  >
                    <div class="vcard__thumb" :style="{ background: `linear-gradient(145deg, ${CATEGORY_META[page.category].color}d0 0%, ${CATEGORY_META[page.category].color}90 100%)` }">
                      <svg class="vcard__wire" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                      </svg>
                      <span class="vcard__mode">{{ variant.mode }}</span>
                      <div class="vcard__overlay">
                        <button class="vcard__btn vcard__btn--primary" :disabled="variant.status === 'draft' || !variant.route" @click="viewDemo(variant, $event)">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          {{ variant.status === 'draft' ? 'Draft' : 'View demo' }}
                        </button>
                        <button class="vcard__btn vcard__btn--ghost" @click="openPrompt(page, variant, $event)">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                          Copy code
                        </button>
                      </div>
                    </div>
                    <div class="vcard__body">
                      <div class="vcard__row">
                        <span class="vcard__label">{{ variant.label }}</span>
                        <span class="vcard__status" :class="`vcard__status--${variant.status}`">{{ variant.status }}</span>
                      </div>
                      <div class="vcard__chips">
                        <span v-for="c in variant.components.slice(0, 3)" :key="c" class="vchip">{{ c }}</span>
                        <span v-if="variant.components.length > 3" class="vchip vchip--more">+{{ variant.components.length - 3 }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="vcard vcard--add"><div class="vcard__add-inner"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Thêm variant</span></div></div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Other categories: flat pages list -->
        <div v-else class="pages-list">
          <div v-for="page in group.pages" :key="page.id" class="page-block">

            <!-- Page label row -->
            <div class="page-label-row">
              <h3 class="page-title">{{ page.title }}</h3>
              <p class="page-desc">{{ page.description }}</p>
              <div v-if="page.tags?.length" class="page-tags">
                <span v-for="t in page.tags.slice(0, 4)" :key="t" class="ptag">#{{ t }}</span>
              </div>
            </div>

            <!-- Variants row -->
            <div class="variants-row">
              <div
                v-for="variant in page.variants"
                :key="variant.id"
                class="vcard"
                :class="{ 'vcard--draft': variant.status === 'draft' }"
                @click="variant.status === 'ready' && variant.route && router.push(variant.route)"
              >
                <!-- Thumbnail -->
                <div class="vcard__thumb" :style="{ background: `linear-gradient(145deg, ${CATEGORY_META[page.category].color}d0 0%, ${CATEGORY_META[page.category].color}90 100%)` }">
                  <!-- Mini wireframe -->
                  <svg class="vcard__wire" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <!-- Dashboard/sidebar layout -->
                    <template v-if="['WeConnect','Dashboard','App'].includes(page.category)">
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
                    <!-- Auth centered -->
                    <template v-else-if="page.category === 'Auth'">
                      <rect x="22" y="4" width="56" height="52" rx="4" fill="rgba(255,255,255,.15)"/>
                      <rect x="30" y="10" width="40" height="5" rx="2" fill="rgba(255,255,255,.5)"/>
                      <rect x="30" y="18" width="40" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
                      <rect x="30" y="29" width="40" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
                      <rect x="30" y="40" width="40" height="8" rx="3" fill="rgba(255,255,255,.45)"/>
                    </template>
                    <!-- Landing -->
                    <template v-else-if="page.category === 'Landing'">
                      <rect x="0" y="0" width="100" height="8" rx="1" fill="rgba(255,255,255,.2)"/>
                      <rect x="10" y="12" width="80" height="14" rx="3" fill="rgba(255,255,255,.18)"/>
                      <rect x="25" y="16" width="50" height="5" rx="2" fill="rgba(255,255,255,.45)"/>
                      <rect x="35" y="28" width="30" height="6" rx="2" fill="rgba(255,255,255,.5)"/>
                      <rect x="0" y="38" width="31" height="12" rx="2" fill="rgba(255,255,255,.15)"/>
                      <rect x="35" y="38" width="31" height="12" rx="2" fill="rgba(255,255,255,.15)"/>
                      <rect x="70" y="38" width="30" height="12" rx="2" fill="rgba(255,255,255,.15)"/>
                    </template>
                    <!-- Error centered -->
                    <template v-else-if="page.category === 'Error'">
                      <rect x="15" y="8" width="70" height="44" rx="5" fill="rgba(255,255,255,.12)"/>
                      <rect x="30" y="14" width="40" height="8" rx="2" fill="rgba(255,255,255,.3)"/>
                      <rect x="35" y="26" width="30" height="4" rx="1" fill="rgba(255,255,255,.2)"/>
                      <rect x="32" y="35" width="16" height="7" rx="2" fill="rgba(255,255,255,.4)"/>
                      <rect x="52" y="35" width="16" height="7" rx="2" fill="rgba(255,255,255,.2)"/>
                    </template>
                    <!-- Billing -->
                    <template v-else-if="page.category === 'Billing'">
                      <rect x="0" y="4" width="30" height="50" rx="3" fill="rgba(255,255,255,.15)"/>
                      <rect x="35" y="4" width="30" height="50" rx="3" fill="rgba(255,255,255,.28)"/>
                      <rect x="70" y="4" width="30" height="50" rx="3" fill="rgba(255,255,255,.15)"/>
                      <rect x="40" y="10" width="20" height="4" rx="1" fill="rgba(255,255,255,.6)"/>
                      <rect x="42" y="18" width="16" height="6" rx="1" fill="rgba(255,255,255,.4)"/>
                      <rect x="40" y="40" width="20" height="8" rx="2" fill="rgba(255,255,255,.5)"/>
                    </template>
                    <!-- Communication chat -->
                    <template v-else>
                      <rect x="0" y="0" width="28" height="60" rx="1" fill="rgba(255,255,255,.12)"/>
                      <rect x="32" y="6" width="38" height="7" rx="3" fill="rgba(255,255,255,.3)"/>
                      <rect x="54" y="18" width="38" height="7" rx="3" fill="rgba(255,255,255,.2)"/>
                      <rect x="32" y="30" width="38" height="7" rx="3" fill="rgba(255,255,255,.3)"/>
                      <rect x="54" y="42" width="38" height="7" rx="3" fill="rgba(255,255,255,.2)"/>
                    </template>
                  </svg>

                  <!-- badges -->
                  <span class="vcard__mode">{{ variant.mode }}</span>

                  <!-- Hover overlay -->
                  <div class="vcard__overlay">
                    <button
                      class="vcard__btn vcard__btn--primary"
                      :disabled="variant.status === 'draft' || !variant.route"
                      @click="viewDemo(variant, $event)"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      {{ variant.status === 'draft' ? 'Draft' : 'View demo' }}
                    </button>
                    <button class="vcard__btn vcard__btn--ghost" @click="openPrompt(page, variant, $event)">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                      Copy code
                    </button>
                  </div>
                </div>

                <!-- Card body -->
                <div class="vcard__body">
                  <div class="vcard__row">
                    <span class="vcard__label">{{ variant.label }}</span>
                    <span class="vcard__status" :class="`vcard__status--${variant.status}`">{{ variant.status }}</span>
                  </div>
                  <div class="vcard__chips">
                    <span v-for="c in variant.components.slice(0, 3)" :key="c" class="vchip">{{ c }}</span>
                    <span v-if="variant.components.length > 3" class="vchip vchip--more">+{{ variant.components.length - 3 }}</span>
                  </div>
                </div>
              </div>

              <!-- Add variant placeholder -->
              <div class="vcard vcard--add">
                <div class="vcard__add-inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>Thêm variant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="pagesByCategory.length === 0" class="empty">
        <p>Không tìm thấy trang nào.</p>
        <button class="empty__reset" @click="search = ''; activeCategory = 'all'">Xóa bộ lọc</button>
      </div>

    </main>

    <!-- ── Prompt/Code modal ── -->
    <Teleport to="body">
      <div v-if="promptVariant" class="pm-back" @click.self="closePrompt">
        <div class="pm">
          <div class="pm__head">
            <div>
              <h2 class="pm__title">{{ promptVariant.page.title }} — {{ promptVariant.variant.label }}</h2>
              <code class="pm__file">{{ promptVariant.variant.file }}</code>
            </div>
            <button class="pm__close" @click="closePrompt" aria-label="Đóng">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="pm__meta">
            <span class="pm__badge">{{ promptVariant.page.category }}</span>
            <span class="pm__badge">{{ promptVariant.variant.mode }}</span>
            <span class="pm__badge" :class="`pm__badge--${promptVariant.variant.status}`">{{ promptVariant.variant.status }}</span>
            <code v-if="promptVariant.variant.route" class="pm__route">{{ promptVariant.variant.route }}</code>
          </div>

          <div class="pm__section">
            <div class="pm__label">Components</div>
            <div class="pm__chips">
              <span v-for="c in promptVariant.variant.components" :key="c" class="pm__chip">{{ c }}</span>
            </div>
          </div>

          <div class="pm__section">
            <div class="pm__label">Patterns</div>
            <div class="pm__chips">
              <span v-for="p in promptVariant.variant.patterns" :key="p" class="pm__chip pm__chip--pat">{{ p }}</span>
            </div>
          </div>

          <div v-if="promptVariant.variant.prompt" class="pm__section">
            <div class="pm__label">Prompt gợi ý</div>
            <pre class="pm__pre">{{ promptVariant.variant.prompt }}</pre>
          </div>

          <div class="pm__section">
            <div class="pm__label">Import</div>
            <pre class="pm__pre">{{ promptVariant.variant.components.map(c => `import { ${c} } from '@wemake/ui'`).join('\n') }}</pre>
          </div>

          <div class="pm__foot">
            <button class="pm__copy" @click="copyCode">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              {{ copyDone ? 'Đã copy ✓' : 'Copy tất cả' }}
            </button>
            <button
              v-if="promptVariant.variant.route && promptVariant.variant.status === 'ready'"
              class="pm__demo"
              @click="router.push(promptVariant.variant.route!); closePrompt()"
            >View demo →</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--wx-surface-sunken); }
.main {
  max-width: 1360px;
  margin: 0 auto;
  padding: var(--wx-space-6) var(--wx-space-6) var(--wx-space-12);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-6);
}

/* ── Header ── */
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--wx-space-4);
  padding-top: var(--wx-space-2);
}
.header__title { margin: 0 0 4px; font-size: var(--wx-fs-26); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); letter-spacing: -.5px; }
.header__desc  { margin: 0; font-size: var(--wx-fs-13); color: var(--wx-text-secondary); }

.search-wrap { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 11px; color: var(--wx-text-muted); pointer-events: none; }
.search-input {
  width: 260px; padding: 9px 14px 9px 34px;
  border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg);
  font-family: var(--wx-font-primary); font-size: var(--wx-fs-13);
  color: var(--wx-text-primary); background: var(--wx-surface-elevated);
  transition: border-color var(--wx-duration-fast);
}
.search-input:focus { outline: none; border-color: var(--wx-brand-focus); }
.search-input::placeholder { color: var(--wx-text-muted); }

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
  transition: all var(--wx-duration-fast) var(--wx-easing-default);
}
.ctab:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
.ctab--on { background: var(--wx-brand-primary); color: #fff; border-color: var(--wx-brand-primary); }
.ctab__n {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 16px; padding: 0 4px;
  border-radius: var(--wx-radius-full); font-size: 10px; font-weight: var(--wx-fw-bold);
  background: rgba(255,255,255,.22);
}
.ctab:not(.ctab--on) .ctab__n { background: var(--wx-surface-sunken); color: var(--wx-text-muted); }

/* ── Category section ── */
.cat-section { display: flex; flex-direction: column; gap: var(--wx-space-4); }

.cat-heading {
  display: flex; align-items: center; gap: var(--wx-space-2);
  padding-bottom: var(--wx-space-3);
  border-bottom: 2px solid var(--wx-border-default);
}
.cat-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.cat-title { margin: 0; font-size: var(--wx-fs-16); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.cat-subdesc { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.cat-count {
  margin-left: auto; font-size: var(--wx-fs-12); color: var(--wx-text-muted);
  padding: 2px 10px; border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-full);
}

/* ── WeConnect sub-groups ── */
.wc-subgroup { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.wc-subgroup + .wc-subgroup { margin-top: var(--wx-space-2); padding-top: var(--wx-space-4); border-top: 1px dashed var(--wx-border-subtle); }
.wc-subgroup-head { display: flex; align-items: center; gap: var(--wx-space-2); }
.wc-subgroup-label {
  font-size: var(--wx-fs-12); font-weight: var(--wx-fw-bold);
  text-transform: uppercase; letter-spacing: .6px;
  color: var(--wx-text-muted);
}
.wc-subgroup-count { font-size: var(--wx-fs-11); color: var(--wx-text-muted); }

/* ── Pages list ── */
.pages-list { display: flex; flex-direction: column; gap: var(--wx-space-5); }

.page-block { display: flex; flex-direction: column; gap: var(--wx-space-3); }

.page-label-row { display: flex; align-items: baseline; gap: var(--wx-space-3); flex-wrap: wrap; }
.page-title { margin: 0; font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); white-space: nowrap; }
.page-desc  { margin: 0; font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.4; }
.page-tags  { display: flex; gap: 5px; margin-left: auto; flex-shrink: 0; }
.ptag       { font-size: 11px; color: var(--wx-text-muted); font-family: var(--wx-font-mono); }

/* ── Variants row ── */
.variants-row {
  display: flex; flex-wrap: wrap; gap: var(--wx-space-3);
}

/* ── Variant card ── */
.vcard {
  width: 220px; flex-shrink: 0;
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: transform 200ms var(--wx-easing-default), box-shadow 200ms var(--wx-easing-default), border-color 150ms var(--wx-easing-default);
}
.vcard:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px -6px rgba(0,0,0,.14);
  border-color: var(--wx-brand-primary);
}
.vcard--draft { opacity: .72; cursor: default; }
.vcard--draft:hover { transform: none; box-shadow: none; border-color: var(--wx-border-default); }

/* Thumbnail */
.vcard__thumb {
  position: relative; height: 120px; overflow: hidden;
  transition: none;
}
.vcard__wire {
  position: absolute; inset: 0; width: 100%; height: 100%;
  padding: 10px 10px; box-sizing: border-box;
  transition: transform 250ms var(--wx-easing-default);
}
.vcard:hover .vcard__wire { transform: scale(1.05); }

.vcard__mode {
  position: absolute; top: 8px; right: 8px;
  padding: 2px 7px; border-radius: var(--wx-radius-full);
  background: rgba(255,255,255,.18); backdrop-filter: blur(6px);
  color: rgba(255,255,255,.9); font-size: 10px;
  font-family: var(--wx-font-primary); font-weight: var(--wx-fw-medium);
  text-transform: capitalize;
}

/* Hover overlay */
.vcard__overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,.45);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  opacity: 0; transition: opacity 150ms var(--wx-easing-default);
}
.vcard:hover .vcard__overlay { opacity: 1; }

.vcard__btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: var(--wx-radius-lg);
  font-size: var(--wx-fs-12); font-family: var(--wx-font-primary); font-weight: var(--wx-fw-semibold);
  cursor: pointer; border: none; white-space: nowrap;
  transition: all 150ms;
}
.vcard__btn--primary { background: var(--wx-gradient-button); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.2); }
.vcard__btn--primary:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
.vcard__btn--primary:disabled { opacity: .5; cursor: not-allowed; }
.vcard__btn--ghost { background: rgba(255,255,255,.15); color: #fff; border: 1px solid rgba(255,255,255,.25); backdrop-filter: blur(4px); }
.vcard__btn--ghost:hover { background: rgba(255,255,255,.25); }

/* Card body */
.vcard__body { padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
.vcard__row { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
.vcard__label { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); line-height: 1.3; }
.vcard__status {
  flex-shrink: 0; padding: 1px 7px; border-radius: var(--wx-radius-full);
  font-size: 10px; font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .4px;
}
.vcard__status--ready  { background: var(--wx-success-bg, #dcfce7); color: var(--wx-success-text, #15803d); }
.vcard__status--draft  { background: var(--wx-neutral-bg); color: var(--wx-text-muted); }

.vcard__chips { display: flex; flex-wrap: wrap; gap: 3px; }
.vchip {
  padding: 1px 6px; border-radius: var(--wx-radius-sm);
  border: 1px solid var(--wx-border-subtle);
  font-size: 10px; color: var(--wx-text-muted); font-family: var(--wx-font-mono);
  background: var(--wx-surface-sunken);
}
.vchip--more { border-color: transparent; background: transparent; }

/* Add variant placeholder */
.vcard--add {
  cursor: default; opacity: .45; border-style: dashed;
  display: flex; align-items: stretch;
}
.vcard--add:hover { transform: none; box-shadow: none; border-color: var(--wx-border-default); opacity: .55; }
.vcard__add-inner {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: var(--wx-space-2); padding: var(--wx-space-5);
  font-size: var(--wx-fs-12); color: var(--wx-text-muted);
}

/* ── Empty ── */
.empty { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-3); padding: var(--wx-space-12) 0; color: var(--wx-text-secondary); }
.empty p { margin: 0; font-size: var(--wx-fs-14); }
.empty__reset { padding: 8px 20px; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); background: var(--wx-surface-elevated); font-family: var(--wx-font-primary); font-size: var(--wx-fs-13); cursor: pointer; color: var(--wx-text-primary); }
.empty__reset:hover { background: var(--wx-hover-bg); }

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
.pm__close { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: var(--wx-radius-md); background: transparent; border: none; color: var(--wx-text-secondary); cursor: pointer; flex-shrink: 0; }
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
.pm__copy { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: var(--wx-radius-lg); border: 1px solid var(--wx-border-default); background: var(--wx-surface-elevated); font-size: var(--wx-fs-13); font-family: var(--wx-font-primary); font-weight: var(--wx-fw-medium); color: var(--wx-text-primary); cursor: pointer; transition: all var(--wx-duration-fast); }
.pm__copy:hover { background: var(--wx-hover-bg); }
.pm__demo { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: var(--wx-radius-lg); border: none; background: var(--wx-gradient-button); color: #fff; font-size: var(--wx-fs-13); font-family: var(--wx-font-primary); font-weight: var(--wx-fw-semibold); cursor: pointer; transition: filter var(--wx-duration-fast); }
.pm__demo:hover { filter: brightness(1.08); }
</style>
