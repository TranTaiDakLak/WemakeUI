<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseCard, BaseToggle, BaseSelectMenu } from '../../components/common'

interface Integration {
  id: number
  name: string
  type: string
  desc: string
  icon: string
  connected: boolean
  events: string[]
  lastEvent: string
}

const INTEGRATIONS = ref<Integration[]>([
  { id: 1, name: 'HubSpot CRM', type: 'CRM', desc: 'Đồng bộ lead và liên hệ hai chiều với HubSpot.', icon: '🟠', connected: true, events: ['contact.created', 'deal.updated'], lastEvent: '5 phút trước' },
  { id: 2, name: 'Google Sheets', type: 'Spreadsheet', desc: 'Ghi dữ liệu tin nhắn và liên hệ vào Google Sheets.', icon: '🟢', connected: true, events: ['message.received', 'contact.new'], lastEvent: '12 phút trước' },
  { id: 3, name: 'Slack', type: 'Notification', desc: 'Nhận thông báo Slack khi có lỗi session hoặc chiến dịch kết thúc.', icon: '🟣', connected: false, events: [], lastEvent: '—' },
  { id: 4, name: 'Zapier', type: 'Automation', desc: 'Kết nối với hơn 5000 ứng dụng qua Zapier webhook.', icon: '🟡', connected: false, events: [], lastEvent: '—' },
  { id: 5, name: 'Notion', type: 'Database', desc: 'Tạo trang Notion cho mỗi liên hệ mới.', icon: '⬛', connected: true, events: ['contact.created'], lastEvent: '1 giờ trước' },
])

interface Webhook {
  id: number
  url: string
  events: string[]
  active: boolean
  deliveries: number
  failures: number
}

const WEBHOOKS = ref<Webhook[]>([
  { id: 1, url: 'https://api.yourapp.com/wh/messages', events: ['message.received', 'message.sent'], active: true, deliveries: 4821, failures: 12 },
  { id: 2, url: 'https://n8n.internal/wh/wemakeui', events: ['session.disconnected', 'campaign.completed'], active: true, deliveries: 231, failures: 0 },
])

const showAddWebhook = ref(false)
const newUrl = ref('')
const newEvent = ref('message.received')

const ALL_EVENTS = ['message.received', 'message.sent', 'contact.created', 'session.connected', 'session.disconnected', 'campaign.completed', 'campaign.failed']

function addWebhook() {
  if (!newUrl.value.trim()) return
  WEBHOOKS.value.push({ id: Date.now(), url: newUrl.value, events: [newEvent.value], active: true, deliveries: 0, failures: 0 })
  newUrl.value = ''; showAddWebhook.value = false
}
function removeWebhook(id: number) { const i = WEBHOOKS.value.findIndex(w => w.id === id); if (i >= 0) WEBHOOKS.value.splice(i, 1) }
function toggleConnect(itg: Integration) { itg.connected = !itg.connected; if (itg.connected) itg.lastEvent = 'Vừa kết nối' }

const TYPE_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'neutral'> = {
  CRM: 'info', Spreadsheet: 'success', Notification: 'warning', Automation: 'warning', Database: 'neutral',
}
</script>

