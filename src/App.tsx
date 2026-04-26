import { useState } from "react";
import { products as mockProducts } from "./data/products";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [search, setSearch] = useState<string>("");
const [activeCategory, setActiveCategory] = useState<string>("all");  const [cartCount, setCartCount] = useState<number>(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartMap, setCartMap] = useState<Record<number, number>>({});

  const filtered = mockProducts.filter((p) => {
  const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
  const matchCat = activeCategory === "all" || p.category === activeCategory;
  return matchSearch && matchCat;
});

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (id: number) => {
    setCartMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setCartCount((c) => c + 1);
  };

  return (
    <div className="app">
      <Header
        search={search}
        onSearchChange={setSearch}
        favoritesCount={favorites.length}
        cartCount={cartCount}
        onCategoryChange={setActiveCategory}
      />
      <SearchBar count={filtered.length} value={search} onChange={setSearch} />
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

export default App;