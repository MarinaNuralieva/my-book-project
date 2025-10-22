import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function GenrePage() {
  const { genre } = useParams(); // берём жанр из URL
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 2; // количество книг на странице

  useEffect(() => {
    fetch(`http://localhost:5000/api/${genre}?limit=${limit}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        // сервер может возвращать { detective: [...], total: N }
        setBooks(data[genre] || []);
        setTotalPages(Math.ceil((data.total || 0) / limit));
      })
      .catch(err => console.error(err));
  }, [genre, page]);

  const styles = {
    genrePage: { padding: "20px" },
    booksList: { display: "flex", flexDirection: "column", gap: "15px" },
    bookItem: {
      display: "flex",
      border: "1px solid #ddd",
      borderRadius: "8px",
      overflow: "hidden",
      padding: "10px",
      backgroundColor: "#fafafa",
      transition: "transform 0.2s, boxShadow 0.2s",
      cursor: "pointer"
    },
    bookItemHover: { transform: "translateY(-3px)", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
    bookCover: { width: "120px", height: "180px", objectFit: "cover", marginRight: "15px", borderRadius: "5px" },
    bookInfo: { display: "flex", flexDirection: "column", justifyContent: "space-between" },
    pagination: { marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }
  };

  return (
    <div style={styles.genrePage}>
      <h1>{genre.toUpperCase()}</h1>

      <div style={styles.booksList}>
        {books.length > 0 ? (
          books.map(book => (
            <div
              key={book.id}
              style={styles.bookItem}
              onMouseEnter={e => Object.assign(e.currentTarget.style, styles.bookItemHover)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: "none", boxShadow: "none" })}
            >
              <img
                style={styles.bookCover}
                src={`/images/priliv.jpg`} // тестовая картинка
                alt={book.title}
                loading="lazy"
              />
              <div style={styles.bookInfo}>
                <p><strong>Автор:</strong> {book.author}</p>
                <p><strong>Название:</strong> {book.title}</p>
                <p><strong>Переплёт:</strong> {book.binding}</p>
                <p><strong>Цена:</strong> {book.price}₽</p>
                <p><strong>В наличии:</strong> {book.in_stock ? "Да" : "Нет"}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Книги не найдены</p>
        )}
      </div>

      <div style={styles.pagination}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Предыдущая</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Следующая</button>
      </div>
    </div>
  );
}
