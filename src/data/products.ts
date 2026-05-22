export type Product = {
  id: number;
  productName: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
};

export const categories = [
  { id: "all", label: "Все растения" },
  { id: "cacti", label: "Кактусы" },
  { id: "succulents", label: "Суккуленты" },
  { id: "orchids", label: "Орхидеи" },
  { id: "strelitzia", label: "Стрелиции" },
];