import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string; 
  preferences: string[];
}

interface UserState {
  user: UserData | null;
}

const initialState: UserState = {
  user: (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? (JSON.parse(stored) as UserData) : null;
    } catch (e) {
      console.error('Invalid user data in localStorage:', e);
      return null;
    }
  })(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
