import { ArrowRight, Plug, LayoutGrid, Workflow, Sparkles } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const STEPS = [
  { icon: Plug, title: 'Connect Your Devices', desc: 'The hub discovers what is already on your network.' },
  { icon: LayoutGrid, title: 'Set Up Your Home', desc: 'Arrange rooms, devices and household members.' },
  { icon: Workflow, title: 'Create Automations', desc: 'Modes, moments and rules that fit your life.' },
  { icon: Sparkles, title: 'Enjoy a Smarter Home', desc: 'Kova keeps everything in the right state.' },
];

export default function HowWorks({ onWatch }) {
  const [ref, inView] = useInView();

  return (
    <section id="how" aria-label="How Kova works" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card hr-card hr-workflow">
          <div className="sec-head">
            <p className="card-kicker">How Kova works</p>
            <h3 className="pm-title">At a glance</h3>
            <p className="card-desc">
              From setup to smart living, Kova makes your home smarter and easier
              to manage.
            </p>
          </div>

          <ol className="workflow">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="wf-step">
                <span className="wf-icon">
                  <Icon size={17} />
                  <span className="wf-num">{i + 1}</span>
                </span>
                <div className="wf-text">
                  <p className="wf-title">{title}</p>
                  <p className="wf-desc">{desc}</p>
                </div>
                {i < STEPS.length - 1 && <ArrowRight size={14} className="wf-arrow" aria-hidden="true" />}
              </li>
            ))}
          </ol>

          <button type="button" className="link-cta" onClick={onWatch}>
            See How It Works <ArrowRight size={13} />
          </button>
        </article>
      </div>
    </section>
  );
}
