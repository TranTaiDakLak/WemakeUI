/**
 * Helper data + tiny SVG sparkline path generator cho dashboard demo.
 * Phase 6 — không phụ thuộc chart lib.
 */

export function sparkPath(points: number[], w = 120, h = 32, pad = 2): string {
  if (!points.length) return ''
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const stepX = (w - pad * 2) / (points.length - 1 || 1)
  return points
    .map((v, i) => {
      const x = pad + i * stepX
      const y = h - pad - ((v - min) / range) * (h - pad * 2)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

export function sparkArea(points: number[], w = 120, h = 32, pad = 2): string {
  if (!points.length) return ''
  const line = sparkPath(points, w, h, pad)
  return `${line} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`
}

/* ── chuỗi mock có sẵn cho dashboard ── */
export const seriesUp = [12, 18, 16, 22, 24, 28, 30, 36, 34, 42, 48, 52]
export const seriesDown = [52, 48, 50, 44, 42, 38, 36, 32, 30, 28, 24, 22]
export const seriesFlat = [22, 24, 21, 25, 23, 26, 22, 24, 23, 25, 24, 26]
export const seriesVolatile = [28, 22, 35, 18, 40, 30, 25, 38, 32, 45, 28, 42]
