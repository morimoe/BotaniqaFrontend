import "../style/Searchbar.css";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  count: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
};

export default function SearchBar({ value, count, sort, onSortChange }: SearchBarProps) {
  return (
    <section className="searchbar-section" id="catalog">
      <div className="searchbar-inner">
        <p className="found-count">
          {value ? `Найдено: ${count} товаров` : `Все растения: ${count}`}
        </p>
        <div className="sort-buttons">
          <button
            className={`sort-btn ${sort === "default" ? "active" : ""}`}
            onClick={() => onSortChange("default")}
          >
            По умолчанию
          </button>
          <button
            className={`sort-btn ${sort === "price-asc" ? "active" : ""}`}
            onClick={() => onSortChange("price-asc")}
          >
            Дешевле ↑
          </button>
          <button
            className={`sort-btn ${sort === "price-desc" ? "active" : ""}`}
            onClick={() => onSortChange("price-desc")}
          >
            Дороже ↓
          </button>
          <button
            className={`sort-btn ${sort === "name-asc" ? "active" : ""}`}
            onClick={() => onSortChange("name-asc")}
          >
            А → Я
          </button>
          <button
            className={`sort-btn ${sort === "name-desc" ? "active" : ""}`}
            onClick={() => onSortChange("name-desc")}
          >
            Я → А
          </button>
        </div>
      </div>
    </section>
  );
}