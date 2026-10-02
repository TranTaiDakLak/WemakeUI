/**
 * useShellChrome — dữ liệu "vỏ" dùng chung cho AppPageLayout / SaasLayout:
 * chip tài khoản (lấy từ auth store), số thông báo chưa đọc, banner cập nhật demo.
 * Chỉ mock tĩnh — không gọi API/extension thật.
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useNotificationsStore } from '../../stores/notifications'
import type { TopbarUser } from '../../components/layout'

const BANNER_KEY = 'mind-demo-update-banner-dismissed'

function readDismissed(): boolean {
  try {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(BANNER_KEY) === '1'
  } catch {
    return false
  }
}
function writeDismissed() {
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(BANNER_KEY, '1')
  } catch { /* storage bị chặn → banner có thể hiện lại, không sao */ }
}

export function useShellChrome() {
  const router = useRouter()
  const auth = useAuthStore()
  const notifs = useNotificationsStore()

  const user = computed<TopbarUser | null>(() =>
    auth.user
      ? {
          name: auth.user.name,
          email: auth.user.email,
          role: auth.user.role,
          userId: 'MND-000123',
          plan: 'Pro',
          planUsed: 8,
          planLimit: 10,
          connected: true,
        }
      : null,
  )

  const unread = computed(() => notifs.unreadCount)

  /** banner cập nhật demo — dismiss được nhớ theo phiên tab */
  const bannerOpen = ref(!readDismissed())
  function onBannerDismiss() { writeDismissed() }
  function openChangelog() { void router.push('/landing/changelog') }

  function openProfile() { void router.push('/app/profile') }
  function openPricing() { void router.push('/app/pricing') }
  function openNotifications() { void router.push('/app/notifications') }
  function logout() {
    auth.logout()
    void router.push('/auth/login')
  }

  return {
    user,
    unread,
    bannerOpen,
    onBannerDismiss,
    openChangelog,
    openProfile,
    openPricing,
    openNotifications,
    logout,
  }
}
