type Props = {
  count: number
}

function Counter({ count }: Props) {
  return (
    <p>Найдено: {count} товаров</p>
  )
}

export default Counter