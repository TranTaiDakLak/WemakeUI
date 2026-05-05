<script setup lang="ts">
/**
 * CanShow — chỉ render slot khi user có permission. (HIDDEN — theo §5.6)
 *
 *   <CanShow do="invoice.create"><BaseButton>tạo</BaseButton></CanShow>
 *   <CanShow :any="['a.read','b.read']">…</CanShow>
 *   <CanShow :all="['a.read','b.write']">…</CanShow>
 *   <CanShow do="x.y" #fallback>chưa có quyền</CanShow>
 */
import { computed } from 'vue'
import { useCan } from '../../composables/useCan'

interface Props {
  /** permission cần có */
  do?: string
  /** any of */
  any?: string[]
  /** all of */
  all?: string[]
}

const props = defineProps<Props>()
const { can, canAny, canAll } = useCan()

const allowed = computed(() => {
  if (props.do) return can(props.do)
  if (props.any) return canAny(props.any)
  if (props.all) return canAll(props.all)
  return true
})
</script>

<template>
  <slot v-if="allowed" />
  <slot v-else name="fallback" />
</template>
