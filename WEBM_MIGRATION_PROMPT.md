# 📊 Phân Tích Dự Án WeBM & Prompt Chuyển Đổi Sang WemakeUI

---

## PHẦN 1: PHÂN TÍCH DỰ ÁN WEBM

### 1.1 Tổng Quan

| Thuộc tính | Giá trị |
|---|---|
| **Tên** | WeBM (Wemake Business Manager) |
| **Nền tảng** | C# .NET 8 WinForms |
| **UI Framework** | SunnyUI (UIForm2, UINavMenu, UITabControl...) |
| **Database** | SQLite (local) |
| **Thư viện chia sẻ** | WemakeShared, WemakeMetaKit |
| **Mục đích** | Quản lý tài khoản Facebook + Business Manager |
| **Đường dẫn** | `e:\Code\WeBM\WeBM\` |

### 1.2 Kiến Trúc Giao Diện

```
frmMain (Form chính - borderless)
├── tlp1 (TableLayoutPanel 2 cột)
│   ├── tlpMenuLeft (Sidebar trái - 150px)
│   │   ├── pnLeftHeader (Logo)
│   │   ├── navLeftMenu (UINavMenu - navigation)
│   │   └── pnLeftBottom (Version, Update)
│   │
│   └── tlpRightMain (Nội dung chính)
│       ├── pnRightTopMenu (Title bar 25px)
│       │   ├── scrollingTitle (Scrolling text)
│       │   └── tlpControlBox (Min/Max/Close)
│       │
│       └── tabMain (UITabControl - ẩn tabs)
│           ├── tabPage1Facebook → Panel → frmFacebook
│           ├── tabPage2Instagram → Panel → (chưa implement)
│           └── tabPage3Youtube → Panel → (chưa implement)
```

### 1.3 Module Facebook — frmFacebook.Core (6,467 dòng, 202KB)

#### Layout chính:
```
frmFacebook (UIForm2)
├── Menu Strip (ToolStripMenuItems)
│   ├── btnSettings → frmSettings (Cài đặt chung)
│   ├── btnSetup → frmSetup/frmCheckInfomation
│   ├── btnView → frmView/frmSetupView (Cấu hình hiển thị)
│   ├── btnEx → Tiện ích mở rộng
│   ├── btnBin → frmBin (Thùng rác)
│   ├── btnContact → Liên hệ (Zalo, Telegram, Facebook, YouTube)
│   ├── btnGetLinkBM → frmGetLinkBM
│   ├── btnAddAccountByOtherTool → frmAddDataByOtherTool
│   └── btnCheckBMVIP → frmCheckBMVIP
│
├── Action Bar
│   ├── btnTest (Chạy)
│   ├── btnCategory → frmCategory (Thư mục)
│   ├── cboSearchAccount (ComboBox tìm kiếm)
│   ├── txtSearchAccount (WMTextBox)
│   ├── btnSearch / btnAddAccount / btnStop
│   └── lblCategorySelected
│
├── dgvAccount (DataGridView chính - 50+ cột)
│   └── cmsDGV (Context Menu Strip)
│       ├── btnSelect → [Tất cả, Bôi đen, Theo trạng thái, Theo ghi chú, Theo checkpoint]
│       ├── btnUnSelectAll
│       ├── btnCopy → [UID, Mật khẩu, Full import, Email, 2FA, Cookie, Token, Status, CP, Tùy chỉnh, Get code 2FA]
│       ├── btnEditAccount
│       ├── btnDeleteAccount
│       ├── btnChecking → [Login/Cookie/Token, Check Wall, Check Info by Cookie, Check IG, Get OAuth2]
│       ├── btnMoveAccount → (Chuyển thư mục)
│       ├── btnOpenBrower → [Mở browser, Setup browser, Optimize, Delete, Clean, Close all]
│       ├── btnRequest → [Login get Cookie/Token, Check wall, ...]
│       ├── btnHotmail → [Mở Hotmail trên browser]
│       ├── btnShowADSAndBM → [Hiển thị ADS & BM, Tạo BM, Check BM, ...]
│       ├── btnOther → [Lọc trùng, Xóa cRun, Folder Log, Analytics, ...]
│       ├── btnReloadDGVAccount
│       └── btnUpdateData → [by UID, Mật khẩu, Cookie, Token, Email, 2FA, Birthday, UA, Proxy, Note]
│
└── Status Bar
    ├── Live / Die / Checkpoint / Total counts
    ├── Email / TK label
    └── Hạn sử dụng / Trạng thái
