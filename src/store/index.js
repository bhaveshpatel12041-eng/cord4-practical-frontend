import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vendorReducer from './slices/vendorSlice';
import payoutReducer from './slices/payoutSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        vendor: vendorReducer,
        payout: payoutReducer,
    },
});
