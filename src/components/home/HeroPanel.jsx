import { Clock, HelpCircle, Lightbulb, Minus, Plus, SunMedium } from 'lucide-react';

const SCENES = [
  { label: 'Night', value: 18 },
  { label: 'Relax', value: 45 },
  { label: 'Bright', value: 100 },
];

const clamp = (v) => Math.min(100, Math.max(0, v));

// Interactive panel in the hero — the in-app light slider drives the
// brightness of the villa photo behind it (--lvl on .hero). Styled as
// the real Kova device sheet: cream UI, amber fill bar, toggle switch.
export default function HeroPanel({ level, on, onLevel, onPower }) {
  const lit = on ? level : 0;

  return (
    <div className="hero-panel-wrap">
      <div className="hp-sheet" role="group" aria-label="Kova app — living room light control">
        <div className="hp-head">
          <span className={`hp-dev-ic ${on ? 'on' : ''}`} aria-hidden="true">
            <Lightbulb size={19} />
          </span>
          <div className="hp-dev">
            <p className="hp-room">Living room</p>
            <p className="hp-name">Main lights</p>
            <p className="hp-state">{on ? `On · ${level}%` : 'Off'}</p>
          </div>
          <button
            type="button"
            className={`hp-sw ${on ? 'on' : ''}`}
            role="switch"
            aria-checked={on}
            onClick={onPower}
            aria-label={on ? 'Turn lights off' : 'Turn lights on'}
          >
            <i aria-hidden="true" />
          </button>
        </div>

        <div className="hp-bright">
          <p className="hp-label">Brightness</p>
          <div className={`hp-bar ${on ? '' : 'off'}`} style={{ '--fill': `${lit}%` }}>
            <span className="hp-bar-fill" aria-hidden="true">
              <SunMedium size={15} />
            </span>
            <span className="hp-bar-val" aria-live="polite">
              {on ? `${level}%` : 'Off'}
            </span>
            <input
              type="range"
              className="hp-slider"
              min={0}
              max={100}
              step={5}
              value={level}
              disabled={!on}
              onChange={(e) => onLevel(Number(e.target.value))}
              aria-label="Living room light brightness"
            />
          </div>
        </div>

        <div className="hp-steps">
          <button
            type="button"
            onClick={() => onLevel(clamp(level - 10))}
            disabled={!on}
            aria-label="Decrease brightness"
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            onClick={() => onLevel(clamp(level + 10))}
            disabled={!on}
            aria-label="Increase brightness"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="hp-scenes">
          {SCENES.map((s) => (
            <button
              key={s.label}
              type="button"
              className={on && level === s.value ? 'active' : ''}
              onClick={() => onLevel(s.value)}
              disabled={!on}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="hp-info">
          <div className="hp-info-row">
            <HelpCircle size={14} aria-hidden="true" />
            <div>
              <p className="hp-info-k">Why it's like this</p>
              <p className="hp-info-t">Live demo — the light changes the room behind it.</p>
            </div>
          </div>
          <div className="hp-info-row">
            <Clock size={14} aria-hidden="true" />
            <div>
              <p className="hp-info-k">What's next</p>
              <p className="hp-info-t">23:00 · Night: Main lights off.</p>
            </div>
          </div>
        </div>
      </div>
      <p className="hero-panel-hint">Live demo — the light changes the room behind it</p>
    </div>
  );
}
