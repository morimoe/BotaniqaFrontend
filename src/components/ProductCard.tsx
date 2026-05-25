import { useState } from "react";
import "../style/ProductCard.css";

type ProductCardProps = {
  id: number;
  productName: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  cartQuantity: number; // ← новый проп
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
};

export default function ProductCard({
  productName,
  description,
  price,
  stock,
  image,
  cartQuantity, // ← новый проп
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: ProductCardProps) {
  const [inCart, setInCart] = useState(false);

  const isOutOfStock = stock === 0;
  const isLimitReached = cartQuantity >= stock;

  const handleCart = () => {
    if (isLimitReached) return;
    setInCart(true);
    onAddToCart();
    setTimeout(() => setInCart(false), 1000);
  };

  return (
    <div className="product-card">
      <div className="card-image-wrap">
        {image ? (
          <img src={image} alt={productName} className="card-image" />
        ) : (
          <div className="card-image-placeholder">placeholder</div>
        )}
        {description && (
          <div className="card-tooltip">{description}</div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-name">{productName}</h3>

        {/* Предупреждения о stock */}
        {isOutOfStock && (
          <p style={{ fontFamily: "Caveat, cursive", fontSize: "0.9rem", color: "red", margin: "2px 0" }}>
            ❌ Нет в наличии
          </p>
        )}
        {!isOutOfStock && stock <= 5 && (
          <p style={{ fontFamily: "Caveat, cursive", fontSize: "0.9rem", color: "#b85c00", margin: "2px 0" }}>
            ⚠️ Осталось {stock} шт.
          </p>
        )}

        <div className="card-footer">
          <span className="card-price">{price} MDL</span>
          <div className="card-actions">
            <button
              className={`like-btn ${isFavorite ? "liked" : ""}`}
              onClick={onToggleFavorite}
              title={isFavorite ? "Убрать из избранного" : "В избранное"}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
            <button
              className={`cart-btn ${inCart ? "added" : ""}`}
              onClick={handleCart}
              disabled={isLimitReached}
              title={isOutOfStock ? "Нет в наличии" : isLimitReached ? `Максимум ${stock} шт.` : "Купить"}
              style={isLimitReached ? { opacity: 0.45, cursor: "not-allowed" } : {}}
            >
              {inCart ? "✓" : isOutOfStock ? "Нет" : "Купить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}