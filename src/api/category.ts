const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/api/v1/categories`);
  const data = await response.json();
  console.log("categories", data);
  return data;
};