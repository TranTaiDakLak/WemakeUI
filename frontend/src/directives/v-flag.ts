import type { Directive, DirectiveBinding } from 'vue'
import { useFlagValue } from '../composables/useFlag'

/**
 * v-flag — feature flag gate.
 *
 *   <div v-flag="'beta-canvas'">…</div>            → flag off → hidden
 *   <div v-flag:variant="'checkout-flow'">…</div>  → set data-flag-variant="…" lên element
 *   <div v-flag.disable="'pro-export'">…</div>     → off → disabled (capability gate)
 *
 * default: HIDDEN (giống v-can). dùng `.disable` cho capability/upgrade tooltip pattern.
 */

const ORIGINAL = Symbol('v-flag:orig-display')
type FlagEl = HTMLElement & { [ORIGINAL]?: string }

function evaluate(binding: DirectiveBinding): { on: boolean; variant: string | null } {
  const { isOn, variant } = useFlagValue()
  const key = binding.value
  if (typeof key !== 'string') return { on: false, variant: null }
  return { on: isOn(key), variant: variant(key) }
}

function apply(
  el: FlagEl,
  state: { on: boolean; variant: string | null },
  binding: DirectiveBinding,
) {
  const mods = binding.modifiers
  if (binding.arg === 'variant' && state.variant) {
    el.setAttribute('data-flag-variant', state.variant)
  }

  if (state.on) {
    if (mods.disable) {
      el.removeAttribute('disabled')
      el.removeAttribute('aria-disabled')
      el.style.pointerEvents = ''
      el.style.opacity = ''
    } else {
      if (el[ORIGINAL] !== undefined) el.style.display = el[ORIGINAL] as string
    }
  } else {
    if (mods.disable) {
      el.setAttribute('disabled', '')
      el.setAttribute('aria-disabled', 'true')
      el.style.pointerEvents = 'none'
      el.style.opacity = '0.5'
    } else {
      if (el[ORIGINAL] === undefined) el[ORIGINAL] = el.style.display
      el.style.display = 'none'
    }
  }
}

export const vFlag: Directive<FlagEl, string> = {
  mounted(el, binding) {
    apply(el, evaluate(binding), binding)
  },
  updated(el, binding) {
    apply(el, evaluate(binding), binding)
  },
}
