import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../types/types';

type ActiveUser = User | null;

interface UserState {
  activeUser: ActiveUser;
}

const raw = typeof window !== 'undefined'
  ? localStorage.getItem('activeUser')
  : null;

const initialState: UserState = {
  activeUser: raw ? JSON.parse(raw) as ActiveUser : null,
};

const activeUserSlice = createSlice({
  name: 'activeUser',
  initialState,
  reducers: {
    setActiveUser: (state, { payload }) => {
      localStorage.setItem('activeUser', JSON.stringify(payload));
      state.activeUser = payload;
    },
    disableActiveUser: (state) => {
      localStorage.removeItem('activeUser');
      state.activeUser = null;
    },    
  }
});

export const { setActiveUser, disableActiveUser } = activeUserSlice.actions;
export default activeUserSlice.reducer;
