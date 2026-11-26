// Adapted from React Bits — Magnet (https://reactbits.dev/animations/magnet)
import { useEffect, useRef, useState, type ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  padding?: number
  magnetStrength?: number
  className?: string
}

export default function Magnet({ children, padding = 80, magnetStrength = 3, className = '' }: MagnetProps) {
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const onMove = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      const { left, top, width, height } = el.getBoundingClientRect()
      const cx = left + width / 2
      const cy = top + height / 2
      const dx = Math.abs(cx - e.clientX)
      const dy = Math.abs(cy - e.clientY)
      if (dx < width / 2 + padding && dy < height / 2 + padding) {
        setActive(true)
        setPos({ x: (e.clientX - cx) / magnetStrength, y: (e.clientY - cy) / magnetStrength })
      } else {
        setActive(false)
        setPos({ x: 0, y: 0 })
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [padding, magnetStrength])

  return (
    <div ref={ref} className={className} style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          transition: active ? 'transform 0.3s ease-out' : 'transform 0.6s cubic-bezier(.2,1.6,.4,1)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
