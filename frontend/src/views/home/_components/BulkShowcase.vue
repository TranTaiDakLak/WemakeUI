<script setup lang="ts">
/**
 * BulkShowcase — demo "chọn nhiều, xử lý một lần": cột chữ + hai panel (danh sách đã chọn
 * và danh sách hành động + nút thực hiện).
 *
 * Đây là MOCKUP TĨNH (aria-hidden, pointer-events:none) — cố ý không có state tương tác để
 * không có nút "cụt" không làm gì. Muốn dùng thật: CTA dẫn tới trang DataGrid trong Demo Lab.
 */
import { RouterLink } from 'vue-router'
import { BaseButton } from '../../../components/common'
import { BULK } from './landing-content'
</script>

<template>
  <section class="bs">
    <div class="bs__grid">
      <div class="bs__copy" v-reveal>
        <span class="bs__eyebrow">Thao tác hàng loạt</span>
        <h2 class="bs__title">{{ BULK.title }}</h2>
        <p class="bs__lead">{{ BULK.description }}</p>
        <ul class="bs__points">
          <li>Chọn nhiều theo hàng, theo bộ lọc hoặc phím tắt</li>
          <li>Thanh hành động nổi, hiện đúng lúc có lựa chọn</li>
          <li>Xác nhận, tiến trình và hoàn tác tích hợp sẵn</li>
        </ul>
        <RouterLink to="/showcase/data/grid" class="bs__cta">
          <BaseButton variant="primary">{{ BULK.cta }} →</BaseButton>
        </RouterLink>
      </div>

      <div class="bs__panels" aria-hidden="true" v-reveal="120">
        <div class="bs__panel">
          <div class="bs__panel-title">
            <span>{{ BULK.selectedTitle }}</span>
            <span class="bs__count">{{ BULK.selected.length }}</span>
          </div>
          <ul class="bs__list">
            <li v-for="it in BULK.selected" :key="it.id" class="bs__item">
              <span class="bs__box">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span class="bs__meta"><span class="bs__name">{{ it.name }}</span><span class="bs__id">{{ it.id }}</span></span>
            </li>
          </ul>
        </div>

        <div class="bs__panel">
          <div class="bs__panel-title"><span>{{ BULK.actionsTitle }}</span></div>
          <ul class="bs__actions">
            <li v-for="(a, i) in BULK.actions" :key="a" class="bs__action" :class="{ 'bs__action--on': i === 0 }">
              <span class="bs__radio" />{{ a }}
            </li>
          </ul>
          <span class="bs__run">{{ BULK.runLabel }} ({{ BULK.selected.length }})</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bs { max-width: 1200px; margin: 0 auto; padding: var(--wx-space-9) var(--wx-space-5); }
.bs__grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: var(--wx-space-8); align-items: center; }
.bs__eyebrow { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-bold); letter-spacing: 0.1em; text-transform: uppercase; color: var(--wx-brand-primary); }
.bs__title { margin: 10px 0 0; font-size: var(--wx-fs-32); font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
.bs__lead { margin: 14px 0 0; font-size: 15.5px; line-height: 1.7; color: var(--wx-text-secondary); }
.bs__points { list-style: none; margin: var(--wx-space-4) 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.bs__points li { position: relative; padding-left: 24px; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }
.bs__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 5px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--wx-shell-grad-solid);
  box-shadow: 0 0 0 3px var(--wx-shell-tone-brand-bg);
}
.bs__cta { display: inline-block; margin-top: var(--wx-space-5); text-decoration: none; }

.bs__panels { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: var(--wx-space-4); pointer-events: none; user-select: none; }
.bs__panel {
  padding: var(--wx-space-4);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-base);
  box-shadow: var(--wx-shadow-lg);
}
.bs__panel-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--wx-space-3); font-size: 11px; font-weight: var(--wx-fw-bold); letter-spacing: 0.06em; text-transform: uppercase; color: var(--wx-text-muted); }
.bs__count { min-width: 20px; padding: 1px 7px; border-radius: var(--wx-radius-full); background: var(--wx-shell-tone-brand-bg); color: var(--wx-shell-tone-brand-fg); text-align: center; letter-spacing: 0; }
.bs__list, .bs__actions { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.bs__item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--wx-radius-md); background: var(--wx-shell-rail-active-bg); border: 1px solid var(--wx-shell-tone-brand-bd); }
.bs__box { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 5px; background: var(--wx-brand-600); color: var(--wx-text-on-brand); flex-shrink: 0; }
.bs__meta { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
.bs__name { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bs__id { font-family: var(--wx-font-mono); font-size: 11px; color: var(--wx-text-muted); }
.bs__action { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: var(--wx-radius-md); border: 1px solid var(--wx-border-default); font-size: var(--wx-fs-13); font-weight: var(--wx-fw-semibold); color: var(--wx-text-secondary); }
.bs__radio { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid var(--wx-border-default); flex-shrink: 0; }
.bs__action--on { border-color: var(--wx-brand-400); background: var(--wx-shell-rail-active-bg); color: var(--wx-shell-rail-active-fg); }
.bs__action--on .bs__radio { border-color: var(--wx-brand-primary); background: radial-gradient(circle, var(--wx-brand-primary) 38%, transparent 42%); }
.bs__run {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  margin-top: var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  background: var(--wx-shell-grad-solid);
  color: var(--wx-text-on-brand);
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-bold);
  box-shadow: var(--wx-shadow-brand);
}

@media (max-width: 960px) {
  .bs__grid { grid-template-columns: 1fr; gap: var(--wx-space-6); }
}
@media (max-width: 560px) {
  .bs__panels { grid-template-columns: 1fr; }
  .bs__title { font-size: 26px; }
}
</style>
