import { useRef, useState } from 'react';
import { ArrowRight, RotateCcw, Zap, Check, Wifi, Bell } from 'lucide-react';
import FeatureCard, { CardText } from '../FeatureCard';
import SceneStage from '../SceneStage';
import PhoneScreen from '../PhoneScreen';
import { FI } from '../../../data/featureImages';

// 01 — Smart Presence & Automations
// idle → (Simulate) motion detected → welcome-home notification →
// lights on + scene active → Reset.
const PHASE_STEPS = { idle: 0, motion: 1, welcome: 2, done: 3 };

export default function PresenceCard() {
  const [phase, setPhase] = useState('idle');
  const timers = useRef([]);
  const step = PHASE_STEPS[phase];

  const simulate = () => {
    setPhase('motion');
    timers.current = [
      setTimeout(() => setPhase('welcome'), 1100),
      setTimeout(() => setPhase('done'), 2400),
    ];
  };
  const reset = () => {
    timers.current.forEach(clearTimeout);
    setPhase('idle');
  };

  const checks = [
    { label: 'Motion Detected', on: step >= 1 },
    { label: 'Lights Turned On', on: step >= 2 },
    { label: 'Scene: Welcome Home', on: step >= 3 },
  ];

  return (
    <FeatureCard id="fc-01" wide className="presence-card">
      <SceneStage image={FI.presenceHallway} className={step >= 1 ? 'lights-on' : ''}>
        <span className={`motion-frame ${step >= 1 ? 'show' : ''}`} aria-hidden="true" />
        <span className={`presence-ping ${step >= 1 ? 'show' : ''}`} aria-hidden="true">
          <Wifi size={13} />
        </span>
      </SceneStage>

      <div className="fc-inner">
        <CardText
          num="01"
          title={<>Smart Presence &amp;<br />Automations</>}
          desc="When you enter a room, Kova knows. Lights turn on, your favorite scene activates — automatically."
        >
          {phase === 'idle' ? (
            <button type="button" className="outline-gold fc-cta" onClick={simulate}>
              Try It Live <ArrowRight size={13} />
            </button>
          ) : (
            <button type="button" className="outline-gold fc-cta" onClick={reset}>
              Reset <RotateCcw size={13} />
            </button>
          )}
        </CardText>

        <div className="fc-demo presence-widget">
          <PhoneScreen time="19:24">
            {step >= 2 ? (
              <div className="fp-notif">
                <div className="fp-notif-head">
                  <span>KOVA</span>
                  <span>NOW</span>
                </div>
                <div className="fp-notif-body">
                  <span className="fp-notif-icon">
                    <Bell size={11} />
                  </span>
                  <p><strong>Welcome Home!</strong> Lights are turned on.</p>
                </div>
              </div>
            ) : (
              <span className="fp-notif-empty">No new notifications</span>
            )}
          </PhoneScreen>

          <div className="presence-panel glass-panel">
            <div className="presence-panel-head">
              <span className="presence-live"><i /> Live Demo</span>
              <span className="demo-badge">Simulated Demo</span>
            </div>
            <p className="presence-status">
              {step >= 3 ? 'Welcome Home scene active' : step >= 1 ? 'Motion detected…' : 'Waiting for activity'}
            </p>
            <ul className="presence-checks">
              {checks.map((c) => (
                <li key={c.label} className={c.on ? 'on' : ''}>
                  <span className="presence-check-dot">
                    {c.on && <Check size={9} strokeWidth={3} />}
                  </span>
                  {c.label}
                </li>
              ))}
            </ul>
            <div className="presence-toggle-row">
              <span>{step >= 3 ? 'On' : 'Off'}</span>
              <span className={`toggle ${step >= 3 ? 'on' : ''}`} aria-hidden="true">
                <span className="toggle-knob" />
              </span>
            </div>
            {phase === 'idle' ? (
              <button type="button" className="outline-gold presence-sim" onClick={simulate}>
                <Zap size={12} /> Simulate Person Entering
              </button>
            ) : (
              <button type="button" className="btn-ghost presence-sim" onClick={reset}>
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </FeatureCard>
  );
}
