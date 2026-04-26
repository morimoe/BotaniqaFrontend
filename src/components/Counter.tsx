import "./Counter.css";

type CounterProps = {
  total: number;
  cartCount: number;
  favoritesCount: number;
};

export default function Counter({ total, cartCount, favoritesCount }: CounterProps) {
  return (
    <div className="counter-bar">
      <span>Товаров в каталоге: <strong>{total}</strong></span>
      <span>В избранном: <strong>{favoritesCount}</strong></span>
      <span>В корзине: <strong>{cartCount}</strong></span>
    </div>
  );
}