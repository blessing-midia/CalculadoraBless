import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import PriceCalculatorPage from './features/pricing-calculator/pages/PriceCalculatorPage';
import { LandingPage } from './landing/LandingPage';
import { CalculatorLoading } from './components/CalculatorLoading';

type Route = 'landing' | 'loading' | 'calculator';
const CALCULATOR_PATH = '/calculadora';

const readRoute = (): Route => (window.location.pathname.startsWith(CALCULATOR_PATH) ? 'loading' : 'landing');

export default function App() {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onPop = () => setRoute(readRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.title = route === 'calculator' ? 'Calculadora · Blessing' : route === 'loading' ? 'Preparando calculadora · Blessing' : 'Calculadora de Preços · Blessing';
  }, [route]);

  const openCalculator = () => {
    if (!window.location.pathname.startsWith(CALCULATOR_PATH)) {
      window.history.pushState(null, '', CALCULATOR_PATH);
    }
    window.scrollTo(0, 0);
    setRoute('calculator');
  };

  const openHome = () => {
    window.history.pushState(null, '', '/');
    window.scrollTo(0, 0);
    setRoute('landing');
  };

  const startCalculator = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      openCalculator();
      return;
    }
    window.scrollTo(0, 0);
    setRoute('loading');
  };

  if (route === 'landing') return <LandingPage onEnter={startCalculator} />;
  if (route === 'loading') return <CalculatorLoading onComplete={openCalculator} />;
  return <CalculatorScreen onHome={openHome} />;
}

/** Entrada da calculadora: a barra da marca desce e os cards sobem em sequência. */
function CalculatorScreen({ onHome }: { onHome: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        element.querySelector('.calc-brandbar'),
        { y: -24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity,visibility' },
      );
      gsap.fromTo(
        element.querySelectorAll('.cw-card'),
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.09, ease: 'power3.out', clearProps: 'transform,opacity,visibility' },
      );
    }, element);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="calc-screen">
      <PriceCalculatorPage onHome={onHome} />
    </div>
  );
}
