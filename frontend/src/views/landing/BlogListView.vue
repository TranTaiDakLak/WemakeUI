<script setup lang="ts">
import { ref } from 'vue'
import LandingLayout from '../_layouts/LandingLayout.vue'
import { BaseTag, BaseButton } from '../../components/common'

const activeTag = ref('tất cả')

const TAGS = ['tất cả', 'tutorial', 'design system', 'performance', 'accessibility', 'news']

const POSTS = [
  { id: 1, title: 'DataGridPro với 10.000 dòng: bí quyết virtual scroll 60fps', date: '2026-05-01', author: 'Trần Văn C', tag: 'performance', readTime: '8 phút', thumb: '📊', excerpt: 'Chia sẻ kỹ thuật tối ưu DataGrid để scroll mượt mà ngay cả với 100k rows — window virtualization, row measurement và tricky edge cases.' },
  { id: 2, title: 'Xây dựng design token đúng cách với CSS custom properties', date: '2026-04-25', author: 'Lê Thị B', tag: 'design system', readTime: '6 phút', thumb: '🎨', excerpt: 'Hướng dẫn tổ chức token từ raw → semantic → component. Tại sao không được hardcode màu sắc và làm thế nào để dark mode không đau.' },
  { id: 3, title: 'Accessibility trong Vue 3: Checklist thực chiến', date: '2026-04-18', author: 'Nguyễn Thị D', tag: 'accessibility', readTime: '10 phút', thumb: '♿', excerpt: 'Hơn 20 điểm kiểm tra accessibility mà mọi Vue component cần pass: focus trap, ARIA, keyboard nav, contrast ratio và cách test bằng axe.' },
  { id: 4, title: 'WemakeUI v0.8 ra mắt: Chart system và 27 page template mới', date: '2026-04-10', author: 'Nguyễn Văn A', tag: 'news', readTime: '4 phút', thumb: '🚀', excerpt: 'Phiên bản 0.8 bổ sung 7 chart SVG thuần (không deps), 27 page template auth + dashboard + error, DevPanel và hơn 40 bug fix.' },
  { id: 5, title: 'Vue 3 Composition API best practices: composable design patterns', date: '2026-04-02', author: 'Trần Văn C', tag: 'tutorial', readTime: '12 phút', thumb: '🧩', excerpt: 'Cách thiết kế composable tốt: naming convention, return value, state management và cách tránh reactivity pitfalls phổ biến.' },
  { id: 6, title: 'Bundle size dưới 200KB: code splitting chiến lược', date: '2026-03-25', author: 'Nguyễn Văn A', tag: 'performance', readTime: '7 phút', thumb: '⚡', excerpt: 'Phân tích bundle WemakeUI và chiến lược chia nhỏ chunk: dynamic import, defineAsyncComponent, prefetch on hover và font subset.' },
]

const filtered = computed(() => activeTag.value === 'tất cả' ? POSTS : POSTS.filter(p => p.tag === activeTag.value))

import { computed } from 'vue'
</script>

<template>
  <LandingLayout>
    <section class="blog-hero">
      <h1 class="blog-title">Blog</h1>
      <p class="blog-desc">Kiến thức, tutorial và cập nhật từ đội ngũ WemakeUI.</p>
    </section>

    <section class="blog-section">
      <div class="blog-inner">
        <div class="tag-bar">
          <BaseTag
            v-for="t in TAGS" :key="t" :text="t" size="sm"
            :variant="activeTag === t ? 'primary' : 'neutral'"
            style="cursor: pointer"
            @click="activeTag = t"
          />
        </div>

        <div class="posts-grid">
          <a v-for="p in filtered" :key="p.id" href="#/landing/blog-post" class="post-card">
            <div class="post-thumb">{{ p.thumb }}</div>
            <div class="post-body">
              <div class="post-meta">
                <BaseTag :text="p.tag" size="sm" variant="neutral" />
                <span class="post-date">{{ p.date }}</span>
                <span class="post-read">{{ p.readTime }} đọc</span>
              </div>
              <h2 class="post-title">{{ p.title }}</h2>
              <p class="post-excerpt">{{ p.excerpt }}</p>
              <div class="post-author">
                <span class="author-name">{{ p.author }}</span>
              </div>
            </div>
          </a>
        </div>

        <div class="load-more">
          <BaseButton variant="secondary">Xem thêm bài viết</BaseButton>
        </div>
      </div>
    </section>
  </LandingLayout>
</template>

<style scoped>
.blog-hero { padding: var(--wx-space-12) var(--wx-space-5) var(--wx-space-8); text-align: center; background: var(--wx-gradient-bg); }
.blog-title { font-size: var(--wx-fs-48); font-weight: 800; letter-spacing: var(--wx-tracking-tight); margin-bottom: var(--wx-space-3); }
.blog-desc { font-size: var(--wx-fs-18); color: var(--wx-content-secondary); margin: 0; }

.blog-section { padding: var(--wx-space-8) var(--wx-space-5); }
.blog-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--wx-space-6); }
.tag-bar { display: flex; flex-wrap: wrap; gap: var(--wx-space-2); }

.posts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--wx-space-5); }
.post-card { display: flex; flex-direction: column; background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-xl); overflow: hidden; text-decoration: none; color: inherit; transition: all var(--wx-d-normal) var(--wx-ease-standard); }
.post-card:hover { border-color: var(--wx-brand-300); transform: translateY(-2px); box-shadow: var(--wx-shadow-lg); }
.post-thumb { height: 120px; background: var(--wx-bg-sunken); display: flex; align-items: center; justify-content: center; font-size: 48px; }
.post-body { padding: var(--wx-space-5); display: flex; flex-direction: column; gap: var(--wx-space-3); flex: 1; }
.post-meta { display: flex; align-items: center; gap: var(--wx-space-3); flex-wrap: wrap; }
.post-date { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.post-read { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.post-title { font-size: var(--wx-fs-18); font-weight: var(--wx-fw-semibold); line-height: var(--wx-lh-snug); margin: 0; color: var(--wx-content-primary); }
.post-excerpt { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); line-height: var(--wx-lh-relaxed); margin: 0; flex: 1; }
.post-author { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.author-name { font-weight: var(--wx-fw-medium); }
.load-more { display: flex; justify-content: center; }
</style>
