import { ArrowRight, Waypoints } from 'lucide-react';
import { integrationImages } from '../../data/integrationImages';
import { useInView } from '../../hooks/useInView';

// Bottom CTA — "Ready to connect everything?" over the night-villa photo
// and SVG light-trail waves.
export default function BottomCTA({ onStart }) {
  const [ref, vis] = useInView();
  return (
    <section ref={ref} className={`ni-sec ni-cta-sec container reveal ${vis ? 'is-visible' : ''}`}>
      <div className="ni-panel ni-cta">
        <img
          className="ni-cta-photo"
          src={integrationImages.cta.src}
          alt={integrationImages.cta.alt}
          width={integrationImages.cta.w}
          height={integrationImages.cta.h}
          loading="lazy"
        />
        <div className="ni-cta-shade" aria-hidden="true" />
        <svg className="ni-cta-waves" viewBox="0 0 1200 320" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,250 C220,120 420,300 640,190 C840,90 1000,210 1200,120" fill="none" stroke="url(#ni-wa)" strokeWidth="1.4" opacity="0.7" />
          <path d="M0,290 C260,170 460,320 700,230 C920,150 1040,260 1200,180" fill="none" stroke="url(#ni-wb)" strokeWidth="1.2" opacity="0.5" />
          <path d="M0,210 C180,90 480,250 660,140 C860,40 1080,170 1200,80" fill="none" stroke="url(#ni-wa)" strokeWidth="1" opacity="0.35" />
          <defs>
            <linearGradient id="ni-wa" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#54A8F4" stopOpacity="0" />
              <stop offset="0.55" stopColor="#54A8F4" />
              <stop offset="1" stopColor="#40C7FF" />
            </linearGradient>
            <linearGradient id="ni-wb" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#F4B942" stopOpacity="0" />
              <stop offset="0.6" stopColor="#F4B942" />
              <stop offset="1" stopColor="#FFD477" />
            </linearGradient>
          </defs>
        </svg>

        <div className="ni-cta-inner">
          <span className="ni-cta-icon" aria-hidden="true">
            <Waypoints size={26} strokeWidth={1.8} />
          </span>
          <h2 className="ni-cta-title">Ready to connect everything?</h2>
          <p className="ni-cta-sub">
            One hub, your whole home — every connection stays yours.
          </p>
          <button type="button" className="ni-btn ni-btn-primary ni-cta-btn" onClick={onStart}>
            Get Started Free <ArrowRight size={16} aria-hidden="true" />
          </button>
          <p className="ni-cta-note">
            Brand names and marks belong to their owners; they appear here
            only to show what Kova connects to.
          </p>
        </div>
      </div>
    </section>
  );
}
