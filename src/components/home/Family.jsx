import FamilyCard from '../features/cards/FamilyCard';
import { useInView } from '../../hooks/useInView';

export default function Family() {
  const [ref, inView] = useInView();

  return (
    <section id="family" aria-label="Family and household access" ref={ref}>
      <div className={`container reveal ${inView ? 'is-visible' : ''}`}>
        <FamilyCard />
      </div>
    </section>
  );
}
