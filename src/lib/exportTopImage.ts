import { TOP_COLUMNS_CHOICES, type Top, type TopColumnsPerRow, type TopEntry } from '@/types'
import { cardCoverUrl } from '@/lib/coverUrl'

const COLORS = {
  bg: '#080c1b',
  surface: 'rgb(28, 36, 64)',
  line: 'rgba(125, 201, 232, 0.22)',
  ink: '#e8eef8',
  muted: '#9aabc4',
  amber: '#f3e098',
  accent: '#7dc9e8',
  accentSoft: 'rgba(125, 201, 232, 0.35)',
}

const STORAGE_KEY = 'vgc-top-export-layers'

export type TopExportColumns = TopColumnsPerRow

export const TOP_EXPORT_COLUMN_CHOICES = TOP_COLUMNS_CHOICES
export const DEFAULT_TOP_EXPORT_COLUMNS: TopExportColumns = 5

export type TopExportLayers = {
  rank: boolean
  name: boolean
  cover: boolean
  release: boolean
}

export type TopExportOptions = TopExportLayers & {
  columns: TopExportColumns
}

export const ALL_TOP_EXPORT_LAYERS: TopExportLayers = {
  rank: true,
  name: true,
  cover: true,
  release: true,
}

export const DEFAULT_TOP_EXPORT_OPTIONS: TopExportOptions = {
  ...ALL_TOP_EXPORT_LAYERS,
  columns: DEFAULT_TOP_EXPORT_COLUMNS,
}

export function hasAnyExportLayer(layers: TopExportLayers): boolean {
  return layers.rank || layers.name || layers.cover || layers.release
}

function parseColumns(value: unknown): TopExportColumns {
  return value === 5 || value === 10 || value === 15 || value === 20
    ? value
    : DEFAULT_TOP_EXPORT_COLUMNS
}

export function readExportOptions(): TopExportOptions {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { ...DEFAULT_TOP_EXPORT_OPTIONS }
    const parsed = JSON.parse(stored) as Partial<TopExportOptions>
    return {
      rank: parsed.rank !== false,
      name: parsed.name !== false,
      cover: parsed.cover !== false,
      release: parsed.release !== false,
      columns: parseColumns(parsed.columns),
    }
  } catch {
    return { ...DEFAULT_TOP_EXPORT_OPTIONS }
  }
}

export function writeExportOptions(options: TopExportOptions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
  } catch {
    /* ignore */
  }
}

type Density = 'comfortable' | 'dense' | 'compact'

function densityForColumns(columns: number): Density {
  if (columns >= 15) return 'compact'
  if (columns >= 10) return 'dense'
  return 'comfortable'
}

function layoutForColumns(columns: TopExportColumns) {
  switch (columns) {
    case 5:
      return { cardW: 220, gap: 16 }
    case 10:
      return { cardW: 140, gap: 12 }
    case 15:
      return { cardW: 108, gap: 10 }
    case 20:
      return { cardW: 84, gap: 8 }
  }
}

function apiBases(): string[] {
  const configured = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
  const bases = new Set<string>()
  bases.add('')
  if (configured) bases.add(configured)
  if (typeof window !== 'undefined') {
    bases.add(window.location.origin)
  }
  return [...bases]
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

async function fetchCoverDataUrl(coverUrl: string): Promise<string | null> {
  for (const base of apiBases()) {
    const endpoint = `${base}/api/image-proxy?url=${encodeURIComponent(coverUrl)}&format=dataurl`
    try {
      const res = await fetch(endpoint)
      if (!res.ok) continue
      const data = (await res.json()) as { dataUrl?: string }
      if (data?.dataUrl?.startsWith('data:image/')) return data.dataUrl
    } catch {
      /* try next base */
    }
  }
  return null
}

async function loadCover(
  cover: string | null | undefined,
): Promise<HTMLImageElement | null> {
  if (!cover) return null

  const candidates = [cardCoverUrl(cover) ?? cover, cover].filter(
    (url, i, arr): url is string => Boolean(url) && arr.indexOf(url) === i,
  )

  for (const direct of candidates) {
    const dataUrl = await fetchCoverDataUrl(direct)
    if (dataUrl) {
      const img = await loadImage(dataUrl)
      if (img) return img
    }
  }

  return null
}

function slugify(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'top'
  )
}

