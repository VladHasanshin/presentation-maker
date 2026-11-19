import type { RootState } from './index.js';

export const getPresentation = (state: RootState) => state.presentation.presentation
export const getPreview = (state: RootState) => state.ui.isPreviewMode;
export const getCanUndo = (state: RootState) => state.history.canUndo;
export const getCanRedo = (state: RootState) => state.history.canRedo;