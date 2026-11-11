import type { Presentation } from "../types/presentation.js";
import type { Slide } from "../types/slide.js";
import { generateId } from "./generateId.js";

function createDefaultSlide(): Slide {
    return {
        id: generateId(),
        name: "Слайд 1",
        slideObjects: [],
        background: undefined
    };
}

// Работа с презентацией
function createPresentation(name: string): Presentation {
    const defaultSlide = createDefaultSlide();
    return {
        id: generateId(),
        name,
        slides: [defaultSlide],
        activeSlide: defaultSlide.id
    };
}
 
function updatePresentationName(presentation: Presentation, name: string): Presentation {
    const clonedPresentation = structuredClone(presentation)
    clonedPresentation.name = name;
    return clonedPresentation;
}

function savePresentation(presentation: Presentation): string {
    return JSON.stringify(presentation, null, 2);
}

function loadPresentation(json: string): Presentation {
    return JSON.parse(json) as Presentation;
}

export {
    createPresentation,
    updatePresentationName,
    savePresentation,
    loadPresentation
}