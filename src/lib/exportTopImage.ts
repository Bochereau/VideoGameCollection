import type { Top, TopEntry } from '@/types'
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

function apiBases(): string[] {
  const configured = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
  const bases = new Set<string>()
  // Prefer relative (same origin / vite proxy) first
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

function columnsForSize(size: number): number {
  return size > 15 ? 10 : 5
}

export async function exportTopImage(top: Top): Promise<void> {
  const entries = [...top.entries].sort((a, b) => a.rank - b.rank)
  if (entries.length === 0) {
    throw new Error('Ajoutez au moins un jeu avant d’exporter.')
  }

  await ensureFonts()

  const cols = columnsForSize(top.size)
  const gap = cols >= 10 ? 12 : 16
  const pad = 36
  const headerH = 96

  const cardW = cols >= 10 ? 140 : 220
  const bannerH = cols >= 10 ? 28 : 32
  const coverH = cols >= 10 ? 140 : 188
  const footerTextH = cols >= 10 ? 64 : 72
  const cardH = bannerH + coverH + footerTextH
  const rows = Math.ceil(entries.length / cols)
  const gridW = cols * cardW + (cols - 1) * gap
  const width = pad * 2 + gridW
  const height = headerH + rows * cardH + (rows - 1) * gap + pad

  const covers = await Promise.all(entries.map((e) => loadCover(e.cover)))

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
  ctx.fillText('VGC', pad, 42)

  ctx.fillStyle = COLORS.ink
  ctx.font = '600 40px Rationale, system-ui, sans-serif'
  ctx.fillText(truncate(ctx, top.name, gridW), pad, 84)

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
      bannerH,
      coverH,
      footerTextH,
      cols >= 10,
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
  bannerH: number,
  coverH: number,
  footerH: number,
  dense: boolean,
) {
  const cardH = bannerH + coverH + footerH
  const radius = 12

  ctx.fillStyle = COLORS.surface
  drawRoundedRect(ctx, x, y, cardW, cardH, radius)
  ctx.fill()
  ctx.strokeStyle = COLORS.line
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.save()
  drawRoundedRect(ctx, x, y, cardW, cardH, radius)
  ctx.clip()

  // Rank banner
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(x, y, cardW, bannerH)
  ctx.fillStyle = COLORS.line
  ctx.fillRect(x, y + bannerH - 1, cardW, 1)
  ctx.fillStyle = COLORS.accent
  ctx.font = `700 ${dense ? 13 : 15}px "Source Sans 3", system-ui, sans-serif`
  const badge = `#${entry.rank}`
  const tw = ctx.measureText(badge).width
  ctx.fillText(badge, x + (cardW - tw) / 2, y + bannerH / 2 + (dense ? 4.5 : 5))

  // Cover
  const coverY = y + bannerH
  if (cover) {
    const scale = Math.max(cardW / cover.width, coverH / cover.height)
    const dw = cover.width * scale
    const dh = cover.height * scale
    const dx = x + (cardW - dw) / 2
    const dy = coverY
    ctx.drawImage(cover, dx, dy, dw, dh)
  } else {
    ctx.fillStyle = COLORS.bg
    ctx.fillRect(x, coverY, cardW, coverH)
    ctx.fillStyle = COLORS.accentSoft
    ctx.font = `600 ${dense ? 18 : 22}px Rationale, system-ui, sans-serif`
    const label = 'VGC'
    const labelW = ctx.measureText(label).width
    ctx.fillText(label, x + (cardW - labelW) / 2, coverY + coverH / 2 + 8)
  }

  // Footer
  ctx.fillStyle = COLORS.surface
  ctx.fillRect(x, coverY + coverH, cardW, footerH)
  ctx.restore()

  const textPad = dense ? 8 : 12
  const textMax = cardW - textPad * 2
  ctx.fillStyle = COLORS.ink
  ctx.font = `600 ${dense ? 12 : 14}px "Source Sans 3", system-ui, sans-serif`
  const titleY = coverY + coverH + (dense ? 22 : 26)
  ctx.fillText(truncate(ctx, entry.name, textMax), x + textPad, titleY)

  ctx.fillStyle = COLORS.muted
  ctx.font = `400 ${dense ? 11 : 12}px "Source Sans 3", system-ui, sans-serif`
  ctx.fillText(
    entry.release ? String(entry.release) : '—',
    x + textPad,
    titleY + (dense ? 18 : 20),
  )
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
