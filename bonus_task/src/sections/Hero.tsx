import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import SplitText from '../components/reactbits/SplitText'
import { Sock, type SockDesign } from '../lib/sock'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type D = Omit<SockDesign, 'id' | 'name'>
const FLOATERS: { d: D; x: string; y: string; size: number; depth: number; rot: number }[] = [
  { d: { base: '#ff4fa3', accent: '#111', pattern: 'dots', length: 'crew' }, x: '6%', y: '18%', size: 120, depth: 40, rot: -18 },
  { d: { base: '#4f7cff', accent: '#d4ff3a', pattern: 'zigzag', length: 'knee' }, x: '84%', y: '12%', size: 140, depth: 70, rot: 22 },
  { d: { base: '#ff7a1a', accent: '#f2efe6', pattern: 'stripes', length: 'ankle' }, x: '12%', y: '72%', size: 100, depth: 55, rot: 30 },
  { d: { base: '#8b5cf6', accent: '#ffd400', pattern: 'hearts', length: 'crew' }, x: '80%', y: '70%', size: 110, depth: 30, rot: -28 },
  { d: { base: '#f2efe6', accent: '#ff3b30', pattern: 'argyle', length: 'crew' }, x: '48%', y: '84%', size: 80, depth: 90, rot: 12 },
]

function Floater({ f, mx, my, i, ready }: { f: (typeof FLOATERS)[number]; mx: MotionValue<number>; my: MotionValue<number>; i: number; ready: boolean }) {
  const x = useTransform(mx, (v) => v * f.depth)
  const y = useTransform(my, (v) => v * f.depth)
  return (
    <motion.div className="floater" style={{ left: f.x, top: f.y, width: f.size, x, y }}>
      <motion.div
        initial={{ scale: 0, rotate: f.rot - 180 }}
        animate={ready ? { scale: 1, rotate: f.rot } : {}}
        transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.8 + i * 0.12 }}
      >
        <div className="floater-bob" style={{ animationDelay: `${i * -1.3}s` }}>
          <Sock design={f.d} />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 })
  const my = useSpring(rawY, { stiffness: 60, damping: 18 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5)
      rawY.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  useGSAP(
    () => {
      gsap.to('.drum-spin', { rotate: 360, duration: 9, repeat: -1, ease: 'none' })
      gsap.to('.drum-scroll', {
        rotate: 540,
        scale: 0.6,
        yPercent: 40,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-title', {
        yPercent: -40,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root }
  )

  return (
    <section className="hero" ref={root}>
      <div className="hero-grid-bg" />
      {FLOATERS.map((f, i) => (
        <Floater key={i} f={f} mx={mx} my={my} i={i} ready={ready} />
      ))}

      <div className="drum-scroll">
      <motion.div
        className="drum-wrap"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={ready ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <div className="drum" data-cursor="spin">
          <div className="drum-glass">
            <div className="drum-spin">
              {['#d4ff3a', '#ff4fa3', '#4f7cff', '#ffd400'].map((c, i) => (
                <div key={c} className="drum-sock" style={{ transform: `rotate(${i * 90}deg) translateY(-34%)` }}>
                  <Sock design={{ base: c, accent: '#111', pattern: (['stripes', 'dots', 'zigzag', 'hearts'] as const)[i], length: 'crew' }} />
                </div>
              ))}
            </div>
            <div className="drum-water">
              <svg viewBox="0 0 600 60" preserveAspectRatio="none">
                <path d="M0 30 Q 75 0 150 30 T 300 30 T 450 30 T 600 30 V60 H0Z" />
              </svg>
            </div>
            <div className="drum-shine" />
          </div>
        </div>
      </motion.div>
      </div>

      <div className="hero-title">
        <p className="hero-kicker">
          <motion.span initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.2 }}>
            ( Est. the first laundry day ) — Dimension 7-B
          </motion.span>
        </p>
        <SplitText tag="h1" className="hero-h1" text="WHERE DO" play={ready} delay={45} duration={1.1} />
        <SplitText tag="h1" className="hero-h1 hero-h1--outline" text="SOCKS GO?" play={ready} delay={45} duration={1.1} />
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          The world's first and only <em>Museum of Lost Socks</em>, located on the other side of your washing machine.
        </motion.p>
      </div>

      <motion.div className="hero-scroll" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.8 }}>
        <span>scroll into the drum</span>
        <i />
      </motion.div>
    </section>
  )
}
