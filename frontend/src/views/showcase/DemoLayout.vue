<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { phases } from './_phases-data'
import type { ShowcaseRoute } from './_phases-data'

const route = useRoute()
const collapsed = ref(false)

function toggleSidebar() {
  collapsed.value = !collapsed.value
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function getNavLabel(r: ShowcaseRoute): string {
  return r.navLabel ?? r.label.split(' — ')[0]
}

/* ── Sidebar groups ── */
type SidebarGroup =
  | { type?: 'phases'; key: string; label: string; phaseNums: readonly number[] }
  | { type: 'link';   key: string; label: string; to: string; icon?: string }

const GROUPS: SidebarGroup[] = [
  { key: 'foundations', label: 'Foundations', phaseNums: [0] },
  { key: 'components',  label: 'Components',  phaseNums: [1, 2, 3] },
  { key: 'data',        label: 'Data',        phaseNums: [4] },
  { key: 'charts',      label: 'Charts',      phaseNums: [4.5] },
  { key: 'patterns',      label: 'Patterns',      phaseNums: [5] },
  { type: 'link', key: 'form-patterns', label: 'Form Patterns',  to: '/showcase/patterns' },
  { type: 'link', key: 'gallery',       label: 'Layout Gallery', to: '/showcase/templates' },
  { type: 'link', key: 'weconnect',     label: 'WeConnect',      to: '/weconnect' },
  { key: 'developer',   label: 'Developer',   phaseNums: [8] },
]

const groupedPhases = computed(() =>
  GROUPS.map(g => ({
    ...g,
    phases: g.type === 'link' ? [] : phases.filter(p => (g as { phaseNums: readonly number[] }).phaseNums.includes(p.n)),
  }))
)

/* ── Expand/collapse state — persisted to localStorage ────────── */
const STORAGE_KEY = 'wx-sidebar-groups-v1'

function loadState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Record<string, boolean>
  } catch { /* ignore parse errors */ }
  return {}
}

function saveState(state: Record<string, boolean>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

const expandedGroups = ref<Record<string, boolean>>(loadState())

watch(expandedGroups, val => saveState(val), { deep: true })

/* Auto-expand the group that contains the currently active route */
watch(
  () => route.path,
  (currentPath) => {
    for (const g of groupedPhases.value) {
      if (!g.phases.length) continue
      const hasActive = g.phases.some(p => p.routes.some(r => r.path === currentPath))
      if (hasActive) expandedGroups.value[g.key] = true
    }
  },
  { immediate: true }
)

function toggleGroup(key: string) {
  expandedGroups.value[key] = !expandedGroups.value[key]
}

function isExpanded(key: string): boolean {
  return !!expandedGroups.value[key]
}
</script>

<template>
  <div class="dl" :class="{ 'dl--collapsed': collapsed }">
    <aside class="dl-sidebar">

      <!-- ── Brand header ───────────────────────────────────────── -->
      <div class="dl-head">
        <RouterLink to="/" class="dl-brand" :title="collapsed ? 'WemakeUI' : ''">
          <span class="dl-brand-icon">⚡</span>
          <span v-if="!collapsed" class="dl-brand-name">WemakeUI</span>
        </RouterLink>
        <button
          class="dl-toggle"
          :aria-label="collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'"
          @click="toggleSidebar"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              :d="collapsed ? 'M5 2.5L9 7L5 11.5' : 'M9 2.5L5 7L9 11.5'"
              stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- ── Nav ───────────────────────────────────────────────── -->
      <nav class="dl-nav" aria-label="Showcase navigation">

        <!-- Home / Sitemap -->
        <RouterLink
          to="/"
          class="dl-home"
          exact-active-class="dl-item--active"
          :title="collapsed ? 'Sitemap' : ''"
        >
          <svg
            class="dl-home-icon"
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span v-if="!collapsed" class="dl-item-label">Sitemap</span>
        </RouterLink>

        <!-- Groups -->
        <div v-for="g in groupedPhases" :key="g.key" class="dl-group">

          <!-- Link-type group: single RouterLink, no collapsible -->
          <template v-if="g.type === 'link'">
            <RouterLink
              v-if="!collapsed"
              :to="(g as any).to"
              class="dl-group-head dl-group-head--link"
              active-class="dl-group-head--active"
            >
              <span class="dl-group-label">{{ g.label }}</span>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" opacity=".5">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </RouterLink>
            <RouterLink v-else :to="(g as any).to" class="dl-group-dot" :title="g.label" />
          </template>

          <!-- Phase-type group: collapsible -->
          <template v-else>
          <button
            v-if="!collapsed"
            class="dl-group-head"
            :aria-expanded="isExpanded(g.key)"
            :aria-controls="`grp-${g.key}`"
            @click="toggleGroup(g.key)"
          >
            <span class="dl-group-label">{{ g.label }}</span>
            <svg
              class="dl-chevron"
              :class="{ 'dl-chevron--open': isExpanded(g.key) }"
              width="12" height="12" viewBox="0 0 12 12"
              fill="none" aria-hidden="true"
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor" stroke-width="1.4"
                stroke-linecap="round" stroke-linejoin="round"
              />
            </svg>
          </button>
          <div v-else class="dl-group-dot" :title="g.label" />

          <!-- Route list (visible when expanded and not collapsed) -->
          <div
            v-if="!collapsed && isExpanded(g.key)"
            :id="`grp-${g.key}`"
            class="dl-group-body"
          >
            <template v-for="p in g.phases" :key="p.n">
              <!--
                Phase sub-label: only when group has multiple phases
                AND this phase has ≥ 2 routes (avoids label above a single item).
              -->
              <div
                v-if="g.phases.length > 1 && p.routes.length >= 2"
                class="dl-sub-label"
              >{{ p.title }}</div>

              <template v-for="r in p.routes" :key="r.path">
                <RouterLink
                  :to="r.path"
                  class="dl-item"
                  exact-active-class="dl-item--active"
                  :title="r.label"
                >
                  <span class="dl-item-label">{{ getNavLabel(r) }}</span>
                </RouterLink>
                <!-- Anchor sub-items: shown only when route is exactly active -->
                <div
                  v-if="r.anchors?.length && route.path === r.path"
                  class="dl-anchors"
                >
                  <button
                    v-for="a in r.anchors"
                    :key="a.id"
                    class="dl-anchor"
                    @click="scrollToSection(a.id)"
                  >{{ a.label }}</button>
                </div>
              </template>
            </template>
          </div>
          </template><!-- end phase-type group -->

        </div>
      </nav>

      <!-- ── Footer ────────────────────────────────────────────── -->
      <div v-if="!collapsed" class="dl-foot">
        <RouterLink to="/legacy" class="dl-foot-link">↳ Showcase v0 (legacy)</RouterLink>
      </div>

    </aside>

    <main class="dl-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* ── Shell ───────────────────────────────────────────────── */
.dl {
  display: flex;
  min-height: 100vh;
  background: var(--wx-bg-sunken);
}

.dl-main {
  flex: 1;
  min-width: 0;
  overflow-x: hidden;
}

/* ── Sidebar ─────────────────────────────────────────────── */
.dl-sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--wx-bg-base);
  border-right: 1px solid var(--wx-border-subtle);
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow: hidden;
  transition: width var(--wx-d-normal) var(--wx-ease-standard);
  z-index: var(--wx-z-sticky);
}

