export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

export const products: Product[] = [
  { id: 1, name: "Эхинопсис", price: 450, category: "cacti", image: "https://rastenievod.com/wp-content/uploads/2016/12/1-36.jpg" },
  { id: 2, name: "Маммилярия", price: 320, category: "cacti", image: "https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/545501/IKfnaC80kYZDUeSV63EpKQ.jpg?s=YaKfE" },
  { id: 3, name: "Цереус", price: 580, category: "cacti", image: "https://yaskravaklumba.com.ua/image/cache/catalog/komnatnye/kaktusi/cereus-435x435.jpg" },
  { id: 4, name: "Опунция", price: 290, category: "cacti", image: "https://s4.stc.all.kpcdn.net/family/wp-content/uploads/2021/12/opuntsiya-5-scaled.jpg" },
  { id: 5, name: "Гимнокалициум", price: 410, category: "cacti", image: "https://krrot.net/wp-content/uploads/2019/11/Gimnokalitsium-v-domashnih-usloviyah.jpg" },
  { id: 6, name: "Трихоцереус", price: 670, category: "cacti", image: "https://i.pinimg.com/736x/27/34/a7/2734a74f380fb196729a6b56435c21c7.jpg" },

  { id: 7, name: "Молодило", price: 670, category: "succulents", image: "https://cdn2.botanichka.ru/wp-content/uploads/2010/02/houseleek-1-07-1068x708.jpg" },
]


export const categories = [
  { id: "all", label: "Все растения" },
  { id: "cacti", label: "Кактусы" },
  { id: "succulents", label: "Суккуленты" },
  { id: "orchids", label: "Орхидеи" },
  { id: "strelitzia", label: "Стрелиции" },
];
