<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseTag, BaseProgress, BaseCard } from '../../components/common'

const qty = ref(1)
const selectedColor = ref('Xanh dương')
const selectedSize = ref('M')

const COLORS = ['Xanh dương', 'Đen', 'Trắng', 'Xám']
const SIZES = ['XS', 'S', 'M', 'L', 'XL']

const REVIEWS = [
  { id: 1, name: 'Lê Thị B', rating: 5, text: 'Sản phẩm rất tốt, vải mềm mại và thoáng khí. Sẽ mua lại.', date: '2026-04-20' },
  { id: 2, name: 'Trần Văn C', rating: 4, text: 'Chất lượng ổn, giao hàng nhanh. Màu hơi khác so với ảnh nhưng vẫn đẹp.', date: '2026-04-15' },
  { id: 3, name: 'Nguyễn Thị D', rating: 5, text: 'Mặc rất thoải mái, form đẹp. Đã mua được 3 cái rồi.', date: '2026-04-10' },
]

const RATINGS = [5, 4, 3, 2, 1]
const ratingCounts = [12, 5, 2, 1, 0]
const totalReviews = ratingCounts.reduce((a, b) => a + b, 0)
const avgRating = (RATINGS.reduce((s, r, i) => s + r * ratingCounts[i], 0) / totalReviews).toFixed(1)
</script>

<template>
  <AppPageLayout section="app" current="sản phẩm" page-title="Chi tiết sản phẩm" page-description="Áo thun premium — WemakeUI Collection 2026">
    <div class="product-layout">
      <!-- images -->
      <div class="product-images">
        <div class="main-image">
          <div class="image-placeholder">🖼️<br><span>Ảnh sản phẩm</span></div>
        </div>
        <div class="thumb-row">
          <div v-for="i in 4" :key="i" class="thumb" :class="{ active: i === 1 }" />
        </div>
      </div>

      <!-- details -->
      <div class="product-details">
        <div class="product-badges">
          <BaseBadge text="Còn hàng" variant="success" dot />
          <BaseBadge text="Mới" variant="info" />
          <BaseBadge text="Bán chạy" variant="warning" />
        </div>

        <h1 class="product-name">Áo thun Premium WemakeUI</h1>
        <p class="product-sku">SKU: WM-TS-2026-042</p>

        <div class="price-row">
          <span class="price">299.000 ₫</span>
          <span class="price-old">399.000 ₫</span>
          <BaseBadge text="-25%" variant="danger" />
        </div>

        <div class="rating-inline">
          <span class="stars">★★★★★</span>
          <span class="rating-num">{{ avgRating }}</span>
          <span class="rating-count">({{ totalReviews }} đánh giá)</span>
        </div>

        <p class="product-desc">
          Áo thun chất liệu cotton 100% cao cấp, thoáng khí và bền bỉ. Thiết kế đơn giản, dễ phối với nhiều phong cách khác nhau.
        </p>

        <div class="option-group">
          <span class="option-label">Màu sắc: <strong>{{ selectedColor }}</strong></span>
          <div class="colors">
            <button v-for="c in COLORS" :key="c" class="color-btn" :class="{ active: selectedColor === c }" @click="selectedColor = c">
              {{ c }}
            </button>
          </div>
        </div>

        <div class="option-group">
          <span class="option-label">Size: <strong>{{ selectedSize }}</strong></span>
          <div class="sizes">
            <button v-for="s in SIZES" :key="s" class="size-btn" :class="{ active: selectedSize === s }" @click="selectedSize = s">
              {{ s }}
            </button>
          </div>
        </div>

        <div class="qty-row">
          <span class="option-label">Số lượng:</span>
          <div class="qty-control">
            <button class="qty-btn" @click="qty = Math.max(1, qty - 1)">−</button>
            <span class="qty-val">{{ qty }}</span>
            <button class="qty-btn" @click="qty++">+</button>
          </div>
        </div>

        <div class="add-actions">
          <BaseButton variant="primary" size="lg" block>Thêm vào giỏ hàng</BaseButton>
          <BaseButton variant="secondary" size="lg" block>Mua ngay</BaseButton>
        </div>

        <div class="product-tags">
          <BaseTag v-for="t in ['cotton','áo thun','unisex','premium']" :key="t" :text="t" size="sm" variant="neutral" />
        </div>
      </div>
    </div>

    <!-- Reviews -->
    <BaseCard class="reviews-card">
      <template #header>
        <span class="card-label">Đánh giá khách hàng ({{ totalReviews }})</span>
      </template>
      <template #body>
        <div class="reviews-layout">
          <div class="rating-summary">
            <span class="avg-big">{{ avgRating }}</span>
            <div class="stars-big">★★★★★</div>
            <div class="rating-bars">
              <div v-for="(r, i) in RATINGS" :key="r" class="rating-bar-row">
                <span class="rb-label">{{ r }}★</span>
                <BaseProgress :value="(ratingCounts[i] / totalReviews) * 100" variant="primary" size="sm" />
                <span class="rb-count">{{ ratingCounts[i] }}</span>
              </div>
            </div>
          </div>

          <div class="review-list">
            <div v-for="rev in REVIEWS" :key="rev.id" class="review-item">
              <div class="rev-header">
                <span class="rev-name">{{ rev.name }}</span>
                <span class="rev-stars">{{ '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating) }}</span>
                <span class="rev-date">{{ rev.date }}</span>
              </div>
              <p class="rev-text">{{ rev.text }}</p>
            </div>
          </div>
        </div>
      </template>
    </BaseCard>
  </AppPageLayout>
</template>

<style scoped>
.product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wx-space-7); }
@media (max-width: 768px) { .product-layout { grid-template-columns: 1fr; } }

