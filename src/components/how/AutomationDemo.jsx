import { useState } from 'react';
import {
  ArrowRight, ArrowDown, Check, Plus, DoorOpen, Lightbulb,
  Lock, Clock, Clapperboard, Power, Home,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { HOW } from '../../data/howImages';
import DemoBadge from '../ui/DemoBadge';

const FIRST_RULE = {
  id: 'arrive',
  when: 'Someone arrives home',
  then: 'Turn on hallway lights',
  whenIcon: DoorOpen,
  thenIcon: Lightbulb,
  lightsUp: true,
};

// Predefined rules the visitor can add to the demo builder.
const EXTRA_RULES = [
  {
    id: 'lock',
    when: "It's 11 PM",
    then: 'Lock the front door',
    whenIcon: Clock,
    thenIcon: Lock,
  },
  {
    id: 'movie',
    when: 'Movie starts',
    then: 'Dim the living room lights',
    whenIcon: Clapperboard,
    thenIcon: Lightbulb,
    lightsUp: true,
  },
  {
    id: 'away',
    when: 'Everyone leaves',
    then: 'Turn everything off',
    whenIcon: Home,
    thenIcon: Power,
  },
];

export default function AutomationDemo({ onNavigate }) {
  const [ref, inView] = useInView();
  const [rules, setRules] = useState([{ ...FIRST_RULE, on: true }]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const usedIds = new Set(rules.map((r) => r.id));
  const available = EXTRA_RULES.filter((r) => !usedIds.has(r.id));
  const activeCount = rules.filter((r) => r.on).length;
  const lightsOn = rules.some((r) => r.on && r.lightsUp);

  const toggle = (id) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, on: !r.on } : r)));

  const addRule = (rule) => {
    setRules((rs) => [...rs, { ...rule, on: false }]);
    setPickerOpen(false);
  };

  return (
    <section id="automations" className="hiw-auto" aria-label="Automations" ref={ref}>
      <img
        src={HOW.autoHall.src}
        alt=""
        className="hiw-bg"
        width={HOW.autoHall.w}
        height={HOW.autoHall.h}
        loading="lazy"
      />
      <div className="hiw-scrim scrim-auto" aria-hidden="true" />
      <div className={`container auto-grid reveal ${inView ? 'is-visible' : ''}`}>
        {/* Left: interactive rule builder */}
        <div className="auto-panel glass-panel">
          <div className="auto-panel-head">
            <span className="panel-label">Automation</span>
            <DemoBadge />
          </div>

          <div className="auto-rules">
            {rules.map((rule) => (
              <div key={rule.id} className={`auto-rule ${rule.on ? 'on' : ''}`}>
                <div className="auto-cond">
                  <span className="auto-chip">When</span>
                  <rule.whenIcon size={14} aria-hidden="true" />
                  <span className="auto-cond-text">{rule.when}</span>
                  <button
                    type="button"
                    className={`toggle ${rule.on ? 'on' : ''}`}
                    role="switch"
                    aria-checked={rule.on}
                    aria-label={`${rule.then}`}
                    onClick={() => toggle(rule.id)}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
                <ArrowDown size={13} className="auto-flow" aria-hidden="true" />
                <div className="auto-cond then">
                  <span className="auto-chip then">Then</span>
                  <rule.thenIcon size={14} aria-hidden="true" />
                  <span className="auto-cond-text">{rule.then}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Demo light strip — glows while a lighting rule is enabled */}
          <div className={`auto-light ${lightsOn ? 'lit' : ''}`} aria-hidden="true">
            <span className="auto-light-beam" />
            <Lightbulb size={13} />
            <span className="auto-light-text">
              Hallway lights {lightsOn ? 'on' : 'off'}
            </span>
          </div>

          {available.length > 0 ? (
            pickerOpen ? (
              <div className="auto-picker" role="group" aria-label="Add a rule">
                {available.map((rule) => (
                  <button
                    key={rule.id}
                    type="button"
                    className="auto-pick"
                    onClick={() => addRule(rule)}
                  >
                    <span className="auto-pick-when">
                      <rule.whenIcon size={12} aria-hidden="true" /> {rule.when}
                    </span>
                    <span className="auto-pick-then">→ {rule.then}</span>
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                className="auto-add"
                onClick={() => setPickerOpen(true)}
              >
                <Plus size={14} aria-hidden="true" /> Add Another Rule
              </button>
            )
          ) : null}

          <p className="auto-status" aria-live="polite">
            <span className={`auto-dot ${activeCount ? 'on' : ''}`} aria-hidden="true" />
            {activeCount
              ? `${activeCount} automation${activeCount > 1 ? 's' : ''} enabled`
              : 'All automations paused'}
          </p>
        </div>

        {/* Right: copy */}
        <div className="hiw-copy right">
          <span className="hiw-label">Automations</span>
          <h2 className="hiw-sec-title left">Automate the Everyday</h2>
          <p className="hiw-sec-desc left">
            Let Kova handle the routine. Set smart rules for lights, security,
            climate and more.
          </p>
          <ul className="hiw-points">
            <li><Check size={14} aria-hidden="true" /> Multi-condition rules</li>
            <li><Check size={14} aria-hidden="true" /> Delayed actions</li>
            <li><Check size={14} aria-hidden="true" /> Smart suggestions</li>
          </ul>
          <button
            type="button"
            className="link-cta"
            onClick={() => onNavigate?.('/features#fc-01')}
          >
            Create Automation <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}
