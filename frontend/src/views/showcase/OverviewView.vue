<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { phases } from './_phases-data'
import { totalVariants } from './layout-gallery/layoutRegistry'

const templateCount = totalVariants()
const totalRoutes = computed(() => phases.reduce((s, p) => s + p.routes.length, 0))
const totalDone   = computed(() => phases.filter(p => p.status === 'done').length)

/* animate in */
const visible = ref(false)
onMounted(() => { setTimeout(() => (visible.value = true), 60) })

const groups = [
  {
    label: 'Design System',
    icon: '🎨',
    color: 'violet',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    phaseNums: [0, 1, 2],
  },
  {
    label: 'Layout & Data',
    icon: '📐',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
    phaseNums: [3, 4, 4.5],
  },
  {
    label: 'Feedback, DX & Patterns',
    icon: '🔧',
    color: 'amber',
    gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
    phaseNums: [5, 8, 9, 9.5],
  },
  {
    label: 'Auth, Error & Dashboards',
    icon: '🖥️',
    color: 'emerald',
    gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    phaseNums: [6.1, 6.2, 6.3],
  },
  {
    label: 'App & Landing Pages',
    icon: '📄',
    color: 'rose',
    gradient: 'linear-gradient(135deg, #e11d48 0%, #fb7185 100%)',
    phaseNums: [7.1, 7.2, 7.3],
  },
]

function phasesForGroup(nums: number[]) {
  return phases.filter(p => nums.includes(p.n))
}

function routeCountForGroup(nums: number[]) {
  return phases.filter(p => nums.includes(p.n)).reduce((s, p) => s + p.routes.length, 0)
}
</script>

