<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { BaseButton, GroupBox } from '../../../components/common'
import {
  FilterBuilder, FilterChips,
  emptyGroup, applyFilter, serializeFilter, deserializeFilter, removeAtPath,
} from '../../../components/data'
import type { FilterGroup, FilterFieldDef } from '../../../components/data'
import { useToast } from '../../../composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const fields: FilterFieldDef[] = [
  { key: 'username', label: 'Tài khoản', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'role', label: 'Vai trò', type: 'enum', options: [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
    { value: 'guest', label: 'Guest' },
  ] },
  { key: 'amount', label: 'Số tiền', type: 'number' },
  { key: 'isVip', label: 'VIP', type: 'bool' },
  { key: 'createdAt', label: 'Ngày tạo', type: 'date' },
]

const fieldLabels = Object.fromEntries(fields.map((f) => [f.key, f.label]))

// Sample data
const data = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  username: `user${(i + 1).toString().padStart(3, '0')}`,
  email: `user${i + 1}@wemake.vn`,
  role: ['admin', 'editor', 'viewer', 'guest'][i % 4],
  amount: 100 + i * 17,
  isVip: i % 5 === 0,
  createdAt: `2026-${(((i % 12) + 1) + '').padStart(2, '0')}-${(((i % 28) + 1) + '').padStart(2, '0')}`,
}))

const filter = ref<FilterGroup>(emptyGroup('AND'))

// URL sync
const urlString = computed(() => serializeFilter(filter.value))

watch(urlString, (s) => {
  router.replace({ query: { ...route.query, f: s || undefined } })
})

onMounted(() => {
  const q = route.query.f
  if (typeof q === 'string') {
    const parsed = deserializeFilter(q)
    if (parsed) {
      filter.value = parsed
      showToast('info', 'Đã khôi phục filter từ URL')
    }
  }
})

const filtered = computed(() => applyFilter(filter.value, data, fields))

function reset() {
  filter.value = emptyGroup('AND')
}

function loadPreset() {
  filter.value = {
    op: 'AND',
    rules: [
      { field: 'role', op: 'in', value: ['admin', 'editor'] },
      {
        op: 'OR',
        rules: [
          { field: 'amount', op: '>', value: 500 },
          { field: 'isVip', op: 'isTrue', value: true },
        ],
      },
    ],
  }
  showToast('success', 'Đã load preset: admin/editor + (amount>500 hoặc VIP)')
}

function copyShareUrl() {
  const url = window.location.href
  navigator.clipboard.writeText(url)
  showToast('success', 'Đã copy URL share!')
}

function removeChip(path: number[]) {
  filter.value = removeAtPath(filter.value, path)
}
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI · FilterBuilder" subtitle="Phase 4 — data display" />
    <main class="main">
      <PageHeader title="FilterBuilder" description="Bộ lọc nâng cao AND/OR lồng nhau (max depth 3), serialize qua URL base64, share được qua link.">
      </PageHeader>

      <GroupBox title="Controls">
        <div class="row">
          <BaseButton size="sm" variant="secondary" @click="loadPreset">Load preset</BaseButton>
          <BaseButton size="sm" variant="ghost" @click="reset">Reset</BaseButton>
          <BaseButton size="sm" variant="primary" @click="copyShareUrl">Copy share URL</BaseButton>
          <span class="muted">URL hash: <code>{{ urlString.slice(0, 40) }}{{ urlString.length > 40 ? '...' : '' }}</code></span>
        </div>
      </GroupBox>

      <GroupBox title="Builder">
        <FilterBuilder v-model="filter" :fields="fields" />
      </GroupBox>

      <GroupBox title="FilterChips (đại diện rule đang dùng)">
        <FilterChips :group="filter" :field-labels="fieldLabels" @remove="removeChip" @clear="reset" />
        <span v-if="!filter.rules.length" class="muted">Chưa có chip nào — thêm điều kiện ở Builder phía trên.</span>
      </GroupBox>

      <GroupBox :title="`Kết quả (${filtered.length}/${data.length} dòng khớp)`">
        <div class="result-grid">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tài khoản</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Số tiền</th>
                <th>VIP</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in filtered.slice(0, 20)" :key="r.id">
                <td>{{ r.id }}</td>
                <td>{{ r.username }}</td>
                <td>{{ r.email }}</td>
                <td>{{ r.role }}</td>
                <td>{{ r.amount }}</td>
                <td>{{ r.isVip ? '✓' : '' }}</td>
                <td>{{ r.createdAt }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="filtered.length > 20" class="muted" style="margin-top: 8px; text-align: center;">
            Chỉ hiển thị 20 dòng đầu (tổng {{ filtered.length }})
          </p>
          <p v-if="filtered.length === 0" class="muted" style="text-align: center; padding: 20px;">
            Không có dòng nào khớp filter
          </p>
        </div>
      </GroupBox>
    </main>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; }
.main {
  flex: 1;
  padding: var(--space-lg);
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.row { display: flex; flex-wrap: wrap; gap: var(--space-sm); align-items: center; }
.muted { color: var(--wx-text-muted); font-size: 12px; font-family: var(--wx-font-primary); }
.muted code { font-family: var(--wx-font-mono); background: var(--wx-surface-sunken); padding: 1px 5px; border-radius: 3px; }

.result-grid {
  max-height: 400px;
  overflow: auto;
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
}

.result-grid table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.result-grid th {
  position: sticky;
  top: 0;
  background: var(--wx-surface-sunken);
  padding: 6px 10px;
  text-align: left;
  font-weight: 700;
  font-size: 11px;
  color: var(--wx-text-muted);
  border-bottom: 1px solid var(--wx-border-default);
}

.result-grid td {
  padding: 6px 10px;
  border-bottom: 1px solid var(--wx-border-subtle);
  color: var(--wx-text-primary);
}

.result-grid tr:hover td { background: var(--wx-hover-bg); }

</style>
