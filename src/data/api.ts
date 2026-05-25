const API_URL = "http://localhost:5029";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/api/product/all`);
  if (!response.ok) throw new Error("Ошибка загрузки продуктов");
  return response.json();
};

export const updateMe = async (data: {
  username?: string;
  email?: string;
  password?: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/user/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления данных");
  return response.json();
};