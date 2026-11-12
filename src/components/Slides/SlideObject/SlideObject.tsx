import type { SlideObject as SlideObjectModel } from '@/types/objects.js';
import type { Position } from '@/hooks/useDragAndDrop.js';
import type { Size } from '@/hooks/useResize.js';
import { useState, useRef } from 'react';
import { TextInput } from '../../UI/TextInput/TextInput.js';
import { useDragAndDrop } from '@/hooks/useDragAndDrop.js';
import { useResize } from '@/hooks/useResize.js';
import styles from './SlideObject.module.css';

interface SlideObjectProps {
  object: SlideObjectModel;
  isSelected?: boolean;
  scale: number
  onTextChange?: (objectId: string, text: string) => void;
  onClick?: (e: React.MouseEvent) => void;
  onDragStart?: (objectId: string) => void;
  onDragMove?: (objectId: string, newX: number, newY: number) => void;
  onDragEnd?: () => void;
  onResizeStart?: (objectId: string) => void
  onResizeMove?: (objectId: string, newWidth: number, newHeight: number) => void
  onResizeEnd?: () => void;
}

function SlideObject({ object, isSelected = false, scale, onTextChange, onClick, onDragStart, onDragMove, onDragEnd, onResizeStart, onResizeMove, onResizeEnd }: SlideObjectProps) {
  const [isEditing, setIsEditing] = useState(false);
  const moveRef = useRef<HTMLDivElement & HTMLImageElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    if (!isSelected) return;
    onDragStart?.(object.id);
  }

  const handleDragMove = (delta: Position) => {
    if (!isSelected) return;
    const dx = delta.x / scale;
    const dy = delta.y / scale;
    onDragMove?.(object.id, dx, dy);
  }

  const handleDragEnd = () => {
    if(!isSelected) return;
    onDragEnd?.();
  }

  const handleResizeStart = () => {
    if (!isSelected) return;
    onResizeStart?.(object.id);
  }

  const handleResizeMove = (size: Size) => {
    if (!isSelected) return;
    onResizeMove?.(object.id, size.width, size.height);
  }

  const handleResizeEnd = () => {
    if (!isSelected) return;
    onResizeEnd?.();
  }

  useDragAndDrop(moveRef, handleDragMove, handleDragStart, handleDragEnd);
  useResize(resizeRef, {width: object.width, height: object.height}, scale, handleResizeMove, handleResizeStart, handleResizeEnd)

  const positionStyle = {
    left: object.x,
    top: object.y,
    width: object.width,
    height: object.height,
  };

  const resizeHandle = isSelected ? (
    <div
      ref={resizeRef}
      data-no-drag
      className={styles.resizeHandle}
    />
  ) : null

  if (object.type === 'text') {
    const textStyle = {
      ...positionStyle,
      fontFamily: object.fontFamily,
      fontSize: object.fontSize,
      color: object.fontColor,
      height: undefined,
      minHeight: object.height
    };

    if (isEditing) {
      return (
        <TextInput
          type="textarea"
          value={object.text}
          className={styles.editingInput}
          style={textStyle}
          autoFocus
          onChange={(text) => onTextChange?.(object.id, text)}
          onBlur={() => setIsEditing(false)}
        />
      );
    }

    return (
      <div
        ref={moveRef}
        className={`${styles.textObject} ${isSelected ? styles.active : ""}`}
        style={textStyle}
        onDoubleClick={() => {
          if (onTextChange) setIsEditing(true);
        }}
        onClick={onClick}
      >
        {object.text} {resizeHandle}
      </div>
    );
  }

  if (object.type === 'image') {
    return (
      <div
        ref={moveRef}
        className={`${styles.imageWrapper} ${isSelected ? styles.active : ""}`}
        style={positionStyle}
        onClick={onClick}
      >
        <img
          className={styles.imageObject}
          src={object.src}
          alt="Объект слайда"
        />
        {resizeHandle}
      </div>
    );
  }
}

export { 
    SlideObject 
}