import type { Directive, DirectiveBinding } from 'vue'
import { useCan } from '../composables/useCan'

/**
 * v-can — hidden vs disabled theo permission. (RBAC, không phải capability — xem v-flag.)
 *
 *   <button v-can="'team.invite'">mời</button>            → permission thiếu → display:none
 *   <button v-can.disable="'team.invite'">mời</button>    → permission thiếu → disabled + tooltip
 *   <div v-can:any="['a.read','b.read']" />               → bất kỳ
 *   <div v-can:all="['a.read','b.write']" />              → tất cả
 *
 * default: HIDDEN (theo bảng phần V.6).
 */

const ORIGINAL = Symbol('v-can:orig-display')
type CanEl = HTMLElement & { [ORIGINAL]?: string }

function evaluate(binding: DirectiveBinding): boolean {
  const { can, canAny, canAll } = useCan()
  const v = binding.value
  if (binding.arg === 'any') {
    return Array.isArray(v) ? canAny(v) : false
  }
  if (binding.arg === 'all') {
    return Array.isArray(v) ? canAll(v) : false
  }
  if (typeof v === 'string') return can(v)
  if (Array.isArray(v)) return canAll(v)
  return false
}

function apply(el: CanEl, allowed: boolean, mods: DirectiveBinding['modifiers']) {
  if (allowed) {
    if (mods.disable) {
      el.removeAttribute('disabled')
      el.removeAttribute('aria-disabled')
      el.style.pointerEvents = ''
      el.style.opacity = ''
    } else {
      // restore display
      if (el[ORIGINAL] !== undefined) {
        el.style.display = el[ORIGINAL] as string
      }
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

export const vCan: Directive<CanEl, string | string[]> = {
  mounted(el, binding) {
    apply(el, evaluate(binding), binding.modifiers)
  },
  updated(el, binding) {
    apply(el, evaluate(binding), binding.modifiers)
  },
}
