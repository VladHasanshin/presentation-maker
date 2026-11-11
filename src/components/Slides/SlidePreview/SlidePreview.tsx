import type { Position } from '../../../hooks/useDragAndDrop.js';
import type { Slide, Background } from '../../../types/slide.js';
import { SlideObject } from '../SlideObject/SlideObject.js';
import { useEffect, useRef, useState } from 'react';
import styles from './SlidePreview.module.css';
import type { Size } from '../../../hooks/useResize.js';
import { MoveObjectParams, ResizeObjectParams } from '../../../types/objects.js';

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;
const MIN_SIZE = 30;

interface SlidePreviewProps {
  selectedIds?: string[];
  slide: Slide;
  scale?: number;
  onTextChange?: (objectId: string, text: string) => void;
  onObjectClick?: (objectId: string, shiftKey: boolean) => void;
  onEmptyClick?: () => void;
  onObjectsMove?: (updates: MoveObjectParams[]) => void;
  onObjectsResize?: (updates: ResizeObjectParams[]) => void
}

function getBackgroundStyle(background: Background) {
  if (!background || !background.type) {
    return { backgroundColor: '#ffffff'};
  }
  
  switch (background.type) {
    case 'color':
      return { backgroundColor: background.color };
    
    case 'image':
      return {
        backgroundImage: `url(${background.src})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      };
    
    case 'gradient': {
      const colors = background.colors?.length ? background.colors : ['#ffffff', '#ffffff'];
      const type = background.gradientType ?? 'linear';
      if (type === 'linear') {
        return {
          backgroundImage: `linear-gradient(${background.angle ?? 90}deg, ${colors.join(', ')})`,
        };
      }

      return {
        backgroundImage: `radial-gradient(circle, ${colors.join(', ')})`,
      };
    }
      
    default:
      return { backgroundColor: '#ffffff' };
  }
}

function SlidePreview({ slide, scale = 1, selectedIds = [], onTextChange, onObjectClick, onEmptyClick, onObjectsMove, onObjectsResize }: SlidePreviewProps) {

  const startPosRef = useRef<Map<string, Position>>(new Map());
  const startSizeRef = useRef<Map<string, Size>>(new Map());

  const temporaryPosRef = useRef<Map<string, Position> | null>(null);
  const temporarySizeRef = useRef<Map<string, Size> | null>(null);
  const [temporaryPositions, setTemporaryPositions] = useState<Map<string, Position> | null>(null);
  const [temporarySizes, setTemporarySizes] = useState<Map<string, Size> | null>(null);

  useEffect(() => {
    startPosRef.current = new Map();
    startSizeRef.current = new Map();
    temporaryPosRef.current = null;
    temporarySizeRef.current = null;
    setTemporaryPositions(null);
    setTemporarySizes(null);
  }, [slide.id]);

  function handleSlideClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
        onEmptyClick?.();
    }
}

  function handleObjectResizeStart(objectId: string) {
    if (!selectedIds.includes(objectId)) return;

    const sizes = new Map<string, Size>();

    for (const id of selectedIds) {
      const object = slide.slideObjects.find((obj) => obj.id === id);
      if (object) {
        sizes.set(id, {width: object.width, height: object.height});
      }
    }

    startSizeRef.current = sizes;
    temporarySizeRef.current = new Map(sizes);
    setTemporarySizes(new Map(sizes));
  }

  function handleObjectResizeMove(objectId: string, newWidth: number, newHeight: number) {
    const start = startSizeRef.current.get(objectId);
    if (!start) return;

    const scaleX = newWidth / start.width;
    const scaleY = newHeight / start.height;

    const next = new Map<string, Size>();

    for (const [id, s] of startSizeRef.current) {
      next.set(
        id, 
        {
          width: Math.max(MIN_SIZE, s.width * scaleX),
          height: Math.max(MIN_SIZE, s.height * scaleY)
        }
      )
    }

    temporarySizeRef.current = next;
    setTemporarySizes(next);
  }

  function handleObjectResizeEnd() {
    const sizes = temporarySizeRef.current;
    if (!sizes) return;

    const updates: ResizeObjectParams[] = [];

    for (const [id, size] of sizes) {
      const start = startSizeRef.current.get(id);
      if (!start) continue;
      if (start.width !== size.width || start.height !== size.height) {
        updates.push({objectId: id, newWidth: size.width, newHeight: size.height})
      }
    }
    
    if (updates.length > 0) {
      onObjectsResize?.(updates);
    }

    temporarySizeRef.current = null;
    startSizeRef.current = new Map();
    setTemporarySizes(null);
  }

  function handleObjectDragStart(objectId: string){
    if (!selectedIds.includes(objectId)) return;

    const positions = new Map<string, Position>();

    for (const id of selectedIds) {
      const object = slide.slideObjects.find((obj) => obj.id === id);
      if (object) {
        positions.set(id, {x: object.x, y: object.y});
      }
    }

    startPosRef.current = positions;
    temporaryPosRef.current = new Map(positions);
    setTemporaryPositions(new Map(positions));
  }

  function handleObjectDragMove(objectId: string, dx: number, dy: number){
    if (!selectedIds.includes(objectId)) return;

    const next = new Map<string, Position>();

    for (const [id, start] of startPosRef.current) {
      next.set(id, {x: start.x + dx, y: start.y + dy})
    }

    temporaryPosRef.current = next;
    setTemporaryPositions(next);
  }

  function handleObjectDragEnd() {
    const positions = temporaryPosRef.current;
    if (!positions) return;

    const updates: MoveObjectParams[] = [];

    for (const [id, pos] of positions) {
      const start = startPosRef.current.get(id);
      if (!start) continue;
      if (start.x !== pos.x || start.y !== pos.y) {
        updates.push({objectId: id, newX: pos.x, newY: pos.y});
      }
    }

    if (updates.length > 0) {
      onObjectsMove?.(updates);
    }

    temporaryPosRef.current = null;
    startPosRef.current = new Map();
    setTemporaryPositions(null);
  }

  const renderedObjects = slide.slideObjects.map((object) => {
    const pos = temporaryPositions?.get(object.id);
    const size = temporarySizes?.get(object.id);
    if (!pos && !size) return object;

    return {
      ...object,
      x: pos?.x ?? object.x,
      y: pos?.y ?? object.y,
      width: size?.width ?? object.width,
      height: size?.height ?? object.height
    };
  })

  return (
    <div
      className={styles.frame}
      style={{ width: SLIDE_WIDTH * scale, height: SLIDE_HEIGHT * scale }}
    >
      <div
        className={styles.slide}
        style={{
          ...getBackgroundStyle(slide.background),
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        onClick={handleSlideClick}
      >
        {renderedObjects.map((object) => (
         <SlideObject
            key={object.id}
            object={object}
            isSelected={selectedIds.includes(object.id)}
            scale={scale}
            onTextChange={onTextChange}
            onClick={(e) => onObjectClick?.(object.id, e.shiftKey)}
            onDragStart={handleObjectDragStart}
            onDragMove={handleObjectDragMove}
            onDragEnd={handleObjectDragEnd}
            onResizeStart={handleObjectResizeStart}
            onResizeMove={handleObjectResizeMove}
            onResizeEnd={handleObjectResizeEnd}
          />
        ))}
      </div>
    </div>
  );
}

export { SlidePreview };