import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface UIState {
    isPreviewMode: boolean 
}

const initialState: UIState = {
    isPreviewMode: false 
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setPreviewMode: (state, action: PayloadAction<boolean>) => {
            state.isPreviewMode = action.payload;
        }
    }
});

export const { setPreviewMode } = uiSlice.actions;

export default uiSlice.reducer