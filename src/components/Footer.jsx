import { ArrowRight, ShieldCheck } from 'lucide-react';
import KovaMark from './KovaMark';

const EXPLORE = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Integrations', href: '/integrations' },
];

const CONNECT = [
  { label: 'Local Connections', href: '/integrations#ni-sec-local' },
  { label: 'Cloud Services', href: '/integrations#ni-sec-cloud' },
  { label: 'Services & More', href: '/integrations#ni-sec-services' },
];

export default function Footer({ onNavigate, onGetStarted, onWatch }) {
  const go = (e, href) => {
    e.preventDefault();
    onNavigate?.(href);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <a
              href="/"
              className="brand"
              aria-label="Kova home"
              onClick={(e) => go(e, '/')}
            >
              <KovaMark size={34} className="brand-icon" />
              Kova
            </a>
            <p className="footer-blurb">
              A smarter home. A simpler life — the local-first smart home that
              runs on your own network.
            </p>
            <p className="footer-local">
              <ShieldCheck size={13} aria-hidden="true" />
              Local-first · private by design
            </p>
          </div>

          {/* Sitemap */}
          <nav className="footer-col" aria-label="Explore">
            <h3 className="footer-heading">Explore</h3>
            <ul>
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => go(e, l.href)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Integrations">
            <h3 className="footer-heading">Integrations</h3>
            <ul>
              {CONNECT.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => go(e, l.href)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA */}
          <div className="footer-col footer-cta">
            <h3 className="footer-heading">Get started</h3>
            <p className="footer-blurb">
              Bring your home together — set up in an evening.
            </p>
            <div className="footer-cta-actions">
              <button type="button" className="gold-button" onClick={onGetStarted}>
                Get Started Free <ArrowRight size={14} />
              </button>
              <button type="button" className="link-cta" onClick={onWatch}>
                Watch how it works <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ClickBIT · Kova — local-first smart home</p>
          <p>Demo interfaces on this page are simulated and not connected to a real home.</p>
        </div>
      </div>
    </footer>
  );
}
