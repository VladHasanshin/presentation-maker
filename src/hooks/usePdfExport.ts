import type { Presentation } from '../types/presentation';
import { useCallback, useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

function usePdfExport() {
    const [exportTarget, setExportTarget] = useState<Presentation | null>(null);
    const slideRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const exportToPdf = useCallback((presentation: Presentation) => {
        setExportTarget(presentation);
    }, []);

    useEffect(() => {
        if (!exportTarget) return;

        async function generate() {
            const pdf = new jsPDF({orientation: 'landscape', unit: 'px', format: [SLIDE_WIDTH, SLIDE_HEIGHT]});

            for (let i = 0; i < exportTarget!.slides.length; i++) {
                const slide = exportTarget!.slides[i];
                const node = slideRefs.current.get(slide.id);

                if (!node) continue;

                const canvas = await html2canvas(node, {scale: 2});
                const imgData = canvas.toDataURL('image/png');

                if (i > 0) {
                    pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], 'landscape');
                }

                pdf.addImage(imgData, 'PNG', 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
            }

            pdf.save(`${exportTarget!.name}.pdf`);
            setExportTarget(null);
        }

        generate();
    }, [exportTarget]);

    return { exportToPdf, exportTarget, slideRefs };
}

export {
    usePdfExport
}