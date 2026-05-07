import { reactive } from 'vue'
import type { FormFieldConfig } from '@/schemas/crud.schema'

export interface UseFormStateReturn {
  form: Record<string, unknown>
  reset(initial?: Record<string, unknown>): void
  fillFrom(
    item: Record<string, unknown>,
    mapFn?: (key: string, val: unknown) => unknown
  ): void
  parseTags(val: unknown): string[]
}

export function useFormState(fields: FormFieldConfig[]): UseFormStateReturn {
  function makeEmpty(): Record<string, unknown> {
    return Object.fromEntries(
      fields.map(f => [f.key, f.type === 'toggle' ? false : ''])
    )
  }

  const form = reactive<Record<string, unknown>>(makeEmpty())

  function reset(initial?: Record<string, unknown>) {
    const base = makeEmpty()
    Object.keys(form).forEach(k => { delete form[k] })
    Object.assign(form, base, initial)
  }

  function fillFrom(
    item: Record<string, unknown>,
    mapFn?: (key: string, val: unknown) => unknown
  ) {
    const base = makeEmpty()
    const filled: Record<string, unknown> = { ...base }
    for (const f of fields) {
      const raw = item[f.key]
      filled[f.key] = mapFn ? mapFn(f.key, raw) : (raw ?? base[f.key])
    }
    Object.keys(form).forEach(k => { delete form[k] })
    Object.assign(form, filled)
  }

  function parseTags(val: unknown): string[] {
    if (typeof val !== 'string') return []
    return val.split(',').map(t => t.trim()).filter(Boolean)
  }

  return { form, reset, fillFrom, parseTags }
}
