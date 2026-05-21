const API_URL = "https://localhost:7266";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/api/product/all`);
  if (!response.ok) throw new Error("Ошибка загрузки продуктов");
  return response.json();
};