.product-images { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.main-image { background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-xl); height: 360px; display: flex; align-items: center; justify-content: center; }
.image-placeholder { text-align: center; font-size: 48px; color: var(--wx-content-muted); }
.image-placeholder span { display: block; font-size: var(--wx-fs-13); margin-top: var(--wx-space-2); }
.thumb-row { display: flex; gap: var(--wx-space-2); }
.thumb { width: 64px; height: 64px; background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-subtle); border-radius: var(--wx-radius-md); cursor: pointer; }
.thumb.active { border-color: var(--wx-brand-500); }

.product-details { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.product-badges { display: flex; gap: var(--wx-space-2); flex-wrap: wrap; }
.product-name { font-size: var(--wx-fs-28); font-weight: var(--wx-fw-bold); letter-spacing: var(--wx-tracking-tight); margin: 0; }
.product-sku { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin: 0; }
.price-row { display: flex; align-items: center; gap: var(--wx-space-3); }
.price { font-size: var(--wx-fs-28); font-weight: 800; color: var(--wx-brand-600); }
.price-old { font-size: var(--wx-fs-18); color: var(--wx-content-muted); text-decoration: line-through; }
.rating-inline { display: flex; align-items: center; gap: var(--wx-space-2); }
.stars { color: #f59e0b; font-size: var(--wx-fs-18); }
.rating-num { font-weight: var(--wx-fw-bold); }
.rating-count { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.product-desc { font-size: var(--wx-fs-15); color: var(--wx-content-secondary); line-height: var(--wx-lh-relaxed); margin: 0; }
.option-group { display: flex; flex-direction: column; gap: var(--wx-space-2); }
.option-label { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); }
.colors, .sizes { display: flex; gap: var(--wx-space-2); flex-wrap: wrap; }
.color-btn, .size-btn { border: 1px solid var(--wx-border-default); background: var(--wx-bg-base); padding: var(--wx-space-1) var(--wx-space-3); border-radius: var(--wx-radius-md); cursor: pointer; font-size: var(--wx-fs-13); color: var(--wx-content-secondary); transition: all var(--wx-d-micro); }
.color-btn.active, .size-btn.active { border-color: var(--wx-brand-500); color: var(--wx-brand-600); background: var(--wx-brand-50); }
.qty-row { display: flex; align-items: center; gap: var(--wx-space-4); }
.qty-control { display: flex; align-items: center; gap: 0; border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); overflow: hidden; }
.qty-btn { border: none; background: var(--wx-bg-sunken); padding: var(--wx-space-2) var(--wx-space-3); cursor: pointer; font-size: 18px; color: var(--wx-content-primary); }
.qty-btn:hover { background: var(--wx-hover-bg); }
.qty-val { padding: var(--wx-space-2) var(--wx-space-4); font-weight: var(--wx-fw-semibold); font-size: var(--wx-fs-15); }
.add-actions { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.product-tags { display: flex; gap: var(--wx-space-2); flex-wrap: wrap; }

.reviews-card { }
.card-label { font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); }
.reviews-layout { display: grid; grid-template-columns: 200px 1fr; gap: var(--wx-space-6); }
@media (max-width: 640px) { .reviews-layout { grid-template-columns: 1fr; } }
.rating-summary { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-3); }
.avg-big { font-size: var(--wx-fs-48); font-weight: 800; line-height: 1; }
.stars-big { color: #f59e0b; font-size: var(--wx-fs-24); }
.rating-bars { display: flex; flex-direction: column; gap: var(--wx-space-2); width: 100%; }
.rating-bar-row { display: flex; align-items: center; gap: var(--wx-space-2); }
.rb-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); width: 28px; text-align: right; }
.rb-count { font-size: var(--wx-fs-12); color: var(--wx-content-muted); width: 20px; }
.review-list { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.review-item { padding-bottom: var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.review-item:last-child { border-bottom: none; }
.rev-header { display: flex; align-items: center; gap: var(--wx-space-3); margin-bottom: var(--wx-space-2); }
.rev-name { font-weight: var(--wx-fw-semibold); font-size: var(--wx-fs-14); }
.rev-stars { color: #f59e0b; }
.rev-date { font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin-left: auto; }
.rev-text { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); line-height: var(--wx-lh-normal); margin: 0; }
</style>
