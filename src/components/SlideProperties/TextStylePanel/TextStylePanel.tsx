import type { TextObject } from "../../../types/objects";
import React, { useEffect, useState, useRef } from "react";
import { TextInput } from "../../UI/TextInput/TextInput";
import { beginHistoryRecord, endHistoryRecord } from "../../../editor";

interface TextStylePanelProps {
    object: TextObject;
    onCommit: (fontFamily: string, fontSize: number, fontColor: string) => void;
    onPreview?: (fontFamily: string, fontSize: number, fontColor: string) => void;
}

const FONTS = [
    {name: 'Arial', family: 'Arial, sans-serif'},
    {name: 'Roboto', family: 'Roboto, sans-serif'},
    {name: 'Montserrat', family: 'Montserrat, sans-serif'},
    {name: 'Open Sans', family: 'Open Sans, sans-serif'},
    {name: 'Lato', family: 'Lato, sans-serif'},
    {name: 'Inter', family: 'Inter, sans-serif'},
    {name: 'Raleway', family: 'Raleway, sans-serif'},
    {name: 'Playfair Display', family: 'Playfair Display, sans-serif'},
    {name: 'Merriweather', family: 'Merriweather, sans-serif'},
    {name: 'Fira Code', family: 'Fira Code, sans-serif'},
    {name: 'Courier New', family: 'Courier New, monospace'}
];

function TextStylePanel({object, onPreview, onCommit}: TextStylePanelProps) {
    const [fontFamily, setFontFamily] = useState(object.fontFamily);
    const [fontSize, setFontSize] = useState(object.fontSize);
    const [fontColor, setFontColor] = useState(object.fontColor);

    const draftRef = useRef({fontFamily, fontSize, fontColor});
    draftRef.current = {fontFamily, fontSize, fontColor};

    useEffect(() => {
        setFontFamily(object.fontFamily);
        setFontSize(object.fontSize);
        setFontColor(object.fontColor)
    }, [object.id, object.fontFamily, object.fontSize, object.fontColor])

    function handleFontFamilyChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setFontFamily(value);
        onCommit(value, fontSize, fontColor)
    }

    function clampFontSize(value: number): number {
        return Math.min(200, Math.max(8, value));
    }

    function handleFontSizeChange(value: string) {
        const parsed = Number(value);
        if (Number.isNaN(parsed)) return;
        const clampedSize = clampFontSize(parsed);
        setFontSize(clampedSize);
        onPreview?.(fontFamily, clampedSize, fontColor);
    }

    function handleFontColorChange(value: string) {
        setFontColor(value);
        onPreview?.(fontFamily, fontSize, value);
    }

    function commitDraft() {
        const draft = draftRef.current;
        onCommit(draft.fontFamily, draft.fontSize, draft.fontColor);
    }
    
    return (
        <>
            <h3>Текстовые свойства</h3>
            <select value={fontFamily} onChange={handleFontFamilyChange}>
                {FONTS.map((font) => (
                    <option key={font.name} value={font.family}>{font.name}</option>
                ))}
            </select>
            <TextInput
                type="number"
                value={String(fontSize)}
                onChange={handleFontSizeChange}
                onBlur={commitDraft}
            />
            <TextInput
                type="color"
                value={fontColor}
                onChange={handleFontColorChange}
                onBlur={commitDraft}
            />
        </>
    )
}

export {
    TextStylePanel
}