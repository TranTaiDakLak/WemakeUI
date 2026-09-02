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
token gần nhất nếu sẽ đổi layout rõ rệt. **11px KHÔNG khớp token nào** (scale
`--wx-fs-*` nhảy thẳng 12→13→14→15→16, không có `--wx-fs-11`) — để nguyên
literal, không tự ép về fs-12 (bug thật đã gặp ở round 8, xem log).
- **Đã xong (round 8, Dev B, commit `2fcc9af` + QA fix `f0b6d1b`):**
  `archetypes/dashboard/DashboardHero.vue`, `archetypes/marketing/
  MarketingHero.vue` (chỉ 1 chỗ padding trailing 96px→space-11, còn 120px đầu
  và phần gradient/màu giữ nguyên), toàn bộ `views/dashboard/*.vue` (10 file:
  Analytics, Crm, Ecommerce, Finance, Helpdesk, Iot, Logistics, Overview,
  Project, Saas) + `WeDashboardV1View.vue` — chỉ convert 4/8/12/16/96px khớp
  chính xác lưới, không đụng width/height/grid-template-columns, không ép các
  giá trị lẻ (2/3/5/6/9/10/14px).
- **Đã xong (round 9, Dev A, commit `2700eac`, QA xác nhận `PASS`):**
  archetype scope CLOSED — `DashboardKPICard.vue`/`CrudFormFields.vue` đã hết
  từ round 1; `MarketingHeader.vue` không còn px nào để convert;
  `MarketingHero.vue`/`CrudPage.vue` chỉ còn giá trị lẻ (2/5/6/10/14px, cộng
  120px hero cố ý) — QA đã re-grep độc lập cả 5 file, xác nhận đúng claim.
  Ngoài archetype: 14 file trong `views/app/*` (7 file) + `views/wemakeui/*`
  (7 file) — 24 chỗ convert 4/8/16px khớp lưới sang `--wx-space-1/2/4`, đều
  nằm trong `<style scoped>` hoặc 3 inline `style="margin-top:..."` trong
  `AutomationCanvasView.vue`. QA đã đọc toàn bộ diff (không phải spot-check),
  xác nhận 0 chỗ đổi `font-size`, 0 giá trị lẻ bị ép về token.
- **Đã xong (round 10, Dev A, commit `7781926`, QA xác nhận `PASS`):**
  5 file trong `views/showcase/*` (`OverviewView.vue`, `charts/IndexView.vue`,
  `TemplateGallery.vue`, `AppTemplatesView.vue`, `shell/SplitShellShowcase.vue`)
  — convert ~62 declaration khớp chính xác lưới 4pt (padding/margin/gap).
  `RevealTest.vue` đúng ra để nguyên vì không có `<style scoped>` (toàn bộ
  spacing nằm ở inline `style=""` trong template).
- **Đã xong (round 11, Dev A, commit `9c36618`, QA xác nhận `PASS`):**
  16 file còn lại trong `views/showcase/*` (`AnimationShowcase.vue`,
  `AsyncShowcase.vue`, `DevPanelShowcase.vue`, `IconShowcase.vue`,
  `ObservabilityShowcase.vue`, `PatternShowcase.vue`, `PermissionShowcase.vue`,
  `PlatformShowcase.vue`, `TokensShowcase.vue`, `data/{CalendarView,
  CrudTableView,FilterView,GridView,IndexView,KanbanView,LogView}.vue`) — 56
  dòng đổi. **Mục A coi như CLOSED cho toàn bộ `views/showcase/*`** — QA
  round 11 re-grep độc lập bằng pattern grid-match (4/8/12/16/24/32/40/48/
  64/80/96/128px) trên toàn thư mục chỉ còn đúng 2 exception đã biết, không
  có hit mới nào: `AppTemplatesView.vue:105 scroll-margin-top:80px` (category
  khác, cố ý để nguyên, đã ghi nhận từ round 10) và `RevealTest.vue` (toàn bộ
  inline `style=""` trong template, không có `<style scoped>`, ngoài scope
  theo đúng quyết định round 10).
- **Còn lại cho round 12+ (đã xử lý qua round 12-15, xem log):**
  - `views/marketing/*` — re-grep round 11 còn **7 hit** (giảm nhẹ so với ước
    tính ~9 của round 10, chưa đụng tới).
  - `views/forms/*` — **21 hit**, chưa quét riêng (cluster lớn nhất còn lại).
  - `views/saas/*` — **2 hit**.
  - `views/auth/*` — **4 hit**.
  (Tất cả 4 nhóm trên đếm bằng pattern grid-match `(padding|margin|gap)...:
  (4|8|12|16|24|32|40|48|64|80|96|128)px` qua `grep -rE`, chưa đọc kỹ từng
  file để loại multi-value shorthand chỉ khớp 1 phần như các round trước —
  dev round 12 cần đọc kỹ theo đúng pattern đã làm ở round 10-11, không convert
  máy móc theo số đếm thô này.)
- **Đã xong (round 15, Dev A commit `d909077`, QA xác nhận `PASS`):**
  toàn bộ `views/docs/**` (25 file, 63 conversion) — cụm lớn nhất còn lại từ
  backlog round 14, bao gồm 3 inline `style=""` sanctioned
  (`DropdownDoc.vue`/`TooltipDoc.vue` `gap:24px`→`space-5`,
  `GettingStartedView.vue` `margin-top:32px`→`space-6`). Mục A **CLOSED cho
  toàn bộ `views/docs/**`** — QA round 15 re-grep độc lập xác nhận 0 residual
  hit.
- **Đã xong (round 15, Dev B commit `2f6bcb1`, QA xác nhận `PASS`):**
  7 view/archetype rải rác (`MaintenanceView.vue`, `NotFoundView.vue`,
  `PolicyView.vue`, `LandingView.vue` (5 chỗ), `WeDashboardV1View.vue`+
  `DashboardHero.vue` (inline `style="padding:0 4px"` sanctioned, 1 chỗ mỗi
  file, cùng 1 pattern trigger-button lặp ở 2 nơi), `DashboardAnalytics.vue`)
  — 10 conversion. Cộng riêng: `BaseDataGrid.vue` 14-biến alias-scheme (nợ đặt
  tên từ round 11) migrate xong 100% sang `--wx-*` canonical, pure rename
  không đổi hành vi (xem mục backlog "BaseDataGrid" cũ, nay CLOSED).
