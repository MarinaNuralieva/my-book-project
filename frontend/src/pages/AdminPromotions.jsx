// src/pages/AdminPromotions.jsx
import { useEffect, useState } from "react";

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  const fetchPromotions = () => {
    fetch("http://localhost:5000/api/promotions")
      .then(res => res.json())
      .then(data => setPromotions(data.promotions || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const addPromotion = async () => {
    if (!newTitle || !newDescription) return;
    try {
      const res = await fetch("http://localhost:5000/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });
      await res.json();
      setNewTitle("");
      setNewDescription("");
      fetchPromotions();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (promo) => {
    setEditingId(promo.id);
    setEditingTitle(promo.title);
    setEditingDescription(promo.description);
  };

  const saveEditing = async () => {
    if (!editingTitle || !editingDescription) return;
    try {
      const res = await fetch(`http://localhost:5000/api/promotions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle, description: editingDescription }),
      });
      await res.json();
      setEditingId(null);
      setEditingTitle("");
      setEditingDescription("");
      fetchPromotions();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePromotion = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/promotions/${id}`, { method: "DELETE" });
      fetchPromotions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Акции (Admin)</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Добавить новую акцию</h3>
        <input
          type="text"
          placeholder="Название акции"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Описание"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addPromotion}>Добавить</button>
      </div>

      <h3>Существующие акции</h3>
      {promotions.length === 0 && <p>Акции отсутствуют</p>}

      <div style={{ display: "grid", gap: "10px" }}>
        {promotions.map((promo) => (
          <div key={promo.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "6px" }}>
            {editingId === promo.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <input
                  type="text"
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <button onClick={saveEditing}>Сохранить</button>
                <button onClick={() => setEditingId(null)} style={{ marginLeft: "5px" }}>Отмена</button>
              </>
            ) : (
              <>
                <h4>{promo.title}</h4>
                <p>{promo.description}</p>
                <button onClick={() => startEditing(promo)}>Редактировать</button>
                <button onClick={() => deletePromotion(promo.id)} style={{ marginLeft: "5px" }}>Удалить</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

