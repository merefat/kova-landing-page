import { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Cloud } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { byGroup } from '../../data/integrations';
import { BrandIcon, iconTone } from './icons';
import { StatusPill } from './StatusPill';

// Cloud Services — intro copy beside a scroll-snap row of the five
// cloud-only integrations. Prev/next buttons appear only when the row
// actually overflows.
export default function CloudServicesPanel({ onGuide, onOverview }) {
  const [ref, vis] = useInView();
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const cloud = byGroup('cloud');

  const page = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.8, 560);
    el.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section id="ni-sec-cloud" ref={ref} className={`ni-sec container reveal ${vis ? 'is-visible' : ''}`}>
      <div className="ni-panel ni-cloud">
        <div className="ni-cloud-intro">
          <p className="ni-eyebrow ni-eyebrow-blue">
            <Cloud size={13} aria-hidden="true" /> Cloud Services
          </p>
          <h2 className="ni-sec-title">Cloud Services</h2>
          <p className="ni-cloud-sub">One-time setup for cloud-only integrations.</p>
          <p className="ni-cloud-note">
            These brands have no local API — Kova links to their cloud once,
            then keeps working. Everything else stays on your network.
          </p>
          <button type="button" className="ni-text-link" onClick={() => onOverview?.('cloud')}>
            View Cloud Integrations <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>

        <div className="ni-cloud-side">
          <div
            className="ni-cloud-track"
            ref={trackRef}
            role="region"
            aria-label="Cloud integrations"
            tabIndex={0}
          >
            {cloud.map((item) => (
              <button
                key={item.id}
                type="button"
                className="ni-cloud-card"
                data-integral={item.id}
                onClick={() => onGuide?.(item.id)}
                aria-label={`${item.name} setup guide — cloud`}
              >
                <span className="ni-cloud-icon" data-tone={iconTone(item.id)} aria-hidden="true">
                  <BrandIcon icon={item.icon} size={24} tone={iconTone(item.id)} />
                </span>
                <span className="ni-cloud-name">{item.name}</span>
                <StatusPill status={item.status} className="ni-cloud-status" />
                <span className="ni-cloud-sum">{item.summary}</span>
                <ChevronRight size={14} className="ni-tile-chev" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="ni-cloud-nav">
            <button type="button" className="ni-cloud-arrow" aria-label="Scroll cloud integrations back" onClick={() => page(-1)}>
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button type="button" className="ni-cloud-arrow" aria-label="Scroll cloud integrations forward" onClick={() => page(1)}>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
