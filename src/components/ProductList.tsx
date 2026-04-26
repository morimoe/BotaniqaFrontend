import type { Product } from "../data/products";
import ProductCard from "./ProductCard";
import "../style/ProductList.css";

type ProductListProps = {
  products: Product[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  favorites: number[];
  cartMap: Record<number, number>;
  onAddToCart: (id: number) => void;
  onToggleFavorite: (id: number) => void;
};

export default function ProductList({
  products,
  favorites,
  onAddToCart,
  onToggleFavorite,
}: ProductListProps) {
  return (
    <section className="catalog-section">
      <div className="catalog-inner">
        <div className="catalog-grid-wrap">
          {products.length === 0 ? (
            <div className="empty-state">
            </div>
          ) : (
            <div className="catalog-grid">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  {...p}
                  isFavorite={favorites.includes(p.id)}
                  onAddToCart={() => onAddToCart(p.id)}
                  onToggleFavorite={() => onToggleFavorite(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}