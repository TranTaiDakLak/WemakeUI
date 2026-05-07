<script setup lang="ts">
import { ref } from 'vue'
import SaasLayout from '../_layouts/SaasLayout.vue'
import CrudPage from '@/archetypes/crud/CrudPage.vue'
import { BaseButton, BaseBadge } from '@/components/common'
import StatusChip from '@/components/common/StatusChip.vue'
import { versionsConfig, VERSION_STATUS_MAP } from '@/configs/saas/versions.config'
import type { SoftwareVersion } from '@/configs/saas/versions.config'

const crudRef = ref<InstanceType<typeof CrudPage> | null>(null)
function asVer(row: unknown): SoftwareVersion { return row as unknown as SoftwareVersion }
</script>

<template>
  <SaasLayout
    current="versions"
    page-title="Phiên bản phần mềm"
    page-description="Quản lý lịch sử phát hành và changelog"
  >
    <template #actions>
      <BaseButton size="sm" @click="crudRef?.openAdd()">+ Phát hành phiên bản mới</BaseButton>
    </template>

    <CrudPage ref="crudRef" :config="versionsConfig">
      <!-- STT -->
      <template #cell-stt="{ index }">
        <span class="cell-stt">{{ index }}</span>
      </template>

      <!-- Version badge -->
      <template #cell-version="{ row }">
        <code class="cell-version">{{ asVer(row).version }}</code>
      </template>

      <!-- Trạng thái -->
      <template #cell-status="{ row }">
        <StatusChip :status="asVer(row).status" :map="VERSION_STATUS_MAP" />
      </template>

      <!-- Changelog ngắn -->
      <template #cell-changelog="{ row }">
        <span class="cell-changelog">{{ asVer(row).changelog }}</span>
      </template>

      <!-- Fix count -->
      <template #cell-fixCount="{ row }">
        <span v-if="asVer(row).fixCount > 0" class="count-pill count-pill--fix">{{ asVer(row).fixCount }}</span>
        <span v-else class="count-empty">—</span>
      </template>

      <!-- Update count -->
      <template #cell-updateCount="{ row }">
        <span v-if="asVer(row).updateCount > 0" class="count-pill count-pill--update">{{ asVer(row).updateCount }}</span>
        <span v-else class="count-empty">—</span>
      </template>

      <!-- New features count -->
      <template #cell-newCount="{ row }">
        <span v-if="asVer(row).newCount > 0" class="count-pill count-pill--new">{{ asVer(row).newCount }}</span>
        <span v-else class="count-empty">—</span>
      </template>

      <!-- Detail: version header -->
      <template #detail-header="{ item }">
        <div class="ver-header">
          <code class="ver-code">v{{ asVer(item).version }}</code>
          <StatusChip :status="asVer(item).status" :map="VERSION_STATUS_MAP" />
        </div>
        <div class="ver-stats">
          <div class="ver-stat">
            <span class="ver-stat__val ver-stat__val--fix">{{ asVer(item).fixCount }}</span>
            <span class="ver-stat__label">Bug fixes</span>
          </div>
          <div class="ver-stat">
            <span class="ver-stat__val ver-stat__val--update">{{ asVer(item).updateCount }}</span>
            <span class="ver-stat__label">Improvements</span>
          </div>
          <div class="ver-stat">
            <span class="ver-stat__val ver-stat__val--new">{{ asVer(item).newCount }}</span>
            <span class="ver-stat__label">Tính năng mới</span>
          </div>
        </div>
      </template>

      <!-- Detail: full changelog (pre-formatted) -->
      <template #detail-extra="{ item }">
        <div v-if="asVer(item).changelogFull" class="changelog-full">
          <p class="section-label">Changelog đầy đủ</p>
          <pre class="changelog-pre">{{ asVer(item).changelogFull }}</pre>
        </div>
      </template>
    </CrudPage>
  </SaasLayout>
</template>

<style scoped>
.cell-stt {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  font-variant-numeric: tabular-nums;
}

.cell-version {
  font-family: var(--wx-font-mono, monospace);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-brand-primary);
  background: color-mix(in srgb, var(--wx-brand-primary) 8%, transparent);
  padding: 3px 8px;
  border-radius: var(--wx-radius-sm);
}

.cell-changelog {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 320px;
}

/* ── Count pills ── */
.count-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--wx-radius-full);
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-bold);
}

.count-pill--fix    { background: rgba(239,68,68,0.12);    color: var(--wx-danger-solid); }
.count-pill--update { background: rgba(59,130,246,0.12);   color: var(--wx-brand-primary); }
.count-pill--new    { background: rgba(16,185,129,0.12);   color: var(--wx-success-solid); }
.count-empty { color: var(--wx-text-muted); font-size: var(--wx-fs-12); }

/* ── Detail header ── */
.ver-header {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-4);
}

.ver-code {
  font-family: var(--wx-font-mono, monospace);
  font-size: var(--wx-fs-22);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-brand-primary);
}

.ver-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-5);
  padding-bottom: var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.ver-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--wx-space-1);
  padding: var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
}

.ver-stat__val {
  font-size: var(--wx-fs-24);
  font-weight: var(--wx-fw-bold);
}
.ver-stat__val--fix    { color: var(--wx-danger-solid); }
.ver-stat__val--update { color: var(--wx-brand-primary); }
.ver-stat__val--new    { color: var(--wx-success-solid); }
.ver-stat__label { font-size: var(--wx-fs-11); color: var(--wx-text-muted); text-align: center; }

/* ── Full changelog ── */
.changelog-full {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-4);
}

.section-label {
  margin: 0;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
}

.changelog-pre {
  margin: 0;
  padding: var(--wx-space-4);
  font-family: var(--wx-font-mono, monospace);
  font-size: var(--wx-fs-12);
  line-height: 1.7;
  color: var(--wx-text-secondary);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
}
</style>
