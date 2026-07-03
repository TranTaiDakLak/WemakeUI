<script setup lang="ts">
import { ref, computed } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseTag, BaseProgress, BaseCard, BaseTabs } from '../../components/common'

const tab = ref('khoa-hoc')
const tabs = [
  { key: 'khoa-hoc', label: 'Khoá học' },
  { key: 'cua-toi', label: 'Của tôi' },
  { key: 'da-hoan-thanh', label: 'Đã hoàn thành' },
]

const COURSES = [
  { id: 1, title: 'Vue 3 Mastery', category: 'Frontend', level: 'Nâng cao', lessons: 42, duration: '12 giờ', progress: 68, enrolled: true, rating: 4.9, students: 1284, thumb: '🎯' },
  { id: 2, title: 'TypeScript Deep Dive', category: 'Frontend', level: 'Trung cấp', lessons: 28, duration: '8 giờ', progress: 35, enrolled: true, rating: 4.8, students: 892, thumb: '🔷' },
  { id: 3, title: 'Node.js & REST API', category: 'Backend', level: 'Cơ bản', lessons: 35, duration: '10 giờ', progress: 0, enrolled: false, rating: 4.7, students: 2100, thumb: '🌿' },
  { id: 4, title: 'PostgreSQL Essentials', category: 'Database', level: 'Cơ bản', lessons: 22, duration: '6 giờ', progress: 0, enrolled: false, rating: 4.6, students: 754, thumb: '🐘' },
  { id: 5, title: 'Docker & CI/CD', category: 'DevOps', level: 'Trung cấp', lessons: 30, duration: '9 giờ', progress: 100, enrolled: true, rating: 4.9, students: 1560, thumb: '🐳' },
  { id: 6, title: 'Figma UI Design', category: 'Design', level: 'Cơ bản', lessons: 18, duration: '5 giờ', progress: 0, enrolled: false, rating: 4.5, students: 3200, thumb: '🎨' },
]

const LEVEL_VARIANTS: Record<string, 'success' | 'warning' | 'danger'> = {
  'Cơ bản': 'success', 'Trung cấp': 'warning', 'Nâng cao': 'danger',
}

const enrolled = computed(() => COURSES.filter(c => c.enrolled && c.progress < 100))
const completed = computed(() => COURSES.filter(c => c.progress === 100))
const displaying = computed(() => tab.value === 'khoa-hoc' ? COURSES : tab.value === 'cua-toi' ? enrolled.value : completed.value)

</script>

<template>
  <AppPageLayout section="app" current="học tập" page-title="Trung tâm học tập" page-description="Nâng cao kỹ năng với các khoá học được tuyển chọn">
    <BaseTabs v-model="tab" :tabs="tabs" />

    <div class="courses-grid" v-reveal>
      <BaseCard v-for="(c, i) in displaying" :key="c.id" v-reveal="i * 60" class="course-card" hover-effect="lift">
        <template #header>
          <div class="course-thumb">{{ c.thumb }}</div>
        </template>
        <template #body>
          <div class="course-meta">
            <BaseTag :label="c.category" size="sm" variant="neutral" />
            <BaseBadge :text="c.level" :variant="LEVEL_VARIANTS[c.level]" size="sm" />
          </div>
          <h3 class="course-title">{{ c.title }}</h3>
          <div class="course-stats">
            <span>{{ c.lessons }} bài học</span>
            <span>·</span>
            <span>{{ c.duration }}</span>
            <span>·</span>
            <span>⭐ {{ c.rating }}</span>
            <span>·</span>
            <span>{{ c.students.toLocaleString() }} học viên</span>
          </div>
          <div v-if="c.enrolled && c.progress > 0" class="progress-wrap">
            <div class="progress-label">
              <span>Tiến độ</span>
              <span>{{ c.progress }}%</span>
            </div>
            <BaseProgress :value="c.progress" :variant="c.progress === 100 ? 'success' : 'primary'" size="sm" />
          </div>
        </template>
        <template #footer>
          <BaseButton v-if="!c.enrolled" variant="primary" size="sm" block>Đăng ký học</BaseButton>
          <BaseButton v-else-if="c.progress === 100" variant="success" size="sm" block>Xem chứng chỉ</BaseButton>
          <BaseButton v-else variant="secondary" size="sm" block>Tiếp tục học (bài {{ Math.ceil(c.lessons * c.progress / 100) }}/{{ c.lessons }})</BaseButton>
        </template>
      </BaseCard>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--wx-space-4); }
.course-thumb { height: 80px; display: flex; align-items: center; justify-content: center; font-size: 40px; background: var(--wx-bg-sunken); border-radius: var(--wx-radius-md); }
.course-meta { display: flex; gap: var(--wx-space-2); margin-bottom: var(--wx-space-2); }
.course-title { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); margin: 0 0 var(--wx-space-2); }
.course-stats { display: flex; gap: var(--wx-space-2); font-size: var(--wx-fs-12); color: var(--wx-content-muted); flex-wrap: wrap; }
.progress-wrap { margin-top: var(--wx-space-3); display: flex; flex-direction: column; gap: var(--wx-space-1); }
.progress-label { display: flex; justify-content: space-between; font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
</style>
