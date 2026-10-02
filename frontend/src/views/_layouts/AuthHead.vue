<script setup lang="ts">
/**
 * AuthHead — đầu thẻ form auth: ô logo (tuỳ chọn) + eyebrow xanh viết hoa + tiêu đề + mô tả.
 * Dùng chung cho Login / Register / Forgot / Reset / OTP …
 *
 *   <AuthHead eyebrow="Chào mừng trở lại" title="Đăng nhập" description="Nhập thông tin để tiếp tục." />
 */
withDefaults(defineProps<{
  title: string
  description?: string
  eyebrow?: string
  /** SVG html — ô icon gradient trước tiêu đề (vd: khoá, thư) */
  icon?: string
  align?: 'left' | 'center'
}>(), {
  align: 'left',
})
</script>

<template>
  <header class="ah" :data-align="align">
    <span v-if="icon" class="ah__icon" aria-hidden="true" v-html="icon" />
    <span v-if="eyebrow" class="ah__eyebrow">{{ eyebrow }}</span>
    <h1 class="ah__title">{{ title }}</h1>
    <p v-if="description || $slots.default" class="ah__desc"><slot>{{ description }}</slot></p>
  </header>
</template>

<style scoped>
.ah { display: flex; flex-direction: column; gap: 6px; }
.ah[data-align='center'] { align-items: center; text-align: center; }
.ah__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 4px;
  border-radius: 14px;
  background: var(--wx-shell-tile-gradient);
  color: var(--wx-text-on-brand);
  box-shadow: var(--wx-shell-tile-shadow);
}
.ah__icon :deep(svg) { width: 22px; height: 22px; }
.ah__eyebrow {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--wx-brand-primary);
}
.ah__title {
  margin: 0;
  font-size: var(--wx-fs-28);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--wx-content-primary);
}
.ah__desc { margin: 0; font-size: var(--wx-fs-14); line-height: var(--wx-lh-normal); color: var(--wx-content-muted); }
</style>