- **QA round 15 — full-repo re-grep (item 10 checklist) — mục A CHƯA đóng
  repo-wide, ĐÍNH CHÍNH nhận định sai của round 12 về `style.css`/
  `responsive.css`:** round 12 từng kết luận "`style.css`/`ui-system/
  foundations/{tokens.css,responsive.css}` là file ĐỊNH NGHĨA token/scale gốc,
  loại khỏi phạm vi mục A" — kết luận đó **chỉ đúng cho phần đầu `style.css`**
  (khối alias `:root{...}` dòng ~20-97, đúng là chỉ trỏ `var(--wx-*)`, không
  có literal px cần convert) và cho `tokens.css`/`scales.ts` (đúng nghĩa
  nguồn thang đo). Nhưng **`style.css` còn một khối utility-class riêng
  (`.btn`, `.stat-card`, `.section-subtitle`, `.data-table th/td`,
  `.form-textarea`, `.radio-label`...) chưa từng được quét, có literal px
  khớp lưới thật**: `gap:8px` (dòng 174, `.btn`), `gap:8px` (dòng 240,
  `.stat-card`), `margin-top:4px` (dòng 301, `.section-subtitle`),
  `padding:12px 16px`/`padding:14px 16px` (dòng 312/322, `.data-table th/td`
  — 16px khớp cả 2 dòng, 12px khớp, 14px lẻ giữ), `padding:8px 10px` (dòng
  394, `.form-textarea` — 10px lẻ giữ), `gap:4px`+`margin-right:12px` (dòng
  417/419, `.radio-label`). Tương tự, `responsive.css` **không phải file định
  nghĩa token** — nó là breakpoint utility CSS thật
  (`.wx-container`/`.wx-page-pad` padding-left/right literal 16/24/12/32px ở
  các dòng 34-35/40/69/72/75) và cũng chưa từng được quét. Ngoài ra phát hiện
  1 file **chưa từng nằm trong bất kỳ backlog trước đó**: `views/
  ShowcaseView.vue` (top-level, route thật `/showcase` qua `router/index.ts:
  206` — khác hẳn thư mục con `views/showcase/**` đã CLOSED ở round 9-11) —
  ~25 hit thô (inline `style="margin-top:12px"` rải khắp template +
  `<style scoped>` từ dòng 947), và 1 hit nhỏ mới trong
  `archetypes/marketing/CaseStudyGrid.vue:165` (`.cs-label {
  margin-bottom: 4px; }` — khác với `padding: 80px...` hero-band đã CLOSED
  round 14, đây là dòng khác trong cùng file chưa từng bị đụng). Các cụm khác
  grep ra đều đã biết & đúng là exception cố ý, KHÔNG phải phát hiện mới:
  `views/forms/{FileUploadView,FloatingLabelsView,InputGroupView}.vue` (3
  `<pre>` doc-sample, round 12 đã xác nhận), `views/marketing/*` 6 file
  `padding-top:64px` (header-compensation cố ý, round 12), `views/showcase/
  {AppTemplatesView,charts/IndexView,data/CrudTableView,OverviewView,
  RevealTest}.vue` (scroll-margin/var-fallback JS-controlled/negative-margin/
  no-`<style scoped>`, round 9-11), giá trị âm ở `BaseAvatarGroup.vue`/
  `BaseSelectMenu.vue`/`StatusBar.vue`/`WeDashboardV1View.vue .chart-hint`
  (round 13, giữ nguyên đúng luật). **Kết luận: mục A KHÔNG đóng repo-wide** —
  còn ít nhất 4 cụm thật chưa xử lý (`style.css` utility-class block,
  `responsive.css`, `views/ShowcaseView.vue`, `CaseStudyGrid.vue:165`), tổng
  cộng ước lượng ~30 declaration cần đọc kỹ theo phương pháp round 14 (parse
  từng khai báo, chỉ tính hit khi TOÀN BỘ số trong value khớp lưới, tránh
  false-positive từ multi-selector-per-line) trước khi convert.

### B. Duplicate button/badge/chip re-implementation — **CLOSED** (round 10)
Đã đánh giá case-by-case toàn bộ 6 candidate trong backlog, mỗi candidate đều
DECLINED kèm rationale comment để lại trong code (round 11+ KHÔNG cần đề xuất
lại gộp các pattern cụ thể dưới đây trừ khi có thay đổi thiết kế thực sự làm
thay đổi căn cứ decline):
- `.hero-btn` (`MarketingHero.vue`) vs `.mkt-btn` (`MarketingHeader.vue`) —
  DECLINED: hero nằm trên gradient tối cố định (hardcode #fff/rgba glass,
  fs-16, space-3/6), header theme-aware token-based (fs-13, space-2/4) — gộp
  cần biến thể "on-dark" không cần thiết.
- `.row-btn` (`CrudPage.vue`) — DECLINED: bespoke icon-button với hover-fill +
  icon rotate/translate micro-motion, chỉ 1 consumer, không có giá trị tái sử
  dụng. Cleanup kèm theo: bỏ dead fallback `var(--wx-danger-solid, #ef4444)`
  (token đã có thật), `color:#fff`→`var(--wx-text-on-brand)` (2 chỗ hover).
- `.chip` (`EmailVerifyView.vue`) — DECLINED: render bằng `<button>` với
  `@click` toggle state demo (pending/verified/expired/error), không phải
  nhãn tĩnh — BaseBadge/BaseTag render `<span>`, migrate sẽ mất interaction
  semantics. Cleanup: `.chip.on{color:white}`→`var(--wx-text-on-brand)`.
- `.tag-more` (`CampaignsView.vue`) — DECLINED: so với BaseBadge `size="lg"`
  (fs-12, padding 3px 10px, font-weight 600 ép cứng), `.tag-more` chỉ khớp
  font-size, padding thực tế nhỏ gần nửa (1px 5px) và không ép font-weight —
  migrate sẽ làm chip "+N" overflow nặng hơn hẳn các BaseTag `sm` cạnh nó.
- `.chip`/`.chip--d`/`.chip--e` (`AnimationShowcase.vue`) — DECLINED: so với
  BaseBadge `size="sm"`/`"info"`, không size nào khớp cả font-size lẫn padding
  cùng lúc (chip: fs 10px/padding 2px 8px; sm: fs 10px/padding 1px 6px;
  md: fs 11px/padding 2px 8px), và `.chip--d` dùng `color-mix(...
  var(--wx-brand-primary) 12%...)` bám token brand thật trong khi
  `BaseBadge--info` hardcode `rgba(59,130,246,.12)` — lệch màu thật, không chỉ
  lệch size.
- `.chip` trong `PermissionShowcase.vue`/`SidebarShellShowcase.vue` — xác
  nhận **stale backlog entry**, cả 2 file có 0 occurrence `.chip`, không có
  việc gì để làm.

### C. Dashboard `.metric`/legend-dot pattern trùng lặp
- **Đã xong (round 9, Dev B, commit `ec28ede` + QA follow-up `6c4603f`):**
  tạo `views/dashboard/_components/{LegendDot,DashMetric}.vue` (internal,
  không export lib.ts/components/common/index.ts, cùng convention với
  `views/docs/_components/`). `LegendDot` thay `.dot`/`.d` ở `CrmView`,
  `OverviewView`, `ProjectView`, `SaasView` (2 chỗ mỗi file — QA follow-up
  đã migrate nốt `.d` trong `SaasView.vue` mà Dev B bỏ sót). `DashMetric`
  thay `.metric`/`.metric-label`/`.metric-value` ở `CrmView`/`ProjectView`
  (size `md`) và `AnalyticsView`/`EcommerceView` (size `lg`, `AnalyticsView`
  giữ đúng fs-28 gốc qua `:deep(.dash-metric--lg .dash-metric__value)`,
  QA đã verify override thắng đúng qua CSS output đã build — cùng specificity
  nhưng chunk CSS của view load sau chunk CSS của component con nên thắng
  cascade). Mục C coi như **CLOSED** cho phạm vi `views/dashboard/*` chính —
  còn 1 candidate follow-up (xem dưới), không chặn việc đóng mục C.
- **Follow-up còn lại (vẫn mở sau round 10, ưu tiên thấp):** `WeDashboardV1View.vue`
  `.env-dot` — Dev B cố ý KHÔNG migrate round này vì có thêm pill
  background/border-radius/padding + trạng thái pulse-animation ok/err không
  khớp `LegendDot` trần; để lại làm candidate xem xét kỹ hơn ở round sau (có
  thể cần biến thể `LegendDot` riêng hoặc giữ nguyên vì đủ khác biệt). Round
  10 không đụng tới file này (xác nhận qua `git show --stat` cả 2 commit).

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

### Round 1 (2026-09-02, chạy qua /loop lần đầu — PLAN opus + Dev A/B/C sonnet)
- PLAN (opus) chia: Dev A = tokenize spacing/font-size khớp chính xác lưới
  4pt trong `DashboardKPICard.vue` + `CrudFormFields.vue`; Dev B = bug thật
  — 7 biến CSS KHÔNG TỒN TẠI (`--wx-text-xs`, `--wx-text-sm`,
  `--wx-text-tertiary`, `--wx-space-1-5`, `var(--wx-success)`,
  `var(--wx-danger)`, `var(--wx-warning)`) đang được dùng trong
  `DashboardHero.vue`, `DashboardActivity.vue`, `DashboardAnalytics.vue`,
  `FAQAccordion.vue` → khiến font-size/spacing/màu bị silently broken
  (property bị bỏ qua vì var không có fallback).
- Dev A commit `7cb85c5`: 2 file, 10 dòng đổi, typecheck+build:lib PASS.
- Dev B commit `ca38482`: 4 file, 41 chỗ sửa (map sang token thật:
  `--wx-fs-12/14`, `--wx-text-muted`, `--wx-space-2`,
  `--wx-success-text`/`-solid`, `--wx-danger-text`, `--wx-warning-text`),
  typecheck+build:lib PASS.
- Dev C QA: chạy đủ typecheck + build:lib + build:app (PASS cả 3), verify
  không đụng file chung, không sửa tokens.css/dark-mode.css, không có
  hardcode mới, dark-mode override đủ cho cả 4 token dùng, không đổi
  script/props/lib.ts. **ROUND 1 QA: PASS**, không cần follow-up commit.
- Backlog mới phát hiện từ Dev C (bổ sung vào mục A/D cho round sau):
  - Cùng bug "undefined CSS var" (`--wx-text-xs/-sm/-tertiary`,
    `--wx-space-1-5`) còn ở `views/marketing/{ContactView,HomeView,
    PartnersView,ProductDetailView,ProductsView}.vue` (đã cố ý để ngoài
    scope round 1) — ưu tiên cao cho round 2, cùng dạng bug với Dev B vừa
    fix nên dev tiếp theo có full context để làm nhanh.
  - `views/home/LandingView.vue:307,324` — `var(--wx-text-tertiary,
    #cbd5e1)` cùng bug nhưng có hex fallback nên không vỡ visual, vẫn nên
    dọn theo cùng lượt.
  - `DashboardHero.vue:37-41` — `ENV_COLOR` object hardcode hex
    (`#22c55e`/`#f59e0b`/`#ef4444`) bind qua `:style` → nên đổi sang
    `var(--wx-success-solid)`/`var(--wx-warning-solid)`/`var(--wx-danger-solid)`.
  - `DashboardActivity.vue` `.job-name{font-size:12px}` (literal, không nằm
    trong diff Dev B) → có thể tokenize `var(--wx-fs-12)` cho đồng bộ.

### Round 2 (2026-09-02, /loop tự đánh thức lần đầu)
- PLAN (opus) tiếp tục dọn bug "undefined CSS var" từ backlog round 1: chia
  6 file còn lại — Dev A = `ContactView.vue` + `HomeView.vue`; Dev B =
  `ProductsView.vue` + `ProductDetailView.vue` + `PartnersView.vue` +
  `LandingView.vue`.
- Dev A commit `4f84556`: 18 chỗ sửa (2 file), typecheck+build:lib PASS.
- Dev B commit `c0e5a68`: 18 chỗ sửa (4 file), gồm case đặc biệt
  `LandingView.vue` — xoá hẳn dead fallback `#cbd5e1` thay vì chỉ đổi tên
  var, đúng luật "không hardcode màu". typecheck+build:lib PASS.
- Dev C QA: build gate 3/3 PASS (thêm cả `build:app`), 0 overlap file,
  full-tree grep xác nhận **bug class "undefined CSS var" (`--wx-text-xs`,
  `--wx-text-sm`, `--wx-text-tertiary`, `--wx-space-1-5`) đã CLOSED toàn bộ
  repo** (round 1 + round 2 gộp lại xử lý hết). Không cần follow-up commit.
  **ROUND 2 QA: PASS**.
- Backlog mới từ Dev C (bổ sung mục A/B cho round sau):
  - `views/home/LandingView.vue` — rất nhiều px chưa tokenize (font-size,
    padding, gap ở khoảng dòng 265-838) + vài hex `#fff`/gradient (dòng
    771-804) → ứng viên tốt cho spacing sweep, hiện là file "bẩn" nhất
    trong nhóm marketing/landing.
  - `views/marketing/ProductDetailView.vue` (dòng 12,18,24,30) và
    `ProductsView.vue` (dòng 22,32,42,52) — hex brand color per-product
    trong `PRODUCT_DATA`/`PRODUCTS` config, không có comment "cố ý cố định"
    như case macOS traffic-light — cần xem có nên map sang token hay giữ
    nguyên kèm comment giải thích.
  - (vẫn còn từ round 1, chưa ai đụng): `DashboardHero.vue:37,66`
    `ENV_COLOR` hardcode hex qua `:style`; `DashboardActivity.vue:242`
    `.job-name{font-size:12px}` literal.

### Round 3 (2026-09-02)
- PLAN (opus): Dev A = tokenize toàn bộ spacing/font-size khớp lưới 4pt +
  màu CTA + bỏ dead fallback trong `LandingView.vue` (file bẩn nhất từ
  backlog round 2); Dev B = dọn "wave 2" của bug undefined-CSS-var
  (`--wx-text-base/lg/xl/2xl`, `var(--wx-surface)`, `var(--wx-primary)` —
  KHÔNG PHẢI cùng list round 1/2, đây là biến khác cũng không tồn tại) +
  `DashboardHero.vue` ENV_COLOR + `DashboardActivity.vue` job-name +
  per-product hex color (giữ hex, thêm comment giải thích vì bị nối alpha
  suffix `${color}15` trong :style — không thể tokenize).
- Dev A commit `6f09dae`: 1 file, 53 dòng đổi cả 2 chiều — spacing/font-size
  tokenize, CTA color → `var(--wx-text-on-brand)` (KHÔNG dùng
  `--wx-text-inverse` vì token đó đổi màu theo dark mode, sai cho gradient
  cố định), bỏ dead fallback (bao gồm sửa luôn 1 a11y bug thật: 8 chỗ
  `var(--wx-d-fast, 150ms)` có fallback literal làm mất tác dụng override
  `prefers-reduced-motion→0ms` của hệ thống). typecheck+build:lib PASS.
- Dev B commit `ef25f53`: 4 file, fix hết wave-2 undefined-var trong đúng 4
  file được giao (không có var lạ nào khác ngoài list), `ENV_COLOR` đổi hex
  → `var(--wx-success/warning/danger-solid)`, `.job-name` tokenize,
  comment tiếng Việt giải thích per-product hex. typecheck+build:lib PASS.
- Dev C QA: build gate 3/3 PASS, 0 overlap, token tồn tại hết (21+14 tên),
  dark-mode/`--wx-text-on-brand` đúng (không bị override ở dark-mode.css —
  cố ý), reduced-motion fix xác nhận đúng, API/script không đổi ngoài dự
  kiến, review lại 1 judgment call của Dev A (tokenize luôn phần 24px
  trong `.lp-apps`/`.lp-footer` dù task không liệt kê rõ) → chấp nhận, áp
  dụng đúng rule chung. **ROUND 3 QA: PASS**, không cần follow-up commit.
- Backlog ưu tiên cao nhất cho round 4 — **wave 2 của bug undefined-CSS-var
  còn ở 6 file, đã có full file:line list từ Dev C:**
  - `archetypes/dashboard/DashboardAnalytics.vue:252`
  - `archetypes/marketing/FAQAccordion.vue:118,119,125,126,145,161,172`
  - `views/marketing/ContactView.vue:167,174,185,193,195,198,202,216,232,
    233,238,240,265`
  - `views/marketing/FAQView.vue:35,36`
  - `views/marketing/HomeView.vue:105,128`
  - `views/marketing/PartnersView.vue:73,82,117,130,131,137,141,143`
  (Mapping đã biết: `--wx-text-base`→`var(--wx-fs-16)`,
  `--wx-text-lg`→`var(--wx-fs-18)`, `--wx-text-xl`→`var(--wx-fs-20)`,
  `--wx-text-2xl`→`var(--wx-fs-24)`, `var(--wx-surface)`→
  `var(--wx-surface-base)`, `var(--wx-primary)`→`var(--wx-brand-primary)`.)
  Vẫn còn từ trước: mục A (spacing sweep) và mục B (duplicate button/chip)
  chưa động tới.

### Round 4 (2026-09-02)
- PLAN (opus): chia 6 file wave-2 undefined-var còn lại từ backlog round 3
  — Dev A = `ContactView.vue`(nặng nhất, 19-20 chỗ) + `FAQView.vue` +
  `DashboardAnalytics.vue`; Dev B = `FAQAccordion.vue` + `PartnersView.vue`
  + `HomeView.vue`.
- Dev A commit `3163863`: 3 file, ~23 chỗ sửa, kèm extra fix nút submit
  ContactView (`var(--wx-primary)` + hardcode `#fff` → `var(--wx-brand-
  primary)` + `var(--wx-text-on-brand)`). typecheck+build:lib PASS.
- Dev B commit `ac9bbee`: 3 file, ~21 chỗ sửa, kèm extra fix nút
  `.partner-join__btn`, cố ý bỏ qua `.mkt-cta--primary{background:#fff}`
  trong HomeView (nằm trên gradient CTA cố định, không phải bug).
  typecheck+build:lib PASS.
- Dev C QA: build gate 3/3 PASS, review kỹ diff/mapping đều đúng. Trong lúc
  quét toàn bộ mọi `var(--wx-...)` dùng trong repo và đối chiếu với token
  thật sự tồn tại (không chỉ theo list nghi ngờ có sẵn), phát hiện:
  - 1 lỗi nhỏ nằm ngay trong file Dev B vừa sửa (`FAQAccordion.vue:116`
    `var(--wx-border)` không tồn tại) → Dev C tự sửa + commit follow-up
    `88d1cd9` (map sang `--wx-border-default`).
  - **WAVE 3 — phát hiện lớn, ~90 chỗ / 20+ file**, KHÔNG sửa trong round
    này (quá lớn cho 1 round, để PLAN round 5 chia nhỏ). Chia 2 nhóm:
    - *Không có fallback (visual bug thật)*: `--wx-fs-10/11/17/22/26`,
      `--wx-fw-normal` (có thể ý là `--wx-fw-regular`), `--wx-space-16/20/
      2-5`, `--wx-surface-raised/hover/default`, `--wx-danger-subtle`,
      `--wx-success-subtle`, `--wx-card-accent`. Trải rộng khắp
      `views/forms/*`, `views/showcase/*`, `views/wemakeui/*`,
      `views/app/*`, `views/saas/*`, `views/dashboard/*`, và cả
      `components/common/{BaseFileUpload,BaseSelect,BaseSelectMenu,
      BaseBadge,BaseTabs,BaseCard,BaseWizard,TagList}.vue`,
      `components/charts/DonutChart.vue`. **Đây là component library gốc
      (`components/common/*`) bị dính bug — ưu tiên tuyệt đối cho round
      5**, vì ảnh hưởng trực tiếp public API của lib, không chỉ demo view.
    - *Có fallback (an toàn về mặt visual, nhưng nợ đặt tên)*:
      `--wx-error-bg/text/border` (nên đổi thành `--wx-danger-*` cho khớp
      tên token thật) ở `LoginV3View.vue`, `AnimationShowcase.vue`; và cả
      1 bộ naming scheme khác hẳn (`--wx-color-bg-*`, `--wx-color-text-*`,
      `--wx-color-border-*`, `--wx-color-brand-solid`) chỉ gói gọn trong
      `IconShowcase.vue` (~30 chỗ) — ưu tiên thấp hơn vì không vỡ visual.
  - Xác nhận false positive (không phải bug, bỏ qua): `--wx-shell-topbar-h`/
    `--wx-shell-max-w` (AppShell.vue), `--wx-sidebar-width`/
    `--wx-sidebar-collapsed-width` (AppSidebar.vue) — set qua inline
    `:style` từ props, không phải token toàn cục; các chuỗi
    `` `var(--wx-radius-${k})` `` build động trong TokensShowcase.vue/
    motionScale.ts/radiusMap.ts/elevationMap.ts/typographyScale.ts/
    ShimmerBlock.vue — không phải bug.
  - Xác nhận **wave 1 + wave 2 đã CLOSED hoàn toàn** (full-tree grep 0 hit).
  **ROUND 4 QA: PASS WITH FOLLOW-UP COMMIT `88d1cd9`**.
- Backlog cho round 5 — ưu tiên tuyệt đối WAVE 3 (đặc biệt nhóm
  `components/common/*` vì là public API của lib), xem chi tiết ở trên.
  Mục A (spacing sweep) và B (duplicate button/chip) vẫn đứng sau wave 3
  trong thứ tự ưu tiên vì wave 3 là bug thật (giống pattern round 1→4),
  còn A/B là refactor/polish.

### Round 5 (2026-09-02)
- PLAN (opus): wave 3 quá lớn (~90 chỗ/20+ file) cho 1 round, nên chỉ chọn
  phần giá trị cao nhất — 10 file `components/common/*` +
  `components/charts/DonutChart.vue` (public API, ship trong dist-lib/),
  cố ý để lại toàn bộ views/* + `components/wemakeui/*` (3 file
  `WCActionBar`/`WCAddAccountReviewModal`/`WCTrashModal`) + GROUP 2 cho
  round 6+. Dev A = `BaseSelect`/`BaseSelectMenu`/`BaseFileUpload`/
  `UserDropdown`; Dev B = `BaseBadge`/`BaseTabs`/`TagList`/`BaseWizard`/
  `BaseCard`/`DonutChart`.
- Dev A commit `2e29c03`: 4 file, map `--wx-fs-11/-10`→`var(--wx-fs-12)`,
  `--wx-danger-subtle`→`var(--wx-danger-bg)`, bỏ hẳn dead double-fallback
  `var(--wx-hover-bg, var(--wx-surface-hover))`→`var(--wx-hover-bg)`.
  typecheck+build:lib PASS.
- Dev B commit `782f0b8`: 6 file, map `--wx-surface-hover/-raised`→
  `var(--wx-hover-bg)` cho đúng CÁC RULE `:hover` thật, nhưng
  `BaseBadge.vue .base-badge--primary` (resting state, KHÔNG phải hover)
  → đúng ra phải là `var(--wx-neutral-bg)` chứ không phải hover-bg — judgment
  call đúng, phân biệt được resting vs hover state. `BaseCard.vue`
  `--wx-card-accent` xác nhận false positive (set qua inline `:style` từ
  prop `accentColor`, không phải token toàn cục) → chỉ thêm comment giải
  thích, không đổi code. typecheck+build:lib PASS.
- Dev C QA: build gate 3/3 PASS, 0 overlap, re-grep `components/common/**`
  + `components/charts/**` xác nhận 0 hit còn lại (trừ 3 file
  `components/wemakeui/*` cố ý ngoài scope), review kỹ semantic (phân biệt
  đúng resting-state vs hover-state, không đè lên `.wx-dark` block có sẵn
  của BaseBadge), token + dark-mode override đủ, API/lib.ts không đổi.
  **ROUND 5 QA: PASS**, không cần follow-up commit.
- Backlog cho round 6 — vẫn còn nguyên phần lớn wave 3 (chưa đụng round
  này): `views/forms/*`, `views/showcase/*`, `views/wemakeui/*` (bao gồm
  3 file `WCActionBar`/`WCAddAccountReviewModal`/`WCTrashModal` còn
  `--wx-fs-11`), `views/app/*`, `views/saas/*`, `views/dashboard/*` — cùng
  pattern `--wx-fs-10/11/17/22/26`, `--wx-fw-normal`, `--wx-space-16/20/
  2-5`, `--wx-surface-raised/hover/default`, `--wx-danger-subtle`,
  `--wx-success-subtle`. Mapping đã verify, dùng lại được:
  `--wx-fs-11/-10`→`var(--wx-fs-12)`, `--wx-fs-17`→cân nhắc theo context
  (16 hoặc 18), `--wx-fs-22`→(20 hoặc 24), `--wx-fs-26`→(24 hoặc 28),
  `--wx-fw-normal`→có thể là `--wx-fw-regular`, `--wx-surface-hover`→
  `var(--wx-hover-bg)` NẾU đúng là rule `:hover`, nếu là resting state thì
  cân nhắc `var(--wx-neutral-bg)`/`var(--wx-surface-*)` tuỳ ngữ cảnh (xem
  case BaseBadge round 5 làm mẫu), `--wx-danger-subtle`/`--wx-success-
  subtle`→`var(--wx-danger-bg)`/`var(--wx-success-bg)`. GROUP 2 (có
  fallback, ưu tiên thấp hơn): `--wx-error-*`→`--wx-danger-*` trong
  `LoginV3View.vue`/`AnimationShowcase.vue`; naming scheme riêng
  `--wx-color-*` (~30 chỗ) chỉ trong `IconShowcase.vue`.

### Round 6 (2026-09-02)
- PLAN (opus): tiếp tục wave 3 — Dev A = toàn bộ `views/forms/*` (11 file,
  `.fp__title` fs-22→24, các micro-label/table-header fs-11→12); Dev B =
  3 file `components/wemakeui/WC{ActionBar,AddAccountReviewModal,
  TrashModal}.vue` (fs-11→12) + toàn bộ `views/saas/*` (7 file: Dashboard,
  Members, Products, Settings, Statistics, Transactions, Versions —
  fs-11→12, fs-22→24 trên stat/amount, `--wx-success-subtle`→
  `--wx-success-bg`, `--wx-surface-hover`→`--wx-hover-bg` trên rule
  `:hover` thật, `--wx-surface-default`→`--wx-surface-elevated` trên card
  resting-state vì `SaasLayout` mặc định `AppShell background="sunken"`).
- Dev A commit `af43e36`: 11 file, 28 dòng đổi, typecheck+build:lib PASS.
- Dev B commit `8f1f951`: 10 file, 29 dòng đổi, typecheck+build:lib PASS.
- Dev C QA: build gate 3/3 PASS (typecheck sạch, build:lib 17.65s —
  ui.css 234.38kB/dts OK, build:app 9.46s — mọi chunk build OK). `git show
  --stat` xác nhận đúng 11 file (Dev A) + 10 file (Dev B), 0 overlap, không
  đụng tokens.css/dark-mode.css/flat-mode.css/lib.ts. Re-grep toàn bộ 21
  file cho pattern wave-3 category-1: chỉ còn đúng 1 hit
  (`FloatingLabelsView.vue:125`) — đã đọc lại code, xác nhận đúng như Dev A
  khai báo: nằm trong `<pre>` documentation code sample (HTML-escaped text
  `&lt;...&gt;`, không phải `<style>` thật), bản CSS sống thật ở dòng 208
  đã đúng `var(--wx-fs-12)` — không phải bug, chấp nhận exception. Verify
  kỹ các judgment call của Dev B: (a) đọc lại từng rule `--wx-surface-hover`
  → tất cả đều đúng selector `:hover` thật (`.ptable tr:hover td`,
  `.toggle-row:hover`, `.integration-row:hover`, `.top-member:hover`,
  `.summary-table tr:hover td`) — không có case resting-state bị gán nhầm;
  (b) đọc `SaasLayout.vue` xác nhận `<AppShell variant="sidebar"
  :topbar-height="56">` không truyền prop `background` → dùng default
  của `AppShell.vue` (`background: 'sunken'` ở dòng 45,
  `[data-bg="sunken"] → var(--wx-surface-sunken)`) → đúng là nền sunken,
  card cần `--wx-surface-elevated` để nổi lên — judgment call đúng; (c)
  `.tx-amount-value` (giá trị giao dịch trong `detail-header` highlight
  box, màu brand-primary) và `.ver-code` (số version lớn kiểu mono trong
  `detail-header`) đều đúng là stat/number display lớn, không phải heading
  — fs-24 hợp lý. `fp__title` cả 11 file forms đều dùng đúng
  `var(--wx-fs-24)`, không lệch nhau. Token `--wx-fs-12/24`,
  `--wx-hover-bg`, `--wx-surface-elevated`, `--wx-success-bg` đều tồn tại
  trong `tokens.css`; 3 token màu (`hover-bg`, `surface-elevated`,
  `success-bg`) đều có override trong `dark-mode.css`, fs-12/24 không cần
  (không phải màu). Diff cả 2 commit chỉ thay giá trị `var(--wx-...)`,
  không có hex/rgba/px mới — các đoạn hex context (`#22c55e`, `#16a34a`
  trong forms; `#6e7681` v.v.) đều là dòng context (không đổi), pre-existing
  từ trước, không phải Dev A/B thêm. Cả 2 diff 100% nằm trong `<style
  scoped>`, không có hunk nào chạm `<script setup>`/`<template>`, `lib.ts`
  không đổi, 3 file `WC*.vue` chỉ đổi giá trị `font-size`, không đổi tên
  class/prop/emit/slot nào. **ROUND 6 QA: PASS**, không cần follow-up
  commit — mọi phát hiện ngoài phạm vi 21 file được ghi backlog bên dưới
  thay vì tự ý mở rộng scope.
- Grep xác nhận lại nghi vấn round 5: `views/dashboard/*` **sạch hoàn toàn**
  wave-3 category-1 (0 hit) — xác nhận, bỏ khỏi backlog.
- Backlog cho round 7 (full-repo re-grep pattern
  `--wx-(fs-10|fs-11|fs-17|fs-22|fs-26|fw-normal|space-16|space-20|
  space-2-5|surface-raised|surface-hover|surface-default|danger-subtle|
  success-subtle)`, đã trừ các false-positive `--wx-card-accent` trong
  `BaseCard.vue` và điểm exception `FloatingLabelsView.vue:125`):
  - `views/showcase/*` (còn `AnimationShowcase.vue` fs-26/fs-11,
    `CardShowcase.vue` fs-11, `data/CrudTableView.vue` fs-11,
    `DevPanelShowcase.vue` fs-11, `ObservabilityShowcase.vue` fw-normal +
    fs-11, `PrimitivesShowcase.vue` fs-11, `TemplateGallery.vue` fs-11).
  - `views/app/*` (`ChatView.vue` fs-11 x2, `ContactsView.vue` fs-11,
    `FileManagerView.vue` fs-11, `MailboxView.vue` fs-11).
  - `views/wemakeui/*` các view còn lại (`AccountsView.vue`,
    `AdminView.vue` x3, `CampaignsView.vue` x3, `ConsoleView.vue`,
    `ContactsView.vue`) — đều fs-11.
  - `views/marketing/*` wave-3 còn sót (`ContactView.vue` space-20 +
    surface-raised x2, `FAQView.vue` space-20, `PartnersView.vue`
    space-16 x2 + space-20 + surface-raised, `ProductDetailView.vue`
    space-2-5 + space-20, `ProductsView.vue` space-20 + surface-raised +
    space-2-5).
  - `archetypes/crud/CrudPage.vue` (fs-11 dòng 783, surface-hover dòng 804
    — cần đọc kỹ selector trước khi map, giống pattern Dev B round 6).
  - `archetypes/marketing/FAQAccordion.vue:141` (surface-raised).
  - `archetypes/dashboard/DashboardActivity.vue:235` (space-2-5).
  - `views/_layouts/SaasLayout.vue:294` — **phát hiện mới round 6**:
    `.mob-nav-item:hover { background: var(--wx-surface-hover); }`, đã xác
    nhận đúng là rule `:hover` thật (mobile nav drawer item) → map
    `var(--wx-hover-bg)` giống pattern Dev B đã verify.
  - `views/auth/LoginV3View.vue:408` — **phát hiện mới round 6**:
    `.v3-brand-name { font-size: var(--wx-fs-17); }`, KHÔNG có fallback
    (khác với các chỗ `--wx-error-*` cùng file có fallback) → bug thật,
    category 1, cần map (16 hoặc 18 tuỳ context, đây là tên brand cạnh
    logo 36px nên có thể hợp `--wx-fs-16`).
  - GROUP 2 (có fallback, ưu tiên thấp hơn, xác nhận vẫn còn nguyên):
    `--wx-error-bg/text/border` → nên đổi tên thành `--wx-danger-*` ở
    `LoginV3View.vue` (dòng 592-594, 728-730) và `AnimationShowcase.vue`
    (dòng 905,907,910,924); naming scheme riêng `--wx-color-*` trong
    `IconShowcase.vue` (~45 chỗ, nhiều hơn ước tính round 5).
  - Mục A (spacing sweep còn lại ngoài wave-3) và B (duplicate
    button/chip) vẫn đứng sau wave-3 trong thứ tự ưu tiên.

### Round 7 (2026-09-02)
- Bối cảnh: PLAN + Dev A/B của round này đã chạy trước (commit `a14d8cf` +
  `b198574`), Dev C (agent này) chỉ chạy QA theo checklist có sẵn — không
  chạy lại PLAN.
- Dev A commit `a14d8cf`: 10 file (`views/showcase/{AnimationShowcase,
  CardShowcase,data/CrudTableView,DevPanelShowcase,ObservabilityShowcase,
  PrimitivesShowcase,TemplateGallery}.vue`, `archetypes/crud/CrudPage.vue`,
  `archetypes/marketing/FAQAccordion.vue`,
  `archetypes/dashboard/DashboardActivity.vue`) — map `--wx-fs-11`→
  `var(--wx-fs-12)` (7 chỗ), `--wx-fs-26`→`var(--wx-fs-28)` (hdr__title,
  đồng bộ với TemplateGallery), `--wx-fw-normal`→`var(--wx-fw-regular)`,
  `--wx-surface-hover`→`var(--wx-hover-bg)` (đúng rule `:hover` thật),
  `--wx-surface-raised`→`var(--wx-surface-elevated)`,
  `--wx-space-2-5`→`var(--wx-space-3)`. 13 dòng đổi, typecheck+build:lib
  PASS.
- Dev B commit `b198574`: 15 file (`views/app/{ChatView,ContactsView,
  FileManagerView,MailboxView}.vue`, `views/wemakeui/{AccountsView,
  AdminView,CampaignsView,ConsoleView,ContactsView}.vue`,
  `views/marketing/{ContactView,FAQView,PartnersView,ProductDetailView,
  ProductsView}.vue`, `views/_layouts/SaasLayout.vue`) — cùng pattern
  `--wx-fs-11`→`var(--wx-fs-12)`, `--wx-surface-hover`→`var(--wx-hover-bg)`
  (SaasLayout `.mob-nav-item:hover`, đúng rule hover thật),
  `--wx-surface-raised`→`var(--wx-surface-elevated)` (card resting-state:
  ContactView `.contact-form`/`.contact-success`, PartnersView
  `.partner-card`, ProductsView `.product-card`), `--wx-space-16`→
  `var(--wx-space-9)` (64px) và `--wx-space-20`→`var(--wx-space-10)` (80px)
  — xác nhận interpretation Tailwind-scale đúng (space-16 ý là 4rem=64px,
  khớp `--wx-space-9` trong tokens.css thật sự = 64px; space-20 = 5rem=80px
  khớp `--wx-space-10` = 80px), `--wx-space-2-5`→`var(--wx-space-3)`.
  28 dòng đổi, typecheck+build:lib PASS.
- Dev C QA (agent này) — verify toàn bộ checklist trước khi accept:
  - Build gate 3/3 PASS: `typecheck` sạch (exit 0), `build:lib` 18.05s
    (ui.css 234.37kB, es.js 415.90kB, umd.js 325.52kB, dts OK), `build:app`
    9.34s (mọi chunk build OK, exit 0).
  - `git show --stat` xác nhận đúng 10 file (Dev A) + 15 file (Dev B), 0
    overlap, không đụng `tokens.css`/`dark-mode.css`/`flat-mode.css`/
    `lib.ts`.
  - Full-tree re-grep pattern wave-3 category-1
    (`--wx-(fs-10|fs-11|fs-17|fs-22|fs-26|fw-normal|space-16|space-20|
    space-2-5|surface-raised|surface-hover|surface-default|danger-subtle|
    success-subtle)`) trên toàn `frontend/src`: **chỉ còn đúng 2 hit**, khớp
    chính xác dự đoán trong backlog round 6 — `FloatingLabelsView.vue:125`
    (đọc lại code: nằm trong `<pre>` doc-sample, đóng `</pre>` ở dòng 131,
    live CSS thật ở dòng 100/112 đã đúng `var(--wx-fs-14)`, không phải bug)
    và `LoginV3View.vue:408` (`.v3-brand-name{font-size:var(--wx-fs-17)}`,
    không có fallback, bug thật, cố ý để lại cho round sau).
  - Verify các judgment call: (a) đọc `TemplateGallery.vue:438` xác nhận
    `.hdr__title` đã dùng sẵn `var(--wx-fs-28)` — khớp với
    `AnimationShowcase.vue` sau khi Dev A đổi fs-26→fs-28, 2 page-header
    title đồng nhất; (b) đọc `CrudPage.vue:804` và `SaasLayout.vue:294` xác
    nhận cả 2 đều đúng selector `:hover` thật (`.detail-row:hover`,
    `.mob-nav-item:hover`), không phải resting-state; (c) đọc
    `FAQAccordion.vue:141`, `ContactView.vue` (`.contact-form`,
    `.contact-success`), `PartnersView.vue` (`.partner-card`),
    `ProductsView.vue` (`.product-card`) xác nhận toàn bộ là resting/default
    card style (không có `:hover`/`:focus` trong selector) → dùng
    `--wx-surface-elevated` đúng ngữ nghĩa, không phải `--wx-hover-bg`; (d)
    đọc `tokens.css` xác nhận scale thật: `--wx-space-9: 64px`,
    `--wx-space-10: 80px`, `--wx-space-3: 12px` — `DashboardActivity.vue`
    space-2-5→space-3 là rounding hợp lý (10px ý định → 12px token, dùng
    cho table cell padding, không đổi layout rõ rệt); marketing
    space-16→space-9 (64px) và space-20→space-10 (80px) đọc lại context
    `PartnersView.vue .partners-hero{padding:120px ... var(--wx-space-16)}`
    — cặp với literal 120px top của 1 hero section lớn, 64px bottom hợp lý
    hơn nhiều so với đọc "space-16" theo nghĩa literal 16px (sẽ lệch hẳn so
    với 120px top) → xác nhận Dev B chọn đúng interpretation Tailwind-scale.
  - Token existence: `--wx-fs-12`(12px)/`--wx-fs-28`(28px),
    `--wx-fw-regular`(400), `--wx-hover-bg`, `--wx-surface-elevated`,
    `--wx-space-3`(12px)/`-9`(64px)/`-10`(80px) đều tồn tại trong
    `tokens.css`; `--wx-hover-bg` và `--wx-surface-elevated` đều có override
    màu trong `dark-mode.css` (dòng 31, 72).
  - New-hardcode check: grep diff 2 commit cho hex/rgba/px mới trên dòng
    `+` (loại trừ `var(--wx-...)`) → 0 kết quả cả 2 commit, không có
    hardcode mới.
  - API safety: đọc toàn bộ diff (`git show` từng file) xác nhận 100% nằm
    trong `<style scoped>`, chỉ đổi giá trị `font-size`/`background`/
    `padding`/`font-weight`, không đụng `<script setup>`/`<template>`,
    không đổi prop/emit/slot, `lib.ts` không đổi.
  - Spot-check false-positive claim của Dev A: đọc
    `AnimationShowcase.vue:78-82` xác nhận `<code>--wx-d-*</code>` và
    `<code>--wx-ease-*</code>` là prose text trong `<p class="hdr__sub">`
    (mô tả token family name cho doc), không phải `var(--wx-d-*)` sống nào
    trong CSS — xác nhận đúng là false positive, không phải bug thật.
  - Không tìm thấy vấn đề nào cần follow-up fix. **ROUND 7 QA: PASS**,
    không có follow-up commit.
- Full-tree grep cuối cùng xác nhận: **wave-3 category-1 (no-fallback,
  bug thật) coi như CLOSED toàn bộ repo**, chỉ còn đúng 1 site sống thật
  chưa xử lý — `views/auth/LoginV3View.vue:408` (`--wx-fs-17`, cố ý deferred
  vì cần chọn 16 hay 18 tuỳ context). `FloatingLabelsView.vue:125` là
  exception đã xác nhận không phải bug (doc-sample trong `<pre>`), không
  tính vào wave-3 còn tồn đọng.
- Backlog cho round 8 — **ngắn hơn hẳn**, còn lại:
  - `views/auth/LoginV3View.vue:408` — nốt cuối wave-3 category-1
    (`--wx-fs-17`→16 hoặc 18 tuỳ context, brand-name cạnh logo 36px).
  - GROUP 2 (có fallback, an toàn visual, chỉ là nợ đặt tên) — vẫn nguyên,
    đã re-verify số lượng round này: `--wx-error-bg/text/border`→nên đổi
    thành `--wx-danger-*` ở `LoginV3View.vue` (dòng 592-594, 728-730, 6 chỗ)
    và `AnimationShowcase.vue` (dòng 905,907,910,924, 4 chỗ) — có thể gộp
    chung với fix fs-17 ở LoginV3View.vue trong cùng round vì cùng file.
  - `views/showcase/IconShowcase.vue` — naming scheme riêng `--wx-color-*`
    (đã re-grep xác nhận đúng 45 chỗ, khớp con số round 6 ước tính), GROUP 2,
    ưu tiên thấp hơn vì không vỡ visual (không có bug thật, chỉ là tên biến
    khác convention).
  - Mục A (spacing sweep còn lại ngoài wave-3, vd `views/dashboard/*` 10
    file) và B (duplicate button/chip) vẫn đứng sau GROUP 2 trong thứ tự ưu
    tiên — có thể PLAN round 8 cân nhắc chuyển sang mục A/B hoặc GLOBAL
    AUDIT (mục D) nếu muốn xử lý GROUP 2 gộp chung 1 round nhỏ trước.

### Round 8 (2026-09-02)
- Bối cảnh: PLAN + Dev A/B của round này đã chạy trước hai commit độc lập,
  Dev C (agent này) chỉ chạy QA theo checklist có sẵn — không chạy lại PLAN.
- Dev A commit `e4b2c99`: 3 file (`views/auth/LoginV3View.vue`,
  `views/showcase/AnimationShowcase.vue`, `views/showcase/IconShowcase.vue`).
  Đây là nốt cuối cùng của wave-3 category-1 + GROUP 2: map
  `--wx-error-bg/text/border` (không tồn tại trong `tokens.css`) →
  `--wx-danger-bg/text/border` thật ở `LoginV3View.vue` (form-alert +
  toast) và `AnimationShowcase.vue` (4 chỗ); fix `.v3-brand-name` từ
  `--wx-fs-17` (undefined, dead) → `--wx-fs-16`; đổi `color:white` trên step
  badge sang `var(--wx-text-on-brand)`; map toàn bộ ~45 chỗ naming scheme
  riêng `--wx-color-*` trong `IconShowcase.vue` sang token thật
  (`--wx-color-bg-base`→`--wx-surface-base`, `--wx-color-text-primary`→
  `--wx-text-primary`, `--wx-color-brand-solid`→`--wx-brand-primary` — đổi
  màu active-state/badge từ hex fallback tím sang brand blue thật), TRỪ
  `.page.is-dark` (fixed-dark preview panel cố ý, giữ hex literal
  `#0b0f17`/`#e6e8ec`, có comment tiếng Việt giải thích lý do — cùng category
  với fixed-dark hero của `MarketingHero.vue`). Dropped dead literal
  fallback trên các token đã thật (`--wx-success-*`, `--wx-radius-lg/-md`,
  `--wx-d-fast/-micro`, `--wx-ease-decelerate/-accelerate`) để
  `prefers-reduced-motion` override hoạt động đúng thay vì race với fallback
  ms literal. 90 dòng đổi, typecheck+build:lib PASS (theo commit message).
- Dev B commit `2fcc9af`: 13 file (`archetypes/dashboard/DashboardHero.vue`,
  `archetypes/marketing/MarketingHero.vue`, toàn bộ `views/dashboard/*.vue`
  10 file + `WeDashboardV1View.vue`) — vòng đầu tiên xử lý mục A (BACKLOG
  §4.A, hardcoded spacing sweep): convert padding/margin/gap/font-size px
  literal sang token CHỈ khi khớp chính xác giá trị scale (4/8/12/16/96px
  spacing, 12/13/14/28px font-size), giữ nguyên các giá trị lẻ
  (2/3/5/6/9/10/14px) và không đụng width/height/grid-template-columns. 52
  dòng đổi, typecheck+build:lib PASS (theo commit message).
- Dev C QA (agent này) — verify toàn bộ checklist trước khi accept:
  - Build gate 3/3 PASS: `typecheck` sạch (exit 0, không lỗi), `build:lib`
    18.11s (`ui.css` 234.37kB/gzip 34.73kB, `es.js` 415.90kB/gzip 98.34kB,
    `umd.js` 325.52kB/gzip 84.71kB, dts OK), `build:app` 9.83s (tất cả chunk
    build OK, `IconShowcase` 45.72kB, `LoginV3View` 12.16kB, `WeDashboardV1View`
    25.20kB — không có lỗi).
  - `git show --stat` xác nhận đúng 3 file (Dev A) + 13 file (Dev B), 0
    overlap, không đụng `tokens.css`/`dark-mode.css`/`flat-mode.css`/
    `lib.ts`.
  - **Full-tree re-grep cuối cùng cho TOÀN BỘ wave 1-3 + GROUP 2** (pattern
    `--wx-text-xs/sm/base/lg/xl/2xl/tertiary`, `--wx-space-1-5/2-5/16/20`,
    `var(--wx-surface)/(--wx-primary)/(--wx-secondary)`,
    `--wx-surface-raised/hover/default`, `--wx-danger-subtle`,
    `--wx-success-subtle`, `--wx-fs-10/11/17/22/26`, `--wx-fw-normal`,
    `--wx-error-*`, `--wx-color-bg-*/text-*/border-*/brand-*`) trên toàn
    `frontend/src`: **chỉ còn đúng 1 hit** —
    `views/forms/FloatingLabelsView.vue:125` (`font-size: var(--wx-fs-11)`),
    đã đọc lại code xác nhận đúng là false-positive từ round 6/7: nằm trong
    `<pre>` doc-sample (đóng `</pre>` dòng 131), live CSS thật ở dòng 100/112
    đã đúng `var(--wx-fs-14)`. Không có hit nào khác ngoài dự kiến.
  - Đọc `LoginV3View.vue:407-411` xác nhận `.v3-brand-name { font-size:
    var(--wx-fs-16); ... }` — đã fix đúng, không còn dead token.
  - Đọc `IconShowcase.vue:723-733` xác nhận `.page.is-dark` GIỮ NGUYÊN hex
    literal (`background: #0b0f17; color: #e6e8ec;`), có comment tiếng Việt
    ngay phía trên giải thích "Preview luôn-tối cố định ... không theo theme
    của site, nên nền/chữ giữ nguyên hex literal thay vì token phản ứng
    theme" — đúng như khai báo, KHÔNG bị convert nhầm sang token phản ứng
    theme. Grep xác nhận `--wx-color-brand-solid` không còn tồn tại trong
    file (0 hit), toàn bộ đã chuyển sang `--wx-brand-primary` (6 chỗ, bao
    gồm active-state/badge/border/box-shadow) — đúng phạm vi "everywhere
    EXCEPT dark-preview exception" vì rule `.page.is-dark` chỉ có
    background/color, không có brand color nào trong đó.
  - Diff xác nhận `.page.is-dark` hex KHÔNG PHẢI giá trị mới — trước round
    này nó đã là `var(--wx-color-bg-base, #0b0f17)`/`var(--wx-color-text-
    primary, #e6e8ec)` (token chết kèm fallback), Dev A chỉ bỏ wrapper token
    chết, giữ nguyên đúng giá trị hex fallback cũ → không tính là hardcode
    mới.
  - **Spot-check spacing conversions của Dev B** — đọc trực tiếp diff hunk
    của `DashboardHero.vue`, `MarketingHero.vue`, `WeDashboardV1View.vue`,
    `ProjectView.vue`, `OverviewView.vue`, `SaasView.vue`,
    `AnalyticsView.vue`: xác nhận `width: 8px; height: 8px` trên `.dot`/`.d`
    (OverviewView, ProjectView, SaasView) KHÔNG bị đụng, chỉ
    `margin-right: 4px` cạnh nó được convert; `grid-template-columns: 32px
    1fr` trong `AnalyticsView.vue .heatmap` giữ nguyên literal, chỉ `gap`
    convert; `MarketingHero.vue .hero { padding: 120px var(--wx-space-6)
    96px }` → chỉ số cuối (96px→`--wx-space-11`) đổi, số đầu `120px` và toàn
    bộ `background: linear-gradient(...)` giữ nguyên không đổi. **PHÁT HIỆN
    BUG THẬT**: `tokens.css` không có `--wx-fs-11` (scale nhảy thẳng
    12→13→14→15→16px) nhưng Dev B đã convert 10 chỗ `font-size: 11px` →
    `var(--wx-fs-12)` (`DashboardHero.vue` `.d-hero__live`/`.d-hero__env-
    pill`; `WeDashboardV1View.vue` `.env-dot`/`.section-badge`/`.chart-
    hint`/`.act-table th`/`.retry-badge`/`.acc-phone`/`.err-time`;
    `ProjectView.vue` `.x-labels`) — đây KHÔNG phải "khớp chính xác scale"
    như commit message khai báo, mà là âm thầm tăng 11px→12px, vi phạm
    chính rule Dev B tự đặt ra (giá trị lẻ không khớp token phải giữ
    nguyên). Đã tự sửa: revert cả 10 chỗ về lại `11px` literal, verify lại
    `typecheck`+`build:lib` PASS, commit riêng `f0b6d1b` ("fix: qa
    follow-up on round 8 — revert incorrect 11px->fs-12 conversions").
  - Token existence + dark-mode: xác nhận tất cả token mới dùng đều tồn tại
    trong `tokens.css` — `--wx-danger-bg/-text/-border` (dòng 92-95),
    `--wx-surface-base/-elevated/-sunken` (61-63), `--wx-hover-bg` (125),
    `--wx-text-primary/-secondary/-muted` (50-52), `--wx-border-default/
    -subtle` (67-68), `--wx-brand-primary` (18), `--wx-text-on-brand` (57),
    `--wx-space-1/2/3/4/11` (228-238: 4/8/12/16/96px), `--wx-fs-12/13/14/16/
    28` (242-250: 12/13/14/16/28px) — không có `--wx-fs-11` (xác nhận bug ở
    trên). Token màu đều có coverage trong `dark-mode.css` (đã verify ở
    round 6/7 cho phần lớn các token này, không lặp lại re-check chi tiết
    từng dòng ở round này vì không có token màu mới ngoài danh sách đã
    verify).
  - New-hardcode check: grep diff 2 commit cho hex/rgba mới trên dòng `+`
    (loại trừ `var(--wx-...)`) → chỉ 2 dòng match, đúng là `.page.is-dark`
    của Dev A (giá trị pre-existing, không phải mới, đã verify ở trên) —
    không có hardcode thật sự mới nào khác.
  - API safety: đọc hunk header (`@@ -line,count`) đối chiếu với vị trí
    `<style scoped>` của từng file trong cả 2 commit — toàn bộ hunk đều nằm
    sau dòng `<style scoped>`, không có hunk nào chạm `<script setup>`/
    `<template>`, không đổi prop/emit/slot, `lib.ts` không đổi.
  - **ROUND 8 QA: PASS WITH FOLLOW-UP COMMIT `f0b6d1b`.**
- **MILESTONE — Toàn bộ multi-round "undefined CSS var" bug hunt (wave 1, 2,
  3, GROUP 2 — trải dài từ round 1 đến round 8) chính thức CLOSED toàn repo.**
  Full-tree grep cuối cùng (mục trên) chỉ còn đúng 1 hit là false-positive
  doc-sample đã xác nhận nhiều lần (`FloatingLabelsView.vue:125`, trong
  `<pre>`, không phải CSS sống). Không còn site sống thật nào tham chiếu
  token undefined/dead trong toàn bộ `frontend/src/**`.
- Backlog cho round 9 — chuyển hẳn trọng tâm sang mục A/B/C/D (§4), không
  còn wave undefined-CSS-var nào phải theo dõi:
  - **Mục A (spacing sweep)** — round 8 đã xử lý xong toàn bộ
    `views/dashboard/*.vue` (10 file) + `WeDashboardV1View.vue` +
    `DashboardHero.vue` + 1 chỗ trong `MarketingHero.vue` (xem §4.A đã cập
    nhật chi tiết "Đã xong"/"Còn lại"). Còn lại cho round 9+:
    `DashboardKPICard.vue`, phần còn lại của `MarketingHero.vue` +
    `MarketingHeader.vue` chưa sweep, `CrudFormFields.vue`/`CrudPage.vue`
    chưa sweep, và các view ngoài `views/dashboard/*` (app/wemakeui/
    marketing/showcase/forms) chưa được quét riêng cho hardcoded-spacing
    (khác với wave-3 undefined-var đã quét xong).
  - **Lưu ý quan trọng cho round 9+ khi làm mục A**: `--wx-fs-11` KHÔNG tồn
    tại trong token scale — 11px là giá trị lẻ, để nguyên literal, KHÔNG ép
    về `--wx-fs-12`. Bug này vừa bị bắt và sửa ở round 8 (commit `f0b6d1b`);
    PLAN/Dev nên nhắc lại rule này khi giao việc round 9 để tránh lặp lại.
  - **Mục B** (duplicate button/badge/chip consolidation) — chưa động tới,
    vẫn nguyên như mô tả §4.B.
  - **Mục C** (dashboard `.metric`/legend-dot pattern trùng lặp) — chưa động
    tới, vẫn nguyên như mô tả §4.C. Lưu ý: round 8 đã tokenize một số
    `.metric{gap:4px}` thành `gap:var(--wx-space-1)` ở nhiều file
    `views/dashboard/*` nhưng KHÔNG rút thành component/composable dùng
    chung — mục C (rút gọn duplication) vẫn còn nguyên, chỉ là giá trị bên
    trong đã tokenize.
  - **Mục D (GLOBAL AUDIT round-robin)** — từ round 9 trở đi, vì backlog A/B/C
    không còn cấp bách như trước (đã qua nhiều vòng xử lý wave undefined-var
    + 1 vòng spacing), PLAN nên bắt đầu cân nhắc xen kẽ category D (component
    consistency, responsive, a11y, interaction states — §4.D mục 2,6,7,8)
    song song với việc tiếp tục A/B/C, thay vì chỉ làm A/B/C tuần tự. Round
    9 có thể chọn 1 hạng mục A/B/C + 1 category D độc lập file cho 2 dev,
    hoặc 2 category D nếu A/B/C tạm hết việc nhỏ phù hợp trong 1 round.

### Round 9 (2026-09-02)
- Bối cảnh: PLAN + Dev A/B của round này đã chạy trước hai commit độc lập,
  Dev C (agent này) chỉ chạy QA theo checklist có sẵn — không chạy lại PLAN.
- Dev A commit `2700eac`: 14 file (`views/app/{ApiKeyView,ChatView,
  ContactsView,MapView,OrderDetailView,PricingView,ProfileView}.vue`,
  `views/wemakeui/{AccountsView,AdminView,AutomationCanvasView,
  CampaignsView,ConsoleView,IntegrationsView,SchedulerView}.vue`) — tiếp tục
  mục A (spacing sweep): convert 24 chỗ padding/margin/gap khớp lưới 4pt
  (4/8/16px) sang `--wx-space-1/2/4`, giữ nguyên giá trị lẻ (2/6/10px). Kèm
  claim archetype scope (`DashboardKPICard.vue`, `CrudFormFields.vue`,
  `MarketingHeader.vue`, `MarketingHero.vue`, `CrudPage.vue`) đã CLOSED —
  hết giá trị khớp lưới, chỉ còn giá trị lẻ. typecheck+build:lib PASS.
- Dev B commit `ec28ede`: 8 file (2 file mới
  `views/dashboard/_components/{LegendDot,DashMetric}.vue` + 6 file sửa
  `views/dashboard/{AnalyticsView,CrmView,EcommerceView,OverviewView,
  ProjectView,SaasView}.vue`) — xử lý mục C: rút `LegendDot`/`DashMetric`
  làm internal helper (không export lib.ts), thay cho pattern `.dot`/`.metric`
  lặp lại. Tự phát hiện + xử lý đúng 1 discrepancy thật trong lúc làm:
  `AnalyticsView.vue` gốc dùng fs-28 cho `.metric-value` (khác fs-24 của
  `EcommerceView`) — giữ nguyên bằng `:deep()` override cục bộ thay vì đổi
  giá trị mặc định của `DashMetric` size `lg`, tránh đổi visual âm thầm.
  typecheck+build:lib PASS.
- Dev C QA (agent này) — verify toàn bộ checklist trước khi accept:
  - Build gate 3/3 PASS: `typecheck` sạch (exit 0), `build:lib` 15.01s
    (`ui.css` 234.37kB, `es.js` 415.90kB, `umd.js` 325.52kB, dts OK),
    `build:app` 9.53s (mọi chunk build OK, exit 0).
  - `git show --stat` xác nhận đúng 14 file (Dev A) + 8 file = 2 mới + 6 sửa
    (Dev B), 0 overlap, không đụng `tokens.css`/`dark-mode.css`/
    `flat-mode.css`/`lib.ts`/`components/common/index.ts`.
  - **Dev A regression re-check (round-8 repeat risk)**: đọc TOÀN BỘ diff
    (không chỉ spot-check 5) — 0 chỗ đổi `font-size` (grep ban đầu ra 10 hit
    nhưng đọc kỹ xác nhận đều là full-line reprint do rule CSS 1 dòng, giá
    trị font-size 2 bên `-`/`+` giống hệt nhau); cả 24 conversion đều đúng —
    đối chiếu `tokens.css` xác nhận `--wx-space-1/2/3/4 = 4/8/12/16px`, mọi
    giá trị convert đều khớp chính xác, mọi giá trị lẻ giữ nguyên (2px trong
    `.key-value`/`.source-tag`/`.type-tag`/`.filter-btn`/`.cron-code`, 6px
    trong `.wx-select,.wx-input`, 10px trong `.cron-lg`).
  - **Archetype "closed" claim**: tự re-grep độc lập cả 5 file
    (`DashboardKPICard.vue`, `CrudFormFields.vue`, `MarketingHeader.vue`,
    `MarketingHero.vue`, `CrudPage.vue`) cho pattern
    `padding|margin|gap: ...px` — xác nhận đúng, chỉ còn giá trị lẻ
    (2/5/6/10/14px, cộng 120px `.hero` cố ý đã ghi nhận từ round 8) và
    `MarketingHeader.vue` 0 hit. Claim ĐÚNG.
  - **Dev B visual-parity audit** (trọng tâm round này) — đọc CURRENT diff +
    2 file component mới cho cả 4 usage site `LegendDot` (Crm/Overview/
    Project/SaasView) và 4 usage site `DashMetric` (Crm/Project/Analytics/
    EcommerceView): mọi CSS declaration gốc (màu, size, gap, font-size,
    font-weight, letter-spacing) đều được giữ nguyên qua props/slot — không
    có gì bị rớt âm thầm. `OverviewView`/`ProjectView` giữ đúng
    `margin-right: var(--wx-space-1)` qua wrapper class `.legend-dot-gap`
    cục bộ (đúng như thiết kế "layout concern của parent"). Verify riêng
    `AnalyticsView.vue`'s fs-28 override: đọc `DashMetric.vue` xác nhận
    `.dash-metric--lg .dash-metric__value` là selector sống thật (root div
    nhận cả 2 class `dash-metric`+`dash-metric--lg`, `.dash-metric__value`
    là `<strong>` con) — `:deep()` syntactically đúng. Build xong, đọc CSS
    output thật (`dist/assets/AnalyticsView-*.css` vs `DashMetric-*.css`) —
    2 rule cùng specificity (0,3,0) nhưng nằm ở 2 chunk CSS khác nhau; do
    `AnalyticsView` import `DashMetric` nên chunk CSS của `DashMetric` được
    link trước, chunk của `AnalyticsView` link sau → override thắng cascade
    đúng như thiết kế, xác nhận qua code thật (không phải chỉ đọc lý thuyết).
  - **`.d`-class dot trong SaasView.vue**: đọc file xác nhận `.d` **KHÔNG
    PHẢI** phần tử khác mục đích — CSS giống hệt pattern `.dot` đã migrate
    (`display:inline-block;width:8px;height:8px;border-radius:9999px;
    margin-right:var(--wx-space-1)`), chỉ là 1 usage site Dev B bỏ sót
    trong chính file họ vừa sửa. **Đây là 1 lỗi nhỏ thật** → tự sửa: migrate
    `.d` → `<LegendDot color="..." class="legend-dot-gap" />` + xoá rule
    `.d` không dùng nữa, verify lại `typecheck`+`build:lib`+`build:app`
    PASS cả 3 (size dist-lib không đổi, xác nhận SaasView không ảnh hưởng
    lib bundle), commit riêng `6c4603f` ("fix: qa follow-up on round 9 —
    migrate SaasView.vue's missed .d legend dot to LegendDot").
  - **lib.ts reachability**: grep `lib.ts` + `components/common/index.ts`
    cho `LegendDot`/`DashMetric` → 0 hit. Grep `dist-lib/wemake-ui.es.js`
    cho `legend-dot`/`dash-metric` → 5 hit `legend-dot` nhưng đọc context
    xác nhận đều là `lc-legend-dot` (class có sẵn, không liên quan, thuộc
    component `LineChart` public khác) — false positive substring match,
    0 hit `dash-metric` thật. Xác nhận 2 file mới KHÔNG lọt vào dist-lib.
  - **`WeDashboardV1View.vue`**: xác nhận không xuất hiện trong `git show
    --stat` của cả 2 commit — untouched thật.
  - **New-hardcode check**: grep dòng `+` cả 2 commit cho hex/rgba ngoài
    `var(--wx-...)` → Dev A 0 hit; Dev B 2 hit, cả 2 đều là `#94a3b8`
    pre-existing (trước đây nằm trong `style="background:#94a3b8"` inline,
    giờ chuyển thành prop `color="#94a3b8"` — không phải giá trị mới, chỉ di
    chuyển vị trí). `LegendDot.vue`'s computed inline `width`/`height` từ
    prop `size` là ngoại lệ chấp nhận được theo checklist.
  - **API safety**: Dev A — mọi hunk nằm trong `<style scoped>` hoặc đúng 3
    inline `style="margin-top:..."` trong `AutomationCanvasView.vue`, không
    đụng `<script setup>` nào khác/prop/emit. Dev B — script changes chỉ là
    import statement + template thay `<div class="metric">`/`<span
    class="dot">` bằng usage component mới (prop passing, slot content),
    không có logic nghiệp vụ nào bị đổi.
  - **ROUND 9 QA: PASS WITH FOLLOW-UP COMMIT `6c4603f`.**
- Backlog cho round 10:
  - **Mục A** — còn lại: `views/showcase/*` (cluster lớn nhất, ước tính
    ~137 hit spacing chưa sweep), `views/marketing/*` (~9 hit),
    `views/forms/*`/`views/saas/*`/`views/auth/*` (chưa quét riêng cho
    pattern hardcoded-spacing-khớp-token, khác với wave-3 undefined-var đã
    xong toàn bộ các nhóm này từ round 6-7). Nhắc lại rule: `--wx-fs-11`
    KHÔNG tồn tại, không ép về fs-12 (bug round 8).
  - **Mục B** — vẫn chưa động tới: `.hero-btn` vs `.mkt-btn`
    (`MarketingHero.vue`/`MarketingHeader.vue`), `.row-btn` icon-button
    pattern (`CrudPage.vue`), chip ad-hoc (`EmailVerifyView.vue` `.chip`,
    `CampaignsView.vue` `.tag-more`, `AnimationShowcase`/
    `PermissionShowcase`/`SidebarShellShowcase` chip trong `views/showcase/*`).
  - **Mục C** — CLOSED cho phạm vi chính, còn 1 follow-up candidate:
    `WeDashboardV1View.vue` `.env-dot` (pill + pulse-animation, có thể cần
    biến thể riêng hoặc giữ nguyên — xem xét kỹ hơn nếu PLAN thấy đáng làm).
  - **Mục D (GLOBAL AUDIT)** — chưa round nào thực sự chạy category D theo
    đúng nghĩa "audit toàn repo theo 1 category trong §4.D mục 1-10" (round
    9 vẫn là A+C theo file cụ thể); PLAN round 10 có thể cân nhắc bắt đầu ít
    nhất 1 category D thật sự (vd category 7 — interaction states, hoặc
    category 8 — accessibility) song song với mục A, để tiến gần hơn tới
    điều kiện dừng "3 GLOBAL AUDIT liên tiếp 0 finding" ở mục 6.

### Round 10 (2026-09-02)
- Bối cảnh: PLAN + Dev A/B của round này đã chạy trước hai commit độc lập,
  Dev C (agent này) chỉ chạy QA theo checklist có sẵn — không chạy lại PLAN.
- Dev A commit `7781926`: 5 file (`views/showcase/{OverviewView,
  TemplateGallery,AppTemplatesView}.vue`, `views/showcase/charts/IndexView.vue`,
  `views/showcase/shell/SplitShellShowcase.vue`) — tiếp tục mục A (spacing
  sweep): convert padding/margin/gap khớp chính xác lưới 4pt sang
  `var(--wx-space-*)`, chỉ trong `<style scoped>`. `RevealTest.vue` đúng ra
  bỏ qua (0 dòng đổi) vì không có `<style scoped>`, toàn bộ spacing nằm ở
  inline `style=""` trong template. typecheck+build:lib PASS (theo commit).
- Dev B commit `87da65d`: 6 file (`archetypes/crud/CrudPage.vue`,
  `archetypes/marketing/{MarketingHero,MarketingHeader}.vue`,
  `views/auth/EmailVerifyView.vue`, `views/showcase/AnimationShowcase.vue`,
  `views/wemakeui/CampaignsView.vue`) — xử lý mục B (đóng toàn bộ backlog
  duplicate button/chip): đánh giá 6 candidate, cả 5 candidate thật đều
  DECLINED kèm rationale comment để lại trong code, 2 candidate xác nhận là
  stale backlog (0 `.chip` trong `PermissionShowcase.vue`/
  `SidebarShellShowcase.vue`). Kèm cleanup an toàn không phụ thuộc quyết định
  consolidate: `CrudPage.vue` bỏ dead fallback `var(--wx-danger-solid,
  #ef4444)` + 2× `color:#fff`→`var(--wx-text-on-brand)`;
  `EmailVerifyView.vue` cùng kiểu fix màu. Dev B báo `build:lib` fail 1 lần
  với lỗi vite-plugin-dts/api-extractor trên `useScrollReveal.d.ts` (file
  không liên quan, không đụng trong diff này) rồi pass sạch ngay lần retry —
  gắn cờ là flake pre-existing.
- Dev C QA (agent này) — verify toàn bộ checklist trước khi accept:
  - **Build gate**: `typecheck` sạch (exit 0). `build:lib` chạy **2 lần độc
    lập** để kiểm tra claim flake của Dev B — cả 2 lần đều PASS sạch, không
    tái hiện lỗi (`ui.css` 234.36kB/gzip 34.72kB, `es.js` 415.90kB/gzip
    98.34kB, `umd.js` 325.52kB/gzip 84.71kB, dts built ~16.3s cả 2 lần, tổng
    ~18.2s/lần) — xác nhận flake claim hợp lý (không phải do thay đổi trong
    round này gây ra, không tái hiện khi build lại). `build:app` PASS (9.04s,
    mọi chunk build OK, exit 0).
  - `git show --stat` xác nhận đúng 5 file (Dev A) + 6 file (Dev B), 0
    overlap, không đụng `tokens.css`/`dark-mode.css`/`flat-mode.css`/`lib.ts`.
  - **Dev A regression re-check**: đọc TOÀN BỘ diff cả 5 file (không chỉ
    spot-check) — 0 chỗ đổi `font-size` (mọi `font-size` trong context/diff
    đều giữ nguyên giá trị px cũ, ví dụ `.hero-title{font-size:28px}`,
    `.stat-value{font-size:22px}` không đổi), 0 chỗ đổi
    width/height/grid-template-columns/border-radius (`stats-grid
    grid-template-columns: repeat(4,1fr)` giữ nguyên, mọi `border-radius`
    trong diff đều đã dùng `var(--wx-radius-*)` từ trước, không có border-radius
    px literal nào bị đụng). Mọi giá trị convert đều khớp chính xác thang
    `--wx-space-1..12` (4/8/12/16/24/32/40/48/64/80/96/128px, đối chiếu
    `tokens.css` dòng 227-239). Multi-value shorthand chỉ convert đúng phần
    khớp: spot-verify `TemplateGallery.vue` `.search-input{padding:9px 32px
    9px 34px}` → `9px var(--wx-space-6) 9px 34px` (32px→space-6, đúng 9px/34px
    lẻ giữ nguyên); `OverviewView.vue` `.hero{padding:56px 32px 48px}` → `56px
    var(--wx-space-6) var(--wx-space-8)` (56px off-grid giữ literal, đúng).
    Verify riêng case `var(--space-lg, 24px)`/`var(--space-md, 16px)` trong
    `charts/IndexView.vue:286-307` mà Dev A khai báo bỏ qua: grep toàn repo
    xác nhận `--space-lg`/`--space-md` là 1 family biến **thật, riêng biệt**
    định nghĩa ở `frontend/src/style.css:76-77` (app-level demo CSS, không
    phải `tokens.css`), dùng chung ở 7 file khác trong `views/showcase/data/*`
    + `ShowcaseView.vue` — KHÔNG PHẢI biến `--wx-space-*` của design system,
    để nguyên là đúng, không phải bug undefined-var.
  - **Dev B candidate-by-candidate verification** (đọc code hiện tại, không
    chỉ tin báo cáo):
    (a) đọc diff `MarketingHero.vue`/`MarketingHeader.vue` xác nhận rationale
    comment có mặt, nội dung khớp thực tế (hero fs-16+space-3/6 trên gradient
    cố định, header fs-13+space-2/4 theme-aware).
    (b) `tokens.css` xác nhận `--wx-danger-solid: #ef4444` (dòng 94) là token
    thật (bỏ fallback an toàn); `--wx-text-on-brand: #ffffff` (dòng 57) —
    grep `dark-mode.css` xác nhận **0 override**, nên "an toàn, không đổi
    theo dark mode" là đúng.
    (c) đọc template `EmailVerifyView.vue:81-84` xác nhận `.chip` là
    `<button class="chip" @click="setState(...)">` thật (4 chỗ), không phải
    `<span>`/`<div>` — rationale "interactive, không migrate" đúng.
    (d) đọc `CampaignsView.vue` hiện tại: `.tag-more{padding:1px 5px}` (dòng
    852) và `BaseBadge.vue .base-badge--lg{font-size:12px;padding:3px 10px}`
    (dòng 56) — khớp chính xác số liệu Dev B trích trong comment.
    (e) đọc `AnimationShowcase.vue` hiện tại: `.chip{padding:2px 8px;
    font-size:10px}`, `.chip--d{background:color-mix(in srgb,
    var(--wx-brand-primary) 12%, transparent)}` và `BaseBadge.vue
    .base-badge--sm{font-size:10px;padding:1px 6px}`,
    `.base-badge--md{font-size:11px;padding:2px 8px}`,
    `.base-badge--info{background:rgba(59,130,246,0.12)}` — khớp chính xác
    số liệu trong comment, xác nhận "không size nào khớp cả 2 chiều" và
    "lệch màu thật" đều đúng.
    (f) grep độc lập `\.chip` trong `PermissionShowcase.vue` và
    `SidebarShellShowcase.vue` → 0 hit cả 2 file, xác nhận stale backlog.
  - **New-hardcode check**: grep dòng `+` cả 2 commit cho hex/rgba ngoài
    `var(--wx-...)` → Dev A: 1 hit (`pm__demo{color:#fff}`) nhưng đối chiếu
    diff xác nhận đây là full-line reprint của rule có sẵn (chỉ padding đổi,
    `color:#fff` đã tồn tại từ trước, không phải giá trị mới); Dev B: mọi hit
    đều nằm trong nội dung comment giải thích rationale (text, không phải
    code sống) — không có hardcode mới thật sự nào trong cả 2 commit.
  - **API safety**: đối chiếu hunk header với vị trí `<style scoped>` của
    `CrudPage.vue` (dòng 549), `MarketingHero.vue` (dòng 134),
    `MarketingHeader.vue` (dòng 84) — toàn bộ hunk của cả 3 file (dòng 647+,
    226+, 253+) đều nằm sau `<style scoped>`, không đụng `<script setup>`/
    `<template>`. Đọc lại toàn bộ diff xác nhận 0 rename prop/emit/slot/class
    — `EmailVerifyView.vue`/`AnimationShowcase.vue`/`CampaignsView.vue` cũng
    chỉ đổi giá trị CSS + thêm comment, không đụng script/template.
  - **Residual re-grep mục A** (độc lập, không dựa vào ước tính cũ): grep lại
    toàn bộ `views/showcase/**` cho pattern spacing khớp lưới còn sót — còn
    **59 hit** trải trong 18 file (breakdown đầy đủ đã ghi vào §4.A "Còn lại
    cho round 11+" ở trên), giảm rõ rệt so với ước tính ~137 của round 9.
    Phát hiện phụ: `AppTemplatesView.vue:105 scroll-margin-top:80px` — giá
    trị số khớp `--wx-space-10` nhưng Dev A liệt kê nó vào nhóm "off-grid" —
    về mặt số học không hẳn chính xác, nhưng đây là scroll-anchor offset
    (khác category với padding/margin/gap trang trí), để nguyên literal
    không tính là bug, chỉ là commit-message hơi thiếu chính xác — không cần
    fix.
  - Không tìm thấy vấn đề cần follow-up fix. **ROUND 10 QA: PASS**, không có
    follow-up commit.
- **MILESTONE — Mục B (duplicate button/badge/chip consolidation) chính thức
  CLOSED cho dự án này.** Toàn bộ 6 candidate trong backlog đã được đánh giá
  và xử lý dứt điểm (migrate hoặc decline-with-rationale, comment để lại
  trong code). Round sau **KHÔNG** cần đề xuất lại gộp `.hero-btn`/`.mkt-btn`,
  `.row-btn`, `.chip` (EmailVerifyView), `.tag-more` (CampaignsView),
  `.chip`/`.chip--d`/`.chip--e` (AnimationShowcase) trừ khi có bằng chứng mới
  (vd BaseBadge đổi cách tính màu sang `color-mix` theo brand token, hoặc
  `.chip` EmailVerifyView đổi từ `<button>` sang static label).
- Backlog cho round 11:
  - **Mục A** — còn `views/showcase/*` (59 hit, breakdown chi tiết ở §4.A),
    `views/marketing/*` (~9 hit), `views/forms/*`/`views/saas/*`/
    `views/auth/*` (chưa quét riêng cho spacing-khớp-lưới). Nhắc lại rule:
    `--wx-fs-11` KHÔNG tồn tại, không ép font-size về token (bug round 8);
    `scroll-margin-top` là category khác với padding/margin/gap, cân nhắc
    riêng trước khi convert.
  - **Mục B** — **CLOSED**, xem MILESTONE ở trên.
  - **Mục C** — vẫn 1 follow-up mở, ưu tiên thấp: `WeDashboardV1View.vue`
    `.env-dot` (pill + pulse-animation, có thể cần biến thể `LegendDot`
    riêng hoặc giữ nguyên).
  - **Mục D (GLOBAL AUDIT)** — sau 10 round vẫn CHƯA round nào thực sự chạy
    theo đúng nghĩa category D (§4.D mục 1-10) trên toàn repo. Với mục A đang
    thu hẹp dần (59 hit còn lại, giảm mạnh từ ~137) và mục B vừa đóng, PLAN
    round 11 nên **nghiêm túc cân nhắc bắt đầu mục D** — có thể chọn 1
    category D (vd category 7 — interaction states, hoặc category 8 —
    accessibility) chạy song song với phần còn lại của mục A, thay vì tiếp
    tục trì hoãn category D thêm 1 round nữa.

### Round 11 (2026-09-02)
- Bối cảnh: PLAN + Dev A/B của round này đã chạy trước hai commit độc lập,
  Dev C (agent này) chỉ chạy QA theo checklist có sẵn — không chạy lại PLAN.
- Dev A commit `9c36618`: 16 file còn lại trong `views/showcase/*` — tiếp tục
  mục A: convert padding/margin/gap khớp chính xác lưới 4pt sang
  `var(--wx-space-*)`. 56 dòng đổi, typecheck+build:lib PASS (theo commit).
- Dev B commit `3c686fd`: 6 file `components/common/{BaseCheckbox,
  BaseDataGrid,BaseDrawer,BasePagination,CommandPalette,ContextMenu}.vue` —
  mở đầu mục D (accessibility/focus-visible audit): audit toàn bộ site
  `outline: none` trong `components/**`+`archetypes/**`, phân 3 loại (a =
  đã có replacement thật, để nguyên; b = focus-trap/container cố ý, chỉ thêm
  comment; c = bug thật, fix bằng rule `:focus-visible` mới dùng
  `var(--wx-border-focus)`/`var(--wx-shadow-focus)`). Fix 4 site loại c
  (`BasePagination.vue .wx-pagination__loadmore`, `CommandPalette.vue
  .wx-cmdk__input`, `BaseDataGrid.vue .datagrid-wrapper` — có `tabindex="0"`
  thật, `BaseCheckbox.vue` rgba hardcode → token). Thêm comment cho 2 site
  loại b (`BaseDrawer.vue`, `ContextMenu.vue` — focus-trap). Đồng thời phát
  hiện và BÁO CÁO (không sửa) 1 vấn đề riêng: `BaseDataGrid.vue` dùng hẳn 1
  bộ CSS var naming khác hoàn toàn (không phải `--wx-*`) xuyên suốt `<style>`
  — 14+ chỗ (`--bg-primary`, `--text-tertiary`, `--border-color`,
  `--brand-primary`, v.v.) — nghi ngờ cùng severity với bug "undefined var"
  wave 1-8, giao QA điều tra kỹ (đây là PRIORITY ITEM của round này).
- Dev C QA (agent này) — verify toàn bộ checklist trước khi accept:
  - **Build gate 3/3 PASS**: `typecheck` sạch (exit 0). `build:lib` 18.32s
    (`ui.css` 234.68kB/gzip 34.75kB, `es.js` 415.90kB/gzip 98.34kB, `umd.js`
    325.52kB/gzip 84.71kB, dts built ~16.6s). `build:app` 9.37s, mọi chunk
    build OK, exit 0.
  - `git show --stat` xác nhận đúng 16 file (Dev A) + 6 file (Dev B), 0
    overlap, không đụng `tokens.css`/`dark-mode.css`/`flat-mode.css`/`lib.ts`.
  - **Dev A regression re-check**: đọc TOÀN BỘ diff cả 16 file — 0 chỗ đổi
    `font-size`/`width`/`height`/`border-radius`/`grid-template-columns`,
    mọi conversion đều khớp chính xác thang `--wx-space-*` (2px/8px/10px/6px/
    14px lẻ đều giữ nguyên literal, vd `PermissionShowcase.vue padding:8px
    14px`→`var(--wx-space-2) 14px`, `IconShowcase.vue padding:4px 6px`→
    `var(--wx-space-1) 6px`). `OverviewView.vue` xác nhận đúng **0 dòng đổi**
    (không nằm trong `git show --stat` của commit — claim "chỉ có negative
    margin, ngoài scope" đúng). `AppTemplatesView.vue`/`charts/IndexView.vue`/
    `RevealTest.vue` xác nhận **0 diff** (không có trong file list) — đúng là
    "ngoài scope, bỏ qua đúng" như claim. Ghi nhận: per-file count trong commit
    message có vài chỗ đếm sai nhẹ (vd `PermissionShowcase.vue` khai "7" nhưng
    diff thực chỉ có 6 declaration đổi, `IconShowcase.vue` khai "8" thực có 7,
    `TokensShowcase.vue` khai "6" thực có 4) — chỉ là commit message không
    chính xác 100% về số đếm, bản thân code diff đều đúng/an toàn, không cần
    sửa lại.
  - **Spot-check `CrudTableView.vue` judgment call**: đọc `<script setup>`
    dòng 165 (`densityMap: Record<Density,...>`) + dòng 203-204 (`:style`
    bind `'--demo-cell-pad': densityMap[density].td` / `'--demo-head-pad':
    densityMap[density].th`) — xác nhận `padding: var(--demo-head-pad, 12px
    16px)` (dòng 326-327) đúng là fallback cho 1 CSS custom property được
    JS density-toggle điều khiển qua `:style`, không phải static token —
    reasoning của Dev A đúng, để nguyên là hợp lý.
  - **PRIORITY ITEM — điều tra `BaseDataGrid.vue` undefined-var**: đọc toàn
    bộ file (`<script setup>` + `<template>` + `<style scoped>`), xác nhận
    **KHÔNG có** `:style` binding hay khai báo cục bộ nào định nghĩa 14 var
    bị nghi ngờ (khác hẳn case false-positive `--wx-card-accent` của
    `BaseCard.vue` ở round 5). Nhưng grep tiếp `frontend/src/style.css` phát
    hiện **toàn bộ 14 tên var đều được định nghĩa thật** trong 1 khối
    `:root` "short-name alias" (dòng 20-92 của `style.css`, phần header file
    tự mô tả "Short-name aliases (--brand-primary → --wx-brand-primary)") —
    ví dụ `--bg-primary: var(--wx-surface-base)`, `--text-tertiary:
    var(--wx-text-muted)`, `--hover-bg: var(--wx-hover-bg)`, v.v. Xác nhận
    `style.css` được `lib.ts:16` import thẳng vào bundle thư viện (cùng
    `ui-system/foundations/index.css`), và grep trực tiếp
    `dist-lib/ui.css` đã build xác nhận `--bg-primary`,
    `--font-size-small`, `--warning-color` đều CÓ MẶT thật trong CSS output
    đã ship. **KẾT LUẬN: FALSE POSITIVE cho bug-class "undefined var"
    (wave 1-8)** — cả 14 var đều resolve đúng cho bất kỳ consumer nào theo
    đúng usage đã document (`import '@wemake/ui/style.css'`), KHÔNG bị
    silently-dropped như các bug thật trước đây. Tuy nhiên có 1 finding
    thật (nhẹ hơn) đáng ghi backlog: (1) đây là component duy nhất trong
    `components/common/*`/`components/data/*` dùng lớp "short-name alias"
    thay vì `--wx-*` trực tiếp như mọi sibling khác — nợ kỹ thuật/naming-
    consistency, không phải bug hiển thị; (2) trong 14 alias, 13 cái map
    1:1 sạch sang đúng token `--wx-*` tương ứng qua chính bảng alias của
    `style.css`, nhưng `--warning-color` lại map sang **literal `#ff8000`**
    (không phải `var(--wx-warning-solid)` = `#f59e0b`) — 2 màu cam khác
    nhau thật sự, nghĩa là `.dot-cp` (chấm trạng thái "Checkpoint") của
    `BaseDataGrid` lệch màu nhẹ so với token warning chuẩn của hệ thống —
    đây là bug thật nhưng nằm trong chính `style.css` (dòng 31, pre-existing,
    không phải do Dev B hay round này gây ra, ảnh hưởng bất kỳ ai dùng
    `var(--warning-color)`/`--btn-add-color` khác chứ không riêng
    `BaseDataGrid`) — ngoài phạm vi sửa 1-pass an toàn của round này. Vì
    không phải cả 14/14 var đều có mapping 1:1 "an toàn tuyệt đối" (13/14
    an toàn, 1/14 — `--warning-color` — đổi tên sẽ đổi giá trị hiển thị
    thật), QA **KHÔNG tự fix** theo đúng điều kiện đề bài ("all 14 vars have
    an obvious 1:1 mapping" mới được tự sửa) — ghi backlog chi tiết cho
    round 12 (xem dưới). Kiểm tra thêm mức độ ảnh hưởng: `BaseDataGrid` là
    public API thật (export ở `components/common/index.ts` dòng 2 +
    `dist-lib/wemake-ui.es.js` dòng 11372), nhưng usage trong app demo ít
    hơn hẳn `DataGridPro` — `BaseDataGrid` chỉ dùng ở 3 file
    (`views/showcase/data/KanbanView.vue`, `views/wemakeui/AdminView.vue`,
    `views/ShowcaseView.vue`) so với `DataGridPro` dùng ở 9 file — xác nhận
    `DataGridPro` là grid được ưu tiên dùng thực tế, `BaseDataGrid` vẫn
    active nhưng vai trò phụ hơn.
  - **Dev B classification spot-check**: đọc `tokens.css` xác nhận
    `--wx-border-focus`(dòng 69)/`--wx-shadow-focus`(dòng 151)/
    `--wx-brand-focus`(dòng 20) đều tồn tại thật; rgba trong
    `BaseCheckbox.vue` cũ (`rgba(0,123,255,.25)`) khớp chính xác same-value
    với `--wx-shadow-focus: 0 0 0 3px rgba(0, 123, 255, 0.25)` — xác nhận
    numerically identical. Đọc `BasePagination.vue`/`CommandPalette.vue`
    context đầy đủ (không chỉ diff hunk): rule `:focus-visible` mới đặt
    ngay sau rule base tương ứng, không có rule nào phía sau ghi đè lại
    (`.wx-pagination__loadmore:focus-visible` dòng 206-209, không bị
    `:disabled` hay rule khác che; `.wx-cmdk__input:focus-visible` dòng
    236-239 tương tự) — reachable thật, không bị shadow bởi specificity/
    thứ tự CSS. `BaseDataGrid.vue .datagrid-wrapper:focus-visible` (dòng
    288) đặt ngay sau `:focus{outline:none}` — đúng, không xung đột. Đọc
    template `BaseDrawer.vue` xác nhận `tabindex="-1"` (dòng 102) +
    `panelRef.value?.focus()` (script dòng 68) thật; `ContextMenu.vue`
    xác nhận `tabindex="-1"` (dòng 139) + `nextTick(() =>
    menuRef.value?.focus())` (script dòng 34) thật — cả 2 comment loại (b)
    đều đúng như khai báo, không phải bịa lý do.
  - **Dark-mode coverage của focus token (mục 6)**: `--wx-border-focus` có
    override dark-mode.css dòng 38 (`#60a5fa`); `--wx-brand-focus` có
    override dòng 15 (`#3b82f6`). Nhưng **`--wx-shadow-focus` KHÔNG có
    override nào trong `dark-mode.css`/`flat-mode.css`** — vẫn giữ nguyên
    `rgba(0, 123, 255, 0.25)` (xanh dương sáng) trên cả nền tối, có thể
    giảm độ tương phản/độ rõ ring trên dark surface so với việc đổi theo
    `--wx-border-focus`. Đây KHÔNG phải bug mới của round 11 — grep toàn
    repo xác nhận `--wx-shadow-focus` đã được dùng ở **11 file** từ trước
    (bao gồm `focus.css` — chính baseline contract của hệy thống,
    `interactive.css`, `BaseTextarea.vue`, `DataGridPro.vue`, `style.css`,
    `ProfileEditView.vue`, `ContactView.vue`), Dev B chỉ thêm 3 usage mới
    theo đúng pattern đã có sẵn toàn hệ thống — đây là **finding hệ thống
    tồn tại từ trước**, không phải riêng round này, nhưng đáng ghi backlog
    vì phạm vi sửa rộng (11+ file, cả `focus.css` gốc) nên không tự sửa ở
    QA pass này.
  - **New-hardcode check**: grep dòng `+` cả 2 commit cho hex/rgba/px ngoài
    `var(--wx-...)` → **0 kết quả cả 2 commit** — không có hardcode mới.
  - **API safety**: đối chiếu hunk header với vị trí `<style scoped>` từng
    file — 100% hunk cả 2 commit nằm trong `<style scoped>`, không đụng
    `<script setup>`/`<template>`, không đổi prop/emit/slot/class nào,
    `lib.ts` không đổi. Tất cả component trong 2 commit đều là public
    dist-lib API, xác nhận an toàn.
  - Không tìm thấy vấn đề nhỏ cần follow-up fix trong phạm vi round 11 (issue
    lớn nhất — BaseDataGrid — đã xác định KHÔNG phải bug thật ở mức severity
    cần fix gấp, và điều kiện "tự sửa" (14/14 var an toàn 1:1) không đạt nên
    đúng theo luật phải log backlog thay vì tự sửa). **ROUND 11 QA: PASS**,
    không có follow-up commit.
- **MILESTONE — Mục A (spacing sweep) coi như CLOSED cho toàn bộ
  `views/showcase/*`** sau 3 round liên tiếp (9, 10, 11) xử lý cluster này.
  Chỉ còn 2 exception đã biết rõ lý do (scroll-anchor `AppTemplatesView.vue`,
  inline-style-only `RevealTest.vue`), không cần đụng lại trừ khi thiết kế
  đổi.
- Backlog cho round 12:
  - **Mục A** — còn `views/marketing/*` (7 hit), `views/forms/*` (21 hit —
    cluster lớn nhất còn lại), `views/saas/*` (2 hit), `views/auth/*` (4
    hit) — đếm bằng grep thô pattern grid-match, CẦN đọc kỹ từng multi-value
    shorthand trước khi convert (không convert máy móc theo số đếm).
  - **BaseDataGrid.vue non-`--wx-*` var scheme — verdict: FALSE POSITIVE
    cho bug-class "undefined var" (KHÔNG cùng severity wave 1-8)**, nhưng
    vẫn là naming-consistency debt đáng dọn — **priority TRUNG BÌNH** (không
    phải "TOP PRIORITY bug thật" như nghi ngờ ban đầu của Dev B, vì code
    hiện tại đã hoạt động đúng, không có gì bị vỡ). Nếu round 12 muốn xử lý,
    mapping khuyến nghị (verify qua chính bảng alias `style.css:20-92`):
    - `var(--bg-primary)` (dòng 286, 290) → `var(--wx-surface-base)`
    - `var(--font-size-small, 12px)` (290) → `var(--wx-fs-12)`
    - `var(--text-tertiary)` (293, 300, 307, 355) → `var(--wx-text-muted)`
    - `var(--bg-tertiary)` (293, 340×2) → `var(--wx-surface-sunken)`
    - `var(--border-color)` (293, 294) → `var(--wx-border-default)`
    - `var(--text-secondary)` (294) → `var(--wx-text-secondary)`
    - `var(--hover-bg)` (295, 310) → `var(--wx-hover-bg)`
    - `var(--brand-primary)` (297, 310, 315, 328) → `var(--wx-brand-primary)`
    - `var(--success-color)` (303, 306) → `var(--wx-success-solid)`
    - `var(--error-color)` (304) → `var(--wx-danger-solid)`
    - `var(--active-bg)` (309) → `var(--wx-active-bg)`
    - `var(--text-primary)` (314) → `var(--wx-text-primary)`
    - `var(--bg-secondary)` (340) → `var(--wx-surface-elevated)`
    - `var(--warning-color)` (305, `.dot-cp`) → **CẨN THẬN**: `style.css`
      map var này sang literal `#ff8000`, KHÔNG phải `var(--wx-warning-
      solid)` (`#f59e0b`) — đổi thẳng sang `var(--wx-warning-solid)` sẽ ĐỔI
      màu hiển thị thật (cam→hổ phách), không phải chỉ đổi tên. Cần quyết
      định rõ: (a) giữ nguyên `var(--warning-color)` (không đổi gì, an
      toàn tuyệt đối), hoặc (b) coi đây là dịp sửa luôn phát hiện phụ —
      `style.css` dòng 31 `--warning-color: #ff8000` nên đổi thành
      `var(--wx-warning-solid)` để nhất quán token (nhưng đây là sửa
      `style.css` dùng chung toàn app, ảnh hưởng rộng hơn 1 component,
      cần round riêng đánh giá kỹ, KHÔNG gộp chung với migration
      `BaseDataGrid.vue`).
    - Dòng số liệu trên tính theo bản `BaseDataGrid.vue` SAU round 11 (đã
      có thêm 1 dòng `:focus-visible` của Dev B ở dòng 288), verify lại số
      dòng chính xác trước khi patch vì có thể lệch nếu file đổi thêm.
  - **`--wx-shadow-focus` thiếu dark-mode.css override** — finding hệ
    thống (11+ file dùng, bao gồm `focus.css` gốc), không phải bug mới
    round 11, độ ưu tiên thấp/trung bình (không phải "vỡ hẳn", chỉ giảm
    contrast tiềm năng trên dark surface) — cân nhắc thêm 1 override
    `rgba(96, 165, 250, 0.25)` (khớp tông `--wx-border-focus` dark
    `#60a5fa`) vào `dark-mode.css` nếu round 12/D muốn đóng dứt điểm mục D
    accessibility.
  - **Mục D (GLOBAL AUDIT — accessibility/focus-visible)** — round 11 mới xử
    lý xong `components/**`+`archetypes/**` (6 file). Còn nguyên danh sách
    view-level `outline:none` Dev B đã compile cho round 12:
    `views/app/ProfileEditView.vue:93` (đã có border-color +
    box-shadow var(--wx-shadow-focus) replacement — khả năng đã ổn, cần xác
    nhận không phải fix), `views/auth/OtpView.vue:164`,
    `views/forms/{FloatingLabelsView.vue:101,182,InputGroupView.vue:119,175}`,
    `views/landing/ContactView.vue:99` (tương tự ProfileEditView — có vẻ đã
    ổn, cần xác nhận), `views/showcase/{PatternShowcase.vue:397,
    PlatformShowcase.vue:446,TemplateGallery.vue:473}`.
  - **Mục C** — vẫn 1 follow-up mở, ưu tiên thấp: `WeDashboardV1View.vue`
    `.env-dot` (không đổi gì round này).
  - Mục B — vẫn **CLOSED** (không có phát hiện mới nào làm thay đổi căn cứ
    decline).

### Round 12 (2026-09-02)
- Bối cảnh: PLAN + Dev A/B của round này đã chạy trước hai commit độc lập,
  Dev C (agent này) chỉ chạy QA theo checklist có sẵn — không chạy lại PLAN.
- Dev A commit `b853844`: 14 file (`views/auth/{LoginV3View,OnboardingView,
  OtpView}.vue`, `views/forms/{AddModalFormView,ChecksView,DrawerFormView,
  EditModalFormView,FileUploadView,FloatingLabelsView,FormControlView,
  InputGroupView,SelectView,ValidationView,WizardView}.vue`) — tiếp tục mục A:
  convert padding/margin/gap khớp chính xác lưới 4pt sang `var(--wx-space-*)`
  (53 dòng đổi), cộng 1 bug thật: `OtpView.vue` `.otp-cell:focus` box-shadow
  đổi từ hardcoded `rgba(37, 99, 235, 0.15)` sang `color-mix(in srgb,
  var(--wx-brand-primary) 18%, transparent)` khớp đúng pattern đã có ở
  `FloatingLabelsView`/`InputGroupView`.
- Dev B commit `52a7ddb`: 11 file (`style.css` + `views/marketing/{HomeView,
  PartnersView,ProductsView}.vue` + `views/saas/{DashboardView,MembersView,
  SettingsView,StatisticsView,VersionsView}.vue` + `views/showcase/
  {PatternShowcase,PlatformShowcase}.vue`) — tiếp tục mục A cho marketing/saas
  (15 dòng đổi, tôn trọng đúng exclusion `padding-top: 64px` trên
  `.home`/`.partners-page`/`.products-page`), cộng 2 việc: (1) fix bug thật
  `style.css` dòng 28 `--warning-color: #ff8000` (literal, lệch token) →
  `var(--wx-warning-solid)` (`#f59e0b`, đúng token warning chuẩn); (2) 2 rule
  `:focus-visible`/`:focus` mới (`PlatformShowcase.vue .palette__input`,
  `PatternShowcase.vue .bio-input`) thêm `box-shadow: var(--wx-shadow-focus)`
  cho input trước đó `outline:none`/`border:none` không có thay thế focus
  visible nào — tiếp nối mục D (accessibility) từ round 11.
- Dev C QA (agent này) — verify toàn bộ checklist trước khi accept:
  - **Build gate 3/3 PASS**: `typecheck` sạch (exit 0). `build:lib` 18.04s
    (`ui.css` 234.70kB, `es.js` 415.90kB, `umd.js` 325.52kB, dts OK).
    `build:app` 9.65s, mọi chunk build OK, exit 0.
  - `git show --stat` xác nhận đúng 14 file (Dev A) + 11 file (Dev B), 0
    overlap, không đụng `tokens.css`/`dark-mode.css`/`flat-mode.css`/`lib.ts`.
    `style.css` trong diff Dev B xác nhận **đúng 1 dòng** thay đổi (dòng 28
    `--warning-color`), không có gì khác trong file foundation dùng chung bị
    đụng tới.
  - **Dev A regression re-check**: đọc TOÀN BỘ diff cả 14 file — 0 chỗ đổi
    `font-size`/`width`/`height`/`border-radius`/`grid-template-columns`.
    Đối chiếu thang `--wx-space-*` thật trong `tokens.css`
    (1=4,2=8,3=12,4=16,5=24,6=32,7=40,8=48,9=64,10=80,11=96,12=128px) — mọi
    conversion đều khớp chính xác (kể cả case tinh vi: `LoginV3View.vue`
    `padding: var(--wx-space-3) 20px` — 12px→space-3 đúng, 20px giữ literal
    đúng vì thang nhảy thẳng 16→24, không có token khớp 20px, giống hệt case
    fs-11 round 8). Giá trị lẻ (2/3/6/10/14/20px) đều giữ nguyên literal ở
    mọi file. Đọc trực tiếp `FloatingLabelsView.vue` (dòng 81-131) và
    `InputGroupView.vue` (dòng 93-121) xác nhận **claim `<pre>` đúng**: cả 2
    file có block `<pre>` doc-sample (HTML-escaped) chứa `padding: 20px 12px
    8px;`/`padding: 0 12px;`/`padding: 8px 12px;` dạng literal — hoàn toàn
    không bị đụng, còn CSS sống thật ở `<style scoped>` (dòng 175 và 155/168)
    đã được convert đúng sang `var(--wx-space-*)`.
  - **OtpView.vue focus-ring**: đọc file, xác nhận
    `box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-brand-primary) 18%,
    transparent);` — cú pháp hợp lệ, khớp 100% với pattern đã dùng ở
    `FloatingLabelsView.vue`/`InputGroupView.vue`/`SelectView.vue`
    (cùng 18% mix).
  - **Dev B regression re-check**: đọc diff, 0 chỗ đổi font-size/width/
    height/border-radius. Grep trực tiếp `padding-top: 64px` trên
    `HomeView.vue`/`PartnersView.vue`/`ProductsView.vue` — xác nhận vẫn
    **literal, chưa bị convert** (đúng như claim, cố ý exclude).
  - **style.css blast radius (quan trọng nhất)**: grep toàn repo
    `var(--warning-color)` — xác nhận đúng **2 consumer**:
    `BaseDataGrid.vue:305 .dot-cp` và `BaseProgress.vue:71
    .base-progress__fill--warning`, không có consumer thứ 3 nào bị Dev B bỏ
    sót. Grep `--btn-add-color` — xác nhận **0 consumer** (chỉ có dòng khai
    báo `style.css:37`), để nguyên là đúng. Đọc trực tiếp
    `dist-lib/ui.css` đã build: `--warning-color: var(--wx-warning-solid);`
    và `--wx-warning-solid: #f59e0b;` — xác nhận **giá trị cuối cùng đã
    resolve đúng `#f59e0b`, không còn `#ff8000`** trong bundle ship thật.
  - **Focus-visible rules reachability**: đọc `tokens.css` xác nhận
    `--wx-shadow-focus`(dòng 151)/`--wx-border-focus`(dòng 69)/
    `--wx-radius-sm`(dòng 134) đều tồn tại thật. Đọc context đầy đủ
    `PatternShowcase.vue` dòng 396-400 (`.bio-input:focus` thêm box-shadow
    ngay sau border-color, không bị rule nào che) và `PlatformShowcase.vue`
    dòng 441-454 (`.palette__input` trước đó `border:none; outline:none`
    không có thay thế — `:focus-visible` mới thêm ngay sau, reachable, không
    xung đột) — cả 2 đúng như khai báo.
  - **New-hardcode check**: grep dòng `+` cả 2 commit cho hex/rgba/px ngoài
    `var(--wx-...)` → **0 kết quả cả 2 commit** (Dev B chỉ thêm
    `var(--wx-shadow-focus)`/`var(--wx-radius-sm)`, không có hex/rgba/px
    mới). **API safety**: 100% hunk nằm trong `<style scoped>` (trừ 5 chỗ
    inline `style="margin-left:8px"`→`style="margin-left:var(--wx-space-2)"`
    trong `<template>` của Dev A — chỉ đổi giá trị attribute, không đổi
    prop/emit/slot/class nào), `lib.ts` không đổi.
  - **Residual re-grep mục A** (`views/{forms,auth,marketing,saas}`, pattern
    grid-match): phát hiện **1 miss thật** — `EditModalFormView.vue:156`,
    icon SVG nút "Xóa sản phẩm" có `style="margin-right:4px"` inline nằm
    trong `<template>` sống (không phải `<pre>` doc-sample) mà cả Dev A lẫn
    Dev B đều bỏ sót, khớp chính xác lưới 4pt. Đã **tự sửa + commit follow-up
    `1b687d2`** → `var(--wx-space-1)` (đúng convention đã dùng ở
    `AppSidebar.vue`, `.legend-dot-gap` các view dashboard, `AdminView.vue`).
    Re-verify sau fix: `typecheck` + `build:lib` PASS. Re-grep lại
    `views/{forms,auth,marketing,saas}` sau fix — chỉ còn đúng các exception
    đã biết: `padding-top: 64px` trên 6 file marketing (`ContactView`,
    `FAQView`, `HomeView`, `PartnersView`, `ProductDetailView`,
    `ProductsView` — cố ý, header-compensation) và 3 `<pre>` doc-sample
    (`FileUploadView.vue:180`, `FloatingLabelsView.vue:95`,
    `InputGroupView.vue:103,114`). **ROUND 12 QA: PASS WITH FOLLOW-UP COMMIT
    `1b687d2`**.
- **Đánh giá milestone mục A — KHÔNG đóng repo-wide** (khác với suy đoán ban
  đầu trong backlog round 11 rằng đây "có thể là milestone lớn thứ 2"): QA
  chủ động chạy grep pattern grid-match **trên toàn bộ `frontend/src`**
  (không chỉ 4 nhóm được giao round này) để trả lời đúng câu hỏi "đã đóng
  repo-wide chưa" — kết quả: **vẫn còn 313 lượt khớp trên >100 file `.vue`**
  ngoài phạm vi 4 nhóm vừa xử lý. Breakdown theo cụm lớn nhất (toàn bộ chưa
  từng được mục A đụng tới, kể cả những khu vực tưởng đã "closed" cho bug
  khác):
  - `views/docs/**` — **25/25 file** có hit (toàn bộ trang doc, kể cả
    `DocsLayout.vue`, `_components/{CodeBlock,DemoBlock,DocPage}.vue` và 21
    file `views/docs/components/*Doc.vue`) — **chưa từng được mục A đụng
    tới, cụm lớn nhất còn lại**.
  - `components/common/**` — **24/24 file** có hit (toàn bộ base component:
    `BaseButton`, `BaseInput`, `BaseModal`, `BaseBadge`, `FormField`, v.v.) —
    quan trọng: round 5 đã "CLOSE" thư mục này nhưng là cho bug KHÁC
    (undefined-CSS-var wave 3), KHÔNG phải mục A (spacing sweep) — mục A
    thực ra **chưa bao giờ chạy qua `components/common/**`**. Đây là public
    API của lib (export `lib.ts`), ưu tiên cao nếu round sau muốn tiếp tục
    mục A.
  - `components/wemakeui/**` — **10/10 file** có hit (toàn bộ `WC*`/`WM*`
    modal/bar component).
  - `components/data/**` — **9/9 file** có hit (`DataGridPro`, `Kanban`,
    `Timeline`, `FilterBuilder`, v.v.).
  - `components/charts/**` — **6/6 file** có hit (`AreaChart`, `BarChart`,
    `DonutChart`, `LineChart`, `PieChart`, `Heatmap`).
  - Cụm nhỏ hơn, rải rác: `components/async/*` (3 file), `components/
    feedback/*` (2 file), `components/platform/WindowControls.vue` (1),
    `components/permission/PermissionGate.vue` (1),
    `components/layout/PageHeader.vue` (1), `views/error/*` (2 file),
    `views/landing/PolicyView.vue` (1), `views/home/LandingView.vue` (1 —
    còn sót lại sau round 3), `views/dashboard/WeDashboardV1View.vue` (1 —
    liên quan `.env-dot`, xem mục C), `archetypes/dashboard/
    DashboardAnalytics.vue:265` (`padding: 2px 8px` — 1 phần khớp,
    `DashboardHero.vue:101` inline `style="...padding: 0 4px"`),
    `archetypes/marketing/CaseStudyGrid.vue` (2: `padding: 80px
    var(--wx-space-6)` dòng 101 — cần xem có phải hero-band cố ý như
    `MarketingHero`/`TechGrid` không; `margin-bottom: 4px` dòng 165),
    `archetypes/marketing/TechGrid.vue:50` (`padding: 80px var(--wx-space-6)`
    — cùng câu hỏi).
  - Đã verify (không phải bug/không cần sửa): `views/showcase/**` (5 file,
    12 hit — toàn bộ đã biết rõ lý do: `AppTemplatesView.vue` scroll-margin,
    `charts/IndexView.vue`/`data/CrudTableView.vue` fallback của CSS var
    được JS `:style` điều khiển, `OverviewView.vue` negative margin,
    `RevealTest.vue` không có `<style scoped>` — tất cả đúng theo quyết định
    round 9-11, không phải phát hiện mới); `views/marketing/**` (6 hit — cả
    6 `padding-top: 64px` đã biết, cố ý); `style.css`/`ui-system/foundations/
    {tokens.css,responsive.css}`/`ui-system/tokens/scales.ts` — đây là file
    ĐỊNH NGHĨA token/scale gốc, giá trị px trong đó là nguồn, không phải
    "hardcode cần fix" theo đúng luật ở mục 3.
  - **Kết luận chính thức: mục A CHƯA đóng repo-wide.** 4 nhóm được giao
    round 12 (`views/forms/*`, `views/auth/*`, `views/marketing/*` phần
    spacing, `views/saas/*`) coi như xong, nhưng còn nguyên 1 backlog rất
    lớn (313 hit, tập trung nặng ở `components/**` và `views/docs/**`) chưa
    từng được quét — quy mô tương đương hoặc lớn hơn cả cụm `views/showcase`
    đã mất 3 round (9-11) để xử lý xong. KHÔNG coi đây là milestone đóng mục
    A — ngược lại, đây là phát hiện mở rộng phạm vi mục A đáng kể cho các
    round sau.
- Backlog cho round 13:
  - **Mục A** — backlog mới, ưu tiên theo thứ tự: (1) `components/common/**`
    (24 file, public API lib.ts, ưu tiên cao nhất); (2) `views/docs/**` (25
    file, cụm lớn nhất về số lượng nhưng demo-only, không phải public API);
    (3) `components/wemakeui/**` (10 file) + `components/data/**` (9 file)
    + `components/charts/**` (6 file); (4) cụm nhỏ rải rác (`components/
    {async,feedback,platform,permission,layout}/*`, `views/{error,landing}/*`,
    `views/home/LandingView.vue` còn sót, `archetypes/dashboard/
    DashboardAnalytics.vue`+`DashboardHero.vue`, `archetypes/marketing/
    {CaseStudyGrid,TechGrid}.vue` — 2 file archetype/marketing cần đọc kỹ
    xem `padding: 80px ...` có phải hero-band cố ý giống `MarketingHero`
    120px không trước khi convert). Nhắc lại rule: không convert máy móc
    theo số đếm grep thô, đọc kỹ từng multi-value shorthand; `--wx-fs-11`
    KHÔNG tồn tại (đừng nhầm với mục A); giá trị không khớp thang
    `--wx-space-*` thật (1=4,2=8,3=12,4=16,5=24,6=32,7=40,8=48,9=64,10=80,
    11=96,12=128 — chú ý 20px KHÔNG có token khớp, giống case round 12) để
    nguyên literal.
  - **BaseDataGrid.vue non-`--wx-*` var scheme** — vẫn priority TRUNG BÌNH
    (xem chi tiết mapping ở backlog round 11), nhưng giờ **an toàn tuyệt đối
    để tự sửa cả 14/14 var** vì `--warning-color` divergence đã được Dev B
    round này fix tận gốc ở `style.css` — không còn rào cản "1/14 sẽ đổi màu
    hiển thị thật" như round 11 note. Đây là ứng viên tốt cho round 13 nếu
    PLAN muốn kết hợp với mục A (cùng file, cùng tinh thần tokenize).
  - **`--wx-shadow-focus` thiếu dark-mode.css override** — vẫn mở, 11+ file
    dùng (bao gồm `focus.css` gốc), độ ưu tiên trung bình — đáng dành 1 round
    riêng vì giờ là fix 1-token, phạm vi rộng nhưng nông (thêm 1 dòng override
    `rgba(96, 165, 250, 0.25)` khớp tông `--wx-border-focus` dark `#60a5fa`
    vào `dark-mode.css`), đóng dứt điểm được cả nhánh accessibility/
    focus-visible của mục D.
  - **Mục D (GLOBAL AUDIT)** — accessibility/focus-visible đang thu hẹp dần
    (round 11 xử lý `components/**`+`archetypes/**`, round 12 xử lý thêm 2
    site view-level). Còn lại: `views/forms/{FloatingLabelsView.vue:101,182,
    InputGroupView.vue:119,175}`, `views/showcase/TemplateGallery.vue:473`
    (chưa xử lý); `views/auth/OtpView.vue:164` — ĐÃ xử lý (Dev A round này,
    xem trên); `views/app/ProfileEditView.vue:93`/`views/landing/
    ContactView.vue:99` — cần xác nhận lại có phải đã ổn sẵn (case (a) loại
    "đã có replacement thật") hay vẫn cần fix, round 11 note chưa chốt. Với
    nhánh accessibility/focus-visible sắp cạn, PLAN round 13+ nên cân nhắc mở
    rộng mục D sang category khác trong §4.D (2 — spacing/radius/màu
    inconsistent, 6 — responsive breakpoints, 7 — empty/loading/error states)
    thay vì tiếp tục dồn hết vào accessibility.
  - **Mục C** — vẫn 1 follow-up mở, ưu tiên thấp: `WeDashboardV1View.vue`
    `.env-dot` (không đổi gì round này).
  - Mục B — vẫn **CLOSED** (không có phát hiện mới nào làm thay đổi căn cứ
    decline).

### Round 13 (2026-09-02)
- Bối cảnh: PLAN + Dev A/B của round này đã chạy trước — Dev B commit
  `649155b` "refactor: tokenize 4pt spacing in remaining common components"
  (17 file), Dev A commit `de9c197` "refactor: tokenize 4pt spacing in core
  common components" (6 file), cả 2 đúng backlog round 12 ưu tiên #1
  (`components/common/**`, 24 file, public API `lib.ts`). Cả 2 dev báo có
  git race condition khi `git add`/`git commit` chạy gần đồng thời — 1 commit
  tạm quét nhầm file chưa commit của dev kia, cả 2 tự phát hiện và
  `git reset --soft`/`git restore --staged` rồi re-commit đúng pathspec. Dev
  C (agent này) chỉ chạy QA theo checklist có sẵn — không chạy lại PLAN,
  nhiệm vụ đầu tiên là verify độc lập race-condition recovery thay vì tin
  self-report.
- **Verify race-condition recovery (không chỉ tin self-report)**:
  `git reflog` xác nhận đúng trình tự — Dev B commit lần đầu ra `311bc8d`
  (quét nhầm), `reset: moving to HEAD~1` về `7d05c65`, rồi re-commit sạch ra
  `649155b`, sau đó Dev A commit `de9c197`. `git log --all --oneline | grep
  311bc8d` → **0 kết quả** (commit không nằm trong bất kỳ ref nào, kể cả
  `--all`, chỉ còn sót lại trong reflog chờ GC) — xác nhận đúng như 2 dev báo,
  không phải orphan commit trôi nổi trong history thật. `git log
  7d05c65..de9c197 --oneline` chỉ có đúng 2 commit `649155b`+`de9c197`, không
  có commit lạ chen giữa.
- **Build gate 3/3 PASS**: `typecheck` sạch (exit 0, vue-tsc --noEmit không
  in gì); `build:lib` 15.22s (ui.css 235.76kB/gzip 34.77kB, es.js 415.90kB,
  umd.js 325.52kB, dts OK); `build:app` 8.14s (mọi chunk build OK, exit 0).
- **`git show --stat` xác nhận đúng khai báo, 0 overlap**: `649155b` đúng
  17 file (AnchorBar, BaseBadge, BaseBreadcrumb, BaseCheckbox, BaseDropdown,
  BaseInput, BaseModal, BasePagination, BaseProgress, BaseRadio, BaseTag,
  BaseTextarea, BaseToast, BaseToggle, CommandPalette, FormField, StatusBar);
  `de9c197` đúng 6 file (BaseButton, BaseDataGrid, BaseSelect, BaseSelectMenu,
  BaseTabs, ContextMenu) — không file nào xuất hiện ở cả 2 commit.
  `git status --porcelain` hoàn toàn sạch — không có file nào bị bỏ sót/mất
  trong quá trình race-condition recovery.
- **Đọc FULL diff cả 2 commit (không spot-check)**: 0 chỗ đổi
  font-size/width/height/min-height/min-width/border-radius/
  grid-template-columns/letter-spacing bất kỳ đâu — các dòng match regex do
  cùng nằm trên 1 khai báo CSS 1 dòng với padding/gap (ví dụ
  `.wx-btn--sm { padding: ...; font-size: var(--wx-fs-12); gap: ...;
  min-height: 32px; }`) đã đối chiếu từng cặp trước/sau, xác nhận riêng giá
  trị font-size/min-height không đổi, chỉ padding/gap đổi.
- **Verify cụ thể theo checklist**:
  - `BaseBadge.vue` `font-size: 11px` — cả 2 chỗ (`.base-badge` base rule và
    `.base-badge--md`) xác nhận **untouched**, chỉ padding đổi.
  - `BaseAvatarGroup.vue` — xác nhận **zero diff thật** (không xuất hiện
    trong `git show --stat` của cả 2 commit).
  - Giá trị âm: `BaseSelectMenu.vue` `margin: -4px -4px 4px` → chỉ giá trị
    dương thứ 3 đổi thành `var(--wx-space-1)`, `-4px -4px` giữ nguyên literal;
    `StatusBar.vue` `margin: -1px -4px` giữ nguyên 100%, chỉ `padding: 1px
    4px` đổi thành `padding: 1px var(--wx-space-1)`.
  - `BaseDataGrid.vue` non-`--wx-*` scheme (`--bg-primary`, `--text-tertiary`,
    `--bg-tertiary`, `--border-color`, `--text-secondary`, `--hover-bg`,
    `--brand-primary`, `--text-primary`) — xác nhận **không bị đụng**, đúng
    như commit message khai báo "out of scope this round"; chỉ 6 chỗ
    padding/margin/gap đổi (th/td padding, sort-indicator margin-left,
    loading padding, shimmer-row gap+margin-bottom).
  - Đối chiếu **toàn bộ ~37 conversion của cả 2 commit** với scale thật đọc
    trực tiếp từ `tokens.css` (space-1=4, space-2=8, space-3=12, space-4=16,
    space-5=24, space-6=32, space-7=40, space-8=48, space-9=64, space-10=80,
    space-11=96, space-12=128px) — **100% khớp đúng**, không có case ép sai
    thang (kể cả các giá trị lẻ giữ nguyên literal đúng: 20px `.modal-footer`,
    28px `.wx-btn--xl`, 10px/14px/6px/9px các chỗ khác — không bị ép).
  - New-hardcode check: grep dòng `+` cả 2 commit cho hex/rgba → **0 kết
    quả cả 2 commit**.
  - API safety: đọc toàn bộ hunk context (`@@` line) — 100% nằm trong
    `<style scoped>`/`<style>` (không hunk nào thuộc `<script setup>` hay
    `<template>`), 0 rename prop/emit/slot/class-name. `BaseInput.vue` —
    xác nhận diff commit thật (2 hunk: `.base-input` gap, `.base-input__field`
    padding) đúng là CSS-only dù có system note "recently modified on disk";
    `git status --porcelain` sạch xác nhận không còn thay đổi chưa commit
    nào trên file này.
  - **Phát hiện phụ (không phải bug)**: `BaseSelectMenu.vue` và
    `BaseSelect.vue` mỗi file có **2 khối `<style>`** — 1 `<style scoped>`
    chính và 1 `<style>` không scoped riêng cho menu teleport-ra-ngoài (có
    comment sẵn trong code `<!-- Teleported menu — global (not scoped) -->`
    ở `BaseSelectMenu.vue`) — đây là kiến trúc có sẵn từ trước (Vue Teleport
    khiến `scoped` CSS không áp dụng được cho DOM bị teleport ra ngoài cây
    component), không phải Dev A tạo mới hay vi phạm rule. Vài hunk của
    `de9c197` rơi vào khối `<style>` không-scoped này (`.bsm__menu`,
    `.bsm__option`, `.base-select__menu`, `.base-select__option` padding/gap)
    — vẫn 100% CSS-only, không ảnh hưởng API safety, chỉ ghi nhận lại cho rõ.
  - Re-grep độc lập `components/common/**` (44 file, không có subdirectory)
    bằng pattern grid-match — chỉ còn đúng 3 hit, cả 3 đều là giá trị **âm**
    đã biết trước (`BaseAvatarGroup.vue:52,64` `margin-left: -8px`,
    `BaseSelectMenu.vue:539` `margin: -4px -4px var(--wx-space-1)` — phần âm
    giữ nguyên, `StatusBar.vue:108` `margin: -1px -4px` — giữ nguyên) — **0
    positive/off-grid remnant nào còn sót**.
- **Kết luận: `components/common/**` (24/24 file) chính thức CLOSED cho
  mục A** — toàn bộ 24 file (18 file round 5 xử lý bug undefined-CSS-var
  khác + 6 file round 13 mới đụng spacing lần đầu, cộng với 17 file round 13
  Dev B) nay đã qua ít nhất 1 lượt spacing-sweep sạch, không còn giá trị
  dương khớp lưới 4pt nào chưa tokenize. Đây là public API quan trọng nhất
  của `dist-lib/` — milestone lớn cho mục A.
- **ROUND 13 QA: PASS**, không cần follow-up commit — mọi hạng mục checklist
  đều đạt ngay từ commit gốc của Dev A/B, không tìm thấy lỗi nhỏ nào cần tự
  sửa.
- Backlog cho round 14 (theo đúng thứ tự PLAN round 13 đã flag):
  1. **Mục A** — `views/docs/**` (25 file, cụm lớn nhất còn lại về số lượng,
     nhưng demo/doc-only, không phải public API — ưu tiên sau
     `components/**`); `components/data/**` (9 file, `DataGridPro.vue`
     ~19 hit — nặng nhất); `components/wemakeui/**` (10 file); `components/
     charts/**` (6 file); cụm nhỏ rải rác `components/{async,feedback,
     platform,permission,layout}/*`. Nhắc lại rule: `--wx-fs-11` KHÔNG tồn
     tại (khác mục), giá trị không khớp thang space thật để nguyên literal,
     đọc kỹ multi-value shorthand trước khi convert (giống case
     `BaseSelectMenu`/`StatusBar` round này — chỉ convert đúng phần khớp
     lưới, giữ nguyên phần âm/lẻ).
  2. **2 file archetype marketing** `CaseStudyGrid.vue:101` và
     `TechGrid.vue:50` — cả 2 đều `padding: 80px var(--wx-space-6);` (đã xác
     nhận qua grep round này) — cần đọc kỹ xem có phải hero-band cố ý giống
     `MarketingHero.vue` 120px (round 3, giữ nguyên) hay nên convert 80px→
     `var(--wx-space-10)` (khớp thang thật) trước khi quyết định.
  3. **`BaseDataGrid.vue` 14-biến non-`--wx-*` alias scheme** (`--bg-primary`,
     `--text-tertiary`, `--bg-tertiary`, `--border-color`, `--text-secondary`,
     `--hover-bg`, `--brand-primary`, `--text-primary`, v.v.) — nợ đặt tên,
     không phải bug (đã an toàn để sửa từ round 12 sau khi `--warning-color`
     divergence được fix tận gốc), vẫn priority TRUNG BÌNH.
  4. **`--wx-shadow-focus` thiếu dark-mode.css override** — vẫn mở, system-
     wide, ưu tiên trung bình, chưa ai đụng kể từ round 11.
  5. Mục C — vẫn 1 follow-up mở, ưu tiên thấp: `WeDashboardV1View.vue`
     `.env-dot` (không đổi gì round này).
  6. Mục B — vẫn **CLOSED** (không có phát hiện mới).

### Round 14 (2026-09-02)
- Bối cảnh: PLAN + Dev A/B của round này đã chạy trước — Dev A commit
  `96ae364` "refactor: tokenize 4pt spacing in data & chart components" (15
  file: `components/data/**` 9 file + `components/charts/**` 6 file, 96
  conversion), Dev B commit `d41e251` "refactor: tokenize 4pt spacing in
  wemakeui/async/feedback components + add dark --wx-shadow-focus" (21 file:
  18 file `components/{async,feedback,wemakeui,layout,permission,
  platform}/*` + 2 file archetype (`CaseStudyGrid.vue`/`TechGrid.vue`
  80px→`var(--wx-space-10)`) + `dark-mode.css` thêm 1 dòng
  `--wx-shadow-focus`). Cả 2 hạng mục đúng backlog #1/#2/#4 round 13 đã flag.
  Dev B báo `build:lib` fail 1 lần với lỗi nội bộ `vite-plugin-dts` liên
  quan `directives/v-can.d.ts` (file Dev B chưa từng đụng), retry ngay lập
  tức pass sạch không đổi code — nghi flake giống round 10. Dev C (agent
  này) chạy QA theo checklist có sẵn, không chạy lại PLAN.
- **Build gate**: `typecheck` sạch (exit 0). `build:lib` chạy **2 lần liên
  tiếp** để verify claim flake (giống cách round 10 làm) — cả 2 lần đều PASS
  sạch, không tái hiện lỗi `v-can.d.ts`: lần 1 20.07s (ui.css 237.29kB/gzip
  34.77kB, es.js 415.90kB, umd.js 325.52kB, dts OK 18.02s), lần 2 20.60s
  (kết quả kích thước giống hệt lần 1, dts 18.34s) — xác nhận nhất quán với
  kết luận "flake thoáng qua", không phải lỗi tái lập được, nhưng cũng không
  chứng minh được nguyên nhân gốc (dts build có bước rollup declaration
  files riêng, nhạy cảm timing/cache — cùng bản chất với flake round 10).
  `build:app` PASS (8.42s, mọi chunk build OK, exit 0).
- **`git show --stat` cả 2 commit**: `96ae364` đúng **15 file** (DataGridPro
  24, BaseCalendar 11, Kanban 10, LogViewer 8, FilterBuilder 8, Timeline 5,
  FilterChips 4, BulkActionBar 3, Gallery 2, LineChart 5, AreaChart 4,
  DonutChart 3, PieChart 3, Heatmap 3, BarChart 3 = 96 conversion khớp đúng
  commit message); `d41e251` đúng **21 file** (2 archetype + 18 component +
  `dark-mode.css`) — **0 file overlap** giữa 2 commit. `dark-mode.css` chỉ
  xuất hiện trong `d41e251`, diff đúng **1 dòng thêm** (`+
  --wx-shadow-focus: 0 0 0 3px rgba(96, 165, 250, 0.25);` chèn ngay sau
  `--wx-shadow-brand` trong block `.wx-dark, [data-wx-theme="dark"]`), không
  có dòng nào khác trong file bị đụng.
- **Đọc FULL diff cả 2 commit** (không chỉ spot-check) cho pattern
  font-size/width/height/min-width/border-radius/grid-template-columns/
  z-index: **0 chỗ đổi thật** — mọi hit của grep thô đều là do cùng nằm
  chung 1 dòng CSS minify-style với khai báo spacing vừa đổi (đối chiếu từng
  cặp `-`/`+`: `.ac-legend`/`.ac-tooltip-title`/`.bc-legend` (AreaChart/
  BarChart) — `font-size: 12px`/`11px` không đổi, chỉ `gap`/`padding`/
  `margin-bottom` đổi; `.wx-retry[data-size='sm'] .wx-retry__caret`/
  `.review-more`/`.util-result`/`.form-col` (Dev B) — `font-size:
  var(--wx-fs-*)` không đổi, chỉ padding/gap đổi).
- **New-hardcode check**: grep dòng `+` cả 2 diff cho hex/rgba ngoài
  `var(--wx-...)` → chỉ đúng **1 kết quả**, đúng như khai báo — dòng
  `dark-mode.css` mới (`rgba(96, 165, 250, 0.25)`, khớp tông
  `--wx-border-focus` dark `#60a5fa` có sẵn). Không có hardcode mới nào
  khác. API safety: 0 hunk chạm `<script setup>`/`<template>`, 0 rename
  prop/emit/slot/class — 100% CSS-only trên cả 2 commit.
- **Spot-check ≥10 conversion đối chiếu trực tiếp `tokens.css` dòng
  227-239** (space-1=4, space-2=8, space-3=12, space-4=16, space-5=24,
  space-6=32, space-7=40, space-8=48, space-9=64, space-10=80, space-11=96,
  space-12=128px) — đã đọc >20 case cả 2 commit, 100% khớp đúng, gồm cả các
  multi-value shorthand chỉ convert đúng phần khớp lưới: `AreaChart.vue`
  `gap:16px→space-4`, `padding:0 8px 8px→0 space-2 space-2`, `padding:8px
  10px→space-2 10px` (10 off-grid giữ nguyên); `Heatmap.vue` `gap:8px→
  space-2`, `gap:4px→space-1`, `padding:4px 10px→space-1 10px`; `Kanban.vue`
  `gap:12px→space-3`, `padding:8px 0→space-2 0`, `padding:10px 12px→10px
  space-3`; `WCAddAccountModal.vue` inline `style="margin-top:12px"→
  style="margin-top:var(--wx-space-3)"` (1 trong 2 inline style attr được
  sanction); `WMSetupInteractModal.vue` `gap:6px 12px→6px space-3` (6
  off-grid giữ), `padding:1px 4px→1px space-1` (1 off-grid giữ).
- **Off-grid + giá trị âm survive nguyên vẹn (verify đúng 4 case checklist
  yêu cầu)**: `DonutChart.vue:209` `gap: var(--wx-space-2) 20px` (20px lẻ
  giữ nguyên, không có token khớp — đúng note "20px không khớp thang" từ
  round 12); `LogViewer.vue:378` `padding: var(--wx-space-2) 60px` (60px lẻ
  giữ nguyên); `FilterChips.vue:71` `padding: 3px var(--wx-space-1) 3px
  10px` (4-value, chỉ giá trị thứ 2 khớp lưới đổi, 3px/3px/10px lẻ giữ
  nguyên); `Timeline.vue:122` `left: -24px` (giá trị âm định vị dot trên
  vertical rule — giữ nguyên 100%, không bị nhầm là spacing cần convert dù
  |-24| khớp lưới).
- **`CaseStudyGrid.vue`/`TechGrid.vue` 80px→`var(--wx-space-10)`**: đọc lại
  cả 2 file xác nhận `padding: var(--wx-space-10) var(--wx-space-6);` — 80px
  khớp chính xác `--wx-space-10`. `MarketingHero.vue:138` xác nhận **vẫn
  `padding: 120px var(--wx-space-6) var(--wx-space-11);`** — 120px không có
  token khớp, không bị 2 dev round này đụng tới (đúng quyết định round 3,
  đây là case khác, cố ý không convert).
- **`--wx-shadow-focus` dark override — verify hoạt động thật, không chỉ
  đọc source**: đọc `dark-mode.css` dòng 86 xác nhận đặt đúng vị trí — ngay
  trong block `.wx-dark, [data-wx-theme="dark"] { ... }`, cạnh
  `--wx-shadow-brand`, không nằm ngoài block hay sai selector.
  `tokens.css:151` xác nhận `:root` vẫn giữ nguyên định nghĩa light-mode
  (`rgba(0, 123, 255, 0.25)`), không bị đụng. Build xong, grep thật
  `dist-lib/ui.css` xác nhận **cả 2 định nghĩa cùng tồn tại trong output**
  (`:root{...--wx-shadow-focus: 0 0 0 3px rgba(0, 123, 255, .25);...}` và
  `.wx-dark,[data-wx-theme="dark"]{...--wx-shadow-focus: 0 0 0 3px
  rgba(96, 165, 250, .25);...}`) — dark override là custom-property
  redefinition trong selector khác, không bị rule nào sau đó ghi đè lại
  (chỉ có đúng 2 chỗ định nghĩa token này trong toàn bộ output, mọi nơi
  khác chỉ consume qua `var(--wx-shadow-focus)`). `flat-mode.css` xác nhận
  không định nghĩa `--wx-shadow-focus` (0 hit) → không có xung đột 3-way.
  Kết luận: fix hoạt động đúng như thiết kế.
- **Item 9 — re-grep độc lập TOÀN BỘ `components/**`** (không chỉ 36 file
  round này đụng): dùng grep thô ban đầu ra vài false-positive (do multi-
  selector-per-line minify style khiến `font-size:12px` bị nhầm khớp), nên
  viết lại kiểm tra bằng script (node) parse riêng từng khai báo
  `padding|margin|gap: value;`, bỏ qua khai báo đã có `var(--wx-`, chỉ tính
  hit khi **toàn bộ** số px trong value đều khớp thang 4pt
  (4/8/12/16/24/32/40/48/64/80/96/128) — kết quả: chỉ đúng **1 hit thật**
  còn sót trong toàn bộ `components/**` (9 subfolder: async, charts, common,
  data, feedback, layout, permission, platform, wemakeui): `DataGridPro.vue:
  914 .dgp--d-md .dgp-th { padding: 12px; }` — bị Dev A bỏ sót ngay trong
  file mình vừa sửa (24 conversion khác đã đúng, sót đúng 1 dòng single-
  value giữa 2 rule sibling `.dgp--d-sm`/`.dgp--d-lg` đã convert phần khớp
  lưới của chúng).
  **→ Đã tự sửa + verify + commit follow-up `b11f0b3`**
  ("fix: qa follow-up on round 14 — tokenize missed padding:12px in
  DataGridPro.vue", `padding: 12px` → `padding: var(--wx-space-3)`,
  typecheck+build:lib PASS sau fix). Sau follow-up này: **`components/**`
  (toàn bộ 9 subfolder, không riêng gì 36 file 2 round 13-14 đụng) CHÍNH
  THỨC CLOSED cho mục A** — không còn giá trị dương khớp chính xác lưới 4pt
  nào chưa tokenize trong bất kỳ khai báo padding/margin/gap nào của cây
  `components/**`.
  (Ghi chú phụ, không phải bug — đã biết từ trước: `BaseDataGrid.vue` vẫn
  còn dùng scheme biến không-`--wx-*` (`--bg-primary`, `--text-tertiary`,
  `--brand-primary`, v.v., 14 biến) nhưng những biến này **có alias thật**
  trong `frontend/src/style.css` map sang đúng token `--wx-*` tương ứng, và
  `style.css` được `lib.ts` import + có mặt trong `dist-lib/ui.css` — xác
  nhận KHÔNG phải "undefined CSS var" bug (khác hẳn wave 1-4), chỉ là nợ đặt
  tên, giữ nguyên priority trung bình cho round sau như backlog round 13 đã
  ghi.)
- **ROUND 14 QA: PASS WITH FOLLOW-UP COMMIT `b11f0b3`**.
- Backlog cho round 15 (theo đúng đề xuất PLAN round trước + phát hiện QA
  round này):
  1. **Mục A** — `components/**` nay đã **CLOSED hoàn toàn** (xem trên).
     Trọng tâm mục A chuyển hẳn sang `views/**`:
     - **`views/docs/**`** (25 file, ~61 hit theo ước tính round 13, cụm lớn
       nhất còn lại) — demo/doc-only, không phải public API `dist-lib/`
       nhưng vẫn ảnh hưởng UX trang docs. File đậm đặc nhất theo ước tính:
       `GettingStartedView.vue`, `_components/DocPage.vue`,
       `DocsLayout.vue`, `_components/DemoBlock.vue`, `DropdownDoc.vue`,
       `_components/CodeBlock.vue` — nên ưu tiên nhóm này trước nếu chia
       nhỏ theo round.
     - Cụm view nhỏ còn rải rác: `views/{error,landing}/*`,
       `views/home/LandingView.vue` (phần còn sót nếu có), `views/dashboard/
       WeDashboardV1View.vue`, `archetypes/dashboard/{DashboardAnalytics,
       DashboardHero}.vue`.
     Nhắc lại rule không đổi: đọc kỹ multi-value shorthand, giữ nguyên giá
     trị âm/lẻ (không có token khớp), không convert máy móc theo số đếm
     grep thô (giống case round 14 QA phát hiện false-positive từ grep đơn
     giản — nên dùng cách kiểm tra "toàn bộ số trong value đều khớp lưới"
     thay vì chỉ cần 1 số khớp).
  2. **`BaseDataGrid.vue` 14-biến alias-scheme** — priority TRUNG BÌNH, nợ
     đặt tên không phải bug (đã re-confirm round này qua `style.css`), có
     thể gộp làm 1 round riêng khi mục A ở `views/docs/**` đã ổn định.
  3. **Mục C** — vẫn 1 follow-up mở, ưu tiên thấp: `WeDashboardV1View.vue`
     `.env-dot` (pill background/border-radius/padding + pulse-animation
     không khớp `LegendDot` trần, cần biến thể riêng hoặc giữ nguyên — chưa
     ai đụng kể từ round 9).
  4. Mục B — vẫn **CLOSED** (không có phát hiện mới).
  5. `--wx-shadow-focus` dark-mode override — **CLOSED round này**, không
     còn trong backlog.
  6. 2 file archetype `CaseStudyGrid.vue`/`TechGrid.vue` 80px — **CLOSED
     round này**, không còn trong backlog.

### Round 15 (2026-09-02)
- Bối cảnh: PLAN + Dev A/B của round này đã chạy trước hai commit độc lập,
  đúng backlog #1 round 14 đã flag. Dev A commit `d909077` "refactor:
  tokenize 4pt spacing in views/docs" (25 file, 63 conversion, toàn bộ
  `views/docs/**`, bao gồm 3 inline `style=""` sanctioned). Dev B commit
  `2f6bcb1` "refactor: tokenize 4pt spacing in remaining views + migrate
  BaseDataGrid to canonical --wx-* tokens" (8 file: 7 view/archetype rải rác
  + `BaseDataGrid.vue` 14-biến alias-scheme migrate 100% sang `--wx-*`, pure
  rename). Dev C (agent này) chạy QA theo checklist 10 mục có sẵn, không
  chạy lại PLAN.
- **Build gate 3/3 PASS**: `typecheck` sạch (exit 0). `build:lib` chạy **2
  lần liên tiếp** để canh flake pattern round 10/14 — cả 2 lần PASS sạch,
  kết quả kích thước giống hệt nhau (`ui.css` 237.37kB/gzip 34.71kB,
  `es.js` 415.90kB, `umd.js` 325.52kB, dts 17.6-18.0s cả 2 lần, tổng build
  19.7-20.0s) — không tái hiện flake nào round này. `build:app` PASS
  (10.96s, mọi chunk build OK, exit 0).
- **`git show --stat` cả 2 commit**: `d909077` đúng **25 file** (đối chiếu
  từng file với commit message: `DocsLayout.vue` 7, `GettingStartedView.vue`
  13, `_components/{CodeBlock,DemoBlock,DocPage}.vue` 3/5/8, 20 file
  `components/*Doc.vue` còn lại 1-5 mỗi file — khớp đúng). `2f6bcb1` đúng
  **8 file** (`DashboardAnalytics.vue`, `DashboardHero.vue`,
  `BaseDataGrid.vue`, `WeDashboardV1View.vue`, `MaintenanceView.vue`,
  `NotFoundView.vue`, `LandingView.vue`, `PolicyView.vue`) — **0 file
  overlap** giữa 2 commit (2 nhóm thư mục hoàn toàn tách biệt:
  `views/docs/**` vs `archetypes/dashboard`+`components/common`+
  `views/{dashboard,error,home,landing}`). `git diff --stat HEAD~2` cho
  `tokens.css`/`dark-mode.css`/`flat-mode.css`/`style.css`/`lib.ts` → rỗng cả
  5 file, xác nhận không file foundation/entry nào bị đụng.
- **Đọc FULL diff cả 2 commit** (632 + 249 dòng, không spot-check): 0 chỗ
  đổi `font-size`/`width`/`height`/`min-*`/`border-radius`/
  `grid-template-columns` bất kỳ đâu — mọi hunk chỉ đổi giá trị
  `padding`/`margin`/`gap` (hoặc rename biến CSS thuần cho `BaseDataGrid.vue`).
- **Off-grid + giá trị âm survive nguyên vẹn (item 4, ≥10 case cả 2
  commit)**: đếm được >15 giá trị lẻ giữ nguyên trong shorthand hỗn hợp —
  6px/14px (`docs-nav__link`, `CodeBlock.vue__bar`, `DropdownDoc.vue
  .menu-divider`), 14px/60px (`DocsLayout.vue` sidebar), 44px
  (`GettingStartedView.vue .gs__section-title`), 18px (`.gs__note`/
  `.gs__cta`), 28px/72px (2 chỗ mobile `.gs`/`.doc-page`), 36px
  (`DocPage.vue .doc-page__import`), 22px/14px/6px (`LandingView.vue`), 56px/
  18px (`LandingView.vue` mobile hero) — tất cả đúng thang off-grid
  (2/5/6/7/9/10/14/18/20/22/28/36/44/56/60/72/88px) task yêu cầu kiểm. Giá
  trị âm: `WeDashboardV1View.vue:866 .chart-hint { margin: -8px 0
  var(--wx-space-2); }` — dòng này KHÔNG nằm trong diff round 15 (đã tồn tại
  từ trước, chỉ dòng padding khác trong cùng file bị đổi), grep riêng xác
  nhận đây là instance âm duy nhất còn sót trong toàn bộ 33 file 2 commit
  đụng tới, giữ nguyên literal đúng luật.
- **`<pre>`-sample trap check (item 5)**: đọc trực tiếp `CodeBlock.vue` và
  `DemoBlock.vue` — `CodeBlock.vue` dòng 51 `<pre class="code-block__pre">
  <code>{{ code }}</code></pre>` chỉ interpolate prop `code: string` (nội
  dung demo code do `DemoBlock.vue` truyền qua `:code="code"`, chính nó cũng
  chỉ forward prop `code` xuống `CodeBlock` — cả 2 file không có string
  spacing hardcode nào bị escape ẩn trong `<pre>`/`{{ }}`). Xác nhận claim
  Dev A đúng.
- **5 inline style sanctioned (item 6)**: đọc lại hunk đầy đủ cả 5 chỗ —
  `DropdownDoc.vue`/`TooltipDoc.vue` `style="gap:24px"`→
  `style="gap:var(--wx-space-5)"` (chỉ đổi value, không đổi attr khác trên
  cùng thẻ `<div class="row" ...>`); `GettingStartedView.vue`
  `style="margin-top:32px;"`→`style="margin-top:var(--wx-space-6);"` (chỉ
  đổi value trên `<p class="gs__p" ...>`); `WeDashboardV1View.vue`/
  `DashboardHero.vue` `style="color: inherit; padding: 0 4px"`→
  `style="color: inherit; padding: 0 var(--wx-space-1)"` (chỉ đổi phần
  `padding`, `color: inherit` và toàn bộ `variant`/`size`/`v-if`/`@click`
  trên `<BaseButton>` giữ nguyên 100%). Cả 5/5 xác nhận value-only, 0
  prop/handler/class bị đụng.
- **`BaseDataGrid.vue` migration (item 7, phần quan trọng nhất)**: grep
  `var(--` toàn file → **0 hit không bắt đầu bằng `wx-`** (14/14 biến đã
  rename hết). Đối chiếu cả 14 target với `tokens.css` — tồn tại thật cả 14:
  `--wx-surface-{base,elevated,sunken}`, `--wx-border-default`,
  `--wx-text-{primary,secondary,muted}`, `--wx-{hover,active}-bg`,
  `--wx-brand-primary`, `--wx-{success,warning,danger}-solid`, `--wx-fs-12`.
  Dark-mode coverage: 10/14 có override thật trong `dark-mode.css`
  (surface/border/text/hover/active/brand); 4/14
  (`--wx-{success,warning,danger}-solid`, `--wx-fs-12`) **không có** override
  dark — nhưng đã verify đây **không phải regression**: đọc `style.css`
  dòng 30-32/84 xác nhận alias cũ (`--success-color`, `--warning-color`,
  `--error-color`, `--font-size-small`) vốn dĩ **đã trỏ thẳng** vào chính
  các token `--wx-*-solid`/`--wx-fs-12` này từ trước (`--success-color:
  var(--wx-success-solid);` v.v.) — tức là hành vi dark-mode (hoặc thiếu nó)
  **giống hệt trước và sau migration**, đúng như commit message khai báo
  "zero visual change intended". `git diff --stat HEAD~2 -- style.css` xác
  nhận **rỗng thật** — Dev B không đụng file này. Grep toàn `frontend/src`
  cho `var(--bg-primary)`, `var(--text-tertiary)` v.v. (13 tên cũ, trừ
  `BaseDataGrid.vue`) → còn 8 consumer khác dùng alias cũ
  (`BaseSkeleton.vue`, `BaseProgress.vue`, `BaseRadio.vue`) — đúng dự kiến,
  không phải bug vì alias vẫn tồn tại nguyên vẹn trong `style.css`,
  `BaseDataGrid.vue` tự nó sạch 100% là đủ theo yêu cầu checklist.
- **New-hardcode check (item 8)**: grep dòng `+` cả 2 diff cho hex/rgba →
  **0 kết quả**. Mọi `px` còn lại trong dòng `+` đều thuộc property khác
  (font-size/width/outline-offset/transition) hoặc là phần off-grid cố ý giữ
  nguyên của multi-value shorthand — không có hardcode mới nào lọt qua.
- **Re-grep độc lập item 9**: `views/docs/**` → **0 residual hit**. 7 file
  Dev B đụng → **0 residual hit dương/off-grid**, chỉ còn đúng 1 instance âm
  đã biết (`WeDashboardV1View.vue:866`, xem trên) — không phải miss, đúng
  luật giữ nguyên giá trị âm.
- **Full-repo re-grep item 10 — mục A KHÔNG đóng repo-wide** (xem chi tiết
  đầy đủ + breakdown trong BACKLOG mục A ở trên, đã cập nhật): phát hiện 4
  cụm thật chưa từng được quét trước đây — khối utility-class trong
  `style.css` (`.btn`/`.stat-card`/`.section-subtitle`/`.data-table`/
  `.form-textarea`/`.radio-label`, ~8 declaration), `responsive.css`
  (`.wx-container`/`.wx-page-pad`, ~6 declaration), `views/ShowcaseView.vue`
  (route thật `/showcase`, khác `views/showcase/**` đã CLOSED, ~25 hit thô
  cần đọc kỹ lọc false-positive), và 1 hit lẻ mới `archetypes/marketing/
  CaseStudyGrid.vue:165 .cs-label{margin-bottom:4px}`. Đồng thời **đính
  chính** kết luận round 12 rằng `style.css`/`responsive.css` là "file định
  nghĩa token, loại khỏi phạm vi" — chỉ đúng cho khối alias đầu `style.css`
  và cho `tokens.css`/`scales.ts` thật, KHÔNG đúng cho phần utility-class
  còn lại của `style.css` lẫn toàn bộ `responsive.css` (đây là utility CSS
  tiêu thụ giá trị, không phải nơi định nghĩa thang đo). Các cụm khác grep
  ra đều đã biết và đúng là exception cố ý (không phải miss mới): 3
  `<pre>` doc-sample trong `views/forms/*`, 6 file `padding-top:64px` trong
  `views/marketing/*` (header-compensation cố ý), cụm `views/showcase/**`
  con (scroll-margin/var-fallback JS-controlled/negative-margin/no-scoped-
  style, đã biết từ round 9-11), và mọi giá trị âm đã biết
  (`BaseAvatarGroup`/`BaseSelectMenu`/`StatusBar`/`WeDashboardV1View
  .chart-hint`).
- **Không có lỗi nhỏ nào trong commit của Dev A/B cần QA tự sửa** — cả 2
  commit đúng 100% theo khai báo, mọi hạng mục checklist đạt ngay từ commit
  gốc. Phát hiện ở item 10 không phải bug trong việc Dev A/B vừa làm (họ làm
  đúng phạm vi được giao) mà là backlog mới lộ ra cho phần `views/**` +
  `style.css`/`responsive.css` CHƯA từng ai đụng tới — đúng bản chất công
  việc audit lặp lại nhiều round đã thấy từ round 9→15 (mỗi lần đóng 1 cụm
  lại lộ ra cụm khác chưa quét).
- **ROUND 15 QA: PASS**, không cần follow-up commit.
- Backlog cho round 16:
  1. **Mục A — VẪN MỞ, KHÔNG closed repo-wide** (đính chính suy đoán ban đầu
     trong brief round này rằng đây có thể là "milestone đóng toàn bộ mục
     A" — thực tế qua re-grep KHÔNG phải vậy). 4 cụm ưu tiên cho round 16
     theo thứ tự: (1) `style.css` khối utility-class (~8 declaration,
     `.btn`/`.stat-card`/`.section-subtitle`/`.data-table`/`.form-textarea`/
     `.radio-label` — file dùng chung toàn app, ưu tiên cao); (2)
     `responsive.css` (~6 declaration, breakpoint utility dùng chung); (3)
     `views/ShowcaseView.vue` (route thật `/showcase`, ~25 hit thô cần đọc
     kỹ theo phương pháp node-script round 14 để lọc false-positive trước
     khi convert, KHÔNG convert máy móc theo số đếm grep thô); (4)
     `archetypes/marketing/CaseStudyGrid.vue:165` (1 dòng lẻ,
     `margin-bottom:4px`→`var(--wx-space-1)`, nhanh gọn). Sau khi xử lý hết
     4 cụm này nên chạy lại đúng full-repo re-grep (cách round 14 — node
     script parse từng khai báo, chỉ tính hit khi TOÀN BỘ số trong value
     khớp lưới) 1 lần cuối để xác nhận thật sự đóng repo-wide trước khi
     tuyên bố CLOSED.
  2. **Mục C** — vẫn 1 follow-up mở, ưu tiên thấp (không đổi round này):
     `WeDashboardV1View.vue` `.env-dot` (pill background/border-radius/
     padding + pulse-animation không khớp `LegendDot` trần, chưa ai đụng kể
     từ round 9).
  3. Mục B — vẫn **CLOSED** (không có phát hiện mới).
  4. `BaseDataGrid.vue` 14-biến alias-scheme — **CLOSED round này** (Dev B,
     xem trên), không còn trong backlog.
  5. PLAN round 16 **KHÔNG nên pivot toàn bộ sang mục D** như gợi ý ban đầu
     trong brief — mục A vẫn còn việc thật cụ thể, ưu tiên xử lý 4 cụm trên
     trước (đặc biệt `style.css`/`responsive.css` vì ảnh hưởng toàn app, độ
     rủi ro thấp — cùng pattern đã làm quen 15 round). Có thể kết hợp 1 dev
     làm mục A (`style.css`+`responsive.css`+`CaseStudyGrid.vue`, gộp 3 việc
     nhỏ) + 1 dev bắt đầu mục D category đầu tiên (`views/ShowcaseView.vue`
     nặng, tách riêng làm việc solo 1 dev nếu muốn giữ 2 dev không đụng
     chung file).

### Round 16 (2026-09-02)
- PLAN (opus): xử lý đúng 4 cụm ưu tiên còn lại của mục A theo backlog round
  15 — Dev A = `style.css` khối utility-class (`.btn`/`.stat-card`/
  `.section-subtitle`/`.data-table`/`.form-textarea`/`.radio-label`) +
  `responsive.css` (`.wx-container`/`.wx-page-pad`) + re-point khối alias
  legacy `--space-xs/sm/md/lg/xl/2xl` sang trỏ `var(--wx-space-*)` (dọn nợ
  đặt tên tiện thể vì đang sửa cùng file) + `CaseStudyGrid.vue:165`; Dev B =
  `views/ShowcaseView.vue` (13 inline `style=""` + 12 `<style scoped>`,
  KHÔNG đụng 5 site `var(--space-*)` alias hiện có để tránh xung đột với
  việc Dev A đang đổi định nghĩa alias cùng lúc).
- Dev A commit `786b40c`: 3 file, 21 dòng đổi (10 insertions/10 deletions
  ròng phần convert + phần alias re-point). Điểm đáng chú ý: re-point
  `--space-xs/sm/md/lg/xl/2xl` từ literal sang `var(--wx-space-1/2/4/5/6/8)`
  — đổi NGUỒN giá trị nhưng giữ nguyên TÊN alias, tuyên bố zero-visual-diff.
  typecheck+build:lib PASS.
- Dev B commit `ca23a31`: 1 file, 50 dòng đổi (25 conversion: 13 inline +
  12 `<style scoped>`), cố ý bỏ qua 5 site `var(--space-lg/md/sm)` alias
  hiện có trong cùng file để không xung đột với việc Dev A đổi định nghĩa
  alias song song. typecheck+build:lib PASS.
- Dev C QA — build gate: `npm run typecheck` sạch, `npm run build:lib` chạy
  2 lần (flake watch) đều PASS y hệt nhau (`ui.css` 237.71 kB/gzip 34.72 kB,
  `wemake-ui.es.js` 415.90 kB, `wemake-ui.umd.js` 325.52 kB, dts build
  ~14-15s), `npm run build:app` PASS (7.92s, mọi chunk build OK, không có
  warning mới). `git show --stat` xác nhận đúng Dev A 3 file
  (`CaseStudyGrid.vue`, `style.css`, `responsive.css`), Dev B đúng 1 file
  (`ShowcaseView.vue`), 0 overlap, không đụng
  `tokens.css`/`dark-mode.css`/`flat-mode.css`/`lib.ts`.
  - **Đọc FULL diff cả 2 commit**: xác nhận 0 thay đổi
    `font-size`/`width`/`height`/`min-*`/`max-*`/`border-radius`/
    `grid-template-columns`/`transform` — mọi hunk chỉ đổi
    `padding`/`margin`/`gap` (hoặc value bên trong) sang `var(--wx-space-*)`.
    `responsive.css` breakpoint values (640/768/1024/1280/1536px trong
    `.wx-container`, 767/768/1280px trong `.wx-page-pad`) giữ nguyên y hệt,
    chỉ padding-left/right đổi.
  - **Verify alias re-point value-identical (item 4, safety check quan
    trọng nhất round này)**: đọc `tokens.css:228-238` xác nhận
    `--wx-space-1=4px`, `-2=8px`, `-4=16px`, `-5=24px`, `-6=32px`, `-8=48px`
    — khớp CHÍNH XÁC từng giá trị literal cũ (`--space-xs:4px`→
    `var(--wx-space-1)`=4px ✓, `-sm:8px`→`var(--wx-space-2)`=8px ✓,
    `-md:16px`→`var(--wx-space-4)`=16px ✓, `-lg:24px`→`var(--wx-space-5)`
    =24px ✓, `-xl:32px`→`var(--wx-space-6)`=32px ✓, `-2xl:48px`→
    `var(--wx-space-8)`=48px ✓) — value-identical 100%, đúng như commit
    message khai báo. Re-grep toàn repo `var(--space-xs|sm|md|lg|xl|2xl)`:
    **27 occurrence / 9 file** (khớp đúng số Dev A khai báo "27 external
    consumers across 9 files") — `ShowcaseView.vue` (5, đúng 5 site Dev B
    cố ý chừa lại), `style.css` (1, self-consumption dòng 289
    `.mkt-cta` `margin-bottom: var(--space-lg)`), 7 file
    `views/showcase/data/{CalendarView,GridView,FilterView,GalleryView,
    LogView,KanbanView,TimelineView}.vue` (21). Tất cả chỉ dùng alias
    THEO TÊN (`--space-lg`/`-md`/`-sm`), không quan tâm nguồn giá trị bên
    trong → definition đổi nguồn (literal→token) nhưng giá trị resolve
    y hệt nên 0 consumer bị ảnh hưởng, verify thực nghiệm khớp claim.
  - **Verify `responsive.css`**: build `dist-lib/ui.css` grep `.wx-container`/
    `.wx-page-pad` → xác nhận output thật có
    `padding-left:var(--wx-space-4);padding-right:var(--wx-space-4)` (base),
    `padding-left:var(--wx-space-5);padding-right:var(--wx-space-5)` (≥1024px),
    và cả 3 breakpoint `.wx-page-pad` đều giữ đúng
    `padding-left:var(--wx-space-3/5/6)!important;padding-right:...!important`
    — cả 6 `!important` sống sót nguyên vẹn qua build thật, không chỉ đọc
    source.
  - **Verify off-grid survivor trong `style.css` (item 6)**: đọc lại 6 vị
    trí — `.btn{padding:10px 20px}` ✓, `.badge{padding:2px 10px}` ✓,
    `.data-table td{padding:14px var(--wx-space-4)}` (14 giữ literal, 16
    convert) ✓, `.form-input{padding:6px 10px}` ✓,
    `.form-textarea{padding:var(--wx-space-2) 10px}` (10 giữ literal) ✓,
    `.chk-label{gap:6px}` ✓ — đúng 100% claim, không có off-grid nào bị ép
    nhầm.
  - **Verify `ShowcaseView.vue` (item 7)**: đọc cấu trúc file
    (`<script setup>` dòng 1-323, `<template>` 325-945, `<style scoped>`
    947-1184) đối chiếu với vị trí mọi hunk trong diff (dòng 537-1151) →
    xác nhận **0 hunk chạm `<script setup>`**, mọi sibling declaration
    trong inline `style=""` (`flex-direction`/`align-items`/
    `justify-content`) giữ nguyên verbatim, không đổi prop/class/@click/
    v-if nào. 5 site `var(--space-lg/md/sm)` Dev B khai báo "cố ý chừa" xác
    nhận đúng còn nguyên (dòng 956/964/965/981/988), không nằm trong bất kỳ
    hunk nào của diff.
  - **New-hardcode check (item 8)**: grep dòng `+` cả 2 diff cho
    hex/rgba → 0 kết quả. `px` còn lại trong dòng `+`: chỉ có `14px`/`10px`
    (off-grid survivor, đúng khai báo) và `1024px` (giá trị breakpoint
    media-query có sẵn, xuất hiện lại do cả dòng bị thay khi padding cùng
    dòng đổi, KHÔNG phải giá trị mới) — không có hardcode mới nào lọt qua.
  - **Full-repo re-grep item 9 — KẾT LUẬN: mục A ĐÓNG repo-wide.** Chạy lại
    đúng phương pháp node-script parse-từng-khai-báo (chỉ tính hit khi TOÀN
    BỘ số trong value `padding`/`margin`/`gap` khớp lưới 4pt
    4/8/12/16/24/32/40/48/64/80/96/128px, kể cả multi-value shorthand đã
    convert 1 phần — grep riêng ~50 khai báo mixed `var(--wx-space-*)` +
    literal còn lại để xác nhận phần literal sót lại luôn off-grid, không
    có leftover conversion bị bỏ sót) trên toàn `frontend/src`. Kết quả 25
    hit thô, đối chiếu từng cái với danh sách exception đã biết từ round
    15 trở về trước:
    - `BaseAvatarGroup.vue:52,64` `margin-left:-8px` — giá trị âm, exception
      đã biết (round 13).
    - `tokens.css:215,336,354` — **false positive**: đây là khai báo custom
      property `--wx-density-gap: 8px/4px/12px` (density scale gốc), regex
      match nhầm hậu tố `-gap` chứ không phải property `gap` thật; file này
      vốn dĩ là nguồn token, ngoài phạm vi mục A theo §3.
    - `views/forms/FileUploadView.vue:180`, `InputGroupView.vue:114` — đọc
      lại xác nhận cả 2 nằm trong `<pre>` doc-sample (dòng 161-189 và
      93-121, HTML-escaped code sample hiển thị cho người dùng đọc, không
      phải CSS sống) — đúng 2/3 exception `<pre>` doc-sample đã biết từ
      round 12 (`FloatingLabelsView.vue` không lọt lưới grid lần này nên
      không xuất hiện trong list, không phải vấn đề).
    - `views/marketing/{ContactView,FAQView,HomeView,PartnersView,
      ProductDetailView,ProductsView}.vue` `padding-top:64px` (6 file) —
      header-compensation cố ý, exception đã biết từ round 12.
    - `views/showcase/AppTemplatesView.vue:105` — **false positive**: đọc
      lại xác nhận đây là `scroll-margin-top:80px` (category hoàn toàn khác
      `margin-top`), regex match nhầm hậu tố; đã xác nhận exception từ
      round 10.
    - `views/showcase/RevealTest.vue` (6 hit: `padding:40px` x5,
      `margin-bottom:24px` x4, `margin:40px 0` x1 trong inline `style=""`)
      — verify lại file **vẫn không có bất kỳ thẻ `<style>` nào** (grep
      `<style` = 0 match), toàn bộ styling nằm ở inline `style=""` trong
      template → đúng exception "không có `<style scoped>`" đã áp dụng
      nhất quán từ round 10.
    - Verify thêm ~50 khai báo dạng mixed (`var(--wx-space-*) <literal>px`)
      trên toàn repo (component/view đã convert 1 phần ở các round trước:
      `BaseButton`, `BaseModal`, `BaseTabs`, `BaseTextarea`, `DataGridPro`,
      `LogViewer`, `TemplateGallery`, `docs/*`, v.v.) — mọi literal còn sót
      lại đều off-grid thật (10/14/18/20/26/28/34/36/56/60/72px...), 0 case
      lẽ ra phải convert nốt mà bị bỏ sót.
    - Cũng xác nhận `MarketingHero.vue` 120px không xuất hiện trong list vì
      không khớp bất kỳ token `--wx-space-*` nào (thang chỉ đến
      `--wx-space-11=96px`), đúng như quyết định giữ nguyên từ round 3.
    **Không có cụm mới nào phát sinh** — toàn bộ 25 hit thô đều quy về
    exception đã biết và đã ghi nhận qua các round trước. **Sau 16 round,
    mục A (hardcoded spacing sweep) chính thức tuyên bố CLOSED repo-wide**
    — mọi cụm `padding`/`margin`/`gap` khớp chính xác lưới 4pt trong
    `frontend/src/**` đã được tokenize hoặc xác nhận có lý do chính đáng để
    giữ nguyên literal (off-grid fine-tune, giá trị âm, doc-sample trong
    `<pre>`, file không có `<style scoped>`, token-source file).
  - **Không có lỗi nhỏ nào cần QA tự sửa** — cả 2 commit đúng 100% theo
    khai báo, build gate 3/3 PASS, không có hardcode mới, không đụng file
    ngoài phạm vi.
- **ROUND 16 QA: PASS**, không cần follow-up commit.
- Backlog cho round 17:
  1. **Mục A — CLOSED repo-wide** (xem kết luận item 9 ở trên). Không cần
     dev nào tiếp tục quét spacing 4pt nữa trừ khi có component/view mới
     được thêm vào sau này.
  2. **Mục B — vẫn CLOSED** (không có phát hiện mới từ round 10 tới nay).
  3. **Mục C** — vẫn 1 follow-up mở, ưu tiên thấp nhất: `WeDashboardV1View.vue`
     `.env-dot` (pill background/border-radius/padding + pulse-animation
     không khớp `LegendDot` trần, chưa ai đụng kể từ round 9) — có thể tiếp
     tục để mở vô thời hạn nếu không ai thấy giá trị làm, hoặc PLAN round
     nào đó quyết định làm biến thể `LegendDot` riêng hoặc đóng hẳn với lý
     do "đủ khác biệt, không cần gộp".
  4. **Naming debt (mới, ưu tiên thấp, không urgent)**: khối alias legacy
     `--space-xs/sm/md/lg/xl/2xl` (27 consumer/9 file) và `--font-size-*`
     tương tự trong `style.css` giờ đã trỏ đúng `var(--wx-*)` (an toàn giá
     trị) nhưng vẫn giữ TÊN cũ khác hệ thống `--wx-*` chính — có thể cân
     nhắc 1 round riêng migrate thẳng 27+ consumer sang gọi trực tiếp
     `var(--wx-space-*)`/`var(--wx-fs-*)` rồi xoá hẳn khối alias, thống nhất
     100% về 1 hệ tên. Không chặn gì cả, chỉ là dọn nợ kỹ thuật.
  5. **PLAN round 17 nên pivot sang mục D (GLOBAL AUDIT)** — với A, B, và
     "undefined CSS var" hunt (closed từ round 4 wave 3 + các wave trước)
     đều đã đóng, không còn cụm spacing/duplicate-component/undefined-var
     lớn nào chờ xử lý. Ưu tiên các category D chưa từng chạy round riêng:
     #3 (layout lệch/overflow/text truncate), #5 (icon size so với
     `--wx-density-icon-size`), #6 (responsive breakpoint sm/md qua
     `useBreakpoint`), #7 (interaction state loading/empty/error theo
     DESIGN.md §5), #8 (accessibility aria/alt/contrast/focus/keyboard),
     #10 (legacy component không còn dùng — audit orphan, KHÔNG tự xoá nếu
     là public API trong `lib.ts`). Đây sẽ là GLOBAL AUDIT round đầu tiên
     kể từ khi mục A bắt đầu chiếm ưu thế từ round 1 — điều kiện dừng cần 3
     round GLOBAL AUDIT liên tiếp 0-finding, nên round 17 là round đầu tiên
     trong chuỗi đó (chưa đủ điều kiện dừng loop).

<!-- Round 16+ sẽ được orchestrator/PLAN append tiếp xuống đây -->
