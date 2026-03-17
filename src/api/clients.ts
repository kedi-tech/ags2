const API_URL = import.meta.env.VITE_API_URL;

export type RegisterClientPayload = {
  name: string;
  type: "INDIVIDUAL" | "COMPANY";
  email: string;
  password: string;
  phone: string;
  address: string;
};

async function handleResponse(response: Response) {
  const contentType = response.headers.get("Content-Type") || "";
  const hasJson = contentType.includes("application/json");
  const data = hasJson ? await response.json() : null;
  console.log("auth response data", data);

  if (!response.ok) {
    const error: any = new Error("Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const registerClient = async (payload: RegisterClientPayload) => {
  const response = await fetch(`${API_URL}/api/v1/clients/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const loginClient = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/v1/clients/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
};

export const getCurrentClient = async (token: string) => {
  const response = await fetch(`${API_URL}/api/v1/clients/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const updateClientInfos = async (
  token: string,
  payload: Partial<RegisterClientPayload>,
) => {
  const response = await fetch(`${API_URL}/api/v1/clients/updateClientInfos`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};



