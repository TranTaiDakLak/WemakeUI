<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

export interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
}

const props = withDefaults(defineProps<{
  items?: FAQItem[]
  searchable?: boolean
}>(), {
  searchable: true,
})

const search = ref('')
const openId = ref<string | null>(null)

const sectionRef = ref<HTMLElement | null>(null)
const { revealed, observe } = useScrollReveal()
onMounted(() => { if (sectionRef.value) observe(sectionRef.value) })

const DEFAULT_ITEMS: FAQItem[] = [
  { id: '1', category: 'Sản phẩm', question: 'WeConnect hỗ trợ những kênh nhắn tin nào?', answer: 'WeConnect hỗ trợ WhatsApp, WhatsApp Business API, Zalo OA, Zalo ZNS, Telegram, và SMS. Chúng tôi đang phát triển thêm Facebook Messenger và Viber.' },
  { id: '2', category: 'Sản phẩm', question: 'Có thể quản lý bao nhiêu tài khoản cùng lúc?', answer: 'Tuỳ gói: Starter 50 tài khoản, Business 500 tài khoản, Enterprise không giới hạn. Mỗi tài khoản có thể chạy nhiều phiên song song.' },
  { id: '3', category: 'Kỹ thuật', question: 'API có tài liệu đầy đủ không?', answer: 'Có. Chúng tôi cung cấp REST API đầy đủ tài liệu tại api.wemake.vn, SDK cho Node.js, Python và PHP, cùng Webhook cho event-driven integration.' },
  { id: '4', category: 'Bảo mật', question: 'Dữ liệu có được mã hóa không?', answer: 'Tất cả dữ liệu được mã hóa AES-256 lúc lưu trữ và TLS 1.3 khi truyền tải. Chúng tôi tuân thủ PDPA và đang trong quá trình đạt ISO 27001.' },
  { id: '5', category: 'Billing', question: 'Có dùng thử miễn phí không?', answer: 'Có! 14 ngày dùng thử miễn phí toàn tính năng, không cần thẻ tín dụng. Sau đó bạn có thể chọn gói phù hợp hoặc huỷ bất kỳ lúc nào.' },
  { id: '6', category: 'Billing', question: 'Có hợp đồng dài hạn bắt buộc không?', answer: 'Không. Tất cả gói đều thanh toán theo tháng, có thể nâng/hạ cấp hoặc huỷ bất cứ lúc nào. Gói năm được discount 20%.' },
]

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  const list = props.items ?? DEFAULT_ITEMS
  if (!q) return list
  return list.filter(
    item =>
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q),
  )
})

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <div ref="sectionRef" class="faq-wrap">
    <!-- search -->
    <div v-if="searchable" class="faq-search">
      <svg class="faq-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        v-model="search"
        class="faq-search__input"
        placeholder="Tìm kiếm câu hỏi..."
        type="search"
      />
    </div>

    <p v-if="!filtered.length" class="faq-empty">Không tìm thấy câu hỏi phù hợp.</p>

    <!-- items -->
    <div class="faq-list wx-reveal" :class="{ 'is-revealed': revealed }">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="faq-item"
        :class="{ 'faq-item--open': openId === item.id }"
      >
        <button
          class="faq-item__q"
          :aria-expanded="openId === item.id"
          @click="toggle(item.id)"
        >
          <span class="faq-item__q-text">{{ item.question }}</span>
          <span class="faq-item__chevron" :class="{ 'faq-item__chevron--open': openId === item.id }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </button>
        <Transition name="faq-expand">
          <div v-if="openId === item.id" class="faq-item__a">
            <p>{{ item.answer }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-wrap {}

.faq-search {
  position: relative;
  margin-bottom: var(--wx-space-6);
}
.faq-search__icon {
  position: absolute;
  left: var(--wx-space-4);
  top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px;
  color: var(--wx-text-tertiary);
  pointer-events: none;
}
.faq-search__input {
  width: 100%;
  padding: var(--wx-space-3) var(--wx-space-4) var(--wx-space-3) calc(var(--wx-space-4) + 26px);
  border: 1px solid var(--wx-border);
  border-radius: var(--wx-radius-lg);
  font-size: var(--wx-text-base);
  background: var(--wx-surface);
  color: var(--wx-text-primary);
  box-sizing: border-box;
}
.faq-search__input:focus {
  outline: none;
  border-color: var(--wx-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-primary) 15%, transparent);
}

.faq-empty {
  text-align: center;
  padding: var(--wx-space-10);
  color: var(--wx-text-tertiary);
  font-size: var(--wx-text-sm);
}

.faq-list { display: flex; flex-direction: column; gap: var(--wx-space-2); }

.faq-item {
  border: 1px solid var(--wx-border-subtle);
  border-radius: var(--wx-radius-lg);
  background: var(--wx-surface-raised);
  overflow: hidden;
  transition: border-color var(--wx-d-fast);
}
.faq-item--open { border-color: var(--wx-primary); }

.faq-item__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--wx-space-4) var(--wx-space-5);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: var(--wx-space-3);
}
.faq-item__q:hover { background: var(--wx-surface-elevated); }
.faq-item__q-text {
  font-size: var(--wx-text-base);
  font-weight: 500;
  color: var(--wx-text-primary);
  flex: 1;
}
.faq-item__chevron {
  flex-shrink: 0;
  width: 20px; height: 20px;
  color: var(--wx-text-tertiary);
  transition: transform var(--wx-d-fast);
}
.faq-item__chevron--open { transform: rotate(180deg); color: var(--wx-primary); }
.faq-item__chevron svg { width: 100%; height: 100%; }

.faq-item__a {
  padding: 0 var(--wx-space-5) var(--wx-space-4);
  border-top: 1px solid var(--wx-border-subtle);
}
.faq-item__a p {
  font-size: var(--wx-text-sm);
  color: var(--wx-text-secondary);
  line-height: 1.7;
  margin: var(--wx-space-3) 0 0;
}

/* expand transition */
.faq-expand-enter-active, .faq-expand-leave-active {
  transition: all var(--wx-d-normal) var(--wx-ease-standard);
  overflow: hidden;
}
.faq-expand-enter-from, .faq-expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.faq-expand-enter-to, .faq-expand-leave-from { max-height: 400px; opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .faq-expand-enter-active, .faq-expand-leave-active { transition: none; }
}
</style>
