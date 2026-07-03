<script setup lang="ts">
/**
 * CodeBlock — hiển thị code có nút copy. Không phụ thuộc thư viện highlight ngoài.
 * Dùng trong DemoBlock và trang Getting Started.
 */
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  code: string
  lang?: string
}>(), {
  lang: 'vue',
})

const copied = ref(false)

async function copy() {
  const text = props.code
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    } else if (typeof document !== 'undefined') {
      // Fallback cho môi trường không có Clipboard API (desktop webview cũ…)
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    copied.value = true
    setTimeout(() => { copied.value = false }, 1600)
  } catch {
    /* no-op — copy không khả dụng */
  }
}
</script>

<template>
  <div class="code-block">
    <div class="code-block__bar">
      <span class="code-block__lang">{{ lang }}</span>
      <button type="button" class="code-block__copy" :data-copied="copied" @click="copy">
        <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span>{{ copied ? 'Đã copy' : 'Copy' }}</span>
      </button>
    </div>
    <pre class="code-block__pre"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.code-block {
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
  background: #0f172a;
}
.code-block__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 6px 14px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.code-block__lang {
  font-family: var(--wx-font-mono);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8;
}
.code-block__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--wx-radius-md);
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--wx-font-primary);
  cursor: pointer;
  transition: background var(--wx-d-fast, 150ms) ease, color var(--wx-d-fast, 150ms) ease;
}
.code-block__copy:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }
.code-block__copy[data-copied="true"] {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.4);
}
.code-block__pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: var(--wx-font-mono);
  font-size: 13px;
  line-height: 1.65;
  color: #e2e8f0;
  tab-size: 2;
}
.code-block__pre code {
  font-family: inherit;
  white-space: pre;
}
</style>
