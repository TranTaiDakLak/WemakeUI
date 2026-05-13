<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

type Option = { value: string | number; label: string; group?: string }

const props = withDefaults(defineProps<{
  modelValue?: string | number
  options: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}>(), { size: 'md' })

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isOpen     = ref(false)
const wrapperRef = ref<HTMLElement>()
const menuRef    = ref<HTMLElement>()
const triggerRef = ref<HTMLButtonElement>()
const focusedIdx = ref(-1)
const menuStyle  = ref<Record<string, string>>({})

/* ── selected label ── */
const selectedLabel = computed(() =>
  props.options.find(o => o.value === props.modelValue)?.label ?? null,
)
const hasValue = computed(() => selectedLabel.value !== null)

/* ── group helpers ── */
const groupNames = computed(() =>
  [...new Set(props.options.filter(o => o.group).map(o => o.group!))],
)
const hasGroups = computed(() => groupNames.value.length > 0)
const ungrouped = computed(() => props.options.filter(o => !o.group))
function optsByGroup(g: string) { return props.options.filter(o => o.group === g) }

/* ── position (fixed, tracked from trigger rect) ── */
function computePos() {
  if (!triggerRef.value) return
  const r = triggerRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - r.bottom - 8
  const spaceAbove = r.top - 8
  const flipUp = spaceBelow < 160 && spaceAbove > spaceBelow

  if (flipUp) {
    menuStyle.value = {
      position: 'fixed',
      bottom: `${window.innerHeight - r.top + 6}px`,
      left:   `${r.left}px`,
      minWidth: `${r.width}px`,
    }
  } else {
    menuStyle.value = {
      position: 'fixed',
      top:  `${r.bottom + 6}px`,
      left: `${r.left}px`,
      minWidth: `${r.width}px`,
    }
  }
}

/* ── open / close ── */
function open() {
  if (props.disabled) return
  computePos()
  isOpen.value = true
  const sel = props.options.findIndex(o => o.value === props.modelValue)
  focusedIdx.value = sel >= 0 ? sel : 0
  nextTick(scrollFocused)
}

function close(restoreFocus = true) {
  if (!isOpen.value) return
  isOpen.value = false
  focusedIdx.value = -1
  if (restoreFocus) triggerRef.value?.focus()
}

function toggle() { isOpen.value ? close() : open() }

function select(value: string | number) {
  emit('update:modelValue', value)
  close()
}

function scrollFocused() {
  if (!menuRef.value) return
  const items = menuRef.value.querySelectorAll<HTMLElement>('.bsm__option')
  items[focusedIdx.value]?.scrollIntoView({ block: 'nearest' })
}

/* ── keyboard ── */
function onKeydown(e: KeyboardEvent) {
  const n = props.options.length
  if (!isOpen.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault(); open()
    }
    return
  }
  switch (e.key) {
    case 'Escape':
      e.preventDefault(); close(); break
    case 'ArrowDown':
      e.preventDefault()
      focusedIdx.value = Math.min(focusedIdx.value + 1, n - 1)
      nextTick(scrollFocused); break
    case 'ArrowUp':
      e.preventDefault()
      focusedIdx.value = Math.max(focusedIdx.value - 1, 0)
      nextTick(scrollFocused); break
    case 'Enter': case ' ':
      e.preventDefault()
      if (focusedIdx.value >= 0 && focusedIdx.value < n)
        select(props.options[focusedIdx.value].value)
      break
    case 'Tab':
      close(); break
  }
}

/* ── close on outside click / scroll ── */
function onOutside(e: MouseEvent) {
  if (!isOpen.value) return
  if (!wrapperRef.value?.contains(e.target as Node) &&
      !menuRef.value?.contains(e.target as Node)) {
    close(false)  // close without stealing focus back — user clicked elsewhere
  }
}
function onScroll() { if (isOpen.value) computePos() }

