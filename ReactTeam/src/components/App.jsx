import './App.css';
import SpotifyLogin from './components/SpotifyLogin';
import { Route, Routes } from 'react-router-dom';
import Callback from './components/Callback';
import MainPage from './pages/MainPage';
import Search from './components/Search';
import Playlist from './components/Playlist';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/:category" element={<MainPage />} />
      <Route path="/login" element={<SpotifyLogin />} />
      <Route path="/Callback" element={<Callback />} />
      {/* Playlist 페이지 추가: playlistId를 URL 파라미터로 받음 */}
      <Route path="/playlist/:playlistId" element={<Playlist />} />
    </Routes>
  );
}

export default App;
