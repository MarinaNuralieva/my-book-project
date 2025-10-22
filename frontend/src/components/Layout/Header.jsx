import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(""); // очищаем поле после поиска
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header style={{
      width: '100%',
      background: 'linear-gradient(to bottom, #000000 0%, #252222ff 95%, #1a1a1a 100%)',
      color: '#fff',
      padding: '3px 50px',
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
        <h1 style={{
          margin: 0,
          marginLeft:'30px',
          fontFamily: "'Great Vibes', cursive",
          fontSize: '40px',
          fontWeight: 200,
          fontStyle: 'italic',
          letterSpacing: '3px'
        }}>
          Vavilon
        </h1>
      </Link>

      {/* Поиск с кнопкой */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '250px'}}>
        <input
          type="text"
          placeholder="Искать книги..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            outline: 'none',
            width: '500px'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#fff',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Найти
        </button>
      </div>
    </header>
  );
}
