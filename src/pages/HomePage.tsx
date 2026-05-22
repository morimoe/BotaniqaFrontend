import { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import "../App.css";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

type Product = {
  id: number;
  productName: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<number[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [cartMap, setCartMap] = useState<Record<number, number>>(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : {};
  });
  const [sort, setSort] = useState<SortOption>("default");

  useEffect(() => {
    fetch("https://localhost:7266/api/product/all")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("cart");
      const newCart = stored ? JSON.parse(stored) : {};
      setCartMap(newCart);
      const storedFavs = localStorage.getItem("favorites");
      setFavorites(storedFavs ? JSON.parse(storedFavs) : []);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const filtered = products
    .filter((p) => p.productName.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => activeCategory === "all" || p.category === activeCategory) // ← добавь
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-asc") return a.productName.localeCompare(b.productName, "ru");
      if (sort === "name-desc") return b.productName.localeCompare(a.productName, "ru");
      return 0;
    });

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      // Уведомляем Header об изменении избранного
      window.dispatchEvent(new Event("favoritesUpdated"));
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`https://localhost:7266/api/favorites/${id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      return updated;
    });
  };

  const handleAddToCart = (id: number) => {
    setCartMap((prev) => {
      const updated = { ...prev, [id]: (prev[id] || 0) + 1 };
      localStorage.setItem("cart", JSON.stringify(updated));
      // Уведомляем Header об изменении корзины
      window.dispatchEvent(new Event("cartUpdated"));
      const token = localStorage.getItem("token");
      if (token) {
        fetch("https://localhost:7266/api/cart", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: id, quantity: 1 }),
        });
      }
      return updated;
    });
  };

  return (
    <div className="app">
      <Header
        search={search}
        onSearchChange={setSearch}
        onCategoryChange={setActiveCategory}
      />
      <SearchBar
        count={filtered.length}
        value={search}
        onChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />
      <ProductList
        products={filtered}
        favorites={favorites}
        cartMap={cartMap}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
      />
      <Footer />
    </div>
  );
}