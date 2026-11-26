import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Sock, type SockDesign } from '../lib/sock'
import SplitText from '../components/reactbits/SplitText'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Exhibit = {
  no: string
  title: string
  lost: string
  seen: string
  status: string
  bg: string
  ink: string
  sock: Omit<SockDesign, 'id' | 'name'>
}

const EXHIBITS: Exhibit[] = [
  {
    no: '001',
    title: 'The Original Leftie',
    lost: '1987, spin cycle',
    seen: 'Grandma’s basement',
    status: 'Refuses to talk',
    bg: '#d4ff3a',
    ink: '#0e0e0e',
    sock: { base: '#f2efe6', accent: '#ff3b30', pattern: 'stripes', length: 'knee' },
  },
  {
    no: '002',
    title: 'Argyle Ambassador',
    lost: '2003, business trip',
    seen: 'Hotel in Almaty',
    status: 'Diplomatic immunity',
    bg: '#ff4fa3',
    ink: '#0e0e0e',
    sock: { base: '#4f7cff', accent: '#ffd400', pattern: 'argyle', length: 'crew' },
  },
  {
    no: '003',
    title: 'The Christmas Deserter',
    lost: 'Dec 26, every year',
    seen: 'Behind the radiator',
    status: 'Festive, unrepentant',
    bg: '#0e0e0e',
    ink: '#f2efe6',
    sock: { base: '#ff3b30', accent: '#f2efe6', pattern: 'hearts', length: 'knee' },
  },
  {
    no: '004',
    title: 'Gym Sock Ω',
    lost: 'Leg day, 2019',
    seen: 'Locker 42',
    status: 'Still damp. Do not touch',
    bg: '#4f7cff',
    ink: '#f2efe6',
    sock: { base: '#f2efe6', accent: '#14b8a6', pattern: 'plain', length: 'crew' },
  },
  {
    no: '005',
    title: 'Grandma’s Hand-knit',
    lost: 'Winter 2011',
    seen: 'Your conscience',
    status: 'Unforgivable',
    bg: '#ff7a1a',
    ink: '#0e0e0e',
    sock: { base: '#8b5cf6', accent: '#d4ff3a', pattern: 'zigzag', length: 'knee' },
  },
  {
    no: '006',
    title: 'The Invisible No-Show',
    lost: 'Unknown',
    seen: 'We think it’s here',
    status: 'Possibly in your shoe',
    bg: '#f2efe6',
    ink: '#0e0e0e',
    sock: { base: '#fff', accent: '#000', pattern: 'plain', length: 'ankle', ghost: true },
  },
]

export default function Exhibits() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 769px)', () => {
        const el = track.current!
        const dist = () => el.scrollWidth - window.innerWidth
        const tween = gsap.to(el, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => '+=' + dist(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set('.ex-progress i', { scaleX: self.progress }),
          },
        })
        gsap.utils.toArray<HTMLElement>('.ex-card').forEach((card) => {
          const sock = card.querySelector('.ex-sock')
          gsap.fromTo(
            sock,
            { rotate: -25, y: 40 },
            {
              rotate: 18,
              y: -30,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            }
          )
        })
      })
      return () => mm.revert()
    },
    { scope: section }
  )

  return (
    <section className="exhibits" id="exhibits" ref={section}>
      <div className="ex-head">
        <SplitText tag="h2" className="ex-title" text="Hall of the Unpaired" splitType="words" delay={80} />
      </div>
      <div className="ex-track" ref={track}>
        {EXHIBITS.map((e) => (
          <article key={e.no} className="ex-card" style={{ background: e.bg, color: e.ink }} data-cursor="view">
            <span className="ex-no">№{e.no}</span>
            <div className="ex-sock">
              <Sock design={e.sock} style={{ color: e.ink }} />
            </div>
            <h3>{e.title}</h3>
            <dl>
              <div>
                <dt>Lost</dt>
                <dd>{e.lost}</dd>
              </div>
              <div>
                <dt>Last seen</dt>
                <dd>{e.seen}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{e.status}</dd>
              </div>
            </dl>
          </article>
        ))}
        <div className="ex-end">
          <p>
            Your sock
            <br />
            could be
            <br />
            <em>next.</em>
          </p>
        </div>
      </div>
      <div className="ex-progress">
        <i />
      </div>
    </section>
  )
}
