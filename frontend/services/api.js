import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const TOKEN_KEY = "dailymind_token";
const USER_KEY = "dailymind_user";

// Central Axios client so all requests share the same base URL and auth behavior.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      const isAuthRequest = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");

      if (!isAuthRequest) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export const saveAuth = (payload) => {
  if (typeof window === "undefined") return;

  const token = payload?.token || payload?.data?.token;
  const user = payload?.user || payload?.data?.user || payload?.data?.existingUser;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  const rawUser = localStorage.getItem(USER_KEY);

  try {
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const searchUsers = async (query) => {
  const { data } = await api.get("/auth/users/search", {
    params: { q: query }
  });
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/auth/users/${id}`);
  return data;
};

export const getFacts = async () => {
  const { data } = await api.get("/facts");
  return data;
};

export const getAIFacts = async () => {
  const { data } = await api.get("/ai/facts");
  return data;
};

export const createFact = async (payload) => {
  const { data } = await api.post("/facts", payload);
  return data;
};

export const likeFact = async (id) => {
  const { data } = await api.post(`/facts/${id}/like`);
  return data;
};

export const addCommentToFact = async (id, payload) => {
  const { data } = await api.post(`/facts/${id}/comment`, payload);
  return data;
};

export default api;
