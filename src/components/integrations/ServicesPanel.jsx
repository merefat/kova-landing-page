import { ArrowRight, ChevronRight, LayoutGrid, LockKeyhole } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { byGroup } from '../../data/integrations';
import { BrandIcon, iconTone } from './icons';

// Services & More — presence, notifications, the two bridges, HA import,
// the phone app and webhooks. Wide cards; Webhooks can span the row.
export default function ServicesPanel({ onGuide, onOverview }) {
  const [ref, vis] = useInView();
  const services = byGroup('service');

  return (
    <section id="ni-sec-services" ref={ref} className={`ni-sec container reveal ${vis ? 'is-visible' : ''}`}>
      <div className="ni-sec-head ni-sec-head-row">
        <div>
          <p className="ni-eyebrow ni-eyebrow-violet">
            <LayoutGrid size={13} aria-hidden="true" /> Services &amp; More
          </p>
          <h2 className="ni-sec-title">Services &amp; More</h2>
          <p className="ni-services-sub">Go beyond devices — presence, alerts, bridges and webhooks.</p>
        </div>
        <button type="button" className="ni-text-link" onClick={() => onOverview?.('service')}>
          Explore Services <ArrowRight size={13} aria-hidden="true" />
        </button>
      </div>

      <div className="ni-svc-grid">
        {services.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`ni-svc-card ${item.id === 'webhooks' ? 'ni-svc-wide' : ''}`}
            data-integral={item.id}
            onClick={() => onGuide?.(item.id)}
            aria-label={`${item.name} setup guide`}
          >
            <span className="ni-svc-icon" data-tone={iconTone(item.id)} aria-hidden="true">
              <BrandIcon icon={item.icon} size={22} tone={iconTone(item.id)} />
            </span>
            <span className="ni-svc-body">
              <span className="ni-svc-name">
                {item.name}
                {item.warning && (
                  <span className="ni-flag" title={item.warning.text}>
                    <LockKeyhole size={11} aria-hidden="true" /> No locks or alarms
                  </span>
                )}
              </span>
              <span className="ni-svc-sum">{item.summary}</span>
            </span>
            <ChevronRight size={15} className="ni-tile-chev" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
