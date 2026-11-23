import { ArrowRight } from 'lucide-react';
import { HOME } from '../../data/images';
import { useInView } from '../../hooks/useInView';

export default function CtaSection({ onStart }) {
  const [ref, inView] = useInView();

  return (
    <section id="get-started" aria-label="Get started with Kova" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card close-cta">
          <img
            src={HOME.ctaInterior.src}
            alt={HOME.ctaInterior.alt}
            className="cta-photo"
            width={HOME.ctaInterior.w}
            height={HOME.ctaInterior.h}
            loading="lazy"
          />
          <div className="cta-shade" aria-hidden="true" />
          <div className="cta-body">
            <h3 className="cta-title">Bring your home together</h3>
            <p className="cta-desc">
              Start your Kova journey today and experience the smarter way of living.
            </p>
            <button type="button" className="gold-button" onClick={onStart}>
              Get Started Free <ArrowRight size={15} />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
