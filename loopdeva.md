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
- **Còn lại cho round 9+:**
  - `archetypes/dashboard/DashboardKPICard.vue` — chưa sweep.
  - `archetypes/marketing/MarketingHeader.vue` — chưa sweep (MarketingHero.vue
    mới chỉ xử lý 1 chỗ ở round 8, phần còn lại của hero + toàn bộ Header
    chưa đụng).
  - `archetypes/crud/CrudFormFields.vue`, `CrudPage.vue` — chưa sweep.
  - Các view ngoài `views/dashboard/*` (vd `views/app/*`, `views/wemakeui/*`,
    `views/marketing/*`, `views/showcase/*`, `views/forms/*`) chưa được sweep
    cho pattern spacing 4pt — mới chỉ xử lý wave-3 category-1 (undefined var)
    ở các round trước, chưa quét riêng hardcoded-px-khớp-token.

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

<!-- Round 9+ sẽ được orchestrator/PLAN append tiếp xuống đây -->
