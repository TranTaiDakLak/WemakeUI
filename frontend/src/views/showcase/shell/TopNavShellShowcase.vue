<script setup lang="ts">
/**
 * Phase 3 — top-nav shell demo (cho landing / profile public).
 * full-width topbar + centered main, max-width container.
 */
import { ref } from 'vue'
import { AppShell, PageHeader } from '../../../components/layout'
import {
  BaseButton, BaseCard, BasePanel, BaseInput, BaseSelectMenu, BaseToggle,
  BaseTag, BaseBadge, FormField, BaseTextarea, GroupBox,
} from '../../../components/common'

const navActive = ref<'home' | 'features' | 'pricing' | 'docs' | 'blog'>('home')
const navItems = [
  { id: 'home',     label: 'Trang chủ' },
  { id: 'features', label: 'Tính năng' },
  { id: 'pricing',  label: 'Giá' },
  { id: 'docs',     label: 'Tài liệu' },
  { id: 'blog',     label: 'Blog' },
] as const

/* contact form */
const form = ref({
  name: '',
  email: '',
  topic: 'sales',
  message: '',
  agree: false,
})
const errors = ref<{ email?: string; message?: string; agree?: string }>({})
const topicOpts = [
  { value: 'sales',   label: 'Bán hàng' },
  { value: 'support', label: 'Hỗ trợ kỹ thuật' },
  { value: 'partner', label: 'Đối tác' },
  { value: 'other',   label: 'Khác' },
]

function submit() {
  errors.value = {}
  if (!form.value.email.includes('@')) errors.value.email = 'Email không hợp lệ.'
  if (form.value.message.length < 10) errors.value.message = 'Tin nhắn tối thiểu 10 ký tự.'
  if (!form.value.agree) errors.value.agree = 'Bạn cần đồng ý với điều khoản.'
}
</script>

<template>
  <AppShell variant="topnav" :max-width="1200" centered background="base">
    <template #topbar>
      <div class="brand">
        <div class="logo">W</div>
        <span class="brand-name">WemakeUI</span>
        <BaseTag size="sm" variant="info" text="beta" />
      </div>
    </template>

    <template #nav>
      <nav class="navbar" aria-label="Điều hướng chính">
        <ul class="nav-list">
          <li v-for="n in navItems" :key="n.id">
            <button
              class="nav-link"
              :class="{ 'nav-link--active': navActive === n.id }"
              type="button"
              @click="navActive = n.id"
            >
              {{ n.label }}
            </button>
          </li>
        </ul>
        <div class="nav-actions">
          <BaseButton variant="ghost" size="sm">Đăng nhập</BaseButton>
          <BaseButton size="sm">Bắt đầu miễn phí</BaseButton>
        </div>
      </nav>
    </template>

    <!-- ── main ── -->
    <section class="hero">
      <BaseTag size="md" variant="primary" text="Mới · v0.3.0" />
      <h1 class="hero-title">
        UI kit Vue 3 cross-platform
        <span class="hero-grad">cho mọi nền tảng</span>
      </h1>
      <p class="hero-desc">
        Dùng được trên web, mobile (Capacitor / Ionic) và desktop wrapper (Wails / Tauri / Electron).
        Tree-shakable, TypeScript strict, dark mode mặc định.
      </p>
      <div class="hero-cta">
        <BaseButton size="lg" variant="cta">Cài đặt qua npm</BaseButton>
        <BaseButton size="lg" variant="ghost">Xem demo trực tiếp</BaseButton>
      </div>
      <code class="hero-cmd">npm install @wemake/ui</code>
    </section>

    <PageHeader
      title="Tính năng nổi bật"
      description="Mỗi component có default rõ ràng, 6 trạng thái chuẩn, và hoạt động trên 3 platform."
      size="lg"
    />

    <div class="features">
      <BaseCard
        v-for="(f, i) in [
          { title: 'Cross-platform', desc: 'Web, mobile shell, desktop wrapper — cùng một bộ component.', icon: '🌐' },
          { title: 'Design tokens', desc: 'CSS variables cho color, gradient, radius, spacing, motion.', icon: '🎨' },
          { title: 'Dark mode', desc: 'Toggle system / light / dark, gradient giữ hue, hạ saturation.', icon: '🌙' },
          { title: 'A11y first', desc: 'Focus ring 2px, ARIA roles, keyboard nav đầy đủ.', icon: '♿' },
          { title: 'Tree-shakable', desc: 'Named exports, peer deps, không side effects ngoài CSS.', icon: '🌳' },
          { title: 'Vietnamese', desc: 'Sentence case mặc định, i18n-ready, không UPPERCASE.', icon: '🇻🇳' },
        ]"
        :key="i"
        hoverable
        padded
        radius="xl"
        shadow="sm"
      >
        <div class="feat">
          <span class="feat-icon">{{ f.icon }}</span>
          <h3 class="feat-title">{{ f.title }}</h3>
          <p class="feat-desc">{{ f.desc }}</p>
        </div>
      </BaseCard>
    </div>

    <PageHeader
      title="Liên hệ"
      description="Gửi tin nhắn, đội ngũ sẽ phản hồi trong 24 giờ."
      size="md"
    />

    <div class="contact-grid">
      <BaseCard title="Gửi tin nhắn" subtitle="Form chuẩn FormField với validation">
        <FormField label="Họ và tên" required>
          <BaseInput v-model="form.name" placeholder="Nguyễn Văn A" />
        </FormField>
        <FormField label="Email công ty" :error="errors.email" required>
          <BaseInput v-model="form.email" type="email" placeholder="ban@congty.vn" />
        </FormField>
        <FormField label="Chủ đề">
          <BaseSelectMenu v-model="form.topic" :options="topicOpts" />
        </FormField>
        <FormField label="Nội dung" :error="errors.message" hint="Tối thiểu 10 ký tự." required>
          <BaseTextarea v-model="form.message" :rows="4" placeholder="Nhập tin nhắn của bạn…" />
        </FormField>
        <FormField :error="errors.agree" label-placement="left" label="Tôi đồng ý với điều khoản">
          <BaseToggle v-model="form.agree" />
        </FormField>
        <template #footer>
          <BaseButton variant="ghost" @click="form = { name: '', email: '', topic: 'sales', message: '', agree: false }">
            Xoá form
          </BaseButton>
          <BaseButton @click="submit">Gửi tin nhắn</BaseButton>
        </template>
      </BaseCard>

      <div class="contact-side">
        <BasePanel title="Thông tin">
          <ul class="info-list">
            <li><strong>Email:</strong> hello@wemake.vn</li>
            <li><strong>Hotline:</strong> 1900 xxxx</li>
            <li><strong>Văn phòng:</strong> Tầng 4, toà ABC, Hà Nội</li>
          </ul>
        </BasePanel>

        <GroupBox title="Câu hỏi thường gặp">
          <ul class="faq">
            <li>Tôi có thể dùng ngay với Vue 2 không? <BaseBadge text="không" variant="warning" size="sm" /></li>
            <li>Có bản free vĩnh viễn không? <BaseBadge text="có" variant="success" size="sm" /></li>
            <li>Hỗ trợ TypeScript strict? <BaseBadge text="có" variant="success" size="sm" /></li>
          </ul>
        </GroupBox>
      </div>
    </div>

    <template #footer>
      <div class="foot">
        <span>© 2026 WemakeUI · sentence case · vietnamese</span>
      </div>
    </template>
  </AppShell>
