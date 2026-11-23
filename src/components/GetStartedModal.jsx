import { useState } from 'react';
import { ArrowRight, Check, Zap } from 'lucide-react';
import Modal from './Modal';

export default function GetStartedModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setDone(true);
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setDone(false);
      setError('');
      setEmail('');
    }, 250);
  };

  return (
    <Modal open={open} onClose={close} labelledBy="gs-title">
      <span className="modal-kicker"><Zap size={11} /> Early access</span>
      <h2 className="modal-title" id="gs-title">Get started with Kova</h2>
      <p className="modal-desc">
        Leave your email and we&apos;ll reach out with hub availability, pricing,
        and a guided setup for your home.
      </p>

      {done ? (
        <div className="gs-success">
          <span className="gs-check"><Check size={17} strokeWidth={3} /></span>
          <div>
            <p className="gs-success-title">You&apos;re on the list!</p>
            <p className="gs-success-sub">We&apos;ll email you as soon as Kova ships to your area.</p>
          </div>
        </div>
      ) : (
        <>
          <form className="gs-form" onSubmit={submit} noValidate>
            <input
              type="email"
              placeholder="you@home.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              autoFocus
            />
            <button type="submit" className="gold-button">
              Join <ArrowRight size={14} />
            </button>
          </form>
          {error && <p className="gs-error" role="alert">{error}</p>}
          <p className="gs-note">No spam — just one email when it&apos;s your turn.</p>
        </>
      )}
    </Modal>
  );
}
