import { ArrowRight, Send, Sparkles } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import DemoBadge from '../ui/DemoBadge';

const MESSAGES = [
  { who: 'user', text: 'Turn on the living room lights.' },
  { who: 'sage', text: 'Done! The living room lights are now on.' },
  { who: 'user', text: 'Why is the kitchen light on?' },
  { who: 'sage', text: 'The kitchen light is on because Evening mode is active — it will turn off at wind-down.' },
];

const CHIPS = ['Turn on the lights', 'Set AC to 24°', 'Why is the kitchen light on?'];

export default function Sage({ onNavigate }) {
  const [ref, inView] = useInView();

  return (
    <section id="sage" aria-label="Sage — the smart-home assistant" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card as-card as-sage">
          <div className="sg-split">
            <div className="sg-copy">
              <div className="rhythm-head">
                <div>
                  <p className="card-kicker indigo">Meet Sage</p>
                  <h3 className="pm-title">Your smart-home assistant</h3>
                  <p className="card-desc">
                    Ask, control and get things done with your voice.
                  </p>
                </div>
                <DemoBadge />
              </div>

              <div className="sg-orb-wrap" aria-hidden="true">
                <span className="sg-orb" />
                <span className="sg-waves">
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} className="sg-bar" style={{ '--d': `${i * 0.09}s` }} />
                  ))}
                </span>
              </div>

              <button
                type="button"
                className="link-cta"
                onClick={() => onNavigate?.('/how-it-works#sage')}
              >
                Try Sage <ArrowRight size={13} />
              </button>
            </div>

            <div className="sg-stage">
              <div className="sg-chat">
                {MESSAGES.map((m, i) => (
                  <p key={i} className={`sg-msg ${m.who}`}>
                    {m.who === 'sage' && <Sparkles size={11} aria-hidden="true" />}
                    {m.text}
                  </p>
                ))}
              </div>

              <div className="sg-chips">
                {CHIPS.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>

              <div className="sg-input" aria-hidden="true">
                <span className="sg-input-ph">Ask Sage…</span>
                <span className="sg-send">
                  <Send size={13} />
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
