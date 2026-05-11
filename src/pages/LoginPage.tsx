import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("https://localhost:7266/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, password }),
      });

      if (!response.ok) {
        setError("Неверный логин или пароль");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      const decoded: any = jwtDecode(data.token);
      const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      localStorage.setItem("username", username);

      // ===== ЗАГРУЖАЕМ КОРЗИНУ И ИЗБРАННОЕ ИЗ БД =====
      const cartRes = await fetch("https://localhost:7266/api/cart", {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      const cart = await cartRes.json();
      const cartMap: Record<number, number> = {};
      cart.forEach((i: any) => {
        const id = Number(i.productId);
        cartMap[id] = (cartMap[id] || 0) + i.quantity;
      });
      localStorage.setItem("cart", JSON.stringify(cartMap));

      const favRes = await fetch("https://localhost:7266/api/favorites", {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      const favs = await favRes.json();
      const favIds = favs.map((i: any) => i.productId);
      localStorage.setItem("favorites", JSON.stringify(favIds));
      // ================================================

      navigate("/");
    } catch {
      setError("Ошибка соединения с сервером");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--green-dark)", display: "flex", flexDirection: "column" }}>
      
      {/* Шапка */}
      <div style={{ background: "var(--cream)", borderBottom: "2px solid var(--green-dark)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          onClick={() => navigate("/")}
          style={{ fontFamily: "Caveat, cursive", fontSize: "1.1rem", color: "var(--green-dark)", cursor: "pointer" }}
        >
          &lt; Назад на главную страницу
        </span>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Caveat, cursive", fontSize: "2rem", fontWeight: 700, color: "var(--green-dark)" }}>BoTaNiQa</div>
          <div style={{ fontFamily: "Caveat, cursive", fontSize: "1rem", color: "var(--green-mid)" }}>- растения для вашего дома и офиса</div>
        </div>
        <div style={{ width: "200px" }} />
      </div>

      {/* Форма */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "var(--cream)", borderRadius: "20px", padding: "40px", width: "340px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {error && (
            <p style={{ color: "red", fontFamily: "Caveat, cursive", fontSize: "1.1rem", textAlign: "center" }}>{error}</p>
          )}

          <input
            placeholder="Логин"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            style={{
              padding: "10px 18px",
              border: "2px solid var(--green-mid)",
              borderRadius: "999px",
              background: "var(--cream)",
              fontFamily: "Caveat, cursive",
              fontSize: "1.1rem",
              color: "var(--green-dark)",
              outline: "none",
            }}
          />

          <input
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px 18px",
              border: "2px solid var(--green-mid)",
              borderRadius: "999px",
              background: "var(--cream)",
              fontFamily: "Caveat, cursive",
              fontSize: "1.1rem",
              color: "var(--green-dark)",
              outline: "none",
            }}
          />

          <button
            onClick={handleLogin}
            style={{
              padding: "10px",
              background: "var(--green-dark)",
              color: "var(--cream)",
              border: "none",
              borderRadius: "999px",
              fontFamily: "Caveat, cursive",
              fontSize: "1.1rem",
              cursor: "pointer",
              alignSelf: "center",
              width: "140px",
            }}
          >
            Войти
          </button>

          <p style={{ textAlign: "center", fontFamily: "Caveat, cursive", fontSize: "1rem", color: "var(--green-dark)" }}>
            Нет аккаунта?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Зарегистрируйтесь
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}