.dl--collapsed .dl-sidebar { width: 56px; }

/* ── Brand header ────────────────────────────────────────── */
.dl-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--wx-space-3);
  height: 52px;
  border-bottom: 1px solid var(--wx-border-subtle);
  flex-shrink: 0;
}

.dl-brand {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  text-decoration: none;
  color: inherit;
  min-width: 0;
  flex: 1;
}

.dl-brand-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--wx-gradient-button);
  border-radius: var(--wx-radius-md);
  font-size: 13px;
  flex-shrink: 0;
}

.dl-brand-name {
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-content-primary);
  white-space: nowrap;
  overflow: hidden;
}

.dl-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  border-radius: var(--wx-radius-sm);
  color: var(--wx-content-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    color     var(--wx-d-fast) var(--wx-ease-standard);
}
.dl-toggle:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-content-primary);
}

/* ── Nav scroll container ────────────────────────────────── */
.dl-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--wx-space-3) var(--wx-space-2);
  display: flex;
  flex-direction: column;
}

.dl-nav::-webkit-scrollbar            { width: 3px; }
.dl-nav::-webkit-scrollbar-track      { background: transparent; }
.dl-nav::-webkit-scrollbar-thumb      { background: var(--wx-scrollbar-thumb); border-radius: var(--wx-radius-full); }
.dl-nav::-webkit-scrollbar-thumb:hover { background: var(--wx-scrollbar-thumb-hover); }

/* ── Home/Sitemap link ───────────────────────────────────── */
.dl-home {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-2) var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  text-decoration: none;
  color: var(--wx-content-secondary);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  font-family: var(--wx-font-primary);
  margin-bottom: var(--wx-space-2);
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    color     var(--wx-d-fast) var(--wx-ease-standard);
}
.dl-home:hover { background: var(--wx-hover-bg); color: var(--wx-content-primary); }
.dl-home.dl-item--active {
  background: var(--wx-info-bg);
  color: var(--wx-brand-primary);
  box-shadow: inset 3px 0 0 var(--wx-brand-primary);
}

.dl-home-icon { flex-shrink: 0; }

.dl--collapsed .dl-home {
  justify-content: center;
  padding: var(--wx-space-2);
  margin-bottom: var(--wx-space-1);
}

