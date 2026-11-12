import type { Background } from "@/types/slide";
import { useRef, useState, useEffect, ChangeEvent } from "react";
import { clearSlideBackground, setSlideBackgroundImage, setSlideBackgroundColor, setSlideBackgroundGradient } from "@/store/slices/presentationSlice";
import { Button } from "../../UI/Button/Button";
import { TextInput } from "../../UI/TextInput/TextInput";
import styles from "./BackgroundPanel.module.css"
import { useAppDispatch } from "@/store/hooks";

interface BackgroundPanelProps {
    background: Background;
    onPreview?: (background: Background) => void;
    onPreviewEnd?: () => void;
}

function BackgroundPanel({background, onPreview, onPreviewEnd}: BackgroundPanelProps) {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const backgroundType = background?.type ?? 'none';

    const [color, setColor] = useState('#ffffff');
    const [gradientColors, setGradientColors] = useState<[string, string]>(['#ff0000', '#0000ff']);
    const [angle, setAngle] = useState(90);
    const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');

    const colorRef = useRef(color);
    const gradientColorsRef = useRef(gradientColors);
    const angleRef = useRef(angle);
    const gradientTypeRef = useRef(gradientType);
    const dirtyRef = useRef(false);

    colorRef.current = color;
    gradientColorsRef.current = gradientColors;
    angleRef.current = angle;
    gradientTypeRef.current = gradientType;

    const commitRef = useRef<() => void>(() => {});
    commitRef.current = () => {
        if (!dirtyRef.current) return;

        if (backgroundType === 'color') {
            dispatch(setSlideBackgroundColor(colorRef.current));
        } else if (backgroundType === 'gradient') {
            dispatch(setSlideBackgroundGradient({
                colors: gradientColorsRef.current,
                angle: angleRef.current,
                gradientType: gradientTypeRef.current
            }));
        }

        dirtyRef.current = false;
        onPreviewEnd?.();
    };

    useEffect(() => {
        if (background?.type === 'color') {
            setColor(background.color ?? '#ffffff');
        } else if (background?.type === 'gradient') {
            setGradientColors([
                background.colors[0] ?? '#ffffff',
                background.colors[1] ?? '#ffffff'
            ]);
            setAngle(background.angle ?? 90);
            setGradientType(background.gradientType ?? 'linear');
        }
        dirtyRef.current = false;
    }, [background]);

    useEffect(() => {
        function handleMouseUp() {
            commitRef.current();
        }
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    function handleChangeOfBackground(type: string): void {
        dirtyRef.current = false;
        onPreviewEnd?.();
        switch (type) {
            case 'none':
                dispatch(clearSlideBackground(undefined));
                break;
            case 'image':
                dispatch(setSlideBackgroundImage(''));
                break;
            case 'color':
                dispatch(setSlideBackgroundColor('#ffffff'));
                break;
            case 'gradient':
                dispatch(setSlideBackgroundGradient({
                    colors: ['#ff0000', '#0000ff'],
                    angle: 90,
                    gradientType: "linear"
                }));
                break;
        }
    }

    function handleUploadBackground(): void {
        fileInputRef.current?.click();
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        const file = e.target.files?.[0];

        if (!file) return;
        if (!allowedTypes.includes(file.type)) {
            alert('Разрешимые форматы изображений для фона: JPEG, PNG, WEBP');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                dirtyRef.current = false;
                onPreviewEnd?.();
                dispatch(setSlideBackgroundImage(reader.result));
            }
        }
        reader.readAsDataURL(file);

        e.target.value = '';
    }

    return (
        <>
            <h3>Фон</h3>
            <select value={backgroundType} onChange={(e) => handleChangeOfBackground(e.target.value)}>
                <option value="none" disabled={backgroundType === 'none'}>Без фона</option>
                <option value="image">Картинка</option>
                <option value="color">Цвет</option>
                <option value="gradient">Градиент</option>
            </select>
            {backgroundType !== 'none' && (
                <Button
                    text="Очистить фон"
                    onClick={() => handleChangeOfBackground('none')}
                />
            )}

            {background?.type === "image" && (
                <Button
                    text="Загрузить файл фона"
                    onClick={handleUploadBackground}
                />
            )}

            {background?.type === "color" && (
                <TextInput
                    type='color'
                    value={color}
                    onChange={(nextColor) => {
                        setColor(nextColor);
                        dirtyRef.current = true;
                        onPreview?.({type: 'color', color: nextColor});
                    }}
                    onBlur={() => commitRef.current()}
                />
            )}

            {background?.type === 'gradient' && (
                <>
                    <select
                        value={gradientType}
                        onChange={(e) => {
                            const nextType = e.target.value as 'linear' | 'radial';
                            setGradientType(nextType);
                            dispatch(setSlideBackgroundGradient({
                                colors: gradientColorsRef.current,
                                angle: angleRef.current,
                                gradientType: nextType
                            }));
                            dirtyRef.current = false;
                            onPreviewEnd?.();
                        }}
                    >
                        <option value="linear">Линейный</option>
                        <option value="radial">Радиальный</option>
                    </select>
                    <TextInput
                        type="color"
                        value={gradientColors[0]}
                        onChange={(nextColor) => {
                            const next: [string, string] = [nextColor, gradientColors[1]];
                            setGradientColors(next);
                            dirtyRef.current = true;
                            onPreview?.({
                                type: 'gradient',
                                colors: next,
                                angle,
                                gradientType
                            });
                        }}
                        onBlur={() => commitRef.current()}
                    />
                    <TextInput
                        type="color"
                        value={gradientColors[1]}
                        onChange={(nextColor) => {
                            const next: [string, string] = [gradientColors[0], nextColor];
                            setGradientColors(next);
                            dirtyRef.current = true;
                            onPreview?.({
                                type: 'gradient',
                                colors: next,
                                angle,
                                gradientType
                            });
                        }}
                        onBlur={() => commitRef.current()}
                    />
                    {gradientType === "linear" && (
                        <TextInput
                            type="number"
                            value={String(angle)}
                            onChange={(value) => {
                                const nextAngle = Number(value);
                                if (Number.isNaN(nextAngle)) return;
                                setAngle(nextAngle);
                                dirtyRef.current = true;
                                onPreview?.({
                                    type: 'gradient',
                                    colors: gradientColors,
                                    angle: nextAngle,
                                    gradientType
                                });
                            }}
                            onBlur={() => commitRef.current()}
                        />
                    )}
                </>
            )}

            <input
                type="file"
                ref={fileInputRef}
                accept='image/*'
                className={styles.hidden}
                onChange={handleFileChange}
            />
        </>
    )
}

export {
    BackgroundPanel
}