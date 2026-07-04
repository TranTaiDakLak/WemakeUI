export { useContextMenu } from './useContextMenu'
export { useSelection } from './useSelection'
export { useClipboard } from './useClipboard'
export { useCopyClipboard } from './useCopyClipboard'
export { useToast } from './useToast'
export type { ToastType, ToastItem } from './useToast'
export { useVirtualScroll } from './useVirtualScroll'
export { useKeyboard } from './useKeyboard'
export { useColumnResize } from './useColumnResize'
export { useBreakpoint } from './useBreakpoint'
export type { Breakpoint } from './useBreakpoint'
export { useI18n, setLocale, getLocale, setOverride, t } from './useI18n'
export type { Locale } from './useI18n'
export { useViewMode, setViewMode } from './useViewMode'
export type { ViewMode } from './useViewMode'

/* ── phase 5 additions ─────────────────────────────────── */
export { useFocusTrap } from './useFocusTrap'
export type { UseFocusTrapOptions } from './useFocusTrap'
export { useShortcut } from './useShortcut'
export type { ShortcutOptions } from './useShortcut'
export { useHoverable } from './useHoverable'
export { useOnline, resetOnline } from './useOnline'
export type { QueuedMutation } from './useOnline'
export { useLiveQuery } from './useLiveQuery'
export type { LiveStatus, UseLiveQueryOptions } from './useLiveQuery'
export { useOptimistic } from './useOptimistic'
export {
  useCan,
  setRoles,
  getRoles,
  grant,
  deny,
  reset as resetPermissions,
  setPermissionMap,
} from './useCan'
export type { Role } from './useCan'
export {
  useFlag,
  useFlagValue,
  setFlag,
  setFlags,
  clearFlag,
  resetFlags,
} from './useFlag'
export type { FlagValue } from './useFlag'

/* ── phase 11 — motion + scroll ───────────────────────── */
export { useScrollReveal } from './useScrollReveal'
export type { ScrollRevealOptions } from './useScrollReveal'
export { useStagger } from './useStagger'
export { useSmoothScroll } from './useSmoothScroll'

/* ── phase 9 — form / crud state ──────────────────────── */
export { useCrudState } from './useCrudState'
export { useFilter } from './useFilter'
export { useFormState } from './useFormState'
