<script setup lang="ts">
/**
 * Phase 5 — platform / cross-platform adapter showcase.
 *
 * Hiển thị: TitleBar (mac/windows), WindowControls, OfflineBanner,
 * useOnline + mutation queue, useHoverable, useShortcut, useFocusTrap, useOptimistic.
 */
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
import TitleBar from '../../components/platform/TitleBar.vue'
import WindowControls from '../../components/platform/WindowControls.vue'
import OfflineBanner from '../../components/platform/OfflineBanner.vue'
import { useOnline } from '../../composables/useOnline'
import { useHoverable } from '../../composables/useHoverable'
import { useShortcut } from '../../composables/useShortcut'
import { useFocusTrap } from '../../composables/useFocusTrap'
import { useOptimistic } from '../../composables/useOptimistic'

/* ─── platform detect ───────────────────────────────────── */
const platform = ref<{ os: string; mobile: boolean; ua: string }>({
  os: 'unknown',
  mobile: false,
  ua: '',
})
onMounted(() => {
  if (typeof navigator === 'undefined') return
  const ua = navigator.userAgent
  let os = 'web'
  if (/Win/i.test(navigator.platform)) os = 'windows'
  else if (/Mac/i.test(navigator.platform)) os = 'macos'
  else if (/Linux/i.test(navigator.platform)) os = 'linux'
  if (/Android/i.test(ua)) os = 'android'
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'ios'
  platform.value = {
    os,
    mobile: /Mobile|Android|iPhone/i.test(ua),
    ua,
  }
})

/* ─── useHoverable ──────────────────────────────────────── */
const { hoverable } = useHoverable()

/* ─── useShortcut: cmd+k → mở palette giả ───────────────── */
const paletteOpen = ref(false)
const { label: shortcutLabel } = useShortcut('mod+k', () => {
  paletteOpen.value = true
})
useShortcut('escape', () => {
  paletteOpen.value = false
}, { blockInInput: false })

/* ─── focus trap demo ───────────────────────────────────── */
const trapRef = useTemplateRef<HTMLDivElement>('trap')
useFocusTrap(trapRef, paletteOpen, {
  onEscape: () => (paletteOpen.value = false),
})

/* ─── useOnline + mutation queue ────────────────────────── */
const { online, queue, enqueue, clear, flush } = useOnline()
const fakeOffline = ref(false)
const effectiveOnline = computed(() => online.value && !fakeOffline.value)

function addMutation() {
  enqueue({
    label: `lưu thay đổi #${queue.value.length + 1}`,
    payload: { ts: Date.now(), value: Math.random().toString(36).slice(2, 8) },
  })
}
async function tryFlush() {
  if (!effectiveOnline.value) {
    alert('vẫn offline — bật lại online trước khi flush.')
    return
  }
  const result = await flush(async (m) => {
    await new Promise((r) => setTimeout(r, 200))
    if (Math.random() < 0.15) throw new Error('giả lập fail ' + m.id)
  })
  alert(`flush xong: ${result.ok} ok, ${result.failed} fail`)
}

/* ─── useOptimistic ─────────────────────────────────────── */
const profile = useOptimistic({ name: 'Lan Nguyễn', email: 'lan@example.com' })
async function saveName(name: string, simulateFail = false) {
  await profile.run({
    optimistic: (cur) => ({ ...cur, name }),
    commit: async () => {
      await new Promise((r) => setTimeout(r, 800))
      if (simulateFail) throw new Error('máy chủ trả 500')
      return { ok: true }
    },
  })
}
const draftName = ref('Hùng Trần')
</script>

