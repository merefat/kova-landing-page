import { useCallback, useEffect, useState } from 'react';
import IntegrationsHero from '../components/integrations/IntegrationsHero';
import ConnectionsPanel from '../components/integrations/ConnectionsPanel';
import CloudServicesPanel from '../components/integrations/CloudServicesPanel';
import ServicesPanel from '../components/integrations/ServicesPanel';
import BottomCTA from '../components/integrations/BottomCTA';
import GuideDrawer from '../components/integrations/GuideDrawer';
import IntegrationGuidePage from './IntegrationGuidePage';

// /integrations — Network & Integrations.
// The whole page lives inside .ni so the global "main > section" margin
// rule never reaches the sections; styles are namespaced ni-*.
// /integrations/<id> renders the full-page guide instead of the panels.
export default function IntegrationsPage({ onStart, onWatch, onNavigate, guideId }) {
  // Drawer view stack: overview lists and step guides push/pop here.
  const [stack, setStack] = useState([]);

  const openGuide = useCallback(
    (id) =>
      setStack((s) => {
        const topItem = s[s.length - 1];
        if (topItem?.kind === 'guide' && topItem.id === id) return s;
        return [...s, { kind: 'guide', id }];
      }),
    []
  );
  const openOverview = useCallback(
    (filter = 'all') => setStack((s) => [...s, { kind: 'overview', filter }]),
    []
  );
  const openDocs = useCallback(
    () => setStack((s) => [...s, { kind: 'guide', id: 'docs' }]),
    []
  );
  const close = useCallback(() => setStack([]), []);
  const back = useCallback(() => setStack((s) => s.slice(0, -1)), []);

  // "Full guide" in the drawer → close it, then navigate to the page.
  const openPage = useCallback(
    (id) => {
      close();
      onNavigate?.(`/integrations/${id}`);
    },
    [close, onNavigate]
  );

  // Landing on a guide URL with a stale stack would reopen the drawer on
  // the way back — reset it.
  useEffect(() => {
    if (guideId) setStack([]);
  }, [guideId]);

  // Close the drawer first, then open the shared modal — avoids two
  // scroll-lock owners fighting over body overflow/focus.
  const handleGetStarted = useCallback(() => {
    close();
    setTimeout(() => onStart?.(), 60);
  }, [close, onStart]);

  if (guideId) {
    return (
      <div className="ni">
        <IntegrationGuidePage id={guideId} onNavigate={onNavigate} onStart={onStart} />
      </div>
    );
  }

  return (
    <div className="ni">
      <IntegrationsHero onStart={onStart} onWatch={onWatch} onGuide={openGuide} />
      <ConnectionsPanel onGuide={openGuide} onOverview={openOverview} onDocs={openDocs} />
      <CloudServicesPanel onGuide={openGuide} onOverview={openOverview} />
      <ServicesPanel onGuide={openGuide} onOverview={openOverview} />
      <BottomCTA onStart={onStart} />
      <GuideDrawer
        stack={stack}
        onClose={close}
        onBack={back}
        onGuide={openGuide}
        onOverview={openOverview}
        onGetStarted={handleGetStarted}
        onOpenPage={openPage}
      />
    </div>
  );
}
