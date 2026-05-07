<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseInput, BaseCard } from '../../components/common'

const search = ref('')
const selectedLocation = ref<number | null>(1)

const LOCATIONS = [
  { id: 1, name: 'Văn phòng HQ — Hà Nội', address: '123 Đường Lê Lợi, Quận 1, Hà Nội', type: 'office', status: 'active', lat: 21.028, lng: 105.834 },
  { id: 2, name: 'Chi nhánh TP.HCM', address: '456 Nguyễn Huệ, Quận 1, TP.HCM', type: 'office', status: 'active', lat: 10.775, lng: 106.700 },
  { id: 3, name: 'Kho hàng Bình Dương', address: 'KCN Đồng An, Bình Dương', type: 'warehouse', status: 'active', lat: 10.990, lng: 106.652 },
  { id: 4, name: 'Đại lý Đà Nẵng', address: '789 Trần Phú, Hải Châu, Đà Nẵng', type: 'partner', status: 'inactive', lat: 16.067, lng: 108.206 },
]

const TYPE_MAP: Record<string, string> = { office: '🏢', warehouse: '🏭', partner: '🤝' }
const STATUS_VARIANTS: Record<string, 'success' | 'neutral'> = { active: 'success', inactive: 'neutral' }
const selected = computed(() => LOCATIONS.find(l => l.id === selectedLocation.value))

import { computed } from 'vue'
</script>

<template>
  <AppPageLayout section="app" current="bản đồ" page-title="Bản đồ địa điểm" page-description="Xem vị trí các văn phòng, kho hàng và đại lý">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Thêm địa điểm</BaseButton>
    </template>

    <div class="map-layout">
      <!-- sidebar -->
      <aside class="location-panel">
        <BaseInput v-model="search" placeholder="Tìm địa điểm..." size="sm" />
        <ul class="location-list">
          <li
            v-for="loc in LOCATIONS.filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()))"
            :key="loc.id"
            class="loc-item" :class="{ active: selectedLocation === loc.id }"
            @click="selectedLocation = loc.id"
          >
            <span class="loc-icon">{{ TYPE_MAP[loc.type] }}</span>
            <div class="loc-info">
              <span class="loc-name">{{ loc.name }}</span>
              <span class="loc-addr">{{ loc.address }}</span>
            </div>
            <BaseBadge :text="loc.status === 'active' ? 'hoạt động' : 'tạm dừng'" :variant="STATUS_VARIANTS[loc.status]" size="sm" />
          </li>
        </ul>
      </aside>

      <!-- map placeholder + detail -->
      <div class="map-main">
        <div class="map-canvas">
          <!-- SVG placeholder map of Vietnam -->
          <svg viewBox="0 0 400 500" class="vn-map" role="img" aria-label="Bản đồ Việt Nam">
            <path d="M200 80 L230 100 L250 140 L260 180 L240 200 L250 240 L240 280 L250 320 L230 360 L200 400 L180 380 L160 340 L170 300 L150 270 L160 230 L150 200 L160 160 L180 130 L190 100 Z" fill="var(--wx-brand-100)" stroke="var(--wx-brand-300)" stroke-width="2" />
            <!-- Location pins -->
            <g v-for="loc in LOCATIONS" :key="loc.id" @click="selectedLocation = loc.id" style="cursor:pointer">
              <circle
                :cx="((loc.lng - 102) / 12) * 350 + 30"
                :cy="((22 - loc.lat) / 12) * 400 + 40"
                r="10"
                :fill="selectedLocation === loc.id ? 'var(--wx-brand-600)' : 'var(--wx-brand-400)'"
                stroke="white" stroke-width="2"
              />
              <text
                :x="((loc.lng - 102) / 12) * 350 + 30"
                :y="((22 - loc.lat) / 12) * 400 + 45"
                text-anchor="middle"
                font-size="8"
                fill="white"
              >{{ TYPE_MAP[loc.type] }}</text>
            </g>
          </svg>
          <div class="map-overlay-hint">Nhấp vào điểm để xem chi tiết</div>
        </div>

        <BaseCard v-if="selected" class="location-detail">
          <template #header>
            <div class="detail-head">
              <span class="detail-icon">{{ TYPE_MAP[selected.type] }}</span>
              <div>
                <span class="detail-name">{{ selected.name }}</span>
                <BaseBadge :text="selected.status === 'active' ? 'hoạt động' : 'tạm dừng'" :variant="STATUS_VARIANTS[selected.status]" size="sm" />
              </div>
            </div>
          </template>
          <template #body>
            <div class="detail-rows">
              <div class="detail-row"><span class="detail-key">Địa chỉ</span><span>{{ selected.address }}</span></div>
              <div class="detail-row"><span class="detail-key">Toạ độ</span><code class="coord">{{ selected.lat.toFixed(3) }}, {{ selected.lng.toFixed(3) }}</code></div>
              <div class="detail-row"><span class="detail-key">Loại</span><span>{{ { office: 'Văn phòng', warehouse: 'Kho hàng', partner: 'Đại lý' }[selected.type] }}</span></div>
            </div>
          </template>
          <template #footer>
            <div class="detail-actions">
              <BaseButton size="sm" variant="primary">Chỉ đường</BaseButton>
              <BaseButton size="sm" variant="ghost">Chỉnh sửa</BaseButton>
            </div>
          </template>
        </BaseCard>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.map-layout { display: grid; grid-template-columns: 300px 1fr; gap: var(--wx-space-5); height: 600px; }
@media (max-width: 768px) { .map-layout { grid-template-columns: 1fr; height: auto; } }

.location-panel { display: flex; flex-direction: column; gap: var(--wx-space-3); overflow: hidden; }
.location-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--wx-space-2); overflow-y: auto; flex: 1; }
.loc-item { display: flex; align-items: flex-start; gap: var(--wx-space-3); padding: var(--wx-space-3); border-radius: var(--wx-radius-md); cursor: pointer; border: 1px solid var(--wx-border-subtle); transition: all var(--wx-d-micro); }
.loc-item:hover { border-color: var(--wx-brand-300); background: var(--wx-hover-bg); }
.loc-item.active { border-color: var(--wx-brand-500); background: var(--wx-brand-50); }
.loc-icon { font-size: 20px; flex-shrink: 0; }
.loc-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.loc-name { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); }
.loc-addr { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }

.map-main { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.map-canvas { flex: 1; background: var(--wx-bg-sunken); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); position: relative; overflow: hidden; min-height: 300px; display: flex; align-items: center; justify-content: center; }
.vn-map { width: 100%; max-width: 400px; height: auto; }
.map-overlay-hint { position: absolute; bottom: var(--wx-space-3); left: 50%; transform: translateX(-50%); font-size: var(--wx-fs-12); color: var(--wx-content-muted); background: var(--wx-bg-overlay); padding: 4px 12px; border-radius: var(--wx-radius-full); }

.location-detail { }
.detail-head { display: flex; align-items: center; gap: var(--wx-space-3); }
.detail-icon { font-size: 24px; }
.detail-name { display: block; font-size: var(--wx-fs-15); font-weight: var(--wx-fw-semibold); margin-bottom: 4px; }
.detail-rows { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.detail-row { display: flex; gap: var(--wx-space-3); font-size: var(--wx-fs-14); }
.detail-key { color: var(--wx-content-muted); min-width: 80px; }
.coord { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-content-link); }
.detail-actions { display: flex; gap: var(--wx-space-2); }
</style>
