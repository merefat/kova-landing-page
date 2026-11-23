import { useEffect, useRef, useState } from 'react';
import { ArrowRight, RotateCcw, Sun, Sunset, MoonStar } from 'lucide-react';
import FeatureCard, { CardText } from '../FeatureCard';
import SceneStage from '../SceneStage';
import { FI } from '../../../data/featureImages';

// 03 — Switch Modes Effortlessly. One photo, three CSS lighting grades.
const MODES = [
  { id: 'day', icon: Sun, label: 'Day', status: 'Bright natural light — pendants off' },
  { id: 'evening', icon: Sunset, label: 'Evening', status: 'Warm golden light — lamps on' },
  { id: 'night', icon: MoonStar, label: 'Night', status: 'Dark blue — quiet house, doors locked' },
];

export default function ModesCard() {
  const [mode, setMode] = useState('evening');
  const [touring, setTouring] = useState(false);
  const timers = useRef([]);
  const current = MODES.find((m) => m.id === mode);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const stop = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTouring(false);
  };

  // "Try It Live" tours Day → Evening → Night so the visitor sees each grade.
  const tour = () => {
    stop();
    setTouring(true);
    MODES.forEach((m, i) => {
      timers.current.push(setTimeout(() => setMode(m.id), 400 + i * 1400));
    });
    timers.current.push(setTimeout(() => setTouring(false), 400 + MODES.length * 1400));
  };

  const pick = (id) => {
    stop();
    setMode(id);
  };

  return (
    <FeatureCard id="fc-03" className="modes-card">
      <SceneStage image={FI.modesRoom} className={`modes-scene mode-${mode}`}>
        <span className="mode-glow mode-glow-pendants" aria-hidden="true" />
        <span className="mode-glow mode-glow-candles" aria-hidden="true" />
      </SceneStage>

      <div className="fc-inner">
        <CardText
          num="03"
          title={<>Switch Modes<br />Effortlessly</>}
          desc="Change your home mode — Day, Evening, Night — and see the magic."
        >
          {touring ? (
            <button type="button" className="outline-gold fc-cta" onClick={stop}>
              Stop Tour <RotateCcw size={13} />
            </button>
          ) : (
            <button type="button" className="outline-gold fc-cta" onClick={tour}>
              Try It Live <ArrowRight size={13} />
            </button>
          )}
        </CardText>

        <div className="fc-demo modes-demo">
          <div className="modes-btns" role="group" aria-label="Home mode">
            {MODES.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                className={`mode-btn ${mode === id ? 'active' : ''}`}
                onClick={() => pick(id)}
                aria-pressed={mode === id}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <p className="modes-status">{current.status}</p>
          {mode !== 'evening' && (
            <button type="button" className="btn-ghost modes-reset" onClick={() => setMode('evening')}>
              <RotateCcw size={11} /> Back to Evening
            </button>
          )}
        </div>
      </div>
    </FeatureCard>
  );
}
