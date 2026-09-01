# WMK-UI Redesign — Autonomous 3-Dev Loop

Đây là kịch bản cho `/loop loopdeva.md đọc và loop`. Mỗi lần được đánh thức,
orchestrator (phiên hiện tại) đọc TOÀN BỘ file này — đặc biệt phần
**LOG TIẾN ĐỘ** ở cuối để biết vòng trước đã làm gì — rồi thực hiện một
ROUND mới theo quy trình bên dưới. KHÔNG hỏi lại người dùng bất kỳ điều gì.

## 0. Luật cứng — không được vi phạm

- KHÔNG hỏi người dùng câu hỏi nào (không AskUserQuestion, không "bạn có muốn...").
- Nếu có nhiều phương án: tự phân tích, chọn 1 phương án tốt nhất, làm luôn.
  Thứ tự ưu tiên khi quyết định: UX tốt nhất > visual đẹp/đồng nhất > phù hợp
  iOS design language > phù hợp desktop SaaS > dễ dùng > ít breaking change
  nhất > maintainable > responsive > accessibility > performance.
- KHÔNG phá business logic, KHÔNG phá API/permission, KHÔNG xoá tính năng.
- KHÔNG chạy lệnh git phá hoại (`reset --hard`, `push --force`, `clean -fd`,
  `checkout --` trên file có thay đổi chưa commit của người khác) — chỉ có
  ngoại lệ là mỗi dev tự `git add` **đúng file mình sửa** rồi `git commit`
  (không `git add -A`, không `commit -am`).
- KHÔNG `git push` — chỉ commit local. Push là hành động chia sẻ, ngoài
  phạm vi được giao ở đây.
- KHÔNG bỏ qua hook (`--no-verify`), không sửa `.env`/CI/config môi trường.
- Sau khi 1 round xong: KHÔNG dừng chờ xác nhận. Cập nhật LOG rồi tiếp tục
  (loop sẽ tự gọi lại lần sau qua ScheduleWakeup).

## 1. Model policy (BẮT BUỘC — theo GLOBAL MODEL POLICY của user)

- **Reasoning / Planning / phân tích / chia việc** → luôn spawn Agent với
  `model: "opus"`. Orchestrator hiện tại chạy Sonnet nên TUYỆT ĐỐI không tự
  lên kế hoạch bằng chính mình — phải delegate bước PLAN cho 1 Agent Opus.
- **Coding / test / execution** → luôn spawn Agent với `model: "sonnet"`.
- KHÔNG BAO GIỜ dùng Fable dưới bất kỳ hình thức nào (main, subagent, teammate,
  fallback...). Nếu Opus/Sonnet không khả dụng → dừng và báo lỗi, không
  fallback Fable.

## 2. Team — 3 "dev" mỗi round

Mỗi round orchestrator spawn 4 agent (song song khi có thể):

| Vai trò | Model | Nhiệm vụ |
|---|---|---|
| **PLAN** (Kiến trúc sư) | opus, `subagent_type: Plan` | Đọc LOG + BACKLOG bên dưới, đọc lại code hiện tại nếu cần, chọn **đúng 2 hạng mục độc lập** (không đụng chung file) cho Dev A và Dev B, viết checklist chấp nhận (acceptance criteria) cho Dev C. Trả về JSON/text rõ ràng: `{devA: {scope, files, task}, devB: {...}, devC: {checklist}}`. |
| **Dev A** | sonnet, `general-purpose` | Implement hạng mục 1. Sau khi sửa xong: tự chạy `cd frontend && npm run typecheck`, nếu cần `npm run build:lib`, rồi tự `git add <đúng file mình sửa>` + `git commit` (message theo convention `fix:`/`feat:`/`refactor:` + mô tả ngắn, có dòng `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`). |
| **Dev B** | sonnet, `general-purpose` | Giống Dev A nhưng cho hạng mục 2, chạy song song với Dev A (không đụng file của Dev A). |
| **Dev C** | sonnet, `general-purpose`, chạy SAU khi A & B báo xong | QA: `npm run typecheck && npm run build:lib && npm run build:app`; grep lại các file A/B vừa đổi để soát: không hardcode màu/spacing mới, đúng BEM `base-*`, có dark mode nếu cần, không phá prop/API. Nếu thấy lỗi nhỏ (typo, quên token, quên dark override) → tự sửa luôn + tự commit riêng (`fix: qa follow-up ...`). Nếu thấy vấn đề lớn hơn phạm vi round này → ghi vào BACKLOG cho round sau, không tự ý mở rộng scope. |

Orchestrator sau khi cả 4 xong: cập nhật **LOG TIẾN ĐỘ** (round mới, tóm tắt
việc đã làm, commit hash, backlog còn lại), rồi kết thúc turn bằng
`ScheduleWakeup` (dynamic, ví dụ 20-30 phút, `prompt: "loopdeva.md đọc và loop"`)
để round tiếp theo tự chạy — KHÔNG chờ người dùng.

