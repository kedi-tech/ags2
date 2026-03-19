const API_URL = import.meta.env.VITE_API_URL;

export type CreateOrderItem = {
  productId: string | number;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
};

export type CreateOrderPayload = {
  clientId: string | number;
  items: CreateOrderItem[];
  total: number;
  paymentMethod: string;
  address: string;
};

export const createOrder = async (
  token: string,
  payload: CreateOrderPayload,
) => {
  const response = await fetch(`${API_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Failed to create order (${response.status}): ${errorText || response.statusText}`,
    );
  }

  return response.json().catch(() => null);
};

export const cancelOrder = async (token: string, orderId: string | number) => {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Failed to cancel order (${response.status}): ${errorText || response.statusText}`,
    );
  }

  return response.json().catch(() => null);
};

