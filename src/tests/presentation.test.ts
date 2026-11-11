import { describe, it, expect } from 'vitest';
import { createPresentation, updatePresentationName, savePresentation, loadPresentation } from '../functions/presentation.js';

describe('createPresentation', () => {
    it('Должен создать презентацию с дефолтным слайдом', () => {
        const presentation = createPresentation('My Presentation');
        expect(presentation.name).toBe('My Presentation');
        expect(presentation.slides.length).toBe(1);
    });
});

describe('updatePresentationName', () => {
    it('Должен поменять имя презентации', () => {
        const presentation = createPresentation('My Presentation');
        const updatedPresentation = updatePresentationName(presentation, 'New Name');
        expect(presentation.name).toBe('My Presentation');
        expect(updatedPresentation.name).toBe('New Name');
    });
});

describe('savePresentation', () => {
    it('Должен сохранить JSON презентации', () => {
        const presentation = createPresentation('My Presentation');
        const presentationJSON = savePresentation(presentation);
        expect(typeof presentationJSON).toBe('string');
        expect(presentationJSON).toContain('My Presentation');
    });
});

describe('loadPresentation', () => {
    it('Должен загрузить JSON презентации', () => {
        const presentation = createPresentation('My Presentation');
        const presentationJSON = savePresentation(presentation);
        const loaded = loadPresentation(presentationJSON);
        expect(loaded).toEqual(presentation);
    })
})