import { useState } from "react";
import "../style/Header.css";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          <button className="icon-btn" title="Регистрация">👤</button>
          <button className="icon-btn" title="Избранное">
            🤍
            {favoritesCount > 0 && (
              <span className="badge">{favoritesCount > 9 ? "9+" : favoritesCount}</span>
            )}
          </button>
          <button className="icon-btn" title="Корзина">
            🛒
            {cartCount > 0 && (
              <span className="badge">{cartCount > 9 ? "9+" : cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <nav className="header-nav">
        <div className="nav-dropdown-wrap">
          <button
            className="nav-link"
            onClick={() => setDropdownOpen((prev) => !prev)}
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
        <a href="#about" className="nav-link">Избранное 🤍</a>
        <a href="#about" className="nav-link">О нас</a>
      </nav>
    </header>
  );
}