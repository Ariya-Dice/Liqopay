    // File: src/main.tsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.tsx';
    import './index.css';

    // Removed:
    // import { Buffer } from 'buffer';
    // if (typeof (window as any).Buffer === 'undefined') {
    //   (window as any).Buffer = Buffer;
    // }

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    