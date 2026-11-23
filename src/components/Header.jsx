import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import KovaMark from './KovaMark';

const NAV = [
  { label: 'Home', key: 'home', href: '/' },
  { label: 'Features', key: 'features', href: '/features' },
  { label: 'How It Works', key: 'how', href: '/how-it-works' },
  {
    label: 'Integrations',
    key: 'integrations',
    href: '/integrations',
    dropdown: [
      { label: 'Local Connections', href: '/integrations#ni-sec-local', desc: '18 direct, no-cloud integrations' },
      { label: 'Cloud Services', href: '/integrations#ni-sec-cloud', desc: 'The 5 cloud-only links' },
      { label: 'Services & More', href: '/integrations#ni-sec-services', desc: 'Presence, bridges, webhooks' },
    ],
  },
];

export default function Header({ route = 'home', onNavigate, onGetStarted, onWatch }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const active = route; // route names match NAV keys 1:1

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route links start with '/' — hand them to the router. Plain '#anchor'
  // links keep native smooth-scroll behaviour on the current page.
  const handleEntry = (e, entry) => {
    if (entry.action === 'watch') {
      e.preventDefault();
      onWatch?.();
    } else if (entry.action === 'start') {
      e.preventDefault();
      onGetStarted?.();
    } else if (entry.href?.startsWith('/')) {
      e.preventDefault();
      onNavigate?.(entry.href);
    }
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-bar">
        {/* Brand */}
        <a
          href="/"
          className="brand"
          aria-label="Kova home"
          onClick={(e) => handleEntry(e, { href: '/' })}
        >
          <KovaMark size={34} className="brand-icon" />
          Kova
        </a>

        {/* Center pill nav */}
        <nav className="nav-pill" aria-label="Primary">
          {NAV.map((item) => (
            <div
              key={item.label}
              className={`nav-item ${openMenu === item.label ? 'open' : ''}`}
              onMouseEnter={() => item.dropdown && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <a
                href={item.href}
                className={`nav-link ${active === item.key ? 'active' : ''}`}
                onClick={(e) => handleEntry(e, item)}
              >
                {item.label}
                {item.dropdown && <ChevronDown size={12} className="chev" />}
              </a>
              {item.dropdown && (
                <div className="nav-dropdown">
                  {item.dropdown.map((entry) => (
                    <a
                      key={entry.label}
                      href={entry.href ?? '/'}
                      onClick={(e) => handleEntry(e, entry)}
                    >
                      <span className="nav-dd-label">{entry.label}</span>
                      {entry.desc && <span className="nav-dd-desc">{entry.desc}</span>}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="nav-actions">
          <button type="button" className="gold-button nav-cta" onClick={onGetStarted}>
            Get Started <ArrowRight size={15} />
          </button>
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav className={`mobile-menu ${mobileOpen ? 'open' : ''}`} aria-label="Mobile">
        {NAV.map((item) => (
          <div key={item.label} className="mobile-group">
            <a
              href={item.href}
              className={active === item.key ? 'active' : ''}
              onClick={(e) => handleEntry(e, item)}
            >
              {item.label}
            </a>
            {item.dropdown &&
              item.dropdown.map((entry) => (
                <a
                  key={entry.label}
                  href={entry.href ?? '/'}
                  className="mobile-sub"
                  onClick={(e) => handleEntry(e, entry)}
                >
                  {entry.label}
                </a>
              ))}
          </div>
        ))}
      </nav>
    </header>
  );
}
