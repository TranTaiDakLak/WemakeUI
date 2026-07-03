<script setup lang="ts">
/**
 * Phase 3 — split-pane shell demo (master-detail).
 * Email/file-manager style: list bên trái, chi tiết bên phải.
 * Resize handle giữa 2 pane (kéo chuột + arrow keys).
 */
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { AppShell, AppTopbar, PageHeader } from '../../../components/layout'
import {
  BaseInput, BaseButton, BaseTag, BaseBadge, BaseCard, BasePanel,
  BaseAvatar,
} from '../../../components/common'
import { BottomSheet, SafeAreaContainer } from '../../../components/platform'

interface MailItem {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  unread: boolean
  starred: boolean
  tags: string[]
  body: string
}

const mails = ref<MailItem[]>([
  {
    id: '1', from: 'Nguyễn Văn A', subject: 'Re: Báo giá triển khai design system',
    preview: 'Cảm ơn bạn đã gửi báo giá. Tôi đã xem qua…',
    time: '09:42', unread: true, starred: true, tags: ['quan trọng', 'khách hàng'],
    body: `Chào team,\n\nCảm ơn bạn đã gửi báo giá. Tôi đã xem qua các phương án và muốn trao đổi thêm về scope của giai đoạn 2.\n\nLịch họp tuần sau OK chứ?\n\nThân,\nA`,
  },
  {
    id: '2', from: 'Trần Thị B', subject: 'Lịch họp daily standup',
    preview: 'Cuộc họp daily được dời sang 9h sáng…',
    time: '08:15', unread: true, starred: false, tags: ['nội bộ'],
    body: 'Cuộc họp daily được dời sang 9h sáng kể từ tuần sau nhé.',
  },
  {
    id: '3', from: 'Lê Văn C', subject: 'Tài liệu kiến trúc v2',
    preview: 'Mình đã upload bản v2 lên drive…',
    time: 'hôm qua', unread: false, starred: false, tags: ['tài liệu'],
    body: 'Mình đã upload bản v2 lên drive, mọi người review giúp.',
  },
  {
    id: '4', from: 'Phạm Thị D', subject: 'Hợp đồng đã ký',
    preview: 'Gửi anh chị file hợp đồng đã ký…',
    time: 'hôm qua', unread: false, starred: true, tags: ['hợp đồng'],
    body: 'Gửi anh chị file hợp đồng đã ký. Vui lòng kiểm tra và xác nhận.',
  },
  {
    id: '5', from: 'Hoàng Văn E', subject: 'Đề xuất thiết kế landing page',
    preview: 'Em vừa hoàn tất 3 mockup cho landing…',
    time: 'thứ hai', unread: false, starred: false, tags: ['thiết kế', 'landing'],
    body: 'Em vừa hoàn tất 3 mockup cho landing page mới. Mong nhận feedback.',
  },
  {
    id: '6', from: 'Vũ Thị F', subject: 'Khiếu nại đơn hàng #1284',
    preview: 'Khách hàng phản ánh đơn hàng…',
    time: 'thứ hai', unread: false, starred: false, tags: ['hỗ trợ'],
    body: 'Khách hàng phản ánh đơn hàng #1284 chưa được giao. Cần follow up.',
  },
  {
    id: '7', from: 'Đặng Văn G', subject: 'Báo cáo tuần #18',
    preview: 'Tóm tắt các chỉ số chính tuần qua…',
    time: 'chủ nhật', unread: false, starred: false, tags: ['báo cáo'],
    body: 'Tóm tắt các chỉ số chính tuần qua: doanh thu +12%, khách mới +5%.',
  },
  {
    id: '8', from: 'Bùi Thị H', subject: 'Lời mời sự kiện ra mắt',
    preview: 'Chúng tôi xin mời anh chị tham dự…',
    time: '2 ngày trước', unread: false, starred: false, tags: ['sự kiện'],
    body: 'Chúng tôi xin mời anh chị tham dự sự kiện ra mắt sản phẩm vào ngày 15/05.',
  },
])

const selectedId = ref<string>('1')
const search = ref('')
const filter = ref<'all' | 'unread' | 'starred'>('all')
const showSheetOnMobile = ref(false)

const filtered = computed(() => {
  let out = mails.value
  if (filter.value === 'unread')  out = out.filter((m) => m.unread)
  if (filter.value === 'starred') out = out.filter((m) => m.starred)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    out = out.filter(
      (m) =>
        m.from.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q),
    )
  }
  return out
})

const selected = computed(() =>
  mails.value.find((m) => m.id === selectedId.value) ?? null
)

function pick(id: string) {
  selectedId.value = id
  const m = mails.value.find((x) => x.id === id)
  if (m) m.unread = false
}

function toggleStar(id: string) {
  const m = mails.value.find((x) => x.id === id)
  if (m) m.starred = !m.starred
}
</script>

