import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ConfigGeneral, ConfigInteraction, IpConfig } from '../types/settings'
import {
  defaultGeneral, defaultIpConfig,
  defaultCheckInfoConfig, defaultBMInteractionConfig,
  defaultCloneFarmingConfig, defaultTUTPremiumConfig,
} from '../types/settings'
import type { ColumnConfig } from '../types/ui'
import { DEFAULT_COLUMNS } from '../types/ui'

function defaultInteraction(): ConfigInteraction {
  return {
    checkInfo: defaultCheckInfoConfig(),
    bm: defaultBMInteractionConfig(),
    page: { likePage: false, sharePage: false, commentPage: false },
    shareTKQC: { quantityPerBM: 1, receiverUid: '', shareBySpecificUid: false, bmType: '', tkqcList: [], mailType: '' },
    campaign: { campaignName: '', budget: 0, targeting: '', addCard: false },
    cloneFarming: defaultCloneFarmingConfig(),
    updateInfo: { updateName: false, updateAvatar: false, updateCover: false, updateBio: false, updateBirthday: false, updateLocation: false },
    checkpoint: { cpType: '', method: '', delay: 5 },
    accountResist: { appeal: false, verifyIdentity: false },
    tutPremium: defaultTUTPremiumConfig(),
  }
}

export const useSettingsStore = defineStore('settings', () => {
  /* ── General settings (frmSettings: 6 sections) ── */
  const general = ref<ConfigGeneral>(defaultGeneral())

  /* ── Per-provider IP configuration ── */
  const ipConfig = ref<IpConfig>(defaultIpConfig())

  /* ── Interaction settings (frmSetupInteract — 10 tabs) ── */
  const interaction = ref<ConfigInteraction>(defaultInteraction())

  /* ── DataGrid column visibility (frmSetupView) ── */
  const dgvColumns = ref<ColumnConfig[]>(DEFAULT_COLUMNS.map(c => ({ ...c })))

  /* ── Backward-compatible getters ── */
  const saveRunColumn = computed(() => general.value.saveRunColumn)
  const backupEnabled = computed(() => general.value.backupDB)
  const backupPath = ref('')

  /* ── Methods ── */
  function updateGeneral(patch: Partial<ConfigGeneral>) {
    Object.assign(general.value, patch)
  }

  function updateIpConfig(patch: Partial<IpConfig>) {
    Object.assign(ipConfig.value, patch)
  }

  function updateInteraction(patch: Partial<ConfigInteraction>) {
    Object.assign(interaction.value, patch)
  }

  function updateDgvColumns(newColumns: ColumnConfig[]) {
    dgvColumns.value = newColumns.map(c => ({ ...c }))
  }

  function resetDgvColumns() {
    dgvColumns.value = DEFAULT_COLUMNS.map(c => ({ ...c }))
  }

  function resetGeneral() {
    general.value = defaultGeneral()
  }

  function resetIpConfig() {
    ipConfig.value = defaultIpConfig()
  }

  function resetInteraction() {
    interaction.value = defaultInteraction()
  }

  return {
    // State
    general,
    ipConfig,
    interaction,
    dgvColumns,
    backupEnabled,
    backupPath,
    saveRunColumn,
    // Methods
    updateGeneral,
    updateIpConfig,
    updateInteraction,
    updateDgvColumns,
    resetDgvColumns,
    resetGeneral,
    resetIpConfig,
    resetInteraction,
  }
})