Nếu PLAN agent thấy BACKLOG rỗng và cả 1 GLOBAL AUDIT ROUND vừa chạy xong mà
không tìm thêm vấn đề nào (0 finding), PLAN tự bổ sung round GLOBAL AUDIT mới
theo mục 4 (Round-robin audit categories) thay vì báo "hết việc" — chỉ dừng
hẳn khi 3 GLOBAL AUDIT liên tiếp đều 0 finding (xem mục 6 — Điều kiện dừng).

## 3. Phạm vi dự án

- Thư mục làm việc: `frontend/src/**` (components, archetypes, views,
  ui-system, composables). Token gốc: `frontend/src/ui-system/foundations/
  tokens.css`, `dark-mode.css`, `flat-mode.css` — đây là *nguồn* token,
  KHÔNG coi giá trị hex trong 3 file này là "hardcode cần fix".
  Chart series colors, decorative brand swatches, các màu tường minh có
  comment giải thích "luôn cố định" (vd traffic-light macOS, notification
  dot "luôn đỏ tươi") → để nguyên, không phải bug.
- Quality gate bắt buộc trước khi coi 1 task là DONE:
  `cd frontend && npm run typecheck && npm run build:lib` PASS.
- Không có tooling chụp màn hình trình duyệt trong môi trường này
  (`chromium-cli`/Playwright không có sẵn) — verify bằng code-level
  (đọc CSS, trace token, typecheck/build), KHÔNG claim đã "xem trên trình
  duyệt" nếu chưa thực sự làm được.

## 4. BACKLOG — hạng mục còn lại (PLAN chọn từ đây mỗi round, cập nhật khi xong)

### A. Hardcoded spacing sweep (ưu tiên cao — rất phổ biến)
Padding/margin/gap dạng px không dùng `var(--wx-space-*)`, đặc biệt các giá
trị khớp chính xác lưới 4pt (4/8/12/16/24/32/40/48px). Giá trị lẻ (6px, 10px,
14px...) dùng để fine-tune density — CHỈ đổi nếu khớp token, không ép về
token gần nhất nếu sẽ đổi layout rõ rệt.
- `archetypes/dashboard/DashboardKPICard.vue`, `DashboardHero.vue`
- `archetypes/marketing/MarketingHero.vue`, `MarketingHeader.vue`
- `archetypes/crud/CrudFormFields.vue`, `CrudPage.vue`
- `views/dashboard/*.vue` (10 file: Analytics, Crm, Ecommerce, Finance,
  Helpdesk, Iot, Logistics, Overview, Project, Saas) — nhiều spacing lặp lại
  giống nhau giữa các file, có thể tokenize hàng loạt.

### B. Duplicate button/badge/chip re-implementation (ưu tiên trung bình)
Đánh giá case-by-case — CHỈ gộp vào BaseButton/BaseBadge nếu không làm giảm
polish của thiết kế gốc (marketing hero CTA thường cố ý custom, không ép).
- `.hero-btn` trong `archetypes/marketing/MarketingHero.vue` vs `.mkt-btn`
  trong `MarketingHeader.vue` — xem có nên rút thành 1 style dùng chung giữa
  2 file (không nhất thiết phải là BaseButton) để giảm code trùng.
- `.row-btn` trong `archetypes/crud/CrudPage.vue` — icon-button pattern,
  xem xét có nên thành 1 icon-button variant tái dùng được.
- `.chip` trong `views/auth/EmailVerifyView.vue`, `.tag-more` trong
  `views/wemakeui/CampaignsView.vue`, các chip ad-hoc trong
  `views/showcase/{AnimationShowcase,PermissionShowcase}.vue`,
  `views/showcase/shell/SidebarShellShowcase.vue` → cân nhắc thay bằng
  `BaseBadge`/`BaseTag` nếu tương đương về mặt visual.

### C. Dashboard `.metric`/legend-dot pattern trùng lặp
`.metric{gap:4px}` và legend-dot pattern lặp lại ở 8+ file trong
`views/dashboard/*.vue`. Cân nhắc rút thành 1 composable/component nhỏ dùng
chung (không bắt buộc phải là component chính thức export trong lib.ts —
có thể là internal helper trong `views/dashboard/` nếu chỉ dùng ở đó).

### D. GLOBAL AUDIT ROUND categories (chạy round-robin khi backlog A/B/C cạn)
Mỗi round chọn 1-2 category, quét toàn bộ `frontend/src/**`:
1. Component còn style cũ / không dùng token
2. Spacing/radius/màu inconsistent giữa các component cùng loại
3. Layout lệch, overflow, text truncate sai
4. Button/modal/table không đồng nhất style
5. Icon sai kích thước (so với `--wx-density-icon-size`)
6. Responsive: kiểm tra các view ở breakpoint sm/md (dùng `useBreakpoint`),
   tìm chỗ không co giãn đúng
