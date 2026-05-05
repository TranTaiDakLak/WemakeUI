import { computed, reactive } from 'vue'

/**
 * useFlag — feature flag với optional variant.
 *
 *   useFlag('beta-canvas')         → boolean (true/false)
 *   useFlag('checkout-flow')       → boolean | string variant
 *
 *   setFlag('beta-canvas', true)
 *   setFlag('checkout-flow', 'variant-b')
 *
 * Pattern singleton; thường set 1 lần khi app boot từ remote config.
 */

export type FlagValue = boolean | string

interface FlagState {
  flags: Record<string, FlagValue>
}

const state = reactive<FlagState>({ flags: {} })

export function setFlag(key: string, value: FlagValue) {
  state.flags[key] = value
}
export function setFlags(map: Record<string, FlagValue>) {
  for (const k in map) state.flags[k] = map[k]
}
export function clearFlag(key: string) {
  delete state.flags[key]
}
export function resetFlags() {
  for (const k in state.flags) delete state.flags[k]
}

export function useFlag(key: string) {
  return computed<FlagValue>(() => state.flags[key] ?? false)
}

export function useFlagValue(): {
  isOn: (key: string) => boolean
  variant: (key: string) => string | null
  flags: Record<string, FlagValue>
} {
  return {
    isOn(key: string) {
      const v = state.flags[key]
      return v === true || (typeof v === 'string' && v.length > 0)
    },
    variant(key: string) {
      const v = state.flags[key]
      return typeof v === 'string' ? v : null
    },
    flags: state.flags,
  }
}
