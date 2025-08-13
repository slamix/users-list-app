import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../types/types';

interface UserState {
  list: User[];
  page: number;
}

const initialState: UserState = {
  list: [],
  page: 2,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, { payload }) => {
      state.list = payload;
    },
    addUsers: (state, { payload }) => {
      state.list.push(...payload);
    },
    addUser: (state, { payload }) => {
      state.list.push(payload);
    },
    updateUser: (state, { payload }) => {
      const index = state.list.findIndex((u) => u.id === payload.id);
      if (index !== -1) {
        state.list[index] = payload;
      }
    },
    deleteUser: (state, { payload }) => {
      const newList = state.list.filter((user) => user.id !== payload.id);
      state.list = newList;
    },
    updatePage: (state) => {
      state.page += 1;
    }, 
  }
});

export const { setUsers, addUser, addUsers, updateUser, deleteUser, updatePage } = usersSlice.actions;
export default usersSlice.reducer;
