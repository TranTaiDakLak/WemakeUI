<script setup lang="ts">
import LandingLayout from '../_layouts/LandingLayout.vue'
import { BaseButton, BaseBadge, BaseAvatar } from '../../components/common'
</script>

<template>
  <LandingLayout>
    <article class="post-wrap">
      <header class="post-header">
        <div class="post-tags">
          <BaseBadge text="performance" variant="info" />
          <span class="read-time">8 phút đọc</span>
        </div>
        <h1 class="post-title">DataGridPro với 10.000 dòng: bí quyết virtual scroll 60fps</h1>
        <div class="post-meta">
          <BaseAvatar name="Trần Văn C" size="md" />
          <div>
            <span class="author-name">Trần Văn C</span>
            <span class="post-date">1 tháng 5, 2026</span>
          </div>
        </div>
      </header>

      <div class="post-content">
        <p class="lead">Khi lần đầu thử render 10.000 dòng dữ liệu với một DataGrid thông thường, trình duyệt mất gần 3 giây để render. Với virtual scroll đúng cách, chúng tôi đưa con số đó xuống dưới 50ms.</p>

        <h2>Virtual scroll là gì và tại sao cần?</h2>
        <p>Virtual scroll là kỹ thuật chỉ render các row đang nằm trong viewport, thay vì render toàn bộ danh sách. Ví dụ với 10.000 dòng và viewport cao 600px, chúng ta chỉ cần render ~20 dòng thực tế.</p>

        <h2>Cách triển khai trong WemakeUI DataGridPro</h2>
        <p>DataGridPro sử dụng một "window" cố định — chỉ render N rows trong viewport + buffer trước và sau. Khi user scroll, chúng ta cập nhật startIndex và endIndex, tái dùng DOM elements thay vì tạo mới.</p>

        <pre class="code-block"><code>// Tính toán rows cần render
const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer)
const endIndex = Math.min(rows.length, startIndex + visibleCount + buffer * 2)
const visibleRows = rows.slice(startIndex, endIndex)</code></pre>

        <h2>Xử lý row height không đồng đều</h2>
        <p>Trong trường hợp row có height khác nhau, chúng ta cần "measure" từng row sau khi render lần đầu và lưu vào cache. Điều này phức tạp hơn nhưng cần thiết cho row expand/collapse.</p>

        <h2>Kết quả</h2>
        <p>Sau khi áp dụng virtual scroll, thời gian render ban đầu từ 2.8s xuống còn 48ms. Scroll performance ổn định ở 60fps ngay cả trên thiết bị mid-range.</p>

        <div class="post-cta">
          <p>Muốn thử DataGridPro với 10k rows ngay bây giờ?</p>
          <BaseButton variant="primary" tag="a" href="#/showcase/data/grid">Mở DataGrid demo</BaseButton>
        </div>
      </div>

      <footer class="post-footer">
        <div class="author-card">
          <BaseAvatar name="Trần Văn C" size="lg" />
          <div>
            <span class="author-name">Trần Văn C</span>
            <span class="author-role">Lead Engineer tại WemakeUI</span>
            <p class="author-bio">Chuyên Vue + Node.js. Obsessed với performance và developer experience.</p>
          </div>
        </div>
        <div class="post-nav">
          <a href="#/landing/blog" class="nav-link">← Về danh sách bài viết</a>
        </div>
      </footer>
    </article>
  </LandingLayout>
</template>

<style scoped>
.post-wrap { max-width: 760px; margin: 0 auto; padding: var(--wx-space-10) var(--wx-space-5); }
.post-header { margin-bottom: var(--wx-space-8); }
.post-tags { display: flex; align-items: center; gap: var(--wx-space-3); margin-bottom: var(--wx-space-4); }
.read-time { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.post-title { font-size: var(--wx-fs-40); font-weight: 800; letter-spacing: var(--wx-tracking-tight); line-height: var(--wx-lh-tight); margin: 0 0 var(--wx-space-5); }
.post-meta { display: flex; align-items: center; gap: var(--wx-space-3); }
.author-name { display: block; font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); }
.post-date { display: block; font-size: var(--wx-fs-13); color: var(--wx-content-muted); }

.post-content { font-size: var(--wx-fs-16); line-height: var(--wx-lh-relaxed); color: var(--wx-content-primary); }
.post-content .lead { font-size: var(--wx-fs-18); color: var(--wx-content-secondary); margin-bottom: var(--wx-space-6); }
.post-content h2 { font-size: var(--wx-fs-24); font-weight: var(--wx-fw-semibold); letter-spacing: var(--wx-tracking-tight); margin: var(--wx-space-7) 0 var(--wx-space-3); }
.post-content p { margin: 0 0 var(--wx-space-4); }
.code-block { background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-lg); padding: var(--wx-space-5); overflow-x: auto; margin: var(--wx-space-4) 0; }
.code-block code { font-family: var(--wx-font-mono); font-size: var(--wx-fs-13); color: var(--wx-content-primary); }
.post-cta { margin-top: var(--wx-space-7); padding: var(--wx-space-6); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-xl); display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-4); flex-wrap: wrap; }
.post-cta p { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-medium); margin: 0; }

.post-footer { margin-top: var(--wx-space-10); padding-top: var(--wx-space-6); border-top: 1px solid var(--wx-border-subtle); display: flex; flex-direction: column; gap: var(--wx-space-5); }
.author-card { display: flex; gap: var(--wx-space-4); align-items: flex-start; }
.author-role { display: block; font-size: var(--wx-fs-13); color: var(--wx-content-muted); margin-top: 2px; }
.author-bio { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); margin: var(--wx-space-2) 0 0; line-height: var(--wx-lh-normal); }
.nav-link { font-size: var(--wx-fs-14); color: var(--wx-content-link); text-decoration: none; }
.nav-link:hover { text-decoration: underline; }
</style>
