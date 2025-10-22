import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // сохраняем юзера (просто для примера)
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/admin/dashboard"); // переход к админ-панели
      } else {
        setError(data.message || "Ошибка входа");
      }
    } catch (err) {
      setError("Сервер недоступен");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Вход в админку</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
