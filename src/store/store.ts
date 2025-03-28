import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
