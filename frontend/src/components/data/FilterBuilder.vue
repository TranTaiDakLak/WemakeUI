<script setup lang="ts">
import { computed } from 'vue'
import {
  type FilterRule, type FilterGroup, type FilterFieldDef, type FilterOperator,
  OPERATORS_BY_TYPE, emptyGroup,
} from './filter-types'

const props = withDefaults(defineProps<{
  modelValue: FilterGroup
  fields: FilterFieldDef[]
  maxDepth?: number
  depth?: number
}>(), {
  maxDepth: 3,
  depth: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: FilterGroup]
}>()

const fieldMap = computed(() => new Map(props.fields.map((f) => [f.key, f])))

function update(g: FilterGroup) {
  emit('update:modelValue', g)
}

function setOp(op: 'AND' | 'OR') {
  update({ ...props.modelValue, op })
}

function addRule() {
  const first = props.fields[0]
  if (!first) return
  const rule: FilterRule = {
    field: first.key,
    op: OPERATORS_BY_TYPE[first.type][0].value,
    value: defaultValueFor(first),
  }
  update({ ...props.modelValue, rules: [...props.modelValue.rules, rule] })
}

function addGroup() {
  if (props.depth >= (props.maxDepth - 1)) return
  update({
    ...props.modelValue,
    rules: [...props.modelValue.rules, emptyGroup(props.modelValue.op === 'AND' ? 'OR' : 'AND')],
  })
}

function removeAt(idx: number) {
  const rules = props.modelValue.rules.filter((_, i) => i !== idx)
  update({ ...props.modelValue, rules })
}

function updateRule(idx: number, patch: Partial<FilterRule>) {
  const rules = props.modelValue.rules.map((r, i) => {
    if (i === idx && !('rules' in r)) return { ...r, ...patch } as FilterRule
    return r
  })
  update({ ...props.modelValue, rules })
}

function onFieldChange(idx: number, fieldKey: string) {
  const def = fieldMap.value.get(fieldKey)
  if (!def) return
  updateRule(idx, {
    field: fieldKey,
    op: OPERATORS_BY_TYPE[def.type][0].value,
    value: defaultValueFor(def),
  })
}

function onChildUpdate(idx: number, child: FilterGroup) {
  const rules = props.modelValue.rules.map((r, i) => i === idx ? child : r)
  update({ ...props.modelValue, rules })
}

function defaultValueFor(def: FilterFieldDef): unknown {
  switch (def.type) {
    case 'number': return 0
    case 'bool': return true
    case 'enum': return def.options?.[0]?.value ?? ''
    case 'date': return new Date().toISOString().slice(0, 10)
    default: return ''
  }
}

function isGroup(r: FilterRule | FilterGroup): r is FilterGroup {
  return 'rules' in r
}
</script>

