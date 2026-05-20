<script setup lang="ts">
import LandingLayout from '../_layouts/LandingLayout.vue'
import { BaseAvatar, BaseAvatarGroup, BaseButton } from '../../components/common'
import { Rocket, Accessibility, Globe2, Unlock, type LucideIcon } from 'lucide-vue-next'

const TEAM = [
  { name: 'Nguyễn Văn A', role: 'Founder & CEO', bio: 'Vue & TypeScript specialist. Yêu thích design system và developer experience tốt.' },
  { name: 'Lê Thị B', role: 'Head of Design', bio: 'UI/UX designer với 8 năm kinh nghiệm. Chuyên về design token và cross-platform.' },
  { name: 'Trần Văn C', role: 'Lead Engineer', bio: 'Full-stack, chuyên Node.js + Vue. Cải thiện performance từ 40ms → 8ms trên data grid.' },
  { name: 'Nguyễn Thị D', role: 'QA Lead', bio: 'Automation testing, accessibility audit và lighthouse CI. Giữ quality gate nghiêm ngặt.' },
]

const VALUES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Rocket,        title: 'Tốc độ là tính năng',   desc: 'Mọi component đều được benchmark và optimize. Chúng tôi nghiêm túc về performance.' },
  { icon: Accessibility, title: 'Accessibility mặc định', desc: 'ARIA, keyboard nav, focus trap, contrast — không phải optional, là mặc định.' },
  { icon: Globe2,        title: 'Tiếng Việt first',       desc: 'Thiết kế cho i18n, mặc định tiếng Việt. UI Việt Nam xứng đáng được đầu tư đúng mức.' },
  { icon: Unlock,        title: 'Open & transparent',     desc: 'Mã nguồn mở, changelog công khai, roadmap rõ ràng. Không black box.' },
]
</script>

<template>
  <LandingLayout>
    <!-- hero -->
    <section class="about-hero">
      <div class="inner">
        <h1 class="about-title">Chúng tôi xây dựng UI kit mà <span class="accent">chúng tôi muốn dùng</span></h1>
        <p class="about-desc">WemakeUI bắt đầu từ nỗi đau thực tế — không có UI kit Vue 3 nào đủ tốt cho production-grade SaaS tiếng Việt. Vì vậy chúng tôi tự làm.</p>
      </div>
    </section>

    <!-- story -->
    <section class="section">
      <div class="inner">
        <div class="story-grid">
          <div>
            <h2 class="section-title">Câu chuyện</h2>
            <p class="section-text">Năm 2024, team chúng tôi mất 6 tuần chỉ để build một màn hình đăng nhập đẹp, responsive và accessible. Không phải vì thiếu người — mà vì không có component library nào đủ tốt cho tiếng Việt và cross-platform.</p>
            <p class="section-text">Chúng tôi quyết định build WemakeUI từ scratch: design token đầy đủ, dark mode đúng cách, RBAC tích hợp, 50+ page template sẵn sàng dùng. Sau 1 năm, đây là kết quả.</p>
          </div>
          <div class="stats-panel">
            <div v-for="[val, label] in [['120+','components'],['50+','page templates'],['1,200+','developer đang dùng'],['0','external deps cho chart']]" :key="label" class="stat-item">
              <span class="stat-val">{{ val }}</span>
              <span class="stat-label">{{ label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- values -->
    <section class="section section-alt">
      <div class="inner">
        <h2 class="section-title center">Giá trị cốt lõi</h2>
        <div class="values-grid">
          <div v-for="v in VALUES" :key="v.title" class="value-card">
            <component :is="v.icon" class="value-icon" :size="28" />
            <h3 class="value-name">{{ v.title }}</h3>
            <p class="value-desc">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- team -->
    <section class="section">
      <div class="inner">
        <h2 class="section-title center">Đội ngũ</h2>
        <div class="team-grid">
          <div v-for="m in TEAM" :key="m.name" class="team-card">
            <BaseAvatar :name="m.name" size="xl" />
            <h3 class="member-name">{{ m.name }}</h3>
            <span class="member-role">{{ m.role }}</span>
            <p class="member-bio">{{ m.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- join -->
    <section class="join-section">
      <div class="inner center">
        <h2 class="join-title">Muốn gia nhập đội ngũ?</h2>
        <p class="join-desc">Chúng tôi đang tìm kiếm Vue developer, designer và technical writer.</p>
        <BaseButton variant="primary" size="lg" tag="a" href="#/landing/careers">Xem vị trí mở</BaseButton>
      </div>
    </section>
  </LandingLayout>
</template>

<style scoped>
.about-hero { padding: var(--wx-space-12) var(--wx-space-5) var(--wx-space-10); background: var(--wx-gradient-bg); text-align: center; }
.about-title { font-size: var(--wx-fs-40); font-weight: 800; letter-spacing: var(--wx-tracking-tight); line-height: var(--wx-lh-tight); margin-bottom: var(--wx-space-4); }
.accent { color: var(--wx-brand-600); }
.about-desc { font-size: var(--wx-fs-18); color: var(--wx-content-secondary); max-width: 600px; margin: 0 auto; }

.section { padding: var(--wx-space-10) var(--wx-space-5); }
.section-alt { background: var(--wx-bg-sunken); }
.inner { max-width: 1100px; margin: 0 auto; }
.inner.center { text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-5); }
.section-title { font-size: var(--wx-fs-32); font-weight: var(--wx-fw-bold); letter-spacing: var(--wx-tracking-tight); margin-bottom: var(--wx-space-5); }
.section-title.center { text-align: center; }
.section-text { font-size: var(--wx-fs-16); color: var(--wx-content-secondary); line-height: var(--wx-lh-relaxed); margin-bottom: var(--wx-space-4); }

.story-grid { display: grid; grid-template-columns: 1fr 320px; gap: var(--wx-space-8); align-items: start; }
@media (max-width: 768px) { .story-grid { grid-template-columns: 1fr; } }
.stats-panel { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-4); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-xl); padding: var(--wx-space-6); }
.stat-item { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.stat-val { font-size: var(--wx-fs-32); font-weight: 800; letter-spacing: var(--wx-tracking-tight); color: var(--wx-brand-600); }
.stat-label { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }

.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--wx-space-5); }
.value-card { padding: var(--wx-space-5); background: var(--wx-bg-base); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-xl); }
.value-icon { font-size: 32px; display: block; margin-bottom: var(--wx-space-3); }
.value-name { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); margin: 0 0 var(--wx-space-2); }
.value-desc { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); line-height: var(--wx-lh-relaxed); margin: 0; }

.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--wx-space-5); }
.team-card { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-2); padding: var(--wx-space-5); text-align: center; }
.member-name { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); margin: 0; }
.member-role { font-size: var(--wx-fs-14); color: var(--wx-brand-600); font-weight: var(--wx-fw-medium); }
.member-bio { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); line-height: var(--wx-lh-relaxed); margin: 0; }

.join-section { padding: var(--wx-space-10) var(--wx-space-5); background: var(--wx-gradient-cta); }
.join-title { font-size: var(--wx-fs-32); font-weight: var(--wx-fw-bold); color: white; margin: 0; }
.join-desc { font-size: var(--wx-fs-16); color: rgba(255,255,255,0.8); margin: 0; }
</style>
