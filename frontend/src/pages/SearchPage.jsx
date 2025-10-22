import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 2; // лимит на странице

  useEffect(() => {
    if (!query) return;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        const data = await res.json();
        setBooks(data.books);
        setTotalPages(Math.ceil(data.total / limit));
      } catch (err) {
        console.error("Ошибка запроса поиска:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query, page]);

  const styles = {
    container: { padding: "20px" },
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
    <div style={styles.container}>
      <h1>Результаты поиска по запросу: "{query}"</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : books.length === 0 ? (
        <p>Ничего не найдено.</p>
      ) : (
        <>
          <div style={styles.booksList}>
            {books.map(book => (
              <div
                key={`${book.genre}-${book.id}`}
                style={styles.bookItem}
                onMouseEnter={e => Object.assign(e.currentTarget.style, styles.bookItemHover)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: "none", boxShadow: "none" })}
              >
                <img
                  style={styles.bookCover}
                  src={`/images/${book.title.toLowerCase().replace(/\s+/g, "_")}.jpg`}
                  alt={book.title}
                  loading="lazy"
                />
                <div style={styles.bookInfo}>
                  <p><strong>Автор:</strong> {book.author}</p>
                  <p><strong>Название:</strong> {book.title}</p>
                  <p><strong>Переплёт:</strong> {book.binding}</p>
                  <p><strong>Цена:</strong> {book.price} сом</p>
                  <p><strong>В наличии:</strong> {book.in_stock ? "Да" : "Нет"}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.pagination}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Предыдущая</button>
            <span>{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Следующая</button>
          </div>
        </>
      )}
    </div>
  );
}



