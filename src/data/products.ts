export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

export const products: Product[] = [
  {id: 1 , name: "Монстера" , price: 150, category: "tropical" , image: "/u2.jpg"} , 
   {id: 2 , name: "Тилландсия" , price: 150, category: "tropical" , image:"/Тилландсия.jpg"},
    {id: 3 , name: "Земляничное дерево" , price: 150, category: "tree" , image: "/Земляничное дерево.jpg"},
       {id: 4 , name: "Эвкалипт" , price: 150, category: "tree" , image: "/Эвкалипт.jpg"},
         {id: 5 , name: "Стрелиция" , price: 150, category: "flower" , image:"/Стрелиция.jpg"},
           {id: 6 , name: "Кактус" , price: 150, category: "cactus" , image:"/кактус.jpg"}
]