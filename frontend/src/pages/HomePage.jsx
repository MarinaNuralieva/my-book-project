import { useEffect, useState } from "react";

export default function HomePage() {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/promotions")
      .then((res) => res.json())
      .then((data) => setPromotions(data.promotions || []))
      .catch((err) => console.error("Ошибка при загрузке акций:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Действующие акции</h2>

      {promotions.length === 0 ? (
        <p>Акции пока отсутствуют</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // ровно 2 колонки
            gap: "20px",
          }}
        >
          {promotions.map((promo) => (
            <div
              key={promo.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#fafafa",
                minHeight: "100px",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>{promo.title}</h3>
              <p>{promo.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

