import { categories } from "../data/products";
import "../style/FilterButtons.css";

type FilterButtonsProps = {
  activeCategory: string;
  onSelect: (cat: string) => void;
};

export default function FilterButtons({ activeCategory, onSelect }: FilterButtonsProps) {
  return (
    <div className="filter-sidebar">
      {categories.slice(1).map((cat) => (
        <button
          key={cat.id}
          className={`filter-item ${activeCategory === cat.id ? "active" : ""}`}
          onClick={() => onSelect(activeCategory === cat.id ? "all" : cat.id)}
        >
          {cat.label} &gt;
        </button>
      ))}
    </div>
  );
}