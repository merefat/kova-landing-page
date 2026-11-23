# Kova — Comprehensive Platform & Product Reference

> **Kova** is a local-first smart home platform developed by **ClickBIT**. It operates via a dedicated in-home hub (TypeScript / Node 22 + SQLite) that communicates directly with smart home devices over the local network—requiring zero cloud connectivity except for cloud-only 3rd-party brands and remote push notifications. Controlled by a modern Web App and a Native iOS/Android App (React Native / Expo), Kova organizes home automation around **time rhythms and holistic house states (modes)** rather than unorganized device lists.

---

## 1. System Architecture & Core Philosophy

- **Local-First Reliability:** The hub runs locally inside the home on Node 22 with an embedded SQLite database. Network outages never impair internal automations, mode changes, or local device control.
- **State & Mode-Centric Paradigm:** The home is always in an active **Mode** (e.g., *Day, Evening, Wind down, Night, Dawn*). Temporary states (**Overlays**) sit on top of modes and expire naturally or through defined triggers.
- **Explainability & Event Log:** Every single change in the ecosystem records its origin cause (*mode, moment, overlay, behaviour, user, device, presence, assistant, automation, undo, system*). This powers the Activity feed, "Why?" diagnostic queries, and state replay.
- **System-Wide Undo:** Any user-initiated action can be undone within a 15-minute window.
- **Interactive Day Preview:** Replay the home’s schedule across the 24-hour timeline to visualize exactly how devices will be configured at any given hour.

---

## 2. Core Concepts & Domain Model

### Device Types (14 Classes)
1. **Light:** Switching, brightness, color temperature, RGB/HSV color.
2. **Dimmer:** Stepped and fluid level transitions.
3. **Fan:** Speed percentages, directional and oscillation fan modes.
4. **Media:** Playback transport, volume, mute, queues, library navigation.
5. **TV:** Power/WoL, input switching, volume, media transport, app state.
6. **Plug:** On/off switching, live power metering, energy accumulation.
7. **Camera:** WebRTC video streams, snapshot caching, event analytics.
8. **Sensor:** Multi-metric telemetry (temperature, humidity, motion, illuminance, air quality).
9. **Vacuum:** Navigation, zone/room cleaning, suction levels, dock operations.
10. **Internet Switch:** Granular per-device LAN/WAN access toggles via router integrations.
11. **Climate:** Thermostats, target temperatures, heating/cooling mode management.
12. **Lock:** State sensing, secure one-tap unlocking protocols.
13. **Garage Door:** Obstruction detection, open/close cycle management.
14. **Alarm:** Arming/disarming partitions, sensor trip monitoring.

### Capabilities
- `on/off`, `brightness`, `color temp`, `color`, `fan modes`, `media`, `volume`, `power/energy metering`, `events`, `battery`, `pause`, `library`, `input`, `queue`, `mute`, `sound modes`, `climate`, `zones`, `purifier`, `extras`, `lock/garage/alarm`.

### Time, Modes, Moments & Overlays
- **Modes:** Foundation time-of-day states triggered by a configurable **Rhythm**:
  - Absolute clock time.
  - Solar events (Sunrise, Sunset, Dawn, Dusk, Solar Noon) with positive/negative minute offsets.
  - Islamic Prayer Times (Fajr, Dhuhr, Asr, Maghrib, Isha) with offsets.
- **Moments:** Discrete, one-off timed actions within the day plan (e.g., `21:00 rain sounds`).
- **Overlays:** Ephemeral overrides resting atop the active mode (e.g., *Movie, Away, Party, Guest, Cleaning*). Overlays terminate automatically based on:
  - Elapsed duration.
  - Device state (e.g., TV turned off).
  - Geofence arrival.
  - Manual dismissal.
- **Behaviours:** Standard reactive safety and convenience rules.
  - *Light the way (v1):* When presence is detected via camera or arrival, turns on relevant hallway/entry lights for $N$ minutes, strictly preserving lights that were already manually illuminated.

