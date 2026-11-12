import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { restorePresentation } from './presentationSlice';
import type { Presentation } from '@/types/presentation';
import type { AppDispatch, RootState } from '..';

export interface HistoryState {
    past: Presentation[];
    future: Presentation[];
    canUndo: boolean;
    canRedo: boolean;
}

const initialState: HistoryState = {
    past: [],
    future: [],
    canUndo: false,
    canRedo: false
};

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        pushHistory: (state, action: PayloadAction<Presentation>) => {
            state.past = [...state.past, action.payload];
            state.future = [];
            state.canUndo = true;
            state.canRedo = false;
        },
        undo: (state, action: PayloadAction<Presentation>) => {
            if (state.past.length === 0) return;
            state.past = state.past.slice(0, -1);
            state.future = [action.payload, ...state.future];
            state.canUndo = state.past.length > 0;
            state.canRedo = true;
        },
        redo: (state) => {
            if (state.future.length === 0) return;
            const next = state.future[0];
            state.future = state.future.slice(1);
            state.past = [...state.past, next];
            state.canUndo = true;
            state.canRedo = state.future.length > 0;
        },
        clearHistory: (state) => {
            state.past = [];
            state.future = [];
            state.canUndo = false;
            state.canRedo = false;
        }    
    }
});

export const {
    pushHistory,
    undo: undoAction,
    redo: redoAction,
    clearHistory
} = historySlice.actions;

export const undo = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const {past} = getState().history;
    if (past.length === 0) return;

    const current = getState().presentation.presentation;
    if (!current) return;
    const previous = past[past.length - 1];

    dispatch(undoAction(current));
    dispatch(restorePresentation(previous));
};

export const redo = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const {future} = getState().history;
    if (future.length === 0) return;

    const next = future[0];
    
    dispatch(redoAction());
    dispatch(restorePresentation(next));
};
    
export default historySlice.reducer;