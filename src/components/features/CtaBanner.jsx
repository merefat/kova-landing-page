import { ArrowRight } from 'lucide-react';
import KovaMark from '../KovaMark';
import { FI } from '../../data/featureImages';
import { useInView } from '../../hooks/useInView';

// Bottom CTA — gold-bordered glass panel over subtle light trails.
export default function CtaBanner({ onStart }) {
  const [ref, inView] = useInView();

  return (
    <section className="fcta" aria-label="Get started with Kova" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <div className="fcta-wrap">
          <img className="fcta-trails" src={FI.ctaTrails.src} alt="" loading="lazy" aria-hidden="true" />
          <div className="fcta-panel">
            <span className="fcta-icon" aria-hidden="true">
              <KovaMark size={34} />
            </span>
            <div className="fcta-copy">
              <h3>Ready to experience the full power of Kova?</h3>
              <p>Join thousands of smart homeowners today.</p>
            </div>
            <button type="button" className="gold-button fcta-btn" onClick={onStart}>
              Get Started Free <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
