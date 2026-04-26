import { useState } from "react";
import { type Product } from "../data/products";
import "../style/ProductCard.css";

type ProductCardProps = Product & {
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
};

export default function ProductCard({
  name,
  price,
  image,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: ProductCardProps) {
  const [inCart, setInCart] = useState(false);

  const handleCart = () => {
    setInCart(true);
    onAddToCart();
    setTimeout(() => setInCart(false), 1000);
  };

  return (
    <div className="product-card">
      <div className="card-image-wrap">
        {image ? (
          <img src={image} alt={name} className="card-image" />
        ) : (
          <div className="card-image-placeholder">placeholder</div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-name">{name}</h3>
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
            >
              {inCart ? "✓" : "Купить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}