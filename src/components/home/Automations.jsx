import { useState } from 'react';
import { ArrowRight, Lightbulb, Thermometer, Music, Check } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import Toggle from '../ui/Toggle';
import DemoBadge from '../ui/DemoBadge';

const RULES = [
  { id: 'lights', icon: Lightbulb, text: 'Turn off lights at bedtime', on: 'Lights-off bedtime routine enabled', off: 'Lights-off bedtime routine paused' },
  { id: 'ac', icon: Thermometer, text: 'Set AC to 24°C', on: 'AC schedule enabled — 24°C', off: 'AC schedule paused' },
  { id: 'music', icon: Music, text: 'Play relaxing music', on: 'Relaxing music will play this evening', off: 'Evening music paused' },
];

export default function Automations() {
  const [ref, inView] = useInView();
  const [rules, setRules] = useState({ lights: true, ac: true, music: false });
  const [notice, setNotice] = useState('');

  const active = RULES.filter((r) => rules[r.id]).length;

  const flip = (rule) => {
    const next = !rules[rule.id];
    setRules((s) => ({ ...s, [rule.id]: next }));
    setNotice(next ? rule.on : rule.off);
  };

  return (
    <section id="automations" aria-label="Smart automations" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card as-card as-auto">
          <div className="as-split">
            <div className="as-copy">
              <div className="rhythm-head">
                <div>
                  <p className="card-kicker">Smart automations</p>
                  <h3 className="pm-title">Automations that handle everyday tasks</h3>
                  <p className="card-desc">
                    Let Kova do the routine — so you can focus on what matters.
                  </p>
                </div>
                <DemoBadge />
              </div>

              <div className="auto-foot">
                <p className={`auto-status ${active === RULES.length ? 'all' : ''}`} aria-live="polite">
                  <Check size={12} aria-hidden="true" />
                  {notice || `${active} of ${RULES.length} automations active`}
                </p>
                <a className="link-cta" href="#local-first">
                  Explore Automations <ArrowRight size={13} />
                </a>
              </div>
            </div>

            <ul className="auto-list">
              {RULES.map((rule) => (
                <li key={rule.id} className={`auto-row ${rules[rule.id] ? 'on' : ''}`}>
                  <span className={`auto-icon ${rules[rule.id] ? 'on' : ''}`}>
                    <rule.icon size={15} />
                  </span>
                  <span className="auto-text">{rule.text}</span>
                  <Toggle
                    on={rules[rule.id]}
                    onToggle={() => flip(rule)}
                    label={`${rules[rule.id] ? 'Disable' : 'Enable'} automation: ${rule.text}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
