import { useState } from 'react';
import { ArrowRight, Play, Home, Cpu, Workflow, Puzzle } from 'lucide-react';
import { HOME } from '../../data/images';
import HeroPanel from './HeroPanel';

const TRUST = [
  { icon: Cpu, label: 'Local-First' },
  { icon: Workflow, label: 'Powerful Automations' },
  { icon: Puzzle, label: 'Works With Everything' },
];

export default function HeroSection({ onStart, onWatch }) {
  const [level, setLevel] = useState(72);
  const [on, setOn] = useState(true);

  return (
    <section
      className="hero"
      id="top"
      aria-label="Kova — a smarter home, a simpler life"
      style={{ '--lvl': on ? level / 100 : 0 }}
    >
      {/* Preloaded photo is also the CSS background; the img keeps LCP +
          accessibility semantics and stays visually hidden. */}
      <img
        src={HOME.heroVilla.src}
        alt={HOME.heroVilla.alt}
        className="hero-img"
        width={HOME.heroVilla.w}
        height={HOME.heroVilla.h}
        fetchPriority="high"
      />
      <div className="hero-glow" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <Home size={12} aria-hidden="true" /> Your Smart Home, Simplified
          </p>
          <h1 className="hero-title">
            A Smarter Home.
            <br />
            A <em>Simpler Life.</em>
          </h1>
          <p className="hero-desc">
            Kova brings all your devices, routines and people together — so your
            home just works, around you.
          </p>

          <div className="hero-ctas">
            <button type="button" className="gold-button hero-cta" onClick={onStart}>
              Start Your Journey <ArrowRight size={15} />
            </button>
            <button type="button" className="hero-watch" onClick={onWatch}>
              <Play size={13} aria-hidden="true" /> Watch Demo
            </button>
          </div>

          <ul className="hero-trust" aria-label="What makes Kova different">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={13} aria-hidden="true" /> {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroPanel
          level={level}
          on={on}
          onLevel={setLevel}
          onPower={() => setOn((v) => !v)}
        />
      </div>
    </section>
  );
}
