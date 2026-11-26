// Adapted from React Bits — SplitText (https://reactbits.dev/text-animations/split-text)
import { useRef, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText as GSAPSplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP)

interface SplitTextProps {
  text: string
  className?: string
  tag?: ElementType
  delay?: number // ms between chars
  duration?: number
  ease?: string
  splitType?: 'chars' | 'words' | 'lines'
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  /** if provided, animation waits for this flag instead of a ScrollTrigger */
  play?: boolean
  start?: string
}

export default function SplitText({
  text,
  className = '',
  tag: Tag = 'p',
  delay = 40,
  duration = 1,
  ease = 'power4.out',
  splitType = 'chars',
  from = { yPercent: 110, opacity: 0 },
  to = { yPercent: 0, opacity: 1 },
  play,
  start = 'top 88%',
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || play === false) return
      let split: GSAPSplitText | null = null
      let cancelled = false

      document.fonts.ready.then(() => {
        if (cancelled || !el) return
        split = new GSAPSplitText(el, {
          type: splitType === 'lines' ? 'lines' : `lines,${splitType}`,
          mask: 'lines',
          linesClass: 'split-line',
        })
        const targets = splitType === 'chars' ? split.chars : splitType === 'words' ? split.words : split.lines
        gsap.fromTo(targets, { ...from }, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: play === undefined ? { trigger: el, start, once: true } : undefined,
        })
      })

      return () => {
        cancelled = true
        split?.revert()
      }
    },
    { dependencies: [text, play], scope: ref }
  )

  return (
    <Tag ref={ref} className={`split-parent ${className}`} aria-label={text}>
      {text}
    </Tag>
  )
}
