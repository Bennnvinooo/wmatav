
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to check if the device is an iOS device
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent);

// Handle iOS specific touch issues
document.addEventListener('touchstart', function(e) {
  // Allow touches on input fields
  if (e.target && (e.target as HTMLElement).tagName !== 'INPUT' && 
      (e.target as HTMLElement).tagName !== 'TEXTAREA' &&
      (e.target as HTMLElement).tagName !== 'BUTTON' &&
      (e.target as HTMLElement).tagName !== 'SELECT') {
    
    // Prevent the default action for non-input elements on iOS
    if (isIOS()) {
      e.preventDefault();
    }
  }
}, { passive: false });

// PWA display notification if not installed and is mobile
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  // Store the event so it can be triggered later
  deferredPrompt = e;
  
  // Show the install button or notification as needed
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    console.log('PWA installation available');
    // Show prompt after 3 seconds for mobile users
    setTimeout(() => {
      if (deferredPrompt) {
        // This is the important part - actually show the prompt
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: {outcome: string}) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      }
    }, 3000);
  }
});

// Handle iOS standalone mode detection
const isInStandaloneMode = () => 
  ('standalone' in window.navigator) && 
  ((window.navigator as any).standalone);

// Show a message if in standalone mode on iOS
if (isIOS() && isInStandaloneMode()) {
  console.log('Running in iOS standalone mode (added to home screen)');
}

// Handle PWA installation success
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  deferredPrompt = null;
});

createRoot(document.getElementById("root")!).render(<App />);
