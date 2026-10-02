<script setup lang="ts">
import { BaseButton, BaseIconTile } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import type { IconTileTone } from '../../types'
import MindDialog from './MindDialog.vue'

const show = defineModel<boolean>({ required: true })

interface ContactChannel {
  label: string
  icon: string
  tone: IconTileTone
  desc: string
  href: string
}

const contacts: ContactChannel[] = [
  { label: 'Hỗ trợ Zalo OA',     icon: SHELL_ICONS.message, tone: 'blue',    desc: 'Liên hệ hỗ trợ qua Zalo Official Account',          href: '#' },
  { label: 'Nhóm Telegram',      icon: SHELL_ICONS.users,   tone: 'brand',   desc: 'Tham gia nhóm Telegram để nhận cập nhật',            href: '#' },
  { label: 'Trang cộng đồng',    icon: SHELL_ICONS.globe,   tone: 'success', desc: 'Theo dõi trang cộng đồng để biết tính năng mới',     href: '#' },
  { label: 'Kênh Youtube',       icon: SHELL_ICONS.play,    tone: 'danger',  desc: 'Xem hướng dẫn sử dụng trên Youtube',                 href: '#' },
  { label: 'Nhóm Zalo VIP',      icon: SHELL_ICONS.sparkle, tone: 'warning', desc: 'Nhóm VIP dành cho khách hàng premium',               href: '#' },
]
</script>

<template>
  <MindDialog
    v-model="show"
    title="Liên hệ & Hỗ trợ"
    subtitle="Kênh hỗ trợ và cộng đồng MindUI"
    :icon="SHELL_ICONS.message"
    size="sm"
  >
    <div class="contact-list">
      <a
        v-for="c in contacts"
        :key="c.label"
        :href="c.href"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-item"
      >
        <BaseIconTile :tone="c.tone" size="md" :icon="c.icon" />
        <span class="contact-text">
          <span class="contact-label">{{ c.label }}</span>
          <span class="contact-desc">{{ c.desc }}</span>
        </span>
        <span class="contact-arrow" aria-hidden="true" v-html="SHELL_ICONS.arrowRight" />
      </a>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
.contact-list { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.contact-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  border: 1px solid var(--wx-border-default);
  border-radius: 11px;
  background: var(--wx-surface-elevated);
  color: var(--wx-text-primary);
  text-decoration: none;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard),
    box-shadow var(--wx-d-fast) var(--wx-ease-standard);
}
.contact-item:hover {
  background: var(--wx-selected-bg);
  border-color: var(--wx-selected-border);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--wx-brand-600) 10%, transparent);
}
.contact-item:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: 1px; }
.contact-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.contact-label { font-size: 12.5px; font-weight: var(--wx-fw-bold); line-height: 1.3; }
.contact-desc { margin-top: 1px; font-size: var(--wx-fs-11); line-height: 1.35; color: var(--wx-text-light); }
.contact-arrow { display: inline-flex; flex-shrink: 0; color: var(--wx-text-light); transition: transform var(--wx-d-fast) var(--wx-ease-standard), color var(--wx-d-fast) var(--wx-ease-standard); }
.contact-arrow :deep(svg) { width: 16px; height: 16px; }
.contact-item:hover .contact-arrow { color: var(--wx-brand-600); transform: translateX(2px); }

@media (prefers-reduced-motion: reduce) {
  .contact-item, .contact-arrow { transition: none; }
}
</style>
