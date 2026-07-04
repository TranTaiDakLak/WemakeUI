<script setup lang="ts">
import { ref } from 'vue'
import MarketingHeader from '@/archetypes/marketing/MarketingHeader.vue'
import { useToast } from '@/composables/useToast'
import { BaseToast, BaseInput, BaseTextarea, FormField } from '@/components/common'

const { showToast } = useToast()

const form = ref({ name: '', email: '', company: '', message: '', type: 'demo' })
const loading = ref(false)
const submitted = ref(false)

async function submit() {
  if (!form.value.name || !form.value.email || !form.value.message) {
    showToast('error', 'Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }
  loading.value = true
  await new Promise(r => setTimeout(r, 1600))
  loading.value = false
  submitted.value = true
  showToast('success', 'Cảm ơn! Chúng tôi sẽ liên hệ trong vòng 24 giờ.')
}

const STATS = [
  { value: '200+', label: 'Doanh nghiệp tin dùng' },
  { value: '10K+', label: 'Tài khoản đang quản lý' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '24/7', label: 'Hỗ trợ kỹ thuật' },
]
</script>

<template>
  <div class="contact-page">
    <MarketingHeader />
    <BaseToast />

    <main>
      <div class="contact-hero" v-reveal>
        <h1 class="contact-hero__title">Liên hệ với Wemake</h1>
        <p class="contact-hero__sub">Đội ngũ của chúng tôi sẵn sàng giúp bạn tìm giải pháp phù hợp.</p>
      </div>

      <div class="contact-container">
        <!-- left: about + stats -->
        <div class="contact-left" v-reveal>
          <div class="contact-story">
            <h2 class="contact-story__title">Câu chuyện Wemake</h2>
            <p class="contact-story__text">
              Wemake được thành lập năm 2022 bởi đội ngũ kỹ sư và chuyên gia marketing
              với mục tiêu giải quyết bài toán quản lý đa kênh phức tạp cho doanh nghiệp Việt Nam.
            </p>
            <p class="contact-story__text">
              Từ một startup nhỏ, chúng tôi đã phát triển thành nền tảng phục vụ 200+ doanh nghiệp
              với 10K+ tài khoản đang hoạt động mỗi ngày.
            </p>
          </div>

          <div class="contact-stats">
            <div v-for="s in STATS" :key="s.label" class="contact-stat">
              <span class="contact-stat__val">{{ s.value }}</span>
              <span class="contact-stat__lbl">{{ s.label }}</span>
            </div>
          </div>

          <div class="contact-channels">
            <h3 class="contact-channels__title">Kênh liên hệ</h3>
            <div class="contact-channel">
              <span class="contact-channel__icon">📧</span>
              <div>
                <p class="contact-channel__label">Email</p>
                <p class="contact-channel__value">hello@wemake.vn</p>
              </div>
            </div>
            <div class="contact-channel">
              <span class="contact-channel__icon">📞</span>
              <div>
                <p class="contact-channel__label">Hotline</p>
                <p class="contact-channel__value">1900 1234 (8:00–22:00)</p>
              </div>
            </div>
            <div class="contact-channel">
              <span class="contact-channel__icon">📍</span>
              <div>
                <p class="contact-channel__label">Địa chỉ</p>
                <p class="contact-channel__value">Tòa nhà Etown, 364 Cộng Hòa, TP.HCM</p>
              </div>
            </div>
          </div>
        </div>

        <!-- right: form -->
        <div class="contact-form-wrap">
          <div v-if="submitted" class="contact-success">
            <span class="contact-success__icon">✅</span>
            <h3>Đã nhận được yêu cầu!</h3>
            <p>Chúng tôi sẽ liên hệ lại trong vòng 24 giờ làm việc.</p>
            <button class="contact-reset" @click="submitted = false; form = { name: '', email: '', company: '', message: '', type: 'demo' }">
              Gửi yêu cầu khác
            </button>
          </div>

          <form v-else class="contact-form" @submit.prevent="submit">
            <h2 class="contact-form__title">Gửi yêu cầu</h2>

            <div class="cf-field">
              <label class="cf-label">Loại yêu cầu</label>
              <div class="cf-radio-group">
                <label class="cf-radio" :class="{ 'cf-radio--active': form.type === 'demo' }">
                  <input v-model="form.type" type="radio" value="demo" class="sr-only" />
                  🎯 Xem demo
                </label>
                <label class="cf-radio" :class="{ 'cf-radio--active': form.type === 'trial' }">
                  <input v-model="form.type" type="radio" value="trial" class="sr-only" />
                  🆓 Dùng thử
                </label>
                <label class="cf-radio" :class="{ 'cf-radio--active': form.type === 'partner' }">
                  <input v-model="form.type" type="radio" value="partner" class="sr-only" />
                  🤝 Hợp tác
                </label>
                <label class="cf-radio" :class="{ 'cf-radio--active': form.type === 'support' }">
                  <input v-model="form.type" type="radio" value="support" class="sr-only" />
                  🛠 Hỗ trợ
                </label>
              </div>
            </div>

            <div class="cf-row-2">
              <FormField label="Họ tên" :required="true">
                <BaseInput v-model="form.name" placeholder="Nguyễn Văn A" :disabled="loading" />
              </FormField>
              <FormField label="Email" :required="true">
                <BaseInput v-model="form.email" type="email" placeholder="email@company.vn" :disabled="loading" />
              </FormField>
            </div>

            <FormField label="Công ty">
              <BaseInput v-model="form.company" placeholder="Tên doanh nghiệp..." :disabled="loading" />
            </FormField>

            <FormField label="Nội dung" :required="true">
              <BaseTextarea
                v-model="form.message"
                placeholder="Mô tả nhu cầu của bạn..."
                :rows="5"
                :disabled="loading"
              />
            </FormField>

            <button type="submit" class="cf-submit" :class="{ 'cf-submit--loading': loading }" :disabled="loading">
              <span v-if="loading" class="cf-submit__spinner" />
              {{ loading ? 'Đang gửi...' : 'Gửi yêu cầu' }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.contact-page { min-height: 100vh; padding-top: 64px; background: var(--wx-surface-base); }

.contact-hero {
  text-align: center;
  padding: 120px var(--wx-space-6) var(--wx-space-12);
  background: linear-gradient(160deg, var(--wx-surface) 0%, color-mix(in srgb, var(--wx-primary) 4%, var(--wx-surface)) 100%);
}
.contact-hero__title {
  font-size: clamp(28px, 5vw, 48px); font-weight: 700;
  letter-spacing: -0.02em; color: var(--wx-text-primary);
  margin: 0 0 var(--wx-space-3);
}
.contact-hero__sub { font-size: var(--wx-text-lg); color: var(--wx-text-secondary); margin: 0; }

.contact-container {
  max-width: 1100px; margin: 0 auto;
  padding: var(--wx-space-10) var(--wx-space-6) var(--wx-space-20);
  display: grid; gap: var(--wx-space-12);
}
@media (min-width: 900px) { .contact-container { grid-template-columns: 1fr 1.4fr; } }

/* left column */
.contact-story { margin-bottom: var(--wx-space-8); }
.contact-story__title { font-size: var(--wx-text-xl); font-weight: 700; color: var(--wx-text-primary); margin: 0 0 var(--wx-space-3); }
.contact-story__text { font-size: var(--wx-text-sm); color: var(--wx-text-secondary); line-height: 1.7; margin: 0 0 var(--wx-space-3); }

.contact-stats {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: var(--wx-space-4);
  margin-bottom: var(--wx-space-8);
  padding: var(--wx-space-5);
  background: color-mix(in srgb, var(--wx-primary) 6%, transparent);
  border-radius: var(--wx-radius-xl);
  border: 1px solid color-mix(in srgb, var(--wx-primary) 15%, transparent);
}
.contact-stat { display: flex; flex-direction: column; gap: 2px; }
.contact-stat__val { font-size: var(--wx-text-2xl); font-weight: 700; color: var(--wx-primary); }
.contact-stat__lbl { font-size: var(--wx-text-xs); color: var(--wx-text-secondary); }

.contact-channels { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.contact-channels__title { font-size: var(--wx-text-base); font-weight: 600; color: var(--wx-text-primary); margin: 0 0 var(--wx-space-3); }
.contact-channel { display: flex; align-items: flex-start; gap: var(--wx-space-3); }
.contact-channel__icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.contact-channel__label { font-size: var(--wx-text-xs); color: var(--wx-text-tertiary); margin: 0 0 2px; }
.contact-channel__value { font-size: var(--wx-text-sm); font-weight: 500; color: var(--wx-text-primary); margin: 0; }

/* form */
.contact-form-wrap {}
.contact-form {
  background: var(--wx-surface-raised);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-2xl);
  padding: var(--wx-space-8);
}
.contact-form__title { font-size: var(--wx-text-xl); font-weight: 700; color: var(--wx-text-primary); margin: 0 0 var(--wx-space-6); }

.cf-field { margin-bottom: var(--wx-space-4); }
.cf-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-3); }

.cf-radio-group { display: flex; flex-wrap: wrap; gap: var(--wx-space-2); }
.cf-radio {
  display: inline-flex; align-items: center; gap: var(--wx-space-1-5);
  padding: var(--wx-space-2) var(--wx-space-3);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-text-sm); font-weight: 500;
  cursor: pointer;
  background: none;
  transition: all var(--wx-d-fast);
}
.cf-radio:hover { border-color: var(--wx-primary); }
.cf-radio--active { border-color: var(--wx-primary); background: color-mix(in srgb, var(--wx-primary) 8%, transparent); color: var(--wx-primary); }

.cf-submit {
  display: flex; align-items: center; justify-content: center; gap: var(--wx-space-2);
  width: 100%; padding: var(--wx-space-3);
  background: var(--wx-primary); color: #fff;
  border: none; border-radius: var(--wx-radius-lg);
  font-size: var(--wx-text-base); font-weight: 600;
  cursor: pointer;
  transition: all var(--wx-d-fast);
}
.cf-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.cf-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.cf-submit__spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* success state */
.contact-success {
  background: var(--wx-surface-raised);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-2xl);
  padding: var(--wx-space-12);
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-4);
}
.contact-success__icon { font-size: 48px; }
.contact-success h3 { font-size: var(--wx-text-xl); font-weight: 700; color: var(--wx-text-primary); margin: 0; }
.contact-success p { font-size: var(--wx-text-sm); color: var(--wx-text-secondary); margin: 0; }
.contact-reset {
  padding: var(--wx-space-2) var(--wx-space-5);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-text-sm); cursor: pointer;
  color: var(--wx-text-secondary);
}

.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
</style>
