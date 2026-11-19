import type { Slide } from "../types/slide.js";
import { generateId } from "./generateId.js";
import type { TextObjectInput, ImageObjectInput, MoveObjectParams, ResizeObjectParams, UpdateTextObjectStyleParams } from "../types/objects.js";

// Работа с объектами на слайде

function addTextObject(slide: Slide, textObject: TextObjectInput): Slide {
    const clonedSlide = structuredClone(slide);
    clonedSlide.slideObjects.push({
        id: generateId(),
        type: 'text',
        ...textObject
    })
    return clonedSlide;
}

function addImageObject(slide: Slide, imageObject: ImageObjectInput): Slide {
    const clonedSlide = structuredClone(slide);
    clonedSlide.slideObjects.push({
        id: generateId(),
        type: 'image',
        ...imageObject
    })
    return clonedSlide;
}

function removeObjects(slide: Slide, objectIds: string[]): Slide {
    if (objectIds.length === 0) return slide;
    const clonedSlide = structuredClone(slide);
    clonedSlide.slideObjects = clonedSlide.slideObjects.filter(object => !objectIds.includes(object.id));
    return clonedSlide;
}

function moveObjects(slide: Slide, updates: MoveObjectParams[]): Slide {
    if (updates.length === 0) return slide;
    const clonedSlide = structuredClone(slide);
    for (const {objectId, newX, newY} of updates) {
        const object = clonedSlide.slideObjects.find((obj) => obj.id === objectId);
        if (!object) continue;
        if (newX !== undefined) {
            object.x = newX;
        }
        if (newY !== undefined) {
            object.y = newY;
        }
    };
    return clonedSlide;
}

function resizeObjects(slide: Slide, updates: ResizeObjectParams[]): Slide {
    if (updates.length === 0) return slide;
    const clonedSlide = structuredClone(slide);
    for (const {objectId, newWidth, newHeight} of updates) {
        const object = clonedSlide.slideObjects.find((obj) => obj.id === objectId);
        if (!object) continue;
        if (newWidth !== undefined) {
            object.width = newWidth;
        }
        if (newHeight !== undefined) {
            object.height = newHeight;
        }
    }
    return clonedSlide;
}

function updateTextObjectStyle(slide: Slide, {objectId, newFontFamily, newFontSize, newFontColor}: UpdateTextObjectStyleParams): Slide {
    const clonedSlide = structuredClone(slide);
    const object = clonedSlide.slideObjects.find(object => object.id === objectId);
    if (!object || object.type !== 'text') {
        return slide;
    }
    if (newFontFamily !== undefined) {
        object.fontFamily = newFontFamily;
    }
    if (newFontSize !== undefined) {
        object.fontSize = newFontSize;
    }
    if (newFontColor !== undefined) {
        object.fontColor = newFontColor;
    }
    return clonedSlide; 
}

function updateTextContent(slide: Slide, params: {objectId: string; text: string}): Slide {
    const clonedSlide = structuredClone(slide);
    const obj = clonedSlide.slideObjects.find((object) => object.id === params.objectId);
    if (obj?.type === 'text') {
        obj.text = params.text;
    }
    return clonedSlide;
}

function createDefaultTextObject(): TextObjectInput {
    return {
        text: 'Новый текст',
        x: 100,
        y: 100,
        width: 400,
        height: 80,
        fontFamily: 'Arial',
        fontSize: 32,
        fontColor: '#000000',
    };
}

function createDefaultImageObject(src: string): ImageObjectInput {
    return {
        src,
        x: 200,
        y: 150,
        width: 300,
        height: 200,
    };
}

export {
    addTextObject,
    addImageObject,
    removeObjects,
    moveObjects,
    resizeObjects,
    updateTextObjectStyle,
    updateTextContent,
    createDefaultImageObject,
    createDefaultTextObject
}