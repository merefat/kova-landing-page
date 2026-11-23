import { Cable, ChevronRight, Play } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { counts } from '../../data/integrations';
import { integrationImages } from '../../data/integrationImages';
import NetworkOrbit from './NetworkOrbit';

// /integrations hero — copy left, night-house image right with the
// network orbit overlaid on the image's lit windows.
export default function IntegrationsHero({ onStart, onWatch, onGuide }) {
  const [ref, vis] = useInView();
  const c = counts();
  return (
    <section ref={ref} className={`ni-hero reveal ${vis ? 'is-visible' : ''}`}>
      <div className="ni-hero-media" aria-hidden="true">
        <img
          className="ni-hero-img"
          src={integrationImages.hero.src}
          srcSet={`${integrationImages.hero.srcSm} 900w, ${integrationImages.hero.src} 1672w`}
          sizes="100vw"
          alt={integrationImages.hero.alt}
          loading="eager"
          decoding="async"
        />
        <div className="ni-hero-shade" />
      </div>

      <div className="ni-hero-inner container">
        <div className="ni-hero-copy">
          <p className="ni-eyebrow">
            <Cable size={13} aria-hidden="true" /> Network &amp; Integrations
          </p>
          <h1 className="ni-hero-h1">
            Every device. <span className="ni-hero-h1-hi">One home network.</span>
          </h1>
          <p className="ni-hero-sub">
            Kova talks to the things in your home directly over your own
            network — no detour through someone else&rsquo;s cloud.
            {` ${c.local} local integrations, ${c.cloud} cloud links for the
            few brands with no local API, and ${c.service} bridges and
            services on top.`}
          </p>
          <div className="ni-hero-stats" role="list">
            <span role="listitem" className="ni-stat"><strong>{c.local}</strong> local</span>
            <span role="listitem" className="ni-stat"><strong>{c.cloud}</strong> cloud</span>
            <span role="listitem" className="ni-stat"><strong>{c.service}</strong> services</span>
            <span role="listitem" className="ni-stat"><strong>0</strong> cloud required</span>
          </div>
          <div className="ni-hero-actions">
            <button type="button" className="ni-btn ni-btn-primary" onClick={onStart}>
              Get Started Free <ChevronRight size={16} aria-hidden="true" />
            </button>
            <button type="button" className="ni-btn ni-btn-ghost" onClick={onWatch}>
              <Play size={14} aria-hidden="true" /> See How It Works
            </button>
          </div>
        </div>

        <NetworkOrbit className="ni-hero-orbit" onGuide={onGuide} />
      </div>
    </section>
  );
}
