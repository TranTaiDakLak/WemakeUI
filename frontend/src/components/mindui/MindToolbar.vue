<script setup lang="ts">
/**
 * MindToolbar — thanh công cụ của màn bảng dữ liệu (workspace toolbar).
 *
 * Bố cục lấy từ khối "capsule tab + bộ lọc" của AccountManager (MindAds):
 *   [capsule tab có viên trượt] [ô tìm kiếm có icon] [slot filters] ········ [slot actions]
 *
 *   <MindToolbar v-model="status" :tabs="tabs" v-model:search="q" search-placeholder="Tìm tên…">
 *     <template #filters><BaseSelectMenu … /></template>
 *     <template #actions><BaseButton … /></template>
 *   </MindToolbar>
 *
 * Mock/giao diện thuần — không gọi API. Tab + search dùng v-model.
 */
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { MindToolbarTab } from './mind-types'

const props = withDefaults(defineProps<{
  tabs?: MindToolbarTab[]
  searchPlaceholder?: string
  /** ẩn ô tìm kiếm */
  hideSearch?: boolean
  /** aria-label cho nhóm tab */
  tabsLabel?: string
}>(), {
  tabs: () => [],
  searchPlaceholder: 'Tìm kiếm…',
  hideSearch: false,
  tabsLabel: 'Lọc nhanh',
})

const tab = defineModel<string>({ default: '' })
const search = defineModel<string>('search', { default: '' })

/* ── viên trượt dưới tab đang chọn ── */
const tabEls = ref<HTMLElement[]>([])
const pill = reactive({ left: 0, width: 0, ready: false })

function measure() {
  const idx = props.tabs.findIndex((t) => t.value === tab.value)
  const el = tabEls.value[idx]
  if (!el) {
    pill.ready = false
    return
  }
  pill.left = el.offsetLeft
  pill.width = el.offsetWidth
  pill.ready = true
}

let ro: ResizeObserver | null = null
const groupRef = ref<HTMLElement | null>(null)
onMounted(() => {
  void nextTick(measure)
  if (typeof ResizeObserver !== 'undefined' && groupRef.value) {
    ro = new ResizeObserver(() => measure())
    ro.observe(groupRef.value)
  }
})
onBeforeUnmount(() => ro?.disconnect())
watch(() => [tab.value, props.tabs], () => { void nextTick(measure) }, { deep: true })

function setTabRef(el: unknown, i: number) {
  if (el) tabEls.value[i] = el as HTMLElement
}
</script>

<template>
  <div class="mt" role="toolbar">
    <div v-if="tabs.length" ref="groupRef" class="mt__tabs" role="tablist" :aria-label="tabsLabel">
      <span
        v-if="pill.ready"
        class="mt__pill"
        :style="{ transform: `translateX(${pill.left}px)`, width: `${pill.width}px` }"
        aria-hidden="true"
      />
      <button
        v-for="(t, i) in tabs"
        :key="t.value"
        :ref="(el) => setTabRef(el, i)"
        type="button"
        role="tab"
        class="mt__tab"
        :class="{ 'is-active': tab === t.value }"
        :aria-selected="tab === t.value"
        @click="tab = t.value"
      >
        {{ t.label }}
        <span v-if="t.count !== undefined" class="mt__count">{{ t.count }}</span>
      </button>
    </div>

    <label v-if="!hideSearch" class="mt__search">
      <svg class="mt__search-ic" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input
        v-model="search"
        class="mt__input"
        type="search"
        :placeholder="searchPlaceholder"
        :aria-label="searchPlaceholder"
        autocomplete="off"
      />
      <button v-if="search" type="button" class="mt__clear" aria-label="Xoá tìm kiếm" @click.prevent="search = ''">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </label>

    <div v-if="$slots.filters" class="mt__filters"><slot name="filters" /></div>

    <div v-if="$slots.actions" class="mt__actions"><slot name="actions" /></div>
  </div>
</template>

<style scoped>
.mt {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--wx-space-3);
  padding: var(--wx-space-2) var(--wx-space-3);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-base);
  box-shadow: var(--wx-shadow-sm);
}

/* capsule tab + viên trượt */
.mt__tabs {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 10px;
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
}
.mt__pill {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  border-radius: 7px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  box-shadow: var(--wx-shadow-sm);
  transition: transform var(--wx-d-normal) var(--wx-ease-standard), width var(--wx-d-normal) var(--wx-ease-standard);
  pointer-events: none;
}
.mt__tab {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--wx-text-muted);
  font: inherit;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-bold);
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--wx-d-fast) var(--wx-ease-standard);
}
.mt__tab:hover { color: var(--wx-text-primary); }
.mt__tab.is-active { color: var(--wx-brand-primary); }
.mt__tab:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: -2px; }
.mt__count {
  min-width: 18px;
  padding: 0 5px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  color: var(--wx-text-secondary);
  font-size: 10.5px;
  line-height: 16px;
  text-align: center;
}
.mt__tab.is-active .mt__count { background: var(--wx-shell-tone-brand-bg); border-color: var(--wx-shell-tone-brand-bd); color: var(--wx-shell-tone-brand-fg); }

/* search */
.mt__search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 220px;
  max-width: 320px;
  min-width: 180px;
}
.mt__search-ic { position: absolute; left: 11px; color: var(--wx-text-muted); pointer-events: none; transition: color var(--wx-d-fast) var(--wx-ease-standard); }
.mt__search:focus-within .mt__search-ic { color: var(--wx-brand-primary); }
.mt__input {
  width: 100%;
  height: 34px;
  padding: 0 30px 0 34px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-shell-field-bg);
  color: var(--wx-text-primary);
  font: inherit;
  font-size: var(--wx-fs-13);
  outline: none;
  transition: border-color var(--wx-d-fast) var(--wx-ease-standard), box-shadow var(--wx-d-fast) var(--wx-ease-standard), background var(--wx-d-fast) var(--wx-ease-standard);
}
.mt__input::placeholder { color: var(--wx-text-muted); }
.mt__input::-webkit-search-cancel-button { display: none; }
.mt__input:hover:not(:focus) { border-color: var(--wx-text-muted); }
.mt__input:focus-visible { background: var(--wx-surface-base); border-color: var(--wx-brand-primary); box-shadow: var(--wx-shadow-focus); }
.mt__clear {
  position: absolute;
  right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--wx-text-muted);
  cursor: pointer;
}
.mt__clear:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }

.mt__filters { display: inline-flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; }
.mt__actions { display: inline-flex; align-items: center; gap: var(--wx-space-2); margin-left: auto; flex-wrap: wrap; }

@media (max-width: 720px) {
  .mt__search { max-width: none; flex-basis: 100%; order: 3; }
  .mt__actions { margin-left: 0; }
}
@media (prefers-reduced-motion: reduce) { .mt__pill { transition: none; } }
</style>
