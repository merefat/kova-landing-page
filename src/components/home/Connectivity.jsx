import { useEffect, useState } from 'react';
import {
  Lightbulb,
  Lock,
  Activity,
  Monitor,
  Wind,
  Camera,
  SunMedium,
  Network,
  Search,
  Wifi,
} from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { BrandIcon, iconTone } from '../integrations/icons';

// Adapters orbit — 17 local integrations on the inner ring, 5 cloud-only ones
// on the dashed outer ring. Warden + Helix are ClickBIT's own products.
// Names/icons match src/data/integrations.js; k = category filter letters.
const ADAPTERS = [
  { n: 'Tuya', k: 'l', d: 'Switches and lights — local key fetched once', icon: { lucide: 'ToggleRight' } },
  { n: 'Tapo', k: 'l', d: 'Plugs and bulbs over local KLAP v2', icon: { brand: 'siTplink' } },
  { n: 'Hue', k: 'ls', d: 'Live events, motion and button sensors', icon: { brand: 'siPhilipshue' } },
  { n: 'ESPHome', k: 'lks', d: 'Encrypted API — lights, locks, garage covers', icon: { brand: 'siEsphome' } },
  { n: 'Shelly', k: 'lks', d: 'Gen1 to Gen4 relays, lights, garage doors', icon: { brand: 'siShelly' } },
  { n: 'Zigbee', k: 'ks', d: 'USB stick — no broker needed', icon: { brand: 'siZigbee' } },
  { n: 'Z-Wave', k: 'ks', d: 'USB stick with secure S0/S2 pairing', icon: { lucide: 'Radio' } },
  { n: 'Matter', k: 'lk', d: 'Add by code or QR, shared with other apps', icon: { lucide: 'Atom' } },
  { n: 'HomeKit', k: 'l', d: 'Pair HomeKit accessories directly', icon: { lucide: 'House' } },
  { n: 'Cast', k: 'm', d: 'Google Cast speakers and TVs, synced groups', icon: { brand: 'siGooglecast' } },
  { n: 'Sonos', k: 'm', d: 'Auto-discovery, grouping and queues', icon: { brand: 'siSonos' } },
  { n: 'AirPlay', k: 'm', d: 'Apple TV and HomePod', icon: { brand: 'siAirplayvideo' } },
  { n: 'Samsung TV', k: 'm', d: 'Power, keys, volume and inputs', icon: { brand: 'siSamsung' } },
  { n: 'GoodWe', k: 'e', d: 'Solar inverter data on the Energy screen', icon: { lucide: 'SunMedium' } },
  { n: 'MQTT', k: 'slc', d: 'Zigbee2MQTT, Tasmota, Frigate and Valetudo appear automatically', icon: { brand: 'siMqtt' } },
  { n: 'Warden', k: 'n', own: true, d: 'ClickBIT router — pause internet per device, see who is home', icon: { lucide: 'ShieldCheck' } },
  { n: 'Helix', k: 'mc', own: true, d: 'ClickBIT media server — TV boxes, music, doorbell auto-pause', icon: { lucide: 'Clapperboard' } },
  { n: 'SmartThings', k: 'm', cl: true, d: 'Samsung soundbar volume, input and sound modes', icon: { brand: 'siSmartthings' } },
  { n: 'Levoit', k: 'a', cl: true, d: 'VeSync air purifiers — no local option exists', icon: { lucide: 'Wind' } },
  { n: 'Ecovacs', k: 'a', cl: true, d: 'DEEBOT vacuums — start, dock, battery', icon: { brand: 'siEcovacs' } },
  { n: 'Google Nest', k: 'c', cl: true, d: 'Doorbell events, live view and snapshots', icon: { brand: 'siGoogle' } },
  { n: 'ConnectLife', k: 'a', cl: true, d: 'Hisense air conditioner modes, temperature, fan', icon: { lucide: 'AirVent' } },
];

// Extra words the search matches, beyond the adapter name.
const ALIAS = {
  Tuya: 'smart life', Tapo: 'tp-link tplink', Hue: 'philips bridge',
  ESPHome: 'esp32 esp8266', 'Z-Wave': 'zwave zwave-js', Matter: 'thread',
  HomeKit: 'apple home', Cast: 'chromecast google tv nest speaker',
  AirPlay: 'apple tv homepod', 'Samsung TV': 'tizen',
  GoodWe: 'solar inverter', MQTT: 'tasmota frigate valetudo zigbee2mqtt',
  Zigbee: 'zigbee2mqtt z2m', Warden: 'router clickbit',
  Helix: 'media server clickbit', SmartThings: 'samsung soundbar',
  Levoit: 'vesync air purifier', Ecovacs: 'deebot robot vacuum',
  'Google Nest': 'camera doorbell', ConnectLife: 'hisense air conditioner ac',
};

const FILTERS = [
  { k: 'l', icon: Lightbulb, label: 'Lights' },
  { k: 'k', icon: Lock, label: 'Locks' },
  { k: 's', icon: Activity, label: 'Sensors' },
  { k: 'm', icon: Monitor, label: 'TV & sound' },
  { k: 'a', icon: Wind, label: 'Air & clean' },
  { k: 'c', icon: Camera, label: 'Cameras' },
  { k: 'e', icon: SunMedium, label: 'Solar' },
  { k: 'n', icon: Network, label: 'Network' },
];

const LOCAL_COUNT = ADAPTERS.filter((a) => !a.cl).length;
const hay = (a) => `${a.n} ${ALIAS[a.n] || ''}`.toLowerCase();

