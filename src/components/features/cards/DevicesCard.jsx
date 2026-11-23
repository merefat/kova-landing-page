import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Pause, Minus, Plus } from 'lucide-react';
import FeatureCard, { CardText } from '../FeatureCard';
import SceneStage from '../SceneStage';
import { FI } from '../../../data/featureImages';

// 02 — Control Your Devices Instantly. Real range input drives the
// percentage, the sound-wave bars and the speaker ring intensity.
// Press play to hear an English nasheed — the slider/± buttons set the
// real <audio> volume.
const BARS = 9;

export default function DevicesCard() {
  const [vol, setVol] = useState(70);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.volume = vol / 100;
      a.play().catch(() => {});
    }
  };

  const set = (v) => {
    const nv = Math.max(0, Math.min(100, Math.round(v)));
    setVol(nv);
    if (audioRef.current) audioRef.current.volume = nv / 100;
  };

  useEffect(() => () => audioRef.current?.pause(), []);

  return (
    <FeatureCard id="fc-02" className={`devices-card${playing ? ' playing' : ''}`}>
      <SceneStage image={FI.speaker} veil="soft">
        <span className="speaker-ring" style={{ '--vol': vol / 100 }} aria-hidden="true" />
      </SceneStage>

      <div className="fc-inner">
        <CardText
          num="02"
          title={<>Control Your<br />Devices Instantly</>}
          desc="Adjust volume, dim lights, or control any device with ease. Press play for a nasheed."
        >
          <a
            className="outline-gold fc-cta"
            href="#fc-02"
            onClick={(e) => { e.preventDefault(); toggle(); }}
          >
            {playing ? 'Pause' : 'Try It Live'} <ArrowRight size={13} />
          </a>
        </CardText>

        <div className="fc-demo">
          <div className="vol-panel glass-panel" style={{ '--vol': vol / 100 }}>
            <div className="vol-head">
              <button
                type="button"
                className="vol-icon vol-play"
                aria-label={playing ? 'Pause nasheed' : 'Play nasheed'}
                aria-pressed={playing}
                onClick={toggle}
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <span className="vol-label">{playing ? 'Hasanat' : 'Volume'}</span>
              <span className="vol-pct">{vol}%</span>
            </div>
            <input
              className="vol-slider"
              type="range"
              min="0"
              max="100"
              value={vol}
              aria-label="Volume"
              onChange={(e) => set(e.target.value)}
            />
            <div className="vol-foot">
              <button
                type="button"
                className="vol-btn"
                aria-label="Decrease volume"
                onClick={() => set(vol - 5)}
              >
                <Minus size={15} />
              </button>
              <div className="vol-wave" aria-hidden="true">
                {Array.from({ length: BARS }, (_, i) => (
                  <span key={i} style={{ '--i': i }} />
                ))}
              </div>
              <button
                type="button"
                className="vol-btn"
                aria-label="Increase volume"
                onClick={() => set(vol + 5)}
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src="/audio/nasheed.mp3"
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </FeatureCard>
  );
}
