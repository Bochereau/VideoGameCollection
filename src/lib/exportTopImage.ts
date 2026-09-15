import type { Top, TopEntry } from '@/types'
import { cardCoverUrl } from '@/lib/coverUrl'

const WIDTH = 720
const PAD = 32
const COVER_W = 72
const COVER_H = 96
const ROW_GAP = 14
const HEADER_H = 118

const COLORS = {
  bg: '#080c1b',
  surface: '#12182c',
  line: 'rgba(125, 201, 232, 0.22)',
  ink: '#e8eef8',
  muted: '#9aabc4',
  accent: '#7dc9e8',
  amber: '#f3e098',
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
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
      document.fonts.load('600 36px Rationale'),
      document.fonts.load('600 22px "Source Sans 3"'),
      document.fonts.load('400 16px "Source Sans 3"'),
    ])
  } catch {
    /* fallback fonts OK */
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

export async function exportTopImage(top: Top): Promise<void> {
  const entries = [...top.entries].sort((a, b) => a.rank - b.rank)
  if (entries.length === 0) {
    throw new Error('Ajoutez au moins un jeu avant d’exporter.')
  }

  await ensureFonts()

  const covers = await Promise.all(
    entries.map((entry) => {
      const url = cardCoverUrl(entry.cover) ?? entry.cover
      return url ? loadImage(url) : Promise.resolve(null)
    }),
  )

  const rowH = COVER_H + ROW_GAP
  const height = HEADER_H + entries.length * rowH + PAD
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas indisponible')

  // Background
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, WIDTH, height)
  const grad = ctx.createLinearGradient(0, 0, WIDTH, height)
  grad.addColorStop(0, 'rgba(125, 201, 232, 0.08)')
  grad.addColorStop(0.5, 'rgba(8, 12, 27, 0)')
  grad.addColorStop(1, 'rgba(243, 224, 152, 0.06)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, WIDTH, height)

  // Brand + title
  ctx.fillStyle = COLORS.amber
  ctx.font = '600 28px Rationale, system-ui, sans-serif'
  ctx.fillText('VGC', PAD, 44)

  ctx.fillStyle = COLORS.ink
  ctx.font = '600 36px Rationale, system-ui, sans-serif'
  ctx.fillText(truncate(ctx, top.name, WIDTH - PAD * 2), PAD, 88)

  ctx.fillStyle = COLORS.muted
  ctx.font = '400 14px "Source Sans 3", system-ui, sans-serif'
  ctx.fillText(`${entries.length} / ${top.size} places`, PAD, 110)

  entries.forEach((entry, i) => {
    drawEntryRow(ctx, entry, covers[i], PAD + i * rowH + HEADER_H - 8)
  })

  await downloadCanvas(canvas, `vgc-${slugify(top.name)}.png`)
}

function drawEntryRow(
  ctx: CanvasRenderingContext2D,
  entry: TopEntry,
  cover: HTMLImageElement | null,
  y: number,
) {
  const x = PAD
  const w = WIDTH - PAD * 2

  ctx.fillStyle = COLORS.surface
  drawRoundedRect(ctx, x, y, w, COVER_H, 12)
  ctx.fill()
  ctx.strokeStyle = COLORS.line
  ctx.lineWidth = 1
  ctx.stroke()

  // Rank
  ctx.fillStyle = COLORS.amber
  ctx.font = '600 22px Rationale, system-ui, sans-serif'
  const rankLabel = `#${entry.rank}`
  ctx.fillText(rankLabel, x + 16, y + COVER_H / 2 + 8)

  const coverX = x + 70
  const coverY = y + 4
  const cw = COVER_W
  const ch = COVER_H - 8

  ctx.save()
  drawRoundedRect(ctx, coverX, coverY, cw, ch, 8)
  ctx.clip()
  if (cover) {
    // cover crop top-center
    const scale = Math.max(cw / cover.width, ch / cover.height)
    const dw = cover.width * scale
    const dh = cover.height * scale
    const dx = coverX + (cw - dw) / 2
    const dy = coverY
    ctx.drawImage(cover, dx, dy, dw, dh)
  } else {
    ctx.fillStyle = '#080c1b'
    ctx.fillRect(coverX, coverY, cw, ch)
    ctx.fillStyle = 'rgba(125, 201, 232, 0.35)'
    ctx.font = '600 16px Rationale, system-ui, sans-serif'
    ctx.fillText('VGC', coverX + 18, coverY + ch / 2 + 6)
  }
  ctx.restore()

  const textX = coverX + cw + 16
  const textMax = w - (textX - x) - 16

  ctx.fillStyle = COLORS.ink
  ctx.font = '600 20px "Source Sans 3", system-ui, sans-serif'
  ctx.fillText(truncate(ctx, entry.name, textMax), textX, y + 42)

  ctx.fillStyle = COLORS.muted
  ctx.font = '400 15px "Source Sans 3", system-ui, sans-serif'
  ctx.fillText(entry.release ? String(entry.release) : '—', textX, y + 68)
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
