import { describe, it, expect } from 'vitest';
import { addSlide, removeSlides, moveSlide, setActiveSlide, duplicateSlide, setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient, clearSlideBackground } from '../functions/slide.js';
import { createPresentation } from '../functions/presentation.js';

describe('addSlide', () => {
    it('Должен добавить новый слайд с/без имени в презентации', () => {
        const presentation = createPresentation('Test presentation');
        const originalLength = presentation.slides.length;

        const updatedPresentation1 = addSlide(presentation);
        const newSlideWithoutName = updatedPresentation1.slides[updatedPresentation1.slides.length - 1];
        expect(newSlideWithoutName.name).toBe(`Слайд ${originalLength + 1}`);

        const updatedPresentation2 = addSlide(presentation, 'Тест');
        const newSlideWithName = updatedPresentation2.slides[updatedPresentation2.slides.length - 1];
        expect(newSlideWithName.name).toBe('Тест');

        expect(updatedPresentation2.slides.length).toBe(originalLength + 1);
        expect(presentation.slides.length).toBe(originalLength);
    });
});

describe('removeSlides', () => { 
    it('Должен убрать слайды с презентации', () => {
        const presentation = createPresentation('Test presentation');
        const originalLength = presentation.slides.length;
        let updatedPresentation = addSlide(presentation);
        updatedPresentation = addSlide(updatedPresentation);
        updatedPresentation = addSlide(updatedPresentation);
        
        const slideToRemove1 = updatedPresentation.slides[1].id;
        const slideToRemove2 = updatedPresentation.slides[2].id;
        let result = removeSlides(updatedPresentation, [slideToRemove1, slideToRemove2]);
        expect(result.slides.length).toBe(originalLength + 1);
        
        const slideToRemove3 = updatedPresentation.slides[1].id;
        result = removeSlides(updatedPresentation, [slideToRemove3]);
        expect(result.slides.length).toBe(originalLength + 2);
        
        expect(presentation.slides.length).toBe(originalLength);
    });
});

describe('moveSlide', () => {
    it('Должен переместить слайд на презентации', () => {
        const presentation = createPresentation('Test presentation');
        const originalLength = presentation.slides.length;
        let updatedPresentation = addSlide(presentation);
        updatedPresentation = addSlide(updatedPresentation);
        updatedPresentation = addSlide(updatedPresentation);
        const originalSlideOrder = updatedPresentation.slides.map(s => s.id);
        const slideToMove = updatedPresentation.slides[1].id;
        const movedSlidePresentation = moveSlide(updatedPresentation, slideToMove, 3);
        const resultSlideOrder = movedSlidePresentation.slides.map(s => s.id);
        expect(resultSlideOrder).not.toEqual(originalSlideOrder);
        expect(movedSlidePresentation.slides[3].id).toBe(slideToMove);
        expect(presentation.slides.length).toBe(originalLength);
        expect(updatedPresentation.slides.length).toBe(originalLength + 3);
        expect(movedSlidePresentation.slides.length).toBe(originalLength + 3);
    });
});

describe('setActiveSlide', () => {
    it('Должен поставить данный слайд активным для презентации', () => {
        const presentation = createPresentation('Test presentation');
        const originalLength = presentation.slides.length;
        let updatedPresentation = addSlide(presentation);
        const slideId = updatedPresentation.slides[1].id;
        updatedPresentation = setActiveSlide(updatedPresentation, slideId);
        expect(presentation.slides.length).toBe(originalLength);
        expect(updatedPresentation.slides.length).toBe(originalLength + 1);
        expect(updatedPresentation.activeSlide).toBe(slideId);
    });
});

describe('duplicateSlide', () => {
    it('Должен дублировать слайд на презентации', () => {
        const presentation = createPresentation('Test presentation');
        const originalLength = presentation.slides.length;
        const updatedPresentation = addSlide(presentation);
        const slideToDuplicateId = updatedPresentation.slides[1].id;
        const duplicateSlidePresentation = duplicateSlide(updatedPresentation, slideToDuplicateId);
        const duplicatedSlideId = duplicateSlidePresentation.slides[2].id;
        expect(presentation.slides.length).toBe(originalLength);
        expect(updatedPresentation.slides.length).toBe(originalLength + 1);
        expect(duplicateSlidePresentation.slides.length).toBe(originalLength + 2);
        expect(duplicateSlidePresentation.slides[1].name).toBe(duplicateSlidePresentation.slides[2].name);
        expect(slideToDuplicateId).not.toBe(duplicatedSlideId);
    });
});
// Сделать общую проверку
describe('slideBackground', () => {
    it('Должен поставить новые обои на слайд/убрать их с слайда', () => {
        const presentation = createPresentation('Test presentation');
        const slide = presentation.slides[0];
        const originalBackground = slide.background;

        const color = 'white';
        const colorSlide = setSlideBackgroundColor(slide, color);
        expect(colorSlide.background).toEqual({ type: 'color', color });

        const src = 'https://test';
        const imageSlide = setSlideBackgroundImage(slide, src);
        expect(imageSlide.background).toEqual({ type: 'image', src });

        const colors = ['white', 'red', 'green'];
        const angle = 45;
        const gradientWithAngleSlide = setSlideBackgroundGradient(slide, colors, angle);
        expect(gradientWithAngleSlide.background).toEqual({ type: 'gradient', colors, angle });

        const gradientWithoutAngleSlide = setSlideBackgroundGradient(slide, colors);
        expect(gradientWithoutAngleSlide.background).toEqual({ type: 'gradient', colors, angle: undefined});

        const clearSlide = clearSlideBackground(slide);
        expect(clearSlide.background).toBeUndefined();

        expect(slide.background).toEqual(originalBackground);
    });
});