import { configureStore } from '@reduxjs/toolkit';
import cvReducer from './cvSlice';
import { errorMiddleware } from './errorMiddleware';

export const store = configureStore({
  reducer: {
    cv: cvReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
