<script setup lang="ts">
/**
 * AppSidebar — sidebar nav cho desktop shell.
 * Phase 3 — layout shells.
 *
 * defaults phần II:
 *  - width: 240px
 *  - collapsedWidth: 64px
 *  - collapsible: true
 *  - defaultCollapsed: false (auto trên mobile)
 *
 * anatomy: root → header → sections → footer (slots)
 *   sections render qua prop `items` hoặc qua slot mặc định (hoàn toàn tự render).
 */
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import type { SidebarItem, SidebarSection } from './sidebar-types'

const props = withDefaults(defineProps<{
  /** danh sách section */
  sections?: SidebarSection[]
  /** tên thương hiệu (slot brand override) */
  brand?: string
  /** logo gradient — hiện ở header */
  logoGradient?: boolean
  /** URL ảnh logo — nếu bỏ trống, dùng chữ cái đầu của `brand` làm mark mặc định */
  logoSrc?: string
  /** width khi mở rộng (px) */
  width?: number
  /** width khi collapsed (px) */
  collapsedWidth?: number
  /** cho phép collapse */
  collapsible?: boolean
  /** id item active */
  activeId?: string | null
  /** auto collapse trên mobile (≤768px) */
  autoCollapseOnMobile?: boolean
  /** position của icon collapse button */
  collapsePosition?: 'header' | 'footer'
  /** controlled collapsed (v-model:collapsed) */
  collapsed?: boolean
}>(), {
  sections: () => [],
  brand: 'WemakeUI',
  logoGradient: true,
  width: 240,
  collapsedWidth: 64,
  collapsible: true,
  activeId: null,
  autoCollapseOnMobile: true,
  collapsePosition: 'footer',
  collapsed: false,
})

const emit = defineEmits<{
  'select': [item: SidebarItem]
  'update:collapsed': [value: boolean]
}>()

const router = useRouter()

const internalCollapsed = ref(props.collapsed)
const collapsed = computed<boolean>({
  get: () => internalCollapsed.value,
  set: (v) => {
    internalCollapsed.value = v
    emit('update:collapsed', v)
  },
})
watch(() => props.collapsed, (v) => { internalCollapsed.value = v })
const expandedGroups = ref<Set<string>>(new Set())

const cssVars = computed(() => ({
  '--wx-sidebar-width': `${props.width}px`,
  '--wx-sidebar-collapsed-width': `${props.collapsedWidth}px`,
}))

/** auto collapse trên mobile */
let mql: MediaQueryList | null = null
const userToggled = ref(false)

function handleMobile(e: MediaQueryListEvent | MediaQueryList) {
  if (!props.autoCollapseOnMobile) return
  if (userToggled.value) return
  internalCollapsed.value = e.matches
}

onMounted(() => {
  if (typeof window === 'undefined') return
  mql = window.matchMedia('(max-width: 768px)')
  handleMobile(mql)
  mql.addEventListener?.('change', handleMobile)
})
onBeforeUnmount(() => {
  mql?.removeEventListener?.('change', handleMobile)
})

function toggleCollapse() {
  userToggled.value = true
  collapsed.value = !collapsed.value
}

function isActive(item: SidebarItem): boolean {
  if (!props.activeId) return false
  if (item.id === props.activeId) return true
  return item.children?.some((c) => c.id === props.activeId) ?? false
}

function isGroupExpanded(item: SidebarItem): boolean {
  // auto expand nếu có child active
  if (item.children?.some((c) => c.id === props.activeId)) return true
  return expandedGroups.value.has(item.id)
}

function toggleGroup(item: SidebarItem) {
  if (collapsed.value) {
    // collapsed → expand sidebar trước, rồi mở group
    collapsed.value = false
    userToggled.value = true
  }
  if (expandedGroups.value.has(item.id)) {
    expandedGroups.value.delete(item.id)
  } else {
    expandedGroups.value.add(item.id)
  }
  expandedGroups.value = new Set(expandedGroups.value)
}

function onSelect(item: SidebarItem) {
  if (item.disabled) return
  emit('select', item)
}

function onNavigate(item: SidebarItem, e: MouseEvent) {
  if (item.disabled) {
    e.preventDefault()
    return
  }

  if (item.href?.startsWith('#/')) {
    e.preventDefault()
    const target = item.href.slice(1)
    if (router.currentRoute.value.fullPath !== target) {
      void router.push(target)
    }
  }

  emit('select', item)
}

