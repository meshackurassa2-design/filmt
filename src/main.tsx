import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Universal Error Trap for Mobile Debugging
window.onerror = function(message, source, lineno, _colno, _error) {
  const errDiv = document.createElement('div');
  errDiv.style.position = 'fixed';
  errDiv.style.top = '0';
  errDiv.style.left = '0';
  errDiv.style.width = '100%';
  errDiv.style.background = 'red';
  errDiv.style.color = 'white';
  errDiv.style.zIndex = '10000';
  errDiv.style.padding = '20px';
  errDiv.style.fontSize = '12px';
  errDiv.textContent = 'ERROR: ' + message + ' AT ' + source + ':' + lineno;
  document.body.appendChild(errDiv);
  return false;
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <App />
);
