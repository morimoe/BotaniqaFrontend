import { useState, useRef, useEffect } from "react";
import "../style/Header.css";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  favoritesCount: number;
  cartCount: number;
  onCategoryChange: (cat: string) => void;
};

export default function Header({
  search,
  onSearchChange,
  favoritesCount,
  cartCount,
  onCategoryChange,
}: HeaderProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    setUsername(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");
    setUsername(null);
    window.dispatchEvent(new Event("storage")); // ← добавить
    navigate("/");
};
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-brand">
          <span className="brand-name">BoTaNiQa</span>
          <span className="brand-sub">- растения для вашего дома и офиса</span>
        </div>
        <div className="header-search">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск растения..."
            className="search-input"
          />
        </div>
        <div className="header-icons">
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {username && (
              <span style={{ fontFamily: "Caveat, cursive", fontSize: "1rem", color: "var(--green-dark)" }}>
                {username}
              </span>
            )}
            <button
              className="icon-btn"
              title={username ? "Выйти" : "Войти"}
              onClick={username ? handleLogout : () => navigate("/login")}
            >
              {username ? "🚪" : "👤"}
            </button>
          </div>
          <button className="icon-btn" title="Избранное" onClick={() => navigate("/favorites")}>
            🤍
            {favoritesCount > 0 && (
              <span className="badge">{favoritesCount > 9 ? "9+" : favoritesCount}</span>
            )}
          </button>
              <button className="icon-btn" title="Корзина" onClick={() => navigate("/cart")}>            🛒
            {cartCount > 0 && (
              <span className="badge">{cartCount > 9 ? "9+" : cartCount}</span>
            )}
          </button>
        </div>
      </div>
      <nav className="header-nav">
        <div
          className="nav-dropdown-wrap"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="nav-link"
            onClick={() => onCategoryChange("all")}
          >
            Каталог ∨
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {[
                { id: "cacti", label: "Кактусы" },
                { id: "succulents", label: "Суккуленты" },
                { id: "orchids", label: "Орхидеи" },
                { id: "strelitzia", label: "Стрелиции" },
              ].map((cat) => (
                <span
                  key={cat.id}
                  className="dropdown-item"
                  onClick={() => {
                    onCategoryChange(cat.id);
                    setDropdownOpen(false);
                  }}
                >
                  {cat.label} &gt;
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="nav-link" onClick={() => navigate("/favorites")} style={{ cursor: "pointer" }}>Избранное 🤍</span>
        <span className="nav-link" onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>О нас</span>
      </nav>
    </header>
  );
}