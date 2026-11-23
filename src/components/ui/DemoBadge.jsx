import { MonitorPlay } from 'lucide-react';

// Persistent "simulated" chip — keeps demo activity clearly distinct from
// a real device feed.
export default function DemoBadge({ children = 'Simulated demo' }) {
  return (
    <span className="demo-badge">
      <MonitorPlay size={10} /> {children}
    </span>
  );
}
