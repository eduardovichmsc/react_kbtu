import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Sock, randomSock, type SockDesign } from '../lib/sock'
import SplitText from '../components/reactbits/SplitText'
import FadeContent from '../components/reactbits/FadeContent'

interface Card {
  key: number
  pair: string
  design: SockDesign
}

function makeDeck(): Card[] {
  const designs: SockDesign[] = []
  while (designs.length < 6) {
    const s = randomSock()
    if (!designs.some((d) => d.base === s.base && d.pattern === s.pattern)) designs.push(s)
  }
  const cards = designs.flatMap((d) => [d, d]).map((d, i) => ({ key: i, pair: d.id, design: d }))
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

export default function Matchmaker() {
  const [deck, setDeck] = useState<Card[]>(makeDeck)
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [start, setStart] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const won = matched.size === 6

  useEffect(() => {
    if (!start || won) return
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [start, won])

  const flip = useCallback(
    (i: number) => {
      if (open.length === 2 || open.includes(i) || matched.has(deck[i].pair)) return
      if (!start) {
        setStart(Date.now())
        setNow(Date.now())
      }
      const next = [...open, i]
      setOpen(next)
      if (next.length === 2) {
        setMoves((m) => m + 1)
        const [a, b] = next
        if (deck[a].pair === deck[b].pair) {
          setTimeout(() => {
            setMatched((m) => new Set(m).add(deck[a].pair))
            setOpen([])
          }, 450)
        } else {
          setTimeout(() => setOpen([]), 900)
        }
      }
    },
    [open, matched, deck, start]
  )

  const reset = () => {
    setDeck(makeDeck())
    setOpen([])
    setMatched(new Set())
    setMoves(0)
    setStart(null)
  }

  const seconds = start ? Math.floor((now - start) / 1000) : 0

  return (
    <section className="match" id="match">
      <div className="match-head">
        <SplitText tag="h2" className="match-title" text="Odd Sock Matchmaker" splitType="words" delay={90} />
        <FadeContent variant="blur" delay={0.15}>
        <p>Science says it’s impossible to find matching socks. Prove science wrong. Flip two cards, reunite the pairs.</p>
        <div className="match-stats">
          <div>
            <small>Moves</small>
            <strong>{moves}</strong>
          </div>
          <div>
            <small>Time</small>
            <strong>{seconds}s</strong>
          </div>
          <div>
            <small>Pairs</small>
            <strong>{matched.size}/6</strong>
          </div>
          <button className="ghost-btn" onClick={reset} data-cursor="again">
            Reshuffle
          </button>
        </div>
        </FadeContent>
      </div>

      <FadeContent className="match-board" variant="rise" duration={1.2}>
        {deck.map((c, i) => {
          const isOpen = open.includes(i) || matched.has(c.pair)
          const isMatched = matched.has(c.pair)
          return (
            <button key={c.key} className={`mcard ${isMatched ? 'matched' : ''}`} onClick={() => flip(i)} data-cursor={isOpen ? '' : 'flip'}>
              <motion.div
                className="mcard-inner"
                animate={{ rotateY: isOpen ? 180 : 0, scale: isMatched ? [1, 1.08, 1] : 1 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="mcard-face mcard-back">
                  <span>?</span>
                </div>
                <div className="mcard-face mcard-front" style={{ background: c.design.base === '#111111' ? '#f2efe6' : '#0e0e0e' }}>
                  <Sock design={c.design} />
                </div>
              </motion.div>
            </button>
          )
        })}
      </FadeContent>

      <AnimatePresence>
        {won && (
          <motion.div className="win" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="win-card"
              initial={{ scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12 }}
            >
              <h3>All pairs reunited!</h3>
              <p>
                {moves} moves · {seconds}s. You are officially the first human to own matching socks. Scientists are
                confused.
              </p>
              <button className="void-btn" onClick={reset}>
                <span>Play again</span>
                <i>↻</i>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
