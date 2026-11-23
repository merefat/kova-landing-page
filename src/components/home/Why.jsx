import { ArrowRight, Check } from 'lucide-react';
import KovaMark from '../KovaMark';
import { HOME } from '../../data/images';
import { useInView } from '../../hooks/useInView';

const WHY = [
  'Smart, intuitive and powerful',
  'Privacy-conscious, local-first control',
  'Works with supported existing devices',
  'Built for real homes and families',
];

export default function Why() {
  const [ref, inView] = useInView();

  return (
    <section id="why" aria-label="Why choose Kova" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card close-why">
          <img
            src={HOME.whyHologram.src}
            alt={HOME.whyHologram.alt}
            className="why-photo"
            width={HOME.whyHologram.w}
            height={HOME.whyHologram.h}
            loading="lazy"
          />
          <div className="why-shade" aria-hidden="true" />

          <div className="why-split">
            {/* Kova brand mark */}
            <div className="why-brand" aria-hidden="true">
              <span className="close-brand-glow" />
              <KovaMark size={76} className="close-brand-icon" />
              <p className="close-brand-name">Kova</p>
              <p className="close-brand-tag">A smarter home. A simpler life.</p>
            </div>

            <div className="why-copy">
              <p className="card-kicker">Why Kova</p>
              <h3 className="pm-title">Why people choose Kova</h3>
              <ul className="why-list">
                {WHY.map((w) => (
                  <li key={w}>
                    <span className="why-check" aria-hidden="true">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
              <a className="link-cta" href="#how">
                Discover the Difference <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
