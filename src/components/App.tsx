import { Toolbar } from './Toolbar/Toolbar.js';
import { SlideList } from './Slides/SlideList/SlideList.js';
import { SlidePreview } from './Slides/SlidePreview/SlidePreview.js';
import { Workspace } from './Workspace/Workspace.js';
import { PreviewOverlay } from './Preview/PreviewOverlay.js';
import { useEffect } from 'react';
import { useHistoryUI } from '@/hooks/useHistoryUI.js';
import { usePdfExport } from '@/hooks/usePdfExport.js';
import { useSelector } from 'react-redux';
import { setPreviewMode } from '@/store/slices/uiSlice.js';
import { useAppDispatch } from '@/store/hooks.js';
import styles from './App.module.css';
import { getPresentation, getPreview } from '@/store/selectors.js';

function App() {
  const dispatch = useAppDispatch();
  const presentation = useSelector(getPresentation);
  const isPreviewMode = useSelector(getPreview);
  const { canUndo, canRedo, onUndo, onRedo } = useHistoryUI();
  const { exportToPdf, exportTarget, slideRefs} = usePdfExport();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const element = document.activeElement;
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || (element as HTMLElement).isContentEditable === true) {
        return;
      }

      if (e.ctrlKey && e.code === 'KeyZ') {
        e.preventDefault();
        onUndo();
        return;
      }

      if (e.ctrlKey && e.code === 'KeyY') {
        e.preventDefault();
        onRedo();
        return;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo])

  if (!presentation) return <div className={styles.noPresentation}>Загрузка...</div>

  if (isPreviewMode) {
    return <PreviewOverlay presentation={presentation} onClose={() => dispatch(setPreviewMode(false))} />;
  }

  return (
    <div className={styles.appContainer}>
      <Toolbar  
        onPreview={() => dispatch(setPreviewMode(true))}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo} 
        onExportPdf={() => exportToPdf(presentation)}
      />
      <div className={styles.mainArea}>
        <SlideList />
        <Workspace />
      </div>

      {exportTarget && (
        <div className={styles.pdfExportContainer}>
          {exportTarget.slides.map((slide) => (
            <div
              key={slide.id}
              ref={(el) => {
                if (el) slideRefs.current.set(slide.id, el);
                else slideRefs.current.delete(slide.id);
              }}
            >
              <SlidePreview slide={slide} scale={1}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { App };
