import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
    error: string | undefined ;
    loginRequiredUrl: string|undefined;
}

const initialState: ErrorState = {
    error: undefined,
    loginRequiredUrl: undefined,
}

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError(state, action: PayloadAction<string>) {
            if(state.error === undefined){
                state.error = action.payload;
            }
        },
        clearError(state) {
            state.error = undefined;
        },
        setBlockedURL(state, action: PayloadAction<string>) {
            state.loginRequiredUrl = action.payload;
        },
        clearBlockedURL(state) {
            state.loginRequiredUrl = undefined;
        },
    }
})

export const { setError,clearError,setBlockedURL,clearBlockedURL } = errorSlice.actions;

export default errorSlice.reducer;