<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import { BaseButton } from '../../components/common'

interface UploadFile {
  id: number
  name: string
  size: number
  type: string
  progress: number
  done: boolean
  error: boolean
}

const showCode  = ref(false)
const dragOver  = ref(false)
const files     = ref<UploadFile[]>([])
let nextId      = 1

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragOver.value = true
}
function onDragLeave() { dragOver.value = false }

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
}

function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) addFiles(input.files)
  input.value = ''
}

function addFiles(fileList: FileList) {
  for (const f of Array.from(fileList)) {
    const entry: UploadFile = {
      id: nextId++, name: f.name, size: f.size,
      type: f.type, progress: 0, done: false, error: false,
    }
    files.value.push(entry)
    simulateUpload(entry)
  }
}

function simulateUpload(entry: UploadFile) {
  const interval = setInterval(() => {
    const file = files.value.find(f => f.id === entry.id)
    if (!file) { clearInterval(interval); return }
    file.progress = Math.min(100, file.progress + Math.random() * 20 + 5)
    if (file.progress >= 100) {
      file.progress = 100
      file.done = true
      clearInterval(interval)
    }
  }, 150)
}

function removeFile(id: number) {
  files.value = files.value.filter(f => f.id !== id)
}

function fileIcon(type: string): string {
  if (type.startsWith('image/')) return '🖼'
  if (type === 'application/pdf') return '📄'
  if (type.includes('zip') || type.includes('archive')) return '🗜'
  if (type.startsWith('video/')) return '🎬'
  return '📎'
}
</script>

<template>
  <div class="fp">
    <AppTopbar title="WemakeUI" subtitle="forms — file upload" />
    <main class="fp__main">

      <div class="fp__hdr">
        <h1 class="fp__title">File Upload</h1>
        <p class="fp__desc">
          Drag &amp; drop zone với progress bar giả lập, danh sách file đã chọn, icon theo loại file. Không dùng thư viện — thuần HTML5 drag events + CSS.
        </p>
      </div>

      <!-- Drop zone -->
      <div class="fp__card">
        <p class="fp__card-title">Drop Zone</p>
        <label
          class="fu-zone"
          :class="{ 'fu-zone--over': dragOver }"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
        >
          <input type="file" multiple class="fu-zone__input" @change="onFileInput" />
          <div class="fu-zone__icon">
            <svg width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p class="fu-zone__text">Kéo thả file vào đây, hoặc <span class="fu-zone__link">chọn từ máy</span></p>
          <p class="fu-zone__sub">PNG, JPG, PDF, ZIP — tối đa 10 MB mỗi file</p>
        </label>

        <!-- File list -->
        <TransitionGroup name="fu-list" tag="div" class="fu-list">
          <div v-for="f in files" :key="f.id" class="fu-item">
            <span class="fu-item__icon">{{ fileIcon(f.type) }}</span>
            <div class="fu-item__info">
              <div class="fu-item__name">{{ f.name }}</div>
              <div class="fu-item__meta">{{ formatSize(f.size) }}</div>
              <div class="fu-item__bar" v-if="!f.done && !f.error">
                <div class="fu-item__fill" :style="{ width: `${f.progress}%` }" />
              </div>
              <div v-else-if="f.done" class="fu-item__status fu-item__status--done">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Hoàn tất
              </div>
            </div>
            <button class="fu-item__remove" @click="removeFile(f.id)" :aria-label="`Xóa ${f.name}`">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </TransitionGroup>

        <div v-if="files.length" class="fp__actions">
          <BaseButton variant="ghost" size="sm" @click="files = []">Xóa tất cả</BaseButton>
          <BaseButton size="sm">Tải lên ({{ files.filter(f => !f.done).length }} chờ)</BaseButton>
        </div>
      </div>

      <!-- How it works -->
      <div class="fp__card fp__card--info">
        <p class="fp__card-title">Cách hoạt động</p>
        <ul class="fp__list">
          <li>Drop zone dùng <code>&lt;label&gt;</code> bao <code>&lt;input type="file" hidden&gt;</code> để click mở dialog</li>
          <li>HTML5 drag events: <code>dragover.prevent</code> → <code>drop</code> → <code>e.dataTransfer.files</code></li>
          <li><code>simulateUpload</code> dùng <code>setInterval</code> tăng dần <code>progress</code> để minh họa</li>
          <li><code>TransitionGroup</code> animate thêm/xóa file trong danh sách</li>
        </ul>
      </div>

      <!-- Code -->
      <div class="fp__card">
        <div class="fp__code-head">
          <p class="fp__card-title" style="margin:0">Code snippet</p>
          <button class="fp__code-toggle" @click="showCode = !showCode">{{ showCode ? '▲ Ẩn' : '▼ Hiện' }}</button>
        </div>
        <div v-if="showCode" class="fp__code">
<pre>&lt;!-- Drop zone (label wraps hidden input) --&gt;
&lt;label class="fu-zone"
  @dragover.prevent="dragOver = true"
  @dragleave="dragOver = false"
  @drop.prevent="onDrop"
&gt;
  &lt;input type="file" multiple hidden @change="onFileInput" /&gt;
  &lt;p&gt;Kéo thả hoặc &lt;span&gt;chọn từ máy&lt;/span&gt;&lt;/p&gt;
&lt;/label&gt;

// Handler
function onDrop(e: DragEvent) {
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
}

/* Drop zone CSS */
.fu-zone {
  border: 2px dashed var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: all var(--wx-d-fast) var(--wx-ease-standard);
}
.fu-zone--over {
  border-color: var(--wx-brand-primary);
  background: color-mix(in srgb, var(--wx-brand-primary) 5%, transparent);
}

