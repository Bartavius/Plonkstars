import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AvatarState {
    hue: number,
    saturation: number,
    brightness: number,
}

const initialState: AvatarState = {
    hue: Math.floor(Math.random()*360),
    saturation: 90 + Math.floor(Math.random()*60),
    brightness: 90 + Math.floor(Math.random()*60),
}

const DemoAvatarSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setColor(state, action: PayloadAction<{hue:number,saturation:number,brightness:number}>) {
          state.hue = action.payload.hue;
          state.saturation = action.payload.saturation;
          state.brightness = action.payload.brightness;
        },
    }
})

export const { setColor } = DemoAvatarSlice.actions;

export default DemoAvatarSlice.reducer;