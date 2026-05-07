<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseAvatar, BaseInput, BaseButton, BaseBadge } from '../../components/common'

const CONTACTS = [
  { id: 1, name: 'Lê Thị B', role: 'Designer', online: true, last: 'Mình đã gửi file rồi nhé' },
  { id: 2, name: 'Trần Văn C', role: 'Backend', online: true, last: 'OK, mình sẽ check sau' },
  { id: 3, name: 'Nguyễn Thị D', role: 'QA', online: false, last: 'Bug đã fix, bạn test lại nhé' },
  { id: 4, name: 'Phạm Văn E', role: 'DevOps', online: false, last: 'Deploy lên prod lúc 18:00' },
]

const MESSAGES = ref([
  { id: 1, from: 'Lê Thị B', text: 'Mình vừa thiết kế xong flow đăng nhập mới, bạn xem thử nhé!', time: '10:30', mine: false },
  { id: 2, from: 'Me', text: 'Trông ngon đấy, mình sẽ implement luôn chiều nay.', time: '10:32', mine: true },
  { id: 3, from: 'Lê Thị B', text: 'Bạn có cần mình chỉnh gì không? Animation có thể điều chỉnh được.', time: '10:33', mine: false },
  { id: 4, from: 'Me', text: 'Animation của bước transition giữa các step có thể nhanh hơn một chút, khoảng 150ms là đủ.', time: '10:35', mine: true },
  { id: 5, from: 'Lê Thị B', text: 'Mình đã gửi file rồi nhé, xem trong Figma link trên ticket #301.', time: '10:42', mine: false },
])

const active = ref(1)
const input = ref('')

function send() {
  if (!input.value.trim()) return
  MESSAGES.value.push({ id: Date.now(), from: 'Me', text: input.value, time: new Date().toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit' }), mine: true })
  input.value = ''
}
</script>

<template>
  <AppPageLayout section="app" current="nhắn tin" page-title="Nhắn tin" page-description="Tin nhắn nội bộ với đồng nghiệp">
    <div class="chat-wrap">
      <!-- contact list -->
      <aside class="contact-list">
        <div class="cl-header">
          <span class="cl-title">Tin nhắn</span>
          <BaseBadge text="3" variant="primary" size="sm" />
        </div>
        <ul class="contacts">
          <li v-for="c in CONTACTS" :key="c.id"
            class="contact-item" :class="{ active: active === c.id }"
            @click="active = c.id">
            <div class="contact-avatar-wrap">
              <BaseAvatar :name="c.name" size="md" />
              <span class="online-dot" :class="{ online: c.online }" />
            </div>
            <div class="contact-info">
              <div class="ci-row">
                <span class="ci-name">{{ c.name }}</span>
                <span class="ci-role">{{ c.role }}</span>
              </div>
              <span class="ci-last">{{ c.last }}</span>
            </div>
          </li>
        </ul>
      </aside>

      <!-- chat -->
      <div class="chat-main">
        <div class="chat-header">
          <BaseAvatar :name="CONTACTS.find(c => c.id === active)?.name || ''" size="sm" />
          <div>
            <span class="ch-name">{{ CONTACTS.find(c => c.id === active)?.name }}</span>
            <span class="ch-status" :class="{ online: CONTACTS.find(c => c.id === active)?.online }">
              {{ CONTACTS.find(c => c.id === active)?.online ? '● đang hoạt động' : '○ ngoại tuyến' }}
            </span>
          </div>
        </div>

        <div class="messages">
          <div v-for="msg in MESSAGES" :key="msg.id" class="msg-wrap" :class="{ mine: msg.mine }">
            <div class="bubble" :class="{ mine: msg.mine }">
              <p class="bubble-text">{{ msg.text }}</p>
              <span class="bubble-time">{{ msg.time }}</span>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <BaseInput v-model="input" placeholder="Nhập tin nhắn..." @keyup.enter="send" />
          <BaseButton variant="primary" @click="send">Gửi</BaseButton>
        </div>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.chat-wrap { display: grid; grid-template-columns: 280px 1fr; height: 600px; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; background: var(--wx-bg-base); }

.contact-list { border-right: 1px solid var(--wx-border-subtle); display: flex; flex-direction: column; }
.cl-header { display: flex; align-items: center; justify-content: space-between; padding: var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.cl-title { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); }
.contacts { list-style: none; margin: 0; padding: var(--wx-space-2); display: flex; flex-direction: column; gap: 2px; overflow-y: auto; flex: 1; }
.contact-item { display: flex; align-items: center; gap: var(--wx-space-3); padding: var(--wx-space-3); border-radius: var(--wx-radius-md); cursor: pointer; transition: background var(--wx-d-micro); }
.contact-item:hover { background: var(--wx-hover-bg); }
.contact-item.active { background: var(--wx-brand-50); }
.contact-avatar-wrap { position: relative; }
.online-dot { position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; border-radius: var(--wx-radius-full); background: var(--wx-border-default); border: 2px solid var(--wx-bg-base); }
.online-dot.online { background: var(--wx-status-success-border); }
.contact-info { flex: 1; min-width: 0; }
.ci-row { display: flex; align-items: baseline; justify-content: space-between; gap: 4px; }
.ci-name { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); color: var(--wx-content-primary); }
.ci-role { font-size: var(--wx-fs-11); color: var(--wx-content-muted); }
.ci-last { display: block; font-size: var(--wx-fs-12); color: var(--wx-content-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.chat-main { display: flex; flex-direction: column; }
.chat-header { display: flex; align-items: center; gap: var(--wx-space-3); padding: var(--wx-space-3) var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.ch-name { display: block; font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); }
.ch-status { display: block; font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.ch-status.online { color: var(--wx-status-success-text); }

.messages { flex: 1; overflow-y: auto; padding: var(--wx-space-4); display: flex; flex-direction: column; gap: var(--wx-space-3); }
.msg-wrap { display: flex; }
.msg-wrap.mine { justify-content: flex-end; }
.bubble { max-width: 70%; background: var(--wx-bg-sunken); border-radius: var(--wx-radius-lg); padding: var(--wx-space-3) var(--wx-space-4); }
.bubble.mine { background: var(--wx-brand-500); color: white; }
.bubble-text { margin: 0; font-size: var(--wx-fs-14); line-height: var(--wx-lh-normal); }
.bubble-time { display: block; font-size: var(--wx-fs-11); margin-top: 4px; opacity: 0.65; text-align: right; }

.chat-input { display: flex; gap: var(--wx-space-3); padding: var(--wx-space-3) var(--wx-space-4); border-top: 1px solid var(--wx-border-subtle); }
.chat-input :deep(.wx-input) { flex: 1; }
</style>