```

### 1.4 Các Form Con (Settings / Setup)

| Form | File | Chức năng | Kích thước |
|---|---|---|---|
| **frmSettings** | Settings/frmSettings.cs | Cài đặt chung (Request, Proxy, Login platform, Captcha, Backup) | 22KB |
| **frmSetupView / frmView** | Settings/frmSetupView.cs | Cấu hình hiển thị cột DataGridView (40+ checkboxes) | 11KB |
| **frmSetup** | Settings/frmSetup.cs | **Thiết lập tương tác** (form hub chứa 4 tab radio) | 10KB |
| **frmCheckInfomation** | Setup/frmCheckInfomation.cs | Kiểm tra thông tin tài khoản (sub-form của frmSetup) | 6KB + 32KB designer |
| **frmSetupionOld** | Facebook/MainFeatures/frmSetupionOld.cs | Kịch bản tương tác cũ (sub-form của frmSetup) | 8KB + 43KB designer |
| **frmBM** | Facebook/MainFeatures/frmBM.cs | Business Manager config (sub-form của frmSetup) | — |
| **frmTUTPremium** | Facebook/MainFeatures/frmTUTPremium.cs | Premium TUT features (sub-form của frmSetup) | — |
| **frmAddAccount** | Settings/frmAddAccount.cs | Thêm tài khoản mới | 52KB |
| **frmCategory** | Settings/frmCategory.cs | Quản lý thư mục | 26KB |
| **frmConfigProxy** | Settings/frmConfigProxy.cs | Cấu hình proxy | 6KB |
| **frmBin** | Other/frmBin.cs | Thùng rác (48KB logic) | 65KB designer |
| **frmCopy** | Components/Dialogs/frmCopy.cs | Sao chép tùy chỉnh | 16KB |
| **frmAutoUpdate** | Other/frmAutoUpdate.cs | Tự động cập nhật | 6KB |

### 1.5 ⭐ Thiết Lập Tương Tác — frmSetup (Form Hub)

> [!IMPORTANT]
> Đây là form quản lý trung tâm cho tất cả cấu hình tương tác. Nó hoạt động như một **tab container** chứa 4 radio buttons, mỗi radio mở 1 sub-form riêng.

#### Kiến trúc:

```
frmSetup (UIForm2 — Title: "Thiết lập tương tác", 949×718)
├── pnlHeader (76px — chứa 4 radio buttons)
│   ├── rdoCheckInfo      (Tag="01") → "Kiểm tra tài nguyên" → frmCheckInfomation
│   ├── rdoBM             (Tag="02") → "Business Manager"     → frmBM
│   ├── rdoTUTPremium     (Tag="10") → "Cá nhân"              → frmTUTPremium
│   └── rdoInteractOld    (Tag="11") → "Kịch bản cũ"          → frmSetupionOld (ẩn)
│
├── pnlMain (auto-resize — hiển thị sub-form)
└── pnlFooter (10px)
```

**Config**: `configInteraction` (JSON_Settings)
**Persist**: Mỗi sub-form implement interface `IFormSavable` { `SaveOnly()`, `SaveAndExit()` }
**Premium check**: Mỗi sub-form kiểm tra `PremiumSettings` để enable/disable tính năng

---

#### 1.5.1 Sub-form: frmCheckInfomation — "Kiểm tra tài nguyên" (Tab mặc định)

```
frmCheckInfomation (UIForm2, 948×506)
├── gbInfomation (UIGroupBox — "Thông tin tài khoản", 576×369)
│   ├── chkFullName         "Họ tên"
│   ├── chkFriends          "Bạn bè"
│   ├── chkFollower         "Theo dõi"
│   ├── chkGender           "Giới tính"
│   ├── chkBirthday         "Sinh nhật"
│   ├── chkLocation         "Location"
│   ├── chkHometown         "Quê quán"
│   ├── chkCurrentCity      "Thành phố"
│   ├── chkRequestFriends   "Lời mời kết bạn"
│   ├── chkGroup            "Nhóm"
│   ├── chkGroupManager     "Nhóm quản trị"
│   ├── chkPage             "Trang"
│   ├── chkCover            "Ảnh bìa"
│   ├── chkAvatar           "Ảnh đại diện"
│   ├── chkDateAccountCreated "Ngày tạo"
│   ├── chkEmailOther       "Mail khác"
│   ├── chkToken            "Token"
│   ├── chkPhone            "Số điện thoại"
│   ├── chkProfessional*    "Chuyên nghiệp"     (Tag=Premium)
│   ├── chkDating*          "Hẹn hò"             (Tag=Premium)
│   ├── chkSecondAccount*   "Nick phụ"            (Tag=Premium)
│   ├── chkMarketplace*     "Marketplace"         (Tag=Premium)
│   └── chkCheckPost*       "Bài viết"            (Tag=Premium)
│   (* = cần Premium / FullFunction / CheckInformation)
│
├── gbADS (UIGroupBox — "Quảng cáo và Business manager", 238×220)
│   ├── chkStatusADS        "Trạng thái quảng cáo"
│   ├── chkBM               "Business manager"
│   ├── chkTKQCFull         "Toàn bộ tài khoản quảng cáo"
│   ├── chkTKQCAccount      "Tài khoản quảng cáo chính"
│   └── chkChatSupport      "Check chat support"
│
├── gbPayment (UIGroupBox — "Lập hóa đơn && thanh toán", 238×145)
│   ├── cboPickTimePayment  ["Hôm nay", "Hôm qua", "7 ngày gần nhất"]
│   ├── chkPaymentAll       "Toàn bộ"
│   └── chkPaymentID        "Tài khoản quảng cáo (N)"  → click mở form nhập danh sách ID
│
├── btnSave (Lưu → SaveAndExit)
└── btnClose (Đóng → đóng cả frmSetup cha)
```

**Đặc biệt:**
- Context menu "Chọn tất cả / Bỏ chọn tất cả" trên gbInfomation
- `chkTKQCFull` và `chkTKQCAccount` loại trừ nhau (mutual exclusive)
- `chkPaymentAll` tắt `chkPaymentID` khi được chọn

---

#### 1.5.2 Sub-form: frmSetupionOld — "Kịch bản tương tác" (Ẩn, Tag="11")

```
frmSetupionOld (UIForm2, 948×581, Title: "Tương tác kịch bản")
├── InteractgrpCloneFarming (UIGroupBox, 886×431)
│   ├── ── KẾT BẠN ──
│   │   ├── InteractchkCloneFarmingAddFriend     "Gửi lời mời kết bạn theo UID"
│   │   │   └── uiGroupBox9 → InteractlblCloneFarmingUIDAddFriend "ID gửi lời mời chỉ định (N):"
│   │   │                    → InteractbtnCloneFarmingUIDAddFriend [nút mở form nhập UID]
│   │   ├── InteractchkCloneFarmingAcceptFriend   "Chấp nhận lời mời kết bạn theo UID"
│   │   │   └── uiGroupBox5 → InteractlblCloneFarmingUIDAcceptFriend
│   │   │                    → InteractbtnCloneFarmingUIDAcceptFriend
│   │
│   ├── ── VÔ HIỆU HÓA ──
│   │   ├── InteractchkCloneFarmingDisable        "Vô hiệu hóa TK"
│   │   ├── InteractchkCloneFarmingDisable30day   "Vô hiệu hóa TK Vĩnh Viễn"
│   │   └── InteractchkCloneFarmingUnlockDisable  "Mở vô hiệu hóa TK"
│   │
│   ├── ── TUT ──
│   │   ├── InteractchkRegIG                      "Tut In Tiền"
│   │   └── chkWhatApp                            "Tut In Tiền v2.0"
│   │
│   ├── ── KICK ──
│   │   ├── InteractchkKick250                    "Kick TKCN 250"
│   │   │   ├── InteracttxtIntKich250              [Số lần đóng TKQC] (number)
│   │   │   ├── InteracttxtDelayKick250From        [Delay From] (number)
│   │   │   └── InteracttxtDelayKick250To          [Delay To] (number)
│   │   ├── chkKickBM3                            "Kick BM3"
│   │   └── chkAddBtn                             "Add btn"
│   │
│   ├── ── QUÉT QUẢNG CÁO ──
│   │   ├── InteractchkScanPageIdinadlibrary      "Quét ID Page trong thư viện quảng cáo"
│   │   │   └── InteracttxtKeywords               [Từ khóa] (text)
│   │   └── InteractchkScanPageID                 "Quét thư viện quảng cáo của trang"
│   │       ├── InteractlblIdPageAds              "ID Page (N):"
│   │       ├── InteractbtnIdPageAds              [nút mở form nhập Page ID]
│   │       └── InteracttxtnumPagesPerThread      [Số page /ID xử lý] (number)
│   │
│   ├── ── KIỂM TRA ──
│   │   ├── chkPassFB                             "Pass FB"
│   │   └── chkMailFB                             "Mail liên kết"
│   │
│   └── InteracttxtUIDPost                        [ID bài viết] (text)
│
├── btnSave (cần Premium.Interact) → SaveAndExit()
└── btnClose → đóng cả frmSetup cha
```

**Validation logic** (CheckShareInteractCondition):
- Nếu `InteractchkCloneFarmingAddFriend` checked → kiểm tra danh sách UID add friend > 0
- Nếu `InteractchkCloneFarmingAcceptFriend` checked → kiểm tra danh sách UID accept > 0
- Nếu `InteractchkKick250` checked → kiểm tra "Số lần đóng TKQC" + "Delay mỗi lần" không rỗng
- Nếu `InteractchkScanPageID` checked → kiểm tra danh sách ID Page > 0 + "Số page /ID xử lý" không rỗng
- Nếu `InteractchkScanPageIdinadlibrary` checked → kiểm tra "Từ khóa" không rỗng

---

#### 1.5.3 Sub-form: frmBM — "Business Manager" (Tag="02")

Cấu hình Business Manager operations. Chi tiết tương tự frmCheckInfomation nhưng tập trung vào BM.

#### 1.5.4 Sub-form: frmTUTPremium — "Cá nhân" (Tag="10")

Premium TUT features dành cho người dùng đã kích hoạt premium.

### 1.5 Các Form BM (Business Manager)

| Form | Chức năng |
|---|---|
| frmCreateBM | Tạo Business Manager |
| frmChangeBMShare | Đổi BM Share |
| frmCheckBM | Kiểm tra BM |
| frmCreateTKQCBM | Tạo tài khoản quảng cáo BM |
| frmGetLinkBM | Lấy link BM |
| frmReceiveBM | Nhận BM |
| frmOutBM | Ra khỏi BM |
| frmResBM | Kết quả BM |
| frmCreateBMVerification | Xác minh BM |
| frmCreateBMTUT | Tạo BM TUT |

### 1.6 Các Form TUT (Tutorial/Auto Actions)

| Form | Chức năng |
|---|---|
| frmTUTNolimit250 | TUT Nolimit 250 (92KB designer!) |
| frmTUTBM5 | TUT BM5 |
| frmTUTActiveBM10 | Kích hoạt BM10 |
| frmTUTActiveBM2500 | Kích hoạt BM2500 |
| frmTUTLgbt | TUT LGBT |
| frmTUTDivideAdAccount | Chia tài khoản quảng cáo |
| frmTUTRegAdAccountBM21072025 | Đăng ký TKQC BM |
| frmTUTPremium | Premium features |
| frmBM | BM chính |

### 1.7 Custom Controls

| Control | File | Chức năng |
|---|---|---|
| WMButton | Controls/WMButton.cs (5KB) | Button tùy chỉnh với animation |
| WMTextBox | Controls/WMTextBox.cs (33KB) | TextBox tùy chỉnh |
| WMComboBox | Controls/WMComboBox.cs (10KB) | ComboBox tùy chỉnh |
| WMRadioButton | Controls/WMRadioButton.cs (7KB) | RadioButton tùy chỉnh |
| WMToggleButton | Controls/WMToggleButton.cs (4KB) | Toggle switch |
| WMTutorialButton | Controls/WMTutorialButton.cs (13KB) | Nút hướng dẫn |
| WMCustomLabel | Controls/WMCustomLabel.cs (4KB) | Label tùy chỉnh |
| CustomPictureBox | Controls/CustomPictureBox.cs | PictureBox tùy chỉnh |

### 1.8 DataGridView Columns (~60 cột)

```
cChose, cSTT, cID, cUID, cFullData, cPassword, c2FA, cEmail, cPassEmail,
cEmailRecovery, cCookie, cToken, cStatusImage, cStatus, cStatus282,
cStatusADS, cBM, cTKQC, cChatSupport, cFullName, cFriends, cFollower,
cPost, cGender, cBirthday, cLocation, cHometown, cCurrentCity,
cFriendsRequest, cDateCreate, cGroups, cGroupsAdmin, cPage, cPageAdmin,
cAvatar, cCover, cProfessional, cDating, c2Account, cMarketplace,
cEmailOther, cPhone, cProxy, cUserAgent, cBackupChrome, cBackupRequest,
cNote, cNoteRun, cDateImport, cCategory, cClientID, cRefreshToken,
cOAuth2, cLastRunRequest, cRunRequest, cCookieAndroid, cCookieIOS,
cCookieInsta, cCookieOther, cTokenAndroid, cTokenIOS, cTokenInsta,
cTokenEAAG, cTokenOther, cToken001, cNoteSystem, cUAAndroid, cUAIOS, cRun
```

### 1.9 Premium Features System

| ID | Chức năng | Ghi chú |
|---|---|---|
| 10 | FullFunction | Toàn bộ tính năng |
| CheckInformation | Kiểm tra thông tin | |
| Interact | Tương tác | |
| BM | Business Manager | |
| ActiveXMDN | Kích hoạt XMDN | |
| AdAccount | Tài khoản quảng cáo | |
| TUTNlm250 | TUT Nolimit 250 | |
| TUTLgbt | TUT LGBT | |
| TUTBM5 | TUT BM5 | |
| TUTBM7 | TUT BM7 | |
| TUTBMUnlimited072025 | TUT BM Unlimited | |
| TUTDivideUnlimited | TUT Chia Unlimited | |
| TUTBMKick3_5 | TUT BM Kick 3-5 | |
| TUTActiveBM10 | Kích hoạt BM10 | |

### 1.10 Proxy System

> Hỗ trợ 10+ nguồn proxy:
> - ShopLike, MinProxy, Tinsoft, WwProxy, NetProxy
> - Gigabyte, Popular, DanCu, Farm, Xproxy
> - FTP FPT, HMA VPN, Proxy Rotate Queue

### 1.11 Kiến Trúc Dữ Liệu

**SQLite Tables:**
- `accounts` — bảng chính (~70 fields)
- `category` — thư mục/nhóm tài khoản
- `JSON_Settings` — config files (configGeneral, configInteraction, configBrowser, configdgvView)

---

## PHẦN 2: SO SÁNH WEBM ↔ WEMAKEUI HIỆN TẠI

| Thành phần | WeBM (C# WinForms) | WemakeUI (Vue 3 / Wails) | Cần làm |
|---|---|---|---|
| **Sidebar** | UINavMenu (dynamically loaded, only Facebook) | Vue Sidebar (FB/IG/YT/Zalo/Devices) | ✅ Đã có |
| **Menu Strip** | ToolStripMenuItems (6 nút + icons) | FacebookMenuStrip.vue (6 nút SVG) | ✅ Đã có |
| **Action Bar** | Chạy/Thư mục/Tìm kiếm/Thêm TK/Dừng | FacebookActionBar.vue | ✅ Đã có |
| **DataGrid** | DataGridView (~60 cột, SQLite data) | Mock table (~15 cột, hardcoded) | ⚠️ Cần mở rộng đến 60+ cột |
| **Context Menu** | ContextMenuStrip (13 nhóm, 40+ submenu, icons) | dgv-ctx div (13 nhóm, no icons) | ⚠️ Cần thêm icons + submenus |
| **Settings Modal** | frmSettings (22KB, nhiều GroupBox/tabs) | SetupToolModal.vue | ⚠️ Cần mapping đầy đủ settings |
| **Display Config** | frmSetupView/frmView (40+ checkboxes, 4 groups) | SetupViewModal.vue | ✅ Đã có |
| **Add Account** | frmAddAccount (52KB, complex validation) | Chưa implement | ❌ Cần tạo mới |
| **Category Mgmt** | frmCategory (26KB, CRUD) | Chưa implement | ❌ Cần tạo mới |
| **Proxy Config** | frmConfigProxy (6KB) | Chưa implement | ❌ Cần tạo mới |
| **Thùng rác** | frmBin (48KB logic, 65KB designer) | TrashModal.vue (stub) | ❌ Cần implement |
| **Copy Dialog** | frmCopy (16KB, dạng form riêng) | CopyModal.vue (stub) | ❌ Cần implement |
| **BM Features** | 10 forms (tạo/check/nhận/ra BM) | Chưa implement | ❌ Cần tạo mới |
| **TUT Features** | 7 forms (TUT automation) | Chưa implement | ❌ Cần tạo mới |
| **Auto Update** | frmAutoUpdate | Chưa implement | ❌ Cần tạo mới |
| **Login** | frmLogin (21KB) | LoginView.vue | ✅ Đã có |
| **Status Bar** | Labels (Live/Die/CP/Total/Email/HSD) | StatusBar section | ✅ Đã có |
| **Proxy Management** | 10+ providers, complex queue/semaphore | Chưa implement | ❌ Backend logic |
| **Premium System** | 14 feature flags, time-based expiry | Chưa implement | ❌ Backend logic |

---

## PHẦN 3: PROMPT CHUYỂN ĐỔI GIAO DIỆN

```
# PROMPT: Chuyển Đổi Giao Diện WeBM → WemakeUI

