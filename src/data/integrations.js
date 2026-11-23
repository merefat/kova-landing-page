// Integrations catalog for /integrations — one data source for tiles,
// cards and the step-by-step connection guides.
//
// Content is written from the "How connections work in Kova" notes and
// cross-checked against the app's real setup copy
// (hub/src/integrations-catalog.ts). Do not change a connection method
// silently, and never invent statuses, device counts or endpoints.
//
// Entry shape:
//   id, name, group ('local'|'cloud'|'service'), connectionType, status,
//   setupMethod   – small method label used in the drawer header
//   summary       – one-line description
//   details       – longer paragraph for the drawer intro
//   icon          – { brand: 'siSonos' } | { lucide: 'Webhook' }
//   needs         – "You'll need" chips (only what the notes state)
//   methods[]     – { id, label, tag?, needs?, apply?, steps[] }
//                   apply: 'hot' (saving restarts just this integration)
//                          'restart' (takes effect when the hub restarts)
//   steps[]       – { title, body, code?, note?, links?: [{label, url}] }
//   gets          – "What you get" bullets, from the notes
//   warning       – { tone: 'amber'|'blue', text }
//   rules         – Notifications: the rules you can toggle
//   guideNote     – extra honesty note shown in the drawer intro
//   test          – the app has a Test button that tries settings unsaved
//
// When real integration state lands (integrations.json), map it onto
// `status` in one place: STATUS_* below. Until then every tile is a
// neutral 'supported' / 'cloud_setup' — nothing pretends to be connected.

export const STATUS = {
  supported: { label: 'Supported', tone: 'neutral' },
  connected: { label: 'Connected', tone: 'green' },
  available: { label: 'Available', tone: 'neutral' },
  needs_setup: { label: 'Setup required', tone: 'amber' },
  cloud_setup: { label: 'Cloud setup', tone: 'blue' },
  connecting: { label: 'Connecting', tone: 'blue' },
  error: { label: 'Error', tone: 'red' },
  unsupported: { label: 'Unsupported', tone: 'dim' },
};

export const GROUPS = {
  local: {
    id: 'local',
    label: 'Local Connections',
    sub: 'Direct, local control. No cloud required.',
    icon: 'Wifi',
  },
  cloud: {
    id: 'cloud',
    label: 'Cloud Services',
    sub: 'One-time setup for cloud-only integrations.',
    icon: 'Cloud',
  },
  service: {
    id: 'service',
    label: 'Services & More',
    sub: 'Go beyond devices with powerful services.',
    icon: 'LayoutGrid',
  },
};

