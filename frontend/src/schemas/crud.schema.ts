export type RowId = number | string

// ─── Column ───────────────────────────────────────────────────────────────────

export interface CrudColumnDef {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  /** Column renders via #cell-{key} slot */
  slot?: boolean
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export interface FilterConfig {
  key: string
  /** Value that means "show all" */
  defaultValue: string
  options: { value: string; label: string }[]
  match(row: Record<string, unknown>, value: string): boolean
}

// ─── Bulk Actions ─────────────────────────────────────────────────────────────

export interface BulkActionConfig {
  key: string
  label: string
  variant?: 'danger' | 'warning' | 'default'
  confirm?: {
    title: string
    description?: string
    intent?: 'danger' | 'warning' | 'info'
  }
}

// ─── Form Fields ──────────────────────────────────────────────────────────────

export interface FormFieldConfig {
  key: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'toggle' | 'tags' | 'radio' | 'checkbox'
  required?: boolean
  placeholder?: string
  hint?: string
  options?: { value: string; label: string }[]
  /** Render in half-width (2-col grid row) */
  half?: boolean
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

export interface DetailSectionConfig {
  title: string
  fields: {
    key: string
    label: string
    format?(val: unknown): string
    /** Render value in <code> */
    code?: boolean
  }[]
}

// ─── Page Config ──────────────────────────────────────────────────────────────

export interface CrudPageConfig<T extends { id: RowId } = { id: RowId }> {
  entity: string
  label: { singular: string; plural: string }

  // ── Data source (swap to real API call later) ──
  initialData(): T[]

  // ── Table ──
  columns: CrudColumnDef[]
  /** Show a built-in STT (row-number) column. Default true. */
  showRowIndex?: boolean

  // ── Search ──
  searchFields: (keyof T & string)[]
  searchPlaceholder?: string

  // ── Filters ──
  filters?: FilterConfig[]

  // ── Bulk actions (beyond default bulk-delete) ──
  bulkActions?: BulkActionConfig[]

  // ── Add form ──
  addForm?: {
    title?: string
    fields: FormFieldConfig[]
    initialValues?(): Record<string, unknown>
    validate?(form: Record<string, unknown>): string | null
    /** Build a new entity from form data */
    build(form: Record<string, unknown>): T
  }

  // ── Edit form ──
  editForm?: {
    title?: string
    /** Falls back to addForm.fields if omitted */
    fields?: FormFieldConfig[]
    validate?(form: Record<string, unknown>): string | null
    /** Merge form data into existing entity */
    apply(target: T, form: Record<string, unknown>): T
    /** Custom field mapping when filling form from entity */
    fillMap?(key: string, val: unknown): unknown
  }

  // ── Detail drawer ──
  detail?: {
    /** Field to use as drawer title */
    titleKey?: keyof T & string
    sections: DetailSectionConfig[]
  }

  // ── Delete ──
  delete?: {
    confirmTitle?: string
    confirmDescription?(item: T): string
    bulkConfirmTitle?: string
    bulkConfirmDescription?(count: number): string
  }

  // ── Side-effect hooks (real API, analytics, etc.) ──
  handlers?: {
    onAdd?(item: T): Promise<void> | void
    onEdit?(item: T): Promise<void> | void
    onDelete?(id: RowId): Promise<void> | void
    onBulkDelete?(ids: RowId[]): Promise<void> | void
    onBulkAction?(key: string, ids: RowId[]): Promise<void> | void
  }

  // ── Empty state ──
  empty?: {
    emoji?: string
    message?: string
  }

  // ── Pagination (future) ──
  pageSize?: number
}
