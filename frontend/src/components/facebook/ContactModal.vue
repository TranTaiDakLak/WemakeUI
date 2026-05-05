<script setup lang="ts">
import { BaseModal } from '../common'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <BaseModal :show="show" title="💬 Liên hệ" size="md" @close="$emit('close')">
    <div class="contact-cards">
      <div class="contact-card" v-for="c in [
        { icon: 'globe', label: 'Website', value: 'www.wemake.vn' },
        { icon: 'mail', label: 'Email', value: 'support@wemake.vn' },
        { icon: 'phone', label: 'Zalo', value: '0123 456 789' },
        { icon: 'fb', label: 'Facebook', value: 'fb.com/wemake.official' },
      ]" :key="c.label">
        <svg v-if="c.icon === 'globe'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
        <svg v-else-if="c.icon === 'mail'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <svg v-else-if="c.icon === 'phone'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        <svg v-else-if="c.icon === 'fb'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        <div><strong>{{ c.label }}</strong><p>{{ c.value }}</p></div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.contact-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.contact-card { display: flex; align-items: center; gap: 14px; padding: 16px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-secondary); }
.contact-card strong { display: block; font-size: 14px; color: var(--text-primary); margin-bottom: 2px; }
.contact-card p { font-size: 13px; color: var(--text-tertiary); margin: 0; }
</style>
