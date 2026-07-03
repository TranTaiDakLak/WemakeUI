<script setup lang="ts">
/**
 * DocPage — khung chuẩn cho một trang tài liệu component:
 * header (category · tên · mô tả) + dòng import + nội dung (slot).
 */
import CodeBlock from './CodeBlock.vue'

const props = withDefaults(defineProps<{
  name: string
  category?: string
  description?: string
  /** Tên các symbol import, ví dụ ['BaseButton']. Bỏ trống nếu không hiện import. */
  imports?: string[]
  importFrom?: string
}>(), {
  importFrom: '@wemake/ui',
  imports: () => [],
})

const importLine = props.imports.length
  ? `import { ${props.imports.join(', ')} } from '${props.importFrom}'`
  : ''
</script>

<template>
  <article class="doc-page">
    <header class="doc-page__head">
      <span v-if="category" class="doc-page__cat">{{ category }}</span>
      <h1 class="doc-page__title">{{ name }}</h1>
      <p v-if="description" class="doc-page__desc">{{ description }}</p>
    </header>

    <div v-if="importLine" class="doc-page__import">
      <CodeBlock :code="importLine" lang="ts" />
    </div>

    <div class="doc-page__body">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.doc-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 40px 32px 96px;
}
.doc-page__cat {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-brand-primary);
  margin-bottom: 8px;
}
.doc-page__title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--wx-text-primary);
}
.doc-page__desc {
  margin: 10px 0 0;
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--wx-text-secondary);
  max-width: 640px;
}
.doc-page__import {
  margin: 24px 0 36px;
}
.doc-page__body :deep(h2) {
  font-size: 20px;
  font-weight: 700;
  color: var(--wx-text-primary);
  margin: 40px 0 16px;
  padding-top: 12px;
  border-top: 1px solid var(--wx-border-subtle);
}
.doc-page__body :deep(h2:first-child) {
  border-top: none;
  padding-top: 0;
  margin-top: 0;
}
.doc-page__body :deep(p) {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--wx-text-secondary);
  margin: 0 0 16px;
}
.doc-page__body :deep(code.inline) {
  font-family: var(--wx-font-mono);
  font-size: 12.5px;
  padding: 2px 6px;
  border-radius: var(--wx-radius-sm);
  background: var(--wx-surface-sunken);
  color: var(--wx-brand-primary);
}

@media (max-width: 640px) {
  .doc-page { padding: 28px 16px 72px; }
  .doc-page__title { font-size: 26px; }
}
</style>
