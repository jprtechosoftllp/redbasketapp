import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from '../slice/vendorSlice';

export const store = configureStore({
  reducer: {
    vendors: vendorReducer ,
    // other slices can be added here
  },
});

// Infer types for use across your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
