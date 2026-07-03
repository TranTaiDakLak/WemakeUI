<script setup lang="ts">
import { ref, computed } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseAccordion, BaseInput, BaseTag } from '../../components/common'

const search = ref('')
const activeTag = ref('tất cả')

const TAGS = ['tất cả', 'tài khoản', 'thanh toán', 'tính năng', 'kỹ thuật', 'bảo mật']

const FAQS = [
  { id: 1, q: 'Làm cách nào để đổi mật khẩu?', a: 'Vào Cài đặt → Bảo mật → Đổi mật khẩu. Nhập mật khẩu hiện tại và mật khẩu mới, sau đó nhấn "Cập nhật".', tags: ['tài khoản', 'bảo mật'] },
  { id: 2, q: 'Có thể thêm thành viên vào workspace không?', a: 'Có. Vào Tổ chức → Thành viên → "+ Mời thành viên". Nhập email và chọn vai trò phù hợp.', tags: ['tài khoản', 'tính năng'] },
  { id: 3, q: 'Gói Pro có giới hạn số dự án không?', a: 'Không. Gói Pro cho phép không giới hạn số dự án. Chỉ gói Miễn phí mới giới hạn 5 dự án.', tags: ['thanh toán', 'tính năng'] },
  { id: 4, q: 'Làm thế nào để xuất dữ liệu?', a: 'Mọi dữ liệu có thể xuất dưới dạng CSV hoặc JSON từ menu Cài đặt → Xuất dữ liệu. Yêu cầu xác nhận email.', tags: ['tính năng', 'kỹ thuật'] },
  { id: 5, q: 'API có rate limit không?', a: 'Gói Free: 100 req/phút. Gói Pro: 1000 req/phút. Gói Enterprise: tuỳ chỉnh theo hợp đồng.', tags: ['kỹ thuật'] },
  { id: 6, q: 'Có hỗ trợ SSO / SAML không?', a: 'Có, nhưng chỉ dành cho gói Enterprise. Hỗ trợ Okta, Google Workspace, Azure AD. Liên hệ sales để được hỗ trợ.', tags: ['bảo mật', 'kỹ thuật'] },
  { id: 7, q: 'Hướng dẫn hoàn tiền như thế nào?', a: 'Trong vòng 30 ngày, gửi email tới billing@wemakeui.com kèm lý do. Hoàn tiền trong 5-7 ngày làm việc.', tags: ['thanh toán'] },
  { id: 8, q: 'Có thể dùng trên thiết bị di động không?', a: 'Có. WemakeUI hoạt động tốt trên mọi trình duyệt di động. Ứng dụng native đang được phát triển.', tags: ['tính năng'] },
]

const filtered = computed(() => FAQS.filter(f => {
  const matchTag = activeTag.value === 'tất cả' || f.tags.includes(activeTag.value)
  const matchSearch = !search.value || f.q.toLowerCase().includes(search.value.toLowerCase()) || f.a.toLowerCase().includes(search.value.toLowerCase())
  return matchTag && matchSearch
}))

const accordionItems = computed(() => filtered.value.map(f => ({
  key: String(f.id),
  title: f.q,
})))
</script>

<template>
  <AppPageLayout section="app" current="FAQ" page-title="FAQ / Trung tâm hỗ trợ" page-description="Câu hỏi thường gặp và hướng dẫn sử dụng">
    <div class="faq-wrap">
      <div class="faq-search-bar">
        <BaseInput v-model="search" placeholder="Tìm câu hỏi..." clearable style="max-width: 480px;" />
      </div>

      <div class="tag-filters" v-reveal>
        <BaseTag
          v-for="t in TAGS" :key="t"
          :label="t" size="sm"
          :variant="activeTag === t ? 'primary' : 'neutral'"
          style="cursor: pointer;"
          @click="activeTag = t"
        />
      </div>

      <div v-if="filtered.length === 0" class="empty-faq">
        <span>Không tìm thấy câu hỏi phù hợp.</span>
      </div>
      <BaseAccordion v-else :items="accordionItems" />

      <div class="contact-cta" v-reveal>
        <p class="cta-text">Không tìm thấy câu trả lời bạn cần?</p>
        <a href="#/landing/contact" class="cta-link">Liên hệ hỗ trợ →</a>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.faq-wrap { display: flex; flex-direction: column; gap: var(--wx-space-5); max-width: 780px; }
.faq-search-bar { display: flex; }
.tag-filters { display: flex; flex-wrap: wrap; gap: var(--wx-space-2); }
.empty-faq { padding: var(--wx-space-6); text-align: center; color: var(--wx-content-muted); font-size: var(--wx-fs-15); }
.contact-cta { display: flex; align-items: center; gap: var(--wx-space-4); padding: var(--wx-space-5); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-lg); }
.cta-text { font-size: var(--wx-fs-15); color: var(--wx-content-secondary); margin: 0; }
.cta-link { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); color: var(--wx-content-link); text-decoration: none; }
.cta-link:hover { text-decoration: underline; }
</style>
