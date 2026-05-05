# REQUIREMENTS.md — Project Constitution (WemakeUI / WeConnect)

> **Purpose**: Bảo toàn "lõi" dự án theo thời gian.
> Mọi AI agent hoặc developer PHẢI đọc file này TRƯỚC KHI thay đổi bất kỳ thứ gì.

---

## 0) Scope & Definitions

- **Scope**: Ứng dụng desktop WeConnect (rebuild từ WeFacebook) — quản lý hàng loạt tài khoản mạng xã hội (Facebook, Instagram, YouTube, Zalo), tự động hóa tương tác, quản lý BM/Ads. Xây dựng bằng Go + Wails v2 + Vue 3 + TypeScript.
- **Tiền thân**: WeFacebook C# WinForms — đang migration sang Go/Wails để cross-platform, dễ maintain, và hiệu năng tốt hơn.
- **Giai đoạn hiện tại**: **Xây dựng Base UI Component Library** — tạo nền tảng UI components tái sử dụng trước khi implement business logic.
- **"No behavior change"** nghĩa là: KHÔNG thay đổi logic nghiệp vụ ban đầu (job processing, account states, proxy rotation, BM workflows) trừ khi user yêu cầu rõ ràng.

### 0.1 Single Source of Truth (SSOT)

Chỉ duy nhất MỘT vị trí canonical cho mỗi nguồn sự thật:

| Nguồn sự thật | Canonical Path |
|---|---|
| Project constitution | `REQUIREMENTS.md` (root repo — file này) |
| Agent rules | `.agents/ANTIGRAVITY_STANDARD_PROMPT.md` |
| Database schema | `internal/db/migrations/` |
| App config schema | `internal/config/` |
| Wails bindings | `frontend/wailsjs/` (auto-generated) |

- KHÔNG tạo thêm constitution files (`project_rules.md`, `requirements.md`, v.v.)
- Nếu canonical path chưa tồn tại → tạo khi cần, KHÔNG thay đổi semantics.

---

## 1) Tech Stack (Canonical)

