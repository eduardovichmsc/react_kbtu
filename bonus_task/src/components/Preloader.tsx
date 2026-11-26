import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Sock } from '../lib/sock'

const LINES = ['Checking under the bed…', 'Opening the drum…', 'Interrogating the dryer…', 'Crossing to the other side…']

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useGSAP(
    () => {
      const counter = { v: 0 }
      const tl = gsap.timeline()
      tl.to(counter, {
        v: 100,
        duration: 2.4,
        ease: 'power2.inOut',
        onUpdate: () => setCount(Math.round(counter.v)),
      })
        .to('.pl-sock', { rotate: 720, scale: 0, duration: 0.6, ease: 'back.in(2)' }, '-=0.2')
        .to('.pl-inner', { yPercent: -30, opacity: 0, duration: 0.5, ease: 'power2.in' }, '<0.2')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut', onStart: onDone })
        .set(root.current, { display: 'none' })
    },
    { scope: root }
  )

  return (
    <div ref={root} className="preloader" style={{ clipPath: 'inset(0 0 0% 0)' }}>
      <div className="pl-inner">
        <div className="pl-sock">
          <Sock design={{ base: '#d4ff3a', accent: '#111', pattern: 'stripes', length: 'crew' }} />
        </div>
        <p className="pl-line">{LINES[Math.min(LINES.length - 1, Math.floor(count / 26))]}</p>
      </div>
      <div className="pl-count">
        {String(count).padStart(3, '0')}
        <small>%</small>
      </div>
      <div className="pl-bar" style={{ transform: `scaleX(${count / 100})` }} />
    </div>
  )
}
