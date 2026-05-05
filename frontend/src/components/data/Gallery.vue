<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface GalleryItem {
  id: string | number
  src: string
  alt?: string
  caption?: string
}

const props = withDefaults(defineProps<{
  items: GalleryItem[]
  columns?: number
  gap?: number
}>(), {
  columns: 3,
  gap: 8,
})

const lightboxIdx = ref<number>(-1)

function open(idx: number) {
  lightboxIdx.value = idx
}

function close() {
  lightboxIdx.value = -1
}

function next() {
  if (lightboxIdx.value < 0) return
  lightboxIdx.value = (lightboxIdx.value + 1) % props.items.length
}

function prev() {
  if (lightboxIdx.value < 0) return
  lightboxIdx.value = (lightboxIdx.value - 1 + props.items.length) % props.items.length
}

function onKey(e: KeyboardEvent) {
  if (lightboxIdx.value < 0) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <div
      class="gallery"
      :style="{
        columnCount: columns,
        columnGap: gap + 'px',
      }"
    >
      <figure
        v-for="(item, idx) in items"
        :key="item.id"
        class="gallery-item"
        :style="{ marginBottom: gap + 'px' }"
        @click="open(idx)"
      >
        <img :src="item.src" :alt="item.alt ?? ''" loading="lazy" />
        <figcaption v-if="item.caption">{{ item.caption }}</figcaption>
      </figure>
    </div>

    <!-- Lightbox -->
    <teleport to="body">
      <transition name="lightbox">
        <div
          v-if="lightboxIdx >= 0"
          class="lightbox"
          @click.self="close"
        >
          <button class="lightbox-btn lightbox-btn--close" @click="close" aria-label="Đóng">×</button>
          <button class="lightbox-btn lightbox-btn--prev" @click="prev" aria-label="Trước">‹</button>
          <button class="lightbox-btn lightbox-btn--next" @click="next" aria-label="Sau">›</button>
          <div class="lightbox-content" @click.self="close">
            <img :src="items[lightboxIdx].src" :alt="items[lightboxIdx].alt ?? ''" />
            <p v-if="items[lightboxIdx].caption" class="lightbox-caption">
              {{ items[lightboxIdx].caption }}
              <span class="lightbox-counter">{{ lightboxIdx + 1 }} / {{ items.length }}</span>
            </p>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.gallery {
  /* CSS columns masonry */
  column-fill: balance;
}

.gallery-item {
  break-inside: avoid;
  margin: 0;
  cursor: zoom-in;
  border-radius: var(--wx-radius-md);
  overflow: hidden;
  background: var(--wx-surface-sunken);
  transition: transform var(--wx-duration-fast), box-shadow var(--wx-duration-fast);
  display: block;
}

.gallery-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--wx-shadow-md);
}

.gallery-item img {
  display: block;
  width: 100%;
  height: auto;
}

.gallery-item figcaption {
  padding: 6px 10px;
  font-size: 12px;
  color: var(--wx-text-secondary);
  background: var(--wx-surface-base);
  border-top: 1px solid var(--wx-border-subtle);
}

@media (max-width: 700px) {
  .gallery {
    column-count: 2 !important;
  }
}

@media (max-width: 480px) {
  .gallery {
    column-count: 1 !important;
  }
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 92%;
  max-height: 92%;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--wx-radius-md);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.lightbox-caption {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin: 0;
}

.lightbox-counter {
  font-family: var(--wx-font-mono);
  color: rgba(255, 255, 255, 0.5);
}

.lightbox-btn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  border-radius: var(--wx-radius-full);
  backdrop-filter: blur(8px);
  transition: all var(--wx-duration-fast);
  font-family: var(--wx-font-primary);
  line-height: 1;
}

.lightbox-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.lightbox-btn--close { top: 16px; right: 16px; }
.lightbox-btn--prev  { left: 16px; top: 50%; transform: translateY(-50%); font-size: 32px; }
.lightbox-btn--next  { right: 16px; top: 50%; transform: translateY(-50%); font-size: 32px; }
.lightbox-btn--prev:hover, .lightbox-btn--next:hover { transform: translateY(-50%) scale(1.05); }

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
