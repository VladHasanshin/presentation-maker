import { SlidePreview } from '../SlidePreview/SlidePreview.js';
import { setActiveSlide, removeSlides, duplicateSlide, moveSlide } from '@/store/slices/presentationSlice.js';
import styles from './SlideList.module.css';
import { useAppDispatch } from '@/store/hooks.js';
import { useSelector } from 'react-redux';
import { getPresentation } from '@/store/selectors.js';
import { useEffect, useState } from 'react';

function SlideList() {
    const presentation = useSelector(getPresentation);
    const dispatch = useAppDispatch();
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, slideId: string } | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    function handleSelect(e: React.MouseEvent, slideId: string): void {
        if (e.ctrlKey) {
            setSelectedIds((prev) =>
                prev.includes(slideId)
                    ? prev.filter((id) => id !== slideId)
                    : [...prev, slideId]
            );
            return;
        }
        setSelectedIds([slideId]);
        dispatch(setActiveSlide(slideId));
    }

    function handleDuplicate(): void {
        if (!contextMenu) return;
        dispatch(duplicateSlide({ slideId: contextMenu.slideId}));
        setContextMenu(null);
    }

    function handleRemove(): void {
        if (!contextMenu) return;
        const ids = selectedIds.includes(contextMenu.slideId) ? selectedIds : [contextMenu.slideId];
        const confirmed = confirm(`Удалить ${ids.length > 1 ? `${ids.length} слайдов?` : 'слайд?'}`);
        if (confirmed) {
            dispatch(removeSlides({ slideIds: ids }));
            setSelectedIds([]);
        }
    }

    function handleContextMenu(event: React.MouseEvent, slideId: string): void {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY, slideId })
    }

    useEffect(() => {
        if (!contextMenu) return;

        function close() {
            setContextMenu(null);
        }

        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') close();
        }
        
        window.addEventListener('click', close);
        window.addEventListener('keydown', handleKey);
        return () => {
            window.removeEventListener('click', close);
            window.removeEventListener('keydown', handleKey)
        }
    }, [contextMenu])

    if (!presentation) return null;
    return (
        <div className={styles.list}>
            {presentation.slides.map((slide, index) => {
                const isActive = slide.id === presentation.activeSlide;
                return (
                    <div
                        key={slide.id}
                        className={`${styles.item} ${isActive ? styles.activeItem : ''} ${selectedIds.includes(slide.id) ? styles.selectedItem : ''}`}
                        onClick={(e) => handleSelect(e, slide.id)}
                        onContextMenu={((e) => handleContextMenu(e, slide.id))}
                        draggable
                        onDragStart={() => setDraggedId(slide.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                            if (!draggedId) return;
                            dispatch(moveSlide({slideId: draggedId, newIndex: index}))
                            setDraggedId(null);
                        }}
                    >
                        <div className={styles.thumbnailWrapper}>
                            <SlidePreview slide={slide} scale={0.15} />
                        </div>
                    </div>
                );
            })}
            {contextMenu && (
                <div
                    className={styles.contextMenu}
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    <button className={styles.contextMenuItem} onClick={handleDuplicate}>
                        Дублировать слайд
                    </button>
                    <button className={styles.contextMenuItem} onClick={handleRemove}>
                        Удалить слайд
                    </button>
                </div>
            )}
        </div>
    )

}

export {
    SlideList
}