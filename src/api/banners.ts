const API_URL = import.meta.env.VITE_API_URL;

export type Banner = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  btnLink?: string;
  isActive: boolean;
  publicId?: string;
  createdAt?: string;
  userId?: string;
  author?: { id: string; name: string; email: string };
};

export const getBanners = async (): Promise<Banner[]> => {
  const response = await fetch(`${API_URL}/api/v1/banners`);
  const data = await response.json();
  console.log('Fetched banners:', data);
  return data;
};
