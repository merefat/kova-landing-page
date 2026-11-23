import { Play, ArrowDown } from 'lucide-react';
import Modal from './Modal';

const STEPS = [
  {
    title: 'Plug in the Kova hub',
    desc: 'It discovers your lights, locks, cameras and speakers on the local network — no cloud account needed to start.',
  },
  {
    title: 'Set your daily rhythm',
    desc: 'Pick Day, Evening and Night modes. Kova learns the schedule and keeps the house in the right state automatically.',
  },
  {
    title: 'Relax — or take over',
    desc: 'Get presence alerts, run scenes by voice, and undo any change with a single tap. You stay in charge.',
  },
];

export default function HowItWorksModal({ open, onClose, onNavigate }) {
  const tryDemos = () => {
    onClose();
    // #automations exists on the home and /how-it-works routes only — from
    // /features or /integrations we have to route home first.
    if (document.getElementById('automations')) {
      setTimeout(() => document.getElementById('automations')?.scrollIntoView({ behavior: 'smooth' }), 120);
    } else {
      onNavigate?.('/#automations');
    }
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="hiw-title">
      <span className="modal-kicker"><Play size={11} /> 60-second tour</span>
      <h2 className="modal-title" id="hiw-title">How Kova works</h2>
      <p className="modal-desc">Three steps between the box and a home that runs itself.</p>
      <div className="hiw-steps">
        {STEPS.map((step, i) => (
          <div className="hiw-step" key={step.title}>
            <span className="hiw-num">{`0${i + 1}`}</span>
            <div>
              <p className="hiw-step-title">{step.title}</p>
              <p className="hiw-step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="outline-gold hiw-cta" onClick={tryDemos}>
        Try the live demos <ArrowDown size={13} />
      </button>
    </Modal>
  );
}
