import { useAuth } from '../contextAPI/AuthProvider';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/images/Spotify_logo.svg';
import home from '../assets/images/home.svg';
import category from '../assets/images/category.svg';
import newMusic from '../assets/images/new.svg';
import musicVideo from '../assets/images/video.svg';
import playlist from '../assets/images/playlist.svg';
import history from '../assets/images/history.svg';
import like from '../assets/images/like.svg';
import no_img from '../assets/images/no_img_2.svg';

const main_menu = [
  { name: 'main', text: '홈', icon: home },
  // { name: 'category', text: '카테고리', icon: category },
  { name: 'new', text: '신곡', icon: newMusic },
  // { name: 'video', text: '뮤직비디오', icon: musicVideo },
  { name: 'playlist', text: '플레이리스트', icon: playlist },
  { name: 'history', text: '이전기록', icon: history },
  { name: 'like', text: '좋아요', icon: like },
];
const play_menu = [

];
const profile = { text: '프로필', thumb: '' };



const Categories = () => {
  const { tokenData } = useAuth();
  return (
    <div id='sideMenu'>
      <div className="logo">
        <NavLink
          to="/"
          state={tokenData}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <img src={logo} className="logo" alt="Spotify Logo" />
        </NavLink>
      </div>
      <div className='menu-wrap'>
        <div className='menu'>
          <ul>
            {main_menu.map((c) => (
              <li key={c.name}>
                <NavLink
                  to={`/${c.name}`}
                  state={tokenData}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <div className="icon">
                    <img src={c.icon} alt={`${c.text} icon`} />
                  </div>
                  <div className="txt">{c.text}</div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className='menu'>
          <ul>
            {play_menu.map((c) => (
              <li key={c.name}>
                <NavLink
                  to={`/${c.name}`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <div className="icon">
                    <img src={c.icon} alt={`${c.text} icon`} />
                  </div>
                  <div className="txt">{c.text}</div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='menu profile'>
        <ul>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <div className="icon"><img src={profile.thumb ? like : no_img} /></div>
              <div className="txt">{profile.text}</div>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Categories;
