<script setup lang="ts">
/**
 * PricingPlans — bảng giá hỗ trợ dạng 3 thẻ, chuyển Tháng / Năm (state cục bộ, không thanh toán).
 * Layout lấy từ PricingSection của MindAds: toggle chu kỳ, thẻ nổi bật ở giữa có badge,
 * danh sách tick, nút CTA. Chỉ là mock giao diện — không có checkout thật.
 */
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { PLANS } from './landing-content'

const yearly = ref(false)

const fmt = new Intl.NumberFormat('vi-VN')
function priceOf(p: (typeof PLANS)[number]): string {
  const v = yearly.value ? p.yearly : p.monthly
  if (v === null) return 'Liên hệ'
  if (v === 0) return '0đ'
  return `${fmt.format(v)}đ`
}
const unit = computed(() => (yearly.value ? '/ năm' : '/ tháng'))
</script>

<template>
  <section id="lp-pricing" class="pp">
    <div class="pp__head" v-reveal>
      <span class="pp__eyebrow">Bảng giá hỗ trợ</span>
      <h2 class="pp__title">Miễn phí để bắt đầu, hỗ trợ khi bạn cần mở rộng</h2>
      <p class="pp__lead">Thư viện luôn miễn phí theo giấy phép MIT. Các gói bên dưới chỉ là dịch vụ đi kèm.</p>

      <div class="pp__toggle" role="group" aria-label="Chu kỳ thanh toán">
        <button type="button" class="pp__tbtn" :class="{ 'is-on': !yearly }" :aria-pressed="!yearly" @click="yearly = false">Tháng</button>
        <button type="button" class="pp__tbtn" :class="{ 'is-on': yearly }" :aria-pressed="yearly" @click="yearly = true">
          Năm <span class="pp__save">-17%</span>
        </button>
      </div>
    </div>

    <div class="pp__grid">
      <article
        v-for="(p, i) in PLANS"
        :key="p.key"
        class="pp__card"
        :class="{ 'pp__card--hl': p.highlight }"
        v-reveal="i * 90"
      >
        <span v-if="p.badge" class="pp__badge">{{ p.badge }}</span>
        <h3 class="pp__name">{{ p.name }}</h3>
        <p class="pp__tag">{{ p.tagline }}</p>

        <div class="pp__price">
          <span class="pp__amount">{{ priceOf(p) }}</span>
          <span v-if="(yearly ? p.yearly : p.monthly) !== null && (yearly ? p.yearly : p.monthly) !== 0" class="pp__unit">{{ unit }}</span>
        </div>

        <RouterLink :to="p.key === 'enterprise' ? '/landing/contact' : '/lab'" class="pp__cta" :class="{ 'pp__cta--primary': p.highlight }">
          {{ p.cta }}
        </RouterLink>

        <ul class="pp__list">
          <li v-for="f in p.features" :key="f">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{{ f }}</span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.pp { max-width: 1200px; margin: 0 auto; padding: var(--wx-space-9) var(--wx-space-5); }
.pp__head { text-align: center; max-width: 720px; margin: 0 auto var(--wx-space-7); }
.pp__eyebrow { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--wx-brand-primary); }
.pp__title { margin: 10px 0 0; font-size: var(--wx-fs-32); font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
.pp__lead { margin: 12px 0 0; font-size: 15.5px; line-height: 1.65; color: var(--wx-text-secondary); }

.pp__toggle { display: inline-flex; margin-top: var(--wx-space-5); padding: 4px; gap: 2px; border-radius: var(--wx-radius-full); background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-default); }
.pp__tbtn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 18px; border: 0; border-radius: var(--wx-radius-full); background: transparent; color: var(--wx-text-secondary); font: inherit; font-size: var(--wx-fs-13); font-weight: var(--wx-fw-bold); cursor: pointer; transition: background var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard); }
.pp__tbtn:hover { color: var(--wx-text-primary); }
.pp__tbtn.is-on { background: var(--wx-surface-base); color: var(--wx-brand-primary); box-shadow: var(--wx-shadow-sm); }
.pp__tbtn:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }
.pp__save { padding: 1px 7px; border-radius: var(--wx-radius-full); background: var(--wx-shell-tone-success-bg); color: var(--wx-shell-tone-success-fg); font-size: 10.5px; }

.pp__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--wx-space-5); align-items: stretch; }
.pp__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding: var(--wx-space-6) var(--wx-space-5);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-2xl);
  background: var(--wx-surface-base);
  box-shadow: var(--wx-shadow-md);
  transition: transform var(--wx-d-normal) var(--wx-ease-bounce), box-shadow var(--wx-d-normal) var(--wx-ease-standard);
}
.pp__card:hover { transform: translateY(-5px); box-shadow: var(--wx-shadow-xl); }
.pp__card--hl {
  border-color: var(--wx-brand-primary);
  box-shadow: 0 0 0 1px var(--wx-brand-primary), var(--wx-shadow-xl);
  background: linear-gradient(180deg, color-mix(in srgb, var(--wx-brand-primary) 6%, var(--wx-surface-base)) 0%, var(--wx-surface-base) 38%);
}
.pp__badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 4px 14px; border-radius: var(--wx-radius-full); background: var(--wx-shell-grad-solid); color: var(--wx-text-on-brand); font-size: 11px; font-weight: var(--wx-fw-bold); letter-spacing: 0.05em; text-transform: uppercase; box-shadow: var(--wx-shadow-brand); }
.pp__name { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em; }
.pp__tag { margin: 0; font-size: var(--wx-fs-13); color: var(--wx-text-muted); }
.pp__price { display: flex; align-items: baseline; gap: 6px; margin: var(--wx-space-2) 0; }
.pp__amount { font-size: 34px; font-weight: 800; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.pp__unit { font-size: var(--wx-fs-13); color: var(--wx-text-muted); font-weight: var(--wx-fw-medium); }

.pp__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-bold);
  text-decoration: none;
  transition: background var(--wx-d-fast) var(--wx-ease-standard), border-color var(--wx-d-fast) var(--wx-ease-standard), transform var(--wx-d-fast) var(--wx-ease-standard);
}
.pp__cta:hover { background: var(--wx-hover-bg); border-color: var(--wx-brand-400); transform: translateY(-1px); }
.pp__cta--primary { background: var(--wx-shell-grad-solid); color: var(--wx-text-on-brand); border-color: transparent; box-shadow: var(--wx-shadow-brand); }
.pp__cta--primary:hover { background: var(--wx-shell-grad-solid); filter: brightness(0.95); border-color: transparent; }
.pp__cta:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 2px; }

.pp__list { list-style: none; margin: var(--wx-space-2) 0 0; padding: var(--wx-space-4) 0 0; border-top: 1px solid var(--wx-border-subtle); display: flex; flex-direction: column; gap: 10px; }
.pp__list li { display: flex; align-items: flex-start; gap: 8px; font-size: var(--wx-fs-13); line-height: 1.5; color: var(--wx-text-secondary); }
.pp__list svg { flex-shrink: 0; margin-top: 3px; color: var(--wx-success-solid); }

@media (max-width: 960px) {
  .pp__grid { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; gap: var(--wx-space-6); }
}
@media (max-width: 560px) { .pp__title { font-size: 26px; } }
@media (prefers-reduced-motion: reduce) { .pp__card, .pp__cta { transition: none; } }
</style>
