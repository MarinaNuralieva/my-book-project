import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const genres = [
    "detective",
    "fantasy",
    "youngadult",
    "psychology",
    "englishbooks",
    "classicalbooks",
    "childrenbooks",
    "mangas",
    "contemporarybooks",
    "languagebooks"
  ];

  const genreLabels = {
  detective: "Детектив",
  fantasy: "Фэнтези",
  youngadult: "Молодежные книги",
  psychology: "Психология",
  englishbooks: "Книги на английском",
  classicalbooks: "Классика",
  childrenbooks: "Детские книги",
  mangas: "Комиксы",
  contemporarybooks: "Современные книги",
  languagebooks: "Языковые книги"
};

  const [selectedGenre, setSelectedGenre] = useState(genres[0]);
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    author: "",
    title: "",
    binding: "",
    price: "",
    in_stock: true,
  });

  const fetchBooks = async (genre) => {
    try {
      const res = await fetch(`http://localhost:5000/api/${genre}?all=true`);
      const data = await res.json();
      setBooks(data[genre] || []);
    } catch (err) {
      console.error("Ошибка при загрузке книг:", err);
    }
  };

  useEffect(() => {
    fetchBooks(selectedGenre);
  }, [selectedGenre]);

  const handleAdd = async () => {
    if (!newBook.author || !newBook.title) return alert("Заполните автор и название");
    try {
      const res = await fetch(`http://localhost:5000/api/${selectedGenre}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      if (res.ok) {
        setNewBook({ author: "", title: "", binding: "", price: "", in_stock: true });
        fetchBooks(selectedGenre);
      }
    } catch (err) {
      console.error("Ошибка при добавлении книги:", err);
    }
  };

  const handleUpdate = async (book) => {
    try {
      await fetch(`http://localhost:5000/api/${selectedGenre}/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      fetchBooks(selectedGenre);
    } catch (err) {
      console.error("Ошибка при обновлении книги:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить книгу?")) return;
    try {
      await fetch(`http://localhost:5000/api/${selectedGenre}/${id}`, { method: "DELETE" });
      fetchBooks(selectedGenre);
    } catch (err) {
      console.error("Ошибка при удалении книги:", err);
    }
  };

  return (
    <div style={{ padding: "3px" }}>
      <h1>Админка — книги</h1>

      <Link to="/admin/promotions" style={{ display: "block", marginBottom: "20px" }}>
        Управление акциями
      </Link>

      {/* Выбор жанра */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Жанр:
        <select
  value={selectedGenre}
  onChange={(e) => setSelectedGenre(e.target.value)}
>
  {genres.map((genre) => (
    <option key={genre} value={genre}>
      {genreLabels[genre]}
    </option>
  ))}
</select>
        </label>
      </div>

      {/* Добавление книги */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          placeholder="Автор"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          placeholder="Название"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          placeholder="Переплет"
          value={newBook.binding}
          onChange={(e) => setNewBook({ ...newBook, binding: e.target.value })}
        />
        <input
          type="number"
          placeholder="Цена"
          value={newBook.price}
          onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
        />
        <label>
          В наличии
          <input
            type="checkbox"
            checked={newBook.in_stock}
            onChange={(e) => setNewBook({ ...newBook, in_stock: e.target.checked })}
          />
        </label>
        <button onClick={handleAdd}>Добавить</button>
      </div>

      {/* Таблица книг */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Автор</th>
            <th>Название</th>
            <th>Переплёт</th>
            <th>Цена</th>
            <th>В наличии</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>
                <input
                  value={b.author}
                  onChange={(e) =>
                    setBooks(books.map((book) => (book.id === b.id ? { ...book, author: e.target.value } : book)))
                  }
                />
              </td>
              <td>
                <input
                  value={b.title}
                  onChange={(e) =>
                    setBooks(books.map((book) => (book.id === b.id ? { ...book, title: e.target.value } : book)))
                  }
                />
              </td>
              <td>
                <input
                  value={b.binding}
                  onChange={(e) =>
                    setBooks(books.map((book) => (book.id === b.id ? { ...book, binding: e.target.value } : book)))
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={b.price}
                  onChange={(e) =>
                    setBooks(books.map((book) => (book.id === b.id ? { ...book, price: e.target.value } : book)))
                  }
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={b.in_stock}
                  onChange={(e) =>
                    setBooks(books.map((book) => (book.id === b.id ? { ...book, in_stock: e.target.checked } : book)))
                  }
                />
              </td>
              <td>
                <button onClick={() => handleUpdate(b)}>Сохранить</button>
                <button onClick={() => handleDelete(b.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}






