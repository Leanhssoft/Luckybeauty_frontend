import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
export const storeApp = configureStore({
    reducer: {
        auth: authReducer
    }
});

export type RootState = ReturnType<typeof storeApp.getState>;
export type AppDispatch = typeof storeApp.dispatch;
