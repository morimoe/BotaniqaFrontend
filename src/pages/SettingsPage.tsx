import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

const CATEGORIES = [
  { value: "cacti", label: "Кактусы" },
  { value: "succulents", label: "Суккуленты" },
  { value: "orchids", label: "Орхидеи" },
  { value: "strelitzia", label: "Стрелиции" },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [adminSection, setAdminSection] = useState<"add" | "edit" | "user" | "deleteProduct" | "deleteUser" | "orders" | null>(null);

  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductStock, setNewProductStock] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [addErr, setAddErr] = useState("");

  const [editProductId, setEditProductId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editMsg, setEditMsg] = useState("");
  const [editErr, setEditErr] = useState("");

  const [targetUserId, setTargetUserId] = useState("");
  const [targetUsername, setTargetUsername] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [userErr, setUserErr] = useState("");

  const [deleteProductId, setDeleteProductId] = useState("");
  const [deleteProductMsg, setDeleteProductMsg] = useState("");
  const [deleteProductErr, setDeleteProductErr] = useState("");

  const [deleteUserId, setDeleteUserId] = useState("");
  const [deleteUserMsg, setDeleteUserMsg] = useState("");
  const [deleteUserErr, setDeleteUserErr] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersErr, setOrdersErr] = useState("");

  const role = localStorage.getItem("role");
  const isAdmin = role?.includes("Admin") ?? false;

  const handleSave = async () => {
    setMessage(""); setError("");
    const data: { username?: string; email?: string; password?: string } = {};
    if (username) data.username = username;
    if (email) data.email = email;
    if (password) data.password = password;
    if (Object.keys(data).length === 0) { setError("Заполни хотя бы одно поле"); return; }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5029/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();
      if (username) { localStorage.setItem("username", username); window.dispatchEvent(new Event("storage")); }
      setMessage("Данные успешно обновлены!");
      setUsername(""); setEmail(""); setPassword("");
    } catch {
      setError("Ошибка при обновлении. Попробуй ещё раз.");
    }
  };

  const handleAddProduct = async () => {
    setAddMsg(""); setAddErr("");
    const price = parseFloat(newProductPrice);
    if (isNaN(price) || price <= 0) { setAddErr("Цена должна быть больше нуля"); return; }
    const stock = parseInt(newProductStock);
    if (isNaN(stock) || stock <= 0) { setAddErr("Количество должно быть больше нуля"); return; }
    if (!newProductCategory) { setAddErr("Выбери категорию"); return; }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5029/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productName: newProductName, description: newProductDescription, price, category: newProductCategory, image: newProductImage, stock }),
      });
      if (!response.ok) throw new Error();
      setAddMsg("Товар добавлен!");
      setNewProductName(""); setNewProductDescription(""); setNewProductPrice("");
      setNewProductCategory(""); setNewProductImage(""); setNewProductStock("");
    } catch {
      setAddErr("Ошибка при добавлении товара.");
    }
  };

  const handleEditProduct = async () => {
    setEditMsg(""); setEditErr("");
    const data: Record<string, string | number | boolean> = {};
    if (editName) data.productName = editName;
    if (editDescription) data.description = editDescription;
    if (editPrice) {
      const price = parseFloat(editPrice);
      if (isNaN(price) || price <= 0) { setEditErr("Цена должна быть больше нуля"); return; }
      data.price = price;
    }
    if (editCategory) data.category = editCategory;
    if (editImage) data.image = editImage;
    if (editStock) {
      const stock = parseInt(editStock);
      if (isNaN(stock) || stock <= 0) { setEditErr("Количество должно быть больше нуля"); return; }
      data.stock = stock;
    }
    if (!editProductId) { setEditErr("Укажи ID товара"); return; }
    if (Object.keys(data).length === 0) { setEditErr("Заполни хотя бы одно поле"); return; }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5029/api/product/${editProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();
      setEditMsg("Товар обновлён!");
    } catch {
      setEditErr("Ошибка при обновлении товара.");
    }
  };

  const handleUpdateUser = async () => {
    setUserMsg(""); setUserErr("");
    const data: Record<string, string> = {};
    if (targetUsername) data.username = targetUsername;
    if (targetEmail) data.email = targetEmail;
    if (targetRole) data.role = targetRole;
    if (!targetUserId) { setUserErr("Укажи ID пользователя"); return; }
    if (Object.keys(data).length === 0) { setUserErr("Заполни хотя бы одно поле"); return; }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5029/api/user/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();
      setUserMsg("Пользователь обновлён!");
    } catch {
      setUserErr("Ошибка при обновлении пользователя.");
    }
  };

  const handleDeleteProduct = async () => {
    setDeleteProductMsg(""); setDeleteProductErr("");
    if (!deleteProductId) { setDeleteProductErr("Укажи ID товара"); return; }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5029/api/product/${deleteProductId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      setDeleteProductMsg("Товар удалён!");
      setDeleteProductId("");
    } catch {
      setDeleteProductErr("Ошибка при удалении товара.");
    }
  };

  const handleDeleteUser = async () => {
    setDeleteUserMsg(""); setDeleteUserErr("");
    if (!deleteUserId) { setDeleteUserErr("Укажи ID пользователя"); return; }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5029/api/user/${deleteUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      setDeleteUserMsg("Пользователь удалён!");
      setDeleteUserId("");
    } catch {
      setDeleteUserErr("Ошибка при удалении пользователя.");
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true); setOrdersErr("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5029/api/order/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setOrders(data);
    } catch {
      setOrdersErr("Ошибка при загрузке заказов.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5029/api/order/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch {
      setOrdersErr("Ошибка при удалении заказа.");
    }
  };

  const inputStyle: React.CSSProperties = {
    minWidth: 0, flex: 1, padding: "8px 16px", borderRadius: "20px",
    border: "2px solid #5a7a5a", background: "transparent", color: "#333",
    fontFamily: "Caveat, cursive", fontSize: "1rem", outline: "none", boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235a7a5a' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: "36px",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "Caveat, cursive", fontSize: "1.1rem",
    width: "160px", flexShrink: 0, color: "#333",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "12px", width: "100%", boxSizing: "border-box",
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--cream)", borderRadius: "16px", padding: "32px",
    display: "flex", flexDirection: "column", gap: "16px", boxSizing: "border-box", width: "100%",
  };

  const adminBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 20px", borderRadius: "20px", border: "2px solid #5a7a5a",
    background: active ? "#3d5c3d" : "transparent",
    color: active ? "var(--cream)" : "#3d5c3d",
    fontFamily: "Caveat, cursive", fontSize: "1.1rem", cursor: "pointer",
    transition: "all 0.2s", whiteSpace: "nowrap",
  });

  const saveButtonStyle: React.CSSProperties = {
    alignSelf: "center", padding: "10px 28px", borderRadius: "20px", border: "none",
    background: "#3d5c3d", color: "var(--cream)", fontFamily: "Caveat, cursive",
    fontSize: "1.1rem", cursor: "pointer",
  };

  const msgStyle = (isError: boolean): React.CSSProperties => ({
    color: isError ? "red" : "green", fontFamily: "Caveat, cursive", fontSize: "1.1rem", margin: 0,
  });

  return (
    <div className="app">
      <Header search="" onSearchChange={() => {}} onCategoryChange={() => navigate("/")} />

      <div style={{ padding: "32px", display: "flex", gap: "32px", alignItems: "flex-start", justifyContent: isAdmin ? "flex-start" : "center", minHeight: "calc(100vh - 140px)", flexWrap: "wrap", boxSizing: "border-box" }}>

        {/* Настройки аккаунта */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", width: "380px", flexShrink: 0 }}>
          <h2 style={{ fontFamily: "Caveat, cursive", color: "var(--cream)", fontSize: "2rem", margin: 0 }}>Настройки аккаунта</h2>
          <div style={cardStyle}>
            {[
              { label: "Изменить имя", value: username, setter: setUsername, type: "text" },
              { label: "Изменить почту", value: email, setter: setEmail, type: "email" },
              { label: "Изменить пароль", value: password, setter: setPassword, type: "password" },
            ].map(({ label, value, setter, type }) => (
              <div key={label} style={rowStyle}>
                <label style={labelStyle}>{label}</label>
                <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={inputStyle} />
              </div>
            ))}
            {message && <p style={msgStyle(false)}>{message}</p>}
            {error && <p style={msgStyle(true)}>{error}</p>}
            <button onClick={handleSave} style={saveButtonStyle}>Сохранить</button>
          </div>
        </div>

        {/* Админ панель */}
        {isAdmin && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", flex: 1, minWidth: 0, maxWidth: "620px" }}>
            <h2 style={{ fontFamily: "Caveat, cursive", color: "var(--cream)", fontSize: "2rem", margin: 0 }}>Привилегии администратора</h2>

            {/* Кнопки */}
            <div style={{ ...cardStyle, padding: "24px 32px", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
              <button style={adminBtnStyle(adminSection === "add")} onClick={() => setAdminSection(adminSection === "add" ? null : "add")}>Добавить товар</button>
              <button style={adminBtnStyle(adminSection === "edit")} onClick={() => setAdminSection(adminSection === "edit" ? null : "edit")}>Изменить товар</button>
              <button style={adminBtnStyle(adminSection === "deleteProduct")} onClick={() => setAdminSection(adminSection === "deleteProduct" ? null : "deleteProduct")}>Удалить товар</button>
              <button style={adminBtnStyle(adminSection === "user")} onClick={() => setAdminSection(adminSection === "user" ? null : "user")}>Обновить пользователя</button>
              <button style={adminBtnStyle(adminSection === "deleteUser")} onClick={() => setAdminSection(adminSection === "deleteUser" ? null : "deleteUser")}>Удалить пользователя</button>
              <button style={adminBtnStyle(adminSection === "orders")} onClick={() => { setAdminSection(adminSection === "orders" ? null : "orders"); fetchOrders(); }}>Активные заказы</button>
            </div>

            {/* Добавить товар */}
            {adminSection === "add" && (
              <div style={{ ...cardStyle, padding: "24px 32px" }}>
                {[
                  { label: "Название", value: newProductName, setter: setNewProductName, type: "text" },
                  { label: "Описание", value: newProductDescription, setter: setNewProductDescription, type: "text" },
                  { label: "Цена", value: newProductPrice, setter: setNewProductPrice, type: "number" },
                  { label: "Картинка (URL)", value: newProductImage, setter: setNewProductImage, type: "text" },
                  { label: "Количество", value: newProductStock, setter: setNewProductStock, type: "number" },
                ].map(({ label, value, setter, type }) => (
                  <div key={label} style={rowStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={inputStyle} min={type === "number" ? "1" : undefined} />
                  </div>
                ))}

                {/* Категория — выпадающий список */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Категория</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">Выберите категорию</option>
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {addMsg && <p style={msgStyle(false)}>{addMsg}</p>}
                {addErr && <p style={msgStyle(true)}>{addErr}</p>}
                <button onClick={handleAddProduct} style={saveButtonStyle}>Добавить</button>
              </div>
            )}

            {/* Изменить товар */}
            {adminSection === "edit" && (
              <div style={{ ...cardStyle, padding: "24px 32px" }}>
                <div style={rowStyle}>
                  <label style={labelStyle}>ID товара</label>
                  <input type="text" value={editProductId} onChange={(e) => setEditProductId(e.target.value)} style={inputStyle} placeholder="обязательно" />
                </div>
                {[
                  { label: "Изменить название", value: editName, setter: setEditName, type: "text" },
                  { label: "Изменить описание", value: editDescription, setter: setEditDescription, type: "text" },
                  { label: "Изменить цену", value: editPrice, setter: setEditPrice, type: "number" },
                  { label: "Изменить картинку", value: editImage, setter: setEditImage, type: "text" },
                  { label: "Изменить наличие", value: editStock, setter: setEditStock, type: "number" },
                ].map(({ label, value, setter, type }) => (
                  <div key={label} style={rowStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={inputStyle} min={type === "number" ? "1" : undefined} />
                  </div>
                ))}

                {/* Категория — выпадающий список */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Изменить категорию</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">Не менять</option>
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {editMsg && <p style={msgStyle(false)}>{editMsg}</p>}
                {editErr && <p style={msgStyle(true)}>{editErr}</p>}
                <button onClick={handleEditProduct} style={saveButtonStyle}>Сохранить</button>
              </div>
            )}

            {/* Удалить товар */}
            {adminSection === "deleteProduct" && (
              <div style={{ ...cardStyle, padding: "24px 32px" }}>
                <div style={rowStyle}>
                  <label style={labelStyle}>ID товара</label>
                  <input type="text" value={deleteProductId} onChange={(e) => setDeleteProductId(e.target.value)} style={inputStyle} placeholder="обязательно" />
                </div>
                {deleteProductMsg && <p style={msgStyle(false)}>{deleteProductMsg}</p>}
                {deleteProductErr && <p style={msgStyle(true)}>{deleteProductErr}</p>}
                <button onClick={handleDeleteProduct} style={{ ...saveButtonStyle, background: "#8b2020" }}>Удалить</button>
              </div>
            )}

            {/* Обновить пользователя */}
            {adminSection === "user" && (
              <div style={{ ...cardStyle, padding: "24px 32px" }}>
                <div style={rowStyle}>
                  <label style={labelStyle}>ID пользователя</label>
                  <input type="text" value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} style={inputStyle} placeholder="обязательно" />
                </div>
                {[
                  { label: "Имя", value: targetUsername, setter: setTargetUsername, type: "text" },
                  { label: "Почта", value: targetEmail, setter: setTargetEmail, type: "email" },
                  { label: "Роль", value: targetRole, setter: setTargetRole, type: "text" },
                ].map(({ label, value, setter, type }) => (
                  <div key={label} style={rowStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={inputStyle} />
                  </div>
                ))}
                {userMsg && <p style={msgStyle(false)}>{userMsg}</p>}
                {userErr && <p style={msgStyle(true)}>{userErr}</p>}
                <button onClick={handleUpdateUser} style={saveButtonStyle}>Обновить</button>
              </div>
            )}

            {/* Удалить пользователя */}
            {adminSection === "deleteUser" && (
              <div style={{ ...cardStyle, padding: "24px 32px" }}>
                <div style={rowStyle}>
                  <label style={labelStyle}>ID пользователя</label>
                  <input type="text" value={deleteUserId} onChange={(e) => setDeleteUserId(e.target.value)} style={inputStyle} placeholder="обязательно" />
                </div>
                {deleteUserMsg && <p style={msgStyle(false)}>{deleteUserMsg}</p>}
                {deleteUserErr && <p style={msgStyle(true)}>{deleteUserErr}</p>}
                <button onClick={handleDeleteUser} style={{ ...saveButtonStyle, background: "#8b2020" }}>Удалить</button>
              </div>
            )}

            {/* Активные заказы */}
            {adminSection === "orders" && (
              <div style={{ ...cardStyle, padding: "24px 32px" }}>
                <h3 style={{ fontFamily: "Caveat, cursive", fontSize: "1.4rem", color: "#333", margin: 0 }}>Активные заказы</h3>
                {ordersLoading && <p style={{ fontFamily: "Caveat, cursive", color: "#333" }}>Загрузка...</p>}
                {ordersErr && <p style={{ fontFamily: "Caveat, cursive", color: "red" }}>{ordersErr}</p>}
                {orders.length === 0 && !ordersLoading && (
                  <p style={{ fontFamily: "Caveat, cursive", color: "#333" }}>Заказов нет</p>
                )}
                {orders.map(order => (
                  <div key={order.id} style={{ border: "2px solid #5a7a5a", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.2rem", color: "#333", fontWeight: 700 }}>Заказ #{orders.indexOf(order) + 1}</span>                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        style={{ background: "#8b2020", border: "none", borderRadius: "12px", padding: "6px 14px", color: "white", fontFamily: "Caveat, cursive", fontSize: "1rem", cursor: "pointer" }}
                      >
                        Удалить
                      </button>
                    </div>
                    <span style={{ fontFamily: "Caveat, cursive", color: "#555" }}>👤 {order.name} — {order.phone}</span>
                    <span style={{ fontFamily: "Caveat, cursive", color: "#555" }}>📍 {order.city}, {order.street}, д.{order.house}{order.apartment ? `, кв.${order.apartment}` : ""}</span>
                    {order.floor && <span style={{ fontFamily: "Caveat, cursive", color: "#555" }}>🏢 Этаж: {order.floor}{order.entrance ? `, подъезд: ${order.entrance}` : ""}{order.intercom ? `, домофон: ${order.intercom}` : ""}</span>}
                    <span style={{ fontFamily: "Caveat, cursive", color: "#555" }}>💳 {order.paymentMethod === "cash" ? "Наличными" : "Картой курьеру"}</span>
                    <span style={{ fontFamily: "Caveat, cursive", color: "#333", fontWeight: 700 }}>💰 {order.totalPrice} MDL</span>
                    <span style={{ fontFamily: "Caveat, cursive", color: "#888", fontSize: "0.9rem" }}>{new Date(order.createdAt).toLocaleString("ru-RU")}</span>
                    {order.comment && <span style={{ fontFamily: "Caveat, cursive", color: "#555" }}>💬 {order.comment}</span>}
                    {order.email && <span style={{ fontFamily: "Caveat, cursive", color: "#555" }}>✉️ {order.email}</span>}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div style={{ marginTop: "6px" }}>
                        <span style={{ fontFamily: "Caveat, cursive", color: "#555", fontWeight: 700 }}>🌿 Товары:</span>
                        {order.orderItems.map((item: any) => (
                          <div key={item.productId} style={{ fontFamily: "Caveat, cursive", color: "#555", paddingLeft: "16px" }}>
                            • {item.product?.productName} × {item.quantity} — {item.price * item.quantity} MDL
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}