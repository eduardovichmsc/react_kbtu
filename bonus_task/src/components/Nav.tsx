import { motion } from 'motion/react'
import { scrollToTarget } from '../lib/smooth'

const LINKS = [
  { href: '#exhibits', label: 'Exhibits' },
  { href: '#forge', label: 'Sock Forge' },
  { href: '#match', label: 'Matchmaker' },
]

export default function Nav({ ready, voidCount }: { ready: boolean; voidCount: number }) {
  return (
    <motion.header
      className="nav"
      initial={{ y: -80, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <button className="nav-logo" onClick={() => scrollToTarget(0)} data-cursor="top">
        VOID<span>/</span>SOCK
      </button>
      <nav className="nav-links">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget(l.href)
            }}
          >
            <span data-text={l.label}>{l.label}</span>
          </a>
        ))}
      </nav>
      <div className="nav-live">
        <i />
        <span>{voidCount.toLocaleString('en-US')} in the void</span>
      </div>
    </motion.header>
  )
}
