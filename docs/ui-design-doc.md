# /office-hours Design Doc — WeConnect UI × ui-ux-pro-max

> **Date:** 2026-03-24 · **Branch:** master (no commits) · **Mode:** Builder
> **Skill data:** ui-ux-pro-max searches across product, style, color, typography, UX, vue stack

---

## 1. Problem Statement

WeConnect hiện có design system 434 dòng CSS — solid nhưng được thiết kế theo phong cách **generic web app** (Inter font, 24px padding, light-only). Đây là **desktop tool quản lý data** (68 fields/account, 1000+ rows), cần phong cách **data-dense dashboard** — compact, scan-friendly, không lãng phí pixel.

### Câu hỏi cần trả lời
1. Style nào phù hợp nhất cho desktop management tool?
2. Token nào trong design system hiện tại sai với data-dense pattern?
3. Dark mode có cần thiết không?
4. Font hiện tại (Inter) có phải lựa chọn tốt nhất?

---

## 2. ui-ux-pro-max Recommendations (tổng hợp 6 domains)

### 2.1 Product Type → **Data-Dense Dashboard + Financial Dashboard**

Pro Max khuyên kết hợp 2 styles:
- **Data-Dense Dashboard** — minimal padding (8-12px), sticky headers, 12px font, 36px row height
- **Financial Dashboard** — dark bg + red/green status alerts + trust blue

Đây chính xác là WeConnect: quản lý accounts với status Live (green)/Die (red), data table là trung tâm UI.

### 2.2 Style → **Data-Dense + Dark Mode (OLED)**

| Style | Fit | Lý do |
|-------|-----|-------|
| ✅ **Data-Dense Dashboard** | 10/10 | WeConnect = bảng dữ liệu dày đặc, cần maximum data visibility |
| ✅ **Dark Mode (OLED)** | 8/10 | Desktop app, dùng nhiều giờ, giảm eye strain |
| ❌ Cyberpunk UI | 3/10 | Quá stylized cho business tool |
| 🟡 Real-Time Monitoring | 6/10 | Có thể cần cho live status nhưng không là core |

**Pro Max Design System Variables cho Data-Dense:**
```
--grid-gap: 8px
--card-padding: 12px
--font-size-small: 12px
--table-row-height: 36px
--sidebar-width: 240px
--header-height: 56px
```

### 2.3 Color Palette

Pro Max đề xuất 2 palette phù hợp:

| Palette | Primary | Secondary | CTA | Background | Text |
|---------|---------|-----------|-----|-----------|------|
| **SaaS General** | `#2563EB` | `#3B82F6` | `#F97316` | `#F8FAFC` | `#1E293B` |
| **Developer Tool** (dark) | `#1E293B` | `#334155` | `#22C55E` | `#0F172A` | `#F8FAFC` |

**Quyết định:** Giữ brand blue hiện tại (`#50a0ff`) — nó gần với SaaS General và đã đồng bộ với WeFacebook C# gốc. Thay đổi brand color không có ROI vì user đã quen.

Nhưng **thêm CTA orange** (`#F97316`) — hiện tại nút "Thêm tài khoản" dùng `#ff8000` (rất gần, giữ luôn).

### 2.4 Typography

| Lựa chọn | Heading | Body | Data cells |
|----------|---------|------|-----------|
| **Hiện tại** | Inter | Inter | Inter |
| **Pro Max #1** ✅ | Fira Code | Fira Sans | Fira Code |
| Pro Max #2 | Exo | Roboto Mono | Roboto Mono |

**Quyết định: Fira Sans (body) + Fira Code (data)**

Lý do:
- Inter là font generic SaaS — không sai nhưng không optimal cho data tables
- Fira Sans visual weight tương tự Inter, chuyển đổi smooth
- Fira Code cho data cells (UID, token, cookie) — monospace giúp scan dữ liệu dễ hơn
- Cả 2 cùng họ Fira → visual cohesion

### 2.5 UX Guidelines (từ Pro Max)

| Rule | Hiện tại | Cần làm |
|------|---------|---------|
| **Loading states** | ❌ Không có | Thêm skeleton screens + spinners |
| **Table overflow** | ✅ overflow-x-auto | OK |
| **Bulk actions** | ✅ Multi-select + action bar | OK |
| **Continuous animation** | ✅ Chỉ dùng cho loading | OK |

### 2.6 Vue Stack (từ Pro Max)

| Guideline | Hiện tại | Status |
|-----------|---------|--------|
| Composition API + `<script setup>` | ✅ | Đúng rồi |
| Pinia cho global state | ✅ | Đúng rồi |
| defineStore setup syntax | 🟡 | Cần kiểm tra |

---

## 3. Gap Analysis — 12 Gaps

