import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit';
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
    removeObjects as removeObjectsFn,
    moveObjects as moveObjectsFn,
    resizeObjects as resizeObjectsFn,
    updateTextObjectStyle as updateTextObjectStyleFn,
    updateTextContent as updateTextContentFn,
} from '../../functions/objects.js'

import {
    updatePresentationName as updatePresentationNameFn,
} from '../../functions/presentation.js';

export interface PresentationState {
    presentation: Presentation | null
}

const initialState: PresentationState = {
    presentation: null
}

function updateActiveSlide(state: PresentationState, transform: (slide: Slide) => Slide): void {
    if (!state.presentation || !state.presentation.activeSlide) return;
    const activeId = state.presentation.activeSlide;
    state.presentation.slides = state.presentation.slides.map(
        (slide) => slide.id === activeId ? transform(current(slide)) : slide
    );
}

function withActiveSlide(state: PresentationState, fn: (slide: Slide, ...args: any[]) => Slide, ...args: any[]): void {
    updateActiveSlide(state, (slide) => fn(slide, ...args));
}

const presentationSlice = createSlice({
    name: 'presentation',
    initialState,
    reducers: {
        setPresentation: (state, action: PayloadAction<Presentation>) => {
            state.presentation = action.payload;
        },
        // Нужен для middleware
        restorePresentation: (state, action: PayloadAction<Presentation>) => {
            state.presentation = action.payload;
        },
        setActiveSlide: (state, action: PayloadAction<string>) => {
            if (!state.presentation) return;
            state.presentation = setActiveSlideFn(current(state.presentation), action.payload);
        },
        updatePresentationName: (state, action: PayloadAction<string>) => {
            if (!state.presentation) return;
            state.presentation = updatePresentationNameFn(current(state.presentation), action.payload);
        },
        addSlide: (state, action: PayloadAction<{ slideName?: string }>) => {
            if (!state.presentation) return;
            state.presentation = addSlideFn(current(state.presentation), action.payload.slideName);
        },
        removeSlides: (state, action: PayloadAction<{ slideIds: string[] }>) => {
            if (!state.presentation) return;
            state.presentation = removeSlidesFn(current(state.presentation), action.payload.slideIds);
        },
        moveSlide: (state, action: PayloadAction<{ slideId: string; newIndex: number }>) => {
            if (!state.presentation) return;
            state.presentation = moveSlideFn(current(state.presentation), action.payload.slideId, action.payload.newIndex);
        },
        duplicateSlide: (state, action: PayloadAction<{ slideId: string }>) => {
            if (!state.presentation) return;
            state.presentation = duplicateSlideFn(current(state.presentation), action.payload.slideId);
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
            updateActiveSlide(state, (slide) => moveObjectsFn(slide, action.payload));
        },
        resizeObjects: (state, action: PayloadAction<ResizeObjectParams[]>) => {
            updateActiveSlide(state, (slide) => resizeObjectsFn(slide, action.payload));
        },
        removeObjects: (state, action: PayloadAction<string[]>) => {
            updateActiveSlide(state, (slide) => removeObjectsFn(slide, action.payload));
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
  restorePresentation,
  setActiveSlide,
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