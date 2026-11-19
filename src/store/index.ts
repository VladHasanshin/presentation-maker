import { configureStore } from "@reduxjs/toolkit";
import presentationReducer from './slices/presentationSlice.js';
import historyReducer from './slices/historySlice.js';
import uiReducer from './slices/uiSlice.js'
import { historyMiddleware } from "./middleware.js";

export const store = configureStore({
    reducer: {
        presentation: presentationReducer,
        history: historyReducer,
        ui: uiReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(historyMiddleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;