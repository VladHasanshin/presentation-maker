import type { Presentation } from '../../../types/presentation.js'
import { dispatch } from '../../../editor.js';
import { SlidePreview } from '../SlidePreview/SlidePreview.js'
import { setActiveSlide, removeSlides } from '../../../functions/slide.js';
import styles from './SlideList.module.css'

interface SlideListProps {
    presentation: Presentation;
}

function handleSelect(slideId: string): void {
    dispatch(setActiveSlide, slideId)
}

function handleRemove(event: React.MouseEvent, slideId: string): void {
    event.preventDefault();
    const confirmed = confirm('Удалить слайд?');
    if (confirmed) {
        dispatch(removeSlides, [slideId])
    }
} 

function SlideList({presentation}: SlideListProps) {
    return (
        <div className={styles.list}>
            {presentation.slides.map((slide) => {
                const isActive = slide.id === presentation.activeSlide;
                return (
                    <div
                        key={slide.id}
                        className={`${styles.item} ${isActive ? styles.activeItem : ''}`}
                        onClick={() => handleSelect(slide.id)}
                        onContextMenu={(e) => handleRemove(e, slide.id)}
                    >
                        <div className={styles.thumbnailWrapper}>
                            <SlidePreview slide={slide} scale={0.15} />
                        </div>
                    </div>
                );
            })}
        </div>
    )

}

export {
    SlideList
}