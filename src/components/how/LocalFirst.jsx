import { ArrowRight, Check, Database, ShieldCheck, Lock } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { HOW } from '../../data/howImages';

const CHIPS = [
  { icon: Database, label: 'Your Data Stays Home' },
  { icon: ShieldCheck, label: 'Advanced Security' },
  { icon: Lock, label: 'Full Privacy Control' },
];

export default function LocalFirst({ onNavigate }) {
  const [ref, inView] = useInView();

  return (
    <section id="local-first" className="hiw-local" aria-label="Local-first architecture" ref={ref}>
      <img
        src={HOW.localVilla.src}
        alt=""
        className="hiw-bg"
        width={HOW.localVilla.w}
        height={HOW.localVilla.h}
        loading="lazy"
      />
      <div className="hiw-scrim scrim-local" aria-hidden="true" />
      <div className={`container local-grid reveal ${inView ? 'is-visible' : ''}`}>
        {/* Left: copy */}
        <div className="hiw-copy">
          <span className="hiw-label">Local-First</span>
          <h2 className="hiw-sec-title left">Your Home, Your Control</h2>
          <p className="hiw-sec-desc left">
            Kova runs locally, keeping your core home control close to home,
            with optional cloud features when needed.
          </p>
          <ul className="hiw-points">
            <li><Check size={14} aria-hidden="true" /> Local-first architecture</li>
            <li><Check size={14} aria-hidden="true" /> Secure and private</li>
            <li><Check size={14} aria-hidden="true" /> No unnecessary cloud dependence</li>
          </ul>
          <button
            type="button"
            className="link-cta"
            onClick={() => onNavigate?.('/#local-first')}
          >
            Learn More <ArrowRight size={13} />
          </button>
        </div>

        {/* Centre/right: shield-lock + circuits over the house photo */}
        <div className="local-visual" aria-hidden="true">
          <svg className="local-circuits" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid meet">
            <g className="circuit-lines">
              <path d="M20 226 H112 L150 188 H208" />
              <path d="M40 90 H118 L152 124 H208" />
              <path d="M300 70 L268 106 V150 H232" />
              <path d="M398 210 H312 L280 178 H240" />
              <path d="M210 268 V232 L222 220" />
              <circle cx="20" cy="226" r="3.5" />
              <circle cx="40" cy="90" r="3.5" />
              <circle cx="300" cy="70" r="3.5" />
              <circle cx="398" cy="210" r="3.5" />
              <circle cx="210" cy="268" r="3.5" />
            </g>
          </svg>
          <span className="local-shield">
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5l7.5 3v6c0 4.6-3.2 8.4-7.5 9.5-4.3-1.1-7.5-4.9-7.5-9.5v-6l7.5-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <rect x="9" y="10.4" width="6" height="5.2" rx="1.2" fill="currentColor" stroke="none" opacity="0.9" />
              <path d="M10.2 10.4V8.8a1.8 1.8 0 0 1 3.6 0v1.6" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
          </span>
        </div>

        {/* Far right: benefit chips */}
        <ul className="local-chips">
          {CHIPS.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={13} aria-hidden="true" /> {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
