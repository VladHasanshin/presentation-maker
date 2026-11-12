import type { RootState } from './index.js';
import type { Slide } from '@/types/slide.js';

export const getPresentation = (state: RootState) => state.presentation.presentation;
export const getActiveSlide = (state: RootState): Slide | null => {
    const presentation = state.presentation.presentation;
    if (!presentation) return null;
    return presentation.slides.find(s => s.id === presentation.activeSlide) ?? null;
};
export const getSelectedObjectIds = (state: RootState) => state.presentation.selectedObjectIds;
export const getIsPreviewMode = (state: RootState) => state.presentation.isPreviewMode;

export const getCanUndo = (state: RootState) => state.history.canUndo;
export const getCanRedo = (state: RootState) => state.history.canRedo;