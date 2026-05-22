import { useState, useRef, useEffect } from "react";
import "../style/Header.css";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (cat: string) => void;
};

export default function Header({
  search,
  onSearchChange,
  onCategoryChange,
}: HeaderProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  const [favoritesCount, setFavoritesCount] = useState(() => {
    const arr = JSON.parse(localStorage.getItem("favorites") || "[]");
    return [...new Set(arr)].length;
  });

  const [cartCount, setCartCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    return Object.values(cart).reduce(
      (a: number, b) => a + (b as number),
      0
    ) as number;
  });

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    setUsername(stored);
  }, []);

  useEffect(() => {
    const updateFavs = () => {
      const arr = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavoritesCount([...new Set(arr)].length);
    };
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "{}");
      setCartCount(
        Object.values(cart).reduce(
          (a: number, b) => a + (b as number),
          0
        ) as number
      );
    };
    const updateAll = () => {
      updateFavs();
      updateCart();
      const stored = localStorage.getItem("username");
      setUsername(stored);
    };
    window.addEventListener("favoritesUpdated", updateFavs);
    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("storage", updateAll);
    return () => {
      window.removeEventListener("favoritesUpdated", updateFavs);
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("storage", updateAll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");
    setUsername(null);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 300);
  };

  const handleUserMenuEnter = () => {
    if (userMenuTimer.current) clearTimeout(userMenuTimer.current);
    setUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimer.current = setTimeout(() => setUserMenuOpen(false), 300);
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
          {username ? (
            /* Выпадающее меню на нике */
            <div
              className="user-menu-wrap"
              onMouseEnter={handleUserMenuEnter}
              onMouseLeave={handleUserMenuLeave}
            >
              <span className="user-nick">{username}</span>
              {userMenuOpen && (
                <div className="dropdown-menu user-dropdown">
                  <span
                    className="dropdown-item"
                    onClick={() => { setUserMenuOpen(false); navigate("/settings"); }}
                  >
                    ⚙️ Настройки
                  </span>
                  <span
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    🚪 Выйти
                  </span>
                </div>
              )}
            </div>
          ) : (
            <button
              className="icon-btn"
              title="Войти"
              onClick={() => navigate("/login")}
            >
              👤
            </button>
          )}

          <button
            className="icon-btn"
            title="Избранное"
            onClick={() => navigate("/favorites")}
          >
            🤍
            {favoritesCount > 0 && (
              <span className="badge">
                {favoritesCount > 9 ? "9+" : favoritesCount}
              </span>
            )}
          </button>
          <button
            className="icon-btn"
            title="Корзина"
            onClick={() => navigate("/cart")}
          >
            🛒
            {cartCount > 0 && (
              <span className="badge">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
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
          <button className="nav-link" onClick={() => onCategoryChange("all")}>
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
        <span
          className="nav-link"
          onClick={() => navigate("/favorites")}
          style={{ cursor: "pointer" }}
        >
          Избранное 🤍
        </span>
        <span
          className="nav-link"
          onClick={() => navigate("/about")}
          style={{ cursor: "pointer" }}
        >
          О нас
        </span>
      </nav>
    </header>
  );
}