<script setup lang="ts">
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseAvatar, BaseBadge, BaseTag } from '@/components/common'
import CrudPage from '@/archetypes/crud/CrudPage.vue'
import { contactsConfig, CONTACT_STATUS_BADGE, CONTACT_STATUS_LABEL } from '@/configs/wemakeui/contacts.config'
</script>

<template>
  <AppPageLayout section="wemakeui"
    current="contacts"
    page-title="Danh bạ liên hệ"
    page-description="Quản lý danh bạ và phân nhóm khách hàng"
  >
    <template #actions>
      <BaseButton size="sm" variant="ghost">Nhập CSV</BaseButton>
    </template>

    <CrudPage :config="contactsConfig">
      <!-- ── Custom cells ── -->
      <template #cell-name="{ row }">
        <div class="contact-cell">
          <BaseAvatar :name="(row as any).name" size="sm" />
          <div class="contact-info">
            <span class="contact-name">{{ (row as any).name }}</span>
            <span class="contact-email">{{ (row as any).email || '—' }}</span>
          </div>
        </div>
      </template>

      <template #cell-phone="{ value }">
        <code class="phone">{{ value }}</code>
      </template>

      <template #cell-tags="{ row }">
        <div class="tags-cell">
          <BaseTag
            v-for="t in (row as any).tags"
            :key="t"
            :label="t"
            size="sm"
            variant="neutral"
          />
          <span v-if="!(row as any).tags.length" class="no-tag">—</span>
        </div>
      </template>

      <template #cell-status="{ value }">
        <BaseBadge
          :text="CONTACT_STATUS_LABEL[value as keyof typeof CONTACT_STATUS_LABEL]"
          :variant="CONTACT_STATUS_BADGE[value as keyof typeof CONTACT_STATUS_BADGE]"
          dot
        />
      </template>

      <!-- ── Detail drawer header ── -->
      <template #detail-header="{ item }">
        <div class="detail-header">
          <BaseAvatar :name="(item as any).name" size="lg" />
          <div class="detail-header__info">
            <h3 class="detail-name">{{ (item as any).name }}</h3>
            <BaseBadge
              :text="CONTACT_STATUS_LABEL[(item as any).status as keyof typeof CONTACT_STATUS_LABEL]"
              :variant="CONTACT_STATUS_BADGE[(item as any).status as keyof typeof CONTACT_STATUS_BADGE]"
              dot
            />
          </div>
        </div>

        <!-- Tags section rendered here, not in generic sections -->
        <div class="detail-section">
          <p class="detail-section__label">Nhãn</p>
          <div class="tags-cell">
            <BaseTag
              v-for="t in (item as any).tags"
              :key="t"
              :label="t"
              size="sm"
              variant="neutral"
            />
            <span v-if="!(item as any).tags.length" class="detail-empty">Chưa gán nhãn</span>
          </div>
        </div>

        <div v-if="(item as any).note" class="detail-section">
          <p class="detail-section__label">Ghi chú</p>
          <p class="detail-note">{{ (item as any).note }}</p>
        </div>
      </template>
    </CrudPage>
  </AppPageLayout>
</template>

<style scoped>
/* ── Contact cell ── */
.contact-cell {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-name {
  font-weight: var(--wx-fw-medium);
  color: var(--wx-text-primary);
  font-size: var(--wx-fs-14);
}

.contact-email {
  font-size: var(--wx-fs-12);
  color: var(--wx-text-muted);
}

.phone {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-13);
  color: var(--wx-text-secondary);
}

.tags-cell {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-1);
}

.no-tag,
.detail-empty {
  font-size: var(--wx-fs-13);
  color: var(--wx-text-muted);
  font-style: italic;
}

/* ── Detail drawer ── */
.detail-header {
  display: flex;
  align-items: center;
  gap: var(--wx-space-4);
  padding-bottom: var(--wx-space-5);
  margin-bottom: var(--wx-space-5);
  border-bottom: 1px solid var(--wx-border-subtle);
}

.detail-header__info {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
}

.detail-name {
  margin: 0;
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-primary);
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

.detail-note {
  margin: 0;
  font-size: var(--wx-fs-14);
  color: var(--wx-text-secondary);
  padding: var(--wx-space-3) var(--wx-space-4);
  background: var(--wx-surface-sunken);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-border-subtle);
  line-height: var(--wx-lh-relaxed);
}
</style>
