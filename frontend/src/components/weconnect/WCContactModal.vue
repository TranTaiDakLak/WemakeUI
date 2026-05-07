<script setup lang="ts">
import { BaseButton, BaseModal } from '../common'

const show = defineModel<boolean>({ required: true })

const contacts = [
  { label: 'Hỗ trợ Zalo OA',  icon: '💬', desc: 'Liên hệ hỗ trợ qua Zalo Official Account',  href: '#' },
  { label: 'Nhóm Telegram',   icon: '✈️',  desc: 'Tham gia nhóm Telegram để nhận cập nhật', href: '#' },
  { label: 'Fanpage Facebook', icon: '📘', desc: 'Follow Fanpage để theo dõi tính năng mới',  href: '#' },
  { label: 'Kênh Youtube',    icon: '▶️',  desc: 'Xem hướng dẫn sử dụng trên Youtube',       href: '#' },
  { label: 'Nhóm Zalo VIP',   icon: '⭐', desc: 'Nhóm VIP dành cho khách hàng premium',      href: '#' },
]
</script>

<template>
  <BaseModal :show="show" title="💬 Liên hệ & Hỗ trợ" size="md" @close="show = false">
    <div class="contact-list">
      <a
        v-for="c in contacts"
        :key="c.label"
        :href="c.href"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-item"
      >
        <span class="contact-icon">{{ c.icon }}</span>
        <div class="contact-text">
          <span class="contact-label">{{ c.label }}</span>
          <span class="contact-desc">{{ c.desc }}</span>
        </div>
        <span class="contact-arrow">→</span>
      </a>
    </div>
    <template #footer>
      <div style="width:100%;display:flex;justify-content:flex-end">
        <BaseButton variant="ghost" @click="show = false">Đóng</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.contact-list { display: flex; flex-direction: column; gap: 4px; }
.contact-item {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: 10px 12px;
  border-radius: var(--wx-radius-md);
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--wx-border-subtle);
  transition: all 0.15s;
}
.contact-item:hover { background: var(--wx-surface-sunken); border-color: var(--wx-brand-300); }
.contact-icon { font-size: 20px; flex-shrink: 0; }
.contact-text { display: flex; flex-direction: column; flex: 1; }
.contact-label { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); color: var(--wx-text-primary); }
.contact-desc { font-size: var(--wx-fs-12); color: var(--wx-text-muted); }
.contact-arrow { color: var(--wx-text-muted); }
</style>