| Layer | Technology | Version |
|---|---|---|
| **Backend** | Go | 1.22+ |
| **Desktop Framework** | Wails v2 | 2.11+ |
| **Frontend** | Vue 3 (Composition API + `<script setup>` + TypeScript) | Vue 3.x |
| **State Management** | Pinia | Latest |
| **Routing** | Vue Router 4 (hash mode for Wails) | 4.x |
| **Build Tool** | Vite | 3+ |
| **Local Database** | SQLite (via `modernc.org/sqlite` hoặc `mattn/go-sqlite3`) | — |
| **HTTP Client** | Go `net/http` + custom transport (proxy support) | — |
| **Browser Automation** | Rod (Go) hoặc chromedp | — |
| **Config** | JSON-based settings (compatible with C# version) | — |

### 1.1 Wails Commands

| Command | Mô tả |
|---|---|
| `wails dev` | Development mode (hot-reload) |
| `wails build` | Build production `.exe` |
| `wails doctor` | Check environment readiness |

---

## 2) Non-Negotiable Principles

### 2.1 Architecture & Boundaries

```
WemakeUI/
├── main.go                          → Wails entrypoint
├── app.go                           → Main App struct (Wails bindings)
├── wails.json                       → Wails configuration
├── REQUIREMENTS.md                  → Project constitution (THIS FILE)
├── .agents/                         → AI agent rules
│
├── internal/                        → Go backend (NOT exposed to frontend)
│   ├── config/                      → App config management (JSON settings)
│   ├── db/                          → SQLite database layer
│   │   ├── migrations/              → Schema migrations
│   │   ├── models/                  → Data models / structs
│   │   └── repository/              → CRUD repositories
│   ├── services/                    → Business logic services
│   └── utils/                       → Shared utilities
│
├── bindings/                        → Wails-bound structs (exposed to frontend)
│
├── frontend/                        → Vue 3 + TypeScript SPA
│   ├── src/
│   │   ├── main.ts                  → Vue app entry
│   │   ├── App.vue                  → Root component
│   │   ├── style.css                → Global design system (CSS variables)
│   │   ├── router/                  → Vue Router (hash mode)
│   │   ├── stores/                  → Pinia stores
│   │   ├── views/                   → Page-level components
│   │   ├── components/              → ★ REUSABLE UI COMPONENTS
│   │   │   ├── common/              → Base UI Library (Section 3)
│   │   │   │   ├── BaseButton.vue
│   │   │   │   ├── BaseInput.vue
│   │   │   │   ├── BaseSelect.vue
│   │   │   │   ├── BaseToggle.vue
│   │   │   │   ├── BaseCheckbox.vue
│   │   │   │   ├── BaseRadio.vue
│   │   │   │   ├── BaseTabs.vue
│   │   │   │   ├── BaseDataGrid.vue  → ★ Core component (virtual scroll)
│   │   │   │   ├── BaseModal.vue     → Modal wrapper (draggable)
│   │   │   │   ├── ContextMenu.vue   → Right-click menu (nested)
│   │   │   │   ├── StatusBar.vue     → Status bar
│   │   │   │   ├── BaseToast.vue     → Toast notification
│   │   │   │   ├── BaseDropdown.vue  → Dropdown menu
│   │   │   │   ├── BaseTooltip.vue   → Tooltip
│   │   │   │   ├── BaseBadge.vue     → Badge/tag
│   │   │   │   ├── BaseProgress.vue  → Progress bar
│   │   │   │   ├── FormField.vue     → Form field wrapper
│   │   │   │   ├── GroupBox.vue      → GroupBox wrapper
│   │   │   │   └── index.ts          → Barrel export
│   │   │   ├── facebook/             → Facebook-specific components
│   │   │   └── layout/              → Layout components (Sidebar, Topbar)
│   │   ├── composables/             → Vue composables
│   │   │   ├── useToast.ts          → Toast notification system
│   │   │   ├── useClipboard.ts      → Clipboard utilities
│   │   │   ├── useContextMenu.ts    → Context menu hook
│   │   │   ├── useSelection.ts      → Row/cell selection hook
│   │   │   ├── useVirtualScroll.ts  → Virtual scrolling for DataGrid
│   │   │   ├── useKeyboard.ts       → Keyboard shortcuts
│   │   │   ├── useColumnResize.ts   → Column resize for DataGrid
│   │   │   └── index.ts
│   │   ├── types/                   → TypeScript type definitions
│   │   └── utils/                   → Frontend utilities
│   └── wailsjs/                     → Auto-generated Wails JS bindings
│
└── build/                           → Build output
```

### 2.2 Frontend ↔ Backend Communication

- **TOÀN BỘ** giao tiếp giữa Vue frontend và Go backend đi qua **Wails bindings**.
- KHÔNG dùng REST API, WebSocket, hay gRPC cho giao tiếp nội bộ.
- Wails tự generate TypeScript types từ Go structs → DÙNG types được generate.
- Side effects (long-running jobs) → dùng Wails Events system.

### 2.3 Account Data Model (Core)

Mô hình tài khoản Facebook — giữ nguyên fields từ C# version:

```
Account {
  ID              int       // Auto-increment
  UID             string    // Facebook User ID
  Password        string    // Account password
  TwoFA           string    // 2FA secret key
  Email           string    // Email linked
  PassEmail       string    // Email password
  EmailRecovery   string    // Recovery email
  Cookie          string    // Main cookie
  Token           string    // Access token
  Status          string    // Live/Die/Checkpoint/None
  Status282       string    // 282 status
  StatusADS       string    // Ads status
  BM              string    // Business Manager info
  TKQC            string    // Ad Account info
  ChatSupport     string    // Chat support status
  FullName        string    // Display name
  Friends         int       // Friend count
  Follower        int       // Follower count
  Post            int       // Post count
  Gender          string
  Birthday        string
  Location        string
  Hometown        string
  CurrentCity     string
  RequestFriends  int       // Pending friend requests
  DateCreated     string    // Account creation date
  Group           string    // Groups joined
  GroupManager    string    // Groups managed
  Page            string    // Pages
  PageManager     string    // Pages managed
  Avatar          string
  Cover           string
  Professional    string    // Professional mode
  Dating          string    // Dating profile
  SecondAccount   string
  Marketplace     string
  EmailOther      string
  Phone           string
  Proxy           string    // Assigned proxy
  UA              string    // User Agent
  ProfileChrome   string    // Browser profile path
  BackupRequest   string
  Note            string    // User note
  NoteRun         string    // Run status note
  NoteSystem      string    // System note
  DateImport      string    // Import date
  Category        string    // Category/group
  ClientID        string    // OAuth client ID
  RefreshToken    string    // OAuth refresh token
  OAuth2          string    // OAuth2 data
  LastRun         string    // Last run timestamp
  Run             string    // Current run log
  // Platform-specific cookies & tokens
  CookieAndroid   string
  CookieIOS       string
  CookieInsta     string
  CookieOther     string
  TokenAndroid    string
  TokenIOS        string
  TokenInsta      string
  TokenEAAG       string
  TokenOther      string
  Token001        string
  UaAndroid       string
  UaIOS           string
}
```

### 2.4 Job System (Actions)

Các actions/jobs cần triển khai (tương ứng C# version):

| Category | Jobs |
|---|---|
| **Check Info** | Check thông tin tài khoản, Check Wall, Check Live/Die, Check bằng Cookie, Check Pass, Check Mail |
| **Interaction** | Tương tác Newsfeed, Like/Comment/Share Post, Interaction Reel, Kết bạn, Chấp nhận kết bạn, Tham gia Group |
| **Content** | Đăng bài lên Wall, Up Post, Up Reel, Up Story |
| **BM/Ads** | Tạo BM, Check BM, Nhận BM, Chia sẻ BM, Tạo TKQC (Ad Account), Res BM |
| **Account Mgmt** | Cập nhật Info, Đổi mật khẩu, Cập nhật 2FA, Cập nhật Cookie/Token, Tạo tài khoản phụ |
| **Page** | Quản lý Page, Tạo Page mới |
| **Security** | Bật 2FA, Unlock Checkpoint, Đổi Timezone |
| **Browser** | Mở trình duyệt (profile), Đóng trình duyệt, Xóa profile, Login lấy Cookie/Token |
| **TUT Premium** | TUT NLM250, TUT LGBT, TUT BM5, TUT BM7, TUT BM Unlimited, TUT Divide, TUT BMKick3_5, TUT ActiveBM10 |

### 2.5 Premium/License System

- Phần mềm có hệ thống license + functions check:
  - Mỗi user có danh sách `Functions` với `FunctionID`, `IsActive`, `EndDate`
  - UI phải ẩn/hiện features dựa trên license
  - Check hạn sử dụng qua server time
- **KHÔNG** hardcode license check → phải qua server API (Wemake Project 2026 Core)

### 2.6 Proxy System

Hỗ trợ nhiều loại proxy:
- Static proxy (per-account)
- ShopLike proxy
- Tinsoft proxy
- NetProxy
- XProxy
- Proxy rotation queue

### 2.7 Settings System

Hai loại config chính (tương thích C# JSON format):
- `configGeneral` — Cài đặt chung (browser path, threads, backup DB, v.v.)
- `configInteraction` — Thiết lập tương tác (delay, random ranges, platform selected)

---

## 3) Base UI Component Library ★ CURRENT PRIORITY

> **Đây là giai đoạn ưu tiên HIỆN TẠI.** Tất cả base components PHẢI hoàn thành trước khi xây dựng business features.
> Mọi component phải: dùng `<script setup lang="ts">`, scoped CSS, design tokens từ `style.css`.

### 3.1 Nguyên tắc thiết kế Base UI

#### Desktop-App Style (QUAN TRỌNG!)
- **Compact, dense layout** — phong cách phần mềm desktop, KHÔNG phải web app
- Font size nhỏ: 12-14px cho content, 13px cho menu items
- Padding tối thiểu: 6-12px (thay vì 16-24px như web app)
- Toolbar/Menu bar: flat buttons, thin borders
- DataGrid: spreadsheet-like, tight rows, no extra whitespace
- Modal: dialog style (WinForms-like, có thể kéo header)

#### Brand Identity (KHÔNG thay đổi)
- **Primary**: `#50a0ff` — rgb(80, 160, 255) — giữ nguyên từ bản C# gốc
- **Sidebar/Topbar**: blue background (#50a0ff), white text
- **Content**: light gray background (#f0f4f9)
- **Font**: Inter + system fallbacks (đã có trong style.css)
- **Vietnamese UI** — tất cả labels, placeholders, messages bằng tiếng Việt

#### Performance
- Virtual scrolling cho DataGrid (yêu cầu: 10,000+ rows)
- Lazy loading components (dynamic import)
- Minimal re-renders (computed, shallowRef khi cần)

### 3.2 Base Components — Danh sách đầy đủ

Tất cả trong `frontend/src/components/common/`:

#### Phase 1: Atomic Components (làm đầu tiên)

| # | Component | Props chính | Mô tả |
|---|-----------|-------------|--------|
| 1 | `BaseButton.vue` | variant (primary/secondary/danger/ghost/text), size (sm/md/lg), disabled, loading | Nút bấm với icon slot, micro-animation |
| 2 | `BaseInput.vue` | modelValue, type, label, placeholder, error, disabled, size | Input với v-model, focus ring, password toggle |
| 3 | `BaseSelect.vue` | modelValue, options, label, placeholder, disabled, size | Dropdown select, option groups |
| 4 | `BaseToggle.vue` | modelValue, label, disabled | Toggle switch (component hóa CSS .toggle hiện có) |
| 5 | `BaseCheckbox.vue` | modelValue, label, disabled, indeterminate | Checkbox v-model |
| 6 | `BaseRadio.vue` | modelValue, options, name, label, disabled | Radio group v-model |
| 7 | `BaseTabs.vue` | tabs [{key, label, icon?}], modelValue | Tab navigation, underline indicator animation |

#### Phase 2: Compound Components (refactor existing + new)

| # | Component | Trạng thái | Yêu cầu refactor/thêm |
|---|-----------|------------|------------------------|
| 8 | `BaseDataGrid.vue` | ⚠️ Có nhưng chưa dùng | ★ THÊM: virtual scrolling (10,000+ rows), column resize (drag border), column reorder, keyboard shortcuts (Ctrl+C/Space/Ctrl+A), row highlight (mousedown+drag), cell selection (Ctrl+click, Shift+range) |
| 9 | `BaseModal.vue` | ⚠️ Có nhưng chưa dùng | THÊM: draggable header, ESC close, focus trap, nested modals, loading state trên save button |
| 10 | `ContextMenu.vue` | ⚠️ Có nhưng chưa dùng | THÊM: icon support, keyboard navigation (arrow keys), submenu hover delay (200ms), section headers |
| 11 | `StatusBar.vue` | ⚠️ Có nhưng chưa dùng | THÊM: slot-based segments, progress indicator cho running jobs |
| 12 | `FormField.vue` | ⚠️ Có | THÊM: inline vs stacked layout, required indicator, help text slot |
| 13 | `GroupBox.vue` | ⚠️ Có | THÊM: collapsible option |

#### Phase 3: Advanced Components (new)

| # | Component | Mô tả |
|---|-----------|--------|
| 14 | `BaseToast.vue` | Toast notification — THAY THẾ tất cả `alert()` calls. Positions: top-right. Types: success/error/warning/info. Auto-dismiss. Stack multiple. |
| 15 | `BaseDropdown.vue` | Trigger slot + content slot. Auto-position (flip if overflow). Click outside close. |
| 16 | `BaseTooltip.vue` | Directive hoặc component. Positions: top/right/bottom/left. Show/hide delay. |
| 17 | `BaseBadge.vue` | Variants: success/warning/error/info. Dot mode. Count mode. |
| 18 | `BaseProgress.vue` | Props: value, max, variant, size, striped, animated. Label slot. |

### 3.3 Composables — Danh sách đầy đủ

Tất cả trong `frontend/src/composables/`:

| # | Composable | Trạng thái | Mô tả |
|---|------------|------------|--------|
| 1 | `useToast.ts` | ❌ Chưa có | Toast notification system — thay thế alert(). Expose: showToast(type, message, duration). |
| 2 | `useClipboard.ts` | ✅ Có | Clipboard utility (Wails fallback). Giữ nguyên. |
| 3 | `useContextMenu.ts` | ✅ Có | Context menu hook. Refactor để dùng với ContextMenu.vue mới. |
| 4 | `useSelection.ts` | ✅ Có | Row/cell selection. Refactor cho BaseDataGrid mới. |
| 5 | `useVirtualScroll.ts` | ❌ Chưa có | Virtual scrolling hook cho DataGrid >10,000 rows. |
| 6 | `useKeyboard.ts` | ❌ Chưa có | Global keyboard shortcuts management (Ctrl+C, Space, Ctrl+A, ESC). |
| 7 | `useColumnResize.ts` | ❌ Chưa có | Column drag-resize logic cho DataGrid headers. |

### 3.4 Quy tắc Base UI — BẮT BUỘC

1. **Tất cả views PHẢI dùng base components** — KHÔNG inline DataGrid, Modal, ContextMenu, StatusBar
2. **Tất cả `alert()` PHẢI thay bằng `useToast()`** — native alert cấm dùng
3. **Component props phải có TypeScript interface** — khai báo rõ ràng trong `types/ui.ts`
4. **Mỗi component có scoped CSS** — dùng CSS variables từ style.css, KHÔNG hardcode colors
5. **Mỗi component export từ barrel** — `components/common/index.ts`
6. **KHÔNG sửa `style.css` design tokens** — chỉ THÊM nếu thiếu, KHÔNG thay đổi giá trị hiện có

---

## 4) UI/UX Requirements

### 4.1 Main Layout (giữ tương tự C# version)

```
┌──────────────────────────────────────────────────────────┐
│ [Title Bar - Custom, draggable]              [_][□][✕]   │
├──────────┬───────────────────────────────────────────────┤
│          │ [Menu Bar: Cài đặt chung | Thiết lập tương   │
│  SIDEBAR │  tác | Cấu hình hiển thị | Tiện ích | ...  ] │
│          ├───────────────────────────────────────────────┤
│ Facebook │ [Action Bar: ▶Run | Category | Search/Add  ] │
│ Thiết bị ├───────────────────────────────────────────────┤
│ Youtube* │                                               │
│          │          DataGridView (Account Table)          │
│          │    (Checkbox, STT, UID, Pass, 2FA, Email,     │
│          │     Cookie, Token, Status, BM, TKQC, ...)     │
│          │                                               │
│ Version  ├───────────────────────────────────────────────┤
│ v25.04.30│ [Status Bar: Live:0 Die:0 Total:0 Selected:0]│
└──────────┴───────────────────────────────────────────────┘
```

### 4.2 DataGrid (Account Table) — Core Component

Đây là component QUAN TRỌNG NHẤT (dùng `BaseDataGrid.vue` từ Section 3):

- **~60 cột** dữ liệu (có thể ẩn/hiện qua "Cấu hình hiển thị")
- **Checkbox column** cho chọn tài khoản
- **Virtual scrolling** — PHẢI render nhanh với 10,000+ rows
- **Context menu** (right-click) dùng `ContextMenu.vue` từ Section 3
- **Status bar** dùng `StatusBar.vue` từ Section 3
- **Tìm kiếm** theo UID, Mật khẩu, Email, hoặc tìm kiếm nâng cao
- **Category** filter & management

### 4.3 Sub-Forms cần tái tạo

| Form | Chức năng | Dùng Base Component |
|---|---|---|
| `frmSetupTool` | Cài đặt chung (browser, threads, path, backup) | BaseModal, BaseTabs, FormField, BaseInput, BaseSelect, BaseToggle |
| `frmSetupInteract` | Thiết lập tương tác (delay, actions config) | BaseModal, BaseTabs, BaseRadio, BaseCheckbox, FormField |
| `frmSetupView` | Cấu hình hiển thị (ẩn/hiện cột DataGrid) | BaseModal, BaseCheckbox, GroupBox |
| `frmAddAccount` | Import tài khoản (paste, file CSV) | BaseModal, BaseInput, BaseSelect, BaseCheckbox |
| `frmAddAccountReview` | Review tài khoản trước import | BaseModal, BaseDataGrid, BaseBadge |
| `frmCategory` | Quản lý danh mục tài khoản | BaseModal, BaseDataGrid, ContextMenu |
| `frmConfigProxy` | Cấu hình proxy | BaseModal, BaseInput, BaseRadio, BaseCheckbox |
| `frmCopy` | Copy dữ liệu với tùy chọn | BaseModal, BaseSelect, BaseButton |
| `frmSearchAccounts` | Tìm kiếm nâng cao | BaseModal, BaseInput, BaseButton |
| `frmUpdateData` | Cập nhật hàng loạt dữ liệu | BaseModal, BaseSelect, BaseInput |
| `frmUpdateDatabyUID` | Cập nhật dữ liệu theo UID | BaseModal, BaseSelect, BaseInput |
| `frmBM` | Quản lý Business Manager | BaseModal, BaseTabs, BaseSelect, BaseCheckbox |
| `frmInteraction` | Cấu hình tương tác | BaseModal, BaseCheckbox, BaseRadio, GroupBox |
| `frmPage` | Quản lý Page | BaseModal, BaseSelect |
| `frmUnlockCheckpoint` | Mở checkpoint tài khoản | BaseModal, BaseRadio, BaseCheckbox, BaseInput |
| `frmChangeInformation` | Đổi thông tin tài khoản | BaseModal, BaseCheckbox, BaseButton |
| `frmDevices` | Quản lý thiết bị kết nối | BaseDataGrid, BaseButton |
| `frmAutoUpdate` | Auto-update phần mềm | BaseModal, BaseProgress, BaseButton |

### 4.4 Design Requirements

- **Desktop-native feel** — compact, dense (xem Section 3.1)
- **Light mode mặc định** — hỗ trợ dark mode
- **Custom title bar** (draggable) — minimize/maximize/close buttons
- **Responsive** — form co giãn theo kích thước window (70% x 80% screen)
- **Font**: Inter hoặc Segoe UI
- **Accent color**: `rgb(80, 160, 255)` (giữ nguyên brand color từ C#)
- **Vietnamese UI** — tất cả text mặc định bằng tiếng Việt

---

## 5) Data & Storage

### 5.1 SQLite Database

- Migrate từ C# SQLiteUtils — giữ nguyên schema khi có thể
- Backup tự động hàng ngày (configurable)
- Thread-safe access (Go's database/sql handles this)

### 5.2 Settings Storage

- JSON files trong `AppData/WeFacebook/Settings/`
- Compatible với format của C# JSON_Settings class
- KHÔNG dùng Windows Registry

### 5.3 Browser Profiles

- Chrome profiles stored per-account
- Path configurable trong Settings

---

## 6) Delivery Roadmap

| Phase | Mô tả | Ưu tiên |
|---|---|---|
| **P0** | Project skeleton + Wails setup + Main layout + Design system | ✅ Done |
| **P0.5** | ★ **BASE UI COMPONENT LIBRARY** (Section 3) — 18 components + 7 composables | 🔴 **ĐANG LÀM** |
| **P0.5a** | Phase 1: Atomic components (Button, Input, Select, Toggle, Checkbox, Radio, Tabs) | 🔴 ĐANG LÀM |
| **P0.5b** | Phase 2: Refactor compound components (DataGrid, Modal, ContextMenu, StatusBar) | ⏳ Tiếp theo |
| **P0.5c** | Phase 3: Advanced components (Toast, Dropdown, Tooltip, Badge, Progress) | ⏳ Tiếp theo |
| **P0.5d** | Tạo composables mới (useToast, useVirtualScroll, useKeyboard, useColumnResize) | ⏳ Tiếp theo |
| **P0.5e** | Refactor FacebookView.vue — tách thành sub-components, SỬ DỤNG base components | ⏳ Tiếp theo |
| **P1** | SQLite DB + Account CRUD + DataGrid data-binding | 🔥 High |
| **P2** | Settings system (3 forms) + Category management | 🔥 High |
| **P3** | Context menu actions (Select, Copy, Update, Delete) + Import/Export | 🔥 High |
| **P4** | Job system + Worker pool + Job UI | 🔧 Medium |
| **P5** | Proxy system + rotation | 🔧 Medium |
| **P6** | Browser automation (Rod/chromedp) + Login/Cookie | 🔧 Medium |
| **P7** | Facebook API service (Check Info, Interaction) | 🔧 Medium |
| **P8** | BM/Ads management | ⬜ Later |
| **P9** | TUT Premium features | ⬜ Later |
| **P10** | License/Auth system integration | ⬜ Later |
| **P11** | Auto-update system | ⬜ Later |
| **P12** | Device management | ⬜ Later |

---

## 7) Security Baseline

- KHÔNG log passwords, cookies, tokens ở dạng plaintext vào console
- SQLite DB nên consider encryption (SQLCipher) cho sensitive data
- Proxy credentials KHÔNG được lưu plaintext nếu dùng storage
- Browser profiles chứa cookies — cảnh báo user về data sensitivity
- Validate ALL inputs từ UI trước khi gửi xuống Go backend

---

## 8) Quality Gates (Must Pass Before Done)

```powershell
# Frontend (primary — giai đoạn Base UI)
cd frontend && npm run build           # Build phải pass
cd frontend && npx vue-tsc --noEmit    # TypeScript check phải pass

# Go backend (khi implement)
go fmt ./...
go vet ./...
go build -o WemakeUI.exe

# Wails (full integration)
wails build
```

KHÔNG claim success mà chưa run verification.
Trong giai đoạn Base UI: `npm run build` + `vue-tsc --noEmit` là MINIMUM.

---

## 9) Protected / Keep Areas

Treat as PROTECTED (không sửa trừ khi user yêu cầu rõ ràng):

- `REQUIREMENTS.md` (file này)
- `.agents/ANTIGRAVITY_STANDARD_PROMPT.md`
- `frontend/src/style.css` (design tokens — chỉ THÊM, KHÔNG thay đổi giá trị hiện có)
- `internal/db/migrations/**` (migration history — chỉ append, KHÔNG rewrite)
- `wails.json` (Wails config — chỉ sửa khi cần thiết)

---

## 10) Compatibility Notes

### 10.1 Migration từ C# WinForms → Base Components

| C# Component | Base UI Equivalent |
|---|---|
| `frmMain` (WinForms) | `MainLayout.vue` + `App.vue` |
| `UINavMenu` (SunnyUI) | `AppSidebar.vue` (layout/) |
| `UIDataGridView` (SunnyUI) | `BaseDataGrid.vue` (common/) |
| `TabControl` | `BaseTabs.vue` (common/) + Vue Router |
| `ContextMenuStrip` | `ContextMenu.vue` (common/) |
| `StatusStrip` | `StatusBar.vue` (common/) |
| `UIButton` | `BaseButton.vue` (common/) |
| `UITextBox` | `BaseInput.vue` (common/) |
| `UIComboBox` | `BaseSelect.vue` (common/) |
| `UICheckBox` | `BaseCheckbox.vue` (common/) |
| `UIRadioButton` | `BaseRadio.vue` (common/) |
| `UISwitch` | `BaseToggle.vue` (common/) |
| `GroupBox` | `GroupBox.vue` (common/) |
| `TooltipProvider` | `BaseTooltip.vue` (common/) |
| `ProgressBar` | `BaseProgress.vue` (common/) |
| `MessageBox.Show()` | `useToast()` composable |
| `JSON_Settings` (C#) | `internal/config/` (Go JSON) |
| `SQLiteUtils` (C#) | `internal/db/` (Go SQLite) |
| `WemakeShared` (C# DLL) | `internal/services/` (Go packages) |
| WinForms events | Wails Events + Vue reactivity |

### 10.2 Data Compatibility

- Import/Export formats PHẢI compatible với C# version
- Account data format (pipe-delimited, CSV) giữ nguyên
- JSON settings format giữ nguyên schema

---

## 11) Change Control (Protect the Core)

Nếu phải thay đổi invariant (Account schema, Job system, License check):

1. Update `REQUIREMENTS.md` (file này)
2. Tạo DB migration (nếu schema change)
3. Update TypeScript types (nếu binding change)
4. Thêm/adjust tests

Thiếu 4 bước trên → change là INVALID.

---

> END OF FILE
