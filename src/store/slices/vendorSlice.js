import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    vendors: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Get vendors
export const getVendors = createAsyncThunk('vendors/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/vendors');
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create new vendor
export const createVendor = createAsyncThunk('vendors/create', async (vendorData, thunkAPI) => {
    try {
        const response = await api.post('/vendors', vendorData);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const vendorSlice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {
        resetVendorState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVendors.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getVendors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.vendors = action.payload;
            })
            .addCase(getVendors.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createVendor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createVendor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.vendors.push(action.payload);
            })
            .addCase(createVendor.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetVendorState } = vendorSlice.actions;
export default vendorSlice.reducer;
