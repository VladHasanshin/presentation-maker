import type { Presentation } from '@/types/presentation.js'
import { ChangeEvent, useCallback, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks.js';
import {
    addSlide,
    updatePresentationName,
    addTextObject,
    addImageObject
} from '@/store/slices/presentationSlice.js';
import { savePresentation } from '@/functions/presentation.js';
import { Button } from '../UI/Button/Button.js';
import { TextInput } from '../UI/TextInput/TextInput.js';
import { createDefaultTextObject, createDefaultImageObject } from '@/functions/objects.js';
import styles from './Toolbar.module.css'

interface ToolbarProps {
    presentation: Presentation;
    canUndo: boolean;
    canRedo: boolean;
    onPreview: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onExportPdf: () => void
}

function Toolbar({presentation, canUndo, canRedo, onPreview, onUndo, onRedo, onExportPdf}: ToolbarProps) {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeSlideId = presentation.activeSlide;
    
    function handleSave(): void {
        const json = savePresentation(presentation);
        localStorage.setItem('presentation', json);
    }

    function handleAddImage(): void {
        if (!activeSlideId) {
            alert('Сначала выберите слайд');
            return;
        }
        fileInputRef.current?.click();
    }

    function handleAddText(): void {
        if (!activeSlideId) {
            alert('Сначала выберите слайд');
            return;
        }
        dispatch(addTextObject(createDefaultTextObject()));
    }
    
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const file = e.target.files?.[0];
        
        if (!file || !activeSlideId) {
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            alert('Разрешимые форматы изображений: JPEG, PNG, WEBP');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                dispatch(addImageObject(createDefaultImageObject(reader.result)));
            }
        }
        reader.readAsDataURL(file);

        e.target.value = '';
    }, [activeSlideId])

    return (
        <div className={styles.toolbar}>
            <TextInput
                type='text'
                value={presentation.name}
                placeholder='Презентация'
                onChange={(name) => dispatch(updatePresentationName(name))}
                style={{ maxWidth: 180, minWidth: 100 }}
            />
            <Button
                text='↩ Отменить'
                onClick={onUndo}
                disabled={!canUndo}
            />
            <Button
                text='↪ Повторить'
                onClick={onRedo}
                disabled={!canRedo}
            />
            <Button
                text='Добавить слайд'
                onClick={() => dispatch(addSlide({}))}
            />
            <Button
                text='Добавить изображение'
                onClick={handleAddImage}
            />
            <Button 
                text = "Добавить текст" 
                onClick={handleAddText}
            />
            <Button
                text='Сохранить'
                onClick={handleSave}
            />
            <Button
                text='Экспорт PDF'
                onClick={onExportPdf}
            />
            <Button
                text='Просмотр'
                onClick={onPreview}
            />
            <input 
                type="file" 
                ref={fileInputRef}
                accept='image/*'
                className={styles.hidden}
                onChange={handleFileChange}
            />
        </div>
    )
}

export {
    Toolbar
}