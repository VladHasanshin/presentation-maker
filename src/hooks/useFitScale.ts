import { useState, useEffect, useRef } from "react";

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

function useFitScale() {
    const ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            const { width, height } = entry.contentRect;
            if (width === 0 || height === 0) return;
            const areaScale = Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT)
            setScale(areaScale);
        })

        observer.observe(element);

        return () => {
            observer.disconnect();
        }
    }, []);

    return {ref, scale}
}

export {
    useFitScale
}