<template>
  <div class="overview-page" :class="{ 'is-visible': visible }">

    <!-- ── Hero ───────────────────────────────────────────────── -->
    <header class="hero">
      <div class="hero-bg-pattern" />
      <div class="hero-inner">
        <div class="hero-text">
          <p class="hero-eyebrow">Component Lab</p>
          <h1 class="hero-title">
            WemakeUI
            <span class="hero-accent">Showcase</span>
          </h1>
          <p class="hero-sub">
            Thư viện giao diện hoàn chỉnh — duyệt components, patterns và page templates.
            Click bất kỳ mục nào để xem demo trực tiếp.
          </p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ totalRoutes }}</span>
            <span class="stat-label">Demo Pages</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ phases.length }}</span>
            <span class="stat-label">Phases</span>
          </div>
          <div class="stat-card stat-card--success">
            <span class="stat-value">{{ totalDone }}</span>
            <span class="stat-label">Hoàn thành</span>
          </div>
          <RouterLink to="/showcase/templates" class="stat-card stat-card--brand">
            <span class="stat-value">{{ templateCount }}</span>
            <span class="stat-label">Templates →</span>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- ── Quick Nav ──────────────────────────────────────────── -->
    <nav class="quick-nav">
      <a
        v-for="group in groups"
        :key="group.label"
        :href="'#group-' + group.color"
        class="quick-nav-item"
        :style="{ '--accent': group.gradient }"
      >
        <span class="qn-icon">{{ group.icon }}</span>
        <span class="qn-label">{{ group.label }}</span>
        <span class="qn-count">{{ routeCountForGroup(group.phaseNums) }}</span>
      </a>
    </nav>

    <!-- ── Groups ─────────────────────────────────────────────── -->
    <div class="content">
      <section
        v-for="(group, gi) in groups"
        :id="'group-' + group.color"
        :key="group.label"
        class="group"
        :data-color="group.color"
        :style="{ '--delay': gi * 80 + 'ms' }"
      >
        <!-- group header -->
        <div class="group-head">
          <div class="group-icon-wrap" :style="{ background: group.gradient }">
            <span class="group-icon">{{ group.icon }}</span>
          </div>
          <div class="group-head-text">
            <h2 class="group-title">{{ group.label }}</h2>
            <span class="group-count">{{ routeCountForGroup(group.phaseNums) }} routes</span>
          </div>
          <div class="group-line" />
        </div>

        <!-- phases inside group -->
        <div class="phases-wrap">
          <div
            v-for="phase in phasesForGroup(group.phaseNums)"
            :key="phase.n"
            class="phase-block"
          >
            <div class="phase-meta">
              <span class="phase-chip" :style="{ background: group.gradient, color: '#fff' }">
                Phase {{ phase.n }}
              </span>
              <span class="phase-name">{{ phase.title }}</span>
              <span class="phase-badge" :data-status="phase.status">
                {{ phase.status === 'done' ? '✓' : '⋯' }}
              </span>
            </div>

            <div v-if="phase.layout === 'list'" class="route-list">
              <RouterLink
                v-for="r in phase.routes"
                :key="r.path"
                :to="r.path"
                class="route-list-item"
              >
                <span class="rli-dot" :style="{ background: group.gradient }" />
                <span class="rli-label">{{ r.navLabel ?? r.label.split(' — ')[0] }}</span>
                <span class="rli-desc">{{ r.desc }}</span>
                <span class="rli-arrow">→</span>
              </RouterLink>
            </div>
            <div v-else class="route-grid">
              <RouterLink
                v-for="r in phase.routes"
                :key="r.path"
                :to="r.path"
                class="route-card"
                :style="{ '--card-accent': group.gradient }"
              >
                <div class="rc-top">
                  <span class="rc-label">{{ r.navLabel ?? r.label.split(' — ')[0] }}</span>
                  <span class="rc-arrow">↗</span>
                </div>
                <span class="rc-path">{{ r.path }}</span>
                <span class="rc-desc">{{ r.desc }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </div>

  </div>
</template>

<style scoped>
/* ── Layout & Animation ──────────────────────────────────────── */
.overview-page {
  min-height: 100vh;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-primary);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.overview-page.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Hero ───────────────────────────────────────────────────── */
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg,
    var(--wx-brand-primary) 0%,
    color-mix(in srgb, var(--wx-brand-primary) 60%, #7c3aed) 50%,
    color-mix(in srgb, var(--wx-brand-primary) 40%, #4f46e5) 100%
  );
  padding: 56px 32px 48px;
}
.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 60%);
  pointer-events: none;
}
.hero-inner {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.hero-eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.5);
}
.hero-title {
  margin: 0;
  font-size: 40px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1px;
  line-height: 1.1;
}
.hero-accent {
  display: block;
  background: linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  margin: 12px 0 0;
  font-size: 15px;
  color: rgba(255,255,255,0.7);
  line-height: 1.7;
  max-width: 520px;
}

/* ── Stats Grid ─────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-width: 540px;
}
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}
.stat-card:hover {
  background: rgba(255,255,255,0.18);
  transform: translateY(-2px);
}
.stat-card--success {
  background: rgba(34,197,94,0.2);
  border-color: rgba(34,197,94,0.35);
}
.stat-card--brand {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.25);
  cursor: pointer;
}
.stat-card--brand:hover {
  background: rgba(255,255,255,0.28);
  border-color: rgba(255,255,255,0.4);
}
.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  color: rgba(255,255,255,0.65);
  font-weight: 500;
  text-align: center;
}

/* ── Quick Nav ──────────────────────────────────────────────── */
.quick-nav {
  max-width: 1100px;
  margin: -24px auto 0;
  padding: 0 24px;
  position: relative;
  z-index: 2;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.quick-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: 12px;
  text-decoration: none;
  color: var(--wx-text-primary);
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: all 0.2s ease;
}
.quick-nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: color-mix(in srgb, var(--wx-brand-primary) 40%, transparent);
}
.qn-icon { font-size: 16px; }
.qn-label { white-space: nowrap; }
.qn-count {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
}

/* ── Content ────────────────────────────────────────────────── */
.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 96px;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

/* ── Group ──────────────────────────────────────────────────── */
.group {
  animation: fadeUp 0.4s ease both;
  animation-delay: var(--delay, 0ms);
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.group-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.group-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.group-icon {
  font-size: 18px;
  line-height: 1;
  filter: grayscale(0.3) brightness(1.1);
}
.group-head-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.group-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--wx-text-primary);
}
.group-count {
  font-size: 12px;
  color: var(--wx-text-muted);
  font-weight: 500;
}
.group-line {
  flex: 1;
  height: 1px;
  background: var(--wx-border-default);
  opacity: 0.5;
}

