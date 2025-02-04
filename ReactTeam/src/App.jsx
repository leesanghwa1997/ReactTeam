import './App.css';
import SpotifyLogin from './components/SpotifyLogin';
import { Route, Routes } from 'react-router-dom';
import Callback from './components/Callback';
import MainPage from './pages/MainPage';
import { AuthProvider } from './contextAPI/AuthProvider.jsx';
import { PlaybackProvider } from './contextAPI/PlaybackProvider';

function App() {
  return (
    <AuthProvider>
      <PlaybackProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/:category" element={<MainPage />} />
          <Route path="/login" element={<SpotifyLogin />} />
          <Route path="/Callback" element={<Callback />} />
        </Routes>
      </PlaybackProvider>
    </AuthProvider>
  );
}

export default App;
