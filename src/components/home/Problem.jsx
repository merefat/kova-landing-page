import { Smartphone, Settings2, EyeOff, Lock } from 'lucide-react';
import { HOME } from '../../data/images';
import { useInView } from '../../hooks/useInView';

const PROBLEMS = [
  { icon: Smartphone, label: 'Multiple apps for different devices' },
  { icon: Settings2, label: 'Complex setup and automation' },
  { icon: EyeOff, label: 'No real awareness of your home' },
  { icon: Lock, label: 'Limited control and visibility' },
];

export default function Problem() {
  const [ref, inView] = useInView();

  return (
    <section id="problem" aria-label="The problem Kova solves" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <article className="kova-card pm-card pm-problem">
          <img
            src={HOME.problemPerson.src}
            alt={HOME.problemPerson.alt}
            className="pm-photo"
            width={HOME.problemPerson.w}
            height={HOME.problemPerson.h}
            loading="lazy"
          />
          <div className="pm-problem-body">
            <p className="card-kicker">The problem</p>
            <h3 className="pm-title">Today&rsquo;s smart homes are hard work</h3>
            <p className="card-desc">
              Four everyday frustrations that Kova is built to remove.
            </p>
            <ul className="pm-list">
              {PROBLEMS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={14} aria-hidden="true" /> {label}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