<template>
  <AppPageLayout section="wemakeui" current="integrations" page-title="Tích hợp" page-description="Kết nối với các dịch vụ bên ngoài và quản lý webhook">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Thêm tích hợp</BaseButton>
    </template>

    <div class="section-title">Tích hợp bên ngoài</div>
    <div class="integrations-grid">
      <BaseCard v-for="itg in INTEGRATIONS" :key="itg.id" class="itg-card">
        <template #header>
          <div class="itg-head">
            <div class="itg-icon">{{ itg.icon }}</div>
            <div class="itg-info">
              <div class="itg-name">{{ itg.name }}</div>
              <BaseBadge :text="itg.type" :variant="TYPE_VARIANT[itg.type]" size="sm" />
            </div>
            <BaseBadge :text="itg.connected ? 'Đã kết nối' : 'Chưa kết nối'" :variant="itg.connected ? 'success' : 'neutral'" dot />
          </div>
        </template>
        <template #body>
          <p class="itg-desc">{{ itg.desc }}</p>
          <div v-if="itg.connected && itg.events.length" class="itg-events">
            <span v-for="ev in itg.events" :key="ev" class="event-chip">{{ ev }}</span>
          </div>
          <div v-if="itg.connected" class="itg-last">Sự kiện cuối: {{ itg.lastEvent }}</div>
        </template>
        <template #footer>
          <div class="itg-footer">
            <BaseButton size="sm" variant="ghost" @click="toggleConnect(itg)">
              {{ itg.connected ? 'Ngắt kết nối' : 'Kết nối' }}
            </BaseButton>
            <BaseButton v-if="itg.connected" size="sm" variant="ghost">Cài đặt</BaseButton>
          </div>
        </template>
      </BaseCard>
    </div>

    <div class="section-divider"></div>
    <div class="section-header">
      <div>
        <div class="section-title">Webhooks</div>
        <div class="section-sub">Nhận HTTP POST khi có sự kiện xảy ra</div>
      </div>
      <BaseButton size="sm" variant="ghost" @click="showAddWebhook = !showAddWebhook">+ Thêm webhook</BaseButton>
    </div>

    <Transition name="slide-down">
      <BaseCard v-if="showAddWebhook" class="wh-create">
        <template #body>
          <div class="wh-form">
            <div class="form-field">
              <label>URL endpoint</label>
              <input v-model="newUrl" class="wx-input mono" placeholder="https://your.app/webhook" />
            </div>
            <div class="form-field">
              <label>Sự kiện</label>
              <BaseSelectMenu
                v-model="newEvent"
                :options="ALL_EVENTS.map(ev => ({ value: ev, label: ev }))"
              />
            </div>
            <div class="wh-form-btns">
              <BaseButton size="sm" variant="ghost" @click="showAddWebhook = false">Huỷ</BaseButton>
              <BaseButton size="sm" variant="primary" @click="addWebhook">Thêm</BaseButton>
            </div>
          </div>
        </template>
      </BaseCard>
    </Transition>

    <div class="wh-table-wrap">
      <table class="wh-table">
        <thead><tr><th>Bật</th><th>URL</th><th>Sự kiện</th><th>Deliveries</th><th>Lỗi</th><th></th></tr></thead>
        <tbody>
          <tr v-for="wh in WEBHOOKS" :key="wh.id">
            <td><BaseToggle v-model="wh.active" /></td>
            <td><code class="wh-url">{{ wh.url }}</code></td>
            <td><div class="events-wrap"><span v-for="ev in wh.events" :key="ev" class="event-chip">{{ ev }}</span></div></td>
            <td class="num">{{ wh.deliveries.toLocaleString() }}</td>
            <td class="num" :class="{ err: wh.failures > 0 }">{{ wh.failures }}</td>
            <td><div class="row-act"><BaseButton size="sm" variant="ghost">Test</BaseButton><BaseButton size="sm" variant="danger" @click="removeWebhook(wh.id)">Xoá</BaseButton></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all var(--wx-d-base); }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
.section-title { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); margin-bottom: var(--wx-space-3); }
.section-sub { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.section-divider { height: 1px; background: var(--wx-border-default); margin: var(--wx-space-6) 0 var(--wx-space-4); }
.section-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: var(--wx-space-3); }
.integrations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--wx-space-4); }
.itg-head { display: flex; align-items: flex-start; gap: var(--wx-space-3); }
.itg-icon { font-size: 28px; line-height: 1; flex-shrink: 0; }
.itg-info { flex: 1; }
.itg-name { font-weight: var(--wx-fw-semibold); font-size: var(--wx-fs-15); margin-bottom: var(--wx-space-1); }
.itg-desc { font-size: var(--wx-fs-13); color: var(--wx-content-secondary); margin: 0 0 var(--wx-space-2); }
.itg-events { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: var(--wx-space-2); }
.event-chip { font-family: var(--wx-font-mono); font-size: 10px; background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-sm); padding: 1px 6px; }
.itg-last { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.itg-footer { display: flex; gap: var(--wx-space-2); }
.wh-create { margin-bottom: var(--wx-space-3); }
.wh-form { display: flex; gap: var(--wx-space-3); align-items: flex-end; flex-wrap: wrap; }
.form-field { display: flex; flex-direction: column; gap: var(--wx-space-1); flex: 1; min-width: 200px; }
.form-field label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-medium); }
.wx-input { padding: 6px 10px; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); background: var(--wx-bg-base); color: var(--wx-content-primary); font-size: var(--wx-fs-13); width: 100%; }
.mono { font-family: var(--wx-font-mono); }
.wh-form-btns { display: flex; gap: var(--wx-space-2); align-items: flex-end; }
.wh-table-wrap { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; }
.wh-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.wh-table th { padding: var(--wx-space-3) var(--wx-space-4); text-align: left; font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); background: var(--wx-bg-sunken); border-bottom: 1px solid var(--wx-border-default); }
.wh-table td { padding: var(--wx-space-3) var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); vertical-align: middle; }
.wh-table tbody tr:last-child td { border-bottom: none; }
.wh-url { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); word-break: break-all; }
.events-wrap { display: flex; gap: 4px; flex-wrap: wrap; }
.num { font-weight: var(--wx-fw-semibold); font-variant-numeric: tabular-nums; }
.err { color: var(--wx-status-danger-text); }
.row-act { display: flex; gap: var(--wx-space-2); }
</style>
