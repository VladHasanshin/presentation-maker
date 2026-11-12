import type { Slide } from '@/types/slide.js'
import type { Background } from '@/types/slide.js';
import type { TextObject } from '@/types/objects.js';
import { BackgroundPanel } from './BackgroundPanel/BackgroundPanel.js'
import { TextStylePanel } from './TextStylePanel/TextStylePanel.js';
import { useEffect, useState } from 'react';
import styles from './SlideProperties.module.css'

interface SlidePropertiesProps {
    slide: Slide;
    selectedIds: string[];
    onBackgroundPreview?: (background: Background) => void;
    onBackgroundPreviewEnd?: () => void;
    onObjectStylePreview?: (objectId: string, fontFamily: string, fontSize: number, fontColor: string) => void;
    onObjectStyle?: (objectId: string, fontFamily: string, fontSize: number, fontColor: string) => void;
}

function SlideProperties({slide, selectedIds, onBackgroundPreview, onBackgroundPreviewEnd, onObjectStylePreview, onObjectStyle}: SlidePropertiesProps) {
    const [isBackgroundVisible, setIsBackgroundVisible] = useState(selectedIds.length === 0);
    const selectedObject = slide.slideObjects.find((obj => selectedIds.includes(obj.id)))
    const isTextSelected = selectedIds.length === 1 && selectedObject?.type === 'text';
    
    useEffect(() => {
        setIsBackgroundVisible(selectedIds.length === 0);
    }, [selectedIds])

    return (
        <div className={styles.panel}>
            {isBackgroundVisible && (
                <BackgroundPanel 
                    background={slide.background} 
                    onPreview={onBackgroundPreview}
                    onPreviewEnd={onBackgroundPreviewEnd}
                />
            )}
            {isTextSelected && selectedObject?.type === 'text' && (
                <TextStylePanel
                    object={selectedObject as TextObject}
                    onPreview={(fontFamily, fontSize, fontColor) =>
                        onObjectStylePreview?.(selectedObject.id, fontFamily, fontSize, fontColor)
                    }
                    onCommit={(fontFamily, fontSize, fontColor) =>
                        onObjectStyle?.(selectedObject.id, fontFamily, fontSize, fontColor)
                    }
                />
            )}
        </div>
    );
}

export { SlideProperties };
