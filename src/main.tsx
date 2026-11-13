import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PriceCalculatorPage from './features/pricing-calculator/pages/PriceCalculatorPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PriceCalculatorPage />
  </StrictMode>,
);
