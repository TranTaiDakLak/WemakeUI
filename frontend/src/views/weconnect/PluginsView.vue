<script setup lang="ts">
import { ref } from 'vue'
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import { BaseButton, BaseBadge, BaseCard, BaseToggle } from '../../components/common'

const PLUGINS = ref([
  { id: 1, name: 'ChatGPT Integration', desc: 'Trả lời tự động bằng GPT-4o. Hỗ trợ context 5 tin nhắn gần nhất.', version: '2.1.0', author: 'WemakeUI', enabled: true, category: 'AI' },
  { id: 2, name: 'Auto-reply Rules', desc: 'Tạo rule trả lời tự động theo keyword, giờ giấc và số điện thoại.', version: '1.5.2', author: 'WemakeUI', enabled: true, category: 'automation' },
  { id: 3, name: 'CRM Sync', desc: 'Đồng bộ liên hệ và tin nhắn với HubSpot và Salesforce.', version: '3.0.1', author: 'WemakeUI', enabled: false, category: 'integration' },
  { id: 4, name: 'Media Compressor', desc: 'Nén ảnh và video trước khi gửi để tiết kiệm băng thông.', version: '1.2.0', author: 'Community', enabled: true, category: 'utility' },
  { id: 5, name: 'Scheduler', desc: 'Hẹn giờ gửi tin nhắn tới danh sách liên hệ.', version: '2.0.0', author: 'WemakeUI', enabled: true, category: 'automation' },
])

const CAT_VARIANTS: Record<string, 'info' | 'success' | 'warning' | 'neutral'> = {
  AI: 'info', automation: 'success', integration: 'warning', utility: 'neutral',
}
</script>
<template>
  <WeConnectLayout current="plugins" page-title="Plugin manager" page-description="Quản lý và cài đặt plugin mở rộng tính năng">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Khám phá plugin</BaseButton>
    </template>
    <div class="plugins-grid">
      <BaseCard v-for="p in PLUGINS" :key="p.id">
        <template #header>
          <div class="plugin-head">
            <div>
              <div class="plugin-title-row">
                <span class="plugin-name">{{ p.name }}</span>
                <BaseBadge :text="p.category" :variant="CAT_VARIANTS[p.category]" size="sm" />
              </div>
              <div class="plugin-meta">
                <span>v{{ p.version }}</span>
                <span>·</span>
                <span>{{ p.author }}</span>
              </div>
            </div>
            <BaseToggle v-model="p.enabled" />
          </div>
        </template>
        <template #body>
          <p class="plugin-desc">{{ p.desc }}</p>
        </template>
        <template #footer>
          <div class="plugin-footer">
            <BaseButton size="sm" variant="ghost">Cài đặt</BaseButton>
            <BaseButton size="sm" variant="ghost">Xem log</BaseButton>
          </div>
        </template>
      </BaseCard>
    </div>
  </WeConnectLayout>
</template>
<style scoped>
.plugins-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--wx-space-4); }
.plugin-head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--wx-space-3); }
.plugin-title-row { display: flex; align-items: center; gap: var(--wx-space-2); margin-bottom: var(--wx-space-1); }
.plugin-name { font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); }
.plugin-meta { font-size: var(--wx-fs-12); color: var(--wx-content-muted); display: flex; gap: var(--wx-space-2); }
.plugin-desc { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); line-height: var(--wx-lh-normal); margin: 0; }
.plugin-footer { display: flex; gap: var(--wx-space-2); }
</style>
