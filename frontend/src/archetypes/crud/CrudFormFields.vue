<script setup lang="ts">
import type { FormFieldConfig } from '@/schemas/crud.schema'
import { FormField, BaseInput, BaseSelectMenu, BaseTextarea, BaseToggle } from '@/components/common'

defineProps<{
  fields: FormFieldConfig[]
  form: Record<string, unknown>
}>()
</script>

<template>
  <div class="cff-body">
    <!--
      Layout: fields with half=true are paired into 2-col rows.
      Fields with half=false (or undefined) span full width.
      Algorithm: buffer half-fields, flush pair when 2 accumulated or next field is full.
    -->
    <template v-for="(field, i) in fields" :key="field.key">
      <!-- Full-width field -->
      <template v-if="!field.half">
        <FormField
          :label="field.label"
          :hint="field.hint"
          :required="field.required"
        >
          <BaseInput
            v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
            :modelValue="form[field.key] as string"
            :type="field.type as 'text' | 'email' | 'password'"
            :placeholder="field.placeholder"
            @update:modelValue="form[field.key] = $event"
          />
          <BaseTextarea
            v-else-if="field.type === 'textarea'"
            :modelValue="form[field.key] as string"
            :placeholder="field.placeholder"
            :rows="3"
            @update:modelValue="form[field.key] = $event"
          />
          <BaseSelectMenu
            v-else-if="field.type === 'select'"
            :modelValue="form[field.key] as string"
            :options="field.options ?? []"
            :placeholder="field.placeholder"
            @update:modelValue="form[field.key] = $event"
          />
          <BaseToggle
            v-else-if="field.type === 'toggle'"
            :modelValue="form[field.key] as boolean"
            :label="field.placeholder"
            @update:modelValue="form[field.key] = $event"
          />
          <!-- tags: comma-separated text input -->
          <BaseInput
            v-else-if="field.type === 'tags'"
            :modelValue="form[field.key] as string"
            :placeholder="field.placeholder ?? 'VIP, Hà Nội, new...'"
            @update:modelValue="form[field.key] = $event"
          />
          <!-- radio group -->
          <div v-else-if="field.type === 'radio'" class="cff-radio-group">
            <label
              v-for="opt in field.options"
              :key="opt.value"
              class="cff-radio-item"
              :class="{ 'cff-radio-item--checked': form[field.key] === opt.value }"
            >
              <input
                type="radio"
                :name="field.key"
                :value="opt.value"
                :checked="form[field.key] === opt.value"
                @change="form[field.key] = opt.value"
              />
              {{ opt.label }}
            </label>
          </div>
          <!-- checkbox group (single-select with checkbox visual) -->
          <div v-else-if="field.type === 'checkbox'" class="cff-checkbox-group">
            <label
              v-for="opt in field.options"
              :key="opt.value"
              class="cff-checkbox-item"
            >
              <span class="cff-checkbox-box" :class="{ 'cff-checkbox-box--checked': form[field.key] === opt.value }">
                <svg v-if="form[field.key] === opt.value" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <input
                type="checkbox"
                :name="field.key"
                :value="opt.value"
                :checked="form[field.key] === opt.value"
                @change="form[field.key] = form[field.key] === opt.value ? '' : opt.value"
              />
              {{ opt.label }}
            </label>
          </div>
        </FormField>
      </template>

      <!-- Half-width: group consecutive half fields into 2-col rows -->
      <template v-else>
        <div
          v-if="i === 0 || !fields[i - 1]?.half"
          class="cff-row-2"
        >
          <!-- Current half field -->
          <FormField :label="field.label" :required="field.required" :hint="field.hint">
            <BaseInput
              v-if="field.type === 'text' || field.type === 'email'"
              :modelValue="form[field.key] as string"
              :type="field.type"
              :placeholder="field.placeholder"
              @update:modelValue="form[field.key] = $event"
            />
            <BaseSelectMenu
              v-else-if="field.type === 'select'"
              :modelValue="form[field.key] as string"
              :options="field.options ?? []"
              @update:modelValue="form[field.key] = $event"
            />
          </FormField>

          <!-- Next half field (pair partner) -->
          <template v-if="fields[i + 1]?.half">
            <FormField
              :label="fields[i + 1].label"
              :required="fields[i + 1].required"
              :hint="fields[i + 1].hint"
            >
              <BaseInput
                v-if="fields[i + 1].type === 'text' || fields[i + 1].type === 'email'"
                :modelValue="form[fields[i + 1].key] as string"
                :type="fields[i + 1].type as 'text' | 'email'"
                :placeholder="fields[i + 1].placeholder"
                @update:modelValue="form[fields[i + 1].key] = $event"
              />
              <BaseSelectMenu
                v-else-if="fields[i + 1].type === 'select'"
                :modelValue="form[fields[i + 1].key] as string"
                :options="fields[i + 1].options ?? []"
                @update:modelValue="form[fields[i + 1].key] = $event"
              />
            </FormField>
          </template>
        </div>
        <!-- Skip the second of a pair — already rendered above -->
      </template>
    </template>
  </div>
</template>

<style scoped>
.cff-body {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}

.cff-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--wx-space-4);
}

.cff-radio-group {
  display: flex;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
}

.cff-radio-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--wx-radius-full);
  border: 1.5px solid var(--wx-border-default);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--wx-text-secondary);
  transition: border-color var(--wx-d-micro) var(--wx-ease-standard),
              background var(--wx-d-micro) var(--wx-ease-standard),
              color var(--wx-d-micro) var(--wx-ease-standard);
}
.cff-radio-item input[type="radio"] { display: none; }
.cff-radio-item:hover {
  border-color: var(--wx-brand-primary);
  color: var(--wx-brand-primary);
}
.cff-radio-item--checked {
  border-color: var(--wx-brand-primary);
  background: color-mix(in srgb, var(--wx-brand-primary) 12%, transparent);
  color: var(--wx-brand-primary);
  font-weight: 600;
}

.cff-checkbox-group {
  display: flex;
  gap: var(--wx-space-4);
  flex-wrap: wrap;
}

.cff-checkbox-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--wx-text-primary);
  user-select: none;
}
.cff-checkbox-item input[type="checkbox"] { display: none; }

.cff-checkbox-box {
  width: 17px;
  height: 17px;
  border-radius: var(--wx-radius-sm);
  border: 1.5px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color var(--wx-d-micro) var(--wx-ease-standard),
              background var(--wx-d-micro) var(--wx-ease-standard);
}
.cff-checkbox-item:hover .cff-checkbox-box {
  border-color: var(--wx-brand-primary);
}
.cff-checkbox-box--checked {
  border-color: var(--wx-brand-primary);
  background: var(--wx-brand-primary);
}
</style>