<template>
  <AppShell
    variant="split"
    :split-default-left="360"
    :split-min-left="260"
    :split-min-right="380"
    :topbar-height="56"
  >
    <template #topbar>
      <AppTopbar title="WemakeUI" subtitle="split-pane shell — hộp thư">
        <template #actions>
          <BaseButton variant="ghost" size="sm" @click="showSheetOnMobile = true">
            Mở bottom sheet
          </BaseButton>
        </template>
      </AppTopbar>
    </template>

    <!-- ── master pane: list ── -->
    <template #master>
      <SafeAreaContainer flex scroll-y edges="bottom">
        <div class="master-head">
          <BaseInput
            v-model="search"
            placeholder="Tìm trong hộp thư…"
            size="sm"
          />
          <div class="filters">
            <button
              v-for="f in [
                { id: 'all',     label: 'Tất cả' },
                { id: 'unread',  label: 'Chưa đọc' },
                { id: 'starred', label: 'Gắn sao' },
              ]"
              :key="f.id"
              type="button"
              class="filter-pill"
              :class="{ 'filter-pill--active': filter === f.id }"
              @click="filter = f.id as 'all' | 'unread' | 'starred'"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <ul class="mail-list" role="listbox">
          <li
            v-for="m in filtered"
            :key="m.id"
            class="mail-item"
            :class="{ 'mail-item--selected': m.id === selectedId, 'mail-item--unread': m.unread }"
            role="option"
            :aria-selected="m.id === selectedId"
            tabindex="0"
            @click="pick(m.id)"
            @keydown.enter="pick(m.id)"
          >
            <BaseAvatar :name="m.from" size="md" />
            <div class="mail-item__body">
              <div class="mail-item__line1">
                <strong class="mail-item__from">{{ m.from }}</strong>
                <span class="mail-item__time">{{ m.time }}</span>
              </div>
              <div class="mail-item__subject">{{ m.subject }}</div>
              <div class="mail-item__preview">{{ m.preview }}</div>
              <div class="mail-item__tags">
                <BaseTag v-for="t in m.tags" :key="t" :label="t" size="sm" variant="neutral" />
              </div>
            </div>
            <button
              type="button"
              class="mail-item__star"
              :class="{ 'mail-item__star--on': m.starred }"
              :aria-label="m.starred ? 'Bỏ gắn sao' : 'Gắn sao'"
              @click.stop="toggleStar(m.id)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" :fill="m.starred ? 'currentColor' : 'none'"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
          </li>
          <li v-if="!filtered.length" class="mail-empty">
            <div class="mail-empty__icon">📭</div>
            <div class="mail-empty__title">Không có thư</div>
            <div class="mail-empty__desc">Thử bỏ bộ lọc hoặc đổi từ khoá tìm kiếm.</div>
          </li>
        </ul>
      </SafeAreaContainer>
    </template>

    <!-- ── detail pane ── -->
    <template #detail>
      <div v-if="selected" class="detail">
        <PageHeader
          :title="selected.subject"
          :description="`Từ ${selected.from} · ${selected.time}`"
          padded
          back
          @back="selectedId = ''"
        >
          <template #actions>
            <BaseButton variant="ghost" size="sm" @click="toggleStar(selected.id)">
              {{ selected.starred ? '★ Đã sao' : '☆ Gắn sao' }}
            </BaseButton>
            <BaseButton variant="ghost" size="sm">Trả lời</BaseButton>
            <BaseButton size="sm">Trả lời tất cả</BaseButton>
          </template>
          <template #breadcrumb>
            <span>Hộp thư / </span>
            <BaseBadge :text="selected.unread ? 'mới' : 'đã đọc'" :variant="selected.unread ? 'primary' : 'neutral'" size="sm" />
          </template>
        </PageHeader>

        <div class="detail__inner">
          <BaseCard padded radius="lg" shadow="sm">
            <div class="meta-row">
              <BaseAvatar :name="selected.from" size="lg" />
              <div class="meta-col">
                <strong>{{ selected.from }}</strong>
                <span class="muted">đã gửi đến bạn · {{ selected.time }}</span>
              </div>
              <div class="meta-tags">
                <BaseTag v-for="t in selected.tags" :key="t" :label="t" size="sm" />
              </div>
            </div>
            <pre class="body">{{ selected.body }}</pre>
            <template #footer>
              <BaseButton variant="ghost">Chuyển tiếp</BaseButton>
              <BaseButton>Trả lời</BaseButton>
            </template>
          </BaseCard>

          <BasePanel title="Tệp đính kèm" tone="sunken" collapsible>
            <ul class="files">
              <li v-for="(f, i) in ['báo-giá-v2.pdf', 'roadmap-q3.png']" :key="i" class="file-row">
                <span class="file-icon">📎</span>
                <span class="file-name">{{ f }}</span>
                <BaseTag size="sm" variant="neutral" :label="i === 0 ? '420 KB' : '88 KB'" />
              </li>
            </ul>
          </BasePanel>
        </div>
      </div>

      <div v-else class="detail-empty">
        <div class="detail-empty__icon">✉️</div>
        <h3>Chọn một email để xem nội dung</h3>
        <p class="muted">Master-detail layout với resize handle. Kéo thanh giữa để chỉnh tỉ lệ.</p>
      </div>
    </template>
  
  <BottomSheet
    v-model="showSheetOnMobile"
    title="Tuỳ chọn thêm"
    :snap-points="[0.4, 0.85]"
  >
    <p>Đây là demo BottomSheet — pattern mobile thay cho dropdown trên màn hình nhỏ.</p>
    <ul class="sheet-list">
      <li v-for="(opt, i) in [
        '🗂️ Lưu trữ tất cả',
        '🗑️ Xoá thư đã chọn',
        '🚩 Đánh dấu spam',
        '📥 Đánh dấu đã đọc',
        '⚙️ Cài đặt hộp thư',
      ]" :key="i" class="sheet-item">{{ opt }}</li>
    </ul>
    <template #footer>
      <BaseButton variant="ghost" @click="showSheetOnMobile = false">Huỷ</BaseButton>
      <BaseButton @click="showSheetOnMobile = false">Áp dụng</BaseButton>
    </template>
  </BottomSheet>