</template>

<style scoped>
/* ── topbar ── */
.brand {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
}
.logo {
  width: 32px;
  height: 32px;
  border-radius: var(--wx-radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--wx-gradient-button);
  color: white;
  font-weight: var(--wx-fw-bold);
  font-size: var(--wx-fs-16);
}
.brand-name {
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}

.navbar {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--wx-space-5);
  margin-left: var(--wx-space-6);
}
.nav-list {
  list-style: none;
  display: flex;
  gap: var(--wx-space-1);
  padding: 0;
  margin: 0;
}
.nav-link {
  padding: 6px var(--wx-space-3);
  border: none;
  background: transparent;
  font-size: var(--wx-fs-14);
  font-family: inherit;
  color: var(--wx-content-secondary);
  cursor: pointer;
  border-radius: var(--wx-radius-md);
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.nav-link:hover { background: var(--wx-surface-sunken); color: var(--wx-content-primary); }
.nav-link--active {
  background: rgba(37, 99, 235, 0.08);
  color: var(--wx-brand-primary);
  font-weight: var(--wx-fw-medium);
}
.nav-link:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}
.nav-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
}
.text-link {
  font-size: var(--wx-fs-13);
  color: var(--wx-content-link);
  text-decoration: none;
}
.text-link:hover { text-decoration: underline; }

/* ── hero ── */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--wx-space-4);
  padding: var(--wx-space-10) var(--wx-space-5) var(--wx-space-9);
  border-bottom: 1px solid var(--wx-border-subtle);
  background: var(--wx-gradient-bg);
  margin: 0 calc(-1 * var(--wx-space-5));
}
.hero-title {
  margin: 0;
  font-size: var(--wx-fs-48);
  font-weight: var(--wx-fw-bold);
  line-height: var(--wx-lh-tight);
  letter-spacing: var(--wx-tracking-tight);
  max-width: 720px;
}
.hero-grad {
  display: inline-block;
  background: var(--wx-gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* fallback per anti-pattern rule */
}
.hero-desc {
  margin: 0;
  font-size: var(--wx-fs-16);
  line-height: var(--wx-lh-relaxed);
  color: var(--wx-content-secondary);
  max-width: 600px;
}
.hero-cta {
  display: flex;
  gap: var(--wx-space-3);
}
.hero-cmd {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-13);
  color: var(--wx-content-secondary);
  background: rgba(255, 255, 255, 0.4);
  padding: 6px var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* ── features ── */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--wx-space-4);
  margin-bottom: var(--wx-space-7);
}
.feat {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}
.feat-icon {
  font-size: 32px;
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-sunken);
}
.feat-title {
  margin: 0;
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}
.feat-desc {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: var(--wx-content-muted);
  line-height: var(--wx-lh-normal);
}

/* ── contact ── */
.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: var(--wx-space-4);
  margin-bottom: var(--wx-space-9);
}
@media (max-width: 880px) {
  .contact-grid { grid-template-columns: 1fr; }
  .navbar { margin-left: 0; }
  .nav-list { display: none; }
}

.contact-side {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
}
.info-list,
.faq {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  font-size: var(--wx-fs-13);
}
.faq li {
  display: flex;
  justify-content: space-between;
  gap: var(--wx-space-2);
  padding: var(--wx-space-1) 0;
}

/* ── footer ── */
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wx-space-3);
  padding: var(--wx-space-4) var(--wx-space-5);
  font-size: var(--wx-fs-13);
  color: var(--wx-content-muted);
}
</style>
