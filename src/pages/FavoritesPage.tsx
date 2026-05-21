import { useNavigate } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const favoriteIds: number[] = JSON.parse(localStorage.getItem("favorites") || "[]");
  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));
  const [favorites, setFavorites] = useState<number[]>(favoriteIds);

  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    return Object.values(cart).reduce((a: number, b) => a + (b as number), 0) as number;
  };
  const [cartCount, setCartCount] = useState<number>(getCartCount());

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddToCart = (id: number) => {
    const stored = localStorage.getItem("cart");
    const cart = stored ? JSON.parse(stored) : {};
    cart[id] = (cart[id] || 0) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(getCartCount());
  };

  const visibleProducts = favoriteProducts.filter(p => favorites.includes(p.id));

  return (
    <div className="app">
      <Header
        search=""
        onSearchChange={() => {}}
        favoritesCount={favorites.length}
        cartCount={cartCount}
        onCategoryChange={() => navigate("/")}
      />
      <div style={{ padding: "24px 32px" }}>
        <h2 style={{ fontFamily: "Caveat, cursive", color: "var(--cream)", fontSize: "2rem", marginBottom: "20px" }}>
          Товары: {visibleProducts.length}
        </h2>
        {visibleProducts.length === 0 ? (
          <p style={{ fontFamily: "Caveat, cursive", color: "var(--cream)", fontSize: "1.3rem" }}>
            Вы ещё ничего не добавили в избранное
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {visibleProducts.map(p => (
              <ProductCard
                key={p.id}
                {...p}
                isFavorite={favorites.includes(p.id)}
                onToggleFavorite={() => handleToggleFavorite(p.id)}
                onAddToCart={() => handleAddToCart(p.id)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}