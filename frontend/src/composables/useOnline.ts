import { onBeforeUnmount, onMounted, ref, computed } from 'vue'

/**
 * useOnline — reactive trạng thái mạng + mutation queue offline.
 *
 *  const { online, queue, enqueue, flush } = useOnline()
 *
 *  enqueue → push 1 mutation lên queue (lưu memory + localStorage backup).
 *  khi online ↻ → flush(callback) chạy queue tuần tự, fail → giữ lại.
 *
 *  cross-platform: SSR / desktop wrapper / mobile shell đều dùng được.
 */

export interface QueuedMutation {
  id: string
  /** label người dùng đọc được (hiển thị trên banner) */
  label: string
  /** payload tự do — caller hiểu cách restore */
  payload: unknown
  /** thời điểm enqueue (ms epoch) */
  ts: number
}

const STORAGE_KEY = 'wx-mutation-queue'

const online = ref<boolean>(
  typeof navigator !== 'undefined' ? navigator.onLine : true,
)
const queue = ref<QueuedMutation[]>([])
let initialized = false

function loadFromStorage() {
  if (typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) queue.value = JSON.parse(raw) as QueuedMutation[]
  } catch {
    /* ignore corrupt */
  }
}

function saveToStorage() {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue.value))
  } catch {
    /* ignore quota */
  }
}

function setOnline() {
  online.value = true
}
function setOffline() {
  online.value = false
}

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  loadFromStorage()
  window.addEventListener('online', setOnline)
  window.addEventListener('offline', setOffline)
}

function dispose() {
  if (typeof window === 'undefined') return
  window.removeEventListener('online', setOnline)
  window.removeEventListener('offline', setOffline)
  initialized = false
}

export function useOnline() {
  onMounted(init)
  // không dispose khi 1 component unmount — giữ singleton nếu còn user khác
  // dispose chỉ khi cần thiết qua resetOnline()

  function enqueue(mutation: Omit<QueuedMutation, 'id' | 'ts'>) {
    const item: QueuedMutation = {
      ...mutation,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
    }
    queue.value.push(item)
    saveToStorage()
    return item
  }

  function remove(id: string) {
    const idx = queue.value.findIndex((m) => m.id === id)
    if (idx !== -1) {
      queue.value.splice(idx, 1)
      saveToStorage()
    }
  }

  function clear() {
    queue.value = []
    saveToStorage()
  }

  /**
   * flush — chạy tuần tự queue. callback trả Promise, throw → giữ lại.
   * trả về số lượng item flush thành công.
   */
  async function flush(
    runner: (m: QueuedMutation) => Promise<void>,
  ): Promise<{ ok: number; failed: number }> {
    let ok = 0
    let failed = 0
    const remaining: QueuedMutation[] = []
    for (const m of queue.value) {
      try {
        await runner(m)
        ok++
      } catch {
        failed++
        remaining.push(m)
      }
    }
    queue.value = remaining
    saveToStorage()
    return { ok, failed }
  }

  return {
    online: computed(() => online.value),
    queue: computed(() => queue.value),
    enqueue,
    remove,
    clear,
    flush,
  }
}

/** dispose listener — gọi trong test hoặc app teardown */
export function resetOnline() {
  dispose()
  queue.value = []
}
