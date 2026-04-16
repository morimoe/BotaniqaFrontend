type Props = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SearchBar({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder="Поиск растения..."
    />
  )
}

export default SearchBar