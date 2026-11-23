import { useState } from 'react';
import { Sunrise, Sunset, MoonStar, Lightbulb, Thermometer, ShieldCheck, Sparkles } from 'lucide-react';
import { HOME } from '../../data/images';
import { useInView } from '../../hooks/useInView';
import DemoBadge from '../ui/DemoBadge';

const MODES = {
  morning: {
    icon: Sunrise,
    label: 'Morning',
    lights: 'Bright',
    rows: [
      { icon: Lightbulb, text: 'Lights gradually turn on' },
      { icon: Thermometer, text: 'Comfortable climate' },
      { icon: Sparkles, text: 'Morning routine begins' },
    ],
  },
  evening: {
    icon: Sunset,
    label: 'Evening',
    lights: 'Warm',
    rows: [
      { icon: Lightbulb, text: 'Warm lighting' },
      { icon: Sparkles, text: 'Relaxation atmosphere' },
      { icon: ShieldCheck, text: 'Evening mode becomes active' },
    ],
  },
  night: {
    icon: MoonStar,
    label: 'Night',
    lights: 'Off',
    rows: [
      { icon: Lightbulb, text: 'Main lights turn off' },
      { icon: ShieldCheck, text: 'Security mode activates' },
      { icon: MoonStar, text: 'Wind-down routine begins' },
    ],
  },
};

export default function DailyRhythm() {
  const [ref, inView] = useInView();
  const [mode, setMode] = useState('evening');
  const Active = MODES[mode];

  return (
    <section id="rhythm" aria-label="Daily rhythm modes" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card hr-card hr-rhythm" data-mode={mode}>
          <img
            src={HOME.rhythmRoom.src}
            alt={HOME.rhythmRoom.alt}
            className="rhythm-photo"
            width={HOME.rhythmRoom.w}
            height={HOME.rhythmRoom.h}
            loading="lazy"
          />
          <div className="rhythm-light" aria-hidden="true">
            <span className="rl-pendant rl-p1" />
            <span className="rl-pendant rl-p2" />
            <span className="rl-pendant rl-p3" />
          </div>
          <div className="rhythm-shade" aria-hidden="true" />

          <div className="rhythm-body">
            <div className="rhythm-head">
              <div>
                <p className="card-kicker">Daily rhythm</p>
                <h3 className="pm-title">Your home understands your daily rhythm</h3>
                <p className="card-desc">
                  Modes, moments and automations that fit your life.
                </p>
              </div>
              <DemoBadge />
            </div>

            <div className="rhythm-panel glass-panel">
              <div className="rhythm-tabs" role="tablist" aria-label="Preview home modes">
                {Object.entries(MODES).map(([key, m]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={mode === key}
                    className={`rhythm-tab ${mode === key ? 'active' : ''}`}
                    onClick={() => setMode(key)}
                  >
                    <m.icon size={13} aria-hidden="true" /> {m.label}
                  </button>
                ))}
              </div>
              <p className="rhythm-lights" aria-live="polite">
                <Lightbulb size={11} aria-hidden="true" />
                Lights: {Active.lights}
              </p>
              <ul className="rhythm-state" aria-live="polite">
                {Active.rows.map(({ icon: Icon, text }) => (
                  <li key={text}>
                    <span className="rhythm-dot" aria-hidden="true" />
                    <Icon size={13} aria-hidden="true" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
