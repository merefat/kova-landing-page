import { useState } from 'react';
import {
  ArrowRight, Check, Lightbulb, Plug, Cast, Speaker, Radio,
  Waves, Atom, House, Cloud, Wifi,
} from 'lucide-react';
import KovaMark from '../KovaMark';
import { useInView } from '../../hooks/useInView';

// Stage geometry — nodes sit on an ellipse around the hub.
const W = 640;
const H = 430;
const CX = 320;
const CY = 238;
const RX = 262;
const RY = 158;

const NODES = [
  { label: 'Philips Hue', icon: Lightbulb, type: 'Native', desc: 'Lights, scenes and rooms synced directly over your local network.' },
  { label: 'Shelly', icon: Plug, type: 'Native', desc: 'Relays, plugs and sensors controlled locally via the Shelly API.' },
  { label: 'Google Cast', icon: Cast, type: 'Native', desc: 'Speakers and displays grouped and controlled on your network.' },
  { label: 'Sonos', icon: Speaker, type: 'Native', desc: 'Multi-room audio with local control of playback and groups.' },
  { label: 'Zigbee', icon: Radio, type: 'Protocol', desc: 'Low-power devices paired through the hub\u2019s Zigbee radio.' },
  { label: 'Z-Wave', icon: Waves, type: 'Protocol', desc: 'Reliable mesh devices paired through the hub\u2019s Z-Wave radio.' },
  { label: 'Matter', icon: Atom, type: 'Protocol', desc: 'New-generation devices joined over the Matter standard.' },
  { label: 'Home Assistant', icon: House, type: 'Via Home Assistant', desc: 'Devices already in Home Assistant can be bridged into Kova.' },
  { label: 'Tuya', icon: Cloud, type: 'Cloud', desc: 'Tuya cloud devices linked through your Tuya account.' },
  { label: 'TP-Link', icon: Wifi, type: 'Cloud', desc: 'Kasa plugs, bulbs and switches connected via TP-Link cloud.' },
];

// Position each node on the ellipse, starting at the top and going clockwise.
const positioned = NODES.map((n, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / NODES.length;
  return {
    ...n,
    x: CX + RX * Math.cos(a),
    y: CY + RY * Math.sin(a),
    px: 50 + (RX / W) * 100 * Math.cos(a),
    py: (CY / H) * 100 + (RY / H) * 100 * Math.sin(a),
  };
});

// Quadratic curve hub -> node, bowed slightly outward for a curved look.
const linePath = (n) => {
  const mx = (CX + n.x) / 2;
  const my = (CY + n.y) / 2;
  const dx = n.x - CX;
  const dy = n.y - CY;
  const len = Math.hypot(dx, dy) || 1;
  const k = 0.10; // bow amount, perpendicular to the line
  return `M ${CX} ${CY} Q ${mx - (dy / len) * len * k} ${my + (dx / len) * len * k} ${n.x} ${n.y}`;
};

export default function IntegrationEcosystem({ onNavigate }) {
  const [ref, inView] = useInView();
  const [sel, setSel] = useState(0); // index into positioned
  const node = positioned[sel];

  return (
    <section id="integrations" className="hiw-eco" aria-label="Integrations" ref={ref}>
      <div className={`container eco-grid reveal ${inView ? 'is-visible' : ''}`}>
        {/* Left/center: hub + connected nodes */}
        <div className="eco-stage">
          <svg className="eco-lines" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            {positioned.map((n, i) => (
              <path
                key={n.label}
                d={linePath(n)}
                className={`eco-line ${sel === i ? 'hot' : ''}`}
              />
            ))}
            {/* Travelling light pulses on two connections */}
            {[1, 4].map((i) => (
              <circle key={i} r="3.2" className="eco-pulse">
                <animateMotion dur={`${4 + i}s`} repeatCount="indefinite" path={linePath(positioned[i])} />
              </circle>
            ))}
          </svg>

          {/* Central hub — illustrative Kova Hub */}
          <div className="eco-hub" style={{ left: `${(CX / W) * 100}%`, top: `${(CY / H) * 100}%` }}>
            <span className="eco-hub-glow" aria-hidden="true" />
            <KovaMark size={34} />
            <span className="eco-hub-name">Kova Hub</span>
          </div>

          {positioned.map((n, i) => (
            <button
              key={n.label}
              type="button"
              className={`eco-node ${sel === i ? 'hot' : ''}`}
              style={{ left: `${n.px}%`, top: `${n.py}%` }}
              onMouseEnter={() => setSel(i)}
              onFocus={() => setSel(i)}
              onClick={() => setSel(i)}
              aria-label={`${n.label} — ${n.type} integration`}
            >
              <span className="eco-node-icon">
                <n.icon size={15} aria-hidden="true" />
              </span>
              <span className="eco-node-label">{n.label}</span>
            </button>
          ))}
        </div>

        {/* Selected integration details */}
        <div className="eco-info glass-panel" aria-live="polite">
          <span className={`eco-type t-${node.type.replace(/\s+/g, '-').toLowerCase()}`}>
            {node.type}
          </span>
          <p className="eco-info-name">{node.label}</p>
          <p className="eco-info-desc">{node.desc}</p>
        </div>

        {/* Right: copy */}
        <div className="hiw-copy right">
          <span className="hiw-label">Integrations</span>
          <h2 className="hiw-sec-title left">One Connected Home</h2>
          <p className="hiw-sec-desc left">
            Works with your favourite brands and protocols — from Philips Hue
            to Google Home.
          </p>
          <ul className="hiw-points">
            <li><Check size={14} aria-hidden="true" /> Local &amp; cloud integrations</li>
            <li><Check size={14} aria-hidden="true" /> Matter, Zigbee &amp; Z-Wave</li>
            <li><Check size={14} aria-hidden="true" /> Home Assistant compatibility</li>
          </ul>
          <button
            type="button"
            className="link-cta"
            onClick={() => onNavigate?.('/#connectivity')}
          >
            Explore Integrations <ArrowRight size={13} />
          </button>
          <p className="eco-more">…plus AirPlay, SmartThings and hundreds more.</p>
        </div>
      </div>
    </section>
  );
}
