import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [adminSection, setAdminSection] = useState<"add" | "edit" | "user" | null>(null);

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

  const role = localStorage.getItem("role");
  const isAdmin = role?.includes("Admin") ?? false;

  const handleSave = async () => {
    setMessage("");
    setError("");

    const data: { username?: string; email?: string; password?: string } = {};
    if (username) data.username = username;
    if (email) data.email = email;
    if (password) data.password = password;

    if (Object.keys(data).length === 0) {
      setError("Заполни хотя бы одно поле");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7266/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      if (username) {
        localStorage.setItem("username", username);
        window.dispatchEvent(new Event("storage"));
      }

      setMessage("Данные успешно обновлены!");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Ошибка при обновлении. Попробуй ещё раз.");
    }
  };

  const handleAddProduct = async () => {
    setAddMsg("");
    setAddErr("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7266/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName: newProductName,
          description: newProductDescription,
          price: parseFloat(newProductPrice),
          category: newProductCategory,
          image: newProductImage,
          stock: newProductStock ? parseInt(newProductStock) : 0,
        }),
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
    setEditMsg("");
    setEditErr("");
    const data: Record<string, string | number | boolean> = {};
    if (editName) data.productName = editName;
    if (editDescription) data.description = editDescription;
    if (editPrice) data.price = parseFloat(editPrice);
    if (editCategory) data.category = editCategory;
    if (editImage) data.image = editImage;
    if (editStock) data.stock = parseInt(editStock);

    if (!editProductId) { setEditErr("Укажи ID товара"); return; }
    if (Object.keys(data).length === 0) { setEditErr("Заполни хотя бы одно поле"); return; }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7266/api/product/${editProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();
      setEditMsg("Товар обновлён!");
    } catch {
      setEditErr("Ошибка при обновлении товара.");
    }
  };

  const handleUpdateUser = async () => {
    setUserMsg("");
    setUserErr("");
    const data: Record<string, string> = {};
    if (targetUsername) data.username = targetUsername;
    if (targetEmail) data.email = targetEmail;
    if (targetRole) data.role = targetRole;

    if (!targetUserId) { setUserErr("Укажи ID пользователя"); return; }
    if (Object.keys(data).length === 0) { setUserErr("Заполни хотя бы одно поле"); return; }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7266/api/user/${targetUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();
      setUserMsg("Пользователь обновлён!");
    } catch {
      setUserErr("Ошибка при обновлении пользователя.");
    }
  };

  // ── Shared styles ──────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    // KEY FIX: min-width:0 lets flex children shrink below their content size
    minWidth: 0,
    flex: 1,
    padding: "8px 16px",
    borderRadius: "20px",
    border: "2px solid #5a7a5a",
    background: "transparent",
    color: "#333",
    fontFamily: "Caveat, cursive",
    fontSize: "1rem",
    outline: "none",
    // KEY FIX: ensure padding doesn't add to width
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "Caveat, cursive",
    fontSize: "1.1rem",
    // KEY FIX: fixed label width so it doesn't squeeze the input
    width: "160px",
    flexShrink: 0,
    color: "#333",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    // KEY FIX: row must not overflow its card
    width: "100%",
    boxSizing: "border-box",
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--cream)",
    borderRadius: "16px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    // KEY FIX: prevent card from growing wider than its container
    boxSizing: "border-box",
    width: "100%",
  };

  const adminBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 20px",
    borderRadius: "20px",
    border: "2px solid #5a7a5a",
    background: active ? "#3d5c3d" : "transparent",
    color: active ? "var(--cream)" : "#3d5c3d",
    fontFamily: "Caveat, cursive",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  });

  const saveButtonStyle: React.CSSProperties = {
    alignSelf: "center",
    padding: "10px 28px",
    borderRadius: "20px",
    border: "none",
    background: "#3d5c3d",
    color: "var(--cream)",
    fontFamily: "Caveat, cursive",
    fontSize: "1.1rem",
    cursor: "pointer",
  };

  const msgStyle = (isError: boolean): React.CSSProperties => ({
    color: isError ? "red" : "green",
    fontFamily: "Caveat, cursive",
    fontSize: "1.1rem",
    margin: 0,
  });

  return (
    <div className="app">
      <Header
        search=""
        onSearchChange={() => {}}
        onCategoryChange={() => navigate("/")}
      />

      <div
        style={{
          padding: "32px",
          display: "flex",
          gap: "32px",
          alignItems: "flex-start",
          justifyContent: isAdmin ? "flex-start" : "center",
          minHeight: "calc(100vh - 140px)",
          flexWrap: "wrap",
          boxSizing: "border-box",
        }}
      >
        {/* ── Left: Account Settings ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            // KEY FIX: fixed width so it doesn't grow/shrink unexpectedly
            width: "380px",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontFamily: "Caveat, cursive",
              color: "var(--cream)",
              fontSize: "2rem",
              margin: 0,
            }}
          >
            Настройки аккаунта
          </h2>

          <div style={cardStyle}>
            {[
              { label: "Изменить имя", value: username, setter: setUsername, type: "text" },
              { label: "Изменить почту", value: email, setter: setEmail, type: "email" },
              { label: "Изменить пароль", value: password, setter: setPassword, type: "password" },
            ].map(({ label, value, setter, type }) => (
              <div key={label} style={rowStyle}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  style={inputStyle}
                />
              </div>
            ))}

            {message && <p style={msgStyle(false)}>{message}</p>}
            {error && <p style={msgStyle(true)}>{error}</p>}

            <button onClick={handleSave} style={saveButtonStyle}>
              Сохранить
            </button>
          </div>
        </div>

        {/* ── Right: Admin Panel ── */}
        {isAdmin && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              // KEY FIX: flex:1 with min-width:0 so it shrinks properly
              flex: 1,
              minWidth: 0,
              maxWidth: "580px",
            }}
          >
            <h2
              style={{
                fontFamily: "Caveat, cursive",
                color: "var(--cream)",
                fontSize: "2rem",
                margin: 0,
              }}
            >
              Привилегии администратора
            </h2>

            {/* Action buttons */}
            <div
              style={{
                ...cardStyle,
                padding: "24px 32px",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button style={adminBtnStyle(adminSection === "add")} onClick={() => setAdminSection(adminSection === "add" ? null : "add")}>
                Добавить товар
              </button>
              <button style={adminBtnStyle(adminSection === "edit")} onClick={() => setAdminSection(adminSection === "edit" ? null : "edit")}>
                Изменить существующий товар
              </button>
              <button style={adminBtnStyle(adminSection === "user")} onClick={() => setAdminSection(adminSection === "user" ? null : "user")}>
                Обновить данные о пользователе
              </button>
            </div>

            {/* Add product form */}
            {adminSection === "add" && (
              <div style={{ ...cardStyle, padding: "24px 32px" }}>
                {[
                  { label: "Название", value: newProductName, setter: setNewProductName, type: "text" },
                  { label: "Описание", value: newProductDescription, setter: setNewProductDescription, type: "text" },
                  { label: "Цена", value: newProductPrice, setter: setNewProductPrice, type: "number" },
                  { label: "Категория", value: newProductCategory, setter: setNewProductCategory, type: "text" },
                  { label: "Картинка (URL)", value: newProductImage, setter: setNewProductImage, type: "text" },
                  { label: "Количество (число)", value: newProductStock, setter: setNewProductStock, type: "text" },
                ].map(({ label, value, setter, type }) => (
                  <div key={label} style={rowStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={inputStyle} />
                  </div>
                ))}
                {addMsg && <p style={msgStyle(false)}>{addMsg}</p>}
                {addErr && <p style={msgStyle(true)}>{addErr}</p>}
                <button onClick={handleAddProduct} style={saveButtonStyle}>Добавить</button>
              </div>
            )}

            {/* Edit product form */}
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
                  { label: "Изменить категорию", value: editCategory, setter: setEditCategory, type: "text" },
                  { label: "Изменить картинку", value: editImage, setter: setEditImage, type: "text" },
                  { label: "Изменить наличие", value: editStock, setter: setEditStock, type: "text" },
                ].map(({ label, value, setter, type }) => (
                  <div key={label} style={rowStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={inputStyle} />
                  </div>
                ))}
                {editMsg && <p style={msgStyle(false)}>{editMsg}</p>}
                {editErr && <p style={msgStyle(true)}>{editErr}</p>}
                <button onClick={handleEditProduct} style={saveButtonStyle}>Сохранить</button>
              </div>
            )}

            {/* Update user form */}
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
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}