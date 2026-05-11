import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("https://localhost:7266/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        setError("Ошибка при регистрации");
        return;
      }

      navigate("/login");
    } catch {
      setError("Ошибка соединения с сервером");
    }
  };

  const inputStyle = {
    padding: "10px 18px",
    border: "2px solid var(--green-mid)",
    borderRadius: "999px",
    background: "var(--cream)",
    fontFamily: "Caveat, cursive",
    fontSize: "1.1rem",
    color: "var(--green-dark)",
    outline: "none",
    width: "100%",
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
            placeholder="Никнейм"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Почта"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={handleRegister}
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
              width: "160px",
            }}
          >
            Регистрация
          </button>

          <p style={{ textAlign: "center", fontFamily: "Caveat, cursive", fontSize: "1rem", color: "var(--green-dark)" }}>
            Уже зарегистрировались?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Войти
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}