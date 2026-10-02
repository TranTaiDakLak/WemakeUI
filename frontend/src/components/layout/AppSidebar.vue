<script setup lang="ts">
/**
 * AppSidebar — sidebar / tool rail cho desktop shell.
 * Phase 3 — layout shells.
 *
 * Bố cục lấy từ ToolRail của MindAds:
 *  - item cao 42px, bo 8px; active = nền nhạt + chữ brand + vạch 3px bên trái
 *  - thu gọn 240px ⇄ 64px: tooltip nổi bên phải item, badge thu thành chấm số
 *  - phím tắt Alt+B bật/tắt (bỏ qua khi đang gõ trong input)
 *  - nhãn nhóm viết hoa nhỏ; khi thu gọn đổi thành vạch ngăn
 *
 * defaults phần II:
 *  - width: 240px · collapsedWidth: 64px · collapsible: true
 *  - defaultCollapsed: false (auto trên mobile ≤768px)
 *
 * anatomy: root → header → sections → footer (slots)
 *   sections render qua prop `sections` hoặc qua slot mặc định (hoàn toàn tự render).
 *
 * props mới (đều tuỳ chọn, tương thích ngược):
 *   tagline · hideBrand · persistKey · hotkey
 */
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import type { SidebarItem, SidebarSection } from './sidebar-types'
import { SHELL_ICONS } from './shell-icons'

const props = withDefaults(defineProps<{
  /** danh sách section */
  sections?: SidebarSection[]
  /** tên thương hiệu (slot brand override) */
  brand?: string
  /** dòng nhỏ dưới tên thương hiệu */
  tagline?: string
  /** logo gradient — hiện ở header */
  logoGradient?: boolean
  /** URL ảnh logo — nếu bỏ trống, dùng chữ cái đầu của `brand` làm mark mặc định */
  logoSrc?: string
  /** href cho logo/brand ở header — nếu có, brand trở thành link (vd: "#/" để về trang chủ) */
  brandHref?: string
  /** ẩn khối brand (dùng khi topbar đã có brand) */
  hideBrand?: boolean
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
  /** nếu có: nhớ trạng thái thu gọn người dùng chọn vào localStorage với key này */
  persistKey?: string
  /** bật phím tắt Alt+B */
  hotkey?: boolean
}>(), {
  sections: () => [],
  brand: 'MindUI',
  logoGradient: true,
  hideBrand: false,
  width: 240,
  collapsedWidth: 64,
  collapsible: true,
  activeId: null,
  autoCollapseOnMobile: true,
  collapsePosition: 'footer',
  collapsed: false,
  hotkey: true,
})

const emit = defineEmits<{
  'select': [item: SidebarItem]
  'update:collapsed': [value: boolean]
}>()

const router = useRouter()

/* ── persist ── */
function readStored(): boolean | null {
  if (!props.persistKey || typeof localStorage === 'undefined') return null
  try {
    const v = localStorage.getItem(props.persistKey)
    return v === null ? null : v === 'true'
  } catch {
    return null
  }
}
function writeStored(v: boolean) {
  if (!props.persistKey || typeof localStorage === 'undefined') return
  try { localStorage.setItem(props.persistKey, v ? 'true' : 'false') } catch { /* private mode */ }
}

const stored = readStored()
const internalCollapsed = ref(stored ?? props.collapsed)
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
const userToggled = ref(stored !== null)

function handleMobile(e: MediaQueryListEvent | MediaQueryList) {
  if (!props.autoCollapseOnMobile) return
  if (userToggled.value) return
  internalCollapsed.value = e.matches
}

/* ── phím tắt Alt+B ── */
function onGlobalKeydown(e: KeyboardEvent) {
  if (!props.hotkey || !props.collapsible) return
  if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.code !== 'KeyB') return
  const t = e.target as HTMLElement | null
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return
  e.preventDefault()
  toggleCollapse()
}

onMounted(() => {
  if (typeof window === 'undefined') return
  if (typeof window.matchMedia === 'function') {
    mql = window.matchMedia('(max-width: 768px)')
    handleMobile(mql)
    mql.addEventListener?.('change', handleMobile)
  }
  window.addEventListener('keydown', onGlobalKeydown)
})
onBeforeUnmount(() => {
  mql?.removeEventListener?.('change', handleMobile)
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onGlobalKeydown)
})

function toggleCollapse() {
  userToggled.value = true
  collapsed.value = !collapsed.value
  writeStored(collapsed.value)
  tip.value = null
}

