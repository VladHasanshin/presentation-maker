import type { Presentation } from '../../types/presentation.js';
import type { MoveObjectParams, ResizeObjectParams } from '../../types/objects.js';
import type { Background, Slide } from '../../types/slide.js';
import { beginHistoryRecord, dispatchSlide, endHistoryRecord } from '../../editor.js';
import { useEffect, useState } from 'react';
import { moveObject, removeObject, resizeObject, updateTextContent, updateTextObjectStyle } from '../../functions/objects.js';
import { useFitScale } from '../../hooks/useFitScale.js';
import { SlidePreview } from '../Slides/SlidePreview/SlidePreview.js';
import { SlideProperties } from '../SlideProperties/SlideProperties.js';
import styles from './Workspace.module.css';

interface WorkspaceProps {
  presentation: Presentation;
}

type TransientTextStyle = {
  objectId: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
};

function withTransient(
  slide: Slide,
  background: Background | null,
  textStyle: TransientTextStyle | null
): Slide {
  let next = slide;

  if (background) {
    next = { ...next, background };
  }

  if (textStyle) {
    next = {
      ...next,
      slideObjects: next.slideObjects.map((obj) =>
        obj.id === textStyle.objectId && obj.type === 'text'
          ? {
              ...obj,
              fontFamily: textStyle.fontFamily,
              fontSize: textStyle.fontSize,
              fontColor: textStyle.fontColor,
            }
          : obj
      ),
    };
  }

  return next;
}

function Workspace({presentation}: WorkspaceProps) {
  const { ref, scale } = useFitScale();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [transientBackground, setTransientBackground] = useState<Background | null>(null);
  const [transientTextStyle, setTransientTextStyle] = useState<TransientTextStyle | null>(null);

  const activeSlide = presentation.slides.find(
    (slide) => slide.id === presentation.activeSlide,
  );
  
  const previewSlide = activeSlide
    ? withTransient(activeSlide, transientBackground, transientTextStyle)
    : undefined;

  function handleTextChange(objectId: string, text: string): void {
    if (!activeSlide) return;
    dispatchSlide(updateTextContent, activeSlide.id, { objectId, text });
  }

  function handleSelectObject(objectId: string, shiftKey: boolean) {
    if (!shiftKey) {
      setSelectedIds([objectId]);
      return;
    }

    setSelectedIds((prev) => {
      if (prev.includes(objectId)) {
        return prev.filter((id) => id !== objectId);
      }
      return [...prev, objectId];
    });
  }
  
  function handleEmptyClick() {
    setSelectedIds([]);
  }

  function handleObjectsMove(updates: MoveObjectParams[]) {
    if (!activeSlide) return;
    beginHistoryRecord();
    for (const update of updates) {
      dispatchSlide(moveObject, activeSlide.id, update);
    }
    endHistoryRecord();
  }

  function handleObjectsResize(updates: ResizeObjectParams[]) {
    if (!activeSlide) return;
    beginHistoryRecord();
    for (const update of updates) {
      dispatchSlide(resizeObject, activeSlide.id, update);
    }
    endHistoryRecord();
  }

  function handleBackgroundPreview(bg: Background) {
    setTransientBackground(bg);
  }

  function handleBackgroundPreviewEnd() {
    setTransientBackground(null);
  }

  function handleTextStylePreview(objectId: string, fontFamily: string, fontSize: number, fontColor: string) {
    setTransientTextStyle({ objectId, fontFamily, fontSize, fontColor });
  }

  function handleTextStyleChange(objectId: string, newFontFamily: string, newFontSize: number, newFontColor: string) {
    if (!activeSlide) return;
    dispatchSlide(updateTextObjectStyle, activeSlide.id, {objectId, newFontFamily, newFontSize, newFontColor});
    setTransientTextStyle(null);
  }

  useEffect(() => {
    setSelectedIds([]);
    setTransientBackground(null);
    setTransientTextStyle(null);
  }, [activeSlide?.id]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.key == 'Delete' || e.key == 'Backspace') && activeSlide && selectedIds.length > 0) {
        const element = document.activeElement;
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || (element as HTMLElement).isContentEditable === true) {
          return;
        }
        
        e.preventDefault();

        beginHistoryRecord();

        for (const id of selectedIds) {
          dispatchSlide(removeObject, activeSlide.id, id);
        }

        endHistoryRecord();

        setSelectedIds([]);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlide?.id, selectedIds]);

  return (
    <div className={styles.workspace}>
      <div className={styles.slideArea} ref={ref}>
        {previewSlide 
        ? <SlidePreview 
            slide={previewSlide}
            scale={scale} 
            selectedIds={selectedIds} 
            onTextChange={handleTextChange} 
            onObjectClick={handleSelectObject} 
            onEmptyClick={handleEmptyClick} 
            onObjectsMove={handleObjectsMove} 
            onObjectsResize={handleObjectsResize}
          />
        : <p className={styles.empty}>Слайд не выбран</p>
        }
      </div>

      <div className={styles.propertiesArea}>
        {activeSlide 
        ? <SlideProperties
            selectedIds={selectedIds} 
            slide={activeSlide}
            onBackgroundPreview={handleBackgroundPreview}
            onBackgroundPreviewEnd={handleBackgroundPreviewEnd}
            onObjectStylePreview={handleTextStylePreview}
            onObjectStyle={handleTextStyleChange}
          />
        : <p className={styles.empty}>Слайд не выбран</p>
        }
      </div>
    </div>
  );
}

export { 
  Workspace 
};