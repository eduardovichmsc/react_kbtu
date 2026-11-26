// Adapted from React Bits — ScrollVelocity (https://reactbits.dev/text-animations/scroll-velocity)
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function useElementWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const update = () => ref.current && setWidth(ref.current.offsetWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [ref])
  return width
}

interface RowProps {
  children: ReactNode
  baseVelocity: number
  className?: string
  numCopies?: number
}

function VelocityRow({ children, baseVelocity, className = '', numCopies = 6 }: RowProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })
  const copyRef = useRef<HTMLSpanElement>(null)
  const copyWidth = useElementWidth(copyRef)
  const x = useTransform(baseX, (v) => (copyWidth === 0 ? '0px' : `${wrap(-copyWidth, 0, v)}px`))
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) direction.current = -1
    else if (velocityFactor.get() > 0) direction.current = 1
    moveBy += direction.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="velocity-parallax">
      <motion.div className="velocity-scroller" style={{ x }}>
        {Array.from({ length: numCopies }).map((_, i) => (
          <span className={className} key={i} ref={i === 0 ? copyRef : null}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

interface ScrollVelocityProps {
  texts: ReactNode[]
  velocity?: number
  className?: string
}

export default function ScrollVelocity({ texts, velocity = 60, className = '' }: ScrollVelocityProps) {
  return (
    <section className="velocity-wrap">
      {texts.map((t, i) => (
        <VelocityRow key={i} className={className} baseVelocity={i % 2 !== 0 ? -velocity : velocity}>
          {t}
        </VelocityRow>
      ))}
    </section>
  )
}
