# WEMAKEUI — Demo Checklist
> Hướng dẫn demo cho cấp trên trong 5–10 phút. Cập nhật sau mỗi lần polish.
> Last updated: 2026-05-06

---

## Demo Route Flow (5 phút chuẩn)

```
/home → /auth/login → /saas/dashboard → /saas/members → /saas/transactions → /saas/settings → bell icon
```

| # | Bước | Route | Action cần bấm | Điểm nói |
|---|---|---|---|---|
| 1 | **Homepage** | `/home` | Scroll qua 4 sections, bấm "Xem demo" | "Đây là landing page dùng chung cho mọi sản phẩm. Cùng token, cùng component." |
| 2 | **Login** | `/auth/login` | Nhập email + pass → Đăng nhập | "Login có route guard — không có session thì không vào được /saas" |
| 3 | **SaaS Dashboard** | `/saas/dashboard` | Bấm "Xác nhận" 1 giao dịch → xem bell badge tăng | "KPI từ store thật. Action confirm → toast + notification đồng thời." |
| 4 | **Members CRUD** | `/saas/members` | Bấm + Thêm → fill form → Save. Rồi Edit → Delete | "CrudPage archetype. Mọi bảng CRUD trong hệ thống dùng 1 config object." |
| 5 | **Transactions** | `/saas/transactions` | Filter theo trạng thái, click detail drawer | "Filter + pagination + detail drawer — 0 code lặp." |
| 6 | **Notification Center** | (ở topbar) | Bấm bell → xem notif mới → Đánh dấu đã đọc | "Store tập trung, push từ bất kỳ action nào trong hệ thống." |
| 7 | **Settings** | `/saas/settings` | Đổi 1 field → Save | "Form section pattern — dirty tracking, save/reset per-section." |
| 8 | **Logout** | (user dropdown) | Bấm avatar → Đăng xuất | "Logout clear store → redirect về login → guard chặn /saas" |

---

## Actions đã kết nối thật

| Action | Kết quả |
|---|---|
| Login form submit | `auth.login()` → redirect `/saas/dashboard` |
| Logout | `auth.logout()` → redirect `/auth/login` |
| Confirm giao dịch | `txStatus → completed` + toast + push notification |
| Dismiss alert banner | `store.dismissAlert()` — banner biến mất |
| Dismiss notification | `store.dismiss(id)` — xoá khỏi store |
| Add/Edit/Delete member | CrudPage mock CRUD |
| Quick action buttons | Router push đến đúng route |
| KPI card click | Toast với label KPI |

---

## Điểm chứng minh Platform Value

### 1. Archetype-driven (không viết lại)
- 5 CRUD page = 5 config object, 0 dòng table code
- Mọi page dùng `CrudPage`, `FormModal`, `ConfirmDialog`

### 2. Design system là pháp luật
- Mọi màu, spacing, shadow → CSS variable
- Dark mode bật/tắt ngay trên topbar — toàn bộ system đổi theo

### 3. Store-first state
- KPI dashboard tính từ `useSaasStore` — không hardcode
- Notification center live từ `useNotificationsStore`
- Auth guard từ `useAuthStore`

### 4. Cross-platform ready
- Không hardcode DOM — cross-platform shell (web/mobile/desktop) chỉ cần wrap
- CSS token system tách rời khỏi renderer

### 5. Route guards hoạt động
- Thử navigate thẳng đến `/#/saas/dashboard` sau khi logout → bị chặn về login

---

## Known Limitations (nên nói thẳng với cấp trên)

| Limitation | Kế hoạch |
|---|---|
| Data là mock (không có real API) | useApi() composable — Phase 2 |
| Chưa có column sort trong CrudPage | Phase 4 (CrudPage V2) |
| Mobile layout chưa tối ưu | Phase 3 responsive polish |
| Không có test coverage | Phase 6 |
| i18n chưa wire vào string | Phase 6 |

---

## Platform Maturity Thật Sự (sau audit 2026-05-06)

| Hệ thống | Tình trạng | % thật |
|---|---|---|
| Route guards | ✅ DONE | 90% |
| Auth store + login/logout | ✅ DONE | 85% |
| NotificationCenter + store | ✅ DONE | 85% |
| useSaasStore → Dashboard | ✅ DONE | 85% |
| CrudPage archetype | ✅ DONE | 80% |
| Marketing homepage | ✅ DONE | 70% |
| Design token system | ✅ DONE | 85% |
| Dark mode | ✅ DONE | 85% |
| useApi() | ❌ TODO | 0% |
| Column sort | ❌ TODO | 0% |
| Test coverage | ❌ TODO | 0% |

---

## Cách demo cho cấp trên (script)

**Mở bằng:** `/#/home`

> "Đây là WemakeUI — nền tảng frontend dùng chung cho toàn công ty. Thay vì mỗi dự án build lại từ đầu, tất cả bắt từ đây."

**Scroll homepage → bấm "Xem demo"**

> "Mỗi CTA dẫn vào đúng product. Cùng design language, cùng token system."

**Tới login → điền `admin@wemakeui.vn` + `123456` → Đăng nhập**

> "Route guard — không có token thì không vào được. Sau login redirect về dashboard."

**Dashboard → bấm Xác nhận 1 giao dịch**

> "Action thật — giao dịch đổi status, toast xuất hiện, notification bell tăng."

**Bấm bell → xem notification → Đánh dấu đã đọc**

> "Notification center live từ Pinia store. Bất kỳ action nào trong hệ thống đều có thể push vào đây."

**Qua Members → Thêm thành viên → fill form → Save**

> "CrudPage archetype. Toàn bộ bảng này — search, filter, pagination, modal, drawer, delete confirm — chỉ cần 1 config object. Developer chỉ viết business logic."

**Bật Dark Mode (topbar)**

> "Design system — đổi theme là đổi toàn bộ. Không hardcode 1 màu nào."

**Logout → thử vào `/saas/dashboard` trực tiếp**

> "Guard chặn. Platform-level security."

**Thời gian:** ~7 phút. Nếu cần ngắn hơn: bỏ bước Members, chỉ làm bước 1–3–6–8.

---

## Next Roadmap (sau demo)

1. **useApi()** — mock-swappable adapter → real API
2. **Column sort** trong CrudPage
3. **Motion polish** — scroll reveal trên homepage sections, stagger trên KPI cards
4. **Mobile responsive** — breakpoint audit
5. **Test coverage** — Vitest cho archetypes
