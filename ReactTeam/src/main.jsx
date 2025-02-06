import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contextAPI/AuthProvider';
import { PlaybackProvider } from './contextAPI/PlaybackProvider';
import SearchProvider from './contextAPI/SearchProvider';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <PlaybackProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </PlaybackProvider>
    </AuthProvider>
  </BrowserRouter>,
);
