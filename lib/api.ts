// lib/api.ts
import type { DeveloperAsk } from "@/types/bids";
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: "include", // required for cookie-based auth
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error: ApiError = { message: "An error occurred", status: response.status };
        try {
          const errorData = await response.json();
          error.message = errorData.detail || errorData.message || error.message;
          error.details = errorData;
        } catch {
          error.message = response.statusText;
        }
        throw error;
      }

      if (response.status === 204) {
        // no content
        return undefined as unknown as T;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) throw error;
      throw { message: "Network error occurred", status: 0, details: error } as ApiError;
    }
  }


  /* ================= HTTP HELPERS ================= */

  private get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  private post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
  /* ================= AUTH (Next.js API proxy) ================= */

  // Calls /api/auth/login Next.js route that sets httpOnly cookie
  async login(workflow: string, username: string, password: string) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ workflow, username, password }),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", { method: "POST" });
  }

  // server-side Next.js API reads cookie and forwards to backend /auth/me
  async getCurrentUser() {
    return this.request<{
      participant_id: string;
      workflow: string;
      role: string;
      display_name: string;
    }>("/api/auth/me");
  }

  /* ================= LAND / AUCTION / ADMIN / etc - backend v1 proxies ================= */

  async getLands(params?: { skip?: number; limit?: number; status?: string }) {
    const sp = new URLSearchParams();
    if (params?.skip) sp.append("skip", String(params.skip));
    if (params?.limit) sp.append("limit", String(params.limit));
    if (params?.status) sp.append("status", params.status || "");
    const q = sp.toString();
    return this.request<unknown[]>(`/api/v1/land${q ? `?${q}` : ""}`);
  }

  async getLandById(id: string) {
    return this.request<unknown>(`/api/v1/land/${id}`);
  }

  async createLand(data: unknown) {
    return this.request<unknown>("/api/v1/land", { method: "POST", body: JSON.stringify(data) });
  }

  async getAuctions(params?: { skip?: number; limit?: number; status?: string }) {
    const sp = new URLSearchParams();
    if (params?.skip) sp.append("skip", String(params.skip));
    if (params?.limit) sp.append("limit", String(params.limit));
    if (params?.status) sp.append("status", params.status || "");
    const q = sp.toString();
    return this.request<unknown[]>(`/api/v1/auction${q ? `?${q}` : ""}`);
  }

  async getAuctionById(id: string) {
    return this.request<unknown>(`/api/v1/auction/${id}`);
  }

  async placeBid(auctionId: string, amount: number) {
    return this.request<unknown>(`/api/v1/auction/${auctionId}/bid`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  }

  async getMyBids(params?: { skip?: number; limit?: number; status?: string }) {
    const sp = new URLSearchParams();
    if (params?.skip) sp.append("skip", String(params.skip));
    if (params?.limit) sp.append("limit", String(params.limit));
    if (params?.status) sp.append("status", params.status || "");
    const q = sp.toString();
    return this.request<unknown[]>(`/api/v1/auction/my-bids${q ? `?${q}` : ""}`);
  }

  async withdrawBid(auctionId: string, bidId: string) {
    return this.request<unknown>(`/api/v1/auction/${auctionId}/bid/${bidId}`, { method: "DELETE" });
  }

  async getPricing(landId: string) {
    return this.request<unknown>(`/api/v1/pricing/${landId}`);
  }

  async getUsers(params?: { skip?: number; limit?: number }) {
    const sp = new URLSearchParams();
    if (params?.skip) sp.append("skip", String(params.skip));
    if (params?.limit) sp.append("limit", String(params.limit));
    const q = sp.toString();
    return this.request<unknown[]>(`/api/v1/admin/users${q ? `?${q}` : ""}`);
  }

  async getKYCRequests(params?: { skip?: number; limit?: number; status?: string }) {
    const sp = new URLSearchParams();
    if (params?.skip) sp.append("skip", String(params.skip));
    if (params?.limit) sp.append("limit", String(params.limit));
    if (params?.status) sp.append("status", params.status || "");
    const q = sp.toString();
    return this.request<unknown[]>(`/api/v1/admin/kyc${q ? `?${q}` : ""}`);
  }

  async approveKYC(kycId: string) {
    return this.request<unknown>(`/api/v1/admin/kyc/${kycId}/approve`, { method: "POST" });
  }

  async rejectKYC(kycId: string, reason: string) {
    return this.request<unknown>(`/api/v1/admin/kyc/${kycId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  /* ================= SALEABLE (uses Next.js proxy already present) ================= */

  async getDeveloperAsk(projectId: string) {
    return this.request(`/api/saleable/projects/${projectId}/developer-ask`);
  }

  async getMyDeveloperAsk(projectId: string) {
    return this.request<{
      dcu_units: number;
      ask_price_per_unit_inr: number;
      state: string;
    } | null>(
      `/api/saleable/projects/${projectId}/developer-ask`
    );
  }

  async upsertDeveloperAsk(
    projectId: string,
    data: {
      dcu_units: number;
      ask_price_per_unit_inr: number;
      action: "save" | "submit";
    }
  ) {
    return this.request(
      `/api/saleable/projects/${projectId}/developer-ask`,
      {
        method: "POST",
        body: JSON.stringify({
          dcu_units: data.dcu_units,
          ask_price_per_unit_inr: data.ask_price_per_unit_inr,
        }),
      }
    );
  }

 async getMyBuyerQuote(projectId: string, t: number) {
    return this.request<
        {
            id: string;
            state: string;
            payload: { qbundle_inr: number };
            submitted_at: string | null;
            locked_at: string | null;
        }[]
    >(`/api/saleable/projects/${projectId}/buyer-quote?t=${t}`);
}

async upsertBuyerQuote(
    projectId: string,
    data: {
        t: number;
        qbundle_inr: number;
        action: "save" | "submit";
    }
) {
    return this.request(
        `/api/saleable/projects/${projectId}/buyer-quote?t=${data.t}`,
        {
            method: "POST",
            body: JSON.stringify({
                qbundle_inr: data.qbundle_inr,
                action: data.action,
            }),
        }
    );
}

  /* ================= ROUNDS (proxy control) ================= */
  // control via Next.js proxy: /api/rounds/control
  async openRound(workflow: string, projectId: string, windowStartIso?: string, windowEndIso?: string) {
    return this.request("/api/rounds/control", {
      method: "POST",
      body: JSON.stringify({ action: "open", workflow, projectId, bidding_window_start_iso: windowStartIso, bidding_window_end_iso: windowEndIso }),
    });
  }

  async closeRound(workflow: string, projectId: string, t: number) {
    return this.request("/api/rounds/control", {
      method: "POST",
      body: JSON.stringify({ action: "close", workflow, projectId, t }),
    });
  }

  async lockRound(workflow: string, projectId: string, t: number) {
    return this.request("/api/rounds/control", {
      method: "POST",
      body: JSON.stringify({ action: "lock", workflow, projectId, t }),
    });
  }

  async getCurrentRound(workflow: string, projectId: string) {
  return this.request<{
    workflow: string;
    projectId: string;
    current: {
      t: number;
      is_open: boolean;
      is_locked: boolean;
      state: string;
    };
  }>(`/api/rounds/current?workflow=${workflow}&projectId=${projectId}`);
}

async listRounds(workflow: string, projectId: string) {
  return this.request<
    {
      t: number;
      state: string;
      is_open: boolean;
      is_locked: boolean;
    }[]
  >(`/api/rounds/roundhistory?workflow=${workflow}&projectId=${projectId}`);
}


  /* ================= ADMIN / AUTHORITY ================= */

  async createParticipant(data: {
    workflow: string;
    username: string;
    password: string;
    role: string;
    display_name: string;
  }) {
    return this.request<{ id: string }>(
      "/api/admin/participants",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }


}

export const api = new ApiClient(API_BASE_URL);
export default api;
