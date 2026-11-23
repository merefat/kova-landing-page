import { ArrowRight } from 'lucide-react';
import { HOW } from '../../data/howImages';
import { useInView } from '../../hooks/useInView';

export default function HowFinalCTA({ onStart }) {
  const [ref, inView] = useInView();

  return (
    <section id="how-cta" className="hiw-cta" aria-label="Get started with Kova" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <div className="hiw-cta-card">
          <div className="hiw-cta-body">
            <h2 className="hiw-cta-title">Ready to Experience a Smarter Home?</h2>
            <p className="hiw-cta-desc">
              Bring Kova into your home and discover the difference.
            </p>
            <button type="button" className="gold-button" onClick={onStart}>
              Get Started Free <ArrowRight size={15} />
            </button>
          </div>
          <div className="hiw-cta-photo" aria-hidden="true">
            <img
              src={HOW.ctaHouse.src}
              alt=""
              width={HOW.ctaHouse.w}
              height={HOW.ctaHouse.h}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
