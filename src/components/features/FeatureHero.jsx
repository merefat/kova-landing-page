import { Play, Zap, ShieldCheck, Lock, Music, Leaf } from 'lucide-react';
import { FI } from '../../data/featureImages';

// Features-page hero — full-bleed house photo, left-fade into navy,
// floating glass bubbles on the orbit arc (decorative).
const BUBBLES = [
  { icon: ShieldCheck, cls: 'fp-b1' },
  { icon: Lock, cls: 'fp-b2' },
  { icon: Music, cls: 'fp-b3' },
  { icon: Leaf, cls: 'fp-b4 leaf' },
];

export default function FeatureHero({ onWatch }) {
  return (
    <section className="fp-hero" aria-label="Kova — Take Control. Live Smarter.">
      <img
        className="fp-hero-img"
        src={FI.heroHouse.src}
        alt={FI.heroHouse.alt}
        width={FI.heroHouse.w}
        height={FI.heroHouse.h}
        fetchPriority="high"
      />
      <div className="fp-hero-fade" aria-hidden="true" />

      <div className="container fp-hero-inner">
        <div className="fp-hero-copy">
          <p className="fp-hero-eyebrow">
            <Zap size={12} aria-hidden="true" /> Powerful. Local. Yours.
          </p>
          <h1 className="fp-hero-title">
            Take Control.
            <br />
            <em>Live Smarter.</em>
          </h1>
          <p className="fp-hero-desc">
            From smart automation to complete home security, Kova puts the
            power in your hands — you decide, Kova makes it happen.
          </p>
          <button type="button" className="fp-watch" onClick={onWatch}>
            <span className="fp-watch-icon" aria-hidden="true">
              <Play size={13} />
            </span>
            Watch How It Works
          </button>
        </div>

        <svg className="fp-orbit" viewBox="0 0 640 400" fill="none" aria-hidden="true">
          <path
            className="fp-orbit-path"
            d="M40 60 C 180 -20, 420 -30, 600 90"
          />
        </svg>
        <div className="fp-bubbles" aria-hidden="true">
          {BUBBLES.map(({ icon: Icon, cls }) => (
            <span key={cls} className={`fp-bubble ${cls}`}>
              <Icon size={22} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
