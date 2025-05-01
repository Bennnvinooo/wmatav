
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Prevent browsers from doing their native handling of touch events
document.addEventListener('touchstart', function(e) {
  if (e.target && (e.target as HTMLElement).tagName !== 'INPUT' && 
      (e.target as HTMLElement).tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
}, { passive: false });

// PWA display notification if not installed and is mobile
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Store the event so it can be triggered later
  (window as any).deferredPrompt = e;
});

createRoot(document.getElementById("root")!).render(<App />);
