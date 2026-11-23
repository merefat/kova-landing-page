import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Mic, Send, Sparkles, Home } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { HOW } from '../../data/howImages';
import DemoBadge from '../ui/DemoBadge';

const CHIPS = [
  'Turn on the lights',
  'Set Evening mode',
  'Play relaxing music',
  'Who is home?',
  "What's playing?",
];

// Keyword-matched simulated replies — the website demo never talks to a home.
const REPLIES = [
  { match: /turn on|lights? on/i, reply: 'Done! The living room lights are on.' },
  { match: /turn off|lights? off/i, reply: 'Done! All lights in the living room are off.' },
  { match: /evening|mode/i, reply: 'Evening mode is on — warm lighting, climate adjusted.' },
  { match: /music|play/i, reply: 'Playing your Relax mix in the living room.' },
  { match: /who.*home|anyone home/i, reply: 'Three people are home right now.' },
  { match: /playing|song|track/i, reply: '"Ambient Essentials" is playing on the living room speaker.' },
];

const FALLBACK =
  'I can help with lights, modes, music and home status — try one of the suggestions.';

const replyFor = (text) =>
  REPLIES.find((r) => r.match.test(text))?.reply ?? FALLBACK;

export default function SageDemo({ onNavigate }) {
  const [ref, inView] = useInView();
  const [msgs, setMsgs] = useState([
    { role: 'user', text: 'Turn off all the lights in the living room.' },
    { role: 'sage', text: 'Done! All lights in the living room are off.' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const send = (text) => {
    const clean = text.trim();
    if (!clean) return;
    setMsgs((m) => [...m.slice(-6), { role: 'user', text: clean }, { role: 'sage', text: replyFor(clean) }]);
    setInput('');
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs]);

  return (
    <section id="sage" className="hiw-sage" aria-label="Meet Sage" ref={ref}>
      <img
        src={HOW.sageRoom.src}
        alt=""
        className="hiw-bg"
        width={HOW.sageRoom.w}
        height={HOW.sageRoom.h}
        loading="lazy"
      />
      <div className="hiw-scrim scrim-sage" aria-hidden="true" />
      <div className={`container sage-grid reveal ${inView ? 'is-visible' : ''}`}>
        {/* Left: copy */}
        <div className="hiw-copy">
          <span className="hiw-label">Meet Sage</span>
          <h2 className="hiw-sec-title left">Just Ask, Get It Done</h2>
          <p className="hiw-sec-desc left">
            Sage is your smart home assistant. Control devices, create
            automations and get answers — in natural language.
          </p>
          <ul className="hiw-points">
            <li><Check size={14} aria-hidden="true" /> Voice or text</li>
            <li><Check size={14} aria-hidden="true" /> Smart suggestions</li>
            <li><Check size={14} aria-hidden="true" /> Full home control</li>
          </ul>
          <button
            type="button"
            className="link-cta"
            onClick={() => onNavigate?.('/#sage')}
          >
            Talk to Sage <ArrowRight size={13} />
          </button>
        </div>

        {/* Right: orb + conversation demo */}
        <div className="sage-stage">
          <div className="sage-orb" aria-hidden="true">
            <span className="sage-orb-core" />
            <span className="sage-orb-ring" />
            <span className="sage-waves">
              <i /><i /><i /><i /><i /><i /><i />
            </span>
          </div>

          <div className="sage-card glass-panel">
            <div className="sage-card-head">
              <span className="panel-label">
                <Sparkles size={11} aria-hidden="true" /> Sage
              </span>
              <DemoBadge />
            </div>

            <div className="sage-msgs" ref={listRef}>
              {msgs.map((m, i) =>
                m.role === 'user' ? (
                  <p key={i} className="sage-msg user">
                    <Mic size={12} aria-hidden="true" /> {m.text}
                  </p>
                ) : (
                  <p key={i} className="sage-msg sage">
                    <Home size={12} aria-hidden="true" /> {m.text}
                  </p>
                )
              )}
            </div>

            <div className="sage-chips">
              {CHIPS.map((c) => (
                <button key={c} type="button" onClick={() => send(c)}>
                  {c}
                </button>
              ))}
            </div>

            <form
              className="sage-input"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Sage…"
                aria-label="Ask Sage a question"
                maxLength={90}
              />
              <button type="submit" aria-label="Send">
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
