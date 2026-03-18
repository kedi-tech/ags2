import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentClient } from "@/api/clients";

export type AuthClient = any;

type AuthState = {
  token: string | null;
  client: AuthClient | null;
};

type AuthContextValue = {
  client: AuthClient | null;
  token: string | null;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  updateClient: (patch: Partial<AuthClient>) => void;
  refreshClient: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    if (typeof window === "undefined") return { token: null, client: null };
    try {
      // New shape
      const rawAuth = window.localStorage.getItem("auth");
      if (rawAuth) {
        const parsed = JSON.parse(rawAuth);
        return {
          token: parsed.token ?? null,
          client: parsed.client ?? null,
        };
      }
      // Backward compatibility with older "client" only storage
      const rawClient = window.localStorage.getItem("client");
      if (rawClient) {
        return { token: null, client: JSON.parse(rawClient) };
      }
    } catch {
      // ignore
    }
    return { token: null, client: null };
  });

  // Persist auth state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!state.token && !state.client) {
        window.localStorage.removeItem("auth");
        window.localStorage.removeItem("client");
      } else {
        window.localStorage.setItem(
          "auth",
          JSON.stringify({ token: state.token, client: state.client })
        );
        // Keep "client" key for backward compatibility with existing code/data
        if (state.client) {
          window.localStorage.setItem("client", JSON.stringify(state.client));
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [state.token, state.client]);

  // On mount, if we have a token but no client, fetch the current client
  useEffect(() => {
    if (!state.token || state.client) return;

    let cancelled = false;

    (async () => {
      try {
        const me = await getCurrentClient(state.token as string);
        if (!cancelled) {
          setState((prev) => ({ ...prev, client: me }));
        }
      } catch (error) {
        console.error("Failed to load current client", error);
        if (!cancelled) {
          // Token invalid -> clear auth
          setState({ token: null, client: null });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state.token, state.client]);

  const loginWithToken = async (token: string) => {
    // Save token immediately
    setState((prev) => ({ ...prev, token }));
    try {
      const me = await getCurrentClient(token);
      setState({ token, client: me });
    } catch (error) {
      console.error("Login with token failed", error);
      setState({ token: null, client: null });
      throw error;
    }
  };

  const refreshClient = async () => {
    if (!state.token) return;
    try {
      const me = await getCurrentClient(state.token);
      setState((prev) => ({ ...prev, client: me }));
    } catch (error) {
      console.error("Failed to refresh current client", error);
    }
  };

  const logout = () => {
    setState({ token: null, client: null });
    try {
      window.localStorage.removeItem("auth");
      window.localStorage.removeItem("client");
    } catch {
      // ignore storage errors
    }
  };

  return (
    <AuthContext.Provider
      value={{
        client: state.client,
        token: state.token,
        loginWithToken,
        logout,
        updateClient: (patch: Partial<AuthClient>) =>
          setState((prev) => ({
            ...prev,
            client: prev.client ? { ...prev.client, ...patch } : prev.client,
          })),
        refreshClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

