import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';


const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<div style="background: #0a0a0c; color: #FFB800; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;"><div><h1 style="font-size: 24px;">Critical Error</h1><p>Root element "#root" not found. Please check your index.html.</p></div></div>';
  throw new Error('Failed to find the root element');
}

// Global error handler for native debugging
window.onerror = function(message, source, lineno, colno, error) {
  console.error("BOOT_ERROR:", message, "at", source, ":", lineno);
  // We don't want to show an alert to users, but we can log for console access
  return false;
};

createRoot(rootElement).render(
  <App />
);