function truncate(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let out = text
  while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) {
    out = out.slice(0, -1)
  }
  return `${out}…`
}

async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load('600 40px Rationale'),
      document.fonts.load('700 15px "Source Sans 3"'),
      document.fonts.load('600 18px "Source Sans 3"'),
      document.fonts.load('400 14px "Source Sans 3"'),
    ])
  } catch {
    /* ignore */
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function cardMetrics(layers: TopExportLayers, density: Density, cardW: number) {
  const showFooter = layers.name || layers.release
  const bannerOnly = layers.rank && !layers.cover && !showFooter
  const bannerH = layers.rank
    ? density === 'compact'
      ? bannerOnly
        ? 40
        : 22
      : density === 'dense'
        ? bannerOnly
          ? 56
          : 28
        : bannerOnly
          ? 64
          : 32
    : 0
  const coverH = layers.cover ? Math.round((cardW * 4) / 3) : 0
  let footerH = 0
  if (showFooter) {
    const both = layers.name && layers.release
    footerH =
      density === 'compact'
        ? both
          ? 48
          : 34
        : density === 'dense'
          ? both
            ? 64
            : 44
          : both
            ? 72
            : 48
  }
  return { bannerH, coverH, footerH, cardH: bannerH + coverH + footerH }
}

export async function exportTopImage(
  top: Top,
  options: TopExportOptions = DEFAULT_TOP_EXPORT_OPTIONS,
): Promise<void> {
  const { columns, ...layers } = options
  const entries = [...top.entries].sort((a, b) => a.rank - b.rank)
  if (entries.length === 0) {
    throw new Error('Ajoutez au moins un jeu avant d’exporter.')
  }
  if (!hasAnyExportLayer(layers)) {
    throw new Error('Choisissez au moins un élément à exporter.')
  }

  await ensureFonts()

  const cols = Math.min(columns, Math.max(1, entries.length))
  const density = densityForColumns(columns)
  const { cardW, gap } = layoutForColumns(columns)
  const pad = columns >= 15 ? 28 : 36
  const headerH = columns >= 15 ? 80 : 96
  const { bannerH, coverH, footerH, cardH } = cardMetrics(layers, density, cardW)
  const rows = Math.ceil(entries.length / cols)
  const gridW = cols * cardW + (cols - 1) * gap
  const width = pad * 2 + gridW
  const height = headerH + rows * cardH + (rows - 1) * gap + pad

  const covers = layers.cover
    ? await Promise.all(entries.map((e) => loadCover(e.cover)))
    : entries.map(() => null)

  const canvas = document.createElement('canvas')
  const scale = 2
  canvas.width = width * scale
  canvas.height = height * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas indisponible')
  ctx.scale(scale, scale)

  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, width, height)

  const grad = ctx.createLinearGradient(0, 0, 0, height)
  grad.addColorStop(0, 'rgba(125, 201, 232, 0.07)')
  grad.addColorStop(0.55, 'rgba(8, 12, 27, 0)')
  grad.addColorStop(1, 'rgba(74, 137, 216, 0.12)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = COLORS.amber
  ctx.font = '600 26px Rationale, system-ui, sans-serif'
  ctx.fillText('VGC', pad, columns >= 15 ? 34 : 42)

  ctx.fillStyle = COLORS.ink
  ctx.font = `600 ${columns >= 15 ? 32 : 40}px Rationale, system-ui, sans-serif`
  ctx.fillText(truncate(ctx, top.name, gridW), pad, columns >= 15 ? 68 : 84)

  entries.forEach((entry, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = pad + col * (cardW + gap)
    const y = headerH + row * (cardH + gap)
    drawCard(
      ctx,
      entry,
      covers[i],
      x,
      y,
      cardW,
      layers,
      bannerH,
      coverH,
      footerH,
      density,
    )
  })

  await downloadCanvas(canvas, `vgc-${slugify(top.name)}.png`)
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  entry: TopEntry,
  cover: HTMLImageElement | null,
  x: number,
  y: number,
  cardW: number,
  layers: TopExportLayers,
  bannerH: number,
  coverH: number,
  footerH: number,
  density: Density,
) {
  const cardH = bannerH + coverH + footerH
  const radius = density === 'compact' ? 8 : 12
  const rankSize = density === 'compact' ? 11 : density === 'dense' ? 13 : 15
  const titleSize = density === 'compact' ? 10 : density === 'dense' ? 12 : 14
  const metaSize = density === 'compact' ? 9 : density === 'dense' ? 11 : 12
  const placeholderSize = density === 'compact' ? 14 : density === 'dense' ? 18 : 22
  const textPad = density === 'compact' ? 6 : density === 'dense' ? 8 : 12
  const lineGap = density === 'compact' ? 14 : density === 'dense' ? 18 : 20
  const rankBaseline = density === 'compact' ? 3.5 : density === 'dense' ? 4.5 : 5
  const textBaseline = density === 'compact' ? 10 : density === 'dense' ? 13 : 15

  ctx.fillStyle = COLORS.surface
  drawRoundedRect(ctx, x, y, cardW, cardH, radius)
  ctx.fill()
  ctx.strokeStyle = COLORS.line
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.save()
  drawRoundedRect(ctx, x, y, cardW, cardH, radius)
  ctx.clip()

  if (layers.rank) {
    ctx.fillStyle = COLORS.bg
    ctx.fillRect(x, y, cardW, bannerH)
    if (coverH > 0 || footerH > 0) {
      ctx.fillStyle = COLORS.line
      ctx.fillRect(x, y + bannerH - 1, cardW, 1)
    }
    ctx.fillStyle = COLORS.accent
    ctx.font = `700 ${rankSize}px "Source Sans 3", system-ui, sans-serif`
    const badge = `#${entry.rank}`
    const tw = ctx.measureText(badge).width
    ctx.fillText(badge, x + (cardW - tw) / 2, y + bannerH / 2 + rankBaseline)
  }

  const coverY = y + bannerH
  if (layers.cover) {
    if (cover) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(x, coverY, cardW, coverH)
      ctx.clip()
      const scale = Math.max(cardW / cover.width, coverH / cover.height)
      const dw = cover.width * scale
      const dh = cover.height * scale
      const dx = x + (cardW - dw) / 2
      const dy = coverY + (coverH - dh) / 2
      ctx.drawImage(cover, dx, dy, dw, dh)
      ctx.restore()
    } else {
      ctx.fillStyle = COLORS.bg
      ctx.fillRect(x, coverY, cardW, coverH)
      ctx.fillStyle = COLORS.accentSoft
      ctx.font = `600 ${placeholderSize}px Rationale, system-ui, sans-serif`
      const label = 'VGC'
      const labelW = ctx.measureText(label).width
      ctx.fillText(label, x + (cardW - labelW) / 2, coverY + coverH / 2 + 8)
    }
  }

  if (footerH > 0) {
    ctx.fillStyle = COLORS.surface
    ctx.fillRect(x, coverY + coverH, cardW, footerH)
  }
  ctx.restore()

  if (footerH === 0) return

  const textMax = cardW - textPad * 2
  const lines: { text: string; fill: string; font: string }[] = []
  if (layers.name) {
    lines.push({
      text: entry.name,
      fill: COLORS.ink,
      font: `600 ${titleSize}px "Source Sans 3", system-ui, sans-serif`,
    })
  }
  if (layers.release) {
    lines.push({
      text: entry.release ? String(entry.release) : '—',
      fill: COLORS.muted,
      font: `400 ${metaSize}px "Source Sans 3", system-ui, sans-serif`,
    })
  }

  const blockH = lines.length * lineGap
  let textY = coverY + coverH + (footerH - blockH) / 2 + textBaseline
  for (const line of lines) {
    ctx.fillStyle = line.fill
    ctx.font = line.font
    ctx.fillText(truncate(ctx, line.text, textMax), x + textPad, textY)
    textY += lineGap
  }
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Impossible de générer l’image'))
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      resolve()
    }, 'image/png')
  })
}
