import HowHero from '../components/how/HowHero';
import JourneyTimeline from '../components/how/JourneyTimeline';
import ModesDemo from '../components/how/ModesDemo';
import AutomationDemo from '../components/how/AutomationDemo';
import SageDemo from '../components/how/SageDemo';
import IntegrationEcosystem from '../components/how/IntegrationEcosystem';
import LocalFirst from '../components/how/LocalFirst';
import HowFinalCTA from '../components/how/HowFinalCTA';

// /how-it-works — a guided visual tour: cinematic hero, 5-step journey,
// modes & overlays demo, automation builder, Sage conversation,
// integration ecosystem, local-first architecture and the closing CTA.
export default function HowItWorksPage({ onStart, onNavigate }) {
  return (
    <>
      <HowHero />
      <JourneyTimeline />
      <ModesDemo onNavigate={onNavigate} />
      <AutomationDemo onNavigate={onNavigate} />
      <SageDemo onNavigate={onNavigate} />
      <IntegrationEcosystem onNavigate={onNavigate} />
      <LocalFirst onNavigate={onNavigate} />
      <HowFinalCTA onStart={onStart} />
    </>
  );
}