/* Progress bar */
.fu-item__bar { height: 3px; background: var(--wx-border-subtle); border-radius: 2px; overflow: hidden; }
.fu-item__fill {
  height: 100%; background: var(--wx-brand-primary);
  transition: width var(--wx-d-micro, 100ms) linear;
}</pre>
        </div>
        <div class="fp__meta">
          <span class="fp__meta-label">Patterns:</span>
          <span v-for="p in ['DragDrop','FileInput','ProgressBar','TransitionGroup']" :key="p" class="fp__chip">{{ p }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fp { min-height: 100vh; background: var(--wx-surface-sunken); }
.fp__main { max-width: 720px; margin: 0 auto; padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-10); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__hdr { margin-top: var(--wx-space-2); }
.fp__title { margin: 0 0 4px; font-size: var(--wx-fs-22); font-weight: var(--wx-fw-bold); color: var(--wx-text-primary); }
.fp__desc  { margin: 0; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); line-height: 1.6; }
.fp__card { background: var(--wx-surface-elevated); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-4); }
.fp__card--info { background: color-mix(in srgb, var(--wx-brand-primary) 5%, var(--wx-surface-elevated)); border-color: color-mix(in srgb, var(--wx-brand-primary) 20%, transparent); }
.fp__card-title { margin: 0; font-size: var(--wx-fs-11); font-weight: var(--wx-fw-bold); text-transform: uppercase; letter-spacing: .6px; color: var(--wx-text-muted); }
.fp__actions { display: flex; justify-content: flex-end; gap: var(--wx-space-2); }
.fp__list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.fp__list li { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); line-height: 1.5; }
.fp__code-head { display: flex; align-items: center; justify-content: space-between; }
.fp__code-toggle { background: none; border: none; font-family: var(--wx-font-primary); font-size: var(--wx-fs-12); color: var(--wx-brand-primary); cursor: pointer; }
.fp__code-toggle:hover { text-decoration: underline; }
.fp__code { background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); overflow: hidden; }
.fp__code pre { margin: 0; padding: var(--wx-space-4); font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-text-secondary); line-height: 1.65; overflow-x: auto; }
.fp__meta { display: flex; align-items: center; gap: var(--wx-space-2); flex-wrap: wrap; padding-top: var(--wx-space-2); border-top: 1px solid var(--wx-border-subtle); }
.fp__meta-label { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.fp__chip { display: inline-flex; padding: 2px 8px; border-radius: var(--wx-radius-full); font-size: 10px; background: var(--wx-surface-sunken); border: 1px solid var(--wx-border-subtle); color: var(--wx-text-secondary); font-family: var(--wx-font-mono); }

/* Drop zone */
.fu-zone {
  display: block;
  border: 2px dashed var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color var(--wx-d-fast, 150ms), background var(--wx-d-fast, 150ms);
}
.fu-zone:hover,
.fu-zone--over {
  border-color: var(--wx-brand-primary);
  background: color-mix(in srgb, var(--wx-brand-primary) 5%, transparent);
}
.fu-zone__input { display: none; }
.fu-zone__icon { color: var(--wx-text-muted); margin-bottom: var(--wx-space-2); }
.fu-zone__text { margin: 0 0 4px; font-size: var(--wx-fs-14); color: var(--wx-text-secondary); }
.fu-zone__link { color: var(--wx-brand-primary); text-decoration: underline; }
.fu-zone__sub  { margin: 0; font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

/* File list */
.fu-list { display: flex; flex-direction: column; gap: 6px; }
.fu-item {
  display: flex; align-items: center; gap: var(--wx-space-2);
  padding: var(--wx-space-2) var(--wx-space-3);
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
}
.fu-item__icon { font-size: 20px; flex-shrink: 0; }
.fu-item__info { flex: 1; min-width: 0; }
.fu-item__name { font-size: var(--wx-fs-13); color: var(--wx-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fu-item__meta { font-size: var(--wx-fs-11); color: var(--wx-text-muted); }
.fu-item__bar  { height: 3px; background: var(--wx-border-subtle); border-radius: 2px; overflow: hidden; margin-top: 4px; }
.fu-item__fill { height: 100%; background: var(--wx-brand-primary); border-radius: 2px; transition: width var(--wx-d-micro, 100ms) linear; }
.fu-item__status { display: flex; align-items: center; gap: 4px; font-size: var(--wx-fs-11); margin-top: 3px; }
.fu-item__status--done { color: #16a34a; }
.fu-item__remove {
  flex-shrink: 0; background: none; border: none; padding: 4px; cursor: pointer;
  color: var(--wx-text-muted); border-radius: var(--wx-radius-sm);
  display: flex; align-items: center; justify-content: center;
  transition: color var(--wx-d-fast, 150ms), background var(--wx-d-fast, 150ms);
}
.fu-item__remove:hover { color: var(--wx-text-primary); background: var(--wx-surface-elevated); }

/* TransitionGroup */
.fu-list-enter-active { transition: all var(--wx-d-fast, 150ms) var(--wx-ease-decelerate, cubic-bezier(0,0,.2,1)); }
.fu-list-leave-active { transition: all var(--wx-d-fast, 150ms) var(--wx-ease-accelerate, cubic-bezier(.4,0,1,1)); }
.fu-list-enter-from { opacity: 0; transform: translateY(-8px); }
.fu-list-leave-to   { opacity: 0; transform: translateX(8px); }
.fu-list-move { transition: transform var(--wx-d-fast, 150ms) var(--wx-ease-standard, cubic-bezier(.4,0,.2,1)); }

@media (prefers-reduced-motion: reduce) {
  .fu-zone { transition: none; }
  .fu-item__fill { transition: none; }
  .fu-list-enter-active, .fu-list-leave-active, .fu-list-move { transition: none; }
}
</style>