### Automations Engine
- **Triggers (WHEN):** Device state transitions (to/from), numeric sensor threshold crossings, discrete device events, time/solar/prayer milestones, recurring intervals (every $N$ minutes), presence transitions (first arrives, last leaves), mode transitions, overlay start/stop, hub reboot/start, one-time scheduled run.
- **Conditions (ONLY IF):** Device states, sensor values, time windows (supporting overnight ranges crossing midnight), day-of-week filters, household presence ("who's home"), active mode, active overlays, room activity detection, boolean logical operators (`ALL`, `ANY`, `NOT` nested).
- **Actions (THEN):** Set device states, execution delays, `wait-until` conditions with timeouts, push notifications, start/stop overlays, conditional branching (`if/else`), repeat loops, invoke another automation, broadcast voice/audio announcements, smooth value ramping over time, delegate a task to Sage AI, stop automation.
- **Execution Controls:**
  - Run modes: `single`, `restart`, `queued`, `parallel`.
  - Loop Protection: Automated cutoff if triggered >30 times/minute.
  - Execution History: Step-by-step logs retained for the last 30 runs.

---

## 3. Sage Assistant ("Ask Kova")

Sage is the intelligent conversational assistant embedded directly into Kova.

### Hybrid Inference Architecture
- **Built-in Deterministic Parser:** Zero cost, instantaneous local regex/intent matching for routine commands.
- **Learned Phrases Engine:** Replays previously validated AI responses locally without contacting cloud APIs.
- **Configurable LLM Backends:**
  - Anthropic Claude (native prompt caching support).
  - MiniMax.
  - OpenAI & OpenAI-compatible servers (vLLM, Ollama, LocalAI, LM Studio).
  - Fully local on-premise models.
