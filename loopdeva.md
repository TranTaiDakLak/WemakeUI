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

<!-- Round 4+ sẽ được orchestrator/PLAN append tiếp xuống đây -->