<template>
  <div class="page">
    <OfflineBanner :online="effectiveOnline" :queued="queue.length" />
    <AppTopbar title="WemakeUI" subtitle="phase 5 · platform adapter" />
    <main class="main">
      <PageHeader
        title="cross-platform adapter"
        description="TitleBar + WindowControls (desktop wrapper), OfflineBanner + mutation queue, hover↔touch detect, shortcut mod+k, focus trap, optimistic update."
      />

      <!-- platform detect -->
      <section class="card">
        <h3 class="card__title">platform detect</h3>
        <dl class="kv">
          <dt>os</dt>
          <dd><code>{{ platform.os }}</code></dd>
          <dt>mobile?</dt>
          <dd><code>{{ platform.mobile }}</code></dd>
          <dt>hoverable?</dt>
          <dd>
            <code>{{ hoverable }}</code>
            <span class="hint">— tooltip vs long-press, kebab vs always-visible…</span>
          </dd>
          <dt>shortcut</dt>
          <dd>
            <kbd>{{ shortcutLabel }}</kbd>
            <span class="hint">→ mở command palette demo bên dưới</span>
          </dd>
        </dl>
      </section>

      <!-- TitleBar mac -->
      <section class="card">
        <h3 class="card__title">TitleBar — mac (traffic lights)</h3>
        <p class="card__hint">trên web không hiện thật; <code>force=true</code> để preview. Trong Wails/Tauri/Electron auto detect.</p>
        <div class="frame">
          <TitleBar
            force
            controls-style="mac"
            controls-placement="left"
            title="WeConnect — admin"
          />
          <div class="frame__body">
            <p>nội dung app — vùng trắng phía dưới titlebar.</p>
          </div>
        </div>
      </section>

      <!-- TitleBar windows -->
      <section class="card">
        <h3 class="card__title">TitleBar — windows (controls phải)</h3>
        <div class="frame">
          <TitleBar
            force
            controls-style="windows"
            controls-placement="right"
            title="WemakeUI Studio"
          >
            <template #left>
              <span class="title-icon">▣</span>
            </template>
          </TitleBar>
          <div class="frame__body">
            <p>controls bên phải, drag region toàn bộ titlebar trừ controls + slot left/right.</p>
          </div>
        </div>
      </section>

      <!-- WindowControls -->
      <section class="card">
        <h3 class="card__title">WindowControls — riêng lẻ</h3>
        <div class="row">
          <div class="frame frame--inline">
            <span class="hint">mac:</span>
            <WindowControls style-variant="mac" />
          </div>
          <div class="frame frame--inline">
            <span class="hint">windows:</span>
            <WindowControls style-variant="windows" />
          </div>
        </div>
      </section>

      <!-- Offline / queue -->
      <section class="card">
        <h3 class="card__title">useOnline + mutation queue</h3>
        <div class="row">
          <button class="primary-btn" @click="fakeOffline = !fakeOffline">
            {{ fakeOffline ? 'bật lại online' : 'giả lập offline' }}
          </button>
          <button class="primary-btn primary-btn--ghost" @click="addMutation">
            + thêm mutation vào queue
          </button>
          <button class="primary-btn primary-btn--ghost" @click="tryFlush" :disabled="!effectiveOnline || !queue.length">
            flush queue ({{ queue.length }})
          </button>
          <button class="primary-btn primary-btn--ghost" @click="clear" :disabled="!queue.length">
            xoá queue
          </button>
        </div>
        <ul v-if="queue.length" class="queue-list">
          <li v-for="m in queue" :key="m.id">
            <code class="qid">{{ m.id }}</code>
            <span class="qlabel">{{ m.label }}</span>
            <span class="qts">{{ new Date(m.ts).toLocaleTimeString('vi-VN') }}</span>
          </li>
        </ul>
        <p v-else class="hint">queue trống — chưa có mutation nào pending.</p>
      </section>

      <!-- useShortcut + useFocusTrap -->
      <section class="card">
        <h3 class="card__title">useShortcut + useFocusTrap</h3>
        <p class="card__hint">bấm <kbd>{{ shortcutLabel }}</kbd> để mở palette. tab/shift+tab kẹt trong palette. esc để đóng.</p>
        <button class="primary-btn" @click="paletteOpen = true">mở palette thủ công</button>

        <Transition name="wx-palette-fade">
          <div v-if="paletteOpen" class="palette-backdrop" @click.self="paletteOpen = false">
            <div class="palette" ref="trap" role="dialog" aria-modal="true" aria-label="command palette">
              <input
                class="palette__input"
                type="text"
                placeholder="gõ lệnh, tệp, hoặc tài liệu…"
                autofocus
              />
              <ul class="palette__list" role="listbox">
                <li class="palette__item" tabindex="0">→ tạo hoá đơn mới</li>
                <li class="palette__item" tabindex="0">→ mời thành viên</li>
                <li class="palette__item" tabindex="0">→ chuyển tổ chức</li>
                <li class="palette__item" tabindex="0">→ xem audit log</li>
              </ul>
              <div class="palette__foot">
                <kbd>esc</kbd> để đóng · <kbd>tab</kbd> để duyệt
                <button class="palette__close" @click="paletteOpen = false">đóng</button>
              </div>
            </div>
          </div>
        </Transition>
      </section>

      <!-- useOptimistic -->
      <section class="card">
        <h3 class="card__title">useOptimistic — update trước, rollback nếu fail</h3>
        <dl class="kv">
          <dt>name (current)</dt>
          <dd><code>{{ profile.value.value.name }}</code></dd>
          <dt>pending?</dt>
          <dd><code>{{ profile.pending.value }}</code></dd>
          <dt>error</dt>
          <dd>
            <code v-if="profile.error.value">{{ String(profile.error.value) }}</code>
            <span v-else class="hint">—</span>
          </dd>
        </dl>
        <div class="row" style="margin-top: 12px;">
          <input v-model="draftName" class="text-input" />
          <button class="primary-btn" @click="saveName(draftName)">lưu (giả ok)</button>
          <button class="primary-btn primary-btn--ghost" @click="saveName(draftName, true)">lưu (giả fail → rollback)</button>
        </div>
        <p class="hint">↑ click "lưu giả fail" để thấy UI optimistic đổi 800ms → rollback về giá trị cũ.</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
  font-family: var(--wx-font-primary);
}
.main {
  max-width: 980px;
  margin: 0 auto;
  padding: var(--wx-space-5) var(--wx-space-4) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}

