const API_URL = import.meta.env.VITE_API_URL;

type GeneratePaymentLinkResponse = {
  payment_url?: string;
  paymentUrl?: string;
  [key: string]: unknown;
};

export const generatePaymentLink = async (
  token: string,
  orderId: string | number,
) => {
  const response = await fetch(`${API_URL}/api/v1/payments/generatePaymentLink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Failed to generate payment link (${response.status}): ${
        errorText || response.statusText
      }`,
    );
  }

  const data = (await response.json().catch(() => ({}))) as GeneratePaymentLinkResponse;
  const url = data.payment_url || data.paymentUrl || data.linkUrl;

  if (!url) {
    throw new Error("Payment link not found in response (missing payment_url).");
  }

  return url;
};

