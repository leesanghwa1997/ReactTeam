import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contextAPI/AuthProvider';
import { PlaybackProvider } from './contextAPI/PlaybackProvider';
import SearchProvider from './contextAPI/SearchProvider';
import AlbumProvider from './contextAPI/AlbumProvider';
import ArtistProvider from './contextAPI/ArtistProvider';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <PlaybackProvider>
        <SearchProvider>
          <AlbumProvider>
            <ArtistProvider>
              <App />
            </ArtistProvider>
          </AlbumProvider>
        </SearchProvider>
      </PlaybackProvider>
    </AuthProvider>
  </BrowserRouter>,
);
