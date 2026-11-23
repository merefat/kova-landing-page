import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Minus, Plus, Snowflake, Leaf, Thermometer, Wind } from 'lucide-react';
import FeatureCard, { CardText } from '../FeatureCard';
import SceneStage from '../SceneStage';
import { FI } from '../../../data/featureImages';

// 06 — Energy, Climate & Sensors.
// Thermostat +/- eases the indoor reading toward the setpoint; the energy
// graph shows demo kWh values on hover; air quality cycles on click.
const KWH = [1.6, 1.9, 1.5, 2.2, 2.6, 2.1, 2.8, 2.4, 3.1, 2.7, 2.3, 2.4];
const AQ = ['Good', 'Fair', 'Poor'];
const AQ_TONE = { Good: 'good', Fair: 'fair', Poor: 'poor' };

export default function ClimateCard() {
  const [setT, setSetT] = useState(22);
  const [indoor, setIndoor] = useState(22);
  const [aq, setAq] = useState(0);
  const [hover, setHover] = useState(null);
  const raf = useRef(null);

  // Indoor temp eases toward the setpoint — simulates the HVAC responding.
  useEffect(() => {
    const tick = () =>
      setIndoor((v) => {
        const diff = setT - v;
        if (Math.abs(diff) < 0.06) return setT;
        return Math.round((v + Math.sign(diff) * 0.2) * 10) / 10;
      });
    raf.current = setInterval(tick, 320);
    return () => clearInterval(raf.current);
  }, [setT]);

  const bump = (d) => setSetT((t) => Math.min(28, Math.max(16, Math.round((t + d) * 10) / 10)));

  // Graph geometry — polyline inside a 260×86 viewBox.
  const W = 260, H = 86, PAD = 6;
  const max = Math.max(...KWH), min = Math.min(...KWH);
  const pts = KWH.map((v, i) => {
    const x = PAD + (i * (W - 2 * PAD)) / (KWH.length - 1);
    const y = H - PAD - ((v - min) / (max - min)) * (H - 2 * PAD - 8);
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  });
  const line = pts.map((p) => p.join(',')).join(' ');
  const area = `0,${H} ${line} ${W},${H}`;

  return (
    <FeatureCard id="fc-06" wide className="climate-card">
      <SceneStage image={FI.climate} veil="soft" />

      <div className="fc-inner">
        <CardText
          num="06"
          title="Energy, Climate &amp; Sensors"
          desc="A greener, smarter home. Monitor energy usage, control climate, and use sensors to keep your home comfortable and efficient."
        >
          <button type="button" className="outline-gold fc-cta" onClick={() => bump(2)}>
            Explore Insights <ArrowRight size={13} />
          </button>
        </CardText>

        <div className="fc-demo climate-widget">
          <div className="thermo glass-panel">
            <Snowflake size={15} className="thermo-flake" />
            <p className="thermo-temp">{Math.round(indoor)}°</p>
            <p className="thermo-set">SET {setT.toFixed(1)}°</p>
            <div className="thermo-btns">
              <button type="button" aria-label="Decrease temperature" onClick={() => bump(-0.5)}>
                <Minus size={13} />
              </button>
              <button type="button" aria-label="Increase temperature" onClick={() => bump(0.5)}>
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div className="energy glass-panel">
            <div className="energy-head">
              <span className="energy-leaf"><Leaf size={15} /></span>
              <p className="energy-kwh">2.4 kWh</p>
              <p className="energy-delta">↓ 18% vs yesterday</p>
            </div>

            <div className="energy-graph">
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                <polygon className="energy-area" points={area} />
                <polyline className="energy-line" points={line} />
              </svg>
              {pts.map(([x, y], i) => (
                <button
                  key={i}
                  type="button"
                  className="energy-hot"
                  style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${KWH[i]} kWh`}
                />
              ))}
              {hover !== null && (
                <span
                  className="energy-tip"
                  style={{ left: `${(pts[hover][0] / W) * 100}%`, top: `${(pts[hover][1] / H) * 100}%` }}
                >
                  {KWH[hover].toFixed(1)} kWh
                </span>
              )}
            </div>

            <div className="energy-chips">
              <span className="energy-chip">
                <Thermometer size={12} /> <strong>{indoor.toFixed(0)}°C</strong> Indoor
              </span>
              <button
                type="button"
                className={`energy-chip aq ${AQ_TONE[AQ[aq]]}`}
                onClick={() => setAq((i) => (i + 1) % AQ.length)}
                title="Cycle air quality (demo)"
              >
                <Wind size={12} /> <strong>{AQ[aq]}</strong> Air Quality
              </button>
            </div>
            <span className="demo-badge energy-badge">Demo Values</span>
          </div>
        </div>
      </div>
    </FeatureCard>
  );
}
