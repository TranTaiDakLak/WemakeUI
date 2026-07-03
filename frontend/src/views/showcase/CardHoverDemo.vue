<script setup lang="ts">
/**
 * Card Hover Demo — so sánh 3 kiểu hover effect mới của BaseCard.
 * Truy cập: /showcase/card-hover-demo
 */
import { BaseCard } from '../../components/common'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import PageHeader from '../../components/layout/PageHeader.vue'
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="card hover effects" />

    <main class="main">
      <PageHeader
        title="Card Hover Effects"
        description="3 kiểu hover effect mới cho BaseCard — dùng prop hoverEffect. Rê chuột vào từng card để so sánh."
      />

      <!-- ── Section: Glow ── -->
      <section class="section">
        <h2 class="section-title">
          <code class="section-code">hoverEffect="glow"</code>
          Gradient Border Glow
        </h2>
        <p class="section-desc">
          Border chuyển thành gradient cyan → blue → violet phát sáng quanh card.
          Phù hợp cho: featured items, premium cards, highlight content.
        </p>
        <div class="card-row">
          <BaseCard hover-effect="glow" title="Dashboard Overview" subtitle="4 KPI + sparkline chart">
            Hiển thị tổng quan dữ liệu với biểu đồ realtime và chỉ số quan trọng.
          </BaseCard>
          <BaseCard hover-effect="glow" title="Analytics Report" subtitle="Traffic + conversion">
            Phân tích traffic nguồn và chuyển đổi funnel theo thời gian.
          </BaseCard>
          <BaseCard hover-effect="glow" title="Team Activity" subtitle="12 members online">
            Feed hoạt động nhóm: commits, deploys, reviews mới nhất.
          </BaseCard>
        </div>
      </section>

      <!-- ── Section: Lift ── -->
      <section class="section">
        <h2 class="section-title">
          <code class="section-code">hoverEffect="lift"</code>
          Lift + Deep Shadow
        </h2>
        <p class="section-desc">
          Card nhấc lên 4px kèm shadow lan rộng — cảm giác "floating". Dùng bounce easing.
          Phù hợp cho: clickable cards, navigation tiles, product cards.
        </p>
        <div class="card-row">
          <BaseCard hover-effect="lift" clickable title="SaaS Platform" subtitle="10 pages">
            Bảng điều khiển quản trị SaaS với sidebar navigation đầy đủ.
          </BaseCard>
          <BaseCard hover-effect="lift" clickable title="E-commerce" subtitle="Product detail">
            Gallery + variants + quantity + reviews với rating bars.
          </BaseCard>
          <BaseCard hover-effect="lift" clickable title="Project Manager" subtitle="Sprint board">
            Kanban board drag-drop + burndown chart + team status.
          </BaseCard>
        </div>
      </section>

      <!-- ── Section: Shimmer ── -->
      <section class="section">
        <h2 class="section-title">
          <code class="section-code">hoverEffect="shimmer"</code>
          Scale + Brand Shimmer
        </h2>
        <p class="section-desc">
          Card scale nhẹ (1.5%) + ánh sáng brand color sweep chậm qua (0.9s).
          Phù hợp cho: template gallery, showcase items, call-to-action cards.
        </p>
        <div class="card-row">
          <BaseCard hover-effect="shimmer" title="Auth Flow" subtitle="Login + Register + OTP">
            Bộ màn xác thực 10 trang: login, register, forgot, OTP, onboarding.
          </BaseCard>
          <BaseCard hover-effect="shimmer" title="Landing Page" subtitle="Hero + Features + CTA">
            Marketing landing page với hero gradient, feature grid, pricing.
          </BaseCard>
          <BaseCard hover-effect="shimmer" title="Dashboard Suite" subtitle="12 dashboards">
            Bộ dashboard theo ngành: finance, CRM, logistics, helpdesk, IoT.
          </BaseCard>
        </div>
      </section>

      <!-- ── Section: Combined comparison ── -->
      <section class="section">
        <h2 class="section-title">So sánh cạnh nhau</h2>
        <p class="section-desc">
          3 card cùng nội dung, khác hover effect — rê chuột lần lượt để cảm nhận.
        </p>
        <div class="card-row">
          <BaseCard hover-effect="glow" title="Glow" subtitle="gradient border">
            Rê chuột vào đây để thấy viền gradient phát sáng.
          </BaseCard>
          <BaseCard hover-effect="lift" title="Lift" subtitle="floating shadow">
            Rê chuột vào đây để thấy card nhấc lên.
          </BaseCard>
          <BaseCard hover-effect="shimmer" title="Shimmer" subtitle="brand sweep">
            Rê chuột vào đây để thấy ánh sáng chạy qua.
          </BaseCard>
          <BaseCard hover-effect="glow-lift" title="Glow + Lift" subtitle="kết hợp cả hai">
            Vừa nhấc lên + shadow sâu, vừa có vùng xanh gradient fade từ rìa.
          </BaseCard>
          <BaseCard hover-effect="glow-shimmer" title="Glow + Shimmer" subtitle="kết hợp cả hai">
            Vừa có vùng xanh gradient fade, vừa có ánh sáng sweep qua.
          </BaseCard>
        </div>
        <p class="section-desc">
          <strong>lift</strong> và <strong>shimmer</strong> không combine được với nhau vì cả hai cùng dùng
          <code class="inline-code">transform</code> (translateY vs scale) — sẽ ghi đè lẫn nhau.
          <strong>glow</strong> dùng <code class="inline-code">::before</code> nên combine an toàn với cả hai.
        </p>
      </section>

      <!-- ── Section: Accent color ── -->
      <section class="section">
        <h2 class="section-title">
          <code class="section-code">accentColor</code>
          Viền trái + glow theo màu riêng
        </h2>
        <p class="section-desc">
          Thêm viền trái 3px và nhuộm màu glow/lift theo <code class="inline-code">accentColor</code> thay vì
          <code class="inline-code">--wx-brand-primary</code> mặc định — dùng khi mỗi card cần 1 màu nhận diện riêng
          (ví dụ: lưới app template, danh mục).
        </p>
        <div class="card-row">
          <BaseCard accent-color="#2563eb" hover-effect="glow-lift" title="SaaS Admin" subtitle="Internal tool · 7 trang" />
          <BaseCard accent-color="#7c3aed" hover-effect="glow-lift" title="WemakeUI Platform" subtitle="SaaS app · 10 trang" />
          <BaseCard accent-color="#dc2626" hover-effect="glow-lift" title="Marketing Site" subtitle="Marketing · 6 trang" />
          <BaseCard accent-color="#ea580c" hover-effect="glow-lift" title="Landing Pages" subtitle="Landing · 10 trang" />
        </div>
      </section>

      <!-- ── Section: Usage ── -->
      <section class="section">
        <h2 class="section-title">Cách dùng</h2>
        <pre class="code-block"><code>&lt;!-- Vùng xanh fade từ rìa vào --&gt;