/* ── tooltip nổi khi thu gọn (position: fixed → không bị overflow cắt) ── */
const tip = ref<{ label: string; top: number; left: number } | null>(null)
function showTip(e: Event, label: string) {
  if (!collapsed.value) return
  const el = e.currentTarget as HTMLElement | null
  if (!el) return
  const r = el.getBoundingClientRect()
  tip.value = { label, top: r.top + r.height / 2, left: r.right + 10 }
}
function hideTip() { tip.value = null }
watch(collapsed, () => { tip.value = null })

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

function onBrandClick(e: MouseEvent) {
  if (props.brandHref?.startsWith('#/')) {
    e.preventDefault()
    const target = props.brandHref.slice(1)
    if (router.currentRoute.value.fullPath !== target) {
      void router.push(target)
    }
  }
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

const brandMark = computed(() => (props.brand.trim().charAt(0) || 'M').toUpperCase())
const showHeader = computed(
  () => !props.hideBrand || (props.collapsible && props.collapsePosition === 'header'),
)
const toggleLabel = computed(() => (collapsed.value ? 'Mở rộng menu' : 'Thu gọn menu'))
</script>

<template>
  <aside
    class="wx-sidebar"
    :class="{ 'wx-sidebar--collapsed': collapsed }"
    :style="cssVars"
    :aria-expanded="!collapsed"
    data-part="root"
  >
    <header v-if="showHeader" class="wx-sidebar__header" :class="{ 'wx-sidebar__header--bare': hideBrand }" data-part="header">
      <slot v-if="!hideBrand" name="brand">
        <component
          :is="brandHref ? 'a' : 'div'"
          class="wx-sidebar__brand"
          :href="brandHref || undefined"
          @click="brandHref ? onBrandClick($event) : undefined"
        >
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
            <span>{{ brandMark }}</span>
          </div>
          <span v-if="!collapsed" class="wx-sidebar__brand-text">
            <span class="wx-sidebar__brand-name">{{ brand }}</span>
            <span v-if="tagline" class="wx-sidebar__brand-tag">{{ tagline }}</span>
          </span>
        </component>
      </slot>
      <button
        v-if="collapsible && collapsePosition === 'header'"
        type="button"
        class="wx-sidebar__collapse"
        :aria-label="toggleLabel"
        @click="toggleCollapse"
      >
        <span aria-hidden="true" v-html="collapsed ? SHELL_ICONS.chevronRight : SHELL_ICONS.chevronLeft" />
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
          <div
            v-else-if="section.label && collapsed && sIdx > 0"
            class="wx-sidebar__divider"
            role="separator"
          />

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
                  :aria-label="collapsed ? item.label : undefined"
                  @click="toggleGroup(item)"
                  @mouseenter="showTip($event, item.label)"
                  @mouseleave="hideTip"
                  @focus="showTip($event, item.label)"
                  @blur="hideTip"
                >
                  <span
                    v-if="item.icon"
                    class="wx-sidebar__icon"
                    aria-hidden="true"
                    v-html="item.icon"
                  />
                  <span v-if="!collapsed" class="wx-sidebar__label">{{ item.label }}</span>
                  <span
                    v-if="item.badge !== undefined"
                    class="wx-sidebar__badge"
                  >{{ item.badge }}</span>
                  <span
                    v-if="!collapsed"
                    class="wx-sidebar__chevron"
                    :class="{ 'wx-sidebar__chevron--open': isGroupExpanded(item) }"
                    aria-hidden="true"
                    v-html="SHELL_ICONS.chevronDown"
                  />
                </button>

                <a
                  v-else-if="item.href"
                  :href="item.href"
                  class="wx-sidebar__link"
                  :class="{
                    'wx-sidebar__link--active': isActive(item),
                    'wx-sidebar__link--disabled': item.disabled,
                  }"
                  :aria-current="isActive(item) ? 'page' : undefined"
                  :aria-label="collapsed ? item.label : undefined"
                  @click="onNavigate(item, $event)"
                  @mouseenter="showTip($event, item.label)"
                  @mouseleave="hideTip"
                  @focus="showTip($event, item.label)"
                  @blur="hideTip"
                >
                  <span
                    v-if="item.icon"
                    class="wx-sidebar__icon"
                    aria-hidden="true"
                    v-html="item.icon"
                  />
                  <span v-if="!collapsed" class="wx-sidebar__label">{{ item.label }}</span>
                  <span
                    v-if="item.badge !== undefined"
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
                  :aria-label="collapsed ? item.label : undefined"
                  @click="onSelect(item)"
                  @mouseenter="showTip($event, item.label)"
                  @mouseleave="hideTip"
                  @focus="showTip($event, item.label)"
                  @blur="hideTip"
                >
                  <span
                    v-if="item.icon"
                    class="wx-sidebar__icon"
                    aria-hidden="true"
                    v-html="item.icon"
                  />
                  <span v-if="!collapsed" class="wx-sidebar__label">{{ item.label }}</span>
                  <span
                    v-if="item.badge !== undefined"
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
                        :aria-current="child.id === props.activeId ? 'page' : undefined"
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
        class="wx-sidebar__link wx-sidebar__toggle"
        :aria-label="toggleLabel"
        :aria-keyshortcuts="hotkey ? 'Alt+B' : undefined"
        @click="toggleCollapse"
        @mouseenter="showTip($event, hotkey ? `${toggleLabel} (Alt+B)` : toggleLabel)"
        @mouseleave="hideTip"
        @focus="showTip($event, hotkey ? `${toggleLabel} (Alt+B)` : toggleLabel)"
        @blur="hideTip"
      >
        <span
          class="wx-sidebar__icon"
          aria-hidden="true"
          v-html="collapsed ? SHELL_ICONS.chevronsRight : SHELL_ICONS.chevronsLeft"
        />
        <span v-if="!collapsed" class="wx-sidebar__label">{{ toggleLabel }}</span>
        <kbd v-if="!collapsed && hotkey" class="mind-kbd wx-sidebar__kbd">Alt B</kbd>
      </button>
    </footer>

    <Transition name="wx-sidebar-tip">
      <div
        v-if="tip && collapsed"
        class="wx-sidebar__tip"
        role="tooltip"
        :style="{ top: `${tip.top}px`, left: `${tip.left}px` }"
      >{{ tip.label }}</div>
    </Transition>
  </aside>
