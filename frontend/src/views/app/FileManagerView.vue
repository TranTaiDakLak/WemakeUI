<script setup lang="ts">
import { ref, computed } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseInput, BaseTag, BaseBadge } from '../../components/common'

const view = ref<'grid' | 'list'>('grid')
const search = ref('')
const currentPath = ref(['Tài liệu của tôi'])

const ITEMS = [
  { id: 1, name: 'Thiết kế Phase 7', type: 'folder', size: null, modified: '2026-05-04', icon: '📁', shared: true },
  { id: 2, name: 'WemakeUI spec.pdf', type: 'pdf', size: '2.4 MB', modified: '2026-05-03', icon: '📄', shared: false },
  { id: 3, name: 'components', type: 'folder', size: null, modified: '2026-05-02', icon: '📁', shared: true },
  { id: 4, name: 'Screenshot 2026-05-01.png', type: 'image', size: '1.2 MB', modified: '2026-05-01', icon: '🖼️', shared: false },
  { id: 5, name: 'budget-Q2-2026.xlsx', type: 'excel', size: '440 KB', modified: '2026-04-29', icon: '📊', shared: false },
  { id: 6, name: 'README.md', type: 'text', size: '12 KB', modified: '2026-04-28', icon: '📝', shared: true },
  { id: 7, name: 'demo-video.mp4', type: 'video', size: '48 MB', modified: '2026-04-25', icon: '🎥', shared: true },
  { id: 8, name: 'backup-2026-04.zip', type: 'archive', size: '240 MB', modified: '2026-04-20', icon: '🗜️', shared: false },
]

const filtered = computed(() =>
  ITEMS.filter(i => !search.value || i.name.toLowerCase().includes(search.value.toLowerCase()))
)

const selected = ref<number[]>([])
function toggleSelect(id: number) {
  const idx = selected.value.indexOf(id)
  if (idx >= 0) selected.value.splice(idx, 1)
  else selected.value.push(id)
}
</script>

<template>
  <AppPageLayout section="app" current="tệp quản lý" page-title="Quản lý tệp" page-description="Lưu trữ và chia sẻ tài liệu của bạn">
    <template #actions>
      <BaseButton size="sm" variant="ghost">+ Thư mục mới</BaseButton>
      <BaseButton size="sm" variant="primary">⬆ Tải lên</BaseButton>
    </template>

    <!-- toolbar -->
    <div class="fm-toolbar">
      <nav class="breadcrumb">
        <span v-for="(seg, i) in currentPath" :key="i" class="bc-seg">
          <span class="bc-item">{{ seg }}</span>
          <span v-if="i < currentPath.length - 1" class="bc-sep"> / </span>
        </span>
      </nav>
      <div class="toolbar-right">
        <BaseInput v-model="search" placeholder="Tìm tệp..." size="sm" clearable style="width: 200px;" />
        <div class="view-toggle">
          <button class="vt-btn" :class="{ active: view === 'grid' }" aria-label="Lưới" @click="view = 'grid'">⊞</button>
          <button class="vt-btn" :class="{ active: view === 'list' }" aria-label="Danh sách" @click="view = 'list'">☰</button>
        </div>
      </div>
    </div>

    <!-- bulk bar -->
    <div v-if="selected.length > 0" class="bulk-bar">
      <span>{{ selected.length }} mục đã chọn</span>
      <BaseButton size="sm" variant="ghost">Tải xuống</BaseButton>
      <BaseButton size="sm" variant="ghost">Chia sẻ</BaseButton>
      <BaseButton size="sm" variant="danger">Xoá</BaseButton>
      <button class="clear-btn" @click="selected = []">✕</button>
    </div>

    <!-- grid view -->
    <div v-if="view === 'grid'" class="file-grid">
      <div
        v-for="item in filtered" :key="item.id"
        class="file-card" :class="{ selected: selected.includes(item.id) }"
        @click="toggleSelect(item.id)"
      >
        <span class="file-icon">{{ item.icon }}</span>
        <span class="file-name">{{ item.name }}</span>
        <div class="file-meta">
          <span class="file-size">{{ item.size || '—' }}</span>
          <BaseBadge v-if="item.shared" text="chia sẻ" size="sm" variant="info" />
        </div>
      </div>
    </div>

    <!-- list view -->
    <div v-else class="file-list">
      <table class="ftable">
        <thead><tr><th></th><th>Tên</th><th>Kích thước</th><th>Chỉnh sửa</th><th>Chia sẻ</th><th></th></tr></thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id" :class="{ selected: selected.includes(item.id) }" @click="toggleSelect(item.id)">
            <td><input type="checkbox" :checked="selected.includes(item.id)" @click.stop="toggleSelect(item.id)" /></td>
            <td class="fname"><span>{{ item.icon }}</span> {{ item.name }}</td>
            <td>{{ item.size || '—' }}</td>
            <td>{{ item.modified }}</td>
            <td><BaseBadge v-if="item.shared" text="chia sẻ" size="sm" variant="info" /></td>
            <td><BaseButton size="sm" variant="ghost" @click.stop>⋮</BaseButton></td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.fm-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-4); flex-wrap: wrap; }
.breadcrumb { display: flex; align-items: center; }
.bc-item { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); color: var(--wx-content-primary); }
.bc-sep { color: var(--wx-content-muted); }
.toolbar-right { display: flex; align-items: center; gap: var(--wx-space-3); }
.view-toggle { display: flex; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); overflow: hidden; }
.vt-btn { border: none; background: transparent; padding: var(--wx-space-1) var(--wx-space-2); cursor: pointer; font-size: 16px; color: var(--wx-content-muted); }
.vt-btn.active { background: var(--wx-brand-50); color: var(--wx-brand-600); }

.bulk-bar { display: flex; align-items: center; gap: var(--wx-space-3); padding: var(--wx-space-3) var(--wx-space-4); background: var(--wx-brand-50); border: 1px solid var(--wx-brand-200); border-radius: var(--wx-radius-md); font-size: var(--wx-fs-14); }
.clear-btn { border: none; background: none; cursor: pointer; color: var(--wx-content-muted); margin-left: auto; }

.file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--wx-space-3); }
.file-card { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-2); padding: var(--wx-space-4) var(--wx-space-3); background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); cursor: pointer; transition: all var(--wx-d-micro); text-align: center; }
.file-card:hover { border-color: var(--wx-brand-300); background: var(--wx-hover-bg); }
.file-card.selected { border-color: var(--wx-brand-500); background: var(--wx-brand-50); }
.file-icon { font-size: 32px; }
.file-name { font-size: var(--wx-fs-13); color: var(--wx-content-primary); font-weight: var(--wx-fw-medium); word-break: break-word; }
.file-meta { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-1); }
.file-size { font-size: var(--wx-fs-11); color: var(--wx-content-muted); }

.file-list { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; }
.ftable { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-14); }
.ftable th { padding: var(--wx-space-3) var(--wx-space-4); text-align: left; font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-semibold); background: var(--wx-bg-sunken); border-bottom: 1px solid var(--wx-border-default); }
.ftable td { padding: var(--wx-space-3) var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.ftable tbody tr:last-child td { border-bottom: none; }
.ftable tbody tr:hover td { background: var(--wx-hover-bg); }
.ftable tbody tr.selected td { background: var(--wx-brand-50); }
.fname { display: flex; align-items: center; gap: var(--wx-space-2); font-weight: var(--wx-fw-medium); }
</style>
