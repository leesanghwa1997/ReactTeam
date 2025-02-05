import './App.css';
import SpotifyLogin from './components/SpotifyLogin';
import { Route, Routes } from 'react-router-dom';
import Callback from './components/Callback';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/:category" element={<MainPage />} />
      <Route path="/login" element={<SpotifyLogin />} />
      <Route path="/Callback" element={<Callback />} />
    </Routes>
  );
}

export default App;
