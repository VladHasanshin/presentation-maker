import { describe, it, expect } from 'vitest';
import { addTextObject, addImageObject, removeObject, moveObject, resizeObject, updateTextObjectStyle } from '../functions/objects.js';
import { createPresentation } from '../functions/presentation.js';

describe('addTextObject', () => {
    it('Должен добавить новый текстовый объект в слайд', () => {
        const presentation = createPresentation('Text presentation');
        const slide = presentation.slides[0];
        const originalLength = slide.slideObjects.length;
        
        const textObject = {
            text: 'Тестик',
            x: 4,
            y: 5,
            width: 25,
            height: 30,
            fontFamily: 'Arial',
            fontSize: 10,
            fontColor: 'black'
        };
        
        const updatedSlide = addTextObject(slide, textObject);
        const newTextObject = updatedSlide.slideObjects[updatedSlide.slideObjects.length - 1];
        
        expect(slide.slideObjects.length).toBe(originalLength);
        expect(updatedSlide.slideObjects.length).toBe(originalLength + 1);
        expect(newTextObject).toMatchObject(textObject);
        expect(newTextObject.id).toBeDefined();
    });
});

describe('addImageObject', () => {
    it('Должен добавить новый объект с изображением в слайд', () => {
        const presentation = createPresentation('Text presentation');
        const slide = presentation.slides[0];
        const originalLength = slide.slideObjects.length;

        const imageObject = {
            src: 'https://test',
            x: 4,
            y: 5,
            width: 25,
            height: 30
        }
       
        const updatedSlide = addImageObject(slide, imageObject);
        const newImageObject = updatedSlide.slideObjects[updatedSlide.slideObjects.length - 1];
        
        expect(slide.slideObjects.length).toBe(originalLength);
        expect(updatedSlide.slideObjects.length).toBe(originalLength + 1);
        expect(newImageObject).toMatchObject(imageObject);
        expect(newImageObject.id).toBeDefined();
    });
});

describe('removeObject', () => {
    it('Должен убрать объект с слайда', () => {
        const presentation = createPresentation('Test presentation');
        const slide = presentation.slides[0];
        
        const textObject = {
            text: 'Тестик',
            x: 4,
            y: 5,
            width: 25,
            height: 30,
            fontFamily: 'Arial',
            fontSize: 10,
            fontColor: 'black'
        };
        
        const imageObject = {
            src: 'https://test',
            x: 4,
            y: 5,
            width: 25,
            height: 30
        };
        
        let updatedSlide = addTextObject(slide, textObject);
        updatedSlide = addImageObject(updatedSlide, imageObject);
        
        const objectIdToRemove = updatedSlide.slideObjects[updatedSlide.slideObjects.length - 1].id;
        const removedObjectSlide = removeObject(updatedSlide, objectIdToRemove);
        
        expect(slide.slideObjects.length).toBe(0);
        expect(removedObjectSlide.slideObjects.length).toBe(updatedSlide.slideObjects.length - 1);
        expect(removedObjectSlide.slideObjects.find(obj => obj.id === objectIdToRemove)).toBeUndefined();
    });
});

describe('moveObject', () => {
    it('Должен передвинуть объект на слайде', () => {
        const presentation = createPresentation('Text presentation');
        const slide = presentation.slides[0];

        const textObject = {
            text: 'Тестик',
            x: 4,
            y: 5,
            width: 25,
            height: 30,
            fontFamily: 'Arial',
            fontSize: 10,
            fontColor: 'black'
        };
        
        const imageObject = {
            src: 'https://test',
            x: 4,
            y: 5,
            width: 25,
            height: 30
        };

        const newPosition = { x: 10, y: 20 };
        
        let slideWithText = addTextObject(slide, textObject);
        const textObjectId = slideWithText.slideObjects[0].id;
        const movedTextSlide = moveObject(slideWithText, {objectId: textObjectId, newX: newPosition.x, newY: newPosition.y});
        const movedTextObject = movedTextSlide.slideObjects[0];
        
        expect(movedTextObject.x).toBe(newPosition.x);
        expect(movedTextObject.y).toBe(newPosition.y);
        
        let slideWithImage = addImageObject(slide, imageObject);
        const imageObjectId = slideWithImage.slideObjects[0].id;
        const movedImageSlide = moveObject(slideWithImage, {objectId: imageObjectId, newX: newPosition.x, newY: newPosition.y});
        const movedImageObject = movedImageSlide.slideObjects[0];

        expect(movedImageObject.x).toBe(newPosition.x);
        expect(movedImageObject.y).toBe(newPosition.y);
    });
});

describe('resizeObject', () => {
    it('Должен изменить размер объекта на слайде', () => {
        const presentation = createPresentation('Text presentation');
        const slide = presentation.slides[0];

        const textObject = {
            text: 'Тестик',
            x: 4,
            y: 5,
            width: 25,
            height: 30,
            fontFamily: 'Arial',
            fontSize: 10,
            fontColor: 'black'
        };
        
        const imageObject = {
            src: 'https://test',
            x: 4,
            y: 5,
            width: 25,
            height: 30
        };

        const newSize = { width: 10, height: 20 };
        
        let slideWithText = addTextObject(slide, textObject);
        const textObjectId = slideWithText.slideObjects[0].id;
        const movedTextSlide = resizeObject(slideWithText, {objectId: textObjectId, newWidth: newSize.width, newHeight: newSize.height});
        const movedTextObject = movedTextSlide.slideObjects[0];
        
        expect(movedTextObject.width).toBe(newSize.width);
        expect(movedTextObject.height).toBe(newSize.height);
        
        let slideWithImage = addImageObject(slide, imageObject);
        const imageObjectId = slideWithImage.slideObjects[0].id;
        const movedImageSlide = resizeObject(slideWithImage, {objectId: imageObjectId, newWidth: newSize.width, newHeight: newSize.height});
        const movedImageObject = movedImageSlide.slideObjects[0];

        expect(movedImageObject.width).toBe(newSize.width);
        expect(movedImageObject.height).toBe(newSize.height);
    });
});

describe('updateTextObjectStyle', () => {
    it('Должен изменить стиль текстового объект на слайде', () => {
        const presentation = createPresentation('Text presentation');
        const slide = presentation.slides[0];
        
        const textObject = {
            text: 'Тестик',
            x: 4,
            y: 5,
            width: 25,
            height: 30,
            fontFamily: 'Arial',
            fontSize: 10,
            fontColor: 'black'
        };

        const updatedSlide = addTextObject(slide, textObject);
        const objectId = updatedSlide.slideObjects[0].id;
        const newStyle = { fontFamily: 'test', fontSize: 20, fontColor: 'test'};
        const updatedStyleObjectSlide = updateTextObjectStyle(updatedSlide, {objectId: objectId, newFontFamily: newStyle.fontFamily, newFontSize: newStyle.fontSize, newFontColor: newStyle.fontColor});
        const updatedStyleObject = updatedStyleObjectSlide.slideObjects[0];

        expect(slide.slideObjects.length).toBe(0);
        expect(updatedStyleObjectSlide.slideObjects.length).toBe(1);
        if (updatedStyleObject.type === 'text') {
            expect(updatedStyleObject.fontFamily).toBe(newStyle.fontFamily);
            expect(updatedStyleObject.fontSize).toBe(newStyle.fontSize);
            expect(updatedStyleObject.fontColor).toBe(newStyle.fontColor);
        }
    });
});