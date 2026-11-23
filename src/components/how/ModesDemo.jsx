import { useState } from 'react';
import {
  ArrowRight, Check, Sun, Sunset, MoonStar, Sunrise,
  Lightbulb, Thermometer, Home, Clapperboard, Plane, PartyPopper,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { HOW } from '../../data/howImages';
import DemoBadge from '../ui/DemoBadge';

const MODES = {
  day: {
    icon: Sun,
    label: 'Day',
    lighting: 'Bright',
    temp: '24°C',
    state: 'Day mode',
    note: 'Lights on, climate comfortable and more.',
  },
  evening: {
    icon: Sunset,
    label: 'Evening',
    lighting: 'Warm',
    temp: '23°C',
    state: 'Evening mode',
    note: 'Warm lighting and a relaxed atmosphere.',
  },
  night: {
    icon: MoonStar,
    label: 'Night',
    lighting: 'Dimmed',
    temp: '22°C',
    state: 'Night mode',
    note: 'Lights low, security armed for the night.',
  },
  dawn: {
    icon: Sunrise,
    label: 'Dawn',
    lighting: 'Gentle',
    temp: '22°C',
    state: 'Dawn mode',
    note: 'Gentle light, morning routine ready.',
  },
};

// Temporary overlays sit on top of the daily mode — they never replace it.
const OVERLAYS = {
  movie: {
    icon: Clapperboard,
    label: 'Movie',
    ends: 'Ends in 1h 30m',
    rows: [
      { icon: Lightbulb, text: 'Lights dimmed to 15%' },
      { icon: Home, text: 'TV and media ready' },
    ],
  },
  away: {
    icon: Plane,
    label: 'Away',
    ends: 'Until you return',
    rows: [
      { icon: Lightbulb, text: 'Lights simulate presence' },
      { icon: Home, text: 'Security fully armed' },
    ],
  },
  party: {
    icon: PartyPopper,
    label: 'Party',
    ends: 'Ends in 3h',
    rows: [
      { icon: Lightbulb, text: 'Colour lighting scenes' },
      { icon: Home, text: 'Audio in every room' },
    ],
  },
};

export default function ModesDemo({ onNavigate }) {
  const [ref, inView] = useInView();
  const [mode, setMode] = useState('evening');
  const [overlay, setOverlay] = useState(null);

  const Active = MODES[mode];
  const ActiveOverlay = overlay ? OVERLAYS[overlay] : null;
  const tint = overlay ? `tint-${overlay}` : `tint-${mode}`;

  return (
    <section id="modes" className="hiw-modes" aria-label="Modes and overlays" ref={ref}>
      <img
        src={HOW.modesRoom.src}
        alt=""
        className="hiw-bg"
        width={HOW.modesRoom.w}
        height={HOW.modesRoom.h}
        loading="lazy"
      />
      <div className="hiw-scrim scrim-modes" aria-hidden="true" />
      <div className={`modes-tint ${tint}`} aria-hidden="true" />
      <div className={`container modes-grid reveal ${inView ? 'is-visible' : ''}`}>
        {/* Left: copy */}
        <div className="hiw-copy">
          <span className="hiw-label">Modes &amp; Overlays</span>
          <h2 className="hiw-sec-title left">Your Home, In the Right Mode</h2>
          <p className="hiw-sec-desc left">
            Set daily modes like Day, Evening, Wind Down or Night, and use
            overlays like Movie, Away or Party for temporary changes.
          </p>
          <ul className="hiw-points">
            <li><Check size={14} aria-hidden="true" /> Automatic mode changes</li>
            <li><Check size={14} aria-hidden="true" /> Temporary overlays</li>
            <li><Check size={14} aria-hidden="true" /> A home that adapts</li>
          </ul>
          <button
            type="button"
            className="link-cta"
            onClick={() => onNavigate?.('/features#fc-03')}
          >
            Explore Modes <ArrowRight size={13} />
          </button>
        </div>

        {/* Right: interactive mode + overlay panel */}
        <div className="modes-stage">
          <div className="modes-panel glass-panel">
            <div className="modes-panel-head">
              <span className="panel-label">Home State</span>
              <DemoBadge />
            </div>

            <div className="modes-tabs" role="tablist" aria-label="Daily modes">
              {Object.entries(MODES).map(([key, m]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={mode === key}
                  className={`modes-tab ${mode === key ? 'active' : ''}`}
                  onClick={() => setMode(key)}
                >
                  <m.icon size={14} aria-hidden="true" /> {m.label}
                </button>
              ))}
            </div>

            {ActiveOverlay ? (
              <div className="modes-state" aria-live="polite">
                <div className="modes-state-head overlay">
                  <ActiveOverlay.icon size={17} aria-hidden="true" />
                  <div>
                    <p className="modes-state-name">{ActiveOverlay.label} Overlay</p>
                    <p className="modes-state-sub">
                      {MODES[mode].label} mode underneath · {ActiveOverlay.ends}
                    </p>
                  </div>
                </div>
                <ul className="modes-rows">
                  {ActiveOverlay.rows.map(({ icon: Icon, text }) => (
                    <li key={text}>
                      <Icon size={13} aria-hidden="true" /> {text}
                    </li>
                  ))}
                  <li className="modes-base">
                    <Home size={13} aria-hidden="true" /> Base mode: {MODES[mode].label}
                  </li>
                </ul>
              </div>
            ) : (
              <div className="modes-state" aria-live="polite">
                <div className="modes-state-head">
                  <Active.icon size={17} aria-hidden="true" />
                  <div>
                    <p className="modes-state-name">{Active.label} Mode</p>
                    <p className="modes-state-sub">{Active.note}</p>
                  </div>
                </div>
                <ul className="modes-rows">
                  <li><Lightbulb size={13} aria-hidden="true" /> Lights: {Active.lighting}</li>
                  <li><Thermometer size={13} aria-hidden="true" /> {Active.temp}</li>
                  <li><Home size={13} aria-hidden="true" /> {Active.state}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Temporary overlays — a layer on top of the daily mode */}
          <div className="overlay-card glass-panel">
            <div className="overlay-card-head">
              <span className="panel-label">Overlays</span>
              {ActiveOverlay && (
                <button
                  type="button"
                  className="btn-ghost gold overlay-end"
                  onClick={() => setOverlay(null)}
                >
                  End Now
                </button>
              )}
            </div>
            <div className="overlay-btns" role="group" aria-label="Temporary overlays">
              {Object.entries(OVERLAYS).map(([key, o]) => (
                <button
                  key={key}
                  type="button"
                  className={`overlay-btn ${overlay === key ? 'active' : ''}`}
                  aria-pressed={overlay === key}
                  onClick={() => setOverlay(overlay === key ? null : key)}
                >
                  <o.icon size={14} aria-hidden="true" /> {o.label}
                </button>
              ))}
            </div>
            <p className="overlay-hint">
              {ActiveOverlay
                ? `${ActiveOverlay.label} overlay active — your ${MODES[mode].label} mode resumes when it ends.`
                : 'Overlays are temporary — the daily mode always stays underneath.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
