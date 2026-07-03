<script setup lang="ts">
/** error/coming-soon — sắp ra mắt + countdown */
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import ErrorLayout from '../_layouts/ErrorLayout.vue'
import { BaseButton, BaseInput, BaseTag } from '../../components/common'

const target = new Date()
target.setDate(target.getDate() + 14)

const now = ref(new Date())
let timer: number | null = null
onMounted(() => {
  timer = window.setInterval(() => (now.value = new Date()), 1000) as unknown as number
})
onBeforeUnmount(() => { if (timer) window.clearInterval(timer) })

const remain = computed(() => {
  const diff = Math.max(0, target.getTime() - now.value.getTime())
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  const secs = Math.floor((diff % 60_000) / 1000)
  return { days, hours, mins, secs }
})

const email = ref('')
const subscribed = ref(false)
function subscribe() {
  if (email.value.includes('@')) subscribed.value = true
}
</script>

<template>
  <ErrorLayout
    title="Sắp ra mắt"
    description="Chúng tôi đang chuẩn bị một thứ thú vị. Còn ít ngày nữa thôi — đăng ký để biết đầu tiên."
    variant="dark"
  >
    <template #illustration>
      <lord-icon
        src="https://cdn.lordicon.com/tyvtvbcy.json"
        trigger="loop"
        colors="primary:#8b5cf6,secondary:#ec4899"
        style="width: 96px; height: 96px;"
      />
    </template>

    <div class="countdown">
      <div class="cell"><span class="num">{{ remain.days }}</span><span>ngày</span></div>
      <div class="cell"><span class="num">{{ remain.hours }}</span><span>giờ</span></div>
      <div class="cell"><span class="num">{{ remain.mins }}</span><span>phút</span></div>
      <div class="cell"><span class="num">{{ remain.secs }}</span><span>giây</span></div>
    </div>

    <form v-if="!subscribed" class="sub-form" @submit.prevent="subscribe">
      <BaseInput v-model="email" type="email" placeholder="ban@congty.vn" />
      <BaseButton type="submit">Báo tôi khi ra mắt</BaseButton>
    </form>
    <BaseTag v-else size="md" variant="success" :label="`✓ đã đăng ký (${email})`" />

    <div class="social">
      <BaseButton variant="ghost">𝕏 Twitter</BaseButton>
      <BaseButton variant="ghost">in LinkedIn</BaseButton>
      <BaseButton variant="ghost">FB Facebook</BaseButton>
    </div>
  </ErrorLayout>
</template>

<style scoped>
.countdown {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--wx-space-2);
  margin: var(--wx-space-3) 0;
}
.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: var(--wx-space-3);
  border-radius: var(--wx-radius-lg);
  font-size: var(--wx-fs-12);
  color: rgba(255, 255, 255, 0.7);
}
.num {
  font-size: var(--wx-fs-32);
  font-weight: var(--wx-fw-bold);
  color: white;
  letter-spacing: var(--wx-tracking-tight);
  font-variant-numeric: tabular-nums;
}

.sub-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--wx-space-2);
  width: 100%;
  margin-top: var(--wx-space-2);
}

.social {
  display: flex;
  gap: var(--wx-space-2);
  margin-top: var(--wx-space-3);
  flex-wrap: wrap;
  justify-content: center;
}
</style>
