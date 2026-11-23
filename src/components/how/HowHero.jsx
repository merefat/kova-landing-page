import { ArrowRight, CircleDot } from 'lucide-react';
import { HOW } from '../../data/howImages';

export default function HowHero() {
  return (
    <section className="hiw-hero" aria-label="How Kova Works">
      <img
        src={HOW.heroRoom.src}
        alt=""
        className="hiw-bg hero-img-pos"
        width={HOW.heroRoom.w}
        height={HOW.heroRoom.h}
        fetchPriority="high"
      />
      <div className="container hiw-hero-inner">
        {/* Left: headline block over the darkened part of the photograph */}
        <div className="hiw-hero-copy">
          <span className="hiw-pill">
            <CircleDot size={11} aria-hidden="true" /> How Kova Works
          </span>
          <h1 className="hiw-hero-title">
            How <span className="hiw-gold">Kova</span> Works
          </h1>
          <p className="hiw-hero-desc">
            From setup to smart living — see how Kova brings your home
            together, effortlessly.
          </p>
          <a href="#journey" className="gold-button hiw-hero-cta">
            Start Your Journey <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
