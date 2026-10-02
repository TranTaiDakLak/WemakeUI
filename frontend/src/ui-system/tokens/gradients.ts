/**
 * ═══════════════════════════════════════════════════════════════
 *  WX UI SYSTEM — Gradient Tokens
 *  Named gradient definitions extracted from the WeExtension UI.
 * ═══════════════════════════════════════════════════════════════
 */

export const gradients = {
  // ── Brand Gradients ──────────────────────────────────
  /** Main app background (App.vue) */
  brandBg: 'linear-gradient(to right, #7ecff1, #9cc9f5, #95def5)',
  /** Header bar, dialog headers */
  brandHeader: 'linear-gradient(to right, #06b6d4, #3b82f6, #2563eb)',
  /** Login page CTA button */
  brandCta: 'linear-gradient(to right, #00d2ff, #3a7bd5, #0052D4)',
  /** Primary action buttons */
  brandButton: 'linear-gradient(to right, #06b6d4, #2563eb)',
  /** Focus accent gradient */
  brandAccent: 'linear-gradient(to right, #44c3f9, #007bff)',
  /** Nút chính "solid" (nhận diện MindAds): blue-500 → blue-600, 135° */
  primarySolid: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  primarySolidHover: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  /** Icon-tile đầu form panel: indigo → blue → cyan */
  iconTile: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)',
  /** Thanh loading "laser" */
  scanner: 'linear-gradient(to right, transparent, #06b6d4, #3b82f6)',

  // ── Semantic Dialog Header Gradients ─────────────────
  /** Success dialogs */
  successHeader: 'linear-gradient(to right, #10b981, #059669)',
  /** Error/danger dialogs */
  dangerHeader: 'linear-gradient(to right, #f43f5e, #dc2626)',
  /** Warning dialogs */
  warningHeader: 'linear-gradient(to right, #fb923c, #f59e0b)',
  /** Confirmation/question dialogs */
  questionHeader: 'linear-gradient(to right, #2563eb, #7c3aed)',
  /** Info dialogs (same as brand header) */
  infoHeader: 'linear-gradient(to right, #06b6d4, #3b82f6, #2563eb)',

  // ── Decorative ──────────────────────────────────────
  /** VIP badge */
  vipBadge: 'linear-gradient(to right, #fde68a, #facc15, #f59e0b)',
  /** Divider fade to transparent */
  dividerFade: 'linear-gradient(to right, transparent, #e5e7eb, transparent)',
  /** Gradient text fill */
  textAccent: 'linear-gradient(to right, #06b6d4, #2563eb)',
} as const

export type GradientToken = typeof gradients
