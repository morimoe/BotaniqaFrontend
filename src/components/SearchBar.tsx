import "../style/Searchbar.css";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  count: number;
};

export default function SearchBar({ value, count }: SearchBarProps) {
  return (
    <section className="searchbar-section" id="catalog">
      <div className="searchbar-inner">
        {value ? (
          <p className="found-count">Найдено: {count} товаров</p>
        ) : (
          <p className="found-count">Все растения: {count}</p>
        )}
      </div>
    </section>
  );
}