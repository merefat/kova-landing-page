import { useEffect, useState } from 'react';
import { ArrowRight, RotateCcw, ShieldAlert, Maximize2, X } from 'lucide-react';
import FeatureCard, { CardText } from '../FeatureCard';
import SceneStage from '../SceneStage';
import { FI } from '../../../data/featureImages';

// 04 — Enhanced Security & Peace of Mind.
// calm → (Simulate Door Activity) alert: red detection frame + banner +
// highlighted live badge → Dismiss keeps calm, Reset restores.
export default function SecurityCard() {
  const [state, setState] = useState('calm'); // 'calm' | 'alert'
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!full) return;
    const onKey = (e) => e.key === 'Escape' && setFull(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [full]);

  const alert = state === 'alert';

  const preview = (
    <div className={`sec-feed ${alert ? 'alert' : ''}`}>
      <img src={FI.security.src} alt="" loading="lazy" aria-hidden="true" />
      {alert && <span className="sec-frame" aria-hidden="true" />}
      <span className={`sec-live ${alert ? 'hot' : ''}`}>
        <i /> {alert ? 'Live' : 'Idle'}{alert && ' · Demo'}
      </span>
      <button
        type="button"
        className="sec-expand"
        aria-label="Expand camera preview"
        onClick={() => setFull(true)}
      >
        <Maximize2 size={12} />
      </button>
    </div>
  );

  return (
    <FeatureCard id="fc-04" className="security-card">
      <SceneStage image={FI.security} veil="soft" fy={0.55} />

      <div className="fc-inner">
        <CardText
          num="04"
          title={<>Enhanced Security<br />&amp; Peace of Mind</>}
          desc="Get instant alerts and see what's happening at home."
        >
          {!alert ? (
            <button type="button" className="outline-gold fc-cta" onClick={() => setState('alert')}>
              Try It Live <ArrowRight size={13} />
            </button>
          ) : (
            <button type="button" className="outline-gold fc-cta" onClick={() => setState('calm')}>
              Reset <RotateCcw size={13} />
            </button>
          )}
        </CardText>

        <div className="fc-demo">
          <div className="sec-panel glass-panel">
            {alert && (
              <div className="sec-banner">
                <ShieldAlert size={14} />
                <p><strong>Security Alert</strong><br />Someone is at the door</p>
                <span className="sec-now">NOW</span>
              </div>
            )}
            {preview}
            <p className="sec-status">
              {alert ? 'Person detected at entrance' : 'Calm — no activity'}
            </p>
            {alert && (
              <div className="sec-actions">
                <button type="button" className="btn-ghost" onClick={() => setState('calm')}>
                  <X size={11} /> Dismiss
                </button>
                <button type="button" className="btn-ghost" onClick={() => setState('calm')}>
                  <RotateCcw size={11} /> Reset
                </button>
              </div>
            )}
            <p className="sec-note">Demo only — not a live camera feed</p>
          </div>
        </div>
      </div>

      {full && (
        <div className="sec-full" role="dialog" aria-label="Camera preview" onClick={() => setFull(false)}>
          <div className="sec-full-frame" onClick={(e) => e.stopPropagation()}>
            {preview}
            <button type="button" className="sec-full-close" onClick={() => setFull(false)} aria-label="Close preview">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </FeatureCard>
  );
}
