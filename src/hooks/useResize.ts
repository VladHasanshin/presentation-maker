import { useRef, useEffect } from "react"

type Size = {
  width: number;
  height: number;
};

const MIN_SIZE = 30;

function useResize(ref: React.RefObject<HTMLElement | null>, startSize: Size, scale: number, onResizeMove: (size: Size) => void, onResizeStart?: () => void, onResizeEnd?: () => void) {
    const resizeDataRef = useRef<{
        startX: number;
        startY: number;
        startWidth: number;
        startHeight: number;
    } | null>(null);
    
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;
            e.preventDefault();

            resizeDataRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                startWidth: startSize.width,
                startHeight: startSize.height
            };

            onResizeStart?.();

            const handleMouseMove = (moveE: MouseEvent) => {
                const data = resizeDataRef.current;
                if (!data) return;

                const dx = (moveE.clientX - data.startX) / scale;
                const dy = (moveE.clientY - data.startY) / scale;

                const newWidth = Math.max(MIN_SIZE, data.startWidth + dx);
                const newHeight = Math.max(MIN_SIZE, data.startHeight + dy);

                const size: Size = {
                    width: newWidth,
                    height: newHeight
                };

                onResizeMove(size);
            }

            const handleMouseUp = () => {
                resizeDataRef.current = null;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                onResizeEnd?.();
            }
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        element.addEventListener('mousedown', handleMouseDown);
        return () => element.removeEventListener('mousedown', handleMouseDown)
    }, [ref, startSize, scale, onResizeMove, onResizeStart, onResizeEnd])
}

export {
    useResize,
}

export type {
    Size
}