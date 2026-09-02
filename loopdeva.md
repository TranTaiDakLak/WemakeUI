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
- **Còn lại cho round 12+:**
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

<!-- Round 13+ sẽ được orchestrator/PLAN append tiếp xuống đây -->
