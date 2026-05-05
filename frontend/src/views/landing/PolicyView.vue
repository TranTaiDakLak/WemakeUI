<script setup lang="ts">
import LandingLayout from '../_layouts/LandingLayout.vue'

const sections = [
  { id: 'thu-thap', title: '1. Thu thập thông tin', content: 'Chúng tôi thu thập thông tin bạn cung cấp khi đăng ký tài khoản (email, tên), thông tin sử dụng dịch vụ và dữ liệu kỹ thuật (log, IP address, user agent). Chúng tôi không bán thông tin của bạn cho bên thứ ba.' },
  { id: 'su-dung', title: '2. Sử dụng thông tin', content: 'Thông tin được dùng để: cung cấp và cải thiện dịch vụ, gửi email thông báo quan trọng, hỗ trợ kỹ thuật, phân tích hành vi sử dụng để cải thiện UX. Bạn có thể opt-out email marketing bất kỳ lúc nào.' },
  { id: 'bao-mat', title: '3. Bảo mật dữ liệu', content: 'Dữ liệu được mã hoá bằng TLS khi truyền và AES-256 khi lưu trữ. Chúng tôi áp dụng access control nghiêm ngặt và kiểm toán định kỳ. Phát hiện breach sẽ thông báo trong 72 giờ.' },
  { id: 'cookie', title: '4. Cookie và tracking', content: 'Chúng tôi sử dụng cookie cần thiết (session, CSRF) và analytics (Plausible — không track cá nhân). Không có cookie quảng cáo. Bạn có thể xoá cookie bất kỳ lúc nào qua trình duyệt.' },
  { id: 'quyen', title: '5. Quyền của bạn', content: 'Bạn có quyền: truy cập dữ liệu cá nhân, yêu cầu chỉnh sửa hoặc xoá, xuất dữ liệu (GDPR data portability), phản đối xử lý dữ liệu. Gửi yêu cầu tới privacy@wemakeui.vn.' },
  { id: 'luu-tru', title: '6. Thời gian lưu trữ', content: 'Dữ liệu tài khoản giữ trong thời gian hoạt động + 90 ngày sau khi xoá tài khoản. Log truy cập giữ 30 ngày. Backup giữ 7 ngày. Sau thời hạn, dữ liệu được xoá vĩnh viễn.' },
  { id: 'thay-doi', title: '7. Thay đổi chính sách', content: 'Chúng tôi sẽ thông báo qua email và banner trang web ít nhất 14 ngày trước khi thay đổi quan trọng có hiệu lực. Tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận chính sách mới.' },
]

const active = ref('thu-thap')

import { ref } from 'vue'
</script>

<template>
  <LandingLayout>
    <section class="policy-hero">
      <h1 class="policy-title">Chính sách bảo mật</h1>
      <p class="policy-updated">Cập nhật lần cuối: 5 tháng 5, 2026</p>
    </section>

    <div class="policy-layout">
      <nav class="policy-toc">
        <p class="toc-label">Mục lục</p>
        <ul class="toc-list">
          <li v-for="s in sections" :key="s.id">
            <a :href="`#${s.id}`" class="toc-link" :class="{ active: active === s.id }" @click.prevent="active = s.id">{{ s.title }}</a>
          </li>
        </ul>
      </nav>

      <article class="policy-content">
        <p class="intro-text">WemakeUI cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.</p>

        <div v-for="s in sections" :key="s.id" :id="s.id" class="policy-section">
          <h2 class="section-title">{{ s.title }}</h2>
          <p class="section-text">{{ s.content }}</p>
        </div>

        <div class="contact-box">
          <h3 class="cb-title">Câu hỏi về quyền riêng tư?</h3>
          <p class="cb-text">Liên hệ DPO của chúng tôi tại <a href="mailto:privacy@wemakeui.vn" class="link">privacy@wemakeui.vn</a> hoặc gửi thư tới: WemakeUI Corp, 123 Lê Lợi, Q.1, TP.HCM.</p>
        </div>
      </article>
    </div>
  </LandingLayout>
</template>

<style scoped>
.policy-hero { padding: var(--wx-space-10) var(--wx-space-5) var(--wx-space-6); text-align: center; background: var(--wx-bg-sunken); border-bottom: 1px solid var(--wx-border-subtle); }
.policy-title { font-size: var(--wx-fs-40); font-weight: 800; letter-spacing: var(--wx-tracking-tight); margin-bottom: var(--wx-space-2); }
.policy-updated { font-size: var(--wx-fs-13); color: var(--wx-content-muted); margin: 0; }

.policy-layout { display: grid; grid-template-columns: 220px 1fr; gap: var(--wx-space-8); max-width: 1100px; margin: 0 auto; padding: var(--wx-space-8) var(--wx-space-5); }
@media (max-width: 768px) { .policy-layout { grid-template-columns: 1fr; } }

.policy-toc { position: sticky; top: 76px; align-self: flex-start; }
.toc-label { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: var(--wx-space-3); }
.toc-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.toc-link { font-size: var(--wx-fs-13); color: var(--wx-content-secondary); text-decoration: none; padding: var(--wx-space-1) var(--wx-space-2); border-radius: var(--wx-radius-sm); display: block; border-left: 2px solid transparent; transition: all var(--wx-d-micro); }
.toc-link:hover { color: var(--wx-content-primary); background: var(--wx-hover-bg); }
.toc-link.active { color: var(--wx-brand-600); border-left-color: var(--wx-brand-500); background: var(--wx-brand-50); }

.policy-content { max-width: 720px; }
.intro-text { font-size: var(--wx-fs-16); color: var(--wx-content-secondary); line-height: var(--wx-lh-relaxed); margin-bottom: var(--wx-space-6); }
.policy-section { margin-bottom: var(--wx-space-7); }
.section-title { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); margin-bottom: var(--wx-space-3); }
.section-text { font-size: var(--wx-fs-15); color: var(--wx-content-secondary); line-height: var(--wx-lh-relaxed); margin: 0; }

.contact-box { margin-top: var(--wx-space-7); padding: var(--wx-space-5); background: var(--wx-bg-sunken); border-radius: var(--wx-radius-lg); }
.cb-title { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); margin-bottom: var(--wx-space-2); }
.cb-text { font-size: var(--wx-fs-14); color: var(--wx-content-secondary); margin: 0; line-height: var(--wx-lh-relaxed); }
.link { color: var(--wx-content-link); }
</style>