| # | Gap | Hiện tại | Pro Max | Impact |
|---|-----|---------|---------|--------|
| 1 | **Card padding quá lớn** | 24px (`--space-lg`) | 12px | 🔴 Lãng phí 50% diện tích |
| 2 | **Grid gap quá lớn** | 16px (`--space-md`) | 8px | 🔴 Wasted space |
| 3 | **Thiếu dark mode** | Light only | Dark Mode OLED | 🔴 Eye strain cho desktop app |
| 4 | **Font không optimal** | Inter only | Fira Sans + Fira Code | 🟡 Data hard to scan |
| 5 | **Thiếu table-row-height token** | N/A | 36px | 🟡 Inconsistent row heights |
| 6 | **Thiếu header-height token** | N/A | 56px | 🟡 Chưa standardize |
| 7 | **Thiếu sidebar-width token** | N/A | 240px | 🟡 Chưa standardize |
| 8 | **Thiếu loading states** | None | Skeleton + spinner | 🟡 No async feedback |
| 9 | **Border radius quá lớn** | 10-20px | 4-8px (compact) | 🟡 Looks like mobile app |
| 10 | **Thiếu icon system** | No library | Lucide SVG icons | 🟡 Inconsistent icons |
| 11 | **info-color quá tối** | `#0000cd` (MediumBlue) | `#3B82F6` (modern blue) | 🟢 Minor |
| 12 | **success-color cũ** | `#228b22` (ForestGreen) | `#22C55E` (modern green) | 🟢 Minor |

---

## 4. Proposed Design System Changes

### Phase 1: Token Update (style.css)

```css
/* THÊM vào @import */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');

/* SỬA trong :root */
--font-family: 'Fira Sans', 'Inter', -apple-system, sans-serif;
--font-family-mono: 'Fira Code', 'Consolas', monospace;  /* MỚI */

/* THÊM Data-Dense tokens */
--grid-gap-compact: 8px;       /* MOI - dùng thay --space-md cho grids */
--card-padding-compact: 12px;  /* MỚI - dùng thay --space-lg cho cards */
--table-row-height: 36px;      /* MỚI */
--sidebar-width: 240px;        /* MỚI */
--header-height: 56px;         /* MỚI */

/* SỬA Radii (compact hơn cho desktop) */
--radius-sm: 4px;    /* was 6px */
--radius-md: 6px;    /* was 10px */
--radius-lg: 8px;    /* was 16px */
--radius-xl: 12px;   /* was 20px */

/* SỬA Semantic colors (modern hơn) */
--success-color: #22C55E;    /* was #228b22 */
--info-color: #3B82F6;       /* was #0000cd */
```

### Phase 2: Dark Mode

```css
/* THÊM — Dark Mode tokens */
.dark-mode {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
  --sidebar-bg: #0F172A;
  --content-bg: #1E293B;
  --topbar-bg: rgba(15, 23, 42, 0.92);
  --card-bg: #1E293B;
  --card-bg-hover: #334155;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-tertiary: #64748B;
  --border-color: rgba(255, 255, 255, 0.08);
  --hover-bg: rgba(80, 160, 255, 0.1);
  --active-bg: rgba(80, 160, 255, 0.2);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
}
```

### Phase 3: Component Updates

- **BaseDataGrid**: dùng `--table-row-height`, `--font-family-mono` cho data cells
- **Cards**: dùng `--card-padding-compact` thay `--space-lg`
- **Grids**: dùng `--grid-gap-compact` thay `--space-md`
- **AppSidebar**: dùng `--sidebar-width`
- **AppTopbar**: dùng `--header-height`, thêm dark mode toggle

### Phase 4: Loading States + Icons

- Cài `lucide-vue-next` cho consistent SVG icons
- Skeleton component cho async loading
- Empty state illustrations

---

## 5. Effort Estimate

| Phase | Human team | AI-assisted | Files affected |
|-------|-----------|------------|----------------|
| Phase 1: Tokens | 1 day | ~15 min | 1 (style.css) |
| Phase 2: Dark Mode | 2 days | ~30 min | 3 (style.css, app.ts, AppTopbar.vue) |
| Phase 3: Components | 3 days | ~45 min | ~15 files |
| Phase 4: Loading + Icons | 2 days | ~30 min | ~10 files |
| **Total** | **~1 week** | **~2 hours** | **~30 files** |

---

## 6. Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Brand color | **Keep `#50a0ff`** | Already synced with WeFacebook C# original. User muscle memory. |
| Font | **Fira Sans + Fira Code** | Pro Max top recommendation for data dashboards |
| Dark mode bg | **`#0F172A` (Slate 900)** | Softer than pure black, easier on eyes |
| Spacing | **12px cards, 8px grids** | Pro Max data-dense standard |
| Border radius | **Reduce 40%** | Desktop tool, not mobile app |
| Icon library | **Lucide** | Tree-shakeable, Vue 3 support, Pro Max recommended |

---

## 7. NOT In Scope (for this design doc)

- Backend Go implementation (separate concern)
- New feature development (Instagram, YouTube, Zalo views)
- Database schema design
- Major component refactoring (e.g., splitting 84KB SetupInteractModal)

---

## 8. Next Steps

1. **`/plan-eng-review`** — Review kiến trúc CSS changes, test strategy
2. **`/plan-design-review`** — Rate design dimensions trước khi implement
3. **Build** — Implement 4 phases theo thứ tự
4. **`/design-review`** — Visual QA sau khi build

---

**STATUS: DONE** — Design document hoàn thành. Sẵn sàng cho implementation.
