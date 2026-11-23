import FeatureHero from '../components/features/FeatureHero';
import PresenceCard from '../components/features/cards/PresenceCard';
import DevicesCard from '../components/features/cards/DevicesCard';
import ModesCard from '../components/features/cards/ModesCard';
import SecurityCard from '../components/features/cards/SecurityCard';
import FamilyCard from '../components/features/cards/FamilyCard';
import ClimateCard from '../components/features/cards/ClimateCard';
import CtaBanner from '../components/features/CtaBanner';
import { useInView } from '../hooks/useInView';

// /features — hero + the six interactive feature cards + CTA banner.
export default function FeaturesPage({ onStart, onWatch }) {
  const [ref, inView] = useInView();

  return (
    <>
      <FeatureHero onWatch={onWatch} />
      <section id="features" aria-label="Kova features" ref={ref}>
        <div className={`container features-grid reveal ${inView ? 'is-visible' : ''}`}>
          <PresenceCard />
          <DevicesCard />
          <ModesCard />
          <SecurityCard />
          <FamilyCard />
          <ClimateCard />
        </div>
      </section>
      <CtaBanner onStart={onStart} />
    </>
  );
}