## BỐI CẢNH

Bạn đang phát triển WemakeUI - ứng dụng desktop-app sử dụng Wails (Go backend) + Vue 3 
(Composition API, TypeScript, <script setup>). Dự án đã có Base UI hoàn chỉnh với:
- Layout: Sidebar + MainLayout (MenuStrip → ActionBar → DataGrid → StatusBar)
- Base Components: BaseButton, BaseInput, BaseSelect, BaseToggle, BaseCheckbox, BaseRadio,
  BaseTabs, BaseDataGrid, BaseModal, ContextMenu, StatusBar, FormField, GroupBox,
  BaseToast, BaseDropdown, BaseTooltip, BaseBadge, BaseProgress
- Composables: useToast, useClipboard, useContextMenu, useSelection
- 5 Views: Facebook, Instagram, YouTube, Zalo, Devices
- Style: style.css (design tokens, compact desktop-app style, Vietnamese UI)

## MỤC TIÊU

Chuyển đổi TOÀN BỘ giao diện và chức năng UI từ WeBM (C# WinForms) sang WemakeUI. 
WeBM là ứng dụng quản lý Facebook Business Manager đang production.

## QUY TẮC BẮT BUỘC

1. **KHÔNG sửa style.css** — file này protected
2. **KHÔNG dùng inline components** — tất cả components phải nằm trong /components/
3. **KHÔNG dùng alert()** — dùng useToast()
4. **Vietnamese UI** — tất cả labels, tooltips, messages bằng tiếng Việt
5. **Desktop-app style** — compact, dense, font nhỏ (12px body), padding tối thiểu
6. **Component-first** — mọi view phải sử dụng base components
7. **TypeScript** — strict types cho tất cả props, emits, stores
8. **Verify mỗi phase**: `npx vue-tsc --noEmit && npx vite build`

## CẤU TRÚC THƯ MỤC

```
frontend/src/
├── components/
│   ├── common/          # Base UI components (ĐÃ CÓ)
│   ├── facebook/        # Facebook-specific components
│   │   ├── FacebookMenuStrip.vue   (ĐÃ CÓ - CẦN MỞ RỘNG)
│   │   ├── FacebookActionBar.vue   (ĐÃ CÓ - CẦN MỞ RỘNG)
│   │   ├── SetupToolModal.vue      (ĐÃ CÓ - CẦN IMPLEMENT ĐẦY ĐỦ)
│   │   ├── SetupInteractModal.vue  (ĐÃ CÓ - CẦN IMPLEMENT)
│   │   ├── SetupViewModal.vue      (ĐÃ CÓ - ĐÃ IMPLEMENT)
│   │   ├── CopyModal.vue           (ĐÃ CÓ - CẦN IMPLEMENT)
│   │   ├── UtilsModal.vue          (ĐÃ CÓ - CẦN IMPLEMENT)
│   │   ├── TrashModal.vue          (ĐÃ CÓ - CẦN IMPLEMENT)
│   │   ├── ContactModal.vue        (ĐÃ CÓ - CẦN IMPLEMENT)
│   │   ├── AddAccountModal.vue     (CẦN TẠO MỚI)
│   │   ├── CategoryModal.vue       (CẦN TẠO MỚI)
│   │   ├── ProxyConfigModal.vue    (CẦN TẠO MỚI)
│   │   ├── BrowserSettingsModal.vue (CẦN TẠO MỚI)
│   │   ├── UpdateDataModal.vue     (CẦN TẠO MỚI)
│   │   └── index.ts
│   ├── bm/              # Business Manager components (CẦN TẠO MỚI)
│   │   ├── CreateBMModal.vue
│   │   ├── CheckBMModal.vue
│   │   ├── ReceiveBMModal.vue
│   │   ├── CreateTKQCModal.vue
│   │   ├── GetLinkBMModal.vue
│   │   └── index.ts
│   └── tut/             # TUT automation components (CẦN TẠO MỚI)
│       ├── TUTPremiumModal.vue
│       ├── TUTNolimit250Modal.vue
│       └── index.ts
├── views/
│   └── FacebookView.vue  (ĐÃ CÓ - CẦN REFACTOR)
├── stores/
│   ├── app.ts            (ĐÃ CÓ)
│   ├── accounts.ts       (CẦN TẠO - Pinia store cho tài khoản)
│   ├── settings.ts       (CẦN TẠO - Pinia store cho cài đặt)
│   ├── categories.ts     (CẦN TẠO - Pinia store cho thư mục)
│   └── premium.ts        (CẦN TẠO - Pinia store cho premium features)
└── types/
    ├── account.ts         (ĐÃ CÓ - CẦN MỞ RỘNG ĐẾN 60+ FIELDS)
    ├── settings.ts        (ĐÃ CÓ)
    ├── bm.ts              (CẦN TẠO)
    └── premium.ts         (CẦN TẠO)
```

## PHASES THỰC HIỆN

### PHASE 1: Mở Rộng DataGrid (60+ cột)
**Mục tiêu**: Khai báo đầy đủ tất cả cột giống WeBM

1. Cập nhật `types/account.ts` — thêm toàn bộ 70 fields từ bảng `accounts`:
   ```typescript
   interface FacebookAccount {
     id: number; uid: string; full_data: string; password: string;
     privatekey: string; email: string; passemail: string; emailrecovery: string;
     cookie: string; token: string; status: string; status282: string;
     status_ads: string; bm: string; tkqc: string; check_chat_support: string;
     full_name: string; count_friends: number; count_followers: number;
     count_post: number; gender: string; birthday: string; location: string;
     hometown: string; currentcity: string; count_friendsrequest: number;
     datecreate: string; count_groups: number; count_groups_admin: number;
     count_page: number; count_page_admin: number; avatar: string;
     cover: string; professional: string; dating: string;
     count_2account: number; marketplace: string; emailother: string;
     phone: string; proxy: string; useragent_request: string;
     backup_chrome: string; backup_request: string; note: string;
     note_run: string; dateimport: string; nameCategory: string;
     client_id: string; refresh_token: string; oauth2: string;
     lastrun_request: string; run_request: string;
     cookie_android: string; cookie_ios: string; cookie_insta: string;
     cookie_other: string; token_android: string; token_ios: string;
     token_insta: string; token_eaag: string; token_other: string;
     token_001: string; note_system: string;
     useragent_android: string; useragent_ios: string;
     // UI state
     chose: boolean; highlighted: boolean;
   }
   ```
2. Cập nhật `SetupViewModal.vue` — match all WeBM checkbox groups
3. DataGrid hiển thị theo visibility config

### PHASE 2: Settings Modal Đầy Đủ (frmSettings → SetupToolModal)
**Mapping WeBM → WemakeUI:**

| GroupBox WeBM | Section WemakeUI |
|---|---|
| Chung (Số luồng, Nghỉ giữa request) | CHUNG |
| Kiểm tra thông tin (Số luồng check) | KIỂM TRA THÔNG TIN |
| Dạng đăng nhập (FB/IG/BM radio) | DẠNG ĐĂNG NHẬP |
| Khác (Lưu cột chạy, Backup DB) | KHÁC |
| Captcha (2captcha/anticaptcha, API key) | CAPTCHA |
| Đổi IP (Check IP, Delay, Loại) | ĐỔI IP |

### PHASE 3: Add Account Modal (frmAddAccount → AddAccountModal)
- Import dạng: UID|Pass|2FA|Email|PassEmail|Cookie|Token
- Preview trước khi import
- Chọn thư mục

### PHASE 4: Category Modal (frmCategory → CategoryModal)
- CRUD thư mục
- Drag-drop sắp xếp
- Gán/chuyển tài khoản giữa thư mục

### PHASE 5: Context Menu Hoàn Chỉnh
- Thêm icons (SVG) cho tất cả menu items theo WeBM
- Implement tất cả submenus:
  - Chọn: Tất cả, Bôi đen, Theo trạng thái, Theo ghi chú, Theo checkpoint
  - Copy: UID, Mật khẩu, Full import, Email, 2FA, Cookie, Token, Status, CP, Tùy chỉnh, Get code 2FA
  - Sửa / Xóa / Kiểm tra / Chuyển dữ liệu
  - Browser: Mở, Setup, Optimize, Delete, Clean, Close all
  - Request: Login Cookie/Token, Check wall, Check info by Cookie, Check IG, Get OAuth2
  - Hotmail: Mở trên browser
  - ADS & BM: Hiển thị, Tạo BM, Check BM, Tạo TKQC, ...
  - Other: Lọc trùng, Xóa cRun, Folder Log, Analytics
  - Update Data: by UID, Mật khẩu, Cookie, Token, Email, 2FA, Birthday, UA, Proxy, Note

### PHASE 6: BM Features (10 modals)
Tạo các modal cho Business Manager operations:
- CreateBMModal, CheckBMModal, ReceiveBMModal, ChangeBMShareModal
- CreateTKQCModal, GetLinkBMModal, OutBMModal, ResBMModal
- CreateBMVerificationModal, CreateBMTUTModal

### PHASE 7: Trash & Copy Modals
- **TrashModal**: DataGrid hiển thị tài khoản đã xóa, khôi phục/xóa vĩnh viễn
- **CopyModal**: Form sao chép tùy chỉnh với nhiều format options

### PHASE 8: Pinia Stores
```typescript
// stores/accounts.ts
const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<FacebookAccount[]>([])
  const selectedIds = ref<Set<number>>(new Set())
  const highlightedIds = ref<Set<number>>(new Set())
  const currentCategory = ref<string>('all')
  const searchQuery = ref('')
  const searchField = ref('uid')
  // CRUD, batch operations, filters
})

// stores/settings.ts  
const useSettingsStore = defineStore('settings', () => {
  const general = ref<GeneralSettings>({...})
  const interaction = ref<InteractionSettings>({...})
  const browser = ref<BrowserSettings>({...})
  const dgvView = ref<DgvViewSettings>({...})
})

// stores/categories.ts
const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const selectedCategoryIds = ref<string[]>([])
})

// stores/premium.ts
const usePremiumStore = defineStore('premium', () => {
  const features = ref<PremiumFeatures>({...})
  const isExpired = ref(false)
  const expireDate = ref('')
})
```

### PHASE 9: Refactor FacebookView.vue
- Break down từ file monolithic (hiện ~500 dòng) thành components
- Sử dụng Pinia stores thay mock data
- Wire up tất cả modals và context menu actions

### PHASE 10: Auto Update System
- Version check UI
- Download progress
- Force update support

## MẪU REFERENCES

### Context Menu Item với Icon (SVG inline):
```vue
<button class="dgv-ctx-item" @click="ctxCopyUID">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
       stroke="currentColor" stroke-width="1.8">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
  <span>Sao chép UID</span>
</button>
```

### GroupBox trong Modal:
```vue
<div class="group-box">
  <h4 class="group-title">CHUNG</h4>
  <FormField label="Số luồng Request">
    <BaseInput v-model="settings.threadCount" type="number" />
  </FormField>
  <FormField label="Nghỉ giữa request (ms)">
    <BaseInput v-model="settings.delayMs" type="number" />
  </FormField>
</div>
```

## QUALITY GATES

1. `npx vue-tsc --noEmit` — 0 errors
2. `npx vite build` — build thành công
3. Mỗi modal phải có nút "Lưu" + "Đóng"
4. Mỗi modal phải đóng bằng ESC hoặc click overlay
5. Context menu entries phải có icon SVG 16x16
6. DataGrid phải hỗ trợ virtual scroll khi > 1000 rows
7. Tất cả text UI phải là tiếng Việt
```

---

## PHẦN 4: THỨ TỰ ƯU TIÊN

> [!IMPORTANT]
> Thực hiện theo thứ tự ưu tiên này để đảm bảo giá trị sử dụng sớm nhất:

| Ưu tiên | Phase | Lý do |
|---|---|---|
| **P0** | Phase 1: Mở rộng DataGrid | Nền tảng cho mọi thứ |
| **P0** | Phase 8: Pinia Stores | Tách logic khỏi views |
| **P0** | Phase 9: Refactor FacebookView | Prerequisite cho tất cả |
| **P1** | Phase 2: Settings Modal | Cần thiết để chạy tool |
| **P1** | Phase 3: Add Account | Core flow |
| **P1** | Phase 4: Category | Core flow |
| **P1** | Phase 5: Context Menu | UX cốt lõi |
| **P2** | Phase 7: Trash & Copy | Workflow phụ |
| **P2** | Phase 6: BM Features | Premium features |
| **P3** | Phase 10: Auto Update | Maintenance |
