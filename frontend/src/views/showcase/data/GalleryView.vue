<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { BaseButton, GroupBox } from '../../../components/common'
import { Gallery } from '../../../components/data'
import type { GalleryItem } from '../../../components/data'

const router = useRouter()

// Generate placeholder images via picsum.photos (different aspect ratios for masonry)
const ratios = [
  [400, 300], [400, 600], [400, 400], [400, 500],
  [400, 350], [400, 550], [400, 450], [400, 320],
  [400, 280], [400, 480], [400, 360], [400, 520],
]

const items = ref<GalleryItem[]>(
  ratios.map((r, i) => ({
    id: i + 1,
    src: `https://picsum.photos/seed/wemake-${i + 1}/${r[0]}/${r[1]}`,
    alt: `Ảnh ${i + 1}`,
    caption: `Ảnh số ${i + 1} (${r[0]}×${r[1]})`,
  })),
)

const columns = ref(3)
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI · Gallery" subtitle="Phase 4 — data display" />
    <main class="main">
      <PageHeader title="Gallery / Media grid" description="Masonry layout với CSS columns. Lightbox keyboard nav (←→Esc).">
      </PageHeader>

      <GroupBox title="Controls">
        <div class="row">
          <span>Cột:</span>
          <BaseButton size="sm" :variant="columns === 2 ? 'primary' : 'ghost'" @click="columns = 2">2</BaseButton>
          <BaseButton size="sm" :variant="columns === 3 ? 'primary' : 'ghost'" @click="columns = 3">3</BaseButton>
          <BaseButton size="sm" :variant="columns === 4 ? 'primary' : 'ghost'" @click="columns = 4">4</BaseButton>
          <BaseButton size="sm" :variant="columns === 5 ? 'primary' : 'ghost'" @click="columns = 5">5</BaseButton>
          <span class="muted">Click ảnh để mở lightbox · ←→ chuyển ảnh · Esc đóng</span>
        </div>
      </GroupBox>

      <GroupBox title="Gallery (masonry)">
        <Gallery :items="items" :columns="columns" :gap="8" />
      </GroupBox>
    </main>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; }
.main {
  flex: 1;
  padding: var(--space-lg);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.row { display: flex; flex-wrap: wrap; gap: var(--space-sm); align-items: center; font-size: 13px; }
.muted { color: var(--wx-text-muted); font-size: 12px; }
</style>
