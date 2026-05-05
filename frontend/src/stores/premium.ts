import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/** Feature IDs matching WeBM premium feature flags */
export type PremiumFeatureId =
  | 'check_info'
  | 'check_live'
  | 'interact_like'
  | 'interact_comment'
  | 'interact_share'
  | 'interact_poke'
  | 'interact_add_friend'
  | 'interact_follow'
  | 'interact_join_group'
  | 'interact_react'
  | 'create_bm'
  | 'create_tkqc'
  | 'update_data'
  | 'auto_update'

export interface PremiumFeature {
  id: PremiumFeatureId
  label: string
  enabled: boolean
}

export const usePremiumStore = defineStore('premium', () => {
  /* ── State ── */
  const features = ref<PremiumFeature[]>([
    { id: 'check_info', label: 'Kiểm tra thông tin', enabled: true },
    { id: 'check_live', label: 'Kiểm tra sống/chết', enabled: true },
    { id: 'interact_like', label: 'Tự động like', enabled: true },
    { id: 'interact_comment', label: 'Tự động comment', enabled: true },
    { id: 'interact_share', label: 'Tự động share', enabled: true },
    { id: 'interact_poke', label: 'Tự động poke', enabled: true },
    { id: 'interact_add_friend', label: 'Tự động kết bạn', enabled: true },
    { id: 'interact_follow', label: 'Tự động theo dõi', enabled: true },
    { id: 'interact_join_group', label: 'Tự động tham gia nhóm', enabled: true },
    { id: 'interact_react', label: 'Tự động react', enabled: true },
    { id: 'create_bm', label: 'Tạo Business Manager', enabled: true },
    { id: 'create_tkqc', label: 'Tạo tài khoản quảng cáo', enabled: true },
    { id: 'update_data', label: 'Cập nhật dữ liệu hàng loạt', enabled: true },
    { id: 'auto_update', label: 'Tự động cập nhật phần mềm', enabled: true },
  ])

  const expireDate = ref('2026-12-31T23:59:59Z')
  const licenseKey = ref('MOCK-LICENSE-KEY-2026')

  /* ── Computed ── */
  const isExpired = computed(() => new Date(expireDate.value) < new Date())

  const enabledFeatures = computed(() =>
    features.value.filter(f => f.enabled).map(f => f.id)
  )

  /* ── Methods ── */
  function hasFeature(featureId: PremiumFeatureId): boolean {
    if (isExpired.value) return false
    return features.value.find(f => f.id === featureId)?.enabled ?? false
  }

  function setFeatureEnabled(featureId: PremiumFeatureId, enabled: boolean) {
    const feature = features.value.find(f => f.id === featureId)
    if (feature) feature.enabled = enabled
  }

  function setExpireDate(date: string) {
    expireDate.value = date
  }

  return {
    // State
    features,
    expireDate,
    licenseKey,
    // Computed
    isExpired,
    enabledFeatures,
    // Methods
    hasFeature,
    setFeatureEnabled,
    setExpireDate,
  }
})
