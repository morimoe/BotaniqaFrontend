import { useState } from "react"
import { products } from "./data/products"
import SearchBar from "./components/SearchBar"
import ProductList from "./components/ProductList"
import Counter from "./components/Counter"
import Header from "./components/Header"
import "./App.css"

function App() {
  const [search, setSearch] = useState("")

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
       <Header />
      <SearchBar value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
      <Counter count={filtered.length} />
      <ProductList products={filtered} />
    </div>
  )
}

export default App