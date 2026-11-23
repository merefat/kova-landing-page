import { ArrowRight, ShieldCheck, Home, Cloud } from 'lucide-react';
import { HOME } from '../../data/images';
import { useInView } from '../../hooks/useInView';

const BENEFITS = [
  { icon: Home, label: 'Local-first architecture' },
  { icon: ShieldCheck, label: 'Greater control over your home' },
  { icon: Cloud, label: 'Optional cloud connectivity where required' },
];

export default function LocalFirst() {
  const [ref, inView] = useInView();

  return (
    <section id="local-first" aria-label="Local-first architecture" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card ls-card ls-local">
          <img
            src={HOME.localHub.src}
            alt={HOME.localHub.alt}
            className="local-photo"
            width={HOME.localHub.w}
            height={HOME.localHub.h}
            loading="lazy"
          />
          <div className="local-shade" aria-hidden="true" />

          <div className="ls-copy">
            <p className="card-kicker">Local-first</p>
            <h3 className="pm-title">Your home runs at home</h3>
            <p className="card-desc">
              Kova runs on a hub inside your home — not someone else&rsquo;s
              cloud.
            </p>

            <ul className="local-benefits">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={14} aria-hidden="true" /> {label}
                </li>
              ))}
            </ul>

            <a className="link-cta" href="#why">
              Learn More <ArrowRight size={13} />
            </a>
          </div>

          <p className="local-note">
            Core device control and supported local integrations keep working
            through the Kova Hub — some cloud integrations and push
            notifications use external services.
          </p>
        </article>
      </div>
    </section>
  );
}
