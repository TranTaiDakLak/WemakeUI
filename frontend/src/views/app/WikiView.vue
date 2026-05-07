<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseInput, BaseButton } from '../../components/common'

const search = ref('')
const activeDoc = ref('bắt đầu')

const DOCS = [
  { id: 'bat-dau', label: 'Bắt đầu', icon: '🚀', children: [
    { id: 'cai-dat', label: 'Cài đặt' },
    { id: 'cau-hinh', label: 'Cấu hình' },
    { id: 'bat-dau', label: 'Bắt đầu nhanh' },
  ]},
  { id: 'components', label: 'Components', icon: '🧩', children: [
    { id: 'button', label: 'BaseButton' },
    { id: 'input', label: 'BaseInput' },
    { id: 'modal', label: 'BaseModal' },
  ]},
  { id: 'api', label: 'API Reference', icon: '📖', children: [
    { id: 'auth', label: 'Authentication' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'webhooks', label: 'Webhooks' },
  ]},
  { id: 'deploy', label: 'Triển khai', icon: '☁️', children: [
    { id: 'docker', label: 'Docker' },
    { id: 'vercel', label: 'Vercel' },
    { id: 'cloudflare', label: 'Cloudflare Pages' },
  ]},
]

const CONTENT: Record<string, { title: string; body: string }> = {
  'bat-dau': {
    title: 'Bắt đầu nhanh',
    body: `
## Cài đặt

\`\`\`bash
npm install @wemake/ui
\`\`\`

## Import

\`\`\`ts
import { BaseButton, useToast } from '@wemake/ui'
import '@wemake/ui/style.css'
\`\`\`

## Sử dụng component đầu tiên

\`\`\`vue
<template>
  <BaseButton variant="primary" @click="sayHello">
    Chào thế giới!
  </BaseButton>
</template>
\`\`\`

## Tiếp theo

- Xem [danh sách component](/app/wiki)
- Đọc [API Reference](/app/wiki)
- Thử [playground](/showcase)
    `.trim(),
  },
  'button': {
    title: 'BaseButton',
    body: `
## Mô tả

Button cơ bản với đầy đủ variant, size, trạng thái loading và disabled.

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| variant | string | 'primary' | primary / secondary / ghost / danger / success |
| size | string | 'md' | sm / md / lg |
| loading | boolean | false | Hiện spinner + disable |
| disabled | boolean | false | Vô hiệu hoá |
| block | boolean | false | Chiếm full width |

## Ví dụ

\`\`\`vue
<BaseButton variant="primary" @click="submit">
  Lưu thay đổi
</BaseButton>
<BaseButton variant="ghost" loading>
  Đang xử lý...
</BaseButton>
\`\`\`
    `.trim(),
  },
}

function renderMd(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>').replace(/$/, '</p>')
    .replace(/```[\w]*\n([\s\S]*?)```/gm, '<pre><code>$1</code></pre>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h)/g, '$1')
    .replace(/<\/h\d>(<\/p>)/g, '')
}

const doc = computed(() => CONTENT[activeDoc.value] || { title: activeDoc.value, body: '<p>Tài liệu đang được biên soạn...</p>' })

import { computed } from 'vue'
</script>

<template>
  <AppPageLayout section="app" current="wiki" page-title="Wiki / Tài liệu" page-description="Tài liệu hướng dẫn sử dụng và API reference">
    <template #actions>
      <BaseButton size="sm" variant="ghost">Chỉnh sửa trang</BaseButton>
    </template>

    <div class="wiki-layout">
      <aside class="wiki-nav">
        <BaseInput v-model="search" placeholder="Tìm tài liệu..." size="sm" />
        <nav class="wiki-tree">
          <div v-for="section in DOCS" :key="section.id" class="tree-section">
            <span class="tree-section-label">{{ section.icon }} {{ section.label }}</span>
            <ul class="tree-children">
              <li
                v-for="child in section.children" :key="child.id"
                class="tree-item" :class="{ active: activeDoc === child.id }"
                @click="activeDoc = child.id"
              >
                {{ child.label }}
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <article class="wiki-article">
        <h1 class="article-title">{{ doc.title }}</h1>
        <div class="article-body" v-html="renderMd(doc.body)" />
      </article>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.wiki-layout { display: grid; grid-template-columns: 220px 1fr; gap: var(--wx-space-6); align-items: start; }
@media (max-width: 768px) { .wiki-layout { grid-template-columns: 1fr; } }

.wiki-nav { position: sticky; top: 72px; display: flex; flex-direction: column; gap: var(--wx-space-4); }
.wiki-tree { display: flex; flex-direction: column; gap: var(--wx-space-3); margin-top: var(--wx-space-2); }
.tree-section { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.tree-section-label { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); text-transform: uppercase; letter-spacing: 0.08em; padding: var(--wx-space-1) 0; }
.tree-children { list-style: none; margin: 0; padding: 0 0 0 var(--wx-space-3); display: flex; flex-direction: column; gap: 2px; }
.tree-item { font-size: var(--wx-fs-14); padding: var(--wx-space-2) var(--wx-space-3); border-radius: var(--wx-radius-md); cursor: pointer; color: var(--wx-content-secondary); transition: all var(--wx-d-micro); }
.tree-item:hover { background: var(--wx-hover-bg); color: var(--wx-content-primary); }
.tree-item.active { background: var(--wx-brand-50); color: var(--wx-brand-600); font-weight: var(--wx-fw-medium); }

.article-title { font-size: var(--wx-fs-32); font-weight: var(--wx-fw-bold); letter-spacing: var(--wx-tracking-tight); margin: 0 0 var(--wx-space-5); }
.article-body { font-size: var(--wx-fs-15); line-height: var(--wx-lh-relaxed); color: var(--wx-content-primary); }
.article-body :deep(h2) { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); margin: var(--wx-space-6) 0 var(--wx-space-3); letter-spacing: var(--wx-tracking-tight); }
.article-body :deep(code) { font-family: var(--wx-font-mono); font-size: 0.9em; background: var(--wx-bg-sunken); padding: 2px 6px; border-radius: var(--wx-radius-sm); }
.article-body :deep(pre) { background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); padding: var(--wx-space-4); overflow-x: auto; margin: var(--wx-space-3) 0; }
.article-body :deep(pre code) { background: none; padding: 0; font-size: var(--wx-fs-13); }
.article-body :deep(strong) { font-weight: var(--wx-fw-semibold); }
</style>