</AppShell>
</template>

<style scoped>

/* ── master ── */
.master-head {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-2);
  padding: var(--wx-space-3) var(--wx-space-3);
  background: var(--wx-surface-base);
  border-bottom: 1px solid var(--wx-border-subtle);
  backdrop-filter: blur(6px);
}
.filters { display: flex; gap: var(--wx-space-1); flex-wrap: wrap; }
.filter-pill {
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-full);
  padding: 4px var(--wx-space-3);
  background: transparent;
  color: var(--wx-content-secondary);
  font-size: var(--wx-fs-12);
  cursor: pointer;
  font-family: inherit;
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.filter-pill:hover { background: var(--wx-surface-sunken); }
.filter-pill--active {
  background: var(--wx-brand-primary);
  border-color: var(--wx-brand-primary);
  color: white;
}

.mail-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mail-item {
  display: grid;
  grid-template-columns: 40px 1fr 24px;
  gap: var(--wx-space-2);
  padding: var(--wx-space-3);
  border-bottom: 1px solid var(--wx-border-subtle);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
  align-items: flex-start;
}
.mail-item:hover { background: var(--wx-surface-sunken); }
.mail-item:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: -2px;
}
.mail-item--selected {
  background: rgba(37, 99, 235, 0.08);
}
.mail-item--unread .mail-item__from,
.mail-item--unread .mail-item__subject { font-weight: var(--wx-fw-semibold); }
.mail-item--unread::before {
  content: '';
  position: absolute;
  margin-left: -3px;
  margin-top: 16px;
  width: 6px; height: 6px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-brand-primary);
}

.mail-item__body { min-width: 0; }
.mail-item__line1 {
  display: flex;
  justify-content: space-between;
  font-size: var(--wx-fs-13);
}
.mail-item__time {
  color: var(--wx-content-muted);
  font-size: var(--wx-fs-12);
  flex-shrink: 0;
  margin-left: var(--wx-space-2);
}
.mail-item__subject {
  font-size: var(--wx-fs-13);
  color: var(--wx-content-primary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mail-item__preview {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mail-item__tags {
  display: flex;
  gap: 4px;
  margin-top: var(--wx-space-1);
  flex-wrap: wrap;
}
.mail-item__star {
  background: transparent;
  border: none;
  color: var(--wx-content-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--wx-radius-sm);
}
.mail-item__star--on { color: #f59e0b; }
.mail-item__star:hover { background: var(--wx-surface-sunken); }

.mail-empty {
  text-align: center;
  padding: var(--wx-space-7) var(--wx-space-3);
  color: var(--wx-content-muted);
}
.mail-empty__icon { font-size: 32px; }
.mail-empty__title { font-weight: var(--wx-fw-semibold); margin-top: var(--wx-space-2); }
.mail-empty__desc { font-size: var(--wx-fs-12); margin-top: 4px; }

/* ── detail ── */
.detail__inner {
  padding: 0 var(--wx-space-5) var(--wx-space-7);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}
.meta-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-3);
  flex-wrap: wrap;
}
.meta-col {
  display: flex;
  flex-direction: column;
  font-size: var(--wx-fs-13);
}
.meta-tags { margin-left: auto; display: flex; gap: 4px; }
.body {
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-15);
  line-height: var(--wx-lh-relaxed);
  white-space: pre-wrap;
  margin: 0;
  color: var(--wx-content-primary);
}

.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: var(--wx-space-7);
  gap: var(--wx-space-2);
}
.detail-empty__icon { font-size: 48px; }
.detail-empty h3 {
  margin: 0;
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-semibold);
}

.muted { color: var(--wx-content-muted); }

.files {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}
.file-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-2);
  border-radius: var(--wx-radius-md);
  font-size: var(--wx-fs-13);
}
.file-row:hover { background: var(--wx-surface-sunken); }
.file-icon { font-size: 18px; }
.file-name { flex: 1; }

.sheet-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.sheet-item {
  padding: var(--wx-space-3);
  border-radius: var(--wx-radius-md);
  cursor: pointer;
  font-size: var(--wx-fs-15);
}
.sheet-item:hover { background: var(--wx-surface-sunken); }
</style>