- **Intelligent Two-Tier Model Routing:**
  - Everyday tier: Lightweight, fast model (e.g., `claude-haiku-5-5`).
  - Complex tier: Frontier reasoning model (e.g., `claude-sonnet-5-5`).
  - Tier selection managed via local heuristics or **Jev** (ClickBIT's proprietary model router).
  - Maximum 12 roundtrips per single request.

### Cost & Safety Guardrails
- **Granular Metering:** Tracked in the `sage_usage` table. Default monthly household budget of **$8.00 USD**.
- **Automated Throttling:** Background proactive tasks halt when 60% of the daily budget is consumed; the owner receives an alert at 80%.
- **Hub-Enforced Behavioral Invariants (Bypassing LLM Hallucinations):**
  - **Scope Limitation:** Edits strictly what was requested; unsolicited configuration rewrites are rejected by the hub.
  - **Incremental Edits:** Detail modifications rather than destructively recreating rules/automations.
  - **Verifiable Grounding:** The assistant cannot claim a device state changed without a successful tool return code.
  - **Negative Command Safety:** A user's "no" or cancellation changes nothing.
  - **Failure Transparency:** Hub failures and execution errors are explicitly communicated.
  - **Permission Enforcement:** Strict role-based execution (e.g., children cannot control restricted rooms).
  - **Single Undo Guarantee:** Every conversational request offers an immediate single-tap undo.
  - **High-Risk Confirmations:** Deletes, access alterations, network messaging, or actions exceeding autonomy thresholds require explicit user confirmation.

### Tool Integrations & Proactivity
- **Hub Tools:** Device control, overlay management, automation generation/debugging, device telemetry explanation, schedule inspection, audit action history, memory management (`remember`/`forget`), room setup, device grouping/splitting.
- **Cross-App Peer Tools:** Inter-app communication with ClickBIT ecosystem apps (`warden_status`, `helix_players`, `ask_sage`).
- **Proactive Features:** Background watchers, decision cards, capability discovery prompts, shared household memory, isolated 8-hour conversational memory per person, `{kind: 'sage'}` automation steps, hands-free voice input via phone mic, Siri Shortcuts, and Helix media box wake phrases.
- **MCP Server:** Native Model Context Protocol endpoint for external agentic integrations.

---

## 4. Presence Detection & Sensor Fusion

Kova tracks individual presence ("Who's Home") using an intelligent multi-source consensus engine:

### Signal Inputs per Member
1. **OPNsense Router:** ARP and NDP table sweeps executed every 30 seconds.
2. **Warden Router:** ClickBIT router OS integration tracking device tables and assigned individuals.
3. **Network Ping:** High-frequency TCP probe on port 62078 (tailored for iOS deep sleep states).
4. **Phone Automations:** Webhook POST endpoints triggered by iOS Shortcuts / Android Tasker with personal cryptographic keys.
5. **Native App Geofencing:** Background location monitoring maintaining a 150-meter perimeter around home coordinates.

### Consensus & Conflict Resolution
- **Immediate Arrival:** An arrival event from any trusted source updates state to "Home" with zero debounce delay.
- **Departure Priority:** A direct phone-reported departure overrides stale router ARP entries for 15 minutes.
- **Departure Debounce:** A default 10-minute absence grace period prevents false departures due to transient Wi-Fi drops.

---

## 5. Notifications & Actionable Insights

### Channels
- **Web Push:** Browser Service Worker with VAPID authentication.
- **Expo Push:** Native iOS APNs and Android FCM delivery.
- **ntfy:** Zero-configuration local HTTP push server integration.

### Core Notification Rules
- Doorbell ring events (with snapshot attached).
- *"Everyone's out with lights on"* alert featuring an inline one-tap **"Turn them off"** action button.
- Device offline alerts (triggered after 10 minutes of silence).
- Peer link offline/restored alerts (5-minute threshold).
- Warden network events (WAN failover, WAN down, unknown device discovered, security threat blocked).

### Granular Delivery Controls
- Configurable per-person and per-household frequencies: *Every time, At most once per hour, Every 6 hours, Once daily, Never*.
- Scheduled **Quiet Hours** suppression.
- Snoozable proactive insights: HVAC filter life warnings, poor indoor air quality, temperature extremes, doors left ajar >$N$ minutes, low device batteries, internet outages, inverter power anomalies, integration communication failures, daily weather warnings (heat, freeze, rain, UV index).

---

## 6. Security Devices & Asymmetric Safety Policy

Locks, motorized garage doors, and security partitions are protected by strict hub-level invariants:

- **Asymmetric Execution:**
  - **Securing Actions (Lock / Close / Arm):** Permitted to run autonomously without friction from automations, voice, or apps.
  - **Easing Actions (Unlock / Open / Disarm):** **STRICTLY REQUIRE** a one-tap cryptographic grant via **SecureAsk cards** (valid for 10 minutes, held exclusively in transient RAM, never persisted to disk). Enforced directly at `Registry.command`—bypassing any attempt by Sage AI, automations, voice assistants, or undo operations.
- **Biometric App Protection:** The native mobile app gates easing actions behind Face ID / Touch ID / Biometric prompt.
- **Read-Back Verification:** Following a command, the hub waits 20–30 seconds to confirm mechanical completion. Obstructions, jammed latches, or sensor tamper flags are reported as high-priority security alerts.
- **Voice Bridge Isolation:** Unlocking and disarming capabilities are completely omitted from Apple Home, Google Assistant, and Alexa bridges.

---

## 7. Rooms, Climate & Smart Zoning

### Spatial Hierarchy
- Configurable room names, custom iconography, and visual ordering.
- Multi-room logical groupings (e.g., *"Upstairs"*, *"Basement"*, *"Guest Suite"*).

### Ducted AC & Damper Zoning
- Physical ducted damper actuators (open/close and percentage modulation) mapped directly to rooms.
- **Virtual Thermostat Bridges:** Each room is exposed to Apple Home, Google Home, and Alexa as an independent Thermostat / `HeaterCooler`.
- **Intelligent Dispatcher:** When a user requests *"Turn on the AC in the Bedroom"*:
  1. Opens the dedicated zone damper.
  2. Analyzes current room temperature, seasonal defaults, and outdoor forecast to select Heating or Cooling mode.
  3. Modulates toward configurable comfort baselines (Default: **Cool 24°C / Heat 21°C**).
  4. Conflict Prevention: Arbitrates damper demands so one room cannot flip the central compressor from cooling to heating while other zones are actively chilling.
  5. Harmonizes external manual overrides from physical thermostat interfaces.

---

## 8. Multi-Room Media, Helix Integration & Audio

### Supported Hardware
- **Google Cast:** v2 protocol, native hardware Cast groups, low-latency synchronization.
- **Sonos:** UPnP integration, dynamic master/slave group topology.
- **AirPlay:** Output via embedded OwnTone integration.
- **Samsung Soundbars:** Direct integration via SmartThings API.

### Kova Cross-Brand Speaker Groups
- Enables mixed-brand grouping across Cast, Sonos, AirPlay, and Soundbars.
- Synchronized playback pipeline:
  - Partitions target groups into native synced clusters (e.g., native Cast group + Sonos stereo pair).
  - Computes shared playback start moments with learned hardware spin-up delays.
  - Active drift correction: Minor drift adjustments (120 ms) scheduled at song boundaries; major corrections (400 ms) applied immediately.
  - Per-speaker manual millisecond offsets ($-1000\text{ ms}$ to $+1000\text{ ms}$ in 10 ms increments).
  - Individual balance controls, integrated click-track sync calibration test, and drift diagnostic logging.

### Helix Music Ecosystem
- Seamless connection to ClickBIT's **Helix Media Server**:
  - Commands: *Shuffle All, Loved Tracks, Playlists, Artist/Album/Track search, "Station: <Name>"*.
  - Native queue management: Streams 20 tracks at a time to Cast, 50 tracks to Sonos and OwnTone.
  - Signed streaming URLs supporting lossless FLAC and compressed AAC playback.
  - Bi-directional sync: Playback count increments reported back to Helix; live metadata and album art cached.

### Smart Intercom & Announcements
- Broadcast audio clips, live mic recordings, Islamic Adhan, or audio streams to targeted speakers at preset volumes.
- **Snapshot & Exact Resume:** Pauses current audio, plays announcement, and restores original playback state:
  - Google Cast: Restores exact track index and elapsed playback second.
  - Sonos: Restores complete transport state and play queue.
- Loudness Calibration: Global and per-speaker volume boost (`announceTrim`) and minimum floor enforcement (`announceMin`).
- Optional suppression when specific overlays (e.g., *Movie, Sleep*) are active.

### Television & Video Display
- **Samsung Tizen TV:** Power on via Wake-on-LAN (WoL), volume control, HDMI input selection.
- **Helix Media Boxes:** Sleep/wake, play/pause active titles.
- **Doorbell Pause Automation:** Auto-pauses active TVs and displays when the front doorbell rings.

---

## 9. Cameras & Visual Monitoring

- **Google Nest Integration:** SDM API over GCP Cloud Pub/Sub delivering sub-second event feeds.
- **Live Video:** Low-latency WebRTC streaming for Nest and RTSP-compatible hardware.
- **Snapshot Pipeline:** Caches latest event frame (`CameraEventImage`) for instant notifications.
- **Event Classification:** Person, general motion, sound, doorbell chime, and package delivery events.
- **Automated Tie-ins:** Feeds *Light the way* path illumination and dynamic security alerts.
- **Privacy & Alert Controls:** Granular alert preferences per room (*Always, Away Only, Never*), quiet hour schedules, camera wall grid, and daily event rollups.

---

## 10. Robot Vacuums (Ecovacs DEEBOT)

- **Comprehensive Control:** Start, pause, resume, dock, mode selection, and battery telemetry.
- **Interactive Spatial Mapping:** Synchronizes floor maps; links named cleaning zones to Kova rooms (e.g., *"Vacuum the kitchen"*).
- **Cleaning Modes:** *Vacuum only, Mop only, Vacuum & Mop, Mop after Vacuuming*; adjustable suction levels.
- **Base Station Management:** Trigger dustbin emptying, mop pad washing, hot-air drying cycles, and drying timer management.
- **Consumable & Fleet Telemetry:** Historical area/time statistics and maintenance countdowns for brushes, filters, and sensor lenses.

---

## 11. Energy Management & Environmental Telemetry

### Energy Monitoring
- **GoodWe Solar Inverters:** Real-time Modbus telemetry over RS485/TCP.
- **Smart Plug Power Monitoring:** Live wattage and cumulative kWh metering.
- **Virtual Power Estimation:** User-customizable wattage tables for dumb or unmetered appliances.
- **Live Energy Dashboard:** Visualizes real-time power generation (solar), household consumption, and net grid import/export balances.

### Environmental Sensor Fleet
- Metrics: Temperature, relative humidity, passive infrared (PIR) occupancy, door/window reed switches, ambient illuminance (lux), particulate matter (PM2.5), and battery levels.
- Room-grouped visual telemetry with high-resolution historical time-series graphs accessible via `/api/sensors/:id/history/:field`.

---

## 12. Household Accounts, RBAC & Access Control

### Role-Based Access Control (4 Tiers)
1. **Owner:** Full system administrative rights, financial budgeting for Sage, integration setup, account lifecycle management.
2. **Adult:** Unrestricted control over all home devices, mode customization, and scheduling.
3. **Child:** Scoped strictly to permitted rooms (e.g., Bedroom, Playroom); allowed to secure/lock devices, but **strictly prevented from unlocking doors**.
4. **Guest:** Temporarily scoped to designated rooms and specific devices; supports automated time-based account expiration.

### Authentication & Pairing Workflows
- **One-Time Invite Codes:** Cryptographically random 10-letter alphanumeric codes (24-hour TTL, stored as SHA-256 hashes, rate-limited against brute-force attacks) distributed via URL link, QR code, or deep link (`kova://join`).
- **Device Authorization:** Web browsers and new native app installations require in-app approval by the hub owner.
- **Per-User Configuration:** Dedicated presence keys, push notification delivery endpoints, and isolated Sage assistant conversation contexts.
- **Biometric Security:** Native apps support Face ID / Touch ID authentication for session lock and dangerous device interactions.

---

## 13. Integrations Ecosystem

Kova provides **23 native integrations** spanning local protocols and cloud vendors, supplemented by an embedded Home Assistant bridge.

```
                                  +----------------------+
                                  |      KOVA HUB        |
                                  | (TypeScript/Node 22) |
                                  +----------+-----------+
                                             |
     +---------------------------------------+---------------------------------------+
     |                                       |                                       |
[Local Protocols]                     [Cloud Adapters]                     [HA Compatibility Engine]
- Tuya (3.3 / 3.4 / 3.5 local)        - Google Nest (SDM)                  - Managed HA (Docker/venv)
- TP-Link Tapo (KLAP)                 - Ecovacs DEEBOT                     - Bound to 127.0.0.1
- Philips Hue (CLIP v2)               - ConnectLife (Hisense)              - Native & HACS integrations
- ESPHome (Native API + Noise)        - VeSync / Levoit                    - Config flows in Kova UI
- Shelly (Gen1 HTTP, Gen2-4 RPC)      - SmartThings Cloud
- Zigbee (zigbee-herdsman)
- Z-Wave (zwave-js)
- Matter Controller (matter.js)
- Google Cast / Sonos / OwnTone
- GoodWe (Modbus) / Samsung TV
- HomeKit Controller (hap-controller)
- MQTT (HA auto-discovery)
- ClickBIT Warden & Helix
```

### 1. Local Native Integrations
- **Tuya:** High-speed local protocol execution (v3.3, v3.4, v3.5), local encryption key importer, and QR-code pairing.
- **TP-Link Tapo:** KLAP cryptographic authentication protocol.
- **Philips Hue:** Official CLIP v2 REST API with Server-Sent Events (SSE) streaming.
- **ESPHome:** Direct native API protocol over TCP with Noise encryption.
- **Shelly:** Gen 1 HTTP REST and Gen 2/3/4 WebSocket RPC APIs.
- **Zigbee:** Direct USB coordinator hardware control via `zigbee-herdsman`.
- **Z-Wave:** Direct USB controller interface using `zwave-js` with S0 and S2 security standards.
- **Matter:** Native Matter controller implementation via `matter.js`.
- **HomeKit Controller:** Pairs with Apple HomeKit-certified accessories locally via `hap-controller`.
- **GoodWe:** RS485/Modbus inverter protocol integration.
- **Samsung TV:** Tizen OS control, WoL packet broadcasting.
- **Google Cast & Sonos:** Native discovery and UPnP/Cast control.
- **AirPlay / AirCast:** Local audio streaming bridges.
- **MQTT:** Automatic device discovery conforming to Home Assistant MQTT specifications.
- **Warden & Helix:** Deep ecosystem integration with ClickBIT's router OS and media streaming server.

### 2. Cloud Integrations
- **Google Nest:** SDM API for video, snapshots, and doorbell Pub/Sub messaging.
- **Ecovacs:** Cloud API for DEEBOT robot vacuums and docking stations.
- **SmartThings:** Cloud API for Samsung soundbar controls and TV auxiliary inputs.
- **ConnectLife:** Cloud API managing Hisense smart air conditioning equipment.
- **VeSync:** Cloud API for Levoit air purifiers and humidifiers.

### 3. Home Assistant Compatibility Engine
- For niche or unsupported devices, Kova embeds a managed, sandboxed instance of Home Assistant (running in Docker or a virtual environment).
- Hardened security: Strictly bound to `127.0.0.1`, isolated from outbound exposure, resource-capped.
- Users can run standard HA config flows and install custom community integrations from GitHub (**HACS**).
- Devices connected via this engine are automatically normalized and presented in Kova as native devices.

### Integration Configuration
- Managed entirely in-app via catalog-driven forms.
- Sensitive credentials automatically redacted (`••••`).
- Built-in connection testing diagnostics and per-adapter reload options.

---

## 14. Bridges (Exposing Kova to External Ecosystems)

Kova allows its managed home state to be exported outwards to legacy voice assistants and controllers:

1. **Apple Home Bridge (`hap-nodejs`):** Exposes lights, dimmers, switches, plugs, purifiers, TVs, and overlays-as-switches to the Apple Home app. Provides HomeKit pairing codes and QR rendering.
2. **Matter Bridge (`matter.js`):** Publishes devices to Google Home, Amazon Alexa, Samsung SmartThings, and Apple Home as a native Matter bridge. Includes per-room AC thermostats.
3. **AirCast Supervised Bridge:** Runs an integrated `AirConnect` child process, allowing Google Cast speakers to appear as native AirPlay audio endpoints across iOS and macOS.

---

## 15. Setup, Migration & System Maintenance

- **Home Assistant Importer:** Upload an existing Home Assistant backup archive (including encrypted `SecureTar` bundles) or directory. Kova extracts and maps rooms, people, coordinates, LocalTuya keys, Tapo tokens, Shelly devices, Cast targets, Samsung TVs, and Nest IDs. Existing HA automations are translated into plain-English summaries and converted into native Kova automations.
- **Geocoding & Sun Times:** Location resolution via OpenStreetMap Nominatim or Google Maps URLs. Powers solar calculations, Met.no weather forecasts, and prayer time ephemeris.
- **Islamic Prayer Times (Opt-in):** Full calculation suite for 6 Waqts, configurable calculation authorities, custom angle/minute offsets, dashboard Waqt widget, and licensed Adhan recordings (Wikimedia).
- **Floor Plan Engine:** In-app architectural drawing canvas (draw walls, upload blueprints, position devices, align robot vacuum coordinate planes).
- **Automated Backup System:** Configurable nightly backups packaging SQLite databases, `integrations.json`, cryptographic pairings, and identity keys into a portable `.tar.gz` archive with one-click restore.
- **DockBit Release Client:** Integrated updater supporting rolling system updates with automatic watchdog rollback in the event of boot failure.
- **Local Mobile OTA Server:** The hub directly hosts and serves `expo-updates` bundles, updating native mobile apps locally without waiting for App Store/Play Store review cycles.
- **Developer & Virtual Demo Mode:** Toggleable advanced developer menus, raw diagnostic logs, and a built-in virtual sandbox (`KOVA_DEMO=1`) launching 28 simulated smart devices.

---

## 16. Client Applications Overview

### 1. Web Application (`web/index.html` & `phone.html`)
- **Primary Views:** Now, Modes, Automations (with drag-and-drop editor), Devices (list and interactive floor plan view, room categorization, Hidden/Archived device filters), Sensors, Energy, Security, Media, Activity (with actionable inbox items), Sage Chat, Integrations, HA Importer, Settings (Home, User, People, Notifications, Voice/Bridges, System, About), Developer Tools.
- Responsive mobile web interface (`phone.html`) and Progressive Web App (PWA) offline Service Worker.

### 2. Native Mobile Application (iOS & Android — React Native / Expo)
- **Navigation Tabs:** Now, Devices, Ask (Sage), Security, More.
- **Dedicated Management Screens:** Mode & Rhythm Editors, Automation Studio & Run Logs, Activity Audit, Sensor History Graphs, Energy Telemetry, Multi-room Media & Sync Calibrator, Security Center & WebRTC Live Feeds, Customization, Household RBAC, Integrations Catalog, Device Pairing Wizards, Hardware & Presence Settings, Notification Routing, Prayer Times, Voice Bridges, Speaker Latency Calibrator, Loudness Balancer, Geofence Radius Map, Floor Plan Viewer, Active Browser Session Manager, Software Licensing.
- **iOS Platform Features:**
  - Home Screen & Lock Screen interactive widgets.
  - Live Activity & Dynamic Island support (featuring an active "Skip" button for upcoming mode transitions).
  - Siri Shortcuts integration (*"Ask Kova"*, *"Switch the home"*, *"Turn off the lights"*).
  - 3D Touch / Haptic Quick Actions on app icon.
  - Biometric protection (Face ID / Touch ID).
  - High-precision 150m background geofencing.
  - Native APNs push notifications via Expo.
- **Android Platform Features:**
  - Dynamic Home Screen widgets.
  - Quick Settings quick-action tiles.
  - Android BiometricPrompt authentication.
  - Background ping service & geofencing.

---

## 17. Complete User Capability Catalog

| Domain | What a User Can Do |
| :--- | :--- |
| **Everyday Control** | • Turn any device on/off, dim lighting, tune white temperature, adjust full RGB color.<br>• Adjust fan speeds, change purifier modes.<br>• Modulate ducted AC zone dampers (open/close and percentage).<br>• Lock/unlock doors (unlocking requires one-tap grant), open/close garage doors, arm/disarm alarms.<br>• Play, pause, skip, scrub, and shuffle media playback.<br>• Control speaker volume, mute state, night mode, and audio inputs.<br>• Direct robot vacuums to clean specific rooms or return to dock; adjust suction; trigger base station dustbin emptying, mop washing, and drying.<br>• Pause/resume Samsung TVs and Helix streaming boxes.<br>• Toggle internet access per individual device.<br>• One-tap "All Off" button per room. |
| **Sage AI & Voice** | • Converse with Sage via text or speech input (multi-language voice transcription).<br>• Request complex home state changes, schedule timed tasks, control media.<br>• Ask diagnostic questions: *"Why is the kitchen light on?"*, *"Who is home?"*, *"What's playing?"*<br>• Confirm held actions and manage long-term household memory.<br>• Control devices via Siri Shortcuts, Google Assistant, Alexa, or Apple Home bridges. |
| **Time & Behavior** | • Inspect the interactive 24-hour day timeline; preview device states at any hour.<br>• Skip upcoming planned mode changes tonight with a single tap.<br>• Switch home into Overlays (*Movie, Away, Party*) and inspect what triggers their completion.<br>• Configure Modes, Moments, and Overlays.<br>• Build, test, duplicate, and monitor Automations with full conditions and run history logs.<br>• Act on system findings (e.g., lights left on overnight, mode active with empty house).<br>• Adopt learned behavioral habits discovered by the hub. |
| **Audio & Intercom** | • Stream music from Helix or web sources to any single speaker or multi-room group.<br>• Create and tune cross-brand speaker groups; run click-track latency calibration tests.<br>• Broadcast spoken announcements, audio files, or Adhan recordings at calibrated minimum volumes.<br>• Auto-pause active TVs and speakers during doorbell ring events. |
| **Security & Presence** | • Monitor live WebRTC camera feeds and historical event snapshots in a grid.<br>• Configure per-room camera alert preferences (*Always, Away Only, Never*) and quiet hours.<br>• Authenticate unlocking or disarming requests via Face ID / Touch ID.<br>• View live household presence status (*Who's home*) across router, phone, and geofence trackers. |
| **Household & Access** | • Issue one-time 24-hour invite codes via links or QR codes.<br>• Assign roles (*Owner, Adult, Child, Guest*) and restrict room/device permissions.<br>• Audit active sessions, revoke credentials, and force device sign-outs.<br>• Protect mobile app sessions with biometrics. |
| **Energy & Sensors** | • Monitor live solar production, grid import/export, and household consumption.<br>• View live wattages per appliance and define virtual wattage values for unmetered devices.<br>• Inspect environmental sensor history graphs (temperature, humidity, air quality). |
| **Administration** | • Import Home Assistant backups and convert automations.<br>• Add, configure, test, and remove native and cloud integrations.<br>• Install and manage the embedded Home Assistant compatibility engine and HACS repositories.<br>• Customize home coordinates, floor plans, room layouts, and device combinations.<br>• Manage backup archives, perform system updates with rollback, and toggle demo mode. |
