<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { phases } from './_phases-data'

const totalRoutes = computed(() => phases.reduce((s, p) => s + p.routes.length, 0))
const totalDone   = computed(() => phases.filter(p => p.status === 'done').length)

const groups = [
  {
    label: 'Design System',
    icon: '🎨',
    color: 'violet',
    phaseNums: [0, 1, 2],
  },
  {
    label: 'Layout & Data',
    icon: '📐',
    color: 'blue',
    phaseNums: [3, 4, 4.5],
  },
  {
    label: 'Feedback, DX & Patterns',
    icon: '🔧',
    color: 'amber',
    phaseNums: [5, 8, 9, 9.5],
  },
  {
    label: 'Auth, Error & Dashboards',
    icon: '🖥️',
    color: 'emerald',
    phaseNums: [6.1, 6.2, 6.3],
  },
  {
    label: 'App & Landing Pages',
    icon: '📄',
    color: 'rose',
    phaseNums: [7.1, 7.2, 7.3],
  },
]

function phasesForGroup(nums: number[]) {
  return phases.filter(p => nums.includes(p.n))
}
</script>

<template>
  <div class="overview-page">

    <!-- ── Hero ───────────────────────────────────────────────── -->
    <header class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1 class="hero-title">WemakeUI <span class="hero-accent">Tổng quan</span></h1>
          <p class="hero-sub">Demo lab — duyệt toàn bộ components và page templates. Click bất kỳ route nào để xem ngay.</p>
        </div>
        <div class="stats-row">
          <div class="stat-pill">
            <span class="stat-num">{{ totalRoutes }}</span>
            <span class="stat-label">routes</span>
          </div>
          <div class="stat-pill">
            <span class="stat-num">{{ phases.length }}</span>
            <span class="stat-label">phases</span>
          </div>
          <div class="stat-pill stat-pill--success">
            <span class="stat-num">{{ totalDone }}</span>
            <span class="stat-label">hoàn thành</span>
          </div>
          <div class="stat-pill stat-pill--brand">
            <span class="stat-num">120+</span>
            <span class="stat-label">templates</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ── Groups ─────────────────────────────────────────────── -->
    <div class="content">
      <section
        v-for="group in groups"
        :key="group.label"
        class="group"
        :data-color="group.color"
      >
        <!-- group header -->
        <div class="group-head">
          <span class="group-icon">{{ group.icon }}</span>
          <h2 class="group-title">{{ group.label }}</h2>
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
              <span class="phase-chip">Phase {{ phase.n }}</span>
              <span class="phase-name">{{ phase.title }}</span>
              <span class="phase-status" :data-status="phase.status">
                {{ phase.status === 'done' ? '✓ Done' : '⋯ Pending' }}
              </span>
            </div>

            <div class="route-grid">
              <RouterLink
                v-for="r in phase.routes"
                :key="r.path"
                :to="r.path"
                class="route-card"
              >
                <span class="rc-label">{{ r.navLabel ?? r.label.split(' — ')[0] }}</span>
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
/* ── Layout ──────────────────────────────────────────────────── */
.overview-page {
  min-height: 100vh;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-primary);
}

/* ── Hero ───────────────────────────────────────────────────── */
.hero {
  background: linear-gradient(135deg,
    var(--wx-brand-primary) 0%,
    color-mix(in srgb, var(--wx-brand-primary) 70%, #7c3aed) 100%
  );
  padding: 48px 32px 40px;
}
.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.hero-title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}
.hero-accent { opacity: 0.75; }
.hero-sub {
  margin: 6px 0 0;
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  max-width: 540px;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.stat-pill {
  display: flex;
  align-items: baseline;
  gap: 6px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  padding: 6px 16px;
  backdrop-filter: blur(8px);
}
.stat-pill--success { background: rgba(34,197,94,0.25); border-color: rgba(34,197,94,0.4); }
.stat-pill--brand   { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.35); }
.stat-num {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}
.stat-label {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  font-weight: 500;
}

/* ── Content ────────────────────────────────────────────────── */
.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* ── Group ──────────────────────────────────────────────────── */
.group-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.group-icon {
  font-size: 20px;
  line-height: 1;
}
.group-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--wx-text-primary);
  white-space: nowrap;
}
.group-line {
  flex: 1;
  height: 1px;
  background: var(--wx-border-default);
  opacity: 0.6;
}

/* group color accents */
.group[data-color="violet"] .group-title { color: #7c3aed; }
.group[data-color="blue"]   .group-title { color: var(--wx-brand-primary); }
.group[data-color="amber"]  .group-title { color: #d97706; }
.group[data-color="emerald"].group-title { color: #059669; }
.group[data-color="rose"]   .group-title { color: #e11d48; }

/* ── Phases inside group ────────────────────────────────────── */
.phases-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.phase-block {
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  padding: 20px 20px 16px;
}

.phase-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.phase-chip {
  font-size: 11px;
  font-family: var(--wx-font-mono);
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--wx-surface-sunken);
  color: var(--wx-text-secondary);
  border: 1px solid var(--wx-border-default);
}
.phase-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--wx-text-primary);
}
.phase-status {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
}
.phase-status[data-status="done"] {
  background: var(--wx-success-bg, #dcfce7);
  color: var(--wx-success-text, #15803d);
}
.phase-status[data-status="pending"] {
  background: var(--wx-surface-sunken);
  color: var(--wx-text-muted);
}

/* ── Route grid ─────────────────────────────────────────────── */
.route-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 8px;
}

.route-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: var(--wx-radius-lg);
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  text-decoration: none;
  color: inherit;
  transition: all 0.15s ease;
  cursor: pointer;
}
.route-card:hover {
  border-color: var(--wx-brand-primary);
  background: color-mix(in srgb, var(--wx-brand-primary) 5%, var(--wx-surface-base));
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transform: translateY(-1px);
}

.rc-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--wx-text-primary);
  line-height: 1.3;
}
.rc-path {
  font-size: 11px;
  font-family: var(--wx-font-mono);
  color: var(--wx-brand-primary);
  opacity: 0.8;
}
.rc-desc {
  font-size: 11px;
  color: var(--wx-text-muted);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Dark mode ──────────────────────────────────────────────── */
.wx-dark .phase-block {
  background: var(--wx-surface-elevated);
  border-color: var(--wx-border-default);
}
.wx-dark .route-card {
  background: var(--wx-surface-base);
}
.wx-dark .group[data-color="violet"] .group-line,
.wx-dark .group[data-color="blue"]   .group-line,
.wx-dark .group[data-color="amber"]  .group-line,
.wx-dark .group[data-color="emerald"].group-line,
.wx-dark .group[data-color="rose"]   .group-line {
  opacity: 0.3;
}

/* ── Responsive ─────────────────────────────────────────────── */
@media (max-width: 640px) {
  .hero { padding: 32px 16px 28px; }
  .content { padding: 24px 12px 60px; }
  .route-grid { grid-template-columns: 1fr; }
  .hero-title { font-size: 24px; }
  .phase-block { padding: 16px 14px 12px; }
}
</style>