watch(() => props.activeId, () => {
  // khi đổi activeId, đảm bảo group cha của nó đang expanded
  for (const sec of props.sections) {
    for (const item of sec.items) {
      if (item.children?.some((c) => c.id === props.activeId)) {
        expandedGroups.value.add(item.id)
        expandedGroups.value = new Set(expandedGroups.value)
      }
    }
  }
})
</script>

<template>
  <aside
    class="wx-sidebar"
    :class="{ 'wx-sidebar--collapsed': collapsed }"
    :style="cssVars"
    :aria-expanded="!collapsed"
    data-part="root"
  >
    <header class="wx-sidebar__header" data-part="header">
      <slot name="brand">
        <div class="wx-sidebar__brand">
          <img
            v-if="logoSrc"
            :src="logoSrc"
            :alt="brand"
            class="wx-sidebar__logo wx-sidebar__logo--img"
          />
          <div
            v-else
            class="wx-sidebar__logo"
            :class="{ 'wx-sidebar__logo--gradient': logoGradient }"
            aria-hidden="true"
          >
            <span>W</span>
          </div>
          <span v-if="!collapsed" class="wx-sidebar__brand-name">{{ brand }}</span>
        </div>
      </slot>
      <button
        v-if="collapsible && collapsePosition === 'header'"
        type="button"
        class="wx-sidebar__collapse"
        :aria-label="collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'"
        @click="toggleCollapse"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline :points="collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'" />
        </svg>
      </button>
    </header>

    <nav class="wx-sidebar__nav" data-part="sections" aria-label="Điều hướng chính">
      <slot>
        <div
          v-for="(section, sIdx) in sections"
          :key="sIdx"
          class="wx-sidebar__section"
        >
          <h4
            v-if="section.label && !collapsed"
            class="wx-sidebar__section-label"
          >
            {{ section.label }}
          </h4>

          <ul class="wx-sidebar__list" role="list">
            <template v-for="item in section.items" :key="item.id">
              <li class="wx-sidebar__item">
                <button
                  v-if="item.children?.length"
                  type="button"
                  class="wx-sidebar__link"
                  :class="{
                    'wx-sidebar__link--active': isActive(item),
                    'wx-sidebar__link--disabled': item.disabled,
                  }"
                  :disabled="item.disabled"
                  :aria-expanded="isGroupExpanded(item)"
                  :title="collapsed ? item.label : undefined"
                  @click="toggleGroup(item)"
                >
                  <span
                    v-if="item.icon"
                    class="wx-sidebar__icon"
                    aria-hidden="true"
                    v-html="item.icon"
                  />
                  <span v-if="!collapsed" class="wx-sidebar__label">{{ item.label }}</span>
                  <span
                    v-if="!collapsed && item.badge !== undefined"
                    class="wx-sidebar__badge"
                  >{{ item.badge }}</span>
                  <svg
                    v-if="!collapsed"
                    class="wx-sidebar__chevron"
                    :class="{ 'wx-sidebar__chevron--open': isGroupExpanded(item) }"
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <a
                  v-else-if="item.href"
                  :href="item.href"
                  class="wx-sidebar__link"
                  :class="{
                    'wx-sidebar__link--active': isActive(item),
                    'wx-sidebar__link--disabled': item.disabled,
                  }"
                  :title="collapsed ? item.label : undefined"
                  @click="onNavigate(item, $event)"
                >
                  <span
                    v-if="item.icon"
                    class="wx-sidebar__icon"
                    aria-hidden="true"
                    v-html="item.icon"
                  />
                  <span v-if="!collapsed" class="wx-sidebar__label">{{ item.label }}</span>
                  <span
                    v-if="!collapsed && item.badge !== undefined"
                    class="wx-sidebar__badge"
                  >{{ item.badge }}</span>
                  <span
                    v-if="!collapsed && item.shortcut"
                    class="wx-sidebar__shortcut"
                  >{{ item.shortcut }}</span>
                </a>

                <button
                  v-else
                  type="button"
                  class="wx-sidebar__link"
                  :class="{
                    'wx-sidebar__link--active': isActive(item),
                    'wx-sidebar__link--disabled': item.disabled,
                  }"
                  :disabled="item.disabled"
                  :title="collapsed ? item.label : undefined"
                  @click="onSelect(item)"
                >
                  <span
                    v-if="item.icon"
                    class="wx-sidebar__icon"
                    aria-hidden="true"
                    v-html="item.icon"
                  />
                  <span v-if="!collapsed" class="wx-sidebar__label">{{ item.label }}</span>
                  <span
                    v-if="!collapsed && item.badge !== undefined"
                    class="wx-sidebar__badge"
                  >{{ item.badge }}</span>
                  <span
                    v-if="!collapsed && item.shortcut"
                    class="wx-sidebar__shortcut"
                  >{{ item.shortcut }}</span>
                </button>

                <transition name="wx-sidebar-collapse">
                  <ul
                    v-if="!collapsed && item.children && isGroupExpanded(item)"
                    class="wx-sidebar__sublist"
                    role="list"
                  >
                    <li v-for="child in item.children" :key="child.id">
                      <a
                        v-if="child.href"
                        :href="child.href"
                        class="wx-sidebar__link wx-sidebar__link--child"
                        :class="{
                          'wx-sidebar__link--active': child.id === props.activeId,
                          'wx-sidebar__link--disabled': child.disabled,
                        }"
                        :title="child.label"
                        @click="onNavigate(child, $event)"
                      >
                        <span class="wx-sidebar__child-bullet" aria-hidden="true" />
                        <span class="wx-sidebar__label">{{ child.label }}</span>
                        <span v-if="child.badge !== undefined" class="wx-sidebar__badge">{{ child.badge }}</span>
                      </a>
                      <button
                        v-else
                        type="button"
                        class="wx-sidebar__link wx-sidebar__link--child"
                        :class="{
                          'wx-sidebar__link--active': child.id === props.activeId,
                          'wx-sidebar__link--disabled': child.disabled,
                        }"
                        :disabled="child.disabled"
                        @click="onSelect(child)"
                      >
                        <span class="wx-sidebar__child-bullet" aria-hidden="true" />
                        <span class="wx-sidebar__label">{{ child.label }}</span>
                        <span v-if="child.badge !== undefined" class="wx-sidebar__badge">{{ child.badge }}</span>
                      </button>
                    </li>
                  </ul>
                </transition>
              </li>
            </template>
          </ul>
        </div>
      </slot>
    </nav>

    <footer v-if="$slots.footer || (collapsible && collapsePosition === 'footer')" class="wx-sidebar__footer" data-part="footer">
      <slot name="footer" />
      <button
        v-if="collapsible && collapsePosition === 'footer'"
        type="button"
        class="wx-sidebar__collapse wx-sidebar__collapse--footer"
        :aria-label="collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'"
        @click="toggleCollapse"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline :points="collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'" />
        </svg>
        <span v-if="!collapsed" class="wx-sidebar__collapse-label">Thu gọn</span>
      </button>
    </footer>
  </aside>