/* group color accents */
.group[data-color="violet"] .group-title { color: #7c3aed; }
.group[data-color="blue"]   .group-title { color: var(--wx-brand-primary); }
.group[data-color="amber"]  .group-title { color: #d97706; }
.group[data-color="emerald"] .group-title { color: #059669; }
.group[data-color="rose"]   .group-title { color: #e11d48; }

/* ── Phases inside group ────────────────────────────────────── */
.phases-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.phase-block {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: 16px;
  padding: 24px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.phase-block:hover {
  border-color: color-mix(in srgb, var(--wx-brand-primary) 25%, var(--wx-border-default));
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
}

.phase-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.phase-chip {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  letter-spacing: 0.3px;
}
.phase-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--wx-text-primary);
}
.phase-badge {
  margin-left: auto;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.phase-badge[data-status="done"] {
  background: var(--wx-success-bg, #dcfce7);
  color: var(--wx-success-text, #15803d);
}
.phase-badge[data-status="pending"] {
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
}

/* ── Route grid ─────────────────────────────────────────────── */
.route-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}

.route-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.route-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--card-accent);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.route-card:hover {
  border-color: color-mix(in srgb, var(--wx-brand-primary) 40%, var(--wx-border-default));
  background: color-mix(in srgb, var(--wx-brand-primary) 3%, var(--wx-surface-base));
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  transform: translateY(-2px);
}
.route-card:hover::before {
  opacity: 1;
}

.rc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rc-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--wx-text-primary);
  line-height: 1.3;
}
.rc-arrow {
  font-size: 14px;
  color: var(--wx-text-muted);
  opacity: 0;
  transition: all 0.2s ease;
  transform: translate(-4px, 4px);
}
.route-card:hover .rc-arrow {
  opacity: 1;
  transform: translate(0, 0);
  color: var(--wx-brand-primary);
}
.rc-path {
  font-size: 11px;
  font-family: var(--wx-font-mono);
  color: var(--wx-brand-primary);
  opacity: 0.75;
}
.rc-desc {
  font-size: 12px;
  color: var(--wx-text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Route list (compact) ─────────────────────────────────────── */
.route-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.route-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: var(--wx-surface-base);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  cursor: pointer;
}
.route-list-item:hover {
  border-color: var(--wx-border-default);
  background: color-mix(in srgb, var(--wx-brand-primary) 4%, var(--wx-surface-base));
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.route-list-item:hover .rli-arrow {
  transform: translateX(3px);
  opacity: 1;
}

.rli-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.rli-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--wx-text-primary);
  white-space: nowrap;
}
.rli-desc {
  flex: 1;
  font-size: 12px;
  color: var(--wx-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rli-arrow {
  font-size: 14px;
  color: var(--wx-brand-primary);
  opacity: 0.4;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

/* ── Dark mode ──────────────────────────────────────────────── */
.wx-dark .stat-card {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.12);
}
.wx-dark .quick-nav-item {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.wx-dark .phase-block {
  background: var(--wx-surface-elevated);
}
.wx-dark .route-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

/* ── Responsive ─────────────────────────────────────────────── */
@media (max-width: 768px) {
  .hero { padding: 40px 20px 36px; }
  .hero-title { font-size: 28px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); max-width: 100%; }
  .quick-nav { margin-top: -16px; padding: 0 16px; }
  .quick-nav-item { padding: 8px 12px; font-size: 12px; }
  .content { padding: 32px 16px 64px; gap: 40px; }
  .route-grid { grid-template-columns: 1fr; }
  .phase-block { padding: 16px; }
  .rli-desc { display: none; }
}

@media (max-width: 480px) {
  .hero { padding: 32px 16px 28px; }
  .hero-title { font-size: 24px; }
  .hero-eyebrow { font-size: 11px; }
  .stat-value { font-size: 22px; }
  .quick-nav { gap: 6px; }
  .qn-label { font-size: 11px; }
}
</style>
