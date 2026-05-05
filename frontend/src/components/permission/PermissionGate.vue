<script setup lang="ts">
/**
 * PermissionGate — wrapper kết hợp cả permission (RBAC) + capability (flag).
 *
 *   <PermissionGate
 *     :do="'invoice.create'"            <!-- RBAC: thiếu → hidden -->
 *     :flag="'pro-export'"              <!-- capability: thiếu → disabled + upgrade -->
 *     mode="hide"                       <!-- 'hide' | 'disable' | 'fallback' -->
 *   >
 *     <BaseButton>xuất CSV</BaseButton>
 *     <template #fallback>...</template>
 *     <template #upgrade>nâng cấp pro để xuất file</template>
 *   </PermissionGate>
 *
 *  Logic:
 *   - permission thiếu (RBAC) → hidden (mặc định) hoặc fallback.
 *   - capability thiếu (flag) → disabled + tooltip upgrade.
 *   - cả 2 đều OK → render slot bình thường.
 */
import { computed } from 'vue'
import { useCan } from '../../composables/useCan'
import { useFlagValue } from '../../composables/useFlag'

interface Props {
  do?: string
  flag?: string
  /** any of permissions */
  anyDo?: string[]
  /** all of permissions */
  allDo?: string[]
  /** xử lý khi RBAC fail */
  mode?: 'hide' | 'disable' | 'fallback'
  /** label upgrade tooltip khi capability fail */
  upgradeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'hide',
  upgradeLabel: 'nâng cấp để dùng',
})

const { can, canAny, canAll } = useCan()
const { isOn } = useFlagValue()

const hasPermission = computed(() => {
  if (props.do) return can(props.do)
  if (props.anyDo) return canAny(props.anyDo)
  if (props.allDo) return canAll(props.allDo)
  return true
})

const hasCapability = computed(() => {
  if (!props.flag) return true
  return isOn(props.flag)
})

const state = computed<'allow' | 'rbac-fail' | 'capability-fail'>(() => {
  if (!hasPermission.value) return 'rbac-fail'
  if (!hasCapability.value) return 'capability-fail'
  return 'allow'
})
</script>

<template>
  <template v-if="state === 'allow'">
    <slot />
  </template>

  <template v-else-if="state === 'rbac-fail'">
    <template v-if="mode === 'hide'" />
    <template v-else-if="mode === 'fallback'">
      <slot name="fallback">
        <span class="wx-pgate-fallback">bạn không có quyền</span>
      </slot>
    </template>
    <template v-else-if="mode === 'disable'">
      <span class="wx-pgate-disabled" :title="'không có quyền'" aria-disabled="true">
        <slot />
      </span>
    </template>
  </template>

  <template v-else>
    <span class="wx-pgate-locked" :title="upgradeLabel" aria-disabled="true">
      <slot />
      <slot name="upgrade">
        <span class="wx-pgate-locked__hint">{{ upgradeLabel }}</span>
      </slot>
    </span>
  </template>
</template>

<style scoped>
.wx-pgate-fallback {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-muted);
  font-style: italic;
}

.wx-pgate-disabled,
.wx-pgate-locked {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-1);
  position: relative;
}
.wx-pgate-disabled :deep(*),
.wx-pgate-locked :deep(*) {
  pointer-events: none;
  opacity: 0.5;
}

.wx-pgate-locked::before {
  content: '🔒';
  font-size: 12px;
  margin-right: 2px;
  opacity: 0.7;
}

.wx-pgate-locked__hint {
  font-size: var(--wx-fs-12);
  color: var(--wx-warning-text);
  background: var(--wx-warning-bg);
  border: 1px solid var(--wx-warning-border);
  border-radius: var(--wx-radius-full);
  padding: 1px 8px;
  margin-left: var(--wx-space-1);
  letter-spacing: var(--wx-tracking-tight);
}
</style>
