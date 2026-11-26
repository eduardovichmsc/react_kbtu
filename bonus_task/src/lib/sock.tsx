import { useId, type CSSProperties } from 'react'

export type Pattern = 'plain' | 'stripes' | 'dots' | 'zigzag' | 'argyle' | 'hearts'
export type Length = 'ankle' | 'crew' | 'knee'

export interface SockDesign {
  id: string
  name: string
  base: string
  accent: string
  pattern: Pattern
  length: Length
  ghost?: boolean
}

export const PATTERNS: Pattern[] = ['plain', 'stripes', 'dots', 'zigzag', 'argyle', 'hearts']
export const LENGTHS: Length[] = ['ankle', 'crew', 'knee']
export const BASES = ['#ff4fa3', '#d4ff3a', '#4f7cff', '#ff7a1a', '#f2efe6', '#8b5cf6', '#14b8a6', '#111111']
export const ACCENTS = ['#111111', '#f2efe6', '#ff4fa3', '#d4ff3a', '#4f7cff', '#ffd400', '#ff3b30']

const ADJ = ['Brave', 'Soggy', 'Lonely', 'Electric', 'Midnight', 'Fuzzy', 'Rebellious', 'Velvet', 'Disco', 'Melancholic', 'Cosmic', 'Sneaky']
const NOUN = ['Leftie', 'Wanderer', 'Runaway', 'Drifter', 'Nomad', 'Escapee', 'Philosopher', 'Bandit', 'Pilgrim', 'Ghost']

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

export const randomName = () => `The ${pick(ADJ)} ${pick(NOUN)}`

export function randomSock(): SockDesign {
  const base = pick(BASES)
  let accent = pick(ACCENTS)
  while (accent === base) accent = pick(ACCENTS)
  return {
    id: Math.random().toString(36).slice(2, 9),
    name: randomName(),
    base,
    accent,
    pattern: pick(PATTERNS),
    length: pick(LENGTHS),
  }
}

const TOP: Record<Length, number> = { ankle: 92, crew: 46, knee: 6 }

const bodyPath = (top: number) =>
  `M40 ${top} H92 V128 L136 150 Q158 162 151 186 Q143 207 116 202 L62 194 Q36 190 37 162 Z`

interface SockProps {
  design: Omit<SockDesign, 'id' | 'name'> & Partial<Pick<SockDesign, 'id' | 'name'>>
  className?: string
  style?: CSSProperties
}

export function Sock({ design, className, style }: SockProps) {
  const raw = useId()
  const uid = 's' + raw.replace(/[^a-zA-Z0-9_-]/g, '')
  const top = TOP[design.length]
  const d = bodyPath(top)
  const { base, accent, pattern, ghost } = design

  if (ghost) {
    return (
      <svg viewBox="0 0 160 215" className={className} style={style} aria-label="Invisible sock">
        <path d={d} fill="none" stroke="currentColor" strokeWidth={3} strokeDasharray="8 8" strokeLinejoin="round" />
        <text x="66" y="150" fontSize="22" fill="currentColor" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic">
          ?
        </text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 160 215" className={className} style={style} aria-label={design.name ?? 'Sock'}>
      <defs>
        <clipPath id={`${uid}-clip`}>
          <path d={d} />
        </clipPath>
        <pattern id={`${uid}-stripes`} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="9" fill={accent} />
        </pattern>
        <pattern id={`${uid}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="3.6" fill={accent} />
        </pattern>
        <pattern id={`${uid}-zigzag`} width="24" height="16" patternUnits="userSpaceOnUse">
          <polyline points="0,12 6,4 12,12 18,4 24,12" fill="none" stroke={accent} strokeWidth="3.5" />
        </pattern>
        <pattern id={`${uid}-argyle`} width="34" height="34" patternUnits="userSpaceOnUse">
          <polygon points="17,0 34,17 17,34 0,17" fill={accent} opacity="0.55" />
          <path d="M0 0 L34 34 M34 0 L0 34" stroke={accent} strokeWidth="1.4" />
        </pattern>
        <pattern id={`${uid}-hearts`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M12 19 C3 12 5 5 9.5 5.5 C11 5.7 12 7 12 8 C12 7 13 5.7 14.5 5.5 C19 5 21 12 12 19Z" fill={accent} />
        </pattern>
      </defs>
      <g clipPath={`url(#${uid}-clip)`}>
        <rect width="160" height="215" fill={base} />
        {pattern !== 'plain' && <rect width="160" height="215" fill={`url(#${uid}-${pattern})`} />}
        {/* cuff */}
        <rect x="38" y={top} width="56" height="22" fill={accent} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={46 + i * 8} y1={top + 3} x2={46 + i * 8} y2={top + 19} stroke={base} strokeWidth="2" opacity="0.6" />
        ))}
        {/* heel + toe */}
        <path d="M37 160 Q36 190 62 194 L68 170 Q50 168 46 150 Z" fill={accent} />
        <path d="M136 150 Q158 162 151 186 Q143 207 116 202 L126 168 Z" fill={accent} />
      </g>
      <path d={d} fill="none" stroke="#0e0e0e" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  )
}
