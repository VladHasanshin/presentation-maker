import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Presentation } from "../../types/presentation.js";
import type { Slide } from '../../types/slide.js'
import type { 
    TextObjectInput, 
    ImageObjectInput, 
    MoveObjectParams,
    ResizeObjectParams,
    UpdateTextObjectStyleParams
} from '../../types/objects.js';
import type { GradientParams } from '../../types/slide.js';

import { 
    addSlide as addSlideFn, 
    removeSlides as removeSlidesFn,
    moveSlide as moveSlideFn,
    setActiveSlide as setActiveSlideFn,
    duplicateSlide as duplicateSlideFn,
    clearSlideBackground as clearSlideBackgroundFn,
    setSlideBackgroundColor as setSlideBackgroundColorFn,
    setSlideBackgroundGradient as setSlideBackgroundGradientFn,
    setSlideBackgroundImage as setSlideBackgroundImageFn  
} from '../../functions/slide.js';

import {
    addTextObject as addTextObjectFn,
    addImageObject as addImageObjectFn,
    removeObject as removeObjectFn,
    moveObject as moveObjectFn,
    resizeObject as resizeObjectFn,
    updateTextObjectStyle as updateTextObjectStyleFn,
    updateTextContent as updateTextContentFn,
} from '../../functions/objects.js'

import {
    updatePresentationName as updatePresentationNameFn,
} from '../../functions/presentation.js';

export interface PresentationState {
  presentation: Presentation | null;
  selectedObjectIds: string[];
  isPreviewMode: boolean
}

const initialState: PresentationState = {
    presentation: null,
    selectedObjectIds: [],
    isPreviewMode: false
}

function withActiveSlide(state: PresentationState, fn: (slide: Slide, ...args: any[]) => Slide, ...args: any[]): void {
    if (!state.presentation || !state.presentation.activeSlide) return;
    const activeId = state.presentation.activeSlide;
    state.presentation = {
        ...state.presentation,
        slides: state.presentation.slides.map((slide) => slide.id === activeId ? fn(slide, ...args) : slide)
    }
}

const presentationSlice = createSlice({
    name: 'presentation',
    initialState,
    reducers: {
        setPresentation: (state, action: PayloadAction<Presentation>) => {
            state.presentation = action.payload;
            state.selectedObjectIds = [];
        },
        setActiveSlide: (state, action: PayloadAction<string>) => {
            if (!state.presentation) return;
            state.presentation = setActiveSlideFn(state.presentation, action.payload);
            state.selectedObjectIds = [];
        },
        toggleSelectObject: (state, action: PayloadAction<string>) => {
            const index = state.selectedObjectIds.indexOf(action.payload);
            if (index === -1) {
                state.selectedObjectIds.push(action.payload);
            } else {
                state.selectedObjectIds.splice(index, 1);
            }
        },
        clearSelection: (state) => {
            state.selectedObjectIds = [];
        },
        setPreviewMode: (state, action: PayloadAction<boolean>) => {
            state.isPreviewMode = action.payload;
        },
        updatePresentationName: (state, action: PayloadAction<string>) => {
            if (!state.presentation) return;
            state.presentation = updatePresentationNameFn(state.presentation, action.payload);
        },
        addSlide: (state, action: PayloadAction<{ slideName?: string }>) => {
            if (!state.presentation) return;
            state.presentation = addSlideFn(state.presentation, action.payload.slideName);
            state.selectedObjectIds = [];
        },
        removeSlides: (state, action: PayloadAction<{ slideIds: string[] }>) => {
            if (!state.presentation) return;
            state.presentation = removeSlidesFn(state.presentation, action.payload.slideIds);
            state.selectedObjectIds = [];
        },
        moveSlide: (state, action: PayloadAction<{ slideId: string; newIndex: number }>) => {
            if (!state.presentation) return;
            state.presentation = moveSlideFn(state.presentation, action.payload.slideId, action.payload.newIndex);
        },
        duplicateSlide: (state, action: PayloadAction<{ slideId: string }>) => {
            if (!state.presentation) return;
            state.presentation = duplicateSlideFn(state.presentation, action.payload.slideId);
            state.selectedObjectIds = [];
        },
        setSlideBackgroundColor: (state, action: PayloadAction<string>) => {
            withActiveSlide(state, setSlideBackgroundColorFn, action.payload);
        },
        setSlideBackgroundImage: (state, action: PayloadAction<string>) => {
            withActiveSlide(state, setSlideBackgroundImageFn, action.payload);
        },
        setSlideBackgroundGradient: (state, action: PayloadAction<GradientParams>) => {
            withActiveSlide(state, setSlideBackgroundGradientFn, action.payload);
        },
        clearSlideBackground: (state) => {
            withActiveSlide(state, clearSlideBackgroundFn);
        },
        addTextObject: (state, action: PayloadAction<TextObjectInput>) => {
            withActiveSlide(state, addTextObjectFn, action.payload);
        },
        addImageObject: (state, action: PayloadAction<ImageObjectInput>) => {
            withActiveSlide(state, addImageObjectFn, action.payload);
        },
        moveObjects: (state, action: PayloadAction<MoveObjectParams[]>) => {
            for (const update of action.payload) {
                withActiveSlide(state, moveObjectFn, update);
            }
        },
        resizeObjects: (state, action: PayloadAction<ResizeObjectParams[]>) => {
            for (const update of action.payload) {
                withActiveSlide(state, resizeObjectFn, update);
            }
        },
        removeObjects: (state, action: PayloadAction<string[]>) => {
            for (const id of action.payload) {
                withActiveSlide(state, removeObjectFn, id);
            }
            state.selectedObjectIds = state.selectedObjectIds.filter((id) => !action.payload.includes(id));
        },
        updateTextObjectStyle: (state, action: PayloadAction<UpdateTextObjectStyleParams>) => {
            withActiveSlide(state, updateTextObjectStyleFn, action.payload);
        },
        updateTextContent: (state, action: PayloadAction<{ objectId: string; text: string }>) => {
            withActiveSlide(state, updateTextContentFn, action.payload);
        },
    }
});

export const {
  setPresentation,
  setActiveSlide,
  toggleSelectObject,
  clearSelection,
  setPreviewMode,
  updatePresentationName,
  addSlide,
  removeSlides,
  moveSlide,
  duplicateSlide,
  setSlideBackgroundColor,
  setSlideBackgroundImage,
  setSlideBackgroundGradient,
  clearSlideBackground,
  addTextObject,
  addImageObject,
  moveObjects,
  resizeObjects,
  removeObjects,
  updateTextObjectStyle,
  updateTextContent,
} = presentationSlice.actions;

export default presentationSlice.reducer;