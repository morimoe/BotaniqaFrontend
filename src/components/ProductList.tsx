import ProductCard from "./ProductCard"
import type { Product } from "../data/products"

type Props = {
  products: Product[]
}

function ProductList({ products }: Props) {
  return (
    <div>
      {products.map(p => (
        <ProductCard
          key={p.id}
          name={p.name}
          price={p.price}
          image={p.image}
        />
      ))}
    </div>
  )
}

export default ProductList