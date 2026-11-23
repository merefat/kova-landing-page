import { useState } from 'react';
import { ArrowRight, ChevronRight, Plug, Link2, LayoutGrid, Workflow, Sparkles } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

const STEPS = [
  {
    icon: Plug,
    title: 'Install & Setup',
    desc: 'Download Kova and set up your hub.',
    detail: 'Get the Kova app, plug in your hub and follow the guided setup — most homes are up and running in minutes.',
    target: '#how-cta',
    targetLabel: 'Get started',
  },
  {
    icon: Link2,
    title: 'Connect Devices',
    desc: 'Link your smart devices and services.',
    detail: 'Kova discovers devices already on your network and links the brands and protocols you use every day.',
    target: '#integrations',
    targetLabel: 'See integrations',
  },
  {
    icon: LayoutGrid,
    title: 'Organise Your Home',
    desc: 'Add rooms, devices and people.',
    detail: 'Arrange devices into rooms, invite household members and give everyone the right level of access.',
    target: '#modes',
    targetLabel: 'See modes',
  },
  {
    icon: Workflow,
    title: 'Set Up Automations',
    desc: 'Create routines and smart rules.',
    detail: 'Build when → only if → then rules, daily modes and moments that quietly handle the routine.',
    target: '#automations',
    targetLabel: 'See automations',
  },
  {
    icon: Sparkles,
    title: 'Enjoy Smart Living',
    desc: 'Let Kova handle everyday tasks.',
    detail: 'Your home keeps itself in the right state — lighting, climate, security and media, all working together.',
    target: '#sage',
    targetLabel: 'Meet Sage',
  },
];

export default function JourneyTimeline() {
  const [ref, inView] = useInView();
  const [active, setActive] = useState(null);

  return (
    <section id="journey" className="hiw-journey" aria-label="The journey at a glance" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <header className="hiw-sec-head">
          <span className="hiw-label">The Journey at a Glance</span>
          <h2 className="hiw-sec-title">A Complete Solution, in Simple Steps</h2>
          <p className="hiw-sec-desc">
            Get started with Kova and experience a smarter, more connected home.
          </p>
        </header>

        <ol className="jt-steps">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} className="jt-item">
              <button
                type="button"
                className={`jt-step ${active === i ? 'active' : ''}`}
                onClick={() => setActive(active === i ? null : i)}
                aria-expanded={active === i}
                aria-controls="jt-detail"
              >
                <span className="jt-circle">
                  <Icon size={22} aria-hidden="true" />
                  <span className="jt-num">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className="jt-title">{title}</span>
                <span className="jt-desc">{desc}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight size={18} className="jt-arrow" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        {active !== null && (
          <div className="jt-detail glass-panel" id="jt-detail" role="status">
            <p>
              <strong>{STEPS[active].title}.</strong> {STEPS[active].detail}
            </p>
            <a className="link-cta" href={STEPS[active].target}>
              {STEPS[active].targetLabel} <ArrowRight size={13} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
