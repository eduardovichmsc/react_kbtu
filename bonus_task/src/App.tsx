import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import ClickSpark from './components/reactbits/ClickSpark'
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import Exhibits from './sections/Exhibits'
import Forge from './sections/Forge'
import Matchmaker from './sections/Matchmaker'
import Outro from './sections/Outro'
import { initSmoothScroll, startScroll, stopScroll } from './lib/smooth'
import type { SockDesign } from './lib/sock'

const BASELINE = 1_284_033
const STORAGE_KEY = 'voidsock:lost'

function loadLost(): SockDesign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SockDesign[]) : []
  } catch {
    return []
  }
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [lost, setLost] = useState<SockDesign[]>(loadLost)

  useEffect(() => {
    initSmoothScroll()
    stopScroll()
  }, [])

  useEffect(() => {
    if (!ready) return
    startScroll()
    const t = setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => clearTimeout(t)
  }, [ready])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lost.slice(0, 40)))
    } catch {
      /* storage unavailable */
    }
  }, [lost])

  const onLose = useCallback((s: SockDesign) => setLost((l) => [{ ...s, id: s.id + Date.now() }, ...l]), [])
  const onDone = useCallback(() => setReady(true), [])

  const voidCount = BASELINE + lost.length

  return (
    <ClickSpark>
      <Preloader onDone={onDone} />
      <Cursor />
      <Nav ready={ready} voidCount={voidCount} />
      <main>
        <Hero ready={ready} />
        <Manifesto />
        <Exhibits />
        <Forge lost={lost} onLose={onLose} />
        <Matchmaker />
      </main>
      <Outro voidCount={voidCount} />
      <div className="grain" aria-hidden />
    </ClickSpark>
  )
}