export const INTEGRATIONS = [
  // ---------------------------------------------------------------- local
  {
    id: 'tuya',
    name: 'Tuya / Smart Life',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Smart Life code',
    summary: 'Tuya Wi-Fi switches, lights and LED strips — locally (protocols 3.3, 3.4, 3.5), no Tuya cloud at runtime.',
    details: 'Tuya Wi-Fi switches, lights and LED strips, controlled straight over your network. Three ways in: link with the Smart Life app (easiest), fetch every device’s local key from the Tuya cloud once, or enter keys by hand.',
    icon: { lucide: 'ToggleRight' },
    needs: ['Tuya or Smart Life devices on your Wi-Fi'],
    methods: [
      {
        id: 'smartlife',
        label: 'Link with Smart Life',
        tag: 'Easiest',
        needs: ['the Smart Life app'],
        steps: [
          { title: 'Get your User Code', body: 'In the Smart Life app go to Me → Settings (⚙, top right) → Account and Security → User Code and copy it.' },
          { title: 'Link with Smart Life', body: 'Paste it into Smart Life user code in Kova and press the button — Kova shows a QR code.' },
          { title: 'Scan it in Smart Life', body: 'In the app: Profile → “+” → Scan, and point it at the QR code Kova shows.', note: 'The code is only valid for about 5 minutes.' },
          { title: 'Devices arrive ready', body: 'Every device comes in with its local key — no cloud project needed. Control stays on your network.', note: 'Buttons and gateways are skipped, but listed.' },
        ],
      },
      {
        id: 'cloud',
        label: 'Tuya cloud keys',
        tag: 'One-time',
        needs: ['a free iot.tuya.com project'],
        steps: [
          { title: 'Create a cloud project', body: 'At iot.tuya.com make a free project — industry “Smart Home” — and pick your data center.', links: [{ label: 'iot.tuya.com', url: 'https://iot.tuya.com' }] },
          { title: 'Link your Smart Life app', body: 'Link the app to the project so it can see your devices.' },
          { title: 'Paste Access ID + Access Secret', body: 'Copy the project’s Access ID and Access Secret into Kova and pick your Data center.' },
          { title: 'Get keys from the Tuya cloud', body: 'Press the button — Kova fetches every device’s local key and data points, finds the devices on your network, and keeps your names and rooms.', note: 'Only needed again if a device is re-paired.' },
        ],
      },
      {
        id: 'manual',
        label: 'Manual keys',
        steps: [
          { title: 'Add a device', body: 'In Devices → Add device, enter its device id, IP address and 16-character local key.', code: 'bf3c… · 192.168.1.230' },
          { title: 'Pick the version', body: 'Choose the protocol your device speaks: 3.3, 3.4 or 3.5.' },
          { title: 'Map its channels', body: 'Map each channel to a name, room and type so multi-switch devices control the right thing.' },
        ],
      },
    ],
    gets: [
      'On/off for every switch channel',
      'Lights with brightness, warmth and colour (Tuya v1 and v2 light formats)',
      'Persistent local connection with automatic reconnect',
      'Buttons and gateways are skipped but listed',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'tapo',
    name: 'TP-Link Tapo',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Account + device IP',
    summary: 'Tapo plugs and bulbs via KLAP v2 — local HTTP, AES.',
    details: 'Tapo plugs and bulbs, controlled locally with your TP-Link sign-in (KLAP v2, local HTTP with AES).',
    icon: { brand: 'siTplink' },
    needs: ['a TP-Link account', 'each device’s IP'],
    methods: [
      {
        id: 'account',
        label: 'Account + devices',
        steps: [
          { title: 'Sign in', body: 'Enter your TP-Link email and password — or paste the credentials hash the Home Assistant importer fills in.' },
          { title: 'Add each plug or bulb', body: 'In Devices → Add device, type the plug or bulb’s IP address, pick its room and optionally name it.' },
          { title: 'Test it', body: 'Press Test to check the credentials and that the devices answer, before saving.' },
          { title: 'Save and connect', body: 'Tapo applies right away; device state is polled every 10 seconds, all local.' },
        ],
      },
    ],
    gets: ['On/off, brightness, warmth and colour', 'Polled every 10 s — all local'],
    apply: 'hot',
    test: true,
  },
  {
    id: 'hue',
    name: 'Philips Hue',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Pair with bridge',
    summary: 'Lights, plugs, sensors and dimmer switches through the Hue bridge’s local CLIP API v2.',
    details: 'Hue lights, plugs, motion/temperature/light sensors and dimmer/tap switches — through the bridge’s local CLIP API v2. No Hue account or cloud.',
    icon: { brand: 'siPhilipshue' },
    needs: ['a Hue bridge on your network'],
    methods: [
      {
        id: 'pair',
        label: 'Pair with bridge',
        steps: [
          { title: 'Find the bridge', body: 'Press Find Hue Bridge (mDNS) — or type its IP address yourself.' },
          { title: 'Press the link button', body: 'Press the round link button on top of the Hue bridge.' },
          { title: 'Pair', body: 'Press Pair with the Hue Bridge within about a minute — Kova saves its own application key.' },
          { title: 'Map rooms', body: 'Rooms → Add Hue room — type each Hue-room name exactly as in the Hue app and assign its Kova room.' },
        ],
      },
    ],
    gets: [
      'Lights as light / dimmer / plug — on, brightness, warmth, colour',
      'Sensors: motion, temperature, lux and battery',
      'Dimmer and tap switches as button-press events',
      'Live updates via Server-Sent Events — no polling',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'esphome',
    name: 'ESPHome',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Auto-discover',
    summary: 'Any ESPHome node over the ESPHome native API (TCP 6053).',
    details: 'Any ESPHome node — lights, switches, fans, sensors, locks, garage covers — over the ESPHome native API on TCP 6053.',
    icon: { brand: 'siEsphome' },
    needs: [],
    methods: [
      {
        id: 'discover',
        label: 'Auto-discover',
        steps: [
          { title: 'Find ESPHome devices', body: 'Press the button — Kova listens on the network and adds what it finds.' },
          { title: 'Open each added device', body: 'Set its room. The port defaults to 6053 — change it only if the node uses another.' },
          { title: 'Add its key if encrypted', body: 'Paste the Encryption key — the api: encryption: key: line from the device’s ESPHome YAML. Old firmware uses the API password field instead.', code: 'api:\n  encryption:\n    key: "…"' },
        ],
      },
    ],
    gets: [
      'Light, switch and fan control incl. speed',
      'All the node’s sensors combined into one Kova sensor',
      'Locks and garage doors as security devices',
      'Push state — no polling',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'shelly',
    name: 'Shelly',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Auto-discover',
    summary: 'Shelly relays, plugs, dimmers, bulbs, sensors and covers — all local, Gen1–Gen4.',
    details: 'Shelly relays, plugs, dimmers, bulbs, sensors and covers — all local, Gen1 to Gen4, no Shelly cloud.',
    icon: { brand: 'siShelly' },
    needs: [],
    methods: [
      {
        id: 'discover',
        label: 'Auto-discover',
        steps: [
          { title: 'Turn it on', body: 'Nothing to fill in for most homes — Gen1–Gen4 Shellies are found on the network and appear by themselves. No Shelly cloud.', code: '_shelly._tcp' },
          { title: 'Optional device password', body: 'Only if you set one on the devices — enter it once and it’s shared.' },
          { title: 'Room for new devices', body: 'Pick where newly found Shellies land.' },
          { title: 'Add by address', body: 'Only for a device discovery can’t reach — one on another VLAN, for example.' },
          { title: 'Say what relays are', body: 'Choose whether each relay shows as a plug, a light, or a garage-door cover.' },
        ],
      },
    ],
    gets: [
      'One device per relay/light channel — on/off + power',
      'Dimmers with brightness, warmth and colour',
      'Sensors: temp, humidity, lux, battery, motion, door, flood/smoke',
      'Input/button events; live updates over WebSocket on Gen2+',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'mqtt',
    name: 'MQTT',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Broker connection',
    summary: 'Anything that self-announces with Home Assistant MQTT discovery.',
    details: 'Anything that self-announces with Home Assistant MQTT discovery — Zigbee2MQTT, Tasmota, ESPHome-MQTT, Frigate, Valetudo and more.',
    icon: { brand: 'siMqtt' },
    needs: ['an MQTT broker on your network'],
    methods: [
      {
        id: 'broker',
        label: 'Broker connection',
        steps: [
          { title: 'Point at your broker', body: 'Broker address and port — 1883, or 8883 for TLS. Kova connects to your broker; it doesn’t run one.' },
          { title: 'Sign in if needed', body: 'Optional username and password. Switch Encryption (TLS) on if the broker is on port 8883.' },
          { title: 'Set the discovery prefix', body: 'Leave it at homeassistant — anything that announces itself there is picked up: Zigbee2MQTT, Tasmota, ESPHome-MQTT, Frigate, Valetudo…', code: 'homeassistant' },
          { title: 'Room for new devices', body: 'Pick where newly discovered devices land, then Save and connect.' },
        ],
      },
    ],
    gets: [
      'Lights (all schemas), switches and fans',
      'Sensors and binary sensors by device class',
      'Buttons and device triggers as button events',
      'Availability topics mark devices offline',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'zigbee',
    name: 'Zigbee',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'USB coordinator',
    summary: 'Any Zigbee device through a USB coordinator — no hub, no broker, no HA.',
    details: 'Any Zigbee device — lights, plugs, sensors, buttons, door locks, Tuya garage-door openers — through a USB coordinator (Sonoff ZBDongle-E/P, ConBee, SkyConnect…) via zigbee-herdsman. No hub, no MQTT broker, no Home Assistant.',
    icon: { brand: 'siZigbee' },
    needs: ['a Zigbee USB coordinator on the hub'],
    methods: [
      {
        id: 'stick',
        label: 'USB coordinator',
        steps: [
          { title: 'Plug in the stick', body: 'Sonoff ZBDongle-E/P, ConBee, SkyConnect and similar, plugged into the hub. In Docker the stick has to be passed through to the container.' },
          { title: 'Set its path and type', body: 'Best is the path under /dev/serial/by-id/ — it survives re-plugs. Leave it empty for auto-detect. Stick type is Detect, or pick the chipset.', code: '/dev/serial/by-id/usb-…' },
          { title: 'Pick the channel', body: 'New network only: channel 11–26 — 15, 20 or 25 stay clear of Wi-Fi. It can’t be changed after devices are paired.' },
          { title: 'Save and connect', body: 'Set a Room for new devices too, then save.' },
          { title: 'Add a device', body: 'Press Add a device — the network opens for four minutes. Put the device in pairing mode (hold its button, or toggle a bulb five times) close to the stick.' },
        ],
      },
    ],
    gets: [
      'Lights/dimmers and plugs with power metering',
      'Sensors: temp, humidity, lux, motion, door, battery',
      'Button events; locks and garage doors as security devices',
      'Network key and pairings kept in <KOVA_DATA>/zigbee — backed up',
    ],
    apply: 'hot',
  },
  {
    id: 'zwave',
    name: 'Z-Wave',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'USB stick',
    summary: 'Z-Wave switches, dimmers, sensors, locks and garage doors via zwave-js.',
    details: 'Z-Wave switches, dimmers, plugs, sensors, wall buttons, door locks and garage-door openers — via zwave-js, the same driver Home Assistant uses.',
    icon: { lucide: 'Radio' },
    needs: ['a Z-Wave USB stick on the hub'],
    methods: [
      {
        id: 'stick',
        label: 'USB stick',
        steps: [
          { title: 'Plug in the stick', body: 'Kova uses zwave-js and makes the network’s security keys itself.' },
          { title: 'Set the USB stick path, then save', body: 'Enter the /dev/serial/by-id/… path (required) so it survives moved USB sockets, then Save and connect first.', code: '/dev/serial/by-id/…' },
          { title: 'Add a device', body: 'Kova waits about a minute — put the device in inclusion mode (usually press its button three times). The PIN is only asked for the highest-security devices — locks and garage doors: the first five digits of the code printed on the device or its box.' },
          { title: 'Remove or stop', body: 'Remove a device starts an exclusion window — the same pairing-mode dance. Stop waiting cancels it.', note: 'Security keys are generated into the data folder — back it up, or secured devices must be re-added.' },
        ],
      },
    ],
    gets: [
      'Per-endpoint devices: switches → lights/plugs, dimmers',
      'Power/energy meters and multilevel sensors',
      'Notifications as motion/door events; battery',
      'Central Scene button events; locks and garage doors as security devices',
    ],
    apply: 'hot',
  },
  {
    id: 'matter',
    name: 'Matter',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Pair with code',
    summary: 'Matter lights, plugs and locks — Kova is a Matter controller on its own fabric.',
    details: 'Matter lights, plugs and door locks — Kova acts as a Matter controller on its own fabric (matter.js).',
    icon: { lucide: 'Atom' },
    needs: ['KOVA_MATTER=1', 'IPv6 + mDNS on the hub’s network', 'host networking'],
    methods: [
      {
        id: 'code',
        label: 'Pairing code',
        steps: [
          { title: 'Check the prerequisites', body: 'Matter needs KOVA_MATTER=1, IPv6 and mDNS on the hub’s network, and host networking.', code: 'KOVA_MATTER=1' },
          { title: 'Add a device', body: 'Type the pairing code — like 3497-011-2332 — or the MT: string. Optional room and name.', code: '3497-011-2332 · MT:…' },
          { title: 'Already in another home?', body: 'If it’s paired to Google Home or Apple Home, enable pairing mode in that app first to get a fresh code.' },
        ],
      },
    ],
    gets: [
      'Lights/dimmers incl. colour, plugs, locks with battery',
      'Kova is a Matter controller on its own fabric',
      'Live updates via subscription',
    ],
    apply: 'hot',
  },
  {
    id: 'homekit',
    name: 'HomeKit Devices',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Pair directly',
    summary: 'Kova pairs directly with HomeKit accessories — like HA’s homekit_controller.',
    details: 'HomeKit accessories — lights, outlets, switches, fans, purifiers — paired with Kova directly, the way Home Assistant’s homekit_controller works.',
    icon: { lucide: 'House' },
    needs: ['the accessory removed from Apple Home first'],
    methods: [
      {
        id: 'pair',
        label: 'Pair directly',
        steps: [
          { title: 'Save to switch it on', body: 'Turn the integration on and save — then press Find accessories to list unpaired accessories on the network.' },
          { title: 'Remove it from Apple Home', body: 'An accessory pairs with one controller at a time — remove it in the Home app first; reset it if it doesn’t show up.' },
          { title: 'Pair', body: 'Enter the Accessory id, the Setup code printed on the device, and a room.', code: '123-45-678' },
        ],
      },
    ],
    gets: [
      'Light / dimmer / plug / switch / fan / purifier control',
      'Live updates through HAP events',
      'No Apple account or cloud',
    ],
    apply: 'hot',
  },
  {
    id: 'haengine',
    name: 'HA Engine',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Home Assistant engine',
    summary: 'A managed Home Assistant for brands Kova doesn’t support natively — incl. custom/HACS.',
    details: 'The compatibility engine: any Home Assistant integration for brands Kova lacks — plus custom/HACS integrations from a GitHub repo.',
    icon: { brand: 'siHomeassistant' },
    needs: ['~500 MB download on first install'],
    methods: [
      {
        id: 'engine',
        label: 'Install the engine',
        steps: [
          { title: 'Choose how it runs', body: 'Run the engine in: Automatic, Docker (needs the Docker socket mounted — see docker-compose.yml) or Python 3.14.2+. Optional CPU limit, memory limit (MB) and USB passthrough.' },
          { title: 'Install the engine', body: 'Press Install the engine — it downloads about 500 MB and takes a few minutes; the status shows progress.' },
          { title: 'Configure inside it', body: 'Configure the Home Assistant integration you need inside the engine — its devices appear like native Kova ones.' },
          { title: 'Update the engine', body: 'Later, Update the engine moves it to the release your Kova version targets.' },
        ],
      },
    ],
    gets: [
      'HA devices appear as ordinary Kova devices',
      'Lights, switches, fans, sensors, buttons, media players, climate, locks, covers, alarm panels',
      'Usable in rooms, modes, automations, Sage and bridges',
    ],
    apply: 'hot',
  },
  {
    id: 'cast',
    name: 'Google Cast',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Auto-discover',
    summary: 'Nest speakers, Chromecasts, Cast TVs and Cast groups — found by mDNS.',
    details: 'Nest speakers, Chromecasts, Cast TVs/displays and Google Cast groups — found by mDNS.',
    icon: { brand: 'siGooglecast' },
    needs: [],
    methods: [
      {
        id: 'discover',
        label: 'Auto-discover',
        steps: [
          { title: 'Speakers find themselves', body: 'Nest speakers, Chromecasts, Cast TVs/displays and Cast groups are found on the network automatically once saved.' },
          { title: 'Rooms → Add speaker', body: 'Type each speaker or group name exactly as it appears in Google Home and give it a Kova room.' },
          { title: 'Find Cast speakers', body: 'For speakers on another VLAN — the optional Also search field takes a subnet.', code: '192.168.20.0/24' },
        ],
      },
    ],
    gets: [
      'Play a source or Helix music as a managed queue',
      'Volume and stop',
      'Perfect sync through native Cast groups',
    ],
    apply: 'hot',
  },
  {
    id: 'sonos',
    name: 'Sonos',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'UPnP discovery',
    summary: 'Sonos speakers over UPnP — SSDP discovery, or fixed IPs for other subnets.',
    details: 'Sonos speakers over UPnP — SSDP discovery, Find Sonos speakers for other subnets, or fixed addresses.',
    icon: { brand: 'siSonos' },
    needs: [],
    methods: [
      {
        id: 'discover',
        label: 'UPnP discovery',
        steps: [
          { title: 'Turn it on', body: 'Sonos speakers are found over UPnP automatically.' },
          { title: 'Other subnets', body: 'List comma-separated Speaker addresses for another VLAN, or press Find Sonos speakers with an optional subnet.', code: '192.168.20.12, 192.168.20.15' },
        ],
      },
    ],
    gets: [
      'Play sources and Helix music (queue, 50 at a time)',
      'Pause and volume',
      'On-the-fly native grouping inside Kova speaker groups',
      'S1 speakers get AAC, S2 get FLAC',
    ],
    apply: 'hot',
  },
  {
    id: 'airplay',
    name: 'AirPlay',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'OwnTone server',
    summary: 'Apple TV, HomePod and AirPlay speakers via OwnTone; AirCast bridges AirPlay to Cast.',
    details: 'Apple TV, HomePod and AirPlay speakers — through an OwnTone server you run. AirCast goes the other way: your Cast speakers appear as AirPlay targets.',
    icon: { brand: 'siAirplayvideo' },
    needs: [],
    methods: [
      {
        id: 'owntone',
        label: 'AirPlay speakers',
        needs: ['an OwnTone server'],
        steps: [
          { title: 'Run an OwnTone server', body: 'OwnTone is GPL so it runs as a separate process — it’s already in docker-compose.' },
          { title: 'Set the OwnTone address', body: 'Point Kova at the server.', code: 'http://localhost:3689' },
          { title: 'Rooms → Add speaker', body: 'Type each AirPlay name — Apple TV, HomePod… — and give it a Kova room. Then Save and connect.' },
        ],
      },
      {
        id: 'aircast',
        label: 'AirCast bridge',
        tag: 'AirPlay → Cast',
        apply: 'restart',
        steps: [
          { title: 'Get the aircast binary', body: 'Kova runs AirConnect’s aircast binary as a supervised child process.' },
          { title: 'Point aircast.binary at it', body: 'Optional: bind a specific network interface, or exclude speakers.', code: 'aircast.binary' },
          { title: 'Cast speakers appear as AirPlay', body: 'Every Cast speaker and group shows up as an AirPlay target on iPhones and Macs.', note: 'Takes effect when the hub restarts.' },
        ],
      },
    ],
    gets: [
      'Same-source multi-room AirPlay, synced by OwnTone',
      'Helix music through OwnTone’s queue',
      'Cast speakers as AirPlay targets (AirCast)',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'samsungtv',
    name: 'Samsung TV',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Allow once',
    summary: 'Samsung smart TVs (Tizen 2016+) — the TV asks to allow Kova once.',
    details: 'Samsung smart TVs (Tizen, 2016 and later). The TV shows an Allow prompt once, then its token is kept.',
    icon: { brand: 'siSamsung' },
    needs: ['a Samsung smart TV (2016+)', 'its IP — plus MAC for Wake-on-LAN'],
    methods: [
      {
        id: 'pair',
        label: 'Allow once',
        steps: [
          { title: 'Add the TV', body: 'TVs → Add TV: its IP address, MAC address (needed to power it on over Wake-on-LAN), room and name.' },
          { title: 'Accept once', body: 'Save and connect — the TV pops an Allow prompt once; accept it on the TV and its token is saved for good.' },
          { title: 'If refused', body: 'Press Pair again. If the TV turns Kova away without asking, enable IP Remote and set Access Notification to “first time only”, restart the TV and try again.' },
        ],
      },
    ],
    gets: [
      'Power state (poll), Wake-on-LAN on, remote keys',
      'Volume (DLNA) and HDMI/TV input switching',
      'Real input read-back when SmartThings is also linked',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'helix',
    name: 'Helix',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Pair with code',
    summary: 'ClickBIT’s media server — boxes as TVs, and Helix music on any speaker.',
    details: 'Helix boxes appear as tv devices, and Helix’s music library plays on any speaker.',
    icon: { lucide: 'Clapperboard' },
    needs: ['a Helix Server on your network'],
    methods: [
      {
        id: 'pair',
        label: 'Pair with code',
        steps: [
          { title: 'Find Helix Server', body: 'Press Find Helix Server to fill its address — or type it yourself.', code: 'http://192.168.x.x:8090' },
          { title: 'Pair with Helix', body: 'Press the button — Kova shows a code. In Helix Server’s UI: Devices → type the code → Pair. Kova detects the approval by itself.', note: '“Paired. Kova is connected.”' },
          { title: 'Set the music profile', body: 'Pick the Helix profile Kova acts as — whose Continue watching, loved songs, playlists and mixes it uses.' },
          { title: 'Map boxes to rooms', body: 'Match each Helix box to a Kova room; optionally wire each box’s TV, HDMI input and soundbar, and set Kova’s address for Helix (plain http:// plus the hub IP).' },
        ],
      },
    ],
    gets: [
      'What’s playing now, pause/play',
      '“Play The Office in the lounge” via Sage',
      'Movie overlay auto-starts when a film plays; doorbell pauses players',
      'Helix music on every Cast/Sonos/AirPlay speaker and group; played-count reported back',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'goodwe',
    name: 'GoodWe',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Solar inverter',
    summary: 'GoodWe solar inverters — read-only over Modbus TCP (port 502).',
    details: 'GoodWe solar inverters — read-only over Modbus TCP on port 502.',
    icon: { lucide: 'SunMedium' },
    needs: ['the inverter’s IP'],
    methods: [
      {
        id: 'modbus',
        label: 'Modbus TCP',
        steps: [
          { title: 'Add the inverter', body: 'Its IP address — the defaults are port 502 and Modbus unit 247. Optional room and name.', code: 'port 502 · unit 247' },
          { title: 'Non-defaults only', body: 'Change port or unit only if yours differ. The register map can be overridden per family or firmware. Then Save and connect.' },
        ],
      },
    ],
    gets: [
      'Solar generation and grid figures feeding the Energy screen',
      'Estimated use for unmetered devices',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'warden',
    name: 'Warden',
    group: 'local',
    connectionType: 'Local',
    status: 'supported',
    setupMethod: 'Router + presence',
    summary: 'ClickBIT’s router OS — internet status, per-device internet switches, presence, alerts.',
    details: 'Your Warden router, live: internet status, per-device internet switches, presence, and network alerts.',
    icon: { lucide: 'ShieldCheck' },
    needs: ['a Warden router', 'its address — https://192.168.1.1'],
    methods: [
      {
        id: 'connect',
        label: 'Connect with a code',
        steps: [
          { title: 'Enter the Warden address', body: 'Where you open Warden in a browser.', code: 'https://192.168.1.1' },
          { title: 'Make a connection code', body: 'In Warden, open Apps → Connect an app and tick the permissions Kova may use.' },
          { title: 'Copy the code', body: 'Copy the wardenconnect:… code.', code: 'wardenconnect:1:…' },
          { title: 'Paste it in Kova', body: 'Paste the code and press the button — works wherever Kova can reach Warden, at home or over Tailscale.' },
        ],
      },
      {
        id: 'pair',
        label: 'Pair with Warden',
        tag: 'Recommended',
        steps: [
          { title: 'Enter the Warden address', body: 'Where you open Warden in a browser.', code: 'https://192.168.1.1' },
          { title: 'Press Pair with Warden', body: 'Kova shows a code.' },
          { title: 'Approve in Warden', body: 'Open Warden’s /apps page (System → Accounts → Apps), check the code matches, and approve — Kova gets scoped tokens only.' },
        ],
      },
      {
        id: 'link',
        label: 'Link by signing in',
        steps: [
          { title: 'Enter the Warden address', body: 'Where you open Warden in a browser.', code: 'https://192.168.1.1' },
          { title: 'Sign in once', body: 'A Warden admin username and password — plus the one-time code if the account has 2FA. Kova makes its own operator token and discards the password.', note: 'The certificate fingerprint is pinned at link time.' },
        ],
      },
    ],
    gets: [
      'An Internet device + live events (down/up/failover/new-device/threats)',
      'Internet switches — pause a device’s internet, usable in modes and automations',
      'Presence — who’s home from Warden’s device records and people (replaces OPNsense)',
      'Plugs that power network gear, so Warden can ask Kova to power-cycle a frozen modem/AP',
      'Router power/PSU health; subnet list used by Cast/Sonos discovery',
    ],
    guideNote: 'Optional afterwards: Devices on your network (per-device MACs for presence), Internet switches → Add a device (pause a tablet), and Plugs that power network gear so Warden can ask Kova to power-cycle a frozen modem.',
    apply: 'hot',
    test: true,
  },

  // ---------------------------------------------------------------- cloud
  {
    id: 'nest',
    name: 'Google Nest',
    group: 'cloud',
    connectionType: 'Cloud',
    status: 'cloud_setup',
    setupMethod: 'Device Access + OAuth',
    summary: 'Nest doorbells and cameras via Google’s Smart Device Management cloud.',
    details: 'Nest doorbells, Nest Cams and Nest Hub Max — via Google’s Smart Device Management cloud. These devices have no local API, so the link is cloud-only.',
    icon: { brand: 'siGoogle' },
    needs: ['a Google account', 'a Device Access project', 'an OAuth client', 'a Pub/Sub subscription'],
    methods: [
      {
        id: 'deviceaccess',
        label: 'One-time Google setup',
        steps: [
          { title: 'Register for Device Access', body: 'A one-time, non-refundable US$5 registration fee per account, at Google’s Device Access console.', links: [{ label: 'Device Access registration', url: 'https://developers.google.com/nest/device-access/registration' }] },
          { title: 'Create an OAuth client', body: 'In Google Cloud, enable the SDM + Pub/Sub APIs and create an OAuth 2.0 client.' },
          { title: 'Make a Pub/Sub pull subscription', body: 'Needed for camera and doorbell events.', code: 'projects/…/subscriptions/…' },
          { title: 'Fill and save first', body: 'Device Access project id, OAuth client id + secret, and the Pub/Sub subscription — save before linking.' },
          { title: 'Link Google account', body: 'Press the button — a browser opens Google sign-in. Sign in, copy the code it returns and paste it into Finish linking.', note: 'The HA importer can pre-fill project, subscription and rooms.' },
        ],
      },
    ],
    gets: [
      'Camera devices with person / motion / sound / doorbell-ring events, deduped',
      'Drives Light the way, alerts and automations',
      'Live view over WebRTC in Security and the device panel (extend/stop)',
      'Latest-event image snapshots on cameras that support CameraEventImage',
    ],
    guideNote: 'The only camera path — these devices have no local API. Any camera an HA integration supports can also come through the HA engine, and Kova accepts webhooks for events.',
    apply: 'hot',
  },
  {
    id: 'smartthings',
    name: 'SmartThings',
    group: 'cloud',
    connectionType: 'Cloud',
    status: 'cloud_setup',
    setupMethod: 'Token → OAuth',
    summary: 'Samsung soundbars, plus reliable Samsung TV input read-back.',
    details: 'Samsung soundbars (HW-Q990B etc.) as media devices — and it makes Samsung TV source switching read-back reliable. Through your Samsung account.',
    icon: { brand: 'siSmartthings' },
    needs: ['a Samsung / SmartThings account'],
    methods: [
      {
        id: 'token',
        label: 'Token → linked app',
        steps: [
          { title: 'Make a token', body: 'At account.smartthings.com/tokens, create a token with the Devices and Apps permissions.', links: [{ label: 'account.smartthings.com/tokens', url: 'https://account.smartthings.com/tokens' }] },
          { title: 'Paste it once', body: 'Kova uses it once to create its own OAuth app on your account — the token isn’t kept.' },
          { title: 'Allow and finish', body: 'Kova opens the Allow page — allow it, then copy the code from the address bar of the page you land on into Finish linking. The refresh token stays on the hub.' },
        ],
      },
    ],
    gets: [
      'Soundbar as a media device: power, volume, mute, input (TV/HDMI/BT/Wi-Fi)',
      'Sound mode and night mode',
      'Samsung TVs get true input switching + read-back',
    ],
    apply: 'hot',
  },
  {
    id: 'connectlife',
    name: 'Hisense ConnectLife',
    group: 'cloud',
    connectionType: 'Cloud',
    status: 'cloud_setup',
    setupMethod: 'Account link',
    summary: 'Hisense split, window and portable air conditioners.',
    details: 'Hisense split/window/portable air conditioners through your ConnectLife account — the one the ConnectLife app uses.',
    icon: { lucide: 'AirVent' },
    needs: ['a ConnectLife account'],
    methods: [
      {
        id: 'link',
        label: 'Link the account',
        steps: [
          { title: 'Link ConnectLife', body: 'Sign in with your ConnectLife account.' },
          { title: 'Paste the redirect back', body: 'The page it lands on won’t load — that’s expected. Copy the whole address (it contains ?code=…) into Finish linking.', code: '?code=…' },
          { title: 'Put each AC in a room', body: 'Rooms → Put an air conditioner in a room — its ConnectLife device id is shown on the AC in Kova under Address.' },
        ],
      },
    ],
    gets: [
      'Climate devices: on/off, cool/heat/dry/fan/auto',
      'Target temperature, fan speed, room temperature',
      'Feeds the room-AC zone system for voice control',
    ],
    apply: 'hot',
  },
  {
    id: 'vesync',
    name: 'Levoit VeSync',
    group: 'cloud',
    connectionType: 'Cloud',
    status: 'cloud_setup',
    setupMethod: 'Account sign-in',
    summary: 'Levoit Core 200S–600S air purifiers.',
    details: 'Levoit Core 200S–600S air purifiers through your VeSync account.',
    icon: { lucide: 'Wind' },
    needs: ['a VeSync account'],
    methods: [
      {
        id: 'account',
        label: 'Sign in',
        steps: [
          { title: 'Sign in', body: 'VeSync email and password, plus your region — Europe, or everywhere outside Europe.' },
          { title: 'Map purifiers', body: 'Rooms → Add purifier: type the purifier’s name as in the VeSync app and give it a Kova room.' },
        ],
      },
    ],
    gets: [
      'Fan devices: on/off, Auto/Sleep/Manual modes',
      'Appears as AirPurifier on the bridges',
    ],
    apply: 'hot',
    test: true,
  },
  {
    id: 'ecovacs',
    name: 'Ecovacs',
    group: 'cloud',
    connectionType: 'Cloud',
    status: 'cloud_setup',
    setupMethod: 'Account sign-in',
    summary: 'DEEBOT robot vacuums (T-series etc.).',
    details: 'DEEBOT robot vacuums through your Ecovacs account.',
    icon: { brand: 'siEcovacs' },
    needs: ['an Ecovacs account'],
    methods: [
      {
        id: 'account',
        label: 'Sign in',
        steps: [
          { title: 'Sign in', body: 'Ecovacs email + password + the two-letter country your account is in (us, gb, de, au…).' },
          { title: 'Email code if asked', body: 'The first sign-in Ecovacs emails a verification code — enter it in Email code and Save and connect again.' },
        ],
      },
    ],
    gets: [
      'Start / pause / resume / dock, activity + battery',
      'Floor map with areas → rooms: “vacuum the kitchen”',
      'Clean modes, suction, base-station jobs, upkeep stats',
    ],
    apply: 'hot',
  },

  // -------------------------------------------------------------- service
  {
    id: 'presence',
    name: 'Presence',
    group: 'service',
    connectionType: 'Service',
    status: 'supported',
    setupMethod: 'Who’s home',
    summary: 'Who’s home — from routers, phone links and the app’s geofence.',
    details: 'Who’s home, combined per person from several sources: your router, phone links, pings, or the Kova app’s geofence. Pick any mix — they work together.',
    icon: { lucide: 'UserCheck' },
    needs: [],
    methodsNote: 'Combine sources — they work together per person.',
    methods: [
      {
        id: 'warden',
        label: 'Warden',
        steps: [
          { title: 'Link Warden first', body: 'Once Warden is connected, presence is automatic — Kova uses Warden’s per-person “who’s home”.' },
          { title: 'Match people', body: 'Set Person in Warden only where names differ from Kova’s people.' },
          { title: 'Add each person’s phones', body: 'In Phones → Add person, pick the person and list their phone’s MAC address(es).', note: 'iPhone: disable Private Wi-Fi Address for your home network — or use the private MAC iOS shows.' },
        ],
      },
      {
        id: 'opnsense',
        label: 'OPNsense router',
        steps: [
          { title: 'Make an API key', body: 'On the router, create an API key + secret with privileges for the ARP and NDP tables only.' },
          { title: 'Enter it in Kova', body: 'OPNsense address, API key and API secret. Kova reads the ARP table every 30 seconds.' },
          { title: 'Add each person’s phones', body: 'In Phones → Add person, pick the person and list their phone’s MAC address(es).', note: 'iPhone: disable Private Wi-Fi Address for your home network — or use the private MAC iOS shows.' },
        ],
      },
      {
        id: 'ping',
        label: 'Ping',
        steps: [
          { title: 'Give phones a fixed IP', body: 'For phones that keep one address on your network.' },
          { title: 'Kova pings them', body: 'On TCP 62078 — tuned so sleeping iPhones still answer.', code: 'TCP 62078' },
        ],
      },
      {
        id: 'phone',
        label: 'Phone shortcut links',
        steps: [
          { title: 'Press Phone shortcut links', body: 'Each person gets their own arrive/leave URLs with personal keys — for an iOS Shortcut or Android automation.', code: 'GET /api/presence/setup' },
        ],
      },
      {
        id: 'app',
        label: 'Kova app',
        steps: [
          { title: 'Install the Kova app', body: 'Turn on location — a 150 m geofence posts arrive/leave automatically.' },
        ],
      },
    ],
    gets: [
      'Who’s-home driving “only when someone’s home” modes',
      'Away ending on arrival; Light the way',
      'Presence triggers in automations',
      'The Security page',
    ],
    guideNote: 'Away after defaults to 10 minutes.',
    apply: 'restart',
  },
  {
    id: 'notify',
    name: 'Notifications',
    group: 'service',
    connectionType: 'Service',
    status: 'supported',
    setupMethod: 'Phone / Web Push',
    summary: 'Alerts on your phone — the Kova app, Web Push, or ntfy.',
    details: 'Alerts on your phone, through the Kova phone app, Web Push to the installed web app, or any ntfy server — pick any mix.',
    icon: { lucide: 'Bell' },
    needs: [],
    methodsNote: 'Pick any mix of channels.',
    methods: [
      {
        id: 'kovaapp',
        label: 'Kova phone app',
        steps: [
          { title: 'Install the Kova app', body: 'Add Kova to your phone’s Home Screen — notifications arrive directly over HTTPS, nothing else to set up.' },
          { title: 'Send a test', body: 'The Send a test button verifies delivery to your phone.' },
        ],
      },
      {
        id: 'ntfy',
        label: 'ntfy',
        steps: [
          { title: 'Pick a server and topic', body: 'Optional — an ntfy server, a topic and an access token if it needs one. ntfy.sh works, or your own server.', code: 'https://ntfy.sh' },
        ],
      },
    ],
    rules: [
      'Doorbell rings',
      'Everyone’s out and lights are on',
      'A device stops responding',
      'A link to Helix, Warden or a cloud stops working',
      'Network alerts from Warden',
      'The home: filters, poor air, heat and cold, low batteries',
    ],
    gets: [
      'Doorbell rings; “everyone out with lights on” with a one-tap fix',
      'Device offline, link lost, Warden network events',
      'Home alerts: filters, air, temps, batteries',
      'Per-kind frequency prefs per person + quiet hours',
    ],
    apply: 'restart',
  },
  {
    id: 'matterBridge',
    name: 'Matter Bridge',
    group: 'service',
    connectionType: 'Bridge',
    status: 'supported',
    setupMethod: 'Google, Alexa, SmartThings, Apple Home',
    summary: 'Exposes Kova devices outward to other ecosystems over Matter.',
    details: 'Share Kova devices with Google Home, Alexa, SmartThings and Apple Home as a native Matter bridge.',
    icon: { lucide: 'Network' },
    needs: ['IPv6 + mDNS'],
    methods: [
      {
        id: 'enable',
        label: 'Enable the bridge',
        steps: [
          { title: 'Enable and save', body: 'Turn the bridge on and save — needs KOVA_MATTER_BRIDGE=1.', code: 'KOVA_MATTER_BRIDGE=1', note: 'Takes effect when the hub restarts.' },
          { title: 'Show pairing code', body: 'Press the button — Kova shows a QR and the manual code.' },
          { title: 'Add it in the other app', body: 'In Google Home, Alexa, SmartThings or Apple Home: Add Matter device → scan the QR or enter the code.', note: 'Google Home requires registering the test vendor/product id in its Developer Console once.' },
        ],
      },
    ],
    gets: [
      'Lights → On/Off + Dimmable + Color lights; plugs → plug units',
      'Purifiers → air purifiers; overlays → switches (“Kova Movie”)',
      'One thermostat per room AC zone',
      'Voice-assistant commands flow through Kova’s engine — logged by source',
    ],
    apply: 'restart',
  },
  {
    id: 'homekitBridge',
    name: 'HomeKit Bridge',
    group: 'service',
    connectionType: 'Bridge',
    status: 'supported',
    setupMethod: 'Apple Home / Siri',
    summary: 'Apple Home bridge — Siri control of Kova. No locks or alarms.',
    details: 'Your Kova lights, plugs, overlays and room ACs appear in the Home app and Siri.',
    icon: { lucide: 'House' },
    needs: [],
    warning: {
      tone: 'amber',
      text: 'Locks, garage doors and alarms are deliberately never exposed — Siri can never unlock or disarm.',
    },
    methods: [
      {
        id: 'enable',
        label: 'Enable the bridge',
        steps: [
          { title: 'Enable and save', body: 'Turn the bridge on — optional Port (default 51826) — and save. Needs KOVA_HOMEKIT=1.', code: 'KOVA_HOMEKIT=1 · port 51826', note: 'Takes effect when the hub restarts.' },
          { title: 'Show pairing code', body: 'Press the button — Kova shows the pairing code.' },
          { title: 'Add it in the Home app', body: 'On iPhone: Home app → “+” → Add Accessory → scan the QR or type the code. TVs appear as separate Television accessories with the same code.' },
        ],
      },
    ],
    gets: [
      'Lights, dimmers, plugs and purifiers in Apple Home',
      'Overlays as switches; per-room-AC HeaterCoolers',
      'Siri control of Kova',
    ],
    apply: 'restart',
  },
  {
    id: 'haimport',
    name: 'HA Import',
    group: 'service',
    connectionType: 'Service',
    status: 'supported',
    setupMethod: 'Migrate configuration',
    summary: 'Import rooms, people and device configuration from a Home Assistant backup.',
    details: 'The migration path: upload a Home Assistant backup (encrypted SecureTar works) or point Kova at the config folder, preview, then apply.',
    icon: { brand: 'siHomeassistant' },
    needs: ['an HA backup or config folder'],
    methods: [
      {
        id: 'import',
        label: 'Import a backup',
        steps: [
          { title: 'Bring the backup', body: 'Owner-only, in the web app: open Import and upload a Home Assistant backup file — or point Kova at a config folder on the hub. If the backup is encrypted, provide its backup key.' },
          { title: 'Preview', body: 'Kova shows the rooms, people, devices and integration settings it will bring over — review and mark items.' },
          { title: 'Apply', body: 'Kova switches to your real home: rooms, people, location, and pre-filled localtuya keys, Tapo hosts, Cast/Samsung/Shelly/VeSync/Ecovacs/Nest config.', note: 'Passwords are never imported. HA automations are converted to Kova automations — they start switched off so HA can keep running meanwhile.' },
          { title: 'Or from the CLI', body: 'The importer also runs on the command line.', code: 'cd hub && npx tsx src/tools/import-ha.ts /path/to/homeassistant/.storage ../data' },
        ],
      },
    ],
    gets: [
      'Rooms, people and location',
      'Pre-filled integration settings (keys, hosts, ids)',
      'Automations translated — they start disabled',
    ],
    apply: 'hot',
  },
  {
    id: 'phone',
    name: 'Phone App',
    group: 'service',
    connectionType: 'Service',
    status: 'supported',
    setupMethod: 'QR join',
    summary: 'The Kova phone app — QR code, auto-discovery, or invite links.',
    details: 'The native iOS/Android app connects to the hub by QR code or auto-discovery; household members join with one-time invite links.',
    icon: { lucide: 'Smartphone' },
    needs: [],
    methods: [
      {
        id: 'qr',
        label: 'Scan the code',
        tag: 'Easiest',
        steps: [
          { title: 'Show the QR on a computer', body: 'Open Kova on a computer — “Kova on your phone” in the sidebar shows a QR code.', code: '/connect.html' },
          { title: 'Scan it in the app', body: 'On the first-run screen tap Scan the code, allow the camera and point it at the screen — the code carries the hub address, token, hub id and alternate addresses.' },
        ],
      },
      {
        id: 'discover',
        label: 'Find my hub on this Wi-Fi',
        steps: [
          { title: 'Same Wi-Fi', body: 'Tap Find my hub on this Wi-Fi — the app searches the network for the hub by itself.' },
        ],
      },
      {
        id: 'manual',
        label: 'Address or invite',
        steps: [
          { title: 'Sign in manually', body: 'Tap “Sign in with a username, or type the address” — enter the hub address and your username and password, or the hub’s access key.' },
          { title: 'Invited to a home?', body: 'Paste the invite link here or scan its code.', note: 'Tokens live in Keychain/Keystore; the app keeps LAN first and remote HTTPS after, re-picking on network changes.' },
        ],
      },
    ],
    gets: [
      'Full Kova on the phone: control, modes, Sage, security',
      'Arrive/leave geofence for presence',
      'Push notifications',
    ],
    apply: 'hot',
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    group: 'service',
    connectionType: 'Service',
    status: 'supported',
    setupMethod: 'Event integrations',
    summary: 'External systems inject device events — POST /api/devices/:id/event.',
    details: 'Any external system can inject device events — doorbell rings, person detections — and report physical state.',
    icon: { lucide: 'Webhook' },
    needs: [],
    methods: [
      {
        id: 'post',
        label: 'POST events',
        steps: [
          { title: 'POST an event', body: 'Outside systems — cameras, NVRs, automators — push events into Kova: a person seen, a doorbell rung. Send JSON with the event type and optional data.', code: 'POST /api/devices/<id>/event\n{ "type": "person", "data": {…} }' },
          { title: 'Authenticate', body: 'Requests need the owner token in the Authorization header.', code: 'Authorization: Bearer <KOVA_TOKEN>' },
          { title: 'Report physical state', body: 'For things flipped by hand — a wall switch — report the physical state so Kova stays honest.', code: 'POST /api/devices/<id>/physical' },
          { title: 'Try it', body: 'Events drive automations, Light the way, alerts and notifications — just like the device’s own events.', code: 'curl -X POST localhost:8140/api/devices/doorbell/event -H "content-type: application/json" -d \'{"type":"person"}\'' },
        ],
      },
    ],
    gets: [
      'External systems inject device events',
      'Physical-state reports keep Kova honest',
      'Same events pipeline as native integrations',
    ],
    apply: 'hot',
  },
];

// ------------------------------------------------------------- docs guide
// "How connections work in Kova" — the general setup rules, from the notes.
// Opened by the sidebar's "View Docs" button. `gets` is unused for docs;
// the final screen offers the guide index instead.
export const DOCS_GUIDE = {
  id: 'docs',
  name: 'How connections work in Kova',
  group: 'service',
  connectionType: 'Guide',
  status: 'supported',
  setupMethod: 'The basics',
  summary: 'Everything connects through the Integrations screen — fields, pairing buttons, done.',
  details: 'Everything connects through the Integrations screen in the app, web or phone. Each connection is a section in integrations.json on the hub. Most integrations are local and work without internet; cloud ones exist only because the brand has no local API.',
  icon: { lucide: 'BookOpen' },
  needs: [],
  methods: [
    {
      id: 'basics',
      label: 'The basics',
      steps: [
        { title: 'Open Integrations', body: 'Everything connects through the Integrations screen in the app — web or phone.' },
        { title: 'Fill in its fields', body: 'Each connection is a section in integrations.json on the hub. You fill in fields — address, account, room — and secrets are shown as ••••.' },
        { title: 'Press the pairing buttons', body: 'Where a brand offers it, a button does the heavy lifting — find on the network, pair, link an account, show a code.' },
        { title: 'Kova applies it', body: 'Saving restarts just that integration. A few bridges and services take effect when the hub restarts instead.' },
        { title: 'Local first', body: 'Most integrations work without internet. Cloud ones exist only because the brand has no local API.' },
        { title: 'More ways in', body: 'The Home Assistant importer, the phone app, Siri and Shortcuts, webhooks — plus Met.no weather and optional Google Maps.' },
      ],
    },
  ],
  gets: [],
  apply: 'hot',
};

// ---------------------------------------------------------------- helpers
export const byId = (id) =>
  id === DOCS_GUIDE.id ? DOCS_GUIDE : INTEGRATIONS.find((i) => i.id === id);

export const byGroup = (group) => INTEGRATIONS.filter((i) => i.group === group);

export const counts = () => ({
  total: INTEGRATIONS.length,
  local: byGroup('local').length,
  cloud: byGroup('cloud').length,
  service: byGroup('service').length,
});
