<script setup lang="ts">
import { ref } from 'vue'
import LandingLayout from '../_layouts/LandingLayout.vue'
import { BaseButton, BaseInput, FormField, GroupBox } from '../../components/common'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const sent = ref(false)

function submit() {
  if (name.value && email.value && message.value) {
    sent.value = true
  }
}

const CONTACTS = [
  { icon: '📧', label: 'Email', value: 'hello@wemakeui.vn' },
  { icon: '💬', label: 'Discord', value: 'discord.gg/wemakeui' },
  { icon: '🐦', label: 'Twitter / X', value: '@wemakeui' },
  { icon: '🏢', label: 'Địa chỉ', value: '123 Lê Lợi, Quận 1, TP.HCM' },
]
</script>

<template>
  <LandingLayout>
    <section class="contact-hero">
      <h1 class="contact-title">Liên hệ với chúng tôi</h1>
      <p class="contact-desc">Có câu hỏi hoặc cần hỗ trợ? Chúng tôi phản hồi trong vòng 24 giờ làm việc.</p>
    </section>

    <section class="contact-section">
      <div class="contact-grid">
        <!-- form -->
        <div>
          <Transition name="fade">
            <div v-if="sent" class="success-box">
              <span class="success-icon">✅</span>
              <h2 class="success-title">Đã gửi thành công!</h2>
              <p class="success-desc">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
              <BaseButton variant="secondary" @click="sent = false; name = ''; email = ''; message = ''">Gửi tin nhắn khác</BaseButton>
            </div>
            <GroupBox v-else title="Gửi tin nhắn">
              <div class="contact-form">
                <FormField label="Họ và tên" required>
                  <BaseInput v-model="name" placeholder="Nhập họ tên" />
                </FormField>
                <FormField label="Email" required>
                  <BaseInput v-model="email" type="email" placeholder="email@example.com" />
                </FormField>
                <FormField label="Chủ đề">
                  <BaseInput v-model="subject" placeholder="Tôi muốn hỏi về..." />
                </FormField>
                <FormField label="Tin nhắn" required>
                  <textarea v-model="message" class="msg-input" rows="5" placeholder="Nhập nội dung tin nhắn..." />
                </FormField>
                <BaseButton variant="primary" :disabled="!name || !email || !message" @click="submit">Gửi tin nhắn</BaseButton>
              </div>
            </GroupBox>
          </Transition>
        </div>

        <!-- contact info -->
        <div class="contact-info">
          <h2 class="info-title">Kênh liên hệ khác</h2>
          <div class="contact-channels">
            <div v-for="c in CONTACTS" :key="c.label" class="channel-item">
              <span class="channel-icon">{{ c.icon }}</span>
              <div>
                <span class="channel-label">{{ c.label }}</span>
                <span class="channel-value">{{ c.value }}</span>
              </div>
            </div>
          </div>
          <div class="office-hours">
            <h3 class="oh-title">Giờ hỗ trợ</h3>
            <p class="oh-text">Thứ 2 – Thứ 6: 8:00 – 18:00 (ICT)<br>Thứ 7: 9:00 – 12:00 (ICT)</p>
            <p class="oh-note">Ngoài giờ làm việc: phản hồi qua email trong 24 giờ.</p>
          </div>
        </div>
      </div>
    </section>
  </LandingLayout>
</template>

<style scoped>
.contact-hero { padding: var(--wx-space-12) var(--wx-space-5) var(--wx-space-8); background: var(--wx-gradient-bg); text-align: center; }
.contact-title { font-size: var(--wx-fs-40); font-weight: 800; letter-spacing: var(--wx-tracking-tight); margin-bottom: var(--wx-space-3); }
.contact-desc { font-size: var(--wx-fs-18); color: var(--wx-content-secondary); margin: 0; }

.contact-section { max-width: 1100px; margin: 0 auto; padding: var(--wx-space-10) var(--wx-space-5); }
.contact-grid { display: grid; grid-template-columns: 1fr 360px; gap: var(--wx-space-8); }
@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }

.contact-form { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.msg-input { width: 100%; padding: var(--wx-space-2) var(--wx-space-3); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); background: var(--wx-bg-base); color: var(--wx-content-primary); font-size: var(--wx-fs-14); font-family: inherit; resize: vertical; }
.msg-input:focus { outline: none; border-color: var(--wx-border-focus); box-shadow: var(--wx-shadow-focus); }

.success-box { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-4); padding: var(--wx-space-9) var(--wx-space-5); text-align: center; background: var(--wx-success-bg); border: 1px solid var(--wx-success-border); border-radius: var(--wx-radius-xl); }
.success-icon { font-size: 48px; }
.success-title { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-bold); margin: 0; }
.success-desc { font-size: var(--wx-fs-15); color: var(--wx-content-secondary); margin: 0; }

.contact-info { display: flex; flex-direction: column; gap: var(--wx-space-6); }
.info-title { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); margin-bottom: var(--wx-space-4); }
.contact-channels { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.channel-item { display: flex; gap: var(--wx-space-3); align-items: flex-start; }
.channel-icon { font-size: 20px; width: 28px; text-align: center; }
.channel-label { display: block; font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); }
.channel-value { display: block; font-size: var(--wx-fs-14); color: var(--wx-content-primary); }
.office-hours { padding: var(--wx-space-4); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-lg); }
.oh-title { font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); margin-bottom: var(--wx-space-2); }
.oh-text { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); line-height: var(--wx-lh-normal); margin-bottom: var(--wx-space-2); }
.oh-note { font-size: var(--wx-fs-13); color: var(--wx-content-muted); margin: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity var(--wx-d-normal) var(--wx-ease-standard); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
