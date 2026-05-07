<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  partners?: { name: string; logo: string }[]
}>()

const paused = ref(false)

const DEFAULT_PARTNERS = [
  { name: 'Viettel', logo: '🔵' },
  { name: 'VNPT', logo: '🟡' },
  { name: 'Shopee', logo: '🟠' },
  { name: 'Lazada', logo: '🟣' },
  { name: 'Tiki', logo: '🔵' },
  { name: 'MoMo', logo: '🩷' },
  { name: 'VNPay', logo: '🔴' },
  { name: 'ZaloPay', logo: '🔵' },
  { name: 'Grab', logo: '🟢' },
  { name: 'Be Group', logo: '🟡' },
  { name: 'FPT', logo: '🟠' },
  { name: 'CMC', logo: '🔵' },
]
</script>

<template>
  <section class="pl-section">
    <p class="pl-label">Tin dùng bởi các doanh nghiệp hàng đầu Việt Nam</p>
    <div class="pl-track-wrap" @mouseenter="paused = true" @mouseleave="paused = false">
      <div class="pl-track" :class="{ 'pl-track--paused': paused }">
        <!-- duplicated for infinite loop effect -->
        <template v-for="pass in 2" :key="pass">
          <div
            v-for="p in (partners ?? DEFAULT_PARTNERS)"
            :key="`${pass}-${p.name}`"
            class="pl-item"
          >
            <span class="pl-item__logo">{{ p.logo }}</span>
            <span class="pl-item__name">{{ p.name }}</span>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pl-section {
  padding: var(--wx-space-9) 0;
  overflow: hidden;
  background: var(--wx-brand-50);
  border-top: 1px solid var(--wx-brand-100);
  border-bottom: 1px solid var(--wx-brand-100);
}
.pl-label {
  text-align: center;
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  margin: 0 0 var(--wx-space-6);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--wx-fw-semibold);
}
.pl-track-wrap {
  position: relative;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
.pl-track {
  display: flex;
  width: max-content;
  animation: pl-scroll 32s linear infinite;
  gap: var(--wx-space-8);
}
.pl-track--paused { animation-play-state: paused; }

@keyframes pl-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .pl-track { animation: none; }
}

.pl-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--wx-space-3) var(--wx-space-5);
  border-radius: var(--wx-radius-lg);
  border: 1px solid var(--wx-brand-100);
  background: var(--wx-surface-base);
  white-space: nowrap;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
  cursor: default;
  filter: grayscale(0.5) opacity(0.75);
}
.pl-item:hover {
  filter: grayscale(0) opacity(1);
  box-shadow: 0 4px 16px rgba(37,99,235,0.12);
  border-color: var(--wx-brand-200);
  transform: translateY(-2px);
}
.pl-item__logo { font-size: 20px; }
.pl-item__name { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
</style>
