import { isGradientBackground } from '@/lib/background-palette'

export function isGradientFill(fill?: string): boolean {
  return isGradientBackground(fill || '')
}

export function parseCssLinearGradient(css: string): {
  angle: number
  colorStops: (string | number)[]
} | null {
  const trimmed = css.trim()
  if (!trimmed.startsWith('linear-gradient')) return null

  const inner = trimmed.replace(/^linear-gradient\(/i, '').replace(/\)\s*$/, '')
  let angle = 180
  let colorsPart = inner

  const angleMatch = inner.match(/^([\d.]+)deg,\s*(.*)$/is)
  if (angleMatch) {
    angle = parseFloat(angleMatch[1])
    colorsPart = angleMatch[2]
  }

  const tokens: { color: string; offset: number }[] = []
  const re = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))(?:\s+(\d+(?:\.\d+)?%))?/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(colorsPart)) !== null) {
    tokens.push({
      color: match[1],
      offset: match[2] != null ? parseFloat(match[2]) / 100 : NaN,
    })
  }

  if (tokens.length < 2) return null

  tokens.forEach((t, i) => {
    if (Number.isNaN(t.offset)) t.offset = i / (tokens.length - 1)
  })

  const colorStops: (string | number)[] = []
  tokens.forEach(t => {
    colorStops.push(t.offset, t.color)
  })

  return { angle, colorStops }
}

/** Map CSS gradient angle to Konva linear gradient endpoints (shape-local coords). */
export function cssAngleToGradientPoints(angleDeg: number, width: number, height: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  const cx = width / 2
  const cy = height / 2
  const half =
    (Math.abs(Math.sin(rad)) * width + Math.abs(Math.cos(rad)) * height) / 2

  return {
    start: { x: cx - Math.cos(rad) * half, y: cy - Math.sin(rad) * half },
    end: { x: cx + Math.cos(rad) * half, y: cy + Math.sin(rad) * half },
  }
}

/** Konva fill props from solid hex or CSS linear-gradient string. */
export function shapeFillProps(fill: string | undefined, width: number, height: number) {
  const value = fill || '#3b82f6'

  if (!isGradientFill(value)) {
    return { fill: value } as const
  }

  const parsed = parseCssLinearGradient(value)
  if (!parsed) return { fill: '#3b82f6' } as const

  const { start, end } = cssAngleToGradientPoints(parsed.angle, width, height)

  return {
    fillLinearGradientStartPoint: start,
    fillLinearGradientEndPoint: end,
    fillLinearGradientColorStops: parsed.colorStops,
  } as const
}

/** First color stop — useful for line strokes when fill is a gradient. */
export function firstGradientColor(fill: string): string | null {
  const parsed = parseCssLinearGradient(fill)
  if (!parsed) return null
  const first = parsed.colorStops[1]
  return typeof first === 'string' ? first : null
}
