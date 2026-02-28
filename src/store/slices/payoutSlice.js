import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    payouts: [],
    payout: null,
    auditTrail: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Get all payouts (with optional filters)
export const getPayouts = createAsyncThunk('payouts/getAll', async (filters, thunkAPI) => {
    try {
        let url = '/payouts';
        if (filters) {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.vendor_id) params.append('vendor_id', filters.vendor_id);
            url += `?${params.toString()}`;
        }
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get payout details
export const getPayoutDetails = createAsyncThunk('payouts/getDetails', async (id, thunkAPI) => {
    try {
        const response = await api.get(`/payouts/${id}`);
        return response.data; // { payout, auditTrail }
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create payout
export const createPayout = createAsyncThunk('payouts/create', async (payoutData, thunkAPI) => {
    try {
        const response = await api.post('/payouts', payoutData);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Submit payout
export const submitPayout = createAsyncThunk('payouts/submit', async (id, thunkAPI) => {
    try {
        const response = await api.post(`/payouts/${id}/submit`);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Approve payout
export const approvePayout = createAsyncThunk('payouts/approve', async (id, thunkAPI) => {
    try {
        const response = await api.post(`/payouts/${id}/approve`);
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Reject payout
export const rejectPayout = createAsyncThunk('payouts/reject', async ({ id, decision_reason }, thunkAPI) => {
    try {
        const response = await api.post(`/payouts/${id}/reject`, { decision_reason });
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const payoutSlice = createSlice({
    name: 'payout',
    initialState,
    reducers: {
        resetPayoutState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
        clearPayoutDetails: (state) => {
            state.payout = null;
            state.auditTrail = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Payouts
            .addCase(getPayouts.pending, (state) => { state.isLoading = true; })
            .addCase(getPayouts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.payouts = action.payload;
            })
            .addCase(getPayouts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Payout Details
            .addCase(getPayoutDetails.pending, (state) => { state.isLoading = true; })
            .addCase(getPayoutDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.payout = action.payload.payout;
                state.auditTrail = action.payload.auditTrail;
            })
            .addCase(getPayoutDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Action handlers (Create, Submit, Approve, Reject can just refresh the individual or list state typically)
            // I'll just check success states for these to trigger toast or navigation
            .addCase(createPayout.pending, (state) => { state.isLoading = true; })
            .addCase(createPayout.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(createPayout.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(submitPayout.pending, (state) => { state.isLoading = true; })
            .addCase(submitPayout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.payout = action.payload;
            })
            .addCase(submitPayout.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(approvePayout.pending, (state) => { state.isLoading = true; })
            .addCase(approvePayout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.payout = action.payload;
            })
            .addCase(approvePayout.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(rejectPayout.pending, (state) => { state.isLoading = true; })
            .addCase(rejectPayout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.payout = action.payload;
            })
            .addCase(rejectPayout.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetPayoutState, clearPayoutDetails } = payoutSlice.actions;
export default payoutSlice.reducer;
