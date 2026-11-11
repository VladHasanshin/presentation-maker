import type { Presentation } from "./types/presentation.js";
import type { Slide } from "./types/slide.js";

let currentPresentation: Presentation | null = null;
let past: Presentation[] = [];
let future: Presentation[] = [];
let editorChangeHandler: Array<() => void> = [];
let snapshot: Presentation | null = null;

function addEditorChangeHandler(handler: () => void): () => void {
  editorChangeHandler.push(handler);
  return () => {
    editorChangeHandler = editorChangeHandler.filter((h) => h !== handler)
  }
}

function setInitialState(presentation: Presentation): void {
  currentPresentation = presentation;
  past = [];
  future = [];
}

function getState(): Presentation | null {
  return currentPresentation;
}

type Modifier<P = any> = (model: Presentation, params: P) => Presentation;
type ModifierSlide<P = any> = (slide: Slide, params: P) => Slide;

let modifierParams: any = null;

function dispatch(modifier: Modifier, params: any = null): void {
  if (!currentPresentation) {
    console.error('State is not initialized! Call setInitialState first.');
    return;
  }

  if (!snapshot) {
    past = [...past, currentPresentation];
    future = [];
  }

  modifierParams = params;
  currentPresentation = modifier(currentPresentation, params);
  
  if (editorChangeHandler) {
    editorChangeHandler.forEach((handler) => handler());
  }
}

function dispatchSlide(modifier: ModifierSlide, slideId: string, params: any = null): void {
  dispatch((presentation: Presentation) => {
    const slideExists = presentation.slides.findIndex((slide) => slide.id === slideId);
    if (slideExists === -1) {
      return presentation;
    }

    return {
      ...presentation,
      slides: presentation.slides.map((slide) => slide.id === slideId ? modifier(slide, params) : slide)
    }
  });
}

function undo(): void {
  endHistoryRecord();

  if (past.length === 0 || !currentPresentation) return;
  future = [currentPresentation, ...future];
  const previous = past[past.length - 1];
  past = past.slice(0, -1);
  currentPresentation = previous;
  if (editorChangeHandler) {
    editorChangeHandler.forEach((handler) => handler());
  }
}

function redo(): void {
  endHistoryRecord();

  if (future.length === 0 || !currentPresentation) return;
  past = [...past, currentPresentation];
  const next = future[0];
  future = future.slice(1);
  currentPresentation = next;
  if (editorChangeHandler) {
    editorChangeHandler.forEach((handler) => handler());
  }
}

function getCanUndo(): boolean { return past.length > 0; }

function getCanRedo(): boolean { return future.length > 0; }

function beginHistoryRecord(): void {
  if (!currentPresentation || snapshot) return;
  snapshot = currentPresentation;
}

function endHistoryRecord(): void {
  if (!snapshot || !currentPresentation) return;

  if (snapshot !== currentPresentation) {
    past = [...past, snapshot];
    future = [];
    editorChangeHandler.forEach((handler) => handler())
  }

  snapshot = null;
}

export { 
  setInitialState, 
  getState, 
  dispatch, 
  dispatchSlide, 
  addEditorChangeHandler,
  undo,
  redo,
  getCanUndo,
  getCanRedo,
  beginHistoryRecord,
  endHistoryRecord
};