<template>
  <div class="fb-group" :class="`fb-group--depth-${depth}`">
    <div class="fb-group__header">
      <div class="fb-toggle" role="group">
        <button
          type="button"
          class="fb-toggle__btn"
          :class="{ 'fb-toggle__btn--active': modelValue.op === 'AND' }"
          @click="setOp('AND')"
        >AND</button>
        <button
          type="button"
          class="fb-toggle__btn"
          :class="{ 'fb-toggle__btn--active': modelValue.op === 'OR' }"
          @click="setOp('OR')"
        >OR</button>
      </div>
      <div class="fb-actions">
        <button type="button" class="fb-action-btn" @click="addRule">+ Điều kiện</button>
        <button
          v-if="depth < maxDepth - 1"
          type="button"
          class="fb-action-btn"
          @click="addGroup"
        >+ Nhóm</button>
      </div>
    </div>

    <div class="fb-group__body">
      <p v-if="!modelValue.rules.length" class="fb-empty">
        Chưa có điều kiện nào. Bấm <b>+ Điều kiện</b> để thêm.
      </p>

      <div
        v-for="(item, idx) in modelValue.rules"
        :key="idx"
        class="fb-row"
      >
        <!-- Nested group -->
        <FilterBuilder
          v-if="isGroup(item)"
          :model-value="item"
          :fields="fields"
          :max-depth="maxDepth"
          :depth="depth + 1"
          class="fb-nested"
          @update:model-value="(g) => onChildUpdate(idx, g)"
        />

        <!-- Rule row -->
        <div v-else class="fb-rule">
          <select
            class="fb-input fb-input--field"
            :value="item.field"
            @change="onFieldChange(idx, ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.label }}</option>
          </select>

          <select
            class="fb-input fb-input--op"
            :value="item.op"
            @change="updateRule(idx, { op: ($event.target as HTMLSelectElement).value as FilterOperator })"
          >
            <option
              v-for="op in OPERATORS_BY_TYPE[fieldMap.get(item.field)?.type ?? 'text']"
              :key="op.value"
              :value="op.value"
            >{{ op.label }}</option>
          </select>

          <!-- Value input depends on field type and op -->
          <template v-if="(fieldMap.get(item.field)?.type ?? 'text') === 'enum'">
            <select
              class="fb-input fb-input--value"
              :value="item.value"
              @change="updateRule(idx, { value: ($event.target as HTMLSelectElement).value })"
            >
              <option
                v-for="opt in fieldMap.get(item.field)?.options ?? []"
                :key="opt.value"
                :value="opt.value"
              >{{ opt.label }}</option>
            </select>
          </template>

          <template v-else-if="fieldMap.get(item.field)?.type === 'bool'">
            <span class="fb-input fb-input--readonly">
              {{ item.op === 'isTrue' ? 'true' : 'false' }}
            </span>
          </template>

          <template v-else-if="fieldMap.get(item.field)?.type === 'number'">
            <input
              type="number"
              class="fb-input fb-input--value"
              :value="String(item.value ?? '')"
              @input="updateRule(idx, { value: Number(($event.target as HTMLInputElement).value) })"
            />
          </template>

          <template v-else-if="fieldMap.get(item.field)?.type === 'date'">
            <input
              type="date"
              class="fb-input fb-input--value"
              :value="String(item.value ?? '')"
              @input="updateRule(idx, { value: ($event.target as HTMLInputElement).value })"
            />
          </template>

          <template v-else>
            <input
              type="text"
              class="fb-input fb-input--value"
              :value="String(item.value ?? '')"
              @input="updateRule(idx, { value: ($event.target as HTMLInputElement).value })"
              placeholder="giá trị..."
            />
          </template>

          <button
            type="button"
            class="fb-remove"
            @click="removeAt(idx)"
            aria-label="Xoá điều kiện"
          >×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fb-group {
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: 12px;
  background: var(--wx-surface-base);
}

.fb-group--depth-1 { background: var(--wx-surface-sunken); }
.fb-group--depth-2 { background: var(--wx-surface-base); }

.fb-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 12px;
}

.fb-toggle {
  display: inline-flex;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  overflow: hidden;
}

.fb-toggle__btn {
  padding: 4px 12px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
  color: var(--wx-text-secondary);
  cursor: pointer;
  font-family: var(--wx-font-primary);
  transition: all var(--wx-duration-fast);
}

.fb-toggle__btn--active {
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
}

.fb-actions {
  display: flex;
  gap: 6px;
}

.fb-action-btn {
  padding: 4px 10px;
  border: 1px dashed var(--wx-border-default);
  background: transparent;
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  color: var(--wx-text-secondary);
  cursor: pointer;
  font-family: var(--wx-font-primary);
}

.fb-action-btn:hover {
  border-color: var(--wx-brand-primary);
  color: var(--wx-brand-primary);
  background: var(--wx-hover-bg);
}

.fb-group__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fb-empty {
  margin: 0;
  font-size: 12px;
  color: var(--wx-text-muted);
  font-style: italic;
}

.fb-row {
  display: flex;
}

.fb-nested {
  flex: 1;
  margin-left: 16px;
  border-left: 2px solid var(--wx-brand-primary);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.fb-rule {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 4px 0;
}

.fb-input {
  padding: 5px 8px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
  font-size: 12px;
  font-family: var(--wx-font-primary);
  transition: border-color var(--wx-duration-fast);
}

.fb-input:focus {
  outline: none;
  border-color: var(--wx-brand-focus);
}

.fb-input--field { flex: 0 0 140px; }
.fb-input--op { flex: 0 0 120px; }
.fb-input--value { flex: 1; min-width: 0; }
.fb-input--readonly {
  background: var(--wx-disabled-bg);
  color: var(--wx-text-muted);
  cursor: default;
}

.fb-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--wx-text-muted);
  font-size: 16px;
  cursor: pointer;
  border-radius: var(--wx-radius-full);
  transition: all var(--wx-duration-fast);
  flex-shrink: 0;
}

.fb-remove:hover {
  background: var(--wx-danger-bg);
  color: var(--wx-danger-text);
}
</style>
