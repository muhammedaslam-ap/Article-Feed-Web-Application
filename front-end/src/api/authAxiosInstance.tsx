import axios from "axios";
import { store } from "../redux/store";
import { clearUser } from "../redux/slice/userSlice";
import { toast } from "sonner";

export const authAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASEURL || "http://localhost:3000/api",
  withCredentials: true,
});

let isRefreshing = false;

authAxiosInstance.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user)?.token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

authAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const userDatas = localStorage.getItem("user");
    const isUser = !!userDatas;

    // Network error
    if (!error.response && error.request) {
      toast.error("Network error: Unable to connect to the server");
      return Promise.reject(new Error("Network error"));
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response.data.message === "Unauthorized access."
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await authAxiosInstance.post("/auth/refresh-token");
          const { token } = refreshResponse.data;
          localStorage.setItem(
            "user",
            JSON.stringify({ ...(JSON.parse(userDatas || "{}")), token })
          );
          authAxiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
          isRefreshing = false;
          return authAxiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          if (isUser) {
            store.dispatch(clearUser());
            localStorage.removeItem("user");
            toast.info("Session expired. Please login again.");
            window.location.href = "/auth";
          }
          return Promise.reject(refreshError);
        }
      }
    }

    if (
      error.response?.status === 403 &&
      error.response.data.message?.includes("blocked")
    ) {
      if (isUser) {
        store.dispatch(clearUser());
        localStorage.removeItem("user");
        toast.info("Your account has been blocked.");
        window.location.href = "/auth";
      }
      return Promise.reject(error);
    }

    toast.error(error.response?.data?.message || "Unexpected error occurred");
    return Promise.reject(error);
  }
);