</template>

<style scoped>
.wx-sidebar {
  flex-shrink: 0;
  width: var(--wx-sidebar-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--wx-shell-rail-bg);
  border-right: 1px solid var(--wx-shell-rail-border);
  font-family: var(--wx-font-primary);
  color: var(--wx-content-primary);
  overflow: hidden;
  transition: width var(--wx-d-normal) var(--wx-ease-bounce);
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
  height: 60px;
  border-bottom: 1px solid var(--wx-shell-rail-border);
  flex-shrink: 0;
}
.wx-sidebar__header--bare { height: auto; padding: var(--wx-space-2) var(--wx-space-3); justify-content: flex-end; }
.wx-sidebar--collapsed .wx-sidebar__header {
  padding: var(--wx-space-2);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--wx-space-1);
  height: auto;
  min-height: 60px;
}

.wx-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  text-decoration: none;
  color: inherit;
}
a.wx-sidebar__brand {
  cursor: pointer;
  border-radius: var(--wx-radius-md);
}
a.wx-sidebar__brand:hover { opacity: 0.88; }
a.wx-sidebar__brand:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}
.wx-sidebar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px; height: 34px;
  border-radius: 10px;
  background: var(--wx-brand-600);
  color: var(--wx-text-on-brand);
  font-weight: var(--wx-fw-bold);
  font-size: var(--wx-fs-16);
  flex-shrink: 0;
}
.wx-sidebar__logo--gradient { background: var(--wx-shell-grad-solid); box-shadow: var(--wx-shadow-brand); }
.wx-sidebar__logo--img {
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  box-shadow: var(--wx-shadow-sm);
  padding: 4px;
  object-fit: contain;
}
.wx-sidebar__brand-text { display: flex; flex-direction: column; min-width: 0; line-height: 1.2; }
.wx-sidebar__brand-name {
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-tight);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wx-sidebar__brand-tag {
  font-size: 10px;
  font-weight: var(--wx-fw-medium);
  color: var(--wx-content-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Nav ── */
.wx-sidebar__nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 14px 10px 12px;
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
  gap: 2px;
}
.wx-sidebar__section-label {
  margin: 0 0 var(--wx-space-2);
  padding: 0 12px;
  font-size: 11px;
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-shell-rail-label);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  user-select: none;
}
.wx-sidebar__divider {
  width: 24px;
  height: 1px;
  margin: 2px auto 8px;
  background: var(--wx-shell-rail-border);
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 0 12px;
  /* 42px = rail item; vượt ngưỡng touch target 44px khi tính cả gap 2px giữa các item */
  min-height: var(--wx-shell-rail-item-h);
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--wx-shell-rail-text);
  font-family: inherit;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-medium);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    color var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-sidebar--collapsed .wx-sidebar__link {
  width: 42px;
  padding: 0;
  margin: 0 auto;
  justify-content: center;
  gap: 0;
}