/* ── Groups ──────────────────────────────────────────────── */
.dl-group { display: flex; flex-direction: column; }

/* 24px breathing room between each group */
.dl-group + .dl-group { margin-top: var(--wx-space-5); }
.dl--collapsed .dl-group + .dl-group { margin-top: 0; }

.dl-group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--wx-space-1) var(--wx-space-3);
  margin-bottom: var(--wx-space-1);
  background: none;
  border: none;
  border-radius: var(--wx-radius-sm);
  cursor: pointer;
  font-family: var(--wx-font-primary);
  user-select: none;
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.dl-group-head:hover { background: var(--wx-hover-bg); }
.dl-group-head:hover .dl-group-label { color: var(--wx-content-secondary); }
.dl-group-head--link { text-decoration: none; }
.dl-group-head--link.dl-group-head--active .dl-group-label { color: var(--wx-brand-primary); }

.dl-group-label {
  font-size: 10px;
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--wx-content-muted);
  line-height: var(--wx-lh-tight);
  transition: color var(--wx-d-fast) var(--wx-ease-standard);
}

.dl-chevron {
  color: var(--wx-content-muted);
  opacity: 0.5;
  flex-shrink: 0;
  transform: rotate(-90deg);
  transition: transform var(--wx-d-fast) var(--wx-ease-standard);
}
.dl-chevron--open { transform: rotate(0deg); }

.dl-group-body {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--wx-space-1);
}

/* Collapsed: thin divider per group */
.dl-group-dot {
  height: 1px;
  background: var(--wx-border-subtle);
  margin: var(--wx-space-2) var(--wx-space-3);
}

/* ── Phase sub-label (inside multi-phase groups) ─────────── */
.dl-sub-label {
  font-size: 10px;
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--wx-content-muted);
  opacity: 0.5;
  padding: var(--wx-space-3) var(--wx-space-3) var(--wx-space-1);
  line-height: var(--wx-lh-tight);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: var(--wx-space-1);
}
.dl-sub-label:first-child { margin-top: 0; }

/* ── Route items ─────────────────────────────────────────── */
.dl-item {
  display: flex;
  align-items: center;
  padding: var(--wx-space-2) var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  text-decoration: none;
  color: var(--wx-content-secondary);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-regular);
  font-family: var(--wx-font-primary);
  line-height: var(--wx-lh-snug);
  min-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    color     var(--wx-d-fast) var(--wx-ease-standard);
}

/* hover: lighter bg, primary text */
.dl-item:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-content-primary);
}

/* active: clearly stronger than hover — brand bg + left indicator + weight bump */
.dl-item--active {
  background: var(--wx-info-bg);
  color: var(--wx-brand-primary);
  font-weight: var(--wx-fw-medium);
  box-shadow: inset 3px 0 0 var(--wx-brand-primary);
}

.dl-item-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Anchor sub-items ────────────────────────────────────── */
.dl-anchors {
  display: flex;
  flex-direction: column;
  padding-left: var(--wx-space-4);
  padding-bottom: var(--wx-space-1);
}

.dl-anchor {
  display: block;
  width: 100%;
  text-align: left;
  padding: var(--wx-space-1) var(--wx-space-3);
  font-size: var(--wx-fs-12);
  font-family: var(--wx-font-primary);
  color: var(--wx-content-muted);
  background: transparent;
  border: none;
  border-radius: var(--wx-radius-sm);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: var(--wx-lh-normal);
  transition:
    color     var(--wx-d-fast) var(--wx-ease-standard),
    background var(--wx-d-fast) var(--wx-ease-standard);
}
.dl-anchor:hover {
  color: var(--wx-content-primary);
  background: var(--wx-hover-bg);
}

/* ── Footer ──────────────────────────────────────────────── */
.dl-foot {
  padding: var(--wx-space-3) var(--wx-space-4);
  border-top: 1px solid var(--wx-border-subtle);
  flex-shrink: 0;
}

.dl-foot-link {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  text-decoration: none;
  transition: color var(--wx-d-fast) var(--wx-ease-standard);
}
.dl-foot-link:hover { color: var(--wx-content-link); }

/* ── Reduced motion ──────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .dl-sidebar,
  .dl-toggle,
  .dl-home,
  .dl-group-head,
  .dl-chevron,
  .dl-item,
  .dl-anchor,
  .dl-foot-link { transition: none; }
}

/* ── Mobile: force collapsed ─────────────────────────────── */
@media (max-width: 768px) {
  .dl-sidebar        { width: 56px; }
  .dl-toggle         { display: none; }
  .dl-brand-name     { display: none; }
  .dl-group-head     { display: none; }
  .dl-group-body     { display: none; }
  .dl-group-dot      { display: block; }
  .dl-foot           { display: none; }
  .dl-home           { justify-content: center; padding: var(--wx-space-2); }
  .dl-home .dl-item-label { display: none; }
}
</style>