.card {
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  padding: var(--wx-space-4) var(--wx-space-5);
  box-shadow: var(--wx-shadow-sm);
}
.card__title {
  margin: 0 0 var(--wx-space-2);
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}
.card__hint {
  margin: 0 0 var(--wx-space-3);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
}

.kv {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--wx-space-2) var(--wx-space-3);
  margin: 0;
  font-size: var(--wx-fs-13);
}
.kv dt { color: var(--wx-text-muted); }
.kv dd { margin: 0; }

code {
  font-family: var(--wx-font-mono);
  font-size: 0.9em;
  background: var(--wx-surface-sunken);
  padding: 1px 6px;
  border-radius: var(--wx-radius-sm);
  color: var(--wx-text-secondary);
}
kbd {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  padding: 1px 8px;
  border-radius: var(--wx-radius-sm);
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  box-shadow: 0 1px 0 var(--wx-border-subtle);
  color: var(--wx-text-secondary);
}

.row { display: flex; gap: var(--wx-space-2); flex-wrap: wrap; align-items: center; }

.frame {
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
  background: var(--wx-surface-base);
}
.frame__body {
  padding: var(--wx-space-5);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
  background: var(--wx-surface-sunken);
}
.frame--inline {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-2) var(--wx-space-3);
  border-radius: var(--wx-radius-md);
}

.title-icon {
  font-size: var(--wx-fs-15);
  color: var(--wx-brand-primary);
  margin-left: var(--wx-space-1);
}

.primary-btn {
  font-family: inherit;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  padding: 6px 14px;
  border-radius: var(--wx-radius-md);
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border: 1px solid var(--wx-brand-primary);
  cursor: pointer;
  transition: filter var(--wx-d-micro) var(--wx-ease-standard);
}
.primary-btn:hover { filter: brightness(0.95); }
.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.primary-btn:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}
.primary-btn--ghost {
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  border-color: var(--wx-border-default);
}
.primary-btn--ghost:hover { background: var(--wx-hover-bg); filter: none; }

.queue-list {
  list-style: none;
  margin: var(--wx-space-3) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}
.queue-list li {
  display: grid;
  grid-template-columns: 180px 1fr 100px;
  gap: var(--wx-space-2);
  align-items: center;
  font-size: var(--wx-fs-12);
  padding: 4px var(--wx-space-2);
  background: var(--wx-warning-bg);
  border-radius: var(--wx-radius-sm);
  border-left: 3px solid var(--wx-warning-solid);
}
.qid { font-family: var(--wx-font-mono); color: var(--wx-text-muted); }
.qlabel { color: var(--wx-text-primary); }
.qts { font-family: var(--wx-font-mono); color: var(--wx-text-muted); text-align: right; }

.hint { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }

.text-input {
  font-family: inherit;
  font-size: var(--wx-fs-14);
  padding: 6px 12px;
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  min-width: 240px;
}
.text-input:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}

/* palette */
.palette-backdrop {
  position: fixed;
  inset: 0;
  background: var(--wx-surface-overlay);
  z-index: var(--wx-z-modal);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}
.palette {
  width: min(560px, 90vw);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-xl);
  border: 1px solid var(--wx-border-default);
  box-shadow: var(--wx-shadow-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.palette__input {
  font-family: inherit;
  font-size: var(--wx-fs-15);
  padding: var(--wx-space-3) var(--wx-space-4);
  border: none;
  outline: none;
  background: transparent;
  color: var(--wx-text-primary);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.palette__list {
  list-style: none;
  margin: 0;
  padding: var(--wx-space-1);
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 300px;
  overflow-y: auto;
}
.palette__item {
  padding: var(--wx-space-2) var(--wx-space-3);
  border-radius: var(--wx-radius-sm);
  font-size: var(--wx-fs-14);
  cursor: pointer;
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.palette__item:hover { background: var(--wx-hover-bg); }
.palette__item:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: -2px;
  background: var(--wx-selected-bg);
}
.palette__foot {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-2) var(--wx-space-3);
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  border-top: 1px solid var(--wx-border-subtle);
  background: var(--wx-surface-sunken);
}
.palette__close {
  margin-left: auto;
  font-family: inherit;
  font-size: var(--wx-fs-12);
  padding: 2px 10px;
  border-radius: var(--wx-radius-sm);
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  cursor: pointer;
}

.wx-palette-fade-enter-active,
.wx-palette-fade-leave-active {
  transition: opacity var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-palette-fade-enter-from,
.wx-palette-fade-leave-to {
  opacity: 0;
}
</style>
