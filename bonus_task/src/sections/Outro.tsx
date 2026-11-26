import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import CountUp from '../components/reactbits/CountUp'
import Magnet from '../components/reactbits/Magnet'
import FadeContent from '../components/reactbits/FadeContent'
import { scrollToTarget } from '../lib/smooth'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STATS = [
  { to: 84000000, suffix: '', label: 'socks lost per year (museum estimate)' },
  { to: 1264, suffix: '', label: 'socks lost by the average human in a lifetime' },
  { to: 0, suffix: '', label: 'socks ever returned' },
  { to: 100, suffix: '%', label: 'of washing machines refuse to comment' },
]

export default function Outro({ voidCount }: { voidCount: number }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '.outro-giant span',
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.08,
          ease: 'expo.out',
          duration: 1.4,
          scrollTrigger: { trigger: '.outro-giant', start: 'top 85%', once: true },
        }
      )
    },
    { scope: root }
  )

  return (
    <footer className="outro" ref={root}>
      <div className="stats">
        {STATS.map((s, i) => (
          <FadeContent className="stat" key={s.label} variant="rise" delay={i * 0.12}>
            <strong>
              {s.to === 0 ? '0' : <CountUp to={s.to} duration={2.4} />}
              {s.suffix}
            </strong>
            <p>{s.label}</p>
          </FadeContent>
        ))}
      </div>

      <div className="outro-giant" aria-label="Lost and found">
        {['LOST', '&', 'FOUND?'].map((w) => (
          <div className="og-mask" key={w}>
            <span>{w}</span>
          </div>
        ))}
      </div>

      <FadeContent className="outro-bottom" variant="blur">
        <p>
          The void currently holds <b>{voidCount.toLocaleString('en-US')}</b> socks. Visiting hours: whenever you do laundry.
        </p>
        <Magnet padding={90} magnetStrength={3}>
          <button className="round-btn" onClick={() => scrollToTarget(0)} data-cursor="up">
            Back to
            <br />
            the drum ↑
          </button>
        </Magnet>
      </FadeContent>
      <div className="outro-meta">
        <span>© VOID/SOCK — a fictional museum</span>
        <span>React · GSAP · Motion · Lenis · React Bits</span>
        <span>Visiting hours: laundry day</span>
      </div>
    </footer>
  )
}
