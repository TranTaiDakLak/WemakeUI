/**
 * Chart utilities — pure functions for SVG-based charts.
 * Zero deps, theme-aware via CSS variables.
 */

/* ── Default color palette ───────────────────────── */
export const CHART_PALETTE = [
  '#2563eb', // brand
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // rose
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#84cc16', // lime
] as const

export function colorAt(idx: number): string {
  return CHART_PALETTE[idx % CHART_PALETTE.length]
}

/* ── Linear scale ────────────────────────────────── */
export function scale(
  value: number,
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number,
): number {
  if (domainMax === domainMin) return rangeMin
  return rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin)
}

/* ── Build SVG path "d" for a line series ────────── */
export function linePath(
  points: Array<{ x: number; y: number }>,
): string {
  if (!points.length) return ''
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ')
}

/* ── Build SVG path "d" for area (fill below line) ── */
export function areaPath(
  points: Array<{ x: number; y: number }>,
  baseY: number,
): string {
  if (!points.length) return ''
  const top = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ')
  const last = points[points.length - 1]
  const first = points[0]
  return `${top} L ${last.x.toFixed(2)},${baseY.toFixed(2)} L ${first.x.toFixed(2)},${baseY.toFixed(2)} Z`
}

/* ── Smooth curve (Catmull-Rom → Bezier) ─────────── */
export function smoothPath(
  points: Array<{ x: number; y: number }>,
  tension = 0.5,
): string {
  if (points.length < 2) return linePath(points)
  let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) * tension / 6
    const cp1y = p1.y + (p2.y - p0.y) * tension / 6
    const cp2x = p2.x - (p3.x - p1.x) * tension / 6
    const cp2y = p2.y - (p3.y - p1.y) * tension / 6
    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`
  }
  return d
}

/* ── Pie/donut arc path ──────────────────────────── */
export function arcPath(
  cx: number, cy: number,
  rOuter: number, rInner: number,
  startAngle: number, endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, rOuter, endAngle)
  const end = polarToCartesian(cx, cy, rOuter, startAngle)
  const startInner = polarToCartesian(cx, cy, rInner, endAngle)
  const endInner = polarToCartesian(cx, cy, rInner, startAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

  if (rInner === 0) {
    // Pie slice
    return `M ${cx},${cy} L ${end.x},${end.y} A ${rOuter},${rOuter} 0 ${largeArc},0 ${start.x},${start.y} Z`
  }
  // Donut slice
  return [
    `M ${end.x},${end.y}`,
    `A ${rOuter},${rOuter} 0 ${largeArc},0 ${start.x},${start.y}`,
    `L ${startInner.x},${startInner.y}`,
    `A ${rInner},${rInner} 0 ${largeArc},1 ${endInner.x},${endInner.y}`,
    'Z',
  ].join(' ')
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number): { x: number; y: number } {
  return {
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  }
}

/* ── Nice tick computation ───────────────────────── */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) return [min]
  const range = max - min
  const step = niceStep(range / count)
  const niceMin = Math.floor(min / step) * step
  const niceMax = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = niceMin; v <= niceMax + step / 2; v += step) {
    ticks.push(Number(v.toFixed(10)))
  }
  return ticks
}

function niceStep(rough: number): number {
  const exp = Math.floor(Math.log10(Math.abs(rough)))
  const f = rough / Math.pow(10, exp)
  let nice: number
  if (f < 1.5) nice = 1
  else if (f < 3) nice = 2
  else if (f < 7) nice = 5
  else nice = 10
  return nice * Math.pow(10, exp)
}

/* ── Format number compact: 1234 → 1.2k ──────────── */
export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(1)
}
