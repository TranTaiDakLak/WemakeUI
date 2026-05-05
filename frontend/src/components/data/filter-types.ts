/**
 * FilterBuilder type definitions and helpers.
 * Spec: phần V.5.2 — nested AND/OR groups, max depth 3, URL serialize base64.
 */

export type FilterDataType = 'text' | 'number' | 'date' | 'enum' | 'bool'

export type FilterOperator =
  // text
  | 'contains' | 'equals' | 'startsWith' | 'regex'
  // number
  | '=' | '!=' | '>' | '<' | 'between'
  // date
  | 'is' | 'before' | 'after' | 'lastNDays'
  // enum
  | 'in' | 'notIn'
  // bool
  | 'isTrue' | 'isFalse'

export interface FilterRule {
  field: string
  op: FilterOperator
  value: unknown
}

export interface FilterGroup {
  op: 'AND' | 'OR'
  rules: Array<FilterRule | FilterGroup>
}

export interface FilterFieldDef {
  key: string
  label: string
  type: FilterDataType
  options?: Array<{ value: string | number; label: string }>
}

export const OPERATORS_BY_TYPE: Record<FilterDataType, Array<{ value: FilterOperator; label: string }>> = {
  text: [
    { value: 'contains', label: 'chứa' },
    { value: 'equals', label: 'bằng' },
    { value: 'startsWith', label: 'bắt đầu bằng' },
    { value: 'regex', label: 'regex' },
  ],
  number: [
    { value: '=', label: '=' },
    { value: '!=', label: '≠' },
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: 'between', label: 'trong khoảng' },
  ],
  date: [
    { value: 'is', label: 'là ngày' },
    { value: 'before', label: 'trước' },
    { value: 'after', label: 'sau' },
    { value: 'lastNDays', label: 'n ngày qua' },
  ],
  enum: [
    { value: 'in', label: 'thuộc' },
    { value: 'notIn', label: 'không thuộc' },
  ],
  bool: [
    { value: 'isTrue', label: 'là đúng' },
    { value: 'isFalse', label: 'là sai' },
  ],
}

/** URL-safe base64 encode (handles unicode) */
export function serializeFilter(group: FilterGroup): string {
  try {
    const json = JSON.stringify(group)
    const bytes = new TextEncoder().encode(json)
    let binary = ''
    bytes.forEach((b) => { binary += String.fromCharCode(b) })
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch {
    return ''
  }
}

/** URL-safe base64 decode */
export function deserializeFilter(encoded: string): FilterGroup | null {
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padLen = (4 - padded.length % 4) % 4
    const binary = atob(padded + '='.repeat(padLen))
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json) as FilterGroup
  } catch {
    return null
  }
}

export function emptyGroup(op: 'AND' | 'OR' = 'AND'): FilterGroup {
  return { op, rules: [] }
}

/** Apply a filter group to a row dataset. */
export function applyFilter<T extends Record<string, unknown>>(
  group: FilterGroup,
  rows: T[],
  fields: FilterFieldDef[],
): T[] {
  if (!group.rules.length) return rows
  const fieldMap = new Map(fields.map((f) => [f.key, f]))

  function matchRule(row: T, rule: FilterRule): boolean {
    const def = fieldMap.get(rule.field)
    if (!def) return true
    const v = row[rule.field]
    switch (rule.op) {
      case 'contains': return String(v ?? '').toLowerCase().includes(String(rule.value ?? '').toLowerCase())
      case 'equals': return String(v ?? '') === String(rule.value ?? '')
      case 'startsWith': return String(v ?? '').toLowerCase().startsWith(String(rule.value ?? '').toLowerCase())
      case 'regex': try { return new RegExp(String(rule.value), 'i').test(String(v ?? '')) } catch { return false }
      case '=': return Number(v) === Number(rule.value)
      case '!=': return Number(v) !== Number(rule.value)
      case '>': return Number(v) > Number(rule.value)
      case '<': return Number(v) < Number(rule.value)
      case 'between': {
        const [a, b] = (rule.value as [number, number]) ?? [0, 0]
        return Number(v) >= Number(a) && Number(v) <= Number(b)
      }
      case 'is': return String(v) === String(rule.value)
      case 'before': return new Date(String(v)) < new Date(String(rule.value))
      case 'after': return new Date(String(v)) > new Date(String(rule.value))
      case 'lastNDays': {
        const n = Number(rule.value) || 0
        const diff = (Date.now() - new Date(String(v)).getTime()) / (1000 * 60 * 60 * 24)
        return diff <= n && diff >= 0
      }
      case 'in': return Array.isArray(rule.value) && rule.value.includes(v as never)
      case 'notIn': return Array.isArray(rule.value) && !rule.value.includes(v as never)
      case 'isTrue': return v === true
      case 'isFalse': return v === false
      default: return true
    }
  }

  function matchGroup(row: T, g: FilterGroup): boolean {
    if (!g.rules.length) return true
    const results = g.rules.map((r) => 'rules' in r ? matchGroup(row, r) : matchRule(row, r))
    return g.op === 'AND' ? results.every(Boolean) : results.some(Boolean)
  }

  return rows.filter((r) => matchGroup(r, group))
}

/** Remove a rule by path of indices, return new group. */
export function removeAtPath(group: FilterGroup, path: number[]): FilterGroup {
  if (!path.length) return group
  const next: FilterGroup = { op: group.op, rules: [...group.rules] }
  let cursor: FilterGroup = next
  for (let i = 0; i < path.length - 1; i++) {
    const child = cursor.rules[path[i]] as FilterGroup
    const cloned: FilterGroup = { op: child.op, rules: [...child.rules] }
    cursor.rules[path[i]] = cloned
    cursor = cloned
  }
  cursor.rules.splice(path[path.length - 1], 1)
  return next
}
