// Adapted from React Bits — ScrollReveal (https://reactbits.dev/text-animations/scroll-reveal)
import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface ScrollRevealProps {
  children: string
  className?: string
  baseOpacity?: number
  blurStrength?: number
  baseRotation?: number
  highlight?: string[]
}

export default function ScrollReveal({
  children,
  className = '',
  baseOpacity = 0.1,
  blurStrength = 6,
  baseRotation = 3,
  highlight = [],
}: ScrollRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  const words = useMemo(
    () =>
      children.split(/(\s+)/).map((w, i) => {
        if (/^\s+$/.test(w)) return w
        const clean = w.replace(/[^\w]/g, '').toLowerCase()
        return (
          <span className={`sr-word ${highlight.includes(clean) ? 'sr-hl' : ''}`} key={i}>
            {w}
          </span>
        )
      }),
    [children, highlight]
  )

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const wordEls = el.querySelectorAll('.sr-word')
      gsap.fromTo(
        el,
        { rotate: baseRotation, transformOrigin: '0% 50%' },
        { rotate: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 60%', scrub: true } }
      )
      gsap.fromTo(
        wordEls,
        { opacity: baseOpacity, filter: `blur(${blurStrength}px)` },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true },
        }
      )
    },
    { scope: ref }
  )

  return (
    <h2 ref={ref} className={`scroll-reveal ${className}`}>
      {words}
    </h2>
  )
}
