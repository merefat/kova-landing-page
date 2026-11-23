import { Signal, Wifi, BatteryMedium } from 'lucide-react';

// Portrait smartphone frame used inside the Presence demo. Decorative —
// the real state lives on the Live Demo panel next to it.
export default function PhoneScreen({ time = '19:24', children }) {
  return (
    <div className="fp-phone" aria-hidden="true">
      <span className="fp-phone-nub fp-phone-nub-r" />
      <div className="fp-phone-screen">
        <div className="fp-phone-notch" />
        <div className="fp-phone-status">
          <span>{time}</span>
          <span className="fp-phone-ics">
            <Signal size={9} />
            <Wifi size={9} />
            <BatteryMedium size={11} />
          </span>
        </div>
        <div className="fp-phone-clock">{time}</div>
        <div className="fp-phone-body">{children}</div>
      </div>
    </div>
  );
}
