import { House } from 'lucide-react';
import KovaMark from '../KovaMark';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { BrandIcon, iconTone } from './icons';

// Decorative orbit: the Kova hub at centre, curved SVG light-lines out to
// six real integration nodes. Nodes are buttons — they open the matching
// step guide. Positions live in a 1000x700 coordinate space shared by the
// absolutely-positioned buttons and the SVG lines.
const NODES = [
  { id: 'hue',          label: 'Philips Hue',   x: 170, y: 105 },
  { id: 'zigbee',       label: 'Zigbee',         x: 830, y: 90  },
  { id: 'sonos',        label: 'Sonos',          x: 96,  y: 430 },
  { id: 'homekit',      label: 'HomeKit',        x: 872, y: 470 },
  { id: 'smartthings',  label: 'SmartThings',    x: 300, y: 630 },
  { id: 'mqtt',         label: 'MQTT',           x: 700, y: 655 },
];
const HUB = { x: 500, y: 352 };
const INTEGRATION_ICON = {
  hue: { brand: 'siPhilipshue' },
  zigbee: { brand: 'siZigbee' },
  sonos: { brand: 'siSonos' },
  homekit: { lucide: 'House' },
  smartthings: { brand: 'siSmartthings' },
  mqtt: { brand: 'siMqtt' },
};

function curve(hx, hy, nx, ny, bend = 0.16) {
  // Quadratic curve hub→node, bowed perpendicular to the straight line.
  const mx = (hx + nx) / 2;
  const my = (hy + ny) / 2;
  const dx = nx - hx;
  const dy = ny - hy;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  return `M ${hx} ${hy} Q ${cx} ${cy} ${nx} ${ny}`;
}

export default function NetworkOrbit({ onGuide, className = '' }) {
  const reduced = useReducedMotion();
  return (
    <div className={`ni-orbit ${reduced ? 'is-still' : ''} ${className}`}>
      <svg
        className="ni-orbit-lines"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ni-line-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#54A8F4" stopOpacity="0" />
            <stop offset="0.5" stopColor="#54A8F4" stopOpacity="0.65" />
            <stop offset="1" stopColor="#40C7FF" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="ni-line-amber" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F4B942" stopOpacity="0" />
            <stop offset="0.5" stopColor="#F4B942" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFD477" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {NODES.map((n, i) => (
          <path
            key={n.id}
            className="ni-orbit-line"
            style={{ animationDelay: `${(i % 6) * 1.1}s` }}
            d={curve(HUB.x, HUB.y, n.x, n.y, i % 2 ? -0.16 : 0.16)}
            fill="none"
            stroke={i % 2 ? 'url(#ni-line-amber)' : 'url(#ni-line-blue)'}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ))}
      </svg>

      <div className="ni-orbit-hub" style={{ left: `${HUB.x / 10}%`, top: `${HUB.y / 7}%` }}>
        <span className="ni-orbit-hub-ring" aria-hidden="true" />
        <span className="ni-orbit-hub-core">
          <KovaMark size={40} />
        </span>
        <span className="ni-orbit-hub-label">Kova Hub</span>
      </div>

      {NODES.map((n, i) => (
        <button
          key={n.id}
          type="button"
          className={`ni-orbit-node ni-orbit-node-${i}`}
          style={{ left: `${n.x / 10}%`, top: `${n.y / 7}%`, animationDelay: `${i * 0.9}s` }}
          onClick={() => onGuide?.(n.id)}
          aria-label={`${n.label} setup guide`}
          title={n.label}
        >
          <BrandIcon icon={INTEGRATION_ICON[n.id]} size={18} tone={iconTone(n.id)} />
        </button>
      ))}
    </div>
  );
}
