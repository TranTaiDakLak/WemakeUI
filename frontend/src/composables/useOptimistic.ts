import { ref, computed, type Ref } from 'vue'

/**
 * useOptimistic — update local trước, call API, rollback nếu lỗi.
 *
 *   const { value, pending, error, run } = useOptimistic(initial)
 *   await run({
 *     optimistic: (v) => ({ ...v, name: 'mới' }),
 *     commit: () => api.rename({ name: 'mới' }),
 *   })
 *
 * Hỗ trợ nhiều mutation đồng thời: mỗi run trả id riêng + rollback chính xác.
 */

interface Pending<T> {
  id: number
  prev: T
}

let nextId = 0

export function useOptimistic<T>(initial: T) {
  const value = ref<T>(initial) as Ref<T>
  const pendings = ref<Pending<T>[]>([]) as Ref<Pending<T>[]>
  const error = ref<unknown>(null)

  const pending = computed(() => pendings.value.length > 0)

  function set(v: T) {
    value.value = v
  }

  async function run<R>(opts: {
    optimistic: (current: T) => T
    commit: () => Promise<R>
    /** chạy sau commit — có thể merge response vào value */
    onSuccess?: (response: R, current: T) => T | void
    /** chạy khi rollback */
    onError?: (err: unknown) => void
  }): Promise<R | null> {
    error.value = null
    const id = ++nextId
    const prev = structuredClone
      ? structuredClone(value.value)
      : (JSON.parse(JSON.stringify(value.value)) as T)
    const next = opts.optimistic(value.value)
    value.value = next
    pendings.value.push({ id, prev })

    try {
      const res = await opts.commit()
      // pop pending bằng id
      pendings.value = pendings.value.filter((p) => p.id !== id)
      if (opts.onSuccess) {
        const merged = opts.onSuccess(res, value.value)
        if (merged !== undefined) value.value = merged
      }
      return res
    } catch (e) {
      // rollback về snapshot này; nếu các mutation sau cũng fail, mỗi cái rollback riêng
      const idx = pendings.value.findIndex((p) => p.id === id)
      if (idx !== -1) {
        value.value = pendings.value[idx].prev
        pendings.value.splice(idx, 1)
      }
      error.value = e
      opts.onError?.(e)
      return null
    }
  }

  return { value, set, pending, pendings, error, run }
}
