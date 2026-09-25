import { useEffect, useState } from 'react'

export type VisualFrame = {
  top: number
  left: number
  width: number
  height: number
}

export function readVisualFrame(): VisualFrame {
  const viewport = window.visualViewport
  if (!viewport) {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
  }
  return {
    top: viewport.offsetTop,
    left: viewport.offsetLeft,
    width: viewport.width,
    height: viewport.height,
  }
}

export function useVisualFrame(active: boolean): VisualFrame {
  const [frame, setFrame] = useState(readVisualFrame)

  useEffect(() => {
    if (!active) return
    const sync = () => {
      const next = readVisualFrame()
      setFrame((current) =>
        current.top === next.top &&
        current.left === next.left &&
        current.width === next.width &&
        current.height === next.height
          ? current
          : next,
      )
    }
    sync()
    const viewport = window.visualViewport
    viewport?.addEventListener('resize', sync)
    viewport?.addEventListener('scroll', sync)
    window.addEventListener('orientationchange', sync)
    return () => {
      viewport?.removeEventListener('resize', sync)
      viewport?.removeEventListener('scroll', sync)
      window.removeEventListener('orientationchange', sync)
    }
  }, [active])

  return frame
}

export function visualFrameStyle(frame: VisualFrame): {
  top: number
  left: number
  width: number
  height: number
  right: 'auto'
} {
  return {
    top: frame.top,
    left: frame.left,
    width: frame.width,
    height: frame.height,
    right: 'auto',
  }
}
