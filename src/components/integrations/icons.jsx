// Brand + neutral icons for the integrations page.
//
// Brand glyphs come from simple-icons (pinned 16.37.0). The export names
// are exactly as that package ships them — e.g. siTplink, siPhilipshue.
// Neutral glyphs come from lucide-react by component name.
//
// Wrong-brand traps deliberately NOT used:
//   siNestjs   — that's NestJS the framework, not Google Nest
//   siMatterdotjs — Matter.js physics engine, not Matter the protocol
//   siHelix    — the Helix text editor, not ClickBIT Helix
//   siVaultwarden / siBitwarden — password managers, not Warden the router

import {
  siTplink, siPhilipshue, siEsphome, siShelly, siMqtt, siZigbee,
  siHomeassistant, siGooglecast, siSonos, siAirplayvideo, siSamsung,
  siSmartthings, siEcovacs, siGoogle,
} from 'simple-icons';

import {
  ToggleRight, Radio, Atom, House, Clapperboard, SunMedium, ShieldCheck,
  AirVent, Wind, UserCheck, Bell, Network, Smartphone, Webhook, BookOpen,
  Wifi, Cloud, LayoutGrid, Cable, Router, Speaker, Tv, Cpu, Zap, Sparkles,
} from 'lucide-react';

const BRAND_ICONS = {
  siTplink, siPhilipshue, siEsphome, siShelly, siMqtt, siZigbee,
  siHomeassistant, siGooglecast, siSonos, siAirplayvideo, siSamsung,
  siSmartthings, siEcovacs, siGoogle,
};

const LUCIDE_ICONS = {
  ToggleRight, Radio, Atom, House, Clapperboard, SunMedium, ShieldCheck,
  AirVent, Wind, UserCheck, Bell, Network, Smartphone, Webhook, BookOpen,
  Wifi, Cloud, LayoutGrid, Cable, Router, Speaker, Tv, Cpu, Zap, Sparkles,
};

// Brand hexes that fail contrast on the navy cards render reversed-white
// instead. Sonos/AirPlay/Samsung/Ecovacs/MQTT/Hue are all too dark or too
// close to the surface colour.
const REVERSED = new Set(['siSonos', 'siAirplayvideo', 'siSamsung', 'siEcovacs', 'siMqtt', 'siPhilipshue']);

export function BrandIcon({ icon, size = 22, className = '', tone = 'accent' }) {
  if (!icon) return null;

  if (icon.brand) {
    const def = BRAND_ICONS[icon.brand];
    if (def) {
      const color = REVERSED.has(icon.brand) ? '#F5F6FA' : `#${def.hex}`;
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill={color}
          className={`ni-brand-glyph ${className}`}
          aria-hidden="true"
        >
          <path d={def.path} />
        </svg>
      );
    }
  }

  const L = icon.lucide ? LUCIDE_ICONS[icon.lucide] : null;
  if (L) {
    return (
      <L
        size={size}
        strokeWidth={1.8}
        className={`ni-lucide-glyph ${className}`}
        aria-hidden="true"
        style={{ color: `var(--ni-icon-${tone})` }}
      />
    );
  }

  return <Cable size={size} strokeWidth={1.8} className={`ni-lucide-glyph ${className}`} aria-hidden="true" />;
}

// Accent for neutral (Lucide) glyphs, picked per integration id so a
// glyph-less brand still gets a distinctive colour.
const TONE_CYCLE = ['amber', 'blue', 'violet', 'green'];
export function iconTone(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return TONE_CYCLE[h % TONE_CYCLE.length];
}
