// pages/Psychology.jsx
import { useEffect, useState } from "react";

export default function Psychology() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 2;

  useEffect(() => {
    fetch(`http://localhost:5000/api/psychology?limit=${limit}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books || []);
        setTotalPages(Math.ceil((data.total || 0) / limit));
      })
      .catch(err => console.error(err));
  }, [page]);

 const styles = {
  page: { padding: "20px" },
  booksList: { display: "flex", flexDirection: "column", gap: "15px" },
  bookItem: {
    display: "flex",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s"
  },
  bookItemHover: { transform: "translateY(-3px)", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
  bookCover: { width: "120px", height: "180px", objectFit: "cover", marginRight: "15px", borderRadius: "5px" },
  bookInfo: { display: "flex", flexDirection: "column", justifyContent: "space-between" },
  pagination: { marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }
};


  return (
       <div style={styles.page}>
      <h1>Психология</h1>

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
                src={``} // тестовая картинка
                alt={book.title}
                loading="lazy"
              />
              <div style={styles.bookInfo}>
                <p><strong>Автор:</strong> {book.author}</p>
                <p><strong>Название:</strong> {book.title}</p>
                <p><strong>Переплёт:</strong> {book.binding}</p>
                <p><strong>Цена:</strong> {book.price}сом</p>
                <p><strong></strong> {book.in_stock ? "В наличии" : "Нет в наличии"}</p>
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
