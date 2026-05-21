import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Product = {
  id: number;
  productName: string;
  description: string;
  price: number;
  stock: number;
  image: string;
};

export default function CartPage() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const [cartMap, setCartMap] = useState<Record<number, number>>(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "{}");
    return Object.fromEntries(Object.entries(stored).map(([k, v]) => [Number(k), v as number]));
  });

  const [selected, setSelected] = useState<number[]>(
    Object.keys(JSON.parse(localStorage.getItem("cart") || "{}")).map(Number)
  );

  const favoritesCount = JSON.parse(localStorage.getItem("favorites") || "[]").length;

  // Загрузка продуктов из API
  useEffect(() => {
    fetch("https://localhost:7266/api/product/all")
      .then((res) => res.json())
      .then(setAllProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const stored = JSON.parse(localStorage.getItem("cart") || "{}");
      const newCart = Object.fromEntries(Object.entries(stored).map(([k, v]) => [Number(k), v as number]));
      setCartMap(newCart);
      setSelected(Object.keys(newCart).map(Number));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const cartProducts = allProducts.filter(p => cartMap[p.id] > 0);
  const totalCartCount = Object.values(cartMap).reduce((a, b) => a + b, 0);

  const toggleSelect = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === cartProducts.length) {
      setSelected([]);
    } else {
      setSelected(cartProducts.map(p => p.id));
    }
  };

  const deleteSelected = () => {
    const newCart = { ...cartMap };
    selected.forEach(id => {
      delete newCart[id];
      syncRemoveFromCart(id);
    });
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartMap(newCart);
    setSelected([]);
  };

  const changeQuantity = (id: number, delta: number) => {
    setCartMap(prev => {
      const newQty = Math.max(1, (prev[id] || 1) + delta);
      const updated = { ...prev, [id]: newQty };
      localStorage.setItem("cart", JSON.stringify(updated));
      syncAddToCart(id, delta);
      return updated;
    });
  };

  const deleteOne = (id: number) => {
    const newCart = { ...cartMap };
    delete newCart[id];
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartMap(newCart);
    setSelected(prev => prev.filter(s => s !== id));
    syncRemoveFromCart(id);
  };

  const syncAddToCart = (productId: number, quantity: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("https://localhost:7266/api/cart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId, quantity })
    });
  };

  const syncRemoveFromCart = (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`https://localhost:7266/api/cart/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const total = cartProducts
    .filter(p => selected.includes(p.id))
    .reduce((sum, p) => sum + p.price * cartMap[p.id], 0);

  return (
    <div className="app">
      <Header
        search=""
        onSearchChange={() => {}}
        favoritesCount={favoritesCount}
        cartCount={totalCartCount}
        onCategoryChange={() => navigate("/")}
      />

      <div style={{ padding: "32px 48px", display: "flex", gap: "24px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: "var(--cream)", borderRadius: "16px", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-dark)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={selected.length === cartProducts.length && cartProducts.length > 0}
                onChange={toggleSelectAll}
                style={{ width: "18px", height: "18px", accentColor: "var(--green-dark)" }}
              />
              Выбрать всё
            </label>
            <button onClick={deleteSelected} style={{ background: "none", border: "none", fontFamily: "Caveat, cursive", fontSize: "1.1rem", color: "var(--green-dark)", cursor: "pointer" }}>
              🗑 Удалить всё выбранное
            </button>
          </div>

          <div style={{ background: "var(--cream)", borderRadius: "16px", padding: "16px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {cartProducts.length === 0 ? (
              <p style={{ fontFamily: "Caveat, cursive", fontSize: "1.3rem", color: "var(--green-dark)", textAlign: "center" }}>
                Корзина пуста
              </p>
            ) : (
              cartProducts.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    style={{ width: "18px", height: "18px", accentColor: "var(--green-dark)" }}
                  />
                  <img src={p.image} alt={p.productName} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "12px" }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-dark)", textAlign: "left" }}>{p.productName}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                      <button onClick={() => changeQuantity(p.id, -1)} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "var(--green-dark)" }}>−</button>
                      <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.1rem", color: "var(--green-dark)" }}>{cartMap[p.id]}</span>
                      <button onClick={() => changeQuantity(p.id, 1)} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "var(--green-dark)" }}>+</button>
                      <button onClick={() => deleteOne(p.id)} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "var(--green-dark)" }}>🗑</button>
                    </div>
                  </div>
                  <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.3rem", color: "var(--green-dark)", fontWeight: 700 }}>
                    MDL {p.price * cartMap[p.id]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ width: "320px", background: "var(--cream)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontFamily: "Caveat, cursive", fontSize: "2rem", color: "var(--green-dark)" }}>Оплата</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-dark)" }}>Итого</span>
            <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-dark)", fontWeight: 700 }}>MDL {total}</span>
          </div>
          <button style={{ padding: "14px", background: "var(--green-dark)", color: "var(--cream)", border: "none", borderRadius: "12px", fontFamily: "Caveat, cursive", fontSize: "1.3rem", cursor: "pointer" }}>
            Оформить заказ
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}