.wx-sidebar__link:hover:not(:disabled):not(.wx-sidebar__link--active) {
  background: var(--wx-shell-rail-hover-bg);
  color: var(--wx-shell-rail-hover-fg);
}
.wx-sidebar__link:hover:not(:disabled):not(.wx-sidebar__link--active) .wx-sidebar__icon {
  color: var(--wx-shell-rail-hover-fg);
}
.wx-sidebar__link:active:not(:disabled) { background: var(--wx-active-bg); }
.wx-sidebar__link:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 1px;
}

/* Active: nền nhạt + chữ brand + vạch 3px bên trái */
.wx-sidebar__link--active {
  background: var(--wx-shell-rail-active-bg);
  color: var(--wx-shell-rail-active-fg);
  font-weight: var(--wx-fw-semibold);
}
.wx-sidebar__link--active .wx-sidebar__icon { color: var(--wx-shell-rail-active-fg); }
.wx-sidebar__link--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 22px;
  transform: translateY(-50%);
  border-radius: var(--wx-radius-full);
  background: var(--wx-shell-rail-active-fg);
  pointer-events: none;
}

.wx-sidebar__link--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.wx-sidebar__link--child {
  min-height: 34px;
  padding-left: 12px;
  gap: 10px;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-regular);
}
.wx-sidebar__link--child.wx-sidebar__link--active::before { display: none; }

.wx-sidebar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px; height: 20px;
  flex-shrink: 0;
  color: var(--wx-shell-rail-icon);
  transition: color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-sidebar__icon :deep(svg) { width: 18px; height: 18px; }

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
  background: var(--wx-brand-600);
  color: var(--wx-text-on-brand);
  font-size: 11px;
  font-weight: var(--wx-fw-bold);
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
/* Thu gọn: badge thành chấm số ở góc icon */
.wx-sidebar--collapsed .wx-sidebar__badge {
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  font-size: 9px;
  box-shadow: 0 0 0 2px var(--wx-shell-rail-bg);
}

.wx-sidebar__shortcut {
  flex-shrink: 0;
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  letter-spacing: var(--wx-tracking-wide);
}

.wx-sidebar__chevron {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--wx-content-muted);
  transition: transform var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-sidebar__chevron :deep(svg) { width: 14px; height: 14px; }
.wx-sidebar__chevron--open { transform: rotate(180deg); }

/* Sublist có đường dẫn dọc */
.wx-sidebar__sublist {
  list-style: none;
  margin: 2px 0 var(--wx-space-1) 22px;
  padding: 0 0 0 10px;
  border-left: 1px solid var(--wx-shell-rail-border);
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
}
.wx-sidebar__link--child.wx-sidebar__link--active .wx-sidebar__child-bullet {
  background: var(--wx-shell-rail-active-fg);
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
  padding: 10px 10px 12px;
  border-top: 1px solid var(--wx-shell-rail-border);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.wx-sidebar__toggle { color: var(--wx-shell-rail-text); }
.wx-sidebar__kbd { flex-shrink: 0; opacity: 0.8; }

.wx-sidebar__collapse {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--wx-shell-rail-border);
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-content-secondary);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-sidebar__collapse :deep(svg) { width: 14px; height: 14px; }
.wx-sidebar__collapse:hover {
  background: var(--wx-shell-rail-hover-bg);
  color: var(--wx-content-primary);
}
.wx-sidebar__collapse:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}

/* ── Tooltip nổi (collapsed) ── */
.wx-sidebar__tip {
  position: fixed;
  z-index: var(--wx-z-tooltip);
  transform: translateY(-50%);
  max-width: 260px;
  padding: 6px 10px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-text-primary);
  color: var(--wx-text-inverse);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  line-height: 1.3;
  white-space: nowrap;
  box-shadow: var(--wx-shadow-lg);
  pointer-events: none;
}
.wx-sidebar-tip-enter-active,
.wx-sidebar-tip-leave-active { transition: opacity var(--wx-d-micro) var(--wx-ease-standard); }
.wx-sidebar-tip-enter-from,
.wx-sidebar-tip-leave-to { opacity: 0; }
</style>
