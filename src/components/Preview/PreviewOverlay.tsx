import type { Presentation } from '../../types/presentation.js'
import { useState, useEffect } from 'react';
import { SlidePreview } from '../Slides/SlidePreview/SlidePreview.js';
import { Button } from '../UI/Button/Button.js';
import { useFitScale } from '../../hooks/useFitScale.js';
import styles from './PreviewOverlay.module.css'

interface PreviewOverlayProps {
    presentation: Presentation;
    onClose: () => void;
}

function PreviewOverlay({presentation, onClose}: PreviewOverlayProps) {
    const slidesCount = presentation.slides.length;
    const lastIndex = Math.max(slidesCount - 1, 0);

    const [index, setIndex] = useState(() => {
        const activeIndex = presentation.slides.findIndex((slide) => slide.id === presentation.activeSlide);
        return activeIndex === -1 ? 0 : activeIndex
    });

    const {ref, scale} = useFitScale();

    function handlePrev() {
        setIndex((i) => Math.max(i - 1, 0));
    }
    function handleNext() {
        setIndex((i) => Math.min(i + 1, lastIndex));
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent): void {
            if (e.key === 'ArrowRight') {
                setIndex((i) => Math.min(i + 1, lastIndex))
            } else if (e.key === 'ArrowLeft') {
                setIndex((i) => Math.max(i - 1, 0))
            } else if (e.key === 'Escape') {
                onClose();
            }
        }
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lastIndex, onClose])

    const currentSlide = presentation.slides[index];

    return (
        <div className={styles.overlay}>
            <div className={styles.top}>
                <Button text='Закрыть' onClick={onClose} />
            </div>
            <div className={styles.stage} ref={ref}>
                {currentSlide 
                ? <SlidePreview slide={currentSlide} scale={scale}/>
                : <p>Нет слайдов</p>
                }
            </div>
            <div className={styles.nav}>
                <Button text='Назад' onClick={handlePrev} disabled={index === 0}/>
                {slidesCount 
                ? <span className={styles.counter}>{index + 1} / {slidesCount}</span>
                : <span className={styles.counter}>0 / 0</span>
                }
                <Button text='Далее' onClick={handleNext} disabled={index === lastIndex}/>
            </div>
        </div>
    )
}

export {
    PreviewOverlay
}