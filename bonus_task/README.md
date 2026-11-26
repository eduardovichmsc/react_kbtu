# VOID/SOCK — The Museum of Lost Socks 🧦🌀

> Where do socks go? Into the drum, through a portal, and into the world's first museum for unpaired socks.

**Live demo:** _add your GitHub Pages link here_ (e.g. `https://<username>.github.io/<repo>/`)

## Project idea

Every household knows the mystery: two socks go into the washing machine, one comes out.
**VOID/SOCK** treats it as a real phenomenon. It is an awwwards-style website for a fictional museum on the *other side of the washing machine drum*, where all the lost socks end up.

It is a scroll-driven experience with sections like a real museum:

| Section | What happens |
| --- | --- |
| **Preloader** | A 0→100% counter "searching the drum", then a clip-path reveal |
| **Hero** | Kinetic split-letter title, a spinning washing-machine drum with water and socks inside (rotates with scroll), floating socks with mouse parallax |
| **Manifesto** | A velocity-based marquee that speeds up and reverses with your scroll, plus a scroll-scrubbed word-by-word blur reveal |
| **Hall of the Unpaired** | Pinned horizontal-scroll gallery of "exhibits" (lost socks with funny museum labels); each sock rotates as it passes |
| **The Sock Forge** | Design your own sock (colour, accent, pattern, length, name), then press **Feed to the void**. The sock spins into a vortex, you get a "transfer receipt", and it is logged in your personal collection (saved in localStorage). The global "socks in the void" counter in the navbar goes up |
| **Odd Sock Matchmaker** | A memory game with 3D flipping cards: reunite 6 procedurally generated sock pairs against the clock |
| **Outro** | Count-up stats, a giant masked "LOST & FOUND?" title, and a magnetic back-to-top button |

Extra polish: custom cursor with contextual labels, click sparks everywhere, Lenis smooth scrolling, a film-grain overlay, and procedurally generated SVG socks (every sock is drawn in code, with no images). Fully responsive: on mobile the horizontal gallery becomes a swipeable carousel and the game grid adapts.

## Tech stack

- **React 19 + TypeScript + Vite**
- **GSAP** (ScrollTrigger, SplitText, `@gsap/react`): pinning, scrubbing, horizontal scroll, text reveals
- **Motion** (`motion/react`): springs, AnimatePresence, layout animations, 3D card flips
- **Lenis**: smooth scrolling synced with ScrollTrigger
- **React Bits** components (adapted): `SplitText`, `ScrollVelocity`, `ScrollReveal`, `FadeContent`, `Magnet`, `ClickSpark`, `CountUp` from [reactbits.dev](https://reactbits.dev)

## Run locally

```bash
npm install
npm run dev
```

## Deploy

The repo includes `.github/workflows/deploy.yml`. Every push to `main` builds the app and publishes it to **GitHub Pages**. In the repository settings, set **Settings → Pages → Source → GitHub Actions**.

## The exact prompt

```
дали задачу по react

нужно сделать как в awwwards
с анимациями (motion, gsap и тд)
используй компоненты с https://reactbits.dev/ если найдешь подходящие
```
