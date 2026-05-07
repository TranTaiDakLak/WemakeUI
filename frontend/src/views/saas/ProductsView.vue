<script setup lang="ts">
import { ref } from 'vue'
import SaasLayout from '../_layouts/SaasLayout.vue'
import CrudPage from '@/archetypes/crud/CrudPage.vue'
import { BaseButton, BaseFileUpload } from '@/components/common'
import StatusChip from '@/components/common/StatusChip.vue'
import TagList from '@/components/common/TagList.vue'
import { productsConfig, PRODUCT_STATUS_MAP, PRODUCT_TYPE_MAP, formatPrice } from '@/configs/saas/products.config'
import type { Product } from '@/configs/saas/products.config'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const crudRef = ref<InstanceType<typeof CrudPage> | null>(null)
const productImages = ref<File[]>([])

function asProduct(row: unknown): Product { return row as unknown as Product }

function onUploadError(msg: string) {
  showToast('error', msg)
}
</script>

<template>
  <SaasLayout
    current="products"
    page-title="Sản phẩm"
    page-description="Quản lý danh mục sản phẩm, giá bán và trạng thái"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost">Xuất danh sách</BaseButton>
      <BaseButton size="sm" @click="crudRef?.openAdd()">+ Thêm sản phẩm</BaseButton>
    </template>

    <CrudPage ref="crudRef" :config="productsConfig">
      <!-- STT -->
      <template #cell-stt="{ index }">
        <span class="cell-stt">{{ index }}</span>
      </template>

      <!-- Tên sản phẩm + tags -->
      <template #cell-name="{ row }">
        <div class="product-cell">
          <span class="product-name">{{ asProduct(row).name }}</span>
          <TagList :tags="asProduct(row).tags" :max-visible="2" size="sm" variant="neutral" />
        </div>
      </template>

      <!-- Giá -->
      <template #cell-price="{ row }">
        <span class="cell-price">{{ formatPrice(asProduct(row).price) }}</span>
      </template>

      <!-- Loại -->
      <template #cell-type="{ row }">
        <StatusChip :status="asProduct(row).type" :map="PRODUCT_TYPE_MAP" :dot="false" />
      </template>

      <!-- Trạng thái -->
      <template #cell-status="{ row }">
        <StatusChip :status="asProduct(row).status" :map="PRODUCT_STATUS_MAP" />
      </template>

      <!-- Lượt mua -->
      <template #cell-purchaseCount="{ row }">
        <span class="cell-count">{{ asProduct(row).purchaseCount.toLocaleString() }}</span>
      </template>

      <!-- Add form: image upload -->
      <template #add-form-extra>
        <div class="product-upload-section">
          <p class="upload-label">Hình ảnh sản phẩm</p>
          <BaseFileUpload
            v-model="productImages"
            accept="image/*"
            :multiple="true"
            :max-size-mb="5"
            @error="onUploadError"
          />
        </div>
      </template>

      <!-- Detail: tags + mô tả -->
      <template #detail-extra="{ item }">
        <div class="detail-section">
          <p class="detail-section__label">Tags</p>
          <div class="tags-row">
            <TagList :tags="asProduct(item).tags" :max-visible="10" size="sm" />
          </div>
        </div>
      </template>
    </CrudPage>
  </SaasLayout>
</template>

<style scoped>
.product-upload-section {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  margin-top: var(--wx-space-2);
}

.upload-label {
  margin: 0;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-secondary);
}

.cell-stt {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
  font-variant-numeric: tabular-nums;
}

.product-cell {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
  min-width: 160px;
}

.product-name {
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-primary);
}

.cell-price {
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.cell-count {
  font-variant-numeric: tabular-nums;
  color: var(--wx-text-secondary);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-5);
}

.detail-section__label {
  margin: 0;
  font-size: var(--wx-fs-11);
  font-weight: var(--wx-fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--wx-text-muted);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-1);
}
</style>
