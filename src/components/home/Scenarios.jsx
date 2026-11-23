import { useState } from 'react';
import { Sunrise, Clapperboard, MoonStar } from 'lucide-react';
import { HOME } from '../../data/images';
import { useInView } from '../../hooks/useInView';

const SCENARIOS = [
  {
    id: 'morning',
    icon: Sunrise,
    title: 'Morning Routine',
    img: HOME.morningBedroom,
    detail: 'Dawn mode fades the bedroom lights up, sets a comfortable temperature and starts the day playlist — no buttons pressed.',
  },
  {
    id: 'movie',
    icon: Clapperboard,
    title: 'Movie Night',
    img: HOME.movieRoom,
    detail: 'The Movie overlay dims the lights, pauses notifications and gets the media room ready in one tap.',
  },
  {
    id: 'bedtime',
    icon: MoonStar,
    title: 'Bedtime Mode',
    img: HOME.bedtimeBedroom,
    detail: 'Wind-down turns off the main lights, locks up and arms the alarm — and any change can be undone within 15 minutes.',
  },
];

export default function Scenarios() {
  const [ref, inView] = useInView();
  const [open, setOpen] = useState('movie');
  const current = SCENARIOS.find((s) => s.id === open);

  return (
    <section id="scenarios" aria-label="Real-life scenarios" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card ls-card ls-scen">
          <div className="rhythm-head">
            <div>
              <p className="card-kicker">Real-life scenarios</p>
              <h3 className="pm-title">A day with Kova</h3>
              <p className="card-desc">
                From morning routines to bedtime, Kova is there for every moment.
              </p>
            </div>
          </div>

          <div className="scen-grid" role="list">
            {SCENARIOS.map(({ id, icon: Icon, title, img }) => (
              <button
                key={id}
                type="button"
                role="listitem"
                className={`scen-card ${open === id ? 'active' : ''}`}
                onClick={() => setOpen(id)}
                aria-pressed={open === id}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={img.w}
                  height={img.h}
                  loading="lazy"
                />
                <span className="scen-label">
                  <Icon size={12} aria-hidden="true" /> {title}
                </span>
              </button>
            ))}
          </div>

          <p className="scen-detail" aria-live="polite">
            <current.icon size={13} aria-hidden="true" /> {current.detail}
          </p>
        </article>
      </div>
    </section>
  );
}