// Ring layout: locals sweep the inner ring (r=30%), clouds cluster at the top
// of the outer ring (r=46%) — same geometry as the reference widget.
const STEP = 360 / ADAPTERS.length;
let li = 0;
let ci = 0;
const PLACED = ADAPTERS.map((a) => {
  const t = (a.cl ? ci++ - 2 : li++ + 0.5) * STEP * (Math.PI / 180);
  const r = a.cl ? 46 : 30;
  return { ...a, x: 50 + r * Math.sin(t), y: 50 - r * Math.cos(t) };
});

export default function Connectivity() {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [filterK, setFilterK] = useState('');
  const [off, setOff] = useState(false);
  const [intro, setIntro] = useState(false);

  // Staggered pop-in once the orbit scrolls into view (desktop only —
  // the .pre/.intro rules live inside the min-width media query).
  useEffect(() => {
    if (!inView || reduced) return;
    setIntro(true);
    const t = setTimeout(() => setIntro(false), 2600);
    return () => clearTimeout(t);
  }, [inView, reduced]);

  const q = query.trim().toLowerCase();
  const matched = q ? PLACED.filter((a) => hay(a).includes(q)) : PLACED;
  const noHit = q.length > 0 && matched.length === 0;
  const active = hovered || (q ? matched[0] : selected);
  const dimmed = (a) => (filterK && !a.k.includes(filterK)) || (q && !hay(a).includes(q));

  let hub;
  if (noHit) {
    hub = (
      <>
        <b>Not built in</b>
        <span>The Home Assistant engine may still run it.</span>
      </>
    );
  } else if (active) {
    hub = (
      <>
        <i className={`cn-hub-ic ${active.cl ? 'cloud' : ''}`}>
          <BrandIcon icon={active.icon} size={22} tone={active.own ? 'green' : active.cl ? 'blue' : iconTone(active.n)} />
        </i>
        <b>{active.n}</b>
        <em className={active.cl ? 'cloud' : ''}>{active.cl ? (off ? 'Offline' : 'Cloud') : 'Local'}</em>
        {active.own && <em className="own">ClickBIT</em>}
        <span>{active.d}</span>
      </>
    );
  } else if (off) {
    hub = (
      <>
        <b>{LOCAL_COUNT} still run</b>
        <span>Local adapters keep running. Cloud ones pause.</span>
      </>
    );
  } else {
    hub = (
      <>
        <b>Kova</b>
        <span>{LOCAL_COUNT} local, {ADAPTERS.length - LOCAL_COUNT} cloud. Tap any device.</span>
      </>
    );
  }

  return (
    <section id="connectivity" aria-label="Integrations" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card cf-card cf-connect">
          <div className="cn-head">
            <p className="card-kicker">Connectivity</p>
            <h3 className="pm-title">Everything connects to Kova</h3>
            <p className="card-desc">
              Search your device, switch the internet off, or tap any logo.
            </p>
          </div>

          <div className="cn-tools">
            <label className="cn-q">
              <Search size={15} aria-hidden="true" />
              <input
                type="search"
                placeholder="Is my device supported? Try Hue, Sonos, Tasmota"
                aria-label="Search your device"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="cn-sw"
              role="switch"
              aria-checked={!off}
              onClick={() => setOff((v) => !v)}
            >
              <Wifi size={15} aria-hidden="true" />
              <span>{off ? 'Internet off' : 'Internet on'}</span>
              <i aria-hidden="true" />
            </button>
          </div>

          <div className="cn-fs" role="group" aria-label="Filter by device type">
            {FILTERS.map(({ k, icon: Icon, label }) => (
              <button
                key={k}
                type="button"
                className="cn-f"
                aria-pressed={filterK === k}
                onClick={() => setFilterK((v) => (v === k ? '' : k))}
              >
                <i><Icon size={19} aria-hidden="true" /></i>
                {label}
              </button>
            ))}
          </div>

          <div
            className={`cn-orb ${off ? 'net-off' : ''} ${!inView && !reduced ? 'pre' : ''} ${intro ? 'intro' : ''}`}
          >
            <svg className="cn-ln" viewBox="0 0 100 100" aria-hidden="true">
              <circle className="cn-zone" cx="50" cy="50" r="39" />
              {PLACED.map((a) => (
                <line
                  key={a.n}
                  x1="50"
                  y1="50"
                  x2={a.x}
                  y2={a.y}
                  className={`${a.cl ? 'cloud' : ''} ${dimmed(a) ? 'dim' : ''} ${active === a ? 'on' : ''}`}
                />
              ))}
            </svg>

            <div className="cn-hub" aria-live="polite">
              {hub}
            </div>

            {PLACED.map((a, i) => (
              <button
                key={a.n}
                type="button"
                className={`cn-node ${a.cl ? 'cloud' : ''} ${a.own ? 'own' : ''} ${dimmed(a) ? 'dim' : ''}`}
                style={{ '--x': `${a.x}%`, '--y': `${a.y}%`, '--n': i }}
                aria-pressed={selected === a}
                onMouseEnter={() => setHovered(a)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(a)}
                onBlur={() => setHovered(null)}
                onClick={() => setSelected((s) => (s === a ? null : a))}
              >
                <i>
                  <BrandIcon
                    icon={a.icon}
                    size={19}
                    tone={a.own ? 'green' : a.cl ? 'blue' : iconTone(a.n)}
                  />
                </i>
                {a.n}
              </button>
            ))}
          </div>

        </article>
      </div>
    </section>
  );
}
