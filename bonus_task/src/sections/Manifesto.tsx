import ScrollReveal from '../components/reactbits/ScrollReveal'
import ScrollVelocity from '../components/reactbits/ScrollVelocity'

export default function Manifesto() {
  return (
    <>
      <ScrollVelocity
        className="velocity-text"
        velocity={55}
        texts={[
          <>LOST ✺ NEVER FOUND ✺ ONE OF A PAIR ✺&nbsp;</>,
          <>LEFT BEHIND ✺ SPUN AWAY ✺ STILL DAMP ✺&nbsp;</>,
        ]}
      />
      <section className="manifesto">
        <ScrollReveal highlight={['vanish', 'drum', 'museum']}>
          Every year billions of socks vanish somewhere between the washer and the dryer. Science shrugs. Your mom blames you.
          We followed them through the drum and built a museum on the other side.
        </ScrollReveal>
      </section>
    </>
  )
}
