// Adapted from React Bits — ClickSpark (https://reactbits.dev/animations/click-spark)
import { useCallback, useEffect, useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react'

interface Spark {
  x: number
  y: number
  angle: number
  start: number
  color: string
}

interface ClickSparkProps {
  colors?: string[]
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  children: ReactNode
}

export default function ClickSpark({
  colors = ['#d4ff3a', '#ff4fa3', '#4f7cff'],
  sparkSize = 12,
  sparkRadius = 22,
  sparkCount = 10,
  duration = 500,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<Spark[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let raf = 0
    const draw = (t: number) => {
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparks.current = sparks.current.filter((s) => {
        const elapsed = t - s.start
        if (elapsed >= duration) return false
        const p = elapsed / duration
        const eased = p * (2 - p)
        const dist = eased * sparkRadius * 1.6
        const len = sparkSize * (1 - eased)
        const x1 = s.x + dist * Math.cos(s.angle)
        const y1 = s.y + dist * Math.sin(s.angle)
        const x2 = s.x + (dist + len) * Math.cos(s.angle)
        const y2 = s.y + (dist + len) * Math.sin(s.angle)
        ctx.strokeStyle = s.color
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        return true
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [duration, sparkRadius, sparkSize])

  const onClick = useCallback(
    (e: ReactMouseEvent) => {
      const now = performance.now()
      for (let i = 0; i < sparkCount; i++) {
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / sparkCount,
          start: now,
          color: colors[i % colors.length],
        })
      }
    },
    [colors, sparkCount]
  )

  return (
    <div onClick={onClick} style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9998 }}
      />
      {children}
    </div>
  )
}
