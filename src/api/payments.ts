const API_URL = import.meta.env.VITE_API_URL;

type GeneratePaymentLinkResponse = {
  orderId?: string;
  paymentId?: string;
  amountToPay?: number;
  expiresAt?: string;
  linkUrl?: string;
  payment_url?: string;
  paymentUrl?: string;
  [key: string]: unknown;
};

export type GeneratedPaymentLink = {
  orderId?: string;
  paymentId: string;
  paymentUrl: string;
  amountToPay?: number;
  expiresAt?: string;
};

export type PaymentStatusResponse = {
  id?: string;
  paymentId?: string;
  status?: string;
  [key: string]: unknown;
};

export const cancelOrderForPayment = async (
  token: string,
  orderId: string | number,
) => {
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
  const paymentId = data.paymentId;

  if (!url) {
    throw new Error("Payment link not found in response (missing payment_url).");
  }
  if (!paymentId) {
    throw new Error("Payment ID not found in response (missing paymentId).");
  }

  return {
    orderId: data.orderId,
    paymentId,
    paymentUrl: String(url),
    amountToPay:
      typeof data.amountToPay === "number" ? data.amountToPay : undefined,
    expiresAt: data.expiresAt,
  } satisfies GeneratedPaymentLink;
};

export const getPaymentStatus = async (
  token: string,
  paymentId: string,
): Promise<PaymentStatusResponse> => {
  const response = await fetch(`${API_URL}/api/v1/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Failed to get payment status (${response.status}): ${
        errorText || response.statusText
      }`,
    );
  }

  return (await response.json().catch(() => ({}))) as PaymentStatusResponse;
};

