import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import activeUserReducer from './activeUserSlice';
import modalsReducer from './modalsSlice'

const state = configureStore({
  reducer: {
    users: usersReducer,
    activeUser: activeUserReducer,
    modals: modalsReducer,
  }
});

export type RootState = ReturnType<typeof state.getState>;
export type AppDispatch = typeof state.dispatch;

export default state;