7. Interaction states: hover/focus/active/disabled/loading/empty/error —
   soát các component/view thiếu 1 trong các state này theo
   SCREEN COMPLETION GATE (DESIGN.md §5 liệt kê props như `loading`,
   `disabled` — kiểm tra view nào dùng component nhưng không xử lý state)
8. Accessibility: thiếu `aria-*`, thiếu `alt`, contrast thấp, focus không
   visible, keyboard nav
9. CSS hardcoded / duplicated style còn sót (re-grep định kỳ vì mỗi round
   có thể sinh ra hardcode mới)
10. Legacy component không còn dùng (audit `git grep` xem có view nào import
    nhưng không render, hoặc component không được import ở đâu cả — nếu thật
    sự orphan và không phải public API của lib thì có thể đề xuất xoá, nhưng
    KHÔNG tự xoá nếu nó được export trong `lib.ts` — đó là public API, xoá là
    breaking change).

## 5. Cách PLAN chọn việc mỗi round

1. Đọc LOG TIẾN ĐỘ — xem round trước để lại backlog gì, đã làm những file nào.
2. Ưu tiên mục A (spacing) và các bug thật (giống BaseBadge round 1) trước,
   vì ảnh hưởng nhiều component nhất.
3. Chia 2 hạng mục cho Dev A/B sao cho **không đụng chung file** (để tránh
   git conflict giữa 2 commit chạy gần như đồng thời).
4. Mỗi hạng mục nên vừa đủ nhỏ để 1 dev hoàn thành + tự verify trong 1 round
   (khoảng 1-4 file). Đừng giao nguyên cả mục A cho 1 round — chia nhỏ theo
   nhóm file (vd round này: DashboardKPICard+DashboardHero; round sau:
   MarketingHero+MarketingHeader; round sau nữa: 5 file đầu của
   views/dashboard/*, v.v).

## 6. Điều kiện dừng

Chỉ dừng loop (orchestrator gọi `ScheduleWakeup({stop: true})` thay vì đặt
lịch tiếp) khi TẤT CẢ đúng:
- Mục A, B, C ở BACKLOG đã trống (đã xử lý hết hoặc đã đánh giá "giữ nguyên
  vì hợp lý" — ghi rõ lý do trong LOG).
- 3 GLOBAL AUDIT ROUND liên tiếp (mục D) đều trả về 0 finding mới.
- `npm run typecheck && npm run build:lib && npm run build:app` PASS ở lần
  chạy gần nhất.
Nếu chưa đạt đủ 4 điều kiện trên → luôn `ScheduleWakeup` để tiếp tục, không
tự ý dừng sớm hơn.

---

## LOG TIẾN ĐỘ (đọc từ dưới lên để biết state mới nhất; PLAN + orchestrator
## luôn append round mới vào cuối, không sửa log cũ)

### Round 0 (2026-09-02, session trước khi có loop này — làm thủ công, không qua 3-dev flow)
- Audit ban đầu bằng Explore agent: phát hiện toàn bộ `archetypes/**` không
  có `.wx-dark` override, nhiều hardcoded hex/spacing trong views/archetypes.
- Fix thật (đã commit `6adc1e6`):
  - `BaseBadge.vue`: thêm `.wx-dark` override cho success/warning/danger
    (bug thật — badge không sáng lên đúng WCAG AA khi dark mode).
  - `BaseInput.vue`: focus-ring shadow đổi từ hardcoded rgba sang
    `color-mix(... var(--wx-brand-primary) ...)` để đồng bộ re-skin brand
    color với `BaseSelect.vue`.
  - `views/dashboard/{OverviewView,ProjectView,SaasView}.vue`: chart
    line/legend `#2563eb` → `var(--wx-brand-primary)`.
  - `views/dashboard/WeDashboardV1View.vue`: `.env-dot` màu trùng token
    → dùng `var(--wx-success-text)`/`var(--wx-danger-text)`.
- Đã kiểm tra và XÁC NHẬN KHÔNG PHẢI BUG (đừng fix lại):
  `MarketingHero.vue` gradient hero (cố ý fixed-dark), chart palette default
  colors (`chart-utils.ts`, `Sparkline`/`Heatmap` props, data arrays theo
  category), `BaseTooltip` `#333`, `NotificationCenter` unread dot `#ef4444`
  (comment "luôn đỏ tươi"), `WindowControls` mac traffic-light — tất cả
  intentional theme-invariant.
- Giới hạn: không có chromium-cli/Playwright trong môi trường này → mọi
  verify là code-level (typecheck/build/trace token), không phải screenshot
  thực tế.
- Backlog để lại cho loop: toàn bộ mục A/B/C/D ở trên (A và D là ưu tiên
  cao nhất để bắt đầu).

<!-- Round 1+ sẽ được orchestrator/PLAN append tiếp xuống đây -->