&lt;BaseCard hover-effect="glow" title="Featured"&gt;...&lt;/BaseCard&gt;

&lt;!-- Nhấc lên + shadow sâu --&gt;
&lt;BaseCard hover-effect="lift" title="Navigate"&gt;...&lt;/BaseCard&gt;

&lt;!-- Scale + ánh sáng brand sweep --&gt;
&lt;BaseCard hover-effect="shimmer" title="Showcase"&gt;...&lt;/BaseCard&gt;

&lt;!-- Kết hợp: glow + lift cùng lúc --&gt;
&lt;BaseCard hover-effect="glow-lift" title="Premium"&gt;...&lt;/BaseCard&gt;

&lt;!-- Kết hợp: glow + shimmer cùng lúc --&gt;
&lt;BaseCard hover-effect="glow-shimmer" title="Premium"&gt;...&lt;/BaseCard&gt;

&lt;!-- Viền trái + glow theo màu riêng --&gt;
&lt;BaseCard accent-color="#2563eb" hover-effect="glow-lift" title="SaaS Admin"&gt;...&lt;/BaseCard&gt;</code></pre>

        <h3 class="section-subtitle">Về màu sắc</h3>
        <p class="section-desc">
          Mặc định, tất cả hover effect dùng <code class="inline-code">--wx-brand-primary</code> từ token hệ thống.
          Khi thay đổi brand color (ví dụ override thành đỏ, tím, xanh lá...), hover effect tự động đổi theo — không cần sửa gì thêm.
          Truyền <code class="inline-code">accentColor</code> để override màu riêng cho từng card (không phụ thuộc brand color).
        </p>

        <h3 class="section-subtitle">Khi nào dùng effect nào?</h3>
        <ul class="usage-list">
          <li><strong>glow</strong> — highlight content, featured items, trạng thái active</li>
          <li><strong>lift</strong> — clickable cards, navigation tiles, product cards</li>
          <li><strong>shimmer</strong> — template gallery, showcase items, CTA</li>
          <li><strong>glow-lift</strong> — premium cards, hero content, important actions</li>
          <li><strong>glow-shimmer</strong> — featured + showcase kết hợp, không cần lift</li>
          <li><strong>accentColor</strong> — lưới nhiều item cần phân biệt màu theo danh mục/loại</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--wx-surface-sunken);
}
.main {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--wx-space-6) var(--wx-space-5) var(--wx-space-10);
}
.section {
  margin-top: var(--wx-space-8);
}
.section-title {
  margin: 0;
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-bold);
  color: var(--wx-text-primary);
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  flex-wrap: wrap;
}
.section-code {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
  padding: var(--wx-space-1) var(--wx-space-2);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  color: var(--wx-brand-primary);
}
.section-desc {
  margin: var(--wx-space-2) 0 var(--wx-space-4);
  font-size: var(--wx-fs-14);
  color: var(--wx-text-secondary);
  line-height: var(--wx-lh-relaxed);
}
.card-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--wx-space-4);
}
.code-block {
  margin: var(--wx-space-4) 0 0;
  padding: var(--wx-space-4);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-primary);
  line-height: var(--wx-lh-relaxed);
  overflow-x: auto;
  white-space: pre;
}
.section-subtitle {
  margin: var(--wx-space-5) 0 var(--wx-space-1);
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
}
.inline-code {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  padding: 2px var(--wx-space-1);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-sm);
  color: var(--wx-brand-primary);
}
.usage-list {
  margin: var(--wx-space-2) 0 0;
  padding-left: var(--wx-space-5);
  font-size: var(--wx-fs-14);
  color: var(--wx-text-secondary);
  line-height: var(--wx-lh-relaxed);
}
.usage-list li {
  margin-bottom: var(--wx-space-2);
}
.usage-list strong {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-primary);
}

@media (max-width: 640px) {
  .card-row { grid-template-columns: 1fr; }
  .main { padding: var(--wx-space-4) var(--wx-space-3); }
}
</style>
