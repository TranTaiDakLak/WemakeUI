import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: number
  type: ToastType
  message: string
  duration: number
}

const MAX_TOASTS = 5
let nextId = 0

const toasts = reactive<ToastItem[]>([])

function showToast(type: ToastType, message: string, duration = 3000) {
  const id = ++nextId
  toasts.push({ id, type, message, duration })
  if (toasts.length > MAX_TOASTS) toasts.shift()
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
}

function removeToast(id: number) {
  const idx = toasts.findIndex(t => t.id === id)
  if (idx !== -1) toasts.splice(idx, 1)
}

export function useToast() {
  return { toasts, showToast, removeToast }
}
