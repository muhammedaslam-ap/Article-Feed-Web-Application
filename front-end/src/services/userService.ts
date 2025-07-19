import axios, { AxiosInstance } from "axios";
import { authAxiosInstance } from "../api/authAxiosInstance";
import {
  TChangePasswordInput,
  TUpdateUserProfileInput,
  TUpdateUserPreferencesInput,
  TUserProfile,
} from "@/types/user"; // Adjust path based on your project structure


export class UserService {
  private httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance = authAxiosInstance) {
    this.httpClient = httpClient;
  }

  async getUserProfile(userId: string) {
    try {
      const response = await this.httpClient.get<TUserProfile>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch user profile");
      }
      throw new Error("Unexpected error while fetching user profile");
    }
  }

  async updateUserProfile(userId: string, data: TUpdateUserProfileInput) {
    try {
      const response = await this.httpClient.put<TUserProfile>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update user profile");
      }
      throw new Error("Unexpected error while updating user profile");
    }
  }

  async updateUserPreferences(userId: string, data: TUpdateUserPreferencesInput) {
    try {
      const response = await this.httpClient.put<TUserProfile>(`/users/${userId}/preferences`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update user preferences");
      }
      throw new Error("Unexpected error while updating user preferences");
    }
  }

  async changePassword(data: TChangePasswordInput) {
    try {
      const response = await this.httpClient.post<{ message: string }>("/auth/reset-password", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to change password");
      }
      throw new Error("Unexpected error while changing password");
    }
  }
}

export const userService = new UserService();
