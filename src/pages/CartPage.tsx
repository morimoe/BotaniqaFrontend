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

const CITIES = ["Кишинёв", "Бельцы", "Тирасполь", "Бендеры", "Рыбница", "Унгены", "Сороки", "Орхей"];

export default function CartPage() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Форма
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [intercom, setIntercom] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+373 ");
  const [emailOrder, setEmailOrder] = useState("");
  const [comment, setComment] = useState("");
  const [payMethod, setPayMethod] = useState<"cash" | "card" | null>(null);
  const [orderMsg, setOrderMsg] = useState("");
  const [orderErr, setOrderErr] = useState("");

  const [cartMap, setCartMap] = useState<Record<number, number>>(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "{}");
    return Object.fromEntries(Object.entries(stored).map(([k, v]) => [Number(k), v as number]));
  });

  const [selected, setSelected] = useState<number[]>(
    Object.keys(JSON.parse(localStorage.getItem("cart") || "{}")).map(Number)
  );

  useEffect(() => {
    fetch("http://localhost:5029/api/product/all")
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

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selected.length === cartProducts.length) setSelected([]);
    else setSelected(cartProducts.map(p => p.id));
  };

  const deleteSelected = () => {
    const newCart = { ...cartMap };
    selected.forEach(id => { delete newCart[id]; syncRemoveFromCart(id); });
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartMap(newCart);
    setSelected([]);
  };

  const changeQuantity = (id: number, delta: number) => {
    const product = allProducts.find(p => p.id === id);
    setCartMap(prev => {
      const current = prev[id] || 1;
      const newQty = Math.max(1, current + delta);
      // Не даём превысить stock
      const capped = product ? Math.min(newQty, product.stock) : newQty;
      const updated = { ...prev, [id]: capped };
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
    fetch("http://localhost:5029/api/cart", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity })
    });
  };

  const syncRemoveFromCart = (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`http://localhost:5029/api/cart/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  const total = cartProducts
    .filter(p => selected.includes(p.id))
    .reduce((sum, p) => sum + p.price * cartMap[p.id], 0);

  const handleOrder = async () => {
    setOrderErr("");
    setOrderMsg("");
    if (!city) { setOrderErr("Выберите город"); return; }
    if (!street) { setOrderErr("Укажите улицу"); return; }
    if (!house) { setOrderErr("Укажите номер дома"); return; }
    if (!apartment) { setOrderErr("Укажите квартиру"); return; }
    if (!name) { setOrderErr("Укажите имя"); return; }
    if (!payMethod) { setOrderErr("Выберите способ оплаты"); return; }
    if (!entrance) { setOrderErr("Введите номер подъезда"); return; }
    if (!floor) { setOrderErr("Введите этаж"); return; }
    if (!intercom) { setOrderErr("Введите номер домофона"); return; }
    if (!phone) { setOrderErr("Введите номер телефона"); return; }
    if (!emailOrder) { setOrderErr("Введите email"); return; }

    const items = cartProducts
      .filter(p => selected.includes(p.id))
      .map(p => ({ productId: p.id, quantity: cartMap[p.id], price: p.price }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5029/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          city, street, house, apartment, entrance, floor,
          intercom, name, phone, email: emailOrder, comment,
          paymentMethod: payMethod, items,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setOrderErr(errorData?.message || "Ошибка при оформлении заказа. Попробуй ещё раз.");
        return;
      }

      setOrderMsg("Заказ оформлен! Спасибо 🌿");
      localStorage.setItem("cart", "{}");
      setCartMap({});
      setSelected([]);
      window.dispatchEvent(new Event("storage"));
      setTimeout(() => setShowModal(false), 2000);
    } catch {
      setOrderErr("Ошибка соединения. Проверь интернет и попробуй снова.");
    }
  };

  const inputS: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: "20px",
    border: "2px solid #5a7a5a",
    background: "transparent",
    fontFamily: "Caveat, cursive",
    fontSize: "1rem",
    color: "#333",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const payBtnS = (active: boolean): React.CSSProperties => ({
    padding: "12px",
    borderRadius: "20px",
    border: "2px solid #5a7a5a",
    background: active ? "#3d5c3d" : "transparent",
    color: active ? "var(--cream)" : "#3d5c3d",
    fontFamily: "Caveat, cursive",
    fontSize: "1.1rem",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.2s",
  });

  return (
    <div className="app">
      <Header search="" onSearchChange={() => {}} onCategoryChange={() => navigate("/")} />

      <div style={{ padding: "32px 48px", display: "flex", gap: "24px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Шапка корзины */}
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

          {/* Список товаров */}
          <div style={{ background: "var(--cream)", borderRadius: "16px", padding: "16px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {cartProducts.length === 0 ? (
              <p style={{ fontFamily: "Caveat, cursive", fontSize: "1.3rem", color: "var(--green-dark)", textAlign: "center" }}>Корзина пуста</p>
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
                    <p style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-dark)", textAlign: "left", margin: 0 }}>
                      {p.productName}
                    </p>

                    {/* Предупреждение о stock */}
                    {p.stock === 0 && (
                      <span style={{ display: "block", color: "red", fontFamily: "Caveat, cursive", fontSize: "0.95rem", marginTop: "2px" }}>
                        ❌ Товар закончился
                      </span>
                    )}
                    {p.stock > 0 && p.stock <= 5 && (
                      <span style={{ display: "block", color: "#b85c00", fontFamily: "Caveat, cursive", fontSize: "0.95rem", marginTop: "2px" }}>
                        ⚠️ Осталось {p.stock} шт.
                      </span>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                      <button
                        onClick={() => changeQuantity(p.id, -1)}
                        style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "var(--green-dark)" }}
                      >−</button>
                      <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.1rem", color: "var(--green-dark)" }}>{cartMap[p.id]}</span>
                      {/* Кнопка + заблокирована если достигли stock */}
                      <button
                        onClick={() => changeQuantity(p.id, 1)}
                        disabled={cartMap[p.id] >= p.stock}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "1.1rem",
                          cursor: cartMap[p.id] >= p.stock ? "not-allowed" : "pointer",
                          color: cartMap[p.id] >= p.stock ? "#aaa" : "var(--green-dark)",
                        }}
                      >+</button>
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

        {/* Блок оплаты */}
        <div style={{ width: "320px", background: "var(--cream)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontFamily: "Caveat, cursive", fontSize: "2rem", color: "var(--green-dark)" }}>Оплата</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-dark)" }}>Итого</span>
            <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-dark)", fontWeight: 700 }}>MDL {total}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: "14px", background: "var(--green-dark)", color: "var(--cream)", border: "none", borderRadius: "12px", fontFamily: "Caveat, cursive", fontSize: "1.3rem", cursor: "pointer" }}
          >
            Оформить заказ
          </button>
        </div>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
        >
          <div style={{ background: "var(--cream)", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "860px", maxHeight: "90vh", overflowY: "auto", position: "relative", display: "flex", gap: "32px", flexWrap: "wrap" }}>

            <button
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#3d5c3d" }}
            >✕</button>

            {/* Левая часть — адрес */}
            <div style={{ flex: 1, minWidth: "260px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <h3 style={{ fontFamily: "Caveat, cursive", fontSize: "1.5rem", color: "var(--green-dark)", margin: 0 }}>Куда доставить?</h3>

              <select value={city} onChange={e => setCity(e.target.value)} style={{ ...inputS, appearance: "none" }}>
                <option value="">Выберите город</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <input style={inputS} placeholder="Улица*" value={street} onChange={e => setStreet(e.target.value)} />

              <div style={{ display: "flex", gap: "10px" }}>
                <input style={{ ...inputS, flex: 1 }} type="number" placeholder="Номер дома*" value={house} onChange={e => { if (Number(e.target.value) >= 1 || e.target.value === "") setHouse(e.target.value); }} min="1" />
                <input style={{ ...inputS, flex: 1 }} type="number" placeholder="Квартира*" value={apartment} onChange={e => { if (Number(e.target.value) >= 1 || e.target.value === "") setApartment(e.target.value); }} min="1" />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <input style={{ ...inputS, flex: 1 }} type="number" placeholder="Подъезд*" value={entrance} onChange={e => { if (Number(e.target.value) >= 1 || e.target.value === "") setEntrance(e.target.value); }} min="1" />
                <input style={{ ...inputS, flex: 1 }} type="number" placeholder="Этаж*" value={floor} onChange={e => { if (Number(e.target.value) >= 1 || e.target.value === "") setFloor(e.target.value); }} min="1" />
                <input style={{ ...inputS, flex: 1 }} type="number" placeholder="Домофон*" value={intercom} onChange={e => { if (Number(e.target.value) >= 1 || e.target.value === "") setIntercom(e.target.value); }} min="1" />
              </div>

              <input style={inputS} placeholder="Имя*" value={name} onChange={e => setName(e.target.value)} />
              <input style={inputS} placeholder="+373 (__)____-____" value={phone} onChange={e => setPhone(e.target.value)} />
              <input style={inputS} placeholder="Почта*" value={emailOrder} onChange={e => setEmailOrder(e.target.value)} />
              <textarea
                style={{ ...inputS, resize: "vertical", minHeight: "80px" }}
                placeholder="Комментарий к заказу"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            {/* Правая часть — оплата */}
            <div style={{ width: "280px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <h3 style={{ fontFamily: "Caveat, cursive", fontSize: "1.5rem", color: "var(--green-dark)", margin: 0 }}>Оплата</h3>

              <button style={payBtnS(payMethod === "cash")} onClick={() => setPayMethod("cash")}>Оплата наличными</button>
              <button style={payBtnS(payMethod === "card")} onClick={() => setPayMethod("card")}>Оплата картой курьеру</button>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Caveat, cursive", fontSize: "1rem", color: "#666" }}>{selected.length} Товаров</span>
                  <span style={{ fontFamily: "Caveat, cursive", fontSize: "1rem", color: "#666" }}>{total} MDL</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Caveat, cursive", fontSize: "1rem", color: "#666" }}>Доставка (бесплатно)</span>
                  <span style={{ fontFamily: "Caveat, cursive", fontSize: "1rem", color: "#666" }}>0 MDL</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ccc", paddingTop: "8px" }}>
                  <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-dark)", fontWeight: 700 }}>Итого</span>
                  <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "var(--green-dark)", fontWeight: 700 }}>{total} MDL</span>
                </div>
              </div>

              {orderErr && (
                <p style={{ color: "red", fontFamily: "Caveat, cursive", fontSize: "1rem", margin: 0 }}>{orderErr}</p>
              )}
              {orderMsg && (
                <p style={{ color: "green", fontFamily: "Caveat, cursive", fontSize: "1rem", margin: 0 }}>{orderMsg}</p>
              )}

              <button
                onClick={handleOrder}
                style={{ padding: "14px", background: "var(--green-dark)", color: "var(--cream)", border: "none", borderRadius: "20px", fontFamily: "Caveat, cursive", fontSize: "1.2rem", cursor: "pointer" }}
              >
                Подтвердить и заказать
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}