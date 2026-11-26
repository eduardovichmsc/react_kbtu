import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ACCENTS,
  BASES,
  LENGTHS,
  PATTERNS,
  Sock,
  randomName,
  randomSock,
  type SockDesign,
} from '../lib/sock'
import Magnet from '../components/reactbits/Magnet'
import SplitText from '../components/reactbits/SplitText'
import FadeContent from '../components/reactbits/FadeContent'

interface ForgeProps {
  lost: SockDesign[]
  onLose: (s: SockDesign) => void
}

const DIMENSIONS = ['7-B', 'Ω-12', 'Lint-9', 'Dryer Prime', 'Fluff-3', 'The Long Drawer']

export default function Forge({ lost, onLose }: ForgeProps) {
  const [sock, setSock] = useState<SockDesign>(() => randomSock())
  const [feeding, setFeeding] = useState(false)
  const [ticket, setTicket] = useState<{ name: string; dim: string } | null>(null)

  const update = (patch: Partial<SockDesign>) => setSock((s) => ({ ...s, ...patch }))

  const feed = () => {
    if (feeding) return
    setFeeding(true)
  }

  const onFed = () => {
    if (!feeding) return
    onLose(sock)
    setTicket({ name: sock.name, dim: DIMENSIONS[Math.floor(Math.random() * DIMENSIONS.length)] })
    setTimeout(() => setTicket(null), 3200)
    setSock(randomSock())
    setFeeding(false)
  }

  return (
    <section className="forge" id="forge">
      <div className="forge-head">
        <SplitText tag="h2" className="forge-title" text="The Sock Forge" splitType="chars" delay={30} />
        <FadeContent variant="blur" delay={0.2}>
          <p className="forge-lead">Design a sock. Give it a name. Then do what every washing machine does — send it to the void.</p>
        </FadeContent>
      </div>

      <FadeContent className="forge-grid" variant="rise" duration={1.2}>
        <div className="forge-stage">
          <AnimatePresence>
            {feeding && (
              <motion.div
                className="vortex"
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 720 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={sock.id}
              className="forge-sock"
              initial={{ scale: 0, rotate: -60, y: -120 }}
              animate={
                feeding
                  ? { scale: 0, rotate: 900, y: 0, opacity: 0, filter: 'blur(8px)' }
                  : { scale: 1, rotate: -8, y: 0, opacity: 1, filter: 'blur(0px)' }
              }
              transition={feeding ? { duration: 1.3, ease: [0.7, 0, 0.84, 0] } : { type: 'spring', stiffness: 160, damping: 13 }}
              onAnimationComplete={onFed}
              whileHover={feeding ? undefined : { rotate: 4, scale: 1.04 }}
            >
              <Sock design={sock} />
            </motion.div>
          </AnimatePresence>
          <div className="forge-tag">
            <span>Specimen</span>
            <strong>{sock.name}</strong>
          </div>
        </div>

        <div className="forge-panel">
          <label className="field">
            <span>Name</span>
            <div className="name-row">
              <input value={sock.name} maxLength={32} onChange={(e) => update({ name: e.target.value })} />
              <button className="dice" onClick={() => update({ name: randomName() })} data-cursor="roll" aria-label="Random name">
                🎲
              </button>
            </div>
          </label>

          <div className="field">
            <span>Base colour</span>
            <div className="swatches">
              {BASES.map((c) => (
                <button
                  key={c}
                  className={`swatch ${sock.base === c ? 'on' : ''}`}
                  style={{ background: c }}
                  onClick={() => update({ base: c })}
                  aria-label={`Base ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="field">
            <span>Accent</span>
            <div className="swatches">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  className={`swatch ${sock.accent === c ? 'on' : ''}`}
                  style={{ background: c }}
                  onClick={() => update({ accent: c })}
                  aria-label={`Accent ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="field">
            <span>Pattern</span>
            <div className="chips">
              {PATTERNS.map((p) => (
                <button key={p} className={`chip ${sock.pattern === p ? 'on' : ''}`} onClick={() => update({ pattern: p })}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span>Length</span>
            <div className="chips">
              {LENGTHS.map((l) => (
                <button key={l} className={`chip ${sock.length === l ? 'on' : ''}`} onClick={() => update({ length: l })}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="forge-actions">
            <button className="ghost-btn" onClick={() => setSock(randomSock())} data-cursor="shuffle">
              Randomise
            </button>
            <Magnet padding={60} magnetStrength={4}>
              <button className="void-btn" onClick={feed} disabled={feeding} data-cursor="bye!">
                <span>Feed to the void</span>
                <i>↯</i>
              </button>
            </Magnet>
          </div>
        </div>
      </FadeContent>

      <FadeContent className="lost-log" variant="gray">
        <div className="lost-log-head">
          <h4>Recently lost by you</h4>
          <span>{lost.length} specimens</span>
        </div>
        {lost.length === 0 ? (
          <p className="lost-empty">Nothing yet. Your socks are suspiciously safe.</p>
        ) : (
          <ul>
            <AnimatePresence initial={false}>
              {lost.slice(0, 10).map((s) => (
                <motion.li
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.4, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <Sock design={s} />
                  <span>{s.name}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </FadeContent>

      <AnimatePresence>
        {ticket && (
          <motion.div
            className="ticket"
            initial={{ y: 120, rotate: -6, opacity: 0 }}
            animate={{ y: 0, rotate: -2, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          >
            <small>Transfer receipt</small>
            <strong>{ticket.name}</strong>
            <span>dispatched to dimension {ticket.dim}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
