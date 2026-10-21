import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PALETTE } from './config';
import { App } from './App';
import './styles/classical.css';
import './styles/palette.css';
import './styles/app.css';

document.documentElement.dataset.palette = PALETTE;
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', PALETTE === 'marfim' ? '#f6f1e7' : '#17140f');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
