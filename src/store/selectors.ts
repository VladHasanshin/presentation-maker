import type { RootState } from './index.js';

export const getCanUndo = (state: RootState) => state.history.canUndo;
export const getCanRedo = (state: RootState) => state.history.canRedo;