<script setup lang="ts">
/**
 * DemoBlock — khối tài liệu chuẩn: preview live (slot) + code Vue (toggle) cạnh nhau.
 * Mọi trang docs component dùng block này để đảm bảo demo + code đồng nhất.
 */
import { ref } from 'vue'
import CodeBlock from './CodeBlock.vue'

withDefaults(defineProps<{
  title?: string
  description?: string
  code: string
  /** Hiện code mặc định (mặc định ẩn, click để mở). */
  open?: boolean
  /** Padding nội dung preview. */
  padded?: boolean
}>(), {
  open: false,
  padded: true,
})

const show = ref(false)
</script>

<template>
  <section class="demo-block">
    <header v-if="title || description" class="demo-block__head">
      <h3 v-if="title" class="demo-block__title">{{ title }}</h3>
      <p v-if="description" class="demo-block__desc">{{ description }}</p>
    </header>

    <div class="demo-block__frame">
      <div class="demo-block__preview" :class="{ 'is-padded': padded }">
        <slot />
      </div>

      <div class="demo-block__toolbar">
        <button type="button" class="demo-block__toggle" @click="show = open ? show : !show">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span>{{ (open || show) ? 'Ẩn code' : 'Xem code' }}</span>
        </button>
      </div>

      <Transition name="demo-code">
        <div v-if="open || show" class="demo-block__code">
          <CodeBlock :code="code" lang="vue" />
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.demo-block {
  margin: 0 0 28px;
}
.demo-block__head {
  margin-bottom: 12px;
}
.demo-block__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--wx-text-primary);
}
.demo-block__desc {
  margin: 4px 0 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--wx-text-secondary);
}
.demo-block__frame {
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  overflow: hidden;
  background: var(--wx-surface-base);
}
.demo-block__preview {
  background:
    linear-gradient(45deg, color-mix(in srgb, var(--wx-surface-sunken) 60%, transparent) 25%, transparent 25%, transparent 75%, color-mix(in srgb, var(--wx-surface-sunken) 60%, transparent) 75%),
    linear-gradient(45deg, color-mix(in srgb, var(--wx-surface-sunken) 60%, transparent) 25%, transparent 25%, transparent 75%, color-mix(in srgb, var(--wx-surface-sunken) 60%, transparent) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}
.demo-block__preview.is-padded {
  padding: 28px 24px;
}
.demo-block__toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 6px 8px;
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-elevated);
}
.demo-block__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border: none;
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-text-secondary);
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--wx-font-primary);
  cursor: pointer;
  transition: background var(--wx-d-fast, 150ms) ease, color var(--wx-d-fast, 150ms) ease;
}
.demo-block__toggle:hover {
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
}
.demo-block__code {
  border-top: 1px solid var(--wx-border-subtle);
}
.demo-block__code :deep(.code-block) {
  border: none;
  border-radius: 0;
}

/* transition */
.demo-code-enter-active,
.demo-code-leave-active {
  transition: opacity var(--wx-d-fast, 150ms) ease;
}
.demo-code-enter-from,
.demo-code-leave-to { opacity: 0; }
</style>
