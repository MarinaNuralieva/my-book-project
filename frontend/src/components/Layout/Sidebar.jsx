import { Link } from 'react-router-dom';

export default function Sidebar() {
  const genres = [
    'detective', 'childrenbooks', 'classicalbooks',
    'foreignbooks', 'kyrgyzbooks', 'comics',
    'youngadult', 'psychology', 'contemporarybooks',
    'languagebooks', 'fantasy'
  ];

  const displayNames = {
    detective: 'Детектив',
    childrenbooks: 'Детские книги',
    classicalbooks: 'Классика',
    foreignbooks: 'Книги на других языках',
    kyrgyzbooks: 'Книги на кыргызском',
    comics: 'Комиксы',
    youngadult: 'Молодежные книги',
    psychology: 'Психология',
    contemporarybooks: 'Современные книги',
    languagebooks: 'Языковые книги',
    fantasy: 'Фэнтези'
  };

  return (
    <aside style={{
      width: '220px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
      fontSize: '17px',
      lineHeight: '1.5'
    }}>
      <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '14px' }}>Категории:</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {genres.map((genre) => (
          <li key={genre} style={{
            marginBottom: '8px',
            borderRadius: '5px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e0e0e0'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Link 
              to={`/books/${genre}`} 
              style={{ textDecoration: 'none', color: '#000', padding: '4px 8px', display: 'block' }}
            >
              {displayNames[genre]}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

