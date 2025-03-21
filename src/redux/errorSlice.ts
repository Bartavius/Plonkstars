import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
    error: string | null;
    loginRequiredUrl: string|null;
}

const initialState: ErrorState = {
    error: null,
    loginRequiredUrl: null,
}

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        setBlockedURL(state, action: PayloadAction<string>) {
            state.loginRequiredUrl = action.payload;
        },
        clearBlockedURL(state) {
            state.loginRequiredUrl = null;
        },
    }
})

export const { setError,clearError,setBlockedURL,clearBlockedURL } = errorSlice.actions;

export default errorSlice.reducer;