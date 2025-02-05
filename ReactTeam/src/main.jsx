import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contextAPI/AuthProvider';
import { PlaybackProvider } from './contextAPI/PlaybackProvider';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <PlaybackProvider>
        <App />
      </PlaybackProvider>
    </AuthProvider>
  </BrowserRouter>,
);