onMounted(() => {
  document.addEventListener('mousedown', onOutside)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onOutside)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="bsm"
    :class="[`bsm--${size}`, { 'bsm--open': isOpen, 'bsm--disabled': disabled }]"
  >
    <!-- Label -->
    <label v-if="label" class="bsm__label">{{ label }}</label>

    <!-- Trigger -->
    <button
      ref="triggerRef"
      type="button"
      class="bsm__trigger"
      :disabled="disabled"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="bsm__value" :class="{ 'bsm__value--placeholder': !hasValue }">
        {{ selectedLabel ?? placeholder ?? 'Chọn...' }}
      </span>
      <svg class="bsm__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <!-- Menu — Teleported to body so it's never clipped -->
    <Teleport to="body">
      <Transition name="bsm-drop">
        <div
          v-if="isOpen"
          ref="menuRef"
          class="bsm__menu"
          role="listbox"
          :style="menuStyle"
        >
          <!-- Flat list -->
          <template v-if="!hasGroups">
            <button
              v-for="(opt, idx) in options"
              :key="opt.value"
              type="button"
              class="bsm__option"
              :class="{
                'bsm__option--selected': opt.value === modelValue,
                'bsm__option--focused':  idx === focusedIdx,
              }"
              role="option"
              :aria-selected="opt.value === modelValue"
              @click="select(opt.value)"
              @mouseenter="focusedIdx = idx"
            >
              <span class="bsm__opt-label">{{ opt.label }}</span>
              <svg v-if="opt.value === modelValue" class="bsm__check" width="14" height="14"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </template>

          <!-- Grouped list -->
          <template v-else>
            <template v-for="group in groupNames" :key="group">
              <div class="bsm__group-label">{{ group }}</div>
              <button
                v-for="opt in optsByGroup(group)"
                :key="opt.value"
                type="button"
                class="bsm__option"
                :class="{
                  'bsm__option--selected': opt.value === modelValue,
                  'bsm__option--focused':  options.indexOf(opt) === focusedIdx,
                }"
                role="option"
                :aria-selected="opt.value === modelValue"
                @click="select(opt.value)"
                @mouseenter="focusedIdx = options.indexOf(opt)"
              >
                <span class="bsm__opt-label">{{ opt.label }}</span>
                <svg v-if="opt.value === modelValue" class="bsm__check" width="14" height="14"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </template>

            <template v-if="ungrouped.length">
              <div class="bsm__sep" />
              <button
                v-for="opt in ungrouped"
                :key="opt.value"
                type="button"
                class="bsm__option"
                :class="{
                  'bsm__option--selected': opt.value === modelValue,
                  'bsm__option--focused':  options.indexOf(opt) === focusedIdx,
                }"
                role="option"
                :aria-selected="opt.value === modelValue"
                @click="select(opt.value)"
                @mouseenter="focusedIdx = options.indexOf(opt)"
              >
                <span class="bsm__opt-label">{{ opt.label }}</span>
                <svg v-if="opt.value === modelValue" class="bsm__check" width="14" height="14"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </template>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Wrapper ── */
.bsm {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
}

.bsm__label {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-secondary);
}

/* ── Trigger — matches BaseButton secondary ── */
.bsm__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
  width: 100%;
  padding: 9px 14px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-elevated);
  box-shadow: var(--wx-shadow-sm);
  color: var(--wx-text-primary);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-semibold);
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  line-height: 1;
  min-height: 36px;
  transition:
    background    var(--wx-d-fast) var(--wx-ease-standard),
    box-shadow    var(--wx-d-fast) var(--wx-ease-standard),
    transform     var(--wx-d-fast) var(--wx-ease-standard),
    border-color  var(--wx-d-fast) var(--wx-ease-standard);
}

.bsm__trigger:hover:not(:disabled) {
  background: var(--wx-hover-bg);
  box-shadow: var(--wx-shadow-md);
  transform: translateY(-1px);
}

.bsm__trigger:focus-visible {
  outline: 2px solid var(--wx-brand-focus);
  outline-offset: 2px;
}

.bsm--open .bsm__trigger {
  background: var(--wx-hover-bg);
  box-shadow: var(--wx-shadow-md);
  transform: translateY(-1px);
}

.bsm--disabled .bsm__trigger {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

.bsm__trigger:active:not(:disabled) {
  transform: scale(0.975);
}

.bsm__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bsm__value--placeholder {
  color: var(--wx-text-secondary);
  font-weight: var(--wx-fw-medium);
}

.bsm__chevron {
  flex-shrink: 0;
  color: var(--wx-text-secondary);
  transition: transform var(--wx-d-fast) var(--wx-ease-standard);
}

.bsm--open .bsm__chevron { transform: rotate(180deg); }

/* ── Size sm — matches wx-btn--sm ── */
.bsm--sm .bsm__trigger {
  padding: 6px 11px;
  font-size: var(--wx-fs-12);
  gap: 5px;
  min-height: 30px;
}

.bsm--sm .bsm__label { font-size: var(--wx-fs-11); }

/* ── Drop transition ── */
.bsm-drop-enter-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.bsm-drop-leave-active { transition: opacity 0.1s ease,  transform 0.1s ease; }
.bsm-drop-enter-from,
.bsm-drop-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }

@media (prefers-reduced-motion: reduce) {
  .bsm__trigger,
  .bsm__chevron,
  .bsm-drop-enter-active,
  .bsm-drop-leave-active { transition: none; }
}
</style>

<!-- Teleported menu — global (not scoped) -->
<style>
.bsm__menu {
  z-index: 9999;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-xl);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 10px 24px -4px rgba(0, 0, 0, 0.14);
  overflow-y: auto;
  max-height: 280px;
  padding: 4px;
}

.bsm__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  background: transparent;
  border-radius: var(--wx-radius-md);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-primary);
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}

.bsm__option--focused,
.bsm__option:hover { background: var(--wx-hover-bg, var(--wx-surface-hover)); }

.bsm__option--selected {
  color: var(--wx-brand-primary);
  font-weight: var(--wx-fw-medium);
}

.bsm__opt-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bsm__check { color: var(--wx-brand-primary); flex-shrink: 0; }

.bsm__group-label {
  padding: 6px 10px 3px;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.bsm__sep {
  height: 1px;
  background: var(--wx-border-subtle);
  margin: 4px 0;
}
</style>
