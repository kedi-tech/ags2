const API_URL = import.meta.env.VITE_API_URL;

export type PromoCodeResult = {
  id: string;
  code: string;
  discountType?: "PERCENTAGE" | "FIXED";
  type?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  value?: number;
  discount?: number;
  discountAmount?: number;
  isValid?: boolean;
  [key: string]: unknown;
};

export const validatePromoCode = async (
  code: string,
  orderAmount: number,
  token?: string,
): Promise<PromoCodeResult> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/code-promos/validate`, {
      method: "POST",
      headers,
      body: JSON.stringify({ code, orderAmount }),
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err.name === "AbortError") throw new Error("La requête a expiré. Vérifiez votre connexion.");
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const msg =
      data?.message || data?.error || "Code promo invalide ou expiré.";
    throw new Error(msg);
  }

  const data = await response.json();
  console.log("[PromoCode API response]", data);
  return data;
};
