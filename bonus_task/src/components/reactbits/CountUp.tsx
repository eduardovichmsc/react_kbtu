// Adapted from React Bits — CountUp (https://reactbits.dev/text-animations/count-up)
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'motion/react'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  separator?: string
  className?: string
}

export default function CountUp({ to, from = 0, duration = 2, separator = ',', className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const value = useMotionValue(from)
  const damping = 20 + 40 * (1 / duration)
  const stiffness = 100 * (1 / duration)
  const spring = useSpring(value, { damping, stiffness })
  const inView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    if (ref.current) ref.current.textContent = format(from)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (inView) value.set(to)
  }, [inView, to, value])

  useEffect(
    () =>
      spring.on('change', (v) => {
        if (ref.current) ref.current.textContent = format(v)
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spring]
  )

  function format(v: number) {
    return Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(v)).replace(/,/g, separator)
  }

  return <span ref={ref} className={className} />
}
