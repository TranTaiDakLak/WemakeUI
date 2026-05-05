# 🚀 Gstack for Antigravity

> **Bộ kỹ năng AI Engineering chuyên nghiệp dành cho Antigravity** — chuyển đổi từ [garrytan/gstack](https://github.com/garrytan/gstack) (Claude Code) sang tương thích hoàn toàn với môi trường Antigravity.

gstack biến AI agent thành một đội ngũ chuyên gia hoàn chỉnh: CEO reviewer, kỹ sư trưởng, designer, QA lead, release engineer, security officer, và hơn thế nữa. Mỗi skill là một quy trình có cấu trúc, được thiết kế để AI thực hiện công việc ở mức chất lượng chuyên nghiệp.

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Cài đặt](#-cài-đặt)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Danh sách Skill & Workflow](#-danh-sách-skill--workflow)
- [Hướng dẫn sử dụng chi tiết](#-hướng-dẫn-sử-dụng-chi-tiết)
- [Quy trình làm việc chuẩn](#-quy-trình-làm-việc-chuẩn)
- [Nguyên tắc cốt lõi](#-nguyên-tắc-cốt-lõi)
- [Headless Browser (Browse)](#-headless-browser-browse)
- [Hiểu về SKILL.md](#-hiểu-về-skillmd)
- [Tùy chỉnh & Mở rộng](#-tùy-chỉnh--mở-rộng)
- [Khắc phục sự cố](#-khắc-phục-sự-cố)
- [Câu hỏi thường gặp](#-câu-hỏi-thường-gặp)

---

## 🌟 Tổng quan

### gstack là gì?

gstack là bộ sưu tập các file `SKILL.md` — mỗi file là "prompt template" chuyên biệt cho một vai trò cụ thể trong quy trình phát triển phần mềm. Thay vì để AI hoạt động như một công cụ đa năng chung chung, gstack trao cho nó **vai trò chuyên gia** với quy trình rõ ràng, tiêu chí đánh giá cụ thể, và output có cấu trúc.

### Tại sao cần gstack cho Antigravity?

| Không có gstack | Có gstack |
|-----------------|-----------|
| AI review code bằng nhận xét chung chung | AI review theo quy trình 2-pass có cấu trúc, phát hiện bug mà CI bỏ qua |
| Debug bằng trial-and-error | Tuân thủ Iron Law: **KHÔNG sửa khi chưa tìm ra root cause** |
| QA bằng mắt thường | Browser-based testing thật với Chromium, screenshot evidence |
| Ship code bằng tay | Tự động: test → review → version bump → changelog → commit → PR |
| Review code sơ sài | 3 lớp review: CEO (strategy) + Eng (architecture) + Design (UX) |

### Điểm khác biệt cho Antigravity

Phiên bản này đã được **tương thích hóa** cho Antigravity:

- ✅ Skill discovery qua `.agents/skills/gstack/` (chuẩn Antigravity)
- ✅ Workflow bridges qua `.agents/workflows/` cho slash commands
- ✅ Tương thích với hệ thống `browser_subagent` của Antigravity cho browse commands
- ✅ SKILL.md YAML frontmatter tương thích với format Antigravity
- ✅ Tất cả 25+ skills đã được copy nguyên bản kèm template

---

## 🔧 Cài đặt

### Yêu cầu hệ thống

- **Antigravity** đã được cài đặt và hoạt động
- **Git** (cho các skill liên quan đến version control)
- **Node.js** hoặc **Bun** (cho browse binary — tùy chọn)
- **GitHub CLI** (`gh`) — tùy chọn, cho các skill liên quan đến PR/Issue

### Cách sử dụng

Dự án này đã được cấu trúc sẵn. Để sử dụng trong project của bạn:

#### Cách 1: Copy vào project (khuyến nghị)

```bash
# Copy thư mục .agents vào project của bạn
cp -r <path-to>/GstackAntigravity/.agents /path/to/your/project/.agents
```

#### Cách 2: Symlink (dùng chung cho nhiều project)

```bash
# Windows (PowerShell — chạy với quyền Admin)
New-Item -ItemType Junction -Path ".agents" -Target "<path-to>\GstackAntigravity\.agents"

# Linux/macOS
ln -s /path/to/GstackAntigravity/.agents .agents
```

#### Cách 3: Sử dụng trực tiếp

Nếu bạn đang làm việc trực tiếp trong thư mục `GstackAntigravity`, các skill đã sẵn sàng sử dụng.

### Xác nhận cài đặt

Sau khi cài đặt, kiểm tra Antigravity có nhận diện được skills:

1. Mở Antigravity trong project
2. Gõ `/office-hours` — nếu agent đọc được skill, cài đặt thành công
3. Hoặc hỏi: "Liệt kê các gstack skill có sẵn" — agent sẽ đọc SKILL.md gốc

---

## 📁 Cấu trúc thư mục

```
GstackAntigravity/
├── .agents/
│   ├── skills/
│   │   └── gstack/                    # ← Skill discovery root
│   │       ├── SKILL.md               # ← Main entry point cho Antigravity
│   │       ├── ETHOS.md               # Triết lý cốt lõi
│   │       ├── ARCHITECTURE.md        # Kiến trúc hệ thống
│   │       ├── BROWSER.md             # Tài liệu browse commands
│   │       ├── VERSION                # Phiên bản gstack
│   │       ├── bin/                   # CLI tools
│   │       ├── browse/                # Headless browser binary
│   │       │
│   │       ├── office-hours/          # 🧠 Brainstorming
│   │       │   └── SKILL.md
│   │       ├── plan-ceo-review/       # 👔 CEO Review
│   │       │   └── SKILL.md
│   │       ├── plan-eng-review/       # ⚙️ Eng Review
│   │       │   └── SKILL.md
│   │       ├── plan-design-review/    # 🎨 Design Review (Plan)
│   │       │   └── SKILL.md
│   │       ├── design-consultation/   # 🎨 Design System Builder
│   │       │   └── SKILL.md
│   │       ├── review/                # 🔍 Code Review
│   │       │   └── SKILL.md
│   │       ├── investigate/           # 🐛 Root Cause Debugging
│   │       │   └── SKILL.md
│   │       ├── design-review/         # 🎨 Design Audit
│   │       │   └── SKILL.md
│   │       ├── qa/                    # 🧪 QA + Fix
│   │       │   └── SKILL.md
│   │       ├── qa-only/               # 📋 QA Report Only
│   │       │   └── SKILL.md
│   │       ├── ship/                  # 🚢 Ship Workflow
│   │       │   └── SKILL.md
│   │       ├── document-release/      # 📄 Release Docs
│   │       │   └── SKILL.md
│   │       ├── retro/                 # 📊 Weekly Retro
│   │       │   └── SKILL.md
│   │       ├── benchmark/             # ⚡ Performance
│   │       │   └── SKILL.md
│   │       ├── cso/                   # 🔒 Security Audit
│   │       │   └── SKILL.md
│   │       ├── autoplan/              # 🤖 Auto Review Pipeline
│   │       │   └── SKILL.md
│   │       ├── careful/               # ⚠️ Safety Guards
│   │       │   └── SKILL.md
│   │       ├── freeze/                # 🧊 Scope Lock
│   │       │   └── SKILL.md
│   │       ├── guard/                 # 🛡️ Full Safety
│   │       │   └── SKILL.md
│   │       ├── unfreeze/              # 🔓 Remove Lock
│   │       │   └── SKILL.md
│   │       ├── canary/                # 🐤 Post-Deploy Monitor
│   │       │   └── SKILL.md
│   │       ├── codex/                 # 🤖 Multi-AI Second Opinion
│   │       │   └── SKILL.md
│   │       ├── gstack-upgrade/        # ⬆️ Self Upgrade
│   │       │   └── SKILL.md
│   │       ├── land-and-deploy/       # 🛬 Merge & Deploy
│   │       │   └── SKILL.md
│   │       └── setup-browser-cookies/ # 🍪 Browser Cookies
│   │           └── SKILL.md
│   │
│   └── workflows/                     # ← Slash commands cho Antigravity
│       ├── office-hours.md
│       ├── plan-ceo-review.md
│       ├── plan-eng-review.md
│       ├── plan-design-review.md
│       ├── design-consultation.md
│       ├── review.md
│       ├── investigate.md
│       ├── qa.md
│       ├── qa-only.md
│       ├── ship.md
│       ├── retro.md
│       ├── cso.md
│       ├── benchmark.md
│       ├── autoplan.md
│       ├── design-review.md
│       ├── document-release.md
│       ├── careful.md
│       ├── freeze.md
│       ├── guard.md
│       └── unfreeze.md
│
└── README.md                          # ← File này
```

---

## 📋 Danh sách Skill & Workflow

### 🧠 Giai đoạn Tư duy (Think)

| Lệnh | Tên | Mô tả | Khi nào dùng |
|-------|-----|--------|-------------|
| `/office-hours` | Brainstorming | Reframe ý tưởng sản phẩm, tìm phiên bản 10 sao | Bắt đầu project mới, refine ý tưởng |

### 📐 Giai đoạn Lập kế hoạch (Plan)

| Lệnh | Tên | Mô tả | Khi nào dùng |
|-------|-----|--------|-------------|
| `/plan-ceo-review` | CEO Review | Review scope, strategy, tìm cơ hội sản phẩm | Plan feature mới, product changes |
| `/plan-eng-review` | Eng Review | Lock architecture, data flow, edge cases, tests | Trước khi build feature phức tạp |
| `/plan-design-review` | Design Review | Đánh giá thiết kế 0-10 theo từng dimension | Trước khi build UI/UX |
| `/design-consultation` | Design System | Xây dựng design system hoàn chỉnh | Project mới cần brand/design |
| `/autoplan` | Auto Review | Chạy toàn bộ review pipeline tự động | Muốn review nhanh tất cả góc nhìn |

### 🔨 Giai đoạn Xây dựng (Build)

| Lệnh | Tên | Mô tả | Khi nào dùng |
|-------|-----|--------|-------------|
| `/investigate` | Debugging | Root cause investigation — không sửa khi chưa hiểu | Gặp bug, lỗi, hành vi bất thường |
| `/careful` | Safety Mode | Cảnh báo trước lệnh nguy hiểm | Làm việc với production, shared env |
| `/freeze` | Scope Lock | Khóa edit vào 1 thư mục cụ thể | Debug tập trung, tránh scope creep |
| `/guard` | Full Safety | Kết hợp careful + freeze | Maximum safety |
| `/unfreeze` | Unlock | Gỡ bỏ scope lock | Khi xong debug / focus work |

### 🔍 Giai đoạn Review

| Lệnh | Tên | Mô tả | Khi nào dùng |
|-------|-----|--------|-------------|
| `/review` | Code Review | Pre-landing review 2-pass | Trước khi merge PR |
| `/design-review` | Design Audit | Visual audit + atomic fixes | Sau khi build xong UI |
| `/cso` | Security Audit | OWASP, STRIDE, secrets, supply chain | Audit bảo mật định kỳ |

### 🧪 Giai đoạn Test

| Lệnh | Tên | Mô tả | Khi nào dùng |
|-------|-----|--------|-------------|
| `/qa` | QA + Fix | Test → tìm bug → sửa → verify | Feature đã code xong, cần test |
| `/qa-only` | QA Report | Chỉ test và báo cáo, không sửa | Muốn biết trạng thái hiện tại |
| `/benchmark` | Performance | Đo baseline, Web Vitals, bundle size | Nghi ngờ regression hiệu năng |

### 🚢 Giai đoạn Ship

| Lệnh | Tên | Mô tả | Khi nào dùng |
|-------|-----|--------|-------------|
| `/ship` | Ship | Test → review → commit → push → PR | Code đã sẵn sàng ship |
| `/land-and-deploy` | Land & Deploy | Merge PR → chờ deploy → verify production | Sau khi `/ship` tạo PR |
| `/document-release` | Docs Update | Cập nhật docs theo những gì vừa ship | Sau khi ship xong |
| `/canary` | Canary Monitor | Theo dõi production sau deploy, phát hiện regression | Sau khi deploy xong |

### 📊 Giai đoạn Retrospective

| Lệnh | Tên | Mô tả | Khi nào dùng |
|-------|-----|--------|-------------|
| `/retro` | Weekly Retro | Phân tích commit, patterns, team metrics | Cuối tuần / cuối sprint |

### 🔧 Giai đoạn Tiện ích (Utilities)

| Lệnh | Tên | Mô tả | Khi nào dùng |
|-------|-----|--------|-------------|
| `/codex` | Codex | Second opinion từ OpenAI Codex — review, challenge, consult | Muốn ý kiến độc lập từ AI khác |
| `/gstack-upgrade` | Upgrade | Cập nhật gstack lên phiên bản mới nhất | Khi có bản cập nhật |
| `/setup-browser-cookies` | Browser Cookies | Import cookies từ browser thật vào browse session | Test trang cần đăng nhập |

---

## 📖 Hướng dẫn sử dụng chi tiết

### 1. `/office-hours` — Bắt đầu dự án mới

**Khi nào dùng:** Bạn có ý tưởng nhưng chưa biết bắt đầu từ đâu.

```
Bạn: /office-hours

AI sẽ:
1. Phân tích codebase hiện tại (nếu có)
2. Hỏi bạn về sản phẩm: "Bạn đang xây gì? Cho ai? Vấn đề gì?"
3. Áp dụng framework "10-star review" để nâng tầm ý tưởng
4. Tạo implementation plan cụ thể
5. Gợi ý bước tiếp theo phù hợp
```

**Ví dụ thực tế:**
```
Bạn: /office-hours Tôi muốn xây một app quản lý chi tiêu cá nhân
AI: [Phân tích ý tưởng, đề xuất features, tạo roadmap]
```

### 2. `/plan-ceo-review` — Review chiến lược

**Khi nào dùng:** Bạn có plan cần được review từ góc nhìn sản phẩm/kinh doanh.

```
Bạn: /plan-ceo-review

AI sẽ:
1. Đọc plan hiện tại (PLAN.md hoặc issue)
2. Chọn mode review: Expansion, Reduction, Pivot, hoặc Refinement
3. Tìm cơ hội "10-star" trong plan
4. Chạy adversarial spec review
5. Output: Review report có Opt-in/Opt-out ceremony
```

### 3. `/review` — Pre-landing Code Review

**Khi nào dùng:** Code đã viết xong, chuẩn bị merge.

```
Bạn: /review

AI sẽ:
1. Phân tích diff giữa feature branch và main
2. Pass 1: Structural review (architecture, patterns, API)
3. Pass 2: Adversarial review (edge cases, security, perf)
4. Tạo review report với:
   - FIX items (phải sửa trước khi merge)
   - ASK items (cần user quyết định)
   - SKIP items (minor, có thể bỏ qua)
```

### 4. `/investigate` — Debug có phương pháp

**Khi nào dùng:** Gặp bug, lỗi bất thường.

> ⚠️ **Iron Law:** KHÔNG sửa khi chưa tìm ra root cause

```
Bạn: /investigate Ứng dụng crash khi submit form

AI sẽ:
1. Phase 1: Thu thập triệu chứng, đọc code, check git log
2. Phase 2: Pattern analysis (race condition? null propagation? state corruption?)
3. Phase 3: Hypothesis testing (verify trước khi sửa)
4. Phase 4: Fix root cause (minimal diff + regression test)
5. Phase 5: Verify + DEBUG REPORT
```

### 5. `/qa` — Test ứng dụng web

**Khi nào dùng:** Feature đã code xong, cần test chất lượng.

```
Bạn: /qa http://localhost:3000

AI sẽ:
1. Mở browser thật (Chromium)
2. Navigate, click, fill forms, test interactions
3. Check console errors, broken links, responsive layouts
4. Tìm bugs → sửa với atomic commits → re-verify
5. Output: QA Report với health score, before/after evidence
```

**Ba tier:**
- `--quick`: Chỉ critical + high (30 giây)
- *(mặc định)*: + medium severity
- `--exhaustive`: + cosmetic issues

### 6. `/ship` — Ship code trong một lệnh

**Khi nào dùng:** Code đã sẵn sàng, muốn push + tạo PR.

```
Bạn: /ship

AI sẽ (HOÀN TOÀN TỰ ĐỘNG):
1. Check branch (abort nếu đang trên main)
2. Merge base branch
3. Run tests (triage failures: in-branch vs pre-existing)
4. Pre-landing review
5. Version bump + CHANGELOG
6. Commit → Push → Create PR
7. Output: PR URL
```

### 7. `/cso` — Security Audit

**Khi nào dùng:** Audit bảo mật theo OWASP, STRIDE, secrets.

```
Bạn: /cso

AI sẽ chạy 14 phases:
- Phase 0: Architecture mental model
- Phase 1: Attack surface census
- Phase 2: Secrets archaeology (git history)
- Phase 3: Dependency supply chain
- Phase 4: CI/CD pipeline security
- Phase 5-6: Infrastructure + Webhooks
- Phase 7: LLM/AI security
- Phase 8: Skill supply chain
- Phase 9: OWASP Top 10
- Phase 10: STRIDE threat model
- Phase 11: Data classification
- Phase 12-14: Verification + Report
```

**Modes:**
```
/cso                     # Full audit (8/10 confidence gate)
/cso --comprehensive     # Monthly deep scan (2/10 bar)  
/cso --infra             # Infrastructure only
/cso --code              # Code only
/cso --supply-chain      # Dependencies only
/cso --owasp             # OWASP Top 10 only
```

### 8. `/retro` — Weekly Retrospective

**Khi nào dùng:** Cuối tuần, muốn review tiến độ.

```
Bạn: /retro

AI sẽ phân tích:
- Commit history, LOC, PRs merged
- Work session patterns (deep/medium/micro)
- Commit time distribution (hourly histogram)
- Hotspot analysis (files changed most)
- Team breakdown with praise + growth areas
- Shipping streak counter
- Week-over-week trends
```

**Arguments:**
```
/retro          # 7 ngày (mặc định)
/retro 24h      # 24 giờ
/retro 14d      # 14 ngày
/retro 30d      # 30 ngày
/retro compare  # So sánh kỳ này vs kỳ trước
/retro global   # Cross-project retro
```

---

## 🔄 Quy trình làm việc chuẩn

### Workflow đầy đủ cho một Feature mới

```
┌─────────────────────────────────────────────────────────┐
│  1. /office-hours          → Brainstorm & refine idea   │
│  2. /plan-ceo-review       → CEO-level scope review     │
│  3. /plan-eng-review       → Architecture & test plan   │
│  4. /design-consultation   → Build design system        │
│  5. (Code the feature)     → Write the actual code      │
│  6. /review                → Pre-landing code review    │
│  7. /design-review         → Visual audit + fixes       │
│  8. /qa                    → Browser-based QA + fixes   │
│  9. /ship                  → Tests → commit → PR        │
│ 10. /document-release      → Update documentation       │
│ 11. /retro                 → Retrospective              │
└─────────────────────────────────────────────────────────┘
```

### Workflow nhanh cho Bug Fix

```
1. /investigate     → Tìm root cause
2. (Fix the bug)    → Sửa + regression test
3. /review          → Quick review
4. /ship            → Ship
```

### Workflow cho Security Audit

```
1. /cso                  → Full security audit
2. /cso --comprehensive  → Monthly deep scan
3. (Fix findings)        → Sửa các lỗ hổng
4. /cso                  → Re-audit để verify
```

### Workflow tối ưu hiệu năng

```
1. /benchmark <url> --baseline  → Capture baseline
2. (Make changes)               → Optimize code
3. /benchmark <url>             → Compare vs baseline
4. /benchmark --trend           → View historical trends
```

---

## 🌊 Nguyên tắc cốt lõi

### 1. Boil the Lake (Đun sôi cái hồ) 🌊

> AI làm chi phí biên của sự hoàn thiện gần bằng 0. Luôn làm đầy đủ.

| Loại công việc | Human team | AI-assisted | Nén |
|----------------|-----------|-------------|-----|
| Boilerplate | 2 ngày | 15 phút | ~100x |
| Viết test | 1 ngày | 15 phút | ~50x |
| Feature mới | 1 tuần | 30 phút | ~30x |
| Bug fix + test | 4 giờ | 15 phút | ~20x |
| Architecture | 2 ngày | 4 giờ | ~5x |
| Research | 1 ngày | 3 giờ | ~3x |

**Quy tắc:** Nếu Option A (đầy đủ, 150 dòng) vs Option B (90%, 80 dòng) → **luôn chọn A**. 70 dòng chênh lệch tốn vài giây với AI.

**Lake vs Ocean:**
- 🏊 **Lake** (boilable): 100% test coverage, full feature, all edge cases
- 🌊 **Ocean** (NOT boilable): Rewrite từ đầu, multi-quarter migration

### 2. Search Before Building (Tìm trước khi xây) 🔍

Ba lớp kiến thức:
1. **Layer 1 — Tried & True:** Đừng phát minh lại bánh xe
2. **Layer 2 — New & Popular:** Tìm kiếm nhưng phải phê phán
3. **Layer 3 — First Principles:** Giá trị nhất — suy luận từ bản chất

### 3. See Something, Say Something (Thấy gì nói nấy) 👀

Khi phát hiện vấn đề ngoài scope:
- **Solo repo:** Đề xuất sửa luôn
- **Collaborative repo:** Hỏi trước khi sửa
- **Không bao giờ** để vấn đề trôi qua im lặng

### 4. Completion Status Protocol ✅

Mỗi skill kết thúc với một trong:
- **DONE** — Hoàn thành, có evidence
- **DONE_WITH_CONCERNS** — Xong nhưng có lo ngại
- **BLOCKED** — Không thể tiếp tục
- **NEEDS_CONTEXT** — Thiếu thông tin

---

## 🌐 Headless Browser (Browse)

gstack tích hợp browser thật (Chromium) cho QA, benchmark, và visual testing.

### Setup

Browser binary cần được build 1 lần:
```bash
cd .agents/skills/gstack/browse
./setup  # hoặc: bun install && bun run build
```

> **Lưu ý cho Windows:** Nếu `bun` chưa được cài, chạy:
> ```powershell
> irm bun.sh/install.ps1 | iex
> ```

### Cú pháp

Trong các skill, browse commands sử dụng cú pháp `$B <command>`:

```bash
$B goto https://example.com       # Navigate
$B snapshot                        # Text snapshot
$B snapshot -i                     # With interactive element annotations  
$B snapshot -D                     # Diff vs previous snapshot
$B screenshot path.png             # Save screenshot
$B click @e3                       # Click annotated element
$B fill @e5 "hello"                # Fill input field
$B console --errors                # Check JS errors
$B perf                            # Performance metrics
$B viewport 375x812                # Set viewport (mobile)
$B links                           # List all links
$B eval "document.title"           # Execute JS
```

### Trong Antigravity

Antigravity sử dụng `browser_subagent` thay vì `$B` trực tiếp. Khi skill yêu cầu browse commands, agent sẽ tự động sử dụng browser_subagent tương đương để:
- Navigate tới URL
- Chụp screenshots
- Tương tác với elements
- Kiểm tra console errors

---

## 📜 Hiểu về SKILL.md

### Cấu trúc chuẩn

Mỗi `SKILL.md` theo format:

```yaml
---
name: skill-name
version: 1.0.0
description: |
  Mô tả ngắn gọn skill này làm gì.
  Khi nào nên dùng (triggers).
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
  - WebSearch
---

## Preamble (run first)
[Initialization: session tracking, config, telemetry]

## AskUserQuestion Format
[4-part structure: Re-ground → Simplify → Recommend → Options]

## Completeness Principle
[Boil the Lake methodology]

## Repo Ownership Mode  
[Solo vs Collaborative behavior]

## Search Before Building
[Three layers of knowledge]

## [Skill-specific workflow]
[Phase 1... Phase 2... etc.]

## Completion Status Protocol
[DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT]

## Telemetry (run last)
[Session duration, outcome logging]
```

### AskUserQuestion Format

Mọi câu hỏi cho user phải theo cấu trúc 4 phần:

1. **Re-ground:** Nhắc lại project, branch hiện tại, task đang làm
2. **Simplify:** Giải thích bằng tiếng dễ hiểu (smart 16-year-old test)
3. **Recommend:** `RECOMMENDATION: Chọn [X] vì [lý do]` + Completeness score
4. **Options:** `A) ... B) ... C) ...` — có thời gian ước tính: `(human: ~X / AI: ~Y)`

---

## 🎛️ Tùy chỉnh & Mở rộng

### Thêm skill mới

1. Tạo thư mục mới trong `.agents/skills/gstack/`:
   ```
   .agents/skills/gstack/my-skill/
   └── SKILL.md
   ```

2. Viết SKILL.md theo format chuẩn (xem mục trên)

3. Tạo workflow bridge trong `.agents/workflows/`:
   ```markdown
   ---
   description: Mô tả ngắn cho skill mới
   ---
   # /my-skill
   Read `.agents/skills/gstack/my-skill/SKILL.md` and follow its workflow.
   ```

### Tùy chỉnh skill có sẵn

> ⚠️ **Quan trọng:** Không edit trực tiếp `SKILL.md` — edit file `.tmpl` (template) và regenerate.

Nếu không có `.tmpl`, bạn có thể edit `SKILL.md` trực tiếp nhưng nên ghi chú thay đổi.

### Cấu hình

gstack lưu cấu hình tại `~/.gstack/`:

```bash
# Tắt gợi ý proactive
gstack-config set proactive false

# Bật/tắt telemetry
gstack-config set telemetry off       # Tắt hoàn toàn
gstack-config set telemetry anonymous  # Chỉ đếm
gstack-config set telemetry community  # Chia sẻ usage data

# Bỏ qua eng review khi ship
gstack-config set skip_eng_review true
```

---

## ❓ Khắc phục sự cố

### "Skill không được nhận diện"

1. Kiểm tra `.agents/skills/gstack/` tồn tại trong project root
2. Kiểm tra `SKILL.md` có YAML frontmatter hợp lệ
3. Restart Antigravity session

### "Browse binary không hoạt động"

1. Kiểm tra Node.js/Bun đã cài
2. Chạy build: `cd .agents/skills/gstack/browse && bun install && bun run build`
3. Trên Windows, browse binary có thể cần WSL hoặc các dependency Playwright

### "Skill chạy preamble nhưng không thực hiện workflow"

1. Đảm bảo skill được đọc đúng file (check path)
2. Kiểm tra agent có đủ tools cần thiết (Bash, Read, Write, etc.)

### "git commands fail"

1. Đảm bảo đang ở trong git repo
2. Kiểm tra `origin` remote tồn tại
3. Kiểm tra `gh` CLI đã xác thực: `gh auth status`

---

## ❓ Câu hỏi thường gặp

### Q: gstack có gửi code của tôi đi đâu không?
**A:** Không. gstack chạy hoàn toàn local. Telemetry chỉ ghi lại skill nào được dùng, bao lâu, và kết quả — KHÔNG bao gồm code, file paths, hay repo names. Bạn có thể tắt hoàn toàn: `gstack-config set telemetry off`.

### Q: Sự khác biệt giữa phiên bản Claude Code và Antigravity?
**A:** Skills (SKILL.md) giống 100%. Sự khác biệt nằm ở:
- **Discovery:** Claude Code dùng `~/.claude/skills/`, Antigravity dùng `.agents/skills/`
- **Workflows:** Antigravity thêm `.agents/workflows/*.md` làm bridge cho slash commands
- **Browser:** Claude Code dùng `$B` trực tiếp, Antigravity dùng `browser_subagent`
- **Hooks:** Claude Code hỗ trợ PreToolUse hooks, Antigravity chưa (careful/freeze chỉ advisory)

### Q: Tôi có thể dùng một số skill mà không cần toàn bộ?
**A:** Có. Mỗi skill hoạt động độc lập. Copy chỉ những skill bạn cần vào `.agents/skills/gstack/` + workflow tương ứng.

### Q: Có cần internet không?
**A:** Phần lớn skills hoạt động offline. Một số features cần internet: WebSearch (research), `gh` (GitHub), browse (nếu test website online).

### Q: Cập nhật gstack như thế nào?
**A:** Sử dụng lệnh `/gstack-upgrade` trong Antigravity, hoặc clone mới từ GitHub:
```bash
git clone --depth 1 https://github.com/garrytan/gstack.git /tmp/gstack-update
cp -r /tmp/gstack-update/* .agents/skills/gstack/
rm -rf /tmp/gstack-update
```

---

## 📄 License

gstack là dự án open source bởi [Garry Tan](https://github.com/garrytan).
Phiên bản Antigravity này là bản chuyển đổi tương thích — tuân thủ license gốc.

---

## 🙏 Credits

- **gstack** bởi [garrytan/gstack](https://github.com/garrytan/gstack) — bộ skill gốc
- **Antigravity** — môi trường agent hosting
- Triết lý **"Boil the Lake"** — [garryslist.org](https://garryslist.org/posts/boil-the-ocean)
