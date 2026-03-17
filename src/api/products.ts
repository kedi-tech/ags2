const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/api/v1/products`);
  const data = await response.json();
  console.log("products", data);
  return data;
};

// get products by id
export const getProductById = async (id: string) => {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`);
  const data = await response.json();
  console.log("product", data);
  return data;
};