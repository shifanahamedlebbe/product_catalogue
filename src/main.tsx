import React from 'react';
import ReactDOM from 'react-dom/client';
import Providers from './app/providers';
import App from './app/App';
import './index.css';

// Connecting MSW for API mocking only in development mode
if (import.meta.env.MODE === 'development') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start();
  });
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
