import { useEffect } from "react";

type Position = {
    x: number;
    y: number;
}

function useDragAndDrop(ref: React.RefObject<HTMLElement | null>, onDragMove: (delta: Position) => void, onDragStart?: () => void, onDragEnd?: () => void){
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;

            if ((e.target as Element | null)?.closest('[data-no-drag]')) return;

            e.preventDefault();

            onDragStart?.();

            const startPos = {
                x: e.clientX,
                y: e.clientY
            }

            const handleMouseMove = (moveE: MouseEvent) => {
                moveE.preventDefault();
                onDragMove({
                    x: moveE.clientX - startPos.x,
                    y: moveE.clientY - startPos.y
                })
            }

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                onDragEnd?.();
            }

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        element.addEventListener('mousedown', handleMouseDown);

        return () => element.removeEventListener('mousedown', handleMouseDown);

    }, [ref, onDragMove, onDragStart, onDragEnd])
}

export {
    useDragAndDrop
}

export type {
    Position
}