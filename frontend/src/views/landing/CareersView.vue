<script setup lang="ts">
import { ref } from 'vue'
import LandingLayout from '../_layouts/LandingLayout.vue'
import { BaseBadge, BaseButton, BaseTag } from '../../components/common'

const filter = ref('tất cả')
const DEPTS = ['tất cả', 'engineering', 'design', 'marketing']

const JOBS = [
  { id: 1, title: 'Senior Vue 3 Developer', dept: 'engineering', type: 'Full-time', location: 'Hà Nội / Remote', desc: 'Phát triển và maintain WemakeUI component library. Yêu cầu 3+ năm Vue, TypeScript.' },
  { id: 2, title: 'UI/UX Designer', dept: 'design', type: 'Full-time', location: 'TP.HCM / Remote', desc: 'Thiết kế component mới, cải thiện design system và tài liệu Figma.' },
  { id: 3, title: 'Technical Writer', dept: 'marketing', type: 'Part-time', location: 'Remote', desc: 'Viết tài liệu kỹ thuật, tutorial và changelog. Yêu cầu biết Vue cơ bản.' },
  { id: 4, title: 'DevOps Engineer', dept: 'engineering', type: 'Full-time', location: 'Remote', desc: 'CI/CD pipeline, bundle analysis, lighthouse CI và npm publish automation.' },
]

const filtered = computed(() => filter.value === 'tất cả' ? JOBS : JOBS.filter(j => j.dept === filter.value))
import { computed } from 'vue'
</script>

<template>
  <LandingLayout>
    <section class="careers-hero">
      <h1 class="careers-title">Gia nhập đội ngũ WemakeUI</h1>
      <p class="careers-desc">Chúng tôi đang tìm kiếm những người đam mê DX, design system và developer tools.</p>
    </section>

    <section class="careers-section">
      <div class="careers-inner">
        <div class="culture-grid">
          <div v-for="[icon, label, desc] in [['🏖️','Flexible work','Remote-first, flexi hours'],['📚','L&D budget','2M/năm cho học tập'],['🏥','Bảo hiểm đầy đủ','BHXH + bảo hiểm sức khoẻ'],['💰','Stock options','ESOP cho nhân viên toàn thời gian']]" :key="label" class="culture-card">
            <span class="culture-icon">{{ icon }}</span>
            <span class="culture-label">{{ label }}</span>
            <span class="culture-desc">{{ desc }}</span>
          </div>
        </div>

        <div class="jobs-section">
          <div class="jobs-header">
            <h2 class="jobs-title">Vị trí đang tuyển ({{ filtered.length }})</h2>
            <div class="dept-filters">
              <BaseTag v-for="d in DEPTS" :key="d" :text="d" size="sm" :variant="filter === d ? 'primary' : 'neutral'" style="cursor:pointer" @click="filter = d" />
            </div>
          </div>

          <div class="jobs-list">
            <div v-for="job in filtered" :key="job.id" class="job-card">
              <div class="job-info">
                <h3 class="job-title">{{ job.title }}</h3>
                <div class="job-meta">
                  <BaseBadge :text="job.dept" variant="neutral" size="sm" />
                  <span class="job-type">{{ job.type }}</span>
                  <span class="job-loc">📍 {{ job.location }}</span>
                </div>
                <p class="job-desc">{{ job.desc }}</p>
              </div>
              <BaseButton size="sm" variant="primary">Ứng tuyển</BaseButton>
            </div>
          </div>

          <div v-if="filtered.length === 0" class="no-jobs">
            <span>Không có vị trí phù hợp. Gửi CV tổng hợp tới <a href="mailto:careers@wemakeui.vn">careers@wemakeui.vn</a></span>
          </div>
        </div>
      </div>
    </section>
  </LandingLayout>
</template>

<style scoped>
.careers-hero { padding: var(--wx-space-12) var(--wx-space-5) var(--wx-space-8); text-align: center; background: var(--wx-gradient-bg); }
.careers-title { font-size: var(--wx-fs-40); font-weight: 800; letter-spacing: var(--wx-tracking-tight); margin-bottom: var(--wx-space-3); }
.careers-desc { font-size: var(--wx-fs-18); color: var(--wx-content-secondary); margin: 0; }
.careers-section { padding: var(--wx-space-8) var(--wx-space-5); }
.careers-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--wx-space-8); }

.culture-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--wx-space-4); }
.culture-card { padding: var(--wx-space-4); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-lg); display: flex; flex-direction: column; gap: var(--wx-space-2); }
.culture-icon { font-size: 28px; }
.culture-label { font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); }
.culture-desc { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }

.jobs-section { display: flex; flex-direction: column; gap: var(--wx-space-5); }
.jobs-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--wx-space-3); }
.jobs-title { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-semibold); margin: 0; }
.dept-filters { display: flex; gap: var(--wx-space-2); flex-wrap: wrap; }

.jobs-list { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.job-card { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--wx-space-5); padding: var(--wx-space-5); background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); }
.job-info { flex: 1; display: flex; flex-direction: column; gap: var(--wx-space-2); }
.job-title { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); margin: 0; }
.job-meta { display: flex; align-items: center; gap: var(--wx-space-3); flex-wrap: wrap; }
.job-type { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-medium); color: var(--wx-content-secondary); }
.job-loc { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.job-desc { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); line-height: var(--wx-lh-normal); margin: 0; }
.no-jobs { text-align: center; padding: var(--wx-space-6); color: var(--wx-content-muted); font-size: var(--wx-fs-14); }
.no-jobs a { color: var(--wx-content-link); }
</style>
