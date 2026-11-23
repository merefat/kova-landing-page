import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Cloud, LayoutGrid, Wifi } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { byGroup, counts } from '../../data/integrations';
import IntegrationTile from './IntegrationTile';

const GROUP_META = [
  { id: 'local', label: 'Local Connections', sub: 'Direct, local control. No cloud required.', icon: Wifi, anchor: 'ni-sec-local' },
  { id: 'cloud', label: 'Cloud Services', sub: 'One-time setup for cloud-only integrations.', icon: Cloud, anchor: 'ni-sec-cloud' },
  { id: 'service', label: 'Services & More', sub: 'Presence, bridges, import and webhooks.', icon: LayoutGrid, anchor: 'ni-sec-services' },
];

// "Your Connections" workspace — category rail on the left (horizontal
// strip on small screens), the 18 local tiles on the right.
export default function ConnectionsPanel({ onGuide, onOverview, onDocs }) {
  const [ref, vis] = useInView();
  const local = byGroup('local');
  const c = counts();
  const [activeGroup, setActiveGroup] = useState('local');

  // Keep the rail's current item in sync with scrolling: whichever group
  // section is occupying the viewport wins.
  useEffect(() => {
    const sections = GROUP_META
      .map((g) => document.getElementById(g.anchor))
      .filter(Boolean);
    if (!('IntersectionObserver' in window) || !sections.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const g = GROUP_META.find((m) => m.anchor === e.target.id);
            if (g) setActiveGroup(g.id);
          }
        });
      },
      { rootMargin: '-30% 0px -55% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const jump = (g) => {
    setActiveGroup(g.id);
    document.getElementById(g.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="ni-sec-local" ref={ref} className={`ni-sec container reveal ${vis ? 'is-visible' : ''}`}>
      <header className="ni-sec-head">
        <h2 className="ni-sec-title">Your Connections</h2>
        <span className="ni-pill ni-pill-blue ni-conn-count">
          <span className="ni-pill-dot" aria-hidden="true" />
          {c.total} supported connections
        </span>
      </header>

      <div className="ni-panel ni-workspace">
        <aside className="ni-side" aria-label="Connection categories">
          <nav className="ni-side-nav">
            {GROUP_META.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`ni-side-item ${activeGroup === g.id ? 'is-active' : ''}`}
                aria-current={activeGroup === g.id ? 'true' : undefined}
                onClick={() => jump(g)}
              >
                <g.icon size={17} className="ni-side-icon" aria-hidden="true" />
                <span className="ni-side-text">
                  <span className="ni-side-label">{g.label}</span>
                  <span className="ni-side-sub">{g.sub}</span>
                </span>
              </button>
            ))}
          </nav>

          <div className="ni-help">
            <p className="ni-help-title">Need help?</p>
            <p className="ni-help-sub">Step-by-step setup guides for every connection.</p>
            <button type="button" className="ni-help-link" onClick={onDocs}>
              <BookOpen size={14} aria-hidden="true" /> View Docs <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
        </aside>

        <div className="ni-local">
          <div className="ni-local-head">
            <div>
              <h3 className="ni-local-title">Local Connections</h3>
              <p className="ni-local-sub">
                Direct, local control. No cloud required — {local.length} integrations.
              </p>
            </div>
            <button type="button" className="ni-text-link" onClick={() => onOverview?.('all')}>
              Manage All <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>

          <div className="ni-tile-grid" role="list">
            {local.map((item) => (
              <div role="listitem" key={item.id} className="ni-tile-cell">
                <IntegrationTile item={item} onGuide={onGuide} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
