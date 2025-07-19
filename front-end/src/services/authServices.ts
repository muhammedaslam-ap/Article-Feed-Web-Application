import axios from 'axios';
import { authAxiosInstance } from '../api/authAxiosInstance';
import { clearUser } from '@/redux/slice/userSlice';
import { store } from '@/redux/store';
import { toast } from 'sonner';

export interface IRegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  preferences: string[];
}

export const userAuthService = {
  async registerUser(data: IRegisterUserData) {
    try {
      const response = await authAxiosInstance.post("/auth/register/user", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        password: data.password,
        preferences: data.preferences,
        role: "user", 
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to register user');
      }
      throw new Error('Unexpected error during registration');
    }
  },

  async logoutUser() {
    try {
      const response = await authAxiosInstance.post("/auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("clientSession");
      store.dispatch(clearUser());
      toast.success("Logged out successfully");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to logout');
      }
      throw new Error('Unexpected error during logout');
    }
  },

  async verifyPassword(password: string) {
    try {
      const response = await authAxiosInstance.post("/verify-password", {
        password,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Password verification failed');
      }
      throw new Error('Unexpected error during password verification');
    }
  },
};