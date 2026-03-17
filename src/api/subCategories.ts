const API_URL = import.meta.env.VITE_API_URL;

export const getSubCategories = async () => {
  const response = await fetch(`${API_URL}/api/v1/subCategories`);
  const data = await response.json();
  return data;
};

