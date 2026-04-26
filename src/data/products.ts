export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

export const products: Product[] = [
  { id: 1, name: "Эхинопсис", price: 450, category: "cacti", image: "" },
  { id: 2, name: "Маммилярия", price: 320, category: "cacti", image: "" },
  { id: 3, name: "Цереус", price: 580, category: "cacti", image: "" },
  { id: 4, name: "Опунция", price: 290, category: "cacti", image: "" },
  { id: 5, name: "Гимнокалициум", price: 410, category: "cacti", image: "" },
  { id: 6, name: "Трихоцереус", price: 670, category: "cacti", image: "" },
]

export const categories = [
  { id: "all", label: "Все растения" },
  { id: "cacti", label: "Кактусы" },
  { id: "succulents", label: "Суккуленты" },
  { id: "orchids", label: "Орхидеи" },
  { id: "strelitzia", label: "Стрелиции" },
];
