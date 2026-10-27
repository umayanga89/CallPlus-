import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Render React App
createRoot(document.getElementById('root')!).render(<App />);

// Ensure all service workers are deactivated and old caches cleared
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('[CallPulse] Unregistered service worker to keep app online.');
        }
      });
    }
  });
}

if ('caches' in window) {
  caches.keys().then((keys) => {
    for (const key of keys) {
      caches.delete(key);
    }
  });
}