</template>

<style scoped>
.wx-sidebar {
  flex-shrink: 0;
  width: var(--wx-sidebar-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--wx-surface-base);
  border-right: 1px solid var(--wx-border-subtle);
  font-family: var(--wx-font-primary);
  color: var(--wx-content-primary);
  overflow: hidden;
  transition: width var(--wx-d-normal) var(--wx-ease-standard);
}
.wx-sidebar--collapsed { width: var(--wx-sidebar-collapsed-width); }

@media (prefers-reduced-motion: reduce) {
  .wx-sidebar { transition: none; }
}

/* ── Header ── */
.wx-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--wx-space-3) var(--wx-space-4);
  height: 56px;
  border-bottom: 1px solid var(--wx-border-subtle);
  flex-shrink: 0;
}
.wx-sidebar--collapsed .wx-sidebar__header {
  padding: var(--wx-space-2);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--wx-space-1);
  height: auto;
  min-height: 56px;
}

.wx-sidebar__brand {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  min-width: 0;
}
.wx-sidebar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  border-radius: var(--wx-radius-lg);
  background: var(--wx-brand-primary);
  color: white;
  font-weight: var(--wx-fw-bold);
  font-size: var(--wx-fs-16);
  flex-shrink: 0;
}
.wx-sidebar__logo--gradient { background: var(--wx-gradient-button); }
.wx-sidebar__logo--img { background: none; object-fit: contain; }
.wx-sidebar__brand-name {
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Nav ── */
.wx-sidebar__nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--wx-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
  scrollbar-width: thin;
}
.wx-sidebar__nav::-webkit-scrollbar { width: 6px; }
.wx-sidebar__nav::-webkit-scrollbar-thumb {
  background: var(--wx-border-default);
  border-radius: var(--wx-radius-full);
}

