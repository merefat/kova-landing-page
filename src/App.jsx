import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/home/HeroSection';
import Problem from './components/home/Problem';
import HowWorks from './components/home/HowWorks';
import DailyRhythm from './components/home/DailyRhythm';
import Connectivity from './components/home/Connectivity';
import Family from './components/home/Family';
import Automations from './components/home/Automations';
import Sage from './components/home/Sage';
import LocalFirst from './components/home/LocalFirst';
import Scenarios from './components/home/Scenarios';
import Why from './components/home/Why';
import CtaSection from './components/home/CtaSection';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import IntegrationsPage from './pages/IntegrationsPage';
import GetStartedModal from './components/GetStartedModal';
import HowItWorksModal from './components/HowItWorksModal';

const ROUTES = {
  '/features': 'features',
  '/how-it-works': 'how',
  '/integrations': 'integrations',
};

const routeOf = (pathname = window.location.pathname) =>
  ROUTES[Object.keys(ROUTES).find((p) => pathname.startsWith(p))] || 'home';

export default function App() {
  const [modal, setModal] = useState(null); // 'start' | 'how'
  const [path, setPath] = useState(() => window.location.pathname);
  const route = routeOf(path);
  // '/integrations/<id>' → a per-integration guide page.
  const guideId =
    route === 'integrations' && path.startsWith('/integrations/')
      ? path.slice('/integrations/'.length).replace(/\/+$/, '') || null
      : null;

  const openStart = () => setModal('start');
  const openHow = () => setModal('how');
  const close = () => setModal(null);

  // Tiny path router — '/' is home, '/features' is the features page.
  // Optional '#anchor' scrolls to a section after the page renders.
  const navigate = (path) => {
    const [pathname, hash] = path.split('#');
    window.history.pushState({}, '', path);
    setPath(pathname);
    if (hash) {
      setTimeout(
        () => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }),
        80
      );
    } else {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div className={`page route-${route}`}>
      <Header
        route={route}
        onNavigate={navigate}
        onGetStarted={openStart}
        onWatch={openHow}
      />

      <main>
        {route === 'features' ? (
          <FeaturesPage onStart={openStart} onWatch={openHow} />
        ) : route === 'how' ? (
          <HowItWorksPage onStart={openStart} onNavigate={navigate} />
        ) : route === 'integrations' ? (
          <IntegrationsPage onStart={openStart} onWatch={openHow} onNavigate={navigate} guideId={guideId} />
        ) : (
          <>
            <HeroSection onStart={openStart} onWatch={openHow} />
            <Problem />
            <HowWorks onWatch={openHow} />
            <DailyRhythm />
            <Connectivity />
            <Family />
            <Automations />
            <Sage onNavigate={navigate} />
            <LocalFirst />
            <Scenarios />
            <Why />
            <CtaSection onStart={openStart} />
          </>
        )}
      </main>

      <Footer
        onNavigate={navigate}
        onGetStarted={openStart}
        onWatch={openHow}
      />

      <GetStartedModal open={modal === 'start'} onClose={close} />
      <HowItWorksModal open={modal === 'how'} onClose={close} onNavigate={navigate} />
    </div>
  );
}
