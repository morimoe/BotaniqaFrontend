import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutPage() {
  const navigate = useNavigate();

  const [favoritesCount] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]").length
  );

  const [cartCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    return Object.values(cart).reduce((a: number, b) => a + (b as number), 0);
  });

  return (
    <div className="app">
      <Header
        search=""
        onSearchChange={() => {}}
        favoritesCount={favoritesCount}
        cartCount={cartCount}
        onCategoryChange={() => navigate("/")}
      />

      <div style={{ padding: "48px 80px", display: "flex", flexDirection: "column", gap: "48px" }}>

        {/* Заголовок */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "Caveat, cursive", fontSize: "3.5rem", color: "var(--cream)", marginBottom: "12px" }}>
            О нас 🌿
          </h1>
          <p style={{ fontFamily: "Caveat, cursive", fontSize: "1.4rem", color: "var(--green-light)" }}>
            Мы — маленький магазин с большой любовью к растениям
          </p>
        </div>

        {/* Карточки */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {[
            { emoji: "🌱", title: "Наша миссия", text: "Мы хотим чтобы каждый дом был живым. Растения делают пространство теплее, воздух чище, а настроение лучше." },
            { emoji: "🤍", title: "С любовью", text: "Каждое растение у нас выращено с заботой. Мы отбираем только здоровые и красивые экземпляры для наших покупателей." },
            { emoji: "🚚", title: "Доставка", text: "Доставляем по всей Молдове. Упаковываем так чтобы растение доехало целым и счастливым." },
          ].map((card) => (
            <div key={card.title} style={{
              background: "var(--cream)",
              borderRadius: "20px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}>
              <span style={{ fontSize: "2.5rem" }}>{card.emoji}</span>
              <h2 style={{ fontFamily: "Caveat, cursive", fontSize: "1.8rem", color: "var(--green-dark)" }}>{card.title}</h2>
              <p style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-mid)", lineHeight: 1.5 }}>{card.text}</p>
            </div>
          ))}
        </div>

        {/* История */}
        <div style={{ background: "var(--cream)", borderRadius: "20px", padding: "40px", display: "flex", gap: "40px", alignItems: "center" }}>
          <span style={{ fontSize: "6rem" }}>🌵</span>
          <div>
            <h2 style={{ fontFamily: "Caveat, cursive", fontSize: "2rem", color: "var(--green-dark)", marginBottom: "12px" }}>Наша история</h2>
            <p style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-mid)", lineHeight: 1.6 }}>
              BoTaNiQa началась как маленькая коллекция кактусов на подоконнике.
              Потом появились суккуленты, орхидеи, стрелиции...
              Сейчас мы — полноценный магазин, но душа осталась та же —
              искренняя любовь к зелёным друзьям.
            </p>
          </div>
        </div>

        {/* Кнопка */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "14px 40px",
              background: "var(--cream)",
              color: "var(--green-dark)",
              border: "none",
              borderRadius: "999px",
              fontFamily: "Caveat, cursive",
              fontSize: "1.3rem",
              cursor: "pointer",
            }}
          >
            Перейти в каталог 🌿
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}