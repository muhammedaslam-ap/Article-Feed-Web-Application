import { useSelector } from "react-redux"; // Assuming Redux is used
import type { RootState } from "@/redux/store"; // Adjust the import based on your store setup

const API_BASE_URL = import.meta.env.VITE_AUTH_BASEURL || "http://localhost:3000"; // Adjust as per your backend URL


const AUTH_TOKEN = "mock-auth-token-123";
// Function to get userId from Redux or local storage
let user

export function GetUserId(): string | null {
   user = useSelector((state: RootState) => state.user.user);
  if (user?._id) {
    console.log("hwlloe")
    return user._id;
  }



  // Fallback to local storage
  const userIdFromStorage = localStorage.getItem("userId");
  if (userIdFromStorage) {
    return userIdFromStorage;
  }

  console.warn("No userId found in Redux or local storage.");
  return null; // Return null if no userId is available
}

export function getAuthToken(): string {
  return AUTH_TOKEN; // Replace with Redux/local storage logic in a real app
}

export async function fetcher<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: any,
  token?: string,
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const authToken = token || getAuthToken();
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
    cache: "no-store", // Disable caching for dynamic data
  };

  if (data && (method === "POST" || method === "PUT")) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetcher error:", error);
    throw error;
  }
}