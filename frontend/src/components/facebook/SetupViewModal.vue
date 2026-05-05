<script setup lang="ts">
import { ref, watch } from 'vue'
import { BaseModal } from '../common'
import type { ColumnConfig } from '../../types/ui'
import type { ColumnGroup } from '../../types/settings'
import { COLUMN_GROUP_LABELS } from '../../types/ui'

const props = defineProps<{
  show: boolean
  columns: ColumnConfig[]
}>()

const emit = defineEmits<{
  close: []
  save: [columns: ColumnConfig[]]
}>()

const draftColumns = ref<ColumnConfig[]>([])

watch(() => props.show, (val) => {
  if (val) {
    draftColumns.value = props.columns.map(c => ({ ...c }))
  }
})

const groups: ColumnGroup[] = ['account', 'info', 'ads', 'action']

function draftGroupCols(group: string) {
  return draftColumns.value.filter(c => c.group === group)
}

function handleSave() {
  emit('save', draftColumns.value.map(c => ({ ...c })))
}

/* Right-click context menu */
const ctxMenu = ref({ show: false, x: 0, y: 0, group: '' })

function showCtxMenu(e: MouseEvent, group: string) {
  e.preventDefault()
  ctxMenu.value = { show: true, x: e.clientX, y: e.clientY, group }
}
function hideCtxMenu() {
  ctxMenu.value.show = false
}
function selectAllGroup(group: string, val: boolean) {
  draftColumns.value.filter(c => c.group === group).forEach(c => c.visible = val)
  hideCtxMenu()
}

/* Global select/deselect all */
function selectAllGlobal(val: boolean) {
  draftColumns.value.forEach(c => c.visible = val)
}
</script>

<template>
  <BaseModal :show="show" title="▦ Cấu hình hiển thị" size="xl" show-save @close="$emit('close')" @save="handleSave">
    <div class="setup-view-grid" @click="hideCtxMenu">
      <div v-for="g in groups" :key="g" class="gbox" @contextmenu="showCtxMenu($event, g)">
        <div class="gbox-header">
          <span>{{ COLUMN_GROUP_LABELS[g] }}</span>
        </div>
        <div class="gbox-body gbox-body--cols">
          <label class="col-toggle" v-for="col in draftGroupCols(g)" :key="col.key">
            <input type="checkbox" v-model="col.visible" /><span>{{ col.label }}</span>
          </label>
        </div>
      </div>
    </div>
    <!-- Right-click context menu -->
    <teleport to="body">
      <div v-if="ctxMenu.show" class="ctx-menu" :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }" @click.stop>
        <button class="ctx-item" @click="selectAllGroup(ctxMenu.group, true)">✔ Chọn tất cả</button>
        <button class="ctx-item ctx-item--red" @click="selectAllGroup(ctxMenu.group, false)">✖ Bỏ chọn tất cả</button>
      </div>
    </teleport>
  </BaseModal>
</template>

<style scoped>
/* ─── Global Actions ─── */
.global-actions { display: flex; gap: 8px; margin-bottom: 12px; }
.btn-action { padding: 5px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: #fff; font-size: 12px; cursor: pointer; font-family: var(--font-family); transition: all 0.15s; }
.btn-action:hover { background: var(--hover-bg); }
.btn-action--select { color: var(--brand-primary); border-color: var(--brand-primary); }
.btn-action--select:hover { background: rgba(90,171,255,0.08); }
.btn-action--deselect { color: var(--error-color); border-color: var(--error-color); }
.btn-action--deselect:hover { background: rgba(239,68,68,0.08); }

.setup-view-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; }
.gbox { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; }
.gbox-header { padding: 10px 16px; font-size: 13px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; }
.gbox-header-actions { display: flex; gap: 4px; }
.btn-grp { width: 22px; height: 22px; border: 1px solid var(--border-color); border-radius: 3px; background: #fff; font-size: 11px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: var(--brand-primary); transition: all 0.15s; }
.btn-grp:hover { background: rgba(90,171,255,0.1); border-color: var(--brand-primary); }
.btn-grp--red { color: var(--error-color); }
.btn-grp--red:hover { background: rgba(239,68,68,0.08); border-color: var(--error-color); }
.gbox-body--cols { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 4px 16px; padding: 12px 16px; }
.col-toggle { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; white-space: nowrap; padding: 3px 0; }
.col-toggle input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; flex-shrink: 0; }
.ctx-menu { position: fixed; z-index: 9999; background: #fff; border: 1px solid #ddd; border-radius: var(--radius-sm); box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 4px 0; min-width: 180px; }
.ctx-item { display: block; width: 100%; padding: 8px 16px; border: none; background: none; text-align: left; font-size: 13px; cursor: pointer; color: #333; }
.ctx-item:hover { background: var(--hover-bg); }
.ctx-item--red:hover { background: rgba(239,68,68,0.08); color: var(--error-color); }
</style>
