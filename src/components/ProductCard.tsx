import { useState } from "react"

type Props = {
  name: string
  price: number
  image: string
}

function ProductCard({ name, price, image }: Props) {
  const [liked, setLiked] = useState(false)

  return (
    <div>
      <img src={image} alt={name} width={300} height={200} style={{objectFit: "cover"}} />
      <h3>{name}</h3>
      <p>{price} MDL</p>
      <button onClick={() => setLiked(!liked)}>
        {liked ? "❤️ Liked" : "🤍 Like"}
      </button>
    </div>
  )
}

export default ProductCard