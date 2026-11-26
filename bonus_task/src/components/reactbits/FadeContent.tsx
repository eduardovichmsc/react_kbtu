// Adapted from React Bits — FadeContent (https://reactbits.dev/c/animations/fade-content)
import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Variant = 'plain' | 'blur' | 'gray' | 'rise'

interface FadeContentProps {
  children: ReactNode
  variant?: Variant
  duration?: number // seconds
  delay?: number // seconds
  ease?: string
  initialOpacity?: number
  start?: string
  className?: string
}

const FROM: Record<Variant, gsap.TweenVars> = {
  plain: {},
  blur: { filter: 'blur(12px)' },
  gray: { filter: 'grayscale(1) brightness(1.4)' },
  rise: { filter: 'blur(8px)', y: 50 },
}
const TO: Record<Variant, gsap.TweenVars> = {
  plain: {},
  blur: { filter: 'blur(0px)' },
  gray: { filter: 'grayscale(0) brightness(1)' },
  rise: { filter: 'blur(0px)', y: 0 },
}

export default function FadeContent({
  children,
  variant = 'blur',
  duration = 1,
  delay = 0,
  ease = 'power2.out',
  initialOpacity = 0,
  start = 'top 88%',
  className = '',
}: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { opacity: initialOpacity, ...FROM[variant] },
        {
          opacity: 1,
          ...TO[variant],
          duration,
          delay,
          ease,
          clearProps: 'filter',
          scrollTrigger: { trigger: ref.current, start, once: true },
        }
      )
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className} style={{ opacity: initialOpacity }}>
      {children}
    </div>
  )
}