.wx-sidebar__section {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}
.wx-sidebar__section-label {
  margin: 0 0 var(--wx-space-1);
  padding: 0 var(--wx-space-2);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-content-muted);
  letter-spacing: var(--wx-tracking-normal);
}
.wx-sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.wx-sidebar__item { position: relative; }

.wx-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  width: 100%;
  padding: 0 var(--wx-space-3);
  /* 44px = Apple HIG / Material touch target floor. Old 36px failed audit
     on mobile (taps near adjacent links registered on the wrong row). */
  min-height: 44px;
  border: none;
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-content-secondary);
  font-family: inherit;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-medium);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-sidebar--collapsed .wx-sidebar__link {
  padding: 0;
  justify-content: center;
  gap: 0;
}

.wx-sidebar__link:hover:not(:disabled):not(.wx-sidebar__link--active) {
  background: var(--wx-surface-sunken);
  color: var(--wx-content-primary);
}
.wx-sidebar__link:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: -2px;
}

.wx-sidebar__link--active {
  background: rgba(37, 99, 235, 0.1);
  color: var(--wx-brand-primary);
}
[data-theme="dark"] .wx-sidebar__link--active {
  background: rgba(96, 165, 250, 0.15);
}

.wx-sidebar__link--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.wx-sidebar__link--child {
  height: 32px;
  padding-left: var(--wx-space-7);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-regular);
}

.wx-sidebar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px; height: 18px;
  flex-shrink: 0;
  color: currentColor;
}
.wx-sidebar__icon :deep(svg) { width: 100%; height: 100%; }

.wx-sidebar__label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wx-sidebar__badge {
  flex-shrink: 0;
  min-width: 18px;
  padding: 0 6px;
  height: 18px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-brand-primary);
  color: white;
  font-size: 11px;
  font-weight: var(--wx-fw-semibold);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.wx-sidebar__shortcut {
  flex-shrink: 0;
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  letter-spacing: var(--wx-tracking-wide);
}

.wx-sidebar__chevron {
  flex-shrink: 0;
  color: var(--wx-content-muted);
  transition: transform var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-sidebar__chevron--open { transform: rotate(180deg); }

.wx-sidebar__sublist {
  list-style: none;
  margin: 2px 0 var(--wx-space-1);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wx-sidebar__child-bullet {
  width: 4px;
  height: 4px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-content-muted);
  flex-shrink: 0;
  margin-right: var(--wx-space-1);
}
.wx-sidebar__link--child.wx-sidebar__link--active .wx-sidebar__child-bullet {
  background: var(--wx-brand-primary);
}

.wx-sidebar-collapse-enter-active,
.wx-sidebar-collapse-leave-active {
  transition: max-height var(--wx-d-normal) var(--wx-ease-standard),
              opacity var(--wx-d-fast) var(--wx-ease-standard);
  overflow: hidden;
  max-height: 600px;
}
.wx-sidebar-collapse-enter-from,
.wx-sidebar-collapse-leave-to { max-height: 0; opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .wx-sidebar-collapse-enter-active,
  .wx-sidebar-collapse-leave-active { transition: none; }
}

/* ── Footer ── */
.wx-sidebar__footer {
  flex-shrink: 0;
  padding: var(--wx-space-3);
  border-top: 1px solid var(--wx-border-subtle);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}

.wx-sidebar__collapse {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-2);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-content-secondary);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--wx-fs-13);
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-sidebar__collapse:hover {
  background: var(--wx-surface-sunken);
  color: var(--wx-content-primary);
}
.wx-sidebar__collapse:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}
.wx-sidebar__collapse--footer { width: 100%; }
.wx-sidebar--collapsed .wx-sidebar__collapse-label { display: none; }
</style>
