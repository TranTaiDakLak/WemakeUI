<script setup lang="ts">
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseAvatar, BaseButton, BaseBadge, BaseTag, BaseCard } from '../../components/common'

const stats = [
  { label: 'Dự án', value: '24' },
  { label: 'Đóng góp', value: '1,284' },
  { label: 'Đánh giá', value: '4.9 ★' },
  { label: 'Chuỗi', value: '42 ngày' },
]

const skills = ['Vue 3', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Figma', 'REST API', 'GraphQL']

const recent = [
  { title: 'Cập nhật thiết kế landing page', time: '2 giờ trước', type: 'commit' },
  { title: 'Đóng ticket #284 — lỗi auth redirect', time: '5 giờ trước', type: 'close' },
  { title: 'Review PR #301 — thêm FilterBuilder', time: 'Hôm qua', type: 'review' },
  { title: 'Tạo issue #305 — dark mode toggle', time: 'Hôm qua', type: 'open' },
]
</script>

<template>
  <AppPageLayout section="app" current="hồ sơ" page-title="Hồ sơ cá nhân" page-description="Thông tin cá nhân và lịch sử hoạt động">
    <template #actions>
      <BaseButton size="sm" variant="secondary" tag="a" href="#/app/profile/edit">Chỉnh sửa</BaseButton>
    </template>

    <div class="profile-grid">
      <!-- left: profile card -->
      <div class="profile-sidebar">
        <BaseCard class="profile-card">
          <template #body>
            <div class="avatar-block">
              <BaseAvatar name="Nguyễn Văn A" size="xl" />
              <BaseBadge text="online" variant="success" dot />
            </div>
            <h1 class="profile-name">Nguyễn Văn A</h1>
            <p class="profile-role">Senior Frontend Engineer</p>
            <p class="profile-company">WemakeUI · Hà Nội, Việt Nam</p>
            <p class="profile-bio">Xây dựng UI kit cross-platform cho Vue 3. Đam mê design system, performance, và DX tốt.</p>
            <div class="social-row">
              <BaseButton size="sm" variant="ghost">GitHub</BaseButton>
              <BaseButton size="sm" variant="ghost">LinkedIn</BaseButton>
              <BaseButton size="sm" variant="ghost">X</BaseButton>
            </div>
          </template>
        </BaseCard>

        <BaseCard>
          <template #header><span class="card-label">Kỹ năng</span></template>
          <template #body>
            <div class="skills">
              <BaseTag v-for="s in skills" :key="s" :text="s" size="sm" variant="neutral" />
            </div>
          </template>
        </BaseCard>
      </div>

      <!-- right: stats + activity -->
      <div class="profile-main">
        <div class="stats-row">
          <BaseCard v-for="s in stats" :key="s.label" class="stat-card">
            <template #body>
              <span class="stat-value">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </template>
          </BaseCard>
        </div>

        <BaseCard>
          <template #header><span class="card-label">Hoạt động gần đây</span></template>
          <template #body>
            <ul class="activity-list">
              <li v-for="a in recent" :key="a.title" class="activity-item">
                <span class="act-dot" :data-type="a.type" />
                <div class="act-body">
                  <span class="act-title">{{ a.title }}</span>
                  <span class="act-time">{{ a.time }}</span>
                </div>
              </li>
            </ul>
          </template>
        </BaseCard>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.profile-grid { display: grid; grid-template-columns: 280px 1fr; gap: var(--wx-space-5); align-items: start; }
@media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } }
.profile-sidebar { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.profile-main { display: flex; flex-direction: column; gap: var(--wx-space-4); }

.profile-card :deep(.wx-card__body) { text-align: center; }
.avatar-block { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-2); margin-bottom: var(--wx-space-3); }
.profile-name { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-bold); margin: 0; }
.profile-role { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); margin: var(--wx-space-1) 0 0; }
.profile-company { font-size: var(--wx-fs-13); color: var(--wx-content-muted); margin: var(--wx-space-1) 0 0; }
.profile-bio { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); margin: var(--wx-space-3) 0; line-height: var(--wx-lh-normal); }
.social-row { display: flex; justify-content: center; gap: var(--wx-space-2); }

.card-label { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); }
.skills { display: flex; flex-wrap: wrap; gap: var(--wx-space-2); }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--wx-space-3); }
@media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
.stat-card :deep(.wx-card__body) { text-align: center; padding: var(--wx-space-4) var(--wx-space-3); }
.stat-value { display: block; font-size: var(--wx-fs-24); font-weight: var(--wx-fw-bold); color: var(--wx-content-primary); }
.stat-label { display: block; font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin-top: var(--wx-space-1); }

.activity-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--wx-space-3); }
.activity-item { display: flex; align-items: flex-start; gap: var(--wx-space-3); }
.act-dot {
  width: 10px; height: 10px; border-radius: var(--wx-radius-full);
  background: var(--wx-brand-500); margin-top: 4px; flex-shrink: 0;
}
.act-dot[data-type="close"] { background: var(--wx-status-danger-border); }
.act-dot[data-type="review"] { background: var(--wx-status-warning-border); }
.act-dot[data-type="open"] { background: var(--wx-status-success-border); }
.act-body { display: flex; flex-direction: column; gap: 2px; }
.act-title { font-size: var(--wx-fs-14); color: var(--wx-content-primary); }
.act-time { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
</style>
