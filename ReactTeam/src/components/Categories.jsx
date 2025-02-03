import { Link } from 'react-router-dom';

const categories = [
  { name: 'main', text: '메인' },
  { name: 'profile', text: '프로필' },
  { name: 'playlist', text: '플레이리스트' },
  { name: 'ex1', text: '더미' },
  { name: 'ex2', text: '더미' },
  { name: 'ex3', text: '더미' },
  { name: 'ex4', text: '더미' },
  { name: 'ex5', text: '더미' },
  { name: 'ex6', text: '더미' },
];

const Categories = ({ data }) => {
  return (
    <div>
      {categories.map((c) => (
        <Link key={c.name} to={`/${c.name}`} state={{ data }}>
          {c.text}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
