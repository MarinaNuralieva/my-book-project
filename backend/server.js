import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "bookshop",
  password: "Marinus6",
  port: 5432
});

// ------------------- LOGIN -------------------
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1 AND password=$2 LIMIT 1",
      [username, password]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ success: false, message: "Неверный логин или пароль" });

    const user = result.rows[0];
    if (user.username !== "admin")
      return res.status(403).json({ success: false, message: "Нет доступа" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Ошибка LOGIN:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// ------------------- PROMOTIONS -------------------
app.get("/api/promotions", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, title, description FROM promotions ORDER BY id ASC");
    res.json({ promotions: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка PROMOTIONS GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/promotions", async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO promotions (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка PROMOTIONS POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/promotions/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE promotions SET title=$1, description=$2 WHERE id=$3 RETURNING *",
      [title, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка PROMOTIONS PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/promotions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM promotions WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка PROMOTIONS DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------- BOOKS -------------------
//--------------CHILDRENBOOKS-------------------
app.get("/api/childrenbooks", async (req, res) => {
  try {
    if (req.query.all === "true") {
      const result = await pool.query("SELECT * FROM childrenbooks ORDER BY id ASC");
      return res.json({ childrenbooks: result.rows, total: result.rows.length });
    }

    const limit = parseInt(req.query.limit) || 2;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM childrenbooks ORDER BY id ASC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    const countResult = await pool.query("SELECT COUNT(*) FROM childrenbooks");
    const total = parseInt(countResult.rows[0].count);

    res.json({ childrenbooks: result.rows, total });
  } catch (err) {
    console.error("Ошибка CHILDRENBOOKS GET:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE / UPDATE / DELETE книги
app.post("/api/childrenbooks", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO childrenbooks (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка CHILDRENBOOKS POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/childrenbooks/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE childrenbooks SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка CHILDRENBOOKS PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/childrenbooks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM childrenbooks WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка CHILDRENBOOKS DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});
//--------------CLASSICALBOOKS------------------
app.get("/api/classicalbooks", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM classicalbooks ORDER BY id ASC");
    res.json({ classicalbooks: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка CLASSICALBOOKS GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/classicalbooks", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO classicalbooks (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка CLASSICALBOOKS POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/classicalbooks/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE classicalbooks SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка CLASSICALBOOKS PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/classicalbooks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM classicalbooks WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка CLASSICALBOOKS DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});
//--------------CONTEMPORARYBOOKS---------------
app.get("/api/contemporarybooks", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM contemporarybooks ORDER BY id ASC");
    res.json({ contemporarybooks: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка CONTEMPORARYBOOKS GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/contemporarybooks", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO contemporarybooks (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка CONTEMPORARYBOOKS:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/contemporarybooks/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE contemporarybooks SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка CONTEMPORARYBOOKS PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/contemporarybooks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM contemporarybooks WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка CONTEMPORARYBOOKS:", err);
    res.status(500).json({ error: err.message });
  }
});

//--------------DETECTIVE-----------------------
app.get("/api/detective", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM detective ORDER BY id ASC");
    res.json({ detective: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка DETECTIVE GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/detective", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO detective (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка DETECTIVE POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/detective/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE detective SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка DETECTIVE PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/detective/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM detective WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка DETECTIVE DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

//--------------ENGLISHBOOKS--------------------
app.get("/api/englishbooks", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM englishbooks ORDER BY id ASC");
    res.json({ englishbooks: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка ENGLISHBOOKS GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/englishbooks", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO englishbooks (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка ENGLISHBOOKS POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/englishbooks/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATEenglishbooks SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка ENGLISHBOOKS PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/englishbooks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM englisbooks WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка ENGLISHBOOKS DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

//--------------FANTASY-------------------------
app.get("/api/fantasy", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM fantasy ORDER BY id ASC");
    res.json({ fantasy: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка FANTASY GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/fantasy", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO fantasy (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка FANTASY POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/fantasy/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE fantasy SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка FANTASY PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/fantasy/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM fantasy WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка FANTASY DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

//--------------KYRGYZBOOKS---------------------
app.get("/api/kyrgyzbooks", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM kyrgyzbooks ORDER BY id ASC");
    res.json({ kyrgyzbooks: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка KYRGYZBOOKS GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/kyrgyzbooks", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO kyrgyzbooks (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка KYRGYZBOOKS POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/kyrgyzbooks/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE kyrgyzbooks SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка KYRGYZBOOKS PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/kyrgyzsbooks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM kyrgyzbooks WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка KYRGYZBOOKS DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

//--------------LANGUAGEBOOKS-------------------
app.get("/api/languagebooks", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM languagebooks ORDER BY id ASC");
    res.json({ languagebooks: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка LANGUAGEBOOKS GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/languagebooks", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO languagebooks (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка LANGUAGEBOOKS POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/languagebooks/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE languagebooks SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка LANGUAGEBOOKS PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/languagebooks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM languagebooks WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка LANGUAGEBOOKS DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

//--------------MANGAS--------------------------
app.get("/api/mangas", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM mangas ORDER BY id ASC");
    res.json({ mangas: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка MANGAS GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/mangas", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO mangas (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка MANGAS POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/mangas/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE mangas SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка MANGAS PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/mangas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM mangas WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка MANGAS DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

//--------------PSYCHOLOGY---------------------
app.get("/api/psychology", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM psychology ORDER BY id ASC");
    res.json({ psychology: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка PSYCHOLOGY GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/psychology", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO psychology (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка PSYCHOLOGY POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/psychology/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE psychology SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка PSYCHOLOGY PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/psychology/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM psychology WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка PSYCHOLOGY DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});


//--------------YOUNGADULT----------------------
app.get("/api/youngadult", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, author, title, binding, price, in_stock FROM youngadult ORDER BY id ASC");
    res.json({ youngadult: result.rows, total: result.rows.length });
  } catch (err) {
    console.error("Ошибка YOUNG ADULT GET:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/youngadult", async (req, res) => {
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO youngadult (author, title, binding, price, in_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка YOUNG ADULT POST:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/youngadult/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, binding, price, in_stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE youngadult SET author=$1, title=$2, binding=$3, price=$4, in_stock=$5 WHERE id=$6 RETURNING *",
      [author, title, binding, price, in_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка YOUNG ADULT PUT:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/youngadult/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM youngadult WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка YOUNG ADULT DELETE:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------- SEARCH -------------------
app.get("/api/search", async (req, res) => {
  const { q = "", page = 1, limit = 2 } = req.query;
  const offset = (page - 1) * limit;

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

  try {
    let allBooks = [];

    for (const genre of genres) {
      const result = await pool.query(
        `SELECT id, title, author, binding, price, in_stock, '${genre}' AS genre
         FROM ${genre}
         WHERE title ILIKE $1 OR author ILIKE $1
         ORDER BY id ASC`,
        [`%${q}%`]
      );

      if (result.rows.length > 0) {
        allBooks = allBooks.concat(result.rows);
      }
    }

    // Общие данные для пагинации
    const total = allBooks.length;
    const paginated = allBooks.slice(offset, offset + parseInt(limit));

    res.json({ books: paginated, total });
  } catch (err) {
    console.error("Ошибка поиска:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/books", async (req, res) => {
  const { genre, author, title, binding, price, in_stock } = req.body;
  const allowedGenres = [
    "detective","fantasy","youngadult","psychology",
    "englishbooks","classicalbooks","childrenbooks",
    "mangas","contemporarybooks","languagebooks"
  ];

  if (!allowedGenres.includes(genre)) 
    return res.status(400).json({ error: "Неверный жанр" });

  try {
    const result = await pool.query(
      `INSERT INTO ${genre} (author, title, binding, price, in_stock)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [author, title, binding, price, in_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () => console.log("✅ Backend running at http://localhost:5000"));




