import { onBeforeUnmount, ref, type Ref } from 'vue'

/**
 * useLiveQuery — reactive ref tự cập nhật từ subscription (websocket / sse / event bus).
 * Có polling fallback với exponential backoff khi connect lỗi.
 *
 *   const { data, status, lastUpdate, retry } = useLiveQuery({
 *     channel: 'jobs.live',
 *     subscribe: (push) => { ws.on('msg', push); return () => ws.off(...) },
 *     fallbackPoll: () => fetch('/jobs').then(r => r.json()),
 *     pollInterval: 5000,
 *   })
 */

export type LiveStatus = 'idle' | 'connecting' | 'live' | 'polling' | 'error'

export interface UseLiveQueryOptions<T> {
  /** label channel — chỉ để log/debug */
  channel?: string
  /** subscribe trả disposer; gọi push(data) mỗi lần có cập nhật mới */
  subscribe?: (push: (data: T) => void, fail: (err: unknown) => void) => () => void
  /** fallback polling khi subscribe fail */
  fallbackPoll?: () => Promise<T>
  /** ms giữa lần poll. default 5000 */
  pollInterval?: number
  /** giá trị khởi tạo */
  initial?: T
  /** auto start. default true */
  autoStart?: boolean
}

export function useLiveQuery<T = unknown>(opts: UseLiveQueryOptions<T>) {
  const { channel = 'live', subscribe, fallbackPoll, pollInterval = 5000, initial, autoStart = true } = opts

  const data = ref<T | undefined>(initial) as Ref<T | undefined>
  const status = ref<LiveStatus>('idle')
  const lastUpdate = ref<number | null>(null)
  const error = ref<unknown>(null)

  let dispose: (() => void) | null = null
  let pollTimer: ReturnType<typeof setTimeout> | null = null
  let backoffMs = pollInterval
  const maxBackoff = 60_000
  let stopped = false

  function setData(v: T) {
    data.value = v
    lastUpdate.value = Date.now()
    error.value = null
    backoffMs = pollInterval // reset backoff
  }

  function startPolling() {
    if (!fallbackPoll) {
      status.value = 'error'
      return
    }
    status.value = 'polling'
    const tick = async () => {
      if (stopped) return
      try {
        const v = await fallbackPoll()
        setData(v)
        backoffMs = pollInterval
      } catch (e) {
        error.value = e
        backoffMs = Math.min(backoffMs * 2, maxBackoff)
      }
      if (!stopped) pollTimer = setTimeout(tick, backoffMs)
    }
    pollTimer = setTimeout(tick, backoffMs)
  }

  function startSubscribe() {
    if (!subscribe) {
      startPolling()
      return
    }
    status.value = 'connecting'
    try {
      dispose = subscribe(
        (v) => {
          status.value = 'live'
          setData(v)
        },
        (e) => {
          error.value = e
          status.value = 'error'
          // chuyển fallback
          dispose?.()
          dispose = null
          startPolling()
        },
      )
      // optimistic: nếu sau 3s vẫn chưa có sự kiện → vẫn coi là live đến khi có error
      if (status.value === 'connecting') status.value = 'live'
    } catch (e) {
      error.value = e
      startPolling()
    }
  }

  function start() {
    stopped = false
    startSubscribe()
  }

  function stop() {
    stopped = true
    dispose?.()
    dispose = null
    if (pollTimer) clearTimeout(pollTimer)
    pollTimer = null
    status.value = 'idle'
  }

  function retry() {
    stop()
    backoffMs = pollInterval
    start()
  }

  if (autoStart) start()
  onBeforeUnmount(stop)

  return {
    channel,
    data,
    status,
    lastUpdate,
    error,
    start,
    stop,
    retry,
  }
}
