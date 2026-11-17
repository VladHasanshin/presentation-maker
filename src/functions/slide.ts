import type { Slide, GradientParams } from "../types/slide.js";
import type { Presentation } from "../types/presentation.js";
import { generateId } from "./generateId.js";

function createDefaultSlide(slideName: string): Slide {
    return {
        id: generateId(),
        name: slideName,
        slideObjects: [],
        background: undefined
    };
}

// Работа со слайдами
function addSlide(presentation: Presentation, slideName?: string): Presentation {
    const clonedPresentation = structuredClone(presentation);
    const newSlide = createDefaultSlide(slideName || `Слайд ${presentation.slides.length + 1}`);
    clonedPresentation.slides.push(newSlide);
    clonedPresentation.activeSlide = newSlide.id;
    return clonedPresentation;
}

function removeSlides(presentation: Presentation, slideIds: string[]): Presentation {
    const clonedPresentation = structuredClone(presentation);
    clonedPresentation.slides = clonedPresentation.slides.filter(slide => !slideIds.includes(slide.id));
    if (clonedPresentation.activeSlide && slideIds.includes(clonedPresentation.activeSlide)) {
        clonedPresentation.activeSlide = clonedPresentation.slides.length
            ? clonedPresentation.slides[0].id
            : null;
    }
    return clonedPresentation;
}

function moveSlide(presentation: Presentation, slideId: string, newIndex: number): Presentation {
    const currentIndex = presentation.slides.findIndex(slide => slide.id === slideId);
    if (currentIndex === -1) {
        return presentation;
    }
    const targetIndex = Math.max(0, Math.min(newIndex, presentation.slides.length - 1))
    if (currentIndex === targetIndex) {
        return presentation;
    }
    const clonedPresentation = structuredClone(presentation);
    const removedElements = clonedPresentation.slides.splice(currentIndex, 1);
    const slideToMove = removedElements[0];
    clonedPresentation.slides.splice(targetIndex, 0, slideToMove);
    return clonedPresentation;
}

function setActiveSlide(presentation: Presentation, slideId: string): Presentation {
    const slideExist = presentation.slides.findIndex(slide => slide.id === slideId);
    if (slideExist === -1 || presentation.activeSlide === slideId) {
        return presentation;
    }
    const clonedPresentation = structuredClone(presentation);
    clonedPresentation.activeSlide = slideId;
    return clonedPresentation;
}

function duplicateSlide(presentation: Presentation, slideId: string): Presentation {
    const currentIndex = presentation.slides.findIndex(slide => slide.id === slideId);
    if (currentIndex === -1) {
        return presentation;
    }
    const clonedPresentation = structuredClone(presentation)
    const newSlide = structuredClone(clonedPresentation.slides[currentIndex]);
    newSlide.id = generateId();
    clonedPresentation.slides.splice(currentIndex + 1, 0, newSlide);
    clonedPresentation.activeSlide = newSlide.id;
    return clonedPresentation;
}

// Работа с фоном слайда
function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    const clonedSlide = structuredClone(slide);
    clonedSlide.background = { 
        type: 'color', 
        color 
    };
    return clonedSlide;
}

function setSlideBackgroundImage(slide: Slide, imageUrl: string): Slide {
    const clonedSlide = structuredClone(slide);
    clonedSlide.background = { 
        type: 'image', 
        src: imageUrl
    };
    return clonedSlide;
}

function setSlideBackgroundGradient(slide: Slide, {colors, angle, gradientType}: GradientParams): Slide {
    const clonedSlide = structuredClone(slide);
    clonedSlide.background = { 
        type: 'gradient', 
        colors, 
        angle: angle ?? 0,
        gradientType: gradientType ?? 'linear' 
    };
    return clonedSlide;
}

function clearSlideBackground(slide: Slide): Slide {
    const clonedSlide = structuredClone(slide);
    clonedSlide.background = undefined;
    return clonedSlide;
}

export {
    addSlide,
    removeSlides,
    moveSlide,
    setActiveSlide,
    duplicateSlide,